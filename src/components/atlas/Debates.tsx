"use client";

import { useRef, useState } from "react";
import { DEBATES, thesisById } from "@/lib/atlas/data";
import { yearOf } from "@/lib/atlas/taxonomy";
import type { Debate } from "@/lib/atlas/types";
import { ExportMenu, KindLabel, LayerTags, PersonLink, SectionHead, SourcesButton, StatusBadge, useAtlas } from "./Shared";

const CA = "#3b5bdb", CB = "#e8590c";

export default function Debates({ initial }: { initial?: string }) {
  const [id, setId] = useState(DEBATES.find((d) => d.id === initial)?.id ?? DEBATES[0]?.id);
  const d = DEBATES.find((x) => x.id === id);
  if (!d) return <div className="at-wrap at-view"><div className="at-empty">Debates not loaded.</div></div>;
  return (
    <div className="at-wrap at-view">
      <SectionHead eyebrow="Experience 07 · The great debates" title="Where AI's sharpest minds split — and how evidence moved"
        right={<ExportMenu name="atlas-debates" json={() => DEBATES} rows={() => DEBATES.map((x) => ({ id: x.id, title: x.title, question: x.question, status: x.status, campA: x.camps[0]?.label, campA_thinkers: x.camps[0]?.thinkers, campB: x.camps[1]?.label, campB_thinkers: x.camps[1]?.thinkers, latest_balance: x.balance.at(-1)?.value, both_right: x.bothRight }))} />}>
        Each map shows the opposing camps, the assumptions doing the work, the dated evidence that favored each side, and the balance of evidence
        through time. Disagreement is not falsification: several debates are still open.
      </SectionHead>
      <div className="at-grid" style={{ gridTemplateColumns: "290px minmax(0, 1fr)", alignItems: "start" }}>
        <div className="at-card" style={{ padding: 6, position: "sticky", top: 70 }}>
          {DEBATES.map((x, i) => {
            const last = x.balance.at(-1)?.value ?? 0;
            return (
              <button key={x.id} onClick={() => setId(x.id)} aria-pressed={x.id === id}
                style={{ all: "unset", cursor: "pointer", display: "grid", gridTemplateColumns: "22px 1fr 44px", gap: 8, alignItems: "center", padding: "8px 10px", borderRadius: 8, background: x.id === id ? "var(--sunk)" : undefined, width: "100%", boxSizing: "border-box" }}>
                <span className="at-mono at-xs at-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="at-small" style={{ fontWeight: x.id === id ? 650 : 500, lineHeight: 1.3 }}>{x.title}</span>
                <MiniBalance v={last} status={x.status} />
              </button>
            );
          })}
        </div>
        <DebateMap d={d} />
      </div>
    </div>
  );
}

function MiniBalance({ v, status }: { v: number; status: Debate["status"] }) {
  return (
    <span title={`${status}; balance ${v.toFixed(2)}`} style={{ position: "relative", height: 8, background: "var(--line)", borderRadius: 4, display: "block" }}>
      <span style={{ position: "absolute", left: "50%", top: -2, bottom: -2, borderLeft: "1px solid var(--ink-3)" }} />
      <span style={{ position: "absolute", top: 0, height: 8, borderRadius: 4, background: v < 0 ? CA : CB, left: v < 0 ? `${50 + v * 50}%` : "50%", width: `${Math.abs(v) * 50}%` }} />
    </span>
  );
}

