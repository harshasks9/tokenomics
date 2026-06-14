"use client";

import { useTally } from "@/lib/tally-context";
import { pctSavings } from "@/lib/pricing";
import { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw, Copy, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import type { CustomerProfile } from "@/lib/profiles/types";

const AMBER  = "#E37400";
const INDIGO = "#4F46E5";

function AnimNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const ctrl = animate(prev.current, value, {
      duration: 0.8, ease: "easeOut", onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => ctrl.stop();
  }, [value]);
  const fmt = display >= 1_000_000 ? `$${(display / 1_000_000).toFixed(1)}M`
    : display >= 1_000 ? `$${(display / 1_000).toFixed(0)}K`
    : `$${display.toFixed(0)}`;
  return <span className="tabular-nums">{fmt}</span>;
}

const fmtT = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `$${(v / 1_000).toFixed(0)}K`
  : `$${v.toFixed(0)}`;

export default function ProfileSummary({ profile }: { profile: CustomerProfile }) {
  const { results, resetAll } = useTally();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const s1 = results["s1"];
  const s2 = results["s2"];
  const s4 = results["s4"];

  const buildAllFrontier  = s1?.allFrontier ?? 0;
  const buildTiered       = s1?.tiered      ?? 0;
  const runAllFrontier    = s2?.allFrontier  ?? 0;
  const runTiered         = s2?.tiered       ?? 0;
  const extendAllFrontier = s4?.allFrontier  ?? 0;
  const extendTiered      = s4?.tiered       ?? 0;

  const totalAnnualAll    = runAllFrontier    + extendAllFrontier;
  const totalAnnualTiered = runTiered         + extendTiered;
  const totalAnnualSavings = totalAnnualAll   - totalAnnualTiered;

  const chartData = [
    { name: "Build",  "All-Frontier": buildAllFrontier,  Tiered: buildTiered  },
    { name: "Run",    "All-Frontier": runAllFrontier,    Tiered: runTiered    },
    { name: "Agent",  "All-Frontier": extendAllFrontier, Tiered: extendTiered },
  ];

  const handleCopy = () => {
    const lines = [
      `${profile.name} AI Tokenomics Summary`,
      "================================",
      "",
      `Build: All-Opus ${fmtT(buildAllFrontier)} vs Tiered ${fmtT(buildTiered)} → ${fmtT(buildAllFrontier - buildTiered)} saved (one-time)`,
      `Run Support AI: All-Opus ${fmtT(runAllFrontier)}/yr vs Tiered ${fmtT(runTiered)}/yr → ${fmtT(s2?.savings ?? 0)}/yr`,
      `Agent Automation: All-Opus ${fmtT(extendAllFrontier)}/yr vs Tiered ${fmtT(extendTiered)}/yr → ${fmtT(s4?.savings ?? 0)}/yr`,
      "",
      `Total Annual Savings: ${fmtT(totalAnnualSavings)}`,
      "",
      `Key insight: ${profile.savingsHeadline}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };

  return (
    <section id="summary" className="bg-[#F8F9FA] border-t border-[#E8EAED]">
      <div className="section-container">
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#202124] mb-2">Lifecycle Summary</h2>
            <p className="text-[#5F6368] text-lg max-w-xl">
              {profile.name} savings across Build → Run → Agent, at your current slider settings.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowBreakdown(!showBreakdown)} className="btn-secondary">
              {showBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              By Scenario
            </button>
            <button onClick={handleCopy} className="btn-secondary">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#188038]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Summary"}
            </button>
            <button onClick={resetAll} className="btn-secondary">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {showBreakdown && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-10">
            <div className="card space-y-3">
              <h4 className="text-sm font-bold text-[#202124]">By Scenario</h4>
              {[
                { key: "s1", label: "Build Platform",  result: s1 },
                { key: "s2", label: "Run Support AI",  result: s2 },
                { key: "s4", label: "Agent Automation", result: s4 },
              ].map(({ key, label, result }) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-[#5F6368]">{label}</span>
                  {result ? (
                    <span className="font-semibold text-[#188038]">{fmtT(result.savings)} saved/{result.period}</span>
                  ) : (
                    <span className="text-[#BDC1C6] text-xs">Interact above to calculate</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Build Savings (one-time)", all: buildAllFrontier,  tiered: buildTiered,  savings: buildAllFrontier - buildTiered   },
            { label: "Run Savings (annual)",     all: runAllFrontier,    tiered: runTiered,    savings: runAllFrontier - runTiered       },
            { label: "Agent Savings (annual)",   all: extendAllFrontier, tiered: extendTiered, savings: extendAllFrontier - extendTiered },
          ].map((row) => (
            <div key={row.label} className="card">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] mb-3">{row.label}</p>
              <div className="flex items-end gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-[#9AA0A6] mb-0.5">All-Frontier</p>
                  <p className="text-lg font-bold" style={{ color: AMBER }}>{fmtT(row.all)}</p>
                </div>
                <div className="text-[#BDC1C6] mb-1">→</div>
                <div>
                  <p className="text-[10px] text-[#9AA0A6] mb-0.5">Tiered</p>
                  <p className="text-lg font-bold text-[#188038]">{fmtT(row.tiered)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#188038]">Save {fmtT(row.savings)}</span>
                {row.all > 0 && (
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5">
                    {pctSavings(row.all, row.tiered).toFixed(0)}% off
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="card">
            <h3 className="text-base font-bold text-[#202124] mb-4">All-Frontier vs Tiered — By Phase</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barGap={4}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v}`} width={52} />
                <Tooltip formatter={(v: unknown) => [fmtT(Number(v))]} contentStyle={{ borderRadius: 8, fontSize: 11, border: "1px solid #E8EAED" }} />
                <Bar dataKey="All-Frontier" fill={AMBER}  radius={[4, 4, 0, 0]} maxBarSize={36} />
                <Bar dataKey="Tiered"       fill={INDIGO} radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl p-6" style={{ background: profile.gradient }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">Total Annual Savings</p>
              <p className="text-5xl font-extrabold text-white mb-1">
                <AnimNumber value={totalAnnualSavings} />
              </p>
              <p className="text-white/70 text-sm">
                {totalAnnualAll > 0
                  ? `${pctSavings(totalAnnualAll, totalAnnualTiered).toFixed(0)}% reduction on Run + Agent phases`
                  : "Interact with the scenarios above to see your savings"}
              </p>
            </div>

            <div className="card space-y-3">
              <h4 className="text-sm font-bold text-[#202124]">Tiered AI Insight</h4>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                <strong>{profile.savingsHeadline}</strong> — achieved by routing {Math.round(profile.build.mix.flashLitePct * 100)}% of development tasks
                and {Math.round(profile.run.mix.flashLitePct * 100)}% of runtime queries to Flash-Lite,
                while keeping Opus on the {Math.round(profile.build.mix.opusPct * 100)}% of tasks that require frontier reasoning.
              </p>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                The agent automation phase shows the clearest ROI: {profile.agent.executorSteps} of {profile.agent.steps.length} steps run on Flash,
                with Opus reserved for planning and review decisions that determine quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
