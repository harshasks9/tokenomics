/**
 * Offers — GenAI commercial pricing model.
 *
 * SCOPE: this models **incremental new workload** — the PT capacity and PayGo
 * demand a customer is adding, on an incremental commit. Nothing here reprices
 * or describes what they already run.
 *
 * The question it answers: against the incremental spend that new workload
 * would cost at standard rates, how much do the programmatic options take off?
 *
 * Pure functions, no React, no side effects, no `any`.
 * Units: money is $K per month unless a name says otherwise.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** List price, $K per GSU per month (list $2,400). */
export const P_LIST = 2.4;

export type GsuTerm = "1m" | "3m" | "1y";

/**
 * GSU unit price ($K/GSU/month) by commitment term.
 *
 * ASSUMPTION — the brief gives three terms but two prices ($2,400 / $2,100).
 * List is $2,400 and a commitment earns a discount, so sub-year terms sit at
 * list and the 1-year term takes $2,100 (−12.5%). Change it here if wrong.
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

export const GSU_TERM_MONTHS: Record<GsuTerm, number> = {
  "1m": 1,
  "3m": 3,
  "1y": 12,
};

export const TIER_MULTIPLIER = {
  priorityPayGo: 1.8,
  standardPayGo: 1.0,
  provisionedThroughput: 1.0,
  offPeak: 0.5,
  flex: 0.5,
  deferred: 0.5,
  batch: 0.5,
} as const;

/** Buy One PT Get One PayGo is offered from this committed GSU count up. */
export const BOGO_MIN_GSUS = 200;

/**
 * Tokens per minute delivered by one GSU.
 *
 * ASSUMPTION, and the least certain number on this page — the source decks
 * quote customer traffic in TPM and capacity in GSUs but never the conversion.
 * The default is reverse-engineered from the PT-percentile chart (a large
 * customer peaking around 60M TPM against an order in the high hundreds of
 * GSUs). It is exposed as an editable lever precisely because it should be set
 * to your region's real figure before anyone quotes a TPM number from here.
 */
export const DEFAULT_TPM_PER_GSU = 60_000;

// ── GSU Q3 offer ────────────────────────────────────────────────────────────

export type Q3Tier = "none" | "gsu500" | "gsu2000";

