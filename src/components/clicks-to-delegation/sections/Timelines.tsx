"use client";

import { AlertTriangle, Quote, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { AGENT_EVENTS, AVAIL_VS_ADOPTION, HIST_EVENTS, INITIATIVES, PHASES, ROLLBACKS } from "@/lib/clicks-to-delegation/research";
import type { AgentCategory, HistPhase, Maturity } from "@/lib/clicks-to-delegation/types";
import { Cite, Details, Ev, Fig, Section } from "../ui";

const MATURITY: Record<Maturity, { name: string; help: string }> = {
  1: { name: "Announced", help: "Publicly announced; not usable." },
  2: { name: "Demonstrated", help: "Shown working in demos or developer previews." },
  3: { name: "Limited production", help: "Live for a subset of users, merchants or regions." },
  4: { name: "Commercially deployed", help: "Generally available to consumers or merchants." },
  5: { name: "Repeat usage shown", help: "Published evidence that users come back and repeat." },
  6: { name: "Economic value shown", help: "Published transaction volume or incremental value (company claims count, labeled)." },
};

const CAT_GROUPS: { id: string; label: string; cats: AgentCategory[] }[] = [
  { id: "all", label: "All", cats: [] },
  { id: "discovery", label: "Discovery & assistants", cats: ["discovery", "assistant"] },
  { id: "checkout", label: "Agents & checkout", cats: ["browser-agent", "native-checkout", "merchant-agent", "consumer-agent", "replenishment"] },
  { id: "rails", label: "Protocols & payments", cats: ["protocol", "payments"] },
  { id: "retreat", label: "Policy & rollbacks", cats: ["policy", "rollback"] },
];

const fmtDate = (d: string) => {
  if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(d)) return d;
  const [y, m, day] = d.split("-");
  if (!m) return y;
  const mon = new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-US", { month: "short" });
  return day ? `${mon} ${Number(day)}, ${y}` : `${mon} ${y}`;
};

