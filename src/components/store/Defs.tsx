/**
 * Shared SVG paint: brass, walnut, marble, glass, shadow and glow gradients,
 * plus the grain filter. Rendered once; every scene references these by id.
 */
export default function Defs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="ds-defs">
      <defs>
        <linearGradient id="ds-brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E2C38A" />
          <stop offset="0.45" stopColor="#B8894A" />
          <stop offset="1" stopColor="#8A6432" />
        </linearGradient>
        <linearGradient id="ds-brass-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8A6432" />
          <stop offset="0.5" stopColor="#E2C38A" />
          <stop offset="1" stopColor="#8A6432" />
        </linearGradient>
        <linearGradient id="ds-walnut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7A4E2D" />
          <stop offset="0.5" stopColor="#5B3A22" />
          <stop offset="1" stopColor="#3F2617" />
        </linearGradient>
        <linearGradient id="ds-walnut-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4A2D1A" />
          <stop offset="0.5" stopColor="#7A4E2D" />
          <stop offset="1" stopColor="#4A2D1A" />
        </linearGradient>
        <linearGradient id="ds-marble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9E4DA" />
          <stop offset="1" stopColor="#D9D4CA" />
        </linearGradient>
        <linearGradient id="ds-marble-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A2A2F" />
          <stop offset="1" stopColor="#121215" />
        </linearGradient>
        <linearGradient id="ds-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="ds-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E4A3C" />
          <stop offset="1" stopColor="#0F2C24" />
        </linearGradient>
        <linearGradient id="ds-linen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E8E1D3" />
          <stop offset="0.3" stopColor="#F4EFE4" />
          <stop offset="0.5" stopColor="#DDD6C6" />
          <stop offset="0.7" stopColor="#F1EBDE" />
          <stop offset="1" stopColor="#E2DBCB" />
        </linearGradient>
        <linearGradient id="ds-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF4DC" stopOpacity="0.95" />
          <stop offset="1" stopColor="#F0C98A" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="ds-daylight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFF4DC" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="ds-fade-down" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="1" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ds-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1B1B1F" stopOpacity="0.32" />
          <stop offset="0.6" stopColor="#1B1B1F" stopOpacity="0.12" />
          <stop offset="1" stopColor="#1B1B1F" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ds-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF4DC" stopOpacity="0.9" />
          <stop offset="0.35" stopColor="#FFF4DC" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FFF4DC" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ds-spot" cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#FFF4DC" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#FFF4DC" stopOpacity="0.14" />
          <stop offset="1" stopColor="#FFF4DC" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ds-pilot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD59A" stopOpacity="1" />
          <stop offset="0.25" stopColor="#F2B85C" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F2B85C" stopOpacity="0" />
        </radialGradient>
        <mask id="ds-reflect-mask">
          <rect width="1600" height="900" fill="url(#ds-fade-down)" />
        </mask>
        <filter id="ds-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  );
}

/** Grain overlay for one stage. Multiply on daylight scenes, screen at night. */
export function Grain({ dark = false }: { dark?: boolean }) {
  return <div className={`ds-grain${dark ? " ds-grain--dark" : ""}`} aria-hidden="true" />;
}
