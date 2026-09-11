/**
 * Deal-check engine: compares a customer's Anthropic workload under
 * AWS MAP 2.0 versus the Google Private Offer. Pure TypeScript, no DOM.
 *
 * Money is $M. Time is months, index 0..35 (month 0 = Sep 2026).
 * Three routes are simulated on identical spend:
 *   nothing — stay where the workload is, no program
 *   aws     — workload on Bedrock under MAP
 *   gcp     — workload on GCP marketplace under the Private Offer
 */

import { GOOGLE, AWS, MONTHS, type InputKey } from "./terms";

export type Platform = "direct" | "aws" | "gcp";
export type Route = "nothing" | "aws" | "gcp";
export type Horizon = 12 | 24 | 36;
export type MapAfter = "none" | "extend" | "restructure";

export interface Inputs {
  platform: Platform;
  anthSpend: number;
  growth: number;
  awsBaseline: number;
  gcpBaselineQ: number;
  horizon: Horizon;
  migPct: number;
  migStart: number;
  migRamp: number;
  migCost: number;
  gcpSignMonth: number;
  awsCommitRemaining: number;
  awsCommitMonths: number;
  awsOtherSpend: number;
  mapPct: number;
  partnerPass: number;
  mapYears: number;
  mapAfter: MapAfter;
  mapCommitArr: number;
  awsDiscount: number;
  awsCreditUse: number;
  gcpCommitNew: number;
  gcpCommitYears: number;
  gcpCommitExisting: number;
  gcpCommitExistingMonths: number;
  gcpAiSpend: number;
  gcpOtherSpend: number;
  gcpPct: number;
  gcpCap: number;
  /** Forecast Y1 incremental marketplace spend the credit pool is sized on ($M); 0 = the model's own Y1 figure. */
  gcpForecastY1: number;
  mktCapPct: number;
  mktException: boolean;
  gcpDiscount: number;
  directDiscount: number;
  /** Test hook: 36 monthly $M values overriding the growth formula. */
  spendSeries?: number[];
}

export type NumericKey = {
  [K in keyof Inputs]-?: Inputs[K] extends number ? K : never;
}[keyof Inputs];

export function defaults(): Inputs {
  return {
    platform: "aws",
    anthSpend: 12,
    growth: 60,
    awsBaseline: 12,
    gcpBaselineQ: 0,
    horizon: 24,
    migPct: 100,
    migStart: 0,
    migRamp: 3,
    migCost: 0.5,
    gcpSignMonth: 0,
    awsCommitRemaining: 12,
    awsCommitMonths: 12,
    awsOtherSpend: 12,
    mapPct: AWS.creditPct.value,
    partnerPass: 0,
    mapYears: 1,
    mapAfter: "none",
    mapCommitArr: 0,
    awsDiscount: 0,
    awsCreditUse: 100,
    gcpCommitNew: GOOGLE.minIacv.value,
    gcpCommitYears: 3,
    gcpCommitExisting: 0,
    gcpCommitExistingMonths: 0,
    gcpAiSpend: 6,
    gcpOtherSpend: 4,
    gcpPct: GOOGLE.dpoMaxPct.value,
    gcpCap: GOOGLE.capTotal.value,
    gcpForecastY1: 0,
    mktCapPct: GOOGLE.mktCapPct.value,
    mktException: false,
    gcpDiscount: 0,
    directDiscount: 0,
  };
}

export const ROUTES: Route[] = ["nothing", "aws", "gcp"];
export const ROUTE_LABEL: Record<Route, string> = { nothing: "Do nothing", aws: "AWS MAP", gcp: "Google offer" };

/* ------------------------------------------------------------------ */
/* Result types                                                          */
/* ------------------------------------------------------------------ */

export interface Quarter {
  /** Settlement month (last month of the quarter). */
  month: number;
  spend: number;
  baseline: number;
  incremental: number;
  credit: number;
  /** Credit actually settled this month (after cap / gate). */
  settled: number;
}

export interface CommitLeg {
  index: number;
  start: number;
  end: number;
  amount: number;
  consumed: number;
  stranded: number;
  /** Month the stranding is recognised, or null if projected past month 35. */
  strandMonth: number | null;
  projected: boolean;
}

export interface CommitState {
  amount: number;
  months: number;
  consumed: number;
  stranded: number;
  strandMonth: number | null;
  projected: boolean;
}

export interface Series {
  spend: number[];
  onAws: number[];
  onGcp: number[];
  onDirect: number[];
  anthNet: number[];
  mig: number[];
  awsCredit: number[];
  gcpCredit: number[];
  awsUsed: number[];
  gcpUsed: number[];
  stranded: number[];
  excessMkt: number[];
  net: number[];
  cumNet: number[];
}

export interface Totals {
  gross: number;
  mig: number;
  strandedWithin: number;
  strandedBeyond: number;
  creditsEarned: number;
  creditsUsed: number;
  awsEarned: number;
  awsUsed: number;
  gcpEarned: number;
  gcpUsed: number;
  awsUncapped: number;
  gcpUncapped: number;
  existingConsumedAws: number;
  existingConsumedGcp: number;
  incrementalCommit: number;
  incrementalCommitKind: "soft" | "hard" | "none";
  excessMkt: number;
  effectiveIncentive: number;
  net: number;
}

