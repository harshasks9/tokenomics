"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Database,
  ExternalLink,
  Gauge,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  PlaneTakeoff,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import {
  AIRPORT_STRATEGY_THESIS,
  ARCHITECTURE_LAYERS,
  CENTRALIZED_VS_FEDERATED,
  CURRENT_STATE_QUESTIONS,
  DISTINCTIONS,
  EXECUTION_ROADMAP,
  GOOGLE_CLOUD_CAPABILITIES,
  GOVERNANCE_FRAMEWORK,
  HERO_METRICS,
  HIGH_VALUE_USE_CASES,
  KEY_DECISIONS,
  OPERATING_MODEL,
  PEOPLE_ROADMAP,
  PRIORITY_DOMAINS,
  RISKS_AND_DEPENDENCIES,
  STRATEGIC_PRINCIPLES,
  SUCCESS_METRICS,
  type StrategyArea,
} from "@/lib/airport-data-strategy";

const areaIcons: Record<StrategyArea, typeof PlaneTakeoff> = {
  Operations: PlaneTakeoff,
  Passenger: UsersRound,
  Commercial: BarChart3,
  Safety: ShieldCheck,
  Infrastructure: Building2,
  Ecosystem: Network,
};

const areaColors: Record<StrategyArea, string> = {
  Operations: "bg-sky-50 text-sky-700 border-sky-100",
  Passenger: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Commercial: "bg-amber-50 text-amber-700 border-amber-100",
  Safety: "bg-rose-50 text-rose-700 border-rose-100",
  Infrastructure: "bg-violet-50 text-violet-700 border-violet-100",
  Ecosystem: "bg-slate-100 text-slate-700 border-slate-200",
};

const navItems = [
  { href: "#diagnostic", label: "Diagnostic" },
  { href: "#principles", label: "Principles" },
  { href: "#model", label: "Operating model" },
  { href: "#architecture", label: "Architecture" },
  { href: "#domains", label: "Domains" },
  { href: "#usecases", label: "Use cases" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#google", label: "Google Cloud" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[11px] font-black uppercase tracking-[0.22em] text-cyan-600">{children}</p>;
}

function SourceLink({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 text-xs font-bold underline underline-offset-4 transition ${
        dark ? "text-white/70 decoration-white/25 hover:text-white" : "text-slate-700 decoration-slate-300 hover:text-cyan-700"
      }`}
    >
      <span>{children}</span>
      <ExternalLink size={12} />
    </a>
  );
}

function AreaBadge({ area }: { area: StrategyArea }) {
  const Icon = areaIcons[area];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[.13em] ${areaColors[area]}`}>
      <Icon size={13} />
      {area}
    </span>
  );
}

