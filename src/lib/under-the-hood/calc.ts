/**
 * Calculation utilities for the S-1 teardown. Pure functions only; every
 * input is a disclosed figure from data.ts or an explicit, labelled assumption.
 * $ amounts are in millions unless a function says otherwise.
 */
import { COMMITMENTS, CUSTOMERS, SCENARIOS, TABLES, type ScenarioParams } from "./data";

const Q = TABLES.s1a.quarterly_pnl;
const QA = TABLES.s1a.quarterly_adjusted_operating_income;
const QN = TABLES.s1a.quarterly_adjusted_net_income;

export const ratio = (a: number, b: number) => (b === 0 ? NaN : a / b);
export const growth = (cur: number, prev: number) => (prev === 0 ? NaN : cur / prev - 1);
export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export interface QuarterRow {
  q: string;
  revenue: number;
  compute: number;
  personnel: number;
  bartz: number;
  sm: number;
  otherOpex: number;
  totalOpex: number;
  opIncome: number;
  interest: number;
  fvNotes: number;
  otherIncome: number;
  tax: number;
  netLoss: number;
  sbc: number;
  donation: number;
  adjOpIncome: number;
  mtm: number;
  taxAdj: number;
  adjNetIncome: number;
  // derived
  qoq: number | null;
  yoy: number | null;
  add: number | null;
  annualized: number;
  computePct: number;
  revPerCompute: number;
  opMargin: number;
  adjMargin: number;
  computeYoy: number | null;
}

/** Seven reported quarters, Q1 2025 – Q3 2026 (S-1/A quarterly table). */
export function quarterly(): QuarterRow[] {
  const cols = TABLES.s1a.quarterly_columns;
  const rows: QuarterRow[] = cols.map((q, i) => {
    const revenue = Q["Revenue"][i];
    const compute = Q["Compute and infrastructure"][i];
    const opIncome = Q["Operating income (loss)"][i];
    const adjOpIncome = QA["Adjusted Operating Income (Loss)"][i];
    return {
      q,
      revenue,
      compute,
      personnel: Q["Personnel"][i],
      bartz: Q["Bartz settlement"][i],
      sm: Q["Sales, marketing, and partnerships"][i],
      otherOpex: Q["Other operating and administrative"][i],
      totalOpex: Q["Total operating expenses"][i],
      opIncome,
      interest: Q["Interest income"][i],
      fvNotes: Q["Change in fair value of convertible notes"][i],
      otherIncome: Q["Other income (expense), net"][i],
      tax: Q["Provision for income taxes"][i],
      netLoss: Q["Net loss"][i],
      sbc: QA["Stock-based compensation expense"][i],
      donation: QA["Non-cash charitable contributions"][i],
      adjOpIncome,
      mtm: QN["Change in fair value of certain mark-to- market"][i],
      taxAdj: QN["Income tax effects and adjustments"][i],
      adjNetIncome: QN["Adjusted Net Income (Loss)"][i],
      qoq: null,
      yoy: null,
      add: null,
      annualized: revenue * 4,
      computePct: ratio(compute, revenue),
      revPerCompute: ratio(revenue, compute),
      opMargin: ratio(opIncome, revenue),
      adjMargin: ratio(adjOpIncome, revenue),
      computeYoy: null,
    };
  });
  rows.forEach((r, i) => {
    if (i > 0) {
      r.qoq = growth(r.revenue, rows[i - 1].revenue);
      r.add = r.revenue - rows[i - 1].revenue;
    }
    if (i >= 4) {
      r.yoy = growth(r.revenue, rows[i - 4].revenue);
      r.computeYoy = growth(r.compute, rows[i - 4].compute);
    }
  });
  return rows;
}

