"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { evaluate, geminiPlay, reverseSolve } from "@/lib/deal-check/engine";
import { useDealSession } from "@/lib/deal-check/useDealSession";
import Verdict from "./SimpleVerdict";
import Questions from "./Questions";
import DealPanel from "./SimpleDealPanel";
import SimpleCredits from "./SimpleCredits";
import Checklist from "./Checklist";
import Details from "./Details";

export default function SimpleDealCheckApp() {
  const { inputs, meta, presetId, update, applyPreset, reset, setMeta, loadDeal } = useDealSession();

  const result = useMemo(() => evaluate(inputs), [inputs]);
  const solve = useMemo(() => reverseSolve(inputs), [inputs]);
  const play = useMemo(() => geminiPlay(inputs), [inputs]);


  return (
    <div className="dc-shell">
      <header className="dc-top">
        <Link href="/" className="dc-home"><ChevronLeft size={13} /> Home</Link>
        <div className="dc-title">
          <h1>Deal check</h1>
          <span className="dc-sub">Simple version · should this customer take the Google offer or AWS MAP?</span>
        </div>
        <Link href="/deal-check" className="dc-btn" style={{ marginLeft: "auto" }} title="Every view and assumption">Full version</Link>
        <form action="/api/deal-check/logout" method="post"><button type="submit" className="dc-btn ghost" title="Clear this browser's access">Lock</button></form>
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
