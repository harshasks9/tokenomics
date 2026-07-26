"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  PhoneCall, MessageSquare, Mail, Globe, Smartphone, Bell,
  Landmark, ShoppingBag, RadioTower, GraduationCap, Building2,
  ShieldCheck, ArrowRight, HandCoins, Headset, Megaphone, Users, BrainCircuit, Check,
} from "lucide-react";
import { SOLUTION_PACKS, VERTICALS, MARKET_STATS, PARTNER_MODEL, PALETTE } from "./data";
import {
  Section, Kicker, H2, Lead, FadeIn, StatCard, CTAButton, LifecycleStrip,
  ArchitectureExplorer, VoiceFooter,
} from "./components";
import { SolutionEconomics } from "./economics";

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

// ─── Hero: live interaction stream ──────────────────────────────────────────

const STREAM_IN = [
  { Icon: PhoneCall, text: "Voice · “kahan hai mera order?”" },
  { Icon: MessageSquare, text: "WhatsApp · EMI reminder reply" },
  { Icon: Mail, text: "Email · fee scholarship query" },
  { Icon: Globe, text: "Web · plan upgrade question" },
  { Icon: Smartphone, text: "App · locked out of Workday" },
  { Icon: Bell, text: "Trigger · delivery at risk" },
];

const STREAM_OUT = [
  "Delivery rescheduled in 3PL ✓",
  "Promise-to-pay written to core ✓",
  "Counselor call booked ✓",
  "Plan upgraded, bill adjusted ✓",
  "Access restored · ticket 0 ✓",
  "Customer notified before the call ✓",
];

