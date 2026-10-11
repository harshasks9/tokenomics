"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as RPE } from "react";
import { Maximize2, Minus, Pause, Play, Plus } from "lucide-react";
import { ASSERTIONS, EVENTS, RELATIONS, SCENARIOS, TECHNOLOGIES, THESES, THINKERS, PERIODS, thesisById, thinkerById } from "@/lib/atlas/data";
import {
  GRAPH_SIZE, NODE_KIND_LABEL, EDGE_KIND_LABEL, buildGraph, edgeLegend, layerArcs, thesisStatusAt, type GEdge, type GNode, type GraphView,
} from "@/lib/atlas/graph";
import { COHORTS, CUTOFF, LAYERS, GRAMMAR, THESIS_STATUS_META, cohortById, layerById, periodForYear, yearOf } from "@/lib/atlas/taxonomy";
import type { Cohort, LayerId } from "@/lib/atlas/types";
import {
  ClaimLine, CohortTag, EvidenceList, ExportMenu, KindLabel, PersonLink, SectionHead, StatusBadge, focusToggle, useAtlas,
} from "./Shared";
import { PERIOD_LABEL } from "./periodLabels";

const CUT_Y = yearOf(CUTOFF);
/** viewBox with margin so outer-ring labels are never clipped. */
const VB = { x: -120, y: -20, w: GRAPH_SIZE.W + 240, h: GRAPH_SIZE.H + 40 };
const ALL_COHORTS = COHORTS.map((c) => c.id);
const ALL_VERDICTS = ["validated", "partial", "falsified", "unresolved"] as const;
type VB = (typeof ALL_VERDICTS)[number];

type Sel = { type: "node"; node: GNode } | { type: "edge"; edge: GEdge } | { type: "layer"; layer: LayerId } | null;

