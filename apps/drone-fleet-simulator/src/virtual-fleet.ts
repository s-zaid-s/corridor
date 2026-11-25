import {
  Geometry4D,
  type ClearanceAck,
  type DroneFlightState,
  type DroneId,
  type DroneProfile,
  type DroneTelemetry,
  type SectorId,
  type SignedFlightClearance,
  type Vec3M,
  type Waypoint4D
} from "@corridor/domain-core";
import type { FlightClearanceSigner } from "@corridor/crypto-auth";

interface VirtualDroneState {
  readonly profile: DroneProfile;
  pos: Vec3M;
  velMps: Vec3M;
  batteryPct: number;
  state: DroneFlightState;
  activeWaypoints: readonly Waypoint4D[];
  sequenceNumber: number;
  isSpoofingGps: boolean;
  isLinkLost: boolean;
}

const SECTORS: readonly SectorId[] = ["LDN-CORE", "MCR-NORTH", "BRS-WEST", "EDI-EAST"];

/**
 * Deterministic autonomous drone fleet simulator supporting Ed25519 clearance verification,
 * 4D waypoint navigation, and GPS-spoofing / link-loss fault injection.
 */
export class VirtualDroneFleet {
  private readonly drones: Map<DroneId, VirtualDroneState> = new Map();
  private readonly signer: FlightClearanceSigner;

  public constructor(
    signer: FlightClearanceSigner,
    options: { fleetSize: number; spoofRate?: number; linkLossRate?: number }
  ) {
    this.signer = signer;
    const spoofRate = options.spoofRate ?? 0.03;
    const linkLossRate = options.linkLossRate ?? 0.01;

    for (let i = 0; i < options.fleetSize; i++) {
      const sectorId = SECTORS[i % SECTORS.length]!;
      const droneId = `uav_${sectorId.toLowerCase()}_${String(i).padStart(5, "0")}`;
      const profile: DroneProfile = {
        droneId,
        operatorId: `op_${(i % 10) + 1}`,
        sectorId,
        maxHorizontalSpeedMps: 22,
        maxClimbRateMps: 6,
        batteryCapacityWh: 450,
        cruisePowerW: 320,
        minReserveBatteryPct: 20
      };

      const frac = ((i * 2654435761) >>> 0) / 0xffffffff;
      this.drones.set(droneId, {
        profile,
        pos: { x: (i % 40) * 150, y: Math.floor(i / 40) * 150, z: 0 },
        velMps: { x: 0, y: 0, z: 0 },
        batteryPct: 75 + (i % 25),
        state: "GROUNDED",
        activeWaypoints: [],
        sequenceNumber: 0,
        isSpoofingGps: frac < spoofRate,
        isLinkLost: frac >= spoofRate && frac < spoofRate + linkLossRate
      });
    }
  }

  public getProfiles(): DroneProfile[] {
    return [...this.drones.values()].map((d) => d.profile);
  }

  public handleClearance(clearance: SignedFlightClearance, nowMs: number = Date.now()): ClearanceAck {
    const d = this.drones.get(clearance.droneId);
    if (!d || d.isLinkLost) {
      return {
        clearanceId: clearance.clearanceId,
        flightPlanId: clearance.flightPlanId,
        droneId: clearance.droneId,
        accepted: false,
        reason: "DRONE_LINK_LOST",
        timestampMs: nowMs
      };
    }

    const check = this.signer.verifyClearance(clearance, nowMs, true);
    if (!check.valid) {
      return {
        clearanceId: clearance.clearanceId,
        flightPlanId: clearance.flightPlanId,
        droneId: clearance.droneId,
        accepted: false,
        reason: check.reason ?? "INVALID_SIGNATURE",
        timestampMs: nowMs
      };
    }

    if (clearance.action === "CLEARED_TO_FLY" || clearance.action === "REROUTE") {
      d.activeWaypoints = clearance.waypoints;
      d.state = clearance.action === "REROUTE" ? "REROUTING" : "CRUISING";
    } else if (clearance.action === "HOLD_POSITION") {
      d.state = "HOLDING";
      d.velMps = { x: 0, y: 0, z: 0 };
    } else {
      d.state = "EMERGENCY_RTL";
      d.activeWaypoints = [];
    }

    return {
      clearanceId: clearance.clearanceId,
      flightPlanId: clearance.flightPlanId,
      droneId: clearance.droneId,
      accepted: true,
      timestampMs: nowMs
    };
  }

  public tick(stepSec: number, nowMs: number = Date.now()): DroneTelemetry[] {
    const frames: DroneTelemetry[] = [];

    for (const d of this.drones.values()) {
      if (d.isLinkLost) continue;

      const prevPos = d.pos;
      if ((d.state === "CRUISING" || d.state === "REROUTING") && d.activeWaypoints.length >= 2) {
        const nextPos = Geometry4D.interpolatePosition(d.activeWaypoints, nowMs);
        d.velMps = {
          x: (nextPos.x - prevPos.x) / Math.max(1, stepSec),
          y: (nextPos.y - prevPos.y) / Math.max(1, stepSec),
          z: (nextPos.z - prevPos.z) / Math.max(1, stepSec)
        };
        d.pos = nextPos;

        const usedWh = (d.profile.cruisePowerW * stepSec) / 3600;
        d.batteryPct = Math.max(0, d.batteryPct - (usedWh / d.profile.batteryCapacityWh) * 100);
      }

      d.sequenceNumber++;

      // Adversarial GPS spoofing: jump +500m altitude above legal 120m AGL ceiling
      const reportedPos: Vec3M = d.isSpoofingGps
        ? { x: d.pos.x + 1200, y: d.pos.y, z: 240 }
        : d.pos;

      frames.push({
        droneId: d.profile.droneId,
        operatorId: d.profile.operatorId,
        sectorId: d.profile.sectorId,
        timestampMs: nowMs,
        pos: reportedPos,
        velMps: d.velMps,
        batteryPct: Number(d.batteryPct.toFixed(2)),
        state: d.state,
        sequenceNumber: d.sequenceNumber
      });
    }

    return frames;
  }
}
