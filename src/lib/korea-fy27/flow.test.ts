import { describe, expect, it } from "vitest";
import { buildModel } from "./model";
import { buildFlow, whenOf } from "./flow";
import { COMMERCIAL_BUCKETS } from "./flow-labels";

const model = buildModel();
const flow = buildFlow(model);
const cohort = (id: string) => model.cohorts.find((c) => c.id === id)!;

describe("the five verticals", () => {
  it("follow the outline's order and labels", () => {
    expect(flow.verticals.map((v) => v.label)).toEqual([
      "DN + Acquire",
      "DN + Deepen",
      "DN + Penetrate",
      "Conglomerate + Deepen",
      "Conglomerate + Penetrate",
    ]);
    expect(flow.verticals.map((v) => v.num)).toEqual(["5.1", "5.2", "5.3", "5.4", "5.5"]);
    expect(new Set(flow.verticals.map((v) => v.id)).size).toBe(5);
    expect(new Set(flow.verticals.map((v) => v.cohort)).size).toBe(5);
  });

  it("each sits in the cohort whose segment and motion it names", () => {
    for (const v of flow.verticals) {
      expect(cohort(v.cohort).segment, v.label).toBe(v.segment);
      expect(cohort(v.cohort).motion, v.label).toBe(v.motion);
    }
  });

  it("carry +$612M of the +$675M, and with the other three cohorts tie to the deck", () => {
    const r = flow.reconciliation;
    expect(r.verticalsAdded).toBe(612);
    expect(r.othersAdded).toBe(64);
    expect(flow.others.map((o) => o.id).sort()).toEqual(["mid-market", "public", "trad-ent"]);
    expect(Math.abs(r.addedTotal - r.statedGrowth)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.fy27Total - r.statedFy27)).toBeLessThanOrEqual(2);
  });

  it("every example account is a row in its cohort's own account table", () => {
    for (const v of flow.verticals) {
      expect(v.exampleRow, v.label).not.toBeNull();
      expect(String(v.exampleRow!.cells[0]).startsWith(v.example.account), v.label).toBe(true);
    }
  });

  it("exec sponsors stay unnamed, as in the deck", () => {
    for (const v of flow.verticals) {
      expect(v.sponsor.basis).toBe("placeholder");
      expect(v.sponsor.text).toMatch(/\[[^\]]+\]/);
    }
  });

  it("each vertical has its top-13 accounts row; with traditional enterprises they make 13", () => {
    for (const v of flow.verticals) expect(v.top, v.label).not.toBeNull();
    const rows = model.plan.topAccounts.rows;
    expect(rows.reduce((s, r) => s + r.count, 0)).toBe(model.plan.topAccounts.stated.count);
  });
});

describe("Q4 plans", () => {
  it("buckets each target by the date in its wording", () => {
    expect(whenOf("Wrtn live on Gemini by Q2")).toBe("q2");
    expect(whenOf("9 funded tokenomics assessments by end of Q1")).toBe("q1");
    expect(whenOf("4 group deals in FY27")).toBe("fy27");
    expect(whenOf("Commits signed at the top 3")).toBe("fy27");
    expect(whenOf("Q4 supply-chain agent first")).toBe("q4");
    expect(whenOf("1K+ logos landing in H1")).toBe("q2");
  });

  it("keeps every cohort target, once", () => {
    for (const v of flow.verticals) {
      expect(v.milestones.map((m) => m.text)).toEqual(cohort(v.cohort).targets.map((t) => t.text));
    }
  });

  it("names the commercial decision for each vertical", () => {
    for (const v of flow.verticals) {
      expect(v.commercialDecisionText, v.label).toMatch(/pric|credit|commit|renewal/i);
    }
  });
});

describe("Q4 execution plan", () => {
  it("files every commercial offer under one of the four buckets", () => {
    for (const row of flow.commercial) {
      expect(row.unbucketed, row.label).toEqual([]);
      const filed = COMMERCIAL_BUCKETS.reduce((s, b) => s + row.cells[b].length, 0);
      expect(filed).toBe(cohort(flow.verticals.find((v) => v.id === row.vertical)!.cohort).commercial.length);
    }
  });

  it("hiring rows add up to the deck's headcount snapshots", () => {
    const h = flow.hiring;
    expect(h.rows).toHaveLength(8);
    expect(h.cohortSsNow).toBe(h.current.aiSs);
    expect(h.cohortSsTarget).toBe(h.target.aiSs);
    expect(h.cohortCeTarget).toBe(h.target.aiCe);
    // Today 6 AI CE sit in cohorts and 4 in specialty pools.
    expect(h.cohortCeNow).toBe(6);
    expect(h.current.aiCe).toBe(10);
    expect(h.target.aiSs - h.current.aiSs).toBe(7);
    expect(h.target.aiCe - h.current.aiCe).toBe(5);
    expect(h.target.vcbd).toBe(1);
  });

  it("maps every play to its solution deep-dive tracks", () => {
    expect(flow.training).toHaveLength(6);
    for (const t of flow.training) {
      expect(t.tracks.length, t.name).toBeGreaterThan(0);
      expect(t.leadsSlide17, t.name).toBe(model.execution.plays.find((p) => p.id === t.play)!.leadCount);
    }
  });
});

describe("accountability", () => {
  it("covers all eight cohorts, verticals first, and ties to ~$900M with AutoEver", () => {
    expect(flow.accountability).toHaveLength(8);
    expect(flow.accountability.slice(0, 5).map((a) => a.vertical)).toEqual(flow.verticals.map((v) => v.label));
    const fy27 = flow.accountability.reduce((s, a) => s + a.fy27, 0) + model.autoEver.fy27;
    expect(Math.abs(fy27 - model.headline.fy27Plan)).toBeLessThanOrEqual(2);
    for (const a of flow.accountability) expect(a.owner).toBe("[name]");
  });
});

describe("content hygiene", () => {
  it("takeaways point at real verticals and motions, with sources", () => {
    const ids = new Set(flow.verticals.map((v) => v.id));
    for (const t of flow.takeaways) {
      for (const id of t.verticals) expect(ids.has(id), id).toBe(true);
      expect(t.src.length).toBeGreaterThan(0);
    }
  });

  it("no individual employee names in the flow", () => {
    const text = JSON.stringify(flow);
    for (const name of ["Jongwoo", "Terry", "Jeehyeok", "Hangshik", "Junghoon", "Rockyoon", "Eunju", "Seongmin", "YunYol", "kyungmee", "siminoh", "Karan", "W. Cho"]) {
      expect(text.includes(name), name).toBe(false);
    }
  });
});
