import { describe, expect, it, afterAll } from "vitest";
import {
  ROUTES,
  RANK_LABEL,
  advantageOf,
  capBiteSpend,
  defaults,
  evaluate,
  geminiPlay,
  optimalMigStart,
  reverseSolve,
  solveParam,
  type Horizon,
  type Inputs,
  type NumericKey,
  type Route,
} from "./engine";
import { PRESETS, presetById } from "./presets";

const inp = (o: Partial<Inputs> = {}): Inputs => ({ ...defaults(), ...o });
const near = (a: number, b: number, tol = 0.005) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);

/** Test 1 base: flat $12M on AWS, everything moves at month 0. */
const T1 = (o: Partial<Inputs> = {}) =>
  inp({ platform: "aws", anthSpend: 12, growth: 0, migPct: 100, migStart: 0, migRamp: 0, gcpSignMonth: 0, gcpBaselineQ: 0, gcpPct: 10, gcpCap: 5, gcpCommitNew: 10, gcpAiSpend: 6, horizon: 24, ...o });

/** Test 9 base: direct today, moves to AWS at month 0, zero baseline. */
const T9 = (o: Partial<Inputs> = {}) =>
  inp({ platform: "direct", anthSpend: 12, growth: 0, migPct: 100, migStart: 0, migRamp: 0, awsBaseline: 0, mapPct: 25, mapYears: 1, mapAfter: "none", horizon: 24, awsCommitRemaining: 0, awsOtherSpend: 0, ...o });

/* ---------------- Google credit mechanics ---------------- */

describe("Google credit mechanics", () => {
  it("1. flat $12M → $1.20M earned in months 2,5,8,11 and fully usable by 24", () => {
    const r = evaluate(T1());
    const g = r.routes.gcp;
    near(g.totals.gcpEarned, 1.2);
    for (const m of [2, 5, 8, 11]) near(g.series.gcpCredit[m], 0.3);
    near(g.totals.gcpUsed, 1.2);
  });
  it("2. $60M → cap binds at exactly 5.00 (1.5,1.5,1.5,0.5); uncapped 6", () => {
    const g = evaluate(T1({ anthSpend: 60 })).routes.gcp;
    expect(g.totals.gcpEarned).toBeCloseTo(5, 9);
    expect(g.google.quarters.map((q) => q.settled)).toEqual([1.5, 1.5, 1.5, 0.5]);
    near(g.google.uncapped, 6);
    expect(g.google.capBinding).toBe(true);
  });
  it("3. platform gcp, $16M vs $3M last quarter → incremental 1/quarter → 0.40", () => {
    const g = evaluate(inp({ platform: "gcp", anthSpend: 16, growth: 0, gcpBaselineQ: 3 })).routes.gcp;
    near(g.totals.gcpEarned, 0.4);
  });
  it("4. spend equal to baseline → 0", () => {
    const g = evaluate(inp({ platform: "gcp", anthSpend: 12, growth: 0, gcpBaselineQ: 3 })).routes.gcp;
    near(g.totals.gcpEarned, 0);
  });
  it("5. commit under $10M → ineligible, 0 credits", () => {
    const g = evaluate(T1({ gcpCommitNew: 9.99 })).routes.gcp;
    expect(g.google.eligible).toBe(false);
    near(g.totals.gcpEarned, 0);
  });
  it("6. tiny eligible AI spend caps usability at ≈0.875 and reports unused credit", () => {
    const r = evaluate(T1({ gcpAiSpend: 0.5 }));
    const g = r.routes.gcp;
    expect(g.totals.gcpUsed).toBeLessThanOrEqual((0.5 / 12) * 21 + 1e-9);
    expect(g.totals.gcpUsed).toBeLessThan(g.totals.gcpEarned);
    expect(r.flags.some((f) => f.id === "gcp-unused")).toBe(true);
  });
  it("7. late migration: only month 12 falls in the window → 0.10", () => {
    const g = evaluate(T1({ migStart: 12, gcpSignMonth: 1 })).routes.gcp;
    near(g.totals.gcpEarned, 0.1);
  });
  it("8. 15% rate → 1.80 and a DPO-authority flag", () => {
    const r = evaluate(T1({ gcpPct: 15 }));
    near(r.routes.gcp.totals.gcpEarned, 1.8);
    expect(r.flags.some((f) => f.id === "dpo-rate" && /exceeds DPO authority/.test(f.text))).toBe(true);
  });
});

