"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Bot, Cpu, ShieldCheck, ArrowRight, ChevronRight, Info, X } from "lucide-react";

import { callCost, fmtUSD, pctSavings, MODELS } from "@/lib/pricing";
import { S4, s4Costs, s4Annual } from "@/lib/scenarios";
import { S4_TRACE, type AgentNode } from "@/lib/content";
import { useTally } from "@/lib/tally-context";

/* ─── Color Tokens ─── */
const OPUS_COLOR = "#7B61FF";
const FLASH_COLOR = "#1A73E8";
const SONNET_COLOR = "#E37400";
const GREEN = "#188038";
const AMBER = "#E37400";
const OPUS_BG = "rgba(123,97,255,0.10)";
const FLASH_BG = "rgba(26,115,232,0.10)";
const OPUS_BORDER = "rgba(123,97,255,0.35)";
const FLASH_BORDER = "rgba(26,115,232,0.35)";

/* ─── Helpers ─── */
function nodeCost(node: AgentNode, mode: "hybrid" | "allOpus"): number {
  const model = node.role === "executor"
    ? mode === "allOpus" ? "sonnet" : "flash"
    : "opus";
  return callCost(model, node.inTok, node.outTok);
}

function modelLabel(node: AgentNode, mode: "hybrid" | "allOpus"): string {
  if (node.role !== "executor") return MODELS.opus.name;
  return mode === "allOpus" ? MODELS.sonnet.name : MODELS.flash.name;
}

function roleIcon(role: AgentNode["role"]) {
  switch (role) {
    case "planner":
      return <Bot className="h-4 w-4" />;
    case "executor":
      return <Cpu className="h-4 w-4" />;
    case "reviewer":
      return <ShieldCheck className="h-4 w-4" />;
  }
}

/* Slider formatter */
function fmtSlider(v: number): string {
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toString();
}

