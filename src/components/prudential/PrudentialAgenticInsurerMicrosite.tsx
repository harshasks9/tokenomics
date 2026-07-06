"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Cloud,
  FileText,
  Layers3,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import {
  agents,
  capabilityMap,
  caveats,
  claimsFlow,
  googleStories,
  googleWins,
  heroStats,
  keyFindings,
  macroForces,
  micrositeStructure,
  platformComparisons,
  prudentialAssessment,
  prudentialFacts,
  recommendations,
  roadmap,
  staircase,
  tldr,
  useCaseDomains,
  valueChain,
  visualSpecs,
} from "@/lib/prudential-agentic-insurer";

const navItems = [
  ["#thesis", "Thesis"],
  ["#industry", "Industry"],
  ["#chain", "Value chain"],
  ["#agents", "Agents"],
  ["#proof", "Proof"],
  ["#prudential", "Prudential"],
  ["#google", "Google"],
  ["#roadmap", "Roadmap"],
  ["#appendix", "Appendix"],
];

const googleColors = ["#4285f4", "#ea4335", "#fbbc04", "#34a853"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-[#c41230]">{children}</p>;
}

function Takeaway({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`mt-7 border-l-4 border-[#c41230] p-5 ${dark ? "bg-white/8 text-white/78" : "bg-[#fff4f5] text-slate-800"}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#c41230]">Executive takeaway</p>
      <p className="mt-2 text-sm font-semibold leading-6">{children}</p>
    </div>
  );
}

function MetricBars() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {[
        ["Commercial P&C AI adoption", "14%", "today", "70%", "2028", 70],
        ["TSR spread", "6.1x", "AI leaders", "1x", "laggards", 86],
        ["Claims review automation", "2x", "MedLM POC", "Human loop", "control", 62],
      ].map((item) => (
        <article key={item[0] as string} className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{item[0]}</p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-black tracking-tight text-slate-950">{item[1]}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{item[2]}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black tracking-tight text-[#c41230]">{item[3]}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{item[4]}</p>
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-[#c41230]" style={{ width: `${item[5]}%` }} />
          </div>
        </article>
      ))}
    </div>
  );
}

export default function PrudentialAgenticInsurerMicrosite() {
  const [activeAgent, setActiveAgent] = useState(2);
  const [activeDomain, setActiveDomain] = useState(1);
  const [showHumanGates, setShowHumanGates] = useState(true);
  const reduceMotion = useReducedMotion();

  const activeAgentData = agents[activeAgent];
  const activeUseCase = useCaseDomains[activeDomain];

  const reveal = useMemo(
    () =>
      reduceMotion
        ? {}
        : {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.16 },
            transition: { duration: 0.5 },
          },
    [reduceMotion],
  );

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-slate-950 selection:bg-red-200">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080b10]/92 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Back to AI Tokenomics home">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#c41230] text-sm font-black text-white">P</span>
            <span className="hidden truncate text-sm font-semibold tracking-tight sm:block">The Agentic Insurer</span>
          </Link>
          <nav className="hidden items-center gap-4 text-xs font-semibold text-white/58 xl:flex" aria-label="Page sections">
            {navItems.map(([href, label]) => (
              <a key={href} href={href} className="transition hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <a href="#roadmap" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-red-50">
            Roadmap <ArrowRight size={14} />
          </a>
        </div>
      </header>

      <section id="thesis" className="relative overflow-hidden bg-[#05070b] text-white">
        <Image
          src="/prudential/agentic-insurer-hero.png"
          alt="Agentic insurance operating model visualization"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,11,.96)_0%,rgba(5,7,11,.83)_42%,rgba(5,7,11,.28)_100%)]" />
        <div className="relative mx-auto grid min-h-[76vh] max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-16">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/72">
              <Sparkles size={14} className="text-[#fbbc04]" />
              Prudential plc / Google Cloud strategy microsite
            </div>
            <h1 className="max-w-5xl text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
              The Agentic Insurer
            </h1>
            <p className="mt-5 max-w-3xl text-xl font-semibold leading-8 text-white/84">
              How agentic AI reshapes insurance, and how Google Cloud can help make Prudential plc the world&apos;s leading AI-native insurer.
            </p>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/55">
              Prudential plc is the Asia- and Africa-focused life and health insurer listed on HKEX, LSE, NYSE, and SGX. This site refers to Prudential plc, not Prudential Financial, Inc. of the US or M&amp;G/Prudential UK.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#industry" className="inline-flex items-center gap-2 rounded-full bg-[#c41230] px-6 py-3 text-sm font-black text-white transition hover:bg-[#a60f27]">
                Enter the strategy <ArrowRight size={16} />
              </a>
              <a href="#caveats" className="rounded-full border border-white/22 px-6 py-3 text-sm font-bold text-white/78 transition hover:bg-white/10">
                Read caveats
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.65 }}
            className="hidden md:block"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {heroStats.map((stat, index) => (
                <div key={stat.label} className="rounded-lg border border-white/12 bg-black/28 p-4 backdrop-blur-md">
                  <p className="text-4xl font-black tracking-tight" style={{ color: index === 0 ? "#fbbc04" : index === 1 ? "#34a853" : index === 2 ? "#4285f4" : "#ffffff" }}>
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-white/55">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-white/12 bg-white p-5 text-slate-950">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-50 text-[#c41230]">
                  <Workflow size={22} />
                </div>
                <div>
                  <p className="font-black">The board-level question has changed.</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Not whether to adopt AI, but how fast Prudential can rewire the highest-value domains before AI-native competitors do.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white md:hidden">
        <div className="grid grid-cols-2 gap-px bg-slate-200">
          {heroStats.map((stat, index) => (
            <div key={stat.label} className="bg-white p-5">
              <p className="text-3xl font-black tracking-tight" style={{ color: index === 0 ? "#fbbc04" : index === 1 ? "#34a853" : index === 2 ? "#4285f4" : "#111827" }}>
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {tldr.map((item, index) => (
              <motion.article key={item.title} {...reveal} className="rounded-lg border border-slate-200 bg-[#fafafa] p-6">
                <span className="text-xs font-black text-[#c41230]">0{index + 1}</span>
                <h2 className="mt-4 text-xl font-black">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="industry" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <SectionLabel>01 / Industry shift</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight lg:text-6xl">Insurance is climbing the AI staircase.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Predictive AI optimizes decisions, generative AI transforms document work, and agentic AI turns insurance into a software-operated business supervised by humans.
              </p>
              <Takeaway>
                The 2028 carrier is a governed portfolio of specialized agents, with people concentrated at judgment, empathy, ethics, and accountability.
              </Takeaway>
            </div>
            <div className="grid gap-4">
              {staircase.map((item, index) => (
                <motion.article key={item.title} {...reveal} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-[120px_1fr] md:items-center">
                  <div className={`rounded-lg p-4 ${item.color}`}>
                    <p className="text-xs font-black uppercase tracking-[0.16em]">{item.step}</p>
                    <p className="mt-4 text-2xl font-black">{item.title}</p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{item.detail}</p>
                  {index < staircase.length - 1 && <div className="hidden h-px bg-slate-200 md:block" />}
                </motion.article>
              ))}
            </div>
          </motion.div>
          <div className="mt-12">
            <MetricBars />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {macroForces.map((force, index) => (
              <motion.div key={force} {...reveal} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg text-xs font-black text-white" style={{ backgroundColor: googleColors[index % googleColors.length] }}>
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold leading-6 text-slate-700">{force}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#090c12] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-4xl">
            <SectionLabel>02 / Key findings</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight lg:text-6xl">The economics change, not just the workflow.</h2>
          </motion.div>
          <div className="mt-12 grid gap-4 lg:grid-cols-5">
            {keyFindings.map((finding, index) => (
              <motion.article key={finding} {...reveal} className="rounded-lg border border-white/10 bg-white/[0.055] p-5">
                <p className="text-3xl font-black" style={{ color: googleColors[index % googleColors.length] }}>
                  {index + 1}
                </p>
                <p className="mt-5 text-sm leading-6 text-white/62">{finding}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="chain" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <SectionLabel>03 / Agentic insurance value chain</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight lg:text-6xl">Agents do the work. Humans govern, judge, and relate.</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 sm:grid-cols-4">
              {["Pain", "Agentic future", "Impact", "Google"].map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-center">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
          <div className="mt-12 overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[170px_1fr] bg-slate-950 text-xs font-black uppercase tracking-[0.14em] text-white md:grid-cols-[180px_1fr_1fr_150px_150px_1fr]">
              {["Node", "Pain today", "Agentic future", "Impact", "Human role", "Google opportunity"].map((head) => (
                <div key={head} className="border-r border-white/10 p-4 last:border-r-0">
                  {head}
                </div>
              ))}
            </div>
            {valueChain.map((row, index) => (
              <motion.div
                key={row[0]}
                {...reveal}
                className="grid grid-cols-[170px_1fr] border-t border-slate-200 bg-white text-sm md:grid-cols-[180px_1fr_1fr_150px_150px_1fr]"
              >
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} className={`border-r border-slate-200 p-4 last:border-r-0 ${cellIndex === 0 ? "font-black text-slate-950" : "text-slate-600"}`}>
                    {cellIndex === 0 && <span className="mr-2 text-xs text-[#c41230]">{String(index + 1).padStart(2, "0")}</span>}
                    {cell}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
          <Takeaway>
            Google supplies the model layer, data layer, agent layer, and governance layer required to automate each value-chain node safely.
          </Takeaway>
        </div>
      </section>

      <section id="agents" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-3xl">
            <SectionLabel>04 / 2028 workforce</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight lg:text-6xl">Twenty-two major agents in the Prudential enterprise.</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">Autonomy scale: L1 assist, L2 recommend, L3 act with approval, L4 act autonomously within guardrails.</p>
          </motion.div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
            <div className="grid max-h-[760px] gap-2 overflow-y-auto pr-2 sm:grid-cols-2">
              {agents.map((agent, index) => (
                <button
                  key={agent[0]}
                  onClick={() => setActiveAgent(index)}
                  className={`rounded-lg border p-4 text-left transition ${
                    index === activeAgent ? "border-[#c41230] bg-[#c41230] text-white shadow-lg shadow-red-900/15" : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.14em] opacity-60">{agent[3]}</p>
                  <p className="mt-2 text-sm font-black">{agent[0]}</p>
                </button>
              ))}
            </div>
            <motion.article key={activeAgentData[0]} initial={reduceMotion ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="rounded-lg border border-slate-200 bg-white p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c41230]">Selected agent</p>
                  <h3 className="mt-4 text-4xl font-black tracking-tight">{activeAgentData[0]}</h3>
                </div>
                <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">{activeAgentData[3]}</span>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["Purpose", activeAgentData[1], BrainCircuit],
                  ["Systems", activeAgentData[2], Layers3],
                  ["ROI lens", activeAgentData[4], CircleDollarSign],
                ].map(([label, body, Icon]) => {
                  const RealIcon = Icon as typeof BrainCircuit;
                  return (
                    <div key={label as string} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                      <RealIcon size={20} className="text-[#c41230]" />
                      <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label as string}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{body as string}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-[#c41230]" style={{ width: activeAgentData[3].includes("L4") ? "100%" : activeAgentData[3].includes("L3") ? "75%" : "50%" }} />
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      <section className="bg-[#090c12] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <SectionLabel>05 / Multi-agent enterprise</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight lg:text-6xl">The transformation comes from orchestration.</h2>
              <p className="mt-5 text-base leading-7 text-white/58">A2A provides agent collaboration, MCP connects tools and data, and Gemini Enterprise supplies runtime, registry, identity, gateway, memory, observability, simulation, and evaluation.</p>
            </div>
            <button
              onClick={() => setShowHumanGates((value) => !value)}
              className="w-fit rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white/78 transition hover:bg-white/10"
            >
              {showHumanGates ? "Hide gates" : "Show gates"}
            </button>
          </motion.div>
          <div className="mt-12 grid gap-3 md:grid-cols-4 lg:grid-cols-8">
            {claimsFlow.map((step, index) => (
              <motion.div key={step} {...reveal} className="relative rounded-lg border border-white/12 bg-white/[0.06] p-4">
                <p className="text-xs font-black" style={{ color: googleColors[index % googleColors.length] }}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 text-sm font-black leading-5">{step}</p>
                {showHumanGates && [2, 3, 4, 7].includes(index) && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-950">
                    <ShieldCheck size={12} /> Gate
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <Takeaway dark>
            Low-risk, high-volume steps can run autonomously. Consequential underwriting and contested claims escalate to humans with audit-ready reasoning traces.
          </Takeaway>
        </div>
      </section>

      <section id="proof" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <SectionLabel>06 / 100+ use cases</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight lg:text-6xl">Start with proven health and distribution wedges, then build the mesh.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                Each use case follows the pattern: problem, agent workflow, business value, required Google capability, complexity, and expected ROI.
              </p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                {useCaseDomains.map((domain, index) => (
                  <button
                    key={domain.domain}
                    onClick={() => setActiveDomain(index)}
                    className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                      index === activeDomain ? "border-[#c41230] bg-[#c41230] text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {domain.domain}
                  </button>
                ))}
              </div>
              <motion.article key={activeUseCase.domain} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-lg border border-slate-200 bg-[#fafafa] p-7">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c41230]">Use cases {activeUseCase.range}</p>
                <h3 className="mt-4 text-3xl font-black">{activeUseCase.domain}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{activeUseCase.examples}</p>
              </motion.article>
            </div>
          </motion.div>
          <div className="mt-14">
            <SectionLabel>Google Cloud insurance reference base</SectionLabel>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {googleStories.map((story, index) => (
                <motion.article key={story[0]} {...reveal} className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: googleColors[index % googleColors.length] }} />
                    <div>
                      <h3 className="font-black">{story[0]}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{story[1]}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="prudential" className="scroll-mt-24 bg-[#f4f0ee]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-4xl">
            <SectionLabel>07 / Prudential plc specifically</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight lg:text-6xl">The strategy is already agentic-ready.</h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Prudential&apos;s strategic pillars, AI Lab, health focus, distribution scale, and Google Cloud partnership create a credible path from proven use cases to an AI-native operating model.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {prudentialFacts.map((fact) => (
              <motion.article key={fact} {...reveal} className="rounded-lg border border-red-100 bg-white p-5">
                <div className="flex gap-3">
                  <BadgeCheck size={18} className="mt-0.5 shrink-0 text-[#c41230]" />
                  <p className="text-sm leading-6 text-slate-700">{fact}</p>
                </div>
              </motion.article>
            ))}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {prudentialAssessment.map((item, index) => (
              <motion.article key={item[0]} {...reveal} className="rounded-lg bg-slate-950 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: googleColors[index % googleColors.length] }}>
                  {item[0]}
                </p>
                <p className="mt-4 text-sm leading-6 text-white/62">{item[1]}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="google" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <SectionLabel>08 / Why Google</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight lg:text-6xl">The choice is a platform philosophy.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                A life-and-health insurer across 24 regulated markets needs healthcare AI, multilingual multimodal reasoning, open orchestration, and low viable inference cost.
              </p>
              <Takeaway>
                Google is strongest where Prudential&apos;s agent-density problem is hardest: health, multimodal context, open agent mesh, enterprise grounding, geospatial intelligence, and TPU-backed cost control.
              </Takeaway>
            </div>
            <div className="grid gap-3">
              {platformComparisons.map((item) => (
                <motion.article key={item[0]} {...reveal} className={`rounded-lg border p-5 ${item[0] === "Google" ? "border-[#c41230] bg-[#fff4f5]" : "border-slate-200 bg-[#fafafa]"}`}>
                  <div className="flex items-start gap-4">
                    <Cloud size={20} className={item[0] === "Google" ? "text-[#c41230]" : "text-slate-400"} />
                    <div>
                      <h3 className="font-black">{item[0]}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item[1]}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {googleWins.map((win, index) => (
              <motion.article key={win} {...reveal} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="block h-1.5 w-14 rounded-full" style={{ backgroundColor: googleColors[index % googleColors.length] }} />
                <p className="mt-5 text-sm font-semibold leading-6 text-slate-700">{win}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#090c12] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-4xl">
            <SectionLabel>09 / Google capability mapping</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight lg:text-6xl">Business problem to agent pattern to Google product.</h2>
          </motion.div>
          <div className="mt-12 overflow-hidden rounded-lg border border-white/12">
            <div className="grid grid-cols-[210px_1fr] bg-white text-xs font-black uppercase tracking-[0.14em] text-slate-950 lg:grid-cols-[220px_200px_230px_1fr_220px]">
              {["Business problem", "AI pattern", "Agent pattern", "Google products", "Outcome"].map((head) => (
                <div key={head} className="border-r border-slate-200 p-4 last:border-r-0">
                  {head}
                </div>
              ))}
            </div>
            {capabilityMap.map((row) => (
              <div key={row[0]} className="grid grid-cols-[210px_1fr] border-t border-white/12 text-sm lg:grid-cols-[220px_200px_230px_1fr_220px]">
                {row.map((cell, index) => (
                  <div key={index} className={`border-r border-white/12 p-4 last:border-r-0 ${index === 0 ? "font-black text-white" : "text-white/62"}`}>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-white/55">
            Infrastructure spine: BigQuery, AlloyDB/Cloud SQL, Cloud Run/GKE, Apigee, Chronicle/Security Command Center, Looker, Workspace, and healthcare compliance coverage under Google Cloud&apos;s BAA.
          </p>
        </div>
      </section>

      <section id="roadmap" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-4xl">
            <SectionLabel>10 / 3-year transformation roadmap</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight lg:text-6xl">90 days to 36 months.</h2>
          </motion.div>
          <div className="mt-12 grid gap-4 lg:grid-cols-5">
            {roadmap.map((stage) => (
              <motion.article key={stage.horizon} {...reveal} className="rounded-lg border border-slate-200 bg-[#fafafa] p-5">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#c41230]">{stage.horizon}</span>
                <h3 className="mt-4 text-xl font-black">{stage.title}</h3>
                <div className="mt-5 space-y-3 text-xs leading-5 text-slate-600">
                  <p><strong>People:</strong> {stage.people}</p>
                  <p><strong>Tech:</strong> {stage.tech}</p>
                  <p><strong>Governance:</strong> {stage.governance}</p>
                  <p><strong>KPIs:</strong> {stage.kpis}</p>
                </div>
                <p className="mt-5 rounded-lg bg-white p-3 text-xs font-bold leading-5 text-slate-800">Success: {stage.success}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="appendix" className="scroll-mt-24 bg-[#f4f0ee]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <motion.div {...reveal}>
            <SectionLabel>11 / Microsite structure</SectionLabel>
            <h2 className="text-3xl font-black tracking-tight">The source blueprint remains embedded.</h2>
            <div className="mt-8 space-y-3">
              {micrositeStructure.map((item) => (
                <div key={item[0]} className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="font-black">{item[0]}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item[1]}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...reveal}>
            <SectionLabel>12 / Visual asset specifications</SectionLabel>
            <h2 className="text-3xl font-black tracking-tight">The design requirements are preserved as production cues.</h2>
            <div className="mt-8 space-y-3">
              {visualSpecs.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-black text-white" style={{ backgroundColor: googleColors[index % googleColors.length] }}>
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <SectionLabel>13 / Recommendations</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight lg:text-5xl">Seven moves for Prudential leadership.</h2>
            </div>
            <div className="grid gap-3">
              {recommendations.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-slate-200 bg-[#fafafa] p-4">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#c41230]" />
                  <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="caveats" className="scroll-mt-24 bg-[#090c12] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <SectionLabel>14 / Caveats</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight lg:text-5xl">Keep the ambition qualified.</h2>
              <p className="mt-5 text-base leading-7 text-white/55">
                The microsite preserves the source paper&apos;s cautions on public evidence, vendor optimism, model-price volatility, execution risk, and regulatory divergence.
              </p>
            </div>
            <div className="grid gap-3">
              {caveats.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.055] p-4">
                  <FileText size={18} className="mt-0.5 shrink-0 text-[#fbbc04]" />
                  <p className="text-sm leading-6 text-white/62">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#05070b] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-[#c41230]" />
            <p className="text-sm font-bold">Prudential plc / The Agentic Insurer</p>
          </div>
          <p className="max-w-2xl text-xs leading-5 text-white/35">
            Strategy microsite derived from the supplied paper. Forward-looking and benchmark claims require local validation before investment decisions.
          </p>
        </div>
      </footer>
    </main>
  );
}
