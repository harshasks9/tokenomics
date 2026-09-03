"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  GitBranch,
  Database,
  Share2,
  Landmark,
  ChevronDown,
} from "lucide-react";
import { Reveal, SectionHeading, Cite } from "./ui";

const POINTS = [
  {
    n: "01",
    Icon: Sparkles,
    color: "#8AB4F8",
    title: "Frontier intelligence, shipped continuously",
    line: "Gemini is a top-tier frontier model family — multimodal, long-context, with configurable reasoning depth — and the release cadence is the point: multiple frontier and Flash-class updates in 2026 alone.",
    detail:
      "Gemini 3.1 Pro offers 1M-token context and adjustable thinking budgets; the Flash line was updated four times between May and September 2026. For IRAS the relevant question is not which model leads a benchmark this quarter, but which platform reliably delivers the next leap without migration cost.",
    cites: ["gemini-models"],
  },
  {
    n: "02",
    Icon: GitBranch,
    color: "#81C995",
    title: "The right model for every job — including models Google didn’t build",
    line: "One platform carries Gemini, open-weight models under Apache 2.0, and third-party frontier models as first-class citizens. 'And', not 'or'.",
    detail:
      "Model Garden hosts 200+ models. Anthropic Claude models launch day-one as managed first-party options; Llama, Mistral, DeepSeek, Qwen and others are available; Gemma 4 ships under Apache 2.0 for full self-hosting. Model access is governable by org policy — choice without sprawl.",
    cites: ["model-garden", "claude-vertex", "gemma"],
  },
  {
    n: "03",
    Icon: Database,
    color: "#FDD663",
    title: "AI where the data already lives",
    line: "Intelligence moves to governed data — SQL-native AI in BigQuery, permission-aware enterprise search, grounding with citations — instead of data scattering to wherever each model runs.",
    detail:
      "BigQuery runs generation, embedding and vector search inside SQL against tables in place. Agent Search retrieves with source-system ACLs intact. Grounding constrains generation to approved corpora and attaches citations. For a tax authority, this is the difference between AI on the data estate and AI beside it.",
    cites: ["bigquery-ai", "grounding"],
  },
  {
    n: "04",
    Icon: Share2,
    color: "#F28B82",
    title: "Open agentic architecture",
    line: "The agent layer is built on open source and open standards — ADK, the Agent2Agent protocol under the Linux Foundation, MCP — so workflows are not hard-wired to one vendor’s framework.",
    detail:
      "Google donated A2A to the Linux Foundation; v1.0 now counts 150+ member organisations including AWS, Microsoft, SAP and ServiceNow. ADK is open source across four languages. MCP connects agents to tools through a cross-industry standard, with 50+ Google-managed servers. Agents IRAS builds here can interoperate with agents built anywhere.",
    cites: ["a2a", "adk", "mcp-servers", "mcp"],
  },
  {
    n: "05",
    Icon: Landmark,
    color: "#8AB4F8",
    title: "Built for Singapore, built for the long term",
    line: "In-country AI processing, air-gapped Gemini where policy demands it, Singapore-recognised certifications, purpose-built silicon economics — and a standing national AI partnership with the Singapore Government.",
    detail:
      "Google Cloud has operated in Singapore since 2017 and announced in-country residency for AI training and inference, on top of US$5B of local infrastructure investment. Gemini runs on Google Distributed Cloud air-gapped for fully disconnected workloads. MTCS SS 584 Tier 3 and ISO/IEC 42001 attest platform and AI management. And this is a working relationship, not a datasheet: AI Trailblazers put 100 government and industry GenAI use cases through delivery with Google Cloud, and the 2026 Google–Singapore National AI Partnership includes a joint sandbox on government use of AI agents.",
    cites: ["google-sg", "gdc", "mtcs", "iso42001", "trailblazers", "natl-partnership"],
  },
];

