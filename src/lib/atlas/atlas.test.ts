import { describe, expect, it } from "vitest";
import {
  ASSERTIONS, DEBATES, EVENTS, EVIDENCE, IMPLICATIONS, JUDGMENTS, METRICS, PERIODS, RELATIONS, SCENARIOS, SYNTHESIS, TECHNOLOGIES, THESES, THINKERS,
} from "./data";
import { CUTOFF, LAYERS, PERIOD_ORDER, TOPICS } from "./taxonomy";
import { DEFAULT_WEIGHTS, MIN_SCORED, MIN_WEIGHT, claimValue, claimWeight, composite, dimensions, isScorable, scoreAll } from "./scoring";
import { buildGraph, thesisStatusAt } from "./graph";
import type { Assertion } from "./types";

const evIds = new Set(EVIDENCE.map((e) => e.id));
const thIds = new Set(THINKERS.map((t) => t.id));
const asIds = new Set(ASSERTIONS.map((a) => a.id));
const thesisIds = new Set(THESES.map((t) => t.id));
const layerIds = new Set(LAYERS.map((l) => l.id));

describe("dataset integrity", () => {
  it("has 30 thinkers, 10 per cohort, unique ids", () => {
    expect(THINKERS).toHaveLength(30);
    expect(thIds.size).toBe(30);
    for (const c of ["builders", "researchers", "investors"]) expect(THINKERS.filter((t) => t.cohort === c)).toHaveLength(10);
  });
  it("has unique ids for every entity type", () => {
    for (const list of [EVIDENCE, ASSERTIONS, RELATIONS, EVENTS, THESES, DEBATES, SCENARIOS, IMPLICATIONS, TECHNOLOGIES, METRICS] as { id: string }[][]) {
      expect(new Set(list.map((x) => x.id)).size).toBe(list.length);
    }
  });
  it("every assertion references a thinker, valid layers/topics, and existing evidence", () => {
    const topics = new Set(TOPICS.map((t) => t.id));
    for (const a of ASSERTIONS) {
      expect(thIds.has(a.thinkerId), a.id).toBe(true);
      expect(a.layers.length, a.id).toBeGreaterThan(0);
      for (const l of a.layers) expect(layerIds.has(l), `${a.id}:${l}`).toBe(true);
      for (const t of a.topics) expect(topics.has(t), `${a.id}:${t}`).toBe(true);
      for (const e of [...a.evidenceIds, ...a.outcomeEvidenceIds]) expect(evIds.has(e), `${a.id}:${e}`).toBe(true);
      for (const t of a.theses ?? []) expect(thesisIds.has(t.id), `${a.id}:${t.id}`).toBe(true);
    }
  });
  it("every thinker has 2–10 assertions (most 5–10)", () => {
    for (const t of THINKERS) {
      const n = ASSERTIONS.filter((a) => a.thinkerId === t.id).length;
      expect(n, t.id).toBeGreaterThanOrEqual(2);
      expect(n, t.id).toBeLessThanOrEqual(10);
    }
    expect(THINKERS.filter((t) => ASSERTIONS.filter((a) => a.thinkerId === t.id).length >= 5).length).toBeGreaterThanOrEqual(25);
  });
  it("uses nothing dated after the research cutoff", () => {
    for (const a of ASSERTIONS) expect(a.date <= CUTOFF, a.id).toBe(true);
    for (const e of EVIDENCE) expect(e.date <= CUTOFF, e.id).toBe(true);
    for (const e of EVENTS) expect(e.date <= CUTOFF, e.id).toBe(true);
  });
  it("never presents unverified recall as a verbatim quote", () => {
    for (const e of EVIDENCE) if (e.verification === "recalled") expect(e.verbatim, e.id).toBe(false);
  });
  it("unresolved claims carry no causal score", () => {
    for (const a of ASSERTIONS) if (a.verdict === "unresolved") expect(a.causal, a.id).toBeNull();
  });
  it("cross-references resolve (relations, theses, debates, scenarios, implications, synthesis)", () => {
    for (const r of RELATIONS) {
      expect(thIds.has(r.from), r.id).toBe(true);
      for (const e of r.evidenceIds) expect(evIds.has(e), r.id).toBe(true);
    }
    for (const t of THESES) {
      for (const d of t.dependsOn) expect(thesisIds.has(d), t.id).toBe(true);
      for (const h of t.statusHistory) for (const e of h.evidenceIds) expect(evIds.has(e), t.id).toBe(true);
      expect(t.status).toBe(t.statusHistory[t.statusHistory.length - 1].status);
    }
    for (const d of DEBATES) {
      expect(d.camps).toHaveLength(2);
      for (const c of d.camps) for (const p of c.thinkers) expect(thIds.has(p), `${d.id}:${p}`).toBe(true);
      for (const b of d.balance) expect(Math.abs(b.value)).toBeLessThanOrEqual(1);
      for (const t of d.thesisIds) expect(thesisIds.has(t), d.id).toBe(true);
    }
    for (const s of SCENARIOS) {
      expect(Object.keys(s.stack).sort()).toEqual([...layerIds].sort());
      for (const p of [...s.supporters, ...s.challengers]) {
        expect(thIds.has(p.thinkerId), s.id).toBe(true);
        for (const a of p.assertionIds) expect(asIds.has(a), `${s.id}:${a}`).toBe(true);
      }
    }
    for (const i of IMPLICATIONS) for (const p of [...i.supporters, ...i.dissenters]) expect(thIds.has(p), i.id).toBe(true);
    for (const p of SYNTHESIS.mentalModel.principles) for (const t of p.from) expect(thIds.has(t), p.id).toBe(true);
    for (const j of JUDGMENTS) expect(thIds.has(j.thinkerId)).toBe(true);
  });
  it("covers every period with all 14 layers, and 10–15 debates, ≥3 scenarios", () => {
    expect(PERIODS.map((p) => p.id)).toEqual(PERIOD_ORDER);
    for (const p of PERIODS) for (const l of layerIds) expect(p.layers[l], `${p.id}:${l}`).toBeDefined();
    expect(DEBATES.length).toBeGreaterThanOrEqual(10);
    expect(DEBATES.length).toBeLessThanOrEqual(15);
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(3);
    expect(SYNTHESIS.questions.filter((q) => q.id !== "headline")).toHaveLength(10);
  });
});

