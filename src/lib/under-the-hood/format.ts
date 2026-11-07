/** Formatting helpers. Inputs in $ millions unless noted. */
export function usdM(m: number, opts: { digits?: number; sign?: boolean } = {}): string {
  if (!Number.isFinite(m)) return "—";
  const neg = m < 0;
  const a = Math.abs(m);
  const d = opts.digits;
  let s: string;
  if (a >= 1_000_000) s = `$${(a / 1_000_000).toFixed(d ?? 2)}T`;
  else if (a >= 1000) s = `$${(a / 1000).toFixed(d ?? (a >= 100_000 ? 0 : 1))}B`;
  else s = `$${a.toFixed(d ?? 0)}M`;
  if (neg) return `−${s}`;
  return opts.sign ? `+${s}` : s;
}
export function pct(x: number | null | undefined, digits = 0, sign = false): string {
  if (x === null || x === undefined || !Number.isFinite(x)) return "—";
  const v = x * 100;
  const s = `${Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits })}%`;
  if (v < 0) return `−${s}`;
  return sign ? `+${s}` : s;
}
export function num(x: number, digits = 0): string {
  return x.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}
export function mult(x: number, digits = 1): string {
  return `${x.toFixed(digits)}×`;
}
/** Build CSV text from rows of plain objects. */
export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}
