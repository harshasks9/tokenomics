"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Pause, Play, ShieldAlert } from "lucide-react";
import { BOARD_ROWS, CHANNEL_META, STATES } from "./data";
import { AMBER, BORDER, BRAND, FAINT, GREEN, INK, MUTED, Panel, Pill, SURFACE } from "./ui";

const CYCLE_MS = 34000;

// Single column below lg — the fixed tracks would otherwise squeeze the title to zero.
const COLS = "grid-cols-1 lg:grid-cols-[88px_minmax(0,1fr)_96px_84px_76px_150px_128px]";

// Dwell weights per state — uneven so the board reads as telemetry, not a metronome.
const weights = (needsApproval: boolean) => [0.6, 0.8, 1.2, 1.4, needsApproval ? 2.2 : 0.15, 2.1];

function stateOf(p: number, needsApproval: boolean) {
  const w = weights(needsApproval);
  const total = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (let i = 0; i < w.length; i++) {
    acc += w[i] / total;
    if (p <= acc) return i;
  }
  return w.length - 1;
}

const fmtMins = (m: number) => (m >= 1440 ? `${Math.round(m / 1440)}d` : m >= 60 ? `${Math.round(m / 60)}h` : `${Math.round(m)}m`);

const STATE_COLOR = (i: number, needsApproval: boolean) =>
  i === 5 ? GREEN : i === 4 && needsApproval ? AMBER : i === 0 ? FAINT : BRAND;

