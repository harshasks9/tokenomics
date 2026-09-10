/**
 * Program terms for the deal check. Every constant carries a `source` tag:
 *   documented — from the internal Google Private Offer sales summary
 *   field      — AWS MAP 2.0 as reported from one region; unverified
 *   assumption — not in either source; editable in the UI
 * Nothing in the engine may use a program term that is not declared here.
 */

export type Source = "documented" | "field" | "assumption";

export interface Term<T> {
  value: T;
  source: Source;
  label: string;
  note: string;
}

const t = <T>(value: T, source: Source, label: string, note: string): Term<T> => ({ value, source, label, note });

/** Month 0 of the simulation. Used only for the contract-validity flag. */
export const MODEL_START = { label: "Sep 2026", year: 2026, month: 9 } as const;
export const MONTHS = 36;

/* ------------------------------------------------------------------ */
/* Google Private Offer — documented                                    */
/* ------------------------------------------------------------------ */

export const GOOGLE = {
  eligibleAccounts: t(
    { total: 40, americas: 25, japac: 10, emea: 5 },
    "documented",
    "Eligible accounts",
    "Pre-approved list of 40 strategic accounts (Americas 25, JAPAC 10, EMEA 5); no exceptions.",
  ),
  minIacv: t(10, "documented", "Minimum incremental GCP commitment ($M iACV)",
    "Customer must sign Marketplace ToS and a Marketplace agreement and commit to at least $10M incremental annual contract value. Deals under $10M iACV are not eligible for DPM escalation."),
  windowMonths: t(12, "documented", "Earning window (months)",
    "Credits accrue on incremental top-line Anthropic MaaS spend via marketplace during the first 12 months from the qualification event."),
  baselineRule: t("last full quarter spend × 4", "documented", "Baseline",
    "Incremental spend = spend above last full quarter spend × 4 (quarterly incremental = quarterly spend − last full quarter). Baseline set at signing of the new/committed contract."),
  delivery: t("spend-milestone credits", "documented", "Delivery",
    "Sized on forecast Y1 spend; delivered as spend-milestone credits. Modelled as quarterly settlement."),
  creditScope: t("GCP Cloud AI (Gen AI and Gen AI v2 SKU groups)", "documented", "Credit scope",
    "Usable only against GCP Cloud AI (Gen AI and Gen AI v2 SKU groups), not Anthropic 3P spend."),
  capTotal: t(5, "documented", "Cap per strategic account ($M)", "$5M total per strategic account."),
  dpoMaxPct: t(10, "documented", "DPO authority (%)",
    "DPO can approve up to 10% in GCP credits for deals of 3 years or shorter; more requires DPM. The document does not fix a single credit percentage — 10% is the default, anything above is an exception."),
  dpoMaxYears: t(3, "documented", "DPO authority (deal length, years)", "Deals longer than 3 years require DPM."),
  executeBy: t("Oct 31, 2026", "documented", "Contract validity", "Contract must be executed by Oct 31, 2026."),
  executeByMonthIndex: t(1, "documented", "Latest signing month (index from Sep 2026)",
    "Month 0 = Sep 2026, month 1 = Oct 2026. A signing month later than 1 is after the Oct 31, 2026 deadline."),
  mktCapPct: t(25, "documented", "Marketplace commit cap (%)",
    "Marketplace spend is capped at 25% of the minimum commitment per commit leg; exceptions need DPM + DPO approval and an exception form."),
} as const;

/* ------------------------------------------------------------------ */
/* AWS MAP 2.0 — field-reported, one region, unverified                 */
/* ------------------------------------------------------------------ */

