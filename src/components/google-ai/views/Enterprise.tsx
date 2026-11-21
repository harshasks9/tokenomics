"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fmtDate, inEffect } from "@/lib/google-ai/dates";
import { SCENARIOS, WORKLOADS } from "@/lib/google-ai/editorial";
import { ENTITIES, ENTITY_BY_ID, PRICES_BY_ENTITY } from "@/lib/google-ai/kb";
import type { EnterpriseWorkload } from "@/lib/google-ai/types";
import { Cites, Empty, Ev, Sec, Status, usd, useHub } from "../ui";

const ARCH_LABEL: Record<EnterpriseWorkload["architecture"], string> = { assistant: "Assistant", rag: "Grounded search", "single-agent": "Single agent", "multi-agent": "Multi-agent", voice: "Voice", "batch-pipeline": "Batch pipeline" };
const GTM: { key: "customer" | "sales" | "technical" | "commercial" | "competitive" | "execution"; label: string; who: string }[] = [
  { key: "customer", label: "Customer relevance", who: "What the buyer cares about" },
  { key: "sales", label: "Sales relevance", who: "How to open the conversation" },
  { key: "technical", label: "Technical relevance", who: "What the architect will ask" },
  { key: "commercial", label: "Commercial relevance", who: "How it is bought and priced" },
  { key: "competitive", label: "Competitive relevance", who: "What the alternative looks like" },
  { key: "execution", label: "Execution relevance", who: "What makes delivery succeed or fail" },
];

/** Share of a workload's reference stack that is generally available today — computed from the knowledge base, not asserted. */
function readiness(w: EnterpriseWorkload) {
  const parts = w.stack.map((s) => ({ ...s, e: ENTITY_BY_ID[s.entityId] })).filter((s) => s.e);
  const ga = parts.filter((s) => s.e.status === "ga");
  return { parts, ga: ga.length, total: parts.length, share: parts.length ? ga.length / parts.length : 0, notGa: parts.filter((s) => s.e.status !== "ga") };
}

