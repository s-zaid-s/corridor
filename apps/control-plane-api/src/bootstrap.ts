import { FlightClearanceSigner } from "@corridor/crypto-auth";
import { PartitionedEventBroker, TransactionalOutbox } from "@corridor/event-bus";
import { SpatialVoxelGrid4D } from "@corridor/spatial-index";
import { CorridorLeaseManager } from "@corridor/corridor-lock";
import { DoubleEntryLedger, LedgerInvariantAuditor } from "@corridor/ledger-engine";
import { VirtualDroneFleet } from "@corridor/drone-fleet-simulator";
import { TelemetryIngestor } from "@corridor/telemetry-ingestor";
import { KinematicSpoofDetector } from "@corridor/spoof-detector";
import { AirspaceController } from "@corridor/airspace-controller";
import { FlightPlanSagaCoordinator } from "@corridor/flight-plan-saga";
import { AirspaceBillingService } from "@corridor/billing-settlement";
import { ControlPlaneServer } from "./server.js";

export interface CorridorRuntime {
  readonly broker: PartitionedEventBroker;
  readonly spatialIndex: SpatialVoxelGrid4D;
  readonly leaseManager: CorridorLeaseManager;
  readonly ledger: DoubleEntryLedger;
  readonly fleet: VirtualDroneFleet;
  readonly ingestor: TelemetryIngestor;
  readonly spoofDetector: KinematicSpoofDetector;
  readonly controller: AirspaceController;
  readonly sagaCoordinator: FlightPlanSagaCoordinator;
  readonly billing: AirspaceBillingService;
  readonly server: ControlPlaneServer;
}

export function createOfflineCorridorRuntime(fleetSize = 200): CorridorRuntime {
  const signer = new FlightClearanceSigner();
  const broker = new PartitionedEventBroker({ partitionCount: 4 });
  const outbox = new TransactionalOutbox(broker);
  const spatialIndex = new SpatialVoxelGrid4D();
  const leaseManager = new CorridorLeaseManager();
  const ledger = new DoubleEntryLedger();

  const fleet = new VirtualDroneFleet(signer, { fleetSize, spoofRate: 0.03, linkLossRate: 0.01 });
  const profiles = fleet.getProfiles();

  const ingestor = new TelemetryIngestor(broker, spatialIndex, 250);
  const spoofDetector = new KinematicSpoofDetector(broker, profiles);
  const controller = new AirspaceController({
    broker,
    spatialIndex,
    leaseManager,
    signer,
    profiles,
    clearanceSink: (c) => fleet.handleClearance(c)
  });

  const sagaCoordinator = new FlightPlanSagaCoordinator(controller, outbox);
  const billing = new AirspaceBillingService({ broker, ledger, outbox, profiles });
  const server = new ControlPlaneServer({
    broker,
    controller,
    sagaCoordinator,
    ledger,
    spoofDetector
  });

  return {
    broker,
    spatialIndex,
    leaseManager,
    ledger,
    fleet,
    ingestor,
    spoofDetector,
    controller,
    sagaCoordinator,
    billing,
    server
  };
}

async function main(): Promise<void> {
  const runtime = createOfflineCorridorRuntime(200);
  const t0 = Date.now();

  await runtime.ingestor.ingest(runtime.fleet.tick(2, t0));

  const healthyDrone = runtime.fleet
    .getProfiles()
    .find((p) => p.sectorId === "LDN-CORE" && !runtime.spoofDetector.isQuarantined(p.droneId));

  if (healthyDrone) {
    const saga = await runtime.sagaCoordinator.fileFlightPlan({
      flightPlanId: "fp_demo_001",
      droneId: healthyDrone.droneId,
      operatorId: healthyDrone.operatorId,
      sectorId: "LDN-CORE",
      priority: "COMMERCIAL_CARGO",
      maxTollMicroPerKm: 200_000n,
      waypoints: [
        { pos: { x: 0, y: 0, z: 60 }, etaMs: t0 },
        { pos: { x: 2000, y: 0, z: 60 }, etaMs: t0 + 120_000 }
      ]
    });

    await runtime.ingestor.ingest(runtime.fleet.tick(60, t0 + 60_000));
    await runtime.ingestor.ingest(runtime.fleet.tick(60, t0 + 120_000));

    await runtime.broker.publish("airspace.flight.completed", "LDN-CORE", {
      flightPlanId: saga.flightPlanId,
      droneId: healthyDrone.droneId,
      operatorId: healthyDrone.operatorId,
      sectorId: "LDN-CORE",
      distanceMeters: 2000,
      tollMicroPerKm: 150_000n,
      deviationCount: 0,
      completedAtMs: t0 + 120_000
    });
  }

  const audit = LedgerInvariantAuditor.audit(runtime.ledger);
  console.log("[CORRIDOR] Offline UTM cycle complete:", {
    sagasExecuted: runtime.sagaCoordinator.getSagas().length,
    quarantinedDrones: runtime.spoofDetector.getQuarantinedDrones().length,
    auditPassed: audit.passed
  });

  const port = await runtime.server.start(8090);
  console.log(`[CORRIDOR] Control Plane API listening offline on http://127.0.0.1:${port}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
