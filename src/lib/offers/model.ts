/**
 * Offers — GenAI commercial pricing model.
 *
 * SCOPE: this models **new GSU / PT capacity being ordered**, on an incremental
 * commit. Existing orders are not repriced and are not represented here.
 *
 * Every number on the site comes from this file. Pure functions, no React, no
 * side effects, no `any`. See docs/offers.md for the prose spec.
 *
 * Units: all money is $K per month unless a name says otherwise.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** List price, $K per GSU per month (list $2,400). The reference rate. */
export const P_LIST = 2.4;

/** GSU commitment terms. Longer term, lower unit price. */
export type GsuTerm = "1m" | "3m" | "1y";

/**
 * GSU unit price ($K/GSU/month) by commitment term.
 *
 * ASSUMPTION — the brief gives three terms (1 month, 3 months, 1 year) but only
 * two prices ($2,400 and $2,100). List price is fixed at $2,400, and a
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

/** Months of commitment per term — used for total contract value. */
export const GSU_TERM_MONTHS: Record<GsuTerm, number> = {
  "1m": 1,
  "3m": 3,
  "1y": 12,
};

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

/** Buy One PT Get One PayGo is offered from this committed GSU count up. */
export const BOGO_MIN_GSUS = 200;

// ── GSU Q3 offer ────────────────────────────────────────────────────────────

export type Q3Tier = "none" | "gsu500" | "gsu2000";

export interface Q3TierSpec {
  id: Q3Tier;
  label: string;
  /** Committed GSUs per month required to qualify. */
  minGsus: number;
  /** Maximum discount on GSU spend. */
  maxDiscount: number;
  /** Whether the discount is a fixed rate or a band up to maxDiscount. */
  fixed: boolean;
  /** Credits as a share of GSU spend. */
  credits: number;
  blurb: string;
}

export const Q3_TIERS: Q3TierSpec[] = [
  {
    id: "gsu2000",
    label: "2,000+ GSUs / month",
    minGsus: 2000,
    maxDiscount: 0.3,
    fixed: true,
    credits: 0.1,
    blurb: "Qualifies for a 30% discount plus 10% in credits.",
  },
  {
    id: "gsu500",
    label: "500+ GSUs / month",
    minGsus: 500,
    maxDiscount: 0.15,
    fixed: false,
    credits: 0.1,
    blurb: "Qualifies for up to a 15% discount plus 10% in credits.",
  },
];

