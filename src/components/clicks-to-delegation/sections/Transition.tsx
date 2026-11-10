"use client";

import { Bot, Check, Store, MousePointerClick, UserRound } from "lucide-react";
import { useState } from "react";
import { ACTOR_LABEL, JOURNEYS, type Actor } from "@/lib/clicks-to-delegation/journeys";
import type { Era } from "@/lib/clicks-to-delegation/types";
import { Cite, Details, Ev, Fig, Section } from "../ui";

const ERA_META: Record<Era, { label: string; sub: string; icon: typeof Store }> = {
  physical: { label: "Physical commerce", sub: "The consumer visits the store", icon: Store },
  ecommerce: { label: "E-commerce", sub: "The store comes to the consumer", icon: MousePointerClick },
  agentic: { label: "Agentic commerce", sub: "The consumer delegates the work", icon: Bot },
};

/** Who holds each control point, per era (judgment; shares are visual weights, not measurements). */
const CONTROL: Record<Era, { row: string; parts: { who: string; w: number }[] }[]> = {
  physical: [
    { row: "Attention", parts: [{ who: "Retailer (location, shelf)", w: 70 }, { who: "Brand advertising", w: 30 }] },
    { row: "Decision", parts: [{ who: "Consumer", w: 80 }, { who: "Salesperson", w: 20 }] },
    { row: "Transaction", parts: [{ who: "Retailer", w: 100 }] },
  ],
  ecommerce: [
    { row: "Attention", parts: [{ who: "Search & marketplaces", w: 65 }, { who: "Retailer sites & apps", w: 35 }] },
    { row: "Decision", parts: [{ who: "Consumer", w: 85 }, { who: "Reviews & rankings", w: 15 }] },
    { row: "Transaction", parts: [{ who: "Retailer / marketplace", w: 100 }] },
  ],
  agentic: [
    { row: "Attention", parts: [{ who: "AI assistants & agents", w: 60 }, { who: "Retailers & marketplaces", w: 40 }] },
    { row: "Decision", parts: [{ who: "Agent (within mandate)", w: 45 }, { who: "Consumer approval", w: 55 }] },
    { row: "Transaction", parts: [{ who: "Merchant of record", w: 70 }, { who: "Agent / platform", w: 30 }] },
  ],
};

const ACTOR_ICON: Record<Actor, typeof UserRound> = { consumer: UserRound, retailer: Store, platform: MousePointerClick, agent: Bot, "merchant-agent": Store };

