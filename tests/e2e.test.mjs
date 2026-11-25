import test from "node:test";
import assert from "node:assert/strict";
import { createOfflineCorridorRuntime } from "../apps/control-plane-api/dist/bootstrap.js";
import { LedgerInvariantAuditor } from "../packages/ledger-engine/dist/invariant-auditor.js";

test("End-to-end offline UTM: GPS spoof quarantine -> 4D corridor lock -> clearance -> billing settlement", async () => {
  const runtime = createOfflineCorridorRuntime(200);
  const t0 = Date.now();

  await runtime.ingestor.ingest(runtime.fleet.tick(2, t0));
  assert.ok(runtime.spoofDetector.getQuarantinedDrones().length > 0, "Spoofing drones must be quarantined");

  const healthy = runtime.fleet
    .getProfiles()
    .filter((p) => p.sectorId === "LDN-CORE" && !runtime.spoofDetector.isQuarantined(p.droneId));
  assert.ok(healthy.length >= 2);

  const waypoints = [
    { pos: { x: 0, y: 0, z: 60 }, etaMs: t0 },
    { pos: { x: 1500, y: 0, z: 60 }, etaMs: t0 + 100_000 }
  ];

  // Commercial flight locks corridor
  const saga1 = await runtime.sagaCoordinator.fileFlightPlan({
    flightPlanId: "fp_comm_1",
    droneId: healthy[0].droneId,
    operatorId: healthy[0].operatorId,
    sectorId: "LDN-CORE",
    priority: "COMMERCIAL_CARGO",
    maxTollMicroPerKm: 200_000n,
    waypoints
  });
  assert.equal(saga1.state, "CLEARED");

  // Second commercial flight on identical 4D corridor must be rejected (conflict!)
  const saga2 = await runtime.sagaCoordinator.fileFlightPlan({
    flightPlanId: "fp_comm_2",
    droneId: healthy[1].droneId,
    operatorId: healthy[1].operatorId,
    sectorId: "LDN-CORE",
    priority: "COMMERCIAL_CARGO",
    maxTollMicroPerKm: 200_000n,
    waypoints
  });
  assert.equal(saga2.state, "COMPENSATED");

  // Settle completed flight 1
  await runtime.broker.publish("airspace.flight.completed", "LDN-CORE", {
    flightPlanId: saga1.flightPlanId,
    droneId: healthy[0].droneId,
    operatorId: healthy[0].operatorId,
    sectorId: "LDN-CORE",
    distanceMeters: 1500,
    tollMicroPerKm: 150_000n,
    deviationCount: 1,
    completedAtMs: t0 + 100_000
  });

  const audit = LedgerInvariantAuditor.audit(runtime.ledger);
  assert.equal(audit.passed, true);
  assert.equal(audit.entriesAudited, 1);
  assert.equal(audit.globalDebitMicro, audit.globalCreditMicro);
});
