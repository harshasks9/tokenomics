"use client";

import { fmtInt, fmtMoney } from "@/lib/ge-citizen/economics";
import { useEcon } from "./EconContext";
import { Section } from "./ui";

export default function Summary() {
  const { inputs: i, out: o } = useEcon();
  const works = o.contribution >= 0;

  const answers = [
    {
      q: "Who should we launch for first?",
      a: "A digitally mature city of 0.5–3 million residents that already takes payments online and runs a service-request line. Buyer: the mayor's office with the city CIO.",
      why: "The most frequent citizen journeys are municipal; three to five integrations cover them; one decision-maker; results within a budget cycle. A working city becomes the proof a state or national buyer asks for.",
    },
    {
      q: "What would citizens actually use?",
      a: "Checking and scheduling bills, reporting and tracking street problems, renewal and deadline reminders, and one front door for procedures — in their own language.",
      why: "These rank highest on frequency and ease. Benefits, permits and business formation follow in months 4–12, with human review.",
    },
    {
      q: "Can it work at about $2 per citizen per year?",
      a: works
        ? `Under the current assumptions, yes: ${fmtMoney(o.revenue)} revenue against ${fmtMoney(o.runCost)} delivery cost — a ${(o.margin * 100).toFixed(0)}% margin — with headroom up to ~${fmtInt(o.breakEvenInteractions)} sessions per active citizen per month.`
        : `Not under the current assumptions: delivery cost of ${fmtMoney(o.runCost)} exceeds ${fmtMoney(o.revenue)} revenue. Cap usage, change the service mix, or raise the price.`,
      why: `Three conditions, two of them built into the Gemini agent: hard budget caps per resident, smart routing so most sessions run on a low-cost model, and setup (${fmtMoney(i.integration)} here) contracted separately from the $${i.price.toFixed(2)}.`,
    },
  ];

  return (
    <Section id="gec-summary" eyebrow="8 · Executive summary" title="Start with one city, four services and a hard usage cap">
      <div className="rounded-2xl bg-[#0B1F3A] p-6 text-white sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#8AB4F8]">Recommendation</p>
        <p className="mt-2 max-w-4xl text-[20px] font-semibold leading-snug sm:text-[24px]">
          Launch GE for Citizen with a digitally mature mid-size city: a 90-day pilot on bills, street reports, reminders and a
          procedures front door, priced at ${i.price.toFixed(2)} per covered resident per year with integration funded separately —
          then replicate to peer cities and offer the state or national government a proven template.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {answers.map((x) => (
          <div key={x.q} className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <p className="text-[12px] font-semibold text-[#1A73E8]">{x.q}</p>
            <p className="mt-2 text-[15px] font-semibold leading-snug text-[#202124]">{x.a}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#5F6368]">{x.why}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#C6DAFC] bg-[#F4F8FE] p-5">
        <p className="text-[14px] font-semibold text-[#174EA6]">Why now: it is where the product is going</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#3C4043]">
          The Gemini agent is becoming one always-on agent per person with skills, connectors, event triggers, subagents,
          approval gates, agent identity and hard budget caps. Those are the building blocks of a citizen agent. A government
          that adopts it for staff can extend it to residents on the same governance, connectors and cost controls — adding only
          the citizen layer: consent, carer delegation, public identity and accessibility.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E8EAED] bg-[#F8F9FA] p-5">
        <p className="text-[14px] font-semibold text-[#202124]">Decisions needed to start</p>
        <ol className="mt-2 grid gap-2 text-[13px] text-[#3C4043] md:grid-cols-2">
          <li>1. Name the pilot city and its executive sponsor.</li>
          <li>2. Confirm identity, billing, payment and service-request systems can be connected in 30 days.</li>
          <li>3. Agree the day-90 go signals and who measures the baseline.</li>
          <li>4. Agree the setup budget and whether partner enablement funds part of it.</li>
          <li>5. Confirm which Gemini agent capabilities are available to a public-sector tenant in the city&apos;s jurisdiction.</li>
        </ol>
      </div>
    </Section>
  );
}
