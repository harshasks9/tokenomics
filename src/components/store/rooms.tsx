/**
 * Rooms: the architecture behind each scene. Every room is a 1600×900 SVG
 * layer; several are split into back / mid / front layers for parallax.
 */

const INK = "#1B1B1F";
const IVORY = "#F6F2EA";
const BRASS = "url(#ds-brass)";
const STROKE = { stroke: INK, strokeOpacity: 0.3, strokeWidth: 1.2 } as const;

const VB = { viewBox: "0 0 1600 900", preserveAspectRatio: "none" } as const;

/* ------------------------------------------------------------------ */
/* The atrium: looking up through six galleries to the skylight         */
/* ------------------------------------------------------------------ */

export const ATRIUM_VP = { x: 800, y: 300 };

export function atriumRing(k: number) {
  const s = Math.pow(0.76, k - 1);
  const w = 1000 * s;
  const h = 0.56 * w;
  const t = 62 * s;
  return {
    x: ATRIUM_VP.x - w,
    y: ATRIUM_VP.y - h,
    w: 2 * w,
    h: 2 * h,
    t,
    bottom: ATRIUM_VP.y + h,
  };
}

export function AtriumRings() {
  const rings = [1, 2, 3, 4, 5, 6].map(atriumRing);
  const sky = atriumRing(7);
  return (
    <svg {...VB} aria-hidden="true">
      <defs>
        <radialGradient id="atrium-light" cx="0.5" cy="0.33" r="0.6">
          <stop offset="0" stopColor="#FFF4DC" />
          <stop offset="0.35" stopColor="#F6F2EA" />
          <stop offset="1" stopColor="#D9D4CA" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#atrium-light)" />
      {/* corner columns converging on the skylight */}
      <g stroke="#B8894A" strokeOpacity="0.35" strokeWidth="2">
        <line x1={rings[0].x} y1={rings[0].y} x2={sky.x} y2={sky.y} />
        <line x1={rings[0].x + rings[0].w} y1={rings[0].y} x2={sky.x + sky.w} y2={sky.y} />
        <line x1={rings[0].x} y1={rings[0].y + rings[0].h} x2={sky.x} y2={sky.y + sky.h} />
        <line x1={rings[0].x + rings[0].w} y1={rings[0].y + rings[0].h} x2={sky.x + sky.w} y2={sky.y + sky.h} />
      </g>
      {rings.map((r, i) => (
        <g key={i}>
          {/* balcony front: a thick ring */}
          <path
            d={`M${r.x} ${r.y} h${r.w} v${r.h} h-${r.w} z M${r.x + r.t} ${r.y + r.t} v${r.h - 2 * r.t} h${r.w - 2 * r.t} v-${r.h - 2 * r.t} z`}
            fill={i % 2 ? "#EDE7DB" : "#F1ECE2"}
            fillRule="evenodd"
            stroke="#1B1B1F"
            strokeOpacity="0.18"
          />
          {/* shadow under the balcony (outer bottom edge) */}
          <rect x={r.x} y={r.y + r.h} width={r.w} height={r.t * 0.7} fill="url(#ds-fade-down)" opacity="0.14" />
          {/* brass rail along the inner edge */}
          <rect
            x={r.x + r.t}
            y={r.y + r.t}
            width={r.w - 2 * r.t}
            height={r.h - 2 * r.t}
            fill="none"
            stroke="url(#ds-brass)"
            strokeWidth={Math.max(2, 6 * Math.pow(0.8, i))}
          />
          {/* balusters on the bottom edge */}
          <g stroke="#B8894A" strokeOpacity="0.45" strokeWidth={Math.max(1, 2 * Math.pow(0.8, i))}>
            {Array.from({ length: 24 }).map((_, b) => {
              const x = r.x + r.t + ((r.w - 2 * r.t) / 24) * (b + 0.5);
              return <line key={b} x1={x} y1={r.y + r.h - r.t} x2={x} y2={r.y + r.h - r.t * 0.35} />;
            })}
          </g>
        </g>
      ))}
      {/* the skylight */}
      <rect x={sky.x} y={sky.y} width={sky.w} height={sky.h} fill="#FFF4DC" />
      <g stroke="#B8894A" strokeOpacity="0.5" strokeWidth="2">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={`v${f}`} x1={sky.x + sky.w * f} y1={sky.y} x2={sky.x + sky.w * f} y2={sky.y + sky.h} />
        ))}
        {[0.33, 0.66].map((f) => (
          <line key={`h${f}`} x1={sky.x} y1={sky.y + sky.h * f} x2={sky.x + sky.w} y2={sky.y + sky.h * f} />
        ))}
      </g>
      <rect x={sky.x} y={sky.y} width={sky.w} height={sky.h} fill="none" stroke="url(#ds-brass)" strokeWidth="5" />
      {/* light pouring down */}
      <path
        d={`M${sky.x} ${sky.y + sky.h} L${rings[0].x + 200} 900 L${rings[0].x + rings[0].w - 200} 900 L${sky.x + sky.w} ${sky.y + sky.h} z`}
        fill="url(#ds-daylight)"
        opacity="0.35"
      />
      {/* marble floor at the bottom with a faint reflection */}
      <rect x="0" y="840" width="1600" height="60" fill="url(#ds-marble)" />
      <rect x="0" y="838" width="1600" height="3" fill="#B8894A" opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Escalator                                                            */
