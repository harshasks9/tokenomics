/** Display formatting only — the engine never rounds. */

const en = "en-US";

/** Users in K / M for display: 450K, 1.2M, 0. */
export function users(v: number): string {
  if (!Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1_000_000) return `${(v / 1_000_000).toFixed(a >= 10_000_000 ? 1 : 2)}M`;
  if (a >= 1_000) return `${Math.round(v / 1_000)}K`;
  return `${Math.round(v)}`;
}

/** USD in millions: $10.8M, $0.45M, −$1.2M. */
export function usd(v: number, digits?: number): string {
  if (!Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  const d = digits ?? (a >= 100_000_000 ? 0 : a >= 10_000_000 ? 1 : 2);
  return `${v < 0 ? "−" : ""}$${(a / 1_000_000).toFixed(d)}M`;
}

/** Exact values for hover titles. */
export function exactUsers(v: number): string {
  return `${Math.round(v).toLocaleString(en)} users`;
}
export function exactUsd(v: number): string {
  return `$${v.toLocaleString(en, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function pct(v: number, digits = 0): string {
  if (!Number.isFinite(v)) return "—";
  return `${(v * 100).toFixed(digits)}%`;
}

export function price(v: number): string {
  return `$${v.toFixed(2)}`;
}

export function month(m: number | null): string {
  return m === null ? "—" : `M${m}`;
}
