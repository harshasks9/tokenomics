"use client";

import { useState } from "react";
import { Recommendation } from "@/lib/finops/engine";
import { money, ms, pct, signed } from "@/lib/finops/format";
import { StatTile, TierChip } from "./primitives";

const KIND_LABEL: Record<Recommendation["kind"], string> = {
  substitution: "Model substitution",
  caching: "Prompt caching",
  batching: "Batch & off-peak",
  capacity: "Capacity rightsizing",
  routing: "Smart routing",
  prompt: "Prompt reduction",
};

export default function Opportunities({ recs }: { recs: Recommendation[] }) {
  const [open, setOpen] = useState<string | null>(recs[0]?.id ?? null);
  const [kindFilter, setKindFilter] = useState<Recommendation["kind"] | null>(null);

  const kinds = [...new Set(recs.map((r) => r.kind))];
  const shown = kindFilter ? recs.filter((r) => r.kind === kindFilter) : recs;
  const totalMonthly = recs.reduce((s, r) => s + r.monthlySavings, 0);
  const frontierMonthly = recs.filter((r) => !r.beyondFrontier).reduce((s, r) => s + r.monthlySavings, 0);
  const beyondMonthly = totalMonthly - frontierMonthly;

  return (
    <div className="fo-grid">
      <div className="fo-kpis" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <StatTile label="Identified savings" value={`${money(totalMonthly)}/mo`} delta={money(totalMonthly * 12)} deltaTone="down-good" note="annualized" />
        <StatTile label="Frontier gap closure" value={`${money(frontierMonthly)}/mo`} note="model, caching, batch, capacity" />
        <StatTile label="Beyond-frontier upside" value={`${money(beyondMonthly)}/mo`} note="routing & prompt engineering" />
        <StatTile label="Recommendations" value={`${recs.length}`} note={`across ${new Set(recs.map((r) => r.a.w.id)).size} workloads`} />
      </div>

      <div className="fo-filters" style={{ marginBottom: 0 }}>
        <span className="fo-filter-label">Lever</span>
        <button className="fo-chip" aria-pressed={kindFilter === null} onClick={() => setKindFilter(null)}>
          All
        </button>
        {kinds.map((k) => (
          <button key={k} className="fo-chip" aria-pressed={kindFilter === k} onClick={() => setKindFilter(kindFilter === k ? null : k)}>
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>

      <div>
        {shown.map((r, i) => {
          const isOpen = open === r.id;
          return (
            <div className="fo-opp" key={r.id}>
              <div
                className="fo-opp-head"
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : r.id)}
                onKeyDown={(e) => e.key === "Enter" && setOpen(isOpen ? null : r.id)}
              >
                <span className="fo-opp-rank">{i + 1}</span>
                <span>
                  <span className="fo-opp-title">{r.title}</span>
                  <span className="fo-opp-sub" style={{ display: "block" }}>
                    {r.a.w.name} · {r.a.w.bu} · {KIND_LABEL[r.kind]}
                    {r.beyondFrontier ? " · beyond-frontier" : ""}
                  </span>
                </span>
                <span className="hide-sm fo-opp-sub">{r.current} → {r.proposed}</span>
                <span className="fo-opp-save">
                  {money(r.monthlySavings)}<small>/mo · {money(r.monthlySavings * 12)}/yr</small>
                </span>
                <span className="hide-sm num" style={{ fontSize: 12, textAlign: "right", color: r.qualityDelta < 0 ? "var(--ink-2)" : "var(--delta-good)" }}>
                  {r.qualityDelta === 0 ? "quality flat" : `${signed(r.qualityDelta)} pts`}
                </span>
                <span className="hide-sm" style={{ textAlign: "right" }}>
                  <span className={`fo-badge effort-${r.effort}`}>{r.effort} effort</span>
                </span>
                <span className="hide-sm" style={{ textAlign: "right" }}>
                  <span className="fo-badge">{r.confidence} conf.</span>
                </span>
              </div>
              {isOpen && (
                <div className="fo-opp-body">
                  <div className="fo-opp-flow">
                    <span className="box">{r.current}</span>
                    <span className="arrow">→</span>
                    <span className="box">{r.proposed}</span>
                  </div>
                  <p style={{ margin: "8px 0" }}>{r.detail}</p>
                  <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 12 }}>
                    <span>Performance impact: <b style={{ color: "var(--ink)" }}>{r.qualityDelta === 0 ? "none (quality flat)" : `${signed(r.qualityDelta)} quality pts (floor ${r.a.w.qualityFloor})`}</b></span>
                    <span>Latency: <b style={{ color: "var(--ink)" }}>{r.ttftDelta === 0 ? "unchanged" : `${signed(r.ttftDelta, "ms")} TTFT (${ms(Math.abs(r.ttftDelta))} ${r.ttftDelta < 0 ? "faster" : "slower"})`}</b></span>
                    <span>Workload efficiency today: <b style={{ color: "var(--ink)" }}>{pct(r.a.efficiency)}</b></span>
                    <span><TierChip tier={r.a.tier} /></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