export const AWS = {
  baselineRule: t("prior-year AWS consumption; zero for net-new", "field", "Baseline",
    "Baseline = customer's prior-year AWS consumption; zero for net-new customers."),
  creditPct: t(25, "field", "Credit rate on incremental tagged spend (%)",
    "25% of incremental tagged spend is returned as credits, settled quarterly. Same rate direct and indirect."),
  settlement: t("quarterly", "field", "Settlement", "Credits settle quarterly."),
  commitType: t("soft", "field", "Commitment", "Soft one-year commit with no shortfall penalty."),
  multiYear: t("2–3 years possible; year 2 counts only the increment over year 1", "field", "Multi-year",
    "Multi-year (2–3 years) possible; in year 2 only the increment over year 1 counts."),
  gatePctOfArr: t(10, "field", "Redemption gate (% of committed ARR)",
    "Credit redemption activates once Q1 tagged spend reaches 10% of committed ARR."),
  approvals: t("MAP BD and FSM; L8 up to 5 exceptions/month, then local VP", "field", "Approvals",
    "Approvals: MAP BD and FSM; L8 up to 5 exceptions/month, then local VP."),
  migrationFeeMaxPctArr: t(20, "field", "Migration fees via partner (% of ARR)",
    "Account team may fund up to 20% of ARR as migration fees via a partner."),
  partnerPassMinPct: t(5, "field", "Partner pass-back (%)",
    "In indirect deals partners pass 5%+ back to the customer."),
  afterYearOne: t("extend (top accounts) or partner restructure resetting baseline to zero", "field", "After year one",
    "L8/VP extension for top accounts; partner restructure that resets baseline to zero for others."),
  unverified: t("Customers route MAP through EMEA/Africa partner channels", "field", "Unverified claim",
    "Listed for completeness; not modelled."),
} as const;

/* ------------------------------------------------------------------ */
/* Modelling assumptions — not in either source                         */
/* ------------------------------------------------------------------ */

export const ASSUMPTIONS: Term<string>[] = [
  t("Credits never retire commit", "assumption", "Credits and commit",
    "Neither program's credits count towards consuming a committed amount."),
  t("Google credits accrue on marketplace spend above the marketplace cap", "assumption", "Cap and credits",
    "The source is silent on whether spend above the 25% marketplace cap still earns credits; the model assumes it does."),
  t("AWS credits are usable against any AWS bill", "assumption", "AWS credit scope",
    "MAP credits are applied to Anthropic-on-Bedrock spend plus other AWS spend, scaled by the consumability input."),
  t("Google credits settle at the end of each quarter and are usable from the next month", "assumption", "Google timing",
    "The source says spend-milestone credits; quarterly settlement is the modelling choice."),
  t("Migration cost is a one-off charge in the migration start month", "assumption", "Migration cost", ""),
];

/* ------------------------------------------------------------------ */
/* Input metadata — label, source tag, ranges                            */
/* ------------------------------------------------------------------ */

export type InputGroup = "Customer" | "Migration" | "AWS" | "GCP";

export interface InputMeta {
  label: string;
  source: Source;
  group: InputGroup;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  help: string;
}

