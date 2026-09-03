"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PenLine,
  Brain,
  Play,
  Sparkles,
  ShieldCheck,
  Boxes,
  Users,
} from "lucide-react";
import { C, Reveal, SectionHeading, ClaimTag } from "./ui";

const STAGES = [
  {
    id: "find",
    n: 1,
    name: "Find",
    Icon: Search,
    color: "#00897B",
    headline: "AI retrieves the right information.",
    body: "Semantic search across tax legislation, e-Tax Guides, rulings and case files. The system finds what a keyword search misses — but people still read, decide and act.",
    architecture: "Enterprise search, embeddings, vector retrieval over governed corpora.",
    governance: "Access controls and source permissions. Low new risk — retrieval only.",
    human: "Human does the work. AI shortens the search.",
  },
  {
    id: "assist",
    n: 2,
    name: "Assist",
    Icon: PenLine,
    color: C.blue,
    headline: "AI summarizes, drafts and explains.",
    body: "Grounded answers with citations, case summaries, draft replies to taxpayers, plain-language explanations of complex guidance. Every output is reviewed before it goes anywhere.",
    architecture: "Grounded generation (RAG) with citation enforcement; drafting workflows inside existing tools.",
    governance: "Grounding policy, hallucination evaluation, prompt/response logging, human review gates.",
    human: "Human edits and approves everything AI produces.",
  },
  {
    id: "reason",
    n: 3,
    name: "Reason",
    Icon: Brain,
    color: C.purple,
    headline: "AI analyzes and recommends.",
    body: "Cross-document reasoning: reconcile a return against supporting schedules, compare a case to precedent, flag inconsistencies, propose next steps with the evidence behind each one.",
    architecture: "Frontier reasoning models, multi-step chains, tool use for retrieval and computation, evaluation harnesses.",
    governance: "Explainability requirements, evidence-vs-inference separation, model evaluation before and after deployment.",
    human: "Human weighs AI recommendations against the cited evidence.",
  },
  {
    id: "act",
    n: 4,
    name: "Act",
    Icon: Play,
    color: C.amber,
    headline: "Agents execute approved workflows.",
    body: "Within explicit guardrails: schedule a payment plan the taxpayer qualifies for, assemble a case file, file a routine amendment, route a document. Bounded actions, full audit trail, human checkpoints for anything consequential.",
    architecture: "Agent runtime with tool gateways, agent identity, allowlisted actions, sandboxed execution, interoperability protocols.",
    governance: "Per-agent identity and least privilege, action allowlists, kill switches, transaction-level audit, defined escalation to humans.",
    human: "Human sets the boundaries and handles exceptions.",
  },
  {
    id: "transform",
    n: 5,
    name: "Transform",
    Icon: Sparkles,
    color: C.red,
    headline: "Processes are redesigned around AI-native workflows.",
    body: "Not the old process with AI bolted on — a new one. Compliance becomes continuous rather than periodic. Service becomes proactive rather than reactive. Tax becomes something that mostly happens correctly by default.",
    architecture: "Composable agents across functions, event-driven workflows, continuous evaluation and improvement loops.",
    governance: "AI operating model at institutional level: accountability structures, workforce redesign, policy co-evolution.",
    human: "Humans govern outcomes and handle judgment; routine flow is AI-native.",
  },
];

/* Where each use case plausibly sits today vs. its 3-year trajectory (stage numbers 1–5) */
const USE_CASE_POSITIONS = [
  { name: "Taxpayer service", today: 2, future: 4 },
  { name: "Case officer support", today: 1, future: 3 },
  { name: "Compliance analytics", today: 3, future: 4 },
  { name: "Audit & investigation", today: 1, future: 3 },
  { name: "Document intelligence", today: 2, future: 4 },
  { name: "Institutional knowledge", today: 1, future: 3 },
  { name: "Developer productivity", today: 2, future: 4 },
];

