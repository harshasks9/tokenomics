"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Cell, Legend,
} from "recharts";
import { Bot, Cpu, ShieldCheck, ChevronRight, X } from "lucide-react";
import { fmtUSD, pctSavings, MODELS } from "@/lib/pricing";
import { SHOP_S4, SHOP_S4_TRACE, shopS4Costs, shopS4Annual, type ShopS4Config, type ShopAgentNode } from "@/lib/industries/shopos";
import { useTally } from "@/lib/tally-context";

const FLASH_COLOR      = "#1A73E8";
const FLASH_LITE_COLOR = "#00ACC1";
const OPUS_COLOR       = "#7B61FF";   // competitor (Claude Opus)
const SONNET_COLOR     = "#9B59D1";
const GREEN            = "#188038";
const AMBER            = "#E37400";

const CONFIG_META: Record<ShopS4Config, { label: string; color: string; desc: string }> = {
  allOpus:        { label: "All Opus", color: OPUS_COLOR, desc: "Single-model quality ceiling" },
  opusSonnet:     { label: "Opus + Sonnet", color: SONNET_COLOR, desc: "Conventional two-tier baseline" },
  opusGemini:     { label: "Opus + Flash", color: GREEN, desc: "Opus plan+review, Flash executors — recommended" },
  opusGeminiLite: { label: "Opus + Flash-Lite", color: FLASH_LITE_COLOR, desc: "Maximum savings for tightly bounded executors" },
};

function modelColor(model: string): string {
  if (model === "flash")     return FLASH_COLOR;
  if (model === "flashLite") return FLASH_LITE_COLOR;
  if (model === "sonnet")    return SONNET_COLOR;
  return OPUS_COLOR;
}
function nodeColor(node: ShopAgentNode, cfg: ShopS4Config): string {
  const c = SHOP_S4.configs[cfg];
  if (node.role === "planner")  return modelColor(c.planner);
  if (node.role === "reviewer") return modelColor(c.review);
  return modelColor(c.executor);
}
function nodeBg(node: ShopAgentNode, cfg: ShopS4Config): string {
  const col = nodeColor(node, cfg);
  return col + "18";
}

function roleIcon(role: ShopAgentNode["role"]) {
  if (role === "planner")  return <Bot className="h-3.5 w-3.5" />;
  if (role === "reviewer") return <ShieldCheck className="h-3.5 w-3.5" />;
  return <Cpu className="h-3.5 w-3.5" />;
}

