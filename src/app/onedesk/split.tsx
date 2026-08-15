"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, ShieldCheck, Quote } from "lucide-react";
import { ACTOR_META, PERSONAS, SCENARIOS, type Scenario, type Step } from "./data";
import { AGENT, Claim, GATE, INK, MUTED, PAPER, RULE, SERIF, STALL, Chip } from "./ui";

const LOOP_MS = 26000;

const parseDay = (clock: string): number | null => {
  const d = clock.match(/^Day (\d+)/);
  if (d) return Number(d[1]);
  const w = clock.match(/^Week (\d+)/);
  if (w) return Number(w[1]) * 7;
  return null;
};

const activeIndex = (steps: Step[], t: number) => {
  let i = -1;
  for (let k = 0; k < steps.length; k++) if (t >= steps[k].at) i = k;
  return i;
};

export function SplitScreen() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const persona = PERSONAS.find((p) => p.id === scenario.personaId)!;

  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { setReduced(mq.matches); if (mq.matches) { setPlaying(false); setT(1); } };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => { setT(reduced ? 1 : 0); setPlaying(!reduced); }, [scenarioId, reduced]);

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now: number) => {
      // Clamp the frame delta: a backgrounded tab suspends rAF, and an
      // unclamped delta on resume would jump the timeline to the end.
      const dt = Math.min(now - last.current, 100);
      last.current = now;
      setT((v) => {
        const next = v + dt / LOOP_MS;
        if (next >= 1) { setPlaying(false); return 1; }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing]);

  const leftIdx = activeIndex(scenario.left, t);
  const rightIdx = activeIndex(scenario.right, t);
  const rightDone = t >= scenario.rightDoneAt;
  const leftClockNow = leftIdx >= 0 ? scenario.left[leftIdx].clock : "Day 0";

  return (
    <div>
      {/* Scenario picker */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-7">
        {SCENARIOS.map((s) => {
          const p = PERSONAS.find((x) => x.id === s.personaId)!;
          const on = s.id === scenarioId;
          return (
            <button
              key={s.id}
              onClick={() => setScenarioId(s.id)}
              className="text-left rounded-[3px] p-3.5 transition-all"
              style={{
                border: `1px solid ${on ? p.accent : RULE}`,
                backgroundColor: on ? `${p.accent}0C` : "#fff",
                boxShadow: on ? `inset 3px 0 0 ${p.accent}` : "none",
              }}
              aria-pressed={on}
            >
              <div className="text-[11px] font-bold" style={{ color: on ? p.accent : INK }}>{p.name}</div>
              <div className="text-[9.5px] uppercase mt-0.5" style={{ color: MUTED, letterSpacing: "0.1em" }}>{p.role}</div>
              <div className="text-[11.5px] mt-2 leading-[1.4]" style={{ color: INK }}>“{s.moment}”</div>
            </button>
          );
        })}
      </div>

      {/* Framing + transport */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div className="max-w-[58ch]">
          <div className="text-[12px] leading-[1.6]" style={{ color: MUTED }}>
            <span className="font-bold" style={{ color: persona.accent }}>{persona.name}</span> · {persona.detail}
          </div>
          <div className="text-[12.5px] mt-1.5 leading-[1.6]" style={{ color: INK }}>{scenario.situation}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { if (t >= 1) setT(0); setPlaying(!playing); }}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold rounded-full px-3.5 py-2"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />} {playing ? "Pause" : t >= 1 ? "Replay" : "Play"}
          </button>
          <button
            onClick={() => { setT(0); setPlaying(true); }}
            className="p-2 rounded-full" style={{ border: `1px solid ${RULE}`, color: MUTED }}
            aria-label="Restart"
          >
            <RotateCcw size={12} />
          </button>
          <input
            type="range" min={0} max={1000} value={Math.round(t * 1000)}
            onChange={(e) => { setPlaying(false); setT(Number(e.target.value) / 1000); }}
            className="w-24 md:w-36 accent-[#0F766E]" aria-label="Scrub timeline"
          />
        </div>
      </div>

      {/* The two lanes */}
      <div className="grid lg:grid-cols-2 gap-px rounded-[3px] overflow-hidden" style={{ backgroundColor: RULE, border: `1px solid ${RULE}` }}>
        <Lane
          title={scenario.leftTitle}
          subtitle="How this resolves today"
          steps={scenario.left}
          activeIdx={leftIdx}
          accent={STALL}
          clock={leftClockNow}
          lane="left"
          done={false}
        />
        <Lane
          title={scenario.rightTitle}
          subtitle="The agentic front office"
          steps={scenario.right}
          activeIdx={rightDone ? scenario.right.length - 1 : rightIdx}
          accent={AGENT}
          clock={rightDone ? "Resolved" : rightIdx >= 0 ? scenario.right[rightIdx].clock : "min 0"}
          lane="right"
          done={rightDone}
          doneBanner={
            <div className="px-4 py-3.5" style={{ backgroundColor: `${AGENT}0E`, borderTop: `1px solid ${AGENT}33` }}>
              <div className="text-[11px] font-bold uppercase" style={{ color: AGENT, letterSpacing: "0.14em" }}>
                Resolved · {scenario.rightResolvedIn}
              </div>
              <div className="text-[12.5px] mt-1.5 leading-[1.5]" style={{ color: INK }}>
                Meanwhile, on the other side of this page:{" "}
                <span className="font-bold" style={{ color: STALL }}>
                  {t >= 1 ? scenario.leftEndClock : `still ${leftClockNow.toLowerCase()}`}
                </span>
                {t < 1 && <span style={{ color: MUTED }}> — and counting.</span>}
              </div>
            </div>
          }
        />
      </div>

      {/* Verdict */}
      <div
        className="mt-5 px-5 py-5 rounded-[3px] flex gap-3.5 items-start transition-opacity duration-700"
        style={{ backgroundColor: "#fff", border: `1px solid ${RULE}`, opacity: t > scenario.rightDoneAt + 0.05 ? 1 : 0.25 }}
      >
        <Quote size={16} className="shrink-0 mt-1" style={{ color: persona.accent }} />
        <p className="text-[15px] md:text-[17px] leading-[1.5]" style={{ fontFamily: SERIF, color: INK }}>
          {scenario.verdict}
        </p>
      </div>

      {/* Evidence for this scenario */}
      <div className="mt-4 grid md:grid-cols-3 gap-3">
        {scenario.evidence.map((e) => (
          <div key={e.text.slice(0, 40)} className="px-4 py-3.5 rounded-[3px]" style={{ border: `1px solid ${RULE}`, backgroundColor: "#fff" }}>
            <Claim text={e.text} kind={e.kind} src={e.src} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Lane({
  title, subtitle, steps, activeIdx, accent, clock, lane, done, doneBanner,
}: {
  title: string; subtitle: string; steps: Step[]; activeIdx: number; accent: string;
  clock: string; lane: "left" | "right"; done: boolean; doneBanner?: React.ReactNode;
}) {
  return (
    <div className="bg-white flex flex-col">
      <div className="px-4 py-3 flex items-baseline justify-between gap-3" style={{ borderBottom: `1px solid ${RULE}` }}>
        <div>
          <div className="text-[11px] font-bold uppercase" style={{ color: accent, letterSpacing: "0.16em" }}>{title}</div>
          <div className="text-[10.5px] mt-0.5" style={{ color: MUTED }}>{subtitle}</div>
        </div>
        <div
          className="text-[15px] font-bold tabular-nums px-2.5 py-1 rounded-[3px]"
          style={{ fontFamily: SERIF, color: done ? accent : lane === "left" ? STALL : accent, backgroundColor: `${accent}0F` }}
        >
          {clock}
        </div>
      </div>

      <ol className="px-4 py-4 flex-1 space-y-0">
        {steps.map((s, i) => {
          const reached = i <= activeIdx;
          const isActive = i === activeIdx && !done;
          const prev = i > 0 ? steps[i - 1] : null;
          const gapDays = prev ? (parseDay(s.clock) ?? 0) - (parseDay(prev.clock) ?? 0) : 0;
          const showGap = lane === "left" && prev && gapDays >= 2 && reached;
          const actor = ACTOR_META[s.actor];

          return (
            <li key={s.label}>
              {showGap && (
                <div className="flex items-center gap-2 py-1.5 pl-[26px]">
                  <span className="h-px flex-1" style={{ backgroundColor: `${STALL}33` }} />
                  <span className="text-[9.5px] font-semibold uppercase" style={{ color: STALL, letterSpacing: "0.1em" }}>
                    {gapDays} days · no contact
                  </span>
                  <span className="h-px flex-1" style={{ backgroundColor: `${STALL}33` }} />
                </div>
              )}
              <div
                className="flex gap-3 transition-all duration-500"
                style={{ opacity: reached ? 1 : 0.24 }}
              >
                <div className="flex flex-col items-center pt-1">
                  <span
                    className="rounded-full shrink-0 transition-all duration-300"
                    style={{
                      width: isActive ? 11 : 7,
                      height: isActive ? 11 : 7,
                      backgroundColor: reached ? (s.gate ? GATE : actor.color) : RULE,
                      boxShadow: isActive ? `0 0 0 4px ${accent}22` : "none",
                    }}
                  />
                  {i < steps.length - 1 && <span className="w-px flex-1 mt-1.5" style={{ backgroundColor: reached ? `${accent}30` : RULE }} />}
                </div>
                <div className="pb-4 min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-[9.5px] font-bold tabular-nums uppercase" style={{ color: MUTED, letterSpacing: "0.08em" }}>{s.clock}</span>
                    <span className="text-[13px] font-bold leading-tight" style={{ color: INK }}>{s.label}</span>
                    {s.gate && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase" style={{ color: GATE, letterSpacing: "0.08em" }}>
                        <ShieldCheck size={9} /> human approves
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] leading-[1.55] mt-1" style={{ color: MUTED }}>{s.detail}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {s.channel && <Chip color={actor.color}>{s.channel}</Chip>}
                    {s.pain && <Chip color={STALL}>{s.pain}</Chip>}
                    {s.cite && <Chip color={AGENT}>grounded: {s.cite}</Chip>}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {done && doneBanner}
    </div>
  );
}
