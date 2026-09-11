"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { defaults, evaluate, geminiPlay, reverseSolve, type Horizon, type Inputs } from "@/lib/deal-check/engine";
import { PRESETS } from "@/lib/deal-check/presets";
import { emptyMeta, type DealFile, type DealMeta } from "@/lib/deal-check/construct";
import Verdict from "./Verdict";
import Play from "./Play";
import Controls from "./Controls";
import DealPanel from "./DealPanel";
import DealConstruct from "./DealConstruct";
import Explanation from "./Explanation";
import CreditFlow from "./CreditFlow";
import EconomicsTable from "./EconomicsTable";
import CumChart from "./CumChart";
import SolveTable from "./SolveTable";
import Sensitivity from "./Sensitivity";
import Flags from "./Flags";
import Summary from "./Summary";
import { Methodology, Sources } from "./Panels";

const HORIZONS: Horizon[] = [12, 24, 36];
type Tab = "overview" | "credits" | "economics" | "levers" | "deal" | "notes";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "credits", label: "How credits work" },
  { id: "economics", label: "Economics" },
  { id: "levers", label: "What flips it" },
  { id: "deal", label: "Deal & email" },
  { id: "notes", label: "Notes & sources" },
];

export default function DealCheckApp() {
  const [inputs, setInputs] = useState<Inputs>(defaults());
  const [presetId, setPresetId] = useState<string>("");
  const [meta, setMeta] = useState<DealMeta>(emptyMeta());
  const [tab, setTab] = useState<Tab>("overview");

  const result = useMemo(() => evaluate(inputs), [inputs]);
  const solve = useMemo(() => reverseSolve(inputs), [inputs]);
  const play = useMemo(() => geminiPlay(inputs), [inputs]);

  const update = (patch: Partial<Inputs>) => { setInputs((prev) => ({ ...prev, ...patch })); setPresetId(""); };
  const applyPreset = (id: string) => { const p = PRESETS.find((x) => x.id === id); setPresetId(id); setInputs(p ? { ...defaults(), ...p.set } : defaults()); };
  const reset = () => { setPresetId(""); setInputs(defaults()); };
  const setHorizon = (h: Horizon) => setInputs((prev) => ({ ...prev, horizon: h }));
  const loadDeal = (file: DealFile) => { setMeta(file.meta); setInputs(file.inputs); setPresetId(""); };

  return (
    <div className="dc-shell">
      <header className="dc-top">
        <Link href="/" className="dc-home"><ChevronLeft size={13} /> Home</Link>
        <div className="dc-title">
          <h1>Deal check</h1>
          <span className="dc-sub">AWS MAP 2.0 vs Google Private Offer{meta.customer ? ` · ${meta.customer}` : ""}</span>
        </div>
        <div className="dc-tabs" role="tablist" aria-label="Horizon">
          {HORIZONS.map((h) => <button key={h} role="tab" aria-selected={inputs.horizon === h} onClick={() => setHorizon(h)}>{h} mo</button>)}
        </div>
        <form action="/api/deal-check/logout" method="post"><button type="submit" className="dc-btn ghost" title="Clear this browser's access">Lock</button></form>
      </header>

      <Verdict result={result} solve={solve} play={play} customer={meta.customer} />

      <div className="dc-grid">
        <aside className="dc-inputs">
          <DealPanel meta={meta} inputs={inputs} result={result} onMeta={setMeta} onLoad={loadDeal} />
          <Controls inputs={inputs} presetId={presetId} onChange={update} onPreset={applyPreset} onReset={reset} />
        </aside>
        <main className="dc-results">
          <nav className="dc-subtabs" role="tablist" aria-label="Sections">
            {TABS.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</button>)}
          </nav>

          {tab === "overview" && (
            <>
              <section className="dc-card"><h2>The play</h2><Play inputs={inputs} play={play} onChange={update} /></section>
              <section className="dc-card"><h2>Why the math comes out this way</h2><Explanation result={result} /></section>
              <section className="dc-card"><h2>Flags</h2><Flags result={result} /></section>
            </>
          )}
          {tab === "credits" && (
            <section className="dc-card"><h2>How the credits work over {inputs.horizon} months</h2><CreditFlow result={result} /></section>
          )}
          {tab === "economics" && (
            <>
              <section className="dc-card"><h2>Economics over {inputs.horizon} months</h2><EconomicsTable result={result} /></section>
              <section className="dc-card"><h2>Cumulative net cost</h2><CumChart result={result} /></section>
            </>
          )}
          {tab === "levers" && (
            <>
              <section className="dc-card"><h2>{solve.gcpAhead ? "What would hand the deal to AWS" : "What would need to change for Google to win"}</h2><SolveTable solve={solve} /></section>
              <section className="dc-card"><h2>Sensitivity</h2><Sensitivity inputs={inputs} /></section>
            </>
          )}
          {tab === "deal" && (
            <>
              <section className="dc-card"><h2>Deal construct</h2><DealConstruct meta={meta} inputs={inputs} result={result} /></section>
              <section className="dc-card"><h2>Account summary</h2><Summary result={result} meta={meta} /></section>
            </>
          )}
          {tab === "notes" && (
            <>
              <section className="dc-card dc-panel"><Methodology /></section>
              <section className="dc-card dc-panel"><Sources /></section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
