"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { defaults, evaluate, geminiPlay, reverseSolve, type Inputs } from "@/lib/deal-check/engine";
import { PRESETS } from "@/lib/deal-check/presets";
import { emptyMeta, type DealFile, type DealMeta } from "@/lib/deal-check/construct";
import Verdict from "./Verdict";
import Questions from "./Questions";
import DealPanel from "./DealPanel";
import SimpleCredits from "./SimpleCredits";
import Checklist from "./Checklist";
import Details from "./Details";

export default function DealCheckApp() {
  const [inputs, setInputs] = useState<Inputs>(defaults());
  const [presetId, setPresetId] = useState<string>("");
  const [meta, setMeta] = useState<DealMeta>(emptyMeta());

  const result = useMemo(() => evaluate(inputs), [inputs]);
  const solve = useMemo(() => reverseSolve(inputs), [inputs]);
  const play = useMemo(() => geminiPlay(inputs), [inputs]);

  const update = (patch: Partial<Inputs>) => { setInputs((prev) => ({ ...prev, ...patch })); setPresetId(""); };
  const applyPreset = (id: string) => { const p = PRESETS.find((x) => x.id === id); setPresetId(id); setInputs(p ? { ...defaults(), ...p.set } : defaults()); };
  const reset = () => { setPresetId(""); setInputs(defaults()); };
  const loadDeal = (file: DealFile) => { setMeta(file.meta); setInputs(file.inputs); setPresetId(""); };

  return (
    <div className="dc-shell">
      <header className="dc-top">
        <Link href="/" className="dc-home"><ChevronLeft size={13} /> Home</Link>
        <div className="dc-title">
          <h1>Deal check</h1>
          <span className="dc-sub">Should this customer take the Google offer or AWS MAP?</span>
        </div>
        <form action="/api/deal-check/logout" method="post" style={{ marginLeft: "auto" }}><button type="submit" className="dc-btn ghost" title="Clear this browser's access">Lock</button></form>
      </header>

      <Verdict result={result} solve={solve} play={play} customer={meta.customer} />

      <div className="dc-grid">
        <aside className="dc-inputs">
          <DealPanel meta={meta} inputs={inputs} result={result} onMeta={setMeta} onLoad={loadDeal} />
          <Questions inputs={inputs} presetId={presetId} onChange={update} onPreset={applyPreset} onReset={reset} />
        </aside>
        <main className="dc-results">
          <section className="dc-card"><h2>How the credits work</h2><SimpleCredits result={result} /></section>
          <section className="dc-card"><h2>Deal checklist</h2><Checklist meta={meta} inputs={inputs} result={result} /></section>
          <Details result={result} solve={solve} play={play} inputs={inputs} meta={meta} onChange={update} />
        </main>
      </div>
    </div>
  );
}
