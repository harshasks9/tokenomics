"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Bot,
  Brain,
  Boxes,
  Database,
  Cpu,
  ChevronDown,
  ShieldCheck,
  Fingerprint,
  Eye,
  Coins,
  ScrollText,
} from "lucide-react";
import { C, Reveal, SectionHeading, ClaimTag, Cite } from "./ui";

type Band = {
  id: string;
  name: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  exec: string;
  items: { name: string; note: string }[];
  tech: string;
  citeKeys?: string[];
};

const BANDS: Band[] = [
  {
    id: "experiences",
    name: "Experiences",
    Icon: Monitor,
    color: C.blue,
    exec: "What taxpayers and officers actually touch. IRAS-branded, IRAS-owned.",
    items: [
      { name: "Taxpayer Assistant", note: "Conversational service in myTax Portal and mobile" },
      { name: "Officer Copilot", note: "Case briefs, drafting and knowledge in the flow of work" },
      { name: "Investigation Workspace", note: "Evidence-backed analysis for audit teams" },
      { name: "Developer Copilot", note: "AI-assisted engineering for IRAS technology teams" },
      { name: "AI-enabled internal apps", note: "Existing systems, quietly smarter" },
    ],
    tech: "Experiences call capabilities, never models directly — the contract that makes everything below replaceable.",
  },
  {
    id: "agents",
    name: "Agentic Layer",
    Icon: Bot,
    color: C.purple,
    exec: "Workflows that plan, use tools and act — inside guardrails IRAS defines.",
    items: [
      { name: "Custom agents (ADK)", note: "Open-source kit in Python, TypeScript, Go, Java" },
      { name: "Managed agent runtime", note: "Sessions, memory, identity — CMEK-protected" },
      { name: "Gemini Enterprise", note: "Governed employee agent workplace, where appropriate" },
      { name: "Tools via MCP", note: "50+ Google-managed MCP servers plus IRAS-built tools" },
      { name: "A2A interoperability", note: "Linux Foundation standard, 150+ member orgs" },
    ],
    tech: "Agents carry their own identity, their tool calls pass a policy gateway, and every step is traced. Interop via open protocols keeps the layer vendor-neutral.",
    citeKeys: ["adk", "a2a", "mcp-servers", "gemini-enterprise"],
  },
  {
    id: "intelligence",
    name: "Intelligence",
    Icon: Brain,
    color: C.red,
    exec: "Many models, one contract. The best intelligence for each job, replaceable per workload.",
    items: [
      { name: "Gemini 3.1 Pro", note: "Frontier reasoning · 1M-token context" },
      { name: "Gemini 3.8 Flash / Flash-Lite", note: "Workhorse and high-volume tiers" },
      { name: "Gemma 4", note: "Open-weight, Apache 2.0, self-hostable" },
      { name: "Third-party models", note: "Claude, Llama, Mistral and more — first-class" },
      { name: "Specialised models", note: "Embeddings, document, translation, tuned variants" },
    ],
    tech: "Model allowlisting via org policy; versions pinned with published retirement dates; routing is configuration, evaluated continuously.",
    citeKeys: ["gemini-models", "gemma", "model-garden", "claude-vertex"],
  },
  {
    id: "platform",
    name: "AI Platform",
    Icon: Boxes,
    color: C.amber,
    exec: "The machinery that turns any model into a governed production system.",
    items: [
      { name: "Gemini Enterprise Agent Platform", note: "Formerly Vertex AI — one platform, 200+ models" },
      { name: "Grounding & RAG", note: "Answers constrained to approved sources, with citations" },
      { name: "Agent Search & vector search", note: "ACL-aware enterprise retrieval" },
      { name: "Evaluation & monitoring", note: "Groundedness, safety and quality — continuously scored" },
      { name: "Prompt & version management", note: "Prompts, models and agents under change control" },
    ],
    tech: "The platform layer is deliberately model-agnostic: evaluation, grounding, and monitoring do not need rebuilding when the model changes.",
    citeKeys: ["geap", "grounding", "genai-eval"],
  },
  {
    id: "data",
    name: "Data & Knowledge",
    Icon: Database,
    color: C.teal,
    exec: "AI comes to IRAS data — governed, in place — not the other way around.",
    items: [
      { name: "BigQuery", note: "Analytics spine; AI functions run in SQL, next to the data" },
      { name: "IRIN & operational systems", note: "Integrated via APIs — systems of record stay authoritative" },
      { name: "Documents & correspondence", note: "Parsed, embedded, permission-aware" },
      { name: "Policy & knowledge corpora", note: "e-Tax Guides, rulings, procedures as grounded sources" },
      { name: "InvoiceNow & external feeds", note: "Structured transaction data at population scale" },
    ],
    tech: "One catalogue and lineage across data and AI assets; retrieval honours source-system permissions; residency and retention are explicit configuration.",
    citeKeys: ["bigquery-ai", "iras-invoicenow", "residency"],
  },
  {
    id: "infra",
    name: "Infrastructure",
    Icon: Cpu,
    color: C.blueDeep,
    exec: "Purpose-built AI compute — with deployment models that follow Singapore policy.",
    items: [
      { name: "TPU (Ironwood-class)", note: "The accelerator family Gemini is built and served on" },
      { name: "NVIDIA GPUs", note: "Blackwell-class instances for open and custom models" },
      { name: "Singapore region", note: "asia-southeast1 with in-region AI processing options" },
      { name: "Sovereign & air-gapped", note: "Google Distributed Cloud where policy demands it" },
      { name: "Confidential computing", note: "Encryption in use, including GPU TEEs" },
    ],
    tech: "Vertical integration is the cost story: custom silicon, network and serving stack co-designed with the models that run on them.",
    citeKeys: ["tpu", "google-sg", "gdc", "confidential"],
  },
];