/** Annual / year-to-date P&L columns (FY2023, FY2024, FY2025, 9M2025, 9M2026). */
export function annual() {
  const a = TABLES.s1a.annual_pnl;
  const adj = TABLES.s1a.annual_adjusted_operating_income;
  const f = TABLES.s1a.functional_opex;
  return TABLES.s1a.annual_columns.map((p, i) => ({
    period: p,
    revenue: a["Revenue"][i],
    compute: a["Compute and infrastructure"][i],
    opLoss: a["Operating loss"][i],
    netLoss: a["Net loss"][i],
    sbc: adj["Stock-based compensation expense"][i],
    donation: adj["Non-cash charitable contributions"][i],
    bartz: adj["Bartz settlement"][i],
    adjOpIncome: adj["Adjusted Operating Income (Loss)"][i],
    costOfRevenue: f["Cost of revenue"][i],
    rnd: f["Research and development"][i],
    salesMarketing: f["Sales and marketing"][i],
    gna: f["General and administrative"][i],
    impliedGrossMargin: 1 - f["Cost of revenue"][i] / a["Revenue"][i],
    servingShareMax: f["Cost of revenue"][i] / a["Compute and infrastructure"][i],
  }));
}

export const TTM_REVENUE_SEP26 = (() => {
  const r = quarterly();
  return sum(r.slice(3).map((x) => x.revenue)); // Q4'25 + Q1–Q3'26
})();

/* ------------------------------------------------------------------ bridge */
export type BridgePeriod = "Q2 2026" | "Q3 2026" | "9M 2026";
export interface BridgeToggles {
  sbc: boolean;
  donation: boolean;
  fairValue: boolean;
  shortTermPremium: boolean;
}
export interface BridgeStep {
  label: string;
  value: number;
  kind: "total" | "delta";
  note: string;
  classification: "reported" | "calculated" | "assumption";
}

/**
 * Revenue → adjusted operating income → GAAP operating income → GAAP net income.
 * Toggles remove an adjustment so the user can see each item's weight.
 * The optional short-term premium step is an ASSUMPTION (premium multiple).
 */