function NodePopover({ node, cfg, onClose }: { node: ShopAgentNode; cfg: ShopS4Config; onClose: () => void }) {
  const color = nodeColor(node, cfg);
  const model = SHOP_S4.configs[cfg][node.role === "executor" ? "executor" : node.role === "planner" ? "planner" : "review"];
  const cost = (node.inTok / 1e6) * MODELS[model].inPM + (node.outTok / 1e6) * MODELS[model].outPM;
  return (
    <motion.div initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg border border-gray-200 bg-white shadow-xl p-3">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X className="h-3 w-3" /></button>
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Step {node.id}</p>
      <p className="text-xs font-bold text-gray-900 mb-2">{node.label}</p>
      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-gray-500">Model</span>
          <span className="font-semibold" style={{ color }}>{MODELS[model].name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">In tokens</span>
          <span className="font-mono text-gray-700">{node.inTok.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Out tokens</span>
          <span className="font-mono text-gray-700">{node.outTok.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5">
          <span className="text-gray-500 font-semibold">Cost</span>
          <span className="font-mono font-bold text-gray-900">{fmtUSD(cost)}</span>
        </div>
      </div>
    </motion.div>
  );
}

function TraceNode({ node, index, cfg, isVisible, selectedId, onSelect }: {
  node: ShopAgentNode; index: number; cfg: ShopS4Config; isVisible: boolean; selectedId: number | null; onSelect: (id: number | null) => void;
}) {
  const color = nodeColor(node, cfg);
  const isSelected = selectedId === node.id;
  return (
    <motion.div className="relative"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0.15, scale: 0.85 }}
      transition={{ duration: 0.35, delay: isVisible ? index * 0.05 : 0, ease: "easeOut" }}>
      <button onClick={() => onSelect(isSelected ? null : node.id)}
        className="group relative flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-left w-full transition-all cursor-pointer"
        style={{ backgroundColor: nodeBg(node, cfg), border: `1.5px solid ${isSelected ? color : color + "40"}`,
          boxShadow: isSelected ? `0 0 0 2px ${color}30` : "none" }}>
        <motion.span className="absolute -top-1 -right-1 h-2 w-2 rounded-full" style={{ backgroundColor: color }}
          initial={{ scale: 0 }} animate={isVisible ? { scale: [0, 1.3, 1] } : { scale: 0 }}
          transition={{ duration: 0.25, delay: index * 0.05 + 0.2 }} />
        <span style={{ color }} className="shrink-0">{roleIcon(node.role)}</span>
        <span className="text-[10px] font-medium text-gray-800 leading-tight line-clamp-2">{node.label}</span>
      </button>
      <AnimatePresence>
        {isSelected && <NodePopover node={node} cfg={cfg} onClose={() => onSelect(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ShopAgentScenario() {
  const { updateResult } = useTally();
  const [cfg, setCfg] = useState<ShopS4Config>("opusGemini");
  const [skus, setSkus] = useState(SHOP_S4.defaults.skusPerNight);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const traceRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(traceRef, { once: true, margin: "-80px" });

  const allConfigs: ShopS4Config[] = ["allOpus", "opusSonnet", "opusGemini", "opusGeminiLite"];
  const costsMap = useMemo(() => Object.fromEntries(allConfigs.map((c) => [c, shopS4Costs(c)])) as Record<ShopS4Config, ReturnType<typeof shopS4Costs>>, []);
  const annualMap = useMemo(() => Object.fromEntries(allConfigs.map((c) => [c, shopS4Annual(skus, c)])) as Record<ShopS4Config, number>, [skus]);

  const perRun = costsMap[cfg].total;
  const annualCost = annualMap[cfg];
  const tieredAnnual = annualMap["opusGemini"];

  const planner  = SHOP_S4_TRACE.filter((n) => n.role === "planner");
  const executors = SHOP_S4_TRACE.filter((n) => n.role === "executor");
  const reviewer = SHOP_S4_TRACE.filter((n) => n.role === "reviewer");

  useEffect(() => {
    updateResult("s4", {
      label: "Merchandising Agent (Annual)",
      allFrontier: annualMap["opusSonnet"],
      tiered: tieredAnnual,
      savings: annualMap["opusSonnet"] - tieredAnnual,
      period: "annual",
    });
  }, [annualMap, tieredAnnual, updateResult]);

  // Bar chart: all 4 configs side by side
  const barData = allConfigs.map((c) => ({
    name: CONFIG_META[c].label,
    cost: costsMap[c].total,
    color: CONFIG_META[c].color,
    active: c === cfg,
  }));

  const annualBar = allConfigs.map((c) => ({
    name: CONFIG_META[c].label,
    cost: annualMap[c],
    color: CONFIG_META[c].color,
    active: c === cfg,
  }));

  return (
    <section id="shop-agent" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/40">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">Extend · Scenario 4</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Nightly Merchandising Agent</h2>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Runs only on SKUs needing attention — new items, stockouts, price moves.
            Compare one single-model deployment with three tiered routes. <strong className="text-gray-700">16 executor steps</strong> per SKU dominate total cost — Opus keeps the pricing call while the executor tier changes.
          </p>
        </motion.div>

        {/* Config selector */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <span className="text-sm font-medium text-gray-500">Strategy:</span>
          {allConfigs.map((c) => (
            <button key={c} onClick={() => setCfg(c)}
              className="rounded-lg px-4 py-1.5 text-sm font-semibold border transition-all"
              style={{
                backgroundColor: cfg === c ? CONFIG_META[c].color + "15" : "transparent",
                borderColor: cfg === c ? CONFIG_META[c].color : "#e2e8f0",
                color: cfg === c ? CONFIG_META[c].color : "#64748b",
              }}>
              {CONFIG_META[c].label}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-2">
            Per SKU: <span className="font-mono font-semibold text-gray-600 tabular-nums">{fmtUSD(perRun)}</span>
          </span>
        </div>

        {/* Agent trace */}
        <div ref={traceRef} className="mb-12 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Agent Execution Trace</span>
            <span className="text-xs text-gray-300 ml-auto">Click node for details</span>
          </div>

          <div className="flex items-start gap-4 min-w-[720px]">
            {/* Planner */}
            <div className="flex flex-col items-center gap-2 shrink-0 w-[140px]">
              <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Planner</div>
              {planner.map((n, i) => (
                <TraceNode key={n.id} node={n} index={i} cfg={cfg} isVisible={isInView} selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
              ))}
              <div className="mt-1 text-[9px] font-mono tabular-nums text-gray-400">{fmtUSD(costsMap[cfg].plannerCost, 4)}</div>
            </div>

            <motion.div className="flex items-center text-gray-300" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 0.3 }}>
              <ChevronRight className="h-5 w-5" />
            </motion.div>

            {/* Executors */}
            <div className="flex-1">
              <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 text-center">Executors × {executors.length}</div>
              <div className="grid grid-cols-4 gap-1.5">
                {executors.map((n, i) => (
                  <TraceNode key={n.id} node={n} index={i + 1} cfg={cfg} isVisible={isInView} selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
                ))}
              </div>
              <div className="mt-2 text-[9px] font-mono tabular-nums text-gray-400 text-center">{fmtUSD(costsMap[cfg].executorCost, 4)} total</div>
            </div>

            <motion.div className="flex items-center text-gray-300" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: 1.2 }}>
              <ChevronRight className="h-5 w-5" />
            </motion.div>

            {/* Reviewer */}
            <div className="flex flex-col items-center gap-2 shrink-0 w-[140px]">
              <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Reviewer</div>
              {reviewer.map((n, i) => (
                <TraceNode key={n.id} node={n} index={17 + i} cfg={cfg} isVisible={isInView} selectedId={selectedNodeId} onSelect={setSelectedNodeId} />
              ))}
              <div className="mt-1 text-[9px] font-mono tabular-nums text-gray-400">{fmtUSD(costsMap[cfg].reviewCost, 4)}</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-100 flex-wrap">
            {[
              { label: MODELS.opus.name, color: OPUS_COLOR },
              { label: MODELS.sonnet.name, color: SONNET_COLOR },
              { label: MODELS.flash.name,                  color: FLASH_COLOR      },
              { label: MODELS.flashLite.name,              color: FLASH_LITE_COLOR },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />{l.label}
              </div>
            ))}
            <div className="ml-auto text-xs text-gray-400 italic">{CONFIG_META[cfg].desc}</div>
          </div>
        </div>

        {/* Charts + scale simulator */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Per-run comparison */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Per-Run Cost (per SKU)</h3>
            <p className="text-xs text-gray-400 mb-4">All 4 strategies compared · selected in green</p>
            <ResponsiveContainer
              width="100%"
              height={200}
              minWidth={0}
              initialDimension={{ width: 600, height: 200 }}
            >
              <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => fmtUSD(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={52} />
                <RechartsTooltip formatter={(v: unknown) => [fmtUSD(Number(v)), "Per SKU"]} contentStyle={{ borderRadius: 8, fontSize: 11, border: "1px solid #e5e7eb" }} />
                <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={52}>
                  {barData.map((d, i) => <Cell key={i} fill={d.active ? GREEN : d.color} opacity={d.active ? 1 : 0.5} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Scale simulator */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Scale Simulator</h3>
            <p className="text-xs text-gray-400 mb-5">SKUs processed nightly — only those needing attention.</p>

            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">SKUs / night</span>
                <span className="text-xl font-bold tabular-nums text-gray-900">{skus.toLocaleString()}</span>
              </div>
              <input type="range" min={500} max={50_000} step={500} value={skus}
                onChange={(e) => setSkus(Number(e.target.value))} className="w-full accent-emerald-600 h-1.5" />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>500</span><span>25K</span><span>50K</span></div>
            </div>

            {/* Annual cost grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {allConfigs.map((c) => (
                <div key={c} onClick={() => setCfg(c)} className="rounded-lg p-3 cursor-pointer transition-all"
                  style={{ backgroundColor: cfg === c ? CONFIG_META[c].color + "12" : "#f8fafc",
                    border: `1px solid ${cfg === c ? CONFIG_META[c].color + "40" : "#e2e8f0"}` }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-1">{CONFIG_META[c].label}</p>
                  <p className="text-base font-bold tabular-nums" style={{ color: CONFIG_META[c].color }}>{fmtUSD(annualMap[c])}</p>
                  <p className="text-[9px] text-gray-400">/yr</p>
                </div>
              ))}
            </div>

            {/* Savings vs all-Opus */}
            <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "rgba(24,128,56,0.08)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Opus + Flash vs Opus + Sonnet (annual)</p>
              <p className="text-2xl font-bold tabular-nums" style={{ color: GREEN }}>{fmtUSD(annualMap["opusSonnet"] - tieredAnnual)}</p>
              <p className="text-xs font-semibold mt-1" style={{ color: GREEN }}>
                {pctSavings(annualMap["opusSonnet"], tieredAnnual).toFixed(0)}% reduction · {skus.toLocaleString()} SKUs × 365 nights
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom callout */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6 flex items-start gap-4">
          <div className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(24,128,56,0.1)" }}>
            <Bot className="h-4 w-4" style={{ color: GREEN }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Opus orchestrates. Gemini Flash executes.</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              {executors.length} executor steps per SKU — inventory pulls, demand reads, copy generation, feed validation — are pattern-following work.
              Routing them to Flash cuts per-SKU cost from{" "}
              <span className="font-mono font-semibold tabular-nums" style={{ color: SONNET_COLOR }}>{fmtUSD(costsMap["opusSonnet"].total)}</span> (Opus + Sonnet) to{" "}
              <span className="font-mono font-semibold tabular-nums" style={{ color: GREEN }}>{fmtUSD(costsMap["opusGemini"].total)}</span> (Opus + Flash).
              At {skus.toLocaleString()} SKUs/night that&apos;s{" "}
              <span className="font-semibold" style={{ color: GREEN }}>{fmtUSD(annualMap["opusSonnet"] - tieredAnnual)}/yr saved</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
