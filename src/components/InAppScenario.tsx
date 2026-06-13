"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ThumbsUp,
  ChevronRight,
  Sparkles,
  TrendingDown,
  DollarSign,
  BarChart3,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

import { callCost, fmtUSD, pctSavings, MODELS } from "@/lib/pricing";
import { S2, s2Costs } from "@/lib/scenarios";
import { S2_QA_PAIRS, type S2QAPair } from "@/lib/content";
import { useTally } from "@/lib/tally-context";

// ─── Constants ──────────────────────────────────────────────────────────────
const GREEN = "#188038";
const AMBER = "#E37400";
const BLUE = "#1A73E8";

const VOLUME_MIN = 100_000;
const VOLUME_MAX = 10_000_000;
const VOLUME_DEFAULT = 5_000_000;
const VOLUME_STEP = 100_000;

const CATEGORY_LABELS: Record<S2QAPair["category"], string> = {
  routine: "Routine Lookup",
  faq: "FAQ / Education",
  complex: "Complex Planning",
};

const CATEGORY_COLORS: Record<S2QAPair["category"], string> = {
  routine: "bg-emerald-100 text-emerald-800",
  faq: "bg-blue-100 text-blue-800",
  complex: "bg-amber-100 text-amber-800",
};

// ─── CountUp Animation ─────────────────────────────────────────────────────
function CountUp({
  target,
  prefix = "",
  suffix = "",
  duration = 1.2,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        start = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };
    start = requestAnimationFrame(step);
    return () => cancelAnimationFrame(start);
  }, [target, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {fmtUSD(value)}
      {suffix}
    </span>
  );
}

// ─── Score Stars ────────────────────────────────────────────────────────────
function ScoreStars({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-500 w-24">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={
              i <= score
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 tabular-nums">{score}/5</span>
    </div>
  );
}

// ─── Cost Bar Chart Tooltip ─────────────────────────────────────────────────
function CostTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { name: string } }> }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3">
      <p className="text-sm font-semibold text-gray-900">
        {payload[0].payload.name}
      </p>
      <p className="text-sm text-gray-600 tabular-nums">
        {fmtUSD(payload[0].value)}/mo
      </p>
    </div>
  );
}

// ─── Per-query Cost Tag ─────────────────────────────────────────────────────
function CostTag({ model, label }: { model: "opus" | "flash" | "flashLite"; label: string }) {
  const cost = callCost(model, S2.query.inTok, S2.query.outTok);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
      className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full"
    >
      <DollarSign size={12} className="text-gray-400" />
      <span className="text-xs text-gray-500">
        {label}: <strong className="tabular-nums text-gray-700">{fmtUSD(cost, 6)}</strong>/query
      </span>
    </motion.div>
  );
}

