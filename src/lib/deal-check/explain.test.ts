import { describe, expect, it } from "vitest";
import { creditFunnel, defaults, evaluate, type Inputs } from "./engine";
import { explain, explanationText } from "./explain";
import { PRESETS } from "./presets";

const inp = (o: Partial<Inputs> = {}): Inputs => ({ ...defaults(), ...o });

describe("credit funnel", () => {
  it("stages shrink monotonically and match the route totals", () => {
    for (const p of PRESETS) for (const H of [12, 24, 36] as const) {
      const r = evaluate(inp(p.set), H);
      const f = creditFunnel(r);
      for (const [k, x] of [["aws", f.aws], ["gcp", f.gcp]] as const) {
        expect(x.incremental, `${p.name} ${k}`).toBeLessThanOrEqual(x.spend + 1e-9);
        expect(x.incremental).toBeGreaterThanOrEqual(0);
        expect(x.earned).toBeLessThanOrEqual(x.gross + 1e-9);
        expect(x.usable).toBeLessThanOrEqual(x.earned + 1e-9);
      }
      expect(f.aws.usable).toBeCloseTo(r.routes.aws.totals.awsUsed, 9);
      expect(f.gcp.usable).toBeCloseTo(r.routes.gcp.totals.gcpUsed, 9);
      expect(f.gcp.earned).toBeCloseTo(r.routes.gcp.totals.gcpEarned, 9);
    }
  });
  it("test-1 scenario: Google turns $24M of spend into $1.20M usable", () => {
    const f = creditFunnel(evaluate(inp({ growth: 0, migRamp: 0 }), 24)).gcp;
    expect(f.spend).toBeCloseTo(12, 9);
    expect(f.incremental).toBeCloseTo(12, 9);
    expect(f.gross).toBeCloseTo(1.2, 9);
    expect(f.earned).toBeCloseTo(1.2, 9);
    expect(f.usable).toBeCloseTo(1.2, 9);
  });
});

describe("explanation", () => {
  it("names the rates and the winner for every preset, without internal route names", () => {
    for (const p of PRESETS) {
      const r = evaluate(inp(p.set));
      const e = explain(r);
      const text = explanationText(r);
      expect(text).toMatch(/AWS MAP/);
      expect(text).toMatch(/Google offer/);
      expect(e.verdict).toMatch(r.advantage >= 0 ? /Google is cheaper/ : /AWS is cheaper/);
      expect(e.levers.length).toBeGreaterThanOrEqual(5);
      expect(text).not.toMatch(/\bnothing route\b|\bgcp route\b|\baws route\b/);
    }
  });
  it("flat spend explains that MAP pays nothing", () => {
    expect(explain(evaluate(inp({ growth: 0 }))).aws).toMatch(/MAP pays nothing/);
  });
  it("ineligible commit explains why Google pays nothing", () => {
    expect(explain(evaluate(inp({ gcpCommitNew: 5 }))).google).toMatch(/not eligible/);
  });
  it("cap and consumability limits are called out", () => {
    const e = explain(evaluate(inp({ anthSpend: 60, awsBaseline: 60, gcpAiSpend: 1 })));
    expect(e.google).toMatch(/cap per account/);
    expect(e.google).toMatch(/cannot be consumed in time/);
  });
});
