"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Factory,
  Fuel,
  Landmark,
  Plane,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  BUSINESSES,
  EVIDENCE_CASES,
  ENTERPRISE_SOURCES,
  EXECUTIVE_THESIS,
  PLATFORM_FOUNDATIONS,
  QUALIFICATIONS,
  type BusinessId,
} from "@/lib/smc-strategy";

const businessIcons: Record<BusinessId, typeof Landmark> = {
  bank: Landmark,
  infrastructure: Plane,
  food: Factory,
  petron: Fuel,
};

const agenda = [
  { range: "Days 0-30", title: "Choose the work", detail: "Name the executive sponsor, baseline today's economics, and select four lighthouse workflows using value, feasibility, data readiness, risk, and reuse." },
  { range: "Days 31-60", title: "Prove the conditions", detail: "Validate data access, redesign the workflow, define human approvals, and test quality, security, adoption, and value assumptions." },
  { range: "Days 61-90", title: "Make the production decision", detail: "Demonstrate the workflow with users, quantify evidence against the baseline, and fund only the capabilities that can scale across SMC." },
];

const outcomes = [
  { label: "Banking", measure: "Avoided loss and decision speed" },
  { label: "Infrastructure", measure: "Availability and flow" },
  { label: "Food", measure: "Yield, service, and safety" },
  { label: "Petron", measure: "Site and customer productivity" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-red-700">{children}</p>;
}

function SourceLink({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 font-semibold underline underline-offset-4 transition ${dark ? "text-white/65 decoration-white/25 hover:text-white" : "text-slate-700 decoration-slate-300 hover:text-red-700"}`}>
      <span>{children}</span><ExternalLink size={12} />
    </a>
  );
}

export default function SMCExecutiveBrief() {
  const [activeBusiness, setActiveBusiness] = useState<BusinessId>("bank");
  const [showEvidence, setShowEvidence] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = BUSINESSES.find((business) => business.id === activeBusiness) ?? BUSINESSES[0];
  const evidence = useMemo(() => EVIDENCE_CASES.filter((item) => item.business === activeBusiness), [activeBusiness]);
  const ActiveIcon = businessIcons[activeBusiness];

  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5 },
  };

  return (
    <main className="min-h-screen bg-[#f5f2ec] text-slate-950 selection:bg-red-200">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1320]/90 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Back to AI Tokenomics home">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-700 text-sm font-black">SMC</span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">Enterprise AI Executive Brief</span>
          </Link>
          <nav className="hidden items-center gap-6 text-xs font-semibold text-white/65 md:flex" aria-label="Page sections">
            <a href="#shift" className="hover:text-white">The shift</a>
            <a href="#opportunities" className="hover:text-white">Value map</a>
            <a href="#evidence" className="hover:text-white">Evidence</a>
            <a href="#agenda" className="hover:text-white">90-day agenda</a>
          </nav>
          <a href="#agenda" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-red-50">Decision agenda</a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#0b1320] text-white">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "radial-gradient(circle at 78% 15%, rgba(197, 34, 43, .32), transparent 29%), radial-gradient(circle at 25% 100%, rgba(66, 133, 244, .15), transparent 34%)" }} />
        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:py-28">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">
              <Sparkles size={14} className="text-[#fbbc04]" /> San Miguel Corporation / Executive working session
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[.98] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
              From AI pilots to <span className="text-red-500">operating advantage.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/66 lg:text-xl">{EXECUTIVE_THESIS}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#opportunities" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold transition hover:bg-red-500">Explore SMC value pools <ArrowRight size={16} /></a>
              <button onClick={() => { setShowEvidence(true); document.getElementById("evidence")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }} className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10">Inspect the evidence</button>
            </div>
          </motion.div>

          <motion.div initial={reduceMotion ? false : { opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .15, duration: .65 }}>
            <div className="rounded-[2rem] border border-white/12 bg-white/[.06] p-5 shadow-2xl backdrop-blur-md sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-white/45">The executive frame</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[{ n: "4", l: "SMC businesses" }, { n: "16", l: "priority value pools" }, { n: "8", l: "documented cases" }, { n: "90", l: "days to a decision" }].map((stat) => (
                  <div key={stat.l} className="rounded-2xl border border-white/10 bg-black/15 p-5">
                    <p className="text-4xl font-black tracking-tight">{stat.n}</p><p className="mt-1 text-xs text-white/50">{stat.l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-white p-5 text-slate-950">
                <div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Target size={20} /></div><div><p className="font-bold">The question is not where to use AI.</p><p className="mt-1 text-sm leading-6 text-slate-600">It is which workflows deserve redesign, which controls make them trusted, and what evidence earns the right to scale.</p></div></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="shift" className="scroll-mt-24 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div><SectionLabel>01 / What changed</SectionLabel><h2 className="text-4xl font-black tracking-[-.04em] lg:text-5xl">The unit of transformation is now the workflow.</h2></div>
            <div className="grid gap-4 md:grid-cols-3">
              {[{ k: "Copilots", t: "Assist", d: "Generate, summarize, and answer inside a person's existing task." }, { k: "Agents", t: "Coordinate", d: "Interpret context, use tools, and move work across systems with approval." }, { k: "Operating model", t: "Transform", d: "Redesign accountability, controls, data, and measurement around the outcome." }].map((item, i) => (
                <div key={item.k} className={`rounded-3xl border p-6 ${i === 2 ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"}`}><p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">{item.k}</p><p className="mt-6 text-2xl font-black">{item.t}</p><p className="mt-3 text-sm leading-6 text-slate-600">{item.d}</p></div>
              ))}
            </div>
          </motion.div>
          <motion.div {...reveal} className="mt-12 grid gap-5 rounded-3xl bg-[#0b1320] p-7 text-white md:grid-cols-[.35fr_1.65fr] md:p-10">
            <p className="text-6xl font-black text-[#34a853]">52%</p>
            <div><p className="text-xl font-bold">of surveyed executives reported that their organizations were deploying AI agents in production.</p><p className="mt-3 text-sm leading-6 text-white/55">Directional, self-reported evidence. The strategic implication is a shift from isolated model access toward governed execution inside business workflows.</p><p className="mt-4 text-xs"><SourceLink href={ENTERPRISE_SOURCES[0].url} dark>Google Cloud, January 1, 2026</SourceLink></p></div>
          </motion.div>
        </div>
      </section>

      <section id="opportunities" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-3xl"><SectionLabel>02 / SMC value map</SectionLabel><h2 className="text-4xl font-black tracking-[-.04em] lg:text-6xl">One group. Four distinct starting points.</h2><p className="mt-5 text-lg leading-8 text-slate-600">Shared platform capabilities should travel across SMC. Workflow economics, ownership, and success measures must remain local to each business.</p></motion.div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="SMC businesses">
            {BUSINESSES.map((business) => { const Icon = businessIcons[business.id]; const selected = business.id === activeBusiness; return (
              <button key={business.id} role="tab" aria-selected={selected} onClick={() => setActiveBusiness(business.id)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${selected ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-900/15" : "border-slate-200 bg-white hover:border-slate-400"}`}><Icon size={20} /><span className="text-sm font-bold">{business.shortName}</span></button>
            ); })}
          </div>

          <motion.div key={active.id} initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <div className="grid lg:grid-cols-[.9fr_1.1fr]">
              <div className="bg-[#111b2a] p-7 text-white md:p-10">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-600"><ActiveIcon size={24} /></div><p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-white/40">{active.name}</p><h3 className="mt-3 text-3xl font-black tracking-tight">{active.thesis}</h3>
                <div className="mt-9 space-y-3"><p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">Evidence anchors</p>{evidence.map((item) => <div key={item.customer} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center justify-between gap-3"><p className="font-bold">{item.customer}</p><SourceLink href={item.source.url} dark>Source</SourceLink></div><p className="mt-2 text-sm leading-6 text-white/55">{item.outcome}</p></div>)}</div>
              </div>
              <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
                {active.useCases.map((useCase, i) => <div key={useCase.title} className="bg-white p-7 md:p-8"><div className="flex items-center justify-between"><span className="text-xs font-black text-red-700">0{i + 1}</span><ChevronRight size={16} className="text-slate-300" /></div><h4 className="mt-5 text-xl font-black">{useCase.title}</h4><p className="mt-3 text-sm leading-6 text-slate-600">{useCase.value}</p><div className="mt-6 border-t border-slate-100 pt-4"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Measure</p><p className="mt-1 text-xs font-semibold text-slate-700">{useCase.measure}</p></div></div>)}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-3xl"><SectionLabel>03 / Evidence, not theater</SectionLabel><h2 className="text-4xl font-black tracking-[-.04em] lg:text-6xl">Proof points with their limits attached.</h2></div><button onClick={() => setShowEvidence((value) => !value)} className="w-fit rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold hover:bg-slate-50">{showEvidence ? "Show executive view" : "Expand evidence details"}</button></motion.div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {EVIDENCE_CASES.map((item, index) => {
              const Icon = businessIcons[item.business];
              return <motion.article key={item.customer} {...reveal} transition={{ duration: .4, delay: reduceMotion ? 0 : (index % 4) * .05 }} className="flex min-h-[330px] flex-col rounded-3xl border border-slate-200 bg-[#f8f7f4] p-6"><div className="flex items-center justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-red-700 shadow-sm"><Icon size={19} /></div><span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">{item.classification}</span></div><h3 className="mt-7 text-2xl font-black">{item.customer}</h3><p className="mt-4 text-sm font-semibold leading-6 text-slate-900">{item.outcome}</p>{showEvidence && <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-600"><p><strong>Challenge:</strong> {item.challenge}</p><p><strong>Approach:</strong> {item.approach}</p><p><strong>SMC relevance:</strong> {item.relevance}</p></div>}<div className="mt-auto pt-6 text-xs"><SourceLink href={item.source.url}>{item.source.label}</SourceLink><p className="mt-2 text-[10px] text-slate-400">{item.source.date}</p></div></motion.article>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1320] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><SectionLabel>04 / Scale conditions</SectionLabel><h2 className="text-4xl font-black tracking-[-.04em] lg:text-5xl">Successful organizations scale capabilities, not demos.</h2><p className="mt-5 text-base leading-7 text-white/55">Data, governance, platform, and adoption are not technical follow-ons. They are part of the business case from day one.</p></div><div className="grid gap-3 sm:grid-cols-2">{PLATFORM_FOUNDATIONS.map((item, i) => <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[.05] p-5"><div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${["bg-[#4285f4]", "bg-[#ea4335]", "bg-[#fbbc04]", "bg-[#34a853]"][i % 4]}`} /><p className="font-bold">{item.title}</p></div><p className="mt-3 text-sm leading-6 text-white/50">{item.detail}</p></div>)}</div></motion.div>
          <div className="mt-14 grid gap-4 md:grid-cols-4">{outcomes.map((item) => <div key={item.label} className="border-l border-white/15 pl-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-white/35">{item.label}</p><p className="mt-2 font-bold">{item.measure}</p></div>)}</div>
        </div>
      </section>

      <section id="agenda" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-3xl"><SectionLabel>05 / Recommended next step</SectionLabel><h2 className="text-4xl font-black tracking-[-.04em] lg:text-6xl">A 90-day path to evidence, not another open-ended pilot.</h2></motion.div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">{agenda.map((item, i) => <motion.div key={item.range} {...reveal} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7"><span className="absolute right-4 top-1 text-8xl font-black text-slate-50">{i + 1}</span><p className="relative text-xs font-black uppercase tracking-[.18em] text-red-700">{item.range}</p><h3 className="relative mt-8 text-2xl font-black">{item.title}</h3><p className="relative mt-4 text-sm leading-7 text-slate-600">{item.detail}</p></motion.div>)}</div>
          <motion.div {...reveal} className="mt-8 rounded-[2rem] bg-red-700 p-7 text-white md:p-10"><div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-red-100">Executive decision</p><h3 className="mt-4 text-3xl font-black tracking-tight">Select four lighthouse workflows. Give each one an owner, a baseline, and a production decision date.</h3></div><div className="space-y-3 text-sm">{["One group executive sponsor", "One accountable business owner per workflow", "Shared standards for data, identity, approval, evaluation, monitoring, and cost", "Funding tied to quantified operational evidence"].map((item) => <p key={item} className="flex items-start gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-red-200" />{item}</p>)}</div></div></motion.div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#ece9e2]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8"><div className="grid gap-10 lg:grid-cols-2"><div><div className="flex items-center gap-3"><ShieldCheck className="text-red-700" /><h2 className="text-2xl font-black">Claims that must stay qualified</h2></div><div className="mt-6 space-y-3">{QUALIFICATIONS.map((item) => <p key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-700" />{item}</p>)}</div></div><div><div className="flex items-center gap-3"><BarChart3 className="text-red-700" /><h2 className="text-2xl font-black">Primary research sources</h2></div><div className="mt-6 space-y-3">{ENTERPRISE_SOURCES.map((source) => <div key={source.url} className="flex flex-col items-start gap-2 border-b border-slate-300 pb-3 text-xs sm:flex-row sm:justify-between sm:gap-4"><SourceLink href={source.url}>{source.label}</SourceLink><span className="break-words text-slate-400 sm:max-w-[45%] sm:text-right">{source.date}</span></div>)}</div></div></div></div>
      </section>

      <footer className="bg-[#0b1320] text-white"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-3"><Building2 size={18} className="text-red-500" /><p className="text-sm font-bold">San Miguel Corporation / Enterprise AI Executive Brief</p></div><p className="text-xs text-white/35">Evidence curated from public Google Cloud and customer sources. SMC outcomes require validation.</p></div></footer>
    </main>
  );
}
