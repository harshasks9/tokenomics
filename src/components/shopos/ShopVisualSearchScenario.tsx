"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Camera, Play, Star, CheckCircle2, Zap, AlertCircle,
} from "lucide-react";
import { callCost, fmtUSD, MODELS } from "@/lib/pricing";
import { SHOP_S3, SHOP_S3_CARDS, shopS3Costs } from "@/lib/industries/shopos";
import { useTally } from "@/lib/tally-context";

const COLORS = {
  pureClaude:   { bg: "#FFF7ED", fill: "#7B61FF", border: "#C4B5FD", text: "#5B21B6", label: "Pure Claude (Opus)" },
  pureGemPro:   { bg: "#F0FDF4", fill: "#34A853", border: "#86EFAC", text: "#166534", label: "Gemini 3.1 Pro" },
  pureGemFlash: { bg: "#EFF6FF", fill: "#1A73E8", border: "#93C5FD", text: "#1E40AF", label: "Gemini 3.5 Flash" },
  hybridOpus:   { bg: "#FEF3E0", fill: "#E37400", border: "#FCD34D", text: "#92400E", label: "Hybrid → Opus" },
  hybridSonnet: { bg: "#F0FDF4", fill: "#188038", border: "#86EFAC", text: "#166534", label: "Hybrid → Sonnet" },
} as const;

type LaneKey = keyof typeof COLORS;

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={12} className={i < count ? "fill-amber-400 text-amber-400" : "text-zinc-300 fill-zinc-200"} />
      ))}
    </span>
  );
}

function RaceLane({ laneKey, durationMs, quality, running, label, onFinish }: {
  laneKey: LaneKey; durationMs: number; quality: number; running: boolean; label: string; onFinish: () => void;
}) {
  const color = COLORS[laneKey];
  const progress = useMotionValue(0);
  const [displayMs, setDisplayMs] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) { progress.set(0); setDisplayMs(0); setDone(false); return; }
    const controls = animate(progress, 1, {
      duration: durationMs / 1000,
      ease: "easeOut",
      onUpdate: (v) => setDisplayMs(Math.round(v * durationMs)),
      onComplete: () => { setDone(true); onFinish(); },
    });
    return () => controls.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, durationMs]);

  const pctWidth = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: color.text }}>{label}</span>
        <span className="text-xs font-mono tabular-nums text-zinc-500">
          {running || done ? `${displayMs.toLocaleString()} ms` : `${durationMs.toLocaleString()} ms`}
        </span>
      </div>
      <div className="relative h-8 w-full rounded-lg overflow-hidden border" style={{ backgroundColor: color.bg, borderColor: color.border }}>
        <motion.div className="absolute inset-y-0 left-0 rounded-lg" style={{ width: pctWidth, backgroundColor: color.fill, opacity: 0.8 }} />
        {done && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-2 top-1/2 -translate-y-1/2">
            <CheckCircle2 size={16} className="text-white drop-shadow" />
          </motion.div>
        )}
      </div>
      {done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Quality:</span><Stars count={quality} />
          {quality < 5 && <span className="text-amber-500 text-[10px]">⚠ Flash misses fine-grained attributes</span>}
        </motion.div>
      )}
    </div>
  );
}