const fixture = (over: Partial<Assertion>): Assertion => ({
  id: "x", thinkerId: "t", date: "2020-01", claim: "", claimIsQuote: false, kind: "prediction", category: "technical", layers: ["models"], topics: [],
  assumptions: [], predictedOutcome: "", horizon: "", horizonDate: null, contextAtTime: "", evidenceIds: [], outcome: "", outcomeEvidenceIds: [],
  verdict: "correct", timing: "on-time", verdictRationale: "", confidence: "high", originality: 3, causal: 3, specificity: 5, evolution: "", ...over,
});

describe("foresight scorecard", () => {
  it("excludes unresolved claims and aspirations", () => {
    expect(isScorable(fixture({ verdict: "unresolved" }))).toBe(false);
    expect(isScorable(fixture({ kind: "aspiration" }))).toBe(false);
    expect(isScorable(fixture({}))).toBe(true);
    expect(isScorable(fixture({ unscored: "Investment / financial position." }))).toBe(false);
  });
  it("never scores investments, self-demonstrated results or advocacy in the dataset", () => {
    for (const a of ASSERTIONS) if (a.unscored) expect(isScorable(a), a.id).toBe(false);
    for (const id of ["as-khosla-3", "as-silver-1", "as-hassabis-2", "as-andreessen-7"]) expect(ASSERTIONS.find((a) => a.id === id)?.unscored, id).toBeTruthy();
  });
  it("leaves claims with horizons after the cutoff unresolved", () => {
    for (const a of ASSERTIONS) if (a.horizonDate && Number(a.horizonDate) > 2026) expect(a.verdict, a.id).toBe("unresolved");
  });
  it("penalizes precise misses below vague misses", () => {
    expect(claimValue(fixture({ verdict: "incorrect", specificity: 5 }))).toBeLessThan(claimValue(fixture({ verdict: "incorrect", specificity: 2 })));
  });
  it("shrinks thin records toward neutral", () => {
    const one = dimensions([fixture({})], undefined).accuracy;
    const ten = dimensions(Array.from({ length: 10 }, () => fixture({})), undefined).accuracy;
    expect(one).toBeLessThan(ten);
    expect(one).toBeGreaterThan(0.5);
  });
  it("rewards correct contrarian calls over correct consensus calls", () => {
    const contrarian = dimensions([fixture({ originality: 5 })], undefined).originality;
    const consensus = dimensions([fixture({ originality: 1 })], undefined).originality;
    expect(contrarian).toBeGreaterThan(consensus);
  });
  it("composite is a weighted mean within [0,1]", () => {
    const d = dimensions([fixture({})], undefined);
    const c = composite(d, DEFAULT_WEIGHTS);
    expect(c).toBeGreaterThan(0);
    expect(c).toBeLessThan(1);
  });
  it("ranks only thinkers with enough scorable claims, intervals contain the score", () => {
    const rows = scoreAll(THINKERS, ASSERTIONS, JUDGMENTS, DEFAULT_WEIGHTS, {}, 50);
    for (const r of rows) {
      expect(r.lo).toBeLessThanOrEqual(r.score + 1e-9);
      expect(r.hi).toBeGreaterThanOrEqual(r.score - 1e-9);
      if (r.rank > 0) {
        expect(r.scored.length).toBeGreaterThanOrEqual(MIN_SCORED);
        expect(r.scored.reduce((w, a) => w + claimWeight(a), 0)).toBeGreaterThanOrEqual(MIN_WEIGHT);
      }
    }
  });
});

