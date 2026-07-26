"use client";

// Cinematic auto-looping flow animation. Two synchronized lanes race through
// the same scenario: the conventional token stalls, backtracks, and drags to
// the end of the loop while the agentic token flows straight through and
// resolves early. Click pauses; clicking a node explores that step.

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, ShieldCheck, Check, X, RotateCcw } from "lucide-react";
import { FLOWS, FLOW_SOURCES, type FlowStep, type FlowMetric } from "./flows";

export type CinemaFlow = {
  slug: string;
  scenario: string;
  conventional: FlowStep[];
  agentic: FlowStep[];
  metrics: FlowMetric[];
};

const LOOP_MS = 14000;
const KIND_STYLE: Record<string, { label: string; color: string }> = {
  benchmark: { label: "Benchmark", color: "#34A853" },
  assumption: { label: "Assumption", color: "#FBBC04" },
  platform: { label: "Platform capability", color: "#8AB4F8" },
};

// Build a piecewise-linear timeline: waypoints of (time, nodeIndex).
function buildTimeline(steps: FlowStep[], lane: "conventional" | "agentic") {
  const n = steps.length;
  const pts: { t: number; x: number }[] = [];
  if (lane === "agentic") {
    // Smooth, even progress; approval node gets a brief dwell; finish at 58%.
    const finish = 0.58;
    const weights = steps.map((s) => (s.approval ? 1.7 : 1));
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    pts.push({ t: 0, x: 0 });
    for (let i = 1; i < n; i++) {
      acc += weights[i - 1];
      pts.push({ t: (acc / total) * finish, x: i });
    }
    pts.push({ t: 1, x: n - 1 });
  } else {
    // Stalls at pain nodes, one backtrack after the third node (repeated context).
    const seq: number[] = [];
    for (let i = 0; i < n; i++) {
      seq.push(i);
      if (i === 3) { seq.push(2, 3); } // backtrack: context lost, re-explain
    }
    const weights = seq.map((idx, k) => {
      const s = steps[idx];
      let w = 1;
      if (s.wait) w += 1.1;          // waiting…
      if (s.pain && k > 0) w += 0.4; // friction drag
      return w;
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    pts.push({ t: 0, x: seq[0] });
    for (let k = 1; k < seq.length; k++) {
      acc += weights[k - 1];
      pts.push({ t: (acc / total) * 0.97, x: seq[k] });
    }
    pts.push({ t: 1, x: n - 1 });
  }
  return pts;
}

function sample(pts: { t: number; x: number }[], t: number) {
  if (t <= pts[0].t) return pts[0].x;
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i].t) {
      const a = pts[i - 1], b = pts[i];
      const f = (t - a.t) / Math.max(1e-6, b.t - a.t);
      return a.x + (b.x - a.x) * f;
    }
  }
  return pts[pts.length - 1].x;
}

const nodeLeft = (i: number, n: number) => 4 + (i * 92) / Math.max(1, n - 1); // %

