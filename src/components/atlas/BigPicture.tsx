"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ASSERTIONS, DEBATES, EVENTS, JUDGMENTS, METRICS, PERIODS, SYNTHESIS, THESES, THINKERS, thinkerById } from "@/lib/atlas/data";
import { DEFAULT_WEIGHTS, scoreAll } from "@/lib/atlas/scoring";
import { COHORTS, CUTOFF, LAYERS, THESIS_STATUS_META, cohortById, yearOf } from "@/lib/atlas/taxonomy";
import type { ThesisStatus } from "@/lib/atlas/types";
import { ExportMenu, KindLabel, useAtlas } from "./Shared";
import { heatColor } from "./StackView";
import { PERIOD_SHORT } from "./periodLabels";

const KIND_COLOR: Record<string, string> = {
  research: "#4a3aa7", model: "#2b59c3", product: "#0e7490", infra: "#6b7280", capital: "#b45309", policy: "#c0397a", market: "#15803d", org: "#8a8473",
};

export default function BigPicture() {
  const { go, open } = useAtlas();
  const rows = useMemo(() => scoreAll(THINKERS, ASSERTIONS, JUDGMENTS, DEFAULT_WEIGHTS, {}, 200), []);
  const ranked = rows.filter((r) => !r.insufficient);
  const scored = ASSERTIONS.filter((a) => a.verdict !== "unresolved");
  const pct = (v: string) => Math.round((scored.filter((a) => a.verdict === v).length / Math.max(1, scored.length)) * 100);
  const top = ranked.slice(0, 5);
  const tie = ranked.length > 1 && ranked[1].hi >= ranked[0].lo;
  const headline = SYNTHESIS.questions.find((q) => q.id === "headline");

  return (
    <>
      <section className="at-hero">
        <div className="at-wrap">
          <p className="at-eyebrow">Experience 01 · The big picture · research cutoff {CUTOFF}</p>
          <h1>How did the world&apos;s understanding of AI evolve — and who saw the future most clearly?</h1>
          <p className="lede">{headline?.answer ?? "Thirty builders, researchers and investors; their dated claims; what actually happened. A connected record of AI thinking from AlexNet to the 2026 frontier."}</p>
          <div className="at-grid at-g4" style={{ marginTop: 30, maxWidth: 980 }}>
            <div className="at-kpi"><b className="at-num">{THINKERS.length}</b><span>minds across {COHORTS.length} cohorts</span></div>
            <div className="at-kpi"><b className="at-num">{ASSERTIONS.length}</b><span>dated claims · {scored.length} scorable today</span></div>
            <div className="at-kpi"><b className="at-num">{pct("correct")}%</b><span>of scorable claims fully correct ({pct("partial")}% partial, {pct("incorrect")}% wrong)</span></div>
            <div className="at-kpi"><b className="at-num">{ASSERTIONS.length - scored.length}</b><span>still unresolved — deadlines not yet reached</span></div>
          </div>
          <div className="at-row" style={{ marginTop: 26 }}>
            <button className="at-btn" style={{ background: "#fff", color: "var(--night)" }} onClick={() => go("graph")}>Explore the knowledge graph <ArrowRight size={14} /></button>
            <button className="at-btn" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.3)" }} onClick={() => go("leaderboard")}>Foresight leaderboard</button>
            <button className="at-btn" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.3)" }} onClick={() => go("synthesis")}>Read the synthesis</button>
          </div>
        </div>
      </section>

      <div className="at-wrap at-view at-stack" style={{ gap: 18 }}>
        <TurningPoints onOpen={(ids, title) => open({ kind: "evidence", ids, title })} />

        <div className="at-grid" style={{ gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)", alignItems: "start" }}>
          <ValueMigration onPeriod={(p) => go("timeline", { p })} />
          <div className="at-card at-pad">
            <div className="at-between"><div className="at-h3" style={{ margin: 0 }}>Who saw it most clearly</div><button className="at-link at-xs" onClick={() => go("leaderboard")}>full leaderboard →</button></div>
            <p className="at-xs at-muted" style={{ marginTop: 2 }}>Composite foresight score (default weights) with 80% intervals.{tie && " The top intervals overlap — no single winner is justified."}</p>
            {top.map((r) => {
              const t = thinkerById(r.thinkerId)!;
              const c = cohortById(t.cohort).color;
              return (
                <button key={r.thinkerId} onClick={() => open({ kind: "thinker", id: t.id })} style={{ all: "unset", cursor: "pointer", display: "grid", gridTemplateColumns: "22px 1fr 1.2fr 34px", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--line)", width: "100%" }}>
                  <span className="at-mono at-faint">{r.rank}{r.tieAbove ? "=" : ""}</span>
                  <span className="at-small" style={{ fontWeight: 600 }}>{t.name}</span>
                  <span className="at-ci" aria-hidden="true"><span className="axis" /><span className="band" style={{ left: `${r.lo * 100}%`, width: `${(r.hi - r.lo) * 100}%`, background: c }} /><span className="pt" style={{ left: `${r.score * 100}%`, background: c }} /></span>
                  <span className="at-mono at-small" style={{ textAlign: "right" }}>{Math.round(r.score * 100)}</span>
                </button>
              );
            })}
            <AccuracyScatter rows={rows} onPick={(id) => open({ kind: "thinker", id })} />
          </div>
        </div>

        <ThesisBoard onThesis={(id) => go("graph", { thesis: id })} />

        <div className="at-grid at-g2" style={{ alignItems: "start" }}>
          <div className="at-card at-pad">
            <div className="at-between"><div className="at-h3" style={{ margin: 0 }}>The great disagreements</div><button className="at-link at-xs" onClick={() => go("debates")}>all debates →</button></div>
            <p className="at-xs at-muted" style={{ marginTop: 2 }}>Where the balance of evidence sat at the cutoff. <KindLabel k="interp" /></p>
            {DEBATES.map((d) => {
              const v = d.balance.at(-1)?.value ?? 0;
              return (
                <button key={d.id} onClick={() => go("debates", { d: d.id })} style={{ all: "unset", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr 120px", gap: 10, alignItems: "center", padding: "6px 0", width: "100%", borderBottom: "1px dashed var(--line)" }}>
                  <span className="at-small"><span style={{ fontWeight: 600 }}>{d.title}</span><span className="at-xs at-faint"> · {d.status}</span>
                    <span className="at-xs at-muted" style={{ display: "block" }}>{v < -0.15 ? d.camps[0]?.label : v > 0.15 ? d.camps[1]?.label : "Evenly balanced"}</span></span>
                  <span style={{ position: "relative", height: 8, background: "var(--line)", borderRadius: 4 }}>
                    <span style={{ position: "absolute", left: "50%", top: -3, bottom: -3, borderLeft: "1px solid var(--ink-3)" }} />
                    <span style={{ position: "absolute", top: 0, height: 8, borderRadius: 4, background: v < 0 ? "#3b5bdb" : "#e8590c", left: v < 0 ? `${50 + v * 50}%` : "50%", width: `${Math.abs(v) * 50}%` }} />
                  </span>
                </button>
              );
            })}
          </div>
          <Metrics />
        </div>
      </div>
    </>
  );
}

function TurningPoints({ onOpen }: { onOpen: (ids: string[], title: string) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [minMag, setMinMag] = useState(5);
  const evs = EVENTS.filter((e) => e.magnitude >= minMag);
  const W = 1240, pad = 30, LANE = 26;
  const sx = (d: string) => pad + ((yearOf(d) - 2012) / (yearOf(CUTOFF) - 2012)) * (W - 2 * pad - 120);
  // Stagger labels into lanes so no two labels overlap (label width ≈ 6px per character).
  const lanes: number[] = [];
  const placed = evs.map((e) => {
    const x = sx(e.date);
    const label = e.title.length > 30 ? e.title.slice(0, 29) + "…" : e.title;
    const w = label.length * 5.9 + 14;
    let lane = 0;
    while (lanes[lane] != null && x < lanes[lane]) lane++;
    lanes[lane] = x + w;
    return { e, x, lane, label };
  });
  const H = 60 + Math.max(4, lanes.length) * LANE;
  const h = evs.find((e) => e.id === hover);
  return (
    <div className="at-card at-pad">
      <div className="at-between">
        <div><div className="at-h3" style={{ margin: 0 }}>Turning points that changed what people could know</div><div className="at-xs at-muted">{evs.length} events (magnitude ≥ {minMag} of 5), 2012 → Oct 2026. Hover for why each mattered; click for sources.</div></div>
        <div className="at-row"><div className="at-seg" role="group" aria-label="Event magnitude">
          <button aria-pressed={minMag === 5} onClick={() => setMinMag(5)}>Era-defining</button>
          <button aria-pressed={minMag === 4} onClick={() => setMinMag(4)}>Major</button>
          <button aria-pressed={minMag === 3} onClick={() => setMinMag(3)}>All notable</button></div>
        <ExportMenu name="atlas-turning-points" svg={() => svgRef.current} rows={() => evs.map((e) => ({ date: e.date, title: e.title, kind: e.kind, layers: e.layers, summary: e.summary, significance: e.significance }))} /></div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 760, height: "auto" }} role="img" aria-label="Timeline of major AI turning points">
          <line x1={pad} x2={W - pad} y1={H - 34} y2={H - 34} stroke="#cfcabc" />
          {Array.from({ length: 15 }, (_, i) => 2012 + i).map((y) => (
            <g key={y}><line x1={sx(`${y}`)} x2={sx(`${y}`)} y1={H - 38} y2={H - 30} stroke="#cfcabc" /><text x={sx(`${y}`)} y={H - 14} textAnchor="middle" fontSize="11" fill="#8a8473">{y}</text></g>
          ))}
          {placed.map(({ e, x, lane, label }) => {
            const y = H - 48 - lane * LANE;
            return (
              <g key={e.id} tabIndex={0} role="button" aria-label={`${e.date}: ${e.title}`} style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover(e.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(e.id)} onBlur={() => setHover(null)}
                onClick={() => onOpen(e.evidenceIds, e.title)} onKeyDown={(k) => { if (k.key === "Enter") onOpen(e.evidenceIds, e.title); }}>
                <line x1={x} x2={x} y1={y} y2={H - 34} stroke={KIND_COLOR[e.kind] ?? "#888"} strokeOpacity={0.35} />
                <circle cx={x} cy={y} r={e.magnitude === 5 ? 6 : 4.5} fill={KIND_COLOR[e.kind] ?? "#888"} stroke="#fff" strokeWidth={1.5} />
                <text x={x + 8} y={y + 4} fontSize="11" fontWeight={hover === e.id ? 700 : 550} fill="#1f2937">{label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="at-row at-xs at-muted" style={{ marginTop: 4 }}>
        {Object.entries(KIND_COLOR).map(([k, c]) => <span key={k} className="at-row" style={{ gap: 4 }}><span style={{ width: 9, height: 9, borderRadius: 5, background: c }} />{k}</span>)}
      </div>
      <div className="at-small" style={{ minHeight: 44, marginTop: 8 }}>
        {h ? <><b className="at-mono">{h.date}</b> · <b>{h.title}</b> — {h.summary} <span style={{ color: "var(--interp)" }}>Why it mattered: {h.significance}</span></> : <span className="at-faint">Hover or focus an event.</span>}
      </div>
    </div>
  );
}

function ValueMigration({ onPeriod }: { onPeriod: (p: string) => void }) {
  return (
    <div className="at-card at-pad">
      <div className="at-h3" style={{ margin: 0 }}>Where attention and investment sat, layer by layer</div>
      <p className="at-xs at-muted" style={{ marginTop: 2 }}>Heat = share of attention/investment in each period (0–3, analyst reading of the period record). Value moved down the stack to chips and power, then back up to agents and apps. <KindLabel k="interp" /></p>
      <div className="at-heat" style={{ gridTemplateColumns: `130px repeat(${PERIODS.length}, minmax(0, 1fr))` }}>
        <span />
        {PERIODS.map((p) => <button key={p.id} className="ch" style={{ all: "unset", cursor: "pointer", textAlign: "center", fontSize: 11, color: "var(--ink-3)", fontWeight: 600 }} onClick={() => onPeriod(p.id)}>{PERIOD_SHORT[p.id]}</button>)}
        {[...LAYERS].reverse().map((L) => (
          <div key={L.id} style={{ display: "contents" }}>
            <span className="rl" title={L.name}>{L.n}. {L.short}</span>
            {PERIODS.map((p) => {
              const h = p.layers[L.id]?.heat ?? 0;
              return <span key={p.id} className="cell" title={`${L.name}, ${PERIOD_SHORT[p.id]}: ${p.layers[L.id]?.state ?? ""}`} style={{ background: heatColor(h), color: h >= 3 ? "#fff" : "#4b5563" }}>{h || ""}</span>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function AccuracyScatter({ rows, onPick }: { rows: ReturnType<typeof scoreAll>; onPick: (id: string) => void }) {
  const pts = rows.filter((r) => !r.insufficient);
  const W = 420, H = 280, p = 34;
  const xs = pts.map((r) => r.dims.originality), ys = pts.map((r) => r.dims.accuracy);
  const x0 = Math.min(...xs) - 0.03, x1 = Math.max(...xs) + 0.03, y0 = Math.min(...ys) - 0.03, y1 = Math.max(...ys) + 0.03;
  const sx = (v: number) => p + ((v - x0) / (x1 - x0)) * (W - p - 60), sy = (v: number) => H - p - ((v - y0) / (y1 - y0)) * (H - p - 10);
  // Greedy label placement: skip labels that would collide with an already-placed one.
  const placedL: { x: number; y: number }[] = [];
  const showLabel = new Set<string>();
  [...pts].sort((a, b) => b.score - a.score).forEach((r) => {
    const x = sx(r.dims.originality), y = sy(r.dims.accuracy);
    if (placedL.every((q) => Math.abs(q.x - x) > 52 || Math.abs(q.y - y) > 11)) { placedL.push({ x, y }); showLabel.add(r.thinkerId); }
  });
  return (
    <div style={{ marginTop: 14 }}>
      <div className="at-xs at-muted" style={{ fontWeight: 650 }}>Accuracy vs contrarian insight <span className="at-faint" style={{ fontWeight: 400 }}>(axes zoomed to the data; hover dots for names)</span></div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} role="img" aria-label="Scatter of accuracy versus originality for ranked thinkers">
        {y0 < 0.5 && y1 > 0.5 && <line x1={p} x2={W - 10} y1={sy(0.5)} y2={sy(0.5)} stroke="#e5e2da" />}
        {x0 < 0.5 && x1 > 0.5 && <line x1={sx(0.5)} x2={sx(0.5)} y1={10} y2={H - p} stroke="#e5e2da" />}
        <text x={W - 10} y={H - 8} textAnchor="end" fontSize="10" fill="#8a8473">originality (correct & contrarian) →</text>
        <text x={8} y={14} fontSize="10" fill="#8a8473">accuracy ↑</text>
        {pts.map((r) => {
          const t = thinkerById(r.thinkerId)!;
          const c = cohortById(t.cohort);
          const x = sx(r.dims.originality), y = sy(r.dims.accuracy);
          return (
            <g key={r.thinkerId} style={{ cursor: "pointer" }} onClick={() => onPick(t.id)} tabIndex={0} role="button" aria-label={`${t.name}: accuracy ${Math.round(r.dims.accuracy * 100)}, originality ${Math.round(r.dims.originality * 100)}`}
              onKeyDown={(e) => { if (e.key === "Enter") onPick(t.id); }}>
              <title>{t.name}</title>
              {c.shape === "circle" ? <circle cx={x} cy={y} r={5.5} fill={c.color} stroke="#fff" /> :
                <rect x={x - 5} y={y - 5} width={10} height={10} fill={c.color} stroke="#fff" transform={c.shape === "diamond" ? `rotate(45 ${x} ${y})` : undefined} />}
              {showLabel.has(t.id) && <text x={x + 8} y={y + 3.5} fontSize="9.5" fill="#4b5563">{t.name.split(" ").slice(-1)[0]}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ThesisBoard({ onThesis }: { onThesis: (id: string) => void }) {
  const order: ThesisStatus[] = ["validated", "partial", "contested", "unresolved", "falsified"];
  return (
    <div className="at-card at-pad">
      <div className="at-h3" style={{ margin: 0 }}>The big ideas, scored against reality</div>
      <p className="at-xs at-muted" style={{ marginTop: 2 }}>Every thesis in the graph, by status at the cutoff. Click one to see who backed or challenged it.</p>
      <div className="at-grid" style={{ gridTemplateColumns: `repeat(${order.length}, minmax(0, 1fr))`, gap: 10 }}>
        {order.map((s) => {
          const list = THESES.filter((t) => t.status === s);
          const m = THESIS_STATUS_META[s];
          return (
            <div key={s}>
              <div className="at-xs" style={{ fontWeight: 700, color: s === "unresolved" ? "var(--unresolved-text)" : m.color, borderBottom: `2px solid ${m.color}`, paddingBottom: 4, marginBottom: 6 }}>{m.glyph} {m.label} ({list.length})</div>
              {list.map((t) => (
                <button key={t.id} onClick={() => onThesis(t.id)} className="at-ev" style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer", marginBottom: 6, padding: "7px 9px", background: "#fff" }}>
                  <div className="at-small" style={{ fontWeight: 600, lineHeight: 1.3 }}>{t.title}</div>
                  <div className="at-xs at-muted at-clamp2">{t.outcome}</div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metrics() {
  const pick = METRICS.filter((m) => m.points.length >= 3).slice(0, 6);
  return (
    <div className="at-card at-pad">
      <div className="at-h3" style={{ margin: 0 }}>The economic record</div>
      <p className="at-xs at-muted" style={{ marginTop: 2 }}>Sourced series only; gaps are real gaps. <KindLabel k="fact" /></p>
      <div className="at-grid at-g2" style={{ gap: 12 }}>
        {pick.map((m) => <Spark key={m.id} m={m} />)}
      </div>
    </div>
  );
}

function Spark({ m }: { m: (typeof METRICS)[number] }) {
  const { open } = useAtlas();
  const pts = [...m.points].sort((a, b) => yearOf(a.date) - yearOf(b.date));
  const W = 220, H = 70;
  const xs = pts.map((p) => yearOf(p.date)), ys = pts.map((p) => p.value);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const pos = ys.every((v) => v > 0);
  const log = pos && Math.max(...ys) / Math.min(...ys) > 50;
  const f = (v: number) => (log ? Math.log10(v) : v);
  const y0 = Math.min(...ys.map(f)), y1 = Math.max(...ys.map(f));
  const sx = (x: number) => 4 + ((x - x0) / Math.max(1e-6, x1 - x0)) * (W - 8);
  const sy = (v: number) => H - 6 - ((f(v) - y0) / Math.max(1e-9, y1 - y0)) * (H - 14);
  const last = pts.at(-1)!, first = pts[0];
  return (
    <button onClick={() => open({ kind: "evidence", ids: [...new Set(pts.map((p) => p.evidenceId))], title: m.label, context: m.caveat })} style={{ all: "unset", cursor: "pointer", display: "block" }}>
      <div className="at-xs" style={{ fontWeight: 650, lineHeight: 1.3 }}>{m.label}</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 70 }} aria-label={`${m.label}: ${first.value} ${m.unit} in ${first.date} to ${last.value} ${m.unit} in ${last.date}`}>
        <path d={pts.map((p, i) => `${i ? "L" : "M"} ${sx(yearOf(p.date))} ${sy(p.value)}`).join(" ")} fill="none" stroke="#2b59c3" strokeWidth={2} />
        {pts.map((p, i) => <circle key={i} cx={sx(yearOf(p.date))} cy={sy(p.value)} r={2.2} fill="#2b59c3" />)}
      </svg>
      <div className="at-between at-xs at-faint"><span className="at-mono">{first.date}: {fmt(first.value)}</span><span className="at-mono" style={{ color: "var(--ink)" }}>{last.date}: {fmt(last.value)} {m.unit}</span></div>
      {log && <div className="at-xs at-faint">log scale</div>}
    </button>
  );
}

const fmt = (v: number) => (Math.abs(v) >= 1e6 ? v.toExponential(1).replace("e+", "e") : Math.abs(v) >= 100 ? Math.round(v).toLocaleString() : Math.abs(v) >= 1 ? v.toFixed(1) : v.toPrecision(2));
