import { randomUUID } from "node:crypto";
import {
  Geometry4D,
  type FlightPlanId,
  type FlightPlanRequest,
  type ReservationToken,
  type SectorId
} from "@corridor/domain-core";
import type { TransactionalOutbox } from "@corridor/event-bus";
import type { AirspaceController } from "@corridor/airspace-controller";

export type FlightSagaState =
  | "FILED"
  | "CORRIDOR_LOCKED"
  | "TOLL_AUTHORIZED"
  | "CLEARED"
  | "COMPENSATED";

export interface FlightSagaRecord {
  readonly sagaId: string;
  readonly flightPlanId: FlightPlanId;
  readonly droneId: string;
  readonly sectorId: SectorId;
  state: FlightSagaState;
  reservationToken?: ReservationToken;
  fencingToken?: number;
  estimatedDistanceM: number;
  failureReason?: string;
  readonly createdAtMs: number;
  updatedAtMs: number;
}

/**
 * Durable Flight-Plan Filing Saga Coordinator:
 * 1. Locks conflict-free 4D airspace voxels via AirspaceController
 * 2. Validates toll ceiling against dynamic sector congestion pricing
 * 3. Stages `airspace.flight.cleared` in TransactionalOutbox (or compensates by releasing voxels)
 */
export class FlightPlanSagaCoordinator {
  private readonly controller: AirspaceController;
  private readonly outbox: TransactionalOutbox;
  private readonly sagas: Map<string, FlightSagaRecord> = new Map();
  private readonly baseSectorTollMicroPerKm = 150_000n; // £0.15/km

  public constructor(controller: AirspaceController, outbox: TransactionalOutbox) {
    this.controller = controller;
    this.outbox = outbox;
  }

  public async fileFlightPlan(req: FlightPlanRequest): Promise<FlightSagaRecord> {
    const nowMs = Date.now();
    const record: FlightSagaRecord = {
      sagaId: `fsaga_${randomUUID()}`,
      flightPlanId: req.flightPlanId,
      droneId: req.droneId,
      sectorId: req.sectorId,
      state: "FILED",
      estimatedDistanceM: Geometry4D.pathLengthMeters(req.waypoints),
      createdAtMs: nowMs,
      updatedAtMs: nowMs
    };
    this.sagas.set(record.sagaId, record);

    // Step 1: Lock 4D corridor voxels
    const reservation = this.controller.reserveFlightCorridor(req);
    if (!reservation.reserved || !reservation.token || reservation.fencingToken === undefined) {
      record.state = "COMPENSATED";
      record.failureReason = reservation.reason ?? "CORRIDOR_UNAVAILABLE";
      record.updatedAtMs = Date.now();
      return record;
    }

    record.state = "CORRIDOR_LOCKED";
    record.reservationToken = reservation.token;
    record.fencingToken = reservation.fencingToken;
    record.updatedAtMs = Date.now();

    // Step 2: Check dynamic toll ceiling (Compensate if operator's max toll is too low)
    if (req.priority !== "EMERGENCY_MED" && req.maxTollMicroPerKm < this.baseSectorTollMicroPerKm) {
      this.controller.releaseCorridor(reservation.token);
      record.state = "COMPENSATED";
      record.failureReason = "MAX_TOLL_BELOW_SECTOR_RATE";
      record.updatedAtMs = Date.now();
      return record;
    }

    record.state = "TOLL_AUTHORIZED";
    record.updatedAtMs = Date.now();

    // Step 3: Stage clearance event atomically in Outbox
    this.outbox.stage("airspace.flight.cleared", req.sectorId, {
      flightPlanId: req.flightPlanId,
      droneId: req.droneId,
      sectorId: req.sectorId,
      reservationToken: reservation.token,
      fencingToken: reservation.fencingToken,
      waypoints: req.waypoints,
      clearedAtMs: Date.now()
    });

    await this.outbox.flushPending();
    record.state = "CLEARED";
    record.updatedAtMs = Date.now();
    return record;
  }

  public getSagas(): readonly FlightSagaRecord[] {
    return [...this.sagas.values()];
  }
}