describe("Google offer terms from the summary", () => {
  it("credits are earned on top-line spend: a GCP price discount does not shrink them", () => {
    const r0 = evaluate(T1()), r1 = evaluate(T1({ gcpDiscount: 20 }));
    near(r1.routes.gcp.totals.gcpEarned, r0.routes.gcp.totals.gcpEarned, 1e-9);
    expect(r1.routes.gcp.totals.gross).toBeLessThan(r0.routes.gcp.totals.gross);
  });
  it("the pool is sized on the forecast Y1 incremental spend: forecast 5 → 0.50 earned of 1.20 accrued", () => {
    const g = evaluate(T1({ gcpForecastY1: 5 })).routes.gcp;
    near(g.google.pool, 0.5);
    near(g.totals.gcpEarned, 0.5);
    near(g.google.uncapped, 1.2);
    expect(g.google.forecastBinding).toBe(true);
    expect(g.google.capBinding).toBe(false);
  });
  it("a forecast above actual spend changes nothing: credits still follow actual incremental spend", () => {
    near(evaluate(T1({ gcpForecastY1: 40 })).routes.gcp.totals.gcpEarned, 1.2);
  });
  it("the marketplace cap is 25% per commit leg, not per month: a ramp still counts the full 25%", () => {
    const g = evaluate(T1({ migRamp: 6, gcpAiSpend: 2, gcpOtherSpend: 1 })).routes.gcp;
    const counted = g.series.onGcp.slice(0, 12).reduce((s, x, i) => s + x - g.series.excessMkt[i], 0);
    near(counted, 2.5);
  });
});

describe("Gemini offload play", () => {
  it("40% to Gemini at 40% cost cuts the Google route's model bill by 24% and keeps credits on the rest", () => {
    const r0 = evaluate(T1()), r1 = evaluate(T1({ geminiShare: 40, geminiCostRatio: 40 }));
    const g0 = r0.routes.gcp.totals, g1 = r1.routes.gcp.totals;
    near(g1.anthropicSpend, g0.anthropicSpend * 0.6, 1e-9);
    near(g1.geminiSpend, g0.anthropicSpend * 0.4 * 0.4, 1e-9);
    near(g1.gross, g0.gross * 0.76, 1e-9);
    near(g1.gcpEarned, g0.gcpEarned * 0.6, 1e-9);
    expect(r1.routes.aws.totals.geminiSpend).toBe(0);
  });
  it("Gemini spend absorbs Google credits even with no other eligible Cloud AI spend", () => {
    const g = evaluate(T1({ geminiShare: 50, gcpAiSpend: 0 })).routes.gcp;
    expect(g.totals.gcpUsed).toBeGreaterThan(0);
    expect(g.totals.gcpUsed).toBeLessThanOrEqual(g.totals.gcpEarned + 1e-9);
  });
  it("the play solver finds the smallest Gemini share that beats AWS", () => {
    const base = inp({ platform: "aws", awsBaseline: 2 }); // MAP pays on almost everything: AWS wins at 0% Gemini
    expect(evaluate(base).advantage).toBeLessThan(0);
    const play = geminiPlay(base);
    expect(play.winsNow).toBe(false);
    expect(play.minShare).not.toBeNull();
    expect(Math.abs(advantageOf({ ...base, geminiShare: play.minShare as number }))).toBeLessThan(0.01);
    expect(advantageOf({ ...base, geminiShare: (play.minShare as number) + 5 })).toBeGreaterThan(0);
  });
});

/* ---------------- AWS MAP mechanics ---------------- */

