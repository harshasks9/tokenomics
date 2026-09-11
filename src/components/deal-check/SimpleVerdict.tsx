"use client";

import { RANK_LABEL, type GeminiPlay, type Result, type ReverseSolve } from "@/lib/deal-check/engine";
import { usd } from "@/lib/deal-check/format";
import { changeSentence } from "@/lib/deal-check/summary";
import { threeSentences } from "@/lib/deal-check/explain";
import CostBars from "./CostBars";

export default function Verdict({ result, solve, play, customer }: { result: Result; solve: ReverseSolve; play: GeminiPlay; customer?: string }) {
  const { inputs: i } = result;
  const google = result.advantage >= 0;
  const headline = result.rank === "close"
    ? `Too close to call: ${usd(Math.abs(result.advantage))} apart over ${result.horizon} months`
    : google ? `Google saves ${usd(result.advantage)} over ${result.horizon} months` : `AWS is cheaper by ${usd(-result.advantage)} over ${result.horizon} months`;
  const playLine = play.winsNow
    ? (i.geminiShare > 0 ? `With ${i.geminiShare}% of the traffic on Gemini, Google is ahead and the Anthropic bill is ${i.geminiShare}% lower.` : play.minShare === 0 ? "Google is ahead without moving any traffic to Gemini." : "Google is ahead.")
    : play.minShare === null ? "No amount of Gemini offload beats AWS with these assumptions." : `Serve ${play.minShare.toFixed(0)}% of the traffic with Gemini and Google beats AWS; the rest stays on Anthropic with credits.`;
  const flip = solve.smallest ? changeSentence(solve.smallest, solve.gcpAhead) : solve.gcpAhead ? "No single input in the tested ranges flips the verdict to AWS." : "No single input in the tested ranges flips the verdict to Google.";
  const [s1, s2, s3] = threeSentences(result);
  return (
    <section className="dc-hero simple" aria-label="Verdict">
      <div className="dc-hero-main">
        <div className="dc-hero-rank"><span className={`dc-pill ${result.rank}`}>{RANK_LABEL[result.rank]}</span>{customer && <span className="dc-hero-when">{customer}</span>}</div>
        <h1 className="dc-hero-head">{headline}</h1>
        {result.doNothingBest && <div className="dc-hero-line"><b>Note</b> Staying put with no program is cheaper than both.</div>}
        <div className="dc-hero-line"><b>The play</b> {playLine}</div>
        <div className="dc-hero-line"><b>Biggest lever</b> {flip}</div>
      </div>
      <div className="dc-hero-side">
        <CostBars result={result} />
      </div>
      <div className="dc-hero-three">
        <div className="dc-three"><span className="dc-swatch aws" />{s1}</div>
        <div className="dc-three"><span className="dc-swatch google" />{s2}</div>
        <div className="dc-three"><span className="dc-swatch nothing" />{s3}</div>
      </div>
    </section>
  );
}
