import type { Assertion, Cohort, HistEvent, LayerId, Relation, Scenario, Technology, Thesis, ThesisStatus, Thinker } from "./types";
import { GRAMMAR, LAYERS, THESIS_STATUS_META, VERDICT_META, yearOf } from "./taxonomy";

/**
 * Time-aware knowledge graph builder.
 *
 * The full graph (people, organizations, technologies, layers, theses,
 * assumptions, predictions, decisions, events, evidence, outcomes) is far too
 * dense to draw at once, so the view is built by progressive disclosure:
 *   - Base layer: people on the outer ring, theses on the inner ring (ordered
 *     around the circle by stack layer), person→thesis stances, person↔person
 *     relations and thesis→thesis dependencies.
 *   - Focus: selecting a person expands their claims (prediction / decision
 *     nodes) and organizations; selecting a thesis expands its assumptions and
 *     observed outcome; selecting a claim expands its evidence and outcome.
 * Everything respects the "as of" year: only claims, relations and status
 * changes dated on or before it are drawn, and thesis colors reflect what was
 * knowable then (statusHistory), never hindsight.
 */

export type NodeKind =
  | "person" | "org" | "tech" | "layer" | "thesis" | "assumption" | "prediction" | "decision"
  | "event" | "evidence" | "outcome";

export const NODE_KIND_LABEL: Record<NodeKind, string> = {
  person: "Individual", org: "Organization", tech: "Technology", layer: "AI stack layer", thesis: "Thesis",
  assumption: "Assumption", prediction: "Prediction", decision: "Strategic decision", event: "Historical event",
  evidence: "Evidence source", outcome: "Observed outcome",
};

export type EdgeKind =
  | "believes" | "predicts" | "challenges" | "agrees_with" | "influenced_by" | "contradicts" | "depends_on"
  | "invested_in" | "built" | "changed_position" | "validated_by" | "falsified_by" | "superseded_by" | "unresolved" | "cites";

export const EDGE_KIND_LABEL: Record<EdgeKind, string> = {
  believes: "Believes", predicts: "Predicts", challenges: "Challenges", agrees_with: "Agrees with",
  influenced_by: "Influenced by", contradicts: "Contradicts", depends_on: "Depends on", invested_in: "Invested in",
  built: "Built", changed_position: "Changed position", validated_by: "Validated by", falsified_by: "Falsified by",
  superseded_by: "Superseded by", unresolved: "Awaiting outcome", cites: "Evidence",
};

export type GNode = {
  id: string;
  kind: NodeKind;
  label: string;
  sub?: string;
  cohort?: Cohort;
  color: string;
  r: number;
  x: number;
  y: number;
  /** Reference id into the dataset (thinker id, thesis id, assertion id…). */
  ref: string;
  dim?: boolean;
};

export type GEdge = {
  id: string;
  source: string;
  target: string;
  kind: EdgeKind;
  color: string;
  dashed: boolean;
  width: number;
  /** Human explanation of the relationship (shown on edge select). */
  explain: string;
  assertionIds: string[];
  evidenceIds: string[];
  date?: string;
  dim?: boolean;
};

export type GraphInput = {
  thinkers: Thinker[];
  theses: Thesis[];
  assertions: Assertion[];
  relations: Relation[];
  technologies?: Technology[];
  events?: HistEvent[];
};

export type GraphView = {
  asOf: number; // fractional year
  cohorts: Set<Cohort>;
  thinkerIds: Set<string> | null; // null = all
  layers: Set<LayerId> | null;
  lens: "all" | "technical" | "commercial";
  verdicts: Set<"validated" | "falsified" | "partial" | "unresolved">;
  focus: { kind: "person" | "thesis" | "claim"; id: string } | null;
  scenario: Scenario | null;
  showRelations: boolean;
  search: string;
};

export function thesisStatusAt(t: Thesis, asOf: number): ThesisStatus {
  let s: ThesisStatus = "unresolved";
  for (const h of [...t.statusHistory].sort((a, b) => yearOf(a.date) - yearOf(b.date))) {
    if (yearOf(h.date) <= asOf + 1e-6) s = h.status;
  }
  return s;
}

const statusBucket = (s: ThesisStatus): "validated" | "falsified" | "partial" | "unresolved" =>
  s === "validated" ? "validated" : s === "falsified" ? "falsified" : s === "partial" ? "partial" : "unresolved";

const W = 1000, H = 1000, CX = W / 2, CY = H / 2;
export const GRAPH_SIZE = { W, H };
const R_THESIS = 250, R_PERSON = 410, R_CLAIM = 472;