export function profitabilityBridge(period: BridgePeriod, t: BridgeToggles, premium = 1.6): BridgeStep[] {
  const rows = quarterly();
  const pick = (q: string) => rows.find((r) => r.q === q)!;
  let rev: number, compute: number, sbc: number, donation: number, bartz: number, opInc: number;
  let interest: number, fv: number, otherInc: number, tax: number, net: number, shortTerm = 0;
  if (period === "9M 2026") {
    const a = annual()[4];
    const p = TABLES.s1a.annual_pnl;
    rev = a.revenue; compute = a.compute; sbc = a.sbc; donation = a.donation; bartz = 0; opInc = a.opLoss;
    interest = p["Interest income"][4]; fv = p["Change in fair value of convertible notes"][4];
    otherInc = p["Other income (expense), net"][4]; tax = p["Provision for income taxes"][4]; net = a.netLoss;
    shortTerm = 6500;
  } else {
    const r = pick(period);
    rev = r.revenue; compute = r.compute; sbc = r.sbc; donation = r.donation; bartz = r.bartz; opInc = r.opIncome;
    interest = r.interest; fv = r.fvNotes; otherInc = r.otherIncome; tax = r.tax; net = r.netLoss;
    shortTerm = period === "Q3 2026" ? 5000 : 0;
  }
  const adjOI = opInc + sbc + donation + bartz;
  const otherCash = rev - compute - adjOI; // non-compute opex excluding SBC, donation, Bartz
  const steps: BridgeStep[] = [
    { label: "Revenue", value: rev, kind: "total", note: "Recognized GAAP revenue", classification: "reported" },
    { label: "Compute & infrastructure", value: -compute, kind: "delta", note: shortTerm ? `Includes $${(shortTerm / 1000).toFixed(1)}B of short-term compute` : "Committed compute delivered", classification: "reported" },
    { label: "Other operating costs (cash basis)", value: -otherCash, kind: "delta", note: "Personnel ex-SBC, sales & marketing incl. channel fees, G&A ex-donations", classification: "calculated" },
    { label: "Adjusted operating income", value: adjOI, kind: "total", note: "Non-GAAP: excludes SBC, non-cash charitable contributions, Bartz", classification: "reported" },
  ];
  if (t.shortTermPremium && shortTerm > 0) {
    const excess = shortTerm * (1 - 1 / premium);
    steps.splice(4, 0, { label: `Ex short-term premium (assumes ${premium.toFixed(1)}×)`, value: adjOI + excess, kind: "total", note: "Illustrative: what adjusted OI would be if short-term compute had cost the same as committed compute", classification: "assumption" });
  }
  if (t.sbc) steps.push({ label: "Stock-based compensation", value: -sbc, kind: "delta", note: "Non-cash, recurring economic cost (dilution)", classification: "reported" });
  if (t.donation) steps.push({ label: "Donation matching (non-cash)", value: -donation, kind: "delta", note: "Share-settled match of employee pledges; scales with share price", classification: "reported" });
  if (bartz) steps.push({ label: "Bartz settlement", value: -bartz, kind: "delta", note: "One-time copyright settlement", classification: "reported" });
  const gaapOI = adjOI - (t.sbc ? sbc : 0) - (t.donation ? donation : 0) - bartz;
  steps.push({ label: t.sbc && t.donation ? "GAAP operating income" : "Operating income (partial adjustments)", value: gaapOI, kind: "total", note: "", classification: t.sbc && t.donation ? "reported" : "calculated" });
  steps.push({ label: "Interest income", value: interest, kind: "delta", note: "On cash and short-term investments", classification: "reported" });
  if (t.fairValue) {
    steps.push({ label: "Fair-value changes (notes, derivatives, SAFEs)", value: fv, kind: "delta", note: "Non-cash; rises with Anthropic's valuation", classification: "reported" });
    steps.push({ label: "Other income (expense), incl. partner-financing marks", value: otherInc, kind: "delta", note: "Mostly non-cash fair-value recognition", classification: "reported" });
  }
  steps.push({ label: "Income taxes", value: -tax, kind: "delta", note: "", classification: "reported" });
  const net2 = gaapOI + interest + (t.fairValue ? fv + otherInc : 0) - tax;
  steps.push({ label: t.fairValue && t.sbc && t.donation ? "GAAP net income (loss)" : "Net income (partial adjustments)", value: t.fairValue && t.sbc && t.donation ? net : net2, kind: "total", note: "", classification: t.fairValue && t.sbc && t.donation ? "reported" : "calculated" });
  return steps;
}

/* ----------------------------------------------------------- compute model */
export interface ComputeSimInputs {
  volumeGrowth: number; // usage growth next quarter
  priceChange: number; // change in price per unit of usage
  efficiency: number; // reduction in compute per unit of work
  intensity: number; // change in compute per unit of usage from heavier agentic workloads
  utilization: number; // share of paid committed capacity actually used (0–1]
  shortTermShare: number; // share of compute CAPACITY bought on short-term terms
  premium: number; // next-quarter short-term price multiple vs committed
}

/** Assumed Q3 2026 short-term premium (not disclosed: 'significantly more'). */
export const BASE_PREMIUM = 1.6;
const Q3_LONG_TERM_EQUIV = 9863 - 5000 + 5000 / BASE_PREMIUM; // Q3 compute at committed prices
export const Q3_SHORT_TERM_CAPACITY_SHARE = 5000 / BASE_PREMIUM / Q3_LONG_TERM_EQUIV;

export const COMPUTE_SIM_DEFAULTS: ComputeSimInputs = {
  volumeGrowth: 0, priceChange: 0, efficiency: 0, intensity: 0, utilization: 1,
  shortTermShare: Q3_SHORT_TERM_CAPACITY_SHARE, premium: BASE_PREMIUM,
};

