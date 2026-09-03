"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Zap,
  Layers,
  Boxes,
  Gauge,
  Coins,
  FileScan,
  Lock,
  ArrowRight,
} from "lucide-react";
import { C, Reveal, SectionHeading, Cite } from "./ui";

/* Dimensions the router weighs */
type Dim = {
  id: "complexity" | "latency" | "volume" | "constraint";
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  options: string[];
};

const DIMS: Dim[] = [
  {
    id: "complexity",
    label: "Reasoning complexity",
    Icon: Brain,
    options: ["Routine", "Moderate", "Complex"],
  },
  {
    id: "latency",
    label: "Latency need",
    Icon: Gauge,
    options: ["Real-time", "Interactive", "Batch"],
  },
  {
    id: "volume",
    label: "Volume & cost pressure",
    Icon: Coins,
    options: ["Low", "Medium", "Very high"],
  },
  {
    id: "constraint",
    label: "Deployment constraint",
    Icon: Lock,
    options: ["Standard", "In-region", "Self-hosted"],
  },
];

type Sel = Record<Dim["id"], number>;

/* Model classes — names verified against Google model documentation, Sept 2026 */
const CLASSES = [
  {
    id: "frontier",
    name: "Frontier reasoning",
    example: "Gemini 3.1 Pro · Deep Think",
    color: C.purple,
    Icon: Brain,
    traits: "Deepest multi-step reasoning · 1M-token context · configurable thinking budget",
    fit: "Complex tax interpretation, cross-document case analysis, precedent comparison.",
  },
  {
    id: "workhorse",
    name: "Fast workhorse",
    example: "Gemini 3.8 Flash",
    color: C.blue,
    Icon: Zap,
    traits: "Near-frontier quality at a fraction of the cost · multimodal · agent-capable",
    fit: "Most taxpayer conversations, drafting, summarization, agent steps.",
  },
  {
    id: "highvolume",
    name: "High-volume / low-latency",
    example: "Gemini 3.5 Flash-Lite",
    color: C.teal,
    Icon: Layers,
    traits: "Lowest cost and latency tier · built for millions of calls",
    fit: "Intent triage, routing, classification, notification drafting at population scale.",
  },
  {
    id: "specialized",
    name: "Specialized & open",
    example: "Gemma 4 · task models · third-party",
    color: C.amber,
    Icon: Boxes,
    traits: "Open weights (Apache 2.0) · embeddings · document parsing · 200+ models in Model Garden",
    fit: "Constrained workloads, self-hosted inference, extraction, embeddings, niche tasks.",
  },
];

/* Preset IRAS workloads (illustrative) */
const PRESETS: { label: string; sel: Sel; note: string }[] = [
  {
    label: "Routine taxpayer FAQ",
    sel: { complexity: 0, latency: 0, volume: 2, constraint: 0 },
    note: "Millions of interactions. Speed and unit cost decide the experience.",
  },
  {
    label: "Complex tax interpretation",
    sel: { complexity: 2, latency: 1, volume: 0, constraint: 0 },
    note: "Low volume, high stakes. Pay for the deepest reasoning available.",
  },
  {
    label: "Bulk document extraction",
    sel: { complexity: 1, latency: 2, volume: 2, constraint: 0 },
    note: "Batch pipelines over forms and schedules. Specialized parsing plus a fast model.",
  },
  {
    label: "Sensitive constrained workload",
    sel: { complexity: 1, latency: 1, volume: 0, constraint: 2 },
    note: "Where policy demands it: open-weight models on infrastructure IRAS controls.",
  },
];

function recommend(sel: Sel): string {
  if (sel.constraint === 2) return "specialized";
  if (sel.complexity === 2) return "frontier";
  if (sel.volume === 2 && sel.complexity === 0) return "highvolume";
  if (sel.complexity === 0 && sel.latency === 0) return "highvolume";
  return "workhorse";
}

