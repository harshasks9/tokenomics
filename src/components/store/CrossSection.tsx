"use client";

import type { MouseEvent } from "react";

/**
 * The whole building at once. viewBox 720×900. Six floors, two governance
 * walls, the dock and exit doors, and the marketplace annex are separate
 * focusable targets. Used in the walls scene as the "you have walked all of
 * this" summary.
 */

export type XsTarget = {
  id: string;
  label: string;
  caption: string;
};

export const XS_TARGETS: XsTarget[] = [
  { id: "storefront", label: "6 · The Storefront", caption: "Where the enterprise shops." },
  { id: "tailoring", label: "5 · The Tailoring Floor", caption: "Where products become solutions." },
  { id: "model-floor", label: "4 · The Model Floor", caption: "Every serious brand on one shelf." },
  { id: "wardrobe", label: "3 · Your Wardrobe", caption: "Your data makes it yours." },
  { id: "back-of-house", label: "2 · Back of House", caption: "One register. One inventory. One receipt." },
  { id: "foundations", label: "1 · The Foundations", caption: "Best economics, wherever you need it." },
  { id: "walls", label: "The Walls", caption: "Guards at every door, cameras on every floor." },
  { id: "doors", label: "Doors and Concessions", caption: "The doors open both ways." },
];

const IVORY = "#F6F2EA";
const INK = "#1B1B1F";
const BRASS = "#B8894A";
const BRASS_L = "#E2C38A";
const GREEN = "#153A2F";

const FLOOR_TOP = 78;
const FLOOR_H = 108;
const LEFT = 116;
const RIGHT = 644;
const WALL_W = 26;

const SHORT: Record<string, string> = {
  storefront: "STOREFRONT",
  tailoring: "TAILORING",
  "model-floor": "MODEL FLOOR",
  wardrobe: "WARDROBE",
  "back-of-house": "BACK OF HOUSE",
  foundations: "FOUNDATIONS",
};

const LINE = { stroke: INK, strokeOpacity: 0.55, strokeWidth: 1.4, fill: "none" } as const;

type Box = { x: number; y: number; w: number; h: number };

/**
 * A target is a drawing plus an SVG link laid over it. The link carries the
 * accessible name and contains no text, so "label in name" cannot mismatch;
 * without JavaScript it is still a working anchor to the floor.
 */
function Target({
  id,
  label,
  hit,
  onSelect,
  onHover,
  children,
}: {
  id: string;
  label: string;
  hit: Box[];
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  children: React.ReactNode;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(id);
    }
  };
  return (
    <g
      className="ds-xs__target"
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {children}
      <a
        href={`#${id}`}
        className="ds-xs__hit"
        aria-label={`Go to ${label}`}
        onClick={onClick}
        onFocus={() => onHover?.(id)}
        onBlur={() => onHover?.(null)}
      >
        {hit.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="transparent" />
        ))}
      </a>
    </g>
  );
}

function FloorLabel({ y, text }: { y: number; text: string }) {
  return (
    <text
      className="ds-xs__label"
      x={LEFT - WALL_W - 8}
      y={y}
      textAnchor="end"
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="11"
      fontWeight="600"
      letterSpacing="1"
      fill={BRASS_L}
      fillOpacity="0.9"
    >
      {text}
    </text>
  );
}

