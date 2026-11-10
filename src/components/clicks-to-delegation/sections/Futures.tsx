"use client";

import { useState } from "react";
import { FUTURES } from "@/lib/clicks-to-delegation/futures";
import type { Future } from "@/lib/clicks-to-delegation/types";
import { Ev, Section } from "../ui";

const CONF: Record<Future["confidence"], string> = { high: "Most likely through 2030", medium: "Plausible by early 2030s", low: "Possible, needs many prerequisites" };

export default function Futures() {
  const [fid, setFid] = useState<Future["id"]>("delegated");
  const f = FUTURES.find((x) => x.id === fid) ?? FUTURES[0];
  return (
    <Section id="futures" num="11" title="Three possible futures, 2027–2035"
      dek="Competing scenarios, not a forecast. Each has assumptions, leading indicators and conditions that would kill it. Tune the numbers in the scenario lab in section 03."
      takeaway={<>The <strong>Assistant Economy</strong> is the default path: it needs nothing that isn&apos;t already happening. The <strong>Delegated</strong> and <strong>Autonomous</strong> futures each need specific, observable events (published liability rules, measured repeat agent purchasing, data portability). Watch for those, not for model launches.</>}>
      <div className="ctd-futures-tabs" role="tablist" aria-label="Scenario">
        {FUTURES.map((x, i) => (
          <button key={x.id} type="button" role="tab" aria-selected={x.id === fid} onClick={() => setFid(x.id)} className={`ctd-future-tab f${i}`}>
            <span className="ctd-mono">Scenario {i + 1}</span><b>{x.name}</b><span className={`ctd-conf ${x.confidence}`}>{x.confidence} confidence</span>
          </button>
        ))}
      </div>
      <article className="ctd-future" aria-live="polite">
        <p className="ctd-future-q">{f.question}</p>
        <p className="ctd-future-sum">{f.summary}</p>
        <p className="ctd-small ctd-muted"><Ev kind="expert-judgment" /> Confidence: {f.confidence}. {CONF[f.confidence]}.</p>
        <div className="ctd-grid3 ctd-future-cols">
          <List title="Key assumptions" items={f.assumptions} />
          <List title="Prerequisites" items={f.prerequisites} />
          <List title="Early leading indicators" items={f.indicators} highlight />
          <List title="Potential catalysts" items={f.catalysts} />
          <List title="Constraints" items={f.constraints} />
          <List title="Events that would invalidate it" items={f.invalidators} warn />
        </div>
        <div className="ctd-grid2" style={{ marginTop: 16 }}>
          <div className="ctd-card"><span className="ctd-h4 good">Winners by business model</span><ul className="ctd-list">{f.winners.map((w) => <li key={w}>{w}</li>)}</ul></div>
          <div className="ctd-card"><span className="ctd-h4 bad">Losers by business model</span><ul className="ctd-list">{f.losers.map((w) => <li key={w}>{w}</li>)}</ul></div>
        </div>
        <div className="ctd-grid2 ctd-deep" style={{ marginTop: 16 }}>
          <div><span className="ctd-h4">Retailer profitability</span><p>{f.profitability}</p></div>
          <div><span className="ctd-h4">Consumer welfare</span><p>{f.welfare}</p></div>
        </div>
        <div className="ctd-grid4 ctd-deep" style={{ marginTop: 16 }}>
          {(["data", "marketing", "payments", "distribution"] as const).map((k) => <div key={k} className="ctd-card"><span className="ctd-h4">{k}</span><p className="ctd-small">{f.implications[k]}</p></div>)}
        </div>
      </article>
    </Section>
  );
}

function List({ title, items, highlight, warn }: { title: string; items: string[]; highlight?: boolean; warn?: boolean }) {
  return <div className={`ctd-flist ${highlight ? "hl" : ""} ${warn ? "warn" : ""}`}><span className="ctd-h4">{title}</span><ul className="ctd-list">{items.map((i) => <li key={i}>{i}</li>)}</ul></div>;
}
