"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { SYS_LINKS, SYS_NODES, type SysLink } from "./data";
import { AGENT, Chip, INK, MUTED, RULE, SERIF, STALL, Tag } from "./ui";

const GROUP_COLOR: Record<string, string> = {
  front: "#8C2F39",
  core: "#3E5C8A",
  money: "#9A6B12",
  outcome: "#1D6A4F",
  regulator: "#6B4E9A",
};

const W = 1000;
const H = 560;
const px = (x: number) => (x / 100) * W;
const py = (y: number) => (y / 100) * H;

export function MiddlewareMap() {
  const [hover, setHover] = useState<SysLink | null>(null);
  const [picked, setPicked] = useState<SysLink | null>(null);
  const shown = picked ?? hover;
  const node = (id: string) => SYS_NODES.find((n) => n.id === id)!;

  return (
    <div>
      <div className="relative rounded-[3px] bg-white overflow-hidden" style={{ border: `1px solid ${RULE}` }}>
        {/* Lines */}
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}`, minHeight: 320 }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" role="img"
            aria-label="Map of university systems. Every connection is maintained by a person.">
            {SYS_LINKS.map((l) => {
              const a = node(l.from), b = node(l.to);
              const x1 = px(a.x), y1 = py(a.y), x2 = px(b.x), y2 = py(b.y);
              const mx = (x1 + x2) / 2;
              const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
              const on = shown === l;
              return (
                <g key={`${l.from}-${l.to}`}>
                  <path d={d} fill="none" stroke={on ? STALL : "#B9AE9C"} strokeWidth={on ? 2.6 : 1.3}
                    strokeDasharray="5 5" style={{ transition: "stroke 160ms, stroke-width 160ms" }} />
                  <path
                    d={d} fill="none" stroke="transparent" strokeWidth={22}
                    style={{ cursor: "pointer", pointerEvents: "stroke", outline: "none" }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${a.label} to ${b.label}: ${l.human}`}
                    onMouseOver={() => setHover(l)}
                    onMouseOut={() => setHover(null)}
                    onFocus={() => setHover(l)}
                    onBlur={() => setHover(null)}
                    onClick={() => setPicked(picked === l ? null : l)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPicked(picked === l ? null : l); }
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {SYS_NODES.map((n) => (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <div
                className="px-2.5 py-1.5 rounded-[3px] bg-white text-center"
                style={{ border: `1px solid ${GROUP_COLOR[n.group]}55`, minWidth: 92 }}
              >
                <div className="text-[10.5px] font-bold leading-tight" style={{ color: GROUP_COLOR[n.group] }}>{n.label}</div>
                <div className="text-[8.5px] leading-tight mt-0.5" style={{ color: MUTED }}>{n.sub}</div>
              </div>
            </div>
          ))}

          {/* Floating hint */}
          {hover && !picked && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-3 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 pointer-events-none"
              style={{ backgroundColor: STALL, color: "#fff" }}
            >
              <User size={11} />
              <span className="text-[11px] font-bold">This line is a person.</span>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="px-5 py-4" style={{ borderTop: `1px solid ${RULE}`, backgroundColor: shown ? "#FDFBF8" : "#fff", minHeight: 96 }}>
          {shown ? (
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <Chip color={STALL} filled>{node(shown.from).label} → {node(shown.to).label}</Chip>
                <span className="text-[13px] font-bold" style={{ color: INK }}>{shown.human}</span>
              </div>
              {shown.detail && <p className="text-[12px] leading-[1.6] max-w-[74ch]" style={{ color: MUTED }}>{shown.detail}</p>}
              {shown.to === "reg" && (
                <div className="mt-2"><Tag kind="fact" src="edhitch" /></div>
              )}
              {shown.to === "abc" && (
                <div className="mt-2"><Tag kind="fact" src="abc" /></div>
              )}
            </div>
          ) : (
            <p className="text-[12px]" style={{ color: MUTED }}>
              Hover or tap any dashed connection. There are {SYS_LINKS.length} of them on this map, and not one is an integration.
            </p>
          )}
        </div>
      </div>

      {/* Legend + the punchline */}
      <div className="mt-4 grid md:grid-cols-[1fr_auto] gap-4 items-start">
        <div className="flex flex-wrap gap-2">
          {Object.entries(GROUP_COLOR).map(([k, c]) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-[10px] uppercase" style={{ color: MUTED, letterSpacing: "0.1em" }}>
              <span className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: c }} />
              {k === "front" ? "Front channels" : k === "core" ? "Core academic" : k === "money" ? "Money" : k === "outcome" ? "Outcomes" : "Regulators"}
            </span>
          ))}
        </div>
        <div className="text-[11.5px] leading-[1.6] max-w-[46ch]" style={{ color: MUTED }}>
          APAAR is the first credible national join key — and it arrived after every one of these systems had already chosen its own.
          <span className="ml-1"><Tag kind="fact" src="nad" /></span>
        </div>
      </div>
    </div>
  );
}

export function RegulatorProof() {
  return (
    <div className="rounded-[3px] p-6 md:p-8" style={{ backgroundColor: INK }}>
      <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <div className="text-[10px] font-bold uppercase mb-3" style={{ color: "#C9A227", letterSpacing: "0.22em" }}>
            The proof that nobody is joining these systems
          </div>
          <p className="text-[19px] md:text-[24px] leading-[1.35]" style={{ fontFamily: SERIF, color: PAPERISH }}>
            One institution reported <span style={{ color: "#E8C86A" }}>three different faculty counts</span> to three regulators in the same year — and never noticed.
          </p>
          <p className="text-[12.5px] leading-[1.65] mt-4 max-w-[62ch]" style={{ color: "#9C948A" }}>
            The IQAC coordinator fills the NAAC self-study report from one silo. The NIRF in-charge fills the NIRF portal from another.
            The Registrar files the AISHE return from a third. Each has its own portal, its own format, its own deadline — and no one
            compares the answers. <Tag kind="fact" src="edhitch" />
          </p>
        </div>
        <div className="flex md:flex-col gap-4 md:gap-3 shrink-0">
          {[["210", "NAAC SSR"], ["166", "NIRF"], ["195", "AISHE"]].map(([n, l]) => (
            <div key={l} className="text-center md:text-right">
              <div className="text-[30px] md:text-[38px] font-bold tabular-nums leading-none" style={{ fontFamily: SERIF, color: "#E8C86A" }}>{n}</div>
              <div className="text-[9.5px] uppercase mt-1" style={{ color: "#9C948A", letterSpacing: "0.14em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PAPERISH = "#F6F3EE";
