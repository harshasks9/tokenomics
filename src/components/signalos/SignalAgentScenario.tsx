"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Bot, Cpu, ShieldCheck, ChevronRight, X } from "lucide-react";
import { fmtUSD, pctSavings } from "@/lib/pricing";
import { SIG_S4, SIG_S4_TRACE, sigS4Costs, sigS4Annual, type SigS4Config, type SigAgentNode } from "@/lib/industries/signalos";
import { useTally } from "@/lib/tally-context";

const SKY   = "#0284C7";
const BLUE  = "#1A73E8";
const AMBER = "#E37400";
const INDIGO = "#4F46E5";

function nodeColor(node: SigAgentNode, cfg: SigS4Config): string {
  if (node.role === "planner" || node.role === "reviewer") return AMBER;
  return cfg === "allOpus" ? AMBER : BLUE;
}

function roleIcon(role: SigAgentNode["role"]) {
  if (role === "planner")  return <Bot className="h-4 w-4" />;
  if (role === "reviewer") return <ShieldCheck className="h-4 w-4" />;
  return <Cpu className="h-4 w-4" />;
}

function NodePopover({ node, cfg, onClose }: { node: SigAgentNode; cfg: SigS4Config; onClose: () => void }) {
  const color = nodeColor(node, cfg);
  const modelLabel = node.role !== "executor" ? "Claude Opus 4.8" : cfg === "allOpus" ? "Claude Opus 4.8" : "Gemini 3.5 Flash";
  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }} transition={{ duration: 0.15 }}
      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg border border-gray-200 bg-white shadow-xl p-4">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X className="h-3.5 w-3.5" /></button>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Step {node.id}</p>
      <p className="text-sm font-bold text-gray-900 mb-3">{node.label}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-gray-500">Model</span><span className="font-semibold" style={{ color }}>{modelLabel}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Input tokens</span><span className="font-mono tabular-nums text-gray-700">{node.inTok.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Output tokens</span><span className="font-mono tabular-nums text-gray-700">{node.outTok.toLocaleString()}</span></div>
      </div>
    </motion.div>
  );
}

