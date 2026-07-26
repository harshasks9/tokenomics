"use client";

// Account-specific pitch page — hero, research, opportunity map, animated flow,
// recommended solution, editable business case, package fit, personas, next step.

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, ShieldCheck, TriangleAlert, Sparkles, ClipboardList,
} from "lucide-react";
import { PALETTE, fmtMoney, fmtNum } from "../../data";
import { FlowCinema } from "../../cinema";
import { accountBySlug } from "../index";
import {
  bindFlow, BVB_META, CONFIDENCE_META, MARKET_META, PACKAGES, RECURRING_NOTE,
  UNIVERSE_DISCLAIMER, type Account,
} from "../shared";

const SIGNAL_KIND: Record<string, { label: string; color: string }> = {
  fact: { label: "Reported fact", color: "#188038" },
  inference: { label: "Inference", color: "#D97706" },
  hypothesis: { label: "Hypothesis", color: "#7C3AED" },
};

const TIER_COLORS: Record<number, string> = { 1: "#188038", 2: "#D97706", 3: "#5F6368" };

function dots(n: number, color: string) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i <= n ? color : "#E8EAED" }} />
      ))}
    </span>
  );
}

function Section({ id, title, kicker, children, alt = false }: { id?: string; title: string; kicker: string; children: React.ReactNode; alt?: boolean }) {
  return (
    <section id={id} className={`py-12 md:py-16 ${alt ? "bg-[#F8F9FA]" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: PALETTE.blue }}>{kicker}</div>
        <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-[#202124] mb-6 max-w-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function AccountClient({ slug }: { slug: string }) {
  const a = accountBySlug(slug)!;
  const pkg = PACKAGES[a.packageRec];
  const flow = useMemo(() => bindFlow(a), [a]);

  // Editable business case
  const [volume, setVolume] = useState(a.volumeMonthly);
  const [cost, setCost] = useState(a.costPerInteraction);
  const [automation, setAutomation] = useState(55);
  const bc = useMemo(() => {
    const currentMonthly = volume * cost;
    const automated = volume * (automation / 100);
    const aiCost = automated * 0.35;
    const retained = volume * (1 - automation / 100) * cost;
    const newMonthly = aiCost + retained;
    const grossMonthly = currentMonthly - newMonthly;
    const grossAnnual = grossMonthly * 12;
    const recurringAnnual = aiCost * 12;
    const netAnnual = grossAnnual; // gross already nets AI run cost
    const payback = grossMonthly > 0 ? pkg.price / grossMonthly : Infinity;
    const threeYearRoi = pkg.price + recurringAnnual * 3 > 0 ? ((grossAnnual * 3 - pkg.price) / (pkg.price + recurringAnnual * 3)) * 100 : 0;
    return { currentMonthly, automated, newMonthly, grossMonthly, grossAnnual, netAnnual, payback, threeYearRoi, aiCost };
  }, [volume, cost, automation, pkg.price]);

  const allChannels = useMemo(() => Array.from(new Set(a.workflows.flatMap((w) => w.channels))), [a]);
  const allSystems = useMemo(() => Array.from(new Set(a.workflows.flatMap((w) => w.systems))), [a]);

  return (
    <div className="min-h-screen bg-white text-[#202124]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <header className="sticky top-0 z-50 border-b border-[#1B263B] bg-[#0B1220]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-3">
          <Link href="/voice/accounts" className="flex items-center gap-2 text-[12px] font-medium text-white/60 hover:text-white min-w-0">
            <ArrowLeft size={14} className="shrink-0" /> <span className="truncate">APJ Account Command Centre</span>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5" style={{ backgroundColor: `${TIER_COLORS[a.tier]}33`, color: TIER_COLORS[a.tier] }}>Tier {a.tier}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-[#FDD663] text-[#202124] rounded px-2 py-0.5">Internal</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: "radial-gradient(1200px 500px at 70% -20%, #14223D, #0B1220)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: "linear-gradient(#1B263B44 1px, transparent 1px), linear-gradient(90deg, #1B263B44 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-12 relative">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[11px] font-semibold rounded-full px-3 py-1" style={{ backgroundColor: `${MARKET_META[a.market].color}22`, color: "#8AB4F8" }}>{MARKET_META[a.market].label}</span>
            <span className="text-[11px] font-semibold text-[#9AA0A6] border border-[#233047] rounded-full px-3 py-1">{a.vertical}</span>
            <span className="text-[11px] font-bold rounded-full px-3 py-1 bg-[#1A73E8] text-white">{pkg.name} · {fmtMoney(pkg.price)}</span>
          </div>
          <div className="text-sm font-bold text-[#8AB4F8] mb-2">{a.name}</div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.08] max-w-3xl">{a.heroHeadline}</h1>
          <p className="text-base md:text-lg text-[#9AA0A6] mt-5 max-w-2xl leading-relaxed">{a.proposition}</p>
          <div className="mt-6 grid sm:grid-cols-3 gap-3 max-w-3xl">
            {[
              ["Entry use case", a.entryWorkflow],
              ["Expected outcome", a.outcome],
              ["Recommended next step", a.nextStep],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#5F6368]">{t}</div>
                <div className="text-[11px] text-white/90 mt-1 leading-snug">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Understanding */}
      <Section kicker="What we understand" title={`${a.name}'s operating reality`} alt>
        <div className="grid md:grid-cols-2 gap-3">
          {a.understand.map((u) => (
            <div key={u.text.slice(0, 40)} className="rounded-xl border border-[#E8EAED] bg-white p-4 flex flex-col">
              <p className="text-[12px] text-[#202124] leading-relaxed flex-1">{u.text}</p>
              <span className="mt-2.5 self-start text-[9px] font-semibold rounded-full px-2 py-0.5" style={{ backgroundColor: `${CONFIDENCE_META[u.kind].color}14`, color: CONFIDENCE_META[u.kind].color }}>
                {CONFIDENCE_META[u.kind].label}
              </span>
            </div>
          ))}
          {a.gcpNote && (
            <div className="rounded-xl border border-[#1A73E8]/30 bg-[#F8FAFF] p-4">
              <p className="text-[12px] text-[#202124] leading-relaxed">{a.gcpNote}</p>
              <span className="mt-2.5 inline-block text-[9px] font-semibold rounded-full px-2 py-0.5 bg-[#1A73E8]/10 text-[#1A73E8]">Publicly reported Google Cloud relevance</span>
            </div>
          )}
        </div>
        <div className="mt-4 rounded-xl border border-dashed border-[#DADCE0] px-4 py-3 flex gap-2 items-start">
          <TriangleAlert size={13} className="text-[#B26A00] shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#5F6368] leading-relaxed">
            <b>Validate with the account team before outreach:</b> {a.validate.join(" · ")}
          </p>
        </div>
      </Section>

      {/* Build vs buy */}
      <Section kicker="Build vs buy" title="Why we have a right to win here">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4">
          <div className="rounded-2xl border-2 p-5" style={{ borderColor: `${BVB_META[a.buildVsBuy].color}44`, backgroundColor: `${BVB_META[a.buildVsBuy].color}08` }}>
            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1" style={{ backgroundColor: BVB_META[a.buildVsBuy].color, color: "#fff" }}>
              {BVB_META[a.buildVsBuy].label} target
            </span>
            <p className="text-[11px] text-[#5F6368] mt-3 leading-relaxed italic">{BVB_META[a.buildVsBuy].desc}</p>
            <p className="text-xs text-[#202124] mt-3 leading-relaxed"><b>Evidence:</b> {a.buildVsBuyWhy}</p>
            <p className="text-xs text-[#202124] mt-2.5 leading-relaxed"><b>Why they won&apos;t build the full stack:</b> {a.whyNotBuild}</p>
          </div>
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-3">What management is signalling</div>
            <div className="space-y-3">
              {a.earningsSignals.map((s) => (
                <div key={s.signal.slice(0, 40)} className="border-l-2 pl-3" style={{ borderColor: SIGNAL_KIND[s.kind].color }}>
                  <p className="text-[11px] text-[#202124] leading-relaxed">{s.signal}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-semibold rounded-full px-1.5 py-px" style={{ backgroundColor: `${SIGNAL_KIND[s.kind].color}14`, color: SIGNAL_KIND[s.kind].color }}>{SIGNAL_KIND[s.kind].label}</span>
                    <span className="text-[9px] text-[#9AA0A6]">{s.source} · {s.date}</span>
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: PALETTE.blue }}><b>GTM implication:</b> {s.implication}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#188038] mb-2">What already exists (don&apos;t pitch this)</div>
            <ul className="space-y-1.5 text-[11px] text-[#5F6368]">
              {a.existing.has.map((h) => <li key={h} className="flex gap-2"><Check size={11} className="text-[#188038] shrink-0 mt-0.5" />{h}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#B26A00] mb-2">What customers still can&apos;t do end-to-end (pitch this)</div>
            <ul className="space-y-1.5 text-[11px] text-[#202124]">
              {a.existing.gaps.map((g) => <li key={g} className="flex gap-2"><span className="text-[#B26A00] shrink-0">→</span>{g}</li>)}
            </ul>
          </div>
        </div>
      </Section>

      {/* Opportunity map */}
      <Section kicker="Opportunity map" title="Where agentic communications pays off first">
        <div className="overflow-x-auto rounded-2xl border border-[#E8EAED]">
          <table className="w-full text-xs min-w-[760px] bg-white">
            <thead>
              <tr className="bg-[#F8F9FA] text-left text-[10px] uppercase tracking-wider text-[#5F6368]">
                {["Workflow", "Why it matters here", "Value", "Complexity", "Speed", "Channels"].map((h) => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F4]">
              {a.workflows.map((w) => (
                <tr key={w.name} className="align-top hover:bg-[#FAFBFC]">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-[#202124]">{w.name}</div>
                    <div className="text-[10px] text-[#9AA0A6] mt-1">{w.outcome}</div>
                  </td>
                  <td className="px-4 py-3.5 text-[#5F6368] max-w-[280px]">
                    {w.why}
                    <div className="text-[10px] text-[#B26A00] mt-1">Friction today: {w.friction}</div>
                  </td>
                  <td className="px-4 py-3.5">{dots(w.value, PALETTE.blue)}</td>
                  <td className="px-4 py-3.5">{dots(w.complexity, PALETTE.amber)}</td>
                  <td className="px-4 py-3.5">{dots(w.speed, PALETTE.green)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">{w.channels.map((c) => <span key={c} className="text-[9px] border border-[#E8EAED] rounded-full px-1.5 py-0.5 text-[#5F6368]">{c}</span>)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Cinema */}
      <Section kicker="Watch the change" title={`${a.entryWorkflow}: today vs the agentic model`} alt>
        <FlowCinema slug={a.slug} accent={PALETTE.blue} flowOverride={flow} />
      </Section>

      {/* Recommended solution */}
      <Section kicker="Recommended solution" title="One integrated stack, opinionated for this account">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border-t-4 border border-[#E8EAED] p-4" style={{ borderTopColor: PALETTE.teal }}>
            <div className="text-xs font-extrabold mb-2" style={{ color: PALETTE.teal }}>Channels · Tilicho Labs</div>
            <div className="flex flex-wrap gap-1">{allChannels.map((c) => <span key={c} className="text-[10px] bg-[#F8F9FA] border border-[#E8EAED] rounded-full px-2 py-0.5">{c}</span>)}</div>
            <p className="text-[10px] text-[#9AA0A6] mt-2 leading-relaxed">Voice & channel orchestration, telephony, conversational execution, session/state, routing, integration build. Capability coverage validated during implementation.</p>
          </div>
          <div className="rounded-2xl border-t-4 border border-[#E8EAED] p-4" style={{ borderTopColor: PALETTE.blue }}>
            <div className="text-xs font-extrabold mb-2" style={{ color: PALETTE.blue }}>Intelligence · Google Cloud</div>
            <div className="flex flex-wrap gap-1">{["Gemini reasoning", "Enterprise grounding", "Workflow agents", "Multi-agent orchestration", "Governed actions", "Evaluation & analytics"].map((c) => <span key={c} className="text-[10px] bg-[#F8FAFF] border border-[#1A73E8]/20 rounded-full px-2 py-0.5">{c}</span>)}</div>
          </div>
          <div className="rounded-2xl border-t-4 border border-[#E8EAED] p-4 border-t-[#5F6368]">
            <div className="text-xs font-extrabold mb-2 text-[#5F6368]">Systems · {a.name}</div>
            <div className="flex flex-wrap gap-1">{allSystems.map((s) => <span key={s} className="text-[10px] bg-[#F8F9FA] border border-[#E8EAED] rounded-full px-2 py-0.5">{s}</span>)}</div>
            <p className="text-[10px] text-[#9AA0A6] mt-2">API access to these systems is the critical-path dependency.</p>
          </div>
          <div className="rounded-2xl border-t-4 border border-[#E8EAED] p-4" style={{ borderTopColor: PALETTE.amber }}>
            <div className="text-xs font-extrabold mb-2" style={{ color: PALETTE.amber }}>Trust & languages</div>
            <div className="flex flex-wrap gap-1 mb-2">{a.languages.map((l) => <span key={l} className="text-[10px] bg-[#FEF7E0] border border-[#FDE293] rounded-full px-2 py-0.5">{l}</span>)}</div>
            <p className="text-[10px] text-[#9AA0A6] leading-relaxed">Identity-bound sessions, policy-bounded actions, 100% audit logging, human approvals at defined points, in-tenant intelligence.</p>
          </div>
        </div>
      </Section>

      {/* Business case */}
      <Section kicker="Business case" title="The economics, with your numbers" alt>
        <div className="rounded-2xl border border-[#E8EAED] bg-white overflow-hidden">
          <div className="grid md:grid-cols-[1fr_1.2fr]">
            <div className="p-6 space-y-4 border-b md:border-b-0 md:border-r border-[#E8EAED]">
              {[
                { label: "Addressable monthly interactions", value: volume, min: 20000, max: 25000000, step: 20000, set: setVolume, fmt: fmtNum, prov: "Seller assumption — replace in discovery" },
                { label: "Current cost per interaction ($)", value: cost, min: 0.2, max: 10, step: 0.1, set: setCost, fmt: (n: number) => `$${n.toFixed(1)}`, prov: "Industry benchmark scale — validate" },
                { label: "Automation / assistance rate (%)", value: automation, min: 25, max: 80, step: 5, set: setAutomation, fmt: (n: number) => `${n}%`, prov: "Seller assumption — pilot proves this" },
              ].map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-[#5F6368]">{f.label}</span>
                    <span className="text-xs font-bold tabular-nums">{f.fmt(f.value)}</span>
                  </div>
                  <input type="range" min={f.min} max={f.max} step={f.step} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="w-full accent-[#1A73E8]" />
                  <div className="text-[9px] text-[#B26A00] mt-0.5">{f.prov}</div>
                </div>
              ))}
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  ["Current operating cost / mo", fmtMoney(bc.currentMonthly), PALETTE.ink],
                  ["Modelled gross benefit / yr", fmtMoney(bc.grossAnnual), PALETTE.green],
                  ["Payback on " + pkg.name, bc.payback === Infinity ? "—" : `${bc.payback.toFixed(1)} mo`, PALETTE.ink],
                  ["3-yr ROI (modelled)", `${bc.threeYearRoi.toFixed(0)}%`, PALETTE.purple],
                ].map(([t, v, c]) => (
                  <div key={t as string}>
                    <div className="text-xl font-extrabold tabular-nums" style={{ color: c as string }}>{v}</div>
                    <div className="text-[10px] text-[#5F6368] mt-0.5">{t}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-[#F8F9FA] border border-[#E8EAED] p-3.5 text-[10px] text-[#5F6368] space-y-1">
                <div className="flex justify-between"><span>Automated/assisted interactions per month</span><b>{fmtNum(bc.automated)}</b></div>
                <div className="flex justify-between"><span>Modelled AI run-cost per month (usage + cloud, system estimate)</span><b>{fmtMoney(bc.aiCost)}</b></div>
                <div className="flex justify-between"><span>New monthly operating cost</span><b>{fmtMoney(bc.newMonthly)}</b></div>
              </div>
              <p className="text-[9px] text-[#9AA0A6] mt-3 leading-relaxed">
                All figures are modelling estimates from the labeled inputs above — nothing here is customer-provided yet. The pilot's first job is
                replacing these assumptions with {a.name}&apos;s measured baseline. Package price covers implementation only; recurring usage billed separately.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Package */}
      <Section kicker="Recommended package" title={`${pkg.name} — ${fmtMoney(pkg.price)} implementation`}>
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
          <div className="rounded-2xl border-2 border-[#1A73E8] bg-[#F8FAFF] p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <span className="text-sm font-extrabold" style={{ color: PALETTE.blue }}>{pkg.name} · {fmtMoney(pkg.price)} · {pkg.tagline}</span>
              <span className="text-[10px] font-bold text-[#5F6368]">{pkg.timeline}</span>
            </div>
            <p className="text-xs text-[#202124] leading-relaxed mb-4"><b>Why this package for {a.name}:</b> {a.packageWhy}</p>
            <div className="grid sm:grid-cols-2 gap-4 text-[11px]">
              <div>
                <div className="font-bold text-[#202124] mb-1.5">Included</div>
                <ul className="space-y-1 text-[#5F6368]">{pkg.scope.map((s) => <li key={s} className="flex gap-1.5"><Check size={11} className="text-[#188038] shrink-0 mt-0.5" />{s}</li>)}</ul>
              </div>
              <div>
                <div className="font-bold text-[#202124] mb-1.5">Not included</div>
                <ul className="space-y-1 text-[#5F6368]">{pkg.excludes.map((s) => <li key={s} className="flex gap-1.5"><span className="text-[#B3261E] shrink-0">✕</span>{s}</li>)}</ul>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Recurring costs (separate from the package)</div>
              <p className="text-[11px] text-[#5F6368] leading-relaxed">{RECURRING_NOTE}</p>
            </div>
            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Customer resources required</div>
              <ul className="text-[11px] text-[#5F6368] space-y-1">
                <li>· API access + credentials for: {allSystems.slice(0, 3).join(", ")}</li>
                <li>· A named business owner for {a.entryWorkflow.toLowerCase()}</li>
                <li>· Security review counterpart and policy sign-off ({a.workflows[0]?.systems[0] ?? "core system"} scope)</li>
                <li>· Baseline metrics for the pilot's success thresholds</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Personas */}
      <Section kicker="Executive messages" title="What to say to whom" alt>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {a.personas.map((p) => (
            <div key={p.role} className="rounded-2xl border border-[#E8EAED] bg-white p-5">
              <div className="text-xs font-extrabold mb-2" style={{ color: PALETTE.blue }}>{p.role}</div>
              <p className="text-[11px] text-[#5F6368] leading-relaxed italic">“{p.message}”</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tier + next step */}
      <Section kicker="The pursuit" title={`Tier ${a.tier} — ${a.tier === 1 ? "immediate strategic pursuit" : a.tier === 2 ? "high-potential incubation" : "longer-term / partner-led"}`}>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2 flex items-center gap-1.5"><ClipboardList size={12} /> Why this tier</div>
            <p className="text-xs text-[#5F6368] leading-relaxed">{a.tierWhy}</p>
            {a.tier === 1 && (
              <div className="mt-4 pt-4 border-t border-[#F1F3F4]">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">30 / 60 / 90-day plan</div>
                <ul className="text-[11px] text-[#5F6368] space-y-1.5">
                  <li><b className="text-[#202124]">Day 0–30:</b> {a.nextStep}; confirm sponsor and baseline data access; validate: {a.validate[0]}</li>
                  <li><b className="text-[#202124]">Day 31–60:</b> architecture & security review with the platform team; Tilicho Labs scoping on {allChannels.slice(0, 2).join(" + ")}; pilot scope signed</li>
                  <li><b className="text-[#202124]">Day 61–90:</b> {pkg.name} package kickoff; {a.entryWorkflow.toLowerCase()} pilot in build; success thresholds locked with the {a.personas[3]?.role ?? "functional owner"}</li>
                </ul>
              </div>
            )}
          </div>
          <div className="rounded-3xl p-6 md:p-8 text-white relative overflow-hidden" style={{ background: "radial-gradient(700px 300px at 30% 0%, #14223D, #0B1220)" }}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#8AB4F8] mb-2 flex items-center gap-1.5"><Sparkles size={12} /> Recommended next step</div>
            <p className="text-lg font-extrabold leading-snug">{a.nextStep}</p>
            <p className="text-[11px] text-white/60 mt-3 leading-relaxed">
              Entry: {a.entryWorkflow} · {pkg.name} package · {pkg.timeline}. Human fallback throughout; success thresholds agreed before build.
            </p>
            <a
              href={`mailto:harshasks@gmail.com?subject=${encodeURIComponent(`${a.name} — Gemini Enterprise Frontline pursuit`)}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white text-[#0B1220] px-5 py-2.5 text-xs font-bold hover:bg-blue-50"
            >
              Start the pursuit <ArrowRight size={13} />
            </a>
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-dashed border-[#DADCE0] px-4 py-3 flex gap-2 items-start">
          <ShieldCheck size={13} className="text-[#5F6368] shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#9AA0A6] leading-relaxed">{UNIVERSE_DISCLAIMER}</p>
        </div>
      </Section>
    </div>
  );
}