const ARCHETYPES = [
  {
    name: "Closed AI platforms",
    who: "Frontier model vendors accessed as a single API",
    gets: "Excellent models, fast feature velocity.",
    costs: "The application inherits one vendor’s roadmap, pricing and outages. Model choice is the one thing you don’t get.",
  },
  {
    name: "Hyperscalers without a frontier lab",
    who: "Broad clouds hosting other companies’ models",
    gets: "Breadth of catalogue and enterprise plumbing.",
    costs: "The intelligence is a tenant, not a resident: the platform doesn’t co-evolve with the frontier models it serves, or the silicon they run on.",
  },
  {
    name: "Google Cloud",
    who: "Frontier lab + enterprise cloud + open protocols in one",
    gets: "Gemini co-designed with the platform and TPUs it runs on — alongside open-weight and third-party models, and an agent layer built on open standards.",
    costs: "The honest trade-off: it is a strategic platform decision, and it deserves the governance scrutiny this site describes.",
    highlight: true,
  },
];

export default function WhyGoogle() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="iras-why" className="bg-[#0B1F3A]">
      <div className="section-container">
        <SectionHeading
          dark
          kicker="10 · Why Google Cloud"
          title="The argument, in five points."
          takeaway="Not a battlecard — an architectural position. Each point is verifiable, and each one compounds the others."
        />

        {/* Five points, expandable */}
        <div className="mt-12 max-w-4xl mx-auto space-y-3">
          {POINTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={p.n} delay={i * 0.06}>
                <div
                  className="rounded-2xl border transition-colors overflow-hidden"
                  style={{
                    borderColor: isOpen ? `${p.color}66` : "rgba(255,255,255,0.1)",
                    background: isOpen ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center gap-4 px-5 lg:px-7 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="text-[13px] font-bold tabular-nums shrink-0"
                      style={{ color: p.color }}
                    >
                      {p.n}
                    </span>
                    <p.Icon size={18} color={p.color} className="shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[15px] lg:text-base font-bold text-white leading-snug">
                        {p.title}
                      </p>
                      {!isOpen && (
                        <p className="text-[12px] text-white/45 truncate hidden sm:block">{p.line}</p>
                      )}
                    </div>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="ml-auto shrink-0">
                      <ChevronDown size={16} color="rgba(255,255,255,0.5)" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 lg:px-7 pb-6 lg:pl-[104px]">
                          <p className="text-[14.5px] font-medium text-white/85 leading-relaxed">
                            {p.line}
                          </p>
                          <p className="mt-3 text-[13px] leading-relaxed text-white/55">
                            {p.detail}
                            <Cite k={p.cites} dark />
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Architectural comparison */}
        <Reveal delay={0.15}>
          <p className="mt-16 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            The architectural comparison — three platform archetypes
          </p>
          <div className="mt-5 grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {ARCHETYPES.map((a) => (
              <div
                key={a.name}
                className="rounded-2xl border p-6 flex flex-col"
                style={{
                  borderColor: a.highlight ? "#8AB4F8" : "rgba(255,255,255,0.12)",
                  background: a.highlight ? "rgba(138,180,248,0.08)" : "rgba(255,255,255,0.03)",
                }}
              >
                <p className="text-[15px] font-bold text-white">{a.name}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/40">{a.who}</p>
                <p className="mt-4 text-[12.5px] leading-relaxed text-white/75">
                  <span className="font-bold" style={{ color: "#81C995" }}>
                    What you get:{" "}
                  </span>
                  {a.gets}
                </p>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/75">
                  <span className="font-bold" style={{ color: a.highlight ? "#8AB4F8" : "#F28B82" }}>
                    {a.highlight ? "What to scrutinise: " : "What it costs: "}
                  </span>
                  {a.costs}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[12px] text-white/35 max-w-2xl mx-auto">
            Conceptual comparison of platform archetypes, not a feature matrix — every major cloud
            is investing heavily in AI, and specific capabilities should be evaluated against
            IRAS requirements at procurement time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
