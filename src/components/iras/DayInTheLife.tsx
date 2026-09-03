"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  BadgeCheck,
  SearchCheck,
  MessageCircleQuestion,
  ListChecks,
  FileText,
  Landmark,
  AlertTriangle,
  Scale,
  Network,
  Clock,
  ChevronRight,
  RotateCcw,
  Bot,
  Quote,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";
import { C, Reveal, SectionHeading, ClaimTag, Chip } from "./ui";

/* ─────────────────────────────────────────────────────────────
   Persona 1 — Taxpayer conversation, step-through
   ────────────────────────────────────────────────────────────── */

type ChatStep = {
  role: "user" | "ai" | "system";
  model?: string;
  text?: string;
  bullets?: string[];
  citations?: string[];
  action?: string;
};

const TAXPAYER_STEPS: ChatStep[] = [
  {
    role: "user",
    text: "I received income from Singapore and overseas employment, and I sold some shares this year. What do I need to declare?",
  },
  {
    role: "system",
    text: "Intent understood: individual income tax · foreign income · capital transactions. Router selects a reasoning model and grounds it in IRAS-approved guidance only.",
  },
  {
    role: "ai",
    model: "Reasoning model · grounded",
    text: "Your situation has three parts. Here is what matters for each:",
    bullets: [
      "Singapore employment income — taxable. If your employer is in the Auto-Inclusion Scheme, it is already pre-filled in your return.",
      "Overseas employment income — generally not taxable if earned from employment exercised outside Singapore, but there are exceptions (for example, work incidental to Singapore employment or income received through a partnership).",
      "Share disposal — Singapore has no capital gains tax, so gains are usually not taxable. But if you trade shares frequently enough to be treated as trading income, the position changes.",
    ],
    citations: [
      "IRAS · Taxable & non-taxable income",
      "IRAS · Income received from overseas",
      "IRAS · Gains from sale of property, shares and financial instruments",
    ],
  },
  {
    role: "ai",
    model: "Clarifying",
    text: "To give you a precise answer on the overseas income, may I ask: was the overseas employment exercised while you were physically outside Singapore, or did you work remotely from Singapore for a foreign employer?",
  },
  {
    role: "user",
    text: "I worked remotely from Singapore for a foreign employer.",
  },
  {
    role: "ai",
    model: "Reasoning model · grounded",
    text: "That changes the answer. Employment exercised in Singapore — even for a foreign employer — is generally taxable here. Your remote-work income should be declared as employment income.",
    citations: ["IRAS · Working remotely from Singapore for overseas employers"],
  },
  {
    role: "ai",
    model: "Next steps",
    text: "Would you like me to prepare this for you?",
    bullets: [
      "Add the foreign-employer income as a draft entry in your income tax return",
      "Show which reliefs you may still claim against it",
      "Set a reminder before the filing deadline",
    ],
    action: "Draft prepared for your review — nothing is filed until you confirm.",
  },
];

/* ─────────────────────────────────────────────────────────────
   Persona 2 — Case officer workspace, panel-by-panel build
   ────────────────────────────────────────────────────────────── */