function Lane({
  steps, lane, pos, accent, done, selected, onSelect,
}: {
  steps: FlowStep[];
  lane: "conventional" | "agentic";
  pos: number;
  accent: string;
  done: boolean;
  selected: number | null;
  onSelect: (i: number) => void;
}) {
  const n = steps.length;
  const isAg = lane === "agentic";
  const tokenColor = isAg ? accent : "#F28B82";
  const activeIdx = Math.round(pos);

  return (
    <div className="relative h-[120px] md:h-[130px]">
      {/* Lane label */}
      <div className="absolute -top-1 left-0 flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: isAg ? "#8AB4F8" : "#F28B82" }}>
          {isAg ? "Agentic layer" : "Today"}
        </span>
        {isAg && done && (
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-bold text-[#0B1220] bg-[#34A853] rounded-full px-2 py-0.5 inline-flex items-center gap-1">
            <Check size={9} /> Resolved — waiting on the old world…
          </motion.span>
        )}
      </div>
      {/* Track */}
      <div className="absolute left-[4%] right-[4%] top-1/2 h-px" style={{ background: isAg ? `linear-gradient(90deg, ${accent}88, ${accent}22)` : "linear-gradient(90deg, #F28B8266, #F28B8218)" }} />
      {/* Nodes */}
      {steps.map((s, i) => {
        const passed = pos >= i - 0.05;
        const isActive = activeIdx === i && !done;
        const isSel = selected === i;
        return (
          <button
            key={s.label}
            onClick={(e) => { e.stopPropagation(); onSelect(i); }}
            className="absolute -translate-x-1/2 group"
            style={{ left: `${nodeLeft(i, n)}%`, top: "50%", transform: "translate(-50%, -50%)" }}
            aria-label={s.label}
          >
            <span
              className="block rounded-full transition-all duration-300 relative"
              style={{
                width: isActive || isSel ? 14 : 9,
                height: isActive || isSel ? 14 : 9,
                backgroundColor: passed ? (isAg ? accent : s.pain ? "#F28B82" : "#9AA0A6") : "#2A3548",
                boxShadow: isActive ? `0 0 14px 3px ${tokenColor}66` : isSel ? `0 0 0 3px ${tokenColor}44` : "none",
              }}
            >
              {isAg && s.approval && passed && (
                <ShieldCheck size={10} className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#FBBC04]" />
              )}
              {!isAg && s.pain && passed && (
                <X size={9} className="absolute -top-4 left-1/2 -translate-x-1/2 text-[#F28B82]" />
              )}
            </span>
            {/* Node label */}
            <span
              className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] md:text-[9px] font-medium transition-colors ${i % 2 === 0 ? "top-4" : "-top-9 md:-top-8"}`}
              style={{ color: isActive || isSel ? "#E8EAED" : passed ? "#9AA0A6" : "#5F6368", top: i % 2 === 0 ? undefined : undefined }}
            >
              <span className={`block ${i % 2 === 0 ? "mt-1.5" : ""}`} style={{ marginTop: i % 2 === 0 ? 6 : -34 }}>
                {s.label.length > 22 ? s.label.slice(0, 21) + "…" : s.label}
              </span>
            </span>
            {/* wait chip while active */}
            {isActive && s.wait && !isAg && (
              <motion.span
                initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                className="absolute left-1/2 -translate-x-1/2 top-6 text-[8px] font-bold text-[#F28B82] bg-[#F28B8218] rounded-full px-1.5 py-px whitespace-nowrap"
              >
                {s.wait}
              </motion.span>
            )}
          </button>
        );
      })}
      {/* Token */}
      {!done && (
        <span
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${nodeLeft(pos, n)}%`, top: "50%",
            width: 10, height: 10, transform: "translate(-50%, -50%)",
            backgroundColor: tokenColor,
            boxShadow: `0 0 16px 5px ${tokenColor}55, 0 0 4px 1px ${tokenColor}`,
            transition: "left 60ms linear",
          }}
        />
      )}
    </div>
  );
}