/* ------------------------------------------------------------------ */

export function EscalatorFloors({ dark = false }: { dark?: boolean }) {
  // Tall layer: 1600×1800 (200% of the stage), floors every 300 units.
  const slabs = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg viewBox="0 0 1600 1800" preserveAspectRatio="none" aria-hidden="true">
      <rect width="1600" height="1800" fill={dark ? "#17181c" : "#F1ECE2"} />
      {slabs.map((i) => {
        const y = i * 300;
        return (
          <g key={i}>
            <rect x="0" y={y} width="1600" height="260" fill={dark ? "#1d1e24" : "#EDE7DB"} />
            {/* balcony/slab */}
            <rect x="0" y={y + 260} width="1600" height="40" fill={dark ? "#26272e" : "#E2DCCF"} />
            <rect x="0" y={y + 256} width="1600" height="5" fill={BRASS} />
            <rect x="0" y={y + 300} width="1600" height="24" fill="url(#ds-fade-down)" opacity={dark ? 0.5 : 0.16} />
            {/* gallery rail */}
            <g stroke="#B8894A" strokeOpacity="0.5" strokeWidth="2">
              {Array.from({ length: 40 }).map((_, b) => (
                <line key={b} x1={b * 40 + 20} y1={y + 214} x2={b * 40 + 20} y2={y + 256} />
              ))}
              <line x1="0" y1={y + 212} x2="1600" y2={y + 212} strokeWidth="4" />
            </g>
            {/* signage blanks on the far wall */}
            <rect x="700" y={y + 90} width="200" height="40" fill={dark ? "#0F2C24" : "#153A2F"} opacity="0.9" />
            <rect x="700" y={y + 90} width="200" height="3" fill={BRASS} />
          </g>
        );
      })}
    </svg>
  );
}

