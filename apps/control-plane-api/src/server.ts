import { createServer, type IncomingMessage, type ServerResponse, type Server } from "node:http";
import type { SectorId } from "@corridor/domain-core";
import type { PartitionedEventBroker } from "@corridor/event-bus";
import { LedgerInvariantAuditor, type DoubleEntryLedger } from "@corridor/ledger-engine";
import type { AirspaceController } from "@corridor/airspace-controller";
import type { FlightPlanSagaCoordinator } from "@corridor/flight-plan-saga";
import type { KinematicSpoofDetector } from "@corridor/spoof-detector";

export interface ControlPlaneDeps {
  readonly broker: PartitionedEventBroker;
  readonly controller: AirspaceController;
  readonly sagaCoordinator: FlightPlanSagaCoordinator;
  readonly ledger: DoubleEntryLedger;
  readonly spoofDetector: KinematicSpoofDetector;
}

/**
 * Zero-dependency Node HTTP Control Plane API for UTM operators.
 */
export class ControlPlaneServer {
  private readonly deps: ControlPlaneDeps;
  private readonly requestBuckets: Map<string, number[]> = new Map();
  private readonly maxReqPerWindow = 120;
  private readonly windowMs = 60_000;
  private server?: Server;

  public constructor(deps: ControlPlaneDeps) {
    this.deps = deps;
  }

  private checkRateLimit(clientKey: string, nowMs: number): boolean {
    const timestamps = this.requestBuckets.get(clientKey) ?? [];
    const recent = timestamps.filter((t) => nowMs - t < this.windowMs);
    if (recent.length >= this.maxReqPerWindow) {
      this.requestBuckets.set(clientKey, recent);
      return false;
    }
    recent.push(nowMs);
    this.requestBuckets.set(clientKey, recent);
    return true;
  }

  private sendJson(res: ServerResponse, statusCode: number, body: unknown): void {
    const payload = JSON.stringify(body, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
    res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
    res.end(payload);
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const clientIp = req.socket.remoteAddress ?? "local";
    if (!this.checkRateLimit(clientIp, Date.now())) {
      this.sendJson(res, 429, { title: "Too Many Requests", status: 429 });
      return;
    }

    const url = new URL(req.url ?? "/", "http://localhost");
    const method = req.method ?? "GET";

    if (method === "GET" && url.pathname === "/v1/health") {
      this.sendJson(res, 200, {
        status: "ok",
        broker: this.deps.broker.getMetrics(),
        quarantinedDrones: this.deps.spoofDetector.getQuarantinedDrones().length
      });
      return;
    }

    if (method === "GET" && url.pathname === "/v1/airspace/sector") {
      const sector = (url.searchParams.get("sector") ?? "LDN-CORE") as SectorId;
      this.sendJson(res, 200, this.deps.controller.getSectorStatus(sector));
      return;
    }

    if (method === "GET" && url.pathname === "/v1/ledger/audit") {
      this.sendJson(res, 200, LedgerInvariantAuditor.audit(this.deps.ledger));
      return;
    }

    if (method === "GET" && url.pathname === "/v1/flights/sagas") {
      this.sendJson(res, 200, { sagas: this.deps.sagaCoordinator.getSagas() });
      return;
    }

    this.sendJson(res, 404, { title: "Not Found", status: 404, detail: `${method} ${url.pathname}` });
  }

  public start(port = 8090): Promise<number> {
    return new Promise((resolve) => {
      this.server = createServer((req, res) => {
        void this.handleRequest(req, res);
      });
      this.server.listen(port, "127.0.0.1", () => {
        const addr = this.server?.address();
        resolve(typeof addr === "object" && addr ? addr.port : port);
      });
    });
  }

  public stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) return resolve();
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}
