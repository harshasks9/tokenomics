/** Offers — number formatting. All money arrives as $K per month. */

/** 1448.12 → "$1,448K" */
export function moneyK(value: number, decimals = 0): string {
  const sign = value < 0 ? "−" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}K`;
}

/** Signed delta for the step table: −118.80 → "−$118.8K" */
export function deltaK(value: number, decimals = 1): string {
  if (Math.abs(value) < 0.05) return "—";
  const sign = value < 0 ? "−" : "+";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}K`;
}

/** 17172.7 ($K/yr) → "$17.17M" */
export function moneyM(valueInK: number): string {
  const millions = valueInK / 1000;
  const sign = millions < 0 ? "−" : "";
  const abs = Math.abs(millions);
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(2)}B`;
  return `${sign}$${abs.toFixed(2)}M`;
}

/** 0.596274 → "59.6%" */
export function percent(fraction: number, decimals = 1): string {
  return `${(fraction * 100).toFixed(decimals)}%`;
}

/** 0.596274 → "+59.6%" / "−4.2%" */
export function signedPercent(fraction: number, decimals = 1): string {
  const sign = fraction < 0 ? "−" : "+";
  return `${sign}${Math.abs(fraction * 100).toFixed(decimals)}%`;
}

/** 0.734043 → "0.73x" */
export function multiplier(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}x`;
}

/** 0.18 → "18%" (whole-number share, for lever readouts) */
export function share(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/**
 * Token counts. One unit is chosen for a whole axis or readout and every value
 * uses it, so a chart never mixes "116.4M" with "60K" on the same scale.
 */
export interface Unit {
  divisor: number;
  suffix: string;
  decimals: number;
}

export function pickUnit(max: number): Unit {
  const abs = Math.abs(max);
  if (abs >= 1_000_000_000) {
    return { divisor: 1_000_000_000, suffix: "B", decimals: abs / 1e9 < 10 ? 1 : 0 };
  }
  if (abs >= 1_000_000) {
    return { divisor: 1_000_000, suffix: "M", decimals: abs / 1e6 < 10 ? 1 : 0 };
  }
  if (abs >= 1_000) {
    return { divisor: 1_000, suffix: "K", decimals: abs / 1e3 < 10 ? 1 : 0 };
  }
  return { divisor: 1, suffix: "", decimals: 0 };
}

/** Format a value in a unit already chosen for its scale. */
export function inUnit(value: number, unit: Unit): string {
  return `${(value / unit.divisor).toFixed(unit.decimals)}${unit.suffix}`;
}

/** Standalone token figure, unit picked from the value itself. */
export function tokens(value: number): string {
  return inUnit(value, pickUnit(value));
}

/** A readable gridline interval near `rough`. */
export function niceStep(rough: number): number {
  if (rough <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const ladder = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 10];
  return (ladder.find((rung) => normalized <= rung) ?? 10) * magnitude;
}

export function todayStamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