export function EscalatorFront({ dark = false }: { dark?: boolean }) {
  // The escalator itself: a diagonal run of steps with brass handrails.
  const steps = Array.from({ length: 14 });
  return (
    <svg {...VB} aria-hidden="true">
      {/* balustrade glass */}
      <path d="M200 900 L1000 180 L1140 180 L340 900 z" fill="url(#ds-glass)" opacity="0.7" />
      <path d="M200 900 L1000 180 L1140 180 L340 900 z" fill="none" stroke={INK} strokeOpacity="0.2" />
      {/* steps */}
      {steps.map((_, i) => {
        const x = 260 + i * 56;
        const y = 850 - i * 50;
        return (
          <g key={i}>
            <path d={`M${x} ${y} h120 v-18 h-120 z`} fill={dark ? "#2a2b31" : "#D9D4CA"} stroke={INK} strokeOpacity="0.3" />
            <path d={`M${x} ${y - 18} l12 -12 h120 l-12 12 z`} fill={dark ? "#3a3b42" : "#E9E4DA"} stroke={INK} strokeOpacity="0.25" />
            <line x1={x + 4} y1={y - 9} x2={x + 116} y2={y - 9} stroke="#B8894A" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="6 6" />
          </g>
        );
      })}
      {/* handrails */}
      <path d="M180 880 L980 160" fill="none" stroke="url(#ds-brass)" strokeWidth="14" strokeLinecap="round" />
      <path d="M180 880 L980 160" fill="none" stroke="#F3E2BC" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M360 900 L1160 180" fill="none" stroke="url(#ds-brass)" strokeWidth="14" strokeLinecap="round" />
      <path d="M360 900 L1160 180" fill="none" stroke="#F3E2BC" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Floor rooms                                                          */
/* ------------------------------------------------------------------ */

function MarbleFloor({ y = 620, dark = false }: { y?: number; dark?: boolean }) {
  return (
    <g>
      <rect x="0" y={y} width="1600" height={900 - y} fill={dark ? "url(#ds-marble-dark)" : "url(#ds-marble)"} />
      <rect x="0" y={y - 2} width="1600" height="4" fill={dark ? "#3a3b42" : "#C9C3B6"} />
      {/* marble veining */}
      {!dark && (
        <g stroke="#1B1B1F" strokeOpacity="0.05" fill="none" strokeWidth="1.5">
          <path d={`M0 ${y + 60} q300 -30 600 10 t700 -20 t300 30`} />
          <path d={`M100 ${y + 180} q400 40 800 -10 t700 20`} />
          <path d={`M-50 ${y + 250} q500 -60 900 10 t800 -30`} />
        </g>
      )}
      {/* soft reflection strip */}
      <rect x="0" y={y} width="1600" height={120} fill="url(#ds-fade-down)" opacity={dark ? 0.25 : 0.08} />
    </g>
  );
}

export function StorefrontRoom() {
  return (
    <svg {...VB} aria-hidden="true">
      <rect width="1600" height="900" fill="#F1ECE2" />
      {/* back wall panels */}
      <rect x="0" y="0" width="1600" height="620" fill="#EDE7DB" />
      <rect x="0" y="80" width="1600" height="8" fill="#E2DCCF" />
      {/* tall arched windows with daylight */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 130 + i * 300;
        return (
          <g key={i}>
            <path d={`M${x} 560 v-330 a90 90 0 0 1 180 0 v330 z`} fill="#FFFFFF" opacity="0.9" />
            <path d={`M${x} 560 v-330 a90 90 0 0 1 180 0 v330 z`} fill="none" stroke="#1B1B1F" strokeOpacity="0.25" strokeWidth="6" />
            <line x1={x + 90} y1="140" x2={x + 90} y2="560" stroke="#1B1B1F" strokeOpacity="0.2" strokeWidth="4" />
            <line x1={x} y1="330" x2={x + 180} y2="330" stroke="#1B1B1F" strokeOpacity="0.2" strokeWidth="4" />
            <line x1={x} y1="450" x2={x + 180} y2="450" stroke="#1B1B1F" strokeOpacity="0.2" strokeWidth="4" />
            {/* light shaft onto the floor */}
            <path d={`M${x + 10} 560 L${x - 120} 900 L${x + 300} 900 L${x + 170} 560 z`} fill="url(#ds-daylight)" opacity="0.35" />
          </g>
        );
      })}
      {/* cornice */}
      <rect x="0" y="60" width="1600" height="12" fill="#D9D4CA" />
      <MarbleFloor y={620} />
    </svg>
  );
}

export function TailoringRoom() {
  const bolts = ["#153A2F", "#5B3A22", "#2A3F4A", "#8A6432", "#4A4A52", "#1E4A3C", "#3A3A44"];
  return (
    <svg {...VB} aria-hidden="true">
      <rect width="1600" height="900" fill="#EDE4D3" />
      {/* walnut panelled back wall */}
      <rect x="0" y="0" width="1600" height="640" fill="#E6DCC9" />
      <rect x="0" y="400" width="1600" height="240" fill="url(#ds-walnut)" opacity="0.92" />
      <rect x="0" y="392" width="1600" height="10" fill="#8B5E3C" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={i * 200 + 8} y="410" width="184" height="216" fill="none" stroke="#3F2617" strokeOpacity="0.5" strokeWidth="3" />
      ))}
      {/* shelves of fabric bolts, left */}
      <rect x="60" y="60" width="320" height="330" fill="#5B3A22" />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x="60" y={150 + r * 100} width="320" height="8" fill="#3F2617" />
          {bolts.slice(0, 6).map((c, i) => (
            <g key={i}>
              <rect x={70 + i * 52} y={90 + r * 100} width="42" height="60" rx="4" fill={c} />
              <ellipse cx={91 + i * 52} cy={90 + r * 100} rx="21" ry="7" fill="#E9E4DA" opacity="0.5" />
            </g>
          ))}
        </g>
      ))}
      {/* warm window, right */}
      <rect x="1380" y="90" width="160" height="260" fill="#FFF4DC" />
      <rect x="1380" y="90" width="160" height="260" fill="none" stroke="#5B3A22" strokeWidth="8" />
      <line x1="1460" y1="90" x2="1460" y2="350" stroke="#5B3A22" strokeWidth="6" />
      <line x1="1380" y1="220" x2="1540" y2="220" stroke="#5B3A22" strokeWidth="6" />
      <path d="M1390 350 L1280 900 L1700 900 L1530 350 z" fill="url(#ds-daylight)" opacity="0.3" />
      {/* pattern pieces pinned to the wall */}
      <g fill="#FBF8F1" stroke="#1B1B1F" strokeOpacity="0.35">
        <path d="M1180 120 l60 -20 l20 60 l-50 30 z" />
        <path d="M420 250 l70 -10 l-10 80 l-60 -10 z" />
      </g>
      {/* wooden plank floor */}
      <rect x="0" y="640" width="1600" height="260" fill="#C9A77A" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x="0" y={640 + i * 38} width="1600" height="2" fill="#8B5E3C" opacity="0.5" />
      ))}
      <rect x="0" y="640" width="1600" height="90" fill="url(#ds-fade-down)" opacity="0.1" />
    </svg>
  );
}