/** Q3 2026 non-compute opex on an adjusted (cash) basis as a share of revenue. */
export const Q3_OTHER_CASH_PCT = (() => {
  const r = quarterly()[6];
  return (r.revenue - r.compute - r.adjOpIncome) / r.revenue;
})();

/**
 * One-quarter-forward illustrative model starting from Q3 2026 actuals.
 * Q3 compute is restated at committed prices (L0) using the assumed Q3 premium;
 * next-quarter capacity needed = L0 × usage × intensity ÷ efficiency ÷ utilization,
 * with the short-term share of capacity priced at the chosen premium.
 * Defaults reproduce Q3 exactly.
 */
export function computeSim(i: ComputeSimInputs) {
  const q3 = quarterly()[6];
  const work = (1 + i.volumeGrowth) * (1 + i.intensity) / (1 + i.efficiency);
  const needed = Q3_LONG_TERM_EQUIV * work / Math.max(0.05, i.utilization);
  const c = i.shortTermShare;
  const compute = needed * ((1 - c) + c * i.premium);
  const revenue = q3.revenue * (1 + i.volumeGrowth) * (1 + i.priceChange);
  const other = revenue * Q3_OTHER_CASH_PCT;
  const adjOI = revenue - compute - other;
  return { revenue, compute, computePct: compute / revenue, revPerCompute: revenue / compute, adjMargin: adjOI / revenue, adjOI };
}

/** Tornado: margin impact of moving each input to a low/high value. */
export function computeTornado(base: ComputeSimInputs) {
  const b = computeSim(base).adjMargin;
  const vary: { key: keyof ComputeSimInputs; label: string; lo: number; hi: number; fmt: (v: number) => string }[] = [
    { key: "volumeGrowth", label: "Usage growth", lo: -0.1, hi: 0.4, fmt: pctFmt },
    { key: "priceChange", label: "Price change", lo: -0.2, hi: 0.05, fmt: pctFmt },
    { key: "efficiency", label: "Efficiency gain", lo: 0, hi: 0.3, fmt: pctFmt },
    { key: "intensity", label: "Agentic intensity", lo: 0, hi: 0.3, fmt: pctFmt },
    { key: "utilization", label: "Utilization", lo: 0.7, hi: 1, fmt: pctFmt },
    { key: "shortTermShare", label: "Short-term capacity share", lo: 0, hi: 0.6, fmt: pctFmt },
    { key: "premium", label: "Short-term premium", lo: 1.2, hi: 2.5, fmt: (v) => `${v.toFixed(1)}×` },
  ];
  return vary.map((v) => {
    const lo = computeSim({ ...base, [v.key]: v.lo }).adjMargin - b;
    const hi = computeSim({ ...base, [v.key]: v.hi }).adjMargin - b;
    return { label: v.label, lo, hi, loLabel: v.fmt(v.lo), hiLabel: v.fmt(v.hi) };
  }).sort((a, b2) => Math.max(Math.abs(b2.lo), Math.abs(b2.hi)) - Math.max(Math.abs(a.lo), Math.abs(a.hi)));
}
const pctFmt = (v: number) => `${Math.round(v * 100)}%`;

/* --------------------------------------------------------------------- NRR */
export interface NrrCohort { label: string; customers: number; baseSpend: number; multiple: number }

/** Dollar-weighted NRR = Σ current ÷ Σ base, as Anthropic defines it. */
export function nrr(cohorts: NrrCohort[], minBase = 0) {
  const eligible = cohorts.filter((c) => c.baseSpend >= minBase && c.customers > 0);
  const base = sum(eligible.map((c) => c.customers * c.baseSpend));
  const cur = sum(eligible.map((c) => c.customers * c.baseSpend * c.multiple));
  const contrib = eligible.map((c) => ({ label: c.label, base: c.customers * c.baseSpend, current: c.customers * c.baseSpend * c.multiple }));
  return { nrr: base ? cur / base : NaN, base, current: cur, contrib };
}

