/**
 * MDES Gemini Enterprise commitment planner — pure engine.
 *
 * No React, no DOM, no rounding: every figure is carried at full precision and
 * rounded only by the formatters in format.ts. Users are whole people, so
 * generated ramps are rounded to integers at generation time (a modelling
 * choice, not display rounding).
 *
 * Vocabulary
 *   adoption   learners expected to be certified and using the product
 *   billed     users on which subscription fees are computed (default = adoption)
 *   consumption GE spend + explicitly modelled eligible GCP spend (if enabled)
 *   commitment USD 10.8M owed under the Order Form regardless of consumption
 */

import {
  COMMITMENT,
  CONTRACTED_UNITS,
  PUPM,
  PUPM_FLOOR,
  REQUIRED_USERS_M12,
  TERM_MONTHS,
  monthLabel,
} from "./terms";

export type PresetId = "contract" | "immediate" | "slow" | "delayed" | "custom";
export type Pattern = "linear" | "front" | "back" | "scurve";

export interface RampSpec {
  preset: PresetId;
  /** First planning month (1–12) with billed users. */
  launchMonth: number;
  /** Users in the launch month. */
  startUsers: number;
  /** Users in Month 12. May exceed 650K. */
  exitUsers: number;
  pattern: Pattern;
  /** Optional hard cap on users in any month (e.g. eligible learner pool). null = none. */
  ceiling: number | null;
}

export interface GcpSpec {
  enabled: boolean;
  /** Eligible GCP spend per month, USD. */
  monthly: number;
  /** First planning month with eligible GCP spend (1-based). */
  startMonth: number;
  /** Cap on how much GCP can be counted toward the commitment. */
  capMode: "none" | "usd" | "pct";
  capValue: number;
}

export interface TimelineSpec {
  /** 12 = as contracted. 13–36 = proposed extension. */
  windowMonths: number;
  /** Price per user per month in extension months. null = same as pupm. */
  extPupm: number | null;
  /** Billed users in extension months, indexed from M13; null/undefined = hold M12. */
  extUsers: (number | null)[];
  /** Eligible GCP spend in extension months, indexed from M13; null/undefined = hold M12. */
  extGcp: (number | null)[];
}

export interface CaseSpec {
  /** Multiplier on users (1 = as modelled). */
  mult: number;
  /** Additional launch delay in months (0 = as modelled). */
  delay: number;
}

export interface Inputs {
  ramp: RampSpec;
  /** Adoption per planning month, 12 entries. Regenerated from `ramp` unless preset = custom. */
  adoption: number[];
  /** When true billed = adoption. When false, `billed` is used. */
  billedLinked: boolean;
  billed: number[];
  pupm: number;
  gcp: GcpSpec;
  timeline: TimelineSpec;
  cases: { low: CaseSpec; high: CaseSpec };
}

export const MAX_WINDOW = 36;
export const SOLVER_MAX_USERS = 5_000_000;

// ---------------------------------------------------------------------------
// Ramp generation
// ---------------------------------------------------------------------------

function shape(t: number, pattern: Pattern): number {
  const x = Math.min(1, Math.max(0, t));
  switch (pattern) {
    case "linear": return x;
    case "front": return 1 - (1 - x) * (1 - x);
    case "back": return x * x;
    case "scurve": return x * x * (3 - 2 * x);
  }
}

/** Adoption per month (12 entries) from a ramp spec. Contract preset returns the ordered schedule. */
export function generateRamp(spec: RampSpec): number[] {
  if (spec.preset === "contract") return CONTRACTED_UNITS.slice();
  const launch = clampInt(spec.launchMonth, 1, TERM_MONTHS);
  const start = Math.max(0, spec.startUsers);
  const exit = Math.max(0, spec.exitUsers);
  const out: number[] = [];
  const span = TERM_MONTHS - launch;
  for (let m = 1; m <= TERM_MONTHS; m += 1) {
    if (m < launch) { out.push(0); continue; }
    const t = span === 0 ? 1 : (m - launch) / span;
    let u = start + (exit - start) * shape(t, spec.pattern);
    if (spec.ceiling !== null && spec.ceiling >= 0) u = Math.min(u, spec.ceiling);
    out.push(Math.round(u));
  }
  return out;
}