export function ModelHall() {
  const lamps = [0, 1, 2, 3, 4, 5];
  return (
    <svg {...VB} aria-hidden="true">
      <rect width="1600" height="900" fill="#CFC9BC" />
      {/* far wall */}
      <rect x="500" y="380" width="600" height="240" fill="#B9B3A5" />
      {/* side walls, converging */}
      <path d="M0 0 L500 380 L500 620 L0 900 z" fill="#C4BEB0" />
      <path d="M1600 0 L1100 380 L1100 620 L1600 900 z" fill="#C4BEB0" />
      {/* ceiling */}
      <path d="M0 0 L500 380 L1100 380 L1600 0 z" fill="#B0AA9C" />
      {/* floor */}
      <path d="M0 900 L500 620 L1100 620 L1600 900 z" fill="url(#ds-marble)" />
      <path d="M0 900 L500 620 L1100 620 L1600 900 z" fill="url(#ds-fade-down)" opacity="0.1" />
      {/* perspective lines on the floor */}
      <g stroke="#1B1B1F" strokeOpacity="0.08" strokeWidth="1.5">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const fx = 500 + i * 100;
          const bx = -400 + i * 400;
          return <line key={i} x1={fx} y1="620" x2={bx} y2="900" />;
        })}
        {[0.25, 0.5, 0.75].map((f) => {
          const y = 620 + 280 * f;
          const xl = 500 - 500 * f;
          return <line key={f} x1={xl} y1={y} x2={1600 - xl} y2={y} />;
        })}
      </g>
      {/* ceiling spot lamps receding */}
      {lamps.map((i) => {
        const f = i / lamps.length;
        const y = 380 - 380 * f * 0.9;
        const xl = 500 - 500 * f;
        return (
          <g key={i}>
            {[0.2, 0.8].map((c) => {
              const x = xl + (1600 - 2 * xl) * c;
              const r = 8 + 14 * f;
              return (
                <g key={c}>
                  <circle cx={x} cy={y} r={r} fill="#1B1B1F" />
                  <circle cx={x} cy={y} r={r * 0.6} fill="#FFF4DC" />
                </g>
              );
            })}
          </g>
        );
      })}
      {/* far wall sign band */}
      <rect x="560" y="300" width="480" height="60" fill="#153A2F" />
      <rect x="560" y="300" width="480" height="4" fill={BRASS} />
      <rect x="560" y="356" width="480" height="4" fill={BRASS} />
      <line x1="640" y1="300" x2="660" y2="140" stroke="#B8894A" strokeWidth="2" />
      <line x1="960" y1="300" x2="940" y2="140" stroke="#B8894A" strokeWidth="2" />
      {/* columns */}
      {[0.15, 0.4, 0.7].map((f) => {
        const xl = 500 - 500 * f;
        const yTop = 380 - 380 * f;
        const yBot = 620 + 280 * f;
        return (
          <g key={f}>
            <rect x={xl - 10} y={yTop} width="20" height={yBot - yTop} fill="#D9D4CA" stroke="#1B1B1F" strokeOpacity="0.2" />
            <rect x={1600 - xl - 10} y={yTop} width="20" height={yBot - yTop} fill="#D9D4CA" stroke="#1B1B1F" strokeOpacity="0.2" />
          </g>
        );
      })}
    </svg>
  );
}