export interface RouteResult {
  route: Route;
  migrates: boolean;
  series: Series;
  totals: Totals;
  google: {
    eligible: boolean;
    capBinding: boolean;
    uncapped: number;
    earned: number;
    quarters: Quarter[];
    windowStart: number;
    windowEnd: number;
    /** Forecast Y1 incremental marketplace spend the pool is sized on. */
    forecastY1: number;
    /** Credit pool: rate × forecast, then the account cap. */
    pool: number;
    /** True when the forecast sizing, not the $5M cap, limits the credit. */
    forecastBinding: boolean;
  };
  map: {
    arr: number;
    gate: number;
    gateMonth: number | null;
    programStart: number;
    yearTagged: number[];
    quarters: Quarter[];
    heldForever: number;
  };
  awsCommit: CommitState;
  gcpExisting: CommitState;
  gcpLegs: CommitLeg[];
}

export type Rank = "strong-gcp" | "gcp" | "close" | "aws";

export const RANK_LABEL: Record<Rank, string> = {
  "strong-gcp": "Strong GCP win",
  gcp: "GCP win",
  close: "Close",
  aws: "AWS win",
};

export type DriverKey = "credits" | "stranded" | "migration" | "spend";

export interface Driver {
  key: DriverKey;
  label: string;
  /** Positive favours Google, negative favours AWS. */
  delta: number;
  sentence: string;
  components: Record<DriverKey, number>;
}

export type FlagLevel = "info" | "warn" | "stop";

export interface Flag {
  id: string;
  level: FlagLevel;
  text: string;
}

