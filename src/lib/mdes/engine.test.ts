import { describe, expect, it } from "vitest";
import {
  COMMITMENT,
  CONTRACTED_UNITS,
  PUPM,
  PUPM_FLOOR,
  applySolvedRamp,
  compareScenarios,
  defaults,
  evaluate,
  generateRamp,
  inputsForCase,
  normalize,
  readout,
  sensitivity,
  solveExitUsers,
  transformSeries,
  withExit,
  type Inputs,
} from "./engine";
import { ORDER_TERMS } from "./terms";

const custom = (adoption: number[], extra: Partial<Inputs> = {}): Inputs =>
  normalize({ ...defaults(), ...extra, ramp: { ...defaults().ramp, preset: "custom" }, adoption, billedLinked: true, billed: adoption });

describe("contract facts", () => {
  it("order terms sum to the USD 10.8M total on the Order Form", () => {
    expect(ORDER_TERMS.reduce((s, t) => s + t.total, 0)).toBe(COMMITMENT);
    for (const t of ORDER_TERMS) {
      expect(t.feesPerMonth).toBe(t.units * PUPM);
      expect(t.total).toBe(t.feesPerMonth * t.months);
    }
  });
  it("contracted schedule = 5.4M user-months = 450K average billed users at $2", () => {
    const um = CONTRACTED_UNITS.reduce((s, v) => s + v, 0);
    expect(um).toBe(5_400_000);
    expect(um / 12).toBe(450_000);
    expect(um * PUPM).toBe(COMMITMENT);
    expect(CONTRACTED_UNITS[0]).toBe(100_000); // October = M1
    expect(CONTRACTED_UNITS[10]).toBe(650_000);
    expect(CONTRACTED_UNITS[11]).toBe(0); // final term ends 14 Sep 2027, no order term starts in M12
  });
  it("baseline (contracted) consumes exactly the commitment by M11 with utilization 100%", () => {
    const r = evaluate(defaults());
    expect(r.total.consumption).toBe(COMMITMENT);
    expect(r.total.utilization).toBe(1);
    expect(r.total.unconsumed).toBe(0);
    expect(r.total.above).toBe(0);
    expect(r.completionMonth).toBe(11);
    expect(r.extraMonths).toBe(0);
    expect(r.termEnd.month).toBe(11);
    expect(r.termEnd.billed).toBe(650_000);
    expect(r.termEnd.met).toBe(true);
    expect(r.months[0].label).toBe("M1 · Oct 26");
    expect(r.months[11].label).toBe("M12 · Sep 27");
    expect(r.userMonths12).toBe(5_400_000);
    expect(r.avgBilled12).toBe(450_000);
    expect(r.approvals).toEqual([]);
    expect(r.errors).toEqual([]);
  });
});

describe("monthly arithmetic", () => {
  it("monthly GE spend = billed users × PUPM and cumulative sums are exact", () => {
    const r = evaluate(defaults());
    let cum = 0;
    r.months.forEach((row, i) => {
      expect(row.geSpend).toBe(CONTRACTED_UNITS[i] * PUPM);
      cum += row.geSpend;
      expect(row.cumConsumption).toBe(cum);
      expect(row.remaining).toBe(Math.max(0, COMMITMENT - cum));
      expect(row.above).toBe(Math.max(0, cum - COMMITMENT));
      expect(row.gcpCounted).toBe(0);
    });
  });
  it("spend uses billed users, not adoption, when they are unlinked", () => {
    const adoption = new Array(12).fill(700_000);
    const billed = new Array(12).fill(300_000);
    const r = evaluate(normalize({ ...defaults(), ramp: { ...defaults().ramp, preset: "custom" }, adoption, billedLinked: false, billed }));
    expect(r.total.geSpend).toBe(300_000 * 2 * 12);
    expect(r.termEnd.adoption).toBe(700_000);
    expect(r.termEnd.billed).toBe(300_000);
    expect(r.termEnd.month).toBe(12);
  });
  it("shortfall never reduces the amount owed; excess is spend above the commitment", () => {
    const low = evaluate(custom(new Array(12).fill(100_000)));
    expect(low.total.consumption).toBe(2_400_000);
    expect(low.total.unconsumed).toBe(COMMITMENT - 2_400_000);
    expect(low.completionMonth).toBeNull();
    expect(low.warnings.join(" ")).toMatch(/commitment is still owed/);
    const high = evaluate(custom(new Array(12).fill(700_000)));
    expect(high.total.above).toBe(700_000 * 2 * 12 - COMMITMENT);
    expect(high.total.utilization).toBe(1);
    expect(high.completionMonth).toBe(8); // 1.4M × 8 = 11.2M ≥ 10.8M
  });
  it("zero adoption: nothing consumed, full commitment unconsumed, milestone missed, no crash", () => {
    const r = evaluate(custom(new Array(12).fill(0)));
    expect(r.total.consumption).toBe(0);
    expect(r.total.unconsumed).toBe(COMMITMENT);
    expect(r.total.utilization).toBe(0);
    expect(r.completionMonth).toBeNull();
    expect(r.monthsBeyondWindowEstimate).toBeNull();
    expect(r.termEnd.met).toBe(false);
    expect(r.termEnd.month).toBe(12);
    expect(r.termEnd.shortfallUsers).toBe(650_000);
    expect(readout(r)).toMatch(/still owed/);
    const s = solveExitUsers(r.inputs);
    expect(s.feasible).toBe(true);
  });
});