export function WardrobeRoom() {
  return (
    <svg {...VB} aria-hidden="true">
      <rect width="1600" height="900" fill="#EFE8DC" />
      {/* wallpaper */}
      <rect x="0" y="0" width="1600" height="640" fill="#EAE2D3" />
      {Array.from({ length: 40 }).map((_, i) => (
        <rect key={i} x={i * 40} y="0" width="20" height="640" fill="#E4DBCB" />
      ))}
      {/* picture rail */}
      <rect x="0" y="120" width="1600" height="6" fill="#B8894A" opacity="0.6" />
      {/* window with linen curtains, right */}
      <rect x="1210" y="230" width="260" height="320" fill="#FFF4DC" />
      <rect x="1210" y="230" width="260" height="320" fill="none" stroke="#5B3A22" strokeWidth="6" />
      <line x1="1340" y1="230" x2="1340" y2="550" stroke="#5B3A22" strokeWidth="4" />
      <path d="M1180 220 h56 v340 q-28 10 -56 0 z" fill="url(#ds-linen)" stroke="#1B1B1F" strokeOpacity="0.25" />
      <path d="M1444 220 h56 v340 q-28 10 -56 0 z" fill="url(#ds-linen)" stroke="#1B1B1F" strokeOpacity="0.25" />
      <rect x="1170" y="216" width="340" height="8" fill={BRASS} />
      <path d="M1220 550 L1080 900 L1600 900 L1600 550 z" fill="url(#ds-daylight)" opacity="0.3" />
      {/* a framed picture */}
      <rect x="180" y="200" width="160" height="120" fill="#FBF8F1" stroke="#5B3A22" strokeWidth="8" />
      <path d="M200 300 l40 -50 l30 30 l30 -40 l20 60 z" fill="#153A2F" opacity="0.5" />
      {/* skirting */}
      <rect x="0" y="628" width="1600" height="14" fill="#D9CFBC" />
      {/* floorboards */}
      <rect x="0" y="640" width="1600" height="260" fill="#D2B48C" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x="0" y={640 + i * 38} width="1600" height="2" fill="#8B5E3C" opacity="0.4" />
      ))}
      {/* rug */}
      <path d="M260 700 h700 v170 h-700 z" fill="#153A2F" opacity="0.55" />
      <path d="M280 716 h660 v138 h-660 z" fill="none" stroke="#B8894A" strokeWidth="3" />
      <rect x="0" y="640" width="1600" height="90" fill="url(#ds-fade-down)" opacity="0.08" />
    </svg>
  );
}

