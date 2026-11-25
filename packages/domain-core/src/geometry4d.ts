import type { Vec3M, Waypoint4D } from "./types.js";

export interface CpaResult {
  readonly timeToCpaSec: number;
  readonly minDistanceM: number;
  readonly horizontalSepM: number;
  readonly verticalSepM: number;
}

/**
 * Pure 3D/4D airspace trajectory math & Closest Point of Approach (CPA) collision physics.
 */
export class Geometry4D {
  public static distance3D(a: Vec3M, b: Vec3M): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dz = b.z - a.z;
    return Math.hypot(dx, dy, dz);
  }

  public static horizontalDistance(a: Vec3M, b: Vec3M): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  public static pathLengthMeters(waypoints: readonly Waypoint4D[]): number {
    let total = 0;
    for (let i = 1; i < waypoints.length; i++) {
      total += this.distance3D(waypoints[i - 1]!.pos, waypoints[i]!.pos);
    }
    return total;
  }

  /**
   * Computes Closest Point of Approach (CPA) between two linear-velocity drones
   * over a lookahead horizon in seconds.
   */
  public static computeCPA(
    p1: Vec3M,
    v1: Vec3M,
    p2: Vec3M,
    v2: Vec3M,
    maxLookaheadSec = 60
  ): CpaResult {
    const rx = p2.x - p1.x;
    const ry = p2.y - p1.y;
    const rz = p2.z - p1.z;

    const vx = v2.x - v1.x;
    const vy = v2.y - v1.y;
    const vz = v2.z - v1.z;

    const vDotV = vx * vx + vy * vy + vz * vz;
    let tCpa = 0;
    if (vDotV > 1e-6) {
      const rDotV = rx * vx + ry * vy + rz * vz;
      tCpa = Math.max(0, Math.min(maxLookaheadSec, -rDotV / vDotV));
    }

    const dx = rx + vx * tCpa;
    const dy = ry + vy * tCpa;
    const dz = rz + vz * tCpa;

    return {
      timeToCpaSec: tCpa,
      minDistanceM: Math.hypot(dx, dy, dz),
      horizontalSepM: Math.hypot(dx, dy),
      verticalSepM: Math.abs(dz)
    };
  }

  /**
   * Interpolates a 3D position along a 4D waypoint sequence at timestampMs.
   */
  public static interpolatePosition(waypoints: readonly Waypoint4D[], timestampMs: number): Vec3M {
    if (waypoints.length === 0) return { x: 0, y: 0, z: 0 };
    if (timestampMs <= waypoints[0]!.etaMs) return waypoints[0]!.pos;
    const last = waypoints[waypoints.length - 1]!;
    if (timestampMs >= last.etaMs) return last.pos;

    for (let i = 1; i < waypoints.length; i++) {
      const prev = waypoints[i - 1]!;
      const next = waypoints[i]!;
      if (timestampMs >= prev.etaMs && timestampMs <= next.etaMs) {
        const span = Math.max(1, next.etaMs - prev.etaMs);
        const t = (timestampMs - prev.etaMs) / span;
        return {
          x: prev.pos.x + (next.pos.x - prev.pos.x) * t,
          y: prev.pos.y + (next.pos.y - prev.pos.y) * t,
          z: prev.pos.z + (next.pos.z - prev.pos.z) * t
        };
      }
    }
    return last.pos;
  }
}
