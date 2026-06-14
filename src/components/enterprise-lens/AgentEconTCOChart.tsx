"use client";

import { INPUTS, tco, rankByTCO, CROSSOVERS, type Approach } from "@/lib/economics";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceArea, Legend,
} from "recharts";
import { useMemo } from "react";

const APPROACHES: Approach[] = ["directApi", "internalPlatform", "bestOfBreed", "integratedPlatform"];
const CROSSOVER_Ns = [10, 50, 200];

interface Props {
  nAgents: number;
  setNAgents: (n: number) => void;
  engRateK: number;
  modelCostK: number;
}

export default function AgentEconTCOChart({ nAgents, setNAgents, engRateK, modelCostK }: Props) {
  const chartData = useMemo(() => {
    const points: Record<string, number>[] = [];
    for (let n = 1; n <= 250; n += (n < 20 ? 1 : n < 60 ? 2 : 5)) {
      const pt: Record<string, number> = { n };
      APPROACHES.forEach((a) => {
        pt[a] = Math.round(tco(a, n, engRateK));
      });
      // Model cost band (same for all — shown as a reference floor)
      pt.modelFloor = Math.round(n * modelCostK);
      points.push(pt);
    }
    return points;
  }, [engRateK, modelCostK]);

  const currentRanking = rankByTCO(nAgents, engRateK);

  const fmtK = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(1)}M` : `$${v}K`;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: number }) => {
    if (!active || !payload) return null;
    const sorted = [...(payload ?? [])].sort((a, b) => a.value - b.value);
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg text-xs min-w-[180px]">
        <p className="font-bold text-gray-600 mb-2">N = {label} agents</p>
        {sorted.map((p) => {
          if (p.name === "modelFloor") return null;
          const a = p.name as Approach;
          return (
            <div key={p.name} className="flex items-center justify-between gap-3 mb-0.5">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: INPUTS[a].color }} />
                <span className="text-gray-500 text-[10px]">{INPUTS[a].label}</span>
              </span>
              <span className="font-bold tabular-nums" style={{ color: INPUTS[a].color }}>{fmtK(p.value)}</span>
            </div>
          );
        })}
        <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400">
          Token band: ~{fmtK(Math.round(label! * modelCostK))} (same for all)
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Economics vs scale — Year-1 TCO</h3>
        <p className="text-sm text-gray-500">
          Model/token cost is held equal across all approaches (shaded band) so the chart isolates platform economics.
          Move the slider to see how the ranking changes. Crossovers at N=10, 50, 200 are annotated.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 4, left: 8 }}>
          <XAxis dataKey="n" type="number" domain={[1, 250]}
            tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false}
            label={{ value: "Number of agents", position: "insideBottom", offset: -2, fontSize: 10, fill: "#9AA0A6" }} />
          <YAxis tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}M` : `$${v}K`} width={54} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10 }} iconType="plainline" />

          {/* Model cost band */}
          <Line dataKey="modelFloor" stroke="#86efac" strokeWidth={1} strokeDasharray="3 3"
            dot={false} legendType="none" name="modelFloor" />

          {/* Crossover reference lines */}
          {CROSSOVER_Ns.map((n) => (
            <ReferenceLine key={n} x={n} stroke="#E8EAED" strokeDasharray="4 2" />
          ))}

          {/* Current N marker */}
          <ReferenceLine x={nAgents} stroke="#64748b" strokeDasharray="2 2" strokeWidth={1.5} />

          {/* TCO lines */}
          {APPROACHES.map((a) => (
            <Line
              key={a}
              dataKey={a}
              name={INPUTS[a].label}
              stroke={INPUTS[a].color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* N slider */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agent estate size</span>
          <span className="text-lg font-bold tabular-nums text-gray-800">N = {nAgents}</span>
        </div>
        <input type="range" min={1} max={250} step={1} value={nAgents}
          onChange={(e) => setNAgents(Number(e.target.value))}
          className="w-full h-2 cursor-pointer accent-slate-600 mb-1" />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>1</span>
          {CROSSOVER_Ns.map((n) => <span key={n}>{n}</span>)}
          <span>250</span>
        </div>
      </div>

      {/* Current ranking */}
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ranking at N = {nAgents}</span>
          <span className="text-[10px] text-gray-400">@ ${engRateK}K/eng-month</span>
        </div>
        <div className="divide-y divide-gray-50">
          {currentRanking.map((r, i) => (
            <div key={r.approach} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-gray-300 w-4">{i + 1}</span>
                <span className="h-2.5 w-2.5 rounded-full flex-none" style={{ backgroundColor: INPUTS[r.approach].color }} />
                <span className="text-xs text-gray-700">{INPUTS[r.approach].label}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold tabular-nums" style={{ color: INPUTS[r.approach].color }}>{fmtK(r.tcoK)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crossover annotations */}
      <div className="grid grid-cols-3 gap-3">
        {CROSSOVERS.map((c) => (
          <button
            key={c.n}
            onClick={() => setNAgents(c.n)}
            className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-left hover:border-gray-200 transition-colors group">
            <p className="text-xs font-bold text-gray-700 mb-1 group-hover:text-blue-700">N = {c.n}</p>
            <p className="text-[10px] text-gray-500 leading-snug">{c.insight}</p>
          </button>
        ))}
      </div>

      {/* Model cost note */}
      <div className="rounded-xl border border-green-100 bg-green-50 p-3">
        <p className="text-[11px] text-green-700 leading-relaxed">
          <strong>Token band (green dashes):</strong> ~${modelCostK}K/agent/year in model/token cost — equal for all approaches.
          At N={nAgents} this is {fmtK(nAgents * modelCostK)} total, or {
            (() => {
              const totalIntegrated = tco("integratedPlatform", nAgents, engRateK);
              return ((nAgents * modelCostK / totalIntegrated) * 100).toFixed(0);
            })()
          }% of the integrated platform's TCO. The platform decision is made off the token line.
        </p>
      </div>

      <p className="text-[11px] text-gray-400 italic">
        [ASSUMPTION] All figures $K Year-1. Crossovers verified at base $18K/eng-month.
        Changing eng-rate or model cost moves curves and can change the recommendation.
        What would flip the answer: eng rate below $10K/mo favors internal platform and best-of-breed;
        runPerAgentYr above $30K on integrated platform shifts the N=150–200 crossover earlier.
      </p>
    </div>
  );
}