export default function ModelRouter() {
  const [sel, setSel] = useState<Sel>({ complexity: 0, latency: 0, volume: 2, constraint: 0 });
  const [preset, setPreset] = useState<number | null>(0);

  const winner = useMemo(() => recommend(sel), [sel]);

  const setDim = (id: Dim["id"], v: number) => {
    setPreset(null);
    setSel((s) => ({ ...s, [id]: v }));
  };

  return (
    <section id="iras-router" className="bg-[#F8F9FA]">
      <div className="section-container">
        <SectionHeading
          kicker="06 · Workload Routing"
          title="One platform. Different intelligence for different jobs."
          takeaway="The most powerful model is the wrong default. Route each workload to the intelligence it actually needs — and change the routing as models improve."
        />

        <div className="mt-10 grid lg:grid-cols-5 gap-8">
          {/* Left: controls */}
          <div className="lg:col-span-2">
            <Reveal>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-3">
                Try an IRAS workload <span className="ml-1 normal-case font-semibold">(illustrative)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setPreset(i);
                      setSel(p.sel);
                    }}
                    className="rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all"
                    style={{
                      background: preset === i ? C.blue : "#fff",
                      color: preset === i ? "#fff" : "#3C4043",
                      borderColor: preset === i ? C.blue : "#DADCE0",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {preset !== null && (
                <motion.p
                  key={preset}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-[13px] text-[#5F6368] italic"
                >
                  {PRESETS[preset].note}
                </motion.p>
              )}
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-6 space-y-5">
                {DIMS.map((d) => (
                  <div key={d.id}>
                    <p className="flex items-center gap-1.5 text-xs font-bold text-[#202124] mb-2">
                      <d.Icon size={13} color={C.blue} /> {d.label}
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {d.options.map((o, i) => (
                        <button
                          key={o}
                          onClick={() => setDim(d.id, i)}
                          className="rounded-lg border px-2 py-2 text-[11.5px] font-semibold transition-all"
                          style={{
                            background: sel[d.id] === i ? `${C.blue}12` : "#fff",
                            borderColor: sel[d.id] === i ? C.blue : "#E8EAED",
                            color: sel[d.id] === i ? C.blueDeep : "#5F6368",
                          }}
                          aria-pressed={sel[d.id] === i}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: routing visualization */}
          <div className="lg:col-span-3">
            <Reveal delay={0.15}>
              <div className="rounded-2xl border border-[#E8EAED] bg-white p-6 lg:p-8">
                {/* Router node */}
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B1F3A]">
                    <FileScan size={20} color="#fff" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#202124]">Workload profile</p>
                    <p className="text-xs text-[#5F6368]">
                      {DIMS.map((d) => d.options[sel[d.id]]).join(" · ")}
                    </p>
                  </div>
                  <motion.span
                    className="ml-auto hidden sm:block"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  >
                    <ArrowRight size={20} color={C.blue} />
                  </motion.span>
                </div>

                {sel.constraint === 1 && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-lg border border-[#188038]/30 bg-[#E6F4EA]/60 px-3.5 py-2 text-[12px] font-medium text-[#188038]"
                  >
                    In-region does not force self-hosting: Google Cloud offers in-region AI
                    processing in Singapore (asia-southeast1), so managed Gemini tiers remain
                    available under residency requirements.
                    <Cite k={["google-sg", "residency"]} />
                  </motion.p>
                )}

                <div className="mt-6 grid sm:grid-cols-2 gap-3.5">
                  {CLASSES.map((cls) => {
                    const active = winner === cls.id;
                    return (
                      <motion.div
                        key={cls.id}
                        animate={{
                          opacity: active ? 1 : 0.45,
                          scale: active ? 1 : 0.97,
                        }}
                        transition={{ type: "spring", stiffness: 250, damping: 24 }}
                        className="relative rounded-xl border-2 p-4"
                        style={{
                          borderColor: active ? cls.color : "#E8EAED",
                          background: active ? `${cls.color}0A` : "#fff",
                        }}
                      >
                        <AnimatePresence>
                          {active && (
                            <motion.span
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                              style={{ background: cls.color }}
                            >
                              Routed here
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <p className="flex items-center gap-2 text-sm font-bold text-[#202124]">
                          <cls.Icon size={15} color={cls.color} /> {cls.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-semibold" style={{ color: cls.color }}>
                          {cls.example}
                        </p>
                        <p className="mt-2 text-[11.5px] leading-snug text-[#5F6368]">{cls.traits}</p>
                        {active && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2.5 border-t border-[#E8EAED] pt-2 text-[12px] font-medium text-[#3C4043]"
                          >
                            {cls.fit}
                          </motion.p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <p className="mt-5 text-[11.5px] leading-relaxed text-[#9AA0A6]">
                  Model classes and names reflect Google&rsquo;s published portfolio as of
                  September 2026
                  <Cite k={["gemini-models", "model-garden", "gemma"]} />. Routing logic shown is
                  illustrative — in production this is policy IRAS defines, evaluates and updates
                  without changing the applications above it.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-5 rounded-2xl bg-[#0B1F3A] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="shrink-0 rounded-xl bg-white/10 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-white tabular-nums">4×</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                    Flash releases in 2026
                  </p>
                </div>
                <p className="text-[13.5px] leading-relaxed text-white/70">
                  Google shipped four Flash-class model updates between May and September 2026
                  alone
                  <Cite k="gemini-models" dark />. When the price-performance frontier moves this
                  fast, <strong className="text-white">the routing decision must be a configuration
                  change, not a re-architecture.</strong>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
