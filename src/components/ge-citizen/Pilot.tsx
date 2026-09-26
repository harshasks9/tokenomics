"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { USE_CASES } from "@/lib/ge-citizen/data";
import { Basis, ClassBadge, Section } from "./ui";

const PILOT_SERVICES = ["bills", "reports", "reminders", "procedures"];

const PHASES = [
  {
    days: "Days 1–30",
    title: "Connect and baseline",
    items: [
      "Federate sign-in with the government identity provider",
      "Connect billing (read), payment provider, service-request system",
      "Load and review official procedure content; set refusal rules",
      "Stand up consent records, audit log, usage caps and human hand-off",
      "Measure today's baseline for every success metric",
    ],
  },
  {
    days: "Days 31–60",
    title: "Invited cohort",
    items: [
      "Open to an invited cohort — e.g., residents of two districts plus city staff",
      "Channels: web, the city app and one messaging channel",
      "Weekly review of transcripts sampled for accuracy, tone and escalations",
      "Accessibility and language testing with community organizations",
    ],
  },
  {
    days: "Days 61–90",
    title: "Open and decide",
    items: [
      "Open city-wide with a publicity push at points of service",
      "Compare every metric against the day-30 baseline",
      "Go / adjust / stop decision with the mayor's office and finance",
      "Scope the next service cluster and the contract for year one",
    ],
  },
];

const METRICS = [
  { m: "Active citizens", d: "Residents with at least one completed session in the month", t: "Growing month on month" },
  { m: "Completed transactions", d: "Payments scheduled, reports filed, renewals submitted through the agent", t: "Share of digital volume rising" },
  { m: "Time saved", d: "Median minutes per task vs baseline channel, from timed task studies", t: "Material reduction on each pilot service" },
  { m: "Payment completion", d: "Bills paid on time among agent users vs a comparable group", t: "Higher than comparison group" },
  { m: "Service resolution", d: "Street reports closed and time to close; duplicates merged", t: "No slower than baseline; fewer duplicates" },
  { m: "Satisfaction", d: "Post-task rating and a free-text sample reviewed weekly", t: "Set with the city before launch" },
  { m: "Avoided contacts", d: "Calls and counter visits for pilot services vs baseline, adjusted for season", t: "Measurable decline" },
  { m: "Safety & accuracy", d: "Sampled answers checked against source; escalations handled; complaints", t: "Zero unresolved harmful errors" },
];

const STAGES = [
  { when: "Months 0–3", title: "Pilot", scope: "1 city · 4 services · invited then open", buyer: "Mayor's office + CIO" },
  { when: "Months 4–12", title: "City-wide", scope: "8–12 services: add permits, school enrolment, benefits (with human review)", buyer: "Same buyer, annual per-citizen contract" },
  { when: "Year 2", title: "Peer cities", scope: "Replicate on cities running the same billing and service-request systems; consortia for small towns", buyer: "Peer cities, municipal associations" },
  { when: "Year 2–3", title: "State or national", scope: "Shared front door; ministries and agencies join as specialist agents, as in the project's reference architecture", buyer: "State CIO or national digital agency" },
];

export default function Pilot() {
  const [phase, setPhase] = useState(0);
  return (
    <Section
      id="gec-pilot"
      eyebrow="6 · Pilot & roadmap"
      title="A 90-day pilot in one city, then expand by service and by peer"
      lede={
        <>
          Recommended first buyer: the mayor&apos;s office of a digitally mature city of 0.5–3 million residents that already takes
          payments online and runs a service-request line. Four services, chosen because they are frequent, integrable and
          measurable.
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PILOT_SERVICES.map((id) => {
          const u = USE_CASES.find((x) => x.id === id)!;
          return (
            <div key={id} className="rounded-xl border border-[#E8EAED] bg-white p-4">
              <p className="text-[14px] font-semibold leading-snug text-[#202124]">{u.name}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {u.classes.map((c) => (
                  <ClassBadge key={c} c={c} size="xs" />
                ))}
              </div>
              <p className="mt-2 text-[12px] leading-snug text-[#5F6368]">{u.metric}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-[#E8EAED] bg-white">
        <div className="flex border-b border-[#E8EAED]" role="tablist">
          {PHASES.map((p, k) => (
            <button
              key={p.days}
              role="tab"
              aria-selected={phase === k}
              onClick={() => setPhase(k)}
              className={`flex-1 px-3 py-3 text-left transition-colors ${phase === k ? "border-b-2 border-[#1A73E8] bg-[#F8FBFF]" : "hover:bg-[#F8F9FA]"}`}
            >
              <span className="block text-[11px] font-semibold text-[#1A73E8]">{p.days}</span>
              <span className="block text-[13px] font-semibold text-[#202124]">{p.title}</span>
            </button>
          ))}
        </div>
        <ul className="grid gap-2 p-5 sm:grid-cols-2">
          {PHASES[phase].items.map((it) => (
            <li key={it} className="flex gap-2 text-[13px] leading-snug text-[#3C4043]">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A73E8]" />
              {it}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[16px] font-semibold text-[#202124]">Success measures</h3>
          <Basis kind="illustrative" />
        </div>
        <p className="mt-1 text-[13px] text-[#5F6368]">
          Targets are set against the baseline measured in days 1–30 — not against numbers borrowed from elsewhere.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-[#E8EAED] bg-white">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-[#F8F9FA] text-[11px] uppercase tracking-wide text-[#5F6368]">
              <tr>
                <th className="px-4 py-2 font-semibold">Measure</th>
                <th className="px-4 py-2 font-semibold">Definition</th>
                <th className="px-4 py-2 font-semibold">Go signal at day 90</th>
              </tr>
            </thead>
            <tbody>
              {METRICS.map((r) => (
                <tr key={r.m} className="border-t border-[#E8EAED]">
                  <td className="px-4 py-2.5 font-semibold text-[#202124]">{r.m}</td>
                  <td className="px-4 py-2.5 text-[#3C4043]">{r.d}</td>
                  <td className="px-4 py-2.5 text-[#3C4043]">{r.t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-[16px] font-semibold text-[#202124]">Expansion roadmap</h3>
        <ol className="mt-4 grid gap-3 md:grid-cols-4">
          {STAGES.map((s, k) => (
            <li key={s.title} className={`relative rounded-xl border p-4 ${k === 0 ? "border-[#1A73E8] bg-[#F4F8FE]" : "border-[#E8EAED] bg-white"}`}>
              <p className="flex items-center gap-1 text-[11px] font-semibold text-[#1A73E8]">
                {k === 0 && <Star size={11} fill="currentColor" />} {s.when}
              </p>
              <p className="mt-1 text-[15px] font-semibold text-[#202124]">{s.title}</p>
              <p className="mt-1.5 text-[12px] leading-snug text-[#3C4043]">{s.scope}</p>
              <p className="mt-2 text-[11px] text-[#80868B]">Buyer: {s.buyer}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