function TraceNode({ node, index, cfg, isVisible, selectedId, onSelect }: {
  node: SigAgentNode; index: number; cfg: SigS4Config; isVisible: boolean;
  selectedId: number | null; onSelect: (id: number | null) => void;
}) {
  const color = nodeColor(node, cfg);
  const isSelected = selectedId === node.id;
  return (
    <motion.div className="relative"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0.15, scale: 0.85 }}
      transition={{ duration: 0.4, delay: isVisible ? index * 0.06 : 0, ease: "easeOut" }}>
      <button onClick={() => onSelect(isSelected ? null : node.id)}
        className="group relative flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left transition-all cursor-pointer"
        style={{
          backgroundColor: color + "12",
          border: `1.5px solid ${isSelected ? color : color + "40"}`,
          boxShadow: isSelected ? `0 0 0 2px ${color}30` : "none",
        }}>
        <motion.span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }}
          initial={{ scale: 0 }} animate={isVisible ? { scale: [0, 1.3, 1] } : { scale: 0 }}
          transition={{ duration: 0.3, delay: index * 0.06 + 0.3 }} />
        <span style={{ color }} className="shrink-0">{roleIcon(node.role)}</span>
        <span className="text-xs font-medium text-gray-800 leading-tight line-clamp-2">{node.label}</span>
      </button>
      <AnimatePresence>
        {isSelected && <NodePopover node={node} cfg={cfg} onClose={() => onSelect(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SignalAgentScenario() {
  const { updateResult } = useTally();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" });

  const [cfg, setCfg]             = useState<SigS4Config>("tiered");
  const [sites, setSites]         = useState(SIG_S4.defaults.sitesPerRun);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const costsAllOpus  = sigS4Costs("allOpus");
  const costsTiered   = sigS4Costs("tiered");
  const annualAllOpus = sigS4Annual(sites, "allOpus");
  const annualTiered  = sigS4Annual(sites, "tiered");

  useEffect(() => {
    updateResult("s4", {
      label: "Network Operations Agent",
      allFrontier: annualAllOpus,
      tiered: annualTiered,
      savings: annualAllOpus - annualTiered,
      period: "annual",
    });
  }, [annualAllOpus, annualTiered, updateResult]);

  const handleSelect = useCallback((id: number | null) => setSelectedId(id), []);
  const fmtSites = (v: number) => v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v.toString();

  const planner   = SIG_S4_TRACE.filter((n) => n.role === "planner");
  const executors = SIG_S4_TRACE.filter((n) => n.role === "executor");
  const reviewer  = SIG_S4_TRACE.filter((n) => n.role === "reviewer");
  const chosen    = cfg === "allOpus" ? costsAllOpus : costsTiered;

  return (
    <section id="sig-agent" ref={sectionRef} className="relative w-full bg-gray-50/50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase"
              style={{ background: SKY + "15", color: SKY }}>Scenario 4</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">Extend Phase</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Network Operations Agent</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Monitors 50,000 cell sites 4× per day — pulling KPI metrics, anomaly alerts, incident tickets,
            and config changes. 14 data-fetch steps run on Flash; site prioritization and dispatch decisions
            stay on Opus where PSTN-safety matters.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          {/* LEFT: trace */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6">
            <div className="flex gap-2">
              {(["tiered", "allOpus"] as SigS4Config[]).map((c) => (
                <button key={c} onClick={() => setCfg(c)}
                  className="rounded-lg px-4 py-1.5 text-xs font-semibold transition-all border"
                  style={{
                    backgroundColor: cfg === c ? (c === "tiered" ? SKY : AMBER) + "15" : "transparent",
                    borderColor: cfg === c ? (c === "tiered" ? SKY : AMBER) : "#e2e8f0",
                    color: cfg === c ? (c === "tiered" ? SKY : AMBER) : "#64748b",
                  }}>
                  {c === "tiered" ? "Gemini Tiered (Recommended)" : "All Opus"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Planner — Opus</p>
                <div className="grid grid-cols-1 gap-2">
                  {planner.map((node, i) => (
                    <TraceNode key={node.id} node={node} index={i} cfg={cfg} isVisible={isInView} selectedId={selectedId} onSelect={handleSelect} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-300 pl-2"><ChevronRight className="h-4 w-4" /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Executors ({SIG_S4.steps}) — {cfg === "allOpus" ? "Opus" : "Gemini Flash"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {executors.map((node, i) => (
                    <TraceNode key={node.id} node={node} index={i + 1} cfg={cfg} isVisible={isInView} selectedId={selectedId} onSelect={handleSelect} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-300 pl-2"><ChevronRight className="h-4 w-4" /></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Reviewer — Opus</p>
                <div className="grid grid-cols-1 gap-2">
                  {reviewer.map((node, i) => (
                    <TraceNode key={node.id} node={node} index={SIG_S4.steps + 2} cfg={cfg} isVisible={isInView} selectedId={selectedId} onSelect={handleSelect} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 italic">Click any node to inspect token counts and cost</p>
          </motion.div>

          {/* RIGHT: cost panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">Cost per site run</p>
              {[
                { label: "Planner (Opus)",   val: chosen.plannerCost,  color: AMBER },
                { label: `Executors ×${SIG_S4.steps} (${cfg === "allOpus" ? "Opus" : "Flash"})`, val: chosen.executorCost, color: cfg === "allOpus" ? AMBER : BLUE },
                { label: "Reviewer (Opus)",  val: chosen.reviewCost,   color: AMBER },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-xs text-gray-600">{r.label}</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color: r.color }}>{fmtUSD(r.val, 5)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 mt-1">
                <span className="text-sm font-bold text-gray-900">Total / site</span>
                <span className="text-sm font-extrabold tabular-nums" style={{ color: cfg === "allOpus" ? AMBER : INDIGO }}>
                  {fmtUSD(chosen.total, 5)}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Savings vs all-Opus: {fmtUSD(costsAllOpus.total - costsTiered.total, 5)}/site ({pctSavings(costsAllOpus.total, costsTiered.total).toFixed(0)}%)
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Sites / Run</p>
                <span className="text-lg font-bold tabular-nums" style={{ color: SKY }}>{fmtSites(sites)}</span>
              </div>
              <input type="range" min={1000} max={200_000} step={1000} value={sites}
                onChange={(e) => setSites(Number(e.target.value))}
                className="w-full h-2 cursor-pointer accent-sky-600 mb-2" />
              <div className="flex justify-between text-[10px] text-gray-400"><span>1K</span><span>200K</span></div>
              <p className="mt-2 text-[10px] text-gray-400">{SIG_S4.defaults.runsPerDay} runs/day · {SIG_S4.defaults.daysPerYear} days/yr</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Annual Cost</p>
              {[
                { label: "All Opus",      val: annualAllOpus, color: AMBER  },
                { label: "Gemini Tiered", val: annualTiered,  color: INDIGO },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{r.label}</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: r.color }}>{fmtUSD(r.val)}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${SKY} 0%, #075985 100%)` }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-200 mb-1">Annual Savings</p>
              <p className="text-4xl font-extrabold text-white tabular-nums mb-1">
                {fmtUSD(annualAllOpus - annualTiered)}
              </p>
              <p className="text-sky-200 text-sm">
                {pctSavings(annualAllOpus, annualTiered).toFixed(0)}% reduction ·
                Opus on 2 of {SIG_S4.steps + 2} steps only
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
