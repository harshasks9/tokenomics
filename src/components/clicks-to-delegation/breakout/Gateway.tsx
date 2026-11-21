"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import { GATEWAY_AS_OF, GATEWAY_CAVEATS, GATEWAY_FLOW, GATEWAY_MAP, GATEWAY_TAKEAWAYS, WALMART_CONTEXT, WALMART_PIECES } from "@/lib/clicks-to-delegation/gateway";
import { Cite, Ev } from "../ui";

export default function Gateway({ onPresent }: { onPresent: () => void }) {
  return (
    <div className="ctd-gw">
      <div className="ctd-gw-intro">
        <div>
          <div className="ctd-kicker">Reference pattern · as of {GATEWAY_AS_OF}</div>
          <h2 className="ctd-gw-h">Walmart&apos;s Agent Gateway, and the stack behind the pattern</h2>
          <p className="ctd-sec-dek" style={{ gridColumn: "auto" }}>On 21 October 2026 Walmart opened a front door for other companies&apos; shopping agents, on Walmart&apos;s terms. It is the clearest public example so far of a merchant staying in control while agents shop.</p>
        </div>
        <button type="button" className="ctd-btn" onClick={onPresent}>Show as backup slide <ArrowRight size={14} /></button>
      </div>

      <div className="ctd-gw-warn"><AlertTriangle size={16} /><p><b>Read this first.</b> Walmart has not said what the gateway or Sparky run on, and it operates across several clouds. The Google mapping below is our illustration of how the same pattern would be assembled, not a description of Walmart&apos;s build.</p></div>

      <h3 className="ctd-h3">What Walmart announced</h3>
      <div className="ctd-grid3" style={{ marginTop: 12 }}>
        {WALMART_PIECES.map((p) => (
          <div key={p.name} className="ctd-card ctd-gw-piece">
            <b>{p.name}</b>
            <p>{p.what}<Cite ids={p.sourceIds} /></p>
            <span className="ctd-gw-status">{p.status}</span>
          </div>
        ))}
      </div>
      <ul className="ctd-list ctd-gw-context">
        {WALMART_CONTEXT.map((c) => <li key={c.text}>{c.text}<Cite ids={c.sourceIds} /></li>)}
      </ul>

      <h3 className="ctd-h3" style={{ marginTop: 32 }}>How the pattern maps to Google&apos;s stack</h3>
      <p className="ctd-small ctd-muted" style={{ margin: "4px 0 12px" }}>Each row: the capability, what Walmart&apos;s design does, and the Google components that would provide it. <Ev kind="expert-judgment" /></p>
      <div className="ctd-gw-map">
        {GATEWAY_MAP.map((c, i) => (
          <div key={c.id} className="ctd-gw-row">
            <div className="ctd-gw-cap"><span className="ctd-mono">{i + 1}</span><b>{c.capability}</b></div>
            <div className="ctd-gw-wal"><span className="ctd-h4">Walmart&apos;s design</span><p>{c.walmart}</p></div>
            <div className="ctd-gw-goog">
              <span className="ctd-h4">Google components</span>
              <ul>
                {c.google.map((g) => (
                  <li key={g.name}><b>{g.name}</b>{g.status && <span className="ctd-gw-tag">{g.status}</span>}<span>{g.role}</span></li>
                ))}
              </ul>
              {c.note && <p className="ctd-small ctd-muted">{c.note}</p>}
              <p className="ctd-small ctd-muted">Sources<Cite ids={c.sourceIds} /></p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="ctd-h3" style={{ marginTop: 32 }}>One agent-placed order, end to end</h3>
      <ol className="ctd-gw-flow">
        {GATEWAY_FLOW.map((f, i) => (
          <li key={f.step}>
            <span className="ctd-mono">{i + 1}</span>
            <b>{f.step}</b>
            <span>{f.who}</span>
            <em>{f.component}</em>
          </li>
        ))}
      </ol>

      <div className="ctd-grid2" style={{ marginTop: 32 }}>
        <div className="ctd-card">
          <div className="ctd-h4">What we take from the design</div>
          <ul className="ctd-list">{GATEWAY_TAKEAWAYS.map((t) => <li key={t.head}><b>{t.head}.</b> {t.text}</li>)}</ul>
        </div>
        <div className="ctd-card">
          <div className="ctd-h4">What we could not confirm</div>
          <ul className="ctd-list">{GATEWAY_CAVEATS.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
