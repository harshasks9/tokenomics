"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Presentation, X, MessageCircleQuestion,
  Star, Zap, TrendingUp, Award, Handshake, ShieldCheck, ChevronRight,
} from "lucide-react";
import { VERTICALS, PALETTE, type Vertical } from "../data";
import {
  Section, Kicker, H2, Lead, FadeIn, StatCard, Pill, Faq,
  ArchitectureExplorer, RoiCalculator, BeforeAfter, VoiceFooter, LifecycleStrip,
} from "../components";
import { FlowSection, OperatingModelCompare } from "../flow";

const TAG_META: Record<string, { label: string; Icon: typeof Star }> = {
  lighthouse: { label: "Lighthouse", Icon: Star },
  fastest: { label: "Fastest to production", Icon: Zap },
  consumption: { label: "Highest volume", Icon: TrendingUp },
  executive: { label: "Executive value", Icon: Award },
  partner: { label: "Partner-led", Icon: Handshake },
};

function dots(n: number, color: string) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i <= n ? color : "#E8EAED" }} />
      ))}
    </span>
  );
}

// ─── Presentation mode ──────────────────────────────────────────────────────

type Slide = { title: string; body: React.ReactNode; notes: string[]; core: boolean };

function buildSlides(v: Vertical, customer: string): Slide[] {
  const who = customer || `a ${v.name} leader`;
  return [
    {
      title: v.heroHeadline,
      core: true,
      body: (
        <div>
          <p className="text-lg md:text-2xl text-white/85 leading-relaxed max-w-3xl">{v.heroSub}</p>
          {customer && <p className="mt-6 text-sm text-white/60">Prepared for {customer}</p>}
        </div>
      ),
      notes: [`Frame the meeting: this is about ${who}'s communications economics, not AI tooling.`, ...v.speakerNotes.slice(0, 1)],
    },
    {
      title: "Why this matters now",
      core: true,
      body: (
        <ul className="space-y-4 max-w-3xl">
          {v.whyNow.map((w) => (
            <li key={w} className="flex gap-3 text-base md:text-lg text-white/90">
              <ChevronRight className="shrink-0 mt-1" size={18} style={{ color: "#8AB4F8" }} /> {w}
            </li>
          ))}
        </ul>
      ),
      notes: ["Pause after each point and ask which resonates most — that picks the use case.", ...v.discoveryQuestions.slice(0, 2).map((q) => `Ask: ${q}`)],
    },
    {
      title: "The evidence",
      core: false,
      body: (
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl">
          {v.stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/10 p-5">
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
              <div className="text-sm text-white/80 mt-2">{s.label}</div>
              <div className="text-[11px] text-white/50 mt-3">{s.source}</div>
            </div>
          ))}
        </div>
      ),
      notes: ["Cite sources exactly as shown — never inflate.", "If challenged, offer to baseline their own numbers in discovery."],
    },
    {
      title: "Where the value is",
      core: true,
      body: (
        <div className="grid md:grid-cols-2 gap-3 max-w-4xl">
          {v.useCases.slice(0, 6).map((u) => (
            <div key={u.name} className="rounded-xl bg-white/10 px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-sm text-white/90">{u.name}</span>
              {u.tag && <span className="text-[10px] font-bold uppercase tracking-wider text-white/60 shrink-0">{TAG_META[u.tag].label}</span>}
            </div>
          ))}
        </div>
      ),
      notes: ["Recommend starting with the lighthouse use case; let them argue for another — that's engagement.", `Ask: ${v.discoveryQuestions[2] ?? v.discoveryQuestions[0]}`],
    },
    {
      title: v.journey.title,
      core: true,
      body: (
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Today</div>
            <ul className="space-y-2.5">{v.journey.before.map((b, i) => <li key={i} className="text-sm text-white/70 flex gap-2"><span className="text-white/40">{i + 1}.</span>{b}</li>)}</ul>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#8AB4F8" }}>With the agentic layer</div>
            <ul className="space-y-2.5">{v.journey.after.map((a, i) => <li key={i} className="text-sm text-white/95 flex gap-2"><span style={{ color: "#8AB4F8" }}>{i + 1}.</span>{a}</li>)}</ul>
          </div>
        </div>
      ),
      notes: ["Walk the 'today' column slowly — recognition sells.", "The 'after' column: emphasize actions and logging, not chat."],
    },
    {
      title: "Governed by design",
      core: false,
      body: (
        <ul className="space-y-3 max-w-3xl">
          {v.compliance.map((c) => (
            <li key={c} className="flex gap-3 text-base text-white/90"><ShieldCheck size={18} className="shrink-0 mt-0.5" style={{ color: "#FDD663" }} /> {c}</li>
          ))}
        </ul>
      ),
      notes: ["For risk/compliance personas, make this the longest stop.", "Contrast with today's 1–2% QA sampling."],
    },
    {
      title: "A pilot you can say yes to",
      core: true,
      body: (
        <div className="max-w-3xl space-y-5">
          <p className="text-lg text-white/90">{v.pilot.scope}</p>
          <div className="flex flex-wrap gap-2">
            {v.pilot.integrations.map((i) => <span key={i} className="text-xs bg-white/10 rounded-full px-3 py-1.5 text-white/80">{i}</span>)}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Success is measured as</div>
            <ul className="space-y-1.5">{v.pilot.success.map((s) => <li key={s} className="text-sm text-white/85">· {s}</li>)}</ul>
          </div>
          <p className="text-sm text-white/60">{v.pilot.weeks} weeks · human fallback throughout · production decision criteria agreed up front</p>
        </div>
      ),
      notes: ["Close on a workshop date, not on the pilot itself.", "Name the customer deliverable: baseline metrics + one signed-off use case."],
    },
  ];
}

