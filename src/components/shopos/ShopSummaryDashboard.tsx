"use client";

import { useTally } from "@/lib/tally-context";
import { fmtUSD, pctSavings } from "@/lib/pricing";
import { SHOP_SELLER_NOTES } from "@/lib/industries/shopos";
import { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { RotateCcw, Copy, ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from "lucide-react";
import AgentEconomicsCta from "@/components/enterprise-lens/AgentEconomicsCta";

function AnimNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const ctrl = animate(prev.current, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => ctrl.stop();
  }, [value]);
  const fmt = display >= 1_000_000 ? `$${(display / 1_000_000).toFixed(1)}M`
    : display >= 1_000 ? `$${(display / 1_000).toFixed(0)}K`
    : `$${display.toFixed(0)}`;
  return <span className="tabular-nums">{fmt}</span>;
}

export default function ShopSummaryDashboard() {
  const { results, resetAll } = useTally();
  const [showNotes, setShowNotes] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const totalAnnualAll    = runAllFrontier + extendAllFrontier;
  const totalAnnualTiered = runTiered      + extendTiered;
  const totalAnnualSavings = totalAnnualAll - totalAnnualTiered;

  const chartData = [
    { name: "Build (one-time)", "Opus + Sonnet": buildAllFrontier, "Opus + Gemini": buildTiered },
    { name: "Run (annual)", "Opus + Sonnet": runAllFrontier, "Opus + Gemini": runTiered },
    { name: "Extend (annual)", "Opus + Sonnet": extendAllFrontier, "Opus + Gemini": extendTiered },
  ];

  const fmtT = (v: number) => v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `$${(v / 1_000).toFixed(0)}K` : `$${v.toFixed(0)}`;

  const handleCopy = () => {
    const lines = [
      "ShopOS Tokenomics Summary",
      "=========================",
      "",
      `S1 Build: Opus + Sonnet ${fmtT(buildAllFrontier)} vs Opus + Gemini ${fmtT(buildTiered)} → ${fmtT(buildAllFrontier - buildTiered)} saved (one-time)`,
      `S2 Assistant: Opus + Sonnet ${fmtT(s2?.allFrontier ?? 0)}/yr vs Opus + Gemini ${fmtT(s2?.tiered ?? 0)}/yr → ${fmtT(s2?.savings ?? 0)}/yr`,
      `S3 Visual Search: Opus + Sonnet ${fmtT(s3?.allFrontier ?? 0)}/yr vs Opus + Gemini ${fmtT(s3?.tiered ?? 0)}/yr → ${fmtT(s3?.savings ?? 0)}/yr`,
      `S4 Agent: Opus + Sonnet ${fmtT(s4?.allFrontier ?? 0)}/yr vs Opus + Gemini ${fmtT(s4?.tiered ?? 0)}/yr → ${fmtT(s4?.savings ?? 0)}/yr`,
      "",
      `Total Annual Savings: ${fmtT(totalAnnualSavings)}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2_000);
  };

  const sellerNotes = [
    SHOP_SELLER_NOTES.s1,
    SHOP_SELLER_NOTES.s2,
    SHOP_SELLER_NOTES.s3,
    SHOP_SELLER_NOTES.s4,
  ];

  return (
    <section id="shop-summary" className="bg-[#F8F9FA] border-t border-[#E8EAED]">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#202124] mb-2">Lifecycle Summary</h2>
            <p className="text-[#5F6368] text-lg max-w-xl">
              ShopOS savings across Build → Run → Extend, at your current slider settings.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowNotes(!showNotes)} className="btn-secondary text-xs">
              <BookOpen className="w-3.5 h-3.5" />
              Seller Notes
              {showNotes ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <button onClick={handleCopy} className="btn-secondary text-xs">
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#188038]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Summary"}
            </button>
            <button onClick={resetAll} className="btn-secondary text-xs">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Seller Notes */}
        {showNotes && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {sellerNotes.map((n, i) => (
              <div key={i} className="card bg-white">
                <h4 className="text-sm font-bold text-[#202124] mb-2">{n.title}</h4>
                <p className="text-xs text-[#5F6368] mb-2 leading-relaxed"><strong>Assumption:</strong> {n.assumption}</p>
                <div className="text-xs font-semibold text-[#188038] italic">&ldquo;{n.sayThis}&rdquo;</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Hero stat */}
        <AgentEconomicsCta />

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E6F4EA] rounded-full mb-4">
            <div className="w-2 h-2 rounded-full bg-[#188038]" />
            <span className="text-xs font-bold text-[#188038] uppercase tracking-wider">Total Annual Savings</span>
          </div>
          <div className="stat-huge text-[#188038]">
            <AnimNumber value={totalAnnualSavings} />
          </div>
          {totalAnnualAll > 0 && (
            <p className="text-sm text-[#5F6368] mt-2">
              {pctSavings(totalAnnualAll, totalAnnualTiered).toFixed(0)}% reduction vs Opus + Sonnet
            </p>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="card bg-white">
            <h3 className="text-sm font-bold text-[#202124] mb-6 uppercase tracking-wider">Cost by Lifecycle Phase</h3>
            <ResponsiveContainer
              width="100%"
              height={280}
              minWidth={0}
              initialDimension={{ width: 800, height: 280 }}
            >
              <BarChart data={chartData} barGap={4}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5F6368" }} axisLine={{ stroke: "#E8EAED" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5F6368" }} axisLine={false} tickLine={false} tickFormatter={fmtT} />
                <Tooltip formatter={(v: unknown) => fmtT(Number(v))} contentStyle={{ borderRadius: 8, border: "1px solid #E8EAED", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
                <Bar dataKey="Opus + Sonnet" radius={[4, 4, 0, 0]} fill="#E37400" />
                <Bar dataKey="Opus + Gemini" radius={[4, 4, 0, 0]} fill="#188038" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card bg-white">
            <h3 className="text-sm font-bold text-[#202124] mb-6 uppercase tracking-wider">Per-Scenario Savings</h3>
            <div className="grid grid-cols-2 gap-4 h-[280px] content-start">
              {[
                { key: "s1", label: "Build", period: "one-time" },
                { key: "s2", label: "Assistant", period: "annual" },
                { key: "s3", label: "Visual Search", period: "annual" },
                { key: "s4", label: "Merch Agent", period: "annual" },
              ].map(({ key, label, period }) => {
                const r = results[key];
                return (
                  <div key={key} className="rounded-xl border border-[#E8EAED] p-4 bg-white">
                    <div className="text-[10px] font-bold text-[#5F6368] uppercase tracking-wider mb-2">{label}</div>
                    {r ? (
                      <>
                        <div className="text-xl font-bold text-[#188038] tabular-nums mb-0.5">{fmtT(r.savings)}</div>
                        <div className="text-[10px] text-[#5F6368]">saved ({period})</div>
                        <div className="text-[10px] text-[#188038] font-semibold">{pctSavings(r.allFrontier, r.tiered).toFixed(0)}% vs Opus + Sonnet</div>
                      </>
                    ) : (
                      <div className="text-sm text-[#9AA0A6]">Scroll to activate</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Assumptions note */}
        <div className="rounded-xl border border-[#E8EAED] bg-white p-5 text-xs text-[#5F6368] leading-relaxed">
          <p className="font-bold text-[#202124] mb-2 text-sm">Seller: validate these assumptions per retailer</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Monthly query volume (assistant): 15M/mo is a large retailer — adjust the S2 slider.</li>
            <li>SKUs processed nightly: 5K is mid-market. Catalogue size and change velocity drive this.</li>
            <li>Visual search interactions: 8M/yr assumes active mobile app with camera-search feature.</li>
            <li>Task mix (S1): 55/30/15 routine/mid/complex — adjust for platform maturity and greenfield vs. brownfield work.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