/**
 * Bounds on how much of Q3 2026 revenue came from the NRR cohort.
 * Base ≤ Q3 2025 revenue; base ≥ Q3 2025 revenue − all 9M 2025 subscription
 * revenue (a loose proxy for Pro/Max/Ultra exclusions). NRR assumed 850–950%.
 */
export function nrrCohortBounds() {
  const q = quarterly();
  const q3_25 = q[2].revenue;
  const subs9m25 = TABLES.s1a.revenue_by_type["Subscription-based"][3];
  const baseHi = q3_25, baseLo = q3_25 - subs9m25;
  const cur = q[6].revenue;
  const lo = baseLo * 8.5, hi = baseHi * 9.5;
  return { baseLo, baseHi, cohortLo: lo, cohortHi: Math.min(hi, cur), shareLo: lo / cur, shareHi: Math.min(1, hi / cur), q3Revenue: cur };
}

/* ------------------------------------------------------- obligation profile */
export interface ObligationYear { year: number; table: number; other: number; total: number }

/**
 * ILLUSTRATIVE annual obligation schedule ($M). Uses the disclosed by-year
 * contractual table for its $320B and spreads the other buckets ($575.4B) so
 * the schedule reproduces three disclosed anchors exactly: total $895.4B,
 * $447.5B before 2031 and $69.8B in the 12 months after Sep 30, 2026.
 * Timing assumptions are documented in /research/assumptions-and-limitations.md.
 */
export function obligationProfile(): ObligationYear[] {
  const t = COMMITMENTS.tableByYear.total; // 2026Q4, 2027..2030, thereafter
  const agg = COMMITMENTS.aggregate;
  const tableThru2030 = sum(t.slice(0, 5));
  const otherBefore2031 = agg.before2031 - tableThru2030;
  const q4Other = 9000; // assumption: mostly short-term minimums in Q4 2026
  const next12FromTable = t[0] + 0.75 * t[1];
  const y2027Other = (agg.next12Months - next12FromTable - q4Other) / 0.75;
  const flatOther = (otherBefore2031 - q4Other - y2027Other) / 3;
  const thereafter = t[5];
  const tw = [0.3, 0.25, 0.2, 0.12, 0.08, 0.05];
  const otherAfter = agg.total - agg.before2031 - thereafter;
  const lead = [60000, 45000, 30000];
  const tail = (otherAfter - sum(lead)) / 12;
  const out: ObligationYear[] = [];
  const push = (year: number, table: number, other: number) => out.push({ year, table, other, total: table + other });
  push(2026, t[0], q4Other);
  push(2027, t[1], y2027Other);
  push(2028, t[2], flatOther);
  push(2029, t[3], flatOther);
  push(2030, t[4], flatOther);
  for (let i = 0; i < 15; i++) push(2031 + i, i < 6 ? thereafter * tw[i] : 0, i < 3 ? lead[i] : tail);
  return out;
}

export function commitmentBucketsTotal() {
  return sum(COMMITMENTS.buckets.map((b) => b.amount));
}

/* ----------------------------------------------------------- scenario lab */
export interface ScenarioQuarter {
  label: string; year: number; revenue: number; required: number; committed: number; compute: number;
  utilization: number; margin: number; fcf: number; liquidity: number; projected: true;
}
export interface ScenarioYear {
  year: number; revenue: number; compute: number; committed: number; required: number; utilization: number;
  margin: number; fcf: number; liquidityEnd: number; coverage: number; growth: number | null;
}

/**
 * Quarterly projection Q4 2026 – Q4 2030 from Q3 2026 actuals. Every parameter
 * is an assumption (see scenarios.json). Not a forecast and not guidance.
 */
