"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronDown, ChevronUp, Clock3, Cable, Layers3 } from "lucide-react";
import { APPROACHES, APPROACH_META } from "@/lib/agent-economics/approaches";
import { calculateEconomics, costByBucket } from "@/lib/agent-economics/economics";
import type { CapabilityAssessment, CostBucket, EconomicAssumptions, EstateProfile } from "@/lib/agent-economics/types";

const BUCKETS: CostBucket[] = [
  "Model inference", "Agent platform & runtime", "Hyperscaler infrastructure", "External products & licenses", "Initial build & integration", "Ongoing governance & operations",
];
const BUCKET_COLORS: Record<CostBucket, string> = {
  "Model inference": "#60A5FA",
  "Agent platform & runtime": "#2563EB",
  "Hyperscaler infrastructure": "#8B5CF6",
  "External products & licenses": "#F59E0B",
  "Initial build & integration": "#F43F5E",
  "Ongoing governance & operations": "#475569",
};

const fmtK = (value: number) => value >= 1000 ? `$${(value / 1000).toFixed(2)}M` : `$${Math.round(value)}K`;

interface Props {
  profile: EstateProfile;
  capabilities: CapabilityAssessment[];
  assumptions: EconomicAssumptions;
  onAssumptionsChange: (value: EconomicAssumptions) => void;
}

