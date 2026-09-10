"use client";

import type { Inputs, MapAfter, Platform } from "@/lib/deal-check/engine";
import { INPUT_META, SOURCE_LABEL, type InputGroup, type InputKey } from "@/lib/deal-check/terms";
import { PRESETS } from "@/lib/deal-check/presets";

type NumKey = { [K in InputKey]: Inputs[K] extends number ? K : never }[InputKey];

const GROUPS: { name: InputGroup; keys: InputKey[] }[] = [
  { name: "Customer", keys: ["platform", "anthSpend", "growth", "awsBaseline", "gcpBaselineQ", "directDiscount"] },
  { name: "Migration", keys: ["migPct", "migStart", "migRamp", "migCost", "gcpSignMonth"] },
  { name: "AWS", keys: ["awsCommitRemaining", "awsCommitMonths", "awsOtherSpend", "mapPct", "partnerPass", "mapYears", "mapAfter", "mapCommitArr", "awsDiscount", "awsCreditUse"] },
  { name: "GCP", keys: ["gcpCommitNew", "gcpCommitYears", "gcpCommitExisting", "gcpCommitExistingMonths", "gcpAiSpend", "gcpOtherSpend", "gcpPct", "gcpCap", "mktCapPct", "mktException", "gcpDiscount"] },
];

function Tag({ k }: { k: InputKey }) {
  const s = INPUT_META[k].source;
  return <span className={`dc-tag ${s}`} title={SOURCE_LABEL[s]}>{SOURCE_LABEL[s]}</span>;
}

function NumberField({ k, value, onChange }: { k: NumKey; value: number; onChange: (v: number) => void }) {
  const m = INPUT_META[k];
  const min = "min" in m ? m.min : 0, max = "max" in m ? m.max : 100, step = "step" in m ? m.step : 1;
  return (
    <div className="dc-field">
      <div className="lab">
        <span>{m.label}<Tag k={k} /></span>
        {"unit" in m && m.unit && <span className="unit">{m.unit}</span>}
      </div>
      <div className="ctl">
        <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))} onChange={(e) => onChange(Number(e.target.value))} aria-label={m.label} />
        <input className="dc-num num" type="number" step={step} value={value} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} aria-label={`${m.label} value`} />
      </div>
      <div className="help">{m.help}</div>
    </div>
  );
}

function SelectField<T extends string>({ k, value, options, onChange }: { k: InputKey; value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) {
  const m = INPUT_META[k];
  return (
    <div className="dc-field">
      <div className="lab"><span>{m.label}<Tag k={k} /></span></div>
      <div className="ctl single">
        <select className="dc-select" value={value} onChange={(e) => onChange(e.target.value as T)} aria-label={m.label}>
          {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>
      <div className="help">{m.help}</div>
    </div>
  );
}

export default function Controls({ inputs, presetId, onChange, onPreset, onReset }: {
  inputs: Inputs; presetId: string; onChange: (p: Partial<Inputs>) => void; onPreset: (id: string) => void; onReset: () => void;
}) {
  const preset = PRESETS.find((p) => p.id === presetId);
  return (
    <div className="dc-card">
      <h2>Inputs</h2>
      <div className="dc-toolbar">
        <select className="dc-select" value={presetId} onChange={(e) => onPreset(e.target.value)} aria-label="Preset">
          <option value="">Preset scenario…</option>
          {PRESETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className="dc-btn" onClick={onReset}>Reset</button>
      </div>
      {preset && <p className="dc-presetnote">{preset.note}</p>}

      {GROUPS.map((g, gi) => (
        <details key={g.name} className="dc-group" open={gi < 2}>
          <summary>{g.name}</summary>
          {g.keys.map((k) => {
            if (k === "platform")
              return <SelectField<Platform> key={k} k={k} value={inputs.platform} onChange={(v) => onChange({ platform: v })}
                options={[{ v: "direct", l: "Direct with Anthropic" }, { v: "aws", l: "AWS Bedrock" }, { v: "gcp", l: "GCP marketplace" }]} />;
            if (k === "mapAfter")
              return <SelectField<MapAfter> key={k} k={k} value={inputs.mapAfter} onChange={(v) => onChange({ mapAfter: v })}
                options={[{ v: "none", l: "Nothing" }, { v: "extend", l: "Extension (increment over prior year)" }, { v: "restructure", l: "Partner restructure (baseline reset to zero)" }]} />;
            if (k === "mktException")
              return (
                <label key={k} className="dc-check">
                  <input type="checkbox" checked={inputs.mktException} onChange={(e) => onChange({ mktException: e.target.checked })} />
                  <span>{INPUT_META[k].label}<Tag k={k} /></span>
                </label>
              );
            if (k === "horizon") return null;
            const nk = k as NumKey;
            return <NumberField key={k} k={nk} value={inputs[nk]} onChange={(v) => onChange({ [nk]: v } as Partial<Inputs>)} />;
          })}
        </details>
      ))}
    </div>
  );
}