export default function AgenticJourney() {
  const [stage, setStage] = useState(1); // index into STAGES
  const s = STAGES[stage];

  return (
    <section id="iras-agentic" className="bg-white">
      <div className="section-container">
        <SectionHeading
          kicker="09 · Path to Agentic AI"
          title="From safe assistance to controlled action."
          takeaway="IRAS does not need to jump to autonomous agents. Each stage delivers value on its own — and builds the governance muscle the next stage requires."
        />

        {/* Stage slider */}
        <Reveal className="mt-12" delay={0.1}>
          <div className="relative">
            {/* Track */}
            <div className="relative h-1.5 rounded-full bg-[#F1F3F4] mx-5">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, #00897B, ${C.blue}, ${C.purple}, ${C.amber}, ${C.red})`,
                }}
                animate={{ width: `${(stage / (STAGES.length - 1)) * 100}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
              />
            </div>
            {/* Stops */}
            <div className="flex justify-between -mt-[13px]">
              {STAGES.map((st, i) => {
                const active = i === stage;
                const passed = i <= stage;
                return (
                  <button
                    key={st.id}
                    onClick={() => setStage(i)}
                    className="group flex flex-col items-center w-24 focus:outline-none"
                    aria-label={`Stage ${st.n}: ${st.name}`}
                    aria-pressed={active}
                  >
                    <motion.span
                      className="flex items-center justify-center rounded-full border-2 bg-white"
                      animate={{
                        width: active ? 40 : 26,
                        height: active ? 40 : 26,
                        borderColor: passed ? st.color : "#DADCE0",
                        backgroundColor: active ? st.color : "#ffffff",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    >
                      <st.Icon
                        size={active ? 18 : 12}
                        color={active ? "#fff" : passed ? st.color : "#BDC1C6"}
                      />
                    </motion.span>
                    <span
                      className="mt-2 text-[11px] font-bold uppercase tracking-wider transition-colors"
                      style={{ color: active ? st.color : "#9AA0A6" }}
                    >
                      {st.n}. {st.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Stage detail */}
        <div className="mt-10 grid lg:grid-cols-5 gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-3 rounded-2xl border p-8"
              style={{ borderColor: `${s.color}33`, background: `${s.color}08` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: s.color }}
                >
                  <s.Icon size={20} color="#fff" />
                </span>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: s.color }}
                  >
                    Stage {s.n} of 5
                  </p>
                  <h3 className="text-xl font-bold text-[#202124]">{s.headline}</h3>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-[#3C4043]">{s.body}</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white border border-[#E8EAED] p-4">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#5F6368]">
                    <Boxes size={12} /> What the architecture needs
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#3C4043]">
                    {s.architecture}
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-[#E8EAED] p-4">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#5F6368]">
                    <ShieldCheck size={12} /> What governance must add
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#3C4043]">
                    {s.governance}
                  </p>
                </div>
              </div>
              <p className="mt-5 flex items-center gap-2 text-[13px] font-semibold" style={{ color: s.color }}>
                <Users size={14} /> {s.human}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Use case position map */}
          <Reveal className="lg:col-span-2" delay={0.15}>
            <div className="h-full rounded-2xl border border-[#E8EAED] bg-white p-6">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368]">
                  Where each use case sits
                </p>
                <ClaimTag kind="illustrative" />
              </div>
              <div className="mt-4 space-y-3.5">
                {USE_CASE_POSITIONS.map((u) => (
                  <div key={u.name}>
                    <p className="text-xs font-semibold text-[#202124] mb-1">{u.name}</p>
                    <div className="relative h-2 rounded-full bg-[#F1F3F4]">
                      <motion.div
                        className="absolute top-0 h-full rounded-full opacity-90"
                        style={{
                          background: `linear-gradient(90deg, ${C.blue}, ${C.amber})`,
                        }}
                        initial={false}
                        animate={{
                          left: `${((u.today - 1) / 4) * 100}%`,
                          width: `${((u.future - u.today) / 4) * 100}%`,
                        }}
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white shadow"
                        style={{
                          left: `calc(${((u.today - 1) / 4) * 100}% - 7px)`,
                          background: C.blue,
                        }}
                        title="Today"
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white shadow"
                        style={{
                          left: `calc(${((u.future - 1) / 4) * 100}% - 7px)`,
                          background: C.amber,
                        }}
                        title="3-year trajectory"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-[10px] font-semibold text-[#5F6368]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.blue }} />
                  Achievable today
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.amber }} />
                  3-year trajectory
                </span>
              </div>
              <div className="mt-3 flex justify-between text-[9px] font-bold uppercase tracking-wider text-[#9AA0A6]">
                <span>Find</span>
                <span>Assist</span>
                <span>Reason</span>
                <span>Act</span>
                <span>Transform</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 text-center text-sm text-[#5F6368] max-w-2xl mx-auto">
            The platform decision matters here: the same governed foundation should carry IRAS
            from Stage 1 to Stage 4 — without re-platforming between stages.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