export interface Result {
  inputs: Inputs;
  horizon: Horizon;
  routes: Record<Route, RouteResult>;
  advantage: number;
  advPct: number;
  rank: Rank;
  doNothingBest: boolean;
  breakEven: number | null;
  driver: Driver;
  flags: Flag[];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                               */
/* ------------------------------------------------------------------ */

const zeros = () => new Array<number>(MONTHS).fill(0);
const sum = (a: number[], from = 0, to = MONTHS) => {
  let s = 0;
  for (let i = Math.max(0, from); i < Math.min(to, a.length); i++) s += a[i];
  return s;
};
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

export function spendSeries(inp: Inputs): number[] {
  if (inp.spendSeries && inp.spendSeries.length) {
    const s = zeros();
    for (let m = 0; m < MONTHS; m++) s[m] = inp.spendSeries[m] ?? 0;
    return s;
  }
  const s = zeros();
  const g = 1 + inp.growth / 100;
  for (let m = 0; m < MONTHS; m++) s[m] = (inp.anthSpend / 12) * Math.pow(Math.max(g, 0), m / 12);
  return s;
}

/** Migrated share of spend in month m on a migrating route. */
export function migratedShare(inp: Inputs, m: number): number {
  const start = Math.round(inp.migStart);
  if (m < start) return 0;
  const pct = clamp(inp.migPct, 0, 100) / 100;
  if (inp.migRamp <= 0) return pct;
  return pct * Math.min(1, (m - start + 1) / inp.migRamp);
}

/* ------------------------------------------------------------------ */
/* Route simulation                                                      */
/* ------------------------------------------------------------------ */

function simulateRoute(inp: Inputs, route: Route, H: Horizon): RouteResult {
  const P = inp.platform;
  const target: Platform = route === "nothing" ? P : route;
  const migrates = route !== "nothing" && route !== P;
  const migStart = Math.round(inp.migStart);
  const spend = spendSeries(inp);

  const onAws = zeros(), onGcp = zeros(), onGcpGross = zeros(), onDirect = zeros(), anthNet = zeros(), mig = zeros();

  // 2. Allocation and discounts
  for (let m = 0; m < MONTHS; m++) {
    const S = spend[m];
    const alloc: Record<Platform, number> = { direct: 0, aws: 0, gcp: 0 };
    if (migrates) {
      const f = migratedShare(inp, m);
      alloc[target] += f * S;
      alloc[P] += (1 - f) * S;
    } else {
      alloc[target] = S;
    }
    onAws[m] = alloc.aws * (1 - inp.awsDiscount / 100);
    onGcpGross[m] = alloc.gcp;
    onGcp[m] = alloc.gcp * (1 - inp.gcpDiscount / 100);
    onDirect[m] = alloc.direct * (1 - inp.directDiscount / 100);
    anthNet[m] = onAws[m] + onGcp[m] + onDirect[m];
  }
  // 3. Migration cost
  if (migrates && migStart >= 0 && migStart < MONTHS) mig[migStart] = inp.migCost;

  // 4. AWS MAP credits (aws route only)
  const awsCredit = zeros();
  const map: RouteResult["map"] = { arr: 0, gate: 0, gateMonth: null, programStart: 0, yearTagged: [0, 0, 0], quarters: [], heldForever: 0 };
  let awsUncapped = 0;
  if (route === "aws") {
    const p0 = P === "aws" ? 0 : migStart;
    map.programStart = p0;
    for (let y = 0; y < 3; y++) map.yearTagged[y] = sum(onAws, p0 + 12 * y, p0 + 12 * y + 12);
    map.arr = inp.mapCommitArr > 0 ? inp.mapCommitArr : map.yearTagged[0];
    map.gate = (AWS.gatePctOfArr.value / 100) * map.arr;
    let held = 0, cum = 0, released = false;
    for (let q = 0; p0 + 3 * q + 2 < MONTHS; q++) {
      const y = Math.floor(q / 4);
      let baseline: number | null;
      if (y === 0) baseline = inp.awsBaseline;
      else if (y < inp.mapYears || inp.mapAfter === "extend") baseline = map.yearTagged[y - 1];
      else if (inp.mapAfter === "restructure") baseline = 0;
      else baseline = null;
      const end = p0 + 3 * q + 2;
      const Tq = sum(onAws, p0 + 3 * q, end + 1);
      cum += Tq;
      if (baseline === null) break; // program over
      const inc = Math.max(0, Tq - baseline / 4);
      const c = inc * (inp.mapPct + inp.partnerPass) / 100;
      awsUncapped += c;
      if (!released && cum >= map.gate - 1e-12) {
        released = true;
        map.gateMonth = end;
      }
      let settled = 0;
      if (released) {
        settled = held + c;
        held = 0;
        awsCredit[end] += settled;
      } else {
        held += c;
      }
      map.quarters.push({ month: end, spend: Tq, baseline: baseline / 4, incremental: inc, credit: c, settled });
    }
    map.heldForever = held;
  }

  // 5. Google credits (gcp route only)
  const gcpCredit = zeros();
  const sign = Math.round(inp.gcpSignMonth);
  const google: RouteResult["google"] = {
    eligible: inp.gcpCommitNew >= GOOGLE.minIacv.value,
    capBinding: false,
    uncapped: 0,
    earned: 0,
    quarters: [],
    windowStart: sign,
    windowEnd: sign + GOOGLE.windowMonths.value - 1,
    forecastY1: 0,
    pool: 0,
    forecastBinding: false,
  };
  if (route === "gcp" && google.eligible) {
    // Credits are earned on top-line (undiscounted) marketplace spend above the
    // last-full-quarter baseline, sized on the forecast Y1 incremental spend and
    // capped per account; quarterly settlement stands in for spend milestones.
    const qs: { start: number; end: number; Sq: number; inc: number }[] = [];
    for (let q = 0; q < 4; q++) {
      const start = sign + 3 * q, end = start + 2;
      if (end >= MONTHS) break;
      const Sq = sum(onGcpGross, start, end + 1);
      qs.push({ start, end, Sq, inc: Math.max(0, Sq - inp.gcpBaselineQ) });
    }
    const modelY1 = qs.reduce((t, q) => t + q.inc, 0);
    google.forecastY1 = inp.gcpForecastY1 > 0 ? inp.gcpForecastY1 : modelY1;
    const sized = (google.forecastY1 * inp.gcpPct) / 100;
    google.pool = Math.max(0, Math.min(inp.gcpCap, sized));
    let earned = 0;
    for (const q of qs) {
      const c = (q.inc * inp.gcpPct) / 100;
      google.uncapped += c;
      const allowed = Math.max(0, Math.min(c, google.pool - earned));
      earned += allowed;
      gcpCredit[q.end] += allowed;
      google.quarters.push({ month: q.end, spend: q.Sq, baseline: inp.gcpBaselineQ, incremental: q.inc, credit: c, settled: allowed });
    }
    google.earned = earned;
    google.capBinding = google.uncapped > inp.gcpCap + 1e-9 && inp.gcpCap <= sized + 1e-9;
    google.forecastBinding = google.uncapped > google.pool + 1e-9 && sized < inp.gcpCap - 1e-9;
  }

  // Credit usage — greedy carry-forward, usable from the month after settlement
  const awsUsed = zeros(), gcpUsed = zeros();
  {
    let bal = 0;
    for (let m = 0; m < MONTHS; m++) {
      const cap = (onAws[m] + inp.awsOtherSpend / 12) * clamp(inp.awsCreditUse, 0, 100) / 100;
      const use = Math.min(bal, Math.max(0, cap));
      awsUsed[m] = use;
      bal -= use;
      bal += awsCredit[m];
    }
  }
  {
    let bal = 0;
    for (let m = 0; m < MONTHS; m++) {
      const cap = Math.max(0, inp.gcpAiSpend / 12);
      const use = Math.min(bal, cap);
      gcpUsed[m] = use;
      bal -= use;
      bal += gcpCredit[m];
    }
  }

  // 6. Commits
  const stranded = zeros();
  const excessMkt = zeros();

  // AWS existing commit (all routes)
  const awsCommit: CommitState = { amount: inp.awsCommitRemaining, months: inp.awsCommitMonths, consumed: 0, stranded: 0, strandMonth: null, projected: false };
  let awsConsumedWithinH = 0;
  if (inp.awsCommitRemaining > 0 && inp.awsCommitMonths > 0) {
    const T = Math.round(inp.awsCommitMonths);
    let consumed = 0, last = 0;
    for (let m = 0; m < Math.min(T, MONTHS); m++) {
      last = onAws[m] + inp.awsOtherSpend / 12;
      consumed += last;
      if (m < H) awsConsumedWithinH = consumed;
    }
    if (T <= MONTHS) {
      awsCommit.stranded = Math.max(0, inp.awsCommitRemaining - consumed);
      awsCommit.strandMonth = T - 1;
      stranded[T - 1] += awsCommit.stranded;
    } else {
      consumed += last * (T - MONTHS);
      awsCommit.stranded = Math.max(0, inp.awsCommitRemaining - consumed);
      awsCommit.projected = true;
    }
    awsCommit.consumed = Math.min(inp.awsCommitRemaining, consumed);
  }

  // GCP commits: existing (all routes) + new legs (gcp route only)
  const E = inp.gcpCommitExisting, ET = Math.round(inp.gcpCommitExistingMonths);
  const existingActiveAmount = E > 0 && ET > 0 ? E : 0;
  const annualisedExisting = existingActiveAmount > 0 ? (E / ET) * 12 : 0;
  const gcpExisting: CommitState = { amount: E, months: ET, consumed: 0, stranded: 0, strandMonth: null, projected: false };
  const legs: CommitLeg[] = [];
  if (route === "gcp" && inp.gcpCommitNew > 0) {
    for (let k = 0; k < Math.round(inp.gcpCommitYears); k++) {
      const start = sign + 12 * k;
      if (start >= MONTHS) break;
      legs.push({ index: k, start, end: start + 11, amount: inp.gcpCommitNew, consumed: 0, stranded: 0, strandMonth: null, projected: false });
    }
  }
  let existingConsumed = 0, existingConsumedWithinH = 0;
  let lastPoolExisting = 0;
  const legLast = new Map<number, number>();
  // Marketplace spend counts towards a commit only up to mktCapPct of that commit
  // (the existing commit over its term, each new leg over its year), unless the
  // exception is granted. Pools are drawn existing-first, like consumption.
  const capShare = clamp(inp.mktCapPct, 0, 100) / 100;
  let existingCapLeft = inp.mktException ? Infinity : capShare * existingActiveAmount;
  const legCapLeft = new Map<number, number>(legs.map((l) => [l.index, inp.mktException ? Infinity : capShare * l.amount]));
  void annualisedExisting;
  for (let m = 0; m < MONTHS; m++) {
    const existingActive = existingActiveAmount > 0 && m < ET;
    const leg = legs.find((l) => m >= l.start && m <= l.end);
    let counted = 0, rem = onGcp[m];
    if (existingActive) {
      const take = Math.min(rem, existingCapLeft);
      existingCapLeft -= take; counted += take; rem -= take;
    }
    if (leg) {
      const left = legCapLeft.get(leg.index) ?? 0;
      const take = Math.min(rem, left);
      legCapLeft.set(leg.index, left - take); counted += take; rem -= take;
    }
    excessMkt[m] = onGcp[m] - counted;
    let pool = counted + inp.gcpAiSpend / 12 + inp.gcpOtherSpend / 12;
    if (existingActive) {
      const take = Math.min(pool, Math.max(0, E - existingConsumed));
      lastPoolExisting = pool;
      existingConsumed += take;
      pool -= take;
      if (m < H) existingConsumedWithinH = existingConsumed;
      if (m === ET - 1) {
        gcpExisting.stranded = Math.max(0, E - existingConsumed);
        gcpExisting.strandMonth = m;
        stranded[m] += gcpExisting.stranded;
      }
    }
    if (leg) {
      leg.consumed += pool;
      legLast.set(leg.index, pool);
      if (m === leg.end) {
        leg.stranded = Math.max(0, leg.amount - leg.consumed);
        leg.strandMonth = m;
        stranded[m] += leg.stranded;
      }
    }
  }
  if (existingActiveAmount > 0 && ET > MONTHS) {
    const projected = existingConsumed + lastPoolExisting * (ET - MONTHS);
    gcpExisting.stranded = Math.max(0, E - projected);
    gcpExisting.projected = true;
  }
  gcpExisting.consumed = Math.min(E, existingConsumed);
  for (const leg of legs) {
    if (leg.end >= MONTHS) {
      const projected = leg.consumed + (legLast.get(leg.index) ?? 0) * (leg.end - MONTHS + 1);
      leg.stranded = Math.max(0, leg.amount - projected);
      leg.projected = true;
    }
  }

  // 7. Net cost
  const net = zeros(), cumNet = zeros();
  let cum = 0;
  for (let m = 0; m < MONTHS; m++) {
    net[m] = anthNet[m] + mig[m] + stranded[m] - awsUsed[m] - gcpUsed[m];
    cum += net[m];
    cumNet[m] = cum;
  }

  const gross = sum(anthNet, 0, H);
  const migT = sum(mig, 0, H);
  const strandedWithin = sum(stranded, 0, H);
  const strandedBeyond =
    sum(stranded, H, MONTHS) +
    (awsCommit.projected ? awsCommit.stranded : 0) +
    (gcpExisting.projected ? gcpExisting.stranded : 0) +
    legs.filter((l) => l.projected).reduce((s, l) => s + l.stranded, 0);
  const awsEarned = sum(awsCredit, 0, H), gcpEarned = sum(gcpCredit, 0, H);
  const awsUsedT = sum(awsUsed, 0, H), gcpUsedT = sum(gcpUsed, 0, H);
  const creditsEarned = awsEarned + gcpEarned;
  const creditsUsed = awsUsedT + gcpUsedT;
  const netT = gross + migT + strandedWithin - creditsUsed;

  const totals: Totals = {
    gross,
    mig: migT,
    strandedWithin,
    strandedBeyond,
    creditsEarned,
    creditsUsed,
    awsEarned,
    awsUsed: awsUsedT,
    gcpEarned,
    gcpUsed: gcpUsedT,
    awsUncapped,
    gcpUncapped: google.uncapped,
    existingConsumedAws: Math.min(inp.awsCommitRemaining, awsConsumedWithinH),
    existingConsumedGcp: Math.min(E, existingConsumedWithinH),
    incrementalCommit: route === "aws" ? map.arr * inp.mapYears : route === "gcp" ? inp.gcpCommitNew * inp.gcpCommitYears : 0,
    incrementalCommitKind: route === "aws" ? "soft" : route === "gcp" ? "hard" : "none",
    excessMkt: sum(excessMkt, 0, H),
    effectiveIncentive: gross > 0 ? creditsUsed / gross : 0,
    net: netT,
  };

  return {
    route,
    migrates,
    series: { spend, onAws, onGcp, onDirect, anthNet, mig, awsCredit, gcpCredit, awsUsed, gcpUsed, stranded, excessMkt, net, cumNet },
    totals,
    google,
    map,
    awsCommit,
    gcpExisting,
    gcpLegs: legs,
  };
}

/* ------------------------------------------------------------------ */
/* Verdict                                                               */
/* ------------------------------------------------------------------ */

export function rankOf(advantage: number, advPct: number): Rank {
  if (advantage >= 3 || (advPct >= 0.1 && advantage >= 0.5)) return "strong-gcp";
  if (advantage > 0 && advPct >= 0.02) return "gcp";
  if (Math.abs(advPct) < 0.02) return "close";
  return "aws";
}

function breakEvenMonth(aws: RouteResult, gcp: RouteResult, H: number): number | null {
  const a = aws.series.cumNet, g = gcp.series.cumNet;
  if (!(g[H - 1] < a[H - 1] - 1e-9)) return null;
  let m = H - 1;
  while (m > 0 && g[m - 1] <= a[m - 1] + 1e-9) m--;
  return m + 1; // 1-indexed month
}

const money = (x: number) => `$${Math.abs(x).toFixed(x >= 10 ? 1 : 2)}M`;

function driverOf(aws: RouteResult, gcp: RouteResult): Driver {
  const a = aws.totals, g = gcp.totals;
  // Positive favours Google.
  const components: Record<DriverKey, number> = {
    credits: g.creditsUsed - a.creditsUsed,
    stranded: a.strandedWithin - g.strandedWithin,
    migration: a.mig - g.mig,
    spend: a.gross - g.gross,
  };
  const label: Record<DriverKey, string> = { credits: "usable credits", stranded: "stranded commit", migration: "migration cost", spend: "discounted spend" };
  let key: DriverKey = "credits";
  for (const k of Object.keys(components) as DriverKey[]) if (Math.abs(components[k]) > Math.abs(components[key])) key = components[k] === 0 ? key : k;
  const d = components[key];
  const who = d > 0 ? "Google" : "AWS";
  let sentence: string;
  if (Math.abs(d) < 1e-9) sentence = "No component separates the two programs at this horizon.";
  else if (key === "credits") sentence = `The biggest driver is usable credits: the ${who} route applies ${money(d)} more credit against the bill within the horizon.`;
  else if (key === "stranded") sentence = `The biggest driver is stranded commit: the ${d > 0 ? "AWS" : "Google"} route strands ${money(d)} more of committed spend within the horizon.`;
  else if (key === "migration") sentence = `The biggest driver is migration cost: the ${d > 0 ? "AWS" : "Google"} route carries ${money(d)} more one-off migration cost.`;
  else sentence = `The biggest driver is discounted spend: the ${who} route bills ${money(d)} less for the same workload after platform discounts.`;
  return { key, label: label[key], delta: d, sentence, components };
}

function flagsOf(inp: Inputs, routes: Record<Route, RouteResult>, H: Horizon): Flag[] {
  const f: Flag[] = [];
  const g = routes.gcp, a = routes.aws;
  const sign = Math.round(inp.gcpSignMonth);
  if (inp.gcpCommitNew < GOOGLE.minIacv.value)
    f.push({ id: "eligibility", level: "stop", text: `Not eligible: new GCP commit is below the $${GOOGLE.minIacv.value}M iACV minimum. The Google route earns no credits.` });
  f.push({ id: "eligibility-list", level: "info", text: `Google offer requires the account to be on the pre-approved list of ${GOOGLE.eligibleAccounts.value.total} (Americas ${GOOGLE.eligibleAccounts.value.americas}, JAPAC ${GOOGLE.eligibleAccounts.value.japac}, EMEA ${GOOGLE.eligibleAccounts.value.emea}); no exceptions.` });
  if (sign > GOOGLE.executeByMonthIndex.value)
    f.push({ id: "validity", level: "stop", text: `Google contract signing in month ${sign} is after the ${GOOGLE.executeBy.value} validity deadline (month ${GOOGLE.executeByMonthIndex.value} from ${"Sep 2026"}).` });
  if (inp.gcpPct > GOOGLE.dpoMaxPct.value)
    f.push({ id: "dpo-rate", level: "warn", text: `Google credit rate of ${inp.gcpPct}% exceeds DPO authority (${GOOGLE.dpoMaxPct.value}%); requires DPM approval.` });
  if (inp.gcpCommitYears > GOOGLE.dpoMaxYears.value)
    f.push({ id: "dpo-years", level: "warn", text: `A ${inp.gcpCommitYears}-year GCP deal is longer than DPO authority allows (${GOOGLE.dpoMaxYears.value} years); requires DPM.` });
  if (inp.mktException)
    f.push({ id: "mkt-exception", level: "warn", text: "Marketplace cap exception in use: needs DPM + DPO approval and an exception form." });
  if (g.google.capBinding)
    f.push({ id: "cap", level: "info", text: `Google credit cap binds: $${g.google.uncapped.toFixed(2)}M would accrue uncapped, $${inp.gcpCap}M is the cap.` });
  if (g.google.forecastBinding)
    f.push({ id: "forecast", level: "warn", text: `Google pool is sized on a forecast Y1 incremental spend of $${g.google.forecastY1.toFixed(2)}M ($${g.google.pool.toFixed(2)}M); actual spend would accrue $${g.google.uncapped.toFixed(2)}M. Raise the forecast at signing if the plan supports it.` });
  const gUnused = g.totals.gcpEarned - g.totals.gcpUsed;
  if (gUnused > 0.005)
    f.push({ id: "gcp-unused", level: "warn", text: `$${gUnused.toFixed(2)}M of Google credits cannot be consumed within ${H} months: eligible Cloud AI spend is only $${inp.gcpAiSpend}M/yr.` });
  const aUnused = a.totals.awsEarned - a.totals.awsUsed;
  if (aUnused > 0.005)
    f.push({ id: "aws-unused", level: "warn", text: `$${aUnused.toFixed(2)}M of AWS credits remain unused within ${H} months.` });
  if (a.map.heldForever > 0.005)
    f.push({ id: "aws-gate", level: "warn", text: `$${a.map.heldForever.toFixed(2)}M of MAP credits never release: tagged spend does not reach the 10% of committed ARR gate ($${a.map.gate.toFixed(2)}M).` });
  if (g.totals.excessMkt > 0.005)
    f.push({ id: "excess-mkt", level: "warn", text: `$${g.totals.excessMkt.toFixed(2)}M of marketplace spend does not count towards the GCP commit (cap ${inp.mktCapPct}% per leg).` });
  for (const r of ROUTES) {
    const t = routes[r].totals;
    if (t.strandedBeyond > 0.005)
      f.push({ id: `beyond-${r}`, level: "info", text: `${ROUTE_LABEL[r]}: $${t.strandedBeyond.toFixed(2)}M of commit strands after the ${H}-month horizon and is not in the net cost.` });
  }
  const fieldItems: string[] = [`MAP credit rate ${inp.mapPct}%`, "10% of ARR redemption gate", "quarterly settlement", "soft one-year commit"];
  if (inp.partnerPass > 0) fieldItems.push(`partner pass-back ${inp.partnerPass}%`);
  if (inp.mapYears > 1) fieldItems.push(`multi-year MAP (${inp.mapYears} years, increment only)`);
  if (inp.mapAfter !== "none") fieldItems.push(inp.mapAfter === "extend" ? "post-term extension" : "post-term partner restructure (baseline reset)");
  f.push({ id: "field", level: "info", text: `AWS figures rest on field-reported, unverified terms: ${fieldItems.join("; ")}.` });
  // Migration lag vs Google earning window
  const migStart = Math.round(inp.migStart);
  if (g.migrates && g.google.eligible) {
    const full = inp.migRamp > 0 ? migStart + inp.migRamp - 1 : migStart;
    if (migStart > g.google.windowEnd)
      f.push({ id: "window-missed", level: "stop", text: `Migration starts in month ${migStart}, after the Google earning window closes (months ${g.google.windowStart}–${g.google.windowEnd}). No Google credits.` });
    else if (full > g.google.windowStart)
      f.push({ id: "window-lag", level: "warn", text: `Workload is fully on GCP only in month ${full}; ${Math.min(full, g.google.windowEnd) - g.google.windowStart} of the 12 earning-window months pass with less than full spend.` });
    if (sign > migStart)
      f.push({ id: "sign-after-move", level: "warn", text: `Google contract signs in month ${sign}, after migration starts in month ${migStart}: spend before signing raises the baseline. Set the last-quarter baseline accordingly.` });
  }
  const aStrand = a.awsCommit.stranded, gStrand = g.awsCommit.stranded;
  if (gStrand > aStrand + 0.005)
    f.push({ id: "aws-strand", level: "warn", text: `Moving to Google strands $${(gStrand - aStrand).toFixed(2)}M more of the existing AWS commit${g.awsCommit.projected ? " (projected past month 36)" : ""}.` });
  return f;
}

/* ------------------------------------------------------------------ */
/* Public API                                                            */
/* ------------------------------------------------------------------ */

export function evaluate(inputs: Inputs, horizon: Horizon = inputs.horizon): Result {
  const H = horizon;
  const routes = {
    nothing: simulateRoute(inputs, "nothing", H),
    aws: simulateRoute(inputs, "aws", H),
    gcp: simulateRoute(inputs, "gcp", H),
  };
  const awsNet = routes.aws.totals.net, gcpNet = routes.gcp.totals.net;
  const advantage = awsNet - gcpNet;
  const denom = Math.max(Math.abs(awsNet), Math.abs(gcpNet));
  const advPct = denom > 0 ? advantage / denom : 0;
  const rank = rankOf(advantage, advPct);
  const doNothingBest = routes.nothing.totals.net < Math.min(awsNet, gcpNet) - 1e-9;
  return {
    inputs,
    horizon: H,
    routes,
    advantage,
    advPct,
    rank,
    doNothingBest,
    breakEven: breakEvenMonth(routes.aws, routes.gcp, H),
    driver: driverOf(routes.aws, routes.gcp),
    flags: flagsOf(inputs, routes, H),
  };
}

export function advantageOf(inputs: Inputs, horizon: Horizon = inputs.horizon): number {
  const aws = simulateRoute(inputs, "aws", horizon), gcp = simulateRoute(inputs, "gcp", horizon);
  return aws.totals.net - gcp.totals.net;
}

export type SolveMode = "min" | "max";

/**
 * Finds where the advantage crosses zero along one numeric input.
 * `min` scans upward from `lo` and returns the first value at which the
 * advantage turns positive after being non-positive (bisected to 1e-7);
 * `max` scans downward from `hi`. Null if there is no such crossing in the
 * range — Google either wins everywhere or nowhere along it.
 */
export function solveParam(inputs: Inputs, key: NumericKey, lo: number, hi: number, mode: SolveMode): number | null {
  const f = (v: number) => advantageOf({ ...inputs, [key]: v });
  const N = 48;
  const pts: number[] = [];
  for (let i = 0; i <= N; i++) pts.push(lo + ((hi - lo) * i) / N);
  const order = mode === "min" ? pts : [...pts].reverse();
  let prev = order[0], prevF = f(prev);
  for (let i = 1; i < order.length; i++) {
    const x = order[i], fx = f(x);
    if (prevF <= 0 && fx > 0) {
      // bracket [prev (≤0), x (>0)] — bisect to the crossing
      let a = prev, b = x;
      for (let it = 0; it < 40; it++) {
        const mid = (a + b) / 2;
        if (f(mid) > 0) b = mid;
        else a = mid;
        if (Math.abs(b - a) < 1e-7) break;
      }
      return b;
    }
    prev = x;
    prevF = fx;
  }
  return null;
}

/** Migration start month in [0, horizon − 12] that maximises Google's advantage. */
export function optimalMigStart(inputs: Inputs, horizon: Horizon = inputs.horizon): { month: number; advantage: number } {
  const maxStart = Math.max(0, horizon - 12);
  let best = 0, bestAdv = -Infinity;
  for (let m = 0; m <= maxStart; m++) {
    const v = advantageOf({ ...inputs, migStart: m }, horizon);
    if (v > bestAdv + 1e-9) { bestAdv = v; best = m; }
  }
  return { month: best, advantage: bestAdv };
}

export interface SolveRow {
  key: InputKey | "capBite";
  label: string;
  mode: SolveMode | "boolean" | "optimal" | "info";
  current: number | boolean;
  value: number | boolean | null;
  unit: string;
  /** Relative distance from the current value; Infinity if not a lever. */
  distance: number;
  flips: boolean;
  why: string;
  dpm?: boolean;
}

export interface ReverseSolve {
  rows: SolveRow[];
  smallest: SolveRow | null;
  gcpAhead: boolean;
}

const fmt = (v: number, unit: string) => {
  const r = Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2);
  return unit.startsWith("$") ? `$${r}M${unit.slice(2)}` : `${r}${unit ? " " + unit : ""}`;
};

