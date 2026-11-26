import raw from "./params.json";
import { breakEvenIncentive, lifetime, type Incentive, type Lifetime, type RouteId, type RouteParams } from "./model";
import { BASE_INCENTIVE, BASE_LIFETIME, baseRoute } from "./params";

export interface TornadoRow { key: string; label: string; low: number; high: number; lowValue: number; highValue: number; swing: number }

const LABELS: Record<string, string> = {
  channelFee: "Cloud's seller fee",
  customerDiscount: "Negotiated discount",
  discountFundedByProvider: "Share of discount the model maker funds",
  providerServingCost: "Model maker's serving cost",
  hostedShare: "Share served on this cloud",
  incrementalComputeShare: "Compute that is truly extra",
  computeMargin: "Cloud's margin on compute",
  revenueShare: "Revenue share to the model's owner",
  infraCost: "Chips, power & buildings",
  utilization: "Chip utilization",
  modelDevCost: "Model-building cost",
  distributionCost: "Selling & support cost",
  growth: "Customer growth",
  retention: "Customer retention",
  priceDeflation: "Price cuts per year",
  efficiencyGain: "Serving-cost cuts per year",
  channelFeeDrift: "Seller-fee renegotiation per year",
  discountRate: "Discount rate",
};

const ROUTE_KEYS: (keyof RouteParams)[] = ["channelFee", "customerDiscount", "discountFundedByProvider", "providerServingCost", "hostedShare", "incrementalComputeShare", "computeMargin", "revenueShare", "infraCost", "utilization", "modelDevCost", "distributionCost"];
const LIFE_KEYS: (keyof Lifetime)[] = ["growth", "retention", "priceDeflation", "efficiencyGain", "channelFeeDrift", "discountRate"];

type Meta = { base: number; low: number; high: number };

/** One-at-a-time sensitivity of a metric to each assumption's low/high (others at base). */
export function tornado(id: RouteId, metric: (p: RouteParams, lt: Lifetime, inc: Incentive) => number, inc: Incentive = BASE_INCENTIVE, lt: Lifetime = { ...BASE_LIFETIME, years: 5 }): TornadoRow[] {
  const routeMeta = (raw.routes as unknown as Record<RouteId, { params: Record<string, Meta> }>)[id].params;
  const lifeMeta = raw.lifetime as unknown as Record<string, Meta>;
  const p0 = baseRoute(id);
  const base = metric(p0, lt, inc);
  const rows: TornadoRow[] = [];
  for (const k of ROUTE_KEYS) {
    const m = routeMeta[k as string];
    if (!m || m.low === m.high) continue;
    if (p0.structure === "agent" && ["revenueShare", "infraCost", "utilization", "modelDevCost"].includes(k)) continue;
    if (p0.structure === "principal" && ["channelFee", "discountFundedByProvider", "providerServingCost", "hostedShare", "incrementalComputeShare", "computeMargin"].includes(k)) continue;
    if (k === "modelDevCost") continue; // affects the economic view only, not contribution
    const lo = metric({ ...p0, [k]: m.low }, lt, inc);
    const hi = metric({ ...p0, [k]: m.high }, lt, inc);
    rows.push({ key: k, label: LABELS[k] ?? k, low: m.low, high: m.high, lowValue: lo, highValue: hi, swing: Math.abs(hi - lo) });
  }
  for (const k of LIFE_KEYS) {
    const m = lifeMeta[k as string];
    if (!m || m.low === m.high) continue;
    if (k === "channelFeeDrift" && p0.structure !== "agent") continue;
    const lo = metric(p0, { ...lt, [k]: m.low }, inc);
    const hi = metric(p0, { ...lt, [k]: m.high }, inc);
    rows.push({ key: k, label: LABELS[k] ?? k, low: m.low, high: m.high, lowValue: lo, highValue: hi, swing: Math.abs(hi - lo) });
  }
  void base;
  return rows.sort((a, b) => b.swing - a.swing);
}

export const npv5 = (p: RouteParams, lt: Lifetime, inc: Incentive) => lifetime(p, inc, { ...lt, years: 5 }).npv;
export const breakEven = (p: RouteParams) => breakEvenIncentive(p, { partnerFunded: 0, providerFunded: 0 });

/** Minimum rise in win probability (points) for which matching an incentive beats not matching, given a base win rate. */
export function matchThreshold(npvWithIncentive: number, npvWithout: number, baseWinRate: number): number {
  if (npvWithIncentive <= 0) return Infinity;
  return Math.max(0, (baseWinRate * (npvWithout - npvWithIncentive)) / npvWithIncentive);
}