/** The best tier a given committed GSU count qualifies for. */
export function qualifyingTier(committedGsus: number): Q3TierSpec | null {
  return Q3_TIERS.find((tier) => committedGsus >= tier.minGsus) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inputs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Which offers the customer is opting into. None of these are programmatic —
 * each is a deliberate election, so each is a checkbox rather than an
 * assumption baked into the model.
 */
export interface OfferElections {
  /** Buy One PT Get One PayGo — protected PayGo for spikes at 1.0x. */
  bogo: boolean;
  /** Off-peak PayGo at 0.5x. */
  offPeak: boolean;
  /** Deferred Agents API at 0.5x on tokens. */
  deferred: boolean;
  /** Batch at 0.5x. */
  batch: boolean;
  /** Flexible Savings Plan wrapper. */
  fsp: boolean;
  /** GSU Q3 offer — tier discount plus credits. */
  q3: boolean;
}

export interface WorkloadMix {
  /** Share of the new workload placed on Provisioned Throughput. */
  pt: number;
  /** Spike share — protected PayGo at 1.0x with BOGO, Priority 1.8x without. */
  spike: number;
  /** Off-peak-eligible share. */
  offPeak: number;
  /** Deferred-agents share. */
  deferred: number;
  /** Batch share. */
  batch: number;
}

export interface Levers {
  /** Peak-sized GSUs for the new capacity. 100–5000. */
  gsus: number;
  /** Utilization if the order were peak-sized. 0.35–0.90. */
  uPeak: number;
  /** Right-sized PT utilization (p50 coverage + protected PayGo). 0.60–0.98. */
  uPt: number;
  /** Raw workload mix — normalized before use. */
  mix: WorkloadMix;
  /** Agent harness fee share within Deferred, billed at 1.0x. 0–0.50. */
  harness: number;
  /** FSP discount when elected. 0.10 (1Y) | 0.20 (3Y). */
  fspRate: number;
  /** GSU commitment term — sets the GSU unit price. */
  term: GsuTerm;
  /** GCP commit discount applied to GSU pricing. 0–0.30. */
  gcpCommit: number;
  /** Q3 discount within the qualifying tier's band. 0–0.30. */
  q3Discount: number;
  offers: OfferElections;
}

export const DEFAULT_LEVERS: Levers = {
  gsus: 1000,
  uPeak: 0.55,
  uPt: 0.85,
  mix: { pt: 0.55, spike: 0.07, offPeak: 0.18, deferred: 0.14, batch: 0.06 },
  harness: 0.15,
  fspRate: 0.2,
  term: "1m",
  gcpCommit: 0,
  q3Discount: 0.15,
  offers: {
    bogo: true,
    offPeak: true,
    deferred: true,
    batch: true,
    fsp: true,
    q3: false,
  },
};

export const LEVER_RANGES = {
  gsus: { min: 100, max: 5000, step: 50 },
  uPeak: { min: 0.35, max: 0.9, step: 0.01 },
  uPt: { min: 0.6, max: 0.98, step: 0.01 },
  mixShare: { min: 0, max: 1, step: 0.01 },
  harness: { min: 0, max: 0.5, step: 0.01 },
  gcpCommit: { min: 0, max: 0.3, step: 0.01 },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Mix normalization
// ─────────────────────────────────────────────────────────────────────────────

export const MIX_KEYS = ["pt", "spike", "offPeak", "deferred", "batch"] as const;
export type MixKey = (typeof MIX_KEYS)[number];

/**
 * Shares auto-normalize: w_i ← w_i / Σw. A zero-sum mix degenerates to
 * all-PT, which keeps the model defined rather than dividing by zero.
 */
export function normalizeMix(mix: WorkloadMix): WorkloadMix {
  const total = MIX_KEYS.reduce((sum, key) => sum + Math.max(0, mix[key]), 0);
  if (total <= 0) return { pt: 1, spike: 0, offPeak: 0, deferred: 0, batch: 0 };
  return {
    pt: Math.max(0, mix.pt) / total,
    spike: Math.max(0, mix.spike) / total,
    offPeak: Math.max(0, mix.offPeak) / total,
    deferred: Math.max(0, mix.deferred) / total,
    batch: Math.max(0, mix.batch) / total,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Output shape
// ─────────────────────────────────────────────────────────────────────────────

export type StepId =
  | "list"
  | "rightsize"
  | "offpeak"
  | "deferred"
  | "fsp"
  | "gsu"
  | "q3";

export type Accent = "gold" | "blue" | "green" | "fsp" | "teal";

export interface Step {
  id: StepId;
  /** 0 for the list reference, then 1..6. */
  index: number;
  label: string;
  /** Plain-language mechanic with the live parameter values interpolated. */
  mechanic: string;
  /** Remaining monthly cost after this step, $K. */
  value: number;
  /** Change vs. the previous step, $K. Negative = saving. */
  delta: number;
  /** Cumulative saving vs. the list reference, as a fraction. */
  cumulativeSavingPct: number;
  accent: Accent;
  /** False when the customer has not elected the offer this step represents. */
  elected: boolean;
}

export interface Attribution {
  rightSizing: number;
  placement: number;
  fsp: number;
  gsuCommit: number;
  q3: number;
  total: number;
}

export interface ModelResult {
  mix: WorkloadMix;
  /** Peak-sized GSU count for the new order, echoed for display. */
  gsus: number;
  /** Consumed GSU-equivalents. */
  v: number;
  /** Cost of the new capacity if bought peak-sized at list, $K/month. */
  atList: number;
  /** P·V — the reference spend at 1.0x on consumed volume. */
  pv: number;
  /** 1/uPeak — the effective rate on a peak-sized order. */
  peakMultiplier: number;
  /** Deferred honesty term: 0.5 + 0.5·harness. */
  defMult: number;

  s1: number;
  s2: number;
  s3: number;
  s4: number;
  s5: number;
  s6: number;
  /** Final monthly cost for the new capacity, $K. */
  final: number;

  gsu: {
    atList: number;
    afterFsp: number;
    afterCommit: number;
    afterQ3Discount: number;
    credits: number;
    effectiveUnitPrice: number;
    /** Committed GSU count — what the tier thresholds are tested against. */
    units: number;
    appliedDiscount: "fsp" | "gcp" | "none";
    appliedDiscountRate: number;
  };

  /** Incremental commit the customer signs up for. */
  commit: {
    monthly: number;
    months: number;
    /** monthly × months. */
    total: number;
  };

  /** Buy One PT Get One PayGo eligibility. */
  bogoEligible: boolean;
  /** The Q3 tier the committed GSU count qualifies for, if any. */
  q3Tier: Q3TierSpec | null;
  /** Discount actually applied by the Q3 offer. */
  q3AppliedDiscount: number;
  /** Credits rate actually applied by the Q3 offer. */
  q3AppliedCredits: number;
  /** GSUs still needed to reach the next Q3 tier, or null at the top tier. */
  gsusToNextTier: number | null;

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
  const { pt, spike, offPeak, deferred, batch } = mix;
  const { gsus, uPeak, uPt, harness, term, gcpCommit, offers } = levers;

  const safeUPeak = uPeak > 0 ? uPeak : 0.01;
  const safeUPt = uPt > 0 ? uPt : 0.01;

  const v = gsus * safeUPeak;
  const atList = gsus * P_LIST;
  const pv = P_LIST * v;
  const peakMultiplier = 1 / safeUPeak;

  // Committed GSU count drives BOGO eligibility and the Q3 tier.
  const gsuUnits = (v * pt) / safeUPt;
  const bogoEligible = gsuUnits >= BOGO_MIN_GSUS;
  const bogoOn = offers.bogo && bogoEligible;

  // ── Step 1 — right-size PT to the workload share actually placed on it.
  // Spikes ride protected PayGo at 1.0x when BOGO is elected; without it they
  // need Priority PayGo at 1.8x, which is the anchored alternative.
  const ptAtList = pv * (pt / safeUPt);
  const spikeMult = bogoOn
    ? TIER_MULTIPLIER.standardPayGo
    : TIER_MULTIPLIER.priorityPayGo;
  const s1 =
    ptAtList + pv * (spike * spikeMult + offPeak + deferred + batch);

  // ── Step 2 — off-peak placement, only if elected.
  const s2 = offers.offPeak ? s1 - pv * offPeak * 0.5 : s1;

  // ── Step 3 — deferred + batch, each only if elected. Deferred discounts
  // inference tokens only; the harness share stays at 1.0x.
  const defMult = 0.5 + 0.5 * harness;
  const deferredSaving = offers.deferred ? deferred * (1 - defMult) : 0;
  const batchSaving = offers.batch ? batch * 0.5 : 0;
  const s3 = s2 - pv * (deferredSaving + batchSaving);

  // ── Step 4 — FSP wrapper, only if elected.
  const fspRate = offers.fsp ? levers.fspRate : 0;
  const s4 = s3 * (1 - fspRate);

  // ── Step 5 — GSU term price + GCP commit discount, on the GSU line only.
  // FSP is non-stacking (on-demand rate is the ceiling), so the GSU line takes
  // the better of FSP and the GCP commit discount, never both.
  const gsuAfterFsp = ptAtList * (1 - fspRate);
  const termFactor = GSU_TERM_PRICE[term] / P_LIST;
  const appliedDiscountRate = Math.max(fspRate, gcpCommit);
  const appliedDiscount: "fsp" | "gcp" | "none" =
    appliedDiscountRate === 0 ? "none" : gcpCommit > fspRate ? "gcp" : "fsp";
  const gsuAfterCommit = ptAtList * termFactor * (1 - appliedDiscountRate);
  const s5 = s4 - gsuAfterFsp + gsuAfterCommit;

  // ── Step 6 — GSU Q3 offer. The tier is earned by committed GSU count, not
  // chosen; the 2,000+ tier is a fixed rate, the 500+ tier is a band.
  const q3Tier = qualifyingTier(gsuUnits);
  const q3On = offers.q3 && q3Tier !== null;
  const q3AppliedDiscount = q3On
    ? q3Tier.fixed
      ? q3Tier.maxDiscount
      : Math.min(Math.max(levers.q3Discount, 0), q3Tier.maxDiscount)
    : 0;
  const q3AppliedCredits = q3On ? q3Tier.credits : 0;

  const gsuAfterQ3Discount = gsuAfterCommit * (1 - q3AppliedDiscount);
  const credits = gsuAfterQ3Discount * q3AppliedCredits;
  const s6 = s5 - (gsuAfterCommit - gsuAfterQ3Discount) - credits;

  const final = s6;

  const topTier = Q3_TIERS[Q3_TIERS.length - 1];
  const gsusToNextTier =
    q3Tier === null
      ? Math.ceil(topTier.minGsus - gsuUnits)
      : q3Tier.id === Q3_TIERS[0].id
        ? null
        : Math.ceil(Q3_TIERS[0].minGsus - gsuUnits);

  const blendedMultiplier = pv > 0 ? final / pv : 0;
  const savingPct = atList > 0 ? 1 - final / atList : 0;
  const annualSave = (atList - final) * 12;

  const months = GSU_TERM_MONTHS[term];
  const commitMonthly = gsuAfterQ3Discount - credits;

  const values: Array<{
    id: StepId;
    label: string;
    mechanic: string;
    value: number;
    accent: Accent;
    elected: boolean;
  }> = [
    {
      id: "list",
      label: "At list",
      mechanic: `${gsus.toLocaleString("en-US")} peak-sized GSUs of new capacity at list, running at ${pct(uPeak)} utilization — an effective ${peakMultiplier.toFixed(2)}x on every GSU actually consumed.`,
      value: atList,
      accent: "gold",
      elected: true,
    },
    {
      id: "rightsize",
      label: bogoOn ? "Right-size PT + BOGO" : "Right-size PT",
      mechanic: bogoOn
        ? `PT sized to the ${pct(pt)} of workload placed on it at ${pct(uPt)} utilization; ${pct(spike)} spike rides protected PayGo at 1.0x under Buy One PT Get One PayGo.`
        : bogoEligible
          ? `PT sized to the ${pct(pt)} of workload placed on it at ${pct(uPt)} utilization. BOGO not elected, so the ${pct(spike)} spike bills at Priority PayGo 1.8x.`
          : `PT sized to the ${pct(pt)} of workload placed on it at ${pct(uPt)} utilization. BOGO needs ${BOGO_MIN_GSUS}+ committed GSUs (currently ${gsuUnits.toFixed(0)}), so the ${pct(spike)} spike bills at Priority PayGo 1.8x.`,
      value: s1,
      accent: "blue",
      elected: bogoOn,
    },
    {
      id: "offpeak",
      label: "Off-peak",
      mechanic: offers.offPeak
        ? `${pct(offPeak)} of volume is off-peak-eligible and reprices at 0.5x (weekdays 3–9 PM PT, Fri 3 PM–Sun 9 PM PT).`
        : `Off-peak PayGo not elected — the ${pct(offPeak)} off-peak-eligible share stays at 1.0x.`,
      value: s2,
      accent: "green",
      elected: offers.offPeak,
    },
    {
      id: "deferred",
      label: "Deferred + Batch",
      mechanic:
        offers.deferred || offers.batch
          ? `${offers.deferred ? `${pct(deferred)} deferred agents at ${defMult.toFixed(3)}x (0.5x tokens, ${pct(harness)} harness at 1.0x)` : `Deferred not elected (${pct(deferred)} stays at 1.0x)`} and ${offers.batch ? `${pct(batch)} batch at 0.5x` : `batch not elected (${pct(batch)} stays at 1.0x)`}.`
          : `Neither Deferred nor Batch elected — both shares stay at 1.0x.`,
      value: s3,
      accent: "green",
      elected: offers.deferred || offers.batch,
    },
    {
      id: "fsp",
      label: "FSP",
      mechanic: offers.fsp
        ? `Flexible Savings Plan: −${pct(fspRate)} on all in-scope spend, monthly enforcement, dollar-fungible.`
        : "FSP not elected — spend stays at on-demand rates.",
      value: s4,
      accent: "fsp",
      elected: offers.fsp,
    },
    {
      id: "gsu",
      label: "GSU commit",
      mechanic:
        termFactor < 1 || gcpCommit > 0
          ? `${GSU_TERM_LABEL[term]} GSU term at $${(GSU_TERM_PRICE[term] * 1000).toLocaleString("en-US")}/GSU/mo${gcpCommit > 0 ? `, GCP commit −${pct(gcpCommit)}` : ""}. Non-stacking: the GSU line takes ${appliedDiscount === "gcp" ? "the GCP commit discount" : appliedDiscount === "fsp" ? "the FSP rate" : "no discount"}, not both.`
          : `${GSU_TERM_LABEL[term]} GSU term at list ($${(GSU_TERM_PRICE[term] * 1000).toLocaleString("en-US")}/GSU/mo), no GCP commit discount applied.`,
      value: s5,
      accent: "teal",
      elected: termFactor < 1 || gcpCommit > 0,
    },
    {
      id: "q3",
      label: "GSU Q3 offer",
      mechanic: !offers.q3
        ? "GSU Q3 offer not elected."
        : q3Tier === null
          ? `Committed ${gsuUnits.toFixed(0)} GSUs — below the ${Q3_TIERS[Q3_TIERS.length - 1].minGsus} GSU floor, so no Q3 tier applies.`
          : `${q3Tier.label}: −${pct(q3AppliedDiscount)} discount and ${pct(q3AppliedCredits)} credits on ${money(gsuAfterCommit)} of GSU spend.`,
      value: s6,
      accent: "teal",
      elected: q3On,
    },
  ];

  const steps: Step[] = values.map((step, i) => ({
    ...step,
    index: i,
    delta: i === 0 ? 0 : step.value - values[i - 1].value,
    cumulativeSavingPct: atList > 0 ? 1 - step.value / atList : 0,
  }));

  const attribution: Attribution = {
    rightSizing: atList - s1,
    placement: s1 - s3,
    fsp: s3 - s4,
    gsuCommit: s4 - s5,
    q3: s5 - s6,
    total: atList - final,
  };

  return {
    mix,
    gsus,
    v,
    atList,
    pv,
    peakMultiplier,
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
      afterQ3Discount: gsuAfterQ3Discount,
      credits,
      effectiveUnitPrice: gsuUnits > 0 ? commitMonthly / gsuUnits : 0,
      units: gsuUnits,
      appliedDiscount,
      appliedDiscountRate,
    },
    commit: {
      monthly: commitMonthly,
      months,
      total: commitMonthly * months,
    },
    bogoEligible,
    q3Tier,
    q3AppliedDiscount,
    q3AppliedCredits,
    gsusToNextTier,
    blendedMultiplier,
    savingPct,
    annualSave,
    steps,
    attribution,
  };
}
