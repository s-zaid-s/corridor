import {
  Geometry4D,
  type DroneId,
  type DroneTelemetry,
  type SectorId,
  type Vec3M,
  type VoxelKey,
  type Waypoint4D
} from "@corridor/domain-core";

export interface SeparationConflict {
  readonly droneA: DroneId;
  readonly droneB: DroneId;
  readonly horizontalSepM: number;
  readonly verticalSepM: number;
  readonly timeToCpaSec: number;
}

/**
 * Pure-TypeScript 4D Spatio-Temporal Voxel Grid for O(1) airspace discretization
 * and real-time mid-air separation minima conflict detection.
 */
export class SpatialVoxelGrid4D {
  private readonly cellSizeHorizM: number;
  private readonly cellSizeVertM: number;
  private readonly timeSliceMs: number;
  private readonly livePositions: Map<DroneId, DroneTelemetry> = new Map();

  public constructor(options?: {
    cellSizeHorizM?: number;
    cellSizeVertM?: number;
    timeSliceMs?: number;
  }) {
    this.cellSizeHorizM = options?.cellSizeHorizM ?? 100;
    this.cellSizeVertM = options?.cellSizeVertM ?? 25;
    this.timeSliceMs = options?.timeSliceMs ?? 10_000;
  }

  public toVoxelKey(sectorId: SectorId, pos: Vec3M, timestampMs: number): VoxelKey {
    const gx = Math.floor(pos.x / this.cellSizeHorizM);
    const gy = Math.floor(pos.y / this.cellSizeHorizM);
    const gz = Math.floor(pos.z / this.cellSizeVertM);
    const gt = Math.floor(timestampMs / this.timeSliceMs);
    return `${sectorId}:${gx}:${gy}:${gz}:${gt}`;
  }

  /**
   * Samples a 4D flight path at 5-second intervals and returns the deduplicated set
   * of 4D airspace voxel keys required for exclusive reservation.
   */
  public rasterizeFlightPlan(sectorId: SectorId, waypoints: readonly Waypoint4D[]): VoxelKey[] {
    if (waypoints.length < 2) return [];
    const startMs = waypoints[0]!.etaMs;
    const endMs = waypoints[waypoints.length - 1]!.etaMs;
    const keys = new Set<VoxelKey>();

    const stepMs = Math.min(5_000, Math.max(1_000, this.timeSliceMs / 2));
    for (let t = startMs; t <= endMs; t += stepMs) {
      const pos = Geometry4D.interpolatePosition(waypoints, t);
      keys.add(this.toVoxelKey(sectorId, pos, t));
    }
    keys.add(this.toVoxelKey(sectorId, waypoints[waypoints.length - 1]!.pos, endMs));
    return [...keys];
  }

  public updateTelemetry(frame: DroneTelemetry): void {
    this.livePositions.set(frame.droneId, frame);
  }

  /**
   * Detects active or imminent separation-minima breaches (<50m horizontal AND <15m vertical)
   * within a sector using CPA lookahead.
   */
  public detectSectorConflicts(
    sectorId: SectorId,
    minHorizSepM = 50,
    minVertSepM = 15,
    lookaheadSec = 30
  ): SeparationConflict[] {
    const drones = [...this.livePositions.values()].filter(
      (d) => d.sectorId === sectorId && d.state !== "GROUNDED"
    );
    const conflicts: SeparationConflict[] = [];

    for (let i = 0; i < drones.length; i++) {
      for (let j = i + 1; j < drones.length; j++) {
        const a = drones[i]!;
        const b = drones[j]!;
        const cpa = Geometry4D.computeCPA(a.pos, a.velMps, b.pos, b.velMps, lookaheadSec);
        if (cpa.horizontalSepM < minHorizSepM && cpa.verticalSepM < minVertSepM) {
          conflicts.push({
            droneA: a.droneId,
            droneB: b.droneId,
            horizontalSepM: Number(cpa.horizontalSepM.toFixed(2)),
            verticalSepM: Number(cpa.verticalSepM.toFixed(2)),
            timeToCpaSec: Number(cpa.timeToCpaSec.toFixed(2))
          });
        }
      }
    }
    return conflicts;
  }

  public getTrackedDroneCount(): number {
    return this.livePositions.size;
  }
}
