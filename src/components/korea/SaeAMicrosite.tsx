"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Factory,
  Gauge,
  Globe2,
  Handshake,
  Landmark,
  Lightbulb,
  LineChart,
  MapPin,
  Presentation,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import OpportunityExplorer from "@/components/korea/OpportunityExplorer";
import RoiModel from "@/components/korea/RoiModel";
import {
  competitors,
  company,
  digitalMaturity,
  financialObservations,
  footprint,
  heroStats,
  industryForces,
  platformCompetition,
  readiness,
  risks,
  site,
  thesis,
} from "@/lib/korea/intelligence";
import { decisionDynamics, personas } from "@/lib/korea/personas";
import { commercial, futureState, patterns, roadmap } from "@/lib/korea/opportunities";
import { blueprint, deckMeta, faq, slides } from "@/lib/korea/deck";

const BLUE = "#0047A0";
const RED = "#CD2E3A";

const navItems: [string, string][] = [
  ["#thesis", "Thesis"],
  ["#company", "Company"],
  ["#industry", "Industry"],
  ["#money", "Financials"],
  ["#people", "Executives"],
  ["#opportunity", "Opportunities"],
  ["#roi", "ROI"],
  ["#future", "2029"],
  ["#roadmap", "Roadmap"],
  ["#deck", "Deck"],
  ["#faq", "FAQ"],
];

function Confidence({ level }: { level: "evidence" | "hypothesis" }) {
  const evidence = level === "evidence";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] ${
        evidence ? "bg-[#e6f4ea] text-[#137333]" : "bg-[#f1f3f4] text-[#5f6368]"
      }`}
    >
      {evidence ? "Evidence" : "Hypothesis"}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: RED }}>{children}</p>;
}

function SectionHead({
  label,
  title,
  lede,
  dark = false,
}: {
  label: string;
  title: string;
  lede?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-4xl">
      <SectionLabel>{label}</SectionLabel>
      <h2
        className={`text-3xl font-black leading-[1.06] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      {lede ? (
        <p className={`mt-4 text-base leading-7 ${dark ? "text-white/65" : "text-slate-600"}`}>{lede}</p>
      ) : null}
    </div>
  );
}

