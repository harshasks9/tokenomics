"use client";

import { useState } from "react";
import { INSIGHTS } from "@/lib/clicks-to-delegation/insights";
import { Cite, Ev, Section } from "../ui";

export default function Insights() {
  const [open, setOpen] = useState<string | null>("i1");
  return (
    <Section id="insights" num="→" title="Ten non-obvious insights"
      dek="Derived after the evidence was assembled, not decided in advance. Each states the history behind it, the mechanism, a counterargument, a confidence score and a prediction that could prove it wrong."
      takeaway={<>If you read one thing: <strong>2026&apos;s retreats were a signal, not a setback</strong>. The first attempt to move the transaction into the AI interface was beaten by merchants&apos; own checkout. The fight has moved to <strong>influence</strong> (ads and rankings inside answers) and to the <strong>defaults</strong> persistent agents will set. Plan for both.</>}>
      <ol className="ctd-insights">
        {INSIGHTS.map((x, i) => {
          const on = open === x.id;
          return (
            <li key={x.id} className={`ctd-insight ${on ? "open" : ""}`}>
              <button type="button" className="ctd-insight-head" aria-expanded={on} onClick={() => setOpen(on ? null : x.id)}>
                <span className="ctd-insight-n ctd-mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="ctd-insight-h">{x.headline}</span>
                <span className="ctd-conf-meter" aria-label={`Confidence ${x.confidence} of 100`}><i style={{ width: `${x.confidence}%` }} /><b className="ctd-mono">{x.confidence}</b></span>
              </button>
              {on && (
                <div className="ctd-insight-body">
                  <div className="ctd-grid2">
                    <div><span className="ctd-h4">Historical evidence</span><p>{x.history}</p></div>
                    <div><span className="ctd-h4">Agentic mechanism</span><p>{x.mechanism}<Cite ids={x.sourceIds} /></p></div>
                    <div><span className="ctd-h4">Economic consequence</span><p>{x.economics}</p></div>
                    <div><span className="ctd-h4">Counterargument</span><p>{x.counter}</p></div>
                  </div>
                  <div className="ctd-prediction"><span className="ctd-h4">Falsifiable prediction</span><p>{x.prediction}</p></div>
                  <div className="ctd-implication"><span className="ctd-h4">For retail executives</span><p>{x.implication}</p></div>
                  <p className="ctd-small ctd-muted">Tests {x.tests} · Confidence {x.confidence}/100 <Ev kind="expert-judgment" /></p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="ctd-close">
        <div className="ctd-kicker">The question for 2035</div>
        <blockquote>In 2035, which decisions made by retailers in 2026 will look as consequential as the decisions Amazon, Walmart, Borders and Webvan made during the birth of e-commerce?</blockquote>
        <p className="ctd-dek" style={{ margin: "18px auto 0", textAlign: "center" }}>Our answer: the ones that decided <em>who holds the customer&apos;s mandate</em>, and the ones that bet the company on behavior no one had yet measured.</p>
      </div>
    </Section>
  );
}
