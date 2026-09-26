import { describe, expect, it } from "vitest";
import { DEFAULT_INPUTS, PRESETS, compute, sensitivity } from "./economics";

describe("ge-citizen economics", () => {
  it("prices per covered citizen, not per active citizen", () => {
    const o = compute(DEFAULT_INPUTS);
    expect(o.revenue).toBe(2_000_000);
    expect(o.activated).toBe(350_000);
    expect(o.avgMonthlyActive).toBeCloseTo(140_000);
  });

  it("base case holds and break-even sits well above base usage", () => {
    const o = compute(DEFAULT_INPUTS);
    expect(o.contribution).toBeGreaterThan(0);
    expect(o.breakEvenInteractions).toBeGreaterThan(DEFAULT_INPUTS.interactions * 4);
    expect(o.flags[0].level).toBe("ok");
    // contribution is zero at break-even usage
    const atBreakEven = compute({ ...DEFAULT_INPUTS, cap: 0, interactions: o.breakEvenInteractions });
    expect(Math.abs(atBreakEven.contribution)).toBeLessThan(1);
  });

  it("flags the heavy-usage preset as not working when uncapped", () => {
    const heavy = PRESETS.find((p) => p.id === "heavy")!;
    const o = compute({ ...DEFAULT_INPUTS, ...heavy.patch, cap: 0 });
    expect(o.contribution).toBeLessThan(0);
    expect(o.flags.some((f) => f.level === "fail")).toBe(true);
  });

  it("the usage cap bounds delivery cost", () => {
    const uncapped = compute({ ...DEFAULT_INPUTS, interactions: 200, cap: 0 });
    const capped = compute({ ...DEFAULT_INPUTS, interactions: 200, cap: 20 });
    expect(capped.variableCost).toBeLessThan(uncapped.variableCost / 5);
  });

  it("flags small populations where fixed costs and setup dominate", () => {
    const o = compute({ ...DEFAULT_INPUTS, population: 60_000 });
    const titles = o.flags.map((f) => f.title);
    expect(titles).toContain("Setup outweighs a year of subscription");
    expect(titles).toContain("Fixed costs dominate");
  });

  it("sensitivity margin falls monotonically with usage", () => {
    const rows = sensitivity({ ...DEFAULT_INPUTS, cap: 0 });
    for (let k = 1; k < rows.length; k++) expect(rows[k].margin).toBeLessThan(rows[k - 1].margin);
  });
});
