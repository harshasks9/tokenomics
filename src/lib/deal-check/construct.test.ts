import { describe, expect, it } from "vitest";
import { defaults, evaluate, type Inputs } from "./engine";
import { constructText, dealConstruct, dealFileName, emptyMeta, parseDeal, serializeDeal, toDealFile, type DealMeta } from "./construct";
import example from "./deals/example.deal.json";

const inp = (o: Partial<Inputs> = {}): Inputs => ({ ...defaults(), ...o });
const meta = (o: Partial<DealMeta> = {}): DealMeta => ({ ...emptyMeta(), customer: "Acme", region: "Americas", onTargetList: true, ...o });

describe("deal construct", () => {
  it("sizes the pool at rate × forecast, capped at $5M, and lays out four milestones", () => {
    const x = inp({ growth: 0, migRamp: 0 });
    const c = dealConstruct(meta(), x, evaluate(x));
    expect(c.forecastY1).toBeCloseTo(12, 6);
    expect(c.pool).toBeCloseTo(1.2, 6);
    expect(c.milestones.map((m) => m.threshold)).toEqual([3, 6, 9, 12]);
    expect(c.milestones.every((m) => Math.abs(m.tranche - 0.3) < 1e-9)).toBe(true);
    const big = inp({ anthSpend: 80, growth: 0, migRamp: 0 });
    expect(dealConstruct(meta(), big, evaluate(big)).pool).toBeCloseTo(5, 9);
  });
  it("flags every blocker the offer summary imposes", () => {
    const x = inp({ gcpCommitNew: 8, gcpSignMonth: 3, gcpAiSpend: 0 });
    const c = dealConstruct(meta({ onTargetList: false }), x, evaluate(x));
    expect(c.blockers.length).toBe(4);
    expect(c.rows.filter((r) => r.status === "stop").length).toBeGreaterThanOrEqual(4);
  });
  it("routes exceptions to DPM", () => {
    const x = inp({ gcpPct: 15, gcpCommitYears: 4, mktException: true });
    const c = dealConstruct(meta(), x, evaluate(x));
    expect(c.approvals.filter((a) => a.startsWith("DPM")).length).toBe(3);
    expect(c.approvals.some((a) => a.includes("go/sales-concessions"))).toBe(true);
    expect(c.steps.length).toBe(3);
  });
  it("warns when marketplace spend exceeds the 25% cap without an exception", () => {
    const x = inp({ gcpAiSpend: 2, gcpOtherSpend: 1 });
    const row = dealConstruct(meta(), x, evaluate(x)).rows.find((r) => r.label === "Marketplace commit cap");
    expect(row?.status).toBe("warn");
    expect(row?.note).toMatch(/exception/);
  });
  it("text form carries rows, approvals and steps", () => {
    const x = inp();
    const t = constructText(dealConstruct(meta(), x, evaluate(x)));
    expect(t).toMatch(/Credit pool/);
    expect(t).toMatch(/How to request/);
    expect(t).toMatch(/go\/engageDPO/);
  });
});

describe("deal file", () => {
  it("round-trips through JSON with meta, inputs and a verdict snapshot", () => {
    const x = inp({ anthSpend: 30, gcpPct: 12, mktException: true });
    const file = toDealFile(meta({ owner: "Kiran", notes: "Q4" }), x, evaluate(x));
    const back = parseDeal(serializeDeal(file));
    expect(back.meta).toEqual(file.meta);
    expect(back.inputs).toEqual(file.inputs);
    expect(back.snapshot.rank).toBe(file.snapshot.rank);
    expect(back.savedAt).toBe(file.savedAt);
    expect(dealFileName(file.meta)).toBe("acme.deal.json");
  });
  it("fills missing inputs with defaults and rejects malformed files", () => {
    const partial = parseDeal(JSON.stringify({ version: 1, meta: { customer: "P" }, inputs: { anthSpend: 20 } }));
    expect(partial.inputs.anthSpend).toBe(20);
    expect(partial.inputs.gcpPct).toBe(defaults().gcpPct);
    expect(() => parseDeal("nope")).toThrow(/JSON/);
    expect(() => parseDeal(JSON.stringify({ inputs: { anthSpend: "20" } }))).toThrow(/anthSpend/);
    expect(() => parseDeal(JSON.stringify({ inputs: { horizon: 18 } }))).toThrow(/Horizon/);
  });
  it("the example deal file in the repo parses", () => {
    const d = parseDeal(JSON.stringify(example));
    expect(d.meta.customer.length).toBeGreaterThan(0);
    expect(d.inputs.gcpCommitNew).toBeGreaterThanOrEqual(10);
  });
});