export function runScenario(p: ScenarioParams) {
  const base = SCENARIOS._meta.base;
  const prof = obligationProfile();
  const contingentCut = p.exitContingent ? base.contingentShare : 0;
  const L0 = base.compute - base.shortTerm + base.shortTerm / p.premium;
  const serving0 = p.servingShare * L0;
  const research0 = (1 - p.servingShare) * L0;
  let liquidity = base.liquidity + (p.partnerFinancing ? base.partnerFinancing : 0) + p.ipoProceeds;
  let revIdx = 1, priceIdx = 1, effIdx = 1, q = 0;
  const quarters: ScenarioQuarter[] = [];
  for (let year = 2026; year <= 2030; year++) {
    const qs = year === 2026 ? [4] : [1, 2, 3, 4];
    const yr = prof.find((x) => x.year === year)!;
    for (const qq of qs) {
      q += 1;
      const g = p.g0 * Math.pow(p.decay, q - 1);
      revIdx *= 1 + g;
      priceIdx *= Math.pow(1 + p.priceChange, 0.25);
      effIdx *= Math.pow(1 + p.efficiency, 0.25);
      const revenue = base.revenue * revIdx;
      const usage = revIdx / priceIdx;
      const required = serving0 * usage / effIdx + research0 * Math.pow(1 + p.researchGrowth, q / 4);
      const cut = year >= 2028 ? contingentCut : 0; // termination rights assumed exercisable from 2028
      const committed = (yr.total * (1 - cut)) / (year === 2026 ? 1 : 4);
      const compute = committed + Math.max(0, required - committed) * p.premium;
      const fcf = revenue * (1 - p.otherOpex) - compute;
      liquidity += fcf;
      quarters.push({
        label: `Q${qq} ${year}`, year, revenue, required, committed, compute,
        utilization: Math.min(1, required / committed), margin: 1 - compute / revenue - p.otherOpex, fcf, liquidity, projected: true,
      });
    }
  }
  const years: ScenarioYear[] = [];
  for (let year = 2027; year <= 2030; year++) {
    const qs = quarters.filter((x) => x.year === year);
    const revenue = sum(qs.map((x) => x.revenue));
    const compute = sum(qs.map((x) => x.compute));
    const committed = sum(qs.map((x) => x.committed));
    const required = sum(qs.map((x) => x.required));
    const prev = years[years.length - 1];
    years.push({
      year, revenue, compute, committed, required, utilization: Math.min(1, required / committed),
      margin: 1 - compute / revenue - p.otherOpex, fcf: sum(qs.map((x) => x.fcf)),
      liquidityEnd: qs[qs.length - 1].liquidity, coverage: revenue / committed,
      growth: prev ? revenue / prev.revenue - 1 : null,
    });
  }
  const minLiquidity = Math.min(...quarters.map((x) => x.liquidity));
  const breach = quarters.find((x) => x.liquidity < 5000);
  return { quarters, years, minLiquidity, covenantBreach: breach ? breach.label : null };
}

/** QoQ growth needed for the next four quarters' revenue to cover next-12-month obligations at a compute ratio. */
export function impliedQuarterlyGrowth(computeRatio: number) {
  const target = COMMITMENTS.aggregate.next12Months / computeRatio;
  const r0 = quarterly()[6].revenue;
  let lo = -0.5, hi = 2;
  for (let k = 0; k < 80; k++) {
    const g = (lo + hi) / 2;
    const x = 1 + g;
    const s = r0 * (x + x * x + x ** 3 + x ** 4);
    if (s > target) hi = g; else lo = g;
  }
  return (lo + hi) / 2;
}

/* ------------------------------------------------------------- customers */
export function customerTierSummary() {
  const ttm = TTM_REVENUE_SEP26;
  const tiers = CUSTOMERS.tiers;
  const c100k = tiers.find((t) => t.id === "100k")!;
  return {
    ttm,
    avgPer100k: (c100k.revenue ?? 0) / c100k.count,
    tailRevenue: ttm - (c100k.revenue ?? 0),
    tailAvg: (ttm - (c100k.revenue ?? 0)) / tiers.find((t) => t.id === "tail")!.count,
  };
}
