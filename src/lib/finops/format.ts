// FrontierOps — shared formatters. Compact money/token figures everywhere the
// eye scans; full figures live in tooltips and tables.

export function money(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs < 0.005) return "$0";
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(abs >= 1e5 ? 0 : 1)}K`;
  if (abs >= 100) return `${sign}$${Math.round(abs)}`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function moneyFull(v: number): string {
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

export function num(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${(v / 1e9).toFixed(abs >= 1e10 ? 0 : 1)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(abs >= 1e7 ? 0 : 1)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(abs >= 1e5 ? 0 : 1)}K`;
  return `${Math.round(v)}`;
}

export function pct(v: number, digits = 0): string {
  return `${(v * 100).toFixed(digits)}%`;
}

export function signed(v: number, unit = ""): string {
  const s = v > 0 ? "+" : "";
  return `${s}${Math.round(v)}${unit}`;
}

export function ms(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}s` : `${Math.round(v)}ms`;
}

export function perMTok(v: number): string {
  return `$${v >= 10 ? v.toFixed(1) : v.toFixed(2)}`;
}