export interface Q3TierSpec {
  id: Q3Tier;
  label: string;
  minGsus: number;
  maxDiscount: number;
  fixed: boolean;
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

export function qualifyingTier(committedGsus: number): Q3TierSpec | null {
  return Q3_TIERS.find((tier) => committedGsus >= tier.minGsus) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inputs
// ─────────────────────────────────────────────────────────────────────────────

export interface OfferElections {
  bogo: boolean;
  offPeak: boolean;
  deferred: boolean;
  batch: boolean;
  fsp: boolean;
  q3: boolean;
}

/**
 * How the incremental PayGo demand splits. Standard PayGo is the remainder, so
 * there is no normalization step and no slider fighting the others.
 */
export interface PayGoMix {
  /** Needs peak-period reliability: 1.8x, or 1.0x under BOGO. */
  spike: number;
  /** Falls in the US off-peak window. */
  offPeak: number;
  /** Multi-step background agent jobs. */
  deferred: number;
  /** Non-urgent high-volume async. */
  batch: number;
}

export const PAYGO_MIX_KEYS = ["spike", "offPeak", "deferred", "batch"] as const;
export type PayGoMixKey = (typeof PAYGO_MIX_KEYS)[number];

export interface Levers {
  /** Incremental PT capacity being ordered, in GSUs. */
  ptGsus: number;
  /** How full that PT actually runs. 0.40–1.00. */
  ptUtilization: number;
  /** Incremental PayGo demand, in GSU-equivalents. */
  paygoGsus: number;
  paygoMix: PayGoMix;
  /** Which model the token-economics view compares. */
  modelId: string;
  /** Harness fee share within Deferred, billed at 1.0x. 0–0.50. */
  harness: number;
  /** TPM delivered per GSU — the assumption behind every TPM figure shown. */
  tpmPerGsu: number;
  term: GsuTerm;
  fspRate: number;
  gcpCommit: number;
  q3Discount: number;
  offers: OfferElections;
}

export const DEFAULT_LEVERS: Levers = {
  ptGsus: 600,
  ptUtilization: 0.85,
  paygoGsus: 600,
  paygoMix: { spike: 0.15, offPeak: 0.3, deferred: 0.2, batch: 0.1 },
  modelId: "gemini-3-6-flash",
  harness: 0.15,
  tpmPerGsu: DEFAULT_TPM_PER_GSU,
  term: "1m",
  fspRate: 0.2,
  gcpCommit: 0,
  q3Discount: 0.15,
  offers: {
    bogo: true,
    offPeak: true,
    deferred: true,
    batch: true,
    fsp: true,
    q3: true,
  },
};

export const LEVER_RANGES = {
  ptGsus: { min: 0, max: 5000, step: 50 },
  ptUtilization: { min: 0.4, max: 1, step: 0.01 },
  paygoGsus: { min: 0, max: 5000, step: 50 },
  mixShare: { min: 0, max: 1, step: 0.01 },
  harness: { min: 0, max: 0.5, step: 0.01 },
  gcpCommit: { min: 0, max: 0.3, step: 0.01 },
  tpmPerGsu: { min: 10_000, max: 200_000, step: 5_000 },
} as const;

/** Standard PayGo takes whatever the other four leave. */
export function standardShare(mix: PayGoMix): number {
  const claimed = PAYGO_MIX_KEYS.reduce(
    (sum, key) => sum + Math.max(0, mix[key]),
    0,
  );
  return Math.max(0, 1 - claimed);
}

/** True when the four placement shares have been pushed past 100%. */
export function isOverAllocated(mix: PayGoMix): boolean {
  return (
    PAYGO_MIX_KEYS.reduce((sum, key) => sum + Math.max(0, mix[key]), 0) > 1.0001
  );
}

/** Scale the four shares back to 100% when they have been over-allocated. */
function usableMix(mix: PayGoMix): PayGoMix & { standard: number } {
  const raw = PAYGO_MIX_KEYS.map((key) => Math.max(0, mix[key]));
  const claimed = raw.reduce((a, b) => a + b, 0);
  const scale = claimed > 1 ? 1 / claimed : 1;
  const [spike, offPeak, deferred, batch] = raw.map((v) => v * scale);
  return {
    spike,
    offPeak,
    deferred,
    batch,
    standard: Math.max(0, 1 - (spike + offPeak + deferred + batch)),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Simple mode
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The whole conversation in two numbers: total demand, and how much of it goes
 * on Provisioned Throughput. Everything else takes a stated default.
 */
export interface SimpleInputs {
  /** Total incremental demand, GSU-equivalents per month. */
  totalDemand: number;
  /** Share of that demand placed on PT. The rest rides PayGo. */
  ptShare: number;
}

export const DEFAULT_SIMPLE: SimpleInputs = {
  totalDemand: 1200,
  ptShare: 0.5,
};

export const SIMPLE_RANGES = {
  totalDemand: { min: 100, max: 8000, step: 50 },
  ptShare: { min: 0, max: 1, step: 0.01 },
} as const;

/**
 * Expand the two simple inputs into the full lever set.
 *
 * Simple mode assumes the PT is right-sized — capacity ordered equals the
 * demand placed on it, so utilization is 100% — and that every programmatic
 * option is elected on the best published terms. It answers "what could this
 * customer get?", not "what will they settle for". Pro mode is where the
 * utilization, the placement mix and the individual elections come apart.
 */
export function leversFromSimple(simple: SimpleInputs): Levers {
  const total = Math.max(0, simple.totalDemand);
  const share = Math.min(1, Math.max(0, simple.ptShare));
  const ptGsus = Math.round(total * share);
  return {
    ...DEFAULT_LEVERS,
    ptGsus,
    paygoGsus: Math.max(0, Math.round(total - ptGsus)),
    ptUtilization: 1,
    term: "1y",
    fspRate: 0.2,
    offers: {
      bogo: true,
      offPeak: true,
      deferred: true,
      batch: true,
      fsp: true,
      q3: true,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────────────────────────────────────

export type StepId =
  | "reference"
  | "bogo"
  | "offpeak"
  | "deferred"
  | "fsp"
  | "gsu"
  | "q3";

export type Accent = "gold" | "blue" | "green" | "fsp" | "teal";

/** One line of shown work: what it is, the arithmetic, and what it came to. */
export interface WorkingLine {
  label: string;
  /** The arithmetic with the live values substituted — no abstract symbols. */
  expression: string;
  /** $K. Negative for a reduction. */
  value: number;
  /** True for a subtotal / running-total line. */
  total?: boolean;
}

export interface Step {
  id: StepId;
  index: number;
  label: string;
  mechanic: string;
  /** The arithmetic behind this step, for "show me the math". */
  working: WorkingLine[];
  value: number;
  delta: number;
  cumulativeSavingPct: number;
  accent: Accent;
  elected: boolean;
}

export interface Attribution {
  bogo: number;
  placement: number;
  fsp: number;
  gsuCommit: number;
  q3: number;
  total: number;
}

export interface TrafficSplit {
  /** GSU-equivalents actually consumed on PT. */
  ptConsumed: number;
  /** GSU-equivalents of PayGo demand. */
  paygoConsumed: number;
  totalConsumed: number;
  ptShareOfVolume: number;
  paygoShareOfVolume: number;
  ptShareOfSpend: number;
  paygoShareOfSpend: number;
  /** PT capacity that is ordered but not used. */
  idleGsus: number;
  /** Tokens per minute, using the tpmPerGsu assumption. */
  ptCapacityTpm: number;
  ptUsedTpm: number;
  paygoTpm: number;
  totalTpm: number;
}

export interface ModelResult {
  levers: Levers;
  /** PayGo mix after clamping, plus the standard-PayGo remainder. */
  mix: PayGoMix & { standard: number };
  overAllocated: boolean;

  /** Incremental spend at standard rates with nothing elected, $K/month. */
  reference: number;
  /** The PT half of the reference. */
  ptReference: number;
  /** The PayGo half of the reference. */
  paygoReference: number;

  s1: number;
  s2: number;
  s3: number;
  s4: number;
  s5: number;
  s6: number;
  final: number;

  defMult: number;
  traffic: TrafficSplit;

  gsu: {
    atList: number;
    afterFsp: number;
    afterCommit: number;
    afterQ3Discount: number;
    credits: number;
    effectiveUnitPrice: number;
    units: number;
    appliedDiscount: "fsp" | "gcp" | "none";
    appliedDiscountRate: number;
  };

  commit: { monthly: number; months: number; total: number };

  bogoEligible: boolean;
  q3Tier: Q3TierSpec | null;
  q3AppliedDiscount: number;
  q3AppliedCredits: number;
  gsusToNextTier: number | null;

  blendedMultiplier: number;
  savingPct: number;
  annualSave: number;

  steps: Step[];
  attribution: Attribution;
}

// ─────────────────────────────────────────────────────────────────────────────
// The model
// ─────────────────────────────────────────────────────────────────────────────

const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
const money = (x: number) => `$${Math.round(x).toLocaleString("en-US")}K`;
const gsuCount = (x: number) => x.toLocaleString("en-US", { maximumFractionDigits: 0 });
/** $2,400 rather than 2.4 — the shown work speaks in real dollars. */
const perGsu = (p: number) => `$${(p * 1000).toLocaleString("en-US")}`;
const k = (x: number) => `$${x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K`;

export function computeModel(levers: Levers): ModelResult {
  const {
    ptGsus,
    ptUtilization,
    paygoGsus,
    harness,
    tpmPerGsu,
    term,
    gcpCommit,
    offers,
  } = levers;

  const mix = usableMix(levers.paygoMix);
  const overAllocated = isOverAllocated(levers.paygoMix);

  // ── Volumes ────────────────────────────────────────────────────────────
  const ptConsumed = ptGsus * ptUtilization;
  const totalConsumed = ptConsumed + paygoGsus;

  const bogoEligible = ptGsus >= BOGO_MIN_GSUS;
  const bogoOn = offers.bogo && bogoEligible;

  // ── Reference: what this incremental workload costs with nothing elected.
  // PT bills on capacity at the list GSU rate; PayGo bills per tier, with
  // spikes needing Priority PayGo at 1.8x because BOGO has not been taken.
  const ptReference = ptGsus * P_LIST;
  const paygoUnit = paygoGsus * P_LIST;
  const paygoReference =
    paygoUnit *
    (mix.spike * TIER_MULTIPLIER.priorityPayGo +
      mix.standard +
      mix.offPeak +
      mix.deferred +
      mix.batch);
  const reference = ptReference + paygoReference;

  // ── Step 1 — Buy One PT Get One PayGo: spikes drop 1.8x → 1.0x.
  const bogoSaving = bogoOn
    ? paygoUnit * mix.spike * (TIER_MULTIPLIER.priorityPayGo - 1)
    : 0;
  const s1 = reference - bogoSaving;

  // ── Step 2 — Off-peak placement.
  const offPeakSaving = offers.offPeak ? paygoUnit * mix.offPeak * 0.5 : 0;
  const s2 = s1 - offPeakSaving;

  // ── Step 3 — Deferred + Batch. Deferred discounts inference tokens only,
  // so the harness share stays at 1.0x.
  const defMult = 0.5 + 0.5 * harness;
  const deferredSaving = offers.deferred
    ? paygoUnit * mix.deferred * (1 - defMult)
    : 0;
  const batchSaving = offers.batch ? paygoUnit * mix.batch * 0.5 : 0;
  const s3 = s2 - deferredSaving - batchSaving;

  // ── Step 4 — FSP across everything in scope.
  const fspRate = offers.fsp ? levers.fspRate : 0;
  const s4 = s3 * (1 - fspRate);

  // ── Step 5 — GSU term price + GCP commit discount, PT line only. FSP is
  // non-stacking, so the PT line takes the better of the two, never both.
  const gsuAfterFsp = ptReference * (1 - fspRate);
  const termFactor = GSU_TERM_PRICE[term] / P_LIST;
  const appliedDiscountRate = Math.max(fspRate, gcpCommit);
  const appliedDiscount: "fsp" | "gcp" | "none" =
    appliedDiscountRate === 0 ? "none" : gcpCommit > fspRate ? "gcp" : "fsp";
  const gsuAfterCommit = ptReference * termFactor * (1 - appliedDiscountRate);
  const s5 = s4 - gsuAfterFsp + gsuAfterCommit;

  // ── Step 6 — GSU Q3 offer, earned by committed GSU count.
  const q3Tier = qualifyingTier(ptGsus);
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

  const topTier = Q3_TIERS[0];
  const gsusToNextTier =
    q3Tier === null
      ? Math.ceil(Q3_TIERS[Q3_TIERS.length - 1].minGsus - ptGsus)
      : q3Tier.id === topTier.id
        ? null
        : Math.ceil(topTier.minGsus - ptGsus);

  const denominator = P_LIST * totalConsumed;
  const blendedMultiplier = denominator > 0 ? final / denominator : 0;
  const savingPct = reference > 0 ? 1 - final / reference : 0;
  const annualSave = (reference - final) * 12;

  const months = GSU_TERM_MONTHS[term];
  const commitMonthly = gsuAfterQ3Discount - credits;

  const traffic: TrafficSplit = {
    ptConsumed,
    paygoConsumed: paygoGsus,
    totalConsumed,
    ptShareOfVolume: totalConsumed > 0 ? ptConsumed / totalConsumed : 0,
    paygoShareOfVolume: totalConsumed > 0 ? paygoGsus / totalConsumed : 0,
    ptShareOfSpend: reference > 0 ? ptReference / reference : 0,
    paygoShareOfSpend: reference > 0 ? paygoReference / reference : 0,
    idleGsus: Math.max(0, ptGsus - ptConsumed),
    ptCapacityTpm: ptGsus * tpmPerGsu,
    ptUsedTpm: ptConsumed * tpmPerGsu,
    paygoTpm: paygoGsus * tpmPerGsu,
    totalTpm: (ptGsus + paygoGsus) * tpmPerGsu,
  };

  const values: Array<{
    id: StepId;
    label: string;
    mechanic: string;
    value: number;
    accent: Accent;
    elected: boolean;
    working: WorkingLine[];
  }> = [
    {
      id: "reference",
      label: "Incremental spend",
      mechanic: `${gsuCount(ptGsus)} GSUs of new PT at list plus ${gsuCount(paygoGsus)} GSU-equivalents of PayGo at standard rates, with spikes on Priority PayGo. Nothing elected.`,
      value: reference,
      accent: "gold",
      elected: true,
      working: [
        {
          label: "PT capacity",
          expression: `${gsuCount(ptGsus)} GSUs × ${perGsu(P_LIST)}/GSU/mo`,
          value: ptReference,
        },
        {
          label: "PayGo — spike, Priority 1.8x",
          expression: `${gsuCount(paygoGsus)} × ${perGsu(P_LIST)} × ${pct(mix.spike)} × 1.8`,
          value: paygoUnit * mix.spike * TIER_MULTIPLIER.priorityPayGo,
        },
        {
          label: "PayGo — everything else, 1.0x",
          expression: `${gsuCount(paygoGsus)} × ${perGsu(P_LIST)} × ${pct(1 - mix.spike)} × 1.0`,
          value: paygoUnit * (1 - mix.spike),
        },
        {
          label: "Incremental spend",
          expression: `${k(ptReference)} + ${k(paygoReference)}`,
          value: reference,
          total: true,
        },
      ],
    },
    {
      id: "bogo",
      label: "Buy One PT Get One PayGo",
      mechanic: bogoOn
        ? `${pct(mix.spike)} of PayGo is spike traffic; protected PayGo carries it at 1.0x instead of Priority 1.8x.`
        : bogoEligible
          ? `Not elected — the ${pct(mix.spike)} spike share stays on Priority PayGo at 1.8x.`
          : `Needs ${BOGO_MIN_GSUS}+ PT GSUs (currently ${gsuCount(ptGsus)}), so spikes stay on Priority PayGo at 1.8x.`,
      value: s1,
      accent: "blue",
      elected: bogoOn,
      working: bogoOn
        ? [
            {
              label: "Spike moves 1.8x → 1.0x",
              expression: `${gsuCount(paygoGsus)} × ${perGsu(P_LIST)} × ${pct(mix.spike)} × (1.8 − 1.0)`,
              value: -bogoSaving,
            },
            { label: "Running total", expression: `${k(reference)} − ${k(bogoSaving)}`, value: s1, total: true },
          ]
        : [
            {
              label: bogoEligible ? "Not elected — no change" : `Below the ${BOGO_MIN_GSUS} GSU threshold — no change`,
              expression: `spike stays at 1.8x`,
              value: 0,
            },
            { label: "Running total", expression: "unchanged", value: s1, total: true },
          ],
    },
    {
      id: "offpeak",
      label: "Off-peak PayGo",
      mechanic: offers.offPeak
        ? `${pct(mix.offPeak)} of PayGo falls in the US off-peak window and reprices at 0.5x (weekdays 3–9 PM PT, Fri 3 PM–Sun 9 PM PT).`
        : `Not elected — the ${pct(mix.offPeak)} off-peak-eligible share stays at 1.0x.`,
      value: s2,
      accent: "green",
      elected: offers.offPeak,
      working: offers.offPeak
        ? [
            {
              label: "Off-peak share halves",
              expression: `${gsuCount(paygoGsus)} × ${perGsu(P_LIST)} × ${pct(mix.offPeak)} × 0.5`,
              value: -offPeakSaving,
            },
            { label: "Running total", expression: `${k(s1)} − ${k(offPeakSaving)}`, value: s2, total: true },
          ]
        : [
            { label: "Not elected — no change", expression: "off-peak share stays at 1.0x", value: 0 },
            { label: "Running total", expression: "unchanged", value: s2, total: true },
          ],
    },
    {
      id: "deferred",
      label: "Deferred + Batch",
      mechanic:
        offers.deferred || offers.batch
          ? `${offers.deferred ? `${pct(mix.deferred)} deferred at ${defMult.toFixed(3)}x (0.5x tokens, ${pct(harness)} harness at 1.0x)` : `deferred not elected (${pct(mix.deferred)} stays at 1.0x)`}; ${offers.batch ? `${pct(mix.batch)} batch at 0.5x` : `batch not elected (${pct(mix.batch)} stays at 1.0x)`}.`
          : "Neither elected — both shares stay at 1.0x.",
      value: s3,
      accent: "green",
      elected: offers.deferred || offers.batch,
      working: [
        offers.deferred
          ? {
              label: `Deferred at ${defMult.toFixed(3)}x — 0.5 + 0.5 × ${pct(harness)} harness`,
              expression: `${gsuCount(paygoGsus)} × ${perGsu(P_LIST)} × ${pct(mix.deferred)} × (1 − ${defMult.toFixed(3)})`,
              value: -deferredSaving,
            }
          : { label: "Deferred not elected", expression: "stays at 1.0x", value: 0 },
        offers.batch
          ? {
              label: "Batch halves",
              expression: `${gsuCount(paygoGsus)} × ${perGsu(P_LIST)} × ${pct(mix.batch)} × 0.5`,
              value: -batchSaving,
            }
          : { label: "Batch not elected", expression: "stays at 1.0x", value: 0 },
        {
          label: "Running total",
          expression: `${k(s2)} − ${k(deferredSaving + batchSaving)}`,
          value: s3,
          total: true,
        },
      ],
    },
    {
      id: "fsp",
      label: "Flexible Savings Plan",
      mechanic: offers.fsp
        ? `−${pct(fspRate)} on all in-scope incremental spend. Monthly enforcement, post-pay, dollar-fungible.`
        : "Not elected — spend stays at on-demand rates.",
      value: s4,
      accent: "fsp",
      elected: offers.fsp,
      working: offers.fsp
        ? [
            {
              label: `FSP −${pct(fspRate)} on everything in scope`,
              expression: `${k(s3)} × ${pct(fspRate)}`,
              value: -(s3 - s4),
            },
            { label: "Running total", expression: `${k(s3)} × (1 − ${pct(fspRate)})`, value: s4, total: true },
          ]
        : [
            { label: "Not elected — no change", expression: "spend stays at on-demand rates", value: 0 },
            { label: "Running total", expression: "unchanged", value: s4, total: true },
          ],
    },
    {
      id: "gsu",
      label: "GSU term + commit",
      mechanic:
        termFactor < 1 || gcpCommit > 0
          ? `${GSU_TERM_LABEL[term]} term at $${(GSU_TERM_PRICE[term] * 1000).toLocaleString("en-US")}/GSU/mo${gcpCommit > 0 ? `, GCP commit −${pct(gcpCommit)}` : ""}. Non-stacking: the PT line takes ${appliedDiscount === "gcp" ? "the GCP commit discount" : appliedDiscount === "fsp" ? "the FSP rate" : "no discount"}, not both.`
          : `${GSU_TERM_LABEL[term]} term at list ($${(GSU_TERM_PRICE[term] * 1000).toLocaleString("en-US")}/GSU/mo), no GCP commit discount.`,
      value: s5,
      accent: "teal",
      elected: termFactor < 1 || gcpCommit > 0,
      working: [
        {
          label: "PT line already charged inside FSP",
          expression: `${k(ptReference)} × (1 − ${pct(fspRate)})`,
          value: -gsuAfterFsp,
        },
        {
          label: `PT line repriced — ${GSU_TERM_LABEL[term]} term, ${appliedDiscount === "gcp" ? `GCP commit ${pct(gcpCommit)}` : appliedDiscount === "fsp" ? `FSP ${pct(fspRate)}` : "no discount"} (non-stacking: the larger applies)`,
          expression: `${gsuCount(ptGsus)} × ${perGsu(GSU_TERM_PRICE[term])} × (1 − ${pct(appliedDiscountRate)})`,
          value: gsuAfterCommit,
        },
        { label: "Running total", expression: `${k(s4)} − ${k(gsuAfterFsp)} + ${k(gsuAfterCommit)}`, value: s5, total: true },
      ],
    },
    {
      id: "q3",
      label: "GSU Q3 offer",
      mechanic: !offers.q3
        ? "Not elected."
        : q3Tier === null
          ? `${gsuCount(ptGsus)} PT GSUs — below the ${Q3_TIERS[Q3_TIERS.length - 1].minGsus} GSU floor, so no tier applies.`
          : `${q3Tier.label}: −${pct(q3AppliedDiscount)} and ${pct(q3AppliedCredits)} credits on ${money(gsuAfterCommit)} of PT spend.`,
      value: s6,
      accent: "teal",
      elected: q3On,
      working: q3On
        ? [
            {
              label: `Q3 discount — ${q3Tier.label}`,
              expression: `${k(gsuAfterCommit)} × ${pct(q3AppliedDiscount)}`,
              value: -(gsuAfterCommit - gsuAfterQ3Discount),
            },
            {
              label: `Credits — ${pct(q3AppliedCredits)} of the discounted PT spend`,
              expression: `${k(gsuAfterQ3Discount)} × ${pct(q3AppliedCredits)}`,
              value: -credits,
            },
            { label: "Final", expression: `${k(s5)} − ${k(gsuAfterCommit - gsuAfterQ3Discount + credits)}`, value: s6, total: true },
          ]
        : [
            {
              label: offers.q3 ? `Below the ${Q3_TIERS[Q3_TIERS.length - 1].minGsus} GSU floor — no tier applies` : "Not elected — no change",
              expression: "no discount, no credits",
              value: 0,
            },
            { label: "Final", expression: "unchanged", value: s6, total: true },
          ],
    },
  ];

  const steps: Step[] = values.map((step, i) => ({
    ...step,
    index: i,
    delta: i === 0 ? 0 : step.value - values[i - 1].value,
    cumulativeSavingPct: reference > 0 ? 1 - step.value / reference : 0,
  }));

  const attribution: Attribution = {
    bogo: reference - s1,
    placement: s1 - s3,
    fsp: s3 - s4,
    gsuCommit: s4 - s5,
    q3: s5 - s6,
    total: reference - final,
  };

  return {
    levers,
    mix,
    overAllocated,
    reference,
    ptReference,
    paygoReference,
    s1,
    s2,
    s3,
    s4,
    s5,
    s6,
    final,
    defMult,
    traffic,
    gsu: {
      atList: ptReference,
      afterFsp: gsuAfterFsp,
      afterCommit: gsuAfterCommit,
      afterQ3Discount: gsuAfterQ3Discount,
      credits,
      effectiveUnitPrice: ptGsus > 0 ? commitMonthly / ptGsus : 0,
      units: ptGsus,
      appliedDiscount,
      appliedDiscountRate,
    },
    commit: { monthly: commitMonthly, months, total: commitMonthly * months },
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