export const PRESETS: Record<Exclude<PresetId, "custom">, { label: string; blurb: string; ramp: Omit<RampSpec, "preset"> }> = {
  contract: {
    label: "Contracted schedule",
    blurb: "Ordered units from the Order Form: 100K from M2 rising to 650K from M7.",
    ramp: { launchMonth: 2, startUsers: 100_000, exitUsers: 650_000, pattern: "linear", ceiling: null },
  },
  immediate: {
    label: "Immediate launch",
    blurb: "Public launch in M1, linear growth to 650K by M12.",
    ramp: { launchMonth: 1, startUsers: 100_000, exitUsers: 650_000, pattern: "linear", ceiling: null },
  },
  slow: {
    label: "Slow start",
    blurb: "Launch in M2 at 50K, back-loaded growth to 650K as the Level-3 pipeline fills.",
    ramp: { launchMonth: 2, startUsers: 50_000, exitUsers: 650_000, pattern: "back", ceiling: null },
  },
  delayed: {
    label: "Delayed launch",
    blurb: "Public launch slips to M4; S-curve to 650K by M12.",
    ramp: { launchMonth: 4, startUsers: 50_000, exitUsers: 650_000, pattern: "scurve", ceiling: null },
  },
};

export const PATTERN_LABEL: Record<Pattern, string> = {
  linear: "Linear",
  front: "Front-loaded",
  back: "Back-loaded",
  scurve: "S-curve",
};

// ---------------------------------------------------------------------------
// Defaults and normalisation
// ---------------------------------------------------------------------------

export function defaults(): Inputs {
  const ramp: RampSpec = { preset: "contract", ...PRESETS.contract.ramp };
  const adoption = generateRamp(ramp);
  return {
    ramp,
    adoption,
    billedLinked: true,
    billed: adoption.slice(),
    pupm: PUPM,
    gcp: { enabled: false, monthly: 250_000, startMonth: 1, capMode: "none", capValue: 0 },
    timeline: { windowMonths: TERM_MONTHS, extPupm: null, extUsers: [], extGcp: [] },
    cases: { low: { mult: 0.6, delay: 2 }, high: { mult: 1.3, delay: 0 } },
  };
}

function clampInt(v: number, lo: number, hi: number): number {
  if (!Number.isFinite(v)) return lo;
  return Math.min(hi, Math.max(lo, Math.round(v)));
}

function nonNeg(v: number): number {
  return Number.isFinite(v) && v > 0 ? v : 0;
}

/** Fill, clamp and regenerate derived arrays. Never throws; problems surface in evaluate().errors. */
export function normalize(raw: Partial<Inputs> | null | undefined): Inputs {
  const d = defaults();
  const src = raw ?? {};
  const ramp: RampSpec = {
    preset: isPreset(src.ramp?.preset) ? src.ramp!.preset : d.ramp.preset,
    launchMonth: clampInt(src.ramp?.launchMonth ?? d.ramp.launchMonth, 1, TERM_MONTHS),
    startUsers: Math.round(nonNeg(src.ramp?.startUsers ?? d.ramp.startUsers)),
    exitUsers: Math.round(nonNeg(src.ramp?.exitUsers ?? d.ramp.exitUsers)),
    pattern: isPattern(src.ramp?.pattern) ? src.ramp!.pattern : d.ramp.pattern,
    ceiling: src.ramp?.ceiling == null || !Number.isFinite(src.ramp.ceiling) ? null : Math.max(0, Math.round(src.ramp.ceiling)),
  };
  const adoption = ramp.preset === "custom"
    ? fixedLength(src.adoption ?? d.adoption, TERM_MONTHS, 0).map((v) => Math.round(nonNeg(v)))
    : generateRamp(ramp);
  const billedLinked = src.billedLinked ?? d.billedLinked;
  const billed = billedLinked
    ? adoption.slice()
    : fixedLength(src.billed ?? adoption, TERM_MONTHS, 0).map((v) => Math.round(nonNeg(v)));
  const pupm = Number.isFinite(src.pupm) ? (src.pupm as number) : d.pupm;
  const gcpSrc = src.gcp ?? d.gcp;
  const gcp: GcpSpec = {
    enabled: Boolean(gcpSrc.enabled),
    monthly: nonNeg(gcpSrc.monthly ?? d.gcp.monthly),
    startMonth: clampInt(gcpSrc.startMonth ?? d.gcp.startMonth, 1, MAX_WINDOW),
    capMode: gcpSrc.capMode === "usd" || gcpSrc.capMode === "pct" ? gcpSrc.capMode : "none",
    capValue: nonNeg(gcpSrc.capValue ?? 0),
  };
  const tlSrc = src.timeline ?? d.timeline;
  const windowMonths = clampInt(tlSrc.windowMonths ?? TERM_MONTHS, TERM_MONTHS, MAX_WINDOW);
  const ext = windowMonths - TERM_MONTHS;
  const timeline: TimelineSpec = {
    windowMonths,
    extPupm: tlSrc.extPupm == null || !Number.isFinite(tlSrc.extPupm) ? null : tlSrc.extPupm,
    extUsers: fixedLength(tlSrc.extUsers ?? [], ext, null).map((v) => (v == null || !Number.isFinite(v) ? null : Math.round(nonNeg(v)))),
    extGcp: fixedLength(tlSrc.extGcp ?? [], ext, null).map((v) => (v == null || !Number.isFinite(v) ? null : nonNeg(v))),
  };
  const cases = {
    low: { mult: nonNeg(src.cases?.low?.mult ?? d.cases.low.mult), delay: clampInt(src.cases?.low?.delay ?? d.cases.low.delay, 0, TERM_MONTHS - 1) },
    high: { mult: nonNeg(src.cases?.high?.mult ?? d.cases.high.mult), delay: clampInt(src.cases?.high?.delay ?? d.cases.high.delay, 0, TERM_MONTHS - 1) },
  };
  return { ramp, adoption, billedLinked, billed, pupm, gcp, timeline, cases };
}

