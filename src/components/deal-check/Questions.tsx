"use client";

import { useState } from "react";
import type { Horizon, Inputs, MapAfter, Platform } from "@/lib/deal-check/engine";
import { INPUT_META, SOURCE_LABEL, type InputGroup, type InputKey } from "@/lib/deal-check/terms";
import { PRESETS } from "@/lib/deal-check/presets";

type NumKey = { [K in InputKey]: Inputs[K] extends number ? K : never }[InputKey];

/** The questions a seller can answer from a call, in plain words. */
const QUESTIONS: { key: NumKey; q: string; hint: string }[] = [
  { key: "anthSpend", q: "How much do they spend on Anthropic today?", hint: "$M a year, annualised" },
  { key: "growth", q: "How fast is that growing?", hint: "% a year" },
  { key: "awsBaseline", q: "What did they spend on AWS AI last year?", hint: "$M; zero if new to AWS. MAP only pays above this." },
  { key: "awsCommitRemaining", q: "How much AWS commit is left?", hint: "$M unconsumed; it would be charged if the workload leaves" },
  { key: "gcpAiSpend", q: "How much other GCP AI spend do they have?", hint: "$M a year; this is what Google's credits can pay for" },
  { key: "geminiShare", q: "How much of the traffic could Gemini serve?", hint: "% of the workload; the rest stays on Anthropic with credits" },
];

const RAW_GROUPS: { name: InputGroup; keys: InputKey[] }[] = [
  { name: "Customer", keys: ["gcpBaselineQ"] },
  { name: "Migration", keys: ["migPct", "migStart", "migRamp", "migCost", "gcpSignMonth"] },
  { name: "AWS", keys: ["awsCommitMonths", "awsOtherSpend", "mapPct", "partnerPass", "mapYears", "mapAfter", "awsDiscount"] },
  { name: "GCP", keys: ["gcpCommitNew", "gcpCommitYears", "gcpCommitExisting", "gcpCommitExistingMonths", "gcpOtherSpend", "gcpPct", "gcpForecastY1", "mktException", "gcpDiscount", "geminiCostRatio"] },
];
const isHidden = (k: InputKey): boolean => Boolean((INPUT_META[k] as { hidden?: boolean }).hidden);
const GROUPS = RAW_GROUPS.map((g) => ({ ...g, keys: g.keys.filter((k) => !isHidden(k)) }));

function Tag({ k }: { k: InputKey }) {
  const s = INPUT_META[k].source;
  return <span className={`dc-tag ${s}`} title={SOURCE_LABEL[s]}>{SOURCE_LABEL[s]}</span>;
}

function Range({ k, value, onChange, label, hint }: { k: NumKey; value: number; onChange: (v: number) => void; label?: string; hint?: string }) {
  const m = INPUT_META[k];
  const min = "min" in m ? m.min : 0, max = "max" in m ? m.max : 100, step = "step" in m ? m.step : 1;
  return (
    <div className="dc-field">
      <div className="lab"><span>{label ?? m.label}{!label && <Tag k={k} />}</span>{"unit" in m && m.unit && <span className="unit">{m.unit}</span>}</div>
      <div className="ctl">
        <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))} onChange={(e) => onChange(Number(e.target.value))} aria-label={label ?? m.label} />
        <input className="dc-num num" type="number" step={step} value={value} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} aria-label={`${label ?? m.label} value`} />
      </div>
      <div className="help">{hint ?? m.help}</div>
    </div>
  );
}

export default function Questions({ inputs, presetId, onChange, onPreset, onReset }: {
  inputs: Inputs; presetId: string; onChange: (p: Partial<Inputs>) => void; onPreset: (id: string) => void; onReset: () => void;
}) {
  const [advanced, setAdvanced] = useState(false);
  const preset = PRESETS.find((p) => p.id === presetId);
  const field = (k: InputKey) => {
    if (k === "mapAfter")
      return (
        <div key={k} className="dc-field">
          <div className="lab"><span>{INPUT_META[k].label}<Tag k={k} /></span></div>
          <div className="ctl single">
            <select className="dc-select" value={inputs.mapAfter} onChange={(e) => onChange({ mapAfter: e.target.value as MapAfter })} aria-label={INPUT_META[k].label}>
              <option value="none">Nothing</option><option value="extend">Extension (increment over prior year)</option><option value="restructure">Partner restructure (baseline reset to zero)</option>
            </select>
          </div>
          <div className="help">{INPUT_META[k].help}</div>
        </div>
      );
    if (k === "mktException")
      return (
        <label key={k} className="dc-check">
          <input type="checkbox" checked={inputs.mktException} onChange={(e) => onChange({ mktException: e.target.checked })} />
          <span>{INPUT_META[k].label}<Tag k={k} /></span>
        </label>
      );
    const nk = k as NumKey;
    return <Range key={k} k={nk} value={inputs[nk]} onChange={(v) => onChange({ [nk]: v } as Partial<Inputs>)} />;
  };
  return (
    <div className="dc-card">
      <div className="dc-headrow">
        <h2>The customer</h2>
        <button className="dc-btn ghost small" onClick={onReset}>Reset</button>
      </div>
      <div className="dc-toolbar">
        <select className="dc-select" value={presetId} onChange={(e) => onPreset(e.target.value)} aria-label="Scenario">
          <option value="">Start from a typical situation…</option>
          {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      {preset && <p className="dc-presetnote">{preset.note}</p>}

      <div className="dc-field">
        <div className="lab"><span>Where does the workload run today?</span></div>
        <div className="ctl single">
          <select className="dc-select" value={inputs.platform} onChange={(e) => onChange({ platform: e.target.value as Platform })} aria-label="Where the workload runs today">
            <option value="direct">Direct with Anthropic</option><option value="aws">AWS Bedrock</option><option value="gcp">GCP marketplace</option>
          </select>
        </div>
      </div>
      {QUESTIONS.map((q) => <Range key={q.key} k={q.key} value={inputs[q.key]} onChange={(v) => onChange({ [q.key]: v } as Partial<Inputs>)} label={q.q} hint={q.hint} />)}

      <details className="dc-group" open={advanced} onToggle={(e) => setAdvanced((e.currentTarget as HTMLDetailsElement).open)}>
        <summary>Advanced assumptions</summary>
        <p className="dc-presetnote">Everything the model uses, with its source. Defaults follow the offer summary and the field report; change only what you know.</p>
        <div className="dc-field">
          <div className="lab"><span>Horizon</span></div>
          <div className="ctl single">
            <select className="dc-select" value={inputs.horizon} onChange={(e) => onChange({ horizon: Number(e.target.value) as Horizon })} aria-label="Horizon">
              <option value={12}>12 months</option><option value={24}>24 months</option><option value={36}>36 months</option>
            </select>
          </div>
          <div className="help">How far out the costs are added up. 24 months lets every quarter&apos;s credit land.</div>
        </div>
        {GROUPS.map((g) => (
          <div key={g.name} style={{ marginTop: 12 }}>
            <div className="dc-grouphead">{g.name}</div>
            {g.keys.map(field)}
          </div>
        ))}
      </details>
    </div>
  );
}
