"use client";

import { useTally } from "@/lib/tally-context";
import { fmtUSD, pctSavings } from "@/lib/pricing";
import { SELLER_NOTES } from "@/lib/content";
import { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  RotateCcw,
  Copy,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

function AnimatedNumber({ value, prefix = "$", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prevRef.current = value;
    return () => controls.stop();
  }, [value]);

  const formatted = display >= 1_000_000
    ? `${(display / 1_000_000).toFixed(1)}M`
    : display >= 1_000
    ? `${(display / 1_000).toFixed(0)}K`
    : display.toFixed(0);

  return (
    <span className="tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  );
}

export default function SummaryDashboard() {
  const { results, resetAll } = useTally();
  const [showNotes, setShowNotes] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute lifecycle buckets
  const buildResult = results["s1"];
  const s2Result = results["s2"];
  const s3Result = results["s3"];
  const s4Result = results["s4"];

  const buildSavings = buildResult?.savings ?? 0;
  const runSavings = (s2Result?.savings ?? 0) + (s3Result?.savings ?? 0);
  const extendSavings = s4Result?.savings ?? 0;

  // Annualize: build is one-time, others are annual
  const buildAllFrontier = buildResult?.allFrontier ?? 0;
  const buildTiered = buildResult?.tiered ?? 0;

  const runAllFrontier = (s2Result?.allFrontier ?? 0) + (s3Result?.allFrontier ?? 0);
  const runTiered = (s2Result?.tiered ?? 0) + (s3Result?.tiered ?? 0);

  const extendAllFrontier = s4Result?.allFrontier ?? 0;
  const extendTiered = s4Result?.tiered ?? 0;

  const totalAnnualAllFrontier = runAllFrontier + extendAllFrontier;
  const totalAnnualTiered = runTiered + extendTiered;
  const totalAnnualSavings = totalAnnualAllFrontier - totalAnnualTiered;

  const chartData = [
    {
      name: "Build (one-time)",
      "All-Frontier": buildAllFrontier,
      Tiered: buildTiered,
    },
    {
      name: "Run (annual)",
      "All-Frontier": runAllFrontier,
      Tiered: runTiered,
    },
    {
      name: "Extend (annual)",
      "All-Frontier": extendAllFrontier,
      Tiered: extendTiered,
    },
  ];

  const totalChartData = [
    {
      name: "Total Annual",
      "All-Frontier": totalAnnualAllFrontier,
      Tiered: totalAnnualTiered,
    },
  ];

  const handleCopy = () => {
    const lines = [
      "WealthAI Tokenomics Summary",
      "===========================",
      "",
      `Build (SDLC): All-Frontier ${fmtUSD(buildAllFrontier)} vs Tiered ${fmtUSD(buildTiered)} → Savings ${fmtUSD(buildSavings)} (one-time)`,
      `Run - In-App: All-Frontier ${fmtUSD(s2Result?.allFrontier ?? 0)}/yr vs Tiered ${fmtUSD(s2Result?.tiered ?? 0)}/yr → Savings ${fmtUSD(s2Result?.savings ?? 0)}/yr`,
      `Run - Multimodal: All-Frontier ${fmtUSD(s3Result?.allFrontier ?? 0)}/yr vs Tiered ${fmtUSD(s3Result?.tiered ?? 0)}/yr → Savings ${fmtUSD(s3Result?.savings ?? 0)}/yr`,
      `Extend - Agent: All-Frontier ${fmtUSD(s4Result?.allFrontier ?? 0)}/yr vs Tiered ${fmtUSD(s4Result?.tiered ?? 0)}/yr → Savings ${fmtUSD(s4Result?.savings ?? 0)}/yr`,
      "",
      `Total Annual Savings: ${fmtUSD(totalAnnualSavings)}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTooltip = (value: number) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const notes = [SELLER_NOTES.s1, SELLER_NOTES.s2, SELLER_NOTES.s3, SELLER_NOTES.s4];

  return (
    <section id="summary" className="bg-[#F8F9FA] border-t border-[#E8EAED]">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#202124] mb-3">
              Lifecycle Summary
            </h2>
            <p className="text-[#5F6368] text-lg max-w-xl">
              Accumulated savings across Build → Run → Extend, driven by your
              current slider configurations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="btn-secondary text-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Seller Notes
              {showNotes ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <button onClick={handleCopy} className="btn-secondary text-xs">
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#188038]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied!" : "Copy Summary"}
            </button>
            <button onClick={resetAll} className="btn-secondary text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Seller Notes */}
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {notes.map((n, i) => (
              <div key={i} className="card bg-white">
                <h4 className="text-sm font-bold text-[#202124] mb-2">
                  {n.title}
                </h4>
                <p className="text-xs text-[#5F6368] mb-3 leading-relaxed">
                  {n.note}
                </p>
                <div className="text-xs font-semibold text-[#1A73E8] italic">
                  &ldquo;{n.oneLiner}&rdquo;
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Hero stat */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E6F4EA] rounded-full mb-4">
            <div className="w-2 h-2 rounded-full bg-[#188038]" />
            <span className="text-xs font-bold text-[#188038] uppercase tracking-wider">
              Total Annual Savings
            </span>
          </div>
          <div className="stat-huge text-[#188038]">
            <AnimatedNumber value={totalAnnualSavings} />
          </div>
          {totalAnnualAllFrontier > 0 && (
            <p className="text-sm text-[#5F6368] mt-2">
              {pctSavings(totalAnnualAllFrontier, totalAnnualTiered).toFixed(0)}%
              reduction vs all-frontier approach
            </p>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* By lifecycle phase */}
          <div className="card bg-white">
            <h3 className="text-sm font-bold text-[#202124] mb-6 uppercase tracking-wider">
              Cost by Lifecycle Phase
            </h3>
            <ResponsiveContainer width="100%" height={300} minWidth={0} initialDimension={{ width: 800, height: 300 }}>
              <BarChart data={chartData} barGap={4}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#5F6368" }}
                  axisLine={{ stroke: "#E8EAED" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#5F6368" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatTooltip}
                />
                <Tooltip
                  formatter={(value: unknown) => formatTooltip(Number(value))}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E8EAED",
                    fontSize: 12,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar dataKey="All-Frontier" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#E37400" />
                  ))}
                </Bar>
                <Bar dataKey="Tiered" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#188038" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Total */}
          <div className="card bg-white">
            <h3 className="text-sm font-bold text-[#202124] mb-6 uppercase tracking-wider">
              Total Annual Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300} minWidth={0} initialDimension={{ width: 800, height: 300 }}>
              <BarChart data={totalChartData} barSize={80} barGap={16}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#5F6368" }}
                  axisLine={{ stroke: "#E8EAED" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#5F6368" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatTooltip}
                />
                <Tooltip
                  formatter={(value: unknown) => formatTooltip(Number(value))}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E8EAED",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="All-Frontier" radius={[4, 4, 0, 0]} fill="#E37400" />
                <Bar dataKey="Tiered" radius={[4, 4, 0, 0]} fill="#188038" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-scenario breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: "s1", label: "Build (SDLC)", period: "one-time" },
            { key: "s2", label: "Run: In-App", period: "annual" },
            { key: "s3", label: "Run: Multimodal", period: "annual" },
            { key: "s4", label: "Extend: Agent", period: "annual" },
          ].map(({ key, label, period }) => {
            const r = results[key];
            return (
              <div key={key} className="card bg-white">
                <div className="text-xs font-bold text-[#5F6368] uppercase tracking-wider mb-3">
                  {label}
                </div>
                {r ? (
                  <>
                    <div className="text-2xl font-bold text-[#188038] tabular-nums mb-1">
                      {fmtUSD(r.savings)}
                    </div>
                    <div className="text-xs text-[#5F6368] mb-3">
                      saved ({period}) —{" "}
                      {pctSavings(r.allFrontier, r.tiered).toFixed(0)}% reduction
                    </div>
                    <div className="flex justify-between text-xs text-[#5F6368]">
                      <span>
                        Frontier:{" "}
                        <span className="text-[#E37400] font-semibold">
                          {fmtUSD(r.allFrontier)}
                        </span>
                      </span>
                      <span>
                        Tiered:{" "}
                        <span className="text-[#188038] font-semibold">
                          {fmtUSD(r.tiered)}
                        </span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-[#9AA0A6]">Scroll to activate</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
