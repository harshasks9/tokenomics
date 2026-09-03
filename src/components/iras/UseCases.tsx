"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquareText,
  BadgeCheck,
  ShieldAlert,
  SearchCheck,
  FileScan,
  BookOpenText,
  Code2,
  ChevronRight,
  ArrowRight,
  Cpu,
  AlertOctagon,
} from "lucide-react";
import { C, Reveal, SectionHeading, ClaimTag, Cite } from "./ui";

type UseCase = {
  id: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  name: string;
  exec: string; // Level 1 — executive takeaway
  today: string[]; // Level 2 — today
  enabled: string[]; // Level 2 — AI-enabled
  flow?: string[]; // signature flow
  tech: { label: string; detail: string }[]; // Level 3
  guardrail?: string;
  todayCites?: Record<number, string[]>; // citation keys attached to specific "today" bullets
};

const USE_CASES: UseCase[] = [
  {
    id: "service",
    Icon: MessageSquareText,
    color: C.blue,
    name: "Intelligent Taxpayer Service",
    exec: "Every taxpayer gets an expert conversation, not a search result.",
    flow: ["Search", "Answer", "Reason", "Resolve"],
    today: [
      "Taxpayer searches, finds a page, interprets it alone.",
      "The IRAS Bot (VICA) already handles routine self-service with an LLM engine — a strong base to build on.",
      "Complex, multi-part questions still end in a call or an email queue.",
    ],
    enabled: [
      "The assistant understands intent across topics, asks clarifying questions, and reasons across multiple pieces of guidance.",
      "Every answer is grounded in IRAS-approved content and cited.",
      "With consent, it initiates permitted next steps — a draft entry, a payment plan request, a reminder.",
    ],
    tech: [
      { label: "Grounding & retrieval", detail: "Agent Search over IRAS guidance with ACL-aware retrieval; answers constrained to approved corpora with citations." },
      { label: "Model mix", detail: "Flash-class models for the millions of routine turns; a frontier reasoning model (Gemini 3.1 Pro-class) invoked only for hard interpretation." },
      { label: "Actions", detail: "Agent tools exposed via MCP to myTax Portal APIs; every action permissioned, logged, and confirmable by the taxpayer." },
    ],
    guardrail: "The assistant explains and assists; assessments remain IRAS system-of-record outcomes.",
    todayCites: { 1: ["vica"] },
  },
  {
    id: "officer",
    Icon: BadgeCheck,
    color: C.purple,
    name: "AI Case Officer",
    exec: "Officers start every case with a complete, cited brief.",
    flow: ["Summarize", "Research", "Compare", "Identify gaps", "Recommend", "Draft"],
    today: [
      "Context lives across systems: taxpayer history, correspondence, submissions, rulings.",
      "Assembling it consumes hours per non-trivial case.",
      "Consistency across officers depends on individual experience.",
    ],
    enabled: [
      "One workspace summarises the case, surfaces prior correspondence and applicable guidance, and flags inconsistencies.",
      "Comparable positions and precedent retrieved with the distinguishing facts highlighted.",
      "A draft response in house style, every factual sentence linked to its source — for the officer to edit and sign.",
    ],
    tech: [
      { label: "Long context", detail: "1M-token context windows let a single model pass hold an entire case file — correspondence, schedules and guidance together." },
      { label: "Retrieval", detail: "RAG over case management and policy stores; evidence-linked generation so every claim resolves to a document." },
      { label: "Evaluation", detail: "Gen AI evaluation service scores groundedness and quality continuously against curated officer-reviewed cases." },
    ],
    guardrail: "Human decision authority is a design constraint: the copilot never corresponds with taxpayers or decides outcomes.",
  },
  {
    id: "compliance",
    Icon: ShieldAlert,
    color: C.teal,
    name: "Intelligent Compliance",
    exec: "Traditional ML finds the signal. GenAI explains it and widens what can be seen.",
    today: [
      "IRAS already runs analytics and AI for risk profiling and fraud detection — publicly stated.",
      "Structured models see structured data; documents, correspondence and relationships are mostly out of reach.",
      "Findings require analyst translation before officers can act.",
    ],
    enabled: [
      "Anomaly detection and risk scoring stay classical ML — trained, versioned, explainable.",
      "GenAI adds the unstructured layer: reading supporting documents, mapping entity relationships, discovering patterns worth modelling.",
      "Every flag arrives with a plain-language explanation and the evidence behind it, ranked for investigation value.",
    ],
    tech: [
      { label: "Data foundation", detail: "BigQuery as the analytical spine: SQL-native AI.GENERATE and embeddings bring model inference to the data, not data to the model." },
      { label: "Hybrid modelling", detail: "Classical models (risk scoring, anomaly detection) alongside LLM-based document and relationship analysis — each doing what it is best at." },
      { label: "Pattern discovery", detail: "Vector search across filings and documents finds structurally similar cases no rule anticipated." },
    ],
    guardrail: "No LLM determines tax liability or enforcement action. Models prioritise and explain; officers decide.",
    todayCites: { 0: ["iras-ai"] },
  },
  {
    id: "audit",
    Icon: SearchCheck,
    color: C.amber,
    name: "Audit & Investigation Assistant",
    exec: "An evidence-backed workspace that answers “why does this look unusual?”",
    today: [
      "Investigators reconstruct timelines, relationships and money flows by hand.",
      "Cross-referencing registries, filings and bank records takes weeks.",
      "S$507M was recovered from over 8,600 cases in FY2024/25 — every hour of investigator time is high-leverage.",
    ],
    enabled: [
      "Ask a question; the system assembles relevant transactions, relationships, timeline, anomalies, documents and comparable cases.",
      "Applicable policies and citations attached to every element.",
      "Recommended focus areas — with documented evidence visually separated from AI inference.",
    ],
    tech: [
      { label: "Entity resolution", detail: "Graph analysis over registry, filing and transaction data; LLM-assisted entity matching across name and address variants." },
      { label: "Evidence chain", detail: "Every AI-surfaced item carries provenance metadata; inference is labelled and cannot masquerade as fact." },
      { label: "Comparable retrieval", detail: "Embedding search over closed cases surfaces precedent structures for the investigation strategy." },
    ],
    guardrail: "The workspace builds the picture; investigative and legal conclusions remain human.",
    todayCites: { 2: ["iras-ar"] },
  },
  {
    id: "documents",
    Icon: FileScan,
    color: C.red,
    name: "Document Intelligence",
    exec: "Every document IRAS receives becomes structured, validated data.",
    flow: ["Ingest", "Understand", "Extract", "Validate", "Reason", "Route", "Review"],
    today: [
      "Financial statements, invoices, receipts, schedules and correspondence arrive as PDFs and scans.",
      "Manual review scales linearly with volume.",
      "InvoiceNow will mandate structured e-invoices for all GST-registered businesses by April 2031 — but the long tail of documents remains unstructured.",
    ],
    enabled: [
      "Multimodal models read forms, statements and scans natively — layout, tables, handwriting and stamps included.",
      "Extraction is validated against filed data; discrepancies reasoned about, not just flagged.",
      "Clean cases route straight through; only exceptions reach a human queue.",
    ],
    tech: [
      { label: "Multimodal ingestion", detail: "Gemini-class models accept PDF, image and scanned input directly; Document AI layout parsing preserves structure for retrieval." },
      { label: "Validation logic", detail: "Extracted values reconciled against returns and third-party data; confidence-scored with reasoned discrepancy notes." },
      { label: "Scale economics", detail: "Flash-class and specialised extraction models keep per-document cost low enough for population-scale processing." },
    ],
    todayCites: { 2: ["iras-invoicenow"] },
  },
  {
    id: "knowledge",
    Icon: BookOpenText,
    color: C.green,
    name: "Institutional Knowledge",
    exec: "Decades of policy and precedent, available to every officer in seconds.",
    flow: ["Keyword search", "Semantic search", "Grounded answers", "Reasoning", "Agentic knowledge"],
    today: [
      "Interpretations, operating procedures, historical positions and training content live in silos.",
      "Expertise concentrates in long-tenured officers; onboarding takes years.",
      "Knowledge leaves when people do.",
    ],
    enabled: [
      "One governed knowledge layer across policies, e-Tax Guides, rulings, procedures and training material.",
      "Officers ask questions and get grounded, cited answers that reconcile multiple sources.",
      "Over time, knowledge becomes agentic: proactively surfaced in the flow of casework, not searched for.",
    ],
    tech: [
      { label: "Semantic layer", detail: "Embeddings and vector search over the full corpus; hierarchy-preserving chunking keeps legal structure intact." },
      { label: "Grounded generation", detail: "Answers cite passages; conflicting guidance is surfaced as conflicting, not silently merged." },
      { label: "Access control", detail: "Retrieval honours document-level permissions — an officer sees only what their role allows." },
    ],
  },
  {
    id: "devs",
    Icon: Code2,
    color: C.blueDeep,
    name: "Modernization & Developer Productivity",
    exec: "The teams that run IRIN ship faster — and legacy gets a path forward.",
    today: [
      "Core tax systems carry decades of accumulated logic.",
      "Documentation lags reality; change is slow because understanding is slow.",
      "Modernization competes with keeping the lights on.",
    ],
    enabled: [
      "AI-assisted code understanding across legacy estates: what this module does, what depends on it, what breaks if it changes.",
      "Generated tests, documentation and migration scaffolding — reviewed by engineers, not replacing them.",
      "Operations copilots that turn incident investigation from hours to minutes.",
    ],
    tech: [
      { label: "Code intelligence", detail: "Long-context models reason over whole subsystems at once — legacy analysis without pre-chunking the estate." },
      { label: "SDLC integration", detail: "Assistance embedded in the development workflow: reviews, tests, docs and migration plans as first-class outputs." },
      { label: "Ops", detail: "AI over logs, traces and runbooks for faster diagnosis; every suggestion linked to the telemetry that produced it." },
    ],
  },
];