export function reverseSolve(inputs: Inputs, horizon: Horizon = inputs.horizon): ReverseSolve {
  const inp = { ...inputs, horizon };
  const adv0 = advantageOf(inp);
  const gcpAhead = adv0 > 0;
  const rows: SolveRow[] = [];

  const numeric = (key: NumericKey, label: string, lo: number, hi: number, mode: SolveMode, unit: string, why: (v: number | null, status: "always" | "never" | "crossing") => string, dpm?: (v: number) => boolean) => {
    const v = solveParam(inp, key, lo, hi, mode);
    const cur = inp[key];
    let flips = false;
    let distance = Infinity;
    let status: "always" | "never" | "crossing" = "crossing";
    if (v === null) status = advantageOf({ ...inp, [key]: mode === "min" ? lo : hi }) > 0 ? "always" : "never";
    else {
      // The verdict flips only if the threshold lies on the winning side of the current value.
      flips = gcpAhead ? (mode === "min" ? v < cur : v > cur) : (mode === "min" ? v > cur : v < cur);
      if (flips) distance = Math.abs(v - cur) / Math.max(Math.abs(cur), 1);
    }
    rows.push({ key, label, mode, current: cur, value: v, unit, distance, flips, why: why(v, status), dpm: v !== null && dpm ? dpm(v) : undefined });
  };
  const always = "Google wins across this whole range with everything else fixed.";

  numeric("anthSpend", "Anthropic spend", 0, 200, "min", "$M/yr",
    (v, s) => v === null ? (s === "always" ? always : "No spend level in $0–200M/yr lets Google win with everything else fixed.") : `Google credits scale with spend up to the cap; Google wins at ${fmt(v, "$M/yr")} and above.`);
  numeric("growth", "Growth", -50, 300, "min", "%/yr",
    (v, s) => v === null ? (s === "always" ? always : "No growth rate in −50–300%/yr lets Google win.") : `MAP only pays on spend above last year's; higher growth raises both credits. Google wins from ${fmt(v, "%/yr")}.`);
  numeric("migPct", "Migration share", 0, 100, "min", "%",
    (v, s) => v === null ? (s === "always" ? always : "No migration share lets Google win.") : `Google wins once at least ${fmt(v, "%")} of the workload moves.`);
  numeric("awsCommitRemaining", "AWS commit remaining", 0, 200, "max", "$M",
    (v, s) => v === null ? (s === "always" ? always : "Google cannot win at any AWS commit level in range.") : `Leaving AWS strands unconsumed commit; Google wins only if the remaining AWS commit is at most ${fmt(v, "$M")}.`);
  numeric("gcpAiSpend", "Eligible GCP AI spend", 0, 150, "min", "$M/yr",
    (v, s) => v === null ? (s === "always" ? always : "Google cannot win at any eligible Cloud AI spend level in range.") : `Google credits are only consumable against Cloud AI spend; Google wins from ${fmt(v, "$M/yr")} of eligible spend.`);
  numeric("awsBaseline", "AWS baseline", 0, 200, "min", "$M",
    (v, s) => v === null ? (s === "always" ? always : "Google cannot win at any AWS baseline in range.") : `MAP pays on spend above the prior-year baseline; Google wins once the baseline is at least ${fmt(v, "$M")}.`);
  numeric("gcpPct", "Google credit rate", 0, 50, "min", "%",
    (v, s) => v === null ? (s === "always" ? always : "Google cannot win at any credit rate in 0–50%.") : `Google wins at a ${fmt(v, "%")} credit rate${v > GOOGLE.dpoMaxPct.value ? " — above DPO authority, needs DPM" : ""}.`,
    (v) => v > GOOGLE.dpoMaxPct.value);

  // Marketplace exception
  {
    const withEx = advantageOf({ ...inp, mktException: true });
    const withoutEx = advantageOf({ ...inp, mktException: false });
    const required = withoutEx <= 0 && withEx > 0;
    const flips = inp.mktException ? withoutEx <= 0 && gcpAhead : required && !gcpAhead;
    rows.push({
      key: "mktException", label: "Marketplace cap exception", mode: "boolean", current: inp.mktException, value: required, unit: "",
      distance: flips ? 1 : Infinity, flips,
      why: required
        ? "Google wins only with the marketplace cap exception (DPM + DPO approval and an exception form)."
        : withEx > 0 && withoutEx > 0 ? "Google wins with or without the exception." : withEx <= 0 ? "The exception alone does not let Google win." : "Google wins without the exception.",
    });
  }

  // Optimal migration start
  {
    const maxStart = Math.max(0, horizon - 12);
    const { month: best, advantage: bestAdv } = optimalMigStart(inp, horizon);
    const flips = !gcpAhead && bestAdv > 0;
    rows.push({
      key: "migStart", label: "Optimal migration start", mode: "optimal", current: inp.migStart, value: best, unit: "month",
      distance: flips ? Math.abs(best - inp.migStart) / Math.max(Math.abs(inp.migStart), 1) : Infinity, flips,
      why: bestAdv > 0
        ? `Starting in month ${best} maximises Google's advantage at $${bestAdv.toFixed(2)}M within the horizon.`
        : `No start month in 0–${maxStart} lets Google win; month ${best} is the least bad ($${bestAdv.toFixed(2)}M).`,
    });
  }

  // Cap bite
  {
    const capBite = inp.gcpPct > 0 ? inp.gcpCap / (inp.gcpPct / 100) : Infinity;
    rows.push({
      key: "capBite", label: "Spend where the Google cap bites", mode: "info", current: inp.anthSpend, value: Number.isFinite(capBite) ? capBite : null, unit: "$M",
      distance: Infinity, flips: false,
      why: Number.isFinite(capBite)
        ? `At ${inp.gcpPct}% the $${inp.gcpCap}M cap is reached at $${capBite.toFixed(1)}M of incremental marketplace spend in the window; above that Google's incentive stops growing.`
        : "With a 0% rate the cap never applies.",
    });
  }

  const candidates = rows.filter((r) => r.flips && Number.isFinite(r.distance));
  candidates.sort((a, b) => a.distance - b.distance);
  return { rows, smallest: candidates[0] ?? null, gcpAhead };
}