const CROSS = [
  { Icon: ShieldCheck, label: "Security" },
  { Icon: Fingerprint, label: "IAM & Identity" },
  { Icon: ScrollText, label: "Governance & Audit" },
  { Icon: Eye, label: "Observability" },
  { Icon: Coins, label: "FinOps" },
];

export default function Architecture() {
  const [open, setOpen] = useState<string | null>("intelligence");

  return (
    <section id="iras-architecture" className="bg-[#F8F9FA] border-t border-[#F1F3F4]">
      <div className="section-container">
        <SectionHeading
          kicker="07 · Architecture"
          title="A reference architecture for IRAS."
          takeaway="Read it top-down as an executive: experiences, powered by agents, powered by interchangeable intelligence, on governed data and purpose-built infrastructure. Click any layer to go deeper."
        />
        <Reveal delay={0.05} className="mt-3">
          <div className="flex gap-2 flex-wrap">
            <ClaimTag kind="scenario" />
            <span className="text-[11px] text-[#9AA0A6] self-center">
              Product names as published September 2026
              <Cite k="geap" />
            </span>
          </div>
        </Reveal>

        <div className="mt-10 max-w-4xl mx-auto">
          {BANDS.map((b, bi) => {
            const isOpen = open === b.id;
            return (
              <div key={b.id}>
                <Reveal delay={bi * 0.05}>
                  <motion.div
                    layout
                    className="rounded-2xl border-2 bg-white overflow-hidden"
                    style={{ borderColor: isOpen ? b.color : "#E8EAED" }}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : b.id)}
                      className="w-full flex items-center gap-4 px-5 lg:px-7 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: `${b.color}14` }}
                      >
                        <b.Icon size={20} color={b.color} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[15px] lg:text-base font-bold text-[#202124]">{b.name}</p>
                        <p className="text-[12.5px] text-[#5F6368] leading-snug">{b.exec}</p>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="ml-auto shrink-0"
                      >
                        <ChevronDown size={18} color={isOpen ? b.color : "#9AA0A6"} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 lg:px-7 pb-6 border-t border-[#F1F3F4] pt-5">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {b.items.map((it) => (
                                <div
                                  key={it.name}
                                  className="rounded-xl border border-[#E8EAED] bg-[#FAFBFC] p-3.5 hover:border-current transition-colors"
                                  style={{ color: b.color }}
                                >
                                  <p className="text-[12.5px] font-bold text-[#202124]">{it.name}</p>
                                  <p className="mt-1 text-[11.5px] leading-snug text-[#5F6368]">
                                    {it.note}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <p className="mt-4 text-[12.5px] leading-relaxed text-[#5F6368]">
                              <strong className="text-[#202124]">For architects: </strong>
                              {b.tech}
                              {b.citeKeys && <Cite k={b.citeKeys} />}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Reveal>

                {/* Animated connector */}
                {bi < BANDS.length - 1 && (
                  <div className="flex justify-center py-1" aria-hidden>
                    <motion.span
                      className="block w-0.5 h-5 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, ${b.color}66, ${BANDS[bi + 1].color}66)`,
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* Cross-cutting rail */}
          <Reveal delay={0.2}>
            <div className="mt-5 rounded-2xl bg-[#0B1F3A] px-5 lg:px-7 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">
                Across every layer
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                {CROSS.map((c) => (
                  <span key={c.label} className="flex items-center gap-2 text-[13px] font-semibold text-white/85">
                    <c.Icon size={15} color="#8AB4F8" />
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
