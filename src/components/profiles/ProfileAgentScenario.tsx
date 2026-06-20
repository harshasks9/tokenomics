"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTally } from "@/lib/tally-context";
import { pctSavings } from "@/lib/pricing";
import { agentCosts, agentAnnual } from "@/lib/profiles/calculator";
import type { CustomerProfile, ProfileAgentStep } from "@/lib/profiles/types";

const ROLE_STYLE = {
  planner:  { color: "#7C3AED", label: "Planner",  bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" },
  executor: { color: "#0284C7", label: "Executor", bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700"   },
  reviewer: { color: "#7C3AED", label: "Reviewer", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" },
};

const fmtMoney = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `$${(v / 1_000).toFixed(1)}K`
  : `$${v.toFixed(4)}`;

const fmtQty = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `${(v / 1_000).toFixed(0)}K`
  : `${v}`;

function TraceNode({
  step,
  profileColor,
}: {
  step: ProfileAgentStep;
  profileColor: string;
}) {
  const [open, setOpen] = useState(false);
  const s = ROLE_STYLE[step.role];
  const dotColor = step.role === "executor" ? profileColor : s.color;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left p-3 rounded-xl border transition-all ${
          open ? "border-[#E8EAED] bg-white shadow-sm" : "border-transparent hover:border-[#E8EAED] hover:bg-white/60"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${s.bg} ${s.border} ${s.text}`}>
            {s.label}
          </span>
          <span className="text-xs font-medium text-[#202124] truncate">{step.label}</span>
        </div>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 top-full z-20 mt-1 p-3 bg-white rounded-xl border border-[#E8EAED] shadow-lg"
        >
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-[#9AA0A6] mb-0.5">Input tokens</p>
              <p className="font-bold text-[#202124]">{step.inTok.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[#9AA0A6] mb-0.5">Output tokens</p>
              <p className="font-bold text-[#202124]">{step.outTok.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[#9AA0A6] mb-0.5">Model</p>
              <p className="font-bold" style={{ color: dotColor }}>
                {step.role === "executor" ? "Flash" : "Opus"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function ProfileAgentScenario({ profile }: { profile: CustomerProfile }) {
  const [volume, setVolume] = useState(profile.agent.defaultVolume);
  const { updateResult } = useTally();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const costs = agentCosts(profile);
  const annualAll    = agentAnnual(profile, volume, "allOpus");
  const annualTiered = agentAnnual(profile, volume, "tiered");
  const savings = annualAll - annualTiered;

  useEffect(() => {
    updateResult("s4", {
      label: "Agent",
      allFrontier: annualAll,
      tiered: annualTiered,
      savings,
      period: "annual",
    });
  }, [annualAll, annualTiered, savings]);

  const planners  = profile.agent.steps.filter((s) => s.role === "planner");
  const executors = profile.agent.steps.filter((s) => s.role === "executor");
  const reviewers = profile.agent.steps.filter((s) => s.role === "reviewer");

  return (
    <section id="agent" ref={ref} className="bg-white border-b border-[#E8EAED]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#202124] mb-2">{profile.agent.title}</h2>
          <p className="text-[#5F6368] text-lg max-w-2xl mb-10">{profile.agent.description}</p>

          {/* Volume slider */}
          <div className="mb-10">
            <label className="block text-sm font-semibold text-[#202124] mb-3">
              {profile.agent.volumeLabel}: <span className="font-extrabold">{fmtQty(volume)}</span>
              <span className="ml-2 text-xs text-[#9AA0A6] font-normal">
                × {profile.agent.runsPerDay} run{profile.agent.runsPerDay > 1 ? "s" : ""}/day × 365 days
              </span>
            </label>
            <input
              type="range"
              min={profile.agent.volumeStep}
              max={profile.agent.maxVolume}
              step={profile.agent.volumeStep}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full max-w-lg"
              style={{ accentColor: profile.color }}
            />
            <div className="flex justify-between text-[10px] text-[#9AA0A6] mt-1 max-w-lg">
              <span>{fmtQty(profile.agent.volumeStep)}</span>
              <span>{fmtQty(profile.agent.maxVolume)}</span>
            </div>
          </div>

          {/* Cost cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { label: "All-Opus Annual", value: annualAll,    color: "#E37400" },
              { label: "Tiered Annual",   value: annualTiered, color: "#188038" },
              { label: "Annual Savings",  value: savings,      color: profile.color },
            ].map((c) => (
              <div key={c.label} className="card">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] mb-2">{c.label}</p>
                <p className="text-3xl font-extrabold" style={{ color: c.color }}>{fmtMoney(c.value)}</p>
                {c.label === "Annual Savings" && annualAll > 0 && (
                  <p className="text-xs text-[#9AA0A6] mt-1">{pctSavings(annualAll, annualTiered).toFixed(0)}% reduction</p>
                )}
              </div>
            ))}
          </div>

          {/* Per-run cost breakdown */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {[
              { label: "Planner (Opus)",          value: costs.plannerCost,        color: "#7C3AED" },
              { label: `Executors × ${profile.agent.executorSteps} (Flash)`, value: costs.executorCostTiered, color: profile.color },
              { label: "Reviewer (Opus)",          value: costs.reviewerCost,       color: "#7C3AED" },
              { label: "Total per run (tiered)",   value: costs.tiered,             color: "#188038" },
            ].map((c) => (
              <div key={c.label} className="card text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA0A6] mb-1">{c.label}</p>
                <p className="text-lg font-extrabold" style={{ color: c.color }}>{fmtMoney(c.value)}</p>
              </div>
            ))}
          </div>

          {/* Agent trace */}
          <div className="card">
            <h3 className="text-base font-bold text-[#202124] mb-4">
              Agent Execution Trace
              <span className="ml-2 text-xs text-[#9AA0A6] font-normal">Click a step for details</span>
            </h3>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA0A6] mb-2">Planner — Opus</p>
              {planners.map((s) => <TraceNode key={s.id} step={s} profileColor={profile.color} />)}
              <div className="border-l-2 border-dashed border-[#E8EAED] ml-4 my-2 pl-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA0A6] mb-2">
                  Executors ({executors.length}) — Flash
                </p>
                {executors.map((s) => <TraceNode key={s.id} step={s} profileColor={profile.color} />)}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9AA0A6] mb-2">Reviewer — Opus</p>
              {reviewers.map((s) => <TraceNode key={s.id} step={s} profileColor={profile.color} />)}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