export default function Enterprise() {
  const { today, mode } = useHub();
  const [industry, setIndustry] = useState("all");
  const [fn, setFn] = useState("all");
  const [arch, setArch] = useState("all");
  const [sel, setSel] = useState<string | null>(null);

  const industries = useMemo(() => [...new Set(WORKLOADS.flatMap((w) => w.industries))].sort(), []);
  const functions = useMemo(() => [...new Set(WORKLOADS.flatMap((w) => w.functions))].sort(), []);
  const archs = useMemo(() => [...new Set(WORKLOADS.map((w) => w.architecture))], []);
  const rows = WORKLOADS.filter((w) => (industry === "all" || w.industries.includes(industry) || w.industries.includes("Any industry")) && (fn === "all" || w.functions.includes(fn)) && (arch === "all" || w.architecture === arch));
  const current = rows.find((w) => w.id === sel) ?? rows[0];
  const products = useMemo(() => ENTITIES.filter((e) => e.providerId === "google" && e.layer === "enterprise"), []);

  return (
    <>
      <header className="gai-hero">
        <div className="gai-page-ico" aria-hidden>🧩</div>
        <h1 className="gai-h1">Workloads</h1>
        <p className="gai-lede">Pick a workload to see the stack behind it, how ready each part is today, and what it means for the customer.</p>
      </header>

      <Sec title="Workload navigator" sub="Industry × function × architecture.">
        <div className="gai-card gai-row">
          <label className="gai-small gai-row">Industry
            <select className="gai-select" value={industry} onChange={(e) => setIndustry(e.target.value)}><option value="all">Any</option>{industries.filter((i) => i !== "Any industry").map((i) => <option key={i}>{i}</option>)}</select>
          </label>
          <label className="gai-small gai-row">Function
            <select className="gai-select" value={fn} onChange={(e) => setFn(e.target.value)}><option value="all">Any</option>{functions.map((i) => <option key={i}>{i}</option>)}</select>
          </label>
          <label className="gai-small gai-row">Architecture
            <select className="gai-select" value={arch} onChange={(e) => setArch(e.target.value)}><option value="all">Any</option>{archs.map((a) => <option key={a} value={a}>{ARCH_LABEL[a]}</option>)}</select>
          </label>
          <span className="gai-small gai-muted">{rows.length} of {WORKLOADS.length} workloads</span>
        </div>
        {rows.length === 0 || !current ? (
          <div style={{ marginTop: 12 }}><Empty title="No workload matches this combination">Clear a filter. Workloads are added only when their reference stack can be tied to products in the knowledge base.</Empty></div>
        ) : (
          <div className="gai-split" style={{ marginTop: 12, gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)" }}>
            <ul className="gai-stack">
              {rows.map((w) => {
                const r = readiness(w);
                return (
                  <li key={w.id}>
                    <button type="button" className="gai-card link" style={{ width: "100%", textAlign: "left", borderColor: current.id === w.id ? "var(--accent)" : undefined }} aria-pressed={current.id === w.id} onClick={() => setSel(w.id)}>
                      <span className="gai-row"><span className="gai-tag">{ARCH_LABEL[w.architecture]}</span><span className="gai-small gai-muted">{r.ga} of {r.total} parts generally available</span></span>
                      <b style={{ display: "block", marginTop: 4 }}>{w.name}</b>
                      <span className="gai-small gai-muted">{w.industries.join(", ")}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <Detail w={current} today={today} technical={mode !== "executive"} />
          </div>
        )}
      </Sec>

      <Sec id="matrix" title="Enterprise opportunity matrix" sub="Across: how much of the reference stack is generally available today (computed from product stages). Up: business value as rated by the editors (a judgment). Bubble size: number of components to integrate.">
        {WORKLOADS.length === 0 ? <Empty title="No workload recorded" /> : <Matrix onPick={(id) => { setIndustry("all"); setFn("all"); setArch("all"); setSel(id); }} />}
      </Sec>

      <Sec id="products" title="What enterprises buy" sub="Layer 6 products and their published list prices in effect today. Negotiated prices differ.">
        {products.length === 0 ? <Empty title="No enterprise product recorded" /> : (
          <div className="gai-tablewrap">
            <table className="gai-table">
              <thead><tr><th>Product</th><th>Stage</th><th>What it is</th><th className="num">List price today</th></tr></thead>
              <tbody>
                {products.map((e) => {
                  const seat = (PRICES_BY_ENTITY[e.id] ?? []).filter((p) => p.meter === "seat-month" && inEffect(today, p.effectiveFrom, p.effectiveTo));
                  return (
                    <tr key={e.id}>
                      <td><Link className="gai-link" href={`/google-ai/entity/${e.id}`}>{e.name}</Link>{e.formerNames?.length ? <div className="gai-small gai-muted">formerly {e.formerNames.map((f) => f.name).join(", ")}</div> : null}</td>
                      <td><Status status={e.status} short /></td>
                      <td className="gai-small">{e.summary.length > 180 ? e.summary.slice(0, 178) + "…" : e.summary}</td>
                      <td className="num">{seat.length ? seat.map((p) => <div key={p.id}>{usd(p.price)} <span className="gai-small gai-muted">/ user / month{p.condition ? ` · ${p.condition}` : ""}</span> <Cites ids={p.sourceIds} align="right" /></div>) : <span className="gai-muted gai-small">no list price recorded</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Sec>
    </>
  );
}

function Detail({ w, today, technical }: { w: EnterpriseWorkload; today: string; technical: boolean }) {
  const r = readiness(w);
  const scenario = SCENARIOS.find((s) => s.id === w.scenarioId);
  return (
    <div className="gai-card pad-lg gai-stack">
      <div className="gai-row"><span className="gai-tag">{ARCH_LABEL[w.architecture]}</span>{w.functions.map((f) => <span key={f} className="gai-tag">{f}</span>)}</div>
      <h3 className="gai-h2">{w.name}</h3>
      <p>{w.need}</p>

      <div>
        <div className="gai-group-name">Reference stack · {r.ga} of {r.total} parts generally available on {fmtDate(today)}</div>
        <ol className="gai-claims">
          {r.parts.map((s, i) => (
            <li key={s.entityId}>
              <span><span className="gai-mono gai-muted">{i + 1}</span> <Link className="gai-link" href={`/google-ai/entity/${s.entityId}`}>{s.e.name}</Link> <Status status={s.e.status} short /> <Cites ids={s.e.sourceIds} /></span>
              <span className="gai-small gai-muted">{s.role}</span>
            </li>
          ))}
        </ol>
        {r.notGa.length > 0 && <div className="gai-warn" style={{ marginTop: 8 }}><b>Not generally available yet:</b> {r.notGa.map((s) => `${s.e.name} (${s.e.status})`).join(", ")}. Plan production dates around these, and check each dossier for the current stage.</div>}
        {w.stack.length > r.total && <p className="gai-small gai-muted">{w.stack.length - r.total} planned component(s) are not in the knowledge base and are left out.</p>}
      </div>

      <div>
        <div className="gai-row" style={{ marginBottom: 6 }}><span className="gai-group-name" style={{ margin: 0 }}>What it means</span><Ev label="analyst-interpretation" /></div>
        <div className="gai-grid gai-g2">
          {GTM.filter((g) => technical || g.key !== "technical").map((g) => (
            <div key={g.key} className="gai-card">
              <b>{g.label}</b>
              <div className="gai-small gai-muted">{g.who}</div>
              <p className="gai-small" style={{ marginTop: 4 }}>{w[g.key]}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="gai-group-name">Risks to raise early</div>
        <ul className="gai-small gai-stack" style={{ listStyle: "disc", paddingLeft: 18 }}>{w.risks.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <div className="gai-row">
        {scenario && <Link className="gai-btn" href={`/google-ai/pricing?scenario=${scenario.id}`}>Estimate cost: {scenario.name} →</Link>}
        <Link className="gai-btn" href="/google-ai/stack#agents">See the agent architecture →</Link>
        {w.sourceIds.length > 0 && <Cites ids={w.sourceIds} />}
      </div>
    </div>
  );
}

function Matrix({ onPick }: { onPick: (id: string) => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const W = 720, H = 360, L = 56, R = 20, T = 16, B = 44;
  const pts = WORKLOADS.map((w) => ({ w, r: readiness(w) })).filter((p) => p.r.total > 0);
  const x = (v: number) => L + v * (W - L - R);
  const y = (v: number) => T + (1 - (v - 0.5) / 5) * (H - T - B);
  const h = pts.find((p) => p.w.id === hover);
  return (
    <div className="gai-split">
      <div className="gai-card" style={{ position: "relative" }}>
        <svg className="gai-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Opportunity matrix: readiness of the reference stack against editorial business value, one bubble per workload. The table beside it lists the same values.">
          {[0, 0.25, 0.5, 0.75, 1].map((v) => <g key={v}><line x1={x(v)} x2={x(v)} y1={T} y2={H - B} className="grid" /><text x={x(v)} y={H - B + 16} textAnchor="middle">{Math.round(v * 100)}%</text></g>)}
          {[1, 2, 3, 4, 5].map((v) => <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="grid" /><text x={L - 8} y={y(v) + 4} textAnchor="end">{v}</text></g>)}
          <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle">Share of reference stack generally available today</text>
          <text x={14} y={(T + H - B) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(T + H - B) / 2})`}>Business value (editorial)</text>
          {pts.map(({ w, r }, i) => (
            <g key={w.id} onMouseEnter={() => setHover(w.id)} onMouseLeave={() => setHover(null)}>
              <circle cx={x(r.share)} cy={y(w.value) + ((i % 3) - 1) * 7} r={6 + r.total * 1.4} fill="var(--s1)" fillOpacity={hover === w.id ? 0.9 : 0.45} stroke="var(--s1)" strokeWidth="1.5" tabIndex={0} role="button" aria-label={`${w.name}: ${Math.round(r.share * 100)}% of stack generally available, value ${w.value} of 5`} onFocus={() => setHover(w.id)} onBlur={() => setHover(null)} onClick={() => onPick(w.id)} onKeyDown={(e) => e.key === "Enter" && onPick(w.id)} style={{ cursor: "pointer" }} />
              <text x={x(r.share)} y={y(w.value) + ((i % 3) - 1) * 7 + 4} textAnchor="middle" className="lbl" style={{ pointerEvents: "none" }}>{i + 1}</text>
            </g>
          ))}
        </svg>
        <p className="gai-small" style={{ minHeight: 20 }}>{h ? <><b>{h.w.name}</b> — {h.r.ga} of {h.r.total} parts generally available; value {h.w.value}/5 (editorial).</> : <span className="gai-muted">Hover or focus a bubble. Numbers match the table.</span>}</p>
      </div>
      <div className="gai-tablewrap">
        <table className="gai-table">
          <thead><tr><th>#</th><th>Workload</th><th className="num">Ready</th><th className="num">Value</th></tr></thead>
          <tbody>{pts.map(({ w, r }, i) => <tr key={w.id}><td>{i + 1}</td><td><button type="button" className="gai-link" style={{ textAlign: "left" }} onClick={() => onPick(w.id)}>{w.name}</button></td><td className="num">{Math.round(r.share * 100)}%</td><td className="num">{w.value}/5</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
