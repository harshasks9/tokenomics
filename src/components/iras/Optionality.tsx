"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Bot,
  Brain,
  Database,
  Boxes,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Check,
} from "lucide-react";
import { C, Reveal, SectionHeading, Cite } from "./ui";

/* ── The stack ───────────────────────────────────────────────── */

const LAYERS = [
  {
    id: "experience",
    name: "Experience",
    Icon: Monitor,
    color: C.blue,
    role: "Where taxpayers, officers and systems meet AI.",
    choices: ["myTax Portal & web", "Mobile", "Officer workspaces", "Contact centre", "APIs & B2B"],
    why: "Experiences are IRAS-owned and stable. Nothing below this layer should force them to change.",
  },
  {
    id: "agents",
    name: "Agents",
    Icon: Bot,
    color: C.purple,
    role: "The workflows that reason, use tools and act — within policy.",
    choices: ["Google-built agents", "IRAS custom agents (ADK)", "Partner & third-party agents", "A2A interop", "MCP tools"],
    why: "Open protocols (A2A, MCP) mean agents from different vendors interoperate instead of locking the workflow layer to one framework.",
  },
  {
    id: "models",
    name: "Models",
    Icon: Brain,
    color: C.red,
    role: "The intelligence — chosen per workload, replaced as the frontier moves.",
    choices: ["Gemini frontier & Flash", "Gemma open-weight (Apache 2.0)", "Third-party (Claude, Llama, Mistral…)", "Specialised & tuned models"],
    why: "The fastest-depreciating layer of the stack. It must be the easiest to swap.",
  },
  {
    id: "data",
    name: "Data",
    Icon: Database,
    color: C.teal,
    role: "The ground truth AI is allowed to know.",
    choices: ["BigQuery analytics", "IRIN & operational systems", "Document stores", "Policy & knowledge corpora", "APIs & InvoiceNow feeds"],
    why: "AI comes to governed data — data does not scatter to wherever each model lives.",
  },
  {
    id: "platform",
    name: "AI Platform",
    Icon: Boxes,
    color: C.amber,
    role: "The machinery that makes any model production-grade.",
    choices: ["One platform, 200+ models", "Grounding & RAG", "Evaluation & monitoring", "Vector & enterprise search", "Prompt & version management"],
    why: "Evaluation, grounding and monitoring are model-agnostic — switch models without rebuilding the safety apparatus.",
  },
  {
    id: "infra",
    name: "Infrastructure",
    Icon: Cpu,
    color: C.blueDeep,
    role: "Purpose-built compute, priced for population-scale AI.",
    choices: ["TPU (Ironwood-class)", "NVIDIA GPUs", "CPU serving", "Managed / hybrid / air-gapped"],
    why: "Google trains and serves Gemini on its own silicon — the economics compound down the stack, and deployment can follow policy, not vendor limits.",
  },
];

/* ── Model-swap demo ─────────────────────────────────────────── */

const SWAP_MODELS = [
  {
    id: "pro",
    name: "Gemini 3.1 Pro",
    tag: "Frontier reasoning",
    color: C.purple,
    latency: "~seconds, deep reasoning",
    cost: "$$$",
    when: "Hard interpretation questions",
  },
  {
    id: "flash",
    name: "Gemini 3.8 Flash",
    tag: "Fast workhorse",
    color: C.blue,
    latency: "Sub-second first token",
    cost: "$",
    when: "The default for most turns",
  },
  {
    id: "gemma",
    name: "Gemma 4 (open-weight)",
    tag: "Self-hostable · Apache 2.0",
    color: C.green,
    latency: "Fast, on IRAS-controlled infra",
    cost: "Infra only",
    when: "Constrained or sovereign workloads",
  },
  {
    id: "third",
    name: "Third-party model",
    tag: "Claude, Llama, Mistral…",
    color: C.amber,
    latency: "Varies by model",
    cost: "Varies",
    when: "Where evaluation says it wins",
  },
];