describe("AWS MAP mechanics", () => {
  const yearSum = (a: number[], y: number) => a.slice(12 * y, 12 * y + 12).reduce((s, x) => s + x, 0);
  it("9. zero baseline → 3.00 in year 1, 0 in year 2", () => {
    const a = evaluate(T9()).routes.aws;
    near(yearSum(a.series.awsCredit, 0), 3);
    near(yearSum(a.series.awsCredit, 1), 0);
  });
  it("10. baseline equal to spend → 0", () => {
    near(evaluate(T9({ awsBaseline: 12 })).routes.aws.totals.awsEarned, 0);
  });
  it("11. partner pass-back 5% → 3.60", () => {
    near(evaluate(T9({ partnerPass: 5 })).routes.aws.totals.awsEarned, 3.6);
  });
  it("12. committed ARR 100 → gate 10; nothing released before month 11; nothing usable by 11", () => {
    const a = evaluate(T9({ mapCommitArr: 100 })).routes.aws;
    near(a.map.gate, 10);
    for (let m = 0; m < 11; m++) expect(a.series.awsCredit[m]).toBe(0);
    near(a.series.awsCredit[11], 3);
    near(yearSum(a.series.awsCredit, 0), 3);
    near(a.series.awsUsed.slice(0, 12).reduce((s, x) => s + x, 0), 0);
  });
  it("13. source worked example: Q1 credit 0.875 with gate 1.2 met on cumulative 3.5", () => {
    const series = new Array(36).fill(0);
    series[0] = 0.5; series[1] = 1; series[2] = 2;
    const a = evaluate(inp({ platform: "direct", awsBaseline: 0, migPct: 100, migStart: 0, migRamp: 0, mapCommitArr: 12, spendSeries: series })).routes.aws;
    near(a.map.gate, 1.2);
    near(a.map.quarters[0].spend, 3.5);
    near(a.map.quarters[0].settled, 0.875);
    expect(a.map.gateMonth).toBe(2);
  });
  it("14. two-year MAP: year-2 credit = 25% × max(0, tagged[1] − tagged[0])", () => {
    const a = evaluate(inp({ mapYears: 2, growth: 60, platform: "aws", horizon: 36 })).routes.aws;
    const expected = 0.25 * Math.max(0, a.map.yearTagged[1] - a.map.yearTagged[0]);
    near(yearSum(a.series.awsCredit, 1), expected, 1e-6);
  });
  it("15. restructure after year 1: year-2 credit = 25% × tagged[1]", () => {
    const a = evaluate(inp({ mapYears: 1, mapAfter: "restructure", growth: 60, platform: "aws", horizon: 36 })).routes.aws;
    near(yearSum(a.series.awsCredit, 1), 0.25 * a.map.yearTagged[1], 1e-6);
  });
});

/* ---------------- Commits and stranding ---------------- */

describe("Commits and stranding", () => {
  const T16 = (o: Partial<Inputs> = {}) =>
    inp({ platform: "aws", anthSpend: 12, growth: 0, awsCommitRemaining: 20, awsCommitMonths: 12, awsOtherSpend: 8, migPct: 100, migStart: 0, migRamp: 0, ...o });
  it("16. moving strands $12M of the AWS commit in month 11; staying strands nothing", () => {
    const r = evaluate(T16(), 12);
    near(r.routes.gcp.awsCommit.stranded, 12);
    expect(r.routes.gcp.awsCommit.strandMonth).toBe(11);
    near(r.routes.gcp.series.stranded[11], 12);
    near(r.routes.gcp.totals.strandedWithin, 12);
    near(r.routes.aws.totals.strandedWithin, 0);
  });
  it("17. 18-month commit at a 12-month horizon: nothing within, $8M beyond (12 of 20 consumed by term end)", () => {
    // The brief's parenthetical says "12 consumed", so the stranded balance is 20 − 12 = 8.
    const r = evaluate(T16({ awsCommitMonths: 18 }), 12);
    const g = r.routes.gcp;
    near(g.totals.strandedWithin, 0);
    near(g.awsCommit.consumed, 12);
    near(g.totals.strandedBeyond, 8);
    expect(g.awsCommit.strandMonth).toBe(17);
  });
  const T18 = (o: Partial<Inputs> = {}) =>
    T1({ gcpCommitNew: 10, mktCapPct: 25, mktException: false, gcpAiSpend: 2, gcpOtherSpend: 1, gcpSignMonth: 0, ...o });
  it("18. marketplace cap: leg 1 counts 2.50, consumes 5.50, strands 4.50 in month 11; excess 9.50", () => {
    const g = evaluate(evaluate(T18()).inputs).routes.gcp;
    const leg = g.gcpLegs[0];
    const counted = g.series.onGcp.slice(0, 12).reduce((s, x, i) => s + x - g.series.excessMkt[i], 0);
    near(counted, 2.5);
    near(leg.consumed, 5.5);
    near(leg.stranded, 4.5);
    expect(leg.strandMonth).toBe(11);
    near(g.series.excessMkt.slice(0, 12).reduce((s, x) => s + x, 0), 9.5);
  });
  it("19. with the exception: counted 12, consumed 15, stranded 0", () => {
    const g = evaluate(T18({ mktException: true })).routes.gcp;
    near(g.series.excessMkt.slice(0, 12).reduce((s, x) => s + x, 0), 0);
    near(g.gcpLegs[0].consumed, 15);
    near(g.gcpLegs[0].stranded, 0);
  });
  it("20. existing commit first: existing consumed 15 / stranded 0, new leg consumed 4 / stranded 6", () => {
    const g = evaluate(T1({ mktException: true, gcpCommitExisting: 15, gcpCommitExistingMonths: 12, gcpCommitNew: 10, gcpAiSpend: 4, gcpOtherSpend: 3 })).routes.gcp;
    near(g.gcpExisting.consumed, 15);
    near(g.gcpExisting.stranded, 0);
    near(g.gcpLegs[0].consumed, 4);
    near(g.gcpLegs[0].stranded, 6);
  });
  it("21. the do-nothing route never earns credits and has no new GCP legs", () => {
    for (const p of PRESETS) {
      const n = evaluate(inp(p.set)).routes.nothing;
      expect(n.totals.creditsEarned).toBe(0);
      expect(n.gcpLegs.length).toBe(0);
    }
  });
});

