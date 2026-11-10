"use client";

import { useState } from "react";
import { DELEGATION_SCENARIOS, LADDER, SURVEYS, TRUST_HISTORY } from "@/lib/clicks-to-delegation/research";
import { SOURCE_BY_ID } from "@/lib/clicks-to-delegation/sources";
import type { DelegationLevel } from "@/lib/clicks-to-delegation/types";
import { Cite, Details, Ev, Fig, Section, useTableToggle } from "../ui";

const STRIP_COLS = [
  { id: "research", label: "Research & compare", ladder: "Stages 2–3" },
  { id: "cart", label: "Prepare the basket", ladder: "Stage 4" },
  { id: "approved-purchase", label: "Complete a purchase", ladder: "Stage 5" },
  { id: "autonomous", label: "Buy autonomously", ladder: "Stages 6–7" },
] as const;
/** Stated willingness (general population, all categories) and measured behavior, curated for comparability of intent. */
const STATED = ["visa-compare", "worldpay-browse-us", "accenture-decide", "visa-complete", "bain-comfort", "contentsquare-complete", "pwc-anz", "riskified-comfort-2025", "accenture-auto", "worldpay-auto-2025", "visa-nolimits", "nmi-full", "doss-auto", "mc-one-in-ten"];
const BEHAVIOR = ["mck-ai-shop-use", "ms-ai-purchase", "riskified-done-2025", "alexa-2018"];

const LEVELS: { id: DelegationLevel | "human"; label: string; help: string }[] = [
  { id: "human", label: "Human-led", help: "AI informs at most" },
  { id: "assist", label: "AI assistance", help: "Research, compare, recommend" },
  { id: "supervised", label: "Supervised execution", help: "Agent prepares and buys after approval" },
  { id: "bounded", label: "Bounded autonomy", help: "Agent buys within standing limits" },
];

/** Task-level breakdown per scenario: this report's judgment. */
const TASKS: Record<string, { task: string; level: DelegationLevel | "human" }[]> = {
  grocery: [{ task: "Draft the basket from past orders and meal plan", level: "bounded" }, { task: "Choose the cheapest equivalent staples", level: "bounded" }, { task: "Substitute out-of-stock items", level: "supervised" }, { task: "Pick fresh produce and new items", level: "assist" }, { task: "Approve the weekly total", level: "supervised" }],
  household: [{ task: "Predict run-out dates", level: "bounded" }, { task: "Reorder the usual brand under a monthly cap", level: "bounded" }, { task: "Switch to a cheaper equivalent", level: "supervised" }, { task: "Try a new product type", level: "assist" }],
  headphones: [{ task: "Shortlist models against stated needs", level: "assist" }, { task: "Compare total price, delivery and return terms", level: "assist" }, { task: "Choose the model", level: "human" }, { task: "Execute checkout once chosen", level: "supervised" }, { task: "Track delivery and file a return", level: "bounded" }],
  travel: [{ task: "Assemble complete itineraries", level: "assist" }, { task: "Choose destination and itinerary", level: "human" }, { task: "Book approved components", level: "supervised" }, { task: "Rebook after disruption under a price cap", level: "supervised" }, { task: "Watch fares and alert", level: "bounded" }],
  luxury: [{ task: "Research provenance, authenticity and availability", level: "assist" }, { task: "Choose the item", level: "human" }, { task: "Purchase", level: "human" }, { task: "Track delivery and warranty", level: "assist" }],
  car: [{ task: "Narrow models and compare total cost of ownership", level: "assist" }, { task: "Gather dealer quotes", level: "supervised" }, { task: "Test drive, decide and negotiate", level: "human" }, { task: "Sign financing and purchase", level: "human" }],
  "enterprise-software": [{ task: "Map requirements and shortlist vendors", level: "assist" }, { task: "Collect security and compliance documents", level: "supervised" }, { task: "Run trials and decide", level: "human" }, { task: "Renew within approved budget and terms", level: "supervised" }],
};

