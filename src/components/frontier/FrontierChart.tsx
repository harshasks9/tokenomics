"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { ChevronDown, ChevronUp, Gauge, Info, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { fmtNum, fmtUSD } from "@/lib/pricing";
import {
  DEFAULT_VALUE_WEIGHTS,
  dominatedBy,
  evaluateFrontier,
  metricValue,
  paretoFrontier,
  type FrontierMetricKey,
  type StrategyMetrics,
  type ValueWeights,
} from "@/lib/frontier/metrics";
import { FRONTIER_WORKLOADS, type WorkflowId } from "@/lib/frontier/strategies";

interface FrontierChartProps {
  workflow: WorkflowId;
}

interface ChartDatum {
  x: number;
  y: number;
  z: number;
  label: string;
  metric: StrategyMetrics;
  opacity: number;
}

const METRICS: Array<{ id: FrontierMetricKey; label: string; axis: string }> = [
  { id: "quality", label: "Quality", axis: "Quality score" },
  { id: "latency", label: "Latency", axis: "Latency performance" },
  { id: "governance", label: "Governance", axis: "Governance coverage" },
  { id: "businessValue", label: "Business Value", axis: "Derived business value" },
];

const PRESETS = [
  { id: "cost", label: "Optimize only for cost", metric: "quality" as const, spotlight: ["A"] },
  { id: "quality", label: "Optimize only for quality", metric: "quality" as const, spotlight: ["B"] },
  { id: "latency", label: "Optimize only for latency", metric: "latency" as const, spotlight: ["A"] },
  { id: "outcomes", label: "Optimize for business outcomes", metric: "businessValue" as const, spotlight: ["F"] },
  { id: "frontier", label: "Show the optimal frontier", metric: "quality" as const, spotlight: ["E", "F"] },
];

const PRESET_COPY: Record<string, string> = {
  cost: "The cheapest point is fast and inexpensive, but difficult requests fall below the quality bar and governance is absent.",
  quality: "Opus everywhere reaches maximum model quality, but pays frontier cost and latency for routine traffic that does not need it.",
  latency: "Flash Lite is the fastest raw route. The tradeoff is visible: medium and hard requests can leave the system below the quality bar.",
  outcomes: "GEAP keeps the Hybrid router's raw model economics, then adds native identity, policy, audit, evaluation, and observability.",
  frontier: "The feasible frontier excludes routes that ship quality failures. Workload-aware routing preserves quality while avoiding frontier-model spend everywhere.",
};

