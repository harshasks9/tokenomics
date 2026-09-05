"use client";

import { motion } from "framer-motion";
import type { CSSProperties, KeyboardEvent } from "react";
import { floors, column, type FloorId } from "@/lib/store/data";

/**
 * The building: an architectural cutaway with seven levels and one
 * structural column. viewBox 640×940. Three treatments: outline (drawn in),
 * solid (interactive explorer), xray (governance).
 */

export type BuildingProps = {
  variant?: "outline" | "solid" | "xray";
  active?: FloorId | "column" | null;
  onSelect?: (id: FloorId) => void;
  interactive?: boolean;
  animate?: boolean;
  className?: string;
  showLabels?: boolean;
};

const X0 = 178;
const X1 = 600;
const COL_X = 150;
const TOP = 90;
const H = 115;
const ROOF_H = 100;
const FOUND_H = 115;

export const floorGeometry: Record<FloorId, { y: number; h: number }> = {
  rooftop: { y: TOP, h: ROOF_H },
  agents: { y: TOP + ROOF_H, h: H },
  models: { y: TOP + ROOF_H + H, h: H },
  data: { y: TOP + ROOF_H + 2 * H, h: H },
  build: { y: TOP + ROOF_H + 3 * H, h: H },
  govern: { y: TOP + ROOF_H + 4 * H, h: H },
  foundation: { y: TOP + ROOF_H + 5 * H, h: FOUND_H },
};
const GROUND = TOP + ROOF_H + 5 * H + FOUND_H;

function Fixtures({ id, y, stroke, xray }: { id: FloorId; y: number; stroke: string; xray: boolean }) {
  const tile = (x: number, yy: number, w: number, h: number, fill: string, key: string) => (
    <rect key={key} x={x} y={yy} width={w} height={h} rx="2" fill={xray ? "none" : fill} stroke={xray ? stroke : "none"} opacity={xray ? 0.7 : 0.9} />
  );
  const line = { stroke, strokeWidth: 1.5, fill: "none", opacity: 0.8 } as const;
  switch (id) {
    case "rooftop":
      return (
        <g>
          {/* concierge desk and people */}
          <rect x="250" y={y + 58} width="120" height="18" rx="3" {...line} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <circle cx={420 + i * 26} cy={y + 46} r="5" {...line} />
              <path d={`M${412 + i * 26} ${y + 76} v-14 a8 8 0 0 1 16 0 v14`} {...line} />
            </g>
          ))}
          <path d={`M212 ${y + 76} v-40 a20 20 0 0 1 40 0 v40`} {...line} />
        </g>
      );
    case "agents":
      return (
        <g>
          {[
            [250, 40],
            [330, 24],
            [410, 56],
            [490, 30],
            [560, 60],
          ].map(([x, dy], i) => (
            <circle key={i} cx={x} cy={y + dy + 20} r="11" {...line} />
          ))}
          <path d={`M261 ${y + 60} L319 ${y + 44} M341 ${y + 44} L399 ${y + 76} M421 ${y + 76} L479 ${y + 50} M501 ${y + 50} L549 ${y + 80}`} {...line} strokeDasharray="4 4" />
        </g>
      );
    case "models":
      return (
        <g>
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <line x1="210" y1={y + 40 + r * 26} x2="580" y2={y + 40 + r * 26} {...line} />
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => {
                const fill = c < 4 ? "#1a73e8" : c < 7 ? "#b26a00" : "#188038";
                return tile(216 + c * 37, y + 22 + r * 26, 24, 14, fill, `${r}-${c}`);
              })}
            </g>
          ))}
        </g>
      );
    case "data":
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <ellipse cx={240 + i * 60} cy={y + 34} rx="18" ry="6" {...line} />
              <path d={`M${222 + i * 60} ${y + 34} v34 a18 6 0 0 0 36 0 v-34`} {...line} />
            </g>
          ))}
          <path d={`M370 ${y + 52} H440 M440 ${y + 40} h120 M440 ${y + 64} h120 M440 ${y + 40} v24`} {...line} />
          {[0, 1].map((i) => (
            <rect key={i} x="560" y={y + 32 + i * 24} width="18" height="14" rx="2" {...line} />
          ))}
        </g>
      );
    case "build":
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={215 + i * 74} y={y + 38} width="48" height="36" rx="4" {...line} />
              {i < 4 && <path d={`M${263 + i * 74} ${y + 56} h26 m-8 -6 l8 6 l-8 6`} {...line} />}
            </g>
          ))}
        </g>
      );
    case "govern":
      return (
        <g>
          <path d={`M250 ${y + 28} l28 10 v22 q0 22 -28 32 q-28 -10 -28 -32 v-22 z`} {...line} />
          <path d={`M240 ${y + 60} l8 8 l14 -16`} {...line} />
          <path d={`M340 ${y + 84} a40 40 0 0 1 80 0`} {...line} />
          <line x1="380" y1={y + 84} x2="404" y2={y + 52} {...line} />
          <rect x="470" y={y + 30} width="14" height="54" rx="2" {...line} />
          <rect x="530" y={y + 30} width="14" height="54" rx="2" {...line} />
          <line x1="484" y1={y + 57} x2="530" y2={y + 57} {...line} strokeDasharray="3 4" />
        </g>
      );
    case "foundation":
      return (
        <g>
          {[0, 1].map((r) =>
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
              <rect key={`${r}${c}`} x={214 + c * 42} y={y + 26 + r * 40} width="30" height="26" rx="3" {...line} />
            )),
          )}
          <path d={`M214 ${y + 96} h378`} {...line} strokeDasharray="2 6" />
        </g>
      );
  }
}

