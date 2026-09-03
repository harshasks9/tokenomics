"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldCheck, Layers, ChevronDown } from "lucide-react";
import { C } from "./ui";

const PILLARS = [
  {
    Icon: Sparkles,
    name: "Intelligence",
    line: "Google’s most advanced AI, applied to the work of tax administration.",
    color: C.blue,
  },
  {
    Icon: ShieldCheck,
    name: "Trust",
    line: "Enterprise and government-grade control, built in from the first pilot.",
    color: C.green,
  },
  {
    Icon: Layers,
    name: "Optionality",
    line: "The right model, agent, data platform and infrastructure for each workload.",
    color: C.amber,
  },
];

/* Animated stack motif: six layers, each independently swappable */
function StackMotif() {
  const reduce = useReducedMotion();
  const layers = [
    { label: "Experience", w: 190 },
    { label: "Agents", w: 168 },
    { label: "Models", w: 146 },
    { label: "Data", w: 168 },
    { label: "Platform", w: 190 },
    { label: "Infrastructure", w: 212 },
  ];
  return (
    <div className="relative flex flex-col items-center gap-2" aria-hidden>
      {layers.map((l, i) => (
        <motion.div
          key={l.label}
          initial={reduce ? false : { opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 200, damping: 20 }}
          className="flex items-center justify-center rounded-xl border text-[11px] font-semibold h-10"
          style={{
            width: l.w,
            borderColor: i === 2 ? C.blue : "#E8EAED",
            background: i === 2 ? "#E8F0FE" : "#fff",
            color: i === 2 ? C.blueDeep : "#5F6368",
            boxShadow: "0 1px 3px rgba(32,33,36,0.06)",
          }}
        >
          {i === 2 && !reduce ? (
            <motion.span
              key="models"
              animate={{ opacity: [1, 1, 0, 1, 1] }}
              transition={{ repeat: Infinity, duration: 6, times: [0, 0.42, 0.5, 0.58, 1] }}
            >
              {l.label} — swappable
            </motion.span>
          ) : (
            l.label
          )}
        </motion.div>
      ))}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute -right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-1"
      >
        <span className="h-24 w-px bg-gradient-to-b from-transparent via-[#DADCE0] to-transparent" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-[#9AA0A6] [writing-mode:vertical-rl]">
          Independently evolvable
        </span>
        <span className="h-24 w-px bg-gradient-to-b from-transparent via-[#DADCE0] to-transparent" />
      </motion.div>
    </div>
  );
}

export default function IrasHero() {
  const reduce = useReducedMotion();
  return (
    <section
      id="iras-hero"
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(1100px 520px at 78% -8%, #E8F0FE 0%, rgba(232,240,254,0) 60%), radial-gradient(800px 400px at 8% 110%, #E6F4EA 0%, rgba(230,244,234,0) 55%), #FFFFFF",
      }}
    >
      <div className="section-container w-full !py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#E8EAED] bg-white px-4 py-1.5 text-xs font-semibold text-[#5F6368] shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full" style={{ background: C.blue }} />
              Prepared for IRAS · An executive point of view · September 2026
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-[42px] leading-[1.05] lg:text-[64px] font-bold tracking-tight text-[#202124]"
            >
              AI for the
              <br />
              Modern{" "}
              <span
                style={{
                  background: `linear-gradient(90deg, ${C.blue}, ${C.teal})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Tax Authority
              </span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="mt-6 max-w-xl text-lg lg:text-xl leading-relaxed text-[#5F6368]"
            >
              Transform taxpayer experiences, augment every officer and build intelligent
              workflows — while preserving choice at every layer of the AI stack.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="mt-10 grid sm:grid-cols-3 gap-4 max-w-2xl"
            >
              {PILLARS.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-[#E8EAED] bg-white/80 backdrop-blur-sm p-4 shadow-sm"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: `${p.color}14` }}
                  >
                    <p.Icon size={16} color={p.color} />
                  </span>
                  <p className="mt-2.5 text-sm font-bold uppercase tracking-wide text-[#202124]">
                    {p.name}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-[#5F6368]">{p.line}</p>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onClick={() =>
                document.getElementById("iras-whynow")?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-[#1A73E8] hover:text-[#174EA6] transition-colors"
            >
              See the argument
              <motion.span
                animate={reduce ? undefined : { y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </motion.button>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <StackMotif />
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="mt-6 text-center text-[12px] font-medium text-[#9AA0A6] max-w-[240px] mx-auto leading-relaxed"
              >
                Architect around capabilities, not around any single model — and adopt better AI
                every year without rebuilding.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