function formatLatency(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms.toFixed(0)}ms`;
}

function formatAxis(value: number, key: FrontierMetricKey) {
  return key === "quality" ? value.toFixed(1) : `${value.toFixed(0)}`;
}

function FrontierTooltip({ active, payload, metricKey, allMetrics }: {
  active?: boolean;
  payload?: Array<{ payload: ChartDatum }>;
  metricKey: FrontierMetricKey;
  allMetrics: StrategyMetrics[];
}) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;
  const metric = datum.metric;
  const dominator = dominatedBy(metric, allMetrics, metricKey);

  return (
    <div className="w-[290px] rounded-xl border border-[#DADCE0] bg-white p-4 shadow-xl">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: metric.strategy.color }} />
        <span className="text-sm font-bold text-[#202124]">{metric.strategy.id} — {metric.strategy.name}</span>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-[#5F6368]">{metric.strategy.description}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <span className="text-[#5F6368]">Modeled cost</span><strong className="text-right tabular-nums">{fmtUSD(metric.cost)}</strong>
        <span className="text-[#5F6368]">Quality</span><strong className="text-right">{metric.quality.toFixed(2)} / 5</strong>
        <span className="text-[#5F6368]">p50 / p95</span><strong className="text-right">{formatLatency(metric.p50Latency)} / {formatLatency(metric.p95Latency)}</strong>
        <span className="text-[#5F6368]">Governance</span><strong className="text-right">{metric.governance.toFixed(0)} / 100</strong>
        <span className="text-[#5F6368]">Business value</span><strong className="text-right">{metric.businessValue.toFixed(0)} / 100</strong>
      </div>
      {metric.qualityFailures > 0 && (
        <div className="mt-3 rounded-lg bg-[#FEF7E0] px-3 py-2 text-[11px] font-semibold text-[#B06000]">
          {fmtNum(metric.qualityFailures)} pre-gate requests below quality {4}; {metric.feasible ? "caught by escalation" : "would ship"}.
        </div>
      )}
      <div className="mt-3 border-t border-[#E8EAED] pt-3">
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5F6368]">Governance derivation</div>
        <div className="space-y-1">
          {metric.governanceBreakdown.map((item) => (
            <div key={item.capability} className="flex justify-between text-[10px]">
              <span className="text-[#5F6368]">{item.label}</span>
              <span className="font-semibold capitalize text-[#202124]">{item.state} · {item.score}</span>
            </div>
          ))}
        </div>
      </div>
      {metricKey === "businessValue" && (
        <div className="mt-3 border-t border-[#E8EAED] pt-3 text-[10px] text-[#5F6368]">
          Derived components: quality {metric.valueBreakdown.quality.toFixed(0)}, latency {metric.valueBreakdown.latency.toFixed(0)}, governance {metric.valueBreakdown.governance.toFixed(0)}, cost efficiency {metric.valueBreakdown.cost.toFixed(0)}.
        </div>
      )}
      {dominator && (
        <div className="mt-3 text-[10px] font-semibold text-[#5F6368]">
          Dominated on this view by {dominator.strategy.id} — {dominator.strategy.shortName}.
        </div>
      )}
    </div>
  );
}

function WeightSlider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-[11px] font-semibold text-[#5F6368]"><span>{label}</span><span>{value}%</span></span>
      <input className="slider-track" type="range" min={0} max={60} step={5} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export default function FrontierChart({ workflow }: FrontierChartProps) {
  const workload = FRONTIER_WORKLOADS[workflow];
  const [metricKey, setMetricKey] = useState<FrontierMetricKey>("quality");
  const [preset, setPreset] = useState("frontier");
  const [spotlight, setSpotlight] = useState<string[]>(["E", "F"]);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [weights, setWeights] = useState<ValueWeights>(DEFAULT_VALUE_WEIGHTS);
  const metrics = useMemo(() => evaluateFrontier(workload, weights), [workload, weights]);
  const rawFrontier = useMemo(() => paretoFrontier(metrics, metricKey), [metrics, metricKey]);
  const feasibleFrontier = useMemo(() => paretoFrontier(metrics, metricKey, true), [metrics, metricKey]);
  const rawIds = new Set(rawFrontier.map((metric) => metric.strategy.id));
  const feasibleIds = new Set(feasibleFrontier.map((metric) => metric.strategy.id));
  const selectedMetric = METRICS.find((metric) => metric.id === metricKey) ?? METRICS[0];
  const maxCost = Math.max(...metrics.map((metric) => metric.cost));
  const minCost = Math.min(...metrics.map((metric) => metric.cost));
  const costPad = Math.max((maxCost - minCost) * 0.09, maxCost * 0.03);
  const chartData: ChartDatum[] = metrics.map((metric) => ({
    x: metric.cost,
    y: metricValue(metric, metricKey),
    z: metric.strategy.id === "E" ? 180 : metric.strategy.id === "F" ? 80 : 110,
    label: metric.strategy.id === "E" ? "" : metric.strategy.id === "F" && metricKey !== "governance" && metricKey !== "businessValue" ? "E / F" : metric.strategy.id,
    metric,
    opacity: spotlight.length === 0 || spotlight.includes(metric.strategy.id) ? 1 : 0.3,
  }));
  const rawLineData = rawFrontier.map((metric) => ({ x: metric.cost, y: metricValue(metric, metricKey) }));
  const feasibleLineData = feasibleFrontier.map((metric) => ({ x: metric.cost, y: metricValue(metric, metricKey) }));

  const applyPreset = (id: string) => {
    const next = PRESETS.find((item) => item.id === id) ?? PRESETS[4];
    setPreset(next.id);
    setMetricKey(next.metric);
    setSpotlight(next.spotlight);
  };

  const updateWeight = (key: keyof ValueWeights, value: number) => setWeights((current) => ({ ...current, [key]: value }));

  return (
    <section id={`${workflow}-frontier`} className="border-t border-[#E8EAED] bg-white">
      <div className="section-container">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E6F4EA] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#188038]">
            <TrendingUp className="h-4 w-4" /> Optimal Frontier
          </div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#202124] lg:text-5xl">Where model economics become business outcomes</h2>
          <p className="text-base leading-relaxed text-[#5F6368] lg:text-lg">
            Six routing strategies applied to the same {workload.name} workload. Cost is calculated from existing token volumes; quality, latency, governance, and value remain inspectable.
          </p>
        </div>

        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              onClick={() => applyPreset(item.id)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${preset === item.id ? "border-[#188038] bg-[#E6F4EA] text-[#188038]" : "border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F8F9FA]"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-7 rounded-xl border border-[#E8EAED] bg-[#F8F9FA] px-4 py-3 text-center text-sm font-medium text-[#3C4043]">
          {PRESET_COPY[preset]}
        </div>

        <div className="card overflow-hidden bg-white p-0">
          <div className="flex flex-col gap-4 border-b border-[#E8EAED] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-bold text-[#202124]">Cost × {selectedMetric.label}</div>
              <div className="mt-1 text-[11px] text-[#5F6368]">{workload.volumeLabel}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {METRICS.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => { setMetricKey(metric.id); setPreset("custom"); setSpotlight([]); }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${metricKey === metric.id ? "bg-[#202124] text-white" : "bg-[#F1F3F4] text-[#5F6368]"}`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[420px] w-full px-2 pt-5 sm:px-5">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 900, height: 420 }}>
              <ScatterChart margin={{ top: 28, right: 28, bottom: 28, left: 8 }}>
                <CartesianGrid stroke="#EEF0F2" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Modeled cost"
                  domain={[Math.max(0, minCost - costPad), maxCost + costPad]}
                  tickFormatter={(value) => fmtUSD(Number(value))}
                  tick={{ fontSize: 10, fill: "#5F6368" }}
                  axisLine={{ stroke: "#DADCE0" }}
                  tickLine={false}
                  label={{ value: "Modeled workflow cost →", position: "bottom", offset: 10, fill: "#5F6368", fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name={selectedMetric.axis}
                  domain={metricKey === "quality" ? [0, 5.35] : [0, 105]}
                  tickFormatter={(value) => formatAxis(Number(value), metricKey)}
                  tick={{ fontSize: 10, fill: "#5F6368" }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                  label={{ value: `${selectedMetric.axis} →`, angle: -90, position: "insideLeft", fill: "#5F6368", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[70, 180]} />
                <Tooltip content={<FrontierTooltip metricKey={metricKey} allMetrics={metrics} />} cursor={{ stroke: "#BDC1C6", strokeDasharray: "3 3" }} />
                <Scatter data={rawLineData} line={{ stroke: "#9AA0A6", strokeWidth: 1.5, strokeDasharray: "5 4" }} fill="transparent" isAnimationActive={false} />
                <Scatter data={feasibleLineData} line={{ stroke: "#188038", strokeWidth: 3 }} fill="transparent" isAnimationActive={false} />
                <Scatter data={chartData} isAnimationActive animationDuration={450}>
                  {chartData.map((datum) => (
                    <Cell
                      key={datum.metric.strategy.id}
                      fill={datum.metric.strategy.color}
                      fillOpacity={datum.opacity}
                      stroke={feasibleIds.has(datum.metric.strategy.id) ? "#FFFFFF" : rawIds.has(datum.metric.strategy.id) ? "#5F6368" : "#FFFFFF"}
                      strokeWidth={feasibleIds.has(datum.metric.strategy.id) ? 3 : 1.5}
                    />
                  ))}
                  <LabelList dataKey="label" position="top" offset={10} fill="#202124" fontSize={12} fontWeight={800} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 border-t border-[#E8EAED] bg-[#F8F9FA] p-4 md:grid-cols-3">
            <div className="flex gap-3 rounded-lg bg-white p-3">
              <span className="mt-1 h-0.5 w-8 border-t-2 border-dashed border-[#9AA0A6]" />
              <div><div className="text-xs font-bold text-[#202124]">Raw Pareto frontier</div><div className="text-[10px] text-[#5F6368]">Includes the absolute cheapest point even when it fails quality.</div></div>
            </div>
            <div className="flex gap-3 rounded-lg bg-white p-3">
              <span className="mt-1 h-0.5 w-8 bg-[#188038]" />
              <div><div className="text-xs font-bold text-[#202124]">Quality-feasible frontier</div><div className="text-[10px] text-[#5F6368]">Only strategies whose final requests all clear the quality bar.</div></div>
            </div>
            <div className="flex gap-3 rounded-lg bg-white p-3">
              <Info className="h-4 w-4 shrink-0 text-[#1A73E8]" />
              <div><div className="text-xs font-bold text-[#202124]">E and F overlap on raw economics</div><div className="text-[10px] text-[#5F6368]">Switch to Governance or Business Value to see GEAP separate.</div></div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {metrics.map((metric) => {
            const dominator = dominatedBy(metric, metrics, metricKey);
            return (
              <div data-strategy-card={metric.strategy.id} key={metric.strategy.id} className={`rounded-xl border p-4 transition-opacity ${spotlight.length && !spotlight.includes(metric.strategy.id) ? "opacity-40" : "opacity-100"} ${metric.strategy.id === "F" ? "border-[#188038] bg-[#E6F4EA]" : "border-[#E8EAED] bg-white"}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-lg font-black" style={{ color: metric.strategy.color }}>{metric.strategy.id}</span>
                  {!metric.feasible ? <span className="rounded-full bg-[#FEF7E0] px-2 py-0.5 text-[9px] font-bold text-[#B06000]">Quality risk</span> : feasibleIds.has(metric.strategy.id) ? <span className="rounded-full bg-[#E6F4EA] px-2 py-0.5 text-[9px] font-bold text-[#188038]">Frontier</span> : null}
                </div>
                <div className="min-h-9 text-xs font-bold leading-tight text-[#202124]">{metric.strategy.shortName}</div>
                <div className="mt-3 text-lg font-extrabold tabular-nums text-[#202124]">{fmtUSD(metric.cost)}</div>
                <div className="text-[10px] text-[#5F6368]">{selectedMetric.label}: {formatAxis(metricValue(metric, metricKey), metricKey)}</div>
                {dominator && <div className="mt-2 text-[9px] font-semibold text-[#9AA0A6]">Dominated by {dominator.strategy.id}</div>}
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-xl border border-[#E8EAED] bg-white">
          <button onClick={() => setShowAssumptions((value) => !value)} className="flex w-full items-center justify-between p-4 text-left">
            <span className="flex items-center gap-2 text-sm font-bold text-[#202124]"><Gauge className="h-4 w-4 text-[#1A73E8]" /> Assumptions and derivation</span>
            {showAssumptions ? <ChevronUp className="h-4 w-4 text-[#5F6368]" /> : <ChevronDown className="h-4 w-4 text-[#5F6368]" />}
          </button>
          {showAssumptions && (
            <div className="grid gap-6 border-t border-[#E8EAED] p-5 lg:grid-cols-[1fr_1fr]">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#202124]"><Sparkles className="h-4 w-4 text-[#7B61FF]" /> Derived business-value weights</div>
                <div className="grid grid-cols-2 gap-4">
                  <WeightSlider label="Quality" value={weights.quality} onChange={(value) => updateWeight("quality", value)} />
                  <WeightSlider label="Latency" value={weights.latency} onChange={(value) => updateWeight("latency", value)} />
                  <WeightSlider label="Governance" value={weights.governance} onChange={(value) => updateWeight("governance", value)} />
                  <WeightSlider label="Cost efficiency" value={weights.cost} onChange={(value) => updateWeight("cost", value)} />
                </div>
                <button onClick={() => setWeights(DEFAULT_VALUE_WEIGHTS)} className="mt-4 text-[11px] font-semibold text-[#1A73E8]">Reset assumptions</button>
              </div>
              <div className="space-y-3 text-xs leading-relaxed text-[#5F6368]">
                <p><strong className="text-[#202124]">Direct:</strong> Cost uses <code>callCost</code> for every weighted request and retry. Latency and quality use the router tier profiles; retry latency is additive.</p>
                <p><strong className="text-[#202124]">Derived:</strong> Governance averages identity, audit, policy, observability, and eval coverage: native 100, assembled 55, absent 0.</p>
                <p><strong className="text-[#202124]">Derived:</strong> Business Value normalizes quality, inverse p95 latency, governance, and cost efficiency using the adjustable weights shown here.</p>
                <p><strong className="text-[#202124]">Omitted:</strong> A separate Accuracy axis is not shown because the repo has answer scores for only some phases; presenting a workflow-wide number would overstate the evidence.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl bg-[#202124] px-6 py-6 text-white lg:flex lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-[#34A853]" />
            <div>
              <div className="text-sm font-bold">The optimal answer is not one model.</div>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#BDC1C6]">Cheapest everywhere is quality-infeasible. Best everywhere wastes spend. Workload-aware routing reaches the efficient frontier; GEAP pushes it further when governance and business value enter the decision.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
