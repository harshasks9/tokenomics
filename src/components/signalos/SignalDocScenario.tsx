"use client";

import { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { FileText, Zap, CheckCircle2 } from "lucide-react";
import { callCost, fmtUSD, pctSavings } from "@/lib/pricing";
import { useTally } from "@/lib/tally-context";

const SKY   = "#0284C7";
const BLUE  = "#1A73E8";
const AMBER = "#E37400";
const INDIGO = "#4F46E5";
const GREEN  = "#188038";

interface ContractDoc {
  id: string;
  label: string;
  pages: number;
  inTok: number;
  tags: string[];
}

const DOCS: ContractDoc[] = [
  { id: "sla",         label: "Enterprise Network SLA",         pages: 45,  inTok: 80_000,  tags: ["uptime", "SLA credits", "99.95%"] },
  { id: "carrier",     label: "Carrier Interconnect Agreement", pages: 87,  inTok: 150_000, tags: ["peering", "traffic limits", "settlement"] },
  { id: "mvno",        label: "MVNO Service Contract",          pages: 68,  inTok: 120_000, tags: ["revenue share", "ARPU", "device subsidy"] },
  { id: "roaming",     label: "Roaming Partner Agreement",      pages: 32,  inTok: 60_000,  tags: ["rate cards", "TAP records", "dispute window"] },
];

type LaneKey = "pureOpus" | "hybrid" | "flashOnly";

const LANE_CONFIG: Record<LaneKey, { label: string; color: string; badge?: string; quality: number }> = {
  pureOpus:  { label: "Pure Opus",                                    color: AMBER, quality: 5 },
  hybrid:    { label: "Flash scan → Opus extract",                    color: INDIGO, badge: "Best Value", quality: 5 },
  flashOnly: { label: "Flash only",                                   color: BLUE,  quality: 3 },
};

function docCosts(inTok: number) {
  const pureOpus  = callCost("opus",  inTok, 4000);
  const hybrid    = callCost("flash", inTok, 1000) + callCost("opus", 1000, 3000);
  const flashOnly = callCost("flash", inTok, 2000);
  return { pureOpus, hybrid, flashOnly };
}

const LATENCY: Record<LaneKey, number> = {
  pureOpus:  7000,
  hybrid:    4200,
  flashOnly: 2600,
};

function ProgressBar({ latencyMs, color, isRunning, done }: {
  latencyMs: number; color: string; isRunning: boolean; done: boolean;
}) {
  const [pct, setPct] = useState(0);
  const ctrl = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (isRunning) {
      ctrl.current = animate(0, 100, {
        duration: latencyMs / 1000, ease: "linear", onUpdate: (v) => setPct(v),
      });
    } else {
      ctrl.current?.stop();
      setPct(done ? 100 : 0);
    }
    return () => ctrl.current?.stop();
  }, [isRunning, done, latencyMs]);

  return (
    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
      <motion.div className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }} transition={{ duration: 0.05 }} />
    </div>
  );
}

