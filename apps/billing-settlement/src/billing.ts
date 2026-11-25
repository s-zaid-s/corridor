import {
  FlightPhysicsModel,
  Money,
  type DroneProfile,
  type FlightCompletedEvent
} from "@corridor/domain-core";
import type { PartitionedEventBroker, TransactionalOutbox } from "@corridor/event-bus";
import type { DoubleEntryLedger, LedgerPostingInput } from "@corridor/ledger-engine";

export const AIRSPACE_AUTHORITY_ACCOUNT = "sys_airspace_authority_gbp";
export const PENALTY_RESERVE_ACCOUNT = "sys_penalty_reserve_gbp";

export interface FlightBillingReceipt {
  readonly flightPlanId: string;
  readonly journalEntryId: string;
  readonly deduplicated: boolean;
  readonly tollMicro: bigint;
  readonly penaltyMicro: bigint;
}

/**
 * Reconciles completed flights and posts atomic, idempotent double-entry tolls
 * and corridor-deviation penalties to the immutable ledger.
 */
export class AirspaceBillingService {
  private readonly ledger: DoubleEntryLedger;
  private readonly outbox: TransactionalOutbox;
  private readonly penaltyPerDeviationMicro = 250_000n; // £0.25 per corridor deviation

  public constructor(params: {
    broker: PartitionedEventBroker;
    ledger: DoubleEntryLedger;
    outbox: TransactionalOutbox;
    profiles: readonly DroneProfile[];
  }) {
    this.ledger = params.ledger;
    this.outbox = params.outbox;

    this.ledger.createAccount(AIRSPACE_AUTHORITY_ACCOUNT, "AIRSPACE_AUTHORITY", "GBP", false);
    this.ledger.createAccount(PENALTY_RESERVE_ACCOUNT, "PENALTY_RESERVE", "GBP", false);

    // Pre-seed operator wallets with credit line for offline simulation
    const seenOps = new Set<string>();
    for (const p of params.profiles) {
      if (!seenOps.has(p.operatorId)) {
        seenOps.add(p.operatorId);
        this.ledger.createAccount(p.operatorId, "OPERATOR_WALLET", "GBP", true);
      }
    }

    params.broker.subscribe("airspace.flight.completed", "billing-settlement-v1", async (env) => {
      await this.settleFlight(env.payload);
    });
  }

  public async settleFlight(event: FlightCompletedEvent): Promise<FlightBillingReceipt> {
    const toll = FlightPhysicsModel.calculateAirspaceToll(
      event.distanceMeters,
      event.tollMicroPerKm,
      "GBP"
    );
    const penalty = Money.fromMicro(BigInt(event.deviationCount) * this.penaltyPerDeviationMicro, "GBP");
    const totalCharge = toll.add(penalty);

    if (totalCharge.isZero()) {
      return {
        flightPlanId: event.flightPlanId,
        journalEntryId: "NO_CHARGE",
        deduplicated: false,
        tollMicro: 0n,
        penaltyMicro: 0n
      };
    }

    const postings: LedgerPostingInput[] = [
      {
        accountId: event.operatorId,
        debitMicro: totalCharge.microUnits,
        creditMicro: 0n,
        memo: `Airspace usage & penalties for flight ${event.flightPlanId}`
      }
    ];

    if (!toll.isZero()) {
      postings.push({
        accountId: AIRSPACE_AUTHORITY_ACCOUNT,
        debitMicro: 0n,
        creditMicro: toll.microUnits,
        memo: `Corridor toll for ${event.distanceMeters.toFixed(0)}m`
      });
    }

    if (!penalty.isZero()) {
      postings.push({
        accountId: PENALTY_RESERVE_ACCOUNT,
        debitMicro: 0n,
        creditMicro: penalty.microUnits,
        memo: `Deviation penalty (${event.deviationCount} breaches)`
      });
    }

    const { entry, deduplicated } = this.ledger.postJournalEntry({
      idempotencyKey: `bill:${event.flightPlanId}`,
      referenceId: event.flightPlanId,
      currency: "GBP",
      postings
    });

    if (!deduplicated) {
      this.outbox.stage("billing.settled", event.sectorId, {
        flightPlanId: event.flightPlanId,
        journalEntryId: entry.entryId,
        tollChargedMicro: toll.microUnits,
        penaltyChargedMicro: penalty.microUnits,
        settledAtMs: Date.now()
      });
      await this.outbox.flushPending();
    }

    return {
      flightPlanId: event.flightPlanId,
      journalEntryId: entry.entryId,
      deduplicated,
      tollMicro: toll.microUnits,
      penaltyMicro: penalty.microUnits
    };
  }
}
