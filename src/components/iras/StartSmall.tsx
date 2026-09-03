"use client";

import { motion } from "framer-motion";
import { Flag, Rocket, Workflow, Plus, Equal } from "lucide-react";
import { C, Reveal, SectionHeading, ClaimTag } from "./ui";

const PHASES = [
  {
    Icon: Flag,
    period: "First 6 months",
    name: "Prove value where risk is lowest",
    color: C.teal,
    items: [
      "Grounded institutional knowledge for officers — cited answers over e-Tax Guides, rulings and procedures",
      "Extend the existing taxpayer chatbot toward grounded, reasoning service on a defined scope",
      "Stand up the governance spine on day one: evaluation, logging, model allowlisting, red-teaming",
    ],
    proof: "Proof point: officers trust the answers because every answer shows its sources.",
  },
  {
    Icon: Rocket,
    period: "6–18 months",
    name: "Augment the core of the work",
    color: C.blue,
    items: [
      "Officer copilot for case preparation — summaries, precedent, gap analysis, cited drafts",
      "Document intelligence pipeline for high-volume document classes",
      "Compliance: GenAI explanation and unstructured coverage layered onto existing risk models",
    ],
    proof: "Proof point: hours per case fall while every recommendation stays evidence-linked.",
  },
  {
    Icon: Workflow,
    period: "18 months +",
    name: "Introduce controlled action",
    color: C.amber,
    items: [
      "Agents execute narrow, allowlisted workflows with human checkpoints and full audit",
      "Investigation workspace assembles evidence across systems on demand",
      "Model routing tuned continuously as new models ship — applications untouched",
    ],
    proof: "Proof point: the same platform that ran the first pilot now runs governed agents — no re-platforming happened.",
  },
];

export default function StartSmall() {
  return (
    <section id="iras-start" className="bg-white border-t border-[#F1F3F4]">
      <div className="section-container !pb-10">
        <SectionHeading
          kicker="11 · The Path"
          title="Start small. Architect for scale."
          takeaway="The first pilot and the eventual agentic estate should run on the same foundation — so nothing built in month one is thrown away in year three."
        />
        <Reveal delay={0.05} className="mt-3">
          <ClaimTag kind="illustrative" />
        </Reveal>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {PHASES.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div className="relative h-full rounded-2xl border border-[#E8EAED] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${p.color}14` }}
                  >
                    <p.Icon size={18} color={p.color} />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: p.color }}>
                      {p.period}
                    </p>
                    <p className="text-[15px] font-bold text-[#202124] leading-tight">{p.name}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {p.items.map((it, j) => (
                    <li key={j} className="flex gap-2 text-[13px] leading-relaxed text-[#3C4043]">
                      <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.color }} />
                      {it}
                    </li>
                  ))}
                </ul>
                <p
                  className="mt-4 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold leading-snug"
                  style={{ background: `${p.color}0E`, color: p.color }}
                >
                  {p.proof}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Final message */}
        <Reveal delay={0.15}>
          <div className="mt-20 rounded-3xl bg-[#0B1F3A] px-6 py-14 lg:py-20 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(700px 320px at 50% 0%, rgba(26,115,232,0.25) 0%, transparent 70%)",
              }}
            />
            <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-[#8AB4F8]">
              The one idea to leave with
            </p>
            <h3 className="relative mt-5 mx-auto max-w-3xl text-3xl lg:text-5xl font-bold text-white leading-[1.15] tracking-tight">
              Don&rsquo;t architect for the best model today.
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #8AB4F8, #81C995)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Architect to use the best model tomorrow.
              </span>
            </h3>
            <p className="relative mt-6 mx-auto max-w-2xl text-[15px] leading-relaxed text-white/60">
              Google Cloud&rsquo;s differentiation is not simply access to Gemini. It is the
              combination that lets IRAS continually adopt better AI without continually rebuilding
              its applications:
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {["Gemini", "One AI platform", "Data", "Infrastructure", "Openness", "Governance"].map(
                (t, i, arr) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                    className="flex items-center gap-2.5"
                  >
                    <span className="rounded-xl border border-white/15 bg-white/8 px-4 py-2 text-sm font-bold text-white">
                      {t}
                    </span>
                    {i < arr.length - 1 && <Plus size={13} color="rgba(255,255,255,0.35)" />}
                  </motion.span>
                )
              )}
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="flex items-center gap-2.5"
              >
                <Equal size={15} color="rgba(255,255,255,0.35)" />
                <span
                  className="rounded-xl px-4 py-2 text-sm font-bold text-[#0B1F3A]"
                  style={{ background: "linear-gradient(90deg, #8AB4F8, #81C995)" }}
                >
                  An AI estate that keeps getting better
                </span>
              </motion.span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
