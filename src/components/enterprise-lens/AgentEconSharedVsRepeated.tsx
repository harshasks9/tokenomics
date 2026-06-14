"use client";

import { INPUTS, tco, type Approach } from "@/lib/economics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const APPROACHES: Approach[] = ["directApi", "internalPlatform", "bestOfBreed", "integratedPlatform"];

const FIXED_COLOR    = "#94a3b8"; // slate-400 — shared/fixed costs
const VARIABLE_COLOR = "#1A73E8"; // blue — per-agent repeated costs

interface Props {
  nAgents: number;
  engRateK: number;
}

export default function AgentEconSharedVsRepeated({ nAgents, engRateK }: Props) {
  const labScale = engRateK / 18;

  const data = APPROACHES.map((a) => {
    const m = INPUTS[a];
    const fixed    = m.buildFixed * labScale + m.licenseYr;
    const repeated = nAgents * (m.integPerAgent * labScale + m.runPerAgentYr);
    const total    = fixed + repeated;
    return {
      name: m.label.replace("Integrated platform", "Integrated").replace("Reusable internal platform", "Internal platform"),
      Fixed: Math.round(fixed),
      "Per-agent (×N)": Math.round(repeated),
      total: Math.round(total),
      approach: a,
    };
  });

  const fmtK = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(1)}M` : `$${v}K`;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
    if (!active || !payload) return null;
    const row = data.find((d) => d.name === label);
    const fixedPct = row ? ((row.Fixed / row.total) * 100).toFixed(0) : "0";
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg text-xs">
        <p className="font-bold text-gray-800 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex justify-between gap-4">
            <span className="text-gray-500">{p.name}</span>
            <span className="font-semibold">{fmtK(p.value)}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-100 text-gray-400">
          Fixed share: {fixedPct}% — {100 - parseInt(fixedPct)}% scales with N
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-1">What scales vs what's shared once?</h3>
        <p className="text-sm text-gray-500">
          Fixed costs (build + licenses) are paid once regardless of agent count.
          Per-agent costs repeat every time you add an agent — this is where reuse matters.
          At N = <strong>{nAgents}</strong>.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }} barGap={6}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}M` : `$${v}K`} width={54} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} iconType="square" iconSize={10} />
          <Bar dataKey="Fixed" stackId="a" fill={FIXED_COLOR} radius={[0, 0, 0, 0]} maxBarSize={52} />
          <Bar dataKey="Per-agent (×N)" stackId="a" fill={VARIABLE_COLOR} radius={[4, 4, 0, 0]} maxBarSize={52} />
        </BarChart>
      </ResponsiveContainer>

      {/* Reuse callout table */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2 font-bold text-gray-500 uppercase tracking-wide text-[10px]">Approach</th>
              <th className="text-right px-3 py-2 font-bold text-gray-500 uppercase tracking-wide text-[10px]">Fixed</th>
              <th className="text-right px-3 py-2 font-bold text-gray-500 uppercase tracking-wide text-[10px]">Per-agent</th>
              <th className="text-right px-3 py-2 font-bold text-gray-500 uppercase tracking-wide text-[10px]">Total @N={nAgents}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.approach} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-700 font-medium">{d.name}</td>
                <td className="px-3 py-2 text-right tabular-nums text-gray-500">{fmtK(d.Fixed)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-gray-500">{fmtK(d["Per-agent (×N)"])}</td>
                <td className="px-3 py-2 text-right tabular-nums font-bold" style={{ color: INPUTS[d.approach].color }}>
                  {fmtK(d.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-gray-400 italic">
        [ASSUMPTION] All figures scaled at ${engRateK}K/eng-month. Fixed = buildFixed + licenseYr. Per-agent = (integPerAgent + runPerAgentYr) × N.
        Model/token cost is included equally in all approaches' per-agent figures.
      </p>
    </div>
  );
}
