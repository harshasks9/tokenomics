"use client";

import { ArrowRight, Quote } from "lucide-react";
import { useState } from "react";
import { CASES } from "@/lib/clicks-to-delegation/research";
import type { CaseStudy } from "@/lib/clicks-to-delegation/types";
import { Cite, Details, Ev, Fig, Section } from "../ui";

const ARCH: { id: CaseStudy["archetype"]; label: string; q: string }[] = [
  { id: "early-successful", label: "Early and successful", q: "Pioneers who built durable advantages" },
  { id: "early-unsuccessful", label: "Early and unsuccessful", q: "Right about demand, wrong about timing, economics or execution" },
  { id: "late-successful", label: "Late and successful", q: "Incumbents that used existing assets once the model worked" },
  { id: "late-unsuccessful", label: "Late and unsuccessful", q: "Delayed capability-building past the point of adaptation" },
  { id: "mixed", label: "Mixed outcomes", q: "Early leaders that later lost position, or partial wins" },
];

const SIM_LABEL = { strong: "Strong parallel", partial: "Partial parallel", weak: "Weak parallel" };

export default function Cases() {
  const [id, setId] = useState("borders");
  const c = CASES.find((x) => x.id === id) ?? CASES[0];
  return (
    <Section id="cases" num="04" title="The companies that got it right and wrong"
      dek={`${CASES.length} companies, reconstructed at the moment of decision. The lesson is rarely "be early". It is "build the capability you will need, and keep the customer".`}
      takeaway={<>Timing explains less than capability. Webvan and Pets.com were early and right about demand; Walmart and Best Buy were late and survived. The common thread among winners is <strong>compounding capabilities kept in-house</strong> (logistics, payments, merchant tools, customer data). Among losers it is <strong>outsourcing the customer</strong> (Borders, Toys &ldquo;R&rdquo; Us) or <strong>building far ahead of demand</strong> (Webvan), usually on top of financing problems that had nothing to do with the internet.</>}>

      <div className="ctd-arch">
        {ARCH.map((a) => {
          const items = CASES.filter((x) => x.archetype === a.id);
          if (!items.length) return null;
          return (
            <div key={a.id} className={`ctd-arch-col ${a.id}`}>
              <div className="ctd-arch-head"><b>{a.label}</b><span>{a.q}</span></div>
              <div className="ctd-arch-cards">
                {items.map((x) => (
                  <button key={x.id} type="button" className={`ctd-case-card ${x.id === id ? "on" : ""}`} aria-pressed={x.id === id} onClick={() => { setId(x.id); document.getElementById("case-detail")?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }}>
                    <b>{x.name}</b><span>{x.market}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ctd-block ctd-key" id="case-detail">
        <Fig title={`Visualization C · History rhymes: ${c.name}`} sub={c.archetypeWhy}
          foot={<><Ev kind="expert-judgment" /> Archetype, parallel and similarity are this report&apos;s judgment; dated facts carry citations.</>}>
          <div className="ctd-rhyme">
            <div className="ctd-rhyme-step"><span className="ctd-h4">Historical decision</span><p>{c.decision}</p></div>
            <ArrowRight className="ctd-rhyme-arrow" size={18} />
            <div className="ctd-rhyme-step"><span className="ctd-h4">Immediate benefit</span><p>{c.immediateBenefit}</p></div>
            <ArrowRight className="ctd-rhyme-arrow" size={18} />
            <div className="ctd-rhyme-step"><span className="ctd-h4">Hidden trade-off</span><p>{c.hiddenTradeoff}</p></div>
            <ArrowRight className="ctd-rhyme-arrow" size={18} />
            <div className="ctd-rhyme-step"><span className="ctd-h4">Eventual outcome</span><p>{c.outcome}</p></div>
          </div>
          <div className="ctd-parallel">
            <div>
              <span className="ctd-h4">The agentic commerce parallel</span>
              <p className="ctd-parallel-text">{c.agenticParallel}</p>
              <span className={`ctd-sim ${c.similarity}`}>{SIM_LABEL[c.similarity]}</span> <span className="ctd-small ctd-muted">{c.similarityWhy}</span>
            </div>
            <div className="ctd-grid2">
              <div><span className="ctd-h4">Evidence the analogy holds</span><ul className="ctd-list">{c.evidenceFor.map((e) => <li key={e}>{e}</li>)}</ul></div>
              <div><span className="ctd-h4">Evidence it doesn&apos;t</span><ul className="ctd-list">{c.evidenceAgainst.map((e) => <li key={e}>{e}</li>)}</ul></div>
            </div>
            <div className="ctd-grid2">
              <div><span className="ctd-h4">Possible future consequence</span><p>{c.futureConsequence}</p></div>
              <div className="ctd-lesson"><span className="ctd-h4">Lesson to test today</span><p>{c.lessonTest}</p></div>
            </div>
          </div>
          {c.thesisQuote?.text && (
            <blockquote className="ctd-skeptic"><Quote size={14} /><div>&ldquo;{c.thesisQuote.text}&rdquo;<span> {c.thesisQuote.who}, {c.thesisQuote.date}<Cite ids={c.thesisQuote.sourceIds} /></span></div></blockquote>
          )}
          <div className="ctd-deep" style={{ marginTop: 16 }}>
            <div className="ctd-grid2 ctd-case-deep">
              <Field label="Position before the transition" text={c.positionBefore} />
              <Field label="Strategic thesis at the time" text={c.thesis} />
              <Field label="Built vs outsourced" text={c.investments} />
              <Field label="Consumer behavior it bet on" text={c.anticipatedBehavior} />
              <Field label="The economics behind it" text={c.economics} />
              <Field label="Root cause, separating e-commerce from everything else" text={c.rootCause} />
              <Field label="Alternative interpretation" text={c.alternativeInterpretation} />
              <Field label="What competitors did differently" text={c.competitorsDidDifferently} />
              <Field label="What it could plausibly have done instead" text={c.plausibleAlternative} />
            </div>
            <div style={{ marginTop: 14 }}>
              <Details title={`Decision timeline (${c.timeline.length} dated events)`} open>
                <ol className="ctd-tl">
                  {c.timeline.map((t, i) => <li key={i}><span className="ctd-tl-date ctd-mono">{t.date}</span><div><p>{t.event}<Cite ids={t.sourceIds} /></p></div></li>)}
                </ol>
                <p className="ctd-small ctd-muted">All sources for this case<Cite ids={c.sourceIds} /></p>
              </Details>
            </div>
          </div>
        </Fig>
      </div>
    </Section>
  );
}

function Field({ label, text }: { label: string; text: string }) {
  return <div><span className="ctd-h4">{label}</span><p>{text}</p></div>;
}
