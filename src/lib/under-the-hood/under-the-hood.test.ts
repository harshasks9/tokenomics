import { describe, expect, it } from "vitest";
import { runChecks } from "./validate";
import { computeSim, COMPUTE_SIM_DEFAULTS, impliedQuarterlyGrowth, nrr, nrrCohortBounds, profitabilityBridge, quarterly, runScenario } from "./calc";
import { SCENARIOS } from "./data";
import { isUnderTheHoodHost, toAppPath } from "./routes";

describe("data integrity checks", () => {
  const checks = runChecks();
  it.each(checks.map((c) => [c.label, c]))("%s", (_l, c) => {
    expect(c.pass, c.detail).toBe(true);
  });
});

describe("calculations", () => {
  it("compute simulator defaults reproduce Q3 2026", () => {
    const r = computeSim(COMPUTE_SIM_DEFAULTS);
    const q3 = quarterly()[6];
    expect(r.revenue).toBeCloseTo(q3.revenue, 6);
    expect(r.compute).toBeCloseTo(q3.compute, 6);
    expect(r.adjMargin).toBeCloseTo(q3.adjMargin, 6);
  });
  it("removing short-term spend lowers compute", () => {
    expect(computeSim({ ...COMPUTE_SIM_DEFAULTS, shortTermShare: 0 }).compute).toBeLessThan(9863);
  });
  it("bridge totals reconcile to reported GAAP figures with all adjustments on", () => {
    const steps = profitabilityBridge("Q3 2026", { sbc: true, donation: true, fairValue: true, shortTermPremium: false });
    expect(steps.find((s) => s.label === "GAAP operating income")!.value).toBe(-567);
    expect(steps.find((s) => s.label === "GAAP net income (loss)")!.value).toBe(-23291);
    const s9 = profitabilityBridge("9M 2026", { sbc: true, donation: true, fairValue: true, shortTermPremium: false });
    expect(s9.find((s) => s.label === "Adjusted operating income")!.value).toBe(4081);
    expect(s9.find((s) => s.label === "GAAP operating income")!.value).toBe(-1260);
  });
  it("NRR is dollar-weighted", () => {
    const r = nrr([{ label: "a", customers: 1, baseSpend: 100, multiple: 2 }, { label: "b", customers: 1, baseSpend: 1, multiple: 1000 }]);
    expect(r.nrr).toBeCloseTo((200 + 1000) / 101, 6);
  });
  it("NRR cohort bounds are within Q3 revenue", () => {
    const b = nrrCohortBounds();
    expect(b.shareLo).toBeGreaterThan(0.4);
    expect(b.shareHi).toBeLessThanOrEqual(1);
  });
  it("implied growth to cover next-12-month obligations at 58% is ~24%/qtr", () => {
    expect(impliedQuarterlyGrowth(0.58)).toBeGreaterThan(0.22);
    expect(impliedQuarterlyGrowth(0.58)).toBeLessThan(0.26);
  });
  it("scenarios are ordered bull > base > bear on 2030 revenue and only project after Q3 2026", () => {
    const r = (k: "bull" | "base" | "bear") => runScenario(SCENARIOS.presets[k]);
    const bull = r("bull"), base = r("base"), bear = r("bear");
    expect(bull.years[3].revenue).toBeGreaterThan(base.years[3].revenue);
    expect(base.years[3].revenue).toBeGreaterThan(bear.years[3].revenue);
    expect(base.quarters[0].label).toBe("Q4 2026");
  });
});

describe("ants1 subdomain routing", () => {
  it("recognises both ants1 hosts, case-insensitively, and nothing else", () => {
    expect(isUnderTheHoodHost("ants1.aitokenomics.app")).toBe(true);
    expect(isUnderTheHoodHost("ANTS1.aitokenomics.com")).toBe(true);
    expect(isUnderTheHoodHost("aitokenomics.app")).toBe(false);
    expect(isUnderTheHoodHost("atlas.aitokenomics.app")).toBe(false);
  });
  it("maps browser paths onto the /under-the-hood routes", () => {
    expect(toAppPath("/")).toBe("/under-the-hood");
    expect(toAppPath("/google-cloud-gtm")).toBe("/under-the-hood/google-cloud-gtm");
    expect(toAppPath("/under-the-hood")).toBe("/under-the-hood");
    expect(toAppPath("/under-the-hood/google-cloud-gtm")).toBe("/under-the-hood/google-cloud-gtm");
    expect(toAppPath("/api/x")).toBe("/api/x");
  });
});
