"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  PhoneCall, MessageSquare, Mail, Globe, Smartphone, Bell,
  Landmark, ShoppingBag, RadioTower, GraduationCap, Building2,
  ShieldCheck, ArrowRight, Workflow, HandCoins, Headset, Megaphone, Users, BrainCircuit,
} from "lucide-react";
import {
  SOLUTION_PACKS, VERTICALS, MARKET_STATS, PALETTE,
} from "./data";
import {
  Section, Kicker, H2, Lead, FadeIn, StatCard, Pill, CTAButton, LifecycleStrip,
  ArchitectureExplorer, RoiCalculator, VoiceFooter,
} from "./components";

const CHANNELS = [
  { icon: PhoneCall, label: "Voice" },
  { icon: MessageSquare, label: "WhatsApp & messaging" },
  { icon: Mail, label: "Email" },
  { icon: Globe, label: "Web chat" },
  { icon: Smartphone, label: "Mobile apps" },
  { icon: Bell, label: "Notifications" },
];

const PACK_ICONS: Record<string, typeof HandCoins> = {
  collections: HandCoins,
  "inbound-service": Headset,
  "outbound-lead": Megaphone,
  "support-agent": Users,
  "agent-assist": BrainCircuit,
};

const VERTICAL_ICONS: Record<string, typeof Landmark> = {
  "financial-services": Landmark,
  retail: ShoppingBag,
  telecom: RadioTower,
  education: GraduationCap,
  gcc: Building2,
};

const FRAGMENTS = [
  "Contact centre", "CRM", "Campaign tools", "Email desk", "IVR", "WhatsApp bot",
  "Dialer team", "Ticketing", "Survey tool", "Field service", "Knowledge base", "BPO partner",
];

function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#E8EAED]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PALETTE.blue }} />
          <span className="text-sm font-bold text-[#202124]">Gemini Enterprise Communications</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#5F6368]">
          <a href="#problem" className="hover:text-[#202124]">Why</a>
          <a href="#packs" className="hover:text-[#202124]">Solutions</a>
          <a href="#industries" className="hover:text-[#202124]">Industries</a>
          <a href="#architecture" className="hover:text-[#202124]">Architecture</a>
          <a href="#value" className="hover:text-[#202124]">Value</a>
          <a href="#trust" className="hover:text-[#202124]">Trust</a>
          <a href="#pilot" className="inline-flex items-center gap-1.5 rounded-full bg-[#1A73E8] text-white px-4 py-1.5 font-semibold hover:bg-[#174EA6]">
            Request a workshop
          </a>
        </nav>
      </div>
    </header>
  );
}

