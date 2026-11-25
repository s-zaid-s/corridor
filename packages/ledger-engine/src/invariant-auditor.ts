import type { DoubleEntryLedger } from "./double-entry.js";

export interface AuditReport {
  readonly passed: boolean;
  readonly entriesAudited: number;
  readonly accountsAudited: number;
  readonly globalDebitMicro: bigint;
  readonly globalCreditMicro: bigint;
  readonly violations: readonly string[];
  readonly auditedAtMs: number;
}

export class LedgerInvariantAuditor {
  public static audit(ledger: DoubleEntryLedger): AuditReport {
    const violations: string[] = [];
    const entries = ledger.getAllEntries();
    const accounts = ledger.getAllAccounts();

    let globalDebits = 0n;
    let globalCredits = 0n;
    const recomputed = new Map<string, bigint>();

    for (const entry of entries) {
      let eDeb = 0n;
      let eCred = 0n;
      for (const p of entry.postings) {
        eDeb += p.debitMicro;
        eCred += p.creditMicro;
        recomputed.set(p.accountId, (recomputed.get(p.accountId) ?? 0n) + (p.creditMicro - p.debitMicro));
      }
      if (eDeb !== eCred) {
        violations.push(`Unbalanced entry ${entry.entryId}: ${eDeb} != ${eCred}`);
      }
      globalDebits += eDeb;
      globalCredits += eCred;
    }

    if (globalDebits !== globalCredits) {
      violations.push(`Global trial balance mismatch: ${globalDebits} != ${globalCredits}`);
    }

    for (const acct of accounts) {
      const live = ledger.getBalance(acct.accountId).microUnits;
      const calc = recomputed.get(acct.accountId) ?? 0n;
      if (live !== calc) {
        violations.push(`Balance drift on ${acct.accountId}: live=${live} calc=${calc}`);
      }
      if (!acct.allowNegativeBalance && live < 0n) {
        violations.push(`Unauthorized negative balance on ${acct.accountId}: ${live}`);
      }
    }

    return {
      passed: violations.length === 0,
      entriesAudited: entries.length,
      accountsAudited: accounts.length,
      globalDebitMicro: globalDebits,
      globalCreditMicro: globalCredits,
      violations,
      auditedAtMs: Date.now()
    };
  }
}
