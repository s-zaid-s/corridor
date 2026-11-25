import { randomUUID } from "node:crypto";
import { Money, type CurrencyCode, type OperatorId } from "@corridor/domain-core";

export type AccountType = "OPERATOR_WALLET" | "AIRSPACE_AUTHORITY" | "PENALTY_RESERVE" | "ESCROW_HOLD";

export interface LedgerAccount {
  readonly accountId: OperatorId;
  readonly type: AccountType;
  readonly currency: CurrencyCode;
  readonly allowNegativeBalance: boolean;
  readonly createdAtMs: number;
}

export interface LedgerPostingInput {
  readonly accountId: OperatorId;
  readonly debitMicro: bigint;
  readonly creditMicro: bigint;
  readonly memo?: string;
}

export interface JournalEntry {
  readonly entryId: string;
  readonly idempotencyKey: string;
  readonly referenceId: string;
  readonly currency: CurrencyCode;
  readonly timestampMs: number;
  readonly postings: readonly LedgerPostingInput[];
}

/**
 * Immutable ACID Double-Entry Accounting Ledger for airspace tolls, escrow holds, and SLA penalties.
 */
export class DoubleEntryLedger {
  private readonly accounts: Map<string, LedgerAccount> = new Map();
  private readonly balancesMicro: Map<string, bigint> = new Map();
  private readonly entries: JournalEntry[] = [];
  private readonly idempotencyIndex: Map<string, JournalEntry> = new Map();

  public createAccount(
    accountId: string,
    type: AccountType,
    currency: CurrencyCode = "GBP",
    allowNegativeBalance = false
  ): LedgerAccount {
    const existing = this.accounts.get(accountId);
    if (existing) return existing;
    const acct: LedgerAccount = {
      accountId,
      type,
      currency,
      allowNegativeBalance,
      createdAtMs: Date.now()
    };
    this.accounts.set(accountId, acct);
    this.balancesMicro.set(accountId, 0n);
    return acct;
  }

  public getBalance(accountId: string): Money {
    const acct = this.accounts.get(accountId);
    if (!acct) throw new Error(`Unknown ledger account: ${accountId}`);
    return Money.fromMicro(this.balancesMicro.get(accountId) ?? 0n, acct.currency);
  }

  public postJournalEntry(params: {
    idempotencyKey: string;
    referenceId: string;
    currency?: CurrencyCode;
    postings: readonly LedgerPostingInput[];
  }): { entry: JournalEntry; deduplicated: boolean } {
    const existing = this.idempotencyIndex.get(params.idempotencyKey);
    if (existing) return { entry: existing, deduplicated: true };

    const currency = params.currency ?? "GBP";
    if (params.postings.length < 2) {
      throw new Error("A double-entry journal requires at least 2 postings");
    }

    let totalDebits = 0n;
    let totalCredits = 0n;
    const stagedDeltas = new Map<string, bigint>();

    for (const p of params.postings) {
      if (p.debitMicro < 0n || p.creditMicro < 0n) {
        throw new RangeError("Debit and credit amounts must be non-negative");
      }
      if (p.debitMicro > 0n && p.creditMicro > 0n) {
        throw new Error("Posting line cannot have both debit and credit > 0");
      }
      const acct = this.accounts.get(p.accountId);
      if (!acct) throw new Error(`Ledger account does not exist: ${p.accountId}`);
      if (acct.currency !== currency) throw new Error(`Currency mismatch on ${p.accountId}`);

      totalDebits += p.debitMicro;
      totalCredits += p.creditMicro;
      const delta = p.creditMicro - p.debitMicro;
      stagedDeltas.set(p.accountId, (stagedDeltas.get(p.accountId) ?? 0n) + delta);
    }

    if (totalDebits !== totalCredits) {
      throw new Error(`Unbalanced journal rejected: debits=${totalDebits} != credits=${totalCredits}`);
    }

    for (const [acctId, delta] of stagedDeltas.entries()) {
      const acct = this.accounts.get(acctId)!;
      const projected = (this.balancesMicro.get(acctId) ?? 0n) + delta;
      if (!acct.allowNegativeBalance && projected < 0n) {
        throw new Error(`Insufficient funds on account ${acctId}: projected=${projected}`);
      }
    }

    for (const [acctId, delta] of stagedDeltas.entries()) {
      this.balancesMicro.set(acctId, (this.balancesMicro.get(acctId) ?? 0n) + delta);
    }

    const entry: JournalEntry = {
      entryId: `je_${randomUUID()}`,
      idempotencyKey: params.idempotencyKey,
      referenceId: params.referenceId,
      currency,
      timestampMs: Date.now(),
      postings: [...params.postings]
    };

    this.entries.push(entry);
    this.idempotencyIndex.set(params.idempotencyKey, entry);
    return { entry, deduplicated: false };
  }

  public getAllEntries(): readonly JournalEntry[] {
    return this.entries;
  }

  public getAllAccounts(): readonly LedgerAccount[] {
    return [...this.accounts.values()];
  }
}
