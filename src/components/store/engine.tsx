"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * The walk engine.
 *
 * Every scene is a `[data-scene]` element. Sticky scenes are taller than the
 * viewport and hold a 100vh sticky stage; their progress (0→1) is how far the
 * stage has been pinned. Flow scenes (`data-flow`) are ordinary sections whose
 * progress is how far they have travelled up the viewport.
 *
 * Progress is written to the element as a `--p` custom property. All motion is
 * expressed in CSS as calc() of --p on transform and opacity only, so the
 * browser can keep everything on the compositor. Under prefers-reduced-motion
 * no progress is written (CSS renders the resting state) but the engine still
 * tracks which floor is on screen for the directory and the lift panel.
 */

export type EngineState = {
  active: string;
  reduced: boolean;
  js: boolean;
};

const EngineContext = createContext<EngineState>({
  active: "pavement",
  reduced: false,
  js: false,
});

export function useEngine() {
  return useContext(EngineContext);
}

export const EngineProvider = EngineContext.Provider;

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function useWalkEngine(animate: boolean) {
  const [active, setActive] = useState("pavement");
  const activeRef = useRef("pavement");

  useEffect(() => {
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene]"),
    );
    const last = new Map<HTMLElement, number>();
    let raf = 0;

    const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      const mid = vh * 0.5;
      let current = activeRef.current;
      for (const el of scenes) {
        const r = el.getBoundingClientRect();
        const h = r.height;
        let p: number;
        if (el.dataset.flow !== undefined) {
          p = clamp((vh * 0.8 - r.top) / h);
        } else {
          const travel = Math.max(1, h - vh);
          p = clamp(-r.top / travel);
        }
        const prev = last.get(el);
        if (animate && (prev === undefined || Math.abs(prev - p) > 0.0015)) {
          last.set(el, p);
          el.style.setProperty("--p", p.toFixed(4));
        }
        if (r.top <= mid && r.bottom > mid) {
          current = el.dataset.scene ?? current;
        }
        // Distance-based visibility hint for far-off scenes.
        const far = animate && (r.bottom < -vh * 1.5 || r.top > vh * 2.5);
        if (far !== el.classList.contains("is-far")) {
          el.classList.toggle("is-far", far);
        }
      }
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
      }
    };

    const schedule = () => {
      if (raf) return;
      // rAF is paused in hidden tabs; fall back to a timer so the scene
      // state is right the moment the tab becomes visible again.
      raf = document.hidden ? window.setTimeout(tick, 16) : requestAnimationFrame(tick);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
        window.clearTimeout(raf);
      }
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [animate]);

  return active;
}

/** Fade-in for flow sections (also the reduced-motion transition). */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Smooth-scroll helper for directory, banners and the cross-section. */
export function useScrollTo() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, []);
}