const polar = (r: number, a: number) => ({ x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) });
const angDiff = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

const layerIndex = (l: LayerId) => LAYERS.findIndex((x) => x.id === l);

/** Angle for each thesis: theses are sorted around the inner ring by their primary (lowest) stack layer. */
export function thesisAngles(theses: Thesis[]): Map<string, number> {
  const sorted = [...theses].sort((a, b) =>
    Math.min(...a.layers.map(layerIndex)) - Math.min(...b.layers.map(layerIndex)) || a.id.localeCompare(b.id));
  const m = new Map<string, number>();
  sorted.forEach((t, i) => m.set(t.id, -Math.PI / 2 + (i / sorted.length) * Math.PI * 2));
  return m;
}

/** Arc span per layer on the inner ring (for the stack band behind the theses). */
export function layerArcs(theses: Thesis[]) {
  const ang = thesisAngles(theses);
  const step = (Math.PI * 2) / Math.max(1, theses.length);
  const arcs: { layer: LayerId; a0: number; a1: number }[] = [];
  for (const L of LAYERS) {
    const as = theses.filter((t) => Math.min(...t.layers.map(layerIndex)) === layerIndex(L.id)).map((t) => ang.get(t.id)!);
    if (!as.length) continue;
    arcs.push({ layer: L.id, a0: Math.min(...as) - step / 2, a1: Math.max(...as) + step / 2 });
  }
  return { arcs, center: { x: CX, y: CY }, r: R_THESIS };
}