export default function Ladder() {
  const [sid, setSid] = useState(DELEGATION_SCENARIOS[0]?.id ?? "grocery");
  const [hover, setHover] = useState<string | null>(null);
  const { table, toggle } = useTableToggle();
  const s = DELEGATION_SCENARIOS.find((x) => x.id === sid) ?? DELEGATION_SCENARIOS[0];
  const points = [...STATED.map((id) => ({ id, behavior: false })), ...BEHAVIOR.map((id) => ({ id, behavior: true }))]
    .map(({ id, behavior }) => ({ behavior, f: SURVEYS.find((x) => x.id === id) }))
    .filter((p): p is { behavior: boolean; f: NonNullable<typeof p.f> } => Boolean(p.f && p.f.numeric != null));
  const W = 760, H = 300, L = 46, R = 20, T = 18, B = 36;
  const colW = (W - L - R) / STRIP_COLS.length;
  const y = (v: number) => T + (1 - v / 80) * (H - T - B);
  const hp = points.find((p) => p.f.id === hover);

  return (
    <Section id="ladder" num="06" title="The consumer delegation ladder"
      dek="Consumers climbed from browsing to paying online over about a decade. Delegation has seven rungs, and willingness falls at nearly every step up."
      takeaway={<>Stated willingness falls from <strong>roughly half</strong> for AI research and comparison to <strong>roughly a third</strong> for AI-completed purchases, and to <strong>6–10% in most surveys</strong> for true autonomy. Wording moves results a lot: one survey found 27%. Measured behavior sits lower still. History says the gap closes when <strong>someone else carries the risk</strong> (zero-liability cards, escrow, cash on delivery), not when the technology improves.</>}>

      <div className="ctd-ladder">
        {LADDER.map((l) => (
          <div key={l.stage} className="ctd-rung" style={{ ["--i" as string]: l.stage }}>
            <div className="ctd-rung-n ctd-mono">{l.stage}</div>
            <div className="ctd-rung-body">
              <b>{l.name}</b>
              <p>{l.definition}</p>
              <p className="ctd-rung-ecom ctd-deep"><span className="ctd-h4">E-commerce equivalent</span> {l.ecomEquivalent}</p>
              <p className="ctd-rung-ev ctd-deep">{l.evidence}<Cite ids={l.sourceIds} /></p>
            </div>
          </div>
        ))}
      </div>

      <div className="ctd-block ctd-key">
        <Fig title="Willingness falls as authority rises"
          sub="Each dot is one survey (US or multi-market, all categories). Questions differ, so dots are not connected and cannot be averaged. Squares are measured or self-reported behavior, not intent."
          controls={toggle}
          foot={<><span><svg width="12" height="12" aria-hidden><circle cx="6" cy="6" r="5" fill="#2a78d6" /></svg> Stated willingness <Ev kind="survey" /></span><span><svg width="12" height="12" aria-hidden><rect x="1" y="1" width="10" height="10" fill="#14213d" /></svg> Reported behavior</span></>}>
          {table ? (
            <div className="ctd-table-wrap"><table className="ctd-table"><thead><tr><th>Stage</th><th>Finding</th><th>Value</th><th>Base</th><th>Period</th></tr></thead>
              <tbody>{points.map(({ f, behavior }) => <tr key={f.id}><td>{STRIP_COLS.find((c) => c.id === f.stage)?.label}</td><td>{f.finding}{behavior ? " (behavior)" : ""}<Cite ids={f.sourceIds} /></td><td className="n">{f.numeric}%</td><td>{f.denominator}</td><td>{f.period}</td></tr>)}</tbody></table></div>
          ) : (
            <div className="ctd-strip">
              <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Strip plot of consumer willingness by delegation stage">
                {[0, 20, 40, 60, 80].map((v) => <g key={v}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#e2ddd2" /><text x={L - 8} y={y(v) + 4} fontSize={11} textAnchor="end" fill="#6b7285">{v}%</text></g>)}
                {STRIP_COLS.map((c, ci) => {
                  const cx = L + colW * ci + colW / 2;
                  const col = points.filter((p) => p.f.stage === c.id);
                  return (
                    <g key={c.id}>
                      <text x={cx} y={H - 16} fontSize={12} textAnchor="middle" fill="#14213d" fontWeight={600}>{c.label}</text>
                      <text x={cx} y={H - 3} fontSize={10.5} textAnchor="middle" fill="#6b7285">{c.ladder}</text>
                      {col.map((p, i) => {
                        const off = (i - (col.length - 1) / 2) * 14;
                        const py = y(Math.min(80, p.f.numeric as number));
                        const on = hover === p.f.id;
                        return (
                          <g key={p.f.id} tabIndex={0} role="button" aria-label={`${p.f.finding}: ${p.f.numeric}%`} onMouseEnter={() => setHover(p.f.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p.f.id)} onBlur={() => setHover(null)} style={{ cursor: "pointer" }}>
                            <circle cx={cx + off} cy={py} r={14} fill="transparent" />
                            {p.behavior
                              ? <rect x={cx + off - 5} y={py - 5} width={10} height={10} fill="#14213d" stroke="#fcfbf8" strokeWidth={2} />
                              : <circle cx={cx + off} cy={py} r={on ? 7 : 5.5} fill="#2a78d6" stroke="#fcfbf8" strokeWidth={2} />}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
              {hp && (
                <div className="ctd-tip ctd-strip-tip">
                  <b>{hp.f.numeric}%</b> · {hp.f.finding}
                  <div className="ctd-muted">{SOURCE_BY_ID[hp.f.sourceIds[0]]?.publisher} · {hp.f.period} · {hp.f.geo}</div>
                  <div className="ctd-muted">Base: {hp.f.denominator}</div>
                </div>
              )}
            </div>
          )}
        </Fig>
      </div>

      <div className="ctd-block">
        <Fig title="How much shopping would you delegate?"
          sub="Pick a purchase to see which tasks are candidates for AI assistance, supervised execution or bounded autonomy. This shows the researched framework; it does not measure you."
          controls={<div className="ctd-chips" role="group" aria-label="Purchase scenario">{DELEGATION_SCENARIOS.map((x) => <button key={x.id} type="button" className="ctd-chip" aria-pressed={x.id === sid} onClick={() => setSid(x.id)}>{x.name}</button>)}</div>}
          foot={<><Ev kind="expert-judgment" /> Task levels are this report&apos;s judgment, informed by the category survey evidence cited.</>}>
          <div className="ctd-delegate">
            <div className="ctd-levels" role="list">
              {LEVELS.map((lv) => (
                <div key={lv.id} role="listitem" className={`ctd-level ${s.level === lv.id ? "rec" : ""}`}>
                  <b>{lv.label}</b><span>{lv.help}</span>
                  <ul>{(TASKS[s.id] ?? []).filter((t) => t.level === lv.id).map((t) => <li key={t.task}>{t.task}</li>)}</ul>
                  {s.level === lv.id && <em>Overall ceiling for this purchase</em>}
                </div>
              ))}
            </div>
            <div className="ctd-grid3">
              <div><span className="ctd-h4">Why</span><p>{s.why}<Cite ids={s.sourceIds} /></p></div>
              <div><span className="ctd-h4">Key risks</span><ul className="ctd-list">{s.risks.map((r) => <li key={r}>{r}</li>)}</ul></div>
              <div><span className="ctd-h4">Commercial implication</span><p>{s.commercial}</p></div>
            </div>
          </div>
        </Fig>
      </div>

      <div className="ctd-block ctd-deep">
        <Details title="What closed the trust gap last time (e-commerce trust barriers and their fixes)" open>
          <div className="ctd-table-wrap">
            <table className="ctd-table">
              <thead><tr><th>Barrier</th><th>What resolved it</th><th>When</th></tr></thead>
              <tbody>{TRUST_HISTORY.map((t) => <tr key={t.barrier}><td>{t.barrier}</td><td>{t.whatResolvedIt}<Cite ids={t.sourceIds} /></td><td>{t.date}</td></tr>)}</tbody>
            </table>
          </div>
          <p><strong>What&apos;s different now:</strong> every historical fix protected a consumer who had personally chosen and clicked. Delegation adds a new question no card rule answers yet: <em>who is liable when the consumer did not choose the item?</em> In one 2026 survey, about half of respondents said the AI platform should be.<Cite ids={SURVEYS.find((x) => x.id === "riskified-liability")?.sourceIds} /></p>
        </Details>
      </div>
    </Section>
  );
}
