"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { defaults, evaluate, reverseSolve, type Horizon, type Inputs } from "@/lib/deal-check/engine";
import { PRESETS } from "@/lib/deal-check/presets";
import Verdict from "./Verdict";
import Controls from "./Controls";
import EconomicsTable from "./EconomicsTable";
import CumChart from "./CumChart";
import SolveTable from "./SolveTable";
import Sensitivity from "./Sensitivity";
import Flags from "./Flags";
import Summary from "./Summary";
import { Methodology, Sources } from "./Panels";

const HORIZONS: Horizon[] = [12, 24, 36];

export default function DealCheckApp() {
  const [inputs, setInputs] = useState<Inputs>(defaults());
  const [presetId, setPresetId] = useState<string>("");

  const result = useMemo(() => evaluate(inputs), [inputs]);
  const solve = useMemo(() => reverseSolve(inputs), [inputs]);

  const update = (patch: Partial<Inputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
    setPresetId("");
  };
  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    setPresetId(id);
    setInputs(p ? { ...defaults(), ...p.set } : defaults());
  };
  const reset = () => {
    setPresetId("");
    setInputs(defaults());
  };
  const setHorizon = (h: Horizon) => setInputs((prev) => ({ ...prev, horizon: h }));

  const tabs = (
    <div className="dc-tabs" role="tablist" aria-label="Horizon">
      {HORIZONS.map((h) => (
        <button key={h} role="tab" aria-selected={inputs.horizon === h} onClick={() => setHorizon(h)}>
          {h} mo
        </button>
      ))}
    </div>
  );

  return (
    <div className="dc-shell">
      <div className="dc-top">
        <Link href="/" className="dc-home"><ChevronLeft size={13} /> Home</Link>
        <div>
          <h1>Deal check: AWS MAP 2.0 vs Google Private Offer</h1>
          <p>Which program is cheaper for the customer&apos;s Anthropic workload, by how much, and what would flip it. Month 0 = Sep 2026.</p>
        </div>
        <form action="/api/deal-check/logout" method="post" style={{ marginLeft: "auto" }}>
          <button type="submit" className="dc-btn" title="Clear this browser's access">Lock</button>
        </form>
      </div>

      <Verdict result={result} solve={solve} tabs={tabs} />

      <div className="dc-grid">
        <aside className="dc-inputs">
          <Controls inputs={inputs} presetId={presetId} onChange={update} onPreset={applyPreset} onReset={reset} />
        </aside>
        <main className="dc-results">
          <section className="dc-card">
            <div className="dc-headrow"><h2 style={{ margin: 0 }}>Economics over {inputs.horizon} months</h2>{tabs}</div>
            <EconomicsTable result={result} />
          </section>
          <section className="dc-card">
            <h2>Cumulative net cost</h2>
            <CumChart result={result} />
          </section>
          <section className="dc-card">
            <h2>{solve.gcpAhead ? "What would hand the deal to AWS" : "What would need to change for Google to win"}</h2>
            <SolveTable solve={solve} />
          </section>
          <section className="dc-card">
            <h2>Sensitivity</h2>
            <Sensitivity inputs={inputs} />
          </section>
          <section className="dc-card">
            <h2>Flags</h2>
            <Flags result={result} />
          </section>
          <section className="dc-card">
            <h2>Account summary</h2>
            <Summary result={result} />
          </section>
          <section className="dc-card dc-panel">
            <Methodology />
          </section>
          <section className="dc-card dc-panel">
            <Sources />
          </section>
        </main>
      </div>
    </div>
  );
}