export default function Optionality() {
  const [activeLayer, setActiveLayer] = useState("models");
  const [model, setModel] = useState(1);
  const layer = LAYERS.find((l) => l.id === activeLayer)!;
  const m = SWAP_MODELS[model];

  return (
    <section id="iras-optionality" className="bg-white border-t border-[#F1F3F4]">
      <div className="section-container">
        <SectionHeading
          kicker="05 · The Central Argument"
          title="Optionality at every layer."
          takeaway="Models improve dramatically every few months. IRAS should architect around business capabilities — not around any single model — so each layer can evolve on its own clock."
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-10">
          {/* Interactive stack */}
          <div>
            <Reveal>
              <div className="space-y-2">
                {LAYERS.map((l) => {
                  const active = l.id === activeLayer;
                  return (
                    <motion.button
                      key={l.id}
                      onClick={() => setActiveLayer(l.id)}
                      whileHover={{ scale: 1.01 }}
                      className="w-full rounded-xl border-2 px-4 py-3 flex items-center gap-3 text-left transition-colors"
                      style={{
                        borderColor: active ? l.color : "#E8EAED",
                        background: active ? `${l.color}0A` : "#fff",
                      }}
                      aria-pressed={active}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: `${l.color}14` }}
                      >
                        <l.Icon size={17} color={l.color} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#202124]">{l.name}</p>
                        <p className="text-[11.5px] text-[#5F6368] truncate">{l.role}</p>
                      </div>
                      <motion.span
                        className="ml-auto text-[10px] font-bold uppercase tracking-wider shrink-0"
                        animate={{ opacity: active ? 1 : 0.35 }}
                        style={{ color: l.color }}
                      >
                        {l.choices.length} choices
                      </motion.span>
                    </motion.button>
                  );
                })}
                {/* Cross-cutting bar */}
                <div className="rounded-xl bg-[#0B1F3A] px-4 py-3 flex items-center gap-3">
                  <ShieldCheck size={17} color="#8AB4F8" />
                  <p className="text-[11.5px] font-semibold text-white/80">
                    Security · Governance · Identity · Observability · Cost control —{" "}
                    <span className="text-white">constant across every layer</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Layer detail */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="lg:sticky lg:top-24 rounded-2xl border border-[#E8EAED] bg-[#F8F9FA] p-7"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: layer.color }}>
                  Layer · {layer.name}
                </p>
                <h3 className="mt-1.5 text-xl font-bold text-[#202124]">{layer.role}</h3>
                <div className="mt-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2.5">
                    The choices IRAS keeps
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {layer.choices.map((c, i) => (
                      <motion.span
                        key={c}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-lg bg-white border px-3 py-1.5 text-[12.5px] font-semibold text-[#3C4043]"
                        style={{ borderColor: `${layer.color}44` }}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <p className="mt-5 rounded-xl bg-white border border-[#E8EAED] px-4 py-3 text-[13px] leading-relaxed text-[#3C4043]">
                  <strong style={{ color: layer.color }}>Why it matters: </strong>
                  {layer.why}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Model swap demo ── */}
        <Reveal delay={0.1}>
          <div className="mt-20 rounded-3xl bg-[#0B1F3A] p-6 lg:p-10 overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                background: `radial-gradient(600px 300px at 80% 0%, ${m.color}22 0%, transparent 70%)`,
              }}
            />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8AB4F8]">
                  See it in one picture
                </p>
                <h3 className="mt-2 text-2xl lg:text-4xl font-bold text-white leading-tight">
                  Swap the model.
                  <br />
                  The experience doesn&rsquo;t move.
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/60 max-w-md">
                  One taxpayer assistant can already use a frontier model for hard interpretation, a
                  Flash-class model for millions of routine turns, a document specialist for
                  extraction, and an open-weight model for constrained workloads
                  <Cite k={["gemini-models", "gemma", "model-garden"]} dark />. The user never
                  notices. That is the architecture working.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2.5 max-w-md">
                  {SWAP_MODELS.map((sm, i) => (
                    <button
                      key={sm.id}
                      onClick={() => setModel(i)}
                      className="rounded-xl border px-3.5 py-2.5 text-left transition-all"
                      style={{
                        borderColor: model === i ? sm.color : "rgba(255,255,255,0.12)",
                        background: model === i ? `${sm.color}1f` : "rgba(255,255,255,0.04)",
                      }}
                      aria-pressed={model === i}
                    >
                      <p className="text-[13px] font-bold text-white flex items-center gap-1.5">
                        {model === i && <Check size={12} color={sm.color} />}
                        {sm.name}
                      </p>
                      <p className="text-[10.5px] font-semibold mt-0.5" style={{ color: sm.color }}>
                        {sm.tag}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* The unchanging app */}
              <div className="relative">
                <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-[#E8EAED] bg-[#F8F9FA] px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E8EAED]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E8EAED]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#E8EAED]" />
                    <p className="ml-2 text-[11px] font-semibold text-[#5F6368]">
                      Taxpayer Assistant — identical experience
                    </p>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-br-md bg-[#1A73E8] px-3.5 py-2 text-[12.5px] text-white max-w-[80%]">
                        Do I need to declare income from my overseas freelance work?
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F0FE]">
                        <Bot size={12} color={C.blue} />
                      </span>
                      <div className="rounded-2xl rounded-tl-md bg-[#F8F9FA] border border-[#E8EAED] px-3.5 py-2 text-[12.5px] text-[#202124] max-w-[85%] leading-relaxed">
                        It depends on where the work was exercised. If you performed it while in
                        Singapore, it is generally taxable here. May I ask two quick questions to
                        confirm? <span className="text-[#9AA0A6]">· 2 sources cited</span>
                      </div>
                    </div>
                  </div>
                  {/* Engine bay */}
                  <div className="border-t border-dashed border-[#DADCE0] bg-[#FAFAFA] px-5 py-3.5 flex items-center gap-3">
                    <RefreshCw size={13} color="#9AA0A6" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#9AA0A6]">
                      Engine
                    </p>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-wrap items-center gap-x-3 gap-y-1"
                      >
                        <span
                          className="rounded-md px-2.5 py-1 text-[11px] font-bold text-white"
                          style={{ background: m.color }}
                        >
                          {m.name}
                        </span>
                        <span className="text-[10.5px] font-semibold text-[#5F6368]">
                          {m.latency} · cost {m.cost}
                        </span>
                        <span className="text-[10.5px] text-[#9AA0A6]">{m.when}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
                <p className="mt-3 text-center text-[11px] text-white/40">
                  Only the engine bay changes. Interface, grounding, guardrails and audit stay put.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-10 mx-auto max-w-3xl text-center text-lg lg:text-xl font-medium text-[#202124] leading-relaxed">
            Google shipped multiple frontier and Flash-class releases in 2026 alone
            <Cite k="gemini-models" />.{" "}
            <span className="text-[#5F6368]">
              An architecture that treats the model as a component — not a foundation — is the only
              one that turns that pace into an advantage instead of a rebuild.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