function isPreset(v: unknown): v is PresetId {
  return v === "contract" || v === "immediate" || v === "slow" || v === "delayed" || v === "custom";
}
function isPattern(v: unknown): v is Pattern {
  return v === "linear" || v === "front" || v === "back" || v === "scurve";
}
function fixedLength<T>(arr: readonly T[], n: number, fill: T): T[] {
  const out = arr.slice(0, n);
  while (out.length < n) out.push(fill);
  return out;
}

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

export interface MonthRow {
  /** 1-based planning month. */
  m: number;
  label: string;
  isExtension: boolean;
  /** Ordered units from the Order Form (0 beyond M12). */
  contracted: number;
  contractedFees: number;
  cumContractedFees: number;
  adoption: number;
  billed: number;
  pupm: number;
  geSpend: number;
  /** Eligible GCP spend entered for the month (0 if GCP allocation is off). */
  gcpEligible: number;
  /** The part of gcpEligible that counts toward the commitment after the cap. */
  gcpCounted: number;
  consumption: number;
  cumGe: number;
  cumGcp: number;
  cumConsumption: number;
  remaining: number;
  above: number;
  /** Licenses ordered but not adopted (as contracted view). */
  unusedContracted: number;
}

export interface WindowSummary {
  months: number;
  geSpend: number;
  gcpCounted: number;
  gcpEligible: number;
  consumption: number;
  utilization: number;
  unconsumed: number;
  above: number;
}

export interface Result {
  inputs: Inputs;
  months: MonthRow[];
  window: number;
  /** Totals over the whole modelled window. */
  total: WindowSummary;
  /** Totals over the contractual 12 months only. */
  term: WindowSummary;
  /** Earliest month in which cumulative consumption reaches the commitment; null if never within the window. */
  completionMonth: number | null;
  /** Months beyond 12 needed to complete (0 if done within the term; null if not done within the window). */
  extraMonths: number | null;
  /** Rough months beyond the window at the final month's run rate, when not complete. */
  monthsBeyondWindowEstimate: number | null;
  m12: { billed: number; adoption: number; required: number; met: boolean; shortfallUsers: number };
  userMonths12: number;
  avgBilled12: number;
  contractedUserMonths: number;
  unusedContractedUserMonths: number;
  gcp: { shortfallBeforeGcp: number; covered: number; gapAfter: number; cap: number | null; capBinding: boolean };
  approvals: string[];
  warnings: string[];
  errors: string[];
}

function gcpCap(gcp: GcpSpec): number | null {
  if (!gcp.enabled || gcp.capMode === "none") return null;
  if (gcp.capMode === "usd") return Math.max(0, gcp.capValue);
  return Math.max(0, (gcp.capValue / 100) * COMMITMENT);
}

/** Billed users for every month of the window, applying extension defaults. */
export function billedSeries(inputs: Inputs): number[] {
  const n = inputs.timeline.windowMonths;
  const out: number[] = [];
  const hold = inputs.billed[TERM_MONTHS - 1] ?? 0;
  for (let m = 1; m <= n; m += 1) {
    if (m <= TERM_MONTHS) out.push(inputs.billed[m - 1] ?? 0);
    else {
      const o = inputs.timeline.extUsers[m - TERM_MONTHS - 1];
      out.push(o == null ? hold : o);
    }
  }
  return out;
}

