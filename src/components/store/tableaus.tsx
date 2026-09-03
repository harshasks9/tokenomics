/**
 * Small SVG tableaus: the six window displays on the night street and the
 * three shops across the road.
 */

const INK = "#1B1B1F";
const IVORY = "#F6F2EA";
const BRASS = "#B8894A";
const BRASS_L = "#E2C38A";
const GREEN = "#1E4A3C";
const CREAM = "#FFF4DC";

function Plinth({ y = 118 }: { y?: number }) {
  return (
    <g>
      <rect x="20" y={y} width="160" height="10" fill="url(#ds-walnut)" />
      <rect x="20" y={y} width="160" height="2" fill={BRASS} />
      <ellipse cx="100" cy={y + 22} rx="70" ry="8" fill="url(#ds-shadow)" />
    </g>
  );
}

export function VitrineTableau({ id }: { id: string }) {
  switch (id) {
    case "choice":
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <Plinth />
          {/* five different items on one shelf */}
          <g>
            <path d="M34 118 v-30 h20 v30" fill="#153A2F" />
            <path d="M28 88 h32 l-4 -8 h-24 z" fill="#153A2F" />
            <rect x="66" y="98" width="24" height="20" rx="3" fill="#5B3A22" />
            <path d="M66 98 q12 -14 24 0" fill="none" stroke="#5B3A22" strokeWidth="3" />
            <rect x="102" y="80" width="16" height="38" rx="8" fill="#2A3F4A" />
            <rect x="106" y="74" width="8" height="8" fill="#2A3F4A" />
            <circle cx="140" cy="104" r="12" fill={BRASS} />
            <circle cx="140" cy="104" r="7" fill={IVORY} />
            <rect x="158" y="96" width="18" height="22" fill={IVORY} stroke={INK} strokeOpacity="0.5" />
            <path d="M160 96 l7 -10 h4 l7 10" fill={IVORY} stroke={INK} strokeOpacity="0.5" />
          </g>
          <rect x="88" y="26" width="24" height="12" fill={GREEN} />
          <text x="100" y="35" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="6" fontWeight="600" letterSpacing="1" fill={BRASS_L}>
            ONE TILL
          </text>
          <line x1="100" y1="38" x2="100" y2="62" stroke={BRASS} />
          <path d="M84 62 h32 v14 h-32 z" fill="#2A2A30" />
          <rect x="88" y="54" width="24" height="8" fill="#B8C8A8" />
        </svg>
      );
    case "optionality":
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <Plinth />
          <rect x="30" y="34" width="140" height="4" rx="2" fill={BRASS} />
          {[0, 1].map((i) => {
            const x = i ? 128 : 72;
            return (
              <g key={i}>
                <path d={`M${x} 34 q0 -8 5 -8 q5 0 5 5`} fill="none" stroke={INK} strokeOpacity="0.7" />
                <path d={`M${x - 22} 52 l22 -12 l22 12 l6 60 h-56 z`} fill={i ? "#4A4A52" : "#153A2F"} stroke={INK} strokeOpacity="0.4" />
              </g>
            );
          })}
          <path d="M80 130 q20 -30 40 0" fill="none" stroke={BRASS_L} strokeWidth="2" markerEnd="url(#ds-arrow)" />
          <path d="M116 126 l4 4 l-6 2" fill="none" stroke={BRASS_L} strokeWidth="2" />
          <path d="M84 126 l-4 4 l6 2" fill="none" stroke={BRASS_L} strokeWidth="2" />
        </svg>
      );
    case "economics":
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <Plinth />
          {/* price tags on strings, all the same shape */}
          {[0, 1, 2, 3].map((i) => {
            const x = 40 + i * 40;
            const y = 50 + (i % 2) * 14;
            return (
              <g key={i}>
                <line x1={x + 12} y1="18" x2={x + 12} y2={y} stroke={BRASS} />
                <path d={`M${x} ${y} h24 l6 8 v30 h-30 z`} fill={IVORY} stroke={INK} strokeOpacity="0.4" />
                <circle cx={x + 12} cy={y + 6} r="1.5" fill={INK} />
                <line x1={x + 5} y1={y + 20} x2={x + 25} y2={y + 20} stroke={INK} strokeOpacity="0.5" strokeDasharray="2 2" />
                <line x1={x + 5} y1={y + 28} x2={x + 20} y2={y + 28} stroke={INK} strokeOpacity="0.5" strokeDasharray="2 2" />
              </g>
            );
          })}
          {/* the factory silhouette */}
          <path d="M28 118 v-18 l12 8 v-8 l12 8 v-8 l12 8 v10 z" fill="#153A2F" />
          <rect x="30" y="88" width="6" height="14" fill="#153A2F" />
          <path d="M150 118 v-12 l14 -10 v22 z" fill="#2A2A30" />
        </svg>
      );
    case "velocity":
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <Plinth />
          {/* delivery trolley with boxes, motion lines */}
          <g transform="translate(60 40)">
            <rect x="10" y="40" width="70" height="8" fill="#8A8A88" />
            <rect x="80" y="0" width="6" height="48" fill="#8A8A88" />
            <circle cx="22" cy="58" r="8" fill="#2A2A30" stroke="#8A8A88" strokeWidth="2" />
            <circle cx="68" cy="58" r="8" fill="#2A2A30" stroke="#8A8A88" strokeWidth="2" />
            <rect x="14" y="14" width="30" height="26" fill="#D9C79F" stroke={INK} strokeOpacity="0.4" />
            <rect x="46" y="20" width="30" height="20" fill="#C9B48C" stroke={INK} strokeOpacity="0.4" />
            <rect x="26" y="-6" width="30" height="20" fill="#D9C79F" stroke={INK} strokeOpacity="0.4" />
          </g>
          <g stroke={BRASS_L} strokeOpacity="0.7" strokeWidth="2">
            <line x1="28" y1="70" x2="50" y2="70" />
            <line x1="20" y1="82" x2="48" y2="82" />
            <line x1="32" y1="94" x2="50" y2="94" />
          </g>
          <rect x="150" y="30" width="30" height="34" fill={IVORY} stroke={INK} strokeOpacity="0.5" />
          <rect x="150" y="30" width="30" height="8" fill="#153A2F" />
          <text x="165" y="56" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="600" fill={INK}>
            DAYS
          </text>
        </svg>
      );
    case "governance":
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <Plinth />
          {/* one beam spanning three racks */}
          <rect x="24" y="36" width="152" height="8" fill="#153A2F" />
          <rect x="24" y="36" width="152" height="2" fill={BRASS} />
          {[0, 1, 2].map((i) => {
            const x = 40 + i * 50;
            return (
              <g key={i}>
                <rect x={x} y="60" width="40" height="3" fill={BRASS} />
                <rect x={x + 2} y="63" width="3" height="55" fill={BRASS} />
                <rect x={x + 35} y="63" width="3" height="55" fill={BRASS} />
                {[0, 1, 2].map((g) => (
                  <path key={g} d={`M${x + 10 + g * 10} 64 l-4 4 l1 30 h8 l1 -30 z`} fill={i === 0 ? "#153A2F" : i === 1 ? "#4A4A52" : "#5B3A22"} />
                ))}
                <line x1={x + 20} y1="44" x2={x + 20} y2="60" stroke="#153A2F" strokeWidth="2" />
              </g>
            );
          })}
          <path d="M100 8 l12 4 v10 q0 10 -12 14 q-12 -4 -12 -14 v-10 z" fill={BRASS} />
          <path d="M95 22 l4 4 l7 -8" fill="none" stroke="#153A2F" strokeWidth="2" />
        </svg>
      );
    case "lockin":
    default:
      return (
        <svg viewBox="0 0 200 150" aria-hidden="true">
          <Plinth />
          {/* double doors open both ways */}
          <rect x="60" y="30" width="80" height="88" fill="#0e0f12" />
          <rect x="56" y="26" width="88" height="6" fill="#153A2F" />
          <path d="M60 30 l-24 10 v70 l24 8 z" fill="url(#ds-glass)" stroke={BRASS} />
          <path d="M140 30 l24 10 v70 l-24 8 z" fill="url(#ds-glass)" stroke={BRASS} />
          <ellipse cx="100" cy="74" rx="34" ry="30" fill="url(#ds-glow)" opacity="0.5" />
          <g stroke={BRASS_L} strokeWidth="2.5" fill="none">
            <path d="M84 66 h-26 m6 -6 l-6 6 l6 6" />
            <path d="M116 84 h26 m-6 -6 l6 6 l-6 6" />
          </g>
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Across the street: three other shops                                 */
/* ------------------------------------------------------------------ */

function Street() {
  return (
    <g>
      <rect width="320" height="200" fill="#0e0f12" />
      <rect x="0" y="176" width="320" height="24" fill="url(#ds-marble-dark)" />
      <rect x="0" y="174" width="320" height="2" fill="#2a2b31" />
    </g>
  );
}

export function Shopfront({ kind }: { kind: "boutique" | "bazaar" | "warehouse" }) {
  if (kind === "boutique") {
    return (
      <svg viewBox="0 0 320 200" aria-hidden="true">
        <Street />
        <rect x="70" y="40" width="180" height="136" fill="#1a1b21" stroke="#2c2d34" />
        {/* awning */}
        <path d="M60 78 h200 l10 18 h-220 z" fill="#153A2F" stroke={BRASS} strokeOpacity="0.8" />
        {/* one window, one mannequin */}
        <rect x="90" y="100" width="76" height="70" fill="url(#ds-window)" opacity="0.9" />
        <rect x="90" y="100" width="76" height="70" fill="none" stroke="#3a3b42" strokeWidth="2" />
        <g transform="translate(128 118)" fill="#1a1b21">
          <circle cx="0" cy="0" r="6" />
          <path d="M-10 10 q10 -6 20 0 l-2 34 h-16 z" />
        </g>
        {/* single door */}
        <rect x="186" y="104" width="44" height="72" fill="url(#ds-window)" opacity="0.8" />
        <rect x="186" y="104" width="44" height="72" fill="none" stroke={BRASS} strokeWidth="2" />
        <circle cx="222" cy="142" r="2" fill={BRASS_L} />
        {/* plaque */}
        <rect x="140" y="52" width="40" height="14" fill={BRASS} />
        <ellipse cx="160" cy="176" rx="80" ry="10" fill="url(#ds-glow)" opacity="0.2" />
      </svg>
    );
  }
  if (kind === "bazaar") {
    return (
      <svg viewBox="0 0 320 200" aria-hidden="true">
        <Street />
        {/* string lights */}
        <path d="M10 40 q80 30 150 0 t150 0" fill="none" stroke="#3a3b42" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <circle key={i} cx={20 + i * 35} cy={40 + Math.abs(4 - i) * 3 + 8} r="2.5" fill={CREAM} />
        ))}
        {/* stalls, no roof */}
        {[0, 1, 2, 3].map((i) => {
          const x = 14 + i * 76;
          return (
            <g key={i}>
              <path d={`M${x} 110 h64 l-6 -20 h-52 z`} fill={i % 2 ? "#5B3A22" : "#2A3F4A"} />
              <rect x={x + 4} y="110" width="56" height="60" fill="#1d1e24" stroke="#2c2d34" />
              <rect x={x + 8} y="114" width="48" height="8" fill="#D9C79F" />
              {[0, 1, 2].map((b) => (
                <rect key={b} x={x + 10 + b * 16} y="126" width="12" height="12" fill={b === 1 ? "#153A2F" : "#C9B48C"} />
              ))}
              <rect x={x + 26} y="70" width="4" height="20" fill="#3a3b42" />
            </g>
          );
        })}
        {/* shopping bags on the pavement */}
        <g fill="#D9C79F" stroke={INK} strokeOpacity="0.5">
          <path d="M120 176 v-14 h12 v14 z" />
          <path d="M136 176 v-12 h10 v12 z" />
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true">
      <Street />
      <rect x="30" y="50" width="260" height="126" fill="#1a1b21" stroke="#2c2d34" />
      <path d="M24 50 h272 l-10 -16 h-252 z" fill="#26272e" />
      {/* roller shutter, half up */}
      <rect x="90" y="86" width="140" height="90" fill="#0e0f12" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="90" y={86 + i * 10} width="140" height="8" fill="#33343b" />
      ))}
      {/* racks inside */}
      <g stroke="#8A8A88" strokeWidth="2" fill="none">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={104 + i * 40} y="130" width="30" height="46" />
            <line x1={104 + i * 40} y1="146" x2={134 + i * 40} y2="146" />
            <line x1={104 + i * 40} y1="162" x2={134 + i * 40} y2="162" />
          </g>
        ))}
      </g>
      {/* one lamp */}
      <rect x="156" y="60" width="8" height="14" fill="#2a2b31" />
      <ellipse cx="160" cy="100" rx="60" ry="40" fill="url(#ds-glow)" opacity="0.3" />
      <circle cx="160" cy="74" r="4" fill={CREAM} />
    </svg>
  );
}