export function FlowCinema({ slug, accent, flowOverride }: { slug: string; accent: string; flowOverride?: CinemaFlow }) {
  const flow = useMemo(() => flowOverride ?? FLOWS.find((f) => f.slug === slug), [slug, flowOverride]);
  const convTl = useMemo(() => (flow ? buildTimeline(flow.conventional, "conventional") : []), [flow]);
  const agTl = useMemo(() => (flow ? buildTimeline(flow.agentic, "agentic") : []), [flow]);
  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);
  const [explored, setExplored] = useState<{ lane: "conventional" | "agentic"; i: number } | null>(null);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  useEffect(() => {
    if (paused) return;
    last.current = performance.now();
    const tick = (now: number) => {
      // Clamp dt so returning from a backgrounded tab resumes smoothly
      const dt = Math.min(100, now - last.current);
      last.current = now;
      setT((v) => (v + dt / LOOP_MS) % 1);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [paused]);

  if (!flow) return null;
  const convPos = sample(convTl, t);
  const agPos = sample(agTl, t);
  const agDone = t > 0.58 && t < 0.995;
  const exploredStep = explored ? flow[explored.lane][explored.i] : null;

  const togglePause = () => {
    setPaused((p) => {
      if (p) setExplored(null);
      return !p;
    });
  };

  const explore = (lane: "conventional" | "agentic", i: number) => {
    setPaused(true);
    setExplored({ lane, i });
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-[#233047]" style={{ background: "radial-gradient(1200px 500px at 50% -20%, #14223D, #0B1220)" }}>
      {/* grid overlay */}
      <div className="relative" style={{ backgroundImage: "linear-gradient(#1B263B55 1px, transparent 1px), linear-gradient(90deg, #1B263B55 1px, transparent 1px)", backgroundSize: "36px 36px" }}>
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4">
          <div className="text-[11px] text-[#9AA0A6]">
            <span className="font-bold text-[#E8EAED]">Scenario:</span> {flow.scenario}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setT(0); setExplored(null); setPaused(false); }} className="p-1.5 rounded-full border border-[#2A3548] text-[#9AA0A6] hover:text-white" aria-label="Restart"><RotateCcw size={12} /></button>
            <button onClick={togglePause} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0B1220] bg-[#E8EAED] rounded-full px-3.5 py-1.5 hover:bg-white">
              {paused ? <Play size={11} /> : <Pause size={11} />} {paused ? "Play" : "Pause & explore"}
            </button>
          </div>
        </div>

        {/* lanes */}
        <div className="px-2 md:px-4 pt-8 pb-2 cursor-pointer" onClick={togglePause}>
          <Lane steps={flow.conventional} lane="conventional" pos={convPos} accent={accent} done={false}
            selected={explored?.lane === "conventional" ? explored.i : null} onSelect={(i) => explore("conventional", i)} />
          <div className="flex items-center gap-3 px-[4%] py-1">
            <div className="flex-1 border-t border-dashed border-[#2A3548]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5F6368]">same interaction, two worlds</span>
            <div className="flex-1 border-t border-dashed border-[#2A3548]" />
          </div>
          <Lane steps={flow.agentic} lane="agentic" pos={agPos} accent={"#8AB4F8"} done={agDone}
            selected={explored?.lane === "agentic" ? explored.i : null} onSelect={(i) => explore("agentic", i)} />
        </div>

        {/* explored step detail */}
        <AnimatePresence>
          {exploredStep && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mx-5 mb-3 rounded-xl border border-[#2A3548] bg-[#0E1526]/90 backdrop-blur px-4 py-3"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-[#E8EAED]">{exploredStep.label}</span>
                {exploredStep.wait && <span className="text-[9px] font-bold rounded-full px-1.5 py-px" style={{ backgroundColor: explored!.lane === "agentic" ? "#34A85322" : "#F28B8222", color: explored!.lane === "agentic" ? "#34A853" : "#F28B82" }}>{exploredStep.wait}</span>}
                {exploredStep.pain && <span className="text-[9px] font-semibold text-[#F28B82]">{exploredStep.pain}</span>}
                {exploredStep.approval && <span className="text-[9px] font-semibold text-[#FBBC04] inline-flex items-center gap-1"><ShieldCheck size={9} /> human approval</span>}
              </div>
              <p className="text-[11px] text-[#BDC1C6] mt-1 leading-relaxed">{exploredStep.desc}</p>
              <div className="mt-1.5 grid md:grid-cols-3 gap-x-4 gap-y-1 text-[10px] text-[#9AA0A6]">
                {exploredStep.perspectives?.customer && exploredStep.perspectives.customer !== "—" && <p><span className="font-bold text-[#E8EAED]">Customer:</span> {exploredStep.perspectives.customer}</p>}
                {exploredStep.perspectives?.employee && exploredStep.perspectives.employee !== "—" && <p><span className="font-bold text-[#E8EAED]">Employee:</span> {exploredStep.perspectives.employee}</p>}
                {exploredStep.perspectives?.system && exploredStep.perspectives.system !== "—" && <p><span className="font-bold text-[#E8EAED]">Systems:</span> {exploredStep.perspectives.system}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* metrics strip */}
        <div className="border-t border-[#1B263B] px-5 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {flow.metrics.map((m) => (
              <div key={m.name} className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wider text-[#5F6368] truncate">{m.name}</div>
                <div className="text-[10px] text-[#F28B82] line-through decoration-[#F28B82]/40 truncate">{m.before}</div>
                <div className="text-[11px] font-bold text-[#8AB4F8] truncate">{m.after}</div>
                <span className="text-[8px] font-semibold" style={{ color: KIND_STYLE[m.kind].color }}>{KIND_STYLE[m.kind].label}</span>
              </div>
            ))}
          </div>
          <details className="mt-2 text-[10px] text-[#9AA0A6]">
            <summary className="cursor-pointer font-semibold text-[#BDC1C6]">Sources &amp; assumptions</summary>
            <ul className="mt-1.5 space-y-0.5">
              {flow.metrics.map((m) => <li key={m.name}>· <b>{m.name}:</b> {m.basis}</li>)}
              {FLOW_SOURCES.map((s) => <li key={s.label}>· {s.label}</li>)}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