export function RequestBoard() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { setReduced(mq.matches); if (mq.matches) setPlaying(false); };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last.current, 100); // clamp across tab suspension
      last.current = now;
      setT((v) => v + dt);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing]);

  const rows = useMemo(
    () =>
      BOARD_ROWS.map((r) => {
        const p = (((t / (CYCLE_MS * r.speed)) + r.offset) % 1 + 1) % 1;
        const s = stateOf(p, r.needsApproval);
        return { r, p, s, elapsed: Math.max(1, Math.round(p * r.slaMins * 0.78)) };
      }),
    [t],
  );

  const closed = rows.filter((x) => x.s === 5).length;
  const awaiting = rows.filter((x) => x.s === 4 && x.r.needsApproval).length;
  const active = rows.length - closed;
  const resolvedToday = 1361 + Math.floor(t / 4000);

  return (
    <Panel
      title={
        <span className="flex items-center gap-2">
          Live requests
          <Pill color={FAINT}>Sample data</Pill>
        </span>
      }
      right={
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-3 text-[11px] tabular-nums" style={{ color: MUTED }}>
            <span><b style={{ color: INK }}>{resolvedToday.toLocaleString("en-IN")}</b> resolved today</span>
            <span><b style={{ color: INK }}>{active}</b> in flight</span>
            <span><b style={{ color: awaiting ? AMBER : INK }}>{awaiting}</b> awaiting approval</span>
          </span>
          <button
            onClick={() => setPlaying(!playing)}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium rounded-md px-2 py-1"
            style={{ border: `1px solid ${BORDER}`, color: MUTED }}
          >
            {playing ? <Pause size={11} /> : <Play size={11} />} {playing ? "Pause" : "Play"}
          </button>
        </div>
      }
    >
      {/* Column head */}
      <div
        className={`hidden lg:grid px-4 py-2 text-[10px] font-semibold uppercase ${COLS}`}
        style={{ color: FAINT, letterSpacing: "0.06em", borderBottom: `1px solid ${BORDER}` }}
      >
        <div>Ref</div><div>Request</div><div>Channel</div><div>Language</div><div>Campus</div><div>State</div><div>Elapsed / SLA</div>
      </div>

      <div style={{ backgroundColor: SURFACE }}>
        {rows.map(({ r, s, elapsed }) => {
          const isOpen = open === r.id;
          const stateName = STATES[s];
          const color = STATE_COLOR(s, r.needsApproval);
          const pct = Math.min(100, (elapsed / r.slaMins) * 100);
          return (
            <div key={r.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
              <button
                onClick={() => setOpen(isOpen ? null : r.id)}
                className={`w-full text-left px-4 py-2.5 hover:bg-[#FCFCFD] transition-colors grid gap-x-3 gap-y-1 ${COLS}`}
                aria-expanded={isOpen}
              >
                <div className="text-[11px] font-mono tabular-nums self-center" style={{ color: FAINT }}>{r.id}</div>
                <div className="min-w-0 self-center">
                  <div className="text-[12.5px] font-medium truncate" style={{ color: INK }}>{r.title}</div>
                  <div className="lg:hidden flex flex-wrap items-center gap-1.5 mt-1">
                    <Pill color={CHANNEL_META[r.channel].color}>{r.channel}</Pill>
                    <Pill color={FAINT}>{r.language}</Pill>
                    <Pill color={color}>{stateName}</Pill>
                  </div>
                </div>
                <div className="hidden lg:flex items-center">
                  <span className="inline-flex items-center gap-1.5 text-[11.5px]" style={{ color: MUTED }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CHANNEL_META[r.channel].color }} />
                    {r.channel}
                  </span>
                </div>
                <div className="hidden lg:block text-[11.5px] self-center" style={{ color: MUTED }}>{r.language}</div>
                <div className="hidden lg:block text-[11.5px] self-center" style={{ color: MUTED }}>{r.campus}</div>
                <div className="hidden lg:flex items-center gap-2">
                  {s === 5 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: GREEN }}>
                      <Check size={11} strokeWidth={3} /> Closed
                    </span>
                  ) : s === 4 && r.needsApproval ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: AMBER }}>
                      <ShieldAlert size={11} /> Needs approval
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium" style={{ color }}>{stateName}</span>
                  )}
                </div>
                <div className="hidden lg:block self-center">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[11px] tabular-nums" style={{ color: MUTED }}>{fmtMins(elapsed)}</span>
                    <span className="text-[10px] tabular-nums" style={{ color: FAINT }}>/ {fmtMins(r.slaMins)}</span>
                  </div>
                  <div className="h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: "#EEF0F3" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: s === 5 ? GREEN : pct > 80 ? AMBER : BRAND, transition: "width 200ms linear" }} />
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 lg:pl-[104px] grid md:grid-cols-[1.4fr_1fr] gap-4" style={{ backgroundColor: "#FCFCFD" }}>
                  <div>
                    <div className="text-[10px] font-semibold uppercase mb-1" style={{ color: FAINT, letterSpacing: "0.06em" }}>What the front office did</div>
                    <p className="text-[12.5px] leading-[1.6]" style={{ color: INK }}>{r.detail}</p>
                    {r.needsApproval && (
                      <p className="text-[11.5px] mt-2 inline-flex items-center gap-1.5" style={{ color: AMBER }}>
                        <ShieldAlert size={11} /> {r.approver} approves before this completes.
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase mb-1.5" style={{ color: FAINT, letterSpacing: "0.06em" }}>Systems touched</div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.systems.map((sys) => <Pill key={sys} color={BRAND}>{sys}</Pill>)}
                    </div>
                    <div className="text-[10px] font-semibold uppercase mt-3 mb-1.5" style={{ color: FAINT, letterSpacing: "0.06em" }}>Category</div>
                    <Pill color={MUTED}>{r.category}</Pill>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5" style={{ borderTop: `1px solid ${BORDER}`, backgroundColor: "#FCFCFD" }}>
        {STATES.map((s, i) => (
          <span key={s} className="inline-flex items-center gap-1.5 text-[10.5px]" style={{ color: MUTED }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i === 5 ? GREEN : i === 4 ? AMBER : i === 0 ? FAINT : BRAND }} />
            {s}
          </span>
        ))}
        <span className="text-[10.5px] ml-auto" style={{ color: FAINT }}>
          {reduced ? "Motion reduced — press Play to advance" : "Select any row to see what happened"}
        </span>
      </div>
    </Panel>
  );
}