export default function VoiceHome() {
  return (
    <div className="min-h-screen bg-white text-[#202124]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <TopNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(1000px 400px at 70% -10%, #1A73E80F, transparent)" }} />
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-14 relative">
          <FadeIn>
            <Pill>The agentic communications layer, on Google Cloud</Pill>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mt-5 max-w-4xl">
              One intelligent layer for every conversation your enterprise has
            </h1>
            <p className="text-lg md:text-xl text-[#5F6368] mt-6 max-w-2xl leading-relaxed">
              Inbound service, outbound sales, collections, and employee support — handled by governed agents that understand context,
              act in your systems, speak your customers&apos; languages, and hand off to humans exactly when they should.
              Deployed in your Google Cloud environment.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <CTAButton href="#pilot">Structure a pilot</CTAButton>
              <CTAButton href="#industries" secondary>Explore your industry</CTAButton>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-14 flex flex-wrap gap-2">
              {CHANNELS.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 text-xs font-medium text-[#5F6368] border border-[#E8EAED] rounded-full px-3.5 py-2 bg-white">
                  <Icon size={13} style={{ color: PALETTE.blue }} /> {label}
                </span>
              ))}
              <span className="inline-flex items-center gap-2 text-xs font-medium text-white rounded-full px-3.5 py-2" style={{ backgroundColor: PALETTE.blue }}>
                <Workflow size={13} /> One agent layer behind all of them
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Problem: fragmentation ───────────────────────────────────────── */}
      <Section id="problem" alt>
        <FadeIn>
          <Kicker>The problem</Kicker>
          <H2>Your customers have one conversation. Your systems have twelve.</H2>
          <Lead>
            Voice, chat, email, campaigns, and service run on separate stacks with separate vendors, separate scripts, and no shared memory.
            Context dies at every boundary — so customers repeat themselves, agents improvise, costs stay high, and nobody can audit what was actually said.
          </Lead>
        </FadeIn>
        <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-wrap gap-2">
            {FRAGMENTS.map((f, i) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, scale: 0.9, rotate: (i % 5) - 2 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="text-xs font-medium border border-dashed border-[#DADCE0] rounded-lg px-3 py-2 text-[#5F6368] bg-white"
                style={{ transform: `rotate(${(i % 5) - 2}deg)` }}
              >
                {f}
              </motion.span>
            ))}
          </div>
          <div className="space-y-3">
            {[
              ["Context lost at every handoff", "The customer explains the same issue to the IVR, the bot, and the human — and again next week."],
              ["Economics that don't scale", "Assisted contacts cost ~7× self-service ones (Gartner, 2024) — and volume only grows."],
              ["Ungoverned conversations", "Quality teams sample 1–2% of calls. The other 98% is unaudited risk."],
              ["Languages left unserved", "Customer bases speak ten languages; the IVR speaks two."],
            ].map(([t, d]) => (
              <FadeIn key={t}>
                <div className="rounded-xl border border-[#E8EAED] bg-white p-4">
                  <div className="text-sm font-bold">{t}</div>
                  <div className="text-xs text-[#5F6368] mt-1 leading-relaxed">{d}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Future state ─────────────────────────────────────────────────── */}
      <Section id="future">
        <FadeIn>
          <Kicker>The shift</Kicker>
          <H2>From channel silos to one governed agentic layer</H2>
          <Lead>
            Every interaction — inbound or outbound, voice or text — flows through agents that resolve identity, retrieve context,
            reason over your policies, act in your systems of record, and escalate to humans with everything they need.
            Every interaction is logged, evaluated, and used to improve the next one.
          </Lead>
        </FadeIn>
        <div className="mt-10">
          <LifecycleStrip />
        </div>
      </Section>

      {/* ── Solution packs ───────────────────────────────────────────────── */}
      <Section id="packs" alt>
        <FadeIn>
          <Kicker>Solution packs</Kicker>
          <H2>Start with one outcome. Expand on one platform.</H2>
          <Lead>
            Partner-delivered agent packs on the Gemini Enterprise Agent Platform — preconfigured journeys, connectors,
            policies, and dashboards for the communications workloads that matter most.
          </Lead>
        </FadeIn>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOLUTION_PACKS.map((p, i) => {
            const Icon = PACK_ICONS[p.id];
            return (
              <FadeIn key={p.id} delay={i * 0.05}>
                <div className="rounded-2xl border border-[#E8EAED] bg-white p-6 h-full flex flex-col hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${PALETTE.blue}12` }}>
                    <Icon size={19} style={{ color: PALETTE.blue }} />
                  </div>
                  <h3 className="text-base font-extrabold">{p.name}</h3>
                  <p className="text-xs font-medium mt-1" style={{ color: PALETTE.blue }}>{p.tagline}</p>
                  <p className="text-xs text-[#5F6368] mt-3 leading-relaxed flex-1">{p.problem}</p>
                  <div className="mt-4 pt-4 border-t border-[#F1F3F4] text-[11px] text-[#9AA0A6]">
                    {p.timeline}
                  </div>
                </div>
              </FadeIn>
            );
          })}
          <FadeIn delay={0.25}>
            <div className="rounded-2xl border-2 border-dashed border-[#DADCE0] p-6 h-full flex flex-col justify-center items-start">
              <h3 className="text-base font-extrabold">Your workload</h3>
              <p className="text-xs text-[#5F6368] mt-2 leading-relaxed">
                Any inbound or outbound communication embedded in a business process can become an agent pack —
                designed with a partner, governed on the platform.
              </p>
              <a href="#pilot" className="text-xs font-semibold mt-4 inline-flex items-center gap-1" style={{ color: PALETTE.blue }}>
                Bring us a use case <ArrowRight size={12} />
              </a>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ── Industries ───────────────────────────────────────────────────── */}
      <Section id="industries">
        <FadeIn>
          <Kicker>Industries</Kicker>
          <H2>Built for how your industry communicates</H2>
          <Lead>Five focused plays, each with its own microsite: the executive case, use cases, architecture, economics, and a pilot you can start this quarter.</Lead>
        </FadeIn>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {VERTICALS.map((v, i) => {
            const Icon = VERTICAL_ICONS[v.slug];
            return (
              <FadeIn key={v.slug} delay={i * 0.05}>
                <Link
                  href={`/voice/${v.slug}`}
                  className="group rounded-2xl border border-[#E8EAED] bg-white p-6 h-full flex flex-col hover:shadow-lg transition-all block"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${v.color}14` }}>
                      <Icon size={19} style={{ color: v.color }} />
                    </div>
                    <ArrowRight size={16} className="text-[#DADCE0] group-hover:text-[#1A73E8] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-base font-extrabold">{v.name}</h3>
                  <p className="text-xs text-[#5F6368] mt-2 leading-relaxed flex-1">{v.heroHeadline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {v.useCases.filter((u) => u.tag === "lighthouse" || u.tag === "fastest").map((u) => (
                      <span key={u.name} className="text-[10px] font-medium border border-[#E8EAED] rounded-full px-2 py-0.5 text-[#5F6368]">
                        {u.name.split("(")[0].split("&")[0].trim().slice(0, 34)}
                      </span>
                    ))}
                  </div>
                </Link>
              </FadeIn>
            );
          })}
          <FadeIn delay={0.25}>
            <div className="rounded-2xl border-2 border-dashed border-[#DADCE0] p-6 h-full flex flex-col justify-center">
              <h3 className="text-sm font-bold text-[#5F6368]">Adjacent industries</h3>
              <p className="text-xs text-[#9AA0A6] mt-2 leading-relaxed">
                Government & citizen services, healthcare, travel & hospitality, real estate, automotive, and SMB follow the same
                patterns — the five focus industries prove them first.
              </p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ── Architecture ─────────────────────────────────────────────────── */}
      <Section id="architecture" alt>
        <FadeIn>
          <Kicker>Architecture</Kicker>
          <H2>Clear layers, clear ownership</H2>
          <Lead>
            Google Cloud provides the intelligence and the agent platform. Partners build channels, integrations, and industry packs.
            Your systems of record — and your policies — stay yours. Select a layer to see what lives where.
          </Lead>
        </FadeIn>
        <div className="mt-10">
          <ArchitectureExplorer />
        </div>
      </Section>

      {/* ── Value / evidence ─────────────────────────────────────────────── */}
      <Section id="value">
        <FadeIn>
          <Kicker>The economics</Kicker>
          <H2>Model the value with your own numbers</H2>
          <Lead>
            No black-box savings claims. Adjust the levers, see the formulas, and treat the output as a hypothesis your pilot will test.
          </Lead>
        </FadeIn>
        <div className="mt-8">
          <RoiCalculator defaults={{ monthlyInteractions: 1000000, avgMinutes: 4, humanCostPerMin: 0.4, aiCostPerMin: 0.07, containment: 60, revenuePerResolved: 1 }} />
        </div>
        <div className="mt-12">
          <FadeIn>
            <div className="text-sm font-bold text-[#202124] mb-4">Why the market is moving — independently verified</div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKET_STATS.slice(0, 8).map((s) => (
              <FadeIn key={s.label}>
                <StatCard value={s.value} label={s.label} source={`${s.source} · ${s.confidence}`} />
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Trust ────────────────────────────────────────────────────────── */}
      <Section id="trust" alt>
        <FadeIn>
          <Kicker color={PALETTE.amber}>Security & governance</Kicker>
          <H2>Governed by design, not by hope</H2>
          <Lead>
            Agentic communications only work at enterprise scale when trust is structural. Every conversation is identity-bound,
            policy-checked, logged, and escalatable — inside your cloud perimeter.
          </Lead>
        </FadeIn>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["In your tenant", "Models, state, telemetry, and logs run in your Google Cloud environment under your IAM, network, and residency controls."],
            ["Policy-bounded actions", "Agents act only through permissioned tools, drawing offers and decisions from matrices your teams own — never invented terms."],
            ["100% auditable", "Every prompt, retrieval, action, and escalation is logged. Compare with today's 1–2% call sampling."],
            ["Humans in the loop", "Sentiment, complexity, vulnerability, and policy triggers route to people — with full context, in your existing tools."],
            ["Continuous evaluation", "Golden datasets and automated scoring gate every change to prompts, policies, and workflows before it ships."],
            ["Cost controls", "Model routing, budgets, and rate guards keep unit economics predictable as volume scales."],
          ].map(([t, d]) => (
            <FadeIn key={t}>
              <div className="rounded-2xl border border-[#E8EAED] bg-white p-5 h-full">
                <ShieldCheck size={17} style={{ color: PALETTE.amber }} className="mb-3" />
                <div className="text-sm font-bold">{t}</div>
                <div className="text-xs text-[#5F6368] mt-1.5 leading-relaxed">{d}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ── Pilot CTA ────────────────────────────────────────────────────── */}
      <Section id="pilot">
        <div className="rounded-3xl px-8 py-12 md:px-14 md:py-16 text-white relative overflow-hidden" style={{ background: `linear-gradient(120deg, ${PALETTE.blueDeep}, ${PALETTE.blue})` }}>
          <div className="relative max-w-2xl">
            <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/70 mb-3">Start structured, not speculative</div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
              A use-case workshop this month. A measured pilot this quarter.
            </h2>
            <p className="text-white/85 mt-4 text-sm md:text-base leading-relaxed">
              We start with your interaction data, pick one narrowly-scoped use case, baseline today&apos;s metrics, and run an 8–12 week
              pilot with explicit success thresholds — human fallback throughout, production path defined before we start.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="mailto:harshasks@gmail.com?subject=Gemini%20Enterprise%20Communications%20workshop" className="inline-flex items-center gap-2 rounded-full bg-white text-[#174EA6] px-6 py-3 text-sm font-bold hover:bg-blue-50 transition-colors">
                Request a workshop <ArrowRight size={15} />
              </a>
              <Link href="/voice/financial-services" className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
                See an industry play
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <VoiceFooter />
    </div>
  );
}