export default function SaeAMicrosite() {
  const reduceMotion = useReducedMotion();
  const [activePersona, setActivePersona] = useState(personas[0].id);
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const persona = personas.find((item) => item.id === activePersona) ?? personas[0];
  const slide = slides[activeSlide];

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.45 },
      };

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-950">
      {/* ---------------------------------------------------------------- nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070d18]/94 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Back to AI Tokenomics home">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-black text-white"
              style={{ backgroundColor: RED }}
            >
              세
            </span>
            <span className="hidden truncate text-sm font-semibold tracking-tight sm:block">
              Global Sae-A × Google Cloud
            </span>
          </Link>
          <nav className="hidden items-center gap-4 text-[11px] font-semibold text-white/55 xl:flex" aria-label="Sections">
            {navItems.map(([href, label]) => (
              <a key={href} href={href} className="transition hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#cta"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-slate-100"
          >
            14 August <ArrowRight size={14} />
          </a>
        </div>
      </header>

      {/* -------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden bg-[#070d18] text-white">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(1100px 620px at 12% 0%, rgba(0,71,160,.55) 0%, rgba(7,13,24,0) 62%), radial-gradient(900px 520px at 88% 100%, rgba(205,46,58,.34) 0%, rgba(7,13,24,0) 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/70">
            <Sparkles size={13} style={{ color: "#fbbc04" }} />
            {site.preparedBy} · {site.meetingDate}
          </div>
          <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-[5.25rem]">
            The Allocation
            <br />
            Advantage
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/72">{site.subtitle}</p>

          <div className="mt-11 grid gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 sm:grid-cols-2 lg:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="bg-[#0b1424] p-6">
                <p className="text-4xl font-black tracking-tight tabular-nums">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold leading-5 text-white/78">{stat.label}</p>
                <p className="mt-1 text-[11px] text-white/40">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#thesis"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
            >
              Read the thesis <ArrowRight size={15} />
            </a>
            <a
              href="#roi"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold text-white transition hover:border-white/60"
            >
              Break our ROI model
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ thesis */}
      <section id="thesis" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead
          label="Executive summary"
          title="One question decides Global Sae-A's margin in 2027. Everything here ladders to answering it faster."
          lede="This assessment was built beyond the account briefing, from public evidence about Sae-A, its buyers, its competitors and the trade and disclosure regimes it operates under. Where we are inferring rather than citing, we say so."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {thesis.map((item, index) => (
            <motion.article
              key={item.id}
              {...reveal}
              className="rounded-2xl border border-slate-200 bg-white p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-4xl font-black tabular-nums text-slate-200">0{index + 1}</span>
                <Confidence level={item.confidence} />
              </div>
              <h3 className="mt-4 text-xl font-black leading-tight tracking-tight text-slate-950">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-slate-600">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- company */}
      <section id="company" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead label="Company intelligence" title="Five business systems, one owner, one balance sheet" lede={company.summary} />
          <div className="mt-10 space-y-4">
            {company.pillars.map((pillar) => (
              <motion.article
                key={pillar.name}
                {...reveal}
                className="grid gap-6 rounded-2xl border border-slate-200 p-7 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]"
              >
                <div>
                  <span className="inline-block h-1.5 w-14 rounded-full" style={{ backgroundColor: pillar.accent }} />
                  <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-slate-950">{pillar.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{pillar.role}</p>
                  <div className="mt-4">
                    <Confidence level={pillar.confidence} />
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {pillar.facts.map((fact) => (
                    <li key={fact} className="flex gap-2.5 text-[15px] leading-6 text-slate-700">
                      <CheckCircle2 size={16} className="mt-1 shrink-0" style={{ color: pillar.accent }} />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- footprint */}
      <section className="bg-[#070d18] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead
            label="The strategic asset"
            title="Sae-A now manufactures on both sides of a line that most competitors cannot cross"
            lede={footprint.note}
            dark
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {footprint.regimes.map((regime) => (
              <motion.article
                key={regime.name}
                {...reveal}
                className={`rounded-2xl border p-7 ${
                  regime.tone === "advantage" ? "border-[#34a853]/45 bg-[#34a853]/10" : "border-[#f29900]/40 bg-[#f29900]/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe2 size={16} className={regime.tone === "advantage" ? "text-[#81c995]" : "text-[#fdd663]"} />
                  <h3 className="text-lg font-black tracking-tight">{regime.name}</h3>
                </div>
                <p className="mt-2 text-sm font-semibold text-white/70">{regime.status}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {regime.countries.map((country) => (
                    <span
                      key={country}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold"
                    >
                      <MapPin size={11} /> {country}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-[15px] leading-7 text-white/72">{regime.implication}</p>
              </motion.article>
            ))}
          </div>
          <div className="mt-8 border-l-4 p-6" style={{ borderColor: RED, backgroundColor: "rgba(255,255,255,.05)" }}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: "#f28b82" }}>
              The insight the whole engagement rests on
            </p>
            <p className="mt-2 text-lg font-semibold leading-8 text-white/85">{footprint.insight}</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- industry */}
      <section id="industry" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead
          label="Industry intelligence"
          title="Six forces, and what each one actually means for Sae-A"
          lede="Generic industry commentary is worthless in an executive session. Each force below carries a dated external event and a specific consequence for Global Sae-A's operating model."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {industryForces.map((force) => (
            <motion.article key={force.title} {...reveal} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[17px] font-black leading-tight tracking-tight text-slate-950">{force.title}</h3>
                <Confidence level={force.confidence} />
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{force.detail}</p>
              <div className="mt-5 rounded-xl bg-[#f1f5fd] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: BLUE }}>
                  So what for Sae-A
                </p>
                <p className="mt-1.5 text-[13px] font-semibold leading-5 text-slate-800">{force.soWhat}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <div className="flex items-center gap-2">
              <Factory size={16} style={{ color: BLUE }} />
              <h3 className="text-lg font-black tracking-tight text-slate-950">Competitive landscape — the manufacturers</h3>
            </div>
            <div className="mt-5 space-y-4">
              {competitors.map((rival) => (
                <div key={rival.name} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
                  <p className="text-sm font-black text-slate-900">{rival.name}</p>
                  <p className="mt-1 text-[13px] text-slate-500">{rival.profile}</p>
                  <p className="mt-2 text-[13px] leading-5 text-slate-600">{rival.posture}</p>
                  <p className="mt-2 text-[13px] font-semibold leading-5" style={{ color: BLUE }}>
                    {rival.saeaEdge}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <div className="flex items-center gap-2">
              <Boxes size={16} style={{ color: RED }} />
              <h3 className="text-lg font-black tracking-tight text-slate-950">
                Competitive landscape — who else will pitch this
              </h3>
            </div>
            <div className="mt-5 space-y-4">
              {platformCompetition.map((rival) => (
                <div key={rival.vendor} className="border-t border-slate-100 pt-4 first:border-0 first:pt-0">
                  <p className="text-sm font-black text-slate-900">{rival.vendor}</p>
                  <p className="mt-1 text-[13px] italic text-slate-500">&ldquo;{rival.likelyPitch}&rdquo;</p>
                  <p className="mt-2 text-[13px] leading-5 text-[#137333]">
                    <span className="font-bold">Genuine strength:</span> {rival.honestStrength}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-5 text-slate-600">
                    <span className="font-bold">Where it loses here:</span> {rival.whereItLoses}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- money */}
      <section id="money" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead
            label="Financial observations"
            title="Six numbers that should shape how this is sold internally"
            lede="Global Sae-A is privately held, so this is a read of public disclosure and the account team's briefing rather than an audited picture. The interpretations matter more than the figures."
          />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="pb-3 pr-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Metric</th>
                  <th className="pb-3 pr-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Value</th>
                  <th className="pb-3 pr-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                    What it means for the pitch
                  </th>
                  <th className="pb-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Basis</th>
                </tr>
              </thead>
              <tbody>
                {financialObservations.map((row) => (
                  <tr key={row.metric} className="border-b border-slate-100 align-top">
                    <td className="py-4 pr-4 text-sm font-black text-slate-900">{row.metric}</td>
                    <td className="py-4 pr-4 text-sm font-bold tabular-nums" style={{ color: BLUE }}>
                      {row.value}
                    </td>
                    <td className="py-4 pr-4 text-[13px] leading-5 text-slate-600">{row.read}</td>
                    <td className="py-4">
                      <Confidence level={row.confidence} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* technology + readiness */}
          <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
            <div>
              <SectionLabel>Technology &amp; organisational assessment</SectionLabel>
              <h3 className="text-2xl font-black tracking-tight text-slate-950">{digitalMaturity.headline}</h3>
              <div className="mt-6 space-y-4">
                {digitalMaturity.signals.map((signal) => (
                  <div
                    key={signal.signal}
                    className={`rounded-xl border-l-4 bg-white p-5 ${
                      signal.tone === "strength"
                        ? "border-[#188038]"
                        : signal.tone === "gap"
                          ? "border-[#E37400]"
                          : "border-slate-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-black text-slate-900">{signal.signal}</p>
                      <Confidence level={signal.confidence} />
                    </div>
                    <p className="mt-2 text-[13px] leading-5 text-slate-600">{signal.reading}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#070d18] p-7 text-white">
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-[#8ab4f8]" />
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/50">AI readiness</p>
              </div>
              <div className="mt-6 space-y-5">
                {readiness.map((row) => (
                  <div key={row.dimension}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-bold">{row.dimension}</p>
                      <p className="text-sm font-black tabular-nums text-[#8ab4f8]">
                        {row.score}
                        <span className="text-white/35">/{row.of}</span>
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full bg-[#8ab4f8]"
                        style={{ width: `${(row.score / row.of) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] leading-4 text-white/45">{row.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-7 border-t border-white/10 pt-4 text-[12px] leading-5 text-white/55">
                Read together, this scorecard argues for exactly one thing: a phase one that needs strong sponsorship and a
                clear business case — which Sae-A has — and needs neither mature data foundations nor in-house ML capability,
                which it does not.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ people */}
      <section id="people" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead
          label="Executive personas"
          title="Eleven people decide this. Seven are in the room; four are not, and they matter just as much."
          lede="Names, titles and attendance come from the account briefing. Motivations, metrics and objections are our model — they are meant to be tested against the people themselves on 14 August, not assumed."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,.34fr)_minmax(0,.66fr)]">
          <div className="space-y-2">
            {personas.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePersona(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition ${
                  item.id === persona.id
                    ? "border-slate-900 bg-white shadow-sm"
                    : "border-slate-200 bg-white/60 hover:border-slate-400"
                }`}
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[11px] font-black text-white"
                  style={{ backgroundColor: item.accent }}
                >
                  {item.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-black text-slate-900">
                    {item.name}
                    {item.nameKo ? <span className="ml-1.5 font-semibold text-slate-400">{item.nameKo}</span> : null}
                  </span>
                  <span className="block truncate text-[11px] text-slate-500">{item.role}</span>
                </span>
                {item.inRoom ? (
                  <span className="ml-auto shrink-0 rounded-full bg-[#e6f4ea] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#137333]">
                    In room
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <article className="rounded-2xl border border-slate-200 bg-white p-7">
            <span className="inline-block h-1.5 w-14 rounded-full" style={{ backgroundColor: persona.accent }} />
            <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-slate-950">
              {persona.name}
              {persona.nameKo ? <span className="ml-2 text-lg font-bold text-slate-400">{persona.nameKo}</span> : null}
            </h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{persona.role}</p>
            <p className="mt-5 text-lg font-bold leading-7 text-slate-900">{persona.headline}</p>
            <p className="mt-3 text-[15px] leading-7 text-slate-600">{persona.context}</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Success metrics</p>
                <ul className="mt-2 space-y-1.5">
                  {persona.successMetrics.map((metric) => (
                    <li key={metric} className="flex gap-2 text-[13px] leading-5 text-slate-700">
                      <ChevronRight size={13} className="mt-0.5 shrink-0" style={{ color: persona.accent }} />
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Constraints</p>
                <ul className="mt-2 space-y-1.5">
                  {persona.constraints.map((constraint) => (
                    <li key={constraint} className="flex gap-2 text-[13px] leading-5 text-slate-700">
                      <ChevronRight size={13} className="mt-0.5 shrink-0 text-slate-300" />
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-[#f1f5fd] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: BLUE }}>
                  Where AI creates leverage
                </p>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-700">{persona.aiLeverage}</p>
              </div>
              <div className="rounded-xl bg-[#fef7e0] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#B06000]">Where AI creates risk</p>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-700">{persona.aiRisk}</p>
              </div>
              <div className="rounded-xl bg-[#f1f3f4] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Political read</p>
                <p className="mt-1.5 text-[12px] leading-5 text-slate-700">{persona.politics}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#070d18] p-5 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/45">How we open with them</p>
              <p className="mt-2 text-[15px] font-semibold italic leading-7 text-white/90">{persona.openingLine}</p>
            </div>

            <div className="mt-4 rounded-xl border-l-4 p-5" style={{ borderColor: persona.accent, backgroundColor: "#fafafa" }}>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Their killer objection</p>
              <p className="mt-1.5 text-sm font-black text-slate-900">{persona.killerObjection}</p>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Our answer</p>
              <p className="mt-1.5 text-[14px] leading-6 text-slate-700">{persona.answer}</p>
            </div>
          </article>
        </div>

        <div className="mt-14">
          <SectionLabel>Decision dynamics</SectionLabel>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {decisionDynamics.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Users size={15} style={{ color: RED }} />
                  <h4 className="text-[15px] font-black leading-tight tracking-tight text-slate-950">{item.title}</h4>
                </div>
                <p className="mt-2.5 text-[13px] leading-6 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- opportunity */}
      <section id="opportunity" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead
            label="Opportunity map"
            title="Ten opportunities, sequenced — including the three we recommend against"
            lede="Plotted by modelled business value against implementation effort. Select any point to see the problem, the design, the Google capabilities involved, the metric that would decide it, and where we think the honest limits are."
          />
          <div className="mt-10">
            <OpportunityExplorer />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- patterns */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead
          label="Transferable patterns"
          title="Six patterns from comparable transformations — and how well each one actually fits Sae-A"
          lede="Case studies are anecdotes. Patterns transfer. Each of these is drawn from how organisations resembling Global Sae-A in ownership structure, cost posture, regulatory exposure or manufacturing footprint have succeeded and failed."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {patterns.map((pattern) => (
            <motion.article key={pattern.id} {...reveal} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Lightbulb size={15} style={{ color: BLUE }} />
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{pattern.who}</p>
              </div>
              <h3 className="mt-3 text-[18px] font-black leading-tight tracking-tight text-slate-950">{pattern.title}</h3>
              <p className="mt-3 flex-1 text-[13px] leading-6 text-slate-600">{pattern.pattern}</p>
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Fit for Sae-A</p>
                  <p className="mt-1 text-[13px] font-semibold leading-5 text-slate-800">{pattern.fit}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">How we apply it</p>
                  <p className="mt-1 text-[13px] leading-5 text-slate-600">{pattern.application}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- roi */}
      <section id="roi" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead
            label="ROI model"
            title="We are publishing our assumptions, not our conclusions"
            lede="Every figure below is a placeholder to be replaced with Sae-A's own numbers on 14 August. Drag adoption down to 30% and see whether the case still clears — we would rather lose that argument now than win it on optimistic inputs."
          />
          <div className="mt-10">
            <RoiModel />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ future */}
      <section id="future" className="bg-[#070d18] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead label="Future operating model" title={futureState.headline} dark />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
            <div className="space-y-5">
              {futureState.paragraphs.map((paragraph, index) => (
                <motion.p key={index} {...reveal} className="text-[17px] leading-8 text-white/78">
                  {paragraph}
                </motion.p>
              ))}
            </div>
            <div className="space-y-3">
              {futureState.shifts.map((shift) => (
                <div key={shift.to} className="rounded-xl border border-white/12 bg-white/[0.04] p-5">
                  <p className="text-[13px] leading-5 text-white/40 line-through">{shift.from}</p>
                  <p className="mt-2 flex gap-2 text-[14px] font-bold leading-6">
                    <Route size={15} className="mt-0.5 shrink-0 text-[#8ab4f8]" />
                    {shift.to}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- roadmap */}
      <section id="roadmap" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead
          label="Adoption roadmap"
          title="From today to 2029, with a named owner and a named output at every step"
          lede="The sequence is deliberate: knowledge and audit first because they need no data programme, ESG and safety second because they need the credibility phase one buys, and the harder platform work only once it is funded by results."
        />
        <div className="mt-10 space-y-4">
          {roadmap.map((phase, index) => (
            <motion.article key={phase.phase} {...reveal} className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-7 lg:grid-cols-[minmax(0,.32fr)_minmax(0,.68fr)]">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-black text-white"
                    style={{ backgroundColor: index === 0 || index === 1 ? RED : BLUE }}
                  >
                    {index + 1}
                  </span>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">{phase.phase}</p>
                </div>
                <h3 className="mt-4 text-xl font-black leading-tight tracking-tight text-slate-950">{phase.title}</h3>
                <p className="mt-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Owner</p>
                <p className="mt-1 text-[13px] font-semibold text-slate-700">{phase.owner}</p>
              </div>
              <div>
                <p className="text-[15px] leading-7 text-slate-600">{phase.detail}</p>
                <ul className="mt-4 space-y-2">
                  {phase.outputs.map((output) => (
                    <li key={output} className="flex gap-2.5 text-[13px] font-semibold leading-5 text-slate-800">
                      <ClipboardCheck size={15} className="mt-0.5 shrink-0" style={{ color: BLUE }} />
                      {output}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- commercial+risks */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel>Commercial recommendation</SectionLabel>
              <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950">{commercial.headline}</h2>
              <div className="mt-8 space-y-4">
                {commercial.principles.map((principle) => (
                  <div key={principle.title} className="rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2">
                      <CircleDollarSign size={15} style={{ color: BLUE }} />
                      <h3 className="text-[15px] font-black tracking-tight text-slate-950">{principle.title}</h3>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-slate-600">{principle.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Risks &amp; how we lose</SectionLabel>
              <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950">
                The six ways this engagement fails, and what we do about each
              </h2>
              <div className="mt-8 space-y-4">
                {risks.map((risk) => (
                  <div key={risk.risk} className="rounded-xl border border-slate-200 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          size={15}
                          className="mt-0.5 shrink-0"
                          style={{ color: risk.severity === "High" ? RED : risk.severity === "Medium" ? "#E37400" : "#5F6368" }}
                        />
                        <h3 className="text-[15px] font-black leading-tight tracking-tight text-slate-950">{risk.risk}</h3>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                        style={{
                          backgroundColor:
                            risk.severity === "High" ? "#fce8e6" : risk.severity === "Medium" ? "#fef7e0" : "#f1f3f4",
                          color: risk.severity === "High" ? "#a50e0e" : risk.severity === "Medium" ? "#b06000" : "#5f6368",
                        }}
                      >
                        {risk.severity}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[13px] leading-6 text-slate-600">{risk.mitigation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- deck */}
      <section id="deck" className="bg-[#070d18] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead
            label="Executive presentation"
            title="Fourteen slides, one job: get one sentence agreed"
            lede={deckMeta.goldenRule}
            dark
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Audience", deckMeta.audience],
              ["Duration", deckMeta.duration],
              ["Design principle", deckMeta.designPrinciple],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/12 bg-white/[0.04] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">{label}</p>
                <p className="mt-1.5 text-[13px] leading-5 text-white/75">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-1.5">
            {slides.map((item, index) => (
              <button
                key={item.n}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-9 w-9 rounded-lg text-xs font-black transition ${
                  index === activeSlide ? "bg-white text-slate-950" : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
                aria-label={`Slide ${item.n}`}
              >
                {item.n}
              </button>
            ))}
          </div>

          <motion.article
            key={slide.n}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04]"
          >
            <div className="border-b border-white/10 p-8">
              <div className="flex items-center gap-3">
                <Presentation size={15} className="text-[#8ab4f8]" />
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/45">
                  Slide {slide.n} · {slide.section}
                </p>
              </div>
              <h3 className="mt-4 text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">{slide.headline}</h3>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/70">{slide.narrative}</p>
            </div>

            <div className="grid gap-px bg-white/10 lg:grid-cols-2">
              <div className="bg-[#0b1424] p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Supporting evidence</p>
                <ul className="mt-3 space-y-2">
                  {slide.evidence.map((item) => (
                    <li key={item} className="flex gap-2 text-[13px] leading-5 text-white/72">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#81c995]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#0b1424] p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Visual recommendation</p>
                <p className="mt-3 text-[13px] leading-5 text-white/72">{slide.visual}</p>
                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Infographic concept</p>
                <p className="mt-3 text-[13px] leading-5 text-white/72">{slide.infographic}</p>
              </div>
              <div className="bg-[#0b1424] p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Speaker notes</p>
                <p className="mt-3 text-[13px] leading-5 text-white/72">{slide.speakerNotes}</p>
              </div>
              <div className="bg-[#0b1424] p-7">
                <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "#f28b82" }}>
                  Anticipated executive question
                </p>
                <p className="mt-3 text-[14px] font-black leading-5 text-white">&ldquo;{slide.question}&rdquo;</p>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Our answer</p>
                <p className="mt-2 text-[13px] leading-5 text-white/72">{slide.answer}</p>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* --------------------------------------------------------- blueprint */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead
          label="Customer microsite blueprint"
          title={blueprint.headline}
          lede="This page is deliverable three. Rather than describing a microsite in the abstract, we built it — so what follows is a specification of what you are already reading, plus the demos we would stage inside it for 14 August."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blueprint.sections.map((item, index) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="text-3xl font-black tabular-nums text-slate-200">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-[16px] font-black tracking-tight text-slate-950">{item.title}</h3>
              <p className="mt-2 text-[13px] leading-6 text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7">
          <div className="flex items-center gap-2">
            <BrainCircuit size={16} style={{ color: RED }} />
            <h3 className="text-lg font-black tracking-tight text-slate-950">
              Customer-specific demos we would stage on 14 August
            </h3>
          </div>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {blueprint.demoIdeas.map((demo) => (
              <li key={demo} className="flex gap-2.5 rounded-xl bg-[#f6f7f9] p-4 text-[13px] leading-5 text-slate-700">
                <Sparkles size={15} className="mt-0.5 shrink-0" style={{ color: BLUE }} />
                {demo}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------------- faq */}
      <section id="faq" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
          <SectionHead
            label="Executive FAQ"
            title="The ten questions we expect, answered in your language"
            lede="Written to be forwarded. Each answer should stand on its own without a Google presenter in the room."
          />
          <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
            {faq.map((item, index) => (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={openFaq === index}
                >
                  <span className="text-[16px] font-black leading-tight tracking-tight text-slate-950">{item.q}</span>
                  <ChevronRight
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform ${openFaq === index ? "rotate-90" : ""}`}
                  />
                </button>
                {openFaq === index ? (
                  <p className="-mt-1 pb-6 text-[15px] leading-7 text-slate-600">{item.a}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- cta */}
      <section id="cta" className="bg-[#070d18] text-white">
        <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/70">
            <Handshake size={13} style={{ color: "#fbbc04" }} />
            The only ask for {site.meetingDate}
          </div>
          <h2 className="mt-7 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Confirm 14 August, and name the person who owns the sixty days.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Not the Q4 decision. Not a platform commitment. One workshop that builds in the room, one owner at roughly
            half-time, and one number agreed before any engineering begins — measured on 31 October and reported to the
            owner family in November.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              [Building2, "One buyer programme", "Chosen before the workshop, with real documents"],
              [ShieldCheck, "One audit cycle", "Cleanest baseline in the group, no adoption dependency"],
              [LineChart, "One number", "Agreed on 14 August, measured on 31 October"],
            ].map(([Icon, title, detail]) => {
              const Component = Icon as typeof Building2;
              return (
                <div key={title as string} className="rounded-2xl border border-white/12 bg-white/[0.04] p-6 text-left">
                  <Component size={18} className="text-[#8ab4f8]" />
                  <p className="mt-3 text-[15px] font-black tracking-tight">{title as string}</p>
                  <p className="mt-1.5 text-[12px] leading-5 text-white/55">{detail as string}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#deck"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
            >
              Review the executive deck <ArrowRight size={15} />
            </a>
            <a
              href="#opportunity"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:border-white/60"
            >
              Explore the opportunity map
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#04070d] py-12 text-white/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-[12px] lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <Landmark size={14} />
            <p>
              {site.customer} ({site.customerKo}) × Google Cloud · {site.title}
            </p>
          </div>
          <p>{site.confidentiality}</p>
          <Link href="/" className="font-semibold text-white/60 transition hover:text-white">
            aitokenomics.app
          </Link>
        </div>
      </footer>
    </main>
  );
}