export function adoptionSeries(inputs: Inputs): number[] {
  const n = inputs.timeline.windowMonths;
  const out: number[] = [];
  const hold = inputs.adoption[TERM_MONTHS - 1] ?? 0;
  const billedHold = inputs.billed[TERM_MONTHS - 1] ?? 0;
  for (let m = 1; m <= n; m += 1) {
    if (m <= TERM_MONTHS) out.push(inputs.adoption[m - 1] ?? 0);
    else {
      // Extension adoption follows the extension billed override when linked; otherwise holds M12.
      const o = inputs.timeline.extUsers[m - TERM_MONTHS - 1];
      out.push(inputs.billedLinked && o != null ? o : (inputs.billedLinked ? billedHold : hold));
    }
  }
  return out;
}

export function gcpSeries(inputs: Inputs): number[] {
  const n = inputs.timeline.windowMonths;
  const out: number[] = [];
  if (!inputs.gcp.enabled) return new Array(n).fill(0);
  const m12 = TERM_MONTHS >= inputs.gcp.startMonth ? inputs.gcp.monthly : 0;
  for (let m = 1; m <= n; m += 1) {
    if (m <= TERM_MONTHS) out.push(m >= inputs.gcp.startMonth ? inputs.gcp.monthly : 0);
    else {
      const o = inputs.timeline.extGcp[m - TERM_MONTHS - 1];
      if (o != null) out.push(o);
      else out.push(m >= inputs.gcp.startMonth ? (inputs.gcp.startMonth > TERM_MONTHS ? inputs.gcp.monthly : m12) : 0);
    }
  }
  return out;
}

