"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ACTION_CLASS, CAPABILITY, type ActionClass, type CapabilityId } from "@/lib/ge-citizen/data";
import { Basis, ClassBadge, Section } from "./ui";

const LADDER: { c: ActionClass; can: string; cannot: string; gate: string }[] = [
  { c: "inform", can: "Answer from official sources, cite them, explain a bill or status", cannot: "Guess when sources are silent", gate: "None" },
  { c: "prepare", can: "Pre-fill forms, check eligibility rules, assemble documents", cannot: "Submit anything", gate: "Sign-in; citizen reviews every field" },
  { c: "act-id", can: "Submit a report, request or renewal on the citizen's behalf", cannot: "Accept terms or sign declarations silently", gate: "Verified identity + explicit confirm per action" },
  { c: "act-pay", can: "Schedule or initiate a payment the citizen has authorized", cannot: "Hold funds, store cards, or pay without a fresh authorization", gate: "Authorization in the payment provider's own flow" },
  { c: "human", can: "Prepare the case file and explain the decision afterwards", cannot: "Decide eligibility, approvals, penalties or disputes", gate: "A named public official decides" },
];

const REQUIREMENTS: { k: string; p: CapabilityId | undefined; d: string }[] = [
  { k: "Government identity", p: "byoid", d: "Federated sign-in with the national or city identity provider; step-up verification before any action." },
  { k: "Service APIs", p: "connectors", d: "Read and write access to billing, service-request, licensing and scheduling systems, with sandbox environments." },
  { k: "Payment provider", p: "approval", d: "Tokenized payments authorized by the citizen in the provider's own flow; the agent receives confirmations only." },
  { k: "Consent records", p: "memory", d: "Per-purpose consent the citizen can see and revoke; reminders and proactive messages are opt-in." },
  { k: "Data handling", p: "sandbox", d: "In-country or approved-region storage, no training on citizen data, masking of national identifiers before model calls, retention limits." },
  { k: "Accessibility", p: "surfaces", d: "WCAG 2.2 AA, voice in and out, low-bandwidth and messaging channels, and assisted access at service counters." },
  { k: "Local languages", p: undefined, d: "Languages chosen with the city; translation reviewed by native speakers for each service." },
  { k: "Human escalation", p: "approval", d: "Ask-for-a-person at any point; warm hand-off with context to contact-centre and caseworker queues." },
  { k: "Audit trail", p: "agentid", d: "Every action logged with source, consent, confirmation and outcome; available to the citizen and to auditors." },
  { k: "Usage guardrails", p: "budget", d: "Pooled quota with hard caps, per-citizen limits and abuse detection so spend cannot exceed budget." },
  { k: "Safety routing", p: "subagents", d: "Risk signals override every flow and hand off to emergency and hotline services." },
  { k: "Content ownership", p: "skills", d: "Each department owns and signs off the procedures the agent explains; a change process keeps them current." },
];

export default function Trust() {
  const [have, setHave] = useState<Record<string, boolean>>({});
  const n = Object.values(have).filter(Boolean).length;

  return (
    <Section
      id="gec-trust"
      eyebrow="7 · Trust, consent & operations"
      title="The agent acts only with permission — and people still decide"
      lede="A consent ladder sets what the agent may do at each step, using the Gemini agent's approval gates. The list below is what a city must put in place before launch — each item notes the platform capability it builds on. These are design and deployment requirements, not claims that they already exist."
      alt
    >
      <div className="overflow-x-auto rounded-2xl border border-[#E8EAED] bg-white">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="bg-[#F8F9FA] text-[11px] uppercase tracking-wide text-[#5F6368]">
            <tr>
              <th className="px-4 py-2 font-semibold">Level</th>
              <th className="px-4 py-2 font-semibold">The agent can</th>
              <th className="px-4 py-2 font-semibold">The agent cannot</th>
              <th className="px-4 py-2 font-semibold">Gate</th>
            </tr>
          </thead>
          <tbody>
            {LADDER.map((r) => (
              <tr key={r.c} className="border-t border-[#E8EAED] align-top">
                <td className="px-4 py-3">
                  <ClassBadge c={r.c} />
                </td>
                <td className="px-4 py-3 text-[#3C4043]">{r.can}</td>
                <td className="px-4 py-3 text-[#3C4043]">{r.cannot}</td>
                <td className="px-4 py-3 font-medium" style={{ color: ACTION_CLASS[r.c].color }}>
                  {r.gate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold text-[#202124]">Readiness check</h3>
            <Basis kind="requirement" />
          </div>
          <p className="mt-1 text-[13px] text-[#5F6368]">Tick what your government already has. Anything unticked becomes pilot scope or a prerequisite.</p>
        </div>
        <p className="tabular-nums text-[13px] font-semibold text-[#202124]">
          {n} / {REQUIREMENTS.length} in place
        </p>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {REQUIREMENTS.map((r) => {
          const on = !!have[r.k];
          return (
            <li key={r.k}>
              <button
                onClick={() => setHave((h) => ({ ...h, [r.k]: !h[r.k] }))}
                aria-pressed={on}
                className={`flex h-full w-full gap-3 rounded-xl border p-4 text-left transition-colors ${on ? "border-[#A8DAB5] bg-[#F3FAF5]" : "border-[#E8EAED] bg-white hover:bg-[#F8F9FA]"}`}
              >
                <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${on ? "border-[#137333] bg-[#137333] text-white" : "border-[#BDC1C6]"}`}>
                  {on && <Check size={11} strokeWidth={3} />}
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-[#202124]">{r.k}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-[#5F6368]">{r.d}</span>
                  <span className="mt-1.5 block text-[11px] font-medium text-[#174EA6]">
                    {r.p ? `Builds on: ${CAPABILITY[r.p].name}` : "City-specific — not a platform feature"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
