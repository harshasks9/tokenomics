"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, User, Headset, Server,
  Eye, EyeOff, ChevronDown, ShieldCheck, GitCompareArrows,
} from "lucide-react";
import { ACTOR_META, FLOWS, FLOW_SOURCES, OPERATING_MODELS, type FlowStep, type VerticalFlow } from "./flows";
import { FadeIn } from "./components";

const KIND_STYLE: Record<string, { label: string; color: string }> = {
  benchmark: { label: "Benchmark", color: "#188038" },
  assumption: { label: "Assumption", color: "#D97706" },
  platform: { label: "Platform capability", color: "#1A73E8" },
};

type Perspective = "customer" | "employee" | "system";
const PERSPECTIVES: { id: Perspective; label: string; Icon: typeof User }[] = [
  { id: "customer", label: "Customer", Icon: User },
  { id: "employee", label: "Employee", Icon: Headset },
  { id: "system", label: "Systems", Icon: Server },
];

// ─── Single lane ────────────────────────────────────────────────────────────

function StepNode({ step, index, active, mode, accent, onClick }: {
  step: FlowStep; index: number; active: boolean; mode: "conventional" | "agentic"; accent: string; onClick: () => void;
}) {
  const meta = ACTOR_META[step.actor];
  const isAgentic = mode === "agentic";
  return (
    <button
      onClick={onClick}
      className={`relative text-left rounded-xl border px-3.5 py-3 transition-all w-full ${
        active ? "shadow-md" : "opacity-80 hover:opacity-100"
      }`}
      style={{
        borderColor: active ? (isAgentic ? accent : "#B3261E") : "#E8EAED",
        backgroundColor: active ? (isAgentic ? `${accent}0A` : "#B3261E08") : "#fff",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white shrink-0" style={{ backgroundColor: active ? (isAgentic ? accent : "#B3261E") : "#BDC1C6" }}>
          {index + 1}
        </span>
        <span className="text-[11px] font-bold text-[#202124] leading-tight">{step.label}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
        {step.channel && <span className="text-[9px] text-[#9AA0A6] border border-[#E8EAED] rounded-full px-1.5 py-px">{step.channel}</span>}
        {step.wait && <span className={`text-[9px] font-semibold rounded-full px-1.5 py-px ${isAgentic ? "bg-[#E6F4EA] text-[#188038]" : "bg-[#FCE8E6] text-[#B3261E]"}`}>{step.wait}</span>}
        {step.approval && <span className="text-[9px] font-semibold rounded-full px-1.5 py-px bg-[#FEF7E0] text-[#B26A00] inline-flex items-center gap-0.5"><ShieldCheck size={9} /> human approval</span>}
      </div>
    </button>
  );
}

// ─── Flow story player ──────────────────────────────────────────────────────

export function FlowStory({ slug, accent }: { slug: string; accent: string }) {
  const flow = useMemo(() => FLOWS.find((f) => f.slug === slug), [slug]);
  const [mode, setMode] = useState<"conventional" | "agentic" | "compare">("conventional");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [perspective, setPerspective] = useState<Perspective>("customer");
  const [showMetrics, setShowMetrics] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const lane: FlowStep[] = mode === "agentic" ? flow?.agentic ?? [] : flow?.conventional ?? [];
  const steps = lane.length;

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setStep((s) => {
          if (s + 1 >= steps) {
            // finished conventional → transform into agentic and keep playing
            if (mode === "conventional") {
              setMode("agentic");
              return 0;
            }
            setPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 2600);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, steps, mode]);

  if (!flow) return null;
  const active = lane[Math.min(step, steps - 1)];
  const persText = active?.perspectives?.[perspective];

  const switchMode = (m: "conventional" | "agentic" | "compare") => {
    setMode(m); setStep(0); setPlaying(false);
  };

  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-[#E8EAED] bg-[#F8F9FA]">
        <div className="flex items-center gap-1 border border-[#DADCE0] rounded-full p-0.5 bg-white">
          {(["conventional", "agentic", "compare"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full capitalize transition-colors ${mode === m ? "text-white" : "text-[#5F6368] hover:bg-[#F1F3F4]"}`}
              style={mode === m ? { backgroundColor: m === "conventional" ? "#B3261E" : m === "agentic" ? accent : "#5F6368" } : {}}
            >
              {m === "compare" ? "Before / after" : m === "conventional" ? "Today" : "Agentic"}
            </button>
          ))}
        </div>
        {mode !== "compare" && (
          <div className="flex items-center gap-1">
            <button onClick={() => { setPlaying(false); setStep(Math.max(0, step - 1)); }} className="p-1.5 rounded-full border border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4]" aria-label="Previous step"><SkipBack size={13} /></button>
            <button
              onClick={() => { if (step >= steps - 1 && !playing && mode === "agentic") setStep(0); setPlaying(!playing); }}
              className="px-3.5 py-1.5 rounded-full text-white text-[11px] font-bold inline-flex items-center gap-1.5"
              style={{ backgroundColor: mode === "agentic" ? accent : "#B3261E" }}
            >
              {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? "Pause" : "Play"}
            </button>
            <button onClick={() => { setPlaying(false); setStep(Math.min(steps - 1, step + 1)); }} className="p-1.5 rounded-full border border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4]" aria-label="Next step"><SkipForward size={13} /></button>
          </div>
        )}
        <div className="flex items-center gap-1 border border-[#DADCE0] rounded-full p-0.5 bg-white ml-auto">
          {PERSPECTIVES.map((p) => (
            <button
              key={p.id}
              onClick={() => setPerspective(p.id)}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-full inline-flex items-center gap-1 transition-colors ${perspective === p.id ? "bg-[#202124] text-white" : "text-[#5F6368] hover:bg-[#F1F3F4]"}`}
            >
              <p.Icon size={11} /> <span className="hidden sm:inline">{p.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className="text-[11px] font-semibold text-[#5F6368] border border-[#DADCE0] rounded-full px-3 py-1.5 bg-white inline-flex items-center gap-1.5 hover:bg-[#F1F3F4]"
        >
          {showMetrics ? <EyeOff size={11} /> : <Eye size={11} />} Metrics
        </button>
      </div>

      {/* Scenario */}
      <div className="px-5 pt-4 text-xs text-[#5F6368]">
        <span className="font-bold text-[#202124]">Scenario:</span> {flow.scenario}
      </div>

      {/* Lanes */}
      {mode === "compare" ? (
        <div className="grid md:grid-cols-2 gap-4 p-5">
          {(["conventional", "agentic"] as const).map((m) => (
            <div key={m}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: m === "agentic" ? accent : "#B3261E" }}>
                {m === "agentic" ? "Agentic layer" : "Today"} · {flow[m].length} steps
              </div>
              <div className="space-y-1.5">
                {flow[m].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: m === "agentic" ? 12 : -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 rounded-lg border border-[#E8EAED] px-3 py-2"
                    style={{ backgroundColor: m === "agentic" ? `${accent}06` : "#B3261E05" }}
                  >
                    <span className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white shrink-0" style={{ backgroundColor: m === "agentic" ? accent : "#B3261E" }}>{i + 1}</span>
                    <span className="text-[11px] text-[#202124] leading-tight flex-1">{s.label}</span>
                    {s.pain && m === "conventional" && <span className="text-[9px] text-[#B3261E] font-medium hidden lg:inline">{s.pain}</span>}
                    {s.wait && <span className={`text-[9px] font-semibold shrink-0 ${m === "agentic" ? "text-[#188038]" : "text-[#B3261E]"}`}>{s.wait}</span>}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {lane.map((s, i) => (
              <StepNode key={s.label} step={s} index={i} active={i === step} mode={mode} accent={accent} onClick={() => { setPlaying(false); setStep(i); }} />
            ))}
          </div>

          {/* Active step detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mode}-${step}-${perspective}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-4 rounded-xl border px-5 py-4"
              style={{ borderColor: mode === "agentic" ? `${accent}44` : "#B3261E33", backgroundColor: mode === "agentic" ? `${accent}07` : "#B3261E06" }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-sm font-extrabold text-[#202124]">{active?.label}</span>
                {active?.pain && mode === "conventional" && (
                  <span className="text-[10px] font-semibold text-[#B3261E] bg-[#FCE8E6] rounded-full px-2 py-0.5">{active.pain}</span>
                )}
              </div>
              <p className="text-xs text-[#5F6368] leading-relaxed">{active?.desc}</p>
              {persText && persText !== "—" && (
                <p className="text-xs text-[#202124] mt-2 leading-relaxed">
                  <span className="font-bold capitalize">{perspective} view:</span> {persText}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {mode === "conventional" && step === steps - 1 && !playing && (
            <button
              onClick={() => switchMode("agentic")}
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-white rounded-full px-4 py-2"
              style={{ backgroundColor: accent }}
            >
              <GitCompareArrows size={13} /> Transform into the agentic flow
            </button>
          )}
        </div>
      )}

      {/* Metrics */}
      {showMetrics && (
        <div className="border-t border-[#E8EAED] px-5 py-4 bg-[#F8F9FA]">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-3">Before → after process metrics</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {flow.metrics.map((m) => (
              <div key={m.name} className="rounded-lg bg-white border border-[#E8EAED] p-3">
                <div className="text-[10px] font-bold text-[#202124] leading-tight">{m.name}</div>
                <div className="text-[11px] mt-1.5">
                  <span className="text-[#B3261E] line-through decoration-[#B3261E]/40">{m.before}</span>
                </div>
                <div className="text-[11px] font-bold" style={{ color: accent }}>{m.after}</div>
                <span className="inline-block mt-1.5 text-[9px] font-semibold rounded-full px-1.5 py-px" style={{ backgroundColor: `${KIND_STYLE[m.kind].color}14`, color: KIND_STYLE[m.kind].color }}>
                  {KIND_STYLE[m.kind].label}
                </span>
              </div>
            ))}
          </div>
          <details className="mt-3 text-[11px] text-[#5F6368]">
            <summary className="cursor-pointer font-semibold text-[#202124]">Sources &amp; assumptions behind these numbers</summary>
            <ul className="mt-2 space-y-1 pl-1">
              {flow.metrics.map((m) => (
                <li key={m.name}>· <span className="font-semibold">{m.name}:</span> {m.basis}</li>
              ))}
              {FLOW_SOURCES.map((s) => (
                <li key={s.label}>· {s.label}</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}

// ─── Roles + impact strip below the player ──────────────────────────────────

export function FlowContext({ slug, accent }: { slug: string; accent: string }) {
  const flow = FLOWS.find((f) => f.slug === slug);
  if (!flow) return null;
  const roles: { title: string; text: string; color: string }[] = [
    { title: "Gemini Enterprise Agent Platform", text: flow.roles.geap, color: accent },
    { title: "Customer Engagement Suite (GECX)", text: flow.roles.gecx, color: "#D97706" },
    { title: "Implementation partner", text: flow.roles.partner, color: "#00838F" },
    { title: "Human oversight", text: flow.roles.human, color: "#5F6368" },
  ];
  return (
    <div className="mt-6 grid lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-3">Who does what</div>
        <div className="space-y-3">
          {roles.map((r) => (
            <div key={r.title} className="border-l-2 pl-3" style={{ borderColor: r.color }}>
              <div className="text-xs font-extrabold" style={{ color: r.color }}>{r.title}</div>
              <p className="text-[11px] text-[#5F6368] mt-0.5 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Customer & employee impact</div>
          <p className="text-[11px] text-[#202124] leading-relaxed"><span className="font-bold">Customers:</span> {flow.impact.customer}</p>
          <p className="text-[11px] text-[#202124] leading-relaxed mt-2"><span className="font-bold">Employees:</span> {flow.impact.employee}</p>
        </div>
        <div className="rounded-2xl border border-[#E8EAED] bg-white p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F6368] mb-2">Value drivers · Google differentiators</div>
          <div className="flex flex-wrap gap-1.5">
            {flow.valueDrivers.map((d) => (
              <span key={d} className="text-[10px] font-medium rounded-full px-2.5 py-1" style={{ backgroundColor: `${accent}10`, color: accent }}>{d}</span>
            ))}
            {flow.differentiators.map((d) => (
              <span key={d} className="text-[10px] font-medium rounded-full px-2.5 py-1 border border-[#E8EAED] text-[#5F6368]">{d}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Operating model comparison ─────────────────────────────────────────────

export function OperatingModelCompare({ accent }: { accent: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-[#E8EAED]">
        <table className="w-full text-xs bg-white">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wider">
              <th className="px-4 py-3 font-bold text-[#5F6368] bg-[#F8F9FA] w-[16%]">Dimension</th>
              <th className="px-4 py-3 font-bold text-[#B3261E] bg-[#B3261E]/5 w-[28%]">Conventional operating model</th>
              <th className="px-4 py-3 font-bold text-[#B26A00] bg-[#FEF7E0]/60 w-[28%]">Point solutions / partial automation</th>
              <th className="px-4 py-3 font-bold text-white w-[28%]" style={{ backgroundColor: accent }}>Gemini Enterprise agentic model</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F4]">
            {OPERATING_MODELS.map((r) => (
              <tr key={r.dimension} className="align-top hover:bg-[#FAFBFC]">
                <td className="px-4 py-3 font-bold text-[#202124]">{r.dimension}</td>
                <td className="px-4 py-3 text-[#5F6368]">{r.conventional}</td>
                <td className="px-4 py-3 text-[#5F6368]">{r.point}</td>
                <td className="px-4 py-3 font-medium text-[#202124]" style={{ backgroundColor: `${accent}06` }}>{r.agentic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile accordion */}
      <div className="lg:hidden rounded-2xl border border-[#E8EAED] bg-white divide-y divide-[#F1F3F4] overflow-hidden">
        {OPERATING_MODELS.map((r, i) => (
          <div key={r.dimension}>
            <button className="w-full flex items-center justify-between px-4 py-3 text-left text-xs font-bold text-[#202124]" onClick={() => setOpen(open === i ? null : i)}>
              {r.dimension}
              <ChevronDown size={14} className={`text-[#9AA0A6] transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 space-y-2 text-[11px]">
                <p><span className="font-bold text-[#B3261E]">Conventional:</span> <span className="text-[#5F6368]">{r.conventional}</span></p>
                <p><span className="font-bold text-[#B26A00]">Point solutions:</span> <span className="text-[#5F6368]">{r.point}</span></p>
                <p><span className="font-bold" style={{ color: accent }}>Agentic:</span> <span className="text-[#202124]">{r.agentic}</span></p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlowSection({ slug, accent }: { slug: string; accent: string }) {
  return (
    <div>
      <FadeIn>
        <FlowStory slug={slug} accent={accent} />
      </FadeIn>
      <FlowContext slug={slug} accent={accent} />
    </div>
  );
}
