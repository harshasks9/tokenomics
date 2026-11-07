"use client";

import { useState } from "react";
import { MARKET, PLAYBOOK } from "@/lib/under-the-hood/data";
import { ClassBadge, Ext, Section, Seg } from "../ui";

const heat = (v: number) => ["", "#e3eefb", "#86b6ef", "#1c5cab"][v];
const heatInk = (v: number) => (v === 3 ? "#fff" : "#121417");

export default function Playbook() {
  const [metric, setMetric] = useState<"adoption" | "intensity" | "economics">("adoption");
  const [open, setOpen] = useState<string>(PLAYBOOK.domains[0].domain);
  const m = PLAYBOOK.matrix;
  const g = PLAYBOOK.google;
  const a = PLAYBOOK.apac;
  const japanFacts = MARKET.filter((x) => x.tags.includes("japan"));
  return (
    <Section id="playbook">
      <div className="uth-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))" }}>
        {PLAYBOOK.domains.map((d, i) => (
          <article key={d.domain} className="uth-card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="uth-kicker">{i + 1} · {d.domain}</div>
            <h3 className="uth-h3" style={{ fontSize: 19 }}>{d.opportunity}</h3>
            <p className="uth-p" style={{ fontSize: 14, margin: 0 }}><b>Action:</b> {d.action}</p>
            <button type="button" className="uth-btn" style={{ alignSelf: "flex-start" }} aria-expanded={open === d.domain} onClick={() => setOpen(open === d.domain ? "" : d.domain)}>{open === d.domain ? "Hide detail" : "Evidence, target, risk, metric"}</button>
            {open === d.domain && (
              <dl className="uth-kv" style={{ gridTemplateColumns: "120px 1fr" }}>
                <dt>Evidence</dt><dd>{d.evidence}</dd>
                <dt>Target</dt><dd>{d.target}</dd>
                <dt>Capabilities</dt><dd>{d.capabilities}</dd>
                <dt>Horizon</dt><dd>{d.horizon}</dd>
                <dt>Benefit</dt><dd>{d.benefit}</dd>
                <dt>Risk</dt><dd>{d.risk}</dd>
                <dt>Success metric</dt><dd><strong style={{ color: "var(--ink)" }}>{d.metric}</strong></dd>
              </dl>
            )}
          </article>
        ))}
      </div>

      <div className="uth-block uth-card">
        <h3 className="uth-h3">{g.title}</h3>
        <p className="uth-p" style={{ fontSize: 14 }}>Google’s incentives differ by layer: Google Cloud captures Anthropic’s compute and TPU spend; Gemini competes with Claude for the same API dollars and knowledge-work seats. Measure them separately.</p>
        <div className="uth-tablewrap">
          <table className="uth-table" style={{ minWidth: 860 }}>
            <thead><tr><th>Layer</th><th>What the evidence shows</th><th>Google’s incentive</th><th>Tension</th></tr></thead>
            <tbody>{g.points.map((p) => <tr key={p.layer}><td><strong>{p.layer}</strong></td><td>{p.view}</td><td>{p.incentive}</td><td>{p.tension}</td></tr>)}</tbody>
          </table>
        </div>
        <h4 className="uth-h4" style={{ marginTop: 16 }}>Recommended moves</h4>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6, color: "var(--ink-2)", fontSize: 14.5 }}>{g.actions.map((x) => <li key={x}>{x}</li>)}</ol>
        <p className="uth-xs" style={{ marginTop: 10 }}>Context: Google Cloud Q3 2026 revenue $30.7B (+103%), backlog $561B; Menlo estimates Google’s enterprise LLM API share at 9% vs Anthropic 55% (survey; Menlo is an Anthropic investor). <Ext href="https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q3-2026/">Alphabet Q3</Ext> · <Ext href="https://menlovc.com/perspective/2026-the-state-of-enterprise-ai/">Menlo</Ext> <ClassBadge kind="inference" /></p>
      </div>

      <div className="uth-block uth-split">
        <div className="uth-card">
          <h3 className="uth-h3">{a.title}</h3>
          <ul className="uth-list" style={{ fontSize: 14 }}>{a.context.map((c) => <li key={c}><span>{c}</span></li>)}</ul>
          <div className="uth-tablewrap" style={{ marginTop: 12 }}>
            <table className="uth-table">
              <thead><tr><th>Segment</th><th>Hypothesis</th><th>How to validate</th></tr></thead>
              <tbody>{a.segments.map((s) => <tr key={s.segment}><td><strong>{s.segment}</strong></td><td>{s.hypothesis}</td><td>{s.validate}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="uth-xs" style={{ marginTop: 8 }}>No regional market-share estimates are offered — the filing discloses only US vs international by billing address. <ClassBadge kind="hypothesis" /></p>
        </div>
        <div className="uth-card sunk">
          <h4 className="uth-h4">Japan & APAC sources</h4>
          <ul className="uth-list" style={{ fontSize: 13.5 }}>{japanFacts.map((f) => <li key={f.id}><span><b>{f.entity}:</b> {f.value} <span className="uth-xs">({f.basis}, {f.date})</span> <Ext href={f.url}>source</Ext></span></li>)}</ul>
          <h4 className="uth-h4" style={{ marginTop: 14 }}>Regional risks</h4>
          <ul className="uth-list minus" style={{ fontSize: 13.5 }}>{a.risks.map((r) => <li key={r}><span>{r}</span></li>)}</ul>
        </div>
      </div>

      <div className="uth-block uth-card">
        <div className="uth-toolbar">
          <h3 className="uth-h4" style={{ margin: 0 }}>Industry × function opportunity matrix <ClassBadge kind="inference" /></h3>
          <Seg label="Metric" value={metric} onChange={setMetric} options={[{ value: "adoption", label: "Adoption potential" }, { value: "intensity", label: "Competitive intensity" }, { value: "economics", label: "Usage economics" }]} />
        </div>
        <div className="uth-tablewrap">
          <table className="uth-table uth-heat" style={{ minWidth: 820 }}>
            <thead><tr><th>Function \ Industry</th>{m.industries.map((i) => <th key={i} style={{ textAlign: "center", whiteSpace: "normal" }}>{i}</th>)}</tr></thead>
            <tbody>{m.functions.map((f) => (
              <tr key={f}><td><strong>{f}</strong></td>{m.industries.map((i) => { const v = m.cells[`${f}|${i}`][metric]; return <td key={i} className="cell" style={{ background: heat(v), color: heatInk(v), cursor: "default" }} aria-label={`${f} in ${i}: ${v} of 3`}>{["", "Low", "Med", "High"][v]}</td>; })}</tr>
            ))}</tbody>
          </table>
        </div>
        <p className="uth-xs" style={{ marginTop: 8 }}>{m.note} Best entry points combine high adoption potential and usage economics with lower competitive intensity (e.g., R&D/science in life sciences; IT & security operations).</p>
      </div>

      <div className="uth-block uth-card">
        <h3 className="uth-h4">Signposts to monitor</h3>
        <div className="uth-tablewrap">
          <table className="uth-table">
            <thead><tr><th>Signal</th><th>Threshold</th><th>Why it matters</th></tr></thead>
            <tbody>{PLAYBOOK.signposts.map((s) => <tr key={s.signal}><td><strong>{s.signal}</strong></td><td>{s.threshold}</td><td>{s.why}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