export default function CrossSection({
  onSelect,
  onHover,
}: {
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
}) {
  const floorY = (i: number) => FLOOR_TOP + i * FLOOR_H; // i = 0 (top, floor 6) … 5 (floor 1)
  const w = RIGHT - LEFT;
  const groundY = floorY(6);

  return (
    <svg viewBox="0 0 720 900" role="img" aria-label="Cross-section of the department store: six floors, the governance walls, the loading dock, the exit and the marketplace annex">
      {/* rooftop sign on a flat awning */}
      <path d={`M${LEFT - 10} 60 h${w + 20} l8 16 h-${w + 36} z`} fill={GREEN} stroke={BRASS} strokeOpacity="0.8" />
      <rect x={LEFT - 18} y="74" width={w + 36} height="4" fill={BRASS} />
      <text x="360" y="42" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontSize="17" fontWeight="600" letterSpacing="4" fill={BRASS_L}>
        THE DEPARTMENT STORE FOR AI
      </text>

      {/* ------------------------- floors ------------------------- */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = floorY(i);
        const t = XS_TARGETS[i];
        return (
          <Target key={t.id} id={t.id} label={t.label} hit={[{ x: LEFT - WALL_W - 60, y, w: w + WALL_W + 60, h: FLOOR_H }]} onSelect={onSelect} onHover={onHover}>
            <rect className="ds-xs__fill" x={LEFT} y={y} width={w} height={FLOOR_H} fill={i % 2 ? "#EDE7DB" : IVORY} stroke={INK} strokeOpacity="0.35" />
            {/* slab */}
            <rect x={LEFT} y={y + FLOOR_H - 6} width={w} height="6" fill="#D9D4CA" />
            <rect x={LEFT} y={y + FLOOR_H - 7} width={w} height="1.5" fill={BRASS} />
            <FloorLabel y={y + 16} text={`${6 - i}`} />
            <FloorLabel y={y + 28} text={SHORT[t.id] ?? ""} />
            <g className="ds-xs__line" {...LINE}>
              {i === 0 && (
                <>
                  {/* concierge desk */}
                  <rect x="320" y={y + 60} width="120" height="34" rx="2" />
                  <path d={`M320 ${y + 60} l14 -12 h92 l14 12`} />
                  <rect x="370" y={y + 26} width="30" height="16" />
                  <line x1="385" y1={y + 42} x2="385" y2={y + 48} />
                  <circle cx="424" cy={y + 42} r="4" />
                </>
              )}
              {i === 1 && (
                <>
                  {/* mannequin */}
                  <circle cx="250" cy={y + 26} r="7" />
                  <path d={`M236 ${y + 42} q14 -8 28 0 l-3 36 h-22 z`} />
                  <line x1="250" y1={y + 78} x2="250" y2={y + 96} />
                  <line x1="238" y1={y + 96} x2="262" y2={y + 96} />
                  {/* sewing machine on a table */}
                  <rect x="330" y={y + 72} width="140" height="6" />
                  <path d={`M360 ${y + 72} v-26 h12 v14 h40 v-14 h12 v26`} />
                  <rect x="372" y={y + 40} width="40" height="8" rx="3" />
                  {/* bolts of fabric */}
                  <rect x="500" y={y + 54} width="14" height="42" rx="3" />
                  <rect x="518" y={y + 54} width="14" height="42" rx="3" />
                  <rect x="536" y={y + 54} width="14" height="42" rx="3" />
                </>
              )}
              {i === 2 && (
                <>
                  {/* eight racks */}
                  {["GEMINI", "GEMMA", "CLAUDE", "LLAMA", "MISTRAL", "QWEN", "DEEPSEEK", "SPECIALISTS"].map((name, r) => {
                    const gem = r === 0;
                    const rx = LEFT + 8 + r * 65;
                    const rw = gem ? 60 : 52;
                    const top = gem ? y + 22 : y + 34;
                    return (
                      <g key={name}>
                        <line x1={rx} y1={top} x2={rx + rw} y2={top} stroke={gem ? GREEN : INK} strokeWidth={gem ? 3 : 1.4} />
                        <line x1={rx + 4} y1={top} x2={rx + 4} y2={y + 96} stroke={gem ? GREEN : INK} strokeWidth={gem ? 2 : 1.4} />
                        <line x1={rx + rw - 4} y1={top} x2={rx + rw - 4} y2={y + 96} stroke={gem ? GREEN : INK} strokeWidth={gem ? 2 : 1.4} />
                        {[0, 1, 2].map((g) => (
                          <path key={g} d={`M${rx + 11 + g * 15} ${top + 4} l-5 4 l1 26 h10 l1 -26 z`} fill={gem ? GREEN : "none"} fillOpacity={gem ? 0.85 : 1} stroke={gem ? GREEN : INK} />
                        ))}
                        <text
                          x={rx + rw / 2}
                          y={y + 14}
                          textAnchor="middle"
                          fontFamily="Inter, system-ui, sans-serif"
                          fontSize={gem ? 10 : 8.2}
                          fontWeight="700"
                          letterSpacing="0.8"
                          fill={gem ? GREEN : INK}
                          stroke="none"
                        >
                          {name}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}
              {i === 3 && (
                <>
                  {/* wardrobe */}
                  <rect x="300" y={y + 20} width="120" height="76" />
                  <line x1="360" y1={y + 20} x2="360" y2={y + 96} />
                  <circle cx="352" cy={y + 58} r="2" />
                  <circle cx="368" cy={y + 58} r="2" />
                  {/* tape measure */}
                  <path d={`M450 ${y + 80} q30 -30 60 0 q-30 10 -60 0`} />
                  <circle cx="480" cy={y + 60} r="10" />
                </>
              )}
              {i === 4 && (
                <>
                  {/* register */}
                  <rect x="150" y={y + 66} width="70" height="30" />
                  <rect x="160" y={y + 46} width="40" height="16" rx="2" />
                  {/* shelving */}
                  <rect x="250" y={y + 24} width="130" height="72" />
                  <line x1="250" y1={y + 48} x2="380" y2={y + 48} />
                  <line x1="250" y1={y + 72} x2="380" y2={y + 72} />
                  {/* three fitting-room curtains */}
                  {[0, 1, 2].map((c) => (
                    <g key={c}>
                      <rect x={420 + c * 56} y={y + 24} width="48" height="72" />
                      <path d={`M${424 + c * 56} ${y + 28} q4 30 0 64 M${432 + c * 56} ${y + 28} q4 30 0 64 M${440 + c * 56} ${y + 28} q4 30 0 64 M${448 + c * 56} ${y + 28} q4 30 0 64 M${456 + c * 56} ${y + 28} q4 30 0 64`} />
                    </g>
                  ))}
                </>
              )}
              {i === 5 && (
                <>
                  {/* loading bays */}
                  {["TPU", "GPU"].map((b, k) => (
                    <g key={b}>
                      <rect x={200 + k * 160} y={y + 28} width="110" height="68" />
                      {[0, 1, 2, 3].map((s) => (
                        <line key={s} x1={200 + k * 160} y1={y + 42 + s * 14} x2={310 + k * 160} y2={y + 42 + s * 14} />
                      ))}
                      <text x={255 + k * 160} y={y + 20} textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="700" letterSpacing="2" fill={INK} stroke="none">
                        {b}
                      </text>
                    </g>
                  ))}
                  {/* franchise storefront to the side */}
                  <rect x="540" y={y + 52} width="70" height="44" />
                  <path d={`M534 ${y + 52} h82 l-6 -12 h-70 z`} />
                  <rect x="566" y={y + 72} width="18" height="24" />
                  <rect x="546" y={y + 60} width="12" height="10" />
                  <rect x="592" y={y + 60} width="12" height="10" />
                </>
              )}
            </g>
          </Target>
        );
      })}

      {/* ------------------------- the walls ------------------------- */}
      <Target
        id="walls"
        label={XS_TARGETS[6].label}
        hit={[
          { x: LEFT - WALL_W, y: FLOOR_TOP, w: WALL_W, h: groundY - FLOOR_TOP + 70 },
          { x: RIGHT, y: FLOOR_TOP, w: WALL_W, h: groundY - FLOOR_TOP + 70 },
        ]}
        onSelect={onSelect}
        onHover={onHover}
      >
        <rect className="ds-xs__fill" x={LEFT - WALL_W} y={FLOOR_TOP} width={WALL_W} height={groundY - FLOOR_TOP + 70} fill={GREEN} />
        <rect className="ds-xs__fill" x={RIGHT} y={FLOOR_TOP} width={WALL_W} height={groundY - FLOOR_TOP + 70} fill={GREEN} />
        <text
          className="ds-xs__label"
          transform={`translate(${LEFT - WALL_W / 2 + 4} ${FLOOR_TOP + 380}) rotate(-90)`}
          textAnchor="middle"
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontSize="11"
          letterSpacing="4"
          fill={BRASS_L}
        >
          SECURITY · GOVERNANCE · RESIDENCY · AUDIT
        </text>
        <text
          className="ds-xs__label"
          transform={`translate(${RIGHT + WALL_W / 2 + 4} ${FLOOR_TOP + 380}) rotate(-90)`}
          textAnchor="middle"
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontSize="11"
          letterSpacing="4"
          fill={BRASS_L}
        >
          SECURITY · GOVERNANCE · RESIDENCY · AUDIT
        </text>
      </Target>

      {/* ------------------------- ground: doors + annex ------------------------- */}
      <Target
        id="doors"
        label={XS_TARGETS[7].label}
        hit={[
          { x: LEFT, y: groundY, w, h: 96 },
          { x: RIGHT + WALL_W, y: groundY - 176, w: 70, h: 250 },
        ]}
        onSelect={onSelect}
        onHover={onHover}
      >
        <rect className="ds-xs__fill" x={LEFT} y={groundY} width={w} height="70" fill="#EDE7DB" stroke={INK} strokeOpacity="0.35" />
        {/* ground slab */}
        <rect x={LEFT - WALL_W - 20} y={groundY + 70} width={w + 2 * WALL_W + 110} height="6" fill="#D9D4CA" />
        {/* dock door, left, ajar */}
        <g className="ds-xs__line" {...LINE}>
          <rect x={LEFT + 20} y={groundY + 12} width="54" height="58" />
          <path d={`M${LEFT + 20} ${groundY + 12} l-26 10 v56 l26 -8`} fill="#D9D4CA" />
          {/* crates by the dock */}
          <rect x={LEFT + 90} y={groundY + 48} width="20" height="20" />
          <rect x={LEFT + 114} y={groundY + 48} width="20" height="20" />
          <rect x={LEFT + 102} y={groundY + 30} width="20" height="18" />
        </g>
        <text className="ds-xs__label" x={LEFT + 20} y={groundY + 86} fontFamily="Inter, system-ui, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="1.2" fill={IVORY}>
          LOADING DOCK — BRING YOUR OWN
        </text>
        {/* exit door, right, ajar */}
        <g className="ds-xs__line" {...LINE}>
          <rect x={RIGHT - 74} y={groundY + 12} width="54" height="58" />
          <path d={`M${RIGHT - 20} ${groundY + 12} l26 10 v56 l-26 -8`} fill="#D9D4CA" />
          <line x1={RIGHT - 30} y1={groundY + 40} x2={RIGHT - 30} y2={groundY + 48} />
        </g>
        <text className="ds-xs__label" x={RIGHT - 20} y={groundY + 86} textAnchor="end" fontFamily="Inter, system-ui, sans-serif" fontSize="7.5" fontWeight="600" letterSpacing="1.2" fill={IVORY}>
          EXIT — OPEN APIS, OPEN WEIGHTS, A2A, MCP
        </text>
        {/* annex: attached smaller building */}
        <rect className="ds-xs__fill" x={RIGHT + WALL_W} y={groundY - 160} width="64" height="230" fill="#EDE7DB" stroke={INK} strokeOpacity="0.35" />
        <path d={`M${RIGHT + WALL_W - 4} ${groundY - 160} h72 l-6 -14 h-60 z`} fill={GREEN} />
        <g className="ds-xs__line" {...LINE}>
          {[0, 1, 2].map((r) => (
            <rect key={r} x={RIGHT + WALL_W + 12} y={groundY - 140 + r * 60} width="40" height="30" />
          ))}
          <rect x={RIGHT + WALL_W + 22} y={groundY + 34} width="20" height="36" />
        </g>
        <text
          className="ds-xs__label"
          transform={`translate(${RIGHT + WALL_W + 32} ${groundY + 20}) rotate(-90)`}
          textAnchor="start"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="7"
          fontWeight="600"
          letterSpacing="1.5"
          fill={INK}
        >
          MARKETPLACE & PARTNERS
        </text>
      </Target>
    </svg>
  );
}
