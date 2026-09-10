export const usd = (x: number, digits?: number): string => {
  const d = digits ?? (Math.abs(x) >= 100 ? 0 : Math.abs(x) >= 10 ? 1 : 2);
  const s = Math.abs(x).toFixed(d);
  return `${x < 0 ? "−" : ""}$${s}M`;
};

export const pct = (x: number, digits = 1): string => `${(x * 100).toFixed(digits)}%`;

export const signed = (x: number): string => (x > 0 ? "+" : x < 0 ? "−" : "") + usd(Math.abs(x));

export const monthLabel = (m: number): string => {
  // Month 0 = Sep 2026.
  const d = new Date(Date.UTC(2026, 8 + m, 1));
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
};
