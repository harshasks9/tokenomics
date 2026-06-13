"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Users, Calendar, Info } from "lucide-react";
import { fmtUSD, pctSavings, MODELS } from "@/lib/pricing";
import { SHOP_S1, SHOP_S1_TASKS, shopS1Costs, type ShopS1Task, type ShopS1Baseline } from "@/lib/industries/shopos";
import { useTally } from "@/lib/tally-context";

const GREEN  = "#188038";
const BLUE   = "#1A73E8";
const AMBER  = "#E37400";
const PURPLE = "#9B59D1";

const TIER_META = {
  flash:  { label: "Flash",  color: BLUE,   bg: "#EFF6FF", border: BLUE   },
  sonnet: { label: "Sonnet", color: PURPLE, bg: "#F5F0FC", border: PURPLE },
  opus:   { label: "Opus",   color: AMBER,  bg: "#FEF3E0", border: AMBER  },
};

function SliderRow({ icon: Icon, label, value, min, max, step, onChange, suffix }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Icon size={16} className="text-slate-500" />{label}
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-sm font-bold text-slate-800">{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 cursor-pointer accent-emerald-600" />
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{min}{suffix}</span><span>{max}{suffix}</span>
      </div>
    </div>
  );
}

function TaskCard({ task, baseline, index }: { task: ShopS1Task; baseline: ShopS1Baseline; index: number }) {
  const [hovered, setHovered] = useState(false);
  const effectiveTier = baseline === "allOpus" ? "opus" : baseline === "allSonnet" ? (task.tier === "flash" ? "sonnet" : task.tier) : task.tier;
  const meta = TIER_META[effectiveTier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative cursor-default select-none"
    >
      <div className="rounded-lg border-l-4 px-3 py-2.5 text-sm transition-shadow"
        style={{ backgroundColor: meta.bg, borderLeftColor: meta.border,
          boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="flex items-start justify-between gap-2">
          <span className="leading-snug text-slate-800 text-[13px] font-medium">{task.title}</span>
          <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: meta.color }}>
            {meta.label}
          </span>
        </div>
      </div>
      {hovered && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs leading-relaxed text-slate-600 shadow-lg">
          <div className="mb-1 flex items-center gap-1.5 font-semibold text-slate-800"><Info size={12} /> Why {meta.label}?</div>
          {task.why}
        </div>
      )}
    </motion.div>
  );
}

function BaselineButton({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color: string }) {
  return (
    <button onClick={onClick}
      className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border"
      style={{
        backgroundColor: active ? color + "15" : "transparent",
        borderColor: active ? color : "#e2e8f0",
        color: active ? color : "#64748b",
      }}>
      {label}
    </button>
  );
}

