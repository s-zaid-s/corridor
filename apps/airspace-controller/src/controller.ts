import { randomUUID } from "node:crypto";
import {
  FlightPhysicsModel,
  type ClearanceAck,
  type DroneId,
  type DroneProfile,
  type FlightPlanRequest,
  type ReservationToken,
  type SectorId,
  type SignedFlightClearance
} from "@corridor/domain-core";
import type { FlightClearanceSigner } from "@corridor/crypto-auth";
import type { FlightClearedEvent, PartitionedEventBroker } from "@corridor/event-bus";
import type { SpatialVoxelGrid4D } from "@corridor/spatial-index";
import type { CorridorLeaseManager } from "@corridor/corridor-lock";

export interface CorridorReservationResponse {
  readonly reserved: boolean;
  readonly token?: ReservationToken;
  readonly fencingToken?: number;
  readonly voxelCount: number;
  readonly preemptedTokens: readonly ReservationToken[];
  readonly reason?: string;
}

/**
 * Core UTM Airspace Controller: rasterizes 4D flight trajectories into voxels,
 * acquires atomic conflict-free corridor leases, and issues Ed25519-signed clearances.
 */
export class AirspaceController {
  private readonly broker: PartitionedEventBroker;
  private readonly spatialIndex: SpatialVoxelGrid4D;
  private readonly leaseManager: CorridorLeaseManager;
  private readonly signer: FlightClearanceSigner;
  private readonly clearanceSink: (c: SignedFlightClearance) => ClearanceAck;

  private readonly profiles: Map<DroneId, DroneProfile> = new Map();
  private readonly quarantined: Set<DroneId> = new Set();

  public constructor(params: {
    broker: PartitionedEventBroker;
    spatialIndex: SpatialVoxelGrid4D;
    leaseManager: CorridorLeaseManager;
    signer: FlightClearanceSigner;
    profiles: readonly DroneProfile[];
    clearanceSink: (c: SignedFlightClearance) => ClearanceAck;
  }) {
    this.broker = params.broker;
    this.spatialIndex = params.spatialIndex;
    this.leaseManager = params.leaseManager;
    this.signer = params.signer;
    this.clearanceSink = params.clearanceSink;

    for (const p of params.profiles) {
      this.profiles.set(p.droneId, p);
    }

    this.broker.subscribe("security.spoof.alerts", "airspace-controller-v1", (env) => {
      if (env.payload.quarantineApplied) {
        this.quarantined.add(env.payload.droneId);
      }
    });

    this.broker.subscribe("airspace.flight.cleared", "airspace-controller-v1", async (env) => {
      await this.dispatchSignedClearance(env.payload);
    });
  }

  public reserveFlightCorridor(req: FlightPlanRequest): CorridorReservationResponse {
    if (this.quarantined.has(req.droneId)) {
      return { reserved: false, voxelCount: 0, preemptedTokens: [], reason: "DRONE_QUARANTINED" };
    }

    const profile = this.profiles.get(req.droneId);
    if (!profile) {
      return { reserved: false, voxelCount: 0, preemptedTokens: [], reason: "UNKNOWN_DRONE" };
    }

    const kin = FlightPhysicsModel.validateWaypointKinematics(profile, req.waypoints);
    if (!kin.valid) {
      return { reserved: false, voxelCount: 0, preemptedTokens: [], reason: kin.reason ?? "INVALID_KINEMATICS" };
    }

    const voxels = this.spatialIndex.rasterizeFlightPlan(req.sectorId, req.waypoints);
    if (voxels.length === 0) {
      return { reserved: false, voxelCount: 0, preemptedTokens: [], reason: "EMPTY_TRAJECTORY" };
    }

    const durationMs = Math.max(
      60_000,
      req.waypoints[req.waypoints.length - 1]!.etaMs - req.waypoints[0]!.etaMs + 30_000
    );

    const lease = this.leaseManager.acquireCorridor(voxels, req.priority, durationMs);
    if (!lease.acquired || !lease.token || lease.fencingToken === undefined) {
      return {
        reserved: false,
        voxelCount: 0,
        preemptedTokens: [],
        reason: `AIRSPACE_CONFLICT: ${lease.conflictedVoxels.length} voxels occupied`
      };
    }

    return {
      reserved: true,
      token: lease.token,
      fencingToken: lease.fencingToken,
      voxelCount: lease.lockedVoxels.length,
      preemptedTokens: lease.preemptedTokens
    };
  }

  public releaseCorridor(token: ReservationToken): number {
    return this.leaseManager.releaseCorridor(token);
  }

  private async dispatchSignedClearance(event: FlightClearedEvent): Promise<void> {
    if (!this.leaseManager.validateReservation(event.reservationToken)) return;

    const nowMs = Date.now();
    const expiresAtMs =
      event.waypoints.length > 0
        ? event.waypoints[event.waypoints.length - 1]!.etaMs + 60_000
        : nowMs + 300_000;

    const signed = this.signer.signClearance({
      clearanceId: `clr_${randomUUID()}`,
      flightPlanId: event.flightPlanId,
      droneId: event.droneId,
      sectorId: event.sectorId,
      action: "CLEARED_TO_FLY",
      waypoints: event.waypoints,
      issuedAtMs: nowMs,
      expiresAtMs,
      fencingToken: event.fencingToken
    });

    await this.broker.publish("airspace.clearances", event.sectorId, signed);
    const ack = this.clearanceSink(signed);
    await this.broker.publish("airspace.clearance.acks", event.sectorId, ack);
  }

  public getSectorStatus(sectorId: SectorId): {
    sectorId: SectorId;
    activeConflicts: number;
    activeLockedVoxels: number;
    quarantinedDrones: number;
  } {
    return {
      sectorId,
      activeConflicts: this.spatialIndex.detectSectorConflicts(sectorId).length,
      activeLockedVoxels: this.leaseManager.activeVoxelCount(),
      quarantinedDrones: this.quarantined.size
    };
  }
}