const OFFICER_PANELS = [
  {
    id: "summary",
    Icon: FileText,
    title: "Case summary",
    tone: C.blue,
    lines: [
      "Company (services, ~S$4.2M revenue) queried on a corporate income tax adjustment.",
      "Open item: deductibility of S$180K in 'professional fees' reclassified last year.",
      "Taxpayer has responded twice; second response adds three invoices and a contract.",
    ],
  },
  {
    id: "history",
    Icon: Clock,
    title: "History & correspondence",
    tone: C.teal,
    lines: [
      "6 prior touchpoints across 14 months, summarized from the full thread.",
      "Taxpayer's position has shifted once: initially 'consultancy', now 'project management services'.",
      "Similar query on the same expense category was resolved in taxpayer's favour two years ago — different facts.",
    ],
  },
  {
    id: "guidance",
    Icon: Landmark,
    title: "Applicable guidance",
    tone: C.purple,
    lines: [
      "General deductibility tests: wholly and exclusively incurred in producing income.",
      "e-Tax Guide passages on professional-fee deductibility, retrieved and quoted with links.",
      "Two comparable precedent positions with the distinguishing facts highlighted.",
    ],
  },
  {
    id: "gaps",
    Icon: AlertTriangle,
    title: "Unusual items & gaps",
    tone: C.amber,
    lines: [
      "Invoice #2 predates the signed contract by four months.",
      "Fee total on invoices (S$168K) does not reconcile with claimed amount (S$180K).",
      "Counterparty shares a registered address with a related entity of the taxpayer.",
    ],
  },
  {
    id: "draft",
    Icon: ListChecks,
    title: "Suggested questions & draft reply",
    tone: C.green,
    lines: [
      "Three targeted follow-up questions, each tied to a specific gap above.",
      "Draft response in IRAS house style — every factual sentence carries a source link.",
      "Officer edits, approves and sends. The AI never corresponds directly.",
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   Persona 3 — Investigator: entity graph + evidence timeline
   ────────────────────────────────────────────────────────────── */

const GRAPH_NODES = [
  { id: "A", label: "Entity A", x: 50, y: 22, kind: "subject" },
  { id: "B", label: "Entity B", x: 16, y: 52, kind: "related" },
  { id: "C", label: "Entity C", x: 82, y: 50, kind: "related" },
  { id: "D", label: "Director X", x: 34, y: 84, kind: "person" },
  { id: "E", label: "Supplier E", x: 72, y: 86, kind: "flag" },
];

const GRAPH_EDGES = [
  { from: "A", to: "B", label: "Shared director", evidence: true },
  { from: "A", to: "C", label: "62% of revenue", evidence: true },
  { from: "B", to: "D", label: "Director", evidence: true },
  { from: "A", to: "D", label: "Director", evidence: true },
  { from: "C", to: "E", label: "Circular payments?", evidence: false },
  { from: "B", to: "E", label: "Same address", evidence: true },
];

const INVESTIGATOR_FINDINGS = [
  {
    kind: "evidence" as const,
    text: "Entities A and B share a director and B shares a registered address with Supplier E (registry records).",
  },
  {
    kind: "evidence" as const,
    text: "62% of Entity A's reported revenue in the period comes from Entity C (filed returns and invoices).",
  },
  {
    kind: "inference" as const,
    text: "Payment timing between C and E is consistent with circular flows — 11 transfers within 48h windows of matching amounts.",
  },
  {
    kind: "inference" as const,
    text: "Declared margins diverge from the sector's typical band; comparable-case retrieval surfaces two prior investigations with similar structures.",
  },
];

/* ─────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────── */

const PERSONAS = [
  { id: "taxpayer", label: "Taxpayer", Icon: User },
  { id: "officer", label: "Case Officer", Icon: BadgeCheck },
  { id: "investigator", label: "Investigator", Icon: SearchCheck },
] as const;

type PersonaId = (typeof PERSONAS)[number]["id"];

export default function DayInTheLife() {
  const [persona, setPersona] = useState<PersonaId>("taxpayer");
  const [tpStep, setTpStep] = useState(1);
  const [offStep, setOffStep] = useState(1);
  const [invStep, setInvStep] = useState(0); // 0 = question, 1 = graph, 2 = findings

  return (
    <section id="iras-day" className="bg-[#0B1F3A]">
      <div className="section-container">
        <SectionHeading
          dark
          kicker="04 · A Day in the Life"
          title="What it feels like when it works."
          takeaway="Three simulated experiences — a taxpayer, a case officer, an investigator. Step through each one the way its user would."
        />
        <Reveal delay={0.05} className="mt-3">
          <ClaimTag kind="scenario" dark />
        </Reveal>

        {/* Persona tabs */}
        <Reveal delay={0.1}>
          <div className="mt-8 inline-flex rounded-2xl border border-white/10 bg-white/5 p-1.5 gap-1">
            {PERSONAS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setPersona(id)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                style={{
                  background: persona === id ? C.blue : "transparent",
                  color: persona === id ? "#fff" : "rgba(255,255,255,0.55)",
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {/* ── Taxpayer ─────────────────────────────── */}
            {persona === "taxpayer" && (
              <motion.div
                key="taxpayer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-3 gap-6"
              >
                <div className="lg:col-span-2 rounded-2xl bg-white p-5 lg:p-7 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#E8EAED] pb-3">
                    <p className="text-sm font-bold text-[#202124]">
                      Taxpayer Assistant
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA0A6]">
                        Simulated
                      </span>
                    </p>
                    <button
                      onClick={() => setTpStep(1)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#5F6368] hover:text-[#202124]"
                    >
                      <RotateCcw size={12} /> Restart
                    </button>
                  </div>
                  <div className="mt-4 space-y-4 min-h-[380px]">
                    {TAXPAYER_STEPS.slice(0, tpStep).map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        {step.role === "user" && (
                          <div className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#1A73E8] px-4 py-3 text-sm text-white leading-relaxed">
                              {step.text}
                            </div>
                          </div>
                        )}
                        {step.role === "system" && (
                          <div className="flex justify-center">
                            <p className="max-w-[90%] text-center text-[11px] font-medium text-[#9AA0A6] italic px-4">
                              {step.text}
                            </p>
                          </div>
                        )}
                        {step.role === "ai" && (
                          <div className="flex gap-3">
                            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8F0FE]">
                              <Bot size={14} color={C.blue} />
                            </span>
                            <div className="max-w-[85%]">
                              {step.model && (
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#9AA0A6]">
                                  {step.model}
                                </p>
                              )}
                              <div className="rounded-2xl rounded-tl-md bg-[#F8F9FA] border border-[#E8EAED] px-4 py-3 text-sm text-[#202124] leading-relaxed">
                                {step.text}
                                {step.bullets && (
                                  <ul className="mt-2 space-y-1.5">
                                    {step.bullets.map((b, j) => (
                                      <li key={j} className="flex gap-2 text-[13px]">
                                        <span
                                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                                          style={{ background: C.blue }}
                                        />
                                        {b}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                {step.citations && (
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {step.citations.map((c) => (
                                      <span
                                        key={c}
                                        className="inline-flex items-center gap-1 rounded-md bg-white border border-[#E8EAED] px-2 py-0.5 text-[10px] font-medium text-[#5F6368]"
                                      >
                                        <Quote size={9} /> {c}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {step.action && (
                                  <p className="mt-3 rounded-lg bg-[#E6F4EA] px-3 py-2 text-[12px] font-semibold text-[#188038]">
                                    ✓ {step.action}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-5 flex justify-center border-t border-[#E8EAED] pt-4">
                    {tpStep < TAXPAYER_STEPS.length ? (
                      <button
                        onClick={() => setTpStep((v) => v + 1)}
                        className="btn-primary"
                      >
                        Continue the conversation <ChevronRight size={15} />
                      </button>
                    ) : (
                      <p className="text-xs font-semibold text-[#188038]">
                        End of scenario — the taxpayer got an answer, not a link.
                      </p>
                    )}
                  </div>
                </div>

                {/* Sidebar: what made this possible */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    What made this possible
                  </p>
                  <ul className="mt-4 space-y-4">
                    {[
                      {
                        t: "Intent, not keywords",
                        d: "The question spans three tax topics. The assistant decomposes it instead of matching one FAQ.",
                      },
                      {
                        t: "Grounded in IRAS guidance only",
                        d: "Every statement is retrieved from approved content and cited. No open-web answers.",
                      },
                      {
                        t: "It asks before it assumes",
                        d: "The remote-work clarification flips the tax outcome. A search box would never have asked.",
                      },
                      {
                        t: "Reasoning where it matters",
                        d: "A frontier model handles the interpretation; a Flash-class model can handle the millions of routine queries around it.",
                      },
                      {
                        t: "Action with consent",
                        d: "The workflow ends in a draft the taxpayer reviews — assistance, not automation of consent.",
                      },
                    ].map((item) => (
                      <li key={item.t} className="flex gap-3">
                        <Lightbulb size={15} className="mt-0.5 shrink-0" color="#8AB4F8" />
                        <div>
                          <p className="text-[13px] font-bold text-white">{item.t}</p>
                          <p className="mt-0.5 text-[12px] leading-relaxed text-white/55">
                            {item.d}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* ── Case Officer ─────────────────────────── */}
            {persona === "officer" && (
              <motion.div
                key="officer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-2xl bg-white p-5 lg:p-7 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EAED] pb-3">
                    <div>
                      <p className="text-sm font-bold text-[#202124]">
                        Officer Copilot — Case Workspace
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA0A6]">
                          Simulated
                        </span>
                      </p>
                      <p className="text-xs text-[#5F6368] mt-0.5 italic">
                        &ldquo;Give me everything I need to understand this case before I respond.&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setOffStep(1)}
                        className="flex items-center gap-1 text-xs font-semibold text-[#5F6368] hover:text-[#202124]"
                      >
                        <RotateCcw size={12} /> Reset
                      </button>
                      {offStep < OFFICER_PANELS.length ? (
                        <button onClick={() => setOffStep((v) => v + 1)} className="btn-primary !py-2 !px-3.5">
                          Build the brief <ChevronRight size={14} />
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#188038]">Brief complete</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 grid md:grid-cols-2 xl:grid-cols-3 gap-4 min-h-[300px]">
                    {OFFICER_PANELS.slice(0, offStep).map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i === offStep - 1 ? 0 : 0 }}
                        className="rounded-xl border p-4"
                        style={{ borderColor: `${p.tone}30`, background: `${p.tone}07` }}
                      >
                        <p
                          className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider"
                          style={{ color: p.tone }}
                        >
                          <p.Icon size={13} /> {p.title}
                        </p>
                        <ul className="mt-2.5 space-y-2">
                          {p.lines.map((l, j) => (
                            <li key={j} className="flex gap-2 text-[12.5px] leading-snug text-[#3C4043]">
                              <span
                                className="mt-[6px] h-1 w-1 shrink-0 rounded-full"
                                style={{ background: p.tone }}
                              />
                              {l}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                    {offStep < OFFICER_PANELS.length && (
                      <button
                        onClick={() => setOffStep((v) => v + 1)}
                        className="rounded-xl border-2 border-dashed border-[#DADCE0] p-4 flex flex-col items-center justify-center gap-2 text-[#9AA0A6] hover:border-[#1A73E8] hover:text-[#1A73E8] transition-colors min-h-[140px]"
                      >
                        <ChevronRight size={20} />
                        <span className="text-xs font-semibold">
                          Next: {OFFICER_PANELS[offStep].title}
                        </span>
                      </button>
                    )}
                  </div>
                  <p className="mt-4 rounded-lg bg-[#F8F9FA] border border-[#E8EAED] px-4 py-2.5 text-[12px] text-[#5F6368]">
                    <strong className="text-[#202124]">Decision authority stays human.</strong>{" "}
                    The copilot assembles, compares and drafts. The officer judges, edits and signs.
                    Every AI-supplied fact links back to the underlying document.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Investigator ─────────────────────────── */}
            {persona === "investigator" && (
              <motion.div
                key="investigator"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-6"
              >
                {/* Left: entity graph */}
                <div className="rounded-2xl bg-white p-5 lg:p-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#E8EAED] pb-3">
                    <div>
                      <p className="text-sm font-bold text-[#202124]">
                        Investigation Workspace
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-[#9AA0A6]">
                          Simulated
                        </span>
                      </p>
                      <p className="text-xs text-[#5F6368] mt-0.5 italic">
                        &ldquo;Why does this taxpayer appear unusual?&rdquo;
                      </p>
                    </div>
                    <button
                      onClick={() => setInvStep((v) => (v >= 2 ? 0 : v + 1))}
                      className="btn-primary !py-2 !px-3.5"
                    >
                      {invStep === 0 ? "Map relationships" : invStep === 1 ? "Surface findings" : "Restart"}
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="relative mt-4 h-[300px] rounded-xl bg-[#F8F9FA] border border-[#E8EAED] overflow-hidden">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
                      {GRAPH_EDGES.map((e, i) => {
                        const a = GRAPH_NODES.find((n) => n.id === e.from)!;
                        const b = GRAPH_NODES.find((n) => n.id === e.to)!;
                        return (
                          <motion.line
                            key={i}
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            stroke={e.evidence ? "#5F6368" : C.amber}
                            strokeWidth={e.evidence ? 0.5 : 0.8}
                            strokeDasharray={e.evidence ? "0" : "2 1.6"}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={
                              invStep >= 1
                                ? { pathLength: 1, opacity: 1 }
                                : { pathLength: 0, opacity: 0 }
                            }
                            transition={{ duration: 0.7, delay: i * 0.12 }}
                          />
                        );
                      })}
                    </svg>
                    {GRAPH_NODES.map((n, i) => (
                      <motion.div
                        key={n.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                        style={{ left: `${n.x}%`, top: `${n.y}%` }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={
                          invStep >= 1 || n.kind === "subject"
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0.25, scale: 0.8 }
                        }
                        transition={{ delay: i * 0.08, type: "spring", stiffness: 260, damping: 20 }}
                      >
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white shadow-sm"
                          style={{
                            borderColor:
                              n.kind === "subject"
                                ? C.blue
                                : n.kind === "flag"
                                  ? C.amber
                                  : n.kind === "person"
                                    ? C.purple
                                    : "#9AA0A6",
                          }}
                        >
                          {n.kind === "person" ? (
                            <User size={15} color={C.purple} />
                          ) : (
                            <Network
                              size={15}
                              color={
                                n.kind === "subject" ? C.blue : n.kind === "flag" ? C.amber : "#5F6368"
                              }
                            />
                          )}
                        </span>
                        <span className="mt-1 rounded bg-white/90 px-1.5 text-[9.5px] font-bold text-[#3C4043] shadow-sm">
                          {n.label}
                        </span>
                      </motion.div>
                    ))}
                    {invStep >= 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute bottom-2 left-2 flex gap-3 rounded-lg bg-white/95 border border-[#E8EAED] px-2.5 py-1.5 text-[9px] font-semibold text-[#5F6368]"
                      >
                        <span className="flex items-center gap-1">
                          <span className="h-[2px] w-4 bg-[#5F6368]" /> Documented link
                        </span>
                        <span className="flex items-center gap-1">
                          <span
                            className="h-[2px] w-4"
                            style={{
                              backgroundImage: `repeating-linear-gradient(90deg, ${C.amber}, ${C.amber} 3px, transparent 3px, transparent 6px)`,
                            }}
                          />
                          AI-inferred pattern
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Right: findings, evidence vs inference */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Findings — evidence kept separate from inference
                  </p>
                  <div className="mt-4 space-y-3 min-h-[220px]">
                    {invStep >= 2 ? (
                      INVESTIGATOR_FINDINGS.map((f, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="rounded-xl border p-3.5"
                          style={{
                            borderColor: f.kind === "evidence" ? "#18803866" : `${C.amber}66`,
                            background:
                              f.kind === "evidence" ? "rgba(52,168,83,0.08)" : "rgba(227,116,0,0.08)",
                          }}
                        >
                          <p
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: f.kind === "evidence" ? "#81C995" : "#FDD663" }}
                          >
                            {f.kind === "evidence" ? <Scale size={11} /> : <ShieldAlert size={11} />}
                            {f.kind === "evidence" ? "Evidence · documented" : "AI inference · verify"}
                          </p>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">{f.text}</p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-white/35 italic pt-8 text-center">
                        {invStep === 0
                          ? "Ask the question, then map relationships to begin."
                          : "Relationships mapped. Surface findings to see what deserves investigation."}
                      </p>
                    )}
                  </div>
                  {invStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-4 rounded-xl bg-white/10 p-4"
                    >
                      <p className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                        <MessageCircleQuestion size={13} color="#8AB4F8" />
                        Recommended focus areas
                      </p>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/60">
                        Trace the 11 matched C→E transfers against bank records · verify the
                        economic substance of the B–E shared address · obtain the contracts behind
                        Entity C&rsquo;s 62% revenue share. The system recommends; the investigator
                        decides what is pursued.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Common thread */}
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Chip color="#8AB4F8" dark>Grounded, cited answers</Chip>
            <Chip color="#81C995" dark>Human decision authority</Chip>
            <Chip color="#FDD663" dark>Evidence ≠ inference</Chip>
            <Chip color="#F28B82" dark>Different models per task — same experience</Chip>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