/* ---------------- Property tests ---------------- */

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInputs(seed: number): Inputs {
  const r = mulberry32(seed);
  const u = (lo: number, hi: number) => lo + (hi - lo) * r();
  const i = (lo: number, hi: number) => Math.floor(u(lo, hi + 1));
  const pick = <T,>(a: T[]) => a[i(0, a.length - 1)];
  return {
    platform: pick(["direct", "aws", "gcp"]),
    anthSpend: u(0.5, 80), growth: u(-20, 150), awsBaseline: u(0, 40), gcpBaselineQ: u(0, 5),
    horizon: pick([12, 24, 36]),
    migPct: u(0, 100), migStart: i(0, 24), migRamp: i(0, 6), migCost: u(0, 3), gcpSignMonth: i(0, 6),
    awsCommitRemaining: u(0, 60), awsCommitMonths: i(1, 48), awsOtherSpend: u(0, 40),
    mapPct: u(0, 40), partnerPass: u(0, 10), mapYears: i(1, 3), mapAfter: pick(["none", "extend", "restructure"]),
    mapCommitArr: r() < 0.5 ? 0 : u(5, 50), awsDiscount: u(0, 20), awsCreditUse: u(0, 100),
    gcpCommitNew: u(0, 40), gcpCommitYears: i(1, 4), gcpCommitExisting: u(0, 40), gcpCommitExistingMonths: i(0, 36),
    gcpAiSpend: u(0, 30), gcpOtherSpend: u(0, 30), gcpPct: u(0, 20), gcpCap: u(0, 10), gcpForecastY1: r() < 0.7 ? 0 : u(1, 60), mktCapPct: u(0, 100),
    mktException: r() < 0.5, gcpDiscount: u(0, 20), directDiscount: u(0, 20),
    geminiShare: r() < 0.5 ? 0 : u(0, 100), geminiCostRatio: u(10, 100),
  };
}

const CONFIGS: { name: string; inputs: Inputs }[] = [
  ...PRESETS.map((p) => ({ name: p.name, inputs: inp(p.set) })),
  ...Array.from({ length: 200 }, (_, k) => ({ name: `random ${k}`, inputs: randomInputs(1000 + k) })),
];
const HORIZONS: Horizon[] = [12, 24, 36];

