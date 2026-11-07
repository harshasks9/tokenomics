"use client";

import { ShieldCheck } from "lucide-react";
import { LIFECYCLE } from "@/lib/asset-factory/journey";
import { useFactory } from "./state";
import { Metric, SectionHead, usd } from "./ui";

/** Google-only. The server omits `gtm` and internal metrics for every other persona. */
export default function Gtm() {
  const { view, openWorkspace, setTab } = useFactory();
  if (!view) return null;
  if (!view.gtm) return <div className="af-empty">Not available.</div>;
  const g = view.gtm;
  const pipeline = g.pipeline.reduce((s, p) => s + p.incrementalPerMonth, 0);
  return (
    <div>
      <div className="af-page-head"><div style={{ flex: 1 }}>
        <div className="af-eyebrow">GTM metrics</div>
        <h1 className="af-h1">Recurring consumption across your engagements</h1>
        <p className="af-lede">Activation turns into recurring agent execution; recurring execution is the consumption motion. These figures exist only in the Google view.</p>
      </div></div>
      <div className="af-banner internal" style={{ marginBottom: 16 }}><ShieldCheck size={16} /><div><b>Google internal.</b> The API returns this section only to signed-in Google employees. Customer and partner responses contain no revenue projections, account strategy or targets — check the network tab while switching personas.</div></div>
      <div className="af-grid c3">
        {view.metrics.filter((m) => m.internal).map((m) => <Metric key={m.id} m={m} />)}
        <Metric m={{ id: "pipe", label: "Expansion pipeline", value: `${usd(pipeline)}/mo`, sub: `${g.pipeline.length} adjacent agents on live stacks`, internal: true }} />
      </div>
      <div className="af-section af-card">
        <SectionHead title="Engagement portfolio" />
        <div className="af-table-wrap"><table className="af-table">
          <thead><tr><th>Engagement</th><th>Customer</th><th>Stage</th><th className="num">Consumption / mo</th><th className="num">Annualized</th></tr></thead>
          <tbody>
            {g.portfolio.map((p) => (
              <tr key={p.id}>
                <td><button type="button" className="af-btn ghost" style={{ padding: 0, fontWeight: 580 }} onClick={() => { openWorkspace(p.id); setTab("workspaces"); }}>{p.name}</button></td>
                <td>{p.customer}</td>
                <td><span className={`af-tag ${p.activated ? "ok" : "warn"}`}>{LIFECYCLE[Math.min(p.stage, LIFECYCLE.length - 1)].label}</span></td>
                <td className="num">{p.activated ? usd(p.consumptionPerMonth) : <span className="af-muted">projected {usd(p.annualized / 12)}</span>}</td>
                <td className="num">{usd(p.annualized)}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
      <div className="af-section af-card">
        <SectionHead title="Expansion opportunities" sub="adjacent agents that reuse live connectors and data" />
        <table className="af-table">
          <thead><tr><th>Account</th><th>Opportunity</th><th>Why</th><th className="num">Modeled / mo</th></tr></thead>
          <tbody>{g.pipeline.map((p) => <tr key={`${p.account}-${p.opportunity}`}><td>{p.account}</td><td><b>{p.opportunity}</b></td><td className="af-muted">{p.basis}</td><td className="num">{usd(p.incrementalPerMonth)}</td></tr>)}</tbody>
        </table>
        <p className="af-muted" style={{ fontSize: 12, marginTop: 8 }}>Customers see the same opportunities as “recommended next agents”, framed by their own outcomes — never by these figures.</p>
      </div>
    </div>
  );
}
