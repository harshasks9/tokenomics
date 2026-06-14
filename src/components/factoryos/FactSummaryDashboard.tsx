"use client";

import { useTally } from "@/lib/tally-context";
import { pctSavings } from "@/lib/pricing";
import { FACT_SELLER_NOTES } from "@/lib/industries/factoryos";
import { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw, Copy, ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from "lucide-react";
import AgentEconomicsCta from "@/components/enterprise-lens/AgentEconomicsCta";

const AMBER  = "#E37400";
const INDIGO = "#4F46E5";
const GREEN  = "#188038";

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

export default function FactSummaryDashboard() {
  const { results, resetAll } = useTally();
  const [showNotes, setShowNotes] = useState(false);
  const [copied, setCopied]       = useState(false);

  const s1 = results["s1"];
  const s2 = results["s2"];
  const s3 = results["s3"];
  const s4 = results["s4"];

  const buildAllFrontier  = s1?.allFrontier ?? 0;
  const buildTiered       = s1?.tiered      ?? 0;
  const runAllFrontier    = (s2?.allFrontier ?? 0) + (s3?.allFrontier ?? 0);
  const runTiered         = (s2?.tiered      ?? 0) + (s3?.tiered      ?? 0);
  const extendAllFrontier = s4?.allFrontier  ?? 0;
  const extendTiered      = s4?.tiered       ?? 0;

  const totalAnnualAll     = runAllFrontier + extendAllFrontier;
  const totalAnnualTiered  = runTiered + extendTiered;
  const totalAnnualSavings = totalAnnualAll - totalAnnualTiered;

  const chartData = [
    { name: "Build (one-time)",  "All-Frontier": buildAllFrontier,  Tiered: buildTiered  },
    { name: "Run (annual)",      "All-Frontier": runAllFrontier,    Tiered: runTiered    },
    { name: "Extend (annual)",   "All-Frontier": extendAllFrontier, Tiered: extendTiered },
  ];

  const fmtT = (v: number) =>
    v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000   ? `$${(v / 1_000).toFixed(0)}K`
    : `$${v.toFixed(0)}`;

  const handleCopy = () => {
    const lines = [
      "FactoryOS AI Tokenomics Summary",
      "================================",
      "",
      `S1 Build: All-Opus ${fmtT(buildAllFrontier)} vs Tiered ${fmtT(buildTiered)} → ${fmtT(buildAllFrontier - buildTiered)} saved (one-time)`,
      `S2 Floor Assistant: All-Opus ${fmtT(s2?.allFrontier ?? 0)}/yr vs Tiered ${fmtT(s2?.tiered ?? 0)}/yr → ${fmtT(s2?.savings ?? 0)}/yr`,
      `S3 Quality Inspection: All-Opus ${fmtT(s3?.allFrontier ?? 0)}/yr vs Tiered ${fmtT(s3?.tiered ?? 0)}/yr → ${fmtT(s3?.savings ?? 0)}/yr`,
      `S4 Predictive Maintenance: All-Opus ${fmtT(s4?.allFrontier ?? 0)}/yr vs Tiered ${fmtT(s4?.tiered ?? 0)}/yr → ${fmtT(s4?.savings ?? 0)}/yr`,
      "",
      `Total Annual Savings: ${fmtT(totalAnnualSavings)}`,
      "",
      "Key insight: Factory codebases are 55% boilerplate — 64% build savings, highest of any vertical.",
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };

  const sellerNotes = [FACT_SELLER_NOTES.s1, FACT_SELLER_NOTES.s2, FACT_SELLER_NOTES.s3, FACT_SELLER_NOTES.s4];

  return (
    <section id="fact-summary" className="bg-[#F8F9FA] border-t border-[#E8EAED]">
      <div className="section-container">
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#202124] mb-2">Lifecycle Summary</h2>
            <p className="text-[#5F6368] text-lg max-w-xl">
              FactoryOS savings across Build → Run → Extend, at your current slider settings.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowNotes(!showNotes)} className="btn-secondary">
              <BookOpen className="w-3.5 h-3.5" /> Seller Notes
              {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
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

        {showNotes && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {sellerNotes.map((n, i) => (
              <div key={i} className="card bg-white">
                <h4 className="text-sm font-bold text-[#202124] mb-2">{n.title}</h4>
                <p className="text-xs text-[#5F6368] mb-2 leading-relaxed"><strong>Assumption:</strong> {n.assumption}</p>
                <div className="text-xs font-semibold italic" style={{ color: AMBER }}>&ldquo;{n.sayThis}&rdquo;</div>
              </div>
            ))}
          </motion.div>
        )}

        <AgentEconomicsCta />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Build Savings (one-time)", all: buildAllFrontier,  tiered: buildTiered,  savings: buildAllFrontier - buildTiered   },
            { label: "Run Savings (annual)",     all: runAllFrontier,    tiered: runTiered,    savings: runAllFrontier - runTiered       },
            { label: "Extend Savings (annual)",  all: extendAllFrontier, tiered: extendTiered, savings: extendAllFrontier - extendTiered },
          ].map((row) => (
            <div key={row.label} className="card">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] mb-3">{row.label}</p>
              <div className="flex items-end gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-[#9AA0A6] mb-0.5">All-Frontier</p>
                  <p className="text-lg font-bold text-[#E37400]">{fmtT(row.all)}</p>
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
            <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${AMBER} 0%, #7c2d12 100%)` }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-orange-200 mb-2">Total Annual Savings</p>
              <p className="text-5xl font-extrabold text-white mb-1">
                <AnimNumber value={totalAnnualSavings} />
              </p>
              <p className="text-orange-200 text-sm">
                {totalAnnualAll > 0
                  ? `${pctSavings(totalAnnualAll, totalAnnualTiered).toFixed(0)}% reduction on Run + Extend phases`
                  : "Interact with the scenarios above to see your savings"}
              </p>
            </div>

            <div className="card space-y-3">
              <h4 className="text-sm font-bold text-[#202124]">By Scenario</h4>
              {[
                { key: "s1", label: "S1 IoT Platform Build",   result: s1 },
                { key: "s2", label: "S2 Floor Assistant",       result: s2 },
                { key: "s3", label: "S3 Quality Inspection",    result: s3 },
                { key: "s4", label: "S4 Predictive Maint.",     result: s4 },
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
          </div>
        </div>
      </div>
    </section>
  );
}