export default function ShopBuildScenario() {
  const { updateResult } = useTally();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [devs, setDevs] = useState(SHOP_S1.defaults.devs);
  const [sprints, setSprints] = useState(SHOP_S1.defaults.sprints);
  const [baseline, setBaseline] = useState<ShopS1Baseline>("tiered");

  const costs = useMemo(() => shopS1Costs(devs, sprints, baseline), [devs, sprints, baseline]);

  useEffect(() => {
    updateResult("s1", {
      label: "Build Phase (SDLC)",
      allFrontier: costs.allOpusTotal,
      tiered: costs.tieredTotal,
      savings: costs.allOpusTotal - costs.tieredTotal,
      period: "one-time",
    });
  }, [costs, updateResult]);

  const barData = [
    { name: "All-Opus",   cost: costs.allOpusTotal,   color: AMBER  },
    { name: "All-Sonnet", cost: costs.allSonnetTotal, color: PURPLE },
    { name: "Tiered",     cost: costs.tieredTotal,    color: GREEN  },
  ];

  const routineTasks = SHOP_S1_TASKS.filter((t) => t.tier === "flash");
  const midTasks     = SHOP_S1_TASKS.filter((t) => t.tier === "sonnet");
  const complexTasks = SHOP_S1_TASKS.filter((t) => t.tier === "opus");

  const displayedCost = costs.chosenTotal;
  const baselineColor = baseline === "allOpus" ? AMBER : baseline === "allSonnet" ? PURPLE : GREEN;
  const baselineLabel = baseline === "allOpus" ? "All-Opus Cost" : baseline === "allSonnet" ? "All-Sonnet Cost" : "Tiered Cost";

  return (
    <section id="shop-build" ref={sectionRef} className="relative w-full bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 uppercase">Scenario 1</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">Build Phase</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">AI-Assisted Development</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Three-tier routing across a real e-commerce codebase.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            55% of tasks are routine (Flash) · 30% are mid-complexity (Sonnet) · 15% are hard (Opus).
            The honest story: all-Sonnet is cost-competitive with tiered. The tiered win is <em>Opus-grade reasoning on the complex 15%</em>.
          </p>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8">
            {/* Baseline selector */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Comparison Baseline</p>
              <div className="flex gap-2 flex-wrap">
                <BaselineButton active={baseline === "tiered"}    onClick={() => setBaseline("tiered")}    label="Tiered (Recommended)" color={GREEN}  />
                <BaselineButton active={baseline === "allSonnet"} onClick={() => setBaseline("allSonnet")} label="All-Sonnet"            color={PURPLE} />
                <BaselineButton active={baseline === "allOpus"}   onClick={() => setBaseline("allOpus")}   label="All-Opus"              color={AMBER}  />
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50/50 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Team Configuration</p>
              <SliderRow icon={Users} label="Team Size" value={devs} min={5} max={50} step={1} onChange={setDevs} suffix=" devs" />
              <SliderRow icon={Calendar} label="Sprint Count" value={sprints} min={1} max={26} step={1} onChange={setSprints} suffix=" sprints" />
              <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div>Tasks/dev/sprint: <span className="font-semibold text-slate-700">{SHOP_S1.tasksPerDevPerSprint}</span></div>
                <div>Total tasks: <span className="font-semibold text-slate-700">{(devs * SHOP_S1.tasksPerDevPerSprint * sprints).toLocaleString()}</span></div>
              </div>
            </div>

            {/* Cost display */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">{baselineLabel}</p>
              <p className="text-4xl font-bold tabular-nums" style={{ color: baselineColor }}>{fmtUSD(displayedCost, 2)}</p>
              <p className="mt-1 text-sm text-slate-500">over {sprints} sprints · {devs} developers</p>
            </div>

            {/* Per-sprint grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "All-Opus / Sprint", val: costs.allOpusPerSprint, color: AMBER },
                { label: "All-Sonnet / Sprint", val: costs.allSonnetPerSprint, color: PURPLE },
                { label: "Tiered / Sprint", val: costs.tieredPerSprint, color: GREEN },
              ].map((r) => (
                <div key={r.label} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400 mb-1">{r.label}</p>
                  <p className="text-base font-bold tabular-nums" style={{ color: r.color }}>{fmtUSD(r.val, 2)}</p>
                </div>
              ))}
            </div>

            {/* Honest note */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-800 leading-relaxed">
              <strong>Honest note:</strong> All-Sonnet ({fmtUSD(costs.allSonnetTotal, 2)}) is nearly cost-equal to tiered ({fmtUSD(costs.tieredTotal, 2)}) here.
              The tiered win is quality — Opus on the hard 15% (search relevance, fraud logic, agent architecture) produces measurably better output.
              If the customer is cost-focused and accepts slightly lower quality on complex tasks, all-Sonnet is a credible single-model choice.
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8">
            {/* Task board */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Task Board — {SHOP_S1_TASKS.length} tasks</p>
                <p className="text-xs text-slate-400">Hover for routing rationale</p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SHOP_S1_TASKS.map((task, i) => (
                  <TaskCard key={task.title} task={task} baseline={baseline} index={i} />
                ))}
              </div>
              <div className="mt-2 flex gap-4 text-[10px] text-slate-500">
                {[
                  { label: `${complexTasks.length} Opus`, color: AMBER },
                  { label: `${midTasks.length} Sonnet`, color: PURPLE },
                  { label: `${routineTasks.length} Flash`, color: BLUE },
                ].map((r) => (
                  <span key={r.label} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: r.color }} />
                    {r.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Cost bar chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Total Cost Comparison ({sprints} sprints)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => fmtUSD(v)} width={52} />
                  <Tooltip formatter={(v: unknown) => [fmtUSD(Number(v), 2), ""]} contentStyle={{ borderRadius: 8, fontSize: 12, border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={52}>
                    {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Savings vs all-Opus */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">Tiered vs All-Opus — {sprints} sprints</p>
              <p className="text-3xl font-bold tabular-nums text-emerald-700">{fmtUSD(costs.allOpusTotal - costs.tieredTotal, 2)}</p>
              <p className="text-sm text-emerald-600 mt-1">
                {pctSavings(costs.allOpusTotal, costs.tieredTotal).toFixed(0)}% reduction · Sonnet-equivalent cost, Opus quality on hard tasks
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
