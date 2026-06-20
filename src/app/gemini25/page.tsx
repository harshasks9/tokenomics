"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useActiveSection } from "@/lib/hooks";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Home,
  Layers,
  DollarSign,
  Shield,
  Clock,
  BarChart3,
  Bot,
  GitBranch,
  ArrowRight,
  Info,
  TrendingDown,
} from "lucide-react";

// ─── Palette ─────────────────────────────────────────────────────────────────
const G_BLUE    = "#1A73E8";
const G_PURPLE  = "#7C3AED";
const AMBER     = "#D97706";
const GREEN     = "#059669";
const RED       = "#DC2626";

// ─── Sticky Nav ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: "overview",   label: "Overview",        Icon: Home       },
  { id: "correction", label: "Naming Alert",    Icon: AlertTriangle },
  { id: "models",     label: "Model Landscape", Icon: Layers     },
  { id: "decision",   label: "Decision Tree",   Icon: GitBranch  },
  { id: "archetypes", label: "Archetypes",      Icon: Bot        },
  { id: "economics",  label: "Economics",       Icon: DollarSign },
  { id: "risks",      label: "Risk Register",   Icon: Shield     },
  { id: "roadmap",    label: "Roadmap",         Icon: Clock      },
  { id: "pov",        label: "Proof of Value",  Icon: BarChart3  },
];