export function BackOfHouseRoom() {
  return (
    <svg {...VB} aria-hidden="true">
      <rect width="1600" height="900" fill="#E4E3DD" />
      <rect x="0" y="0" width="1600" height="640" fill="#DEDDD6" />
      {/* tiled dado */}
      <rect x="0" y="420" width="1600" height="220" fill="#D2D1C9" />
      {Array.from({ length: 32 }).map((_, i) => (
        <rect key={i} x={i * 50} y="420" width="48" height="220" fill="none" stroke="#C4C3BB" />
      ))}
      <rect x="0" y="418" width="1600" height="4" fill="#B0AFA7" />
      {/* fluorescent tubes on the ceiling */}
      {[0, 1, 2].map((i) => {
        const x = 200 + i * 460;
        return (
          <g key={i}>
            <rect x={x} y="40" width="320" height="18" rx="9" fill="#FFFFFF" />
            <rect x={x} y="40" width="320" height="18" rx="9" fill="none" stroke="#8A8A88" />
            <ellipse cx={x + 160} cy="60" rx="240" ry="90" fill="url(#ds-glow)" opacity="0.5" />
          </g>
        );
      })}
      {/* STAFF ONLY swing door, left */}
      <rect x="120" y="180" width="200" height="460" fill="#9A9A96" stroke="#1B1B1F" strokeOpacity="0.4" />
      <rect x="136" y="196" width="168" height="428" fill="#B0AFA7" />
      <circle cx="220" cy="300" r="36" fill="#E9E4DA" stroke="#1B1B1F" strokeOpacity="0.3" strokeWidth="4" />
      <rect x="170" y="380" width="100" height="6" fill="#8A8A88" />
      <rect x="152" y="220" width="136" height="34" fill="#1B1B1F" />
      <text x="220" y="243" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="700" letterSpacing="3" fill="#F6F2EA">
        STAFF ONLY
      </text>
      {/* pipes */}
      <rect x="0" y="90" width="1600" height="10" fill="#B0AFA7" />
      <rect x="0" y="108" width="1600" height="6" fill="#C4C3BB" />
      {/* concrete floor with a yellow safety line */}
      <rect x="0" y="640" width="1600" height="260" fill="#C9C8C1" />
      <rect x="0" y="640" width="1600" height="90" fill="url(#ds-fade-down)" opacity="0.12" />
      <rect x="0" y="860" width="1600" height="6" fill="#E2C38A" opacity="0.6" />
    </svg>
  );
}

export function FoundationsRoom() {
  return (
    <svg {...VB} aria-hidden="true">
      <rect width="1600" height="900" fill="#141519" />
      {/* concrete wall */}
      <rect x="0" y="0" width="1600" height="660" fill="#191a1f" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={i * 200} y="0" width="200" height="660" fill="none" stroke="#22232a" />
      ))}
      {/* ducts */}
      <rect x="0" y="40" width="1600" height="60" rx="30" fill="#26272e" stroke="#33343b" />
      <rect x="0" y="120" width="1600" height="30" rx="15" fill="#2c2d34" stroke="#3a3b42" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={i * 200 + 90} y="34" width="20" height="72" rx="4" fill="#33343b" />
      ))}
      {/* vertical pipes */}
      <rect x="1240" y="150" width="16" height="510" fill="#2c2d34" />
      <rect x="1290" y="150" width="10" height="510" fill="#33343b" />
      {/* pilot lights along the wall */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i}>
          <circle cx={120 + i * 230} cy="200" r="34" fill="url(#ds-pilot)" />
          <circle cx={120 + i * 230} cy="200" r="4" fill="#FFD59A" />
        </g>
      ))}
      {/* service stair, far left */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={20 + i * 26} y={360 + i * 46} width="140" height="14" fill="#26272e" stroke="#3a3b42" />
      ))}
      <rect x="10" y="330" width="6" height="320" fill="#B8894A" opacity="0.7" />
      {/* floor */}
      <rect x="0" y="660" width="1600" height="240" fill="#1d1e24" />
      <rect x="0" y="658" width="1600" height="3" fill="#33343b" />
      {Array.from({ length: 17 }).map((_, i) => (
        <line key={i} x1={i * 100} y1="660" x2={i * 100 - 60} y2="900" stroke="#26272e" />
      ))}
      <rect x="0" y="660" width="1600" height="100" fill="url(#ds-fade-down)" opacity="0.35" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Ground floor: dock, annex, exit doors                                */