function DebateMap({ d }: { d: Debate }) {
  const { go } = useAtlas();
  const svgRef = useRef<SVGSVGElement>(null);
  const [A, B] = d.camps;
  const pts = [...d.balance].sort((a, b) => yearOf(a.date) - yearOf(b.date));
  const W = 760, H = 210, padL = 56, padR = 16, padT = 22, padB = 28;
  const x0 = 2012, x1 = 2026.8;
  const sx = (y: number) => padL + ((y - x0) / (x1 - x0)) * (W - padL - padR);
  const sy = (v: number) => padT + ((v + 1) / 2) * (H - padT - padB);
  const path = pts.map((p, i) => `${i ? "L" : "M"} ${sx(yearOf(p.date))} ${sy(p.value)}`).join(" ");
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="at-stack" style={{ gap: 14 }}>
      <div className="at-card at-pad">
        <div className="at-between">
          <div className="at-row"><StatusBadge s={d.status === "resolved" ? "validated" : d.status === "leaning" ? "partial" : "unresolved"} /><span className="at-xs at-muted">{d.status === "resolved" ? "Largely resolved" : d.status === "leaning" ? "Evidence leaning" : "Open"}</span></div>
          <div className="at-row"><LayerTags layers={d.layers} /></div>
        </div>
        <h3 className="at-serif" style={{ fontSize: 28, margin: "8px 0 4px", lineHeight: 1.15 }}>{d.title}</h3>
        <p className="at-muted" style={{ margin: 0 }}>{d.question}</p>
      </div>

      <div className="at-camps">
        {[A, B].map((c, i) => c && (
          <div key={c.id} className={`at-camp ${i ? "b" : "a"}`}>
            <div className="at-eyebrow" style={{ color: i ? CB : CA, margin: 0 }}>Camp {i ? "B" : "A"}</div>
            <div className="at-h3" style={{ fontSize: 17 }}>{c.label}</div>
            <p className="at-small" style={{ margin: "0 0 8px" }}>{c.position}</p>
            <div className="at-row" style={{ gap: 4, marginBottom: 8 }}>{c.thinkers.map((t) => <span key={t} className="at-tag" style={{ background: "#fff", border: "1px solid var(--line)" }}><PersonLink id={t} /></span>)}</div>
            <div className="at-xs at-muted" style={{ fontWeight: 650 }}>Load-bearing assumptions <KindLabel k="interp" /></div>
            <ul>{c.assumptions.map((a, k) => <li key={k}>{a}</li>)}</ul>
            <div className="at-xs at-muted" style={{ fontWeight: 650, marginTop: 8 }}>Evidence that favored this camp <KindLabel k="fact" /></div>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {[...c.evidenceFor].sort((a, b) => a.date.localeCompare(b.date)).map((e, k) => (
                <li key={k} style={{ display: "grid", gridTemplateColumns: "62px 1fr", gap: 6 }}>
                  <span className="at-mono at-xs at-faint">{e.date}</span>
                  <span>{e.text} {e.evidenceIds.length > 0 && <SourcesButton ids={e.evidenceIds} title={e.text} label="src" />}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="at-card at-pad">
        <div className="at-between">
          <div className="at-h3" style={{ margin: 0 }}>Balance of evidence over time <KindLabel k="interp" /></div>
          <ExportMenu name={`atlas-debate-${d.id}`} svg={() => svgRef.current} rows={() => pts.map((p) => ({ date: p.date, balance: p.value, note: p.note }))} />
        </div>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", marginTop: 6 }} role="img" aria-label={`Balance of evidence for ${d.title}, from ${pts[0]?.date} to ${pts.at(-1)?.date}`}>
          <rect x={padL} y={padT} width={W - padL - padR} height={(H - padT - padB) / 2} fill={CA} opacity={0.05} />
          <rect x={padL} y={sy(0)} width={W - padL - padR} height={(H - padT - padB) / 2} fill={CB} opacity={0.05} />
          <line x1={padL} x2={W - padR} y1={sy(0)} y2={sy(0)} stroke="#b9b4a6" strokeDasharray="3 3" />
          <text x={padL - 6} y={sy(-0.85)} textAnchor="end" fontSize="10.5" fill={CA} fontWeight="650">A</text>
          <text x={padL - 6} y={sy(0.85)} textAnchor="end" fontSize="10.5" fill={CB} fontWeight="650">B</text>
          <text x={padL - 6} y={sy(0) + 3} textAnchor="end" fontSize="10" fill="#8a8473">even</text>
          {[2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026].map((y) => <text key={y} x={sx(y)} y={H - 8} textAnchor="middle" fontSize="10.5" fill="#8a8473">{y}</text>)}
          <path d={path} fill="none" stroke="#111827" strokeWidth={2} />
          {pts.map((p, i) => (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} style={{ cursor: "default" }}>
              <circle cx={sx(yearOf(p.date))} cy={sy(p.value)} r={12} fill="transparent" />
              <circle cx={sx(yearOf(p.date))} cy={sy(p.value)} r={hover === i ? 6 : 4.5} fill={p.value < 0 ? CA : p.value > 0 ? CB : "#8a8473"} stroke="#fff" strokeWidth={1.5} />
            </g>
          ))}
        </svg>
        <div className="at-small" style={{ minHeight: 40 }}>
          {hover != null ? <><b className="at-mono">{pts[hover].date}</b> — {pts[hover].note}</> : <span className="at-faint">Hover or focus a point to see what moved the balance. Values are an analyst reading of the evidence, not a poll.</span>}
        </div>
        <div className="at-stack" style={{ gap: 4, marginTop: 6 }}>
          {pts.map((p, i) => <div key={i} className="at-xs"><span className="at-mono at-faint">{p.date}</span> <b style={{ color: p.value < 0 ? CA : p.value > 0 ? CB : undefined }}>{p.value > 0 ? "B" : p.value < 0 ? "A" : "even"} {Math.abs(p.value).toFixed(1)}</b> — {p.note}</div>)}
        </div>
      </div>

      <div className="at-grid at-g2">
        <div className="at-card at-pad">
          <div className="at-h3">Could both be right?</div>
          <p className="at-small" style={{ margin: 0 }}>{d.bothRight}</p>
        </div>
        <div className="at-card at-pad">
          <div className="at-h3">Where it stands (Oct 2026)</div>
          <p className="at-small" style={{ margin: 0 }}>{d.verdictNote}</p>
          {d.thesisIds.length > 0 && (
            <div className="at-row" style={{ marginTop: 10 }}>
              {d.thesisIds.map((t) => thesisById(t) && <button key={t} className="at-chip" onClick={() => go("graph", { thesis: t })}>{thesisById(t)!.title} →</button>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
