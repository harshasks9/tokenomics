/**
 * Transparent, testable models behind the interactive exhibits.
 * Nothing here is a forecast: these functions turn stated assumptions into
 * illustrative outputs, and the UI prints the formulas next to the results.
 */

/* ── Visualization F: the $100 purchase ─────────────────────── */

/** All money values are % of a $100 order (= dollars). Rates are %. */
export interface EconParams {
  grossMargin: number; // retailer gross margin
  cac: number; // first-order customer acquisition cost
  takeRate: number; // marketplace / platform commission
  placementFee: number; // paid placement, referral or affiliate fee
  payment: number; // payment processing
  agentFee: number; // agent transaction / orchestration fee
  fulfillment: number; // pick, pack, ship (retailer-borne)
  returnsFraud: number; // returns + fraud losses
  incrementalConversion: number; // % more orders vs the e-commerce baseline
  repeatRate: number; // % of customers who buy again
  retention: number; // % of repeaters still active each subsequent period
}

export const PARAM_META: Record<keyof EconParams, { label: string; min: number; max: number; step: number; unit: string; help: string }> = {
  grossMargin: { label: "Retail gross margin", min: 10, max: 60, step: 1, unit: "%", help: "Sale price minus cost of goods. The pool every other cost is paid from." },
  cac: { label: "Customer acquisition cost", min: 0, max: 30, step: 0.5, unit: "$", help: "Marketing spent to win the first order. Paid once per customer." },
  takeRate: { label: "Marketplace / platform take", min: 0, max: 25, step: 0.5, unit: "%", help: "Commission to a marketplace or commerce platform, on every order." },
  placementFee: { label: "Paid placement / referral", min: 0, max: 20, step: 0.5, unit: "%", help: "Sponsored listings, retail media or referral fees, on every order." },
  payment: { label: "Payment processing", min: 0, max: 5, step: 0.1, unit: "%", help: "Card and wallet acceptance cost." },
  agentFee: { label: "Agent / orchestration fee", min: 0, max: 10, step: 0.25, unit: "%", help: "Fee to an AI platform or agent for a completed transaction. Mostly undisclosed today." },
  fulfillment: { label: "Fulfillment & shipping", min: 0, max: 30, step: 0.5, unit: "%", help: "Retailer-borne pick, pack and delivery." },
  returnsFraud: { label: "Returns & fraud", min: 0, max: 20, step: 0.5, unit: "%", help: "Net cost of returns, chargebacks and fraud." },
  incrementalConversion: { label: "Incremental orders vs baseline", min: -30, max: 60, step: 1, unit: "%", help: "Extra (or lost) orders this channel brings compared with the retailer's own site." },
  repeatRate: { label: "Repeat purchase rate", min: 0, max: 90, step: 1, unit: "%", help: "Share of new customers who come back through the same relationship." },
  retention: { label: "Retention of repeaters", min: 0, max: 95, step: 1, unit: "%", help: "Chance a repeat customer keeps coming back each further period." },
};

export interface ValueSlice { who: "brand" | "retailer" | "platform" | "ads" | "payments" | "agent" | "logistics" | "losses"; label: string; value: number }

export interface ValueFlow {
  slices: ValueSlice[]; // sums to 100 when retailer contribution >= 0
  perOrderMargin: number; // contribution of a repeat order (no CAC)
  firstOrderContribution: number; // includes CAC
  expectedOrders: number;
  lifetimeContribution: number;
  volumeAdjusted: number; // lifetime × (1 + incremental)
}

