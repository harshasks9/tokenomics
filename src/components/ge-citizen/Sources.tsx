"use client";

import { Section } from "./ui";

const CARRIED = [
  "Single front door with an intent orchestrator routing to specialist agents per domain",
  "Answers grounded only in official government data stores",
  "Urgent and crisis cases override every other flow",
  "Use cases: procedures guidance, certificate bundles for job seekers, business formation, tax registration, health orientation without diagnosis, labour and consumer rights, jobs and CVs",
  "Identity verification against the national registry before personal services",
  "Masking of national identifiers before model processing; no training on citizen prompts",
  "Pooled usage quota with hard caps, per-user limits and overages off by default",
  "Adoption: assisted-access hubs, trained civic navigators, and everyday-life messaging rather than AI jargon",
  "A free, invited test cohort before general availability",
];

const GAPS = [
  { g: "Municipal transactional loop", d: "Bills, payments, street and utility reports, and status tracking — the most frequent citizen tasks — are absent from the national plan." },
  { g: "Proactive reminders", d: "Renewals, deadlines and appointments; the plan is reactive (citizen asks first)." },
  { g: "An explicit consent ladder", d: "What the agent may do at each level, and where payment authorization and human decisions sit." },
  { g: "Human escalation for caseworker decisions", d: "Eligibility and approvals need a named official, not only crisis hand-off." },
  { g: "Unit economics per active citizen", d: "The plan sizes quota pools but not cost per session, activation or break-even usage." },
  { g: "Baselines for outcome targets", d: "The plan states target efficiencies; the pilot must measure baselines before claiming them." },
  { g: "Accessibility and language beyond one national language", d: "Voice, low-bandwidth channels and minority languages." },
  { g: "Family journeys", d: "Schools, transport and caring for an older relative across services." },
];

const ASSUMPTIONS = [
  "Use-case scores (1–5) and market placements are editorial judgements.",
  "Segment population bands and contract values are formula illustrations: covered population × price.",
  "Per-session costs derive from the repository's model list prices and assumed token counts per session type.",
  "Adoption, usage, fixed run cost, setup cost and cost per assisted contact are placeholders to be replaced with a city's own figures.",
  "The day-in-the-life persona, amounts and reference numbers are invented.",
];

export default function Sources() {
  return (
    <Section
      id="gec-sources"
      eyebrow="Sources, gaps & assumptions"
      title="What came from the project, and what this page adds"
      lede="Project material reviewed: one internal brief describing a national-scale citizen deployment of Gemini Enterprise (deal structure, use cases, architecture, security, enablement and timeline). Its commercial terms, customer details and quota figures are confidential and are not reproduced here."
      alt
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
          <p className="text-[14px] font-semibold text-[#137333]">Carried forward from project material</p>
          <ul className="mt-3 space-y-2">
            {CARRIED.map((c) => (
              <li key={c} className="flex gap-2 text-[13px] leading-snug text-[#3C4043]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#137333]" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
          <p className="text-[14px] font-semibold text-[#B06000]">Gaps identified and addressed here</p>
          <ul className="mt-3 space-y-2.5">
            {GAPS.map((g) => (
              <li key={g.g} className="text-[13px] leading-snug">
                <span className="font-semibold text-[#202124]">{g.g}.</span> <span className="text-[#3C4043]">{g.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-[#E8EAED] bg-white p-5">
        <p className="text-[14px] font-semibold text-[#202124]">Labelled assumptions</p>
        <ul className="mt-2 space-y-1 text-[13px] text-[#3C4043]">
          {ASSUMPTIONS.map((a) => (
            <li key={a}>· {a}</li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-[#80868B]">
          No market statistics are cited. Product capabilities described are design requirements for a deployment, not claims about
          what any government has in place today.
        </p>
      </div>
    </Section>
  );
}
