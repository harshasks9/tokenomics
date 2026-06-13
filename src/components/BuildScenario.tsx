"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, Calendar, Zap, Brain, ArrowRight, Info } from "lucide-react";
import { callCost, fmtUSD, pctSavings, MODELS } from "@/lib/pricing";
import { S1, s1Costs } from "@/lib/scenarios";
import { S1_TASKS, type S1Task } from "@/lib/content";
import { useTally } from "@/lib/tally-context";

// ─── Colors ────────────────────────────────────────────────────────────
const GREEN = "#188038";
const GREEN_LIGHT = "#e6f4ea";
const AMBER = "#E37400";
const AMBER_LIGHT = "#fef3e0";
const BLUE = "#1A73E8";
const SLATE = "#475569";

// ─── Animated counter hook ─────────────────────────────────────────────
function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = value;
    const diff = target - start;
    if (Math.abs(diff) < 0.01) {
      frameRef.current = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frameRef.current);
    }
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + diff * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

// ─── Task card ─────────────────────────────────────────────────────────
function TaskCard({
  task,
  forceTier,
  index,
}: {
  task: S1Task;
  forceTier?: "opus";
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const tier = forceTier ?? task.tier;
  const isOpus = tier === "opus";
  const bgColor = isOpus ? AMBER_LIGHT : GREEN_LIGHT;
  const borderColor = isOpus ? AMBER : GREEN;
  const dotColor = isOpus ? AMBER : GREEN;
  const modelLabel = isOpus ? "Opus" : "Flash";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-default select-none"
    >
      <div
        className="rounded-lg border-l-4 px-3 py-2.5 text-sm transition-shadow duration-200"
        style={{
          backgroundColor: bgColor,
          borderLeftColor: borderColor,
          boxShadow: hovered
            ? "0 4px 12px rgba(0,0,0,0.1)"
            : "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="leading-snug text-slate-800 text-[13px] font-medium">
            {task.title}
          </span>
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: dotColor }}
          >
            {modelLabel}
          </span>
        </div>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-1"
          >
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-600 shadow-lg">
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-slate-800">
                <Info size={12} />
                Why {modelLabel}?
              </div>
              {task.why}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Slider input ──────────────────────────────────────────────────────
function SliderControl({
  icon: Icon,
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Icon size={16} className="text-slate-500" />
          {label}
        </div>
        <span
          className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-bold tabular-nums text-slate-800"
        >
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#1A73E8] h-2 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

// ─── Mode toggle ───────────────────────────────────────────────────────
function ModeToggle({
  mode,
  onChange,
}: {
  mode: "tiered" | "all-frontier";
  onChange: (m: "tiered" | "all-frontier") => void;
}) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-1">
      <button
        onClick={() => onChange("tiered")}
        className="relative rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200"
        style={{
          backgroundColor: mode === "tiered" ? "white" : "transparent",
          color: mode === "tiered" ? GREEN : SLATE,
          boxShadow:
            mode === "tiered" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <span className="flex items-center gap-1.5">
          <Zap size={14} />
          Tiered
        </span>
      </button>
      <button
        onClick={() => onChange("all-frontier")}
        className="relative rounded-md px-4 py-2 text-sm font-semibold transition-colors duration-200"
        style={{
          backgroundColor: mode === "all-frontier" ? "white" : "transparent",
          color: mode === "all-frontier" ? AMBER : SLATE,
          boxShadow:
            mode === "all-frontier" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <span className="flex items-center gap-1.5">
          <Brain size={14} />
          All-Frontier
        </span>
      </button>
    </div>
  );
}

// ─── Custom donut tooltip ──────────────────────────────────────────────
function DonutTooltipContent({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; examples: string } }> }) {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-800">{data.name}</p>
      <p className="mt-1 text-slate-500">{data.examples}</p>
    </div>
  );
}

// ─── Custom bar tooltip ────────────────────────────────────────────────
function BarTooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-slate-800">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-slate-600">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: p.color }}
          />
          {p.name}: {fmtUSD(p.value, 2)}
        </p>
      ))}
    </div>
  );
}

