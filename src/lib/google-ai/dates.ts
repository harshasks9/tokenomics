/** Small ISO-date helpers. All dates in the knowledge base are YYYY-MM-DD strings, compared lexically. */

export function todayISO(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
export function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86400000);
}
/** Fractional year, for plotting. */
export function yearFrac(iso: string): number {
  const y = Number(iso.slice(0, 4));
  const start = Date.UTC(y, 0, 1);
  const end = Date.UTC(y + 1, 0, 1);
  return y + (Date.parse(iso.slice(0, 10) + "T00:00:00Z") - start) / (end - start);
}
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtDate(iso?: string, precision: "day" | "month" | "year" = "day"): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (precision === "year" || !m) return y;
  if (precision === "month" || !d) return `${MONTHS[Number(m) - 1]} ${y}`;
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}
/** True when [from, to] contains date. Open ends are unbounded. */
export function inEffect(date: string, from?: string, to?: string): boolean {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}