export default function Transition() {
  const [jid, setJid] = useState(JOURNEYS[0].id);
  const j = JOURNEYS.find((x) => x.id === jid) ?? JOURNEYS[0];
  return (
    <Section id="transition" num="01" title="The great commerce transition"
      dek="Physical commerce digitized nothing. E-commerce digitized discovery and the transaction. Agentic commerce may digitize the decision-maker. That hypothesis is only partly right."
      takeaway={<>The real shift is not a new channel. It is a change in <strong>who does the shopping work</strong>. In November 2026, AI has moved much of the <em>research</em> work but very little of the <em>purchase</em> decision. The battle to become the <strong>delegation layer</strong> is real, but it has not been won by anyone.</>}>

      <div className="ctd-grid3 ctd-eras">
        {(Object.keys(ERA_META) as Era[]).map((e) => {
          const M = ERA_META[e];
          return (
            <div key={e} className={`ctd-era ${e}`}>
              <div className="ctd-era-head"><M.icon size={18} /><div><b>{M.label}</b><span>{M.sub}</span></div></div>
              {CONTROL[e].map((r) => (
                <div key={r.row} className="ctd-ctrl">
                  <div className="ctd-ctrl-label">{r.row}</div>
                  <div className="ctd-ctrl-bar">
                    {r.parts.map((p, i) => <span key={p.who} className={i === 0 ? "a" : "b"} style={{ flexBasis: `${p.w}%` }} title={`${p.who}`}>{p.who}</span>)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <p className="ctd-small ctd-muted" style={{ marginTop: 8 }}><Ev kind="expert-judgment" /> Bar widths show where control sits, as this report&apos;s judgment. They are not measured shares.</p>

      <div className="ctd-grid2 ctd-block">
        <div className="ctd-card">
          <div className="ctd-h4">Testing the three-era hypothesis</div>
          <ul className="ctd-list">
            <li><b>Accurate:</b> each era moved a different kind of work. Stores moved goods closer to people; e-commerce moved discovery and payment onto screens; agents move <em>search, comparison and execution labor</em> into software.</li>
            <li><b>Too neat:</b> e-commerce also changed logistics and returns; agents so far change mainly information and transaction costs, and still depend on e-commerce&apos;s physical rails.</li>
            <li><b>Not yet true:</b> &ldquo;digitizing the decision-maker&rdquo; describes a minority of purchases in 2026. Most AI-influenced purchases are still decided and completed by a person.</li>
          </ul>
        </div>
        <div className="ctd-card">
          <div className="ctd-h4">Assistance is not autonomy</div>
          <div className="ctd-table-wrap" style={{ marginTop: 8 }}><table className="ctd-table">
            <thead><tr><th /><th>Chatbot recommends headphones</th><th>Agent manages recurring purchases</th></tr></thead>
            <tbody>
              <tr><td>Who decides</td><td>Consumer</td><td>Agent, within a mandate</td></tr>
              <tr><td>Who pays</td><td>Consumer, at a merchant</td><td>Agent, with delegated credential</td></tr>
              <tr><td>Economic effect</td><td>Moves influence (like search)</td><td>Moves the transaction and the default</td></tr>
              <tr><td>Trust needed</td><td>Low: advice can be ignored</td><td>High: errors cost money</td></tr>
              <tr><td>Who captures value</td><td>Advertising &amp; referral</td><td>Whoever owns the mandate</td></tr>
            </tbody>
          </table></div>
        </div>
      </div>

      <div className="ctd-block ctd-key">
        <Fig title="Visualization A · Three generations of the same task"
          sub="Pick a task to see who does each step in each era. Steps, decisions and approvals are counts from these diagrams, not measured time savings."
          controls={<div className="ctd-chips" role="group" aria-label="Choose a shopping task">{JOURNEYS.map((x) => <button key={x.id} type="button" className="ctd-chip" aria-pressed={x.id === jid} onClick={() => setJid(x.id)}>{x.task}</button>)}</div>}
          foot={<><Ev kind="illustrative" /> Journey diagrams, built from each era&apos;s typical flow. Counts measure the diagram, not real-world time.</>}>
          <p className="ctd-small ctd-muted" style={{ marginBottom: 12 }}>{j.brief}</p>
          <div className="ctd-journeys">
            {(Object.keys(ERA_META) as Era[]).map((e) => {
              const col = j.eras[e];
              const human = col.steps.filter((s) => s.actor === "consumer").length;
              const decisions = col.steps.filter((s) => s.decision && s.actor === "consumer").length;
              return (
                <div key={e} className={`ctd-journey ${e}`}>
                  <div className="ctd-journey-head"><span className={`ctd-sw ${e === "ecommerce" ? "ecom" : e}`} /><b>{ERA_META[e].label}</b></div>
                  <div className="ctd-journey-stats">
                    <span><b className="ctd-mono">{col.steps.length}</b> steps</span>
                    <span><b className="ctd-mono">{human}</b> by the consumer</span>
                    <span><b className="ctd-mono">{decisions}</b> consumer decisions</span>
                  </div>
                  <ol className="ctd-steps">
                    {col.steps.map((s, i) => {
                      const I = ACTOR_ICON[s.actor];
                      return (
                        <li key={i} className={`actor-${s.actor}`}>
                          <span className="ctd-step-icon" title={ACTOR_LABEL[s.actor]}><I size={13} /></span>
                          <div><span className="ctd-step-actor">{ACTOR_LABEL[s.actor]}{s.approval && <em><Check size={11} />approval</em>}</span><p>{s.text}</p></div>
                        </li>
                      );
                    })}
                  </ol>
                  <p className="ctd-journey-control">{col.control}</p>
                </div>
              );
            })}
          </div>
        </Fig>
      </div>

      <div className="ctd-block">
        <Details title="The central question: destination or delegation layer?">
          <p>In e-commerce, the strategic prize was to become the <strong>destination</strong> where shopping starts: the marketplace, the app, the homepage. The hypothesis is that the agentic prize is to become the <strong>delegation layer</strong>, the entity that consumers authorize to act for them.</p>
          <p><strong>Evidence for:</strong> every major platform launched agents, protocols or checkout integrations in 2025–26 (section 02). Payment networks are building agent credentials, which only matters if someone becomes the authorized party.<Cite ids={["a-google-merchant-ucp-help", "a-visa-tap", "a-yahoo-mc-santander"]} /></p>
          <p><strong>Evidence against:</strong> the biggest retailers are turning their own apps into agents (Amazon claims 400 million users of its shopping assistant in a year) and pulling transactions back to their own checkout. Standalone agentic checkout in general assistants has been narrowed or redesigned. And measured activity is overwhelmingly research and referral, not delegation. Cutting the other way, consumers use general AI chatbots for shopping about twice as often as retailers&apos; own assistants, so the destinations are not safe either.<Cite ids={["a-code3-alexa-400m", "a-mckinsey-who-wins", "a-cnbc-openai-revamp"]} /></p>
          <p><strong>Verdict:</strong> the delegation layer is a plausible future control point, but in 2026 it is contested between assistants, marketplaces, retailers and payment networks. Destinations are not obsolete; they may become the delegation layer themselves.</p>
        </Details>
      </div>
    </Section>
  );
}