describe("ramp generation", () => {
  it("linear ramp hits start and exit, zeros before launch", () => {
    const a = generateRamp({ preset: "immediate", launchMonth: 3, startUsers: 50_000, exitUsers: 650_000, pattern: "linear", ceiling: null });
    expect(a.slice(0, 2)).toEqual([0, 0]);
    expect(a[2]).toBe(50_000);
    expect(a[11]).toBe(650_000);
    for (let i = 3; i < 12; i += 1) expect(a[i]).toBeGreaterThan(a[i - 1]);
  });
  it("launch in M12 puts the exit value in M12 only", () => {
    const a = generateRamp({ preset: "delayed", launchMonth: 12, startUsers: 10, exitUsers: 900_000, pattern: "scurve", ceiling: null });
    expect(a.slice(0, 11).every((v) => v === 0)).toBe(true);
    expect(a[11]).toBe(900_000);
  });
  it("ceiling caps every month; ramps above 650K are allowed", () => {
    const capped = generateRamp({ preset: "immediate", launchMonth: 1, startUsers: 100_000, exitUsers: 1_000_000, pattern: "linear", ceiling: 400_000 });
    expect(Math.max(...capped)).toBe(400_000);
    const open = generateRamp({ preset: "immediate", launchMonth: 1, startUsers: 100_000, exitUsers: 1_000_000, pattern: "front", ceiling: null });
    expect(open[11]).toBe(1_000_000);
  });
  it("delayed launch reduces consumption and completion moves later", () => {
    const early = evaluate(normalize({ ...defaults(), ramp: { preset: "immediate", launchMonth: 1, startUsers: 200_000, exitUsers: 800_000, pattern: "linear", ceiling: null } }));
    const late = evaluate(normalize({ ...defaults(), ramp: { preset: "delayed", launchMonth: 5, startUsers: 200_000, exitUsers: 800_000, pattern: "linear", ceiling: null } }));
    expect(late.total.consumption).toBeLessThan(early.total.consumption);
    expect(early.completionMonth).not.toBeNull();
    expect(late.completionMonth === null || late.completionMonth > (early.completionMonth as number)).toBe(true);
  });
});

