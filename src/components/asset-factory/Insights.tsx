"use client";

import { Award, Info } from "lucide-react";
import type { AssetView } from "@/lib/asset-factory/views";
import { useFactory } from "./state";
import { Metric, SectionHead, Stars, TrustTag, TRUST, num, usd } from "./ui";

function Bar({ value, max, tone }: { value: number; max: number; tone?: "ok" | "bad" }) {
  return <div className={`af-bar ${tone ?? ""}`} style={{ minWidth: 80 }}><i style={{ width: `${max ? Math.max(2, (value / max) * 100) : 0}%` }} /></div>;
}

function CustomerRoi() {
  const { view, openAsset } = useFactory();
  if (!view) return null;
  const mine = view.workspaces.filter((w) => w.customer?.id === view.actor.person.org.id);
  const maxValue = Math.max(1, ...mine.map((w) => w.economics.valuePerMonth));
  const byId = new Map(view.assets.map((a) => [a.id, a]));
  return (
    <>
      <div className="af-page-head">
        <div style={{ flex: 1 }}>
          <div className="af-eyebrow">Consumption & ROI</div>
          <h1 className="af-h1">What your agents cost to run — and what they return</h1>
          <p className="af-lede">You pay for what your agents execute. Value scales with the same executions, so you can see cost and return side by side for every agent.</p>
        </div>
      </div>
      <div className="af-grid c5">{view.metrics.map((m) => <Metric key={m.id} m={m} />)}</div>
      <div className="af-section af-card">
        <SectionHead title="By agent" sub="modeled monthly figures" />
        <div className="af-table-wrap">
          <table className="af-table">
            <thead><tr><th>Agent</th><th>Status</th><th className="num">Executions</th><th className="num">Run cost</th><th className="num">Per run</th><th className="num">Value</th><th>Value vs cost</th><th className="num">ROI</th></tr></thead>
            <tbody>
              {mine.map((w) => (
                <tr key={w.id}>
                  <td><b>{w.name}</b><div className="af-muted" style={{ fontSize: 12 }}>{w.members.map((m) => m.person.org.name).filter((v, i, a) => a.indexOf(v) === i).join(" · ")}</div></td>
                  <td><span className={`af-tag ${w.activated ? "ok" : "warn"}`}>{w.activated ? "Live" : "Projected"}</span></td>
                  <td className="num">{num(w.economics.executionsPerMonth)}</td>
                  <td className="num">{usd(w.economics.consumptionPerMonth)}</td>
                  <td className="num">${w.economics.costPerExecution.toFixed(2)}</td>
                  <td className="num">{usd(w.economics.valuePerMonth)}</td>
                  <td style={{ minWidth: 140 }}><Bar value={w.economics.valuePerMonth} max={maxValue} tone="ok" /><div style={{ marginTop: 4 }}><Bar value={w.economics.consumptionPerMonth} max={maxValue} /></div></td>
                  <td className="num"><b>{w.economics.roi.toFixed(1)}×</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="af-muted" style={{ fontSize: 12, marginTop: 8 }}>Green: modeled value (planner time at a loaded rate, plus expedite freight avoided). Blue: modeled run cost (model consumption per execution plus continuous monitoring per plant). Synthetic figures.</p>
      </div>
      {view.recommendedNext.length > 0 && (
        <div className="af-section">
          <SectionHead title="Where else this pays off" sub="Agents that reuse what you already run" />
          <div className="af-grid c3">
            {view.recommendedNext.map((r) => byId.get(r.assetId) && (
              <button key={r.assetId} type="button" className="af-asset" onClick={() => openAsset(r.assetId)}>
                <b>{byId.get(r.assetId)!.name}</b>
                <span className="af-asset-sum">{r.reason}</span>
                <TrustTag t={byId.get(r.assetId)!.trust} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function GoogleReuse() {
  const { view, openAsset } = useFactory();
  if (!view) return null;
  const pub = view.assets.filter((a) => a.visibility === "public");
  const top = [...pub].sort((a, b) => b.deployments - a.deployments).slice(0, 10);
  const max = Math.max(1, ...top.map((a) => a.deployments));
  const byKind = (["google", "partner", "customer"] as const).map((k) => ({
    k, label: k === "google" ? "Google" : k === "partner" ? "Partners" : "Customers",
    assets: pub.filter((a) => (a.owner?.kind ?? "customer") === k),
  }));
  const totalDeploy = pub.reduce((s, a) => s + a.deployments, 0);
  const candidates: AssetView[] = pub.filter((a) => a.trust !== "verified" && a.deployments >= 7).sort((a, b) => b.deployments - a.deployments);
  const live = view.workspaces.filter((w) => w.activated);
  return (
    <>
      <div className="af-page-head"><div style={{ flex: 1 }}>
        <div className="af-eyebrow">Reuse intelligence</div>
        <h1 className="af-h1">What gets reused, by whom, and how fast it ships</h1>
        <p className="af-lede">Aggregate reuse across the public catalog and your engagements. Use it to start engagements from proven IP and to nominate community assets for verification.</p>
      </div></div>
      <div className="af-grid c5">{view.metrics.filter((m) => !m.internal).map((m) => <Metric key={m.id} m={m} />)}</div>
      <div className="af-section af-split">
        <div className="af-card">
          <SectionHead title="Most reused assets" sub="production deployments" />
          <table className="af-table"><tbody>
            {top.map((a) => (
              <tr key={a.id}>
                <td><button type="button" className="af-btn ghost" style={{ padding: 0, fontWeight: 580 }} onClick={() => openAsset(a.id)}>{a.name}</button><div className="af-muted" style={{ fontSize: 12 }}>{a.ownerLabel}</div></td>
                <td><TrustTag t={a.trust} /></td>
                <td style={{ width: "30%" }}><Bar value={a.deployments} max={max} /></td>
                <td className="num"><b>{a.deployments}</b></td>
              </tr>
            ))}
          </tbody></table>
        </div>
        <div className="af-stack">
          <div className="af-card">
            <SectionHead title="Who the reused IP comes from" />
            {byKind.map((b) => {
              const d = b.assets.reduce((s, a) => s + a.deployments, 0);
              return (
                <div key={b.k} style={{ marginBottom: 10 }}>
                  <div className="af-row between" style={{ fontSize: 13 }}><span>{b.label} · {b.assets.length} assets</span><b>{Math.round((d / Math.max(1, totalDeploy)) * 100)}%</b></div>
                  <Bar value={d} max={totalDeploy} />
                </div>
              );
            })}
          </div>
          <div className="af-card">
            <SectionHead title="Deployment velocity" sub="days to production" />
            {live.map((w) => (
              <div key={w.id} style={{ marginBottom: 10 }}>
                <div className="af-row between" style={{ fontSize: 13 }}><span>{w.name} · {w.customer?.name}</span><b>{w.daysToActivate} days</b></div>
                <Bar value={w.daysToActivate ?? 0} max={60} tone="ok" />
              </div>
            ))}
            <p className="af-muted" style={{ fontSize: 12 }}>Scale: 60-day from-scratch build.</p>
          </div>
        </div>
      </div>
      <div className="af-section af-card">
        <SectionHead title="Nominate for verification" sub="community and field-validated assets with real production use" />
        <div className="af-banner info" style={{ marginBottom: 10 }}><Award size={15} /><div>{TRUST.verified.help} Field validation is earned from engagement data; verification is a separate, explicit Google decision.</div></div>
        <table className="af-table"><thead><tr><th>Asset</th><th>Contributor</th><th>Tier</th><th className="num">Deployments</th><th>Rating</th></tr></thead><tbody>
          {candidates.map((a) => <tr key={a.id}><td><button type="button" className="af-btn ghost" style={{ padding: 0 }} onClick={() => openAsset(a.id)}>{a.name}</button></td><td>{a.ownerLabel}</td><td><TrustTag t={a.trust} /></td><td className="num">{a.deployments}</td><td><Stars rating={a.rating} count={a.ratingCount} /></td></tr>)}
        </tbody></table>
      </div>
    </>
  );
}

function PartnerAnalytics() {
  const { view, openAsset } = useFactory();
  if (!view) return null;
  const mine = view.assets.filter((a) => a.mine);
  const max = Math.max(1, ...mine.map((a) => a.deployments));
  return (
    <>
      <div className="af-page-head"><div style={{ flex: 1 }}>
        <div className="af-eyebrow">Contribution analytics</div>
        <h1 className="af-h1">How {view.actor.person.org.name}&apos;s IP is being adopted</h1>
        <p className="af-lede">Deployments, forks and community reviews of your published assets — and the delivery efficiency they buy you on customer projects.</p>
      </div></div>
      <div className="af-grid c5">{view.metrics.map((m) => <Metric key={m.id} m={m} />)}</div>
      <div className="af-section af-card">
        <SectionHead title="Your assets" />
        <div className="af-table-wrap"><table className="af-table">
          <thead><tr><th>Asset</th><th>Visibility</th><th>Tier</th><th>Adoption</th><th className="num">Deployments</th><th className="num">Forks</th><th>Rating</th></tr></thead>
          <tbody>
            {mine.sort((a, b) => b.deployments - a.deployments).map((a) => (
              <tr key={a.id}>
                <td><button type="button" className="af-btn ghost" style={{ padding: 0, fontWeight: 580 }} onClick={() => openAsset(a.id)}>{a.name}</button><div className="af-muted" style={{ fontSize: 12 }}>v{a.version} · {a.type}</div></td>
                <td>{a.visibility === "public" ? <span className="af-tag v-public">Public</span> : <span className="af-tag v-org">Private</span>}</td>
                <td><TrustTag t={a.trust} /></td>
                <td style={{ minWidth: 120 }}><Bar value={a.deployments} max={max} /></td>
                <td className="num">{a.deployments}</td>
                <td className="num">{a.forks}</td>
                <td><Stars rating={a.rating} count={a.ratingCount} /></td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <div className="af-banner" style={{ marginTop: 12 }}><Info size={15} /><div>Partner metrics show adoption of your own IP and your delivery outcomes. Google&apos;s internal consumption and revenue figures are not part of the partner view.</div></div>
      </div>
    </>
  );
}

export default function Insights() {
  const { persona } = useFactory();
  if (persona === "customer") return <CustomerRoi />;
  if (persona === "google") return <GoogleReuse />;
  return <PartnerAnalytics />;
}