export function buildGraph(input: GraphInput, view: GraphView): { nodes: GNode[]; edges: GEdge[] } {
  const { thinkers, theses, assertions, relations } = input;
  const asOf = view.asOf;
  const nodes = new Map<string, GNode>();
  const edges: GEdge[] = [];
  const angles = thesisAngles(theses);

  const visibleThinkers = thinkers.filter((t) => view.cohorts.has(t.cohort) && (!view.thinkerIds || view.thinkerIds.has(t.id)));
  const tSet = new Set(visibleThinkers.map((t) => t.id));

  const claimOk = (a: Assertion) =>
    yearOf(a.date) <= asOf + 1e-6 &&
    tSet.has(a.thinkerId) &&
    (view.lens === "all" || (view.lens === "technical" ? a.category === "technical" || a.category === "governance" : a.category !== "technical" && a.category !== "governance")) &&
    (!view.layers || a.layers.some((l) => view.layers!.has(l)));

  const claims = assertions.filter(claimOk);

  // Theses: visible if they pass layer/verdict filters (status as of the slider year).
  const thesisVisible = (t: Thesis) => {
    if (view.layers && !t.layers.some((l) => view.layers!.has(l))) return false;
    if (view.lens !== "all" && t.lens !== view.lens) return false;
    return view.verdicts.has(statusBucket(thesisStatusAt(t, asOf)));
  };
  for (const t of theses) {
    if (!thesisVisible(t)) continue;
    const st = thesisStatusAt(t, asOf);
    const p = polar(R_THESIS, angles.get(t.id)!);
    nodes.set(`th:${t.id}`, { id: `th:${t.id}`, kind: "thesis", label: t.title, sub: THESIS_STATUS_META[st].label, color: THESIS_STATUS_META[st].color, r: 13, ...p, ref: t.id });
  }

  // Person → thesis stance edges, aggregated from dated claims.
  const stance = new Map<string, { sup: Assertion[]; opp: Assertion[] }>();
  for (const a of claims) for (const th of a.theses ?? []) {
    if (!nodes.has(`th:${th.id}`)) continue;
    const k = `${a.thinkerId}|${th.id}`;
    const s = stance.get(k) ?? { sup: [], opp: [] };
    (th.stance === "supports" ? s.sup : s.opp).push(a);
    stance.set(k, s);
  }

  // People: outer ring at the circular mean of the theses they engage with, then de-overlapped.
  const pref = new Map<string, number>();
  for (const t of visibleThinkers) {
    let sx = 0, sy = 0;
    for (const [k, s] of stance) {
      const [pid, thid] = k.split("|");
      if (pid !== t.id) continue;
      const a = angles.get(thid)!;
      const w = s.sup.length + s.opp.length;
      sx += Math.cos(a) * w; sy += Math.sin(a) * w;
    }
    const cohortBase = { builders: -Math.PI / 2, researchers: Math.PI / 6, investors: (5 * Math.PI) / 6 }[t.cohort];
    pref.set(t.id, sx === 0 && sy === 0 ? cohortBase : Math.atan2(sy, sx));
  }
  const order = [...visibleThinkers].sort((a, b) => pref.get(a.id)! - pref.get(b.id)!);
  const placed = spreadAngles(order.map((t) => pref.get(t.id)!), (Math.PI * 2) / Math.max(order.length, 34));
  order.forEach((t, i) => {
    const p = polar(R_PERSON, placed[i]);
    const n = claims.filter((a) => a.thinkerId === t.id).length;
    nodes.set(`p:${t.id}`, {
      id: `p:${t.id}`, kind: "person", label: t.name, sub: `${n} claim${n === 1 ? "" : "s"} by ${Math.floor(asOf)}`,
      cohort: t.cohort, color: "", r: 11 + Math.min(6, n * 0.7), ...p, ref: t.id, dim: n === 0,
    });
  });

  for (const [k, s] of stance) {
    const [pid, thid] = k.split("|");
    if (!nodes.has(`p:${pid}`)) continue;
    const name = thinkers.find((t) => t.id === pid)!.name;
    const th = theses.find((t) => t.id === thid)!;
    const changed = s.sup.length > 0 && s.opp.length > 0;
    if (changed) {
      const first = [...s.sup, ...s.opp].sort((a, b) => yearOf(a.date) - yearOf(b.date));
      edges.push({
        id: `e:${k}:chg`, source: `p:${pid}`, target: `th:${thid}`, kind: "changed_position", color: GRAMMAR.influence, dashed: false,
        width: 1.6 + Math.min(3, first.length * 0.5),
        explain: `${name} has claims on both sides of "${th.title}" — a documented change of position (or a conditional view). First: ${first[0].date}; latest: ${first[first.length - 1].date}.`,
        assertionIds: first.map((a) => a.id), evidenceIds: [], date: first[0].date,
      });
    } else {
      const sup = s.sup.length > 0;
      const list = sup ? s.sup : s.opp;
      edges.push({
        id: `e:${k}`, source: `p:${pid}`, target: `th:${thid}`, kind: sup ? "believes" : "challenges",
        color: sup ? GRAMMAR.agree : GRAMMAR.disagree, dashed: list.every((a) => a.kind === "action"),
        width: 1.2 + Math.min(3, list.length * 0.6),
        explain: sup
          ? `${name} supported "${th.title}" in ${list.length} documented claim${list.length > 1 ? "s" : ""} (${list.map((a) => a.date.slice(0, 4)).join(", ")}).${list.every((a) => a.kind === "action") ? " Inferred from strategic actions only — dashed." : ""}`
          : `${name} challenged "${th.title}" in ${list.length} documented claim${list.length > 1 ? "s" : ""} (${list.map((a) => a.date.slice(0, 4)).join(", ")}). Disagreement, not falsification.`,
        assertionIds: list.map((a) => a.id), evidenceIds: [], date: list[0].date,
      });
    }
  }

  // Thesis dependencies & supersession.
  for (const t of theses) {
    if (!nodes.has(`th:${t.id}`)) continue;
    for (const d of t.dependsOn) if (nodes.has(`th:${d}`)) {
      edges.push({ id: `e:dep:${t.id}:${d}`, source: `th:${t.id}`, target: `th:${d}`, kind: "depends_on", color: GRAMMAR.influence, dashed: false, width: 1,
        explain: `"${t.title}" depends on "${theses.find((x) => x.id === d)!.title}" — if the latter fails, the former loses its footing.`, assertionIds: [], evidenceIds: [] });
    }
    if (t.supersededBy && nodes.has(`th:${t.supersededBy}`)) {
      edges.push({ id: `e:sup:${t.id}`, source: `th:${t.id}`, target: `th:${t.supersededBy}`, kind: "superseded_by", color: GRAMMAR.influence, dashed: false, width: 1.4,
        explain: `"${t.title}" was superseded by "${theses.find((x) => x.id === t.supersededBy)!.title}".`, assertionIds: [], evidenceIds: [] });
    }
  }

  // Person ↔ person relations (dated).
  if (view.showRelations) for (const r of relations) {
    if (yearOf(r.date) > asOf + 1e-6) continue;
    const s = `p:${r.from}`, tg = `p:${r.to}`;
    if (!nodes.has(s) || !nodes.has(tg)) continue;
    const kind: EdgeKind = r.type === "agrees_with" ? "agrees_with" : r.type === "influenced_by" ? "influenced_by" : r.type === "contradicts" ? "contradicts" : r.type === "challenges" ? "challenges" : r.type === "invested_in" ? "invested_in" : r.type === "built" ? "built" : "changed_position";
    const color = kind === "agrees_with" ? GRAMMAR.agree : kind === "contradicts" || kind === "challenges" ? GRAMMAR.disagree : GRAMMAR.influence;
    edges.push({ id: `e:rel:${r.id}`, source: s, target: tg, kind, color, dashed: r.inferred, width: 1.1, explain: r.note, assertionIds: [], evidenceIds: r.evidenceIds, date: r.date });
  }

  // Focus expansion.
  const f = view.focus;
  if (f?.kind === "person" && nodes.has(`p:${f.id}`)) {
    const pn = nodes.get(`p:${f.id}`)!;
    const base = Math.atan2(pn.y - CY, pn.x - CX);
    const mine = claims.filter((a) => a.thinkerId === f.id).sort((a, b) => yearOf(a.date) - yearOf(b.date));
    addClaimFan(nodes, edges, mine, pn, base, theses);
    // Organizations (roles) and technologies they built, placed just inside the person.
    const t = thinkers.find((x) => x.id === f.id)!;
    const orgs = [...new Set(t.roles.filter((r) => Number(r.from.slice(0, 4)) <= asOf).map((r) => r.org))].slice(0, 4);
    const techs = (input.technologies ?? []).filter((x) => x.builtBy.includes(t.id) && yearOf(x.date) <= asOf + 1e-6);
    const ctx = [...orgs.map((o) => ({ kind: "org" as const, id: o, label: o })), ...techs.map((x) => ({ kind: "tech" as const, id: x.id, label: x.name }))];
    ctx.forEach((c, i) => {
      const ang = base + (i - (ctx.length - 1) / 2) * 0.075;
      const p = polar(R_PERSON - 62, ang);
      const nid = `${c.kind}:${t.id}:${c.id}`;
      nodes.set(nid, { id: nid, kind: c.kind, label: c.label, color: c.kind === "org" ? "#8a8473" : "#2b59c3", r: 6, ...p, ref: c.id });
      const role = t.roles.find((r) => r.org === c.id);
      edges.push({ id: `e:${nid}`, source: pn.id, target: nid, kind: "built", color: GRAMMAR.influence, dashed: false, width: 1,
        explain: c.kind === "org" ? `${t.name}: ${role?.title ?? "role"} at ${c.label} (${role?.from ?? ""}–${role?.to ?? "present"}).` : `${t.name} is credited with building or popularizing ${c.label}.`,
        assertionIds: [], evidenceIds: c.kind === "tech" ? techs.find((x) => x.id === c.id)!.evidenceIds : [] });
    });
  }
  if (f?.kind === "claim") {
    const a = assertions.find((x) => x.id === f.id);
    if (a && yearOf(a.date) <= asOf + 1e-6 && nodes.has(`p:${a.thinkerId}`)) {
      const pn = nodes.get(`p:${a.thinkerId}`)!;
      const base = Math.atan2(pn.y - CY, pn.x - CX);
      addClaimFan(nodes, edges, [a], pn, base, theses);
      const cn = nodes.get(`c:${a.id}`)!;
      // Evidence + outcome around the claim.
      const ev = [...a.evidenceIds.map((id) => ({ id, out: false })), ...a.outcomeEvidenceIds.map((id) => ({ id, out: true }))];
      const ca = Math.atan2(cn.y - CY, cn.x - CX);
      ev.forEach((e, i) => {
        const ang = ca + (i - (ev.length - 1) / 2) * 0.09;
        const p = polar(R_CLAIM + 70, ang);
        const nid = `ev:${a.id}:${e.id}`;
        nodes.set(nid, { id: nid, kind: "evidence", label: e.out ? "Outcome source" : "Source", color: "#5b6576", r: 5, ...p, ref: e.id });
        edges.push({ id: `e:${nid}`, source: cn.id, target: nid, kind: "cites", color: "#9aa3b2", dashed: false, width: 0.8,
          explain: e.out ? "Independent source documenting the outcome." : "Source documenting the original claim.", assertionIds: [a.id], evidenceIds: [e.id] });
      });
      if (a.verdict !== "unresolved" || a.outcome) {
        const on = `out:${a.id}`;
        const p = { x: cn.x + (cn.x - CX) * 0.12, y: cn.y + (cn.y - CY) * 0.12 };
        nodes.set(on, { id: on, kind: "outcome", label: VERDICT_META[a.verdict].label, color: VERDICT_META[a.verdict].color, r: 7, ...p, ref: a.id });
        const k: EdgeKind = a.verdict === "correct" || a.verdict === "partial" ? "validated_by" : a.verdict === "incorrect" ? "falsified_by" : "unresolved";
        edges.push({ id: `e:${on}`, source: cn.id, target: on, kind: k, color: VERDICT_META[a.verdict].color, dashed: false, width: 1.6,
          explain: `Outcome by 2026-10-11: ${a.outcome}`, assertionIds: [a.id], evidenceIds: a.outcomeEvidenceIds });
      }
    }
  }
  if (f?.kind === "thesis" && nodes.has(`th:${f.id}`)) {
    const t = theses.find((x) => x.id === f.id)!;
    const tn = nodes.get(`th:${f.id}`)!;
    const base = Math.atan2(tn.y - CY, tn.x - CX);
    t.assumptions.forEach((txt, i) => {
      const ang = base + (i - (t.assumptions.length - 1) / 2) * 0.2;
      const p = polar(R_THESIS - 135, ang);
      const nid = `as:${t.id}:${i}`;
      nodes.set(nid, { id: nid, kind: "assumption", label: txt, color: "#6b7280", r: 6, ...p, ref: t.id });
      edges.push({ id: `e:${nid}`, source: tn.id, target: nid, kind: "depends_on", color: GRAMMAR.influence, dashed: false, width: 1, explain: `Assumption: ${txt}`, assertionIds: [], evidenceIds: [] });
    });
    // Historical events that moved the thesis' status (validated / falsified by…).
    const evHist = t.statusHistory.filter((h) => yearOf(h.date) <= asOf + 1e-6 && h.eventIds?.length);
    const evIds = [...new Set(evHist.flatMap((h) => h.eventIds!))];
    evIds.forEach((eid, i) => {
      const h = [...evHist].reverse().find((x) => x.eventIds!.includes(eid))!;
      const ev = input.events?.find((x) => x.id === eid);
      const ang = base + (i - (evIds.length - 1) / 2) * 0.12;
      const p = polar(R_THESIS - 62, ang);
      const nid = `evt:${t.id}:${eid}`;
      nodes.set(nid, { id: nid, kind: "event", label: ev?.title ?? eid, sub: h.date, color: "#6b5d3f", r: 6, ...p, ref: eid });
      const k: EdgeKind = h.status === "validated" || h.status === "partial" ? "validated_by" : h.status === "falsified" ? "falsified_by" : "unresolved";
      edges.push({ id: `e:${nid}`, source: tn.id, target: nid, kind: k, color: THESIS_STATUS_META[h.status].color, dashed: false, width: 1.2,
        explain: `${h.date}: ${h.note}`, assertionIds: [], evidenceIds: h.evidenceIds, date: h.date });
    });
    const st = thesisStatusAt(t, asOf);
    const on = `tout:${t.id}`;
    const p = polar(R_THESIS + 26, base);
    nodes.set(on, { id: on, kind: "outcome", label: THESIS_STATUS_META[st].label, color: THESIS_STATUS_META[st].color, r: 8, ...p, ref: t.id });
    const k: EdgeKind = st === "validated" || st === "partial" ? "validated_by" : st === "falsified" ? "falsified_by" : "unresolved";
    const hist = [...t.statusHistory].filter((h) => yearOf(h.date) <= asOf + 1e-6).pop();
    edges.push({ id: `e:${on}`, source: tn.id, target: on, kind: k, color: THESIS_STATUS_META[st].color, dashed: false, width: 2,
      explain: hist ? `As of ${hist.date}: ${hist.note}` : "No outcome evidence yet at this date.", assertionIds: [], evidenceIds: hist?.evidenceIds ?? [] });
  }

  // Scenario mode: highlight the theses each scenario depends on and its supporters/challengers.
  if (view.scenario) {
    const sc = view.scenario;
    const key = new Set(sc.thesisIds.map((id) => `th:${id}`));
    const sup = new Set(sc.supporters.map((s) => `p:${s.thinkerId}`));
    const opp = new Set(sc.challengers.map((s) => `p:${s.thinkerId}`));
    for (const n of nodes.values()) {
      if (n.kind === "thesis") n.dim = !key.has(n.id);
      if (n.kind === "person") n.dim = !(sup.has(n.id) || opp.has(n.id));
    }
    for (const e of edges) e.dim = true;
    for (const s of sc.supporters) if (nodes.has(`p:${s.thinkerId}`)) for (const tid of sc.thesisIds.slice(0, 1)) if (nodes.has(`th:${tid}`))
      edges.push({ id: `e:sc:${s.thinkerId}`, source: `p:${s.thinkerId}`, target: `th:${tid}`, kind: "believes", color: GRAMMAR.agree, dashed: true, width: 1.6,
        explain: `Forecast link — ${s.why}`, assertionIds: s.assertionIds, evidenceIds: [] });
    for (const s of sc.challengers) if (nodes.has(`p:${s.thinkerId}`)) for (const tid of sc.thesisIds.slice(0, 1)) if (nodes.has(`th:${tid}`))
      edges.push({ id: `e:sc:x:${s.thinkerId}`, source: `p:${s.thinkerId}`, target: `th:${tid}`, kind: "challenges", color: GRAMMAR.disagree, dashed: true, width: 1.6,
        explain: `Forecast link — ${s.why}`, assertionIds: s.assertionIds, evidenceIds: [] });
  }

  // Search: dim everything that doesn't match (people, theses, claims).
  const q = view.search.trim().toLowerCase();
  if (q) {
    for (const n of nodes.values()) {
      const hay = `${n.label} ${n.sub ?? ""}`.toLowerCase();
      if (!hay.includes(q)) n.dim = true;
    }
  }

  return { nodes: [...nodes.values()], edges };
}

