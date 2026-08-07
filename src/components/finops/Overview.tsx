"use client";

import { Cloud } from "@/lib/finops/catalog";
import {
  Assessment,
  DAILY_BY_CLOUD,
  Recommendation,
  TIER_META,
  Tier,
  portfolio,
} from "@/lib/finops/engine";
import { money, moneyFull, num, pct, perMTok } from "@/lib/finops/format";
import { StatTile, TierChip } from "./primitives";
import SpendTrend from "./SpendTrend";
import Waterfall from "./Waterfall";
import WorkloadTable from "./WorkloadTable";

const TIER_COLOR: Record<Tier, string> = {
  frontier: "var(--good)",
  near: "var(--warn)",
  opportunity: "var(--serious)",
  severe: "var(--critical)",
};

export default function Overview({
  items,
  recs,
  clouds,
  onGoToOpportunities,
}: {
  items: Assessment[];
  recs: Recommendation[];
  clouds: Cloud[];
  onGoToOpportunities: () => void;
}) {
  const p = portfolio(items);

  // Spend delta: second half of the 30-day window vs first half.
  const totals = new Array(30).fill(0);
  DAILY_BY_CLOUD.filter((d) => clouds.includes(d.cloud)).forEach((d) =>
    d.days.forEach((v, i) => (totals[i] += v)),
  );
  const firstHalf = totals.slice(0, 15).reduce((a, b) => a + b, 0);
  const secondHalf = totals.slice(15).reduce((a, b) => a + b, 0);
  const spendDelta = (secondHalf - firstHalf) / firstHalf;

  const frontierSpend = p.monthlySpend - p.monthlyGap;
  const tiers = Object.keys(TIER_META) as Tier[];

  return (
    <div className="fo-grid">
      {/* hero */}
      <div className="fo-card">
        <div className="fo-hero">
          <div>
            <div className="fo-hero-num">
              {p.score}
              <small> / 100</small>
            </div>
            <div className="fo-hero-label">Pareto Efficiency Score</div>
            <div className="fo-meter" role="img" aria-label={`Pareto efficiency score ${p.score} out of 100`}>
              <div style={{ width: `${p.score}%` }} />
            </div>
            <div className="fo-meter-scale"><span>0</span><span>50</span><span>100</span></div>
          </div>
          <div>
            <p style={{ fontSize: 16, lineHeight: 1.55, margin: 0, maxWidth: "58ch" }}>
              Your AI estate is <strong>{p.score}% efficient</strong> —{" "}
              <strong>{money(p.annualGap)}</strong> of annualized spend sits behind the
              Pareto frontier. The same workloads, at the same quality floors and latency
              SLAs, could run for <strong>{money(frontierSpend)}/mo</strong> instead of{" "}
              <strong>{money(p.monthlySpend)}/mo</strong>.
            </p>
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 14 }}>
              {tiers.map((t) => (
                <span key={t} className="fo-legend-item" style={{ fontSize: 11.5, color: "var(--ink-2)", marginRight: 10 }}>
                  <span className="fo-dot" style={{ background: TIER_COLOR[t] }} />
                  {TIER_META[t].label} <b style={{ color: "var(--ink)" }}>{p.tierCount[t]}</b>
                  <span style={{ color: "var(--muted)" }}>({money(p.tierSpend[t])})</span>
                </span>
              ))}
            </div>
            {/* spend-by-tier bar with 2px surface gaps */}
            <div style={{ display: "flex", gap: 2, height: 10, borderRadius: 999, overflow: "hidden", marginTop: 8, maxWidth: 560 }}
              role="img" aria-label={`Monthly spend by tier: ${tiers.map((t) => `${TIER_META[t].label} ${moneyFull(p.tierSpend[t])}`).join(", ")}`}>
              {tiers.map((t) =>
                p.tierSpend[t] > 0 ? (
                  <div key={t} style={{ background: TIER_COLOR[t], width: `${(p.tierSpend[t] / p.monthlySpend) * 100}%` }} />
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="fo-kpis">
        <StatTile
          label="AI spend (30 days)"
          value={money(p.monthlySpend)}
          delta={`${spendDelta >= 0 ? "+" : ""}${pct(spendDelta, 1)}`}
          deltaTone={spendDelta > 0.005 ? "up-bad" : "down-good"}
          note="vs prior 15 days"
          spark={totals}
        />
        <StatTile label="Savings opportunity" value={`${money(p.monthlyGap)}/mo`} delta={money(p.annualGap)} deltaTone="down-good" note="annualized" />
        <StatTile label="Tokens processed" value={num(p.tokens)} note={`${num(p.requests)} requests`} />
        <StatTile label="Effective $/1M tokens" value={perMTok(p.effPerMTok)} note="blended, all clouds" />
        <StatTile label="Model deployments" value={`${p.deployments}`} note={`across ${p.clouds} clouds`} />
        <StatTile label="Cache hit rate" value={pct(p.cacheHitBlended)} note="of input tokens" />
        <StatTile label="Batch-priced traffic" value={pct(p.batchShareBlended)} note="of spend" />
      </div>

      <div className="fo-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))" }}>
        <SpendTrend clouds={clouds} />
        <Waterfall monthlySpend={p.monthlySpend} frontierSpend={frontierSpend} />
      </div>

      {/* top opportunities preview */}
      <div className="fo-card">
        <div className="fo-card-head">
          <span className="fo-card-title">Biggest Pareto gaps</span>
          <span className="fo-card-sub">Top 5 recommendations by economic impact</span>
          <span className="fo-card-right">
            <button className="fo-chip" onClick={onGoToOpportunities}>
              View all {recs.length} →
            </button>
          </span>
        </div>
        <div className="fo-tablewrap">
          <table className="fo-table">
            <thead>
              <tr>
                <th>Recommendation</th>
                <th>Workload</th>
                <th className="num">Savings/mo</th>
                <th className="num">Annualized</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {recs.slice(0, 5).map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="fo-cell-main">{r.title}</div>
                    <div className="fo-cell-sub">{r.current} → {r.proposed}</div>
                  </td>
                  <td>
                    <div className="fo-cell-main">{r.a.w.name}</div>
                    <div className="fo-cell-sub">{r.a.w.bu}</div>
                  </td>
                  <td className="num"><b>{money(r.monthlySavings)}</b></td>
                  <td className="num">{money(r.monthlySavings * 12)}</td>
                  <td><TierChip tier={r.a.tier} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <WorkloadTable items={items} compact />
    </div>
  );
}