export function evaluate(raw: Inputs): Result {
  const inputs = normalize(raw);
  const errors: string[] = [];
  const warnings: string[] = [];
  const approvals: string[] = [];

  // Price rules: reject below floor (computed at the floor so the rest of the page stays coherent).
  let pupm = inputs.pupm;
  if (pupm < PUPM_FLOOR) {
    errors.push(`Price ${pupm.toFixed(2)} is below the ${PUPM_FLOOR.toFixed(2)} floor. Computed at the floor.`);
    pupm = PUPM_FLOOR;
  }
  if (Math.abs(pupm - PUPM) > 1e-9) {
    approvals.push(`Price of $${pupm.toFixed(2)} per user per month differs from the Order Form's $${PUPM.toFixed(2)} (list $5 less 60%) — needs an amended order form.`);
  }
  let extPupm = inputs.timeline.extPupm ?? pupm;
  if (extPupm < PUPM_FLOOR) {
    errors.push(`Extension price ${extPupm.toFixed(2)} is below the ${PUPM_FLOOR.toFixed(2)} floor. Computed at the floor.`);
    extPupm = PUPM_FLOOR;
  }

  const n = inputs.timeline.windowMonths;
  const billed = billedSeries(inputs);
  const adoption = adoptionSeries(inputs);
  const gcpEligible = gcpSeries(inputs);
  const cap = gcpCap(inputs.gcp);

  const months: MonthRow[] = [];
  let cumGe = 0, cumGcp = 0, cumContracted = 0, unusedUM = 0;
  let completionMonth: number | null = null;
  for (let m = 1; m <= n; m += 1) {
    const isExtension = m > TERM_MONTHS;
    const contracted = isExtension ? 0 : CONTRACTED_UNITS[m - 1];
    const contractedFees = contracted * PUPM;
    cumContracted += contractedFees;
    const price = isExtension ? extPupm : pupm;
    const ge = billed[m - 1] * price;
    const remainingCap = cap === null ? Infinity : Math.max(0, cap - cumGcp);
    const gcpCounted = Math.min(gcpEligible[m - 1], remainingCap);
    cumGe += ge;
    cumGcp += gcpCounted;
    const cum = cumGe + cumGcp;
    if (completionMonth === null && cum >= COMMITMENT - 1e-6) completionMonth = m;
    const unused = Math.max(0, contracted - adoption[m - 1]);
    unusedUM += unused;
    months.push({
      m, label: `M${m} · ${monthLabel(m)}`, isExtension,
      contracted, contractedFees, cumContractedFees: cumContracted,
      adoption: adoption[m - 1], billed: billed[m - 1], pupm: price,
      geSpend: ge, gcpEligible: gcpEligible[m - 1], gcpCounted,
      consumption: ge + gcpCounted, cumGe, cumGcp, cumConsumption: cum,
      remaining: Math.max(0, COMMITMENT - cum), above: Math.max(0, cum - COMMITMENT),
      unusedContracted: unused,
    });
  }

  const summarize = (upTo: number): WindowSummary => {
    const row = months[Math.min(upTo, months.length) - 1];
    const geSpend = row.cumGe, gcpCounted = row.cumGcp;
    const consumption = geSpend + gcpCounted;
    const eligible = months.slice(0, upTo).reduce((s, r) => s + r.gcpEligible, 0);
    return {
      months: upTo, geSpend, gcpCounted, gcpEligible: eligible, consumption,
      utilization: Math.min(consumption, COMMITMENT) / COMMITMENT,
      unconsumed: Math.max(0, COMMITMENT - consumption),
      above: Math.max(0, consumption - COMMITMENT),
    };
  };
  const total = summarize(n);
  const term = summarize(TERM_MONTHS);

  const m12Billed = billed[TERM_MONTHS - 1];
  const m12 = {
    billed: m12Billed,
    adoption: adoption[TERM_MONTHS - 1],
    required: REQUIRED_USERS_M12,
    met: m12Billed >= REQUIRED_USERS_M12,
    shortfallUsers: Math.max(0, REQUIRED_USERS_M12 - m12Billed),
  };

  const shortfallBeforeGcp = Math.max(0, COMMITMENT - total.geSpend);
  const covered = Math.min(total.gcpCounted, shortfallBeforeGcp);
  const gapAfter = Math.max(0, shortfallBeforeGcp - total.gcpCounted);
  const capBinding = cap !== null && total.gcpEligible > cap + 1e-9;

  const userMonths12 = inputs.billed.reduce((s, v) => s + v, 0);
  const contractedUserMonths = CONTRACTED_UNITS.reduce((s, v) => s + v, 0);

  let extraMonths: number | null = null;
  if (completionMonth !== null) extraMonths = Math.max(0, completionMonth - TERM_MONTHS);
  let monthsBeyondWindowEstimate: number | null = null;
  if (completionMonth === null) {
    const last = months[n - 1];
    monthsBeyondWindowEstimate = last.consumption > 0 ? Math.ceil(last.remaining / last.consumption) : null;
  }

  // Approval dependencies and warnings.
  const belowContracted = months.slice(0, TERM_MONTHS).some((r) => r.billed < r.contracted);
  const aboveContracted = months.slice(0, TERM_MONTHS).some((r) => r.billed > r.contracted);
  if (belowContracted) approvals.push("Billing fewer users than the ordered quantities in one or more months — re-basing the order schedule needs an amended order form. As signed, the ordered units are invoiced whether or not they are used.");
  if (aboveContracted) warnings.push("Billing more users than ordered in one or more months. The Order Form allows adding users coterminously (new order form or amendment) if all payments are on time.");
  if (inputs.gcp.enabled) approvals.push("Counting eligible GCP spend toward the commitment — not in the Order Form; requires approval.");
  if (n > TERM_MONTHS) approvals.push(`Spending beyond Month 12 (window of ${n} months) at $${extPupm.toFixed(2)} per user per month — the Order Form does not renew and post-term usage is at list price unless agreed in writing; requires approval.`);
  if (!m12.met) warnings.push(`Month-12 billed users (${Math.round(m12Billed).toLocaleString("en-US")}) are below the 650,000 in the final order term.`);
  if (inputs.gcp.enabled && total.gcpEligible === 0) warnings.push("GCP allocation is on but no eligible GCP spend is entered, so nothing is counted.");
  if (total.above > 0) warnings.push("Modelled consumption exceeds the commitment; the excess is additional spend, not a credit.");
  if (userMonths12 === 0) warnings.push("Zero billed users in the term: nothing is consumed and the full commitment is still owed.");
  else if (total.unconsumed > 0) warnings.push(`${fmtUsd(total.unconsumed)} of the commitment is unconsumed at the end of the window. The full $10.8M commitment is still owed — a shortfall creates no refund, rollover or extension.`);

  return {
    inputs: { ...inputs, pupm, timeline: { ...inputs.timeline, extPupm: inputs.timeline.extPupm === null ? null : extPupm } },
    months, window: n, total, term, completionMonth, extraMonths, monthsBeyondWindowEstimate,
    m12, userMonths12, avgBilled12: userMonths12 / TERM_MONTHS,
    contractedUserMonths, unusedContractedUserMonths: unusedUM,
    gcp: { shortfallBeforeGcp, covered, gapAfter, cap, capBinding },
    approvals, warnings, errors,
  };
}

// ---------------------------------------------------------------------------
// Solvers
// ---------------------------------------------------------------------------

