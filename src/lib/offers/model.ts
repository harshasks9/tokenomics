/**
 * Offers — GenAI commercial pricing model.
 *
 * Every number on the site comes from this file. Pure functions, no React, no
 * side effects, no `any`. See docs/offers.md for the prose spec.
 *
 * Units: all money is $K per month unless a name says otherwise.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** List price, $K per GSU per month (list $2,400). The legacy anchor. */
export const P_LIST = 2.4;

/** GSU commitment terms. Longer term, lower unit price. */
export type GsuTerm = "1m" | "3m" | "1y";

/**
 * GSU unit price ($K/GSU/month) by commitment term.
 *
 * ASSUMPTION — the brief gives three terms (1 month, 3 months, 1 year) but only
 * two prices ($2,400 and $2,100). List price is fixed at $2,400 (§4.1), and a
 * commitment earns a discount, so the sub-year terms sit at list and the 1-year
 * term takes the $2,100 rate (−12.5%). If that reading is wrong, this table is
 * the single place to change it.
 */
export const GSU_TERM_PRICE: Record<GsuTerm, number> = {
  "1m": 2.4,
  "3m": 2.4,
  "1y": 2.1,
};

export const GSU_TERM_LABEL: Record<GsuTerm, string> = {
  "1m": "1 month",
  "3m": "3 months",
  "1y": "1 year",
};

/** FSP discount options — anchored: 10% (1Y) / 20% (3Y). */
export const FSP_OPTIONS = [0, 0.1, 0.2] as const;

