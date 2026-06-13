"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Camera,
  Play,
  Star,
  Volume2,
  VolumeX,
  FileText,
  Zap,
  ArrowRight,
  CheckCircle2,
  Trophy,
} from "lucide-react";
import { callCost, fmtUSD, MODELS } from "@/lib/pricing";
import { S3, s3Costs } from "@/lib/scenarios";
import { S3_STATEMENTS } from "@/lib/content";
import { useTally } from "@/lib/tally-context";

/* ─── Color Tokens ─── */
const COLORS = {
  claude: { bg: "#F5F3FF", fill: "#7B61FF", border: "#C4B5FD", text: "#5B21B6", label: "All Opus" },
  gemini: { bg: "#FFF7ED", fill: "#E37400", border: "#FDBA74", text: "#9A3412", label: "Opus + Sonnet" },
  hybrid: { bg: "#F0FDF4", fill: "#188038", border: "#86EFAC", text: "#166534", label: "Opus + Flash" },
} as const;

type LaneKey = "claude" | "gemini" | "hybrid";

/* ─── Star Rating ─── */
function Stars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? "fill-amber-400 text-amber-400" : "text-zinc-300"}
        />
      ))}
    </span>
  );
}

/* ─── Single Animated Race Lane ─── */
function RaceLane({
  laneKey,
  durationMs,
  quality,
  running,
  label,
  segments,
  onFinish,
}: {
  laneKey: LaneKey;
  durationMs: number;
  quality: number;
  running: boolean;
  label: string;
  segments: { name: string; pct: number }[];
  onFinish: () => void;
}) {
  const color = COLORS[laneKey];
  const progress = useMotionValue(0);
  const msValue = useTransform(progress, (v) => Math.round(v * durationMs));
  const [displayMs, setDisplayMs] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) {
      progress.set(0);
      const resetFrame = requestAnimationFrame(() => {
        setDisplayMs(0);
        setDone(false);
      });
      return () => cancelAnimationFrame(resetFrame);
    }

    const controls = animate(progress, 1, {
      duration: durationMs / 1000,
      ease: "easeOut",
      onUpdate: (v) => setDisplayMs(Math.round(v * durationMs)),
      onComplete: () => {
        setDone(true);
        onFinish();
      },
    });

    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, durationMs]);

  // Percentage width for the fill bar
  const pctWidth = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Lane label row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold" style={{ color: color.text }}>
          {label}
        </span>
        <span className="text-xs font-mono tabular-nums text-zinc-500">
          {running || done ? `${displayMs.toLocaleString()} ms` : `${durationMs.toLocaleString()} ms target`}
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-10 w-full rounded-lg overflow-hidden border"
        style={{ backgroundColor: color.bg, borderColor: color.border }}
      >
        {/* Fill bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-lg"
          style={{
            width: pctWidth,
            backgroundColor: color.fill,
            opacity: 0.85,
          }}
        />

        {/* Segment labels overlay */}
        <div className="absolute inset-0 flex">
          {segments.map((seg, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-[10px] font-medium text-white/90 border-r border-white/20 last:border-r-0"
              style={{ width: `${seg.pct}%` }}
            >
              {seg.name}
            </div>
          ))}
        </div>

        {/* Finish indicator */}
        {done && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <CheckCircle2 size={20} className="text-white drop-shadow" />
          </motion.div>
        )}
      </div>

      {/* Quality badge shown after done */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-zinc-600"
        >
          <span>Quality:</span>
          <Stars count={quality} />
        </motion.div>
      )}
    </div>
  );
}

