export type SectorId = "LDN-CORE" | "MCR-NORTH" | "BRS-WEST" | "EDI-EAST";
export type DroneId = string;
export type OperatorId = string;
export type FlightPlanId = string;
export type ClearanceId = string;
export type ReservationToken = string;
export type VoxelKey = string;

export type FlightPriority = "EMERGENCY_MED" | "COMMERCIAL_CARGO" | "INSPECTION" | "RECREATIONAL";
export type DroneFlightState = "GROUNDED" | "CRUISING" | "HOLDING" | "REROUTING" | "EMERGENCY_RTL" | "QUARANTINED";

export interface Vec3M {
  readonly x: number; // East meters from sector origin
  readonly y: number; // North meters from sector origin
  readonly z: number; // Altitude meters AGL (Above Ground Level)
}

export interface Waypoint4D {
  readonly pos: Vec3M;
  readonly etaMs: number;
}

export interface DroneProfile {
  readonly droneId: DroneId;
  readonly operatorId: OperatorId;
  readonly sectorId: SectorId;
  readonly maxHorizontalSpeedMps: number;
  readonly maxClimbRateMps: number;
  readonly batteryCapacityWh: number;
  readonly cruisePowerW: number;
  readonly minReserveBatteryPct: number;
}

export interface DroneTelemetry {
  readonly droneId: DroneId;
  readonly operatorId: OperatorId;
  readonly sectorId: SectorId;
  readonly timestampMs: number;
  readonly pos: Vec3M;
  readonly velMps: Vec3M;
  readonly batteryPct: number;
  readonly state: DroneFlightState;
  readonly sequenceNumber: number;
}

export interface FlightPlanRequest {
  readonly flightPlanId: FlightPlanId;
  readonly droneId: DroneId;
  readonly operatorId: OperatorId;
  readonly sectorId: SectorId;
  readonly priority: FlightPriority;
  readonly waypoints: readonly Waypoint4D[];
  readonly maxTollMicroPerKm: bigint;
}

export interface SignedFlightClearance {
  readonly clearanceId: ClearanceId;
  readonly flightPlanId: FlightPlanId;
  readonly droneId: DroneId;
  readonly sectorId: SectorId;
  readonly action: "CLEARED_TO_FLY" | "HOLD_POSITION" | "REROUTE" | "EMERGENCY_LAND";
  readonly waypoints: readonly Waypoint4D[];
  readonly issuedAtMs: number;
  readonly expiresAtMs: number;
  readonly fencingToken: number;
  readonly nonce: string;
  readonly signatureHex: string;
}

export interface ClearanceAck {
  readonly clearanceId: ClearanceId;
  readonly flightPlanId: FlightPlanId;
  readonly droneId: DroneId;
  readonly accepted: boolean;
  readonly reason?: string;
  readonly timestampMs: number;
}

export interface SpoofAlert {
  readonly alertId: string;
  readonly droneId: DroneId;
  readonly sectorId: SectorId;
  readonly timestampMs: number;
  readonly ruleTriggered: "GPS_TELEPORT" | "IMPOSSIBLE_CLIMB" | "GEOFENCE_BREACH" | "ALTITUDE_CEILING";
  readonly severity: "WARN" | "CRITICAL";
  readonly details: string;
  readonly quarantineApplied: boolean;
}

export interface FlightCompletedEvent {
  readonly flightPlanId: FlightPlanId;
  readonly droneId: DroneId;
  readonly operatorId: OperatorId;
  readonly sectorId: SectorId;
  readonly distanceMeters: number;
  readonly tollMicroPerKm: bigint;
  readonly deviationCount: number;
  readonly completedAtMs: number;
}