export default function SignalDocScenario() {
  const { updateResult } = useTally();
  const [selectedDoc, setSelectedDoc] = useState<ContractDoc>(DOCS[0]);
  const [running, setRunning]         = useState(false);
  const [done, setDone]               = useState<Set<LaneKey>>(new Set());
  const [contractsPerYear, setContractsPerYear] = useState(200);

  const costs = docCosts(selectedDoc.inTok);
  const annualPureOpus  = costs.pureOpus  * contractsPerYear;
  const annualHybrid    = costs.hybrid    * contractsPerYear;
  const annualFlashOnly = costs.flashOnly * contractsPerYear;

  useEffect(() => {
    updateResult("s3", {
      label: "Contract & SLA Analysis",
      allFrontier: annualPureOpus,
      tiered: annualHybrid,
      savings: annualPureOpus - annualHybrid,
      period: "annual",
    });
  }, [annualPureOpus, annualHybrid, updateResult]);

  const handleRace = () => {
    setDone(new Set());
    setRunning(true);
    const lanes: LaneKey[] = ["pureOpus", "hybrid", "flashOnly"];
    lanes.forEach((key) => {
      setTimeout(() => {
        setDone((prev) => new Set([...prev, key]));
      }, LATENCY[key]);
    });
    const maxMs = Math.max(...Object.values(LATENCY));
    setTimeout(() => setRunning(false), maxMs);
  };

  const fmtMs = (ms: number) => ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
  const fmtCount = (n: number) => n.toLocaleString();
  const orderedLanes: LaneKey[] = ["pureOpus", "hybrid", "flashOnly"];

  return (
    <section id="sig-contracts" className="relative py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: SKY + "12", color: SKY }}>
            <FileText size={16} /> Scenario 3 — Run Phase
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">Contract & SLA Analysis</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Flash scans 150-page carrier agreements in seconds to extract the relevant clauses.
            Opus reasons over those clauses to identify SLA breaches, unfavorable terms, and credit obligations.
            Pure Flash misses the nuances that cost millions in disputes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT: doc selector */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }} className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Select a contract type</p>
            <div className="space-y-2">
              {DOCS.map((doc) => (
                <button key={doc.id} onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                    selectedDoc.id === doc.id ? "shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  style={selectedDoc.id === doc.id ? { borderColor: SKY, background: SKY + "06" } : {}}>
                  <div className="flex items-start gap-3">
                    <FileText size={16} className="mt-0.5 shrink-0" style={{ color: selectedDoc.id === doc.id ? SKY : "#9CA3AF" }} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-900">{doc.label}</p>
                        <span className="text-[10px] text-gray-400">{doc.pages} pages · {(doc.inTok / 1000).toFixed(0)}K tokens</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((t) => (
                          <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-700 mb-3">Per-Document Cost — {selectedDoc.label}</p>
              {orderedLanes.map((key) => {
                const cfg = LANE_CONFIG[key];
                const costVal = costs[key];
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-gray-600">{cfg.label}</span>
                      {cfg.badge && (
                        <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                          style={{ background: cfg.color + "20", color: cfg.color }}>{cfg.badge}</span>
                      )}
                    </div>
                    <span className="font-bold tabular-nums" style={{ color: cfg.color }}>{fmtUSD(costVal, 3)}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT: pipeline race + cost */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold text-gray-800">Analysis Pipeline Race</p>
                <button onClick={handleRace} disabled={running}
                  className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: running ? "#9CA3AF" : SKY }}>
                  <Zap size={12} /> {running ? "Analyzing…" : "Run Analysis"}
                </button>
              </div>
              <div className="space-y-5">
                {orderedLanes.map((key) => {
                  const cfg = LANE_CONFIG[key];
                  const isDone = done.has(key);
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700">{cfg.label}</span>
                          {cfg.badge && (
                            <span className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                              style={{ background: cfg.color + "18", color: cfg.color }}>{cfg.badge}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isDone && <CheckCircle2 size={13} style={{ color: cfg.color }} />}
                          <span className="text-xs font-mono tabular-nums" style={{ color: cfg.color }}>
                            {fmtMs(LATENCY[key])}
                          </span>
                        </div>
                      </div>
                      <ProgressBar latencyMs={LATENCY[key]} color={cfg.color} isRunning={running} done={isDone} />
                      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                        <span>Quality: {"★".repeat(cfg.quality)}{"☆".repeat(5 - cfg.quality)}</span>
                        <span>{fmtUSD(costs[key], 3)}/contract</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Contracts / Year</p>
                <span className="text-lg font-bold tabular-nums" style={{ color: SKY }}>{fmtCount(contractsPerYear)}</span>
              </div>
              <input type="range" min={25} max={2000} step={25} value={contractsPerYear}
                onChange={(e) => setContractsPerYear(Number(e.target.value))}
                className="w-full h-2 cursor-pointer accent-sky-600 mb-4" />
              <div className="grid grid-cols-3 gap-2 text-xs">
                {([
                  { label: "Pure Opus", val: annualPureOpus,  color: AMBER  },
                  { label: "Hybrid",    val: annualHybrid,    color: INDIGO },
                  { label: "Flash",     val: annualFlashOnly, color: BLUE   },
                ] as const).map((r) => (
                  <div key={r.label} className="rounded-lg border border-gray-100 p-2.5 text-center">
                    <p className="text-[10px] text-gray-400 mb-0.5">{r.label}</p>
                    <p className="font-bold tabular-nums" style={{ color: r.color }}>{fmtUSD(r.val)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${SKY} 0%, #075985 100%)` }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-200 mb-1">Hybrid vs Pure Opus</p>
              <p className="text-3xl font-extrabold text-white tabular-nums mb-1">
                {fmtUSD(annualPureOpus - annualHybrid)} saved/yr
              </p>
              <p className="text-sky-200 text-sm">
                {pctSavings(annualPureOpus, annualHybrid).toFixed(0)}% reduction at {fmtCount(contractsPerYear)} contracts/yr ·
                same Opus-quality legal reasoning
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