export function capBiteSpend(inputs: Inputs): number {
  return inputs.gcpPct > 0 ? inputs.gcpCap / (inputs.gcpPct / 100) : Infinity;
}

/** Advantage across a parameter range, for the sensitivity chart. */
export function sensitivity(inputs: Inputs, key: NumericKey, lo: number, hi: number, n = 40, horizon: Horizon = inputs.horizon): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const x = lo + ((hi - lo) * i) / n;
    out.push({ x, y: advantageOf({ ...inputs, [key]: x }, horizon) });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Credit funnel — how each program turns spend into usable credit       */
/* ------------------------------------------------------------------ */

export interface CreditFunnel {
  /** Spend the program measures within the horizon (complete quarters only). */
  spend: number;
  /** Baseline the program subtracts over the same quarters. */
  baseline: number;
  /** Spend above baseline. */
  incremental: number;
  /** Credit rate applied (%). */
  rate: number;
  /** Rate × incremental, before any cap or gate. */
  gross: number;
  /** Credit actually settled within the horizon (after cap or gate). */
  earned: number;
  /** Credit applied to a bill within the horizon. */
  usable: number;
  /** $M/yr of bill the credits may be applied against. */
  absorbs: number;
  quarters: Quarter[];
}

/** Per-program funnel from measured spend down to usable credit, within the result's horizon. */
export function creditFunnel(result: Result): { aws: CreditFunnel; gcp: CreditFunnel } {
  const H = result.horizon, i = result.inputs;
  const build = (qs: Quarter[], rate: number, usable: number, absorbs: number): CreditFunnel => {
    const inH = qs.filter((q) => q.month < H);
    const s = (f: (q: Quarter) => number) => inH.reduce((t, q) => t + f(q), 0);
    return { spend: s((q) => q.spend), baseline: s((q) => q.baseline), incremental: s((q) => q.incremental), rate, gross: s((q) => q.credit), earned: s((q) => q.settled), usable, absorbs, quarters: inH };
  };
  const a = result.routes.aws, g = result.routes.gcp;
  return {
    aws: build(a.map.quarters, i.mapPct + i.partnerPass, a.totals.awsUsed, i.awsOtherSpend + a.map.yearTagged[0]),
    gcp: build(g.google.quarters, i.gcpPct, g.totals.gcpUsed, i.gcpAiSpend),
  };
}
