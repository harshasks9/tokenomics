import { describe, expect, it } from "vitest";
import { lifetime, waterfall } from "./model";
import { BASE_INCENTIVE, BASE_LIFETIME, baseRoute, ROUTE_IDS } from "./params";
import { breakEven, matchThreshold, npv5, tornado } from "./sensitivity";

describe("sensitivity", () => {
  it("tornado rows are sorted by swing and printable", () => {
    for (const id of ROUTE_IDS) {
      const t = tornado(id, npv5);
      expect(t.length).toBeGreaterThan(3);
      for (let i = 1; i < t.length; i += 1) expect(t[i - 1].swing).toBeGreaterThanOrEqual(t[i].swing);
    }
    const t = tornado("bedrock-claude", npv5).map((r) => ({ k: r.label, low: r.low, high: r.high, lo: r.lowValue.toFixed(1), hi: r.highValue.toFixed(1) }));
    console.table(t);
    const tb = tornado("bedrock-claude", (p) => breakEven(p) * 100).map((r) => ({ k: r.label, lo: r.lowValue.toFixed(1), hi: r.highValue.toFixed(1) }));
    console.table(tb);
  });
  it("match threshold is zero when the incentive costs nothing and grows with cost", () => {
    expect(matchThreshold(100, 100, 0.5)).toBe(0);
    expect(matchThreshold(50, 100, 0.5)).toBeCloseTo(0.5, 9);
  });
  it("prints scenario checks", () => {
    const out: Record<string, string>[] = [];
    for (const fee of [0.16, 0.24, 0.30, 0.36]) {
      const p = { ...baseRoute("bedrock-claude"), channelFee: fee };
      const lt = { ...BASE_LIFETIME, years: 5 };
      const one = lifetime(p, { ...BASE_INCENTIVE, type: "one-time" }, lt);
      const none = lifetime(p, { ...BASE_INCENTIVE, pct: 0 }, lt);
      out.push({ fee: String(fee), keep0: waterfall(p, { pct: 0, partnerFunded: 0, providerFunded: 0 }).cloudContribution.toFixed(1), be: (breakEven(p) * 100).toFixed(1), npvNone: none.npv.toFixed(1), npvOne: one.npv.toFixed(1), payback: one.paybackMonths.toFixed(1), match50: (matchThreshold(one.npv, none.npv, 0.5) * 100).toFixed(1) });
    }
    console.table(out);
    const g = baseRoute("vertex-gemini");
    const lt = { ...BASE_LIFETIME, years: 5 };
    const gOne = lifetime(g, { ...BASE_INCENTIVE, type: "one-time" }, lt).npv;
    const gNone = lifetime(g, { ...BASE_INCENTIVE, pct: 0 }, lt).npv;
    const c = baseRoute("vertex-claude");
    const cOne = lifetime(c, { ...BASE_INCENTIVE, type: "one-time" }, lt).npv;
    const cNone = lifetime(c, { ...BASE_INCENTIVE, pct: 0 }, lt).npv;
    console.table([{ route: "vertex-gemini", match50: (matchThreshold(gOne, gNone, 0.5) * 100).toFixed(1) }, { route: "vertex-claude", match50: (matchThreshold(cOne, cNone, 0.5) * 100).toFixed(1) }]);
    // retention stress for one-time on Bedrock
    const rs = [0.6, 0.7, 0.85, 0.95].map((r) => {
      const l = { ...BASE_LIFETIME, years: 5, retention: r, growth: 0 };
      const x = lifetime(baseRoute("bedrock-claude"), { ...BASE_INCENTIVE, type: "one-time" }, l);
      return { retention: r, growth0_npv: x.npv.toFixed(1), payback: x.paybackMonths.toFixed(1) };
    });
    console.table(rs);
    expect(out).toHaveLength(4);
  });
});
