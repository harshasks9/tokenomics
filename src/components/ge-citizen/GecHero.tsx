"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEcon } from "./EconContext";
import { fmtInt, fmtMoney } from "@/lib/ge-citizen/economics";

const QUESTIONS = [
  { q: "Who should we launch for first?", a: "A digitally mature mid-size city", target: "gec-markets" },
  { q: "What would citizens actually use?", a: "Bills, street reports, reminders, procedures", target: "gec-usecases" },
  { q: "Can it work at ~$2 per citizen per year?", a: "Yes — if usage is capped and setup is funded separately", target: "gec-economics" },
];

const TIERS = [
  { t: "Explains", d: "Rules, bills, status and options — grounded in official sources." },
  { t: "Prepares", d: "Pre-fills forms and checks eligibility. The citizen reviews everything." },
  { t: "Completes — with permission", d: "Submits or pays only after sign-in and an explicit confirm. Officials still decide." },
];

export default function GecHero() {
  const { inputs, out } = useEcon();
  return (
    <section
      id="gec-hero"
      className="relative overflow-hidden px-4 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-24"
      style={{ background: "linear-gradient(165deg, #0B1F3A 0%, #102A4C 55%, #0B1F3A 100%)" }}
    >
      <div className="relative mx-auto max-w-6xl">
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8AB4F8]">
          GE for Citizen · A proposition for government leaders
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-4 max-w-4xl text-[32px] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[46px]"
        >
          Give every resident a Gemini-powered agent that explains, prepares and — only with their permission — completes
          everyday government tasks, for about <span className="text-[#8AB4F8]">$2 per citizen per year</span>.
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-5 max-w-3xl text-[16px] leading-relaxed text-[#BDC1C6]">
          Not a chatbot on a website: one agent per citizen that knows their bills, deadlines and open requests, works in their
          language, and hands consequential decisions to people. This page tests the idea — the journeys, the first buyers, the
          economics and what must be true before launch.
        </motion.p>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {QUESTIONS.map((x, i) => (
            <motion.button
              key={x.q}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              onClick={() => document.getElementById(x.target)?.scrollIntoView({ behavior: "smooth" })}
              className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:bg-white/[0.08]"
            >
              <p className="text-[12px] font-medium text-[#9AA0A6]">{x.q}</p>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-white">{x.a}</p>
              <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#8AB4F8] opacity-80 group-hover:opacity-100">
                See why <ArrowDown size={11} />
              </p>
            </motion.button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#9AA0A6]">What the agent does</p>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3">
              {TIERS.map((t, i) => (
                <li key={t.t} className="text-[13px] leading-snug text-[#BDC1C6]">
                  <span className="mb-1 block text-[14px] font-semibold text-white">
                    {i + 1}. {t.t}
                  </span>
                  {t.d}
                </li>
              ))}
            </ol>
            <p className="mt-4 border-t border-white/10 pt-3 text-[12px] text-[#9AA0A6]">
              It never spends money, accepts terms or decides eligibility on its own.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#9AA0A6]">Current scenario · {fmtInt(inputs.population)} covered citizens · illustrative</p>
            <dl className="mt-3 grid grid-cols-3 gap-3">
              <div>
                <dt className="text-[11px] text-[#9AA0A6]">Annual price</dt>
                <dd className="tabular-nums text-[22px] font-semibold text-white">{fmtMoney(out.revenue)}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#9AA0A6]">Run cost / citizen</dt>
                <dd className="tabular-nums text-[22px] font-semibold text-white">{fmtMoney(out.costPerCovered)}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[#9AA0A6]">Margin</dt>
                <dd className="tabular-nums text-[22px] font-semibold text-white">{(out.margin * 100).toFixed(0)}%</dd>
              </div>
            </dl>
            <p className="mt-3 text-[12px] leading-snug text-[#9AA0A6]">Updates live with the calculator below. Setup and integration are priced separately.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
