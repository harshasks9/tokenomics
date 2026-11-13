import { describe, expect, it } from "vitest";
import { ANALOGIES, analogyScore, PARADOXES } from "./analogies";
import { BROKEN, COUNTERS, SCORED_CLAIMS } from "./contrarian";
import { FUTURES } from "./futures";
import { INSIGHTS } from "./insights";
import { adoptionCurve, SCENARIO_PRESETS, valueAt, valueFlow, type EconParams } from "./models";
import { PLAYS } from "./playbook";
import * as R from "./research";
import { SOURCE_BY_ID, SOURCES } from "./sources";

/** Walk any value and collect every sourceIds array. */
function collectIds(v: unknown, out: string[] = []): string[] {
  if (Array.isArray(v)) v.forEach((x) => collectIds(x, out));
  else if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) {
      if (k === "sourceIds" && Array.isArray(x)) out.push(...(x as string[]));
      else collectIds(x, out);
    }
  }
  return out;
}

describe("research layer integrity", () => {
  it("has unique source ids with a URL and an access level", () => {
    expect(new Set(SOURCES.map((s) => s.id)).size).toBe(SOURCES.length);
    for (const s of SOURCES) {
      expect(s.url, s.id).toBeTruthy();
      expect(["primary", "data-mirror", "search-excerpt", "secondary", "not-accessed", "prior-knowledge"]).toContain(s.verification);
    }
  });

  it("resolves every citation on the site to the source library", () => {
    const all = [R, ANALOGIES, PARADOXES, BROKEN, COUNTERS, SCORED_CLAIMS, FUTURES, INSIGHTS, PLAYS];
    const ids = collectIds(all);
    expect(ids.length).toBeGreaterThan(300);
    const missing = ids.filter((id) => !SOURCE_BY_ID[id]);
    expect(missing).toEqual([]);
  });

  it("covers the scope the brief requires", () => {
    expect(R.CASES.length).toBeGreaterThanOrEqual(12);
    expect(ANALOGIES.length).toBeGreaterThanOrEqual(20);
    expect(BROKEN.length).toBeGreaterThanOrEqual(8);
    expect(INSIGHTS).toHaveLength(10);
    expect(FUTURES).toHaveLength(3);
    expect(R.REGIONS.map((r) => r.id)).toEqual(expect.arrayContaining(["us", "china", "india", "japan", "sea", "europe", "latam"]));
    expect(R.LADDER).toHaveLength(7);
    expect(R.DELEGATION_SCENARIOS).toHaveLength(7);
  });

  it("keeps the US e-commerce series ordered and plausible", () => {
    const s = R.US_ECOM.series;
    expect(s[0].q).toBe("1999Q4");
    for (let i = 1; i < s.length; i++) expect(R.qToYear(s[i].q)).toBeGreaterThan(R.qToYear(s[i - 1].q));
    for (const p of s) {
      expect(p.pct).toBeGreaterThan(0);
      expect(p.pct).toBeLessThan(25);
    }
    expect(R.qToYear("1999Q4")).toBeCloseTo(1999.875);
  });

  it("classifies every initiative on the 1–6 maturity ladder", () => {
    for (const i of R.INITIATIVES) expect([1, 2, 3, 4, 5, 6]).toContain(i.maturity);
  });

  it("never rates a claim 'strong' on company claims alone", () => {
    for (const c of SCORED_CLAIMS.filter((x) => x.status === "strong")) {
      const types = c.sourceIds.map((id) => SOURCE_BY_ID[id].type);
      expect(types.some((t) => t !== "company-claim"), c.id).toBe(true);
    }
  });

  it("gives every analogy five 1–5 scores and a 0–100 composite", () => {
    for (const a of ANALOGIES) {
      for (const v of Object.values(a.scores)) expect(v >= 1 && v <= 5).toBe(true);
      expect(analogyScore(a)).toBeGreaterThanOrEqual(20);
      expect(analogyScore(a)).toBeLessThanOrEqual(100);
    }
  });
});

describe("value capture model", () => {
  const p: EconParams = { grossMargin: 30, cac: 5, takeRate: 0, placementFee: 2, payment: 2, agentFee: 1, fulfillment: 10, returnsFraud: 3, incrementalConversion: 0, repeatRate: 40, retention: 50 };

  it("splits $100 across participants exactly", () => {
    const f = valueFlow(p);
    const total = f.slices.reduce((s, x) => s + x.value, 0);
    expect(total).toBeCloseTo(100, 6);
    expect(f.firstOrderContribution).toBeCloseTo(30 - 18 - 5, 6);
    expect(f.perOrderMargin).toBeCloseTo(12, 6);
  });

  it("computes expected orders from repeat and retention", () => {
    const f = valueFlow(p);
    // 1 + 0.4 / (1 - 0.2) = 1.5
    expect(f.expectedOrders).toBeCloseTo(1.5, 6);
    expect(f.lifetimeContribution).toBeCloseTo(12 * 1.5 - 5, 6);
    expect(valueFlow({ ...p, incrementalConversion: 50 }).volumeAdjusted).toBeCloseTo(f.lifetimeContribution * 1.5, 6);
  });

  it("produces finite outputs for every researched default", () => {
    for (const m of R.SIM_DEFAULTS) {
      const params = Object.fromEntries(Object.entries(m.params).map(([k, v]) => [k, v.value])) as unknown as EconParams;
      const f = valueFlow(params);
      expect(Number.isFinite(f.lifetimeContribution), m.model).toBe(true);
      for (const prov of Object.values(m.params)) expect(["researched", "assumed", "illustrative"]).toContain(prov.provenance);
    }
  });
});

describe("adoption scenario model", () => {
  it("starts at zero in 2025 and never exceeds its ceiling", () => {
    for (const k of Object.keys(SCENARIO_PRESETS) as (keyof typeof SCENARIO_PRESETS)[]) {
      const c = adoptionCurve(SCENARIO_PRESETS[k].params);
      expect(c.points[0].pct).toBeCloseTo(0, 9);
      for (const pt of c.points) expect(pt.pct).toBeLessThanOrEqual(c.ceiling + 1e-9);
      for (let i = 1; i < c.points.length; i++) expect(c.points[i].pct).toBeGreaterThanOrEqual(c.points[i - 1].pct);
    }
  });

  it("orders the three scenarios conservative < base < transformative", () => {
    const v = (k: keyof typeof SCENARIO_PRESETS) => valueAt(adoptionCurve(SCENARIO_PRESETS[k].params), 2030);
    expect(v("conservative")).toBeLessThan(v("base"));
    expect(v("base")).toBeLessThan(v("transformative"));
  });

  it("uses a multiplicative ceiling", () => {
    const base = SCENARIO_PRESETS.base.params;
    const c1 = adoptionCurve(base).ceiling;
    const c2 = adoptionCurve({ ...base, delegation: base.delegation / 2 }).ceiling;
    expect(c2).toBeCloseTo(c1 / 2, 9);
  });
});

describe("breakout companion", () => {
  it("resolves every slide citation and fits the 20-minute slot", async () => {
    const { SLIDES, AGENDA } = await import("./breakout");
    const ids = collectIds(SLIDES);
    expect(ids.filter((id) => !SOURCE_BY_ID[id])).toEqual([]);
    expect(SLIDES.reduce((s, x) => s + x.minutes, 0)).toBe(20);
    expect(AGENDA.reduce((s, x) => s + x.minutes, 0)).toBe(90);
    expect(AGENDA.filter((a) => a.mine)).toHaveLength(1);
  });
});