describe("time-aware graph", () => {
  const base = {
    cohorts: new Set(["builders", "researchers", "investors"] as const), thinkerIds: null, layers: null, lens: "all" as const,
    verdicts: new Set(["validated", "partial", "falsified", "unresolved"] as const), focus: null, scenario: null, showRelations: true, search: "",
  };
  const input = { thinkers: THINKERS, theses: THESES, assertions: ASSERTIONS, relations: RELATIONS, technologies: TECHNOLOGIES, events: EVENTS };
  it("never draws a claim or relation dated after the slider", () => {
    const g = buildGraph(input, { ...base, asOf: 2016 } as never);
    for (const e of g.edges) for (const id of e.assertionIds) expect(ASSERTIONS.find((a) => a.id === id)!.date.slice(0, 4) <= "2016").toBe(true);
    for (const e of g.edges) if (e.kind === "agrees_with" || e.kind === "contradicts") expect(Number(e.date!.slice(0, 4))).toBeLessThanOrEqual(2016);
  });
  it("thesis status is read as of the date, not hindsight", () => {
    const t = THESES.find((x) => x.id === "inference-scaling")!;
    expect(thesisStatusAt(t, 2015)).toBe("unresolved");
    expect(thesisStatusAt(t, 2025)).toBe("validated");
  });
  it("expands a person's claims, orgs and technologies on focus", () => {
    const g = buildGraph(input, { ...base, asOf: 2026.7, focus: { kind: "person", id: "demis-hassabis" } } as never);
    expect(g.nodes.some((n) => n.kind === "prediction" || n.kind === "decision")).toBe(true);
    expect(g.nodes.some((n) => n.kind === "org")).toBe(true);
    expect(g.nodes.some((n) => n.kind === "tech")).toBe(true);
  });
  it("expands a thesis into assumptions, events and its outcome", () => {
    const g = buildGraph(input, { ...base, asOf: 2026.7, focus: { kind: "thesis", id: "scale-works" } } as never);
    expect(g.nodes.some((n) => n.kind === "assumption")).toBe(true);
    expect(g.nodes.some((n) => n.kind === "event")).toBe(true);
    expect(g.nodes.some((n) => n.kind === "outcome")).toBe(true);
  });
});
