"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONFIDENCE_BLURB,
  CONFIDENCE_LABEL,
  type Confidence,
  type Layer,
} from "@/lib/earnings/data";

/**
 * Confidence pill.
 *
 * The `data-c` attribute is what the site-wide "facts only" filter keys on, so
 * every element carrying a non-fact datum must also carry it — the pill sets it
 * on itself, and callers set it on the surrounding block.
 */
export function Pill({
  c,
  onDark = false,
  className = "",
}: {
  c: Confidence;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`ea-pill ea-pill-${c}${onDark ? " ea-pill-on-dark" : ""} ${className}`}
      data-c={c}
      title={CONFIDENCE_BLURB[c]}
    >
      {CONFIDENCE_LABEL[c]}
    </span>
  );
}

export function layerClass(layer: Layer) {
  return `ea-layer-${layer}`;
}

/** True once the element has scrolled into view; latches so it never re-hides. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver (old browser, or a test env): reveal on the next
    // frame rather than synchronously, so this never cascades a render.
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Count up to `value` once visible. Reduced-motion users get the final number
 * immediately rather than a shortened animation.
 */
export function useCountUp(value: number, shown: boolean, ms = 1100) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!shown) return;
    // Reduced motion collapses the duration to zero, so the first frame lands
    // on the final value — no separate synchronous branch.
    const duration = prefersReducedMotion() ? 0 : ms;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = duration === 0 ? 1 : Math.min((t - start) / duration, 1);
      // easeOutCubic — fast then settling, so the final digits are readable.
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, shown, ms]);

  return n;
}

/** Section heading with its zone number and small-caps kicker. */
export function ZoneHead({
  n,
  kicker,
  title,
  lede,
  children,
}: {
  n: number;
  kicker: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header style={{ marginBottom: 22 }}>
      <div className="ea-zone-head">
        <span className="ea-zone-num">{String(n).padStart(2, "0")}</span>
        <span className="ea-kicker">{kicker}</span>
      </div>
      <h2 className="ea-h2" style={{ maxWidth: "20ch" }}>
        {title}
      </h2>
      {lede ? (
        <p className="ea-lede" style={{ marginTop: 10 }}>
          {lede}
        </p>
      ) : null}
      {children}
    </header>
  );
}

/** A block that fades/rises in once scrolled to. */
export function Reveal({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`ea-reveal ${className}`} data-shown={shown} style={style}>
      {children}
    </div>
  );
}