/* ------------------------------------------------------------------ */

export function DoorsRoom() {
  return (
    <svg {...VB} aria-hidden="true">
      <rect width="1600" height="900" fill="#F1ECE2" />
      <rect x="0" y="0" width="1600" height="640" fill="#EDE7DB" />
      <rect x="0" y="60" width="1600" height="12" fill="#D9D4CA" />
      {/* loading dock, left */}
      <rect x="90" y="150" width="380" height="490" fill="#0e0f12" />
      <rect x="80" y="130" width="400" height="40" rx="10" fill="#8A8A88" stroke="#1B1B1F" strokeOpacity="0.4" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="100" y={172 + i * 14} width="360" height="10" fill="#B0AFA7" />
      ))}
      {/* truck outside the dock */}
      <g transform="translate(150 300)">
        <rect x="0" y="80" width="200" height="180" fill="#2a2b31" />
        <rect x="200" y="140" width="70" height="120" fill="#33343b" />
        <rect x="212" y="150" width="46" height="40" fill="#FFF4DC" opacity="0.7" />
        <circle cx="50" cy="270" r="22" fill="#1B1B1F" stroke="#8A8A88" strokeWidth="4" />
        <circle cx="230" cy="270" r="22" fill="#1B1B1F" stroke="#8A8A88" strokeWidth="4" />
        <ellipse cx="140" cy="110" rx="120" ry="50" fill="url(#ds-glow)" opacity="0.25" />
      </g>
      <rect x="80" y="640" width="400" height="20" fill="#E2C38A" opacity="0.5" />
      {/* annex, glass box, centre */}
      <rect x="560" y="200" width="520" height="440" fill="url(#ds-glass)" />
      <rect x="560" y="200" width="520" height="440" fill="none" stroke="#153A2F" strokeWidth="10" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={560 + (i + 1) * 104} y1="200" x2={560 + (i + 1) * 104} y2="640" stroke="#153A2F" strokeWidth="4" />
      ))}
      <line x1="560" y1="420" x2="1080" y2="420" stroke="#153A2F" strokeWidth="4" />
      <rect x="560" y="176" width="520" height="30" fill="#153A2F" />
      <rect x="560" y="176" width="520" height="4" fill={BRASS} />
      {/* exit doors, right: frame, street beyond, two leaves */}
      <rect x="1160" y="140" width="320" height="500" fill="#153A2F" />
      <g className="ds-doors__street">
        <rect x="1180" y="160" width="280" height="480" fill="#0e0f12" />
        {/* street beyond the door */}
        <rect x="1180" y="520" width="280" height="120" fill="#16171c" />
        <rect x="1300" y="220" width="8" height="300" fill="#2a2b31" />
        <rect x="1288" y="200" width="32" height="26" rx="4" fill="#2a2b31" stroke="#B8894A" strokeOpacity="0.6" />
        <rect x="1293" y="205" width="22" height="16" fill="#FFF4DC" />
        <ellipse cx="1304" cy="214" rx="120" ry="90" fill="url(#ds-glow)" opacity="0.5" />
        <g fill="#1d1e24">
          <rect x="1180" y="300" width="80" height="220" />
          <rect x="1380" y="260" width="80" height="260" />
        </g>
        <g fill="#FFF4DC" opacity="0.7">
          <rect x="1196" y="330" width="16" height="20" />
          <rect x="1230" y="330" width="16" height="20" />
          <rect x="1396" y="300" width="16" height="20" />
          <rect x="1430" y="340" width="16" height="20" />
        </g>
      </g>
      {/* door leaves */}
      <g className="ds-doors__leaf ds-doors__leaf--l">
        <rect x="1180" y="160" width="140" height="480" fill="url(#ds-glass)" stroke="#B8894A" strokeWidth="6" />
        <rect x="1300" y="380" width="8" height="60" rx="4" fill={BRASS} />
        <line x1="1250" y1="160" x2="1250" y2="640" stroke="#B8894A" strokeWidth="3" />
      </g>
      <g className="ds-doors__leaf ds-doors__leaf--r">
        <rect x="1320" y="160" width="140" height="480" fill="url(#ds-glass)" stroke="#B8894A" strokeWidth="6" />
        <rect x="1332" y="380" width="8" height="60" rx="4" fill={BRASS} />
        <line x1="1390" y1="160" x2="1390" y2="640" stroke="#B8894A" strokeWidth="3" />
      </g>
      <rect x="1160" y="120" width="320" height="24" fill="#153A2F" />
      <rect x="1160" y="120" width="320" height="4" fill={BRASS} />
      <MarbleFloor y={640} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Footer street                                                        */
