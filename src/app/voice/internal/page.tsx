"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Compass, Target, GitBranch, ClipboardCheck,
  Handshake, ShieldAlert, RotateCcw, Gauge, MessageSquareWarning, FlaskConical,
} from "lucide-react";
import {
  VERTICALS, SOLUTION_PACKS, MARKET_STATS, GECX_MAP, GECX_TREE,
  QUALIFIER_CRITERIA, SALES_STAGES, OBJECTIONS, PARTNER_MODEL, PILOT_PHASES,
  PALETTE, type GecxOwner,
} from "../data";
import { Section, Kicker, H2, Lead, FadeIn, StatCard, Pill } from "../components";

const OWNER_COLORS: Record<GecxOwner, string> = {
  "GECX-led": "#D97706",
  "Gemini Enterprise-led": "#1A73E8",
  Joint: "#7C3AED",
  "Partner-led": "#00838F",
  "Customer-owned": "#5F6368",
};

// ─── Account qualifier ──────────────────────────────────────────────────────

function AccountQualifier() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const maxScore = QUALIFIER_CRITERIA.reduce((s, c) => s + c.weight * 3, 0);
  const score = QUALIFIER_CRITERIA.reduce((s, c) => s + (answers[c.id] ?? 0) * c.weight, 0);
  const pct = Math.round((score / maxScore) * 100);
  const answered = Object.keys(answers).length === QUALIFIER_CRITERIA.length;

  const verdict = !answered
    ? { label: "Answer all criteria to score the account", color: "#9AA0A6", detail: "" }
    : pct >= 70
      ? { label: "Priority pursuit", color: PALETTE.green, detail: "Strong fit. Move to executive hypothesis this week; engage a specialist and shortlist partners now." }
      : pct >= 45
        ? { label: "Qualified — develop", color: PALETTE.amber, detail: "Real potential with gaps. Run discovery to firm up sponsorship, baselines, or integration readiness before committing pilot resources." }
        : { label: "Nurture — do not pursue yet", color: PALETTE.red, detail: "Missing fundamentals. Share the customer microsite, revisit next quarter, and do not spend specialist or partner cycles." };

  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white overflow-hidden">
      <div className="grid lg:grid-cols-[1.3fr_1fr]">
        <div className="p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-[#E8EAED]">
          {QUALIFIER_CRITERIA.map((c) => (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#202124]">{c.label}</span>
                <span className="text-[10px] text-[#9AA0A6] font-medium">weight {c.weight}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.options.map((o) => (
                  <button
                    key={o.l}
                    onClick={() => setAnswers({ ...answers, [c.id]: o.v })}
                    className={`text-[11px] font-medium rounded-full px-3 py-1.5 border transition-colors ${
                      answers[c.id] === o.v ? "text-white border-transparent" : "border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA]"
                    }`}
                    style={answers[c.id] === o.v ? { backgroundColor: PALETTE.blue } : {}}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 flex flex-col">
          <div className="text-xs font-bold tracking-widest uppercase text-[#5F6368] mb-4">Opportunity score</div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-extrabold tabular-nums" style={{ color: verdict.color }}>{answered ? pct : "—"}</span>
            <span className="text-sm text-[#9AA0A6] mb-2">/ 100</span>
          </div>
          <div className="h-2 rounded-full bg-[#F1F3F4] mt-3 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${answered ? pct : 0}%`, backgroundColor: verdict.color }} />
          </div>
          <div className="mt-5">
            <div className="text-sm font-extrabold" style={{ color: verdict.color }}>{verdict.label}</div>
            <p className="text-xs text-[#5F6368] mt-2 leading-relaxed">{verdict.detail}</p>
          </div>
          {answered && pct >= 45 && (
            <div className="mt-5 pt-5 border-t border-[#F1F3F4] text-xs text-[#5F6368] space-y-2">
              <p><span className="font-bold text-[#202124]">Recommended entry:</span> {(answers.residency ?? 0) >= 2 ? "regulated-industry play — lead with in-tenant deployment and governance" : (answers.volume ?? 0) >= 2 ? "cost-led play — conversation-intelligence audit, then top-intent containment" : "outcome-led play — one lighthouse use case with direct revenue attribution"}</p>
              <p><span className="font-bold text-[#202124]">Pilot scope:</span> one use case, {(answers.integration ?? 0) >= 3 ? "8–10" : "10–12"} weeks, partner-delivered channels.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── GECX decision tree ─────────────────────────────────────────────────────

function GecxTree() {
  const [nodeId, setNodeId] = useState("start");
  const [path, setPath] = useState<string[]>([]);
  const node = GECX_TREE.find((n) => n.id === nodeId)!;

  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white p-6">
      {path.length > 0 && (
        <button
          onClick={() => { setNodeId("start"); setPath([]); }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6368] mb-4 hover:text-[#202124]"
        >
          <RotateCcw size={12} /> Start over
        </button>
      )}
      {path.map((p) => (
        <div key={p} className="text-xs text-[#9AA0A6] mb-1.5">→ {p}</div>
      ))}
      {node.question ? (
        <div>
          <div className="text-base font-extrabold text-[#202124] mb-4">{node.question}</div>
          <div className="space-y-2">
            {node.options!.map((o) => (
              <button
                key={o.label}
                onClick={() => { setPath([...path, o.label]); setNodeId(o.next); }}
                className="w-full text-left text-sm border border-[#E8EAED] rounded-xl px-4 py-3.5 hover:border-[#1A73E8] hover:bg-[#F8FAFF] transition-colors flex items-center justify-between gap-3"
              >
                {o.label} <ArrowRight size={14} className="shrink-0 text-[#DADCE0]" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-5" style={{ backgroundColor: `${node.result!.color}0D`, border: `2px solid ${node.result!.color}44` }}>
          <div className="text-lg font-extrabold" style={{ color: node.result!.color }}>{node.result!.verdict}</div>
          <p className="text-sm text-[#202124] mt-2 leading-relaxed">{node.result!.detail}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

const NAV = [
  { id: "builder", label: "Solution Builder" },
  { id: "accounts", label: "APJ Accounts" },
  { id: "thesis", label: "Thesis" },
  { id: "sizing", label: "Sizing" },
  { id: "qualifier", label: "Qualifier" },
  { id: "gecx", label: "GECX" },
  { id: "motion", label: "Sales motion" },
  { id: "packs", label: "Packages" },
  { id: "partners", label: "Partners" },
  { id: "pilot", label: "Pilot factory" },
  { id: "objections", label: "Objections" },
];

export default function InternalGtm() {
  const [activeVertical, setActiveVertical] = useState(0);
  const v = VERTICALS[activeVertical];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <header className="sticky top-0 z-50 bg-[#202124] text-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/voice" className="text-white/60 hover:text-white shrink-0"><ArrowLeft size={16} /></Link>
            <span className="text-sm font-bold truncate">GTM Command Centre</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FDD663] text-[#202124] rounded px-2 py-0.5 shrink-0">Internal</span>
          </div>
          <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-white/70">
            {NAV.map((n) =>
              n.id === "builder" ? (
                <Link key={n.id} href="/voice/internal/builder" className="text-[#FDD663] font-bold hover:text-white">{n.label}</Link>
              ) : n.id === "accounts" ? (
                <Link key={n.id} href="/voice/accounts" className="text-[#8AB4F8] font-bold hover:text-white">{n.label}</Link>
              ) : (
                <a key={n.id} href={`#${n.id}`} className="hover:text-white">{n.label}</a>
              ),
            )}
          </nav>
        </div>
      </header>

      <div className="bg-[#202124] text-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-14">
          <FadeIn>
            <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8AB4F8] mb-3">Gemini Enterprise Frontline · seller home</div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight max-w-3xl leading-tight">
              The agentic communications layer for the enterprise — one platform behind every inbound and outbound interaction
            </h1>
            <p className="text-white/70 mt-4 max-w-2xl text-sm md:text-base leading-relaxed">
              Not a contact-centre suite. Not a voice bot. The cross-enterprise intelligence and action layer for communications embedded in
              business workflows — collections, service, sales, employee and student support — delivered with partners, governed on Gemini Enterprise Agent Platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/voice/internal/builder" className="inline-flex items-center gap-2 rounded-full bg-[#FDD663] text-[#202124] px-5 py-2.5 text-sm font-bold hover:bg-[#FCE293] transition-colors">
                Open the Solution Builder — configure, price, and propose <ArrowRight size={14} />
              </Link>
              <Link href="/voice/accounts" className="inline-flex items-center gap-2 rounded-full border border-[#8AB4F8]/50 text-[#8AB4F8] px-5 py-2.5 text-sm font-bold hover:bg-white/5 transition-colors">
                APJ Top-100 account pitches <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-8 grid sm:grid-cols-3 gap-3 max-w-3xl">
              {[
                ["Lead when", "communications are embedded in enterprise workflows spanning functions and systems of record"],
                ["Involve GECX when", "the centre of gravity is contact-centre modernization — queues, desktops, WFM, service ops"],
                ["Tilicho Labs always for", "the communications platform — telephony, channels, conversational execution, session/routing — and implementation"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-xl bg-white/10 p-4">
                  <div className="text-xs font-bold text-[#8AB4F8] uppercase tracking-wider">{t}</div>
                  <div className="text-xs text-white/85 mt-1.5 leading-relaxed">{d}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Thesis */}
      <Section id="thesis">
        <FadeIn>
          <Kicker><Compass size={12} className="inline mr-1.5 -mt-0.5" />Strategic thesis</Kicker>
          <H2>Why this play, why now</H2>
        </FadeIn>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {[
            ["Category: Agentic Communications Layer", "We are not selling a bot or a CC suite — we are creating the layer through which enterprises design, govern, deploy, and improve agentic interactions across every channel. Broader than conversational AI vendors, orthogonal to CCaaS, native to the Gemini Enterprise narrative."],
            ["The implementation gap is the moat", "Models are table stakes. Telephony, channel integration, compliance, state, language handling, observability, and workflow integration are the hard 80% — Google provides the platform, partners industrialize the gap into repeatable vertical IP."],
            ["Regulated + multilingual is our wedge", "In-tenant deployment (data, models, state, telemetry inside the customer's cloud) plus Indic/regional language quality is a combination point-solution vendors can't match and hyperscaler rivals haven't packaged."],
            ["Consumption compounds", "Every contained interaction is model + speech + search + data consumption. One lighthouse use case ramps into an enterprise-wide agent platform commitment — track expansion, not just the first deal."],
          ].map(([t, d]) => (
            <FadeIn key={t}>
              <div className="rounded-2xl border border-[#E8EAED] bg-white p-6 h-full">
                <div className="text-sm font-extrabold text-[#202124]">{t}</div>
                <p className="text-xs text-[#5F6368] mt-2 leading-relaxed">{d}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Sizing */}
      <Section id="sizing" className="!bg-white">
        <FadeIn>
          <Kicker><Gauge size={12} className="inline mr-1.5 -mt-0.5" />Opportunity sizing</Kicker>
          <H2>The verified numbers behind the pitch</H2>
          <Lead>Every figure below is sourced and confidence-tagged. Use them verbatim; do not improvise market sizes in front of customers.</Lead>
        </FadeIn>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKET_STATS.map((s) => (
            <FadeIn key={s.label}><StatCard value={s.value} label={s.label} source={`${s.source} · ${s.confidence}`} /></FadeIn>
          ))}
        </div>
      </Section>

      {/* Qualifier */}
      <Section id="qualifier">
        <FadeIn>
          <Kicker><Target size={12} className="inline mr-1.5 -mt-0.5" />Account qualifier</Kicker>
          <H2>Score the account before you spend cycles on it</H2>
          <Lead>Eight weighted criteria. 70+ is a priority pursuit; under 45 goes back to nurture. Be honest — the pilot factory only has so many slots.</Lead>
        </FadeIn>
        <div className="mt-8"><AccountQualifier /></div>
      </Section>

      {/* GECX */}
      <Section id="gecx" className="!bg-white">
        <FadeIn>
          <Kicker><GitBranch size={12} className="inline mr-1.5 -mt-0.5" />GECX boundary</Kicker>
          <H2>When to lead with what</H2>
          <Lead>
            Customer Engagement Suite (GECX) owns contact-centre modernization. We own the cross-enterprise agent layer. The tree and the capability
            map below are the rules of engagement — deviating from them creates channel conflict that kills both deals.
          </Lead>
        </FadeIn>
        <div className="mt-8 grid lg:grid-cols-2 gap-6 items-start">
          <div>
            <div className="text-sm font-bold mb-3">Decision tree</div>
            <GecxTree />
            <div className="mt-4 rounded-xl border border-[#E8EAED] bg-[#F8F9FA] p-4 text-xs text-[#5F6368] leading-relaxed">
              <span className="font-bold text-[#202124]">Non-negotiables:</span> never position Gemini Enterprise as a CC-stack replacement · never rebuild productized CC functions ·
              escalations always land in the customer&apos;s existing CC platform · joint accounts get one plan with named swimlane owners.
            </div>
          </div>
          <div>
            <div className="text-sm font-bold mb-3">Capability swimlanes</div>
            <div className="rounded-2xl border border-[#E8EAED] bg-white overflow-hidden">
              <div className="max-h-[480px] overflow-y-auto divide-y divide-[#F1F3F4]">
                {GECX_MAP.map((c) => (
                  <div key={c.capability} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#202124]">{c.capability}</div>
                      <div className="text-[11px] text-[#9AA0A6] truncate">{c.note}</div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 shrink-0" style={{ backgroundColor: `${OWNER_COLORS[c.owner]}14`, color: OWNER_COLORS[c.owner] }}>
                      {c.owner}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Sales motion */}
      <Section id="motion">
        <FadeIn>
          <Kicker><ClipboardCheck size={12} className="inline mr-1.5 -mt-0.5" />Sales motion</Kicker>
          <H2>Eleven stages, each with a gate</H2>
          <Lead>No stage skipping: the pilot only performs when discovery baselined real metrics and the customer signed off one use case.</Lead>
        </FadeIn>
        <div className="mt-8 space-y-2">
          {SALES_STAGES.map((s, i) => (
            <FadeIn key={s.stage} delay={i * 0.02}>
              <div className="rounded-xl border border-[#E8EAED] bg-white px-5 py-3.5 grid md:grid-cols-[180px_1fr_240px] gap-2 md:gap-4 md:items-center">
                <div className="text-sm font-extrabold" style={{ color: PALETTE.blue }}>{s.stage}</div>
                <div className="text-xs text-[#5F6368] leading-relaxed">{s.activity}</div>
                <div className="text-[11px] font-semibold text-[#202124] md:text-right"><span className="text-[#9AA0A6] font-medium">Gate:</span> {s.gate}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Solution packages + vertical picker */}
      <Section id="packs" className="!bg-white">
        <FadeIn>
          <Kicker>Solution packages & industry plays</Kicker>
          <H2>What you can actually sell today</H2>
        </FadeIn>
        <div className="mt-6 flex flex-wrap gap-2">
          {VERTICALS.map((vert, i) => (
            <button
              key={vert.slug}
              onClick={() => setActiveVertical(i)}
              className={`text-xs font-semibold rounded-full px-4 py-2 border transition-colors ${activeVertical === i ? "text-white border-transparent" : "border-[#DADCE0] text-[#5F6368] hover:bg-[#F8F9FA]"}`}
              style={activeVertical === i ? { backgroundColor: vert.color } : {}}
            >
              {vert.name}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-[#E8EAED] bg-[#F8F9FA] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-base font-extrabold" style={{ color: v.color }}>{v.name}</div>
              <div className="text-xs text-[#5F6368] mt-0.5">{v.heroHeadline}</div>
            </div>
            <Link href={`/voice/${v.slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-4 py-2 text-white" style={{ backgroundColor: v.color }}>
              Open customer microsite <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-white border border-[#E8EAED] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#9AA0A6] mb-2">Lighthouse / fastest / consumption</div>
              <ul className="space-y-1.5 text-xs text-[#202124]">
                {v.useCases.filter((u) => u.tag).map((u) => (
                  <li key={u.name}><span className="font-bold" style={{ color: v.color }}>{u.tag}:</span> {u.name}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white border border-[#E8EAED] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#9AA0A6] mb-2">Discovery questions that open doors</div>
              <ul className="space-y-1.5 text-xs text-[#5F6368]">
                {v.discoveryQuestions.map((q) => <li key={q}>· {q}</li>)}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#E8EAED]">
          <table className="w-full text-xs min-w-[860px] bg-white">
            <thead>
              <tr className="bg-[#F8F9FA] text-left text-[10px] uppercase tracking-wider text-[#5F6368]">
                {["Package", "Buyer", "Trigger", "Handoff model", "Timeline", "Commercial"].map((h) => <th key={h} className="px-4 py-3 font-bold">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F4]">
              {SOLUTION_PACKS.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-bold text-[#202124]">{p.name}</td>
                  <td className="px-4 py-3 text-[#5F6368]">{p.buyer}</td>
                  <td className="px-4 py-3 text-[#5F6368]">{p.trigger}</td>
                  <td className="px-4 py-3 text-[#5F6368]">{p.handoff}</td>
                  <td className="px-4 py-3 text-[#5F6368]">{p.timeline}</td>
                  <td className="px-4 py-3 text-[#5F6368]">{p.commercial}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Partners */}
      <Section id="partners">
        <FadeIn>
          <Kicker><Handshake size={12} className="inline mr-1.5 -mt-0.5" />Delivery model — Tilicho Labs</Kicker>
          <H2>Who owns what</H2>
          <Lead>
            Tilicho Labs is the communications and implementation layer: we leverage its existing platform and IP (one-time integration fee +
            usage-based consumption) instead of funding redevelopment of capabilities it already has. Gemini Enterprise Agent Platform provides
            intelligence, agents, and governance. Validate exact Tilicho capability coverage during implementation — never present unconfirmed
            capabilities as production-ready.
          </Lead>
        </FadeIn>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { title: "Google Cloud owns", items: PARTNER_MODEL.google, color: PALETTE.blue },
            { title: "Tilicho Labs owns", items: PARTNER_MODEL.partner, color: PALETTE.teal },
            { title: "Customer owns", items: PARTNER_MODEL.customer, color: PALETTE.muted },
          ].map((col) => (
            <FadeIn key={col.title}>
              <div className="rounded-2xl border-t-4 border border-[#E8EAED] bg-white p-5 h-full" style={{ borderTopColor: col.color }}>
                <div className="text-sm font-extrabold mb-3" style={{ color: col.color }}>{col.title}</div>
                <ul className="space-y-2 text-xs text-[#5F6368]">
                  {col.items.map((i) => <li key={i} className="flex gap-2"><span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: col.color }} />{i}</li>)}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Pilot factory */}
      <Section id="pilot" className="!bg-white">
        <FadeIn>
          <Kicker><FlaskConical size={12} className="inline mr-1.5 -mt-0.5" />Pilot factory</Kicker>
          <H2>The repeatable 8–12 week pilot</H2>
          <Lead>
            One narrowly-defined use case, baseline metrics before build, production-like traffic before verdict. Central pilot funding
            (e.g., ~$250K for a strategic partner build-out) is decided per-vertical on evidence from the first two customer pilots — it is not assumed.
          </Lead>
        </FadeIn>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILOT_PHASES.map((p, i) => (
            <FadeIn key={p.phase} delay={i * 0.05}>
              <div className="rounded-2xl border border-[#E8EAED] bg-[#F8F9FA] p-5 h-full">
                <div className="text-xs font-extrabold mb-3" style={{ color: PALETTE.blue }}>{p.phase}</div>
                <ul className="space-y-2 text-xs text-[#5F6368]">
                  {p.items.map((it) => <li key={it} className="flex gap-2"><span className="w-1 h-1 rounded-full bg-[#1A73E8] mt-1.5 shrink-0" />{it}</li>)}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Objections */}
      <Section id="objections">
        <FadeIn>
          <Kicker><MessageSquareWarning size={12} className="inline mr-1.5 -mt-0.5" />Objection handling</Kicker>
          <H2>You will hear these. Say this.</H2>
        </FadeIn>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          {OBJECTIONS.map((o) => (
            <FadeIn key={o.q}>
              <div className="rounded-2xl border border-[#E8EAED] bg-white p-5 h-full">
                <div className="text-sm font-extrabold text-[#202124]">{o.q}</div>
                <p className="text-xs text-[#5F6368] mt-2.5 leading-relaxed">{o.a}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border-2 border-dashed border-[#DADCE0] p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm font-bold flex items-center gap-2"><ShieldAlert size={15} style={{ color: PALETTE.amber }} /> Content rules for anything customer-facing</div>
            <p className="text-xs text-[#5F6368] mt-1.5 max-w-2xl leading-relaxed">
              No unsupported savings claims · no fabricated references · no unverified competitive or partner claims · no GECX conflict ·
              no internal metrics (seat activation, consumption targets) in customer material · every number carries its source and confidence.
            </p>
          </div>
          <Link href="/voice" className="inline-flex items-center gap-2 rounded-full bg-[#1A73E8] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#174EA6] shrink-0">
            Open customer site <ArrowRight size={13} />
          </Link>
        </div>
      </Section>

      <footer className="border-t border-[#E8EAED] bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 text-xs text-[#9AA0A6]">
          Internal GTM concept material — not for external distribution. Strategy detail and sources: see the repo README for this microsite.
        </div>
      </footer>
    </div>
  );
}