/* ─── Statement Mini Card ─── */
function StatementCard({
  title,
  period,
  summary,
  selected,
  onClick,
}: {
  title: string;
  period: string;
  summary: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border p-4 transition-all ${
        selected
          ? "border-[#188038] bg-green-50/60 ring-2 ring-[#188038]/20"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-zinc-100 p-2">
          <FileText size={18} className="text-zinc-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">{title}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{period}</p>
          <p className="text-xs text-zinc-600 mt-1.5 line-clamp-2">{summary}</p>
        </div>
        {selected && <CheckCircle2 size={18} className="text-[#188038] shrink-0 mt-0.5" />}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════ */

export default function MultimodalScenario() {
  const { updateResult } = useTally();
  const costs = s3Costs();

  /* ─── State ─── */
  const [selectedStmt, setSelectedStmt] = useState(0);
  const [voiceMode, setVoiceMode] = useState(false);
  const [raceState, setRaceState] = useState<"idle" | "running" | "done">("idle");
  const finishCount = useRef(0);

  /* ─── Latency data (text vs voice) ─── */
  const latencies = voiceMode
    ? { claude: S3.voice.allOpusMs, gemini: S3.voice.opusSonnetMs, hybrid: S3.voice.opusFlashMs }
    : {
        claude: S3.lanes.allOpus.latencyMs,
        gemini: S3.lanes.opusSonnet.latencyMs,
        hybrid: S3.lanes.opusFlash.latencyMs,
      };

  /* ─── Pipeline segments for each lane ─── */
  const textSegments = {
    claude: [
      { name: "Opus OCR", pct: 40 },
      { name: "Opus Analysis", pct: 35 },
      { name: "Opus Structured", pct: 25 },
    ],
    gemini: [
      { name: "Sonnet Vision", pct: 45 },
      { name: "Opus Analysis", pct: 35 },
      { name: "Opus Structured", pct: 20 },
    ],
    hybrid: [
      { name: "Flash Vision", pct: 35 },
      { name: "Opus Analysis", pct: 40 },
      { name: "Opus Structured", pct: 25 },
    ],
  };

  const voiceSegments = {
    claude: [
      { name: "STT", pct: 15 },
      { name: "Opus OCR", pct: 30 },
      { name: "Opus Analysis", pct: 30 },
      { name: "TTS", pct: 25 },
    ],
    gemini: [
      { name: "Sonnet Audio", pct: 30 },
      { name: "Sonnet Vision", pct: 30 },
      { name: "Opus Analysis", pct: 40 },
    ],
    hybrid: [
      { name: "Flash Audio", pct: 20 },
      { name: "Flash Vision", pct: 25 },
      { name: "Opus Analysis", pct: 35 },
      { name: "Flash Reply", pct: 20 },
    ],
  };

  const segments = voiceMode ? voiceSegments : textSegments;

  /* ─── Run the race ─── */
  const startRace = useCallback(() => {
    finishCount.current = 0;
    setRaceState("running");
  }, []);

  const handleLaneFinish = useCallback(() => {
    finishCount.current += 1;
    if (finishCount.current >= 3) {
      setRaceState("done");

      // Report S3 savings to tally
      const annualInteractions = S3.defaults.interactionsPerYear;
      const allFrontier = costs.opusSonnet * annualInteractions;
      const tiered = costs.opusFlash * annualInteractions;
      updateResult("s3", {
        label: "Multimodal Document Intelligence",
        allFrontier,
        tiered,
        savings: allFrontier - tiered,
        period: "annual",
      });
    }
  }, [costs, updateResult]);

  /* ─── Reset on voice toggle ─── */
  const toggleVoice = () => {
    setVoiceMode((v) => !v);
    setRaceState("idle");
    finishCount.current = 0;
  };

  /* ─── Comparison table data ─── */
  const lanes: { key: LaneKey; label: string; latency: number; cost: number; quality: number }[] = [
    { key: "claude", label: "All Opus", latency: latencies.claude, cost: costs.allOpus, quality: 5 },
    { key: "gemini", label: "Opus + Sonnet", latency: latencies.gemini, cost: costs.opusSonnet, quality: 5 },
    { key: "hybrid", label: "Opus + Flash", latency: latencies.hybrid, cost: costs.opusFlash, quality: 5 },
  ];

  /* ─── Winner determination ─── */
  const winner: LaneKey = "hybrid";

  return (
    <section id="multimodal" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Camera size={13} />
              Scenario 3 — Run Phase
            </span>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Multimodal &amp; Latency
          </h2>
          <p className="mt-3 text-lg text-zinc-600 max-w-2xl">
            Client photographs a statement and asks{" "}
            <span className="font-semibold text-zinc-800">&ldquo;what changed?&rdquo;</span>{" "}
            — keeping Opus for financial reasoning while comparing Sonnet and Flash on extraction.
          </p>
        </motion.div>

        {/* ─── Statement Cards ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Incoming Statements
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {S3_STATEMENTS.map((stmt, i) => (
              <StatementCard
                key={stmt.id}
                title={stmt.title}
                period={stmt.period}
                summary={stmt.summary}
                selected={selectedStmt === i}
                onClick={() => setSelectedStmt(i)}
              />
            ))}
          </div>
        </motion.div>

        {/* ─── Controls Row ─── */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={raceState === "running" ? undefined : startRace}
            disabled={raceState === "running"}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-emerald-200/50 ${
              raceState === "running"
                ? "bg-zinc-400 cursor-not-allowed"
                : "bg-[#188038] hover:bg-[#146e2e] active:scale-[0.98]"
            }`}
          >
            {raceState === "running" ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Running…
              </>
            ) : raceState === "done" ? (
              <>
                <Play size={16} />
                Re-run Analysis
              </>
            ) : (
              <>
                <Play size={16} />
                Run Analysis
              </>
            )}
          </button>

          {/* Voice toggle */}
          <button
            onClick={toggleVoice}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium border transition-all ${
              voiceMode
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
            }`}
          >
            {voiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {voiceMode ? "Voice Mode On" : "Voice Mode Off"}
          </button>

          {voiceMode && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-blue-600 bg-blue-50 rounded-full px-3 py-1"
            >
              Flash handles native audio and extraction before Opus reasons over the result
            </motion.span>
          )}
        </div>

        {/* ─── Race Lanes (Hero Visual) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              Pipeline Race — {voiceMode ? "Voice" : "Text"} Mode
            </h3>
            {raceState === "done" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 ring-1 ring-emerald-200"
              >
                <Trophy size={13} />
                Race Complete
              </motion.span>
            )}
          </div>

          <div className="space-y-6">
            {(["claude", "gemini", "hybrid"] as const).map((key) => (
              <RaceLane
                key={`${key}-${voiceMode}`}
                laneKey={key}
                durationMs={latencies[key]}
                  quality={5}
                running={raceState === "running" || raceState === "done"}
                label={
                  key === "claude"
                    ? S3.lanes.allOpus.label
                    : key === "gemini"
                    ? S3.lanes.opusSonnet.label
                    : S3.lanes.opusFlash.label
                }
                segments={segments[key]}
                onFinish={handleLaneFinish}
              />
            ))}
          </div>

          {/* Max latency scale */}
          <div className="mt-4 flex justify-between text-[10px] text-zinc-400 font-mono tabular-nums px-0.5">
            <span>0 ms</span>
            <span>{voiceMode ? "4,400 ms" : "3,800 ms"}</span>
          </div>
        </motion.div>

        {/* ─── Comparison Table (shows after race) ─── */}
        {raceState === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden mb-12"
          >
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="text-sm font-bold text-zinc-800">
                Per-Interaction Comparison
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-500">
                    <th className="text-left font-medium px-6 py-3">Pipeline</th>
                    <th className="text-right font-medium px-6 py-3">Latency</th>
                    <th className="text-right font-medium px-6 py-3">Cost / Interaction</th>
                    <th className="text-center font-medium px-6 py-3">Quality</th>
                    <th className="text-right font-medium px-6 py-3">Annual Cost (2M)</th>
                  </tr>
                </thead>
                <tbody>
                  {lanes.map((lane) => {
                    const annual = lane.cost * S3.defaults.interactionsPerYear;
                    const isWinner = lane.key === winner;
                    return (
                      <tr
                        key={lane.key}
                        className={`border-b border-zinc-50 last:border-b-0 ${
                          isWinner ? "bg-green-50/40" : ""
                        }`}
                      >
                        <td className="px-6 py-3.5 font-semibold flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: COLORS[lane.key].fill }}
                          />
                          {lane.label}
                          {isWinner && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 rounded px-1.5 py-0.5 uppercase">
                              Best Value
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-right font-mono tabular-nums text-zinc-700">
                          {lane.latency.toLocaleString()} ms
                        </td>
                        <td className="px-6 py-3.5 text-right font-mono tabular-nums text-zinc-700">
                          {fmtUSD(lane.cost)}
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <Stars count={lane.quality} />
                        </td>
                        <td className="px-6 py-3.5 text-right font-mono tabular-nums text-zinc-700">
                          {fmtUSD(annual, 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Savings callout */}
            <div className="px-6 py-4 bg-emerald-50/50 border-t border-emerald-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Opus + Flash saves{" "}
                    <span className="font-mono tabular-nums">
                      {fmtUSD(
                        (costs.opusSonnet - costs.opusFlash) * S3.defaults.interactionsPerYear,
                        0
                      )}
                    </span>
                    /year vs Opus + Sonnet
                  </p>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    At {(S3.defaults.interactionsPerYear / 1_000_000).toFixed(0)}M interactions/year — the same Opus reasoning endpoint, with a faster extraction tier
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">Hybrid cost/interaction</p>
                  <p className="text-lg font-bold font-mono tabular-nums text-emerald-700">
                    {fmtUSD(costs.opusFlash)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Honesty Callout ─── */}
        {raceState === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 mb-12"
          >
            <div className="flex gap-3">
              <div className="mt-0.5">
                <Star size={18} className="text-amber-500 fill-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Honest quality note
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Flash is not replacing Opus on deep financial reasoning. It handles
                  multimodal extraction and normalization, then passes structured context
                  to Opus for tax-lot analysis, reconciliation, and the client-facing answer.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── Cost Breakdown Detail ─── */}
        {raceState === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm"
          >
            <h3 className="text-sm font-bold text-zinc-800 mb-4">
              How the Hybrid Pipeline Works
            </h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Camera size={20} className="text-blue-600" />
                </div>
                <p className="text-xs font-semibold text-blue-800 mb-1">
                  1. Flash Vision Ingest
                </p>
                <p className="text-xs text-blue-600">
                  {MODELS.flash.name} reads the photo natively — no OCR step needed.
                  Extracts structured data at {fmtUSD(callCost("flash", S3.visionInput, S3.structuredOut))}/call.
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex items-center justify-center">
                <ArrowRight size={24} className="text-zinc-300" />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                  <Zap size={20} className="text-emerald-600" />
                </div>
                <p className="text-xs font-semibold text-emerald-800 mb-1">
                  2. Opus Deep Analysis
                </p>
                <p className="text-xs text-emerald-600">
                  {MODELS.opus.name} analyzes changes, flags anomalies, and generates
                  the client-facing explanation at {fmtUSD(callCost("opus", S3.structuredReInput, S3.analysisOut))}/call.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-wrap items-center gap-6 text-xs text-zinc-500">
              <span>
                <strong className="text-zinc-700">Flash sees. Opus thinks.</strong> Use each model for the work it does best.
              </span>
              <span className="font-mono tabular-nums">
                Combined: {fmtUSD(costs.opusFlash)} / interaction
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