export const INPUT_META = {
  platform: { label: "Where the workload runs today", source: "assumption", group: "Customer", help: "Direct with Anthropic, AWS Bedrock, or GCP marketplace." },
  anthSpend: { label: "Anthropic spend", source: "assumption", group: "Customer", unit: "$M/yr", min: 0, max: 100, step: 0.5, help: "Annualised current spend on Anthropic models." },
  growth: { label: "Growth", source: "assumption", group: "Customer", unit: "%/yr", min: -50, max: 200, step: 5, help: "Compound annual growth applied monthly." },
  awsBaseline: { label: "AWS prior-year AI tagged spend", source: "field", group: "Customer", unit: "$M", min: 0, max: 100, step: 0.5, help: "MAP baseline. Zero for net-new AWS customers." },
  gcpBaselineQ: { label: "Last full quarter Anthropic on GCP marketplace", source: "documented", group: "Customer", unit: "$M", min: 0, max: 25, step: 0.25, help: "Google baseline is this × 4." },
  horizon: { label: "Horizon", source: "assumption", group: "Customer", unit: "months", help: "Evaluation horizon." },
  migPct: { label: "Share of workload that moves", source: "assumption", group: "Migration", unit: "%", min: 0, max: 100, step: 5, help: "Remainder stays on the current platform." },
  migStart: { label: "Migration start", source: "assumption", group: "Migration", unit: "month", min: 0, max: 35, step: 1, help: "Month 0 = Sep 2026." },
  migRamp: { label: "Ramp", source: "assumption", group: "Migration", unit: "months", min: 0, max: 12, step: 1, help: "Months to reach the full migrated share. 0 = instant." },
  migCost: { label: "Migration cost", source: "assumption", group: "Migration", unit: "$M", min: 0, max: 5, step: 0.1, help: "One-off, charged in the start month on routes that move." },
  gcpSignMonth: { label: "Google contract signing month", source: "documented", group: "Migration", unit: "month", min: 0, max: 12, step: 1, help: "Starts the 12-month earning window and the new commit legs. Later than month 1 is after Oct 31, 2026." },
  awsCommitRemaining: { label: "Existing AWS commit remaining", source: "assumption", group: "AWS", unit: "$M", min: 0, max: 100, step: 1, help: "Unconsumed balance on the current AWS commit." },
  awsCommitMonths: { label: "AWS commit months remaining", source: "assumption", group: "AWS", unit: "months", min: 1, max: 48, step: 1, help: "Term left on the existing AWS commit." },
  awsOtherSpend: { label: "Other AWS spend", source: "assumption", group: "AWS", unit: "$M/yr", min: 0, max: 100, step: 1, help: "Non-Anthropic AWS consumption; consumes the AWS commit and absorbs MAP credits." },
  mapPct: { label: "MAP credit rate", source: "field", group: "AWS", unit: "%", min: 0, max: 50, step: 1, help: "Share of incremental tagged spend returned as credits." },
  partnerPass: { label: "Partner pass-back", source: "field", group: "AWS", unit: "%", min: 0, max: 20, step: 1, help: "Added to the MAP rate in indirect deals." },
  mapYears: { label: "MAP years", source: "field", group: "AWS", unit: "years", min: 1, max: 3, step: 1, help: "Year 2+ counts only the increment over the prior year." },
  mapAfter: { label: "After MAP term", source: "field", group: "AWS", help: "None, extension, or partner restructure that resets the baseline to zero." },
  mapCommitArr: { label: "MAP committed ARR", source: "field", group: "AWS", unit: "$M", min: 0, max: 100, step: 1, help: "0 = year-1 AWS Anthropic spend. Sets the 10% redemption gate." },
  awsDiscount: { label: "AWS price discount", source: "assumption", group: "AWS", unit: "%", min: 0, max: 40, step: 1, help: "Applied to Anthropic-on-Bedrock spend." },
  awsCreditUse: { label: "AWS credit consumability", source: "assumption", group: "AWS", unit: "%", min: 0, max: 100, step: 5, help: "Share of the AWS bill the credits can be applied to." },
  gcpCommitNew: { label: "New GCP commit", source: "documented", group: "GCP", unit: "$M/yr", min: 0, max: 100, step: 1, help: "Incremental commitment; must be ≥ $10M iACV for eligibility." },
  gcpCommitYears: { label: "New GCP commit years", source: "documented", group: "GCP", unit: "years", min: 1, max: 5, step: 1, help: "Over 3 years needs DPM." },
  gcpCommitExisting: { label: "Existing GCP commit remaining", source: "assumption", group: "GCP", unit: "$M", min: 0, max: 100, step: 1, help: "Unconsumed balance on a current GCP commit." },
  gcpCommitExistingMonths: { label: "Existing GCP commit months", source: "assumption", group: "GCP", unit: "months", min: 0, max: 48, step: 1, help: "Term left on the existing GCP commit." },
  gcpAiSpend: { label: "Eligible GCP Cloud AI spend", source: "assumption", group: "GCP", unit: "$M/yr", min: 0, max: 100, step: 0.5, help: "Non-Anthropic Gen AI consumption the Google credits can offset." },
  gcpOtherSpend: { label: "Other GCP spend", source: "assumption", group: "GCP", unit: "$M/yr", min: 0, max: 100, step: 1, help: "Consumes GCP commit; cannot absorb credits." },
  gcpPct: { label: "Google credit rate", source: "documented", group: "GCP", unit: "%", min: 0, max: 30, step: 1, help: "Up to 10% within DPO authority; above needs DPM." },
  gcpCap: { label: "Google credit cap", source: "documented", group: "GCP", unit: "$M", min: 0, max: 20, step: 0.5, help: "$5M per strategic account." },
  mktCapPct: { label: "Marketplace share of commit", source: "documented", group: "GCP", unit: "%", min: 0, max: 100, step: 5, help: "Marketplace spend counted against commit, per leg." },
  mktException: { label: "Marketplace cap exception", source: "documented", group: "GCP", help: "Needs DPM + DPO approval and an exception form." },
  gcpDiscount: { label: "GCP price discount", source: "assumption", group: "GCP", unit: "%", min: 0, max: 40, step: 1, help: "Applied to Anthropic-on-GCP spend." },
  directDiscount: { label: "Direct price discount", source: "assumption", group: "Customer", unit: "%", min: 0, max: 40, step: 1, help: "Applied to spend that stays direct with Anthropic." },
} as const satisfies Record<string, InputMeta>;

export type InputKey = keyof typeof INPUT_META;

export const SOURCE_LABEL: Record<Source, string> = {
  documented: "documented",
  field: "field-reported",
  assumption: "assumption",
};