export default function UseCases() {
  const [activeId, setActiveId] = useState("service");
  const [mode, setMode] = useState<"today" | "enabled">("enabled");
  const [showTech, setShowTech] = useState(false);
  const uc = USE_CASES.find((u) => u.id === activeId)!;

  return (
    <section id="iras-usecases" className="bg-[#F8F9FA] border-t border-[#F1F3F4]">
      <div className="section-container">
        <SectionHeading
          kicker="03 · Use Cases"
          title="Seven places where AI changes the work."
          takeaway="Chosen for value to IRAS and for where Google Cloud is technically differentiated — not a generic government AI list."
        />
        <Reveal delay={0.05} className="mt-3">
          <ClaimTag kind="scenario" />
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-7 gap-6">
          {/* Selector rail */}
          <div className="lg:col-span-2 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {USE_CASES.map((u) => {
              const active = u.id === activeId;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    setActiveId(u.id);
                    setShowTech(false);
                  }}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all shrink-0 lg:shrink"
                  style={{
                    background: active ? "#fff" : "transparent",
                    borderColor: active ? u.color : "#E8EAED",
                    boxShadow: active ? `0 4px 16px ${u.color}22` : "none",
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: `${u.color}14` }}
                  >
                    <u.Icon size={15} color={u.color} />
                  </span>
                  <span
                    className="text-[13px] font-semibold leading-tight"
                    style={{ color: active ? "#202124" : "#5F6368" }}
                  >
                    {u.name}
                  </span>
                  {active && <ChevronRight size={14} color={u.color} className="ml-auto hidden lg:block shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={uc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="rounded-2xl border border-[#E8EAED] bg-white p-6 lg:p-8 shadow-sm"
              >
                {/* Level 1 */}
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: uc.color }}>
                      Executive takeaway
                    </p>
                    <h3 className="mt-1 text-xl lg:text-2xl font-bold text-[#202124] max-w-lg leading-snug">
                      {uc.exec}
                    </h3>
                  </div>
                  {/* Today / AI toggle */}
                  <div className="inline-flex rounded-full border border-[#E8EAED] bg-[#F8F9FA] p-1">
                    {(["today", "enabled"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className="rounded-full px-3.5 py-1.5 text-xs font-bold transition-all"
                        style={{
                          background: mode === m ? (m === "enabled" ? uc.color : "#5F6368") : "transparent",
                          color: mode === m ? "#fff" : "#5F6368",
                        }}
                      >
                        {m === "today" ? "Today" : "AI-enabled"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Signature flow */}
                {uc.flow && (
                  <div className="mt-5 flex flex-wrap items-center gap-1.5">
                    {uc.flow.map((f, i) => (
                      <span key={f} className="flex items-center gap-1.5">
                        <span
                          className="rounded-md px-2.5 py-1 text-[11px] font-bold"
                          style={{
                            background: mode === "enabled" || i === 0 ? `${uc.color}12` : "#F1F3F4",
                            color: mode === "enabled" || i === 0 ? uc.color : "#9AA0A6",
                          }}
                        >
                          {f}
                        </span>
                        {i < uc.flow!.length - 1 && <ArrowRight size={11} color="#BDC1C6" />}
                      </span>
                    ))}
                    {mode === "today" && (
                      <span className="ml-1 text-[10px] font-semibold text-[#9AA0A6] uppercase tracking-wide">
                        — today stops at step one
                      </span>
                    )}
                  </div>
                )}

                {/* Level 2 */}
                <AnimatePresence mode="wait">
                  <motion.ul
                    key={mode}
                    initial={{ opacity: 0, x: mode === "enabled" ? 14 : -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-5 space-y-2.5"
                  >
                    {(mode === "today" ? uc.today : uc.enabled).map((line, i) => (
                      <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-[#3C4043]">
                        <span
                          className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: mode === "enabled" ? uc.color : "#BDC1C6" }}
                        />
                        <span>
                          {line}
                          {mode === "today" && uc.todayCites?.[i] && <Cite k={uc.todayCites[i]} />}
                        </span>
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>

                {/* Guardrail */}
                {uc.guardrail && (
                  <p className="mt-5 flex items-start gap-2 rounded-xl border border-[#FCE8E6] bg-[#FEF7F6] px-4 py-3 text-[12.5px] leading-relaxed text-[#A50E0E]">
                    <AlertOctagon size={14} className="mt-0.5 shrink-0" />
                    <span>
                      <strong>Boundary:</strong> {uc.guardrail}
                    </span>
                  </p>
                )}

                {/* Level 3 */}
                <div className="mt-5 border-t border-[#F1F3F4] pt-4">
                  <button
                    onClick={() => setShowTech((v) => !v)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5F6368] hover:text-[#202124] transition-colors"
                    aria-expanded={showTech}
                  >
                    <Cpu size={13} />
                    How it&rsquo;s built
                    <motion.span animate={{ rotate: showTech ? 90 : 0 }}>
                      <ChevronRight size={13} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {showTech && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 grid sm:grid-cols-3 gap-3">
                          {uc.tech.map((t) => (
                            <div key={t.label} className="rounded-xl bg-[#F8F9FA] border border-[#E8EAED] p-3.5">
                              <p className="text-[11px] font-bold" style={{ color: uc.color }}>
                                {t.label}
                              </p>
                              <p className="mt-1 text-[12px] leading-relaxed text-[#5F6368]">{t.detail}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
