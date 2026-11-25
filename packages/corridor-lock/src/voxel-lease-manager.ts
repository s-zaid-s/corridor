import { randomUUID } from "node:crypto";
import type { FlightPriority, ReservationToken, VoxelKey } from "@corridor/domain-core";

export interface VoxelLease {
  readonly voxelKey: VoxelKey;
  readonly token: ReservationToken;
  readonly priority: FlightPriority;
  readonly fencingToken: number;
  readonly acquiredAtMs: number;
  readonly expiresAtMs: number;
}

export interface CorridorLockResult {
  readonly acquired: boolean;
  readonly token?: ReservationToken;
  readonly fencingToken?: number;
  readonly lockedVoxels: readonly VoxelKey[];
  readonly conflictedVoxels: readonly VoxelKey[];
  readonly preemptedTokens: readonly ReservationToken[];
}

const PRIORITY_RANK: Record<FlightPriority, number> = {
  EMERGENCY_MED: 100,
  COMMERCIAL_CARGO: 50,
  INSPECTION: 30,
  RECREATIONAL: 10
};

/**
 * Atomic 4D Airspace Voxel Lease Manager with monotonic fencing tokens
 * and priority preemption for EMERGENCY_MED flights.
 */
export class CorridorLeaseManager {
  private readonly activeLeases: Map<VoxelKey, VoxelLease> = new Map();
  private readonly tokenIndex: Map<ReservationToken, Set<VoxelKey>> = new Map();
  private fencingCounter = 0;

  private pruneExpired(nowMs: number): void {
    for (const [key, lease] of this.activeLeases.entries()) {
      if (lease.expiresAtMs <= nowMs) {
        this.activeLeases.delete(key);
        const set = this.tokenIndex.get(lease.token);
        if (set) {
          set.delete(key);
          if (set.size === 0) this.tokenIndex.delete(lease.token);
        }
      }
    }
  }

  public acquireCorridor(
    voxelKeys: readonly VoxelKey[],
    priority: FlightPriority,
    ttlMs: number,
    nowMs: number = Date.now()
  ): CorridorLockResult {
    this.pruneExpired(nowMs);
    const conflicts: VoxelKey[] = [];
    const preemptableTokens = new Set<ReservationToken>();

    for (const key of voxelKeys) {
      const existing = this.activeLeases.get(key);
      if (existing) {
        if (PRIORITY_RANK[priority] > PRIORITY_RANK[existing.priority]) {
          preemptableTokens.add(existing.token);
        } else {
          conflicts.push(key);
        }
      }
    }

    if (conflicts.length > 0) {
      return {
        acquired: false,
        lockedVoxels: [],
        conflictedVoxels: conflicts,
        preemptedTokens: []
      };
    }

    // Preempt lower-priority leases cleanly
    for (const tok of preemptableTokens) {
      this.releaseCorridor(tok);
    }

    const token: ReservationToken = `cor_${randomUUID()}`;
    const fencingToken = ++this.fencingCounter;
    const expiresAtMs = nowMs + ttlMs;
    const set = new Set<VoxelKey>();

    for (const key of voxelKeys) {
      this.activeLeases.set(key, {
        voxelKey: key,
        token,
        priority,
        fencingToken,
        acquiredAtMs: nowMs,
        expiresAtMs
      });
      set.add(key);
    }
    this.tokenIndex.set(token, set);

    return {
      acquired: true,
      token,
      fencingToken,
      lockedVoxels: [...voxelKeys],
      conflictedVoxels: [],
      preemptedTokens: [...preemptableTokens]
    };
  }

  public releaseCorridor(token: ReservationToken): number {
    const keys = this.tokenIndex.get(token);
    if (!keys) return 0;
    let count = 0;
    for (const k of keys) {
      const lease = this.activeLeases.get(k);
      if (lease && lease.token === token) {
        this.activeLeases.delete(k);
        count++;
      }
    }
    this.tokenIndex.delete(token);
    return count;
  }

  public validateReservation(token: ReservationToken, nowMs: number = Date.now()): boolean {
    this.pruneExpired(nowMs);
    const keys = this.tokenIndex.get(token);
    return keys !== undefined && keys.size > 0;
  }

  public activeVoxelCount(nowMs: number = Date.now()): number {
    this.pruneExpired(nowMs);
    return this.activeLeases.size;
  }
}