// ─── Markdown-ish renderer (bold only) ──────────────────────────────────────
function RenderAnswer({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="text-sm text-gray-700 leading-relaxed space-y-1">
      {lines.map((line, i) => {
        // Parse **bold** segments
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={line === "" ? "h-2" : ""}>
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={j} className="font-semibold text-gray-900">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function InAppScenario() {
  // ── State ──────────────────────────────────────────────────────────────
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [vote, setVote] = useState<"A" | "B" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [volume, setVolume] = useState(VOLUME_DEFAULT);
  const { updateResult } = useTally();

  // Randomize left/right placement so the vote is truly blind
  const [shuffle] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    S2_QA_PAIRS.forEach((qa) => {
      map[qa.id] = Math.random() > 0.5; // true = flash on left
    });
    return map;
  });

  const currentQ = useMemo(
    () => S2_QA_PAIRS.find((qa) => qa.id === selectedQ) ?? null,
    [selectedQ]
  );

  const isFlashLeft = selectedQ ? shuffle[selectedQ] : true;

  const costs = useMemo(() => s2Costs(volume), [volume]);

  const savingsPct = useMemo(
    () => pctSavings(costs.allFrontier, costs.tiered),
    [costs]
  );

  // Chart data
  const chartData = useMemo(
    () => [
      { name: "All-Frontier (Opus)", cost: costs.allFrontier, color: AMBER },
      { name: "Tiered Routing", cost: costs.tiered, color: GREEN },
    ],
    [costs]
  );

  // ── Tally sync ────────────────────────────────────────────────────────
  useEffect(() => {
    updateResult("s2", {
      label: "In-App Intelligence",
      allFrontier: costs.allFrontier * 12,
      tiered: costs.tiered * 12,
      savings: costs.savingsAnnual,
      period: "annual",
    });
  }, [costs, updateResult]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleSelectQuestion = useCallback((id: string) => {
    setSelectedQ(id);
    setVote(null);
    setRevealed(false);
  }, []);

  const handleVote = useCallback((choice: "A" | "B") => {
    setVote(choice);
    // Reveal after a short delay for dramatic effect
    setTimeout(() => setRevealed(true), 600);
  }, []);

  const fmtVolume = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    return `${(v / 1_000).toFixed(0)}K`;
  };

  // ── Determine which model is shown in which column ────────────────────
  const leftModel = isFlashLeft ? "flash" : "opus";
  const rightModel = isFlashLeft ? "opus" : "flash";
  const leftAnswer = currentQ
    ? isFlashLeft
      ? currentQ.flashAnswer
      : currentQ.opusAnswer
    : "";
  const rightAnswer = currentQ
    ? isFlashLeft
      ? currentQ.opusAnswer
      : currentQ.flashAnswer
    : "";
  const leftScores = currentQ
    ? isFlashLeft
      ? currentQ.scores.flash
      : currentQ.scores.opus
    : null;
  const rightScores = currentQ
    ? isFlashLeft
      ? currentQ.scores.opus
      : currentQ.scores.flash
    : null;

  // ═════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════

  return (
    <section
      id="inapp"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* ── Section Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <MessageCircle size={16} />
            Scenario 2 — Run Phase
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            In-App Intelligence
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Same question. One answer costs{" "}
            <span className="font-semibold text-gray-700">10–20× less</span>.
            Can you tell?
          </p>
        </motion.div>

        {/* ── Two-Column Layout ────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* ════════════════════════════════════════════════════════════
             LEFT COLUMN — Chat Demo + Question Selector
          ══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Chat Widget Header */}
            <div className="bg-gray-900 rounded-t-2xl px-6 py-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm font-medium text-gray-300">
                  Ask your portfolio
                </span>
              </div>
              <Sparkles size={16} className="text-gray-500" />
            </div>

            {/* Question Selector */}
            <div className="bg-gray-50 border-x border-gray-200 px-4 py-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                Select a question
              </p>
              <div className="space-y-2">
                {S2_QA_PAIRS.map((qa) => (
                  <button
                    key={qa.id}
                    onClick={() => handleSelectQuestion(qa.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 group ${
                      selectedQ === qa.id
                        ? "bg-white shadow-md border border-gray-200 text-gray-900"
                        : "bg-white/60 hover:bg-white hover:shadow-sm border border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        CATEGORY_COLORS[qa.category]
                      }`}
                    >
                      {CATEGORY_LABELS[qa.category]}
                    </span>
                    <span className="flex-1 truncate">{qa.question}</span>
                    <ChevronRight
                      size={14}
                      className={`shrink-0 transition-transform ${
                        selectedQ === qa.id
                          ? "text-gray-400 rotate-90"
                          : "text-gray-300 group-hover:translate-x-0.5"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Comparison Area */}
            <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                {currentQ ? (
                  <motion.div
                    key={currentQ.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="p-5"
                  >
                    {/* User question bubble */}
                    <div className="flex justify-end mb-5">
                      <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%] text-sm">
                        {currentQ.question}
                      </div>
                    </div>

                    {/* Side-by-side answers */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Answer A (left) */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              revealed
                                ? leftModel === "flash"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                                : "bg-gray-400"
                            }`}
                          />
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {revealed
                              ? MODELS[leftModel].name
                              : "Response A"}
                          </span>
                        </div>
                        <div
                          className={`p-4 rounded-xl border transition-all duration-300 ${
                            revealed && leftModel === "flash"
                              ? "border-emerald-200 bg-emerald-50/30"
                              : revealed && leftModel === "opus"
                              ? "border-amber-200 bg-amber-50/30"
                              : vote === "A"
                              ? "border-blue-300 bg-blue-50/30"
                              : "border-gray-200 bg-gray-50/50"
                          }`}
                        >
                          <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                            <RenderAnswer text={leftAnswer} />
                          </div>
                          {/* Rubric scores after reveal */}
                          <AnimatePresence>
                            {revealed && leftScores && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="mt-3 pt-3 border-t border-gray-200 space-y-1"
                              >
                                <ScoreStars
                                  score={leftScores.accuracy}
                                  label="Accuracy"
                                />
                                <ScoreStars
                                  score={leftScores.tone}
                                  label="Tone"
                                />
                                <ScoreStars
                                  score={leftScores.completeness}
                                  label="Completeness"
                                />
                                <CostTag
                                  model={leftModel}
                                  label={MODELS[leftModel].name}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Answer B (right) */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              revealed
                                ? rightModel === "flash"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                                : "bg-gray-400"
                            }`}
                          />
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {revealed
                              ? MODELS[rightModel].name
                              : "Response B"}
                          </span>
                        </div>
                        <div
                          className={`p-4 rounded-xl border transition-all duration-300 ${
                            revealed && rightModel === "flash"
                              ? "border-emerald-200 bg-emerald-50/30"
                              : revealed && rightModel === "opus"
                              ? "border-amber-200 bg-amber-50/30"
                              : vote === "B"
                              ? "border-blue-300 bg-blue-50/30"
                              : "border-gray-200 bg-gray-50/50"
                          }`}
                        >
                          <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                            <RenderAnswer text={rightAnswer} />
                          </div>
                          {/* Rubric scores after reveal */}
                          <AnimatePresence>
                            {revealed && rightScores && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="mt-3 pt-3 border-t border-gray-200 space-y-1"
                              >
                                <ScoreStars
                                  score={rightScores.accuracy}
                                  label="Accuracy"
                                />
                                <ScoreStars
                                  score={rightScores.tone}
                                  label="Tone"
                                />
                                <ScoreStars
                                  score={rightScores.completeness}
                                  label="Completeness"
                                />
                                <CostTag
                                  model={rightModel}
                                  label={MODELS[rightModel].name}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Vote / Reveal */}
                    <div className="mt-5">
                      {!vote ? (
                        <div className="flex items-center justify-center gap-4">
                          <span className="text-sm text-gray-500">
                            Which do you prefer?
                          </span>
                          <button
                            onClick={() => handleVote("A")}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 text-sm font-medium transition-colors cursor-pointer"
                          >
                            <ThumbsUp size={14} /> Response A
                          </button>
                          <button
                            onClick={() => handleVote("B")}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 text-sm font-medium transition-colors cursor-pointer"
                          >
                            <ThumbsUp size={14} /> Response B
                          </button>
                        </div>
                      ) : !revealed ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center"
                        >
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                            >
                              <Sparkles size={14} />
                            </motion.div>
                            Revealing...
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          {currentQ.category === "complex" ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
                              <p className="text-sm text-amber-800 font-medium mb-1">
                                ⚠️ Opus is clearly stronger here
                              </p>
                              <p className="text-xs text-amber-600 leading-relaxed">
                                Complex financial planning questions require
                                deep reasoning, multi-step analysis, and nuanced
                                advice. Flash provides a serviceable answer but
                                misses critical details. This is why{" "}
                                <strong>20% of queries still route to Opus</strong>{" "}
                                in the tiered approach.
                              </p>
                            </div>
                          ) : (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
                              <p className="text-sm text-emerald-800 font-medium mb-1">
                                ✓ Near-identical quality — at a fraction of the cost
                              </p>
                              <p className="text-xs text-emerald-600 leading-relaxed">
                                For routine lookups and FAQs, Flash delivers the
                                same accuracy and completeness as Opus. These
                                queries make up{" "}
                                <strong>~80% of in-app traffic</strong> and cost
                                10–20× less per response.
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-10 text-center"
                  >
                    <MessageCircle
                      size={40}
                      className="mx-auto mb-3 text-gray-200"
                    />
                    <p className="text-sm text-gray-400">
                      Select a question above to compare model responses
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════════════════════════
             RIGHT COLUMN — Cost Analysis
          ══════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Volume Slider */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Monthly Query Volume
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Adjust to match your expected in-app traffic
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900 tabular-nums">
                    {fmtVolume(volume)}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">
                    queries/mo
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={VOLUME_MIN}
                max={VOLUME_MAX}
                step={VOLUME_STEP}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${GREEN} 0%, ${GREEN} ${
                    ((volume - VOLUME_MIN) / (VOLUME_MAX - VOLUME_MIN)) * 100
                  }%, #e5e7eb ${
                    ((volume - VOLUME_MIN) / (VOLUME_MAX - VOLUME_MIN)) * 100
                  }%, #e5e7eb 100%)`,
                }}
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-gray-400 tabular-nums">
                  100K
                </span>
                <span className="text-[10px] text-gray-400 tabular-nums">
                  10M
                </span>
              </div>
            </div>

            {/* Monthly Cost Comparison Chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={18} className="text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Monthly COGS Comparison
                </h3>
              </div>

              {/* Cost cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                  <p className="text-xs font-medium text-amber-600 mb-1">
                    All-Frontier (100% Opus)
                  </p>
                  <p className="text-2xl font-bold tabular-nums" style={{ color: AMBER }}>
                    <CountUp target={costs.allFrontier} />
                  </p>
                  <p className="text-[10px] text-amber-500 mt-1 tabular-nums">
                    {fmtUSD(costs.allFrontier * 12)}/yr
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                  <p className="text-xs font-medium text-emerald-600 mb-1">
                    Tiered Routing
                  </p>
                  <p className="text-2xl font-bold tabular-nums" style={{ color: GREEN }}>
                    <CountUp target={costs.tiered} />
                  </p>
                  <p className="text-[10px] text-emerald-500 mt-1 tabular-nums">
                    {fmtUSD(costs.tiered * 12)}/yr
                  </p>
                </div>
              </div>

              {/* Routing breakdown */}
              <div className="mb-6 px-1">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Tiered routing mix
                </p>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                  <div
                    className="rounded-l-full"
                    style={{
                      width: `${S2.tieredMix.flashLitePct * 100}%`,
                      backgroundColor: "#4ade80",
                    }}
                    title={`Flash-Lite: ${S2.tieredMix.flashLitePct * 100}%`}
                  />
                  <div
                    style={{
                      width: `${S2.tieredMix.flashPct * 100}%`,
                      backgroundColor: BLUE,
                    }}
                    title={`Flash: ${S2.tieredMix.flashPct * 100}%`}
                  />
                  <div
                    className="rounded-r-full"
                    style={{
                      width: `${S2.tieredMix.opusPct * 100}%`,
                      backgroundColor: AMBER,
                    }}
                    title={`Opus: ${S2.tieredMix.opusPct * 100}%`}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
                  <span>
                    Flash-Lite {S2.tieredMix.flashLitePct * 100}%
                  </span>
                  <span>Flash {S2.tieredMix.flashPct * 100}%</span>
                  <span>Opus {S2.tieredMix.opusPct * 100}%</span>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 800, height: 208 }}>
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
                    barCategoryGap="30%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      type="number"
                      tickFormatter={(v: number) => fmtUSD(v)}
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CostTooltip />} />
                    <Bar dataKey="cost" radius={[0, 6, 6, 0]} barSize={36}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── Big Green Savings Callout ────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl p-8"
              style={{
                background: `linear-gradient(135deg, ${GREEN} 0%, #14662d 100%)`,
              }}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown size={20} className="text-emerald-200" />
                  <span className="text-sm font-medium text-emerald-200 uppercase tracking-wider">
                    Annual Savings
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-white tabular-nums">
                    <CountUp target={costs.savingsAnnual} duration={1.5} />
                  </span>
                  <span className="text-xl font-bold text-emerald-200">/yr</span>
                </div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-white text-sm font-semibold tabular-nums">
                    {savingsPct.toFixed(1)}% reduction
                  </span>
                  <span className="text-sm text-emerald-200/80">
                    vs. all-frontier at{" "}
                    <span className="tabular-nums">{fmtVolume(volume)}</span>{" "}
                    queries/mo
                  </span>
                </div>
                <div className="border-t border-white/15 pt-4">
                  <p className="text-sm text-emerald-100/90 leading-relaxed">
                    Monthly:{" "}
                    <strong className="text-white tabular-nums">
                      {fmtUSD(costs.savings)}
                    </strong>{" "}
                    saved &nbsp;·&nbsp; Tiered:{" "}
                    <strong className="text-white tabular-nums">
                      {fmtUSD(costs.tiered)}
                    </strong>
                    /mo vs All-Frontier:{" "}
                    <strong className="text-white tabular-nums">
                      {fmtUSD(costs.allFrontier)}
                    </strong>
                    /mo
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Honesty Note */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 px-5 py-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong className="text-gray-700">Honesty note:</strong> The
                60/20/20 tiered split (Flash-Lite / Flash / Opus) reflects real
                query distribution in wealth management. Routine lookups and FAQs
                (~80%) achieve parity across models. Complex planning questions
                (~20%) show measurably better output from Opus — that&apos;s why
                they still route to frontier. The savings come from volume, not
                from cutting quality where it matters.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