export function valueFlow(p: EconParams): ValueFlow {
  const variable = p.takeRate + p.placementFee + p.payment + p.agentFee + p.fulfillment + p.returnsFraud;
  const perOrderMargin = p.grossMargin - variable;
  const firstOrderContribution = perOrderMargin - p.cac;
  // Geometric series: each order is followed by another with probability r.
  const r = Math.min(0.95, Math.max(0, (p.repeatRate / 100) * (p.retention / 100)));
  const expectedOrders = 1 + (p.repeatRate / 100) / (1 - r);
  const lifetimeContribution = perOrderMargin * expectedOrders - p.cac;
  const volumeAdjusted = lifetimeContribution * (1 + p.incrementalConversion / 100);
  const slices: ValueSlice[] = [
    { who: "brand", label: "Brand / cost of goods", value: 100 - p.grossMargin },
    { who: "platform", label: "Marketplace / platform", value: p.takeRate },
    { who: "ads", label: "Ads, placement & acquisition", value: p.placementFee + p.cac },
    { who: "agent", label: "Agent / orchestration", value: p.agentFee },
    { who: "payments", label: "Payments", value: p.payment },
    { who: "logistics", label: "Fulfillment", value: p.fulfillment },
    { who: "losses", label: "Returns & fraud", value: p.returnsFraud },
    { who: "retailer", label: "Retailer contribution", value: firstOrderContribution },
  ];
  return { slices, perOrderMargin, firstOrderContribution, expectedOrders, lifetimeContribution, volumeAdjusted };
}

/* ── Visualization H / section 03: adoption scenario lab ───── */

export interface AdoptionParams {
  scope: number; // % of retail sales in categories where agent execution is plausible
  merchantAccess: number; // % of that spend at merchants agents can transact with
  reliability: number; // % of agent-attempted purchases completed correctly
  delegation: number; // % of eligible purchases consumers let an agent execute
  trust: number; // 0–100 index: speed at which delegation spreads
  repeat: number; // 0–100 index: share of agent buyers who repeat
}

export interface AdoptionCurve { ceiling: number; k: number; midpoint: number; points: { year: number; pct: number }[] }

/**
 * L(t)     = 1 / (1 + e^(−k (t − midpoint)))
 * share(t) = ceiling × (L(t) − L(2025)) / (1 − L(2025))   (starts at 0 in 2025)
 * ceiling  = scope × merchantAccess × reliability × delegation
 * k        = 0.15 + 0.35·trust + 0.15·repeat   (per year; trust/repeat as 0–1)
 * midpoint = 2029 + 9·(1 − trust)
 * Output: illustrative % of US retail sales executed (not just influenced) by an agent.
 */
export function adoptionCurve(p: AdoptionParams, from = 2025, to = 2035): AdoptionCurve {
  const ceiling = (p.scope / 100) * (p.merchantAccess / 100) * (p.reliability / 100) * (p.delegation / 100) * 100;
  const t = p.trust / 100;
  const k = 0.15 + 0.35 * t + 0.15 * (p.repeat / 100);
  const midpoint = 2029 + 9 * (1 - t);
  const points: { year: number; pct: number }[] = [];
  const L = (y: number) => 1 / (1 + Math.exp(-k * (y - midpoint)));
  const l0 = L(from);
  for (let i = 0; i <= (to - from) * 4; i++) {
    const y = from + i / 4;
    points.push({ year: y, pct: ceiling * (L(y) - l0) / (1 - l0) });
  }
  return { ceiling, k, midpoint, points };
}

export const SCENARIO_PRESETS: Record<"conservative" | "base" | "transformative", { label: string; blurb: string; params: AdoptionParams }> = {
  conservative: {
    label: "Conservative",
    blurb: "AI stays mainly a discovery and decision-support layer; few purchases are executed by agents.",
    params: { scope: 50, merchantAccess: 40, reliability: 70, delegation: 10, trust: 25, repeat: 20 },
  },
  base: {
    label: "Base",
    blurb: "Agent-assisted transactions become common, but meaningful purchases stay consumer-approved.",
    params: { scope: 60, merchantAccess: 70, reliability: 85, delegation: 25, trust: 50, repeat: 45 },
  },
  transformative: {
    label: "Transformative",
    blurb: "Delegated, recurring and increasingly autonomous purchasing becomes mainstream behavior.",
    params: { scope: 70, merchantAccess: 90, reliability: 95, delegation: 50, trust: 75, repeat: 70 },
  },
};

export function valueAt(curve: AdoptionCurve, year: number): number {
  const p = curve.points.reduce((best, x) => (Math.abs(x.year - year) < Math.abs(best.year - year) ? x : best), curve.points[0]);
  return p.pct;
}