function PresentationMode({ v, customer, duration, onExit }: { v: Vertical; customer: string; duration: 15 | 30 | 60; onExit: () => void }) {
  const all = useMemo(() => buildSlides(v, customer), [v, customer]);
  const slides = duration === 15 ? all.filter((s) => s.core) : all;
  const [i, setI] = useState(0);
  const [showNotes, setShowNotes] = useState(duration >= 30);
  const s = slides[Math.min(i, slides.length - 1)];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: `linear-gradient(135deg, #17224D, ${PALETTE.blueDeep})` }}>
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-xs font-semibold text-white/60">{v.name} · {duration}-minute conversation · {i + 1}/{slides.length}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNotes(!showNotes)} className="text-xs font-semibold text-white/70 hover:text-white border border-white/20 rounded-full px-3 py-1.5">
            {showNotes ? "Hide" : "Show"} speaker notes
          </button>
          <button onClick={onExit} className="text-white/70 hover:text-white p-1.5"><X size={18} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-8 md:px-16 py-6">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-8 max-w-4xl">{s.title}</h2>
        {s.body}
      </div>
      {showNotes && (
        <div className="mx-6 mb-3 rounded-xl bg-black/25 px-5 py-3.5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1.5 flex items-center gap-1.5">
            <MessageCircleQuestion size={12} /> Speaker notes — not for screen share
          </div>
          <ul className="space-y-1">{s.notes.map((n) => <li key={n} className="text-xs text-white/80">· {n}</li>)}</ul>
        </div>
      )}
      <div className="flex items-center justify-between px-6 pb-5">
        <button
          onClick={() => setI(Math.max(0, i - 1))}
          disabled={i === 0}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 disabled:opacity-30 border border-white/25 rounded-full px-5 py-2.5 hover:bg-white/10"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, d) => (
            <button key={d} onClick={() => setI(d)} className="w-2 h-2 rounded-full" style={{ backgroundColor: d === i ? "#fff" : "#ffffff40" }} />
          ))}
        </div>
        {i < slides.length - 1 ? (
          <button onClick={() => setI(i + 1)} className="inline-flex items-center gap-2 text-sm font-bold text-[#17224D] bg-white rounded-full px-5 py-2.5 hover:bg-blue-50">
            Next <ArrowRight size={15} />
          </button>
        ) : (
          <button onClick={onExit} className="inline-flex items-center gap-2 text-sm font-bold text-[#17224D] bg-white rounded-full px-5 py-2.5 hover:bg-blue-50">
            End &amp; book workshop
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function VerticalClient({ slug }: { slug: string }) {
  const v = VERTICALS.find((x) => x.slug === slug)!;
  const [customer, setCustomer] = useState("");
  const [presenting, setPresenting] = useState<15 | 30 | 60 | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#202124]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {presenting && <PresentationMode v={v} customer={customer} duration={presenting} onExit={() => setPresenting(null)} />}

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#E8EAED]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-3">
          <Link href="/voice" className="flex items-center gap-2 text-[13px] font-medium text-[#5F6368] hover:text-[#202124]">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Gemini Enterprise Communications</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-xs font-semibold text-[#5F6368] border border-[#DADCE0] rounded-full px-3.5 py-1.5 hover:bg-[#F8F9FA]"
            >
              {customer ? `For: ${customer}` : "Personalize"}
            </button>
            <div className="hidden md:flex items-center gap-1 border border-[#DADCE0] rounded-full p-0.5">
              {([15, 30, 60] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setPresenting(d)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#F1F3F4] text-[#5F6368] inline-flex items-center gap-1.5"
                >
                  {d === 15 && <Presentation size={12} />} {d}′
                </button>
              ))}
            </div>
            <button onClick={() => setPresenting(30)} className="md:hidden text-xs font-semibold text-white rounded-full px-3.5 py-1.5" style={{ backgroundColor: v.color }}>
              Present
            </button>
          </div>
        </div>
        {showConfig && (
          <div className="border-t border-[#E8EAED] bg-[#F8F9FA]">
            <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 flex flex-wrap items-center gap-3">
              <label className="text-xs font-semibold text-[#5F6368]">Customer name</label>
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g., Acme Bank"
                className="text-sm border border-[#DADCE0] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#1A73E8]"
              />
              <span className="text-[11px] text-[#9AA0A6]">Updates the hero, presentation mode, and pilot framing. Stays in this browser only.</span>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(900px 380px at 75% -10%, ${v.color}12, transparent)` }} />
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-12 relative">
          <FadeIn>
            <Pill color={v.color}>{v.name}{customer ? ` · prepared for ${customer}` : ""}</Pill>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.08] mt-5 max-w-3xl">{v.heroHeadline}</h1>
            <p className="text-base md:text-lg text-[#5F6368] mt-5 max-w-2xl leading-relaxed">{v.heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setPresenting(30)} className="inline-flex items-center gap-2 rounded-full text-white px-6 py-3 text-sm font-semibold shadow-sm hover:opacity-90" style={{ backgroundColor: v.color }}>
                <Presentation size={15} /> Present this play
              </button>
              <a href="#pilot" className="inline-flex items-center gap-2 rounded-full border border-[#DADCE0] px-6 py-3 text-sm font-semibold text-[#202124] hover:bg-[#F8F9FA]">
                See the pilot <ArrowRight size={15} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Executive problem + why now */}
      <Section alt>
        <div className="grid lg:grid-cols-2 gap-10">
          <FadeIn>
            <Kicker color={v.color}>The executive problem</Kicker>
            <div className="space-y-4">
              {v.thesis.map((t) => (
                <p key={t.slice(0, 30)} className="text-sm md:text-base text-[#202124] leading-relaxed">{t}</p>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Kicker color={v.color}>Why now</Kicker>
            <ul className="space-y-3">
              {v.whyNow.map((w) => (
                <li key={w} className="flex gap-3 text-sm text-[#202124] rounded-xl border border-[#E8EAED] bg-white px-4 py-3">
                  <ChevronRight size={15} className="shrink-0 mt-0.5" style={{ color: v.color }} /> {w}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {v.stats.map((s) => (
            <FadeIn key={s.label}><StatCard value={s.value} label={s.label} source={s.source} color={v.color} /></FadeIn>
          ))}
        </div>
      </Section>

      {/* Use cases */}
      <Section>
        <FadeIn>
          <Kicker color={v.color}>Priority use cases</Kicker>
          <H2>Ranked by value, feasibility, and speed</H2>
          <Lead>Start where value and feasibility intersect. Tags mark the lighthouse, the fastest path to production, and the plays partners lead.</Lead>
        </FadeIn>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#E8EAED]">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-[#F8F9FA] text-left text-[11px] uppercase tracking-wider text-[#5F6368]">
                <th className="px-5 py-3 font-bold">Use case</th>
                <th className="px-4 py-3 font-bold">Value</th>
                <th className="px-4 py-3 font-bold">Feasibility</th>
                <th className="px-4 py-3 font-bold">Speed</th>
                <th className="px-5 py-3 font-bold">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F4]">
              {v.useCases.map((u) => {
                const tag = u.tag ? TAG_META[u.tag] : null;
                return (
                  <tr key={u.name} className="bg-white hover:bg-[#FAFBFC]">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[#202124]">{u.name}</div>
                      {tag && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: v.color }}>
                          <tag.Icon size={10} /> {tag.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">{dots(u.value, v.color)}</td>
                    <td className="px-4 py-3.5">{dots(u.feasibility, v.color)}</td>
                    <td className="px-4 py-3.5">{dots(u.speed, v.color)}</td>
                    <td className="px-5 py-3.5 text-xs text-[#5F6368]">{u.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Journey */}
      <Section alt>
        <FadeIn>
          <Kicker color={v.color}>Lighthouse journey</Kicker>
          <BeforeAfter title={v.journey.title} before={v.journey.before} after={v.journey.after} accent={v.color} />
        </FadeIn>
      </Section>

      {/* Animated flow story */}
      <Section>
        <FadeIn>
          <Kicker color={v.color}>Watch the transformation</Kicker>
          <H2>The same interaction, two operating models</H2>
          <Lead>
            Play the journey step by step, switch between the customer, employee, and systems view, and compare the flows side by side.
            Red chips mark friction removed by the agentic layer; every metric shows its source and confidence.
          </Lead>
        </FadeIn>
        <div className="mt-8">
          <FlowSection slug={v.slug} accent={v.color} />
        </div>
      </Section>

      {/* Operating model comparison */}
      <Section alt>
        <FadeIn>
          <Kicker color={v.color}>Operating-model comparison</Kicker>
          <H2>Conventional vs point solutions vs agentic</H2>
          <Lead>
            Thirteen dimensions where the operating models differ — from experience and speed to governance and measurement.
            Point solutions improve one channel; the agentic layer changes how the whole enterprise communicates.
          </Lead>
        </FadeIn>
        <div className="mt-8">
          <OperatingModelCompare accent={v.color} />
        </div>
      </Section>

      {/* Personas */}
      <Section>
        <FadeIn>
          <Kicker color={v.color}>Who you&apos;ll talk to</Kicker>
          <H2>Every stakeholder, one coherent story</H2>
        </FadeIn>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {v.personas.map((p) => (
            <FadeIn key={p.role}>
              <div className="rounded-2xl border border-[#E8EAED] bg-white p-5 h-full flex flex-col">
                <div className="text-sm font-extrabold" style={{ color: v.color }}>{p.role}</div>
                <div className="mt-3 space-y-2.5 text-xs leading-relaxed flex-1">
                  <p><span className="font-bold text-[#202124]">Cares about:</span> <span className="text-[#5F6368]">{p.concern}</span></p>
                  <p><span className="font-bold text-[#202124]">Wants:</span> <span className="text-[#5F6368]">{p.outcome}</span></p>
                  <p><span className="font-bold text-[#202124]">Will object:</span> <span className="text-[#5F6368]">{p.objection}</span></p>
                  <p><span className="font-bold text-[#202124]">Proof that works:</span> <span className="text-[#5F6368]">{p.proof}</span></p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F3F4] text-xs italic text-[#5F6368] leading-relaxed">“{p.opener}”</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Architecture */}
      <Section alt>
        <FadeIn>
          <Kicker color={v.color}>Architecture</Kicker>
          <H2>The same layers, grounded in your systems</H2>
          <Lead>Channels and industry connectors are partner-built; the agent platform and models are Google Cloud; your systems of record and policies remain yours.</Lead>
        </FadeIn>
        <div className="mt-8"><ArchitectureExplorer /></div>
        <div className="mt-10"><LifecycleStrip /></div>
      </Section>

      {/* Economics */}
      <Section>
        <FadeIn>
          <Kicker color={v.color}>Economics</Kicker>
          <H2>Model it with your numbers</H2>
          <Lead>Defaults reflect typical {v.name.toLowerCase()} interaction profiles — replace them with yours. Every formula is shown; the pilot proves the containment rate before any scale decision.</Lead>
        </FadeIn>
        <div className="mt-8">
          <RoiCalculator defaults={v.roi} accent={v.color} />
        </div>
      </Section>

      {/* Compliance */}
      <Section alt>
        <FadeIn>
          <Kicker color={PALETTE.amber}>Security & regulatory</Kicker>
          <H2>Designed for your regulatory reality</H2>
        </FadeIn>
        <div className="mt-8 grid md:grid-cols-2 gap-3">
          {v.compliance.map((c) => (
            <FadeIn key={c}>
              <div className="flex gap-3 rounded-xl border border-[#E8EAED] bg-white px-4 py-3.5 text-sm text-[#202124]">
                <ShieldCheck size={16} className="shrink-0 mt-0.5" style={{ color: PALETTE.amber }} /> {c}
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Pilot */}
      <Section>
        <div id="pilot" className="rounded-3xl border-2 p-8 md:p-12" style={{ borderColor: `${v.color}33`, backgroundColor: `${v.color}06` }}>
          <Kicker color={v.color}>The pilot{customer ? ` for ${customer}` : ""}</Kicker>
          <H2>Narrow scope. Real traffic. Explicit thresholds.</H2>
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            <div>
              <div className="text-sm font-bold text-[#202124] mb-2">Scope · {v.pilot.weeks} weeks</div>
              <p className="text-sm text-[#5F6368] leading-relaxed mb-5">{v.pilot.scope}</p>
              <div className="text-sm font-bold text-[#202124] mb-2">Integration boundary</div>
              <div className="flex flex-wrap gap-2">
                {v.pilot.integrations.map((i) => (
                  <span key={i} className="text-xs border border-[#E8EAED] bg-white rounded-full px-3 py-1.5 text-[#202124]">{i}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-[#202124] mb-2">Success is measured as</div>
              <ul className="space-y-2">
                {v.pilot.success.map((s) => (
                  <li key={s} className="flex gap-2.5 text-sm text-[#202124]">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: v.color }} /> {s}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <a
                  href={`mailto:harshasks@gmail.com?subject=${encodeURIComponent(`${v.name} pilot — Gemini Enterprise Communications${customer ? ` (${customer})` : ""}`)}`}
                  className="inline-flex items-center gap-2 rounded-full text-white px-6 py-3 text-sm font-bold hover:opacity-90"
                  style={{ backgroundColor: v.color }}
                >
                  Scope this pilot <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Expansion + FAQ */}
      <Section alt>
        <div className="grid lg:grid-cols-2 gap-10">
          <FadeIn>
            <Kicker color={v.color}>Expansion roadmap</Kicker>
            <H2>One pilot, then the platform</H2>
            <div className="mt-4 space-y-0">
              {v.expansion.map((e, i) => (
                <div key={e} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center text-white shrink-0" style={{ backgroundColor: i === 0 ? v.color : `${v.color}66` }}>{i + 1}</span>
                    {i < v.expansion.length - 1 && <span className="w-px flex-1 bg-[#E8EAED]" />}
                  </div>
                  <div className="pb-6 text-sm text-[#202124] pt-1">{e}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Kicker color={v.color}>Common questions</Kicker>
            <H2>Asked in every meeting</H2>
            <div className="mt-4"><Faq items={v.faqs} /></div>
          </FadeIn>
        </div>
      </Section>

      <VoiceFooter />
    </div>
  );
}
