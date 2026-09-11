"use client";

import type { GeminiPlay, Inputs, Result, ReverseSolve } from "@/lib/deal-check/engine";
import type { DealMeta } from "@/lib/deal-check/construct";
import Play from "./Play";
import Explanation from "./Explanation";
import CreditFlow from "./CreditFlow";
import EconomicsTable from "./EconomicsTable";
import CumChart from "./CumChart";
import SolveTable from "./SolveTable";
import Sensitivity from "./Sensitivity";
import DealConstruct from "./DealConstruct";
import Flags from "./Flags";
import Summary from "./Summary";
import { Methodology, Sources } from "./Panels";

/** Every deep view, collapsed by default so the page reads simply but nothing is lost. */
export default function Details({ result, solve, play, inputs, meta, onChange }: {
  result: Result; solve: ReverseSolve; play: GeminiPlay; inputs: Inputs; meta: DealMeta; onChange: (p: Partial<Inputs>) => void;
}) {
  const sections: { title: string; body: React.ReactNode }[] = [
    { title: "Tune the Gemini share", body: <Play inputs={inputs} play={play} onChange={onChange} /> },
    { title: "The full explanation and what moves the answer", body: <Explanation result={result} /> },
    { title: "Credits step by step, quarter by quarter", body: <CreditFlow result={result} /> },
    { title: `Economics over ${result.horizon} months`, body: <><EconomicsTable result={result} /><h3>Cumulative net cost</h3><CumChart result={result} /></> },
    { title: solve.gcpAhead ? "What would hand the deal to AWS" : "What would need to change for Google to win", body: <><SolveTable solve={solve} /><h3>Sensitivity</h3><Sensitivity inputs={inputs} /></> },
    { title: "Full deal construct", body: <DealConstruct meta={meta} inputs={inputs} result={result} /> },
    { title: "Flags", body: <Flags result={result} /> },
    { title: "Account summary (plain text)", body: <Summary result={result} meta={meta} /> },
    { title: "How this works", body: <><Methodology /><div style={{ height: 12 }} /><Sources /></> },
  ];
  return (
    <section className="dc-card dc-details">
      <h2>Details</h2>
      <p className="dc-note" style={{ marginTop: 0 }}>Everything behind the numbers above. Open what you need.</p>
      {sections.map((s) => (
        <details key={s.title} className="dc-group">
          <summary>{s.title}</summary>
          <div className="dc-details-body">{s.body}</div>
        </details>
      ))}
    </section>
  );
}