function addClaimFan(nodes: Map<string, GNode>, edges: GEdge[], claims: Assertion[], pn: GNode, base: number, theses: Thesis[]) {
  const span = Math.min(0.9, 0.11 * claims.length);
  claims.forEach((a, i) => {
    const ang = base + (claims.length === 1 ? 0 : -span / 2 + (i / (claims.length - 1)) * span);
    const p = polar(R_CLAIM, ang);
    const nid = `c:${a.id}`;
    const isAction = a.kind === "action";
    nodes.set(nid, {
      id: nid, kind: isAction ? "decision" : "prediction", label: a.claim.length > 90 ? a.claim.slice(0, 88) + "…" : a.claim,
      sub: `${a.date} · ${VERDICT_META[a.verdict].label}`, color: VERDICT_META[a.verdict].color, r: 6, ...p, ref: a.id,
    });
    edges.push({ id: `e:${nid}`, source: pn.id, target: nid, kind: isAction ? "built" : "predicts", color: VERDICT_META[a.verdict].color, dashed: false, width: 1.1,
      explain: `${a.date}: ${a.claim}`, assertionIds: [a.id], evidenceIds: a.evidenceIds, date: a.date });
    for (const th of a.theses ?? []) if (nodes.has(`th:${th.id}`)) {
      edges.push({ id: `e:${nid}:${th.id}`, source: nid, target: `th:${th.id}`, kind: th.stance === "supports" ? "believes" : "challenges",
        color: th.stance === "supports" ? GRAMMAR.agree : GRAMMAR.disagree, dashed: false, width: 0.8,
        explain: `This claim ${th.stance} "${theses.find((t) => t.id === th.id)!.title}".`, assertionIds: [a.id], evidenceIds: [] });
    }
  });
}

/** Spread sorted angles so neighbors are at least `gap` apart (circular), preserving order. */
function spreadAngles(sorted: number[], gap: number): number[] {
  const n = sorted.length;
  if (n === 0) return [];
  const out = [...sorted];
  for (let iter = 0; iter < 200; iter++) {
    let moved = false;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      if (n === 1) break;
      const d = angDiff(out[j], out[i]);
      const need = i === n - 1 ? gap : gap;
      if (d < need) {
        const push = (need - d) / 2;
        out[i] -= push; out[j] += push; moved = true;
      }
    }
    if (!moved) break;
  }
  return out;
}

export const edgeLegend: { kind: string; color: string; dashed?: boolean; text: string }[] = [
  { kind: "agree", color: GRAMMAR.agree, text: "Agreement / validation" },
  { kind: "disagree", color: GRAMMAR.disagree, text: "Disagreement / falsification" },
  { kind: "influence", color: GRAMMAR.influence, text: "Influence / dependency / change of position" },
  { kind: "unresolved", color: GRAMMAR.unresolved, text: "Unresolved prediction" },
  { kind: "inferred", color: GRAMMAR.neutral, dashed: true, text: "Inferred (needs more evidence) / forecast" },
];
