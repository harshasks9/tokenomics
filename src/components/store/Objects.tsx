"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { Row } from "@/lib/store/copy";

/* ------------------------------------------------------------------ */
/* One hang-tag open per scene                                          */
/* ------------------------------------------------------------------ */

type SceneCtx = {
  open: string | null;
  setOpen: (id: string | null) => void;
};

const SceneContext = createContext<SceneCtx>({ open: null, setOpen: () => {} });

export function SceneObjects({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<string | null>(null);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <SceneContext.Provider value={value}>{children}</SceneContext.Provider>;
}

/* ------------------------------------------------------------------ */
/* Hang-tag                                                             */
/* ------------------------------------------------------------------ */

export function HangTag({
  row,
  id,
  priceTag,
  side = "right",
}: {
  row: Row;
  id: string;
  priceTag?: boolean;
  side?: "left" | "right";
}) {
  return (
    <div
      className={`ds-tag ds-tag--${side}${priceTag ? " ds-tag--price" : ""}`}
      id={id}
      role="note"
    >
      <span className="ds-tag__string" aria-hidden="true" />
      <span className="ds-tag__hole" aria-hidden="true" />
      <p className="ds-tag__element">{row.element}</p>
      <p className="ds-tag__capability">{row.capability}</p>
      <p className="ds-tag__meaning">{row.meaning}</p>
      {priceTag && (
        <p className="ds-tag__price" aria-label="Price: Same checkout">
          <span className="ds-tag__price-dash" aria-hidden="true">
            — — —
          </span>
          Same checkout.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scene object: a physical thing in the room that carries a tag        */
/* ------------------------------------------------------------------ */

export type SceneObjectProps = {
  row: Row;
  /** Position inside the 1600×900 frame, in frame units. */
  x: number;
  y: number;
  w: number;
  h: number;
  children: ReactNode; // the SVG prop, already sized to w×h
  /** Where the tag swings in from. */
  side?: "left" | "right";
  priceTag?: boolean;
  /** Extra classes for lighting / spotlight staggering. */
  className?: string;
  style?: CSSProperties;
  /** Optional HTML signage rendered inside the object box (e.g. a rack label). */
  label?: ReactNode;
  /** Spotlight: draw a warm cone above the object. */
  spotlight?: boolean;
  /** Announce a different name than the store element. */
  ariaLabel?: string;
  /** Render in normal flow (the walls scene) instead of absolute in a frame. */
  flow?: boolean;
  /** Extra decoration rendered inside the object (e.g. a staggered spotlight). */
  extra?: ReactNode;
};

/** A prop made of several props, laid out in percentages of the object box. */
export function Composite({ children }: { children: ReactNode }) {
  return <div className="ds-composite">{children}</div>;
}

export function Part({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children: ReactNode;
}) {
  return (
    <div className="ds-part" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
      {children}
    </div>
  );
}

export function SceneObject({
  row,
  x,
  y,
  w,
  h,
  children,
  side = "right",
  priceTag,
  className = "",
  style,
  label,
  spotlight = true,
  ariaLabel,
  flow = false,
  extra,
}: SceneObjectProps) {
  const { open, setOpen } = useContext(SceneContext);
  const reactId = useId();
  const tagId = `tag-${row.id}-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const isOpen = open === row.id;
  const ref = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    // On narrow screens the tag list beneath the scene is the canonical
    // reading surface — tapping an object scrolls to its line there.
    if (window.matchMedia("(max-width: 767px)").matches) {
      const target = document.getElementById(`list-${row.id}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("is-flash");
        window.setTimeout(() => target.classList.remove("is-flash"), 1400);
      }
      return;
    }
    setOpen(isOpen ? null : row.id);
  }, [isOpen, row.id, setOpen]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      setOpen(null);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [isOpen, setOpen]);

  const pos: CSSProperties = flow
    ? { ...style }
    : {
        left: `${(x / 1600) * 100}%`,
        top: `${(y / 900) * 100}%`,
        width: `${(w / 1600) * 100}%`,
        height: `${(h / 900) * 100}%`,
        ...style,
      };

  return (
    <div
      ref={ref}
      className={`ds-object${isOpen ? " is-open" : ""}${flow ? " ds-object--flow" : ""} ${className}`}
      style={pos}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel ?? `${row.element}: ${row.capability}`}
      aria-expanded={isOpen}
      aria-controls={tagId}
      onClick={toggle}
      onKeyDown={onKey}
    >
      {extra}
      {spotlight && <span className="ds-object__spot" aria-hidden="true" />}
      <span className="ds-object__shadow" aria-hidden="true" />
      <div className="ds-object__prop" aria-hidden="true">
        {children}
      </div>
      {label && <div className="ds-object__label">{label}</div>}
      <HangTag row={row} id={tagId} side={side} priceTag={priceTag} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked tag list beneath a scene (mobile, reduced motion, no-JS)     */
/* ------------------------------------------------------------------ */

export function TagList({
  rows,
  priceTag,
  heading,
}: {
  rows: readonly Row[];
  priceTag?: boolean;
  heading: string;
}) {
  return (
    <div className="ds-taglist" aria-label={`${heading} — hang-tags`}>
      <ol className="ds-taglist__list">
        {rows.map((r) => (
          <li key={r.id} id={`list-${r.id}`} className="ds-taglist__item">
            <p className="ds-tag__element">{r.element}</p>
            <p className="ds-tag__capability">{r.capability}</p>
            <p className="ds-tag__meaning">{r.meaning}</p>
            {priceTag && <p className="ds-tag__price">Same checkout.</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
