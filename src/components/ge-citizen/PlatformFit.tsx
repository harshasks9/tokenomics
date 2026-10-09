"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PILLARS } from "@/lib/ge-citizen/data";
import { Section } from "./ui";

const MIRROR = [
  {
    workforce: "The front door to AI for your workforce",
    citizen: "The front door to government for your residents",
  },
  {
    workforce: "Every employee gets one always-on agent that already knows their work",
    citizen: "Every resident gets one always-on agent that already knows their bills, deadlines and open requests",
  },
  {
    workforce: "One agent across web, desktop, mobile and the chat tools people already use",
    citizen: "One agent across the city website, app, messaging and voice",
  },
  {
    workforce: "Smart model routing and hard budget caps — no token anxiety",
    citizen: "About $2 per resident per year, capped so it can never overrun",
  },
];

export default function PlatformFit() {
  const [p, setP] = useState(PILLARS[0].id);
  const pillar = PILLARS.find((x) => x.id === p)!;

  return (
    <Section
      id="gec-platform"
      eyebrow="2 · Built on the Gemini agent"
      title="The same agent Gemini Enterprise gives every employee — extended to every resident"
      lede={
        <>
          GE for Citizen is not a separate chatbot product. It applies the direction of the Gemini agent — one always-on agent
          per person, on every surface, with skills, connectors, triggers, human approval gates and hard budget caps — to a new
          kind of user: the resident. Every journey on this page maps to a capability in that direction. Capabilities are
          described as product direction; confirm what is available to a public-sector tenant, in the required jurisdiction,
          before committing.
        </>
      }
      alt
    >
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#5F6368]">
        Gemini agent for the workforce <span className="text-[#1A73E8]">→</span> GE for Citizen
      </p>
      <div className="grid gap-2 md:grid-cols-2">
        {MIRROR.map((m) => (
          <div key={m.citizen} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-[#E8EAED] bg-white px-4 py-3">
            <p className="text-[12px] leading-snug text-[#5F6368]">{m.workforce}</p>
            <ArrowRight size={14} className="text-[#1A73E8]" />
            <p className="text-[13px] font-semibold leading-snug text-[#202124]">{m.citizen}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Capability pillars">
          {PILLARS.map((x) => {
            const on = x.id === p;
            return (
              <button
                key={x.id}
                role="tab"
                aria-selected={on}
                onClick={() => setP(x.id)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-left transition-colors lg:shrink ${on ? "border-[#1A73E8] bg-[#E8F0FE]" : "border-[#E8EAED] bg-white hover:bg-[#F8F9FA]"}`}
              >
                <span className={`block text-[14px] font-semibold ${on ? "text-[#174EA6]" : "text-[#202124]"}`}>{x.title}</span>
                <span className="mt-0.5 hidden text-[12px] leading-snug text-[#5F6368] lg:block">{x.citizenLine}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
          <p className="text-[12px] text-[#5F6368]">
            <span className="font-semibold text-[#3C4043]">Product direction: </span>
            {pillar.productLine}
          </p>
          <p className="mt-1 text-[14px] font-semibold text-[#202124] lg:hidden">{pillar.citizenLine}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead className="text-[11px] uppercase tracking-wide text-[#5F6368]">
                <tr className="border-b border-[#E8EAED]">
                  <th className="py-2 pr-3 font-semibold">Capability</th>
                  <th className="py-2 pr-3 font-semibold">For residents</th>
                  <th className="py-2 font-semibold">For the government</th>
                </tr>
              </thead>
              <tbody>
                {pillar.capabilities.map((c) => (
                  <tr key={c.id} className="border-b border-[#F1F3F4] align-top last:border-0">
                    <td className="py-3 pr-3">
                      <span className="block font-semibold text-[#202124]">{c.name}</span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-[#80868B]">{c.product}</span>
                      {c.extension && (
                        <span className="mt-1 inline-block rounded bg-[#FEF7E0] px-1.5 py-[1px] text-[10px] font-semibold uppercase tracking-wide text-[#B06000]">
                          Citizen extension to design
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-3 leading-snug text-[#3C4043]">{c.citizen}</td>
                    <td className="py-3 leading-snug text-[#3C4043]">{c.government}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#C6DAFC] bg-[#F4F8FE] p-5">
        <p className="text-[14px] font-semibold text-[#174EA6]">Why this matters to a government buyer</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-[#3C4043]">
          A government that adopts the Gemini agent for its own staff already carries the governance, identity, connector and
          cost controls a citizen agent needs. Extending it to residents reuses that investment: department skills written for
          staff can serve the public, the same connectors reach the same back-office systems, and the same spend guardrails make a
          fixed per-resident price safe. The work that remains is the citizen-specific layer — consent, delegation for carers,
          public identity and accessibility — marked above as extensions to design.
        </p>
      </div>
    </Section>
  );
}
