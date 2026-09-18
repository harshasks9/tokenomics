"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  Handshake,
  HelpCircle,
  MapPin,
  MinusCircle,
  Route,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import OpportunityExplorer from "@/components/korea/OpportunityExplorer";
import RoiModel from "@/components/korea/RoiModel";
import {
  businessUnderstanding,
  clocks,
  commitments,
  constraint,
  departments,
  faq,
  footprint,
  googleStory,
  gratitude,
  heroStats,
  jointRisks,
  koreanSummary,
  notProposing,
  references,
  site,
  tradeReset,
  whyGoogle,
  type Claim,
} from "@/lib/korea/customer";
import { commercialShape, futureState, roadmap } from "@/lib/korea/opportunities";

const BLUE = "#0047A0";
const RED = "#CD2E3A";

const navItems: [string, string][] = [
  ["#opening", "Opening"],
  ["#change", "What changed"],
  ["#position", "Your position"],
  ["#business", "Your business"],
  ["#departments", "By function"],
  ["#opportunity", "Opportunities"],
  ["#model", "The model"],
  ["#google", "Google Cloud"],
  ["#references", "References"],
  ["#2029", "2029"],
  ["#plan", "The plan"],
  ["#questions", "Questions"],
];

function ClaimTag({ level }: { level: Claim }) {
  const confirmed = level === "confirmed";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${
        confirmed ? "bg-[#e6f4ea] text-[#137333]" : "bg-[#fef7e0] text-[#b06000]"
      }`}
    >
      {confirmed ? "Confirmed" : "To confirm with you"}
    </span>
  );
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
      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: RED }}>
        {label}
      </p>
      <h2
        className={`text-3xl font-black leading-[1.06] tracking-tight sm:text-4xl lg:text-[2.7rem] ${
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
  const [activeDept, setActiveDept] = useState(departments[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const dept = departments.find((item) => item.id === activeDept) ?? departments[0];

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
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Home">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-black text-white"
              style={{ backgroundColor: RED }}
            >
              세
            </span>
            <span className="hidden truncate text-sm font-semibold tracking-tight sm:block">
              Global Sae-A · Google Cloud
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
            href="#plan"
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
            {site.preparedFor} · {site.meetingDate}
          </div>
          <p className="mt-8 text-lg font-bold tracking-tight text-white/50">{site.titleKo}</p>
          <h1 className="mt-1 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-[5rem]">
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
        </div>
      </section>

      {/* ----------------------------------------------------------- opening */}
      <section id="opening" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
          <div>
            <SectionHead label={gratitude.label} title={gratitude.headline} />
            <div className="mt-6 space-y-5">
              {gratitude.body.map((paragraph, index) => (
                <p key={index} className="text-[17px] leading-8 text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e6f4ea] px-3.5 py-1.5 text-xs font-bold text-[#137333]">
                <CheckCircle2 size={13} /> Confirmed — public record or your team
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#fef7e0] px-3.5 py-1.5 text-xs font-bold text-[#b06000]">
                <HelpCircle size={13} /> To confirm — our inference, please correct us
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-7">
            <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: BLUE }}>
              {koreanSummary.label}
            </p>
            <div className="mt-5 space-y-4">
              {koreanSummary.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[15px] leading-7 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-6 border-t border-slate-100 pt-4 text-[11px] leading-5 text-slate-400">
              {koreanSummary.note}
            </p>
          </aside>
        </div>
      </section>

      {/* ------------------------------------------------------------ change */}
      <section id="change" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead label={tradeReset.label} title={tradeReset.headline} lede={tradeReset.body} />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tradeReset.points.map((point) => (
              <motion.article key={point.fact} {...reveal} className="rounded-2xl border border-slate-200 p-6">
                <ClaimTag level={point.claim} />
                <p className="mt-4 text-[15px] font-black leading-6 tracking-tight text-slate-950">{point.fact}</p>
                <p className="mt-2.5 text-[13px] leading-6 text-slate-600">{point.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- position */}
      <section id="position" className="bg-[#070d18] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead label={footprint.label} title={footprint.headline} lede={footprint.body} dark />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {footprint.regimes.map((regime) => (
              <motion.article
                key={regime.name}
                {...reveal}
                className={`rounded-2xl border p-7 ${
                  regime.tone === "advantage"
                    ? "border-[#34a853]/45 bg-[#34a853]/10"
                    : "border-[#f29900]/40 bg-[#f29900]/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe2 size={16} className={regime.tone === "advantage" ? "text-[#81c995]" : "text-[#fdd663]"} />
                  <h3 className="text-lg font-black tracking-tight">{regime.name}</h3>
                  <span className="text-sm font-bold text-white/40">{regime.nameKo}</span>
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
            <p className="text-lg font-semibold leading-8 text-white/85">{footprint.closing}</p>
          </div>

          {/* constraint */}
          <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: "#f28b82" }}>
                {constraint.label}
              </p>
              <h3 className="text-3xl font-black leading-[1.08] tracking-tight">{constraint.headline}</h3>
              <p className="mt-5 text-[16px] leading-8 text-white/70">{constraint.body}</p>
              <div className="mt-6">
                <ClaimTag level={constraint.claim} />
              </div>
            </div>
            <div>
              <ul className="space-y-3">
                {constraint.today.map((item) => (
                  <li key={item} className="flex gap-3 rounded-xl border border-white/12 bg-white/[0.04] p-5">
                    <Timer size={16} className="mt-0.5 shrink-0 text-[#8ab4f8]" />
                    <span className="text-[14px] leading-6 text-white/72">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl bg-white/[0.08] p-5">
                <p className="text-[15px] font-semibold leading-7 text-white/90">{constraint.careful}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ clocks */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead
          label="시계는 이미 돌아가고 있습니다 · The clocks already running"
          title="Four external timetables, none of them set by you"
          lede="We have tried to anchor everything that follows to dated external obligations rather than to internal ambition, because those are the deadlines that do not move when a budget cycle does."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {clocks.map((clock) => (
            <motion.article key={clock.title} {...reveal} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[19px] font-black leading-tight tracking-tight text-slate-950">{clock.title}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-400">{clock.titleKo}</p>
                </div>
                <ClaimTag level={clock.claim} />
              </div>
              <p className="mt-4 flex-1 text-[14px] leading-6 text-slate-600">{clock.detail}</p>
              <p className="mt-4 inline-flex w-fit rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600">
                {clock.horizon}
              </p>
              <div className="mt-4 rounded-xl bg-[#f1f5fd] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: BLUE }}>
                  What it means for Sae-A
                </p>
                <p className="mt-1.5 text-[13px] font-semibold leading-5 text-slate-800">{clock.soWhat}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- business */}
      <section id="business" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead
            label={businessUnderstanding.label}
            title={businessUnderstanding.headline}
            lede={businessUnderstanding.body}
          />
          <div className="mt-10 space-y-4">
            {businessUnderstanding.pillars.map((pillar) => (
              <motion.article
                key={pillar.name}
                {...reveal}
                className="grid gap-6 rounded-2xl border border-slate-200 p-7 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]"
              >
                <div>
                  <span className="inline-block h-1.5 w-14 rounded-full" style={{ backgroundColor: pillar.accent }} />
                  <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-slate-950">{pillar.name}</h3>
                  <p className="mt-1 text-base font-bold text-slate-400">{pillar.nameKo}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{pillar.role}</p>
                  <div className="mt-4">
                    <ClaimTag level={pillar.claim} />
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

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {businessUnderstanding.strengths.map((item) => (
              <div key={item.title} className="rounded-2xl bg-[#f6f7f9] p-6">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-[16px] font-black leading-tight tracking-tight text-slate-950">{item.title}</h4>
                </div>
                <div className="mt-3">
                  <ClaimTag level={item.claim} />
                </div>
                <p className="mt-3 text-[13px] leading-6 text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- departments */}
      <section id="departments" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead
          label="부문별 여정 · What changes, function by function"
          title="The same shift, seen from six different desks"
          lede="Every one of these is about removing assembly work, not judgement. Select a function to see where the time goes today, what we think changes, and how you would know whether it did."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,.34fr)_minmax(0,.66fr)]">
          <div className="space-y-2">
            {departments.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveDept(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                  item.id === dept.id
                    ? "border-slate-900 bg-white shadow-sm"
                    : "border-slate-200 bg-white/60 hover:border-slate-400"
                }`}
              >
                <span className="h-8 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.accent }} />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-black text-slate-900">{item.name}</span>
                  <span className="block truncate text-[11px] text-slate-500">
                    {item.nameKo} · {item.unit}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <article className="rounded-2xl border border-slate-200 bg-white p-7">
            <span className="inline-block h-1.5 w-14 rounded-full" style={{ backgroundColor: dept.accent }} />
            <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-slate-950">
              {dept.name}
              <span className="ml-2 text-lg font-bold text-slate-400">{dept.nameKo}</span>
            </h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">{dept.unit}</p>

            <div className="mt-7 space-y-5">
              <div className="rounded-xl bg-[#f6f7f9] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Today</p>
                <p className="mt-2 text-[15px] leading-7 text-slate-700">{dept.today}</p>
              </div>
              <div className="rounded-xl p-5" style={{ backgroundColor: `${dept.accent}0f` }}>
                <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: dept.accent }}>
                  What we think changes
                </p>
                <p className="mt-2 text-[15px] leading-7 text-slate-800">{dept.tomorrow}</p>
              </div>
              <div className="border-l-4 pl-5" style={{ borderColor: dept.accent }}>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">How you would know</p>
                <p className="mt-1.5 text-[15px] font-bold leading-6 text-slate-900">{dept.measure}</p>
              </div>
              {dept.note ? (
                <p className="rounded-xl bg-[#fef7e0] p-4 text-[13px] leading-6 text-slate-700">
                  <span className="font-black text-[#b06000]">A caveat: </span>
                  {dept.note}
                </p>
              ) : null}
            </div>
          </article>
        </div>
      </section>

      {/* ------------------------------------------------------- opportunity */}
      <section id="opportunity" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead
            label="기회 지도 · The opportunity map"
            title="Nine places we think this creates value, and the order we would take them in"
            lede="Plotted by business value against implementation effort. Select any point for the detail, including what each one depends on — several of them depend on things we have not yet seen."
          />
          <div className="mt-10">
            <OpportunityExplorer />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- not proposing */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead label={notProposing.label} title={notProposing.headline} lede={notProposing.body} />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {notProposing.items.map((item) => (
            <motion.article key={item.title} {...reveal} className="rounded-2xl border-2 border-dashed border-slate-300 p-6">
              <MinusCircle size={18} className="text-slate-400" />
              <h3 className="mt-3 text-[16px] font-black leading-tight tracking-tight text-slate-950">{item.title}</h3>
              <p className="mt-2.5 text-[13px] leading-6 text-slate-600">{item.detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- the model */}
      <section id="model" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead
            label="숫자 · The model"
            title="We would rather show you our assumptions than our conclusions"
            lede="Every input below is a Google placeholder. Change any of them — set adoption to 30% if you think that is realistic — and see whether the case still stands. Replacing these with your own numbers is the first thing we would do on 14 August."
          />
          <div className="mt-10">
            <RoiModel />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- why google */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">
          <div>
            <SectionHead label={whyGoogle.label} title={whyGoogle.headline} />
            <div className="mt-8 space-y-4">
              {whyGoogle.reasons.map((reason) => (
                <div key={reason.title} className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="text-[15px] font-black tracking-tight text-slate-950">{reason.title}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-slate-600">{reason.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-[#070d18] p-7 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: "#f28b82" }}>
                {whyGoogle.honesty.title}
              </p>
              <ul className="mt-4 space-y-3">
                {whyGoogle.honesty.points.map((point) => (
                  <li key={point} className="flex gap-2.5 text-[14px] leading-6 text-white/75">
                    <MinusCircle size={15} className="mt-1 shrink-0 text-white/35" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: BLUE }}>
              {googleStory.dataHandling.title}
            </p>
            <ul className="mt-5 space-y-3">
              {googleStory.dataHandling.points.map((point) => (
                <li key={point} className="flex gap-2.5 text-[14px] leading-6 text-slate-700">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0" style={{ color: BLUE }} />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-7 rounded-xl bg-[#f1f5fd] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: BLUE }}>
                {googleStory.openness.title}
              </p>
              <p className="mt-2 text-[14px] leading-6 text-slate-700">{googleStory.openness.detail}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ google story */}
      <section id="google" className="bg-[#070d18] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead
            label={googleStory.label}
            title={googleStory.headline}
            lede={googleStory.standfirst}
            dark
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 lg:grid-cols-4">
            {googleStory.layers.map((layer) => (
              <motion.article key={layer.n} {...reveal} className="flex flex-col bg-[#0b1424] p-7">
                <span className="text-3xl font-black tabular-nums text-white/20">{layer.n}</span>
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#8ab4f8]">{layer.layer}</p>
                <h3 className="mt-1.5 text-xl font-black leading-tight tracking-tight">{layer.name}</h3>
                <p className="mt-3 flex-1 text-[13px] leading-6 text-white/60">{layer.detail}</p>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">Why it matters to you</p>
                  <p className="mt-1.5 text-[13px] leading-6 text-white/78">{layer.soWhat}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-black tracking-tight">{googleStory.touches.title}</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {googleStory.touches.items.map((item) => (
                <div key={item.phase} className="rounded-2xl border border-white/12 bg-white/[0.04] p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "#f28b82" }}>
                    {item.phase}
                  </p>
                  <p className="mt-2 text-[16px] font-black leading-tight tracking-tight">{item.what}</p>
                  <p className="mt-2.5 text-[13px] leading-6 text-white/65">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- references */}
      <section id="references" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead label={references.label} title={references.headline} lede={references.standfirst} />
        <div className="mt-10 space-y-4">
          {references.items.map((ref) => (
            <motion.article
              key={ref.customer}
              {...reveal}
              className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-7 lg:grid-cols-[minmax(0,.42fr)_minmax(0,.58fr)]"
            >
              <div>
                <span className="inline-block h-1.5 w-14 rounded-full" style={{ backgroundColor: ref.accent }} />
                <h3 className="mt-4 text-2xl font-black leading-tight tracking-tight text-slate-950">{ref.customer}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {ref.geography} · {ref.date}
                </p>
                <p className="mt-5 text-[17px] font-black leading-6" style={{ color: ref.accent }}>
                  {ref.headline}
                </p>
                <p className="mt-4 text-[14px] leading-6 text-slate-600">{ref.detail}</p>
              </div>
              <div>
                <div className="rounded-xl p-5" style={{ backgroundColor: `${ref.accent}0f` }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: ref.accent }}>
                    Reported outcome
                  </p>
                  <p className="mt-1.5 text-[16px] font-black leading-6 text-slate-900">{ref.outcome}</p>
                </div>
                <div className="mt-4 border-l-4 pl-5" style={{ borderColor: ref.accent }}>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Why we chose this one for you
                  </p>
                  <p className="mt-1.5 text-[14px] leading-6 text-slate-700">{ref.answers}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border-l-4 border-slate-400 bg-white p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">On reading these</p>
          <p className="mt-2 text-[15px] leading-7 text-slate-700">{references.caveat}</p>
        </div>
      </section>

      {/* ------------------------------------------------------------- 2029 */}
      <section id="2029" className="bg-[#070d18] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead label="2029년의 글로벌세아 · Where this leads" title={futureState.headline} lede={futureState.standfirst} dark />
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

      {/* -------------------------------------------------------------- plan */}
      <section id="plan" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHead
          label="실행 계획 · The plan"
          title="Six steps, starting with one workshop and one signed page"
          lede="The sequence is deliberate. Knowledge and audit first, because they need no data programme and prove themselves quickly. The foundation work second, funded by what the first phase demonstrates. The harder work only once it is earned."
        />
        <div className="mt-10 space-y-4">
          {roadmap.map((phase, index) => (
            <motion.article
              key={phase.phase}
              {...reveal}
              className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-7 lg:grid-cols-[minmax(0,.32fr)_minmax(0,.68fr)]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-black text-white"
                    style={{ backgroundColor: index <= 1 ? RED : BLUE }}
                  >
                    {index + 1}
                  </span>
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">{phase.phase}</p>
                </div>
                <h3 className="mt-4 text-xl font-black leading-tight tracking-tight text-slate-950">{phase.title}</h3>
                <p className="mt-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Proposed owners</p>
                <p className="mt-1 text-[13px] font-semibold text-slate-700">{phase.owner}</p>
              </div>
              <div>
                <p className="text-[15px] leading-7 text-slate-600">{phase.detail}</p>
                <ul className="mt-4 space-y-2">
                  {phase.outputs.map((output) => (
                    <li key={output} className="flex gap-2.5 text-[13px] font-semibold leading-5 text-slate-800">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: BLUE }} />
                      {output}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {/* commercial shape + joint risks */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: RED }}>
              {commercialShape.label}
            </p>
            <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-950">{commercialShape.headline}</h3>
            <div className="mt-7 space-y-4">
              {commercialShape.principles.map((principle) => (
                <div key={principle.title} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign size={15} style={{ color: BLUE }} />
                    <h4 className="text-[15px] font-black tracking-tight text-slate-950">{principle.title}</h4>
                  </div>
                  <p className="mt-2 text-[13px] leading-6 text-slate-600">{principle.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: RED }}>
              위험 관리 · What could go wrong
            </p>
            <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-950">
              Six ways this could disappoint you, and how we have designed around each
            </h3>
            <div className="mt-7 space-y-4">
              {jointRisks.map((item) => (
                <div key={item.risk} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0" style={{ color: RED }} />
                    <h4 className="text-[15px] font-black leading-tight tracking-tight text-slate-950">{item.risk}</h4>
                  </div>
                  <p className="mt-2.5 text-[13px] leading-6 text-slate-600">{item.design}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- commitments */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHead label={commitments.label} title={commitments.headline} />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="pb-3 pr-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">What</th>
                  <th className="pb-3 pr-4 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">Who</th>
                  <th className="pb-3 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">When</th>
                </tr>
              </thead>
              <tbody>
                {commitments.items.map((item) => (
                  <tr key={item.what} className="border-b border-slate-100 align-top">
                    <td className="py-4 pr-4 text-[14px] font-bold text-slate-900">{item.what}</td>
                    <td className="py-4 pr-4 text-[13px] text-slate-600">{item.who}</td>
                    <td className="py-4 text-[13px] font-bold tabular-nums" style={{ color: BLUE }}>
                      {item.when}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- questions */}
      <section id="questions" className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <SectionHead
          label="예상 질문 · Questions you may have"
          title="Ten questions we expect, answered as directly as we can"
          lede="Written so that each answer stands on its own if this page is forwarded to a colleague who was not in the room."
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
              {openFaq === index ? <p className="-mt-1 pb-6 text-[15px] leading-7 text-slate-600">{item.a}</p> : null}
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- ask */}
      <section className="bg-[#070d18] text-white">
        <div className="mx-auto max-w-5xl px-5 py-24 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-white/70">
              <Handshake size={13} style={{ color: "#fbbc04" }} />
              {commitments.ask.headline}
            </div>
            <h2 className="mt-7 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
              Confirm 14 August, and name the person who owns the sixty days.
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/70">{commitments.ask.body}</p>
          </div>
          <ol className="mx-auto mt-10 max-w-3xl space-y-3">
            {commitments.ask.items.map((item, index) => (
              <li key={item} className="flex gap-4 rounded-2xl border border-white/12 bg-white/[0.04] p-6">
                <span className="text-2xl font-black tabular-nums text-white/25">{index + 1}</span>
                <span className="text-[15px] font-semibold leading-7 text-white/85">{item}</span>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-10 max-w-3xl text-center text-[15px] leading-7 text-white/50">
            Thank you again for the invitation. We would rather earn the second decision than oversell the first.
          </p>
        </div>
      </section>

      <footer className="bg-[#04070d] py-12 text-white/40">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-[12px] lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            {site.customer} ({site.customerKo}) · {site.title} — {site.titleKo}
          </p>
          <p>{site.preparedBy}</p>
          <p>{site.meetingDate}</p>
        </div>
      </footer>
    </main>
  );
}
