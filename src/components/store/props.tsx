/**
 * Physical objects. Every prop is an inline SVG drawn in its own box and
 * painted with the shared gradients from Defs. Strokes are ink at low
 * opacity; light comes from above-left in every scene.
 */

const INK = "#1B1B1F";
const IVORY = "#F6F2EA";
const BRASS = "url(#ds-brass)";
const WALNUT = "url(#ds-walnut)";
const GREEN = "url(#ds-green)";
const LINEN = "url(#ds-linen)";
const STROKE = { stroke: INK, strokeOpacity: 0.35, strokeWidth: 1.2 } as const;

function Shadow({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#ds-shadow)" />;
}

function Hanger({ x, y, w = 40 }: { x: number; y: number; w?: number }) {
  return (
    <g stroke={INK} strokeOpacity="0.6" strokeWidth="1.4" fill="none">
      <path d={`M${x} ${y - 10} q0 -6 5 -6 q5 0 5 5 q0 3 -5 6`} />
      <path d={`M${x} ${y} l${-w / 2} 12 h${w} z`} />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 6 — The Storefront                                             */
/* ------------------------------------------------------------------ */

export function ConciergeDesk() {
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={200} cy={250} rx={190} ry={16} />
      {/* counter body */}
      <path d="M30 110 h340 v120 h-340 z" fill={WALNUT} {...STROKE} />
      <path d="M30 110 h340 v14 h-340 z" fill="url(#ds-walnut-h)" opacity="0.9" />
      {/* front panels */}
      <g fill="none" stroke={INK} strokeOpacity="0.25">
        <rect x="52" y="140" width="80" height="70" rx="2" />
        <rect x="160" y="140" width="80" height="70" rx="2" />
        <rect x="268" y="140" width="80" height="70" rx="2" />
      </g>
      {/* brass top edge */}
      <rect x="22" y="100" width="356" height="12" fill={BRASS} {...STROKE} />
      <rect x="22" y="100" width="356" height="2" fill="#F3E2BC" />
      {/* top surface (light) */}
      <path d="M22 100 l24 -26 h308 l24 26 z" fill="#E9E4DA" {...STROKE} />
      {/* bell */}
      <g>
        <ellipse cx="300" cy="82" rx="14" ry="4" fill="#8A6432" />
        <path d="M288 82 q0 -22 12 -22 q12 0 12 22 z" fill={BRASS} {...STROKE} />
        <circle cx="300" cy="58" r="2.5" fill="#E2C38A" />
      </g>
      {/* sign holder */}
      <rect x="118" y="26" width="164" height="50" rx="2" fill={GREEN} {...STROKE} />
      <rect x="118" y="26" width="164" height="3" fill={BRASS} />
      <rect x="197" y="76" width="6" height="18" fill={BRASS} />
      {/* small potted plant */}
      <g>
        <path d="M70 74 h30 l-4 -22 h-22 z" fill="#8A6432" />
        <path d="M85 52 c-16 -8 -18 -26 -6 -30 c4 8 10 10 12 22 c6 -12 14 -14 20 -8 c-2 12 -12 16 -26 16 z" fill="#1E4A3C" />
      </g>
    </svg>
  );
}

export function StoreCard() {
  return (
    <svg viewBox="0 0 220 160" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={110} cy={150} rx={90} ry={10} />
      {/* small easel */}
      <path d="M60 148 l40 -90 l40 90" fill="none" stroke={INK} strokeOpacity="0.5" strokeWidth="2" />
      {/* card */}
      <g transform="rotate(-6 110 90)">
        <rect x="40" y="52" width="140" height="88" rx="8" fill={GREEN} {...STROKE} />
        <rect x="40" y="70" width="140" height="10" fill={BRASS} />
        <rect x="54" y="92" width="30" height="20" rx="3" fill="#E2C38A" opacity="0.9" />
        <rect x="54" y="120" width="80" height="4" fill={IVORY} opacity="0.6" />
        <rect x="54" y="128" width="50" height="4" fill={IVORY} opacity="0.4" />
        <circle cx="160" cy="118" r="8" fill="none" stroke="#E2C38A" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 5 — The Tailoring Floor                                        */
/* ------------------------------------------------------------------ */

export function Mannequin() {
  // One suit, four panels, four brands.
  return (
    <svg viewBox="0 0 220 360" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={110} cy={350} rx={70} ry={9} />
      {/* stand */}
      <rect x="106" y="252" width="8" height="90" fill={BRASS} />
      <path d="M60 342 q50 -14 100 0 v6 h-100 z" fill={WALNUT} {...STROKE} />
      {/* neck */}
      <rect x="100" y="70" width="20" height="26" rx="6" fill="#D9D4CA" {...STROKE} />
      {/* jacket: left and right fronts, two brands */}
      <path d="M110 100 l-56 14 q-8 40 -6 130 l62 10 z" fill="#1E4A3C" {...STROKE} />
      <path d="M110 100 l56 14 q8 40 6 130 l-62 10 z" fill="#2A3F4A" {...STROKE} />
      {/* sleeves, two more brands */}
      <path d="M54 114 l-22 8 l-6 96 l24 4 z" fill="#5B3A22" {...STROKE} />
      <path d="M166 114 l22 8 l6 96 l-24 4 z" fill="#4A4A52" {...STROKE} />
      {/* seams stitched in ivory */}
      <g stroke={IVORY} strokeOpacity="0.8" strokeWidth="1" strokeDasharray="3 3" fill="none">
        <path d="M110 100 v154" />
        <path d="M54 114 q-8 40 -6 130" />
        <path d="M166 114 q8 40 6 130" />
      </g>
      {/* lapels and shirt */}
      <path d="M110 96 l-22 44 l22 26 l22 -26 z" fill="#F6F2EA" {...STROKE} />
      <path d="M110 96 l-22 44 l12 6 l10 -30 l10 30 l12 -6 z" fill="#1B1B1F" opacity="0.15" />
      {/* brand labels on the panels */}
      <g fontFamily="Inter, system-ui, sans-serif" fontSize="7.5" fontWeight="600" fill={IVORY} letterSpacing="1.2">
        <text x="80" y="200" textAnchor="middle">GEMINI</text>
        <text x="140" y="200" textAnchor="middle">CLAUDE</text>
        <text x="40" y="180" textAnchor="middle" fontSize="6" transform="rotate(-80 40 180)">LLAMA</text>
        <text x="180" y="180" textAnchor="middle" fontSize="6" transform="rotate(80 180 180)">GEMMA</text>
      </g>
      {/* pins */}
      <g stroke="#E2C38A" strokeWidth="1.5">
        <line x1="60" y1="150" x2="66" y2="142" />
        <line x1="160" y1="150" x2="154" y2="142" />
        <line x1="110" y1="236" x2="110" y2="226" />
      </g>
    </svg>
  );
}

export function TailorBench() {
  return (
    <svg viewBox="0 0 420 260" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={210} cy={250} rx={200} ry={14} />
      {/* legs */}
      <g fill={WALNUT} {...STROKE}>
        <rect x="40" y="150" width="14" height="96" />
        <rect x="366" y="150" width="14" height="96" />
      </g>
      {/* table top */}
      <path d="M20 122 h380 v30 h-380 z" fill={WALNUT} {...STROKE} />
      <path d="M20 122 l20 -14 h340 l20 14 z" fill="#8B5E3C" {...STROKE} />
      {/* fabric laid out */}
      <path d="M70 108 q60 -14 120 0 q60 14 130 0 v-4 q-60 12 -130 -2 q-60 -12 -120 0 z" fill="#1E4A3C" />
      <path d="M90 100 h180 v10 h-180 z" fill="#1E4A3C" opacity="0.9" />
      <path d="M90 100 l-30 -30 h180 l30 30 z" fill="#2A5A48" {...STROKE} />
      {/* pattern paper */}
      <path d="M230 78 l40 -22 h60 l-10 44 h-60 z" fill={IVORY} {...STROKE} />
      <path d="M250 72 q20 -10 40 4" fill="none" stroke={INK} strokeOpacity="0.4" strokeDasharray="3 2" />
      {/* scissors */}
      <g stroke={INK} strokeOpacity="0.7" strokeWidth="2.2" fill="none">
        <line x1="120" y1="86" x2="170" y2="66" />
        <line x1="122" y1="66" x2="168" y2="86" />
        <circle cx="116" cy="88" r="5" />
        <circle cx="118" cy="63" r="5" />
      </g>
      {/* tape measure */}
      <path d="M300 96 q30 -20 60 0 q-30 8 -60 0" fill="#E2C38A" stroke="#8A6432" strokeWidth="1" />
      {/* thread spools under bench */}
      <g>
        <rect x="80" y="180" width="18" height="24" fill="#153A2F" />
        <rect x="104" y="180" width="18" height="24" fill="#B8894A" />
        <rect x="128" y="180" width="18" height="24" fill="#5B3A22" />
      </g>
    </svg>
  );
}

export function AlterationsCounter() {
  return (
    <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={180} cy={232} rx={170} ry={12} />
      <path d="M30 120 h300 v100 h-300 z" fill={WALNUT} {...STROKE} />
      <rect x="22" y="110" width="316" height="12" fill={BRASS} {...STROKE} />
      <path d="M22 110 l20 -20 h276 l20 20 z" fill="#E9E4DA" {...STROKE} />
      {/* sewing machine */}
      <g>
        <path d="M120 90 h120 v-8 h-120 z" fill="#1B1B1F" />
        <path d="M130 82 v-36 h20 v22 h60 v-22 h20 v36 z" fill="#2A2A30" {...STROKE} />
        <rect x="150" y="34" width="60" height="14" rx="4" fill="#2A2A30" {...STROKE} />
        <path d="M150 48 v20" stroke="#B8894A" strokeWidth="2" />
        <circle cx="222" cy="52" r="7" fill={BRASS} />
        <rect x="140" y="70" width="14" height="4" fill="#B8894A" />
      </g>
      {/* little sign "ALTERATIONS" as a pin board */}
      <rect x="248" y="52" width="70" height="30" rx="2" fill={GREEN} {...STROKE} />
      <rect x="248" y="52" width="70" height="3" fill={BRASS} />
      <text x="283" y="71" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="7" fontWeight="600" letterSpacing="1.5" fill="#E2C38A">
        ALTERATIONS
      </text>
      {/* garment awaiting */}
      <path d="M40 60 l40 -10 l0 40 l-40 6 z" fill="#4A4A52" {...STROKE} />
    </svg>
  );
}

export function HangerWall() {
  return (
    <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMax meet">
      {/* wall panel */}
      <rect x="10" y="10" width="340" height="220" fill="#E9E4DA" {...STROKE} />
      <rect x="20" y="20" width="320" height="200" fill="none" stroke={INK} strokeOpacity="0.15" />
      {/* two brass rails */}
      <rect x="20" y="60" width="320" height="5" fill={BRASS} />
      <rect x="20" y="150" width="320" height="5" fill={BRASS} />
      {/* identical hangers */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Hanger key={`a${i}`} x={50 + i * 52} y={86} w={36} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Hanger key={`b${i}`} x={50 + i * 52} y={176} w={36} />
      ))}
      {/* stamped sizes */}
      <g fontFamily="Inter, system-ui, sans-serif" fontSize="7" fill={INK} fillOpacity="0.5" letterSpacing="1">
        <text x="30" y="46">A2A</text>
        <text x="310" y="46">MCP</text>
      </g>
    </svg>
  );
}

export function ReadyToWearRail() {
  const garments = ["#153A2F", "#4A4A52", "#5B3A22", "#2A3F4A", "#8A6432", "#3A3A44"];
  return (
    <svg viewBox="0 0 380 260" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={190} cy={252} rx={160} ry={10} />
      {/* rail */}
      <rect x="20" y="40" width="340" height="6" rx="3" fill={BRASS} />
      <rect x="34" y="46" width="6" height="200" fill={BRASS} />
      <rect x="340" y="46" width="6" height="200" fill={BRASS} />
      <rect x="14" y="240" width="46" height="8" rx="4" fill={BRASS} />
      <rect x="320" y="240" width="46" height="8" rx="4" fill={BRASS} />
      {garments.map((c, i) => {
        const x = 70 + i * 46;
        return (
          <g key={i}>
            <path d={`M${x} 44 q0 -8 6 -8 q6 0 6 6`} fill="none" stroke={INK} strokeOpacity="0.6" strokeWidth="1.4" />
            <path d={`M${x - 18} 62 l18 -10 l18 10 l6 120 h-48 z`} fill={c} {...STROKE} />
            <path d={`M${x} 52 l-6 30 l6 60 l6 -60 z`} fill={IVORY} opacity="0.25" />
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 4 — The Model Floor                                            */
/* ------------------------------------------------------------------ */

export function Rack({ accent = false }: { accent?: boolean }) {
  const garments = accent
    ? ["#1E4A3C", "#153A2F", "#2A5A48", "#153A2F", "#1E4A3C"]
    : ["#3A3A44", "#5A5A62", "#2A2A30", "#6E6E76", "#3A3A44"];
  return (
    <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={100} cy={292} rx={90} ry={10} />
      <rect x="14" y="60" width="172" height="6" rx="3" fill={BRASS} />
      <rect x="14" y="60" width="172" height="1.5" fill="#F3E2BC" />
      <rect x="26" y="66" width="5" height="220" fill={BRASS} />
      <rect x="169" y="66" width="5" height="220" fill={BRASS} />
      <rect x="8" y="282" width="42" height="8" rx="4" fill={BRASS} />
      <rect x="150" y="282" width="42" height="8" rx="4" fill={BRASS} />
      {garments.map((c, i) => {
        const x = 46 + i * 27;
        return (
          <g key={i}>
            <path d={`M${x} 62 q0 -8 5 -8 q5 0 5 5`} fill="none" stroke={INK} strokeOpacity="0.6" strokeWidth="1.3" />
            <path d={`M${x - 16} 80 l16 -11 l16 11 l5 130 h-42 z`} fill={c} {...STROKE} />
            <path d={`M${x} 69 l-5 32 l5 70 l5 -70 z`} fill={IVORY} opacity={accent ? 0.22 : 0.16} />
          </g>
        );
      })}
      {accent && (
        <g>
          <rect x="20" y="20" width="160" height="30" rx="2" fill={GREEN} {...STROKE} />
          <rect x="20" y="20" width="160" height="3" fill={BRASS} />
        </g>
      )}
    </svg>
  );
}

export function SpecialistCounter({ kind }: { kind: "camera" | "film" | "music" | "mic" | "pharmacy" }) {
  return (
    <svg viewBox="0 0 180 170" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={90} cy={164} rx={80} ry={8} />
      <path d="M20 90 h140 v66 h-140 z" fill={WALNUT} {...STROKE} />
      <rect x="14" y="82" width="152" height="10" fill={BRASS} {...STROKE} />
      <path d="M14 82 l14 -12 h124 l14 12 z" fill="#E9E4DA" {...STROKE} />
      {/* glass dome */}
      <path d="M50 70 q40 -56 80 0 z" fill="url(#ds-glass)" stroke={INK} strokeOpacity="0.35" />
      <g transform="translate(90 52)">
        {kind === "camera" && (
          <g fill="#1B1B1F">
            <rect x="-18" y="-10" width="36" height="24" rx="3" />
            <circle cx="0" cy="2" r="8" fill="#E2C38A" />
            <circle cx="0" cy="2" r="4" fill="#1B1B1F" />
          </g>
        )}
        {kind === "film" && (
          <g fill="#1B1B1F">
            <circle cx="-8" cy="-2" r="10" />
            <circle cx="8" cy="-2" r="10" />
            <rect x="-16" y="4" width="32" height="12" rx="2" />
            <circle cx="-8" cy="-2" r="3" fill="#E2C38A" />
            <circle cx="8" cy="-2" r="3" fill="#E2C38A" />
          </g>
        )}
        {kind === "music" && (
          <g fill="#1B1B1F">
            <path d="M-10 12 a5 5 0 1 0 0.1 0 M-5 12 v-24 l20 -6 v22 a5 5 0 1 0 0.1 0" stroke="#1B1B1F" strokeWidth="2.5" fill="none" />
            <circle cx="-10" cy="12" r="5" />
            <circle cx="10" cy="8" r="5" />
          </g>
        )}
        {kind === "mic" && (
          <g>
            <rect x="-7" y="-18" width="14" height="26" rx="7" fill="#1B1B1F" />
            <path d="M-12 0 q0 14 12 14 q12 0 12 -14" fill="none" stroke="#1B1B1F" strokeWidth="2.5" />
            <line x1="0" y1="14" x2="0" y2="22" stroke="#1B1B1F" strokeWidth="2.5" />
          </g>
        )}
        {kind === "pharmacy" && (
          <g>
            <rect x="-12" y="-16" width="24" height="34" rx="4" fill="#E9E4DA" stroke="#1B1B1F" strokeOpacity="0.5" />
            <path d="M0 -8 v18 M-9 1 h18" stroke="#1E4A3C" strokeWidth="4" />
          </g>
        )}
      </g>
    </svg>
  );
}

export function ByoDesk() {
  return (
    <svg viewBox="0 0 260 180" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={130} cy={172} rx={120} ry={10} />
      <path d="M20 96 h220 v70 h-220 z" fill={WALNUT} {...STROKE} />
      <rect x="12" y="88" width="236" height="10" fill={BRASS} {...STROKE} />
      <path d="M12 88 l16 -14 h204 l16 14 z" fill="#E9E4DA" {...STROKE} />
      <Crate x={60} y={22} label="YOURS" small />
      <Crate x={150} y={30} label="" small />
      <rect x="150" y="30" width="0" height="0" />
    </svg>
  );
}

export function Crate({ x = 0, y = 0, label = "", small = false }: { x?: number; y?: number; label?: string; small?: boolean }) {
  const w = small ? 60 : 120;
  const h = small ? 46 : 100;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 ${h * 0.2} h${w} v${h * 0.8} h-${w} z`} fill="#C9B48C" {...STROKE} />
      <path d={`M0 ${h * 0.2} l${w * 0.12} -${h * 0.2} h${w * 0.76} l${w * 0.12} ${h * 0.2} z`} fill="#D9C79F" {...STROKE} />
      <g stroke={INK} strokeOpacity="0.35" strokeWidth="1">
        <line x1={w * 0.08} y1={h * 0.2} x2={w * 0.08} y2={h} />
        <line x1={w * 0.92} y1={h * 0.2} x2={w * 0.92} y2={h} />
        <line x1="0" y1={h * 0.6} x2={w} y2={h * 0.6} />
      </g>
      {label && (
        <text
          x={w / 2}
          y={h * 0.45}
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={small ? 7 : 12}
          fontWeight="700"
          letterSpacing="1"
          fill={INK}
          fillOpacity="0.75"
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 3 — Your Wardrobe                                              */
/* ------------------------------------------------------------------ */

export function Wardrobe() {
  return (
    <svg viewBox="0 0 440 360" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={220} cy={352} rx={200} ry={12} />
      {/* open doors */}
      <path d="M92 40 l-72 -18 v300 l72 14 z" fill="url(#ds-walnut-h)" {...STROKE} />
      <path d="M348 40 l72 -18 v300 l-72 14 z" fill="url(#ds-walnut-h)" {...STROKE} />
      <g fill="none" stroke={IVORY} strokeOpacity="0.25">
        <path d="M32 40 v260" />
        <path d="M408 40 v260" />
      </g>
      {/* carcass */}
      <rect x="92" y="30" width="256" height="310" fill={WALNUT} {...STROKE} />
      <rect x="104" y="42" width="232" height="286" fill="#3F2617" />
      {/* top */}
      <path d="M84 30 h272 v-12 h-272 z" fill="#7A4E2D" {...STROKE} />
      {/* rail and garments */}
      <rect x="110" y="78" width="220" height="5" rx="2" fill={BRASS} />
      {["#153A2F", "#E9E4DA", "#4A4A52", "#8A6432", "#2A3F4A", "#5B3A22"].map((c, i) => {
        const x = 130 + i * 34;
        return (
          <g key={i}>
            <path d={`M${x} 80 q0 -7 5 -7 q5 0 5 4`} fill="none" stroke={IVORY} strokeOpacity="0.7" strokeWidth="1.3" />
            <path d={`M${x - 14} 98 l14 -10 l14 10 l4 96 h-36 z`} fill={c} {...STROKE} />
          </g>
        );
      })}
      {/* shelves with folded goods */}
      <rect x="104" y="228" width="232" height="6" fill="#7A4E2D" />
      <rect x="104" y="284" width="232" height="6" fill="#7A4E2D" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={116 + i * 56} y="246" width="44" height="12" fill={i % 2 ? "#E9E4DA" : "#153A2F"} />
          <rect x={116 + i * 56} y="258" width="44" height="12" fill={i % 2 ? "#4A4A52" : "#E9E4DA"} />
          <rect x={116 + i * 56} y="270" width="44" height="12" fill={i % 2 ? "#8A6432" : "#2A3F4A"} />
        </g>
      ))}
      {/* drawers */}
      <rect x="104" y="296" width="232" height="30" fill="#5B3A22" />
      <rect x="150" y="309" width="40" height="3" fill={BRASS} />
      <rect x="250" y="309" width="40" height="3" fill={BRASS} />
      {/* drawer labels */}
      <g fontFamily="Inter, system-ui, sans-serif" fontSize="6.5" letterSpacing="1" fill="#E2C38A">
        <text x="120" y="320">BIGQUERY</text>
        <text x="220" y="320">ALLOYDB</text>
        <text x="288" y="320">SPANNER</text>
      </g>
    </svg>
  );
}

export function DressForm() {
  return (
    <svg viewBox="0 0 160 300" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={80} cy={292} rx={52} ry={7} />
      <rect x="76" y="210" width="8" height="74" fill={BRASS} />
      <path d="M40 286 q40 -12 80 0 v5 h-80 z" fill={WALNUT} {...STROKE} />
      <rect x="72" y="52" width="16" height="20" rx="5" fill="#D9D4CA" {...STROKE} />
      <path d="M30 90 q50 -32 100 0 l-10 100 q-40 18 -80 0 z" fill={LINEN} {...STROKE} />
      <g stroke={INK} strokeOpacity="0.2" fill="none">
        <path d="M80 72 v130" />
        <path d="M34 120 q46 14 92 0" />
        <path d="M40 170 q40 12 80 0" />
      </g>
      {/* tape measure draped */}
      <path d="M36 96 q10 60 60 70 q40 8 40 40" fill="none" stroke="#E2C38A" strokeWidth="5" />
      <path d="M36 96 q10 60 60 70 q40 8 40 40" fill="none" stroke="#8A6432" strokeWidth="1" strokeDasharray="2 4" />
    </svg>
  );
}

export function MeasureBook() {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={160} cy={192} rx={150} ry={10} />
      {/* small table */}
      <path d="M30 120 h260 v14 h-260 z" fill={WALNUT} {...STROKE} />
      <rect x="44" y="134" width="8" height="52" fill={WALNUT} />
      <rect x="268" y="134" width="8" height="52" fill={WALNUT} />
      {/* open ledger */}
      <path d="M60 118 l100 -12 l100 12 v-6 l-100 -12 l-100 12 z" fill="#8A6432" />
      <path d="M62 112 l98 -12 v-56 l-98 12 z" fill="#FBF8F1" {...STROKE} />
      <path d="M258 112 l-98 -12 v-56 l98 12 z" fill="#FBF8F1" {...STROKE} />
      <g stroke={INK} strokeOpacity="0.3" strokeWidth="1">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="72" y1={62 + i * 10} x2="150" y2={52 + i * 10} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`r${i}`} x1="170" y1={52 + i * 10} x2="248" y2={62 + i * 10} />
        ))}
      </g>
      <path d="M176 58 l20 -2 M176 68 l40 -2" stroke="#B8894A" strokeWidth="2.5" />
      {/* tape measure coiled */}
      <g transform="translate(276 92)">
        <circle r="18" fill="#E2C38A" stroke="#8A6432" />
        <circle r="8" fill="#FBF8F1" stroke="#8A6432" />
        <path d="M18 0 q10 12 30 14" fill="none" stroke="#E2C38A" strokeWidth="5" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 2 — Back of House                                              */
/* ------------------------------------------------------------------ */

export function RegisterShelving() {
  return (
    <svg viewBox="0 0 480 320" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={240} cy={312} rx={220} ry={12} />
      {/* shelving behind */}
      <rect x="20" y="20" width="440" height="180" fill="#C9C7C0" {...STROKE} />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x="24" y={60 + r * 48} width="432" height="5" fill="#8A8A88" />
          {[0, 1, 2, 3, 4, 5].map((c) => (
            <g key={c}>
              <rect x={34 + c * 70} y={34 + r * 48} width="60" height="26" fill={c % 3 === 0 ? "#E9E4DA" : c % 3 === 1 ? "#D9D4CA" : "#EFEDE7"} {...STROKE} />
              <rect x={44 + c * 70} y={44 + r * 48} width="40" height="8" fill={IVORY} stroke={INK} strokeOpacity="0.25" />
            </g>
          ))}
        </g>
      ))}
      {/* counter */}
      <path d="M40 220 h400 v90 h-400 z" fill="#B9B6AE" {...STROKE} />
      <rect x="32" y="210" width="416" height="12" fill="#E9E4DA" {...STROKE} />
      <path d="M32 210 l18 -14 h380 l18 14 z" fill="#F6F2EA" {...STROKE} />
      {/* register */}
      <g transform="translate(200 120)">
        <path d="M0 80 h110 v-40 l-10 -6 h-90 l-10 6 z" fill="#2A2A30" {...STROKE} />
        <rect x="14" y="44" width="82" height="10" fill="#8A8A88" />
        <rect x="20" y="10" width="70" height="26" rx="2" fill="#1B1B1F" />
        <rect x="26" y="16" width="58" height="14" fill="#B8C8A8" />
        <rect x="42" y="0" width="26" height="12" fill="#E9E4DA" />
        <g fill="#8A8A88">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={20 + i * 20} y="60" width="14" height="4" />
          ))}
        </g>
        <rect x="112" y="46" width="6" height="34" fill={BRASS} />
      </g>
      {/* single receipt curl */}
      <path d="M244 118 q4 -20 -6 -30 q-8 -6 -4 -14" fill="none" stroke={IVORY} strokeWidth="6" />
      <path d="M244 118 q4 -20 -6 -30 q-8 -6 -4 -14" fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="1" />
    </svg>
  );
}

export function FittingRooms() {
  const rooms = [
    { x: 30, label: "GEMINI" },
    { x: 200, label: "CLAUDE" },
    { x: 370, label: "LLAMA" },
  ];
  return (
    <svg viewBox="0 0 540 340" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={270} cy={332} rx={250} ry={12} />
      {/* frame */}
      <rect x="10" y="10" width="520" height="310" fill="#DAD8D1" {...STROKE} />
      <rect x="10" y="10" width="520" height="16" fill="#8A8A88" />
      {rooms.map((r) => (
        <g key={r.label}>
          {/* cubicle interior */}
          <rect x={r.x} y="26" width="140" height="290" fill="#2A2A30" />
          {/* mirror glow */}
          <rect className="ds-mirror-glow" x={r.x} y="26" width="140" height="290" fill="url(#ds-glow)" />
          {/* mirror */}
          <rect x={r.x + 30} y="50" width="80" height="200" rx="40" fill="#8FA0A8" stroke="#E2C38A" strokeWidth="3" />
          <rect x={r.x + 36} y="56" width="68" height="188" rx="34" fill="url(#ds-glass)" />
          {/* the same outfit in every mirror */}
          <g transform={`translate(${r.x + 70} 80)`}>
            <circle cx="0" cy="0" r="12" fill="#D9D4CA" />
            <path d="M-26 22 q26 -14 52 0 l-6 70 h-40 z" fill="#153A2F" />
            <path d="M0 16 l-8 30 l8 40 l8 -40 z" fill="#F6F2EA" />
            <path d="M-20 92 h40 v54 h-14 v-40 h-12 v40 h-14 z" fill="#2A2A30" />
          </g>
          {/* label plate */}
          <rect x={r.x + 40} y="264" width="60" height="18" rx="2" fill={GREEN} />
          <text x={r.x + 70} y="277" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="600" letterSpacing="1.5" fill="#E2C38A">
            {r.label}
          </text>
          {/* rail */}
          <rect x={r.x - 2} y="26" width="144" height="4" fill={BRASS} />
          {/* curtains */}
          <g>
            <rect className="ds-curtain ds-curtain--l" x={r.x} y="30" width="72" height="286" fill={LINEN} {...STROKE} />
            <rect className="ds-curtain ds-curtain--r" x={r.x + 68} y="30" width="72" height="286" fill={LINEN} {...STROKE} />
          </g>
          {/* curtain rings */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <circle key={i} cx={r.x + 10 + i * 20} cy="28" r="3" fill="none" stroke="#8A6432" strokeWidth="1.2" />
          ))}
        </g>
      ))}
      {/* partitions */}
      <rect x="170" y="26" width="30" height="290" fill="#C9C7C0" {...STROKE} />
      <rect x="340" y="26" width="30" height="290" fill="#C9C7C0" {...STROKE} />
    </svg>
  );
}

export function QCBench() {
  return (
    <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={180} cy={232} rx={170} ry={10} />
      {/* clipboard on wall */}
      <rect x="230" y="20" width="90" height="110" fill="#E9E4DA" {...STROKE} />
      <rect x="262" y="12" width="26" height="14" rx="3" fill="#8A8A88" />
      <g stroke="#153A2F" strokeWidth="2.5" fill="none">
        <path d="M244 52 l8 8 l14 -16" />
        <path d="M244 78 l8 8 l14 -16" />
        <path d="M244 104 l8 8 l14 -16" />
      </g>
      <g stroke={INK} strokeOpacity="0.3">
        <line x1="272" y1="50" x2="308" y2="50" />
        <line x1="272" y1="76" x2="308" y2="76" />
        <line x1="272" y1="102" x2="308" y2="102" />
      </g>
      {/* bench */}
      <path d="M20 140 h320 v16 h-320 z" fill="#B9B6AE" {...STROKE} />
      <rect x="40" y="156" width="10" height="70" fill="#8A8A88" />
      <rect x="310" y="156" width="10" height="70" fill="#8A8A88" />
      {/* magnifier over a garment */}
      <path d="M70 130 l30 -20 l30 20 l6 10 h-72 z" fill="#4A4A52" {...STROKE} />
      <g>
        <circle cx="150" cy="96" r="26" fill="url(#ds-glass)" stroke="#8A6432" strokeWidth="4" />
        <line x1="170" y1="116" x2="200" y2="140" stroke="#5B3A22" strokeWidth="8" strokeLinecap="round" />
      </g>
      {/* lamp */}
      <path d="M220 140 l0 -60 l30 -20" fill="none" stroke="#8A8A88" strokeWidth="4" />
      <path d="M236 52 l28 -18 l14 22 z" fill="#E9E4DA" {...STROKE} />
      <ellipse cx="250" cy="120" rx="48" ry="10" fill="url(#ds-glow)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 1 — The Foundations                                            */
/* ------------------------------------------------------------------ */

export function LoadingBays() {
  const bays = [
    { x: 20, label: "TPU" },
    { x: 220, label: "GPU" },
  ];
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet">
      {bays.map((b) => (
        <g key={b.label}>
          <rect x={b.x} y="40" width="160" height="220" fill="#101116" stroke="#3A3A44" />
          {/* roller door slats */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <rect key={i} x={b.x + 6} y={48 + i * 22} width="148" height="18" fill={i % 2 ? "#2A2B31" : "#33343B"} />
          ))}
          {/* gap of warm light under the door */}
          <rect x={b.x + 6} y="226" width="148" height="30" fill="#0B0B0E" />
          <rect x={b.x + 6} y="226" width="148" height="6" fill="#F2B85C" opacity="0.8" />
          <rect x={b.x + 6} y="232" width="148" height="24" fill="url(#ds-pilot)" opacity="0.5" />
          {/* stencil */}
          <rect x={b.x + 40} y="10" width="80" height="24" fill="#1B1B1F" stroke="#B8894A" />
          <text x={b.x + 80} y="27" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="13" fontWeight="700" letterSpacing="4" fill="#E2C38A">
            {b.label}
          </text>
          {/* pilot light */}
          <circle cx={b.x + 150} cy="20" r="14" fill="url(#ds-pilot)" />
          <circle cx={b.x + 150} cy="20" r="3" fill="#FFD59A" />
        </g>
      ))}
      {/* ramp */}
      <path d="M0 262 h400 v14 h-400 z" fill="#2A2B31" />
      <path d="M0 276 h400 v6 h-400 z" fill="#E2C38A" opacity="0.35" />
      <g stroke="#E2C38A" strokeOpacity="0.5" strokeWidth="6" strokeDasharray="20 16">
        <line x1="0" y1="288" x2="400" y2="288" />
      </g>
    </svg>
  );
}

export function FranchiseModel() {
  return (
    <svg viewBox="0 0 260 260" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={130} cy={254} rx={110} ry={10} />
      {/* plinth */}
      <path d="M50 170 h160 v80 h-160 z" fill="#2A2B31" stroke="#3A3A44" />
      <rect x="42" y="162" width="176" height="10" fill={BRASS} />
      {/* glass case */}
      <rect x="60" y="60" width="140" height="102" fill="url(#ds-glass)" stroke="#E2C38A" strokeOpacity="0.6" />
      {/* the tiny store */}
      <g transform="translate(78 84)">
        <rect x="0" y="20" width="104" height="58" fill="#E9E4DA" stroke={INK} strokeOpacity="0.4" />
        <rect x="-6" y="14" width="116" height="8" fill="#153A2F" />
        <rect x="-4" y="6" width="112" height="8" fill={BRASS} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={8 + i * 24} y="28" width="14" height="18" fill="#FFF4DC" />
        ))}
        <rect x="44" y="54" width="16" height="24" fill="#FFF4DC" />
        <rect x="8" y="54" width="14" height="14" fill="#FFF4DC" />
        <rect x="82" y="54" width="14" height="14" fill="#FFF4DC" />
        <rect x="30" y="-4" width="44" height="10" fill="#1B1B1F" />
      </g>
      {/* glow */}
      <ellipse cx="130" cy="120" rx="70" ry="40" fill="url(#ds-glow)" opacity="0.55" />
      {/* plaque */}
      <rect x="96" y="176" width="68" height="16" fill={BRASS} />
      <text x="130" y="187" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="7" fontWeight="600" letterSpacing="1.5" fill="#2A1D10">
        FRANCHISE
      </text>
    </svg>
  );
}

export function Conveyor() {
  return (
    <svg viewBox="0 0 480 220" preserveAspectRatio="xMidYMax meet">
      {/* belt */}
      <path d="M10 130 h470 v22 h-470 z" fill="#2A2B31" stroke="#3A3A44" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <circle key={i} cx={30 + i * 38} cy="141" r="8" fill="#3A3A44" stroke="#8A8A88" />
      ))}
      <rect x="10" y="152" width="470" height="6" fill="#1B1B1F" />
      {/* legs */}
      <g fill="#3A3A44">
        <rect x="40" y="158" width="8" height="50" />
        <rect x="240" y="158" width="8" height="50" />
        <rect x="440" y="158" width="8" height="50" />
      </g>
      {/* crates heading off-frame */}
      <Crate x={70} y={40} label="MODELS" />
      <Crate x={250} y={52} label="AGENTS" small={false} />
      <g opacity="0.6">
        <Crate x={410} y={64} label="" small />
      </g>
      {/* arrow to "another mall" */}
      <path d="M400 100 h60 l-10 -8 m10 8 l-10 8" fill="none" stroke="#E2C38A" strokeWidth="2" />
      <text x="250" y="26" fontFamily="Inter, system-ui, sans-serif" fontSize="9" letterSpacing="2" fill="#E2C38A" fillOpacity="0.8">
        → ANOTHER MALL
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* The walls                                                            */
/* ------------------------------------------------------------------ */

export function SecurityDesk() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={200} cy={292} rx={180} ry={12} />
      {/* camera on pole */}
      <rect x="330" y="30" width="6" height="150" fill="#8A8A88" />
      <path d="M300 30 h50 v20 h-50 z" fill="#1B1B1F" />
      <circle cx="300" cy="40" r="9" fill="#2A2A30" stroke="#E2C38A" strokeWidth="1.5" />
      <circle cx="300" cy="40" r="3" fill="#E2C38A" />
      {/* desk */}
      <path d="M30 170 h300 v100 h-300 z" fill={GREEN} stroke="#E2C38A" strokeOpacity="0.6" />
      <rect x="22" y="160" width="316" height="12" fill={BRASS} />
      <path d="M22 160 l20 -18 h276 l20 18 z" fill="#E9E4DA" {...STROKE} />
      {/* shield */}
      <path d="M180 60 l40 12 v34 q0 30 -40 44 q-40 -14 -40 -44 v-34 z" fill={BRASS} stroke="#5B3A22" />
      <path d="M180 74 l24 8 v22 q0 18 -24 28 q-24 -10 -24 -28 v-22 z" fill={GREEN} />
      <path d="M170 104 l8 8 l16 -18" fill="none" stroke="#E2C38A" strokeWidth="3" />
      {/* monitors */}
      <rect x="60" y="112" width="70" height="40" fill="#1B1B1F" stroke="#8A8A88" />
      <rect x="66" y="118" width="58" height="28" fill="#2A3F4A" />
      <rect x="250" y="112" width="70" height="40" fill="#1B1B1F" stroke="#8A8A88" />
      <rect x="256" y="118" width="58" height="28" fill="#2A3F4A" />
    </svg>
  );
}

export function ReturnsCounter() {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={200} cy={292} rx={180} ry={12} />
      {/* sign */}
      <rect x="110" y="30" width="180" height="40" fill={GREEN} stroke="#E2C38A" strokeOpacity="0.6" />
      <rect x="110" y="30" width="180" height="3" fill={BRASS} />
      <text x="200" y="56" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="12" fontWeight="600" letterSpacing="3" fill="#E2C38A">
        RETURNS
      </text>
      <rect x="198" y="70" width="4" height="70" fill={BRASS} />
      {/* counter */}
      <path d="M30 170 h300 v100 h-300 z" fill={GREEN} stroke="#E2C38A" strokeOpacity="0.6" />
      <rect x="22" y="160" width="316" height="12" fill={BRASS} />
      <path d="M22 160 l20 -18 h276 l20 18 z" fill="#E9E4DA" {...STROKE} />
      {/* paper stack */}
      <rect x="60" y="120" width="80" height="24" fill="#FBF8F1" {...STROKE} />
      <rect x="64" y="114" width="80" height="24" fill="#FBF8F1" {...STROKE} />
      <rect x="68" y="108" width="80" height="24" fill="#FBF8F1" {...STROKE} />
      {/* stamp */}
      <rect x="250" y="100" width="40" height="18" fill="#5B3A22" />
      <rect x="264" y="80" width="12" height="22" fill="#8A6432" />
      <rect x="246" y="118" width="48" height="8" fill="#1B1B1F" />
      {/* ledger */}
      <path d="M160 132 h80 v12 h-80 z" fill="#153A2F" />
      <path d="M160 132 l6 -6 h80 l-6 6 z" fill="#1E4A3C" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Doors and concessions                                                */
/* ------------------------------------------------------------------ */

export function DockCrates() {
  return (
    <svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={180} cy={232} rx={160} ry={12} />
      {/* pallet */}
      <rect x="20" y="212" width="320" height="14" fill="#8A6432" />
      <g fill="#5B3A22">
        <rect x="30" y="212" width="12" height="14" />
        <rect x="174" y="212" width="12" height="14" />
        <rect x="318" y="212" width="12" height="14" />
      </g>
      <Crate x={30} y={110} label="YOUR MODELS" />
      <Crate x={170} y={110} label="YOUR DATA" />
      <Crate x={100} y={10} label="YOUR AGENTS" />
    </svg>
  );
}

export function AnnexCounters() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={200} cy={232} rx={180} ry={10} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${20 + i * 125} 0)`}>
          <path d="M10 140 h110 v80 h-110 z" fill={i === 1 ? GREEN : WALNUT} {...STROKE} />
          <rect x="4" y="132" width="122" height="10" fill={BRASS} />
          <path d="M4 132 l12 -12 h98 l12 12 z" fill="#E9E4DA" {...STROKE} />
          <rect x="30" y="60" width="70" height="36" rx="2" fill={i === 1 ? "#E9E4DA" : GREEN} {...STROKE} />
          <rect x="63" y="96" width="4" height="26" fill={BRASS} />
          <g fill={i === 1 ? "#153A2F" : "#E2C38A"}>
            <rect x="40" y="72" width="50" height="4" />
            <rect x="48" y="80" width="34" height="4" />
          </g>
          <rect x="24" y="106" width="20" height="14" fill="#E9E4DA" {...STROKE} />
          <rect x="86" y="104" width="24" height="16" fill="#D9D4CA" {...STROKE} />
        </g>
      ))}
    </svg>
  );
}

export function ServicesTailor() {
  return (
    <svg viewBox="0 0 300 260" preserveAspectRatio="xMidYMax meet">
      <Shadow cx={150} cy={252} rx={120} ry={10} />
      {/* a tailor's kit on a trolley */}
      <rect x="60" y="120" width="180" height="90" fill={WALNUT} {...STROKE} />
      <rect x="52" y="112" width="196" height="10" fill={BRASS} />
      <circle cx="90" cy="228" r="14" fill="#2A2A30" stroke="#8A8A88" strokeWidth="3" />
      <circle cx="210" cy="228" r="14" fill="#2A2A30" stroke="#8A8A88" strokeWidth="3" />
      {/* toolkit */}
      <rect x="90" y="70" width="120" height="42" rx="3" fill="#153A2F" {...STROKE} />
      <rect x="132" y="60" width="36" height="12" rx="4" fill={BRASS} />
      <rect x="90" y="90" width="120" height="2" fill="#E2C38A" opacity="0.6" />
      {/* tape + scissors */}
      <path d="M70 100 q20 -30 50 -6" fill="none" stroke="#E2C38A" strokeWidth="5" />
      <g stroke={INK} strokeOpacity="0.7" strokeWidth="2" fill="none">
        <line x1="220" y1="100" x2="250" y2="70" />
        <line x1="222" y1="70" x2="252" y2="100" />
        <circle cx="216" cy="104" r="4" />
        <circle cx="218" cy="66" r="4" />
      </g>
    </svg>
  );
}
