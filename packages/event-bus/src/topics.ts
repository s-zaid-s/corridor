import type {
  DroneTelemetry,
  SpoofAlert,
  SignedFlightClearance,
  ClearanceAck,
  FlightCompletedEvent,
  FlightPlanId,
  DroneId,
  SectorId,
  ReservationToken,
  Waypoint4D
} from "@corridor/domain-core";

export interface FlightClearedEvent {
  readonly flightPlanId: FlightPlanId;
  readonly droneId: DroneId;
  readonly sectorId: SectorId;
  readonly reservationToken: ReservationToken;
  readonly fencingToken: number;
  readonly waypoints: readonly Waypoint4D[];
  readonly clearedAtMs: number;
}

export interface BillingSettledEvent {
  readonly flightPlanId: FlightPlanId;
  readonly journalEntryId: string;
  readonly tollChargedMicro: bigint;
  readonly penaltyChargedMicro: bigint;
  readonly settledAtMs: number;
}

export interface TopicPayloadMap {
  "telemetry.position": DroneTelemetry;
  "security.spoof.alerts": SpoofAlert;
  "airspace.flight.cleared": FlightClearedEvent;
  "airspace.clearances": SignedFlightClearance;
  "airspace.clearance.acks": ClearanceAck;
  "airspace.flight.completed": FlightCompletedEvent;
  "billing.settled": BillingSettledEvent;
}

export type TopicName = keyof TopicPayloadMap;

export interface EventEnvelope<T extends TopicName = TopicName> {
  readonly eventId: string;
  readonly topic: T;
  readonly partition: number;
  readonly offset: number;
  readonly key: string;
  readonly timestampMs: number;
  readonly traceId: string;
  readonly payload: TopicPayloadMap[T];
}

export interface DeadLetterRecord {
  readonly originalTopic: TopicName;
  readonly originalEvent: EventEnvelope;
  readonly consumerGroup: string;
  readonly errorMessage: string;
  readonly attempts: number;
  readonly failedAtMs: number;
}