describe("Accounting identities", () => {
  it("22. net = gross + migration + stranded − used, every route and horizon", () => {
    for (const c of CONFIGS) for (const H of HORIZONS) {
      const r = evaluate(c.inputs, H);
      for (const route of ROUTES) {
        const t = r.routes[route].totals;
        near(t.net, t.gross + t.mig + t.strandedWithin - t.creditsUsed, 1e-9);
      }
    }
  });
  it("23. with zero discounts, gross Anthropic spend is identical across routes", () => {
    for (const c of CONFIGS) for (const H of HORIZONS) {
      const r = evaluate({ ...c.inputs, awsDiscount: 0, gcpDiscount: 0, directDiscount: 0, geminiShare: 0 }, H);
      const g = r.routes.nothing.totals.gross;
      near(r.routes.aws.totals.gross, g, 1e-9);
      near(r.routes.gcp.totals.gross, g, 1e-9);
    }
  });
  it("24. used ≤ earned ≤ uncapped; Google earned ≤ cap", () => {
    for (const c of CONFIGS) for (const H of HORIZONS) {
      const r = evaluate(c.inputs, H);
      for (const route of ROUTES) {
        const t = r.routes[route].totals;
        expect(t.awsUsed).toBeLessThanOrEqual(t.awsEarned + 1e-9);
        expect(t.gcpUsed).toBeLessThanOrEqual(t.gcpEarned + 1e-9);
        expect(t.awsEarned).toBeLessThanOrEqual(t.awsUncapped + 1e-9);
        expect(t.gcpEarned).toBeLessThanOrEqual(t.gcpUncapped + 1e-9);
        expect(t.gcpEarned).toBeLessThanOrEqual(c.inputs.gcpCap + 1e-9);
      }
    }
  });
  it("25. stranded ≥ 0 and the AWS soft commit never strands", () => {
    for (const c of CONFIGS) for (const H of HORIZONS) {
      const r = evaluate(c.inputs, H);
      for (const route of ROUTES) {
        const rr = r.routes[route];
        expect(rr.totals.strandedWithin).toBeGreaterThanOrEqual(0);
        expect(rr.totals.strandedBeyond).toBeGreaterThanOrEqual(0);
        for (const s of rr.series.stranded) expect(s).toBeGreaterThanOrEqual(0);
      }
      // Removing the AWS existing commit entirely leaves the aws route's stranding untouched by MAP.
      const noCommit = evaluate({ ...c.inputs, awsCommitRemaining: 0, gcpCommitExisting: 0 }, H);
      near(noCommit.routes.aws.totals.strandedWithin, 0, 1e-9);
      near(noCommit.routes.aws.totals.strandedBeyond, 0, 1e-9);
    }
  });
  it("26. no NaN or Infinity anywhere", () => {
    const walk = (v: unknown, path: string) => {
      if (typeof v === "number") { if (!Number.isFinite(v)) throw new Error(`non-finite at ${path}`); return; }
      if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (k !== "inputs") walk(x, `${path}.${k}`);
    };
    for (const c of CONFIGS) for (const H of HORIZONS) walk(evaluate(c.inputs, H), c.name);
  });
  it("27. monotonicity of the advantage in single parameters", () => {
    const up: NumericKey[] = ["gcpAiSpend", "gcpPct", "gcpDiscount"];
    const down: NumericKey[] = ["awsCommitRemaining", "migCost", "mapPct", "partnerPass"];
    const range: Record<string, [number, number]> = {
      gcpAiSpend: [0, 100], gcpPct: [0, 30], gcpDiscount: [0, 40],
      awsCommitRemaining: [0, 100], migCost: [0, 5], mapPct: [0, 50], partnerPass: [0, 20],
    };
    const strandKey = (x: Inputs) => {
      const r = evaluate(x);
      return ROUTES.map((route) => r.routes[route].totals.strandedWithin.toFixed(6)).join("|");
    };
    const check = (c: { name: string; inputs: Inputs }, key: NumericKey, sign: 1 | -1) => {
      const [lo, hi] = range[key];
      let prev = -Infinity * sign;
      let prevStrand = "";
      for (let k = 0; k <= 8; k++) {
        const v = lo + ((hi - lo) * k) / 8;
        const x = { ...c.inputs, [key]: v };
        const adv = advantageOf(x);
        // A GCP price discount lowers net spend, which consumes less GCP commit: stranding rises
        // one-for-one while the credit shrinks. The property holds whenever stranding is unchanged.
        const strand = key === "gcpDiscount" ? strandKey(x) : "";
        if (k > 0 && strand === prevStrand) {
          if (sign === 1) expect(adv, `${c.name} ${key}=${v}`).toBeGreaterThanOrEqual(prev - 1e-6);
          else expect(adv, `${c.name} ${key}=${v}`).toBeLessThanOrEqual(prev + 1e-6);
        }
        prev = adv;
        prevStrand = strand;
      }
    };
    for (const c of CONFIGS) {
      for (const k of up) {
        // Eligible Cloud AI spend also consumes an existing GCP commit on the AWS route (less stranding
        // there), so the property holds cleanly only without an existing GCP commit.
        if (k === "gcpAiSpend") check({ ...c, inputs: { ...c.inputs, gcpCommitExisting: 0 } }, k, 1);
        // With the workload already on GCP, both routes carry GCP spend and a GCP discount lowers
        // both; only the credit differs, so the property is stated for workloads not on GCP today.
        else if (k === "gcpDiscount") { if (c.inputs.platform !== "gcp") check(c, k, 1); }
        else check(c, k, 1);
      }
      for (const k of down) {
        // Migration cost hurts whichever route moves: with the workload already on GCP only the AWS
        // route moves, so there the advantage rises with migration cost instead.
        if (k === "migCost" && c.inputs.platform === "gcp") check(c, k, 1);
        else check(c, k, -1);
      }
    }
  });
});