/* ------------------------------------------------------------------ */

export function StreetFooter() {
  return (
    <svg viewBox="0 0 1200 375" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <rect width="1200" height="375" fill="#0e0f12" />
      <rect x="0" y="330" width="1200" height="45" fill="url(#ds-marble-dark)" />
      {/* store façade, small */}
      <rect x="300" y="60" width="600" height="270" fill="#1a1b21" stroke="#2c2d34" />
      <path d="M340 30 h520 l10 34 h-540 z" fill="#153A2F" stroke="#B8894A" strokeOpacity="0.7" />
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <rect key={`${r}${c}`} x={324 + c * 115} y={80 + r * 44} width="80" height="28" fill="url(#ds-window)" opacity={(r + c) % 4 === 0 ? 0.3 : 0.8} />
        )),
      )}
      <rect x="560" y="270" width="80" height="60" fill="#FFF4DC" opacity="0.9" />
      <rect x="330" y="270" width="200" height="60" fill="url(#ds-window)" opacity="0.7" />
      <rect x="670" y="270" width="200" height="60" fill="url(#ds-window)" opacity="0.7" />
      <g opacity="0.2" transform="translate(0 660) scale(1 -1)">
        <rect x="560" y="270" width="80" height="60" fill="#FFF4DC" />
        <rect x="330" y="270" width="200" height="60" fill="url(#ds-window)" />
        <rect x="670" y="270" width="200" height="60" fill="url(#ds-window)" />
      </g>
      {[120, 1080].map((x) => (
        <g key={x}>
          <rect x={x - 2} y="220" width="4" height="110" fill="#2a2b31" />
          <rect x={x - 9} y="206" width="18" height="16" rx="2" fill="#2a2b31" stroke="#B8894A" strokeOpacity="0.6" />
          <rect x={x - 6} y="209" width="12" height="10" fill="#FFF4DC" />
          <ellipse cx={x} cy="216" rx="60" ry="40" fill="url(#ds-glow)" opacity="0.35" />
        </g>
      ))}
      <rect x="0" y="0" width="1200" height="375" fill="none" />
      <text x="600" y="52" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontSize="11" fontWeight="600" letterSpacing="4" fill="#E2C38A">
        THE DEPARTMENT STORE FOR AI
      </text>
      <rect width="1200" height="375" fill="none" stroke={IVORY} strokeOpacity="0" />
    </svg>
  );
}

export { STROKE as ROOM_STROKE };