function InteractionStream() {
  return (
    <div className="relative h-[340px] hidden lg:block select-none" aria-hidden>
      {/* center layer */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[190px]">
        <motion.div
          animate={{ boxShadow: ["0 0 30px 4px #1A73E855", "0 0 50px 10px #1A73E877", "0 0 30px 4px #1A73E855"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="rounded-2xl border border-[#8AB4F8]/40 bg-[#0E1A33]/90 backdrop-blur px-4 py-4 text-center"
        >
          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8AB4F8]">One agentic layer</div>
          <div className="text-[11px] font-extrabold text-white mt-1 leading-snug">Gemini Enterprise<br />Agent Platform</div>
          <div className="mt-2 pt-2 border-t border-white/10 text-[9px] text-[#9AA0A6] leading-snug">
            comms & voice by<br /><span className="font-bold text-[#4FD1C5]">Tilicho Labs</span>
          </div>
          <div className="mt-2 flex justify-center gap-1">
            {["ground", "reason", "act", "govern"].map((w) => (
              <span key={w} className="text-[7px] font-bold uppercase tracking-wider text-[#8AB4F8] bg-[#8AB4F8]/10 rounded px-1 py-px">{w}</span>
            ))}
          </div>
        </motion.div>
      </div>
      {/* inbound chips */}
      {STREAM_IN.map(({ Icon, text }, i) => (
        <motion.div
          key={text}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: [0, 150, 195], opacity: [0, 1, 0] }}
          transition={{ duration: 4.2, delay: i * 1.35, repeat: Infinity, repeatDelay: STREAM_IN.length * 1.35 - 4.2, ease: "easeInOut" }}
          className="absolute left-0 flex items-center gap-1.5 text-[10px] text-[#BDC1C6] bg-[#131F38]/90 border border-[#233047] rounded-full px-2.5 py-1.5 whitespace-nowrap"
          style={{ top: `${18 + (i % 6) * 52}px` }}
        >
          <Icon size={11} className="text-[#8AB4F8] shrink-0" /> {text}
        </motion.div>
      ))}
      {/* outbound chips */}
      {STREAM_OUT.map((text, i) => (
        <motion.div
          key={text}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: [0, 45, 195], opacity: [0, 1, 0] }}
          transition={{ duration: 4.2, delay: 1.4 + i * 1.35, repeat: Infinity, repeatDelay: STREAM_OUT.length * 1.35 - 4.2, ease: "easeInOut" }}
          className="absolute text-[10px] font-medium text-[#34A853] bg-[#0F2318]/90 border border-[#1E4620] rounded-full px-2.5 py-1.5 whitespace-nowrap"
          style={{ top: `${44 + (i % 6) * 52}px`, left: "52%" }}
        >
          {text}
        </motion.div>
      ))}
    </div>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1B263B] bg-[#0B1220]/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8AB4F8]" style={{ boxShadow: "0 0 8px 2px #8AB4F866" }} />
          <span className="text-sm font-bold text-white">Gemini Enterprise Frontline</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#9AA0A6]">
          <a href="#problem" className="hover:text-white">Why</a>
          <a href="#packs" className="hover:text-white">Solutions</a>
          <a href="#industries" className="hover:text-white">Industries</a>
          <a href="#architecture" className="hover:text-white">Architecture</a>
          <a href="#economics" className="hover:text-white">Economics</a>
          <a href="#trust" className="hover:text-white">Trust</a>
          <a href="#pilot" className="inline-flex items-center gap-1.5 rounded-full bg-[#1A73E8] text-white px-4 py-1.5 font-semibold hover:bg-[#4285F4]">
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

      {/* ── Hero (AI-native, dark) ───────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "radial-gradient(1400px 600px at 70% -20%, #14223D, #0B1220)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: "linear-gradient(#1B263B44 1px, transparent 1px), linear-gradient(90deg, #1B263B44 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-16 relative grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#8AB4F8] border border-[#8AB4F8]/30 rounded-full px-3.5 py-1.5 bg-[#8AB4F8]/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" /> The agentic communications layer · Google Cloud × Tilicho Labs
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.04] mt-6 text-white">
              Every conversation.<br />One intelligent layer.
            </h1>
            <p className="text-base md:text-lg text-[#9AA0A6] mt-6 max-w-xl leading-relaxed">
              Inbound service, outbound sales, collections, and employee support — handled by governed agents that understand context,
              act in your systems, speak your customers&apos; languages, and bring in humans exactly when they should.
              Communications run on Tilicho Labs&apos; proven platform; intelligence runs on Gemini in your Google Cloud environment.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <a href="#economics" className="inline-flex items-center gap-2 rounded-full bg-[#1A73E8] text-white px-6 py-3 text-sm font-semibold hover:bg-[#4285F4] transition-colors">
                Model your economics <ArrowRight size={15} />
              </a>
              <a href="#industries" className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white px-6 py-3 text-sm font-semibold hover:bg-white/5 transition-colors">
                See your industry, animated
              </a>
            </div>
          </FadeIn>
          <InteractionStream />
        </div>
      </section>

      {/* ── Problem ──────────────────────────────────────────────────────── */}
      <Section id="problem" alt>
        <FadeIn>
          <Kicker>The problem</Kicker>
          <H2>Your customers have one conversation. Your systems have twelve.</H2>
          <Lead>
            Voice, chat, email, campaigns, and service run on separate stacks with separate vendors and no shared memory.
            Context dies at every boundary — customers repeat themselves, agents improvise, costs stay high, and nobody can audit what was said.
          </Lead>
        </FadeIn>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ["Context lost at every handoff", "The customer explains the same issue to the IVR, the bot, and the human — and again next week."],
            ["Economics that don't scale", "Assisted contacts cost ~7× self-service ones (Gartner, 2024) — and volume only grows."],
            ["Ungoverned conversations", "Quality teams sample 1–2% of calls. The other 98% is unaudited risk."],
            ["Languages left unserved", "Customer bases speak ten languages; the IVR speaks two."],
          ].map(([t, d]) => (
            <FadeIn key={t}>
              <div className="rounded-xl border border-[#E8EAED] bg-white p-5 h-full">
                <div className="text-sm font-bold">{t}</div>
                <div className="text-xs text-[#5F6368] mt-1.5 leading-relaxed">{d}</div>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="mt-8">
          <LifecycleStrip />
        </div>
      </Section>

      {/* ── Solution packs ───────────────────────────────────────────────── */}
      <Section id="packs">
        <FadeIn>
          <Kicker>Solution packs</Kicker>
          <H2>Start with one outcome. Expand on one platform.</H2>
          <Lead>
            Tilicho Labs delivers preconfigured agent packs on the Gemini Enterprise Agent Platform — journeys, integrations,
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
                  <div className="mt-4 pt-4 border-t border-[#F1F3F4] text-[11px] text-[#9AA0A6]">{p.timeline}</div>
                </div>
              </FadeIn>
            );
          })}
          <FadeIn delay={0.25}>
            <div className="rounded-2xl border-2 border-dashed border-[#DADCE0] p-6 h-full flex flex-col justify-center items-start">
              <h3 className="text-base font-extrabold">Your workload</h3>
              <p className="text-xs text-[#5F6368] mt-2 leading-relaxed">
                Any inbound or outbound communication embedded in a business process can become an agent pack — designed and deployed with Tilicho Labs, governed on the platform.
              </p>
              <a href="#pilot" className="text-xs font-semibold mt-4 inline-flex items-center gap-1" style={{ color: PALETTE.blue }}>
                Bring us a use case <ArrowRight size={12} />
              </a>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ── Industries ───────────────────────────────────────────────────── */}
      <Section id="industries" alt>
        <FadeIn>
          <Kicker>Industries</Kicker>
          <H2>Watch your industry&apos;s operating model change</H2>
          <Lead>Each play opens with a live animated race: the conventional journey against the agentic one, built from your industry&apos;s real workflows — then the use cases, architecture, economics, and a pilot you can start this quarter.</Lead>
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
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#9AA0A6] group-hover:text-[#1A73E8] inline-flex items-center gap-1">
                      ▶ animated story <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
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
                Government & citizen services, healthcare, travel & hospitality, real estate, automotive, and SMB follow the same patterns — the five focus industries prove them first.
              </p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ── Architecture + ownership ─────────────────────────────────────── */}
      <Section id="architecture">
        <FadeIn>
          <Kicker>Architecture</Kicker>
          <H2>One integrated solution. Three clear owners.</H2>
          <Lead>
            Tilicho Labs provides the communications and voice-AI platform — nothing rebuilt from scratch. Google Cloud provides the intelligence,
            agents, and governance. Your systems, rules, and approvals stay yours. Select a layer to see what lives where.
          </Lead>
        </FadeIn>
        <div className="mt-8 grid md:grid-cols-3 gap-4 mb-10">
          {[
            { title: "Tilicho Labs", sub: "Communications platform & implementation", items: PARTNER_MODEL.partner, color: PALETTE.teal },
            { title: "Google Cloud", sub: "Intelligence, agents & governance", items: PARTNER_MODEL.google, color: PALETTE.blue },
            { title: "Your enterprise", sub: "Data, rules & accountability", items: PARTNER_MODEL.customer, color: PALETTE.muted },
          ].map((col) => (
            <FadeIn key={col.title}>
              <div className="rounded-2xl border-t-4 border border-[#E8EAED] bg-white p-5 h-full" style={{ borderTopColor: col.color }}>
                <div className="text-sm font-extrabold" style={{ color: col.color }}>{col.title}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9AA0A6] mt-0.5 mb-3">{col.sub}</div>
                <ul className="space-y-1.5 text-[11px] text-[#5F6368]">
                  {col.items.map((i) => <li key={i} className="flex gap-2"><Check size={11} className="shrink-0 mt-0.5" style={{ color: col.color }} />{i}</li>)}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
        <ArchitectureExplorer />
      </Section>

      {/* ── Economics (commercial model) ─────────────────────────────────── */}
      <Section id="economics" alt>
        <FadeIn>
          <Kicker>How you&apos;d buy it</Kicker>
          <H2>Not a subscription tier. A solution you shape.</H2>
          <Lead>
            Four integrated components — one-time implementation by Tilicho Labs, usage-based communications, Google Cloud consumption,
            and optional managed services. Adjust the model to your operation and watch cost, value, and payback respond.
          </Lead>
        </FadeIn>
        <div className="mt-8">
          <SolutionEconomics />
        </div>
        <div className="mt-12">
          <FadeIn>
            <div className="text-sm font-bold text-[#202124] mb-4">Why the market is moving — independently verified</div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKET_STATS.slice(0, 4).map((s) => (
              <FadeIn key={s.label}>
                <StatCard value={s.value} label={s.label} source={`${s.source} · ${s.confidence}`} />
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Trust ────────────────────────────────────────────────────────── */}
      <Section id="trust">
        <FadeIn>
          <Kicker color={PALETTE.amber}>Security & governance</Kicker>
          <H2>Governed by design, not by hope</H2>
          <Lead>
            Agentic communications only work at enterprise scale when trust is structural. Every conversation is identity-bound,
            policy-checked, logged, and escalatable — with intelligence and data inside your Google Cloud perimeter.
          </Lead>
        </FadeIn>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["In your tenant", "Gemini intelligence, agent state, and logs run in your Google Cloud environment under your IAM, network, and residency controls."],
            ["Policy-bounded actions", "Agents act only through permissioned tools, drawing offers and decisions from matrices your teams own — never invented terms."],
            ["100% auditable", "Every prompt, retrieval, action, and escalation is logged. Compare with today's 1–2% call sampling."],
            ["Humans in the loop", "Sentiment, complexity, vulnerability, and policy triggers route to people — with full context, in your existing tools."],
            ["Continuous evaluation", "Golden datasets and automated scoring gate every change to prompts, policies, and workflows before it ships."],
            ["Cost controls", "Usage-based communications and consumption-based intelligence keep unit economics visible and predictable as volume scales."],
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
      <Section id="pilot" alt>
        <div className="rounded-3xl px-8 py-12 md:px-14 md:py-16 text-white relative overflow-hidden" style={{ background: "radial-gradient(900px 400px at 30% 0%, #14223D, #0B1220)" }}>
          <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: "linear-gradient(#1B263B55 1px, transparent 1px), linear-gradient(90deg, #1B263B55 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
          <div className="relative max-w-2xl">
            <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8AB4F8] mb-3">Start structured, not speculative</div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight">
              A use-case workshop this month. A measured pilot this quarter.
            </h2>
            <p className="text-white/75 mt-4 text-sm md:text-base leading-relaxed">
              We start with your interaction data, pick one narrowly-scoped use case, baseline today&apos;s metrics, and run an 8–12 week
              pilot with explicit success thresholds — human fallback throughout, production path defined before we start.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="mailto:harshasks@gmail.com?subject=Gemini%20Enterprise%20Communications%20workshop" className="inline-flex items-center gap-2 rounded-full bg-white text-[#0B1220] px-6 py-3 text-sm font-bold hover:bg-blue-50 transition-colors">
                Request a workshop <ArrowRight size={15} />
              </a>
              <Link href="/voice/financial-services" className="inline-flex items-center gap-2 rounded-full border border-white/25 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
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