export default function Building({
  variant = "solid",
  active = null,
  onSelect,
  interactive = false,
  animate = false,
  className = "",
  showLabels = true,
}: BuildingProps) {
  const xray = variant === "xray";
  const outline = variant === "outline";
  const stroke = xray ? "#67e8f9" : "#111318";
  const draw = animate;

  const onKey = (e: KeyboardEvent<SVGRectElement>, id: FloorId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(id);
    }
  };

  return (
    <svg
      viewBox="0 0 640 940"
      className={`ds-building ${className}`}
      role={interactive ? "group" : "img"}
      aria-label={interactive ? "The building: choose a floor" : "Cutaway of the AI department store: seven levels and one structural column"}
    >
      {/* ground */}
      <motion.line x1="60" y1={GROUND} x2="620" y2={GROUND} stroke={stroke} strokeWidth="2" initial={draw ? { pathLength: 0 } : false} animate={draw ? { pathLength: 1 } : undefined} transition={{ duration: 0.6 }} />
      {/* roof */}
      <motion.path d={`M${COL_X - 8} ${TOP} H${X1 + 8}`} stroke={stroke} strokeWidth="3" fill="none" initial={draw ? { pathLength: 0 } : false} animate={draw ? { pathLength: 1 } : undefined} transition={{ duration: 0.6, delay: 0.1 }} />
      <motion.path d={`M${X1 + 8} ${TOP} V${GROUND}`} stroke={stroke} strokeWidth="2" fill="none" initial={draw ? { pathLength: 0 } : false} animate={draw ? { pathLength: 1 } : undefined} transition={{ duration: 1.2, delay: 0.2 }} />

      {/* floors */}
      {floors.map((f, i) => {
        const g = floorGeometry[f.id];
        const isActive = active === f.id;
        const isFoundation = f.id === "foundation";
        const fill = xray ? "transparent" : isFoundation ? "#eceff3" : "#ffffff";
        const style = { "--floor": `${f.accent}12`, "--floor-line": f.accent } as CSSProperties;
        return (
          <motion.g
            key={f.id}
            className={`ds-building__floor${isActive ? " is-active" : ""}`}
            style={style}
            initial={draw ? { opacity: 0 } : false}
            animate={draw ? { opacity: 1 } : undefined}
            transition={{ duration: 0.5, delay: 0.25 + i * 0.12 }}
          >
            <rect className="fill" x={X0} y={g.y} width={X1 - X0} height={g.h} fill={outline ? "transparent" : fill} stroke={isActive ? f.accent : xray ? stroke : "#111318"} strokeWidth={isActive ? 2.5 : 1.5} strokeOpacity={xray ? 0.7 : 1} />
            {/* corridor openings on the right wall */}
            <rect x={X1 - 2} y={g.y + g.h - 34} width="10" height="26" fill={xray ? "#0b0f17" : outline ? "#f7f7f5" : "#ffffff"} />
            <Fixtures id={f.id} y={g.y} stroke={isActive ? f.accent : stroke} xray={xray} />
            {showLabels && (
              <g>
                <text x={COL_X - 14} y={g.y + 22} textAnchor="end" fontSize="10" fontWeight="600" letterSpacing="1.5" fill={xray ? "#67e8f9" : "#5f6368"}>
                  {f.level.toUpperCase()}
                </text>
                <text className="name" x={COL_X - 14} y={g.y + 44} textAnchor="end" fontSize="15" fontWeight="600" letterSpacing="-0.2" fill={isActive ? f.accent : xray ? "#ffffff" : "#3c4043"}>
                  {f.name}
                </text>
              </g>
            )}
            {interactive && (
              <rect
                className="ds-building__hit"
                x={60}
                y={g.y}
                width={X1 + 10 - 60}
                height={g.h}
                fill="transparent"
                role="button"
                tabIndex={0}
                aria-label={`${f.level}: ${f.name}`}
                aria-pressed={isActive}
                onClick={() => onSelect?.(f.id)}
                onKeyDown={(e) => onKey(e, f.id)}
              />
            )}
          </motion.g>
        );
      })}

      {/* structural column */}
      <motion.g initial={draw ? { opacity: 0 } : false} animate={draw ? { opacity: 1 } : undefined} transition={{ duration: 0.6, delay: 1.2 }}>
        <rect x={COL_X} y={TOP} width={X0 - COL_X} height={GROUND - TOP} fill={xray ? "rgba(103,232,249,0.14)" : active === "column" ? "#111318" : "#1f2937"} stroke={xray ? "#67e8f9" : "none"} />
        <text transform={`translate(${COL_X + 18} ${TOP + (GROUND - TOP) / 2}) rotate(-90)`} textAnchor="middle" fontSize="11" fontWeight="600" letterSpacing="3" fill={xray ? "#67e8f9" : "#ffffff"}>
          {column.map((c) => c.toUpperCase()).join("  •  ")}
        </text>
      </motion.g>
    </svg>
  );
}
