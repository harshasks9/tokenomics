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

export function todayStamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