/** Serving-tier multipliers, anchored to Standard PayGo = 1.0x. */
export const TIER_MULTIPLIER = {
  priorityPayGo: 1.8,
  standardPayGo: 1.0,
  provisionedThroughput: 1.0, // at 100% utilization
  offPeak: 0.5,
  flex: 0.5,
  deferred: 0.5,
  batch: 0.5,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Inputs
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkloadMix {
  /** Baseload share → Provisioned Throughput. */
  wb: number;
  /** Spike share → protected PayGo (1.0x, via Buy One PT Get One PayGo). */
  ws: number;
  /** Off-peak-eligible share (0.5x). */
  wo: number;
  /** Deferred-agents share (0.5x on tokens). */
  wd: number;
  /** Batch share (0.5x). */
  wbt: number;
}

export interface Levers {
  /** Legacy peak-sized GSU count. 100–5000. */
  n0: number;
  /** Legacy utilization. 0.35–0.90. */
  u0: number;
  /** Right-sized PT utilization (p50 + protected PayGo). 0.60–0.98. */
  u1: number;
  /** Raw workload mix — normalized before use. */
  mix: WorkloadMix;
  /** Agent harness fee share within Deferred, billed at 1.0x. 0–0.50. */
  h: number;
  /** FSP discount. 0 | 0.10 | 0.20. */
  d: number;
  /** GSU commitment term — sets the GSU unit price. */
  term: GsuTerm;
  /** GCP commit discount applied to GSU pricing. 0–0.30. */
  gcp: number;
  /** GSU Q3 offer: incremental discount on GSU spend. 0–0.30. */
  inc: number;
  /** GSU Q3 offer: credits as a share of GSU spend. 0–0.20. */
  cr: number;
}

export const DEFAULT_LEVERS: Levers = {
  n0: 1000,
  u0: 0.55,
  u1: 0.85,
  mix: { wb: 0.55, ws: 0.07, wo: 0.18, wd: 0.14, wbt: 0.06 },
  h: 0.15,
  d: 0.2,
  term: "1m",
  gcp: 0,
  inc: 0,
  cr: 0,
};

export const LEVER_RANGES = {
  n0: { min: 100, max: 5000, step: 50 },
  u0: { min: 0.35, max: 0.9, step: 0.01 },
  u1: { min: 0.6, max: 0.98, step: 0.01 },
  mixShare: { min: 0, max: 1, step: 0.01 },
  h: { min: 0, max: 0.5, step: 0.01 },
  gcp: { min: 0, max: 0.3, step: 0.01 },
  inc: { min: 0, max: 0.3, step: 0.01 },
  cr: { min: 0, max: 0.2, step: 0.01 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Mix normalization
// ─────────────────────────────────────────────────────────────────────────────

export const MIX_KEYS = ["wb", "ws", "wo", "wd", "wbt"] as const;
export type MixKey = (typeof MIX_KEYS)[number];

/**
 * Shares auto-normalize: w_i ← w_i / Σw. A zero-sum mix degenerates to
 * all-baseload, which keeps the model defined rather than dividing by zero.
 */
export function normalizeMix(mix: WorkloadMix): WorkloadMix {
  const total = MIX_KEYS.reduce((sum, key) => sum + Math.max(0, mix[key]), 0);
  if (total <= 0) return { wb: 1, ws: 0, wo: 0, wd: 0, wbt: 0 };
  return {
    wb: Math.max(0, mix.wb) / total,
    ws: Math.max(0, mix.ws) / total,
    wo: Math.max(0, mix.wo) / total,
    wd: Math.max(0, mix.wd) / total,
    wbt: Math.max(0, mix.wbt) / total,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Output shape
// ─────────────────────────────────────────────────────────────────────────────

export type StepId =
  | "legacy"
  | "rightsize"
  | "offpeak"
  | "deferred"
  | "fsp"
  | "gsu"
  | "incentives";

export type Accent = "gold" | "blue" | "green" | "fsp" | "teal";

export interface Step {
  id: StepId;
  /** 0 for legacy, then 1..6. */
  index: number;
  label: string;
  /** Plain-language mechanic with the live parameter values interpolated. */
  mechanic: string;
  /** Remaining monthly cost after this step, $K. */
  value: number;
  /** Change vs. the previous step, $K. Negative = saving. */
  delta: number;
  /** Cumulative saving vs. legacy, as a fraction of C0. */
  cumulativeSavingPct: number;
  accent: Accent;
}

export interface Attribution {
  /** C0 − S1: stop paying for idle reserved capacity. */
  utilization: number;
  /** S1 − S3: move work onto 0.5x tiers. */
  placement: number;
  /** S3 − S4: FSP commitment wrapper. */
  fsp: number;
  /** S4 − S5: GSU term price + GCP commit discount. */
  gsuCommit: number;
  /** S5 − S6: Q3 incremental discount + credits. */
  incentives: number;
  /** Sum of the five, i.e. C0 − final. May be negative if u1 < u0. */
  total: number;
}

export interface ModelResult {
  /** Normalized workload mix actually used. */
  mix: WorkloadMix;
  /** Consumed GSU-equivalents. */
  v: number;
  /** Legacy monthly cost, $K. */
  c0: number;
  /** P·V — the reference spend at 1.0x on consumed volume. */
  pv: number;
  /** 1/u0 — what the legacy estate actually pays per consumed GSU. */
  legacyMultiplier: number;
  /** Deferred honesty term: 0.5 + 0.5h. */
  defMult: number;

  s1: number;
  s2: number;
  s3: number;
  s4: number;
  s5: number;
  s6: number;
  /** Final monthly portfolio cost, $K (=== s6). */
  final: number;

  /** GSU/PT spend line at each stage, $K — what the GSU levers act on. */
  gsu: {
    atList: number;
    afterFsp: number;
    afterCommit: number;
    afterIncremental: number;
    credits: number;
    /** Effective GSU unit price after term + commit + incremental, $K. */
    effectiveUnitPrice: number;
    /** Right-sized GSU count actually committed. */
    units: number;
    /** Which discount won the non-stacking test: 'fsp' | 'gcp' | 'none'. */
    appliedDiscount: "fsp" | "gcp" | "none";
    appliedDiscountRate: number;
  };

  blendedMultiplier: number;
  savingPct: number;
  /** Annualized saving, $K. */
  annualSave: number;

  steps: Step[];
  attribution: Attribution;
}

// ─────────────────────────────────────────────────────────────────────────────
// The model
// ─────────────────────────────────────────────────────────────────────────────

const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
const money = (x: number) => `$${Math.round(x).toLocaleString("en-US")}K`;

export function computeModel(levers: Levers): ModelResult {
  const mix = normalizeMix(levers.mix);
  const { wb, ws, wo, wd, wbt } = mix;
  const { n0, u0, u1, h, d, term, gcp, inc, cr } = levers;

  // Guard against a zero denominator; the UI never allows these, but the model
  // is a public API and must stay total.
  const safeU0 = u0 > 0 ? u0 : 0.01;
  const safeU1 = u1 > 0 ? u1 : 0.01;

  const v = n0 * safeU0;
  const c0 = n0 * P_LIST;
  const pv = P_LIST * v;
  const legacyMultiplier = 1 / safeU0;

  // Step 1 — right-size PT to baseload, protected PayGo for spikes (BOGO).
  // Everything not on PT lands at 1.0x for now; steps 2–3 place it.
  const ptAtList = pv * (wb / safeU1);
  const payGoAtOne = pv * (ws + wo + wd + wbt);
  const s1 = ptAtList + payGoAtOne;

  // Step 2 — off-peak placement: the off-peak share halves.
  const s2 = s1 - pv * wo * 0.5;

  // Step 3 — deferred + batch. Deferred only halves inference tokens; the
  // harness share h stays at 1.0x, so the effective multiplier is 0.5 + 0.5h.
  const defMult = 0.5 + 0.5 * h;
  const s3 = s2 - pv * (wd * (1 - defMult) + wbt * 0.5);

  // Step 4 — FSP wrapper across the whole portfolio.
  const s4 = s3 * (1 - d);

  // Step 5 — GSU commitment term + GCP commit discount, on the GSU/PT line only.
  // FSP is non-stacking (on-demand rate is the ceiling), so the GSU line takes
  // the better of FSP and the GCP commit discount, never both.
  const gsuAfterFsp = ptAtList * (1 - d);
  const termFactor = GSU_TERM_PRICE[term] / P_LIST;
  const appliedDiscountRate = Math.max(d, gcp);
  const appliedDiscount: "fsp" | "gcp" | "none" =
    appliedDiscountRate === 0 ? "none" : gcp > d ? "gcp" : "fsp";
  const gsuAfterCommit = ptAtList * termFactor * (1 - appliedDiscountRate);
  const s5 = s4 - gsuAfterFsp + gsuAfterCommit;

  // Step 6 — GSU Q3 offer incentives: incremental discount, then credits.
  // Both are scoped to GSU spend, not the whole bill.
  const gsuAfterIncremental = gsuAfterCommit * (1 - inc);
  const credits = gsuAfterIncremental * cr;
  const s6 = s5 - (gsuAfterCommit - gsuAfterIncremental) - credits;

  const final = s6;
  const gsuUnits = safeU1 > 0 ? (v * wb) / safeU1 : 0;

  const blendedMultiplier = pv > 0 ? final / pv : 0;
  const savingPct = c0 > 0 ? 1 - final / c0 : 0;
  const annualSave = (c0 - final) * 12;

  const values: Array<{
    id: StepId;
    label: string;
    mechanic: string;
    value: number;
    accent: Accent;
  }> = [
    {
      id: "legacy",
      label: "Legacy",
      mechanic: `${n0.toLocaleString("en-US")} peak-sized GSUs at list, running at ${pct(u0)} utilization — an effective ${legacyMultiplier.toFixed(2)}x on every GSU actually consumed.`,
      value: c0,
      accent: "gold",
    },
    {
      id: "rightsize",
      label: "Right-size PT + BOGO",
      mechanic: `PT resized to the ${pct(wb)} baseload at ${pct(u1)} utilization; the remaining ${pct(ws + wo + wd + wbt)} moves to protected PayGo at 1.0x.`,
      value: s1,
      accent: "blue",
    },
    {
      id: "offpeak",
      label: "Off-peak",
      mechanic: `${pct(wo)} of volume is off-peak-eligible and reprices at 0.5x (weekdays 3–9 PM PT, Fri 3 PM–Sun 9 PM PT).`,
      value: s2,
      accent: "green",
    },
    {
      id: "deferred",
      label: "Deferred + Batch",
      mechanic: `${pct(wd)} deferred agents at ${defMult.toFixed(3)}x (0.5x tokens, ${pct(h)} harness at 1.0x) and ${pct(wbt)} batch at 0.5x.`,
      value: s3,
      accent: "green",
    },
    {
      id: "fsp",
      label: "FSP",
      mechanic:
        d > 0
          ? `Flexible Savings Plan: −${pct(d)} on all in-scope spend, monthly enforcement, dollar-fungible.`
          : "No FSP commitment — portfolio stays at on-demand rates.",
      value: s4,
      accent: "fsp",
    },
    {
      id: "gsu",
      label: "GSU commit",
      mechanic:
        termFactor < 1 || gcp > 0
          ? `${GSU_TERM_LABEL[term]} GSU term at $${(GSU_TERM_PRICE[term] * 1000).toLocaleString("en-US")}/GSU/mo${gcp > 0 ? `, GCP commit −${pct(gcp)}` : ""}. Non-stacking: the GSU line takes ${appliedDiscount === "gcp" ? "the GCP commit discount" : appliedDiscount === "fsp" ? "the FSP rate" : "no discount"}, not both.`
          : `${GSU_TERM_LABEL[term]} GSU term at list ($${(GSU_TERM_PRICE[term] * 1000).toLocaleString("en-US")}/GSU/mo), no GCP commit discount applied.`,
      value: s5,
      accent: "teal",
    },
    {
      id: "incentives",
      label: "Q3 incentives",
      mechanic:
        inc > 0 || cr > 0
          ? `GSU Q3 offer on ${money(gsuAfterCommit)} of GSU spend: incremental −${pct(inc)}${cr > 0 ? `, credits −${pct(cr)}` : ""}.`
          : "No Q3 incremental discount or credits applied.",
      value: s6,
      accent: "teal",
    },
  ];

  const steps: Step[] = values.map((step, i) => ({
    ...step,
    index: i,
    delta: i === 0 ? 0 : step.value - values[i - 1].value,
    cumulativeSavingPct: c0 > 0 ? 1 - step.value / c0 : 0,
  }));

  const attribution: Attribution = {
    utilization: c0 - s1,
    placement: s1 - s3,
    fsp: s3 - s4,
    gsuCommit: s4 - s5,
    incentives: s5 - s6,
    total: c0 - final,
  };

  return {
    mix,
    v,
    c0,
    pv,
    legacyMultiplier,
    defMult,
    s1,
    s2,
    s3,
    s4,
    s5,
    s6,
    final,
    gsu: {
      atList: ptAtList,
      afterFsp: gsuAfterFsp,
      afterCommit: gsuAfterCommit,
      afterIncremental: gsuAfterIncremental,
      credits,
      effectiveUnitPrice:
        gsuUnits > 0 ? (gsuAfterIncremental - credits) / gsuUnits : 0,
      units: gsuUnits,
      appliedDiscount,
      appliedDiscountRate,
    },
    blendedMultiplier,
    savingPct,
    annualSave,
    steps,
    attribution,
  };
}