export default function Graph({ params }: { params: Record<string, string> }) {
  const { open } = useAtlas();
  const [asOf, setAsOf] = useState(CUT_Y);
  const [playing, setPlaying] = useState(false);
  const [future, setFuture] = useState(false);
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0]?.id ?? "");
  const [cohorts, setCohorts] = useState<Set<Cohort>>(new Set(ALL_COHORTS));
  const [only, setOnly] = useState<string>(params.who ?? "");
  const [layers, setLayers] = useState<Set<LayerId> | null>(null);
  const [lens, setLens] = useState<"all" | "technical" | "commercial">("all");
  const [verdicts, setVerdicts] = useState<Set<VB>>(new Set(ALL_VERDICTS));
  const [showRel, setShowRel] = useState(true);
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState<Sel>(null);
  const [focus, setFocus] = useState<GraphView["focus"]>(params.who ? { kind: "person", id: params.who } : params.thesis ? { kind: "thesis", id: params.thesis } : null);
  const [tf, setTf] = useState({ k: 1, x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const h = setInterval(() => {
      setAsOf((y) => {
        if (y >= CUT_Y) { setPlaying(false); return CUT_Y; }
        return Math.min(CUT_Y, y + 0.25);
      });
    }, 140);
    return () => clearInterval(h);
  }, [playing]);

  const scenario = future ? SCENARIOS.find((s) => s.id === scenarioId) ?? null : null;
  const view: GraphView = useMemo(() => ({
    asOf: future ? CUT_Y : asOf, cohorts, thinkerIds: only ? new Set([only]) : null, layers, lens,
    verdicts: verdicts as GraphView["verdicts"], focus, scenario, showRelations: showRel, search,
  }), [asOf, future, cohorts, only, layers, lens, verdicts, focus, scenario, showRel, search]);

  const { nodes, edges } = useMemo(() => buildGraph({ thinkers: THINKERS, theses: THESES, assertions: ASSERTIONS, relations: RELATIONS, technologies: TECHNOLOGIES, events: EVENTS }, view), [view]);
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const arcs = useMemo(() => layerArcs(THESES), []);

  const selId = sel?.type === "node" ? sel.node.id : null;
  const neighbors = useMemo(() => {
    if (!selId) return null;
    const s = new Set([selId]);
    for (const e of edges) { if (e.source === selId) s.add(e.target); if (e.target === selId) s.add(e.source); }
    return s;
  }, [selId, edges]);

  const pick = (n: GNode) => {
    setSel({ type: "node", node: n });
    if (n.kind === "person") setFocus({ kind: "person", id: n.ref });
    else if (n.kind === "thesis") setFocus({ kind: "thesis", id: n.ref });
    else if (n.kind === "prediction" || n.kind === "decision") setFocus({ kind: "claim", id: n.ref });
  };
  // Keep the selection object fresh when the graph rebuilds.
  const selNode = sel?.type === "node" ? nodeById.get(sel.node.id) ?? sel.node : null;

  const onWheel = (e: React.WheelEvent) => {
    const svg = svgRef.current; if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = VB.x + ((e.clientX - r.left) / r.width) * VB.w, py = VB.y + ((e.clientY - r.top) / r.height) * VB.h;
    const k2 = Math.max(0.6, Math.min(4, tf.k * (e.deltaY < 0 ? 1.12 : 1 / 1.12)));
    setTf({ k: k2, x: px - ((px - tf.x) * k2) / tf.k, y: py - ((py - tf.y) * k2) / tf.k });
  };
  const onDown = (e: RPE<SVGSVGElement>) => {
    if ((e.target as Element).closest(".gnode,.gedge,.garc")) return;
    drag.current = { x: e.clientX, y: e.clientY, tx: tf.x, ty: tf.y };
    setDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: RPE<SVGSVGElement>) => {
    if (!drag.current || !svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    const s = VB.w / r.width;
    setTf((t) => ({ ...t, x: drag.current!.tx + (e.clientX - drag.current!.x) * s, y: drag.current!.ty + (e.clientY - drag.current!.y) * s }));
  };
  const onUp = () => { drag.current = null; setDragging(false); };
  const zoom = (f: number) => setTf((t) => {
    const k2 = Math.max(0.6, Math.min(4, t.k * f));
    const c = GRAPH_SIZE.W / 2;
    return { k: k2, x: c - ((c - t.x) * k2) / t.k, y: c - ((c - t.y) * k2) / t.k };
  });

  const year = Math.floor(view.asOf);
  const monthLabel = view.asOf >= CUT_Y - 1e-6 ? "Oct 2026" : `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Math.min(11, Math.floor((view.asOf - year) * 12))]} ${year}`;

  return (
    <div className="at-wrap at-view">
      <SectionHead eyebrow="Experience 04 · Knowledge graph" title="People → beliefs → predictions → outcomes"
        right={<ExportMenu name="atlas-graph" svg={() => svgRef.current} json={() => ({ asOf: monthLabel, nodes, edges })} rows={() => edges.map((e) => ({ id: e.id, source: e.source, target: e.target, kind: e.kind, explain: e.explain, date: e.date ?? "", assertions: e.assertionIds.join(";"), evidence: e.evidenceIds.join(";") }))} />}>
        Minds sit on the outer ring, theses on the inner ring ordered by stack layer (energy at the top, clockwise to society). Drag the timeline
        to see only what had been said — and what was knowable — at each date. Select anything to expand it.
      </SectionHead>

      <div className="at-graph-wrap">
        {/* ---------- filters ---------- */}
        <div className="filters at-card at-pad at-stack" style={{ gap: 14 }}>
          <label className="at-stack" style={{ gap: 4 }}>
            <span className="at-xs at-muted" style={{ fontWeight: 600 }}>Search people, theses, claims</span>
            <input className="at-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. scaling, Hinton, open weights" style={{ width: 240 }} />
          </label>
          <div>
            <div className="at-xs at-muted" style={{ fontWeight: 600, marginBottom: 6 }}>Cohorts</div>
            <div className="at-row">
              {COHORTS.map((c) => (
                <button key={c.id} className="at-chip" aria-pressed={cohorts.has(c.id) && cohorts.size < 3} onClick={() => setCohorts((s) => focusToggle(s, c.id, ALL_COHORTS))}>
                  <span aria-hidden="true" style={{ color: c.color }}>{c.shape === "circle" ? "●" : c.shape === "square" ? "■" : "◆"}</span>{c.short}
                </button>
              ))}
            </div>
          </div>
          <label className="at-stack" style={{ gap: 4 }}>
            <span className="at-xs at-muted" style={{ fontWeight: 600 }}>Thinker</span>
            <select className="at-input at-select" value={only} onChange={(e) => { setOnly(e.target.value); if (e.target.value) setFocus({ kind: "person", id: e.target.value }); }}>
              <option value="">All 30</option>
              {THINKERS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
          <div>
            <div className="at-xs at-muted" style={{ fontWeight: 600, marginBottom: 6 }}>Claim type</div>
            <div className="at-seg" role="group" aria-label="Technical or commercial">
              {(["all", "technical", "commercial"] as const).map((l) => <button key={l} aria-pressed={lens === l} onClick={() => setLens(l)}>{l === "all" ? "All" : l[0].toUpperCase() + l.slice(1)}</button>)}
            </div>
          </div>
          <div>
            <div className="at-xs at-muted" style={{ fontWeight: 600, marginBottom: 6 }}>Thesis status (as of slider date)</div>
            <div className="at-row">
              {ALL_VERDICTS.map((v) => {
                const m = THESIS_STATUS_META[v];
                return (
                  <button key={v} className="at-chip" aria-pressed={verdicts.has(v) && verdicts.size < 4} onClick={() => setVerdicts((s) => focusToggle(s, v, [...ALL_VERDICTS]))}>
                    <span aria-hidden="true" style={{ color: m.color }}>{m.glyph}</span>{m.label.replace(" validated", "")}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="wide">
            <div className="at-between" style={{ marginBottom: 6 }}>
              <span className="at-xs at-muted" style={{ fontWeight: 600 }}>Stack layers</span>
              {layers && <button className="at-link at-xs" onClick={() => setLayers(null)}>all</button>}
            </div>
            <div className="at-row" style={{ gap: 4 }}>
              {LAYERS.map((L) => (
                <button key={L.id} className="at-chip" style={{ minHeight: 24, fontSize: 11.5, padding: "2px 8px" }} aria-pressed={!!layers?.has(L.id)}
                  onClick={() => setLayers((s) => { const n = new Set(s ?? []); if (n.has(L.id)) n.delete(L.id); else n.add(L.id); return n.size ? n : null; })}>
                  {L.n} {L.short}
                </button>
              ))}
            </div>
          </div>
          <label className="at-row at-small" style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={showRel} onChange={(e) => setShowRel(e.target.checked)} /> Person ↔ person relationships
          </label>
          <div className="wide">
            <div className="at-xs at-muted" style={{ fontWeight: 600, marginBottom: 6 }}>Legend</div>
            <div className="at-legend" style={{ gap: "4px 14px", maxWidth: 520 }}>
              {edgeLegend.map((l) => <span key={l.kind}><i className={l.dashed ? "dash" : ""} style={{ borderColor: l.color }} />{l.text}</span>)}
              <span style={{ marginTop: 4 }}>{COHORTS.map((c) => <span key={c.id} style={{ marginRight: 10 }}><b style={{ color: c.color }}>{c.shape === "circle" ? "●" : c.shape === "square" ? "■" : "◆"}</b> {c.short}</span>)}</span>
              <span>Thesis fill = status as of the slider date</span>
            </div>
          </div>
        </div>

        {/* ---------- canvas ---------- */}
        <div className="at-stack" style={{ gap: 10, minWidth: 0 }}>
          <div className="at-graph">
            <div className="at-graph-time" aria-live="polite">{future ? "2027–30" : monthLabel}</div>
            <svg ref={svgRef} viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} style={{ aspectRatio: `${VB.w} / ${VB.h}` }} className={dragging ? "dragging" : ""} role="application"
              aria-label="Knowledge graph. Use Tab to move between nodes and Enter to select."
              onWheel={onWheel} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
              onKeyDown={(e) => { if (e.key === "Escape") { setSel(null); setFocus(null); } }}>
              <g transform={`translate(${tf.x} ${tf.y}) scale(${tf.k})`}>
                {/* stack band */}
                {arcs.arcs.map((a) => {
                  const r = arcs.r + 30;
                  const p0 = { x: arcs.center.x + r * Math.cos(a.a0), y: arcs.center.y + r * Math.sin(a.a0) };
                  const p1 = { x: arcs.center.x + r * Math.cos(a.a1), y: arcs.center.y + r * Math.sin(a.a1) };
                  const mid = (a.a0 + a.a1) / 2;
                  const lp = { x: arcs.center.x + (r + 13) * Math.cos(mid), y: arcs.center.y + (r + 13) * Math.sin(mid) };
                  const L = layerById(a.layer);
                  const active = sel?.type === "layer" && sel.layer === a.layer;
                  return (
                    <g key={a.layer} className="garc" style={{ cursor: "pointer" }} onClick={() => setSel({ type: "layer", layer: a.layer })}>
                      <path d={`M ${p0.x} ${p0.y} A ${r} ${r} 0 ${a.a1 - a.a0 > Math.PI ? 1 : 0} 1 ${p1.x} ${p1.y}`} fill="none"
                        stroke={active ? "#111827" : "#d9d4c7"} strokeWidth={active ? 7 : 5} strokeLinecap="round" />
                      <text x={lp.x} y={lp.y} fontSize="9.5" fill="#8a8473" textAnchor="middle" dominantBaseline="middle" style={{ fontWeight: 650, letterSpacing: "0.06em", textTransform: "uppercase" }}>{L.n} {L.short}</text>
                    </g>
                  );
                })}
                {/* edges */}
                {edges.map((e) => {
                  const s = nodeById.get(e.source), t = nodeById.get(e.target);
                  if (!s || !t) return null;
                  const pp = s.kind === "person" && t.kind === "person";
                  const cx = GRAPH_SIZE.W / 2, cy = GRAPH_SIZE.H / 2;
                  const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
                  const d = pp ? `M ${s.x} ${s.y} Q ${mx + (cx - mx) * 0.55} ${my + (cy - my) * 0.55} ${t.x} ${t.y}` : `M ${s.x} ${s.y} L ${t.x} ${t.y}`;
                  const hl = neighbors ? (e.source === selId || e.target === selId) : true;
                  const isSel = sel?.type === "edge" && sel.edge.id === e.id;
                  const op = e.dim ? 0.08 : hl ? (neighbors ? 0.95 : pp ? 0.32 : 0.2) : 0.05;
                  return (
                    <g key={e.id} className="gedge" onClick={() => setSel({ type: "edge", edge: e })}>
                      <path d={d} fill="none" stroke="transparent" strokeWidth={9} />
                      <path d={d} fill="none" stroke={e.color} strokeOpacity={isSel ? 1 : op} strokeWidth={isSel ? e.width + 1.5 : e.width}
                        strokeDasharray={e.dashed ? "5 4" : undefined} />
                    </g>
                  );
                })}
                {/* nodes */}
                {nodes.map((n) => {
                  const faded = n.dim || (neighbors && !neighbors.has(n.id));
                  const isSel = selId === n.id;
                  const c = n.kind === "person" ? cohortById(n.cohort!).color : n.color;
                  const shape = n.kind === "person" ? cohortById(n.cohort!).shape : n.kind === "thesis" ? "hex" : n.kind === "decision" ? "square" : "circle";
                  const lbl = n.kind === "person" || n.kind === "thesis" || isSel || (neighbors?.has(n.id) && (n.kind === "prediction" || n.kind === "decision" || n.kind === "org" || n.kind === "tech"));
                  const ang = Math.atan2(n.y - GRAPH_SIZE.H / 2, n.x - GRAPH_SIZE.W / 2);
                  const outward = n.kind !== "thesis" && n.kind !== "assumption";
                  const lx = n.x + Math.cos(ang) * (n.r + 6) * (outward ? 1 : -1);
                  const ly = n.y + Math.sin(ang) * (n.r + 6) * (outward ? 1 : -1);
                  const anchor = Math.cos(ang) * (outward ? 1 : -1) > 0.2 ? "start" : Math.cos(ang) * (outward ? 1 : -1) < -0.2 ? "end" : "middle";
                  const text = n.kind === "thesis" ? n.label : n.kind === "person" ? n.label : n.label.length > 46 ? n.label.slice(0, 44) + "…" : n.label;
                  return (
                    <g key={n.id} className="gnode" tabIndex={0} role="button" opacity={faded ? 0.22 : 1}
                      aria-label={`${NODE_KIND_LABEL[n.kind]}: ${n.label}${n.sub ? `, ${n.sub}` : ""}`}
                      onClick={() => pick(n)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(n); } }}>
                      <title>{`${NODE_KIND_LABEL[n.kind]}: ${n.label}${n.sub ? ` — ${n.sub}` : ""}`}</title>
                      {shape === "circle" && <circle className="ring" cx={n.x} cy={n.y} r={n.r} fill={c} stroke="#fff" strokeWidth={isSel ? 3 : 1.5} />}
                      {shape === "square" && <rect className="ring" x={n.x - n.r * 0.9} y={n.y - n.r * 0.9} width={n.r * 1.8} height={n.r * 1.8} rx={3} fill={c} stroke="#fff" strokeWidth={isSel ? 3 : 1.5} />}
                      {shape === "diamond" && <rect className="ring" x={n.x - n.r * 0.8} y={n.y - n.r * 0.8} width={n.r * 1.6} height={n.r * 1.6} rx={2} fill={c} stroke="#fff" strokeWidth={isSel ? 3 : 1.5} transform={`rotate(45 ${n.x} ${n.y})`} />}
                      {shape === "hex" && <polygon className="ring" points={hex(n.x, n.y, n.r)} fill={c} stroke="#fff" strokeWidth={isSel ? 3 : 1.5} />}
                      {isSel && <circle cx={n.x} cy={n.y} r={n.r + 5} fill="none" stroke="#111827" strokeWidth={1.5} />}
                      {n.kind === "person" && n.dim && <circle cx={n.x} cy={n.y} r={n.r} fill="#fff" fillOpacity={0.55} />}
                      {lbl && n.kind === "thesis" ? (() => {
                        // Radial labels: theses read along the radius toward the center, so 28 labels never collide.
                        const deg = (ang * 180) / Math.PI;
                        const right = Math.cos(ang) >= 0;
                        const tx = n.x - Math.cos(ang) * (n.r + 5), ty = n.y - Math.sin(ang) * (n.r + 5);
                        return <text className="glabel th" x={tx} y={ty} textAnchor={right ? "end" : "start"} dominantBaseline="middle"
                          transform={`rotate(${right ? deg : deg + 180} ${tx} ${ty})`}>{text.length > 30 ? text.slice(0, 29) + "…" : text}</text>;
                      })() : lbl && <text className="glabel" x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle">{text}</text>}
                    </g>
                  );
                })}
              </g>
            </svg>
            <div className="at-graph-tools">
              <button onClick={() => zoom(1.25)} aria-label="Zoom in"><Plus size={16} /></button>
              <button onClick={() => zoom(0.8)} aria-label="Zoom out"><Minus size={16} /></button>
              <button onClick={() => setTf({ k: 1, x: 0, y: 0 })} aria-label="Reset view"><Maximize2 size={15} /></button>
            </div>
          </div>

          {/* ---------- time control ---------- */}
          <div className="at-card at-pad" style={{ padding: "12px 16px" }}>
            <div className="at-row" style={{ gap: 12, flexWrap: "nowrap" }}>
              <button className="at-btn sm" onClick={() => { if (future) setFuture(false); if (asOf >= CUT_Y - 1e-6) setAsOf(2012); setPlaying((p) => !p); }} aria-label={playing ? "Pause" : "Play 2012 to 2026"}>
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <input type="range" className="at-range" min={2012} max={CUT_Y} step={1 / 12} value={future ? CUT_Y : asOf}
                aria-label="As-of date" aria-valuetext={monthLabel}
                onChange={(e) => { setFuture(false); setPlaying(false); setAsOf(Number(e.target.value)); }} />
              <button className="at-btn sm" aria-pressed={future} onClick={() => { setFuture((f) => !f); setPlaying(false); }} style={future ? { background: "var(--forecast)", borderColor: "var(--forecast)" } : undefined}>
                2027–30 scenarios
              </button>
            </div>
            <div className="at-between at-xs at-faint" style={{ marginTop: 4, paddingLeft: 44, paddingRight: 140 }}>
              {[2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026].map((y) => <span key={y} className="at-mono">{y}</span>)}
            </div>
            {!future && <div className="at-xs at-muted" style={{ marginTop: 6 }}>Period: <b>{PERIOD_LABEL[periodForYear(Math.floor(asOf))]}</b> — {PERIODS.find((p) => p.id === periodForYear(Math.floor(asOf)))?.consensus.slice(0, 180)}{(PERIODS.find((p) => p.id === periodForYear(Math.floor(asOf)))?.consensus.length ?? 0) > 180 ? "…" : ""}</div>}
            {future && (
              <div className="at-row" style={{ marginTop: 8 }}>
                <span className="at-label-forecast">Forecast mode</span>
                {SCENARIOS.map((s) => <button key={s.id} className="at-chip" aria-pressed={scenarioId === s.id} onClick={() => setScenarioId(s.id)}>{s.name}</button>)}
              </div>
            )}
          </div>
        </div>

        {/* ---------- inspector ---------- */}
        <aside className="at-card at-pad" style={{ position: "sticky", top: 70, maxHeight: "calc(100vh - 90px)", overflowY: "auto" }} aria-live="polite">
          <Inspector sel={sel ? (sel.type === "node" && selNode ? { type: "node", node: selNode } : sel) : null} asOf={view.asOf} scenarioName={scenario?.name}
            onOpenClaim={(id) => open({ kind: "claim", id })} />
        </aside>
      </div>
    </div>
  );
}

function hex(x: number, y: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(" ");
}

function Inspector({ sel, asOf, scenarioName, onOpenClaim }: { sel: Sel; asOf: number; scenarioName?: string; onOpenClaim: (id: string) => void }) {
  const { open } = useAtlas();
  if (!sel) {
    return (
      <div className="at-stack">
        <div className="at-eyebrow" style={{ margin: 0 }}>Inspector</div>
        <p className="at-small at-muted" style={{ margin: 0 }}>
          Select a <b>person</b> to fan out their dated claims; a <b>thesis</b> (hexagon) to see who backed or challenged it and how it fared;
          an <b>edge</b> to read why the relationship exists; a <b>layer arc</b> to trace how thinking about that layer evolved.
        </p>
        {scenarioName && <p className="at-small"><span className="at-label-forecast">Forecast</span> Highlighting theses and thinkers behind <b>{scenarioName}</b>. Dashed links are forward-looking.</p>}
        <div className="at-xs at-faint">Tip: scroll to zoom, drag to pan, Tab/Enter for keyboard navigation, Esc to clear.</div>
      </div>
    );
  }
  if (sel.type === "edge") {
    const e = sel.edge;
    return (
      <div className="at-stack">
        <div className="at-eyebrow" style={{ margin: 0 }}>Relationship · {EDGE_KIND_LABEL[e.kind]}{e.dashed ? " (inferred / forecast)" : ""}</div>
        <div className="at-row"><span style={{ width: 26, borderTop: `3px ${e.dashed ? "dashed" : "solid"} ${e.color}` }} /> <span className="at-small">{labelFor(e.source)} → {labelFor(e.target)}</span></div>
        <p className="at-small" style={{ margin: 0 }}>{e.explain}</p>
        {e.assertionIds.length > 0 && <div className="at-stack">{e.assertionIds.map((id) => { const a = ASSERTIONS.find((x) => x.id === id); return a ? <div key={id} className="at-ev"><ClaimLine a={a} /></div> : null; })}</div>}
        {e.evidenceIds.length > 0 && <EvidenceList ids={e.evidenceIds} />}
      </div>
    );
  }
  if (sel.type === "layer") {
    const L = layerById(sel.layer);
    const claims = ASSERTIONS.filter((a) => a.layers.includes(sel.layer) && yearOf(a.date) <= asOf + 1e-6).sort((a, b) => a.date.localeCompare(b.date));
    return (
      <div className="at-stack">
        <div className="at-eyebrow" style={{ margin: 0 }}>Stack layer {L.n}</div>
        <div className="at-h3">{L.name}</div>
        <div className="at-xs at-muted">{L.scope}</div>
        <div className="at-stack" style={{ gap: 6 }}>
          {PERIODS.filter((p) => Number(p.range[0].slice(0, 4)) <= asOf).map((p) => (
            <div key={p.id} className="at-xs"><b className="at-mono">{PERIOD_LABEL[p.id].split(" · ")[0]}</b> <span className="at-faint">heat {p.layers[sel.layer]?.heat ?? 0}/3</span> — {p.layers[sel.layer]?.state}</div>
          ))}
        </div>
        <div className="at-h3" style={{ marginTop: 6 }}>Claims about this layer ({claims.length})</div>
        {claims.map((a) => <div key={a.id} className="at-ev"><ClaimLine a={a} /></div>)}
      </div>
    );
  }
  const n = sel.node;
  if (n.kind === "person") {
    const t = thinkerById(n.ref)!;
    const pid = periodForYear(Math.floor(asOf));
    const mm = [...t.mentalModel].filter((m) => Number(PERIODS.find((p) => p.id === m.period)?.range[0].slice(0, 4) ?? 0) <= asOf);
    const claims = ASSERTIONS.filter((a) => a.thinkerId === t.id && yearOf(a.date) <= asOf + 1e-6).sort((a, b) => a.date.localeCompare(b.date));
    return (
      <div className="at-stack">
        <div className="at-between"><CohortTag cohort={t.cohort} /><button className="at-btn sm" onClick={() => open({ kind: "thinker", id: t.id })}>Full profile</button></div>
        <div className="at-h3" style={{ fontSize: 18 }}>{t.name}</div>
        <div className="at-xs at-muted">How their thinking changed (to {Math.floor(asOf)}):</div>
        {mm.map((m) => <div key={m.period} className="at-xs" style={{ fontWeight: m.period === pid ? 650 : 400 }}><span className="at-mono at-faint">{PERIOD_LABEL[m.period].split(" · ")[0]}</span> {m.summary}</div>)}
        {t.reversals.filter((r) => yearOf(r.date) <= asOf).map((r, i) => <div key={i} className="at-xs" style={{ color: "var(--influence)" }}>↻ {r.date}: {r.from} → {r.to}</div>)}
        <div className="at-h3" style={{ marginTop: 6 }}>Claims ({claims.length})</div>
        {claims.map((a) => <div key={a.id} className="at-ev"><ClaimLine a={a} showPerson={false} /></div>)}
      </div>
    );
  }
  if (n.kind === "thesis" || (n.kind === "outcome" && thesisById(n.ref))) {
    const T = thesisById(n.ref)!;
    const st = thesisStatusAt(T, asOf);
    const claims = ASSERTIONS.filter((a) => a.theses?.some((x) => x.id === T.id) && yearOf(a.date) <= asOf + 1e-6);
    const sup = claims.filter((a) => a.theses!.find((x) => x.id === T.id)!.stance === "supports");
    const opp = claims.filter((a) => a.theses!.find((x) => x.id === T.id)!.stance === "opposes");
    const people = (arr: typeof claims) => [...new Set(arr.map((a) => a.thinkerId))];
    return (
      <div className="at-stack">
        <div className="at-eyebrow" style={{ margin: 0 }}>Thesis</div>
        <div className="at-h3" style={{ fontSize: 17 }}>{T.title}</div>
        <div className="at-small">{T.statement}</div>
        <div className="at-row"><StatusBadge s={st} /><span className="at-xs at-faint">as of {Math.floor(asOf)}</span>{st !== T.status && <span className="at-xs at-faint">· by cutoff: {THESIS_STATUS_META[T.status].label}</span>}</div>
        <div className="at-xs"><b style={{ color: GRAMMAR.agree }}>Supported by</b> {people(sup).length ? people(sup).map((id, i) => <span key={id}>{i ? ", " : " "}<PersonLink id={id} /></span>) : " —"}</div>
        <div className="at-xs"><b style={{ color: GRAMMAR.disagree }}>Challenged by</b> {people(opp).length ? people(opp).map((id, i) => <span key={id}>{i ? ", " : " "}<PersonLink id={id} /></span>) : " —"}</div>
        <div className="at-xs at-muted" style={{ fontWeight: 600 }}>Depends on</div>
        <ul className="at-xs" style={{ margin: 0, paddingLeft: 16 }}>{T.assumptions.map((x, i) => <li key={i}>{x}</li>)}{T.dependsOn.map((d) => <li key={d}>Thesis: {thesisById(d)?.title}</li>)}</ul>
        <div className="at-xs at-muted" style={{ fontWeight: 600 }}>Against reality <KindLabel k="fact" /></div>
        {T.statusHistory.filter((h) => yearOf(h.date) <= asOf + 1e-6).map((h, i) => (
          <div key={i} className="at-xs"><span className="at-mono at-faint">{h.date}</span> <b style={{ color: THESIS_STATUS_META[h.status].color }}>{THESIS_STATUS_META[h.status].label}</b> — {h.note}
            {h.evidenceIds.length > 0 && <> <button className="at-link" onClick={() => open({ kind: "evidence", ids: h.evidenceIds, title: T.title })}>sources</button></>}</div>
        ))}
        {claims.length > 0 && <div className="at-h3" style={{ marginTop: 4 }}>Claims ({claims.length})</div>}
        {claims.map((a) => <div key={a.id} className="at-ev"><ClaimLine a={a} /></div>)}
      </div>
    );
  }
  if (n.kind === "prediction" || n.kind === "decision" || n.kind === "outcome") {
    const a = ASSERTIONS.find((x) => x.id === n.ref);
    if (!a) return null;
    return (
      <div className="at-stack">
        <div className="at-eyebrow" style={{ margin: 0 }}>{NODE_KIND_LABEL[n.kind]}</div>
        <div className="at-ev"><ClaimLine a={a} /></div>
        <div className="at-xs"><b>Outcome:</b> {a.outcome}</div>
        <button className="at-btn sm" onClick={() => onOpenClaim(a.id)}>Open case file</button>
      </div>
    );
  }
  if (n.kind === "evidence") return <EvidenceList ids={[n.ref]} />;
  if (n.kind === "tech") {
    const T = TECHNOLOGIES.find((x) => x.id === n.ref);
    return T ? <div className="at-stack"><div className="at-eyebrow" style={{ margin: 0 }}>Technology · {T.date}</div><div className="at-h3">{T.name}</div><div className="at-small">{T.summary}</div><EvidenceList ids={T.evidenceIds} /></div> : null;
  }
  if (n.kind === "event") {
    const ev = EVENTS.find((x) => x.id === n.ref);
    return ev ? <div className="at-stack"><div className="at-eyebrow" style={{ margin: 0 }}>Historical event · {ev.date}</div><div className="at-h3">{ev.title}</div><div className="at-small">{ev.summary}</div><div className="at-xs" style={{ color: "var(--interp)" }}>{ev.significance}</div><EvidenceList ids={ev.evidenceIds} /></div> : null;
  }
  if (n.kind === "org") return <div className="at-stack"><div className="at-eyebrow" style={{ margin: 0 }}>Organization</div><div className="at-h3">{n.label}</div></div>;
  if (n.kind === "assumption") return <div className="at-stack"><div className="at-eyebrow" style={{ margin: 0 }}>Assumption</div><div className="at-small">{n.label}</div></div>;
  return <div className="at-small">{n.label}</div>;
}

function labelFor(id: string) {
  if (id.startsWith("p:")) return thinkerById(id.slice(2))?.name ?? id;
  if (id.startsWith("th:")) return thesisById(id.slice(3))?.title ?? id;
  if (id.startsWith("c:")) return "claim";
  return id.split(":")[0];
}