export default function EconomicsComparison({ profile, capabilities, assumptions, onAssumptionsChange }: Props) {
  const [horizon, setHorizon] = useState<"year1" | "threeYear">("year1");
  const [showMath, setShowMath] = useState(false);
  const economics = useMemo(() => calculateEconomics(profile, capabilities, assumptions), [profile, capabilities, assumptions]);
  const chartData = economics.map((item) => ({
    name: APPROACH_META[item.approach].shortName,
    approach: item.approach,
    ...costByBucket(item, horizon),
  }));
  const geap = economics.find((item) => item.approach === "geap")!;
  const bestAssembled = economics
    .filter((item) => item.approach !== "geap")
    .sort((a, b) => (horizon === "year1" ? a.yearOneK - b.yearOneK : a.threeYearK - b.threeYearK))[0];
  const geapTotal = horizon === "year1" ? geap.yearOneK : geap.threeYearK;
  const assembledTotal = horizon === "year1" ? bestAssembled.yearOneK : bestAssembled.threeYearK;
  const gap = assembledTotal - geapTotal;
  const gapPercent = Math.round((Math.abs(gap) / Math.max(1, assembledTotal)) * 100);

  return (
    <section id="economics" className="scroll-mt-28">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">04 / Economics and recommendation</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Compare the full cost of reaching production.</h2>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">All three approaches deliver the same required capabilities. The difference is where runtime, products, integration, and operating ownership sit.</p>
        </div>
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button onClick={() => setHorizon("year1")} className={`rounded-lg px-4 py-2 text-xs font-bold ${horizon === "year1" ? "bg-slate-900 text-white" : "text-slate-500"}`}>Year 1</button>
          <button onClick={() => setHorizon("threeYear")} className={`rounded-lg px-4 py-2 text-xs font-bold ${horizon === "threeYear" ? "bg-slate-900 text-white" : "text-slate-500"}`}>3-year cumulative</button>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-950 px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">Live cost impact</p><p className="mt-1 text-sm font-bold">Every control below updates this comparison immediately.</p></div>
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-slate-300">Same required capability and accuracy target</span>
        </div>
        <div className="grid md:grid-cols-[1fr_1fr_1.15fr]">
          <LiveCost label="GEAP full stack" value={fmtK(geapTotal)} color={APPROACH_META.geap.color} testId="geap-live-cost" />
          <LiveCost label={`Best assembled: ${APPROACH_META[bestAssembled.approach].shortName}`} value={fmtK(assembledTotal)} color={APPROACH_META[bestAssembled.approach].color} testId="assembled-live-cost" />
          <div className={`border-t p-5 md:border-l md:border-t-0 ${gap >= 0 ? "bg-emerald-50" : "bg-amber-50"}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wide ${gap >= 0 ? "text-emerald-700" : "text-amber-700"}`}>{gap >= 0 ? "GEAP estimated advantage" : "GEAP estimated premium"}</p>
            <p className={`mt-1 text-3xl font-black tabular-nums ${gap >= 0 ? "text-emerald-900" : "text-amber-900"}`} data-testid="live-cost-gap">{fmtK(Math.abs(gap))} <span className="text-base">({gapPercent}%)</span></p>
            <p className={`mt-1 text-[10px] ${gap >= 0 ? "text-emerald-700" : "text-amber-700"}`}>{horizon === "year1" ? "Year-1" : "Three-year"} full-stack TCO difference</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:grid-cols-3">
        <Slider label="Loaded engineering cost" value={assumptions.engineeringRateK} min={8} max={35} suffix="K/mo"
          onChange={(value) => onAssumptionsChange({ ...assumptions, engineeringRateK: value })} />
        <Slider label="Existing-tool credit" value={Math.round(assumptions.existingToolCredit * 100)} min={0} max={80} suffix="%"
          onChange={(value) => onAssumptionsChange({ ...assumptions, existingToolCredit: value / 100 })} />
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Enterprise contract discount</p>
          <div className="grid grid-cols-3 gap-2">
            {APPROACHES.map((approach) => <label key={approach} className="rounded-xl border border-slate-200 bg-white p-2 text-center">
              <span className="block truncate text-[9px] font-bold" style={{ color: APPROACH_META[approach].color }}>{APPROACH_META[approach].shortName}</span>
              <input aria-label={`${APPROACH_META[approach].shortName} discount`} type="number" min={0} max={50} value={Math.round(assumptions.discounts[approach] * 100)}
                onInput={(event) => onAssumptionsChange({ ...assumptions, discounts: { ...assumptions.discounts, [approach]: Number(event.currentTarget.value) / 100 } })}
                onChange={(event) => onAssumptionsChange({ ...assumptions, discounts: { ...assumptions.discounts, [approach]: Number(event.currentTarget.value) / 100 } })}
                className="mt-1 w-full bg-transparent text-center text-sm font-bold text-slate-800 outline-none" />
              <span className="text-[9px] text-slate-400">%</span>
            </label>)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2">
            {BUCKETS.map((bucket) => <span key={bucket} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500"><span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: BUCKET_COLORS[bucket] }} />{bucket}</span>)}
          </div>
          <ResponsiveContainer width="100%" height={360} minWidth={0} initialDimension={{ width: 760, height: 360 }}>
            <BarChart data={chartData} margin={{ left: 4, right: 4, top: 18, bottom: 8 }}>
              <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={62} />
              <Tooltip formatter={(value: unknown, name: unknown) => [fmtK(Number(value)), String(name)]} contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 11 }} />
              {BUCKETS.map((bucket, index) => <Bar key={bucket} dataKey={bucket} stackId="cost" fill={BUCKET_COLORS[bucket]} radius={index === BUCKETS.length - 1 ? [5, 5, 0, 0] : undefined} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {economics.map((item) => {
            const total = horizon === "year1" ? item.yearOneK : item.threeYearK;
            return <article key={item.approach} className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: `${APPROACH_META[item.approach].color}40` }}>
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold" style={{ color: APPROACH_META[item.approach].color }}>{APPROACH_META[item.approach].shortName}</p><p className="mt-1 text-3xl font-extrabold text-slate-950 tabular-nums">{fmtK(total)}</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">BASE</span></div>
              <p className="mt-1 text-[10px] text-slate-400">Year-1 range {fmtK(item.range.lowK)} - {fmtK(item.range.highK)}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                <TinyMetric icon={Clock3} value={`${item.weeksToProduction} wks`} label="To production" />
                <TinyMetric icon={Layers3} value={String(item.vendors)} label="Providers" />
                <TinyMetric icon={Cable} value={String(item.integrationBoundaries)} label="Boundaries" />
              </div>
            </article>;
          })}
        </div>
      </div>

      <button onClick={() => setShowMath(!showMath)} className="mt-6 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-sm font-bold text-slate-800 shadow-sm">
        <span>Show the math: quantity, rate, source status, and formula</span>{showMath ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
      </button>
      {showMath && <MathBreakdown economics={economics} />}
    </section>
  );
}

function Slider({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  const percent = ((value - min) / Math.max(1, max - min)) * 100;
  return <div><div className="mb-2 flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><output className="rounded-lg bg-slate-900 px-2 py-1 text-sm font-extrabold tabular-nums text-white" aria-live="polite">{value}{suffix}</output></div><input aria-label={label} aria-valuetext={`${value}${suffix}`} type="range" min={min} max={max} value={value} onInput={(event) => onChange(Number(event.currentTarget.value))} onChange={(event) => onChange(Number(event.currentTarget.value))} className="slider-track" style={{ background: `linear-gradient(90deg, #0F172A 0%, #0F172A ${percent}%, #CBD5E1 ${percent}%, #CBD5E1 100%)` }} /><div className="mt-1 flex justify-between text-[9px] text-slate-400"><span>{min}{suffix}</span><span>{max}{suffix}</span></div></div>;
}

function LiveCost({ label, value, color, testId }: { label: string; value: string; color: string; testId: string }) {
  return <div className="border-t border-slate-100 p-5 first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-3xl font-black tabular-nums text-slate-950" data-testid={testId}>{value}</p><div className="mt-3 h-1.5 w-16 rounded-full" style={{ backgroundColor: color }} /></div>;
}

function TinyMetric({ icon: Icon, value, label }: { icon: typeof Clock3; value: string; label: string }) {
  return <div><div className="flex items-center gap-1 text-slate-400"><Icon size={11} /><span className="text-[9px]">{label}</span></div><p className="mt-1 text-xs font-bold text-slate-700">{value}</p></div>;
}

function MathBreakdown({ economics }: { economics: ReturnType<typeof calculateEconomics> }) {
  return <div className="mt-3 space-y-4">{economics.map((item) => <div key={item.approach} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="px-4 py-3 text-sm font-bold" style={{ color: APPROACH_META[item.approach].color, backgroundColor: APPROACH_META[item.approach].pale }}>{APPROACH_META[item.approach].name}</div><div className="divide-y divide-slate-100">{item.lines.map((costLine) => <div key={`${costLine.bucket}-${costLine.label}`} className="grid gap-2 p-4 text-xs md:grid-cols-[1.4fr_0.7fr_0.7fr_0.6fr_1.4fr]"><div><p className="font-bold text-slate-700">{costLine.label}</p><p className="text-[10px] text-slate-400">{costLine.bucket}</p></div><div className="text-slate-500">{costLine.quantity} {costLine.unit}</div><div className="font-semibold text-slate-700">{fmtK(costLine.rateK)} / unit</div><div><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${costLine.status === "VERIFIED" ? "bg-green-50 text-green-700" : costLine.status === "QUOTE REQUIRED" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{costLine.status}</span></div><div className="text-[10px] leading-relaxed text-slate-400">{costLine.formula}</div></div>)}</div></div>)}</div>;
}