function StickyNav() {
  const active = useActiveSection(NAV_SECTIONS.map((s) => s.id));
  return (
    <nav className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-[#E8EAED] z-50 hidden lg:flex flex-col py-8 px-4 overflow-y-auto">
      <Link href="/" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-[#5F6368]/50 hover:text-[#5F6368] transition-colors mb-1">
        ← Home
      </Link>
      <div className="mb-8 px-3">
        <div className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: G_BLUE }}>Gemini Migration</div>
        <div className="text-[10px] font-semibold tracking-wider uppercase text-[#BDC1C6]">Intelligence Brief · Jun 2026</div>
      </div>
      <div className="flex-1 space-y-0.5">
        {NAV_SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 group ${
                isActive ? "text-[#202124]" : "text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]"
              }`}
              style={isActive ? { backgroundColor: `${G_BLUE}15` } : undefined}
            >
              <s.Icon
                className="w-3.5 h-3.5 shrink-0"
                style={isActive ? { color: G_BLUE } : { color: "#9AA0A6" }}
              />
              <span>{s.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: G_BLUE }} />}
            </a>
          );
        })}
      </div>
      <div className="mt-auto px-3">
        <div className="text-[10px] text-[#9AA0A6] leading-relaxed">
          Research as of 20 Jun 2026<br />
          Re-verify before customer use
        </div>
      </div>
    </nav>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, bg = "white", children }: { id: string; bg?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section
      id={id}
      ref={ref}
      className="border-b border-[#E8EAED]"
      style={{ backgroundColor: bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
        className="max-w-4xl mx-auto px-6 py-20 lg:py-24"
      >
        {children}
      </motion.div>
    </section>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────
function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: `${color}60`, backgroundColor: `${color}10` }}
    >
      {label}
    </span>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mb-10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#9AA0A6] mb-2">{eyebrow}</p>
      <h2 className="text-3xl lg:text-4xl font-extrabold text-[#202124] mb-3 leading-tight">{title}</h2>
      {body && <p className="text-[#5F6368] text-base max-w-2xl leading-relaxed">{body}</p>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#E8EAED] bg-white shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

// ─── 1. Hero / Overview ───────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="overview"
      className="relative overflow-hidden min-h-screen flex flex-col justify-center"
      style={{ background: "linear-gradient(160deg, #060d1f 0%, #0d1d3e 35%, #060d1f 65%, #050c1a 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-28 lg:py-36">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-8"
            style={{ borderColor: `${G_BLUE}50`, backgroundColor: `${G_BLUE}15` }}>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: G_BLUE }}>
              Gemini Migration Intelligence Brief · June 2026
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
        >
          Migration is not a version upgrade.<br />
          <span style={{ color: G_BLUE }}>It is a workload-level re-platforming.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/60 text-lg max-w-2xl mb-14 leading-relaxed"
        >
          Gemini 3.5 Flash is genuinely more capable — but Flash input pricing moved from $0.30 to $1.50 per million tokens.
          The new generation raises the feasible frontier; it does not lower your bill. The right answer is per-workload,
          measured on cost per successful business outcome.
        </motion.p>

        {/* 3 key stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14"
        >
          {[
            { label: "3.5 Flash vs 2.5 Flash input price", value: "5×", sub: "$1.50 vs $0.30 /M tokens", color: AMBER, doc: "Documented" },
            { label: "2.5 family retirement (earliest)", value: "Oct 16 2026", sub: "Final date at Gemini 3 GA + 6mo notice", color: G_BLUE, doc: "Documented" },
            { label: "Enterprise-GA \"3.5 Pro\" exists", value: "No", sub: "Not listed on Agent Platform as of Jun 18", color: RED, doc: "Documented" },
          ].map((s) => (
            <div key={s.label}
              className="rounded-2xl p-5 border"
              style={{ borderColor: `${s.color}40`, backgroundColor: `${s.color}12` }}
            >
              <p className="text-4xl font-extrabold text-white mb-1">{s.value}</p>
              <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-xs text-white/35">{s.sub}</p>
              <span className="mt-2 inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{ color: s.color, borderColor: `${s.color}60`, backgroundColor: `${s.color}15` }}>
                {s.doc}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Executive thesis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border p-6"
          style={{ borderColor: `${G_PURPLE}40`, backgroundColor: `${G_PURPLE}10` }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: G_PURPLE }}>Governing Thesis</p>
          <p className="text-white/80 text-sm leading-relaxed">
            The fastest wins are{" "}
            <strong className="text-white">moving expensive 2.5 Pro workloads <em>down</em> to Gemini 3.5 Flash</strong>{" "}
            (near-Pro intelligence at Flash-tier cost) and routing simple high-volume work to{" "}
            <strong className="text-white">3.1 Flash-Lite (~$0.25 input)</strong>.
            The disciplined caution is <em>not migrating</em> voice/Live-API workloads, high-volume workloads with no quality problem,
            or regulated Pro workloads on benchmark hype — without outcome-based evidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── 2. Critical Correction ───────────────────────────────────────────────────
function CriticalCorrection() {
  return (
    <Section id="correction" bg="#FFF7ED">
      <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-6 mb-10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-bold text-red-800 mb-1">Read before designing any enterprise Pro migration</p>
            <p className="text-sm text-red-700 leading-relaxed">
              <strong>&ldquo;Gemini 3.5 Pro&rdquo; was previewed at Google I/O 2026 but is not listed on the enterprise Agent Platform
              as of June 18, 2026.</strong> The GA Pro model is still Gemini 2.5 Pro. The most-advanced Pro model on the platform
              is Gemini 3.1 Pro — labelled <strong>Preview</strong>. Do not design enterprise workloads around &ldquo;Gemini 3.5 Pro.&rdquo;
            </p>
          </div>
        </div>
      </div>

      <SectionHeading
        eyebrow="Naming Clarification"
        title="The model naming reality — as of June 18, 2026"
        body="The Flash line and Pro line are on different upgrade schedules. This matters for every customer conversation."
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E8EAED]">
              {["Model", "Tier", "Enterprise Status", "Implication"].map((h) => (
                <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA0A6] pb-3 pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F4]">
            {[
              { model: "Gemini 2.5 Pro", tier: "Pro", status: "GA", statusColor: GREEN, note: "Current GA Pro — the safe choice for regulated workloads until sunset." },
              { model: "Gemini 2.5 Flash", tier: "Flash", status: "GA (retiring)", statusColor: AMBER, note: "Retires no earlier than Oct 16 2026. Cheapest at $0.30/$2.50 /M." },
              { model: "Gemini 2.5 Flash-Lite", tier: "Flash-Lite", status: "GA (retiring)", statusColor: AMBER, note: "Cheapest option; $0.10/$0.40. Also on retirement path." },
              { model: "Gemini 3.5 Flash", tier: "Flash", status: "GA", statusColor: GREEN, note: "Near-Pro intelligence. $1.50/$9.00 /M — 5× 2.5 Flash input. No Live API." },
              { model: "Gemini 3.1 Flash-Lite", tier: "Flash-Lite", status: "GA", statusColor: GREEN, note: "~$0.25 input. 'Matches 2.5 Flash performance.' Default for simple high-volume." },
              { model: "Gemini 3.1 Pro", tier: "Pro", status: "Preview", statusColor: AMBER, note: "Most-advanced Pro. Preview terms apply — weaker SLA, version pinning." },
              { model: "\"Gemini 3.5 Pro\"", tier: "Pro", status: "Not enterprise-listed", statusColor: RED, note: "Previewed at I/O 2026. Not on Agent Platform as of Jun 18. Do not design around it." },
            ].map((row) => (
              <tr key={row.model} className="py-3">
                <td className="py-3 pr-6 font-semibold text-[#202124]">{row.model}</td>
                <td className="py-3 pr-6 text-[#5F6368]">{row.tier}</td>
                <td className="py-3 pr-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{ color: row.statusColor, borderColor: `${row.statusColor}60`, backgroundColor: `${row.statusColor}10` }}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3 text-xs text-[#5F6368] max-w-sm">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ─── 3. Model Landscape ───────────────────────────────────────────────────────
function ModelLandscape() {
  return (
    <Section id="models">
      <SectionHeading
        eyebrow="Model Landscape"
        title="Retiring vs current-generation models"
        body="Prices are US list on direct Gemini API / Agent Platform PayGo (≤200K tokens). Regional and Provisioned Throughput rates differ."
      />

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Retiring 2.5 family */}
        <div className="rounded-2xl border-2 p-6" style={{ borderColor: `${AMBER}40`, backgroundColor: `${AMBER}06` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#202124]">Gemini 2.5 Family</h3>
            <Tag label="Retiring ≥ Oct 16 2026" color={AMBER} />
          </div>
          <div className="space-y-3">
            {[
              { name: "2.5 Flash-Lite", price: "$0.10 / $0.40", note: "Cheapest; simple high-volume" },
              { name: "2.5 Flash",      price: "$0.30 / $2.50", note: "Balanced workhorse; controllable thinking" },
              { name: "2.5 Pro",        price: "~$1.25 / ~$10",  note: "GA Pro; adaptive thinking; 1M context" },
              { name: "2.5 Flash Live", price: "Live-API metering", note: "Streaming voice — NOT retiring with text models" },
            ].map((m) => (
              <div key={m.name} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/70 border border-[#E8EAED]">
                <div>
                  <p className="text-sm font-semibold text-[#202124]">{m.name}</p>
                  <p className="text-xs text-[#9AA0A6]">{m.note}</p>
                </div>
                <p className="text-xs font-mono font-bold text-[#5F6368] whitespace-nowrap">{m.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current gen 3.x */}
        <div className="rounded-2xl border-2 p-6" style={{ borderColor: `${G_BLUE}40`, backgroundColor: `${G_BLUE}06` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#202124]">Current Generation (3.x)</h3>
            <Tag label="Destinations" color={G_BLUE} />
          </div>
          <div className="space-y-3">
            {[
              { name: "3.1 Flash-Lite",  price: "~$0.25 / (secondary)", note: "GA · matches 2.5 Flash quality · simple high-volume", color: GREEN },
              { name: "3.5 Flash",       price: "$1.50 / $9.00",         note: "GA · near-Pro · coding · agentic · no Live API", color: G_BLUE },
              { name: "3.1 Pro",         price: "$2 / $12 (≤200K)",      note: "Preview on Agent Platform · most-advanced reasoning", color: G_PURPLE },
              { name: "\"3.5 Pro\"",     price: "Not published",          note: "Previewed at I/O · not enterprise-listed — do not use", color: RED },
            ].map((m) => (
              <div key={m.name} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white/70 border border-[#E8EAED]">
                <div>
                  <p className="text-sm font-semibold text-[#202124]">{m.name}</p>
                  <p className="text-xs text-[#9AA0A6]">{m.note}</p>
                </div>
                <p className="text-xs font-mono font-bold whitespace-nowrap" style={{ color: m.color }}>{m.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The 5× callout */}
      <div className="rounded-2xl p-6 border-2" style={{ borderColor: `${AMBER}60`, backgroundColor: `${AMBER}08` }}>
        <div className="flex items-center gap-4">
          <p className="text-5xl font-extrabold" style={{ color: AMBER }}>5×</p>
          <div>
            <p className="font-bold text-[#202124]">Flash input price increase: 2.5 Flash → 3.5 Flash</p>
            <p className="text-sm text-[#5F6368] mt-0.5">$0.30/M → $1.50/M. Token-price-only reasoning will mislead. Migrate to 3.5 Flash only where reduced retries, escalations, or replaced Pro calls justify the cost.</p>
            <p className="text-xs text-[#9AA0A6] mt-1">Source: Verified across Simon Willison, metacto, OpenRouter, costgoat — corroborated by Agent Platform pricing page. [Documented/multi-source secondary]</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── 4. Decision Framework ────────────────────────────────────────────────────
function DecisionFramework() {
  const routes = [
    { signal: "Needs Live API / streaming voice", dest: "Live-API model (2.5 Flash Live etc.)", outcome: "D", outcomeColor: RED,   destColor: AMBER },
    { signal: "Regulated, needs GA + version pinning", dest: "2.5 Pro (GA) now; 3.1 Pro when GA", outcome: "D→later", outcomeColor: AMBER, destColor: AMBER },
    { signal: "2.5 Pro, 3.5 Flash clears quality bar in eval", dest: "3.5 Flash", outcome: "A / B", outcomeColor: GREEN, destColor: G_BLUE },
    { signal: "2.5 Pro, hardest cases still need Pro", dest: "3.5 Flash default + Pro escalation", outcome: "C", outcomeColor: G_BLUE, destColor: G_PURPLE },
    { signal: "2.5 Flash with quality problem (retries/escalation)", dest: "3.5 Flash", outcome: "A / B", outcomeColor: GREEN, destColor: G_BLUE },
    { signal: "2.5 Flash, simple, quality fine", dest: "3.1 Flash-Lite", outcome: "A", outcomeColor: GREEN, destColor: GREEN },
    { signal: "Mixed complexity — route by task", dest: "3.5 Flash default + Pro escalation", outcome: "C", outcomeColor: G_BLUE, destColor: G_PURPLE },
    { signal: "Cost > value, no deadline forces action", dest: "Stay on 2.5 temporarily", outcome: "D", outcomeColor: RED, destColor: AMBER },
    { signal: "Low value or duplicative workload", dest: "Retire / consolidate", outcome: "E", outcomeColor: "#9AA0A6", destColor: "#9AA0A6" },
  ];

  const outcomes = [
    { code: "A", label: "Lift-and-shift", desc: "Replace model, minimal app changes", color: GREEN },
    { code: "B", label: "Migrate + redesign", desc: "Prompt/loop changes unlock the value", color: G_BLUE },
    { code: "C", label: "Tiered routing", desc: "Flash default, Pro escalation, deterministic for rules", color: G_PURPLE },
    { code: "D", label: "Retain", desc: "Stay on 2.5; revisit before confirmed sunset", color: AMBER },
    { code: "E", label: "Retire", desc: "Consolidate or decommission", color: "#9AA0A6" },
  ];

  return (
    <Section id="decision" bg="#F8F9FA">
      <SectionHeading
        eyebrow="Decision Framework"
        title="Every workload needs its own destination"
        body="Evaluate top-to-bottom. The first matching signal wins. Do not proceed to step 2 without a baseline from step 1."
      />

      {/* Step 0 — no baseline, no decision */}
      <div className="rounded-2xl border-2 border-[#E8EAED] bg-white p-4 mb-6 flex items-start gap-3">
        <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#0284C7]" />
        <p className="text-sm text-[#5F6368]">
          <strong className="text-[#202124]">Gate 0:</strong> Does this workload have a credible baseline — quality, cost/successful task, latency, escalation/review rates?
          <strong className="text-[#202124]"> No → run the baseline first. Do not migrate without one.</strong>
        </p>
      </div>

      {/* Routing table */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-[#E8EAED]">
              {["Workload signal", "Destination", "Outcome"].map((h) => (
                <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA0A6] pb-3 pr-6">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F4]">
            {routes.map((r) => (
              <tr key={r.signal}>
                <td className="py-3 pr-6 text-sm text-[#202124] font-medium">{r.signal}</td>
                <td className="py-3 pr-6 text-sm font-semibold" style={{ color: r.destColor }}>{r.dest}</td>
                <td className="py-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{ color: r.outcomeColor, borderColor: `${r.outcomeColor}60`, backgroundColor: `${r.outcomeColor}10` }}>
                    {r.outcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Outcome legend */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {outcomes.map((o) => (
          <div key={o.code} className="rounded-xl border p-3" style={{ borderColor: `${o.color}40`, backgroundColor: `${o.color}08` }}>
            <p className="text-xl font-extrabold mb-1" style={{ color: o.color }}>Outcome {o.code}</p>
            <p className="text-xs font-bold text-[#202124] mb-0.5">{o.label}</p>
            <p className="text-[10px] text-[#9AA0A6] leading-relaxed">{o.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── 5. Workload Archetypes ───────────────────────────────────────────────────
function WorkloadArchetypes() {
  const archetypes = [
    {
      name: "High-volume conversational",
      examples: "Search assist, summarisation, self-service, next-best-action",
      current: "2.5 Flash / Flash-Lite",
      dest: "3.1 Flash-Lite (quality OK) · 3.5 Flash (quality gaps)",
      outcome: "A/B",
      outcomeColor: GREEN,
      risk: "5× input cost if moved wholesale to 3.5 Flash",
      riskLevel: "high",
      rec: "Segment by quality-failure rate. Move only the failing slice to 3.5 Flash. Push the rest to Flash-Lite.",
    },
    {
      name: "Complex reasoning / decision support",
      examples: "Financial analysis, risk, research synthesis, case management",
      current: "2.5 Pro",
      dest: "3.5 Flash default + Pro escalation for hardest cases",
      outcome: "C",
      outcomeColor: G_BLUE,
      risk: "Silent quality loss if hardest cases aren't escalated",
      riskLevel: "medium",
      rec: "Strong tiered-routing candidate. The down-tier prize — but don't remove the Pro escalation path.",
    },
    {
      name: "Agentic workflows",
      examples: "Multi-step ops, tool orchestration, long-horizon agents",
      current: "2.5 Pro orchestration",
      dest: "3.5 Flash with context-budget caps + Interactions API",
      outcome: "B",
      outcomeColor: G_BLUE,
      risk: "Context accumulates 2–3× across steps; thought-signature handling; loop cost runaway",
      riskLevel: "high",
      rec: "Highest upside AND highest risk. Agent-loop redesign required. Strong PoV candidate.",
    },
    {
      name: "Software development (codegen)",
      examples: "Codegen, refactor, debug, tests, review, coding agents",
      current: "2.5 Pro",
      dest: "3.5 Flash default · 3.1 Pro for hardest repo-scale reasoning",
      outcome: "A/B",
      outcomeColor: GREEN,
      risk: "Style/format drift; benchmark ≠ your repo",
      riskLevel: "medium",
      rec: "Strong candidate. Gate on developer-acceptance rate, not leaderboard scores.",
    },
    {
      name: "Multimodal intelligence",
      examples: "Doc/image/video/audio understanding, claims, inspection",
      current: "2.5 Pro/Flash multimodal",
      dest: "3.5 Flash · dedicated image/Veo for generation",
      outcome: "B",
      outcomeColor: G_BLUE,
      risk: "Audio input costs 2–7× text; fidelity varies by media",
      riskLevel: "medium",
      rec: "Often a migrate-and-redesign win for batch doc/video pipelines. Control audio/video costs.",
    },
    {
      name: "Real-time / voice",
      examples: "Voice agents, contact-centre copilots, live assist, tutors",
      current: "2.5 Flash Live API",
      dest: "RETAIN Live-API-capable models · 3.5 Flash only behind the streaming layer",
      outcome: "D",
      outcomeColor: RED,
      risk: "3.5 Flash has NO Live API. Default thinking gives ~17s TTFT.",
      riskLevel: "critical",
      rec: "Do NOT migrate the streaming layer to 3.5 Flash. This is a hard blocker.",
    },
    {
      name: "High-stakes / regulated",
      examples: "Banking, healthcare, gov, insurance, safety-critical",
      current: "Pinned 2.5 Pro, heavy governance",
      dest: "Stay on GA 2.5 Pro · validate 3.x in parallel · adopt when GA",
      outcome: "D",
      outcomeColor: RED,
      risk: "3.1 Pro is Preview — weaker version-pinning/SLA; behavioural drift is unacceptable without re-validation",
      riskLevel: "critical",
      rec: "Do not migrate on benchmark superiority. Governed parallel validation. Migrate last.",
    },
    {
      name: "Batch / back-office",
      examples: "Classification, extraction, enrichment, moderation, mass doc processing",
      current: "Flash/Flash-Lite, often Batch",
      dest: "3.1 Flash-Lite default · 3.5 Flash where exception cost is high",
      outcome: "A",
      outcomeColor: GREEN,
      risk: "5× base price swamps accuracy gains for trivial tasks",
      riskLevel: "medium",
      rec: "Decide on $/accepted output. Most tasks stay Flash-Lite + Batch (~50% off).",
    },
  ];

  const riskColor = { low: GREEN, medium: AMBER, high: "#E37400", critical: RED };

  return (
    <Section id="archetypes">
      <SectionHeading
        eyebrow="Workload Archetypes"
        title="Eight patterns — eight different answers"
        body="Each archetype has a different optimal destination. Applying one answer to all eight workloads is the migration antipattern."
      />
      <div className="grid md:grid-cols-2 gap-5">
        {archetypes.map((a) => (
          <Card key={a.name} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-[#202124] mb-0.5">{a.name}</p>
                <p className="text-xs text-[#9AA0A6]">{a.examples}</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0"
                style={{ color: a.outcomeColor, borderColor: `${a.outcomeColor}60`, backgroundColor: `${a.outcomeColor}10` }}>
                {a.outcome}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#9AA0A6] mb-1">Current model</p>
                <p className="text-xs text-[#5F6368]">{a.current}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#9AA0A6] mb-1">Destination</p>
                <p className="text-xs font-semibold text-[#202124]">{a.dest}</p>
              </div>
            </div>
            <div className="rounded-lg p-2.5 border" style={{ borderColor: `${riskColor[a.riskLevel as keyof typeof riskColor]}40`, backgroundColor: `${riskColor[a.riskLevel as keyof typeof riskColor]}08` }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: riskColor[a.riskLevel as keyof typeof riskColor] }}>Key risk</p>
              <p className="text-xs text-[#5F6368]">{a.risk}</p>
            </div>
            <p className="text-xs text-[#5F6368] leading-relaxed border-t border-[#F1F3F4] pt-2.5">
              <span className="font-semibold text-[#202124]">Recommendation:</span> {a.rec}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ─── 6. Economics ─────────────────────────────────────────────────────────────
function Economics() {
  return (
    <Section id="economics" bg="#F8F9FA">
      <SectionHeading
        eyebrow="Value Framework"
        title="Cheaper token price ≠ cheaper outcome"
        body="The governing inequality below is the only reliable arbiter. Migrate to a pricier model only when downstream cost reduction exceeds the token price increase."
      />

      {/* Governing inequality */}
      <Card className="mb-8 bg-[#1E293B] border-none">
        <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3">The Governing Inequality</p>
        <p className="text-sm font-mono text-emerald-400 leading-loose">
          ΔTokenCost ≤ ΔRetryCost + ΔEscalationCost + ΔHumanReviewCost + ΔToolFailureCost + ΔRevenue
        </p>
        <p className="text-xs text-white/40 mt-3 leading-relaxed">
          Migration to a pricier model creates value only when this inequality holds.
          A cheaper token can still yield a more expensive <em>outcome</em> if quality, retries, output length, or tool failures worsen — and vice versa.
        </p>
      </Card>

      {/* Key formulas */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          {
            label: "Cost per successful request",
            formula: "Cost_per_request ÷ success_rate",
            note: "Not cost per token — the primary migration metric",
          },
          {
            label: "Cost per completed task",
            formula: "(Σ model + tool + retry + infra + human_review) ÷ tasks_completed",
            note: "For agentic loops; input_tokens grows ~2–3× across steps as context accumulates",
          },
          {
            label: "Monthly run-rate difference",
            formula: "run_rate(2.5) − run_rate(destination)",
            note: "Use with real token profiles from production logs — not estimates",
          },
          {
            label: "Payback period",
            formula: "Migration_cost ÷ max(monthly_net_benefit, ε)  (months)",
            note: "Migration cost = eng hours + eval + regression testing + dual-run overhead",
          },
        ].map((f) => (
          <div key={f.label} className="rounded-xl border border-[#E8EAED] bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA0A6] mb-2">{f.label}</p>
            <p className="font-mono text-sm text-[#202124] mb-2 leading-relaxed">{f.formula}</p>
            <p className="text-xs text-[#9AA0A6] leading-relaxed">{f.note}</p>
          </div>
        ))}
      </div>

      {/* Hypothetical example */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-amber-700" />
          <p className="text-sm font-bold text-amber-800">HYPOTHETICAL — illustrative only, not customer data</p>
        </div>
        <p className="text-xs text-amber-700 mb-4">
          Decision-support workload on 2.5 Pro, 1M requests/month, avg 4K input / 1K output tokens, 8% human-review rate at 6 min/review @ $1.20/loaded-min.
          The <strong>load-bearing assumption is the post-migration review rate</strong> — it must be proven in eval before any dollar figure is cited.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-amber-200">
                {["", "2.5 Pro (illustrative)", "3.5 Flash (illustrative)"].map((h) => (
                  <th key={h} className="text-left font-bold text-amber-800 pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {[
                ["Model cost / request", "$0.015", "$0.015  (nearly flat)"],
                ["Human-review rate (assumed post-eval)", "8%", "5%  ← load-bearing assumption"],
                ["Review cost / request", "$0.576", "$0.36"],
                ["Total / request", "~$0.591", "~$0.375"],
                ["Monthly (1M requests)", "~$591K", "~$375K"],
              ].map(([label, v1, v2]) => (
                <tr key={label}>
                  <td className="py-2 pr-4 font-medium text-amber-800">{label}</td>
                  <td className="py-2 pr-4 text-amber-700">{v1}</td>
                  <td className="py-2 font-semibold text-amber-900">{v2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-amber-700 mt-4">
          Illustrative monthly delta ≈ <strong>$216K</strong>, driven almost entirely by <strong>reduced human review</strong>,
          not token price. If 3.5 Flash raised the review rate, the sign flips. This is why the program is outcome-based.
        </p>
      </div>
    </Section>
  );
}

// ─── 7. Risk Register ─────────────────────────────────────────────────────────
function RiskRegister() {
  const risks = [
    { risk: "Cost spike from 5× Flash input price", likelihood: "High", impact: "High", mitigation: "Route simple tasks to 3.1 Flash-Lite; caching (~90% off); batch (~50% off); cap context" },
    { risk: "Quality/behavioral regression", likelihood: "Med-High", impact: "High", mitigation: "Hold to non-negotiables; gated rollout with eval scorecard" },
    { risk: "Thought-signature/tooling errors", likelihood: "Medium", impact: "High", mitigation: "Plumb thought signatures through all multi-turn and function-calling paths; integration tests" },
    { risk: "Voice/real-time breakage (no Live API on 3.5 Flash)", likelihood: "High if attempted", impact: "High", mitigation: "Keep Live-API models; redesign only the non-streaming layer" },
    { risk: "TTFT/latency regression (~17s at default thinking)", likelihood: "Medium", impact: "Med-High", mitigation: "Set thinking_level: minimal or low for latency-sensitive UIs; measure per region" },
    { risk: "Preview instability (3.1 Pro / 3.5 Pro)", likelihood: "Medium", impact: "High", mitigation: "Stay on GA 2.5 Pro; validate 3.x in parallel" },
    { risk: "SDK break (Vertex AI SDK ends Gemini support post-June 2026)", likelihood: "High if unaddressed", impact: "High", mitigation: "Migrate to Gen AI SDK now; run build/CI regression" },
    { risk: "Region/residency gaps (SZPT-only in some APAC/EU regions)", likelihood: "Medium", impact: "High", mitigation: "Confirm required regions and PT availability before architecture decisions" },
    { risk: "Rollback failure after 2.5 sunset", likelihood: "Low-Med", impact: "High", mitigation: "Preserve 2.5 fallback path until the confirmed sunset date; practice rollback" },
  ];

  const likelihoodColor = (l: string) => l.startsWith("High") ? RED : l.startsWith("Med-H") ? AMBER : G_BLUE;
  const impactColor     = (i: string) => i === "High" ? RED : i.startsWith("Med-H") ? AMBER : G_BLUE;

  return (
    <Section id="risks">
      <SectionHeading
        eyebrow="Risk Register"
        title="Ranked by severity"
        body="These are knowable and manageable — but only if addressed before the canary, not after."
      />
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-[#E8EAED]">
              {["Risk", "Likelihood", "Impact", "Mitigation"].map((h) => (
                <th key={h} className="text-left text-[10px] font-bold uppercase tracking-wider text-[#9AA0A6] pb-3 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F4]">
            {risks.map((r) => (
              <tr key={r.risk}>
                <td className="py-3 pr-4 font-semibold text-[#202124] max-w-[200px]">{r.risk}</td>
                <td className="py-3 pr-4">
                  <span className="font-bold" style={{ color: likelihoodColor(r.likelihood) }}>{r.likelihood}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className="font-bold" style={{ color: impactColor(r.impact) }}>{r.impact}</span>
                </td>
                <td className="py-3 text-[#5F6368] max-w-xs">{r.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ─── 8. Migration Roadmap ─────────────────────────────────────────────────────
function MigrationRoadmap() {
  const phases = [
    {
      num: "0",
      name: "Discovery & Baseline",
      activities: "Inventory 2.5 workloads · capture current metrics · build frozen eval sets · confirm compliance/region needs",
      gate: "No baseline → no migration",
      gateColor: RED,
      color: AMBER,
    },
    {
      num: "1",
      name: "Offline Evaluation",
      activities: "Side-by-side 2.5 vs destination · identify prompt/API deltas · per-workload A–E recommendation with evidence",
      gate: "Non-negotiables pass",
      gateColor: GREEN,
      color: G_BLUE,
    },
    {
      num: "2",
      name: "Shadow Production",
      activities: "Mirror/replay prod traffic — no customer-visible action · measure real distributions · inspect failures/outliers",
      gate: "Real-traffic metrics within thresholds",
      gateColor: GREEN,
      color: G_BLUE,
    },
    {
      num: "3",
      name: "Controlled Canary",
      activities: "Small % of eligible traffic · strict quality gates · instant rollback to 2.5 · monitor business + technical metrics",
      gate: "KPI ≥ baseline; non-negotiables intact",
      gateColor: GREEN,
      color: G_BLUE,
    },
    {
      num: "4",
      name: "Workload Migration",
      activities: "Expand only where thresholds hold · retain routing/fallback where needed · update runbooks",
      gate: "Stability + cost targets met",
      gateColor: GREEN,
      color: G_PURPLE,
    },
    {
      num: "5",
      name: "Architecture Optimization",
      activities: "Simplify prompts · consolidate chains · tiered routing · redesign newly feasible experiences · renegotiate PT",
      gate: "Net cost/quality improvement",
      gateColor: GREEN,
      color: G_PURPLE,
    },
    {
      num: "6",
      name: "Continuous Optimization",
      activities: "Monitor versions · watch confirmed 2.5 sunset date · refresh eval sets · detect drift · reassess routing",
      gate: "Ongoing",
      gateColor: G_BLUE,
      color: "#9AA0A6",
    },
  ];

  return (
    <Section id="roadmap" bg="#F8F9FA">
      <SectionHeading
        eyebrow="Migration Roadmap"
        title="Six phases, each with a gate"
        body="No phase is skipped. Each gate has a rollback path back to 2.5 — until the confirmed sunset date."
      />
      <div className="space-y-3">
        {phases.map((p) => (
          <div key={p.num} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0" style={{ backgroundColor: p.color }}>
                {p.num}
              </div>
              {p.num !== "6" && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: `${p.color}40` }} />}
            </div>
            <div className="pb-6 min-w-0 flex-1">
              <p className="font-bold text-[#202124] mb-1">{p.name}</p>
              <p className="text-xs text-[#5F6368] leading-relaxed mb-2">{p.activities}</p>
              <div className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 border text-[10px] font-bold"
                style={{ color: p.gateColor, borderColor: `${p.gateColor}50`, backgroundColor: `${p.gateColor}10` }}>
                <CheckCircle className="w-3 h-3" />
                Gate: {p.gate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── 9. Proof of Value ────────────────────────────────────────────────────────
function ProofOfValue() {
  const weeks = [
    { wk: "Wk 1", label: "Workload selection, baselines, eval sets, region/compliance confirmation" },
    { wk: "Wk 2", label: "Offline eval (unchanged prompt + minimal adaptation), prompt/API delta list" },
    { wk: "Wk 3", label: "Prompt simplification/redesign tests; cost modelling with real token profiles" },
    { wk: "Wk 4", label: "Shadow production; failure/outlier analysis" },
    { wk: "Wk 5", label: "Controlled canary with quality gates and rollback rehearsal" },
    { wk: "Wk 6", label: "Decision package — per-workload A–E recommendation, $/outcome, risk register, roadmap" },
  ];

  return (
    <Section id="pov">
      <SectionHeading
        eyebrow="Proof of Value"
        title="4–6 weeks to evidence-backed decisions"
        body="3–5 representative workloads. At least one justified non-migration. Outcome-based, not benchmark-based."
      />

      {/* PoV scope guidance */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-[#9AA0A6] mb-3">Include at least one of each</p>
          <div className="space-y-2">
            {[
              { label: "High-volume 2.5 Flash workload", color: AMBER },
              { label: "2.5 Pro reasoning/coding (down-tier test)", color: G_BLUE },
              { label: "Agentic workflow", color: G_PURPLE },
              { label: "Regulated or real-time (justified non-migration)", color: RED },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <p className="text-sm text-[#5F6368]">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-[#9AA0A6] mb-3">Non-negotiables (any breach = no-go)</p>
          <div className="space-y-2">
            {[
              "Safety-pass rate ≥ baseline",
              "Unsupported-claim rate ≤ threshold",
              "Schema-adherence ≥ threshold",
              "Unauthorized-tool-action rate = 0",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 shrink-0 text-[#DC2626]" />
                <p className="text-sm text-[#5F6368]">{item}</p>
              </div>
            ))}
            <p className="text-xs text-[#9AA0A6] mt-2 pt-2 border-t border-[#F1F3F4]">Pin numeric limits with the risk owner before testing starts.</p>
          </div>
        </Card>
      </div>

      {/* Week-by-week plan */}
      <div className="space-y-2 mb-10">
        <p className="text-xs font-bold uppercase tracking-wider text-[#9AA0A6] mb-4">Weekly milestones</p>
        {weeks.map((w) => (
          <div key={w.wk} className="flex items-start gap-4 p-3 rounded-xl border border-[#E8EAED] bg-white">
            <span className="text-xs font-extrabold shrink-0" style={{ color: G_BLUE }}>{w.wk}</span>
            <p className="text-xs text-[#5F6368] leading-relaxed">{w.label}</p>
          </div>
        ))}
      </div>

      {/* Final output */}
      <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, #0d1d3e 0%, #1A73E8 100%)` }}>
        <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2">PoV Output</p>
        <p className="text-lg font-bold text-white mb-3">Evidence-backed A–E per workload. Quantified value with labeled assumptions. Sequenced rollout plan.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            "Per-workload migrate / retain / redesign / route / retire recommendation",
            "$/successful-outcome comparison with labeled assumptions",
            "Risk register + rollback plan + migration sequencing",
          ].map((item) => (
            <div key={item} className="rounded-xl bg-white/10 p-3 flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
              <p className="text-xs text-white/70 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data refresh note */}
      <div className="mt-8 p-4 rounded-xl border border-[#E8EAED] bg-[#F8F9FA]">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#9AA0A6]" />
          <p className="text-xs text-[#9AA0A6] leading-relaxed">
            <strong className="text-[#5F6368]">Re-verify before customer use.</strong> Model status, pricing, and lifecycle dates
            in this brief are current as of 20 June 2026 and change on the order of weeks. Confirmed facts are tagged
            [Documented] with source references. Always check the live Agent Platform model list and pricing page before
            any customer-facing conversation.
          </p>
        </div>
      </div>
    </Section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Gemini25Page() {
  return (
    <>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <StickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <Hero />
        <CriticalCorrection />
        <ModelLandscape />
        <DecisionFramework />
        <WorkloadArchetypes />
        <Economics />
        <RiskRegister />
        <MigrationRoadmap />
        <ProofOfValue />
      </main>
    </>
  );
}