export default function Timelines() {
  const [phase, setPhase] = useState<HistPhase>("1994-1999");
  const [group, setGroup] = useState("all");
  const [mat, setMat] = useState<Maturity | null>(null);
  const [initId, setInitId] = useState<string | null>(null);
  const P = PHASES.find((p) => p.id === phase) ?? PHASES[0];
  const histEvents = HIST_EVENTS.filter((e) => e.phase === phase).sort((a, b) => a.date.localeCompare(b.date));
  const g = CAT_GROUPS.find((x) => x.id === group) ?? CAT_GROUPS[0];
  const agentEvents = useMemo(() => AGENT_EVENTS.filter((e) => !g.cats.length || g.cats.includes(e.category)).sort((a, b) => a.date.localeCompare(b.date)), [g]);
  const byLevel = ([1, 2, 3, 4, 5, 6] as Maturity[]).map((l) => ({ l, items: INITIATIVES.filter((i) => i.maturity === l) }));
  const init = INITIATIVES.find((i) => i.id === initId);
  const verified = HIST_EVENTS.filter((e) => e.verification !== "unverified").length;

  return (
    <Section id="timelines" num="02" title="History repeats, until it doesn't"
      dek="Thirty years of e-commerce on the left; four years of AI commerce on the right. The right-hand column moves faster, but it also has more retreats."
      takeaway={<>E-commerce took <strong>about five years to reach 1% of US retail, sixteen to reach 5%</strong> and nearly twenty-eight to stay above 15%. AI shopping has moved from launch to scaled-back first attempts in under four years. <strong>Not one of {INITIATIVES.length} tracked initiatives has published evidence of repeat agent purchasing.</strong></>}>

      <div className="ctd-avail">
        {AVAIL_VS_ADOPTION.map((s) => (
          <div key={s.stage} className="ctd-avail-step">
            <span className="ctd-h4">{s.stage}</span>
            <b className="ctd-mono">{s.date}</b>
            <p>{s.evidence}<Cite ids={s.sourceIds} /> {s.verification === "unverified" && <span className="ctd-unv">not re-verified</span>}</p>
          </div>
        ))}
      </div>
      <p className="ctd-small ctd-muted" style={{ marginTop: 6 }}>Technology availability, consumer adoption, commercial viability and market dominance arrived years apart. A technology can be ready long before the behavior and economics are.</p>

      <div className="ctd-twin ctd-block">
        <Fig title="E-commerce, 1994–2026" sub={`${HIST_EVENTS.length} milestones in seven phases. ${verified} confirmed against sources in this pass; the rest are marked.`}
          controls={<div className="ctd-chips" role="group" aria-label="Phase">{PHASES.map((p) => <button key={p.id} type="button" className="ctd-chip" aria-pressed={p.id === phase} onClick={() => setPhase(p.id)}>{p.id}</button>)}</div>}>
          <div className="ctd-phase">
            <div className="ctd-phase-name"><span className="ctd-sw ecom" />{P.name}</div>
            <p className="ctd-phase-q">{P.question}</p>
            <p>{P.synthesis}</p>
            <div className="ctd-grid2 ctd-phase-meta">
              <div><span className="ctd-h4">Binding constraint</span><p>{P.constraint}</p></div>
              <div><span className="ctd-h4">What changed adoption</span><p>{P.unexpected}</p></div>
            </div>
            {P.skepticism?.map((q, i) => (
              <blockquote key={i} className="ctd-skeptic"><Quote size={14} /><div>&ldquo;{q.quote}&rdquo;<span> {q.who}, {q.date}<Cite ids={q.sourceIds} /></span></div></blockquote>
            ))}
          </div>
          <ol className="ctd-tl">
            {histEvents.map((e) => (
              <li key={e.id} className={e.verification === "unverified" ? "unv" : ""}>
                <span className="ctd-tl-date ctd-mono">{fmtDate(e.date)}</span>
                <div><b>{e.title}</b>{e.verification === "unverified" && <span className="ctd-unv">not re-verified</span>}<p>{e.significance}<Cite ids={e.sourceIds} /></p></div>
              </li>
            ))}
          </ol>
        </Fig>

        <Fig title="Agentic commerce, 2022–2026" sub={`${AGENT_EVENTS.length} dated events from ChatGPT's launch to November 2026, including retreats.`}
          controls={<div className="ctd-chips" role="group" aria-label="Event type">{CAT_GROUPS.map((c) => <button key={c.id} type="button" className="ctd-chip" aria-pressed={c.id === group} onClick={() => setGroup(c.id)}>{c.label}</button>)}</div>}>
          <ol className="ctd-tl agentic">
            {agentEvents.map((e) => (
              <li key={e.id} className={e.category === "rollback" ? "rollback" : ""}>
                <span className="ctd-tl-date ctd-mono">{fmtDate(e.date)}</span>
                <div><b>{e.title}</b><span className="ctd-tl-co">{e.company}{e.category === "rollback" && <> · <RotateCcw size={11} /> retreat</>}</span><p>{e.significance}<Cite ids={e.sourceIds} /></p></div>
              </li>
            ))}
          </ol>
        </Fig>
      </div>

      <div className="ctd-block ctd-key">
        <Fig title="Announcements are not adoption: the maturity ladder"
          sub="Every tracked initiative placed on a six-step evidence ladder. Click a level or an initiative for the evidence."
          foot={<><Ev kind="expert-judgment" /> Placement is this report&apos;s classification of the cited evidence. Level-6 placements rest on <Ev kind="company-claim" /> figures.</>}>
          <div className="ctd-ladder6" role="list">
            {byLevel.map(({ l, items }) => (
              <div key={l} role="listitem" className={`ctd-lvl ${mat === l ? "on" : ""}`}>
                <button type="button" className="ctd-lvl-head" aria-pressed={mat === l} onClick={() => setMat(mat === l ? null : l)}>
                  <span className="ctd-mono">{l}</span><b>{MATURITY[l].name}</b><span className="ctd-lvl-n ctd-mono">{items.length}</span>
                </button>
                <div className="ctd-lvl-bar"><i style={{ height: `${Math.max(4, (items.length / Math.max(...byLevel.map((x) => x.items.length))) * 100)}%` }} /></div>
                <div className="ctd-lvl-items">
                  {items.length === 0 && <span className="ctd-muted ctd-small">None with published evidence</span>}
                  {items.map((i) => <button key={i.id} type="button" className={`ctd-init ${initId === i.id ? "on" : ""}`} onClick={() => setInitId(initId === i.id ? null : i.id)}>{i.company}<span>{i.name}</span></button>)}
                </div>
              </div>
            ))}
          </div>
          {mat && <p className="ctd-small" style={{ marginTop: 10 }}><b>Level {mat}, {MATURITY[mat].name}:</b> {MATURITY[mat].help}</p>}
          {init && (
            <div className="ctd-init-detail">
              <div className="ctd-fig-title">{init.company}: {init.name} <span className="ctd-tag">Level {init.maturity} · {MATURITY[init.maturity].name}</span></div>
              <p>{init.what}</p>
              <div className="ctd-grid2">
                <div><span className="ctd-h4">Why this level</span><p>{init.maturityEvidence}</p></div>
                <div><span className="ctd-h4">Status, Nov 2026</span><p>{init.status2026}</p></div>
                {init.companyClaims && <div><span className="ctd-h4">Company claims <Ev kind="company-claim" /></span><p>{init.companyClaims}</p></div>}
                {init.independentEvidence && <div><span className="ctd-h4">Independent evidence</span><p>{init.independentEvidence}</p></div>}
              </div>
              <p className="ctd-small ctd-muted">Launched: {init.launched}<Cite ids={init.sourceIds} /></p>
            </div>
          )}
        </Fig>
      </div>

      <div className="ctd-block ctd-deep">
        <Details title={<span><AlertTriangle size={15} style={{ verticalAlign: -2, marginRight: 6 }} />Launches that were scaled back, redesigned or discontinued ({ROLLBACKS.length})</span>} open>
          <ol className="ctd-tl">
            {[...ROLLBACKS].sort((a, b) => a.date.localeCompare(b.date)).map((r, i) => (
              <li key={i} className="rollback"><span className="ctd-tl-date ctd-mono">{fmtDate(r.date)}</span><div><b>{r.company}</b><p>{r.what}<Cite ids={r.sourceIds} /></p></div></li>
            ))}
          </ol>
        </Details>
      </div>
    </Section>
  );
}
