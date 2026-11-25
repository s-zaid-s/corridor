import { randomUUID } from "node:crypto";
import {
  Geometry4D,
  type DroneId,
  type DroneProfile,
  type DroneTelemetry,
  type SpoofAlert
} from "@corridor/domain-core";
import type { PartitionedEventBroker } from "@corridor/event-bus";

/**
 * Real-time kinematic anomaly & GPS-spoofing detector.
 * Flags impossible horizontal teleportation, climb-rate violations, and 120m AGL ceiling breaches.
 */
export class KinematicSpoofDetector {
  private readonly broker: PartitionedEventBroker;
  private readonly profiles: Map<DroneId, DroneProfile> = new Map();
  private readonly lastFrames: Map<DroneId, DroneTelemetry> = new Map();
  private readonly quarantined: Set<DroneId> = new Set();
  private readonly alerts: SpoofAlert[] = [];
  private readonly legalCeilingMeters = 120;

  public constructor(broker: PartitionedEventBroker, profiles: readonly DroneProfile[]) {
    this.broker = broker;
    for (const p of profiles) {
      this.profiles.set(p.droneId, p);
    }

    this.broker.subscribe("telemetry.position", "spoof-detector-v1", async (env) => {
      await this.evaluate(env.payload);
    });
  }

  public async evaluate(frame: DroneTelemetry): Promise<SpoofAlert | null> {
    const profile = this.profiles.get(frame.droneId);
    if (!profile) return null;

    let rule: SpoofAlert["ruleTriggered"] | null = null;
    let details = "";

    // Rule 1: Urban UTM 120m AGL legal altitude ceiling
    if (frame.pos.z > this.legalCeilingMeters) {
      rule = "ALTITUDE_CEILING";
      details = `Reported altitude ${frame.pos.z}m exceeds legal ${this.legalCeilingMeters}m AGL ceiling`;
    }

    // Rule 2: Kinematic GPS teleportation / impossible climb check
    const prev = this.lastFrames.get(frame.droneId);
    if (!rule && prev) {
      const dtSec = Math.max(0.5, (frame.timestampMs - prev.timestampMs) / 1000);
      const horizSpeed = Geometry4D.horizontalDistance(prev.pos, frame.pos) / dtSec;
      const climbRate = Math.abs(frame.pos.z - prev.pos.z) / dtSec;

      if (horizSpeed > profile.maxHorizontalSpeedMps * 1.5) {
        rule = "GPS_TELEPORT";
        details = `Implied speed ${horizSpeed.toFixed(1)}m/s exceeds physical limit ${profile.maxHorizontalSpeedMps}m/s`;
      } else if (climbRate > profile.maxClimbRateMps * 1.5) {
        rule = "IMPOSSIBLE_CLIMB";
        details = `Implied climb ${climbRate.toFixed(1)}m/s exceeds limit ${profile.maxClimbRateMps}m/s`;
      }
    }

    this.lastFrames.set(frame.droneId, frame);

    if (rule) {
      this.quarantined.add(frame.droneId);
      const alert: SpoofAlert = {
        alertId: randomUUID(),
        droneId: frame.droneId,
        sectorId: frame.sectorId,
        timestampMs: frame.timestampMs,
        ruleTriggered: rule,
        severity: "CRITICAL",
        details,
        quarantineApplied: true
      };
      this.alerts.push(alert);
      await this.broker.publish("security.spoof.alerts", frame.sectorId, alert);
      return alert;
    }

    return null;
  }

  public isQuarantined(droneId: DroneId): boolean {
    return this.quarantined.has(droneId);
  }

  public getQuarantinedDrones(): readonly DroneId[] {
    return [...this.quarantined];
  }

  public getAlerts(): readonly SpoofAlert[] {
    return this.alerts;
  }
}
