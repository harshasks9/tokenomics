"use client";

import {
  PATTERN_LABEL,
  PRESETS,
  PUPM,
  PUPM_FLOOR,
  TERM_MONTHS,
  applySolvedRamp,
  generateRamp,
  solveExitUsers,
  type Inputs,
  type Pattern,
  type PresetId,
  type Result,
} from "@/lib/mdes/engine";
import { exactUsd, exactUsers, price, users, usd } from "@/lib/mdes/format";
import { monthLabel, type Basis, BASIS_LABEL } from "@/lib/mdes/terms";
import Field from "./Field";

export function Badge({ basis }: { basis: Basis }) {
  return <span className={`mg-badge ${basis}`}>{BASIS_LABEL[basis]}</span>;
}

interface Props {
  inputs: Inputs;
  result: Result;
  update: (patch: Partial<Inputs> | ((prev: Inputs) => Partial<Inputs>)) => void;
  set: (next: Inputs) => void;
}

const WINDOWS = [12, 15, 18, 24];

export default function Assumptions({ inputs, result, update, set }: Props) {
  const { ramp } = inputs;
  const parametric = ramp.preset !== "contract" && ramp.preset !== "custom";
  const solve = solveExitUsers(inputs);

  const setRamp = (patch: Partial<Inputs["ramp"]>) =>
    update((prev) => {
      // Any parameter edit on the contract or custom preset turns it into a parametric ramp.
      const preset: PresetId = prev.ramp.preset === "contract" || prev.ramp.preset === "custom" ? "immediate" : prev.ramp.preset;
      const next = { ...prev.ramp, preset, ...patch };
      const adoption = generateRamp(next);
      return { ramp: next, adoption, billed: prev.billedLinked ? adoption : prev.billed };
    });

  const applyPreset = (id: Exclude<PresetId, "custom">) =>
    update((prev) => {
      const next = { preset: id, ...PRESETS[id].ramp };
      const adoption = generateRamp(next);
      return { ramp: next, adoption, billed: prev.billedLinked ? adoption : prev.billed };
    });

  const presetActive = (id: Exclude<PresetId, "custom">) => {
    if (ramp.preset !== id) return false;
    if (id === "contract") return true;
    const p = PRESETS[id].ramp;
    return p.launchMonth === ramp.launchMonth && p.startUsers === ramp.startUsers && p.exitUsers === ramp.exitUsers && p.pattern === ramp.pattern && p.ceiling === ramp.ceiling;
  };
  const isCustom = ramp.preset === "custom" || (parametric && !presetActive(ramp.preset as Exclude<PresetId, "custom">));

  const windowIsPreset = WINDOWS.includes(inputs.timeline.windowMonths);

  return (
    <div className="mg-inputs">
      {/* Ramp */}
      <section className="mg-card">
        <div className="mg-headrow"><h2>User ramp</h2><Badge basis="assumption" /></div>
        <div className="mg-chips" role="group" aria-label="Ramp presets">
          {(Object.keys(PRESETS) as Exclude<PresetId, "custom">[]).map((id) => (
            <button key={id} type="button" className="mg-chip" aria-pressed={presetActive(id)} title={PRESETS[id].blurb} onClick={() => applyPreset(id)}>
              {PRESETS[id].label}
            </button>
          ))}
          <span className="mg-chip static" aria-pressed={isCustom}>Custom</span>
        </div>
        <p className="mg-hint">{ramp.preset === "custom" ? "Edited month by month in the table or chart." : ramp.preset === "contract" ? PRESETS.contract.blurb : "Presets are starting points — edit anything below or in the table."}</p>

        <div className="mg-two">
          <label className="mg-field" htmlFor="launch">
            <span className="lab">Launch month</span>
            <select id="launch" className="mg-select" value={ramp.preset === "contract" ? 2 : ramp.launchMonth} onChange={(e) => setRamp({ launchMonth: Number(e.target.value) })}>
              {Array.from({ length: TERM_MONTHS }, (_, i) => i + 1).map((m) => <option key={m} value={m}>M{m} · {monthLabel(m)}</option>)}
            </select>
          </label>
          <label className="mg-field" htmlFor="pattern">
            <span className="lab">Growth pattern</span>
            <select id="pattern" className="mg-select" value={ramp.pattern} onChange={(e) => setRamp({ pattern: e.target.value as Pattern })}>
              {(Object.keys(PATTERN_LABEL) as Pattern[]).map((p) => <option key={p} value={p}>{PATTERN_LABEL[p]}</option>)}
            </select>
          </label>
        </div>
        <div className="mg-two">
          <Field id="start" label="Starting users" kind="users" value={ramp.startUsers} min={0} onCommit={(v) => setRamp({ startUsers: Math.round(v) })} hint="In the launch month" />
          <Field id="exit" label="Month-12 users" kind="users" value={ramp.exitUsers} min={0} onCommit={(v) => setRamp({ exitUsers: Math.round(v) })} hint="Above 650K allowed" />
        </div>
        <div className="mg-two">
          <label className="mg-field" htmlFor="ceiling">
            <span className="lab">User ceiling <span className="opt">optional</span></span>
            <span className="mg-inwrap">
              <input
                id="ceiling"
                className="mg-num"
                inputMode="decimal"
                placeholder="none"
                defaultValue={ramp.ceiling === null ? "" : ramp.ceiling >= 1_000_000 ? `${+(ramp.ceiling / 1e6).toFixed(3)}M` : `${+(ramp.ceiling / 1e3).toFixed(1)}K`}
                key={`ceil-${ramp.ceiling ?? "none"}`}
                onBlur={(e) => {
                  const t = e.target.value.trim();
                  if (!t) { update((prev) => ({ ramp: { ...prev.ramp, ceiling: null }, adoption: prev.ramp.preset === "custom" ? prev.adoption : generateRamp({ ...prev.ramp, ceiling: null }), billed: prev.billedLinked ? (prev.ramp.preset === "custom" ? prev.adoption : generateRamp({ ...prev.ramp, ceiling: null })) : prev.billed })); return; }
                  const m = t.replace(/[,\s]/g, "").toLowerCase().match(/^(\d*\.?\d+)([km])?$/);
                  if (!m) return;
                  const v = Math.round(parseFloat(m[1]) * (m[2] === "m" ? 1e6 : m[2] === "k" ? 1e3 : 1));
                  update((prev) => {
                    const next = { ...prev.ramp, ceiling: v };
                    const adoption = prev.ramp.preset === "custom" ? prev.adoption.map((x) => Math.min(x, v)) : generateRamp(next);
                    return { ramp: next, adoption, billed: prev.billedLinked ? adoption : prev.billed.map((x) => Math.min(x, v)) };
                  });
                }}
              />
            </span>
            <span className="hint">e.g. the eligible Level-3 learner pool</span>
          </label>
          <label className="mg-field mg-toggle" htmlFor="linked">
            <span className="lab">Billed users = adoption</span>
            <span className="mg-switch">
              <input id="linked" type="checkbox" checked={inputs.billedLinked} onChange={(e) => update((prev) => ({ billedLinked: e.target.checked, billed: e.target.checked ? prev.adoption : prev.billed }))} />
              <span className="track" aria-hidden />
              <span className="txt">{inputs.billedLinked ? "Linked" : "Separate — edit billed users in the table"}</span>
            </span>
            <span className="hint">Spend always uses billed (licensed) users.</span>
          </label>
        </div>

        <div className="mg-solve">
          <div className="mg-solve-row">
            <div>
              <div className="k">Required Month-12 users</div>
              <div className="v" title={solve.exitUsers === null ? undefined : exactUsers(solve.exitUsers)}>{solve.feasible && solve.exitUsers !== null ? users(solve.exitUsers) : "Not reachable"}</div>
              <div className="s">to consume $10.8M by M{inputs.timeline.windowMonths} on this launch month, pattern{ramp.ceiling !== null ? " and ceiling" : ""}{inputs.gcp.enabled ? ", with GCP counted" : ""}</div>
            </div>
            <div>
              <div className="k">Flat from launch</div>
              <div className="v" title={solve.flatUsers === null ? undefined : exactUsers(solve.flatUsers)}>{solve.flatUsers === null ? "—" : users(solve.flatUsers)}</div>
              <div className="s">{solve.flatUsers !== null && !solve.flatFeasible ? "above the ceiling" : "constant billed users from launch"}</div>
            </div>
          </div>
          <p className={`mg-hint${solve.feasible ? "" : " warn"}`}>{solve.reason}</p>
          <button type="button" className="mg-btn primary" disabled={!solve.feasible} onClick={() => set(applySolvedRamp(inputs))}>Solve ramp to consume commitment</button>
          {!solve.feasible && <div className="mg-hint">Max reachable: <b title={exactUsd(solve.maxConsumption)}>{usd(solve.maxConsumption)}</b>, gap <b title={exactUsd(solve.gap)}>{usd(solve.gap)}</b>.</div>}
        </div>
      </section>

      {/* Price */}
      <section className="mg-card">
        <div className="mg-headrow"><h2>Price</h2><Badge basis="contract" /></div>
        <Field id="pupm" label="Per user per month" kind="price" prefix="$" value={inputs.pupm} onCommit={(v) => { if (v < PUPM_FLOOR) return `Below the $${PUPM_FLOOR.toFixed(2)} floor — rejected`; update({ pupm: v }); }} hint={`Order Form: $${PUPM.toFixed(2)} (list $5 less 60%). Floor $${PUPM_FLOOR.toFixed(2)} is a deal-desk assumption.`} />
        {result.inputs.pupm !== PUPM && <p className="mg-hint warn">Any price other than {price(PUPM)} needs an amended order form.</p>}
      </section>

      {/* GCP */}
      <section className={`mg-card${inputs.gcp.enabled ? " on" : ""}`}>
        <div className="mg-headrow">
          <h2>GCP allocation</h2>
          <Badge basis="proposed" />
        </div>
        <label className="mg-switch block" htmlFor="gcp-on">
          <input id="gcp-on" type="checkbox" checked={inputs.gcp.enabled} onChange={(e) => update((prev) => ({ gcp: { ...prev.gcp, enabled: e.target.checked } }))} />
          <span className="track" aria-hidden />
          <span className="txt">Count eligible GCP spend toward the commitment</span>
        </label>
        <p className="mg-hint">Not in the Order Form. Subject to approval; only spend entered here is counted.</p>
        {inputs.gcp.enabled && (
          <>
            <div className="mg-two">
              <Field id="gcp-monthly" label="Eligible GCP spend / month" kind="usd" prefix="$" value={inputs.gcp.monthly} min={0} onCommit={(v) => update((prev) => ({ gcp: { ...prev.gcp, monthly: v } }))} />
              <label className="mg-field" htmlFor="gcp-start">
                <span className="lab">From month</span>
                <select id="gcp-start" className="mg-select" value={inputs.gcp.startMonth} onChange={(e) => update((prev) => ({ gcp: { ...prev.gcp, startMonth: Number(e.target.value) } }))}>
                  {Array.from({ length: inputs.timeline.windowMonths }, (_, i) => i + 1).map((m) => <option key={m} value={m}>M{m} · {monthLabel(m)}</option>)}
                </select>
              </label>
            </div>
            <div className="mg-two">
              <label className="mg-field" htmlFor="gcp-cap">
                <span className="lab">Max allocation</span>
                <select id="gcp-cap" className="mg-select" value={inputs.gcp.capMode} onChange={(e) => update((prev) => ({ gcp: { ...prev.gcp, capMode: e.target.value as Inputs["gcp"]["capMode"], capValue: e.target.value === "pct" ? Math.min(prev.gcp.capValue || 20, 100) : prev.gcp.capValue } }))}>
                  <option value="none">No cap</option>
                  <option value="usd">USD amount</option>
                  <option value="pct">% of commitment</option>
                </select>
              </label>
              {inputs.gcp.capMode === "usd" && <Field id="gcp-capv" label="Cap" kind="usd" prefix="$" value={inputs.gcp.capValue} min={0} onCommit={(v) => update((prev) => ({ gcp: { ...prev.gcp, capValue: v } }))} />}
              {inputs.gcp.capMode === "pct" && <Field id="gcp-capp" label="Cap" kind="pct" suffix="%" value={inputs.gcp.capValue} min={0} max={100} onCommit={(v) => update((prev) => ({ gcp: { ...prev.gcp, capValue: v } }))} hint={`= ${usd((inputs.gcp.capValue / 100) * 10_800_000)}`} />}
            </div>
            <div className="mg-mini">
              <div><span>GE shortfall before GCP</span><b title={exactUsd(result.gcp.shortfallBeforeGcp)}>{usd(result.gcp.shortfallBeforeGcp)}</b></div>
              <div><span>Covered by GCP</span><b title={exactUsd(result.gcp.covered)}>{usd(result.gcp.covered)}</b></div>
              <div><span>Remaining gap</span><b title={exactUsd(result.gcp.gapAfter)}>{usd(result.gcp.gapAfter)}</b></div>
              {result.gcp.capBinding && <div><span>Cap binding</span><b>{usd(result.total.gcpEligible)} eligible → {usd(result.total.gcpCounted)} counted</b></div>}
            </div>
          </>
        )}
      </section>

      {/* Timeline */}
      <section className={`mg-card${inputs.timeline.windowMonths > TERM_MONTHS ? " on" : ""}`}>
        <div className="mg-headrow"><h2>Spending window</h2><Badge basis="proposed" /></div>
        <div className="mg-chips" role="group" aria-label="Spending window">
          {WINDOWS.map((w) => (
            <button key={w} type="button" className="mg-chip" aria-pressed={inputs.timeline.windowMonths === w} onClick={() => update((prev) => ({ timeline: { ...prev.timeline, windowMonths: w } }))}>
              {w} mo{w === 12 ? " · contract" : ""}
            </button>
          ))}
          <span className="mg-chip static" aria-pressed={!windowIsPreset}>Custom</span>
        </div>
        <div className="mg-two">
          <Field id="window" label="Window (months)" kind="plain" value={inputs.timeline.windowMonths} min={12} max={36} onCommit={(v) => update((prev) => ({ timeline: { ...prev.timeline, windowMonths: Math.round(v) } }))} hint="12 = as contracted · up to 36" />
          {inputs.timeline.windowMonths > TERM_MONTHS && (
            <Field id="ext-pupm" label="Extension price" kind="price" prefix="$" value={inputs.timeline.extPupm ?? inputs.pupm} onCommit={(v) => { if (v < PUPM_FLOOR) return `Below the $${PUPM_FLOOR.toFixed(2)} floor — rejected`; update((prev) => ({ timeline: { ...prev.timeline, extPupm: v } })); }} hint="Assumption — Order Form does not renew" />
          )}
        </div>
        {inputs.timeline.windowMonths > TERM_MONTHS ? (
          <p className="mg-hint warn">Months 13–{inputs.timeline.windowMonths} hold the Month-12 billed users{inputs.gcp.enabled ? " and GCP spend" : ""} unless edited in the table. Continued pricing needs written agreement. The Month-12 user milestone does not move.</p>
        ) : (
          <p className="mg-hint">As contracted: the Order Form ends with the final six-month term. Extending is a proposal that needs approval.</p>
        )}
      </section>

      {/* Cases */}
      <section className="mg-card">
        <div className="mg-headrow"><h2>Adoption cases</h2><Badge basis="assumption" /></div>
        <p className="mg-hint">Base = the ramp above. Low and high scale it and shift the launch, for the scenario table and sensitivity grid.</p>
        <div className="mg-two">
          <Field id="low-mult" label="Low · users ×" kind="pct" suffix="%" value={inputs.cases.low.mult * 100} min={0} max={300} onCommit={(v) => update((prev) => ({ cases: { ...prev.cases, low: { ...prev.cases.low, mult: v / 100 } } }))} />
          <Field id="low-delay" label="Low · extra delay" kind="plain" suffix="mo" value={inputs.cases.low.delay} min={0} max={11} onCommit={(v) => update((prev) => ({ cases: { ...prev.cases, low: { ...prev.cases.low, delay: Math.round(v) } } }))} />
        </div>
        <div className="mg-two">
          <Field id="high-mult" label="High · users ×" kind="pct" suffix="%" value={inputs.cases.high.mult * 100} min={0} max={300} onCommit={(v) => update((prev) => ({ cases: { ...prev.cases, high: { ...prev.cases.high, mult: v / 100 } } }))} />
          <Field id="high-delay" label="High · extra delay" kind="plain" suffix="mo" value={inputs.cases.high.delay} min={0} max={11} onCommit={(v) => update((prev) => ({ cases: { ...prev.cases, high: { ...prev.cases.high, delay: Math.round(v) } } }))} />
        </div>
      </section>
    </div>
  );
}