/* ---------------- Verdict and solvers ---------------- */

describe("Verdict and solvers", () => {
  const preset = (name: string) => {
    const p = PRESETS.find((x) => x.name === name);
    if (!p) throw new Error(`no preset ${name}`);
    return inp(p.set);
  };
  it("28. net-new customer → AWS win", () => {
    expect(evaluate(preset("Net-new Anthropic customer")).rank).toBe("aws");
  });
  it("29. existing AWS customer with flat spend → Google ahead", () => {
    expect(evaluate(preset("Existing AWS customer, flat spend")).advantage).toBeGreaterThan(0);
  });
  it("30. unused GCP commit filled by Anthropic → Strong GCP win", () => {
    expect(evaluate(preset("Unused GCP commit that Anthropic fills")).rank).toBe("strong-gcp");
  });
  it("31. AWS commit stranded after migration → AWS win, driver is stranded commit", () => {
    const r = evaluate(preset("AWS commit stranded after migration"));
    expect(r.rank).toBe("aws");
    expect(r.driver.key).toBe("stranded");
    expect(r.driver.sentence).toMatch(/stranded commit/);
  });
  it("32. solving eligible GCP AI spend lands within 0.01 of break-even", () => {
    let checked = 0;
    for (const c of CONFIGS) {
      if (advantageOf(c.inputs) >= 0) continue;
      const v = solveParam(c.inputs, "gcpAiSpend", 0, 150, "min");
      if (v === null) continue;
      checked++;
      expect(Math.abs(advantageOf({ ...c.inputs, gcpAiSpend: v })), c.name).toBeLessThan(0.01);
    }
    expect(checked).toBeGreaterThan(0);
  });
  it("33. cap-bite spend = cap ÷ rate = 50 at defaults", () => {
    expect(capBiteSpend(defaults())).toBe(50);
    const row = reverseSolve(defaults()).rows.find((r) => r.key === "capBite");
    expect(row?.value).toBe(50);
  });
  it("34. optimal migration start never exceeds horizon − 12", () => {
    for (const c of CONFIGS) for (const H of HORIZONS) {
      const { month } = optimalMigStart(c.inputs, H);
      expect(month).toBeLessThanOrEqual(H - 12);
      expect(month).toBeGreaterThanOrEqual(0);
    }
    for (const H of HORIZONS) {
      const row = reverseSolve(defaults(), H).rows.find((r) => r.key === "migStart");
      expect(row?.value as number).toBeLessThanOrEqual(H - 12);
    }
  });
  it("35. break-even: month 1 when Google is cheaper throughout; null when AWS wins at 24", () => {
    expect(evaluate(T1({ migCost: 0, awsCommitRemaining: 0 })).breakEven).toBe(1);
    expect(evaluate(preset("AWS commit stranded after migration"), 24).breakEven).toBeNull();
  });
  it("solver reports the smallest single change when GCP is behind", () => {
    const r = reverseSolve(preset("Net-new Anthropic customer"));
    expect(r.gcpAhead).toBe(false);
    expect(r.rows.length).toBeGreaterThan(5);
  });
  it("presets resolve by id", () => {
    expect(presetById("net-new")?.name).toBe("Net-new Anthropic customer");
  });
});

/* ---------------- Preset table for eyeballing ---------------- */

afterAll(() => {
  const f = (x: number) => (x >= 0 ? " " : "") + x.toFixed(2).padStart(6);
  const rows: string[] = [];
  rows.push(["Preset".padEnd(48), "H", " Nothing", "  AWS", "  Google", "   Adv", "Rank"].join("  "));
  for (const p of PRESETS) {
    for (const H of HORIZONS) {
      const r = evaluate(inp(p.set), H);
      const n = (route: Route) => f(r.routes[route].totals.net);
      rows.push([(H === 12 ? p.name : "").padEnd(48), String(H).padStart(2), n("nothing"), n("aws"), n("gcp"), f(r.advantage), RANK_LABEL[r.rank]].join("  "));
    }
  }
  console.log("\nPreset table — net economic cost per route ($M), advantage = AWS − Google (positive favours Google)\n" + rows.join("\n") + "\n");
});
