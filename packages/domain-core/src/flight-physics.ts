import type { DroneProfile, Waypoint4D } from "./types.js";
import { Geometry4D } from "./geometry4d.js";
import { Money, type CurrencyCode } from "./money.js";

/**
 * Deterministic drone energy consumption, range safety, and airspace toll calculator.
 */
export class FlightPhysicsModel {
  public static estimateEnergyWh(profile: DroneProfile, waypoints: readonly Waypoint4D[]): number {
    if (waypoints.length < 2) return 0;
    const durationSec = Math.max(0, (waypoints[waypoints.length - 1]!.etaMs - waypoints[0]!.etaMs) / 1000);
    return (profile.cruisePowerW * durationSec) / 3600;
  }

  public static hasSufficientBattery(
    profile: DroneProfile,
    currentBatteryPct: number,
    waypoints: readonly Waypoint4D[]
  ): boolean {
    const requiredWh = this.estimateEnergyWh(profile, waypoints);
    const usablePct = Math.max(0, currentBatteryPct - profile.minReserveBatteryPct);
    const availableWh = (usablePct / 100) * profile.batteryCapacityWh;
    return availableWh >= requiredWh;
  }

  /**
   * Computes exact airspace toll in BigInt micro-currency:
   * (distanceMeters * tollMicroPerKm) / 1000n
   */
  public static calculateAirspaceToll(
    distanceMeters: number,
    tollMicroPerKm: bigint,
    currency: CurrencyCode = "GBP"
  ): Money {
    if (distanceMeters <= 0 || tollMicroPerKm <= 0n) return Money.zero(currency);
    const metersBig = BigInt(Math.round(distanceMeters));
    const micro = (metersBig * tollMicroPerKm) / 1000n;
    return Money.fromMicro(micro, currency);
  }

  public static validateWaypointKinematics(
    profile: DroneProfile,
    waypoints: readonly Waypoint4D[]
  ): { valid: boolean; reason?: string } {
    if (waypoints.length < 2) return { valid: false, reason: "MIN_TWO_WAYPOINTS_REQUIRED" };
    for (let i = 1; i < waypoints.length; i++) {
      const a = waypoints[i - 1]!;
      const b = waypoints[i]!;
      const dtSec = (b.etaMs - a.etaMs) / 1000;
      if (dtSec <= 0) return { valid: false, reason: "NON_MONOTONIC_ETA" };
      const horizSpeed = Geometry4D.horizontalDistance(a.pos, b.pos) / dtSec;
      const climbRate = Math.abs(b.pos.z - a.pos.z) / dtSec;
      if (horizSpeed > profile.maxHorizontalSpeedMps * 1.05) {
        return { valid: false, reason: `SPEED_EXCEEDS_AIRFRAME_MAX: ${horizSpeed.toFixed(1)}m/s` };
      }
      if (climbRate > profile.maxClimbRateMps * 1.05) {
        return { valid: false, reason: `CLIMB_EXCEEDS_AIRFRAME_MAX: ${climbRate.toFixed(1)}m/s` };
      }
    }
    return { valid: true };
  }
}