/* ─── Node Detail Popover ─── */
function NodePopover({
  node,
  mode,
  onClose,
}: {
  node: AgentNode;
  mode: "hybrid" | "allOpus";
  onClose: () => void;
}) {
  const cost = nodeCost(node, mode);
  const model = modelLabel(node, mode);
  const tierColor = node.role !== "executor" ? OPUS_COLOR : mode === "allOpus" ? SONNET_COLOR : FLASH_COLOR;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg border border-gray-200 bg-white shadow-xl p-4"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        Step {node.id}
      </p>
      <p className="text-sm font-bold text-gray-900 mb-3">{node.label}</p>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">Model</span>
          <span className="font-semibold" style={{ color: tierColor }}>
            {model}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Input tokens</span>
          <span className="font-mono tabular-nums text-gray-700">{node.inTok.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Output tokens</span>
          <span className="font-mono tabular-nums text-gray-700">{node.outTok.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2">
          <span className="text-gray-500 font-semibold">Cost</span>
          <span className="font-mono tabular-nums font-bold text-gray-900">{fmtUSD(cost)}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Single Trace Node ─── */
function TraceNode({
  node,
  index,
  mode,
  isVisible,
  selectedId,
  onSelect,
}: {
  node: AgentNode;
  index: number;
  mode: "hybrid" | "allOpus";
  isVisible: boolean;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const isOpus = node.role !== "executor";
  const color = isOpus ? OPUS_COLOR : mode === "allOpus" ? SONNET_COLOR : FLASH_COLOR;
  const bg = isOpus ? OPUS_BG : FLASH_BG;
  const border = isOpus ? OPUS_BORDER : FLASH_BORDER;
  const isSelected = selectedId === node.id;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={
        isVisible
          ? { opacity: 1, scale: 1 }
          : { opacity: 0.15, scale: 0.85 }
      }
      transition={{
        duration: 0.4,
        delay: isVisible ? index * 0.08 : 0,
        ease: "easeOut",
      }}
    >
      <button
        onClick={() => onSelect(isSelected ? null : node.id)}
        className="group relative flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: bg,
          border: `1.5px solid ${isSelected ? color : border}`,
          boxShadow: isSelected ? `0 0 0 2px ${border}` : "none",
        }}
      >
        {/* Pulsing dot */}
        <motion.span
          className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ scale: 0 }}
          animate={isVisible ? { scale: [0, 1.3, 1] } : { scale: 0 }}
          transition={{ duration: 0.3, delay: index * 0.08 + 0.3 }}
        />

        <span style={{ color }} className="shrink-0">
          {roleIcon(node.role)}
        </span>
        <span className="text-xs font-medium text-gray-800 leading-tight line-clamp-2">
          {node.label}
        </span>
      </button>

      <AnimatePresence>
        {isSelected && (
          <NodePopover
            node={node}
            mode={mode}
            onClose={() => onSelect(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Flow Arrow ─── */
function FlowArrow({ isVisible, delay }: { isVisible: boolean; delay: number }) {
  return (
    <motion.div
      className="flex items-center justify-center text-gray-300"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <ChevronRight className="h-5 w-5" />
    </motion.div>
  );
}

/* ─── Stacked Bar Chart ─── */
function CostBreakdownChart({ mode }: { mode: "hybrid" | "allOpus" }) {
  const costs = s4Costs();
  const plannerCost = costs.plannerOpusCost;
  const reviewCost = costs.reviewOpusCost;
  const executorCost = mode === "allOpus" ? costs.executorSonnetCost : costs.executorFlashCost;

  const data = [
    {
      name: mode === "allOpus" ? "Opus + Sonnet" : "Opus + Flash",
      Planner: plannerCost,
      Executors: executorCost,
      Reviewer: reviewCost,
    },
  ];

  // Also show the other mode for comparison
  const otherPlanner = costs.plannerOpusCost;
  const otherReview = costs.reviewOpusCost;
  const otherExecutor = mode === "allOpus" ? costs.executorFlashCost : costs.executorSonnetCost;
  data.push({
    name: mode === "allOpus" ? "Opus + Flash" : "Opus + Sonnet",
    Planner: otherPlanner,
    Executors: otherExecutor,
    Reviewer: otherReview,
  });

  return (
    <ResponsiveContainer
      width="100%"
      height={220}
      minWidth={0}
      initialDimension={{ width: 800, height: 220 }}
    >
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
        <XAxis
          type="number"
          tickFormatter={(v: number) => fmtUSD(v)}
          tick={{ fontSize: 11, fill: "#666" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={110}
          tick={{ fontSize: 11, fill: "#333", fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <RechartsTooltip
          formatter={(value: unknown, name: unknown) => [fmtUSD(Number(value), 4), String(name)]}
          contentStyle={{
            fontSize: 12,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
        />
        <Bar dataKey="Planner" stackId="cost" fill={OPUS_COLOR} radius={[0, 0, 0, 0]} />
        <Bar dataKey="Executors" stackId="cost" radius={[0, 0, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                (i === 0 && mode === "allOpus") || (i === 1 && mode !== "allOpus")
                  ? AMBER
                  : GREEN
              }
            />
          ))}
        </Bar>
        <Bar dataKey="Reviewer" stackId="cost" fill={OPUS_COLOR} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Custom Slider Styles (inline) ─── */
const sliderTrackStyle: React.CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  width: "100%",
  height: 6,
  borderRadius: 3,
  outline: "none",
  cursor: "pointer",
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function AgentScenario() {
  const [mode, setMode] = useState<"hybrid" | "allOpus">("hybrid");
  const [portfolios, setPortfolios] = useState(S4.defaults.portfoliosPerNight);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const { updateResult } = useTally();

  /* In-view trigger for stagger animation */
  const traceRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(traceRef, { once: true, margin: "-80px" });

  /* Derived costs */
  const costs = useMemo(() => s4Costs(), []);
  const perRun = mode === "allOpus" ? costs.opusSonnet : costs.opusFlash;
  const annual = useMemo(() => s4Annual(portfolios), [portfolios]);
  const annualCostCurrent = mode === "allOpus" ? annual.opusSonnetAnnual : annual.opusFlashAnnual;
  const annualCostOther = mode === "allOpus" ? annual.opusFlashAnnual : annual.opusSonnetAnnual;
  const savings = annual.savings;
  const savingsPct = pctSavings(annual.opusSonnetAnnual, annual.opusFlashAnnual);

  /* Trace nodes split by role */
  const planner = S4_TRACE.filter((n) => n.role === "planner");
  const executors = S4_TRACE.filter((n) => n.role === "executor");
  const reviewer = S4_TRACE.filter((n) => n.role === "reviewer");

  /* Update tally context */
  useEffect(() => {
    updateResult("s4", {
      label: "Agentic Orchestration (Annual)",
      allFrontier: annual.opusSonnetAnnual,
      tiered: annual.opusFlashAnnual,
      savings: annual.savings,
      period: "annual",
    });
  }, [annual, updateResult]);

  /* Slider change handler */
  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPortfolios(Number(e.target.value));
  }, []);

  return (
    <section id="agent" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ── Story Beat ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Extend · Scenario 4
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Agentic Orchestration
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Every night an agent reviews{" "}
            <span className="font-semibold text-gray-800 tabular-nums">
              {portfolios.toLocaleString()}
            </span>{" "}
            portfolios. It decomposes each rebalancing job into 18 steps—only the{" "}
            <span className="font-semibold" style={{ color: OPUS_COLOR }}>
              planner
            </span>{" "}
            and{" "}
            <span className="font-semibold" style={{ color: OPUS_COLOR }}>
              reviewer
            </span>{" "}
            run on{" "}
            <span className="font-semibold" style={{ color: OPUS_COLOR }}>
              Opus
            </span>. The 16 executor steps run on{" "}
            <span className="font-semibold" style={{ color: FLASH_COLOR }}>
              Gemini Flash
            </span>
            .
          </p>
        </motion.div>

        {/* ── Mode Toggle ── */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-sm font-medium text-gray-500">Strategy:</span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
              onClick={() => setMode("hybrid")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                mode === "hybrid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: GREEN }}
              />
              Opus + Flash
            </button>
            <button
              onClick={() => setMode("allOpus")}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                mode === "allOpus"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: AMBER }}
              />
              Opus + Sonnet
            </button>
          </div>
          <span className="text-xs text-gray-400 ml-2">
            Per run: <span className="font-mono tabular-nums font-semibold text-gray-600">{fmtUSD(perRun)}</span>
          </span>
        </div>

        {/* ── Agent Trace Flow ── */}
        <div
          ref={traceRef}
          className="mb-14 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 overflow-x-auto"
        >
          <div className="flex items-center gap-2 mb-6">
            <Bot className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Agent Execution Trace
            </span>
            <span className="text-xs text-gray-300 ml-auto">
              Click any node for details
            </span>
          </div>

          {/* Flow layout: Planner → Executors → Reviewer */}
          <div className="flex items-start gap-4 min-w-[700px]">
            {/* Planner Column */}
            <div className="flex flex-col items-center gap-2 shrink-0 w-[160px]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Planner
              </div>
              {planner.map((node, i) => (
                <TraceNode
                  key={node.id}
                  node={node}
                  index={i}
                  mode={mode}
                  isVisible={isInView}
                  selectedId={selectedNodeId}
                  onSelect={setSelectedNodeId}
                />
              ))}
              <div className="mt-1 text-[10px] font-mono tabular-nums text-gray-400">
                {fmtUSD(costs.plannerOpusCost, 4)}
              </div>
            </div>

            {/* Arrow: Planner → Executors */}
            <FlowArrow isVisible={isInView} delay={0.3} />

            {/* Executor Grid */}
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 text-center">
                Executors × 16
              </div>
              <div className="grid grid-cols-4 gap-2">
                {executors.map((node, i) => (
                  <TraceNode
                    key={node.id}
                    node={node}
                    index={i + 1}
                    mode={mode}
                    isVisible={isInView}
                    selectedId={selectedNodeId}
                    onSelect={setSelectedNodeId}
                  />
                ))}
              </div>
              <div className="mt-2 text-[10px] font-mono tabular-nums text-gray-400 text-center">
                {fmtUSD(
                  mode === "allOpus" ? costs.executorSonnetCost : costs.executorFlashCost,
                  4
                )}{" "}
                total
              </div>
            </div>

            {/* Arrow: Executors → Reviewer */}
            <FlowArrow isVisible={isInView} delay={1.5} />

            {/* Reviewer Column */}
            <div className="flex flex-col items-center gap-2 shrink-0 w-[160px]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Reviewer
              </div>
              {reviewer.map((node, i) => (
                <TraceNode
                  key={node.id}
                  node={node}
                  index={17 + i}
                  mode={mode}
                  isVisible={isInView}
                  selectedId={selectedNodeId}
                  onSelect={setSelectedNodeId}
                />
              ))}
              <div className="mt-1 text-[10px] font-mono tabular-nums text-gray-400">
                {fmtUSD(costs.reviewOpusCost, 4)}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: OPUS_COLOR }}
              />
              <span className="text-xs text-gray-500">
                {MODELS.opus.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: FLASH_COLOR }}
              />
              <span className="text-xs text-gray-500">
                {MODELS.flash.name} (Fast)
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
              <Info className="h-3 w-3" />
              {mode === "allOpus"
                ? "Opus plans and reviews; Sonnet executes"
                : "Opus plans and reviews; Flash executes"}
            </div>
          </div>
        </div>

        {/* ── Two-Column: Chart + Scaler ── */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Cost Breakdown Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Per-Run Cost Breakdown
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Executor volume dominates total cost — this is where tiering shines.
            </p>
            <CostBreakdownChart mode={mode} />
          </motion.div>

          {/* Scale Simulator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Scale Simulator
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Drag to set nightly portfolio volume. Costs scale linearly.
            </p>

            {/* Slider */}
            <div className="mb-8">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">
                  Portfolios / night
                </span>
                <span className="text-lg font-bold tabular-nums text-gray-900">
                  {portfolios.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={portfolios}
                onChange={handleSlider}
                className="w-full accent-blue-600"
                style={sliderTrackStyle}
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1K</span>
                <span>25K</span>
                <span>50K</span>
                <span>75K</span>
                <span>100K</span>
              </div>
            </div>

            {/* Nightly cost */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(227,116,0,0.06)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  Nightly (Opus + Sonnet)
                </p>
                <p className="text-lg font-bold tabular-nums" style={{ color: AMBER }}>
                  {fmtUSD(costs.opusSonnet * portfolios)}
                </p>
              </div>
              <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(24,128,56,0.06)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  Nightly (Opus + Flash)
                </p>
                <p className="text-lg font-bold tabular-nums" style={{ color: GREEN }}>
                  {fmtUSD(costs.opusFlash * portfolios)}
                </p>
              </div>
            </div>

            {/* Annual totals */}
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Annual Totals
                </span>
                <span className="text-[10px] text-gray-400">
                  {portfolios.toLocaleString()} × 365 nights
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Opus + Sonnet</p>
                  <p
                    className="text-xl font-bold tabular-nums"
                    style={{ color: AMBER }}
                  >
                    {fmtUSD(annual.opusSonnetAnnual)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Opus + Flash</p>
                  <p
                    className="text-xl font-bold tabular-nums"
                    style={{ color: GREEN }}
                  >
                    {fmtUSD(annual.opusFlashAnnual)}
                  </p>
                </div>
              </div>

              {/* Savings highlight */}
              <div
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: "rgba(24,128,56,0.08)" }}
              >
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Annual Savings
                </p>
                <p
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: GREEN }}
                >
                  {fmtUSD(savings)}
                </p>
                <p className="text-xs font-semibold mt-1" style={{ color: GREEN }}>
                  {savingsPct.toFixed(0)}% reduction
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Callout ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6 flex items-start gap-4"
        >
          <div
            className="shrink-0 mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(24,128,56,0.1)" }}
          >
            <Bot className="h-4 w-4" style={{ color: GREEN }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Opus orchestrates. Gemini Flash executes.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Only 2 of 18 agent steps require top-tier reasoning — the planner that
              decomposes the rebalancing task and the compliance reviewer that signs off.
              Opus handles both in either architecture. The 16 executor steps (data retrieval,
              calculations, formatting) route to Gemini Flash instead of Sonnet.
              Total per-run cost drops from{" "}
              <span className="font-mono tabular-nums font-semibold" style={{ color: AMBER }}>
                {fmtUSD(costs.opusSonnet)} (Opus + Sonnet)
              </span>{" "}
              to{" "}
              <span className="font-mono tabular-nums font-semibold" style={{ color: GREEN }}>
                {fmtUSD(costs.opusFlash)}
              </span>
              . At {fmtSlider(portfolios)} portfolios nightly, that&apos;s{" "}
              <span className="font-semibold" style={{ color: GREEN }}>
                {fmtUSD(savings)}/yr saved
              </span>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
