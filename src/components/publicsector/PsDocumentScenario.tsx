"use client";

import { useState, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { FileText, Zap, CheckCircle2 } from "lucide-react";
import { fmtUSD, pctSavings } from "@/lib/pricing";
import { PS_S3, PS_S3_CARDS, psS3Costs, type GovDocCard } from "@/lib/industries/publicsector";
import { useTally } from "@/lib/tally-context";

const INDIGO = "#4F46E5";
const BLUE   = "#1A73E8";
const AMBER  = "#E37400";
const GREEN  = "#188038";

type LaneKey = "pureClaude" | "pureGemini" | "hybrid";

const LANE_CONFIG: Record<LaneKey, { label: string; color: string; badge?: string }> = {
  pureClaude: { label: "Pure Claude Opus",                   color: AMBER  },
  hybrid:     { label: "Hybrid — Flash extract → Opus analyze", color: INDIGO, badge: "Best Value" },
  pureGemini: { label: "Pure Gemini Flash",                  color: BLUE   },
};

function ProgressBar({ latencyMs, maxMs, color, isRunning, done }: {
  latencyMs: number; maxMs: number; color: string; isRunning: boolean; done: boolean;
}) {
  const [pct, setPct] = useState(0);
  const ctrl = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (isRunning) {
      ctrl.current = animate(0, 100, {
        duration: latencyMs / 1000,
        ease: "linear",
        onUpdate: (v) => setPct(v),
      });
    } else {
      ctrl.current?.stop();
      setPct(done ? 100 : 0);
    }
    return () => ctrl.current?.stop();
  }, [isRunning, done, latencyMs]);

  return (
    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
        transition={{ duration: 0.05 }}
      />
    </div>
  );
}

export default function PsDocumentScenario() {
  const { updateResult } = useTally();
  const [selectedDoc, setSelectedDoc] = useState<GovDocCard>(PS_S3_CARDS[0]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<Set<LaneKey>>(new Set());
  const [docsPerYear, setDocsPerYear] = useState(PS_S3.defaults.documentsPerYear);

  const costs = psS3Costs();
  const annualPureClaude = costs.pureClaude * docsPerYear;
  const annualHybrid     = costs.hybrid     * docsPerYear;
  const annualPureGemini = costs.pureGemini * docsPerYear;

  useEffect(() => {
    updateResult("s3", {
      label: "Document Processing",
      allFrontier: annualPureClaude,
      tiered: annualHybrid,
      savings: annualPureClaude - annualHybrid,
      period: "annual",
    });
  }, [annualPureClaude, annualHybrid, updateResult]);

  const handleRace = () => {
    setDone(new Set());
    setRunning(true);
    const lanes: LaneKey[] = ["pureClaude", "pureGemini", "hybrid"];
    lanes.forEach((key) => {
      setTimeout(() => {
        setDone((prev) => new Set([...prev, key]));
      }, PS_S3.lanes[key].latencyMs);
    });
    const maxMs = Math.max(...Object.values(PS_S3.lanes).map((l) => l.latencyMs));
    setTimeout(() => setRunning(false), maxMs);
  };

  const fmtMs = (ms: number) => ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
  const fmtDocs = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(0)}K`;

  const orderedLanes: LaneKey[] = ["pureClaude", "hybrid", "pureGemini"];

  return (
    <section id="ps-document" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="relative max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: INDIGO + "12", color: INDIGO }}>
            <FileText size={16} /> Scenario 3 — Run Phase
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">Government Document Processing</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Flash reads 1,842 FOIA pages in 0.7 seconds and flags redaction candidates.
            Opus interprets attorney-client privilege. You need both.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT: doc selector + findings */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Select a document type</p>
            <div className="space-y-2">
              {PS_S3_CARDS.map((doc) => (
                <button key={doc.id} onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                    selectedDoc.id === doc.id ? "shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  style={selectedDoc.id === doc.id ? { borderColor: INDIGO, background: INDIGO + "06" } : {}}>
                  <div className="flex items-start gap-3">
                    <FileText size={16} className="mt-0.5 shrink-0" style={{ color: selectedDoc.id === doc.id ? INDIGO : "#9CA3AF" }} />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{doc.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.tags.slice(0, 4).map((t) => (
                          <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Findings table */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">Extracted Findings — {selectedDoc.title}</span>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-gray-400 uppercase tracking-wide text-[10px]">Item</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-400 uppercase tracking-wide text-[10px]">Status</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-400 uppercase tracking-wide text-[10px]">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDoc.findings.map((f, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-2.5 font-medium text-gray-700">{f.item}</td>
                      <td className="px-4 py-2.5 text-gray-600">{f.status}</td>
                      <td className="px-4 py-2.5 font-medium" style={{
                        color: f.trend.startsWith("↑") ? AMBER : f.trend.startsWith("✓") ? GREEN : "#6B7280"
                      }}>{f.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* RIGHT: pipeline race + cost */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6">
            {/* Pipeline race */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold text-gray-800">Processing Pipeline Race</p>
                <button onClick={handleRace} disabled={running}
                  className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-50"
                  style={{ background: running ? "#9CA3AF" : INDIGO }}>
                  <Zap size={12} /> {running ? "Processing…" : "Run Pipeline"}
                </button>
              </div>
              <div className="space-y-5">
                {orderedLanes.map((key) => {
                  const lane = PS_S3.lanes[key];
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
                            {fmtMs(lane.latencyMs)}
                          </span>
                        </div>
                      </div>
                      <ProgressBar
                        latencyMs={lane.latencyMs}
                        maxMs={PS_S3.lanes.pureClaude.latencyMs}
                        color={cfg.color}
                        isRunning={running}
                        done={isDone}
                      />
                      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                        <span>Quality: {"★".repeat(lane.quality)}{"☆".repeat(5 - lane.quality)}</span>
                        <span>{fmtUSD(costs[key], 4)}/doc</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Volume + annual cost */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Documents / Year</p>
                <span className="text-lg font-bold tabular-nums" style={{ color: INDIGO }}>{fmtDocs(docsPerYear)}</span>
              </div>
              <input type="range" min={100_000} max={10_000_000} step={100_000} value={docsPerYear}
                onChange={(e) => setDocsPerYear(Number(e.target.value))}
                className="w-full h-2 cursor-pointer accent-indigo-600 mb-4" />
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: "Pure Opus",   val: annualPureClaude, color: AMBER  },
                  { label: "Hybrid",      val: annualHybrid,     color: INDIGO },
                  { label: "Pure Flash",  val: annualPureGemini, color: BLUE   },
                ].map((r) => (
                  <div key={r.label} className="rounded-lg border border-gray-100 p-2.5 text-center">
                    <p className="text-[10px] text-gray-400 mb-0.5">{r.label}</p>
                    <p className="font-bold tabular-nums" style={{ color: r.color }}>{fmtUSD(r.val)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings callout */}
            <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, #312E81 100%)` }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-1">Hybrid vs Pure Opus</p>
              <p className="text-3xl font-extrabold text-white tabular-nums mb-1">
                {fmtUSD(annualPureClaude - annualHybrid)} saved/yr
              </p>
              <p className="text-indigo-300 text-sm">
                {pctSavings(annualPureClaude, annualHybrid).toFixed(0)}% reduction at {fmtDocs(docsPerYear)} docs/year ·
                same Opus quality on compliance analysis
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
