"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, ClipboardList, Layers, ShieldCheck,
  Sparkles, TriangleAlert, Users,
} from "lucide-react";
import { PALETTE, fmtMoney, fmtNum } from "../../../data";
import { FlowCinema } from "../../../cinema";
import { analysisFor, profileBySlug } from "../../index";
import { EmailStudio } from "../../EmailStudio";
import {
  bindFlowTemplate, BVB_META, CONFIDENCE_META, MARKET_META, PACKAGES,
  PROFILE_DISCLAIMER, RECURRING_NOTE,
} from "../../shared";

function Section({ kicker, title, alt = false, children }: { kicker: string; title: string; alt?: boolean; children: React.ReactNode }) {
  return (
    <section className={`py-12 md:py-16 ${alt ? "bg-[#F8F9FA]" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: PALETTE.blue }}>{kicker}</div>
        <h2 className="text-xl md:text-3xl font-extrabold tracking-tight mb-6 max-w-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

const dots = (n: number, color: string) => (
  <span className="inline-flex gap-0.5">
    {[1, 2, 3].map((i) => (
      <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i <= n ? color : "#E8EAED" }} />
    ))}
  </span>
);

export default function ProfileClient({ slug }: { slug: string }) {
  const p = profileBySlug(slug)!;
  const an = analysisFor(slug)!;
  const pkg = PACKAGES[p.packageRec];
  const flow = useMemo(() => bindFlowTemplate(p.slug, an.flowTemplate, an.scenario), [p.slug, an]);

  const [volume, setVolume] = useState(an.economics.volumeMonthly);
  const [cost, setCost] = useState(an.economics.costPerInteraction);
  const [automation, setAutomation] = useState(Math.round(an.economics.automationRate * 100));

  const bc = useMemo(() => {
    const currentMonthly = volume * cost;
    const automated = volume * (automation / 100);
    const aiCost = automated * 0.35;
    const retained = volume * (1 - automation / 100) * cost;
    const grossMonthly = currentMonthly - (aiCost + retained);
    const grossAnnual = grossMonthly * 12;
    const payback = grossMonthly > 0 ? pkg.price / grossMonthly : Infinity;
    return { currentMonthly, grossMonthly, grossAnnual, payback, aiCost };
  }, [volume, cost, automation, pkg.price]);

  const emailCtx = useMemo(
    () => ({
      name: p.name, market: p.market, vertical: p.vertical,
      entryWorkflow: p.entryWorkflow, packageRec: p.packageRec,
      gaps: an.existing.gaps,
      signal: an.strategicPressure.find((s) => s.kind !== "hypothesis")?.text,
      grossAnnual: bc.grossAnnual, volumeMonthly: volume, costPerInteraction: cost,
      stakeholders: an.stakeholders, discovery: an.discovery, pilotScope: an.pilotScope,
      languages: p.languages,
    }),
    [p, an, bc.grossAnnual, volume, cost],
  );

  const allChannels = Array.from(new Set(an.workflows.flatMap((w) => w.channels)));
  const allSystems = Array.from(new Set(an.workflows.flatMap((w) => w.systems)));

  return (
    <div className="min-h-screen bg-white text-[#202124]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Hero */}
      <header className="relative overflow-hidden" style={{ background: "radial-gradient(1200px 500px at 70% -20%, #14223D, #0B1220)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: "linear-gradient(#1B263B44 1px, transparent 1px), linear-gradient(90deg, #1B263B44 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 relative">
          <Link href="/voice/accounts" className="inline-flex items-center gap-1.5 text-[11px] text-white/50 hover:text-white mb-6">
            <ArrowLeft size={13} /> Account command centre
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1" style={{ backgroundColor: `${MARKET_META[p.market].color}22`, color: MARKET_META[p.market].color }}>
              {MARKET_META[p.market].label}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 bg-white/10 text-white/70">{p.vertical}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1" style={{ backgroundColor: `${BVB_META[p.buildVsBuy].color}22`, color: BVB_META[p.buildVsBuy].color }}>
              {BVB_META[p.buildVsBuy].label}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 bg-[#8AB4F8]/15 text-[#8AB4F8]">Tier {p.tier} · score {p.priorityScore}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-3xl">{p.name}</h1>
          <p className="text-sm md:text-base text-[#9AA0A6] mt-3 max-w-2xl leading-relaxed">{p.whyRelevant}</p>
          <div className="mt-6 grid sm:grid-cols-3 gap-3 max-w-3xl">
            {[
              ["Entry workflow", p.entryWorkflow],
              ["Recommended package", `${pkg.name} — ${fmtMoney(pkg.price)} implementation`],
              ["Languages", p.languages.join(", ")],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#8AB4F8]">{k}</div>
                <div className="text-[11px] text-white mt-1 leading-snug">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-[#8AB4F8]/25 bg-[#8AB4F8]/5 px-4 py-3 flex gap-2.5 items-start max-w-3xl">
            <TriangleAlert size={13} className="text-[#8AB4F8] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#A8C7FA] leading-relaxed">
              <b>Analyzed profile.</b> This account has a full working analysis but has not been through the same primary-source
              research pass as a deep pitch — strategic signals below are confidence-labeled and economics are seller assumptions.
              Validate with the account team before customer use. {PROFILE_DISCLAIMER}
            </p>
          </div>
        </div>
      </header>

      {/* Operating context + pressure */}
      <Section kicker="What we understand" title={`${p.name}'s operating reality`}>
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5">
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <p className="text-sm text-[#202124] leading-relaxed">{an.operatingContext}</p>
          </div>
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-3">What&apos;s driving urgency</div>
            <div className="space-y-2.5">
              {an.strategicPressure.map((s) => (
                <div key={s.text.slice(0, 40)} className="border-l-2 pl-3" style={{ borderColor: CONFIDENCE_META[s.kind].color }}>
                  <p className="text-[11px] text-[#202124] leading-relaxed">{s.text}</p>
                  <span className="text-[9px] font-semibold rounded-full px-1.5 py-px mt-1 inline-block" style={{ backgroundColor: `${CONFIDENCE_META[s.kind].color}14`, color: CONFIDENCE_META[s.kind].color }}>
                    {CONFIDENCE_META[s.kind].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Build vs buy */}
      <Section kicker="Build vs buy" title="Why we have a right to win here" alt>
        <div className="grid lg:grid-cols-[1fr_1fr_1fr] gap-4">
          <div className="rounded-2xl border-2 p-5" style={{ borderColor: `${BVB_META[p.buildVsBuy].color}44`, backgroundColor: `${BVB_META[p.buildVsBuy].color}08` }}>
            <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 text-white" style={{ backgroundColor: BVB_META[p.buildVsBuy].color }}>
              {BVB_META[p.buildVsBuy].label} target
            </span>
            <p className="text-[11px] text-[#5F6368] mt-3 italic leading-relaxed">{BVB_META[p.buildVsBuy].desc}</p>
            <p className="text-xs text-[#202124] mt-3 leading-relaxed"><b>Evidence:</b> {an.buildVsBuyWhy}</p>
            <p className="text-xs text-[#202124] mt-2.5 leading-relaxed"><b>Why they won&apos;t build it:</b> {an.whyNotBuild}</p>
          </div>
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#188038] mb-2">Already exists — don&apos;t pitch this</div>
            <ul className="space-y-1.5 text-[11px] text-[#5F6368]">
              {an.existing.has.map((h) => <li key={h} className="flex gap-2"><Check size={11} className="text-[#188038] shrink-0 mt-0.5" />{h}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#B26A00] mb-2">Still can&apos;t be completed end-to-end</div>
            <ul className="space-y-1.5 text-[11px] text-[#202124]">
              {an.existing.gaps.map((g) => <li key={g} className="flex gap-2"><span className="text-[#B26A00] shrink-0">→</span>{g}</li>)}
            </ul>
          </div>
        </div>
      </Section>

      {/* Workflows */}
      <Section kicker="Opportunity map" title="Where agentic communications pays off first">
        <div className="grid md:grid-cols-3 gap-4">
          {an.workflows.map((w, i) => (
            <div key={w.name} className="rounded-2xl border border-[#E8EAED] bg-white p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center" style={{ backgroundColor: i === 0 ? PALETTE.blue : `${PALETTE.blue}88` }}>{i + 1}</span>
                {i === 0 && <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: PALETTE.blue }}>Entry workflow</span>}
              </div>
              <h3 className="text-sm font-extrabold leading-snug">{w.name}</h3>
              <p className="text-[11px] text-[#B3261E] mt-2 leading-relaxed"><b>Today:</b> {w.friction}</p>
              <p className="text-[11px] text-[#188038] mt-1.5 leading-relaxed flex-1"><b>Outcome:</b> {w.outcome}</p>
              <div className="mt-3 pt-3 border-t border-[#F1F3F4] space-y-2">
                <div className="flex items-center gap-3 text-[10px] text-[#5F6368]">
                  <span className="inline-flex items-center gap-1">Value {dots(w.value, PALETTE.green)}</span>
                  <span className="inline-flex items-center gap-1">Complexity {dots(w.complexity, PALETTE.amber)}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {w.channels.map((c) => <span key={c} className="text-[9px] border border-[#E8EAED] rounded-full px-1.5 py-0.5 text-[#5F6368]">{c}</span>)}
                </div>
                <div className="flex flex-wrap gap-1">
                  {w.systems.map((s) => <span key={s} className="text-[9px] bg-[#F1F3F4] rounded-full px-1.5 py-0.5 text-[#5F6368]">{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Flow cinema */}
      <Section kicker="Watch the change" title={`${p.entryWorkflow}: today vs the agentic model`} alt>
        <FlowCinema slug={p.slug} accent={PALETTE.blue} flowOverride={flow} />
      </Section>

      {/* Solution */}
      <Section kicker="Recommended solution" title="One integrated stack for this account">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Channels · Tilicho Labs", color: PALETTE.teal, items: allChannels, note: "Telephony, channel infrastructure, conversational execution, session and routing — plus the integration build." },
            { title: "Intelligence · Google Cloud", color: PALETTE.blue, items: ["Gemini reasoning", "Enterprise grounding", "Workflow agents", "Multi-agent orchestration", "Security & governance", "Evaluation & observability"], note: "Runs in the customer's Google Cloud environment." },
            { title: "Systems · Customer-owned", color: PALETTE.muted, items: allSystems, note: "Systems of record, business rules, approvals and escalation stay with the customer." },
          ].map((col) => (
            <div key={col.title} className="rounded-2xl border-t-4 border border-[#E8EAED] bg-white p-5" style={{ borderTopColor: col.color }}>
              <div className="text-sm font-extrabold mb-3" style={{ color: col.color }}>{col.title}</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {col.items.map((i) => <span key={i} className="text-[10px] border border-[#E8EAED] bg-[#F8F9FA] rounded-full px-2 py-1">{i}</span>)}
              </div>
              <p className="text-[10px] text-[#9AA0A6] leading-relaxed">{col.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-[#E8EAED] bg-[#F8F9FA] p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2 flex items-center gap-1.5"><ShieldCheck size={12} /> Risks &amp; controls</div>
          <ul className="grid md:grid-cols-3 gap-2 text-[11px] text-[#5F6368]">
            {an.risks.map((r) => <li key={r} className="flex gap-2"><span className="text-[#B26A00] shrink-0">•</span>{r}</li>)}
          </ul>
        </div>
      </Section>

      {/* Business case */}
      <Section kicker="Business case" title="The economics, with your numbers" alt>
        <div className="rounded-2xl border border-[#E8EAED] bg-white overflow-hidden">
          <div className="grid md:grid-cols-[1fr_1.1fr]">
            <div className="p-5 space-y-4 border-b md:border-b-0 md:border-r border-[#E8EAED]">
              {[
                { label: "Monthly interactions", value: volume, min: 5000, max: 10000000, step: 5000, set: setVolume, fmt: fmtNum },
                { label: "Cost per interaction (USD)", value: cost, min: 0.3, max: 12, step: 0.1, set: setCost, fmt: (n: number) => `$${n.toFixed(2)}` },
                { label: "Automation rate", value: automation, min: 20, max: 85, step: 5, set: setAutomation, fmt: (n: number) => `${n}%` },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-[#5F6368]">{s.label}</span>
                    <span className="text-xs font-bold tabular-nums">{s.fmt(s.value)}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={(e) => s.set(Number(e.target.value))} className="w-full accent-[#1A73E8]" />
                </div>
              ))}
              <p className="text-[10px] text-[#9AA0A6] leading-relaxed">{an.economics.basis}</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Current monthly cost", fmtMoney(bc.currentMonthly), PALETTE.ink],
                  ["Modelled gross benefit / yr", fmtMoney(bc.grossAnnual), PALETTE.green],
                  ["Payback on implementation", bc.payback === Infinity ? "—" : `${bc.payback.toFixed(1)} mo`, PALETTE.ink],
                  ["Modelled run cost / mo", fmtMoney(bc.aiCost), PALETTE.purple],
                ].map(([k, v, c]) => (
                  <div key={k as string}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#5F6368]">{k}</div>
                    <div className="text-xl font-extrabold tabular-nums mt-0.5" style={{ color: c as string }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-[#F8F9FA] border border-[#E8EAED] p-3 text-[10px] text-[#5F6368] leading-relaxed">
                Every figure here is a seller assumption until discovery replaces it with the customer&apos;s measured baseline.
                Implementation is the {pkg.name} package at {fmtMoney(pkg.price)}; {RECURRING_NOTE.toLowerCase()}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Offer emails */}
      <Section kicker="Outreach" title={`Pre-built offer emails for ${p.name}`}>
        <p className="text-sm text-[#5F6368] max-w-3xl mb-6 leading-relaxed">
          Composed from this account&apos;s analysis — the strategic signal, the capability gap, the entry workflow, and the live
          economics above. Pick the moment and the persona, edit anything, then copy or open in your mail client.
        </p>
        <EmailStudio ctx={emailCtx} />
      </Section>

      {/* Pilot + next steps */}
      <Section kicker="The pursuit" title="Pilot, stakeholders, and what to ask" alt>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2 flex items-center gap-1.5"><Layers size={12} /> Pilot scope</div>
              <p className="text-xs text-[#202124] leading-relaxed">{an.pilotScope}</p>
              <div className="mt-3 pt-3 border-t border-[#F1F3F4]">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Expansion roadmap</div>
                <div className="space-y-1.5">
                  {an.expansion.map((e, i) => (
                    <div key={e} className="flex items-center gap-2 text-[11px] text-[#202124]">
                      <span className="w-5 h-5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: i === 0 ? PALETTE.blue : `${PALETTE.blue}66` }}>{i + 1}</span>
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2 flex items-center gap-1.5"><Users size={12} /> Stakeholders to engage</div>
              <div className="flex flex-wrap gap-1.5">
                {an.stakeholders.map((s) => <span key={s} className="text-[10px] border border-[#E8EAED] rounded-full px-2.5 py-1 text-[#5F6368]">{s}</span>)}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2 flex items-center gap-1.5"><ClipboardList size={12} /> Discovery questions</div>
              <ul className="space-y-2 text-[11px] text-[#202124]">
                {an.discovery.map((d) => <li key={d} className="flex gap-2"><span style={{ color: PALETTE.blue }}>?</span>{d}</li>)}
              </ul>
            </div>
            <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: "radial-gradient(700px 300px at 30% 0%, #14223D, #0B1220)" }}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8AB4F8] mb-2 flex items-center gap-1.5"><Sparkles size={12} /> Before you present this</div>
              <p className="text-sm font-extrabold leading-snug">{p.validate}</p>
              <p className="text-[11px] text-white/60 mt-3 leading-relaxed">
                Promote this profile to a deep pitch — a primary-source research pass on earnings material and current capabilities —
                before putting it in front of the customer.
              </p>
              <Link href="/voice/accounts" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white text-[#0B1220] px-5 py-2.5 text-xs font-bold hover:bg-blue-50">
                Back to the universe <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <footer className="border-t border-[#E8EAED] bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 text-[10px] text-[#9AA0A6] leading-relaxed">
          Internal GTM concept material — not for external distribution. Analyzed profile: screened, researched, and modelled from public
          information and seller assumptions; confidence labels apply throughout.
        </div>
      </footer>
    </div>
  );
}
