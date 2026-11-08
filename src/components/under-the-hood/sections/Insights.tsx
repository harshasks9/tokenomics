"use client";

import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import { INSIGHTS, THESES, type Insight } from "@/lib/under-the-hood/data";
import { Cite, ConfBadge, Ext, Section } from "../ui";

function Card({ it, n }: { it: Insight; n: number }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="uth-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--serif)", fontSize: 26, color: "var(--accent)", lineHeight: 1 }}>{String(n).padStart(2, "0")}</span>
        <ConfBadge level={it.confidence} />
      </div>
      <h3 className="uth-h3" style={{ fontSize: 20 }}>{it.headline}</h3>
      <ul className="uth-list" style={{ fontSize: 14 }}>{it.evidence.map((e, i) => <li key={i}><span>{e}</span></li>)}</ul>
      <div>{it.evidenceIds.map((id) => <Cite key={id} id={id} />)}{it.links.map((l) => <span key={l} style={{ marginLeft: 6, fontSize: 12 }}><Ext href={l}>{new URL(l).hostname.replace("www.", "")}</Ext></span>)}</div>
      <button type="button" className="uth-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)} style={{ alignSelf: "flex-start" }}>
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform .15s" }} aria-hidden /> {open ? "Hide analysis" : "Why it matters · alternatives · what to watch"}
      </button>
      {open && (
        <dl className="uth-kv" style={{ gridTemplateColumns: "130px 1fr" }}>
          <dt>Why it matters</dt><dd>{it.whyItMatters}</dd>
          <dt>What is surprising</dt><dd>{it.whatIsSurprising}</dd>
          <dt>Competitive implication</dt><dd>{it.competitiveImplication}</dd>
          <dt>Alternative explanation</dt><dd>{it.alternativeExplanation}</dd>
          <dt>What to watch</dt><dd>{it.whatToWatch}</dd>
        </dl>
      )}
    </article>
  );
}

function Grid({ items, start = 1 }: { items: Insight[]; start?: number }) {
  return <div className="uth-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>{items.map((it, i) => <Card key={it.id} it={it} n={start + i} />)}</div>;
}

export function Surprises() {
  const s = INSIGHTS.filter((i) => i.kind === "surprising");
  return <Section id="surprises"><Grid items={s} /></Section>;
}

export function Confirmations() {
  const u = INSIGHTS.filter((i) => i.kind === "unsurprising");
  const d = INSIGHTS.filter((i) => i.kind === "underappreciated");
  const c = INSIGHTS.filter((i) => i.kind === "contradiction");
  const nS = INSIGHTS.filter((i) => i.kind === "surprising").length;
  const [th, setTh] = useState(THESES[0].id);
  const t = THESES.find((x) => x.id === th)!;
  return (
    <Section id="confirmations">
      <h3 className="uth-h4">Expected — and now quantified</h3>
      <Grid items={u} start={nS + 1} />
      <h3 className="uth-h4 uth-block">Underappreciated implications</h3>
      <Grid items={d} start={nS + u.length + 1} />
      <h3 className="uth-h4 uth-block">Contradictions and tensions</h3>
      <Grid items={c} start={nS + u.length + d.length + 1} />

      <div className="uth-block uth-card">
        <h3 className="uth-h4">Ten industry theses, tested against the filing</h3>
        <div className="uth-chips" role="tablist" aria-label="Theses">
          {THESES.map((x, i) => <button key={x.id} type="button" role="tab" className="uth-chip" aria-selected={th === x.id} onClick={() => setTh(x.id)}>{i + 1}. {x.title}</button>)}
        </div>
        <div style={{ marginTop: 16 }} role="tabpanel" aria-live="polite">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><h4 className="uth-h3" style={{ margin: 0 }}>{t.title}</h4><span className="uth-badge neutral" style={{ whiteSpace: "normal" }}>Verdict: {t.verdict}</span><ConfBadge level={t.confidence} /></div>
          <div className="uth-grid uth-g2" style={{ marginTop: 12 }}>
            <div className="uth-card sunk"><h5 className="uth-h4" style={{ color: "var(--good)" }}>Evidence for</h5><ul className="uth-list plus" style={{ fontSize: 14 }}>{t.support.map((s, i) => <li key={i}><span>{s}</span></li>)}</ul></div>
            <div className="uth-card sunk"><h5 className="uth-h4" style={{ color: "var(--bad)" }}>Evidence against</h5><ul className="uth-list minus" style={{ fontSize: 14 }}>{t.contra.map((s, i) => <li key={i}><span>{s}</span></li>)}</ul></div>
          </div>
          <dl className="uth-kv" style={{ marginTop: 14 }}>
            <dt>Industry implication</dt><dd>{t.industry}</dd>
            <dt>Anthropic</dt><dd>{t.anthropic}</dd>
            {Object.entries(t.players).map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}
            <dt>Falsifiable prediction</dt><dd><strong style={{ color: "var(--ink)" }}>{t.prediction}</strong></dd>
          </dl>
        </div>
      </div>
    </Section>
  );
}
