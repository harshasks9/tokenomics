"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTally } from "@/lib/tally-context";
import { pctSavings } from "@/lib/pricing";
import { buildCosts } from "@/lib/profiles/calculator";
import type { CustomerProfile } from "@/lib/profiles/types";

const TIER_STYLE = {
  flashLite: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Flash-Lite" },
  flash:     { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    label: "Flash"      },
  opus:      { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  label: "Opus"       },
};

function TaskRow({ title, tier, why }: { title: string; tier: "flashLite" | "flash" | "opus"; why: string }) {
  const s = TIER_STYLE[tier];
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[#F1F3F4] last:border-0">
      <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
        {s.label}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#202124] leading-snug">{title}</p>
        <p className="text-xs text-[#9AA0A6] mt-0.5">{why}</p>
      </div>
    </div>
  );
}

const fmtMoney = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(2)}M`
  : v >= 1_000   ? `$${(v / 1_000).toFixed(1)}K`
  : `$${v.toFixed(0)}`;

export default function ProfileBuildScenario({ profile }: { profile: CustomerProfile }) {
  const [devs, setDevs] = useState(profile.build.defaultDevs);
  const [sprints, setSprints] = useState(profile.build.defaultSprints);
  const { updateResult } = useTally();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const costs = buildCosts(profile, devs, sprints);
  const savings = costs.allOpusTotal - costs.tieredTotal;
  const savingsPct = pctSavings(costs.allOpusTotal, costs.tieredTotal);

  useEffect(() => {
    updateResult("s1", {
      label: "Build",
      allFrontier: costs.allOpusTotal,
      tiered: costs.tieredTotal,
      savings,
      period: "one-time",
    });
  }, [costs.allOpusTotal, costs.tieredTotal, savings]);

  const chartData = [
    { name: "Per Sprint", "All-Opus": costs.allOpusPerSprint, Tiered: costs.tieredPerSprint },
    { name: "Total",      "All-Opus": costs.allOpusTotal,     Tiered: costs.tieredTotal     },
  ];

  const { flashLitePct, flashPct, opusPct } = profile.build.mix;

  return (
    <section id="build" ref={ref} className="bg-white border-b border-[#E8EAED]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#202124] mb-2">{profile.build.title}</h2>
          <p className="text-[#5F6368] text-lg max-w-2xl mb-10">{profile.build.description}</p>

          {/* Model mix chips */}
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="text-xs font-semibold text-[#5F6368] self-center mr-1">Model mix:</span>
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1">
              {(flashLitePct * 100).toFixed(0)}% Flash-Lite
            </span>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1">
              {(flashPct * 100).toFixed(0)}% Flash
            </span>
            <span className="text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200 rounded-full px-3 py-1">
              {(opusPct * 100).toFixed(0)}% Opus
            </span>
          </div>

          {/* Sliders */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="block text-sm font-semibold text-[#202124] mb-3">
                Developers: <span className="font-extrabold">{devs}</span>
              </label>
              <input type="range" min={1} max={50} step={1} value={devs}
                onChange={(e) => setDevs(Number(e.target.value))}
                className="w-full accent-[var(--profile-color)]"
                style={{ accentColor: profile.color }}
              />
              <div className="flex justify-between text-[10px] text-[#9AA0A6] mt-1"><span>1</span><span>50</span></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#202124] mb-3">
                Sprints: <span className="font-extrabold">{sprints}</span>
              </label>
              <input type="range" min={1} max={26} step={1} value={sprints}
                onChange={(e) => setSprints(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: profile.color }}
              />
              <div className="flex justify-between text-[10px] text-[#9AA0A6] mt-1"><span>1</span><span>26</span></div>
            </div>
          </div>

          {/* Cost comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: "All Opus (baseline)", value: costs.allOpusTotal, sub: `${fmtMoney(costs.allOpusPerSprint)}/sprint`, color: "#E37400" },
              { label: "Tiered (recommended)", value: costs.tieredTotal, sub: `${fmtMoney(costs.tieredPerSprint)}/sprint`, color: "#188038" },
              { label: "You save", value: savings, sub: `${savingsPct.toFixed(0)}% reduction`, color: profile.color },
            ].map((c) => (
              <div key={c.label} className="card">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] mb-2">{c.label}</p>
                <p className="text-3xl font-extrabold mb-1" style={{ color: c.color }}>{fmtMoney(c.value)}</p>
                <p className="text-xs text-[#9AA0A6]">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart + task list */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chart */}
            <div className="card">
              <h3 className="text-base font-bold text-[#202124] mb-4">All-Opus vs Tiered</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barGap={4}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9AA0A6" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `$${(v/1000).toFixed(0)}K` : `$${v}`} width={52} />
                  <Tooltip formatter={(v: unknown) => [fmtMoney(Number(v))]}
                    contentStyle={{ borderRadius: 8, fontSize: 11, border: "1px solid #E8EAED" }} />
                  <Bar dataKey="All-Opus" fill="#E37400" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="Tiered"   fill="#188038" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Task list */}
            <div className="card overflow-y-auto max-h-80">
              <h3 className="text-base font-bold text-[#202124] mb-3">Sample Development Tasks</h3>
              {profile.build.tasks.map((t, i) => (
                <TaskRow key={i} title={t.title} tier={t.tier} why={t.why} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
