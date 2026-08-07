"use client";

import { useMemo, useState } from "react";
import { cloudLabel } from "@/lib/finops/catalog";
import {
  Assessment,
  SCENARIOS,
  ScenarioId,
  runScenario,
} from "@/lib/finops/engine";
import { money, moneyFull, ms, pct, signed } from "@/lib/finops/format";
import { TierChip } from "./primitives";

export default function Simulator({ items }: { items: Assessment[] }) {
  const [scenario, setScenario] = useState<ScenarioId>("balanced");
  const [selected, setSelected] = useState<Set<string>>(() => new Set(items.map((a) => a.w.id)));
  const [openMove, setOpenMove] = useState<string | null>(null);

  const active = items.filter((a) => selected.has(a.w.id));
  const result = useMemo(
    () => (active.length ? runScenario(scenario, active) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario, items, [...selected].sort().join(",")],
  );

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const savings = result ? result.costNow - result.costAfter : 0;

  return (
    <div className="fo-grid">
      <div className="fo-scenarios" role="group" aria-label="Migration scenario">
        {SCENARIOS.map((s) => (
          <button key={s.id} className="fo-scenario" aria-pressed={scenario === s.id} onClick={() => setScenario(s.id)}>
            <b>{s.label}</b>
            <span>{s.desc}</span>
          </button>
        ))}
      </div>

      <div className="fo-sim-grid">
        {/* moves table */}
        <div className="fo-card">
          <div className="fo-card-head">
            <span className="fo-card-title">Simulated moves</span>
            <span className="fo-card-sub">{active.length} of {items.length} workloads in scope</span>
            <span className="fo-card-right">
              <button className="fo-chip" onClick={() => setSelected(new Set(items.map((a) => a.w.id)))}>All</button>
              <button className="fo-chip" onClick={() => setSelected(new Set(items.filter((a) => a.tier === "severe" || a.tier === "opportunity").map((a) => a.w.id)))}>
                Inefficient only
              </button>
              <button className="fo-chip" onClick={() => setSelected(new Set())}>None</button>
            </span>
          </div>
          <div className="fo-tablewrap">
            <table className="fo-table">
              <thead>
                <tr>
                  <th aria-label="In scope" />
                  <th>Workload</th>
                  <th>Current → Proposed</th>
                  <th className="num">Δ Cost/mo</th>
                  <th className="num">Δ Quality</th>
                  <th>Effort</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => {
                  const move = result?.moves.find((m) => m.a.w.id === a.w.id);
                  const inScope = selected.has(a.w.id);
                  const delta = move ? move.to.monthly - a.current.monthly : 0;
                  const isOpen = openMove === a.w.id;
                  return (
                    <tr key={a.w.id} className="clickable" onClick={() => setOpenMove(isOpen ? null : a.w.id)}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={inScope}
                          onChange={() => toggle(a.w.id)}
                          aria-label={`Include ${a.w.name} in simulation`}
                        />
                      </td>
                      <td>
                        <div className="fo-cell-main">{a.w.name}</div>
                        <div className="fo-cell-sub"><TierChip tier={a.tier} /></div>
                      </td>
                      <td>
                        {inScope && move ? (
                          <>
                            <div className="fo-cell-main" style={{ whiteSpace: "normal" }}>
                              {a.model.name} · {cloudLabel(a.w.cloud)}
                              <span style={{ color: "var(--muted)" }}> → </span>
                              {move.to.model.name} · {cloudLabel(move.to.cloud)}
                            </div>
                            {isOpen && move.risks.length > 0 && (
                              <ul className="fo-risklist">
                                {move.risks.map((r) => <li key={r}>{r}</li>)}
                              </ul>
                            )}
                            {isOpen && move.risks.length === 0 && (
                              <div className="fo-cell-sub">No material migration risks — lever changes only.</div>
                            )}
                            {!isOpen && move.risks.length > 0 && (
                              <div className="fo-cell-sub">{move.risks.length} risk{move.risks.length > 1 ? "s" : ""} — click to expand</div>
                            )}
                          </>
                        ) : (
                          <span className="fo-cell-sub">excluded</span>
                        )}
                      </td>
                      <td className="num" style={{ color: delta < -100 ? "var(--delta-good)" : "var(--ink-2)", fontWeight: 600 }}>
                        {inScope && move ? (delta < -100 ? money(delta) : "—") : ""}
                      </td>
                      <td className="num">
                        {inScope && move ? (move.to.model.quality === a.model.quality ? "flat" : signed(move.to.model.quality - a.model.quality)) : ""}
                      </td>
                      <td>{inScope && move && move.to.model.id !== a.model.id ? <span className={`fo-badge effort-${move.effort}`}>{move.effort}</span> : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* results panel */}
        <div className="fo-card">
          <div className="fo-card-head">
            <span className="fo-card-title">Scenario result</span>
            <span className="fo-card-sub">{SCENARIOS.find((s) => s.id === scenario)!.label}</span>
          </div>
          {!result ? (
            <div className="fo-detail-empty">Select at least one workload to simulate.</div>
          ) : (
            <>
              <div className="fo-bigdelta" style={{ color: savings > 0 ? "var(--delta-good)" : "var(--ink)" }}>
                {savings > 0 ? "−" : ""}{money(Math.abs(savings))}/mo
                <small>{money(Math.abs(savings) * 12)} annualized</small>
              </div>
              {/* before/after cost meter */}
              <div style={{ marginTop: 14 }}>
                <div className="fo-note" style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Current {moneyFull(result.costNow)}/mo</span>
                  <span>Proposed {moneyFull(result.costAfter)}/mo</span>
                </div>
                <div className="fo-meter" style={{ maxWidth: "none", marginTop: 6 }}>
                  <div style={{ width: `${(result.costAfter / result.costNow) * 100}%` }} />
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div className="fo-kv"><span>Quality (spend-weighted)</span><b className={result.qualityAfter >= result.qualityNow ? "pos" : ""}>{result.qualityNow.toFixed(1)} → {result.qualityAfter.toFixed(1)}</b></div>
                <div className="fo-kv"><span>TTFT (request-weighted)</span><b className={result.ttftAfter <= result.ttftNow ? "pos" : ""}>{ms(result.ttftNow)} → {ms(result.ttftAfter)}</b></div>
                <div className="fo-kv"><span>Workloads migrated</span><b>{result.moves.filter((m) => m.to.model.id !== m.a.model.id).length} of {result.moves.length}</b></div>
                <div className="fo-kv"><span>One-time migration cost</span><b>{money(result.oneTimeCost)}</b></div>
                <div className="fo-kv"><span>Payback period</span><b>{result.paybackMonths === Infinity ? "n/a" : `${result.paybackMonths < 1 ? "<1" : result.paybackMonths.toFixed(1)} months`}</b></div>
                <div className="fo-kv"><span>Year-1 ROI</span><b className={result.roiPct > 0 ? "pos" : "neg"}>{Math.round(result.roiPct).toLocaleString("en-US")}%</b></div>
                <div className="fo-kv"><span>New effective $/1M tokens</span><b>{pct(result.costAfter / result.costNow)} of today&apos;s</b></div>
              </div>
              <p className="fo-note" style={{ marginTop: 12 }}>
                Quality changes always respect each workload&apos;s eval floor; migrations assume a
                canary rollout with eval-suite sign-off before full cutover.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