// ─── Custom legend ─────────────────────────────────────────────────────
function DonutLegend({
  routineCount,
  complexCount,
}: {
  routineCount: number;
  complexCount: number;
}) {
  return (
    <div className="flex items-center justify-center gap-6 mt-2">
      <div className="flex items-center gap-1.5 text-xs">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ backgroundColor: GREEN }}
        />
        <span className="text-slate-600">
          Routine ({routineCount}) → Flash
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ backgroundColor: AMBER }}
        />
        <span className="text-slate-600">
          Complex ({complexCount}) → Opus
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════════════
export default function BuildScenario() {
  const { updateResult } = useTally();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // ─── State ─────────────────────────────────────────────────────────
  const [mode, setMode] = useState<"tiered" | "all-frontier">("tiered");
  const [devs, setDevs] = useState(S1.defaults.devs);
  const [sprints, setSprints] = useState(S1.defaults.sprints);

  // ─── Computed costs ────────────────────────────────────────────────
  const costs = useMemo(() => {
    const perSprint = s1Costs(devs, S1.defaultMix.routinePct);
    return {
      allFrontierPerSprint: perSprint.allFrontier,
      tieredPerSprint: perSprint.tiered,
      savingsPerSprint: perSprint.savings,
      allFrontierTotal: perSprint.allFrontier * sprints,
      tieredTotal: perSprint.tiered * sprints,
      savingsTotal: perSprint.savings * sprints,
      pct: pctSavings(perSprint.allFrontier, perSprint.tiered),
    };
  }, [devs, sprints]);

  // ─── Push to tally ────────────────────────────────────────────────
  useEffect(() => {
    updateResult("s1", {
      label: "Build Phase (SDLC)",
      allFrontier: costs.allFrontierTotal,
      tiered: costs.tieredTotal,
      savings: costs.savingsTotal,
      period: "one-time",
    });
  }, [costs, updateResult]);

  // ─── Task split data ──────────────────────────────────────────────
  const routineTasks = S1_TASKS.filter((t) => t.tier === "flash");
  const complexTasks = S1_TASKS.filter((t) => t.tier === "opus");

  const routineExamples = routineTasks
    .slice(0, 3)
    .map((t) => t.title)
    .join("; ");
  const complexExamples = complexTasks
    .slice(0, 3)
    .map((t) => t.title)
    .join("; ");

  // ─── Donut chart data ─────────────────────────────────────────────
  const donutData = [
    {
      name: "Routine Tasks",
      value: routineTasks.length,
      fill: GREEN,
      examples: routineExamples,
    },
    {
      name: "Complex Tasks",
      value: complexTasks.length,
      fill: AMBER,
      examples: complexExamples,
    },
  ];

  // ─── Bar chart data ───────────────────────────────────────────────
  const barData = [
    {
      name: "Per Sprint",
      "All-Frontier": costs.allFrontierPerSprint,
      Tiered: costs.tieredPerSprint,
    },
    {
      name: `${sprints} Sprints`,
      "All-Frontier": costs.allFrontierTotal,
      Tiered: costs.tieredTotal,
    },
  ];

  // ─── Animated values ──────────────────────────────────────────────
  const animatedAllFrontier = useCountUp(costs.allFrontierTotal);
  const animatedTiered = useCountUp(costs.tieredTotal);
  const animatedSavings = useCountUp(costs.savingsTotal);
  const animatedPct = useCountUp(costs.pct);

  // ─── Displayed cost based on mode ────────────────────────────────
  const displayedTotal =
    mode === "all-frontier" ? animatedAllFrontier : animatedTiered;
  const displayedLabel =
    mode === "all-frontier" ? "All-Frontier Cost" : "Tiered Cost";

  return (
    <section
      id="build"
      ref={sectionRef}
      className="relative w-full bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ── Section header ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase">
              Scenario 1
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
              Build Phase
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            AI-Assisted Software Development
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Your engineers don&apos;t need frontier intelligence for every task.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            75% of coding tasks are routine — tests, scaffolds, docs, CRUD.
            A tiered strategy routes them to Flash at ⅓ the cost,
            reserving Opus for architecture and hard debugging.
          </p>
        </motion.div>

        {/* ── Two-column layout ─────────────────────────────────────── */}
        <div className="grid gap-16 lg:grid-cols-2">
          {/* ── LEFT: Story + Controls ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-10"
          >
            {/* Mode toggle */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                Routing Strategy
              </p>
              <ModeToggle mode={mode} onChange={setMode} />
            </div>

            {/* Sliders */}
            <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Team Configuration
              </p>
              <SliderControl
                icon={Users}
                label="Team Size"
                value={devs}
                min={5}
                max={50}
                step={1}
                onChange={setDevs}
                suffix=" devs"
              />
              <SliderControl
                icon={Calendar}
                label="Sprint Count"
                value={sprints}
                min={1}
                max={26}
                step={1}
                onChange={setSprints}
                suffix=" sprints"
              />
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Tasks per dev per sprint</span>
                  <span className="font-semibold tabular-nums text-slate-700">
                    {S1.tasksPerDevPerSprint}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>Total tasks over period</span>
                  <span className="font-semibold tabular-nums text-slate-700">
                    {(
                      devs *
                      S1.tasksPerDevPerSprint *
                      sprints
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Cost callout */}
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">
                  {displayedLabel}
                </p>
                <p
                  className="text-4xl font-bold tabular-nums"
                  style={{ color: mode === "all-frontier" ? AMBER : GREEN }}
                >
                  {fmtUSD(displayedTotal, 2)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  over {sprints} sprint{sprints > 1 ? "s" : ""} · {devs}{" "}
                  developers
                </p>
              </div>

              {/* Savings badge — only in tiered mode */}
              <AnimatePresence>
                {mode === "tiered" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="flex items-center gap-3 rounded-xl border px-6 py-4"
                      style={{
                        borderColor: GREEN,
                        backgroundColor: GREEN_LIGHT,
                      }}
                    >
                      <div className="flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-green-700">
                          You save
                        </p>
                        <p
                          className="text-2xl font-bold tabular-nums"
                          style={{ color: GREEN }}
                        >
                          {fmtUSD(animatedSavings, 2)}
                        </p>
                      </div>
                      <div
                        className="rounded-full px-3 py-1 text-sm font-bold tabular-nums text-white"
                        style={{ backgroundColor: GREEN }}
                      >
                        {animatedPct.toFixed(0)}% less
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Per-sprint breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    All-Frontier / Sprint
                  </p>
                  <p
                    className="mt-1 text-lg font-bold tabular-nums"
                    style={{ color: AMBER }}
                  >
                    {fmtUSD(costs.allFrontierPerSprint, 2)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    100% {MODELS.opus.name}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Tiered / Sprint
                  </p>
                  <p
                    className="mt-1 text-lg font-bold tabular-nums"
                    style={{ color: GREEN }}
                  >
                    {fmtUSD(costs.tieredPerSprint, 2)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Flash + Opus mix
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Visuals ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-10"
          >
            {/* Kanban board */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Task Board — {S1_TASKS.length} tasks
                </p>
                <p className="text-xs text-slate-400">
                  Hover for routing rationale
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {S1_TASKS.map((task, i) => (
                  <TaskCard
                    key={task.title}
                    task={task}
                    forceTier={mode === "all-frontier" ? "opus" : undefined}
                    index={i}
                  />
                ))}
              </div>

              {/* Board summary */}
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <AnimatePresence mode="wait">
                  {mode === "tiered" ? (
                    <motion.span
                      key="tiered-summary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: GREEN }}
                      />
                      {routineTasks.length} Flash
                      <span className="mx-1 text-slate-300">·</span>
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: AMBER }}
                      />
                      {complexTasks.length} Opus
                    </motion.span>
                  ) : (
                    <motion.span
                      key="frontier-summary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: AMBER }}
                      />
                      {S1_TASKS.length} Opus (all frontier)
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Charts row */}
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Donut chart — task mix */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Task Mix
                </p>
                <ResponsiveContainer width="100%" height={180} minWidth={0} initialDimension={{ width: 500, height: 180 }}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<DonutTooltipContent />}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <DonutLegend
                  routineCount={routineTasks.length}
                  complexCount={complexTasks.length}
                />
              </div>

              {/* Bar chart — cost comparison */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Cost Comparison
                </p>
                <ResponsiveContainer width="100%" height={180} minWidth={0} initialDimension={{ width: 500, height: 180 }}>
                  <BarChart
                    data={barData}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: SLATE }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: SLATE }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => fmtUSD(v)}
                      width={50}
                    />
                    <Tooltip
                      content={<BarTooltipContent />}
                    />
                    <Bar
                      dataKey="All-Frontier"
                      fill={AMBER}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                    <Bar
                      dataKey="Tiered"
                      fill={GREEN}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={32}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: AMBER }}
                    />
                    All-Frontier
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: GREEN }}
                    />
                    Tiered
                  </span>
                </div>
              </div>
            </div>

            {/* Model price reference */}
            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Model Pricing (per 1M tokens)
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: AMBER }}
                    />
                    {MODELS.opus.name}
                  </span>
                  <span className="tabular-nums font-medium">
                    ${MODELS.opus.inPM} in / ${MODELS.opus.outPM} out
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: GREEN }}
                    />
                    {MODELS.flash.name}
                  </span>
                  <span className="tabular-nums font-medium">
                    ${MODELS.flash.inPM} in / ${MODELS.flash.outPM} out
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom CTA ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">Bottom line:</span>{" "}
            A {devs}-person team saves{" "}
            <span className="font-bold tabular-nums" style={{ color: GREEN }}>
              {fmtUSD(costs.savingsTotal, 2)}
            </span>{" "}
            over {sprints} sprints by routing routine tasks to Flash — with
            zero quality trade-off on complex work.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