export interface SolveResult {
  feasible: boolean;
  /** Month-12 users that make consumption meet the commitment by the end of the window. */
  exitUsers: number | null;
  /** Consumption at the maximum reachable ramp (ceiling or solver bound). */
  maxConsumption: number;
  gap: number;
  /** Constant users from launch month that would consume the commitment by the end of the window. */
  flatUsers: number | null;
  flatFeasible: boolean;
  reason: string;
}

/**
 * Inputs with the ramp re-targeted to a given Month-12 value.
 *  - parametric presets regenerate from launch month / start users / pattern;
 *  - contract and custom series are scaled proportionally so their shape is kept;
 *  - a series that is zero in M12 falls back to a parametric ramp.
 */
export function withExit(inputs: Inputs, exitUsers: number): Inputs {
  const { ramp } = inputs;
  const cap = (v: number) => (ramp.ceiling !== null ? Math.min(v, ramp.ceiling) : v);
  const relink = (spec: RampSpec, adoption: number[]) =>
    normalize({ ...inputs, ramp: spec, adoption, billedLinked: true, billed: adoption });
  if (ramp.preset === "immediate" || ramp.preset === "slow" || ramp.preset === "delayed") {
    const spec: RampSpec = { ...ramp, exitUsers };
    return relink(spec, generateRamp(spec));
  }
  const base = inputs.billedLinked ? inputs.adoption : inputs.billed;
  const last = base[TERM_MONTHS - 1];
  if (last > 0) {
    const k = exitUsers / last;
    const adoption = base.map((v) => Math.round(cap(v * k)));
    return relink({ ...ramp, preset: "custom", exitUsers }, adoption);
  }
  const spec: RampSpec = { ...ramp, preset: "immediate", exitUsers };
  return relink(spec, generateRamp(spec));
}

/** First planning month with billed users, or the configured launch month when there are none. */
export function effectiveLaunch(inputs: Inputs): number {
  const i = inputs.billed.findIndex((v) => v > 0);
  return i >= 0 ? i + 1 : inputs.ramp.launchMonth;
}

/**
 * Required Month-12 users for the current launch month / pattern / ceiling so
 * that consumption over the window equals the commitment (with the GCP and
 * extension settings as configured). Bisection on a monotone function.
 */
export function solveExitUsers(inputs0: Inputs): SolveResult {
  const inputs = normalize(inputs0);
  const target = COMMITMENT;
  const lo0 = inputs.ramp.startUsers;
  const bound = inputs.ramp.ceiling !== null ? inputs.ramp.ceiling : SOLVER_MAX_USERS;
  const consumptionAt = (e: number) => evaluate(withExit(inputs, e)).total.consumption;

  // Flat-from-launch requirement (for the readout).
  const launch = effectiveLaunch(inputs);
  const monthsActive = inputs.timeline.windowMonths - launch + 1;
  const gcpTotal = evaluate({ ...inputs, adoption: new Array(TERM_MONTHS).fill(0), billed: new Array(TERM_MONTHS).fill(0), billedLinked: true, ramp: { ...inputs.ramp, preset: "custom" } }).total.gcpCounted;
  const priceTerm = Math.max(inputs.pupm, PUPM_FLOOR);
  const priceExt = Math.max(inputs.timeline.extPupm ?? priceTerm, PUPM_FLOOR);
  const weighted = Math.max(0, Math.min(TERM_MONTHS, inputs.timeline.windowMonths) - launch + 1) * priceTerm
    + Math.max(0, inputs.timeline.windowMonths - TERM_MONTHS) * priceExt;
  const flatUsers = monthsActive > 0 && weighted > 0 ? Math.max(0, target - gcpTotal) / weighted : null;
  const flatFeasible = flatUsers !== null && (inputs.ramp.ceiling === null || flatUsers <= inputs.ramp.ceiling);

  const atMax = consumptionAt(bound);
  if (atMax < target - 1e-6) {
    const capNote = inputs.ramp.ceiling !== null
      ? `Even at the ${fmtUsers(inputs.ramp.ceiling)} ceiling from M${launch}`
      : `Even at ${fmtUsers(bound)} users in M12 (solver bound)`;
    return {
      feasible: false, exitUsers: null, maxConsumption: atMax, gap: target - atMax, flatUsers, flatFeasible,
      reason: `${capNote}, the window consumes ${fmtUsd(atMax)} — ${fmtUsd(target - atMax)} short. Launch earlier, extend the window, raise the ceiling, or count GCP spend.`,
    };
  }
  const atMin = consumptionAt(lo0);
  if (atMin >= target - 1e-6) {
    return {
      feasible: true, exitUsers: lo0, maxConsumption: atMax, gap: 0, flatUsers, flatFeasible,
      reason: `A flat ramp at the ${fmtUsers(lo0)} starting users already consumes the commitment; any growth over-consumes.`,
    };
  }
  let lo = lo0, hi = bound;
  for (let i = 0; i < 60 && hi - lo > 0.5; i += 1) {
    const mid = (lo + hi) / 2;
    if (consumptionAt(mid) >= target) hi = mid; else lo = mid;
  }
  const exit = Math.ceil(hi);
  return {
    feasible: true, exitUsers: exit, maxConsumption: atMax, gap: 0, flatUsers, flatFeasible,
    reason: `Reaching ${fmtUsers(exit)} billed users by M12 on the current launch month and growth pattern consumes the commitment by M${inputs.timeline.windowMonths}.`,
  };
}