export default function ShopVisualSearchScenario() {
  const { updateResult } = useTally();
  const costs = shopS3Costs();
  const [selectedCard, setSelectedCard] = useState(0);
  const [raceState, setRaceState] = useState<"idle" | "running" | "done">("idle");
  const finishCount = useRef(0);

  const card = SHOP_S3_CARDS[selectedCard];

  const laneConfig: { key: LaneKey; durationMs: number; quality: number; cost: number }[] = [
    { key: "pureClaude",   durationMs: SHOP_S3.lanes.pureClaude.latencyMs,   quality: 5, cost: costs.pureClaude   },
    { key: "pureGemPro",   durationMs: SHOP_S3.lanes.pureGemPro.latencyMs,   quality: 5, cost: costs.pureGemPro   },
    { key: "hybridSonnet", durationMs: SHOP_S3.lanes.hybridSonnet.latencyMs, quality: 5, cost: costs.hybridSonnet },
    { key: "hybridOpus",   durationMs: SHOP_S3.lanes.hybridOpus.latencyMs,   quality: 5, cost: costs.hybridOpus   },
    { key: "pureGemFlash", durationMs: SHOP_S3.lanes.pureGemFlash.latencyMs, quality: 4, cost: costs.pureGemFlash },
  ];

  const startRace = useCallback(() => { finishCount.current = 0; setRaceState("running"); }, []);

  const handleLaneFinish = useCallback(() => {
    finishCount.current += 1;
    if (finishCount.current >= laneConfig.length) {
      setRaceState("done");
      const annual = SHOP_S3.defaults.interactionsPerYear;
      updateResult("s3", {
        label: "Visual Search",
        allFrontier: costs.pureClaude * annual,
        tiered: costs.hybridSonnet * annual,
        savings: (costs.pureClaude - costs.hybridSonnet) * annual,
        period: "annual",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [costs]);

  return (
    <section id="shop-visual" className="py-24 px-6 bg-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
              <Camera size={13} /> Scenario 3 — Run Phase
            </span>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Visual Search</h2>
          <p className="mt-3 text-lg text-zinc-600 max-w-2xl">
            Shopper photographs an outfit, room, or product — the app returns matching items. Five pipelines, ranked by speed and cost.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 w-fit">
            <AlertCircle size={13} className="text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">
              Sub-second visual search is a conversion event — every 100 ms of latency correlates with lower add-to-cart rates.
            </span>
          </div>
        </motion.div>

        {/* Visual search cards */}
        <div className="mb-10">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Shopper Input (select to demo)</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {SHOP_S3_CARDS.map((c, i) => (
              <button key={c.id} onClick={() => setSelectedCard(i)}
                className={`text-left rounded-xl border p-4 transition-all ${selectedCard === i ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-200" : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"}`}>
                <div className="w-full h-28 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center mb-3 gap-1">
                  <Camera size={28} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-medium">{c.title}</span>
                </div>
                <p className="text-xs font-semibold text-zinc-800 mb-1.5">{c.description}</p>
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Matched products */}
        <div className="mb-10 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Matched Products — {card.title}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {card.matchedProducts.map((p) => (
              <div key={p.name} className="rounded-lg bg-white border border-zinc-200 p-3">
                <div className="w-full h-16 rounded-md bg-gradient-to-br from-slate-100 to-slate-200 mb-2 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400">{p.category}</span>
                </div>
                <p className="text-[11px] font-semibold text-zinc-800 leading-tight mb-1">{p.name}</p>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 rounded-full bg-emerald-100 flex-1">
                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${p.confidence}%` }} />
                  </div>
                  <span className="text-[10px] text-zinc-400 tabular-nums">{p.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Race controls */}
        <div className="flex gap-3 mb-6">
          <button onClick={raceState === "running" ? undefined : startRace} disabled={raceState === "running"}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all ${
              raceState === "running" ? "bg-zinc-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
            }`}>
            {raceState === "running" ? (<><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Running…</>) : (<><Play size={15} /> {raceState === "done" ? "Re-run" : "Run Pipeline Race"}</>)}
          </button>
        </div>

        {/* 5-lane race */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Zap size={16} className="text-amber-500" />
            <h3 className="text-sm font-bold text-zinc-900">Pipeline Race — 5 Lanes</h3>
            {raceState === "done" && (
              <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 ring-1 ring-emerald-200">✓ Race Complete</span>
            )}
          </div>
          <div className="space-y-5">
            {laneConfig.map((lane) => (
              <RaceLane key={`${lane.key}-${selectedCard}`} laneKey={lane.key} durationMs={lane.durationMs}
                quality={lane.quality} running={raceState === "running" || raceState === "done"}
                label={COLORS[lane.key].label} onFinish={handleLaneFinish} />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] text-zinc-400 font-mono px-0.5">
            <span>0 ms</span><span>3,500 ms</span>
          </div>
        </div>

        {/* Comparison table */}
        {raceState === "done" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="text-sm font-bold text-zinc-800">Per-Interaction Comparison</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Quality-5 pipelines sorted by cost · @{(SHOP_S3.defaults.interactionsPerYear / 1_000_000).toFixed(0)}M interactions/yr</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-500">
                    <th className="text-left font-medium px-5 py-3">Pipeline</th>
                    <th className="text-right font-medium px-5 py-3">Latency</th>
                    <th className="text-right font-medium px-5 py-3">Cost/Interaction</th>
                    <th className="text-center font-medium px-5 py-3">Quality</th>
                    <th className="text-right font-medium px-5 py-3">Annual Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: "pureClaude"   as LaneKey, cost: costs.pureClaude,   quality: 5 },
                    { key: "hybridOpus"   as LaneKey, cost: costs.hybridOpus,   quality: 5 },
                    { key: "pureGemPro"   as LaneKey, cost: costs.pureGemPro,   quality: 5 },
                    { key: "hybridSonnet" as LaneKey, cost: costs.hybridSonnet, quality: 5 },
                    { key: "pureGemFlash" as LaneKey, cost: costs.pureGemFlash, quality: 4 },
                  ].map((row) => {
                    const annual = row.cost * SHOP_S3.defaults.interactionsPerYear;
                    const isBest = row.key === "hybridSonnet";
                    return (
                      <tr key={row.key} className={`border-b border-zinc-50 last:border-b-0 ${isBest ? "bg-emerald-50/40" : ""}`}>
                        <td className="px-5 py-3 font-semibold flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[row.key].fill }} />
                          {COLORS[row.key].label}
                          {isBest && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded px-1.5 py-0.5 uppercase">Best Value</span>}
                        </td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums text-zinc-700">{SHOP_S3.lanes[row.key].latencyMs.toLocaleString()} ms</td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums text-zinc-700">{fmtUSD(row.cost)}</td>
                        <td className="px-5 py-3 text-center"><Stars count={row.quality} /></td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums text-zinc-700">{fmtUSD(annual, 0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-emerald-50/50 border-t border-emerald-100">
              <p className="text-sm font-semibold text-emerald-800">
                Hybrid → Sonnet saves <span className="font-mono">{fmtUSD((costs.pureClaude - costs.hybridSonnet) * SHOP_S3.defaults.interactionsPerYear, 0)}</span>/yr vs Pure Claude
              </p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Quality-5 match · 1.6s latency · {((1 - SHOP_S3.lanes.hybridSonnet.latencyMs / SHOP_S3.lanes.pureClaude.latencyMs) * 100).toFixed(0)}% faster · {((1 - costs.hybridSonnet / costs.pureClaude) * 100).toFixed(0)}% cheaper
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
