"use client";

import { useMemo, useState } from "react";
import { ECON_PRESETS, computeEconomics, type EconProfile } from "@/lib/harness/economics";

const fmt$ = (v: number) => (v >= 100 ? `$${v.toFixed(0)}` : v >= 1 ? `$${v.toFixed(2)}` : `$${v.toFixed(3)}`);

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="hx-ctrl">
      <label>
        <span>{label}</span>
        <output>
          {value}
          {unit}
        </output>
      </label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

/** §10 — cost per successful task, side by side with an editable challenger. */
export default function EconomicsLab() {
  const [presetId, setPresetId] = useState(ECON_PRESETS[1].id);
  const base = ECON_PRESETS[0]; // disciplined harness as the anchor
  const preset = ECON_PRESETS.find((p) => p.id === presetId)!;

  // The challenger is editable; start from the selected preset.
  const [edit, setEdit] = useState<EconProfile | null>(null);
  const challenger = edit && edit.id === presetId ? edit : preset;
  const set = (patch: Partial<EconProfile>) => setEdit({ ...challenger, ...patch, id: presetId });

  const a = useMemo(() => computeEconomics(base), [base]);
  const b = useMemo(() => computeEconomics(challenger), [challenger]);
  const winner = a.costPerSuccess <= b.costPerSuccess ? "a" : "b";

  return (
    <>
      <div className="hx-econ-formula" style={{ marginBottom: 20 }}>
        <span>Model cost</span>
        <span className="op">×</span>
        <span>Harness efficiency</span>
        <span className="op">×</span>
        <span>Success rate</span>
        <span className="op">=</span>
        <span className="res">Effective task economics</span>
      </div>

      <div className="hx-econ">
        <div className="hx-card hx-econ-controls">
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--hx-ink-faint)",
            }}
          >
            Challenger profile
          </div>
          <div className="hx-ctrl">
            <div className="seg-row">
              {ECON_PRESETS.slice(1).map((p) => (
                <button
                  key={p.id}
                  className={presetId === p.id ? "on" : ""}
                  onClick={() => {
                    setPresetId(p.id);
                    setEdit(null);
                  }}
                >
                  {p.id === "naive" ? "Naive · frontier" : "Naive · budget"}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--hx-ink-faint)", marginTop: 6 }}>{preset.desc}</div>
          </div>
          <Slider label="Input price / 1M tokens" value={challenger.priceIn} min={0.1} max={15} step={0.1} unit="$" onChange={(v) => set({ priceIn: v })} />
          <Slider label="Context per turn" value={challenger.ctxPerTurnK} min={5} max={200} step={5} unit="k tok" onChange={(v) => set({ ctxPerTurnK: v })} />
          <Slider label="Turns per attempt" value={challenger.turns} min={2} max={60} step={1} unit="" onChange={(v) => set({ turns: v })} />
          <Slider label="Cache hit rate" value={Math.round(challenger.cacheHit * 100)} min={0} max={95} step={5} unit="%" onChange={(v) => set({ cacheHit: v / 100 })} />
          <Slider label="Success rate per attempt" value={Math.round(challenger.success * 100)} min={20} max={98} step={1} unit="%" onChange={(v) => set({ success: v / 100 })} />
          <Slider label="Retries allowed" value={challenger.retries} min={0} max={4} step={1} unit="" onChange={(v) => set({ retries: v })} />
        </div>

        <div className="hx-econ-out">
          <div className="hx-econ-cards">
            <div className={`hx-card hx-econ-card ${winner === "a" ? "win" : ""}`}>
              <div className="h">
                <span className="nm">{base.name}</span>
                {winner === "a" && <span className="hx-pill" style={{ color: "var(--hx-green)", borderColor: "rgba(24,128,56,0.4)" }}>cheaper / task</span>}
              </div>
              <div className="big">
                {fmt$(a.costPerSuccess)} <span className="u">per successful task</span>
              </div>
              <div className="sub">
                {fmt$(a.costPerAttempt)} per attempt · {a.expectedAttempts.toFixed(2)} attempts expected ·{" "}
                {(a.effectiveSuccess * 100).toFixed(0)}% end up succeeding · {a.tokensPerAttemptM.toFixed(2)}M tokens/attempt
              </div>
            </div>
            <div className={`hx-card hx-econ-card ${winner === "b" ? "win" : ""}`}>
              <div className="h">
                <span className="nm">{challenger.name}</span>
                {winner === "b" && <span className="hx-pill" style={{ color: "var(--hx-green)", borderColor: "rgba(24,128,56,0.4)" }}>cheaper / task</span>}
              </div>
              <div className="big">
                {fmt$(b.costPerSuccess)} <span className="u">per successful task</span>
              </div>
              <div className="sub">
                {fmt$(b.costPerAttempt)} per attempt · {b.expectedAttempts.toFixed(2)} attempts expected ·{" "}
                {(b.effectiveSuccess * 100).toFixed(0)}% end up succeeding · {b.tokensPerAttemptM.toFixed(2)}M tokens/attempt
              </div>
            </div>
          </div>

          <div className="hx-card hx-econ-note">
            <strong>Read it like a CFO:</strong> the anchor profile pays frontier prices but caches 90% of its input,
            verifies before finishing, and rarely retries. Try dropping the challenger&apos;s input price to $0.50 —
            then watch what its cache misses, extra turns and retries do to the number that matters. Research context:
            harness choice alone has produced up to <strong>40× differences in tokens per solved task</strong> with
            pass rates nearly unchanged (arXiv:2607.22585), and cached reads price ~90% below uncached on major
            platforms. Figures here are illustrative profiles, not vendor measurements — plug in your own.
          </div>
        </div>
      </div>
    </>
  );
}