/** Apply the solved exit value to the inputs (no-op when infeasible). */
export function applySolvedRamp(inputs: Inputs): Inputs {
  const s = solveExitUsers(inputs);
  if (!s.feasible || s.exitUsers === null) return normalize(inputs);
  return withExit(normalize(inputs), s.exitUsers);
}

function fmtUsers(v: number): string {
  return v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)}M` : `${Math.round(v / 1000)}K`;
}
function fmtUsd(v: number): string {
  return `$${(v / 1_000_000).toFixed(2)}M`;
}

// ---------------------------------------------------------------------------
// Scenario comparison
// ---------------------------------------------------------------------------

export type ScenarioId = "baseline" | "ramp" | "rampGcp" | "rampExt" | "combined";
export type CaseId = "low" | "base" | "high";

export const SCENARIO_LABEL: Record<ScenarioId, string> = {
  baseline: "Baseline (as contracted)",
  ramp: "Flexible ramp only",
  rampGcp: "Ramp + GCP allocation",
  rampExt: "Ramp + extension",
  combined: "Combined",
};
export const SCENARIO_IDS: ScenarioId[] = ["baseline", "ramp", "rampGcp", "rampExt", "combined"];
export const CASE_IDS: CaseId[] = ["low", "base", "high"];
export const CASE_LABEL: Record<CaseId, string> = { low: "Low adoption", base: "Base", high: "High adoption" };

/** Shift a 12-month series right by `delay` months and scale it. */
export function transformSeries(series: number[], mult: number, delay: number): number[] {
  const out: number[] = new Array(TERM_MONTHS).fill(0);
  for (let m = 0; m < TERM_MONTHS; m += 1) {
    const src = m - delay;
    out[m] = src >= 0 ? Math.round(series[src] * mult) : 0;
  }
  return out;
}

/** Inputs for an adoption case, honouring the ceiling when one is set. */
export function inputsForCase(inputs: Inputs, c: CaseId): Inputs {
  if (c === "base") return normalize(inputs);
  const spec = inputs.cases[c];
  const cap = (v: number) => (inputs.ramp.ceiling !== null ? Math.min(v, inputs.ramp.ceiling) : v);
  const adoption = transformSeries(inputs.adoption, spec.mult, spec.delay).map(cap);
  const billed = inputs.billedLinked ? adoption : transformSeries(inputs.billed, spec.mult, spec.delay).map(cap);
  return normalize({ ...inputs, ramp: { ...inputs.ramp, preset: "custom" }, adoption, billedLinked: inputs.billedLinked, billed });
}

/** Inputs for a scenario built on top of case inputs. */
export function inputsForScenario(base: Inputs, s: ScenarioId): Inputs {
  const off: GcpSpec = { ...base.gcp, enabled: false };
  const twelve: TimelineSpec = { ...base.timeline, windowMonths: TERM_MONTHS };
  const on: GcpSpec = { ...base.gcp, enabled: true };
  const ext: TimelineSpec = { ...base.timeline, windowMonths: Math.max(base.timeline.windowMonths, 18) };
  switch (s) {
    case "baseline":
      return normalize({ ...base, ramp: { ...base.ramp, preset: "custom" }, billedLinked: false, billed: CONTRACTED_UNITS.slice(), adoption: base.adoption, gcp: off, timeline: twelve, pupm: PUPM });
    case "ramp": return normalize({ ...base, gcp: off, timeline: twelve });
    case "rampGcp": return normalize({ ...base, gcp: on, timeline: twelve });
    case "rampExt": return normalize({ ...base, gcp: off, timeline: ext });
    case "combined": return normalize({ ...base, gcp: on, timeline: ext });
  }
}

export interface ScenarioCell {
  scenario: ScenarioId;
  c: CaseId;
  result: Result;
  window: number;
  m12Billed: number;
  m12Adoption: number;
  m12Met: boolean;
  geSpend: number;
  gcpEligible: number;
  gcpCounted: number;
  consumption: number;
  utilization: number;
  unconsumed: number;
  above: number;
  completionMonth: number | null;
  approvals: string[];
}

export function compareScenarios(inputs0: Inputs): Record<CaseId, Record<ScenarioId, ScenarioCell>> {
  const inputs = normalize(inputs0);
  const out = {} as Record<CaseId, Record<ScenarioId, ScenarioCell>>;
  for (const c of CASE_IDS) {
    const ci = inputsForCase(inputs, c);
    out[c] = {} as Record<ScenarioId, ScenarioCell>;
    for (const s of SCENARIO_IDS) {
      const si = inputsForScenario(ci, s);
      const r = evaluate(si);
      out[c][s] = {
        scenario: s, c, result: r, window: r.window,
        m12Billed: r.m12.billed, m12Adoption: r.m12.adoption, m12Met: r.m12.met,
        geSpend: r.total.geSpend, gcpEligible: r.total.gcpEligible, gcpCounted: r.total.gcpCounted,
        consumption: r.total.consumption, utilization: r.total.utilization,
        unconsumed: r.total.unconsumed, above: r.total.above,
        completionMonth: r.completionMonth,
        approvals: s === "baseline" ? [] : r.approvals,
      };
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Sensitivity: launch delay × adoption multiplier → unconsumed commitment
// ---------------------------------------------------------------------------

export const SENS_DELAYS = [0, 1, 2, 3, 4, 6];
export const SENS_MULTS = [0.5, 0.75, 1, 1.25, 1.5];

export interface SensCell { delay: number; mult: number; unconsumed: number; utilization: number; m12Billed: number; completionMonth: number | null }

export function sensitivity(inputs0: Inputs): SensCell[][] {
  const inputs = normalize(inputs0);
  return SENS_DELAYS.map((delay) => SENS_MULTS.map((mult) => {
    const cap = (v: number) => (inputs.ramp.ceiling !== null ? Math.min(v, inputs.ramp.ceiling) : v);
    const adoption = transformSeries(inputs.adoption, mult, delay).map(cap);
    const billed = inputs.billedLinked ? adoption : transformSeries(inputs.billed, mult, delay).map(cap);
    const r = evaluate(normalize({ ...inputs, ramp: { ...inputs.ramp, preset: "custom" }, adoption, billed }));
    return { delay, mult, unconsumed: r.total.unconsumed, utilization: r.total.utilization, m12Billed: r.m12.billed, completionMonth: r.completionMonth };
  }));
}

// ---------------------------------------------------------------------------
// Small helpers used by the UI
// ---------------------------------------------------------------------------

/** One-sentence live readout of the commercial position. */
export function readout(r: Result): string {
  const n = r.window;
  const consumed = fmtUsd(r.total.consumption);
  const util = `${(r.total.utilization * 100).toFixed(0)}%`;
  const m12 = r.m12.met
    ? `Month-12 billed users ${fmtUsers(r.m12.billed)} meet the 650K requirement.`
    : `Month-12 billed users ${fmtUsers(r.m12.billed)} fall ${fmtUsers(r.m12.shortfallUsers)} short of the 650K requirement.`;
  if (r.completionMonth !== null && r.completionMonth <= TERM_MONTHS) {
    return `The $10.8M commitment is fully consumed by M${r.completionMonth}, inside the 12-month term${r.total.above > 0 ? `, with ${fmtUsd(r.total.above)} of spend above it over ${n} months` : ""}. ${m12}`;
  }
  if (r.completionMonth !== null) {
    return `Consumption reaches $10.8M in M${r.completionMonth} — ${r.extraMonths} month${r.extraMonths === 1 ? "" : "s"} beyond the term, with ${fmtUsd(r.term.unconsumed)} still unconsumed at Month 12. The full $10.8M is owed under the Order Form regardless. ${m12}`;
  }
  return `Over ${n} months the plan consumes ${consumed} (${util}) and leaves ${fmtUsd(r.total.unconsumed)} of the $10.8M unconsumed${r.monthsBeyondWindowEstimate ? ` — roughly ${r.monthsBeyondWindowEstimate} more month${r.monthsBeyondWindowEstimate === 1 ? "" : "s"} at the final run rate` : ""}. The full commitment is still owed. ${m12}`;
}

export { COMMITMENT, TERM_MONTHS, REQUIRED_USERS_M12, PUPM, PUPM_FLOOR, CONTRACTED_UNITS };