describe("price rules", () => {
  it("accepts any price at or above the floor and flags non-contract prices as approvals", () => {
    const r = evaluate(normalize({ ...defaults(), pupm: 1.9 }));
    expect(r.errors).toEqual([]);
    expect(r.total.geSpend).toBeCloseTo(5_400_000 * 1.9, 6);
    expect(r.approvals.join(" ")).toMatch(/amended order form/);
    const at2 = evaluate(normalize({ ...defaults(), pupm: 2 }));
    expect(at2.approvals).toEqual([]);
    const above = evaluate(normalize({ ...defaults(), pupm: 2.5 }));
    expect(above.errors).toEqual([]);
    expect(above.total.above).toBeCloseTo(5_400_000 * 0.5, 6);
  });
  it("rejects prices below the floor and computes at the floor", () => {
    const r = evaluate(normalize({ ...defaults(), pupm: 1.5 }));
    expect(r.errors[0]).toMatch(/below the 1.85 floor/);
    expect(r.inputs.pupm).toBe(PUPM_FLOOR);
    expect(r.total.geSpend).toBeCloseTo(5_400_000 * PUPM_FLOOR, 6);
  });
  it("full precision internally: no rounding of spend", () => {
    const r = evaluate(custom([123_457, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { pupm: 1.87 }));
    expect(r.total.geSpend).toBe(123_457 * 1.87);
  });
});

describe("GCP allocation", () => {
  const base = () => custom(new Array(12).fill(300_000)); // GE = 7.2M, shortfall 3.6M
  it("off by default: eligible and counted are zero", () => {
    const r = evaluate(base());
    expect(r.total.gcpEligible).toBe(0);
    expect(r.gcp.shortfallBeforeGcp).toBe(3_600_000);
    expect(r.gcp.gapAfter).toBe(3_600_000);
  });
  it("counts only explicitly entered eligible spend, from its start month", () => {
    const r = evaluate(normalize({ ...base(), gcp: { enabled: true, monthly: 200_000, startMonth: 4, capMode: "none", capValue: 0 } }));
    expect(r.total.gcpEligible).toBe(200_000 * 9);
    expect(r.total.gcpCounted).toBe(1_800_000);
    expect(r.total.consumption).toBe(7_200_000 + 1_800_000);
    expect(r.gcp.covered).toBe(1_800_000);
    expect(r.gcp.gapAfter).toBe(1_800_000);
    expect(r.approvals.join(" ")).toMatch(/GCP spend toward the commitment/);
    expect(r.months[2].gcpCounted).toBe(0);
    expect(r.months[3].gcpCounted).toBe(200_000);
  });
  it("USD cap limits counted spend; eligible spend is reported unchanged (no double counting)", () => {
    const r = evaluate(normalize({ ...base(), gcp: { enabled: true, monthly: 500_000, startMonth: 1, capMode: "usd", capValue: 1_000_000 } }));
    expect(r.total.gcpEligible).toBe(6_000_000);
    expect(r.total.gcpCounted).toBe(1_000_000);
    expect(r.gcp.capBinding).toBe(true);
    expect(r.months[1].gcpCounted).toBe(500_000);
    expect(r.months[2].gcpCounted).toBe(0);
    expect(r.total.consumption).toBe(8_200_000);
  });
  it("% cap is a share of the commitment", () => {
    const r = evaluate(normalize({ ...base(), gcp: { enabled: true, monthly: 500_000, startMonth: 1, capMode: "pct", capValue: 10 } }));
    expect(r.gcp.cap).toBe(1_080_000);
    expect(r.total.gcpCounted).toBe(1_080_000);
  });
  it("GCP cannot cover more than the shortfall, and excess is spend above", () => {
    const r = evaluate(normalize({ ...base(), gcp: { enabled: true, monthly: 400_000, startMonth: 1, capMode: "none", capValue: 0 } }));
    expect(r.total.gcpCounted).toBe(4_800_000);
    expect(r.gcp.covered).toBe(3_600_000);
    expect(r.gcp.gapAfter).toBe(0);
    expect(r.total.above).toBe(1_200_000);
    expect(r.completionMonth).toBe(11); // (600K + 400K) × 11 = 11.0M
  });
  it("GCP enabled with zero spend counts nothing and warns", () => {
    const r = evaluate(normalize({ ...base(), gcp: { enabled: true, monthly: 0, startMonth: 1, capMode: "none", capValue: 0 } }));
    expect(r.total.gcpCounted).toBe(0);
    expect(r.warnings.join(" ")).toMatch(/no eligible GCP spend/);
  });
});

describe("timeline extension", () => {
  const flat = () => custom(new Array(12).fill(300_000));
  it("12-month window is the default and adds no approvals", () => {
    const r = evaluate(flat());
    expect(r.window).toBe(12);
    // Flat 300K bills fewer than ordered, so re-basing is the only approval; no extension approval.
    expect(r.approvals.length).toBe(1);
    expect(r.approvals[0]).toMatch(/re-basing/);
  });
  it("extension holds M12 values, finds the completion month and the extra months", () => {
    const r = evaluate(normalize({ ...flat(), timeline: { windowMonths: 24, extPupm: null, extUsers: [], extGcp: [] } }));
    expect(r.window).toBe(24);
    for (let m = 13; m <= 24; m += 1) {
      expect(r.months[m - 1].billed).toBe(300_000);
      expect(r.months[m - 1].isExtension).toBe(true);
      expect(r.months[m - 1].contracted).toBe(0);
    }
    expect(r.completionMonth).toBe(18); // 600K × 18 = 10.8M
    expect(r.extraMonths).toBe(6);
    expect(r.term.unconsumed).toBe(3_600_000);
    expect(r.total.unconsumed).toBe(0);
    expect(r.approvals.join(" ")).toMatch(/beyond Month 12/);
  });
  it("extension never moves the term-end milestone", () => {
    const a = evaluate(flat());
    const b = evaluate(normalize({ ...flat(), timeline: { windowMonths: 24, extPupm: null, extUsers: new Array(12).fill(900_000), extGcp: [] } }));
    expect(b.termEnd.billed).toBe(a.termEnd.billed);
    expect(b.termEnd.met).toBe(false);
    expect(b.months[12].billed).toBe(900_000);
  });
  it("as-signed schedule: term end measured at M11 and extension holds 650K, not the empty M12", () => {
    const r = evaluate(normalize({ ...defaults(), timeline: { windowMonths: 15, extPupm: null, extUsers: [], extGcp: [] } }));
    expect(r.months[11].billed).toBe(0);
    expect(r.months[12].billed).toBe(650_000);
    expect(r.termEnd.month).toBe(11);
    expect(r.termEnd.billed).toBe(650_000);
    expect(r.total.above).toBe(650_000 * 2 * 3);
  });
  it("extension price is a separate assumption and respects the floor", () => {
    const r = evaluate(normalize({ ...flat(), timeline: { windowMonths: 15, extPupm: 1.9, extUsers: [], extGcp: [] } }));
    expect(r.months[12].pupm).toBe(1.9);
    expect(r.months[11].pupm).toBe(2);
    expect(r.months[12].geSpend).toBeCloseTo(300_000 * 1.9, 6);
    const bad = evaluate(normalize({ ...flat(), timeline: { windowMonths: 15, extPupm: 1, extUsers: [], extGcp: [] } }));
    expect(bad.errors[0]).toMatch(/Extension price/);
    expect(bad.months[12].pupm).toBe(PUPM_FLOOR);
  });
  it("extension GCP holds the M12 eligible value unless overridden", () => {
    const r = evaluate(normalize({ ...flat(), gcp: { enabled: true, monthly: 100_000, startMonth: 1, capMode: "none", capValue: 0 }, timeline: { windowMonths: 14, extPupm: null, extUsers: [], extGcp: [null, 50_000] } }));
    expect(r.months[12].gcpEligible).toBe(100_000);
    expect(r.months[13].gcpEligible).toBe(50_000);
  });
  it("reports an estimate of months beyond the window when still incomplete", () => {
    const r = evaluate(normalize({ ...flat(), timeline: { windowMonths: 15, extPupm: null, extUsers: [], extGcp: [] } }));
    expect(r.completionMonth).toBeNull();
    expect(r.total.unconsumed).toBe(COMMITMENT - 600_000 * 15);
    expect(r.monthsBeyondWindowEstimate).toBe(3);
  });
  it("window is clamped to 12–36", () => {
    expect(normalize({ ...flat(), timeline: { windowMonths: 5, extPupm: null, extUsers: [], extGcp: [] } }).timeline.windowMonths).toBe(12);
    expect(normalize({ ...flat(), timeline: { windowMonths: 99, extPupm: null, extUsers: [], extGcp: [] } }).timeline.windowMonths).toBe(36);
  });
});

describe("solvers", () => {
  it("solves the exit users that consume the commitment for a parametric ramp", () => {
    const inputs = normalize({ ...defaults(), ramp: { preset: "immediate", launchMonth: 1, startUsers: 100_000, exitUsers: 650_000, pattern: "linear", ceiling: null } });
    const s = solveExitUsers(inputs);
    expect(s.feasible).toBe(true);
    const solved = evaluate(withExit(inputs, s.exitUsers as number));
    expect(solved.total.consumption).toBeGreaterThanOrEqual(COMMITMENT);
    const below = evaluate(withExit(inputs, (s.exitUsers as number) - 2));
    expect(below.total.consumption).toBeLessThan(COMMITMENT);
    // linear 100K→E over 12 months: Σ = 12×100K + (E−100K)×(0+1+…+11)/11 = 1.2M + 6(E−100K); ×2 = 10.8M → E = 800K
    expect(s.exitUsers).toBeGreaterThanOrEqual(800_000);
    expect(s.exitUsers).toBeLessThanOrEqual(800_002);
  });
  it("applySolvedRamp re-links billed to the solved adoption", () => {
    const inputs = normalize({ ...defaults(), ramp: { preset: "slow", launchMonth: 2, startUsers: 50_000, exitUsers: 650_000, pattern: "back", ceiling: null } });
    const out = applySolvedRamp(inputs);
    expect(out.billed).toEqual(out.adoption);
    expect(evaluate(out).total.utilization).toBe(1);
  });
  it("explains infeasibility under a ceiling and a late launch", () => {
    const inputs = normalize({ ...defaults(), ramp: { preset: "delayed", launchMonth: 9, startUsers: 50_000, exitUsers: 650_000, pattern: "linear", ceiling: 700_000 } });
    const s = solveExitUsers(inputs);
    expect(s.feasible).toBe(false);
    expect(s.exitUsers).toBeNull();
    expect(s.gap).toBeGreaterThan(0);
    expect(s.maxConsumption).toBeLessThanOrEqual(700_000 * 2 * 4);
    expect(s.reason).toMatch(/ceiling/);
    expect(s.flatUsers).toBeCloseTo(COMMITMENT / (2 * 4), 6);
    expect(s.flatFeasible).toBe(false);
    expect(applySolvedRamp(inputs)).toEqual(inputs);
  });
  it("flat-from-launch requirement matches 450K for a M1 launch and nets out counted GCP", () => {
    const inputs = normalize({ ...defaults(), ramp: { preset: "immediate", launchMonth: 1, startUsers: 100_000, exitUsers: 650_000, pattern: "linear", ceiling: null } });
    expect(solveExitUsers(inputs).flatUsers).toBeCloseTo(450_000, 6);
    const withGcp = normalize({ ...inputs, gcp: { enabled: true, monthly: 100_000, startMonth: 1, capMode: "none", capValue: 0 } });
    expect(solveExitUsers(withGcp).flatUsers).toBeCloseTo((COMMITMENT - 1_200_000) / 24, 6);
  });
  it("scales a custom series proportionally and keeps its shape", () => {
    const inputs = custom([0, 0, 100_000, 200_000, 300_000, 300_000, 300_000, 300_000, 300_000, 300_000, 300_000, 300_000]);
    const s = solveExitUsers(inputs);
    expect(s.feasible).toBe(true);
    const out = withExit(inputs, s.exitUsers as number);
    expect(out.adoption[0]).toBe(0);
    expect(out.adoption[2] / out.adoption[11]).toBeCloseTo(1 / 3, 2);
  });
  it("reports when a flat ramp at the starting users already consumes the commitment", () => {
    const inputs = normalize({ ...defaults(), ramp: { preset: "immediate", launchMonth: 1, startUsers: 600_000, exitUsers: 600_000, pattern: "linear", ceiling: null } });
    const s = solveExitUsers(inputs);
    expect(s.feasible).toBe(true);
    expect(s.exitUsers).toBe(600_000);
    expect(s.reason).toMatch(/already consumes/);
  });
});

describe("scenario comparison", () => {
  it("baseline is always the contracted schedule regardless of the adoption case", () => {
    const cmp = compareScenarios(normalize({ ...defaults(), ramp: { preset: "delayed", launchMonth: 4, startUsers: 50_000, exitUsers: 650_000, pattern: "scurve", ceiling: null } }));
    for (const c of ["low", "base", "high"] as const) {
      expect(cmp[c].baseline.consumption).toBe(COMMITMENT);
      expect(cmp[c].baseline.termEndBilled).toBe(650_000);
      expect(cmp[c].baseline.approvals).toEqual([]);
      expect(cmp[c].baseline.window).toBe(12);
    }
    expect(cmp.low.baseline.termEndAdoption).toBeLessThan(cmp.high.baseline.termEndAdoption);
  });
  it("scenarios add GCP and extension on top of the ramp with approval dependencies", () => {
    const inputs = normalize({ ...defaults(), ramp: { preset: "delayed", launchMonth: 4, startUsers: 50_000, exitUsers: 650_000, pattern: "scurve", ceiling: null }, gcp: { enabled: false, monthly: 200_000, startMonth: 1, capMode: "none", capValue: 0 }, timeline: { windowMonths: 12, extPupm: null, extUsers: [], extGcp: [] } });
    const cmp = compareScenarios(inputs);
    const b = cmp.base;
    expect(b.ramp.window).toBe(12);
    expect(b.ramp.gcpCounted).toBe(0);
    expect(b.rampGcp.gcpCounted).toBe(2_400_000);
    expect(b.rampGcp.consumption).toBe(b.ramp.consumption + 2_400_000);
    expect(b.rampExt.window).toBe(18);
    expect(b.rampExt.consumption).toBeGreaterThan(b.ramp.consumption);
    expect(b.combined.consumption).toBeGreaterThanOrEqual(b.rampExt.consumption);
    expect(b.rampGcp.approvals.join(" ")).toMatch(/GCP/);
    expect(b.rampExt.approvals.join(" ")).toMatch(/beyond Month 12/);
    expect(b.combined.approvals.length).toBe(3); // re-basing + GCP + extension
    // Term-end milestone identical across the non-baseline scenarios.
    expect(b.rampExt.termEndBilled).toBe(b.ramp.termEndBilled);
    expect(b.combined.termEndBilled).toBe(b.ramp.termEndBilled);
  });
  it("low and high cases scale and delay the series, honouring the ceiling", () => {
    expect(transformSeries([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120], 2, 2)).toEqual([0, 0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200]);
    const inputs = normalize({ ...defaults(), ramp: { ...defaults().ramp, preset: "immediate", ceiling: 700_000 }, cases: { low: { mult: 0.5, delay: 3 }, high: { mult: 2, delay: 0 } } });
    const low = inputsForCase(inputs, "low");
    const high = inputsForCase(inputs, "high");
    expect(low.adoption.slice(0, 3)).toEqual([0, 0, 0]);
    expect(Math.max(...high.adoption)).toBe(700_000);
    expect(inputsForCase(inputs, "base")).toEqual(inputs);
  });
  it("sensitivity grid: more delay or less adoption never reduces the gap", () => {
    const grid = sensitivity(normalize({ ...defaults(), ramp: { preset: "immediate", launchMonth: 1, startUsers: 100_000, exitUsers: 650_000, pattern: "linear", ceiling: null } }));
    expect(grid.length).toBe(6);
    expect(grid[0].length).toBe(5);
    for (let i = 0; i < grid.length; i += 1) {
      for (let j = 0; j < grid[i].length; j += 1) {
        if (i > 0) expect(grid[i][j].unconsumed).toBeGreaterThanOrEqual(grid[i - 1][j].unconsumed);
        if (j > 0) expect(grid[i][j].unconsumed).toBeLessThanOrEqual(grid[i][j - 1].unconsumed);
      }
    }
    expect(grid[0][2].unconsumed).toBeCloseTo(COMMITMENT - 2 * (12 * 100_000 + 6 * 550_000), 6);
  });
});

describe("normalize", () => {
  it("fills defaults from partial or garbage input without throwing", () => {
    expect(() => normalize(null)).not.toThrow();
    expect(normalize(undefined)).toEqual(defaults());
    const n = normalize({ ramp: { preset: "nope" as never, launchMonth: 99, startUsers: -5, exitUsers: NaN, pattern: "zig" as never, ceiling: -1 }, pupm: NaN } as never);
    expect(n.ramp.preset).toBe("contract");
    expect(n.adoption).toEqual(CONTRACTED_UNITS);
    expect(n.ramp.launchMonth).toBe(12);
    expect(n.ramp.startUsers).toBe(0);
    expect(n.ramp.exitUsers).toBe(0);
    expect(n.ramp.ceiling).toBe(0);
    expect(n.pupm).toBe(2);
  });
  it("regenerates adoption from the ramp unless the preset is custom", () => {
    const n = normalize({ ...defaults(), ramp: { ...defaults().ramp, preset: "immediate" }, adoption: new Array(12).fill(1) });
    expect(n.adoption[0]).toBe(100_000);
    const c = normalize({ ...defaults(), ramp: { ...defaults().ramp, preset: "custom" }, adoption: new Array(12).fill(1) });
    expect(c.adoption).toEqual(new Array(12).fill(1));
    expect(c.billed).toEqual(c.adoption);
  });
});
