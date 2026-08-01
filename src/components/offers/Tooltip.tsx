"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * A small "what is this?" affordance. Opens on hover and on focus, closes on
 * Escape or outside click, and is reachable by keyboard — the description is
 * wired up with aria-describedby so screen readers get it either way.
 */
export default function Tooltip({
  text,
  label,
}: {
  text: string;
  /** What the tooltip explains, for the button's accessible name. */
  label: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <span
      className="o-tip-wrap"
      ref={wrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="o-tip-btn"
        aria-label={`What is ${label}?`}
        aria-expanded={open}
        aria-describedby={id}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(event) => {
          event.preventDefault();
          setOpen((current) => !current);
        }}
      >
        ?
      </button>
      <span id={id} role="tooltip" className="o-sr-only">
        {text}
      </span>
      {open ? (
        <span className="o-tip o-fade-in" aria-hidden="true">
          {text}
        </span>
      ) : null}
    </span>
  );
}
