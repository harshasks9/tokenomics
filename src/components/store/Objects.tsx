"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { Item } from "@/lib/store/copy";

/* ------------------------------------------------------------------ */
/* Exhibit: one room, one legend. Hovering or focusing an object lights  */
/* its card; hovering a card lights its object.                          */
/* ------------------------------------------------------------------ */

type ExhibitCtx = {
  active: string | null;
  setActive: (id: string | null) => void;
  pinned: string | null;
  setPinned: (id: string | null) => void;
};

const ExhibitContext = createContext<ExhibitCtx>({
  active: null,
  setActive: () => {},
  pinned: null,
  setPinned: () => {},
});

export function Exhibit({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const value = useMemo(() => ({ active, setActive, pinned, setPinned }), [active, pinned]);
  return <ExhibitContext.Provider value={value}>{children}</ExhibitContext.Provider>;
}

export function useExhibit() {
  return useContext(ExhibitContext);
}

/* ------------------------------------------------------------------ */
/* Hotspot: a physical object in the room with a numbered callout        */
/* ------------------------------------------------------------------ */

export type HotspotProps = {
  id: string;
  /** Callout number, matches the card. */
  n: number;
  /** Accessible name of the control. */
  label: string;
  /** Position in the 1600×900 frame. */
  x: number;
  y: number;
  w: number;
  h: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Progress at which this object's light comes on. */
  on?: number;
  spot?: boolean;
  /** Where the callout badge sits. */
  callout?: "tl" | "tr" | "t";
  /** Extra in-room signage rendered inside the hotspot. */
  signage?: ReactNode;
};

export function Hotspot({
  id,
  n,
  label,
  x,
  y,
  w,
  h,
  children,
  className = "",
  style,
  on = 0,
  spot = true,
  callout = "tl",
  signage,
}: HotspotProps) {
  const { active, setActive, pinned, setPinned } = useExhibit();
  const isActive = active === id || pinned === id;

  const focusCard = useCallback(() => {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;
    if (window.matchMedia("(max-width: 1023px)").matches) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    card.classList.add("is-flash");
    window.setTimeout(() => card.classList.remove("is-flash"), 1200);
  }, [id]);

  const pos: CSSProperties = {
    left: `${(x / 1600) * 100}%`,
    top: `${(y / 900) * 100}%`,
    width: `${(w / 1600) * 100}%`,
    height: `${(h / 900) * 100}%`,
    "--on": on,
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`ds-hotspot${isActive ? " is-active" : ""} ${className}`}
      style={pos}
      data-id={id}
      onMouseEnter={() => setActive(id)}
      onMouseLeave={() => setActive(null)}
    >
      <button
        type="button"
        className="ds-hotspot__hit"
        aria-label={label}
        aria-describedby={`card-${id}`}
        aria-pressed={pinned === id}
        onFocus={() => setActive(id)}
        onBlur={() => setActive(null)}
        onClick={() => {
          setPinned(pinned === id ? null : id);
          focusCard();
        }}
      />
      {spot && <span className="ds-hotspot__spot" aria-hidden="true" />}
      <span className="ds-hotspot__shadow" aria-hidden="true" />
      <div className="ds-hotspot__prop" aria-hidden="true">
        {children}
      </div>
      {signage}
      <span className={`ds-callout ds-callout--${callout}`} aria-hidden="true">
        {n}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card: the legend entry for one object                                 */
/* ------------------------------------------------------------------ */

export function Card({ item, n, on = 0 }: { item: Item; n: number; on?: number }) {
  const { active, setActive, pinned } = useExhibit();
  const isActive = active === item.id || pinned === item.id;
  return (
    <li
      id={`card-${item.id}`}
      className={`ds-card${isActive ? " is-active" : ""}`}
      style={{ "--on": on } as CSSProperties}
      onMouseEnter={() => setActive(item.id)}
      onMouseLeave={() => setActive(null)}
    >
      <span className="ds-card__n" aria-hidden="true">
        {n}
      </span>
      <p className="ds-card__object">{item.object}</p>
      <h3 className="ds-card__cap">{item.capability}</h3>
      <p className="ds-card__body">{item.body}</p>
    </li>
  );
}

/** A concierge line. */
export function Narrator({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`ds-narrator ${className}`} style={style}>
      <span className="ds-narrator__who">Your concierge</span>
      <p className="ds-narrator__line">{children}</p>
    </div>
  );
}
