import { generateKeyPairSync, sign, verify, randomBytes, type KeyObject } from "node:crypto";
import type { SignedFlightClearance } from "@corridor/domain-core";

export interface KeyPairBundle {
  readonly publicKey: KeyObject;
  readonly privateKey: KeyObject;
}

/**
 * Ed25519 asymmetric flight-clearance signer with replay-nonce protection.
 * Ensures autonomous drones only obey authentic, unexpired UTM clearances.
 */
export class FlightClearanceSigner {
  private readonly privateKey: KeyObject;
  private readonly publicKey: KeyObject;
  private readonly seenNonces: Map<string, number> = new Map();
  private readonly maxClockSkewMs: number;

  public constructor(keys?: KeyPairBundle, maxClockSkewMs = 15_000) {
    if (keys) {
      this.privateKey = keys.privateKey;
      this.publicKey = keys.publicKey;
    } else {
      const pair = generateKeyPairSync("ed25519");
      this.privateKey = pair.privateKey;
      this.publicKey = pair.publicKey;
    }
    this.maxClockSkewMs = maxClockSkewMs;
  }

  public getPublicKey(): KeyObject {
    return this.publicKey;
  }

  private static canonicalPayload(c: Omit<SignedFlightClearance, "signatureHex">): Buffer {
    const wpStr = c.waypoints
      .map((w) => `${w.pos.x.toFixed(1)},${w.pos.y.toFixed(1)},${w.pos.z.toFixed(1)}@${w.etaMs}`)
      .join(";");
    const raw = [
      c.clearanceId,
      c.flightPlanId,
      c.droneId,
      c.sectorId,
      c.action,
      wpStr,
      c.issuedAtMs.toString(),
      c.expiresAtMs.toString(),
      c.fencingToken.toString(),
      c.nonce
    ].join("|");
    return Buffer.from(raw, "utf8");
  }

  public signClearance(
    unsigned: Omit<SignedFlightClearance, "signatureHex" | "nonce">
  ): SignedFlightClearance {
    const nonce = randomBytes(12).toString("hex");
    const withNonce = { ...unsigned, nonce };
    const payload = FlightClearanceSigner.canonicalPayload(withNonce);
    const sig = sign(null, payload, this.privateKey);
    return { ...withNonce, signatureHex: sig.toString("hex") };
  }

  public verifyClearance(
    clearance: SignedFlightClearance,
    nowMs: number = Date.now(),
    enforceReplay = true
  ): { valid: boolean; reason?: string } {
    if (nowMs > clearance.expiresAtMs + this.maxClockSkewMs) {
      return { valid: false, reason: "CLEARANCE_EXPIRED" };
    }
    if (clearance.issuedAtMs > nowMs + this.maxClockSkewMs) {
      return { valid: false, reason: "CLEARANCE_FUTURE_TIMESTAMP" };
    }

    const { signatureHex, ...rest } = clearance;
    const payload = FlightClearanceSigner.canonicalPayload(rest);
    const ok = verify(null, payload, this.publicKey, Buffer.from(signatureHex, "hex"));
    if (!ok) {
      return { valid: false, reason: "INVALID_ED25519_SIGNATURE" };
    }

    if (enforceReplay) {
      if (this.seenNonces.size > 20_000) {
        for (const [n, exp] of this.seenNonces.entries()) {
          if (exp < nowMs) this.seenNonces.delete(n);
        }
      }
      if (this.seenNonces.has(clearance.nonce)) {
        return { valid: false, reason: "REPLAY_NONCE_DETECTED" };
      }
      this.seenNonces.set(clearance.nonce, clearance.expiresAtMs);
    }

    return { valid: true };
  }
}
