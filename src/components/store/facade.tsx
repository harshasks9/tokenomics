/**
 * The night façade for the hero. The building is set right of centre so the
 * hero copy can sit on the pavement in front of the dark neighbour.
 * Door centre: (1080, 702) in frame units.
 */

const BX = 680; // building left edge
const BW = 800; // building width
export const FACADE_DOOR = { x: 1016, y: 622, w: 128, h: 160 };

export function FacadeBack() {
  const cols = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
      {/* neighbouring buildings */}
      <rect x="0" y="240" width={BX} height="560" fill="#121317" />
      <rect x={BX + BW} y="280" width={1600 - BX - BW} height="520" fill="#121317" />
      <g fill="#1a1b21">
        {[0, 1, 2, 3, 4, 5].map((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => (
            <rect key={`l${r}${c}`} x={40 + c * 86} y={280 + r * 80} width="34" height="46" />
          )),
        )}
        {[0, 1, 2, 3, 4, 5].map((r) =>
          [0, 1].map((c) => (
            <rect key={`r${r}${c}`} x={BX + BW + 40 + c * 80} y={320 + r * 76} width="34" height="46" />
          )),
        )}
      </g>
      {/* the store: masonry body */}
      <rect x={BX} y="180" width={BW} height="620" fill="#1a1b21" />
      <rect x={BX} y="180" width={BW} height="620" fill="none" stroke="#2c2d34" strokeWidth="2" />
      {/* cornice + parapet */}
      <rect x={BX - 16} y="164" width={BW + 32} height="18" fill="#2a2b31" />
      <rect x={BX - 16} y="160" width={BW + 32} height="4" fill="#B8894A" opacity="0.6" />
      {/* rooftop awning for the sign */}
      <path d={`M${BX + 70} 92 h${BW - 140} l16 72 h-${BW - 108} z`} fill="#153A2F" stroke="#B8894A" strokeOpacity="0.7" />
      <rect x={BX + 54} y="160" width={BW - 108} height="6" fill="url(#ds-brass)" />
      {/* pilasters */}
      {[0, 160, 320, 480, 640, BW - 16].map((x) => (
        <rect key={x} x={BX + x} y="180" width="16" height="620" fill="#22232a" />
      ))}
      {/* six rows of windows, glowing */}
      {[0, 1, 2, 3, 4, 5].map((r) => (
        <g key={r}>
          {cols.map((c) => {
            const x = BX + 28 + c * 160;
            const y = 200 + r * 68;
            const dim = (r * 7 + c * 3) % 5 === 0;
            return (
              <g key={c}>
                <rect x={x} y={y} width="116" height="52" rx="2" fill="url(#ds-window)" opacity={dim ? 0.35 : 0.85} />
                <rect x={x} y={y} width="116" height="52" fill="none" stroke="#3a3b42" strokeWidth="2" />
                <line x1={x + 58} y1={y} x2={x + 58} y2={y + 52} stroke="#3a3b42" strokeWidth="2" />
                <line x1={x} y1={y + 26} x2={x + 116} y2={y + 26} stroke="#3a3b42" strokeWidth="2" />
              </g>
            );
          })}
          <rect x={BX} y={200 + r * 68 + 60} width={BW} height="3" fill="#2c2d34" />
        </g>
      ))}
      {/* ground floor: brass fascia + tall display windows */}
      <rect x={BX} y="612" width={BW} height="6" fill="url(#ds-brass)" opacity="0.9" />
      {[BX + 24, BX + 476].map((x, i) => (
        <g key={i}>
          <rect x={x} y="630" width="300" height="150" fill="url(#ds-window)" opacity="0.9" />
          <rect x={x} y="630" width="300" height="150" fill="none" stroke="#3a3b42" strokeWidth="3" />
          {[0, 1, 2].map((m) => (
            <g key={m} transform={`translate(${x + 50 + m * 100} 660)`} fill="#1a1b21" opacity="0.85">
              <circle cx="0" cy="0" r="10" />
              <path d="M-18 16 q18 -10 36 0 l-4 60 h-28 z" />
              <rect x="-3" y="76" width="6" height="34" />
            </g>
          ))}
        </g>
      ))}
      {/* awning over the door */}
      <path d={`M${FACADE_DOOR.x - 40} 596 h${FACADE_DOOR.w + 80} l20 26 h-${FACADE_DOOR.w + 120} z`} fill="#153A2F" stroke="#B8894A" strokeOpacity="0.8" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={FACADE_DOOR.x - 40 + i * 30} y="596" width="15" height="26" fill="#1E4A3C" />
      ))}
      {/* door surround: warm light spilling out */}
      <rect x={FACADE_DOOR.x} y={FACADE_DOOR.y} width={FACADE_DOOR.w} height={FACADE_DOOR.h} fill="url(#ds-window)" opacity="0.95" />
      <rect x={FACADE_DOOR.x} y={FACADE_DOOR.y} width={FACADE_DOOR.w} height={FACADE_DOOR.h} fill="none" stroke="#B8894A" strokeWidth="3" />
      <path d={`M${FACADE_DOOR.x - 6} ${FACADE_DOOR.y} a70 30 0 0 1 ${FACADE_DOOR.w + 12} 0`} fill="none" stroke="#B8894A" strokeWidth="4" />
      {/* street level */}
      <rect x="0" y="780" width="1600" height="120" fill="url(#ds-marble-dark)" />
      <rect x="0" y="778" width="1600" height="4" fill="#2a2b31" />
      {/* reflection of the windows on wet pavement */}
      <g opacity="0.22" transform="translate(0 1564) scale(1 -1)">
        <rect x={BX + 24} y="630" width="300" height="150" fill="url(#ds-window)" />
        <rect x={BX + 476} y="630" width="300" height="150" fill="url(#ds-window)" />
        <rect x={FACADE_DOOR.x} y={FACADE_DOOR.y} width={FACADE_DOOR.w} height={FACADE_DOOR.h} fill="#FFF4DC" />
      </g>
      <rect x="0" y="782" width="1600" height="118" fill="url(#ds-fade-down)" opacity="0.5" />
      {/* street lamps */}
      {[630, 1560].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="560" width="6" height="222" fill="#2a2b31" />
          <rect x={x - 14} y="540" width="28" height="24" rx="3" fill="#2a2b31" stroke="#B8894A" strokeOpacity="0.6" />
          <rect x={x - 10} y="544" width="20" height="16" fill="#FFF4DC" opacity="0.9" />
          <ellipse cx={x} cy="552" rx="90" ry="60" fill="url(#ds-glow)" opacity="0.35" />
        </g>
      ))}
    </svg>
  );
}
