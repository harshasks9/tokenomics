"use client";

import { useState } from "react";
import {
  CASE_IDS,
  CASE_LABEL,
  COMMITMENT,
  SCENARIO_IDS,
  SCENARIO_LABEL,
  SENS_DELAYS,
  SENS_MULTS,
  compareScenarios,
  sensitivity,
  type CaseId,
  type Inputs,
  type ScenarioId,
} from "@/lib/mdes/engine";
import { exactUsd, exactUsers, month, pct, usd, users } from "@/lib/mdes/format";

const SCENARIO_NOTE: Record<ScenarioId, string> = {
  baseline: "Ordered quantities as signed; 12 months; no GCP; no extension.",
  ramp: "Billed users follow the modelled ramp for 12 months. Re-basing the order schedule needs an amendment.",
  rampGcp: "Ramp plus eligible GCP spend counted toward the commitment (proposed).",
  rampExt: "Ramp with the spending window extended to at least 18 months (proposed).",
  combined: "Ramp, GCP allocation and extension together (proposed).",
};

export default function Scenarios({ inputs }: { inputs: Inputs }) {
  const [c, setCase] = useState<CaseId>("base");
  const cmp = compareScenarios(inputs);
  const grid = sensitivity(inputs);
  const rows = cmp[c];

  return (
    <>
      <section className="mg-card">
        <div className="mg-headrow">
          <h2>Scenario comparison</h2>
          <div className="mg-seg" role="tablist" aria-label="Adoption case">
            {CASE_IDS.map((id) => (
              <button key={id} type="button" role="tab" aria-selected={c === id} onClick={() => setCase(id)}>{CASE_LABEL[id]}</button>
            ))}
          </div>
        </div>
        <p className="mg-hint">
          {c === "base" ? "Base = the ramp in the assumptions panel." : `${CASE_LABEL[c]}: users × ${Math.round(inputs.cases[c].mult * 100)}%, launch shifted ${inputs.cases[c].delay} month${inputs.cases[c].delay === 1 ? "" : "s"}.`}
          {" "}Baseline is always the Order Form as signed. The others are proposals layered on the modelled ramp.
        </p>
        <div className="mg-tablewrap">
          <table className="mg-table cmp">
            <thead>
              <tr>
                <th>Scenario</th>
                <th className="num">Window</th>
                <th className="num">M12 billed</th>
                <th className="num">GE spend</th>
                <th className="num">GCP counted</th>
                <th className="num">Consumption</th>
                <th className="num">Utilization</th>
                <th className="num">Unconsumed</th>
                <th className="num">Above</th>
                <th className="num">Completed</th>
                <th>Needs approval</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIO_IDS.map((s) => {
                const x = rows[s];
                return (
                  <tr key={s} className={s === "baseline" ? "base" : undefined}>
                    <td className="mo"><b>{SCENARIO_LABEL[s]}</b><span className="cal">{SCENARIO_NOTE[s]}</span></td>
                    <td className="num">{x.window} mo</td>
                    <td className="num" title={`${exactUsers(x.m12Billed)} billed · ${exactUsers(x.m12Adoption)} adopted`}>
                      {users(x.m12Billed)} <span className={`mg-dot ${x.m12Met ? "good" : "bad"}`} title={x.m12Met ? "650K met" : "below 650K"} />
                      {s === "baseline" && x.m12Adoption < x.m12Billed && <span className="cal">adopted {users(x.m12Adoption)}</span>}
                    </td>
                    <td className="num" title={exactUsd(x.geSpend)}>{usd(x.geSpend)}</td>
                    <td className="num" title={`${exactUsd(x.gcpCounted)} counted of ${exactUsd(x.gcpEligible)} eligible`}>{x.gcpCounted > 0 ? usd(x.gcpCounted) : "—"}</td>
                    <td className="num" title={exactUsd(x.consumption)}>{usd(x.consumption)}</td>
                    <td className="num"><span className={`mg-util ${x.utilization >= 0.999 ? "good" : x.utilization >= 0.8 ? "warn" : "bad"}`}>{pct(x.utilization)}</span></td>
                    <td className="num" title={exactUsd(x.unconsumed)}>{x.unconsumed > 0 ? usd(x.unconsumed) : "—"}</td>
                    <td className="num" title={exactUsd(x.above)}>{x.above > 0 ? usd(x.above) : "—"}</td>
                    <td className="num">{month(x.completionMonth)}</td>
                    <td className="appr">{x.approvals.length === 0 ? <span className="mg-badge contract tiny">none · as signed</span> : x.approvals.map((a) => <span key={a} className="mg-badge proposed tiny" title={a}>{shortApproval(a)}</span>)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mg-hint">Unconsumed commitment is still owed in every scenario. The baseline row shows what the Order Form invoices as signed: 100% utilization by construction, with the risk showing up as ordered-but-unadopted licenses instead.</p>
      </section>

      <section className="mg-card">
        <div className="mg-headrow"><h2>Sensitivity — launch delay × adoption</h2><span className="mg-hint">unconsumed commitment at the end of the {inputs.timeline.windowMonths}-month window{inputs.gcp.enabled ? ", GCP counted" : ""}</span></div>
        <div className="mg-tablewrap">
          <table className="mg-table sens">
            <thead>
              <tr>
                <th>Delay ↓ · Adoption →</th>
                {SENS_MULTS.map((m) => <th key={m} className="num">{Math.round(m * 100)}%</th>)}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, i) => (
                <tr key={SENS_DELAYS[i]}>
                  <td className="mo"><b>+{SENS_DELAYS[i]} mo</b></td>
                  {row.map((cell) => {
                    const share = cell.unconsumed / COMMITMENT;
                    return (
                      <td key={cell.mult} className="num heat" style={{ background: `color-mix(in srgb, var(--bad) ${Math.round(share * 70)}%, var(--surface))` }} title={`${exactUsd(cell.unconsumed)} unconsumed · utilization ${pct(cell.utilization)} · M12 billed ${exactUsers(cell.m12Billed)} · completed ${month(cell.completionMonth)}`}>
                        {cell.unconsumed > 0 ? usd(cell.unconsumed) : <span className="ok">consumed M{cell.completionMonth}</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mg-hint">Delay shifts the modelled ramp right (months before launch bill zero); adoption scales every month. Hover a cell for utilization and Month-12 users.</p>
      </section>
    </>
  );
}

function shortApproval(a: string): string {
  if (a.startsWith("Billing fewer")) return "re-base order schedule";
  if (a.startsWith("Counting eligible GCP")) return "GCP allocation";
  if (a.startsWith("Spending beyond")) return "extension";
  if (a.startsWith("Price")) return "price change";
  return a.slice(0, 24);
}
