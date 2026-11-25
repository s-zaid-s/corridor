export type CurrencyCode = "GBP" | "EUR" | "USD";

const MICRO_SCALE = 1_000_000n;

/**
 * Immutable BigInt fixed-point currency value object (1.000000 = 1_000_000n micro-units).
 * Guarantees zero floating-point drift across airspace tolls, landing fees, and SLA penalties.
 */
export class Money {
  public readonly microUnits: bigint;
  public readonly currency: CurrencyCode;

  private constructor(microUnits: bigint, currency: CurrencyCode) {
    this.microUnits = microUnits;
    this.currency = currency;
  }

  public static zero(currency: CurrencyCode = "GBP"): Money {
    return new Money(0n, currency);
  }

  public static fromMicro(microUnits: bigint, currency: CurrencyCode = "GBP"): Money {
    return new Money(microUnits, currency);
  }

  public static fromMajor(majorUnits: number, currency: CurrencyCode = "GBP"): Money {
    if (!Number.isFinite(majorUnits)) {
      throw new RangeError(`Invalid major currency amount: ${majorUnits}`);
    }
    return new Money(BigInt(Math.round(majorUnits * Number(MICRO_SCALE))), currency);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.microUnits + other.microUnits, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.microUnits - other.microUnits, this.currency);
  }

  public isZero(): boolean {
    return this.microUnits === 0n;
  }

  public isNegative(): boolean {
    return this.microUnits < 0n;
  }

  public multiplyBps(bps: bigint): Money {
    const num = this.microUnits * bps;
    const den = 10_000n;
    const q = num / den;
    const r = num % den;
    const absR = r < 0n ? -r : r;
    const half = den / 2n;
    let rounded = q;
    if (absR > half || (absR === half && q % 2n !== 0n)) {
      rounded += num >= 0n ? 1n : -1n;
    }
    return new Money(rounded, this.currency);
  }

  public format(): string {
    const sign = this.microUnits < 0n ? "-" : "";
    const abs = this.microUnits < 0n ? -this.microUnits : this.microUnits;
    const whole = abs / MICRO_SCALE;
    const frac = (abs % MICRO_SCALE).toString().padStart(6, "0");
    return `${sign}${this.currency} ${whole}.${frac}`;
  }
}