export default function AirportDataStrategyMicrosite() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 22 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.16 },
        transition: { duration: 0.52 },
      };

  return (
    <main className="min-h-screen bg-[#eef5f7] text-slate-950 selection:bg-cyan-200">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/90 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Back to AI Tokenomics home">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-500 text-sm font-black text-slate-950">AD</span>
            <span className="hidden truncate text-sm font-semibold tracking-tight sm:block">Airport Data Strategy</span>
          </Link>
          <nav className="hidden items-center gap-5 text-xs font-semibold text-white/60 xl:flex" aria-label="Page sections">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#roadmap" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-50">
            36-month roadmap
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#07111f] text-white">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "radial-gradient(circle at 82% 18%, rgba(34, 211, 238, .26), transparent 30%), radial-gradient(circle at 18% 85%, rgba(59, 130, 246, .22), transparent 34%), linear-gradient(135deg, rgba(255,255,255,.04) 0 1px, transparent 1px)",
            backgroundSize: "auto, auto, 44px 44px",
          }}
        />
        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-28">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70">
              <PlaneTakeoff size={14} className="text-cyan-300" />
              San Miguel airport and aviation businesses
            </div>
            <h1 className="max-w-5xl text-5xl font-black leading-[.96] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
              Build the data foundation for an <span className="text-cyan-300">agent-ready airport.</span>
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/68 lg:text-xl">{AIRPORT_STRATEGY_THESIS}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#diagnostic" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300">
                Start with the diagnostic <ArrowRight size={16} />
              </a>
              <a href="#google" className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10">
                Map to Google Cloud
              </a>
            </div>
          </motion.div>

          <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.65 }}>
            <div className="rounded-[2rem] border border-white/12 bg-white/[.06] p-5 shadow-2xl backdrop-blur-md sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-white/45">Executive frame</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {HERO_METRICS.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <p className="text-4xl font-black tracking-tight">{stat.value}</p>
                    <p className="mt-1 text-xs text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-white p-5 text-slate-950">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-100 text-cyan-700">
                    <Radar size={20} />
                  </div>
                  <div>
                    <p className="font-black">The operational goal is earlier, trusted action.</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      The data platform succeeds when airport leaders can anticipate constraints, coordinate partners, and prove value before disruption becomes visible to passengers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="diagnostic" className="scroll-mt-24 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-3xl">
            <SectionLabel>01 / Current-state diagnostic</SectionLabel>
            <h2 className="text-4xl font-black tracking-[-.04em] lg:text-6xl">Ask where data changes airport decisions, not where data exists.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The diagnostic should expose operational latency, ownership gaps, partner-sharing constraints, and AI readiness before the organization selects tools or funds large integration work.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {CURRENT_STATE_QUESTIONS.map((block, index) => (
              <motion.article key={block.title} {...reveal} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-100 text-sm font-black text-cyan-700">{index + 1}</span>
                  <h3 className="text-xl font-black">{block.title}</h3>
                </div>
                <div className="mt-6 space-y-3">
                  {block.questions.map((question) => (
                    <p key={question} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <ChevronRight size={15} className="mt-1 shrink-0 text-cyan-600" />
                      {question}
                    </p>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#07111f] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="grid gap-4 md:grid-cols-4">
            {DISTINCTIONS.map((item) => (
              <motion.div key={item.title} {...reveal} className="rounded-3xl border border-white/10 bg-white/[.05] p-5">
                <p className="text-sm font-black text-cyan-200">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-white/55">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="principles" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <SectionLabel>02 / Strategic principles</SectionLabel>
              <h2 className="text-4xl font-black tracking-[-.04em] lg:text-5xl">A durable data strategy is a set of operating choices.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                These principles protect the airport from point solutions, dashboard sprawl, model lock-in, and governance that arrives after the risk has already scaled.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {STRATEGIC_PRINCIPLES.map((principle) => (
                <motion.article key={principle.title} {...reveal} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 text-cyan-700">
                    <CheckCircle2 size={19} />
                  </div>
                  <h3 className="mt-6 text-xl font-black">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{principle.detail}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {CENTRALIZED_VS_FEDERATED.map((block) => (
              <motion.article key={block.model} {...reveal} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm shadow-slate-900/5">
                <h3 className="text-2xl font-black">{block.model}</h3>
                <div className="mt-6 space-y-3">
                  {block.items.map((item) => (
                    <p key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      {item}
                    </p>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="model" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-3xl">
            <SectionLabel>03 / Target operating model</SectionLabel>
            <h2 className="text-4xl font-black tracking-[-.04em] lg:text-6xl">Central expertise, federated accountability.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              A Data and AI Office should not own every data set. It should provide standards, reusable services, and portfolio discipline while airport domains own value, definitions, and adoption.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {OPERATING_MODEL.map((item) => (
              <motion.article key={item.role} {...reveal} className="rounded-3xl border border-slate-200 bg-[#f8fbfc] p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-cyan-700 shadow-sm">
                  <UsersRound size={19} />
                </div>
                <h3 className="mt-6 text-xl font-black">{item.role}</h3>
                <p className="mt-3 text-xs font-black uppercase tracking-[.14em] text-slate-400">{item.owner}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{item.mandate}</p>
              </motion.article>
            ))}
          </div>
          <motion.div {...reveal} className="mt-10 rounded-[2rem] bg-[#07111f] p-7 text-white md:p-10">
            <div className="flex items-center gap-3">
              <Sparkles className="text-cyan-300" />
              <h3 className="text-2xl font-black">Capability roadmap for people and organization</h3>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {PEOPLE_ROADMAP.map((item) => (
                <div key={item.capability} className="rounded-2xl border border-white/10 bg-white/[.05] p-5">
                  <p className="font-bold text-cyan-100">{item.capability}</p>
                  <p className="mt-3 text-xs leading-5 text-white/55">{item.actions}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <SectionLabel>04 / Target data and AI architecture</SectionLabel>
              <h2 className="text-4xl font-black tracking-[-.04em] lg:text-5xl">Mission-critical operations need a hybrid, real-time, governed architecture.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                The platform must support batch analytics, streaming operations, geospatial views, unstructured evidence, multimodal AI, edge continuity, and partner exchange without forcing every airport system into one migration pattern.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 md:p-7">
              <div className="grid gap-3">
                {ARCHITECTURE_LAYERS.map((layer, index) => (
                  <motion.div key={layer.layer} {...reveal} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[180px_1fr] md:items-center">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-100 text-xs font-black text-cyan-700">{index + 1}</span>
                      <p className="font-black">{layer.layer}</p>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{layer.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { icon: Activity, title: "Real-time by design", text: "Use event streams for operational moments where minutes matter; use batch where reconciliation and planning matter." },
              { icon: LockKeyhole, title: "Secure by default", text: "Apply least privilege, encryption, policy tags, audit logs, and partner-specific access controls from the first data product." },
              { icon: Route, title: "Hybrid and edge-aware", text: "Keep latency-sensitive or sovereignty-bound workloads close to the airport while exposing governed cloud APIs and streams." },
              { icon: Gauge, title: "Operated like a product", text: "Measure freshness, quality, cost, latency, adoption, incidents, recovery, and value as first-class platform metrics." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.article key={item.title} {...reveal} className="rounded-3xl border border-slate-200 bg-white p-6">
                  <Icon className="text-cyan-700" />
                  <h3 className="mt-5 font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="domains" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-3xl">
            <SectionLabel>05 / Priority data domains</SectionLabel>
            <h2 className="text-4xl font-black tracking-[-.04em] lg:text-6xl">Define what the data means operationally, who owns it, and which outcome it changes.</h2>
          </motion.div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {PRIORITY_DOMAINS.map((domain) => (
              <motion.article key={domain.domain} {...reveal} className="rounded-[2rem] border border-slate-200 bg-[#f8fbfc] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <AreaBadge area={domain.area} />
                  <p className="text-[10px] font-black uppercase tracking-[.15em] text-slate-400">{domain.owner}</p>
                </div>
                <h3 className="mt-6 text-2xl font-black">{domain.domain}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{domain.operationalMeaning}</p>
                <div className="mt-5 rounded-2xl bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[.16em] text-cyan-700">Business outcome</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{domain.businessOutcome}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="usecases" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <SectionLabel>06 / High-value airport use cases</SectionLabel>
              <h2 className="text-4xl font-black tracking-[-.04em] lg:text-6xl">Use cases should teach the platform what to become.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                The sequence below distinguishes reporting, predictive AI, generative AI, and agentic AI so leaders do not over-engineer simple needs or under-govern autonomous action.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-600 sm:grid-cols-4">
              {["Reporting", "Predictive AI", "Generative AI", "Agentic AI"].map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-center">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {HIGH_VALUE_USE_CASES.map((useCase) => (
              <motion.article key={useCase.useCase} {...reveal} className="flex min-h-[430px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <AreaBadge area={useCase.area} />
                  <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-[.12em] text-white">{useCase.type}</span>
                </div>
                <h3 className="mt-6 text-xl font-black">{useCase.useCase}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{useCase.value}</p>
                <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-600">
                  <p><strong>Data needed:</strong> {useCase.dataNeeded}</p>
                  <p><strong>Adoption requirement:</strong> {useCase.adoptionRequirement}</p>
                </div>
                <div className="mt-auto pt-5">
                  <p className="rounded-2xl bg-cyan-50 p-4 text-xs font-semibold leading-5 text-cyan-900">
                    Measure: {useCase.metric}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="governance" className="scroll-mt-24 bg-[#07111f] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <SectionLabel>07 / Governance and responsible AI</SectionLabel>
              <h2 className="text-4xl font-black tracking-[-.04em] lg:text-5xl">Trust is an operating capability, not a policy PDF.</h2>
              <p className="mt-5 text-base leading-7 text-white/55">
                Airport data governance must cover data quality, privacy, cyber, partner sharing, model risk, and agent actions as one connected control system.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {GOVERNANCE_FRAMEWORK.map((item) => (
                <motion.article key={item.pillar} {...reveal} className="rounded-3xl border border-white/10 bg-white/[.05] p-6">
                  <ShieldCheck className="text-cyan-300" />
                  <h3 className="mt-5 text-xl font-black">{item.pillar}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{item.controls}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="roadmap" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="max-w-3xl">
            <SectionLabel>08 / Phased execution roadmap</SectionLabel>
            <h2 className="text-4xl font-black tracking-[-.04em] lg:text-6xl">Prove, scale, then orchestrate.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The first six months should create proof and operating discipline. The next twelve scale governed data products and predictive AI. The long-term horizon moves toward agent-ready airport orchestration.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {EXECUTION_ROADMAP.map((phase, index) => (
              <motion.article key={phase.horizon} {...reveal} className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f8fbfc] p-7">
                <span className="absolute right-4 top-1 text-8xl font-black text-slate-100">{index + 1}</span>
                <p className="relative text-xs font-black uppercase tracking-[.18em] text-cyan-700">{phase.horizon}</p>
                <h3 className="relative mt-7 text-2xl font-black">{phase.focus}</h3>
                <div className="relative mt-6 space-y-3">
                  {phase.moves.map((move) => (
                    <p key={move} className="flex gap-3 text-sm leading-6 text-slate-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />
                      {move}
                    </p>
                  ))}
                </div>
                <div className="relative mt-6 rounded-2xl bg-white p-4">
                  <p className="text-[10px] font-black uppercase tracking-[.16em] text-slate-400">Proof point</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{phase.proof}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#eef5f7]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-3 lg:px-8 lg:py-24">
          <motion.div {...reveal}>
            <div className="flex items-center gap-3">
              <GitBranch className="text-cyan-700" />
              <h2 className="text-2xl font-black">Key decisions</h2>
            </div>
            <div className="mt-6 space-y-3">
              {KEY_DECISIONS.map((item) => (
                <p key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <ChevronRight size={15} className="mt-1 shrink-0 text-cyan-700" />
                  {item}
                </p>
              ))}
            </div>
          </motion.div>
          <motion.div {...reveal}>
            <div className="flex items-center gap-3">
              <Layers3 className="text-cyan-700" />
              <h2 className="text-2xl font-black">Risks and dependencies</h2>
            </div>
            <div className="mt-6 space-y-3">
              {RISKS_AND_DEPENDENCIES.map((item) => (
                <div key={item.risk} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="font-bold">{item.risk}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.mitigation}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...reveal}>
            <div className="flex items-center gap-3">
              <Gauge className="text-cyan-700" />
              <h2 className="text-2xl font-black">Success metrics</h2>
            </div>
            <div className="mt-6 space-y-3">
              {SUCCESS_METRICS.map((item) => (
                <p key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                  {item}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="google" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <SectionLabel>09 / Google Cloud and Gemini Enterprise Agent Platform</SectionLabel>
              <h2 className="text-4xl font-black tracking-[-.04em] lg:text-5xl">Use Google Cloud as the enabling platform, not the strategy itself.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                The strategy should remain durable as models, interfaces, and agent frameworks evolve. Google Cloud can provide the integration, data, governance, AI, and agent platform capabilities that make the operating model executable.
              </p>
              <div className="mt-8 rounded-[2rem] bg-[#07111f] p-6 text-white">
                <div className="flex items-center gap-3">
                  <Cloud className="text-cyan-300" />
                  <p className="font-black">Recommended positioning</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/60">
                  Anchor the architecture in open data products, governed APIs, portable semantics, and measurable airport outcomes. Then use Google Cloud services where they accelerate integration, analytics, AI development, governance, and enterprise-scale agent operations.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              {GOOGLE_CLOUD_CAPABILITIES.map((item) => (
                <motion.article key={item.requirement} {...reveal} className="rounded-3xl border border-slate-200 bg-[#f8fbfc] p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[.16em] text-cyan-700">{item.requirement}</p>
                      <h3 className="mt-2 text-xl font-black">{item.capabilities}</h3>
                    </div>
                    <SourceLink href={item.source}>Official source</SourceLink>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{item.relevance}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#07111f] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <motion.div {...reveal} className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-cyan-300">Executive next step</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-.03em] lg:text-5xl">Approve a 90-day diagnostic and lighthouse-data-product sprint.</h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60">
                The first decision is not a full platform build. It is a focused diagnostic, a small number of production-grade data products, and two to three use cases with measurable airport value and named adoption owners.
              </p>
            </div>
            <div className="grid gap-3 text-sm">
              {["Name the executive sponsor and domain owners", "Select first three airport data products", "Define partner-sharing assumptions", "Baseline KPIs before pilots begin", "Fund production only when adoption is proven"].map((item) => (
                <p key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.05] p-4">
                  <CheckCircle2 size={17} className="shrink-0 text-cyan-300" />
                  {item}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#040910] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-cyan-300" />
            <p className="text-sm font-bold">Airport Data Strategy / AI Tokenomics</p>
          </div>
          <p className="text-xs text-white/35">Strategy framework for airport and aviation data transformation. Business outcomes require local baseline validation.</p>
        </div>
      </footer>
    </main>
  );
}
