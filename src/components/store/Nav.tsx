"use client";

import { useEffect, useState } from "react";
import { floors, nav, sectionFloor } from "@/lib/store/data";

/** Which section is on screen, by id. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!("IntersectionObserver" in window) || els.length === 0) return;
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set((e.target as HTMLElement).id, e.isIntersecting ? e.intersectionRatio : 0);
        let best = "";
        let bestRatio = 0;
        for (const [id, r] of ratios) {
          if (r > bestRatio) {
            best = id;
            bestRatio = r;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function useProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return p;
}

const IDS = ["hero", ...nav.map((n) => n.id)] as const;

export function TopBar({ onSources }: { onSources: () => void }) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(IDS);
  const p = useProgress();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="ds-topbar">
        <a href="#hero" className="ds-topbar__brand">
          <small className="hidden sm:inline">Google Cloud</small>
          <span className="hidden sm:inline">The AI Department Store</span>
          <span className="sm:hidden">AI Department Store</span>
        </a>
        <div className="ds-topbar__actions">
          <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={onSources}>
            <span className="hidden md:inline">Sources &amp; methodology</span>
            <span className="md:hidden">Sources</span>
          </button>
          <button
            type="button"
            className="ds-btn ds-btn--ghost ds-btn--sm xl:hidden"
            aria-expanded={open}
            aria-controls="ds-menu"
            onClick={() => setOpen((v) => !v)}
          >
            Sections
          </button>
        </div>
        <div className="ds-topbar__progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${p.toFixed(4)})` }} />
        </div>
      </header>
      {open && (
        <nav id="ds-menu" className="ds-menu" aria-label="Sections">
          {nav.map((n, i) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? "is-active" : undefined} onClick={() => setOpen(false)}>
              {String(i + 1).padStart(2, "0")} {n.label}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}

/** Sticky building navigator: a compact stack of floors, current one lit. */
const SHORT: Record<string, string> = { rooftop: "Roof", agents: "5", models: "4", data: "3", build: "2", govern: "1", foundation: "Base" };

export function Navigator() {
  const active = useActiveSection(IDS);
  const floor = sectionFloor[active] ?? null;
  const hidden = active === "hero" || active === "final";
  const label = nav.find((n) => n.id === active)?.label ?? "";
  return (
    <nav className="ds-navigator" aria-label="Building navigator" data-hidden={hidden}>
      <p className="ds-navigator__title">Floor</p>
      <ol className="ds-navigator__floors">
        {floors.map((f) => (
          <li key={f.id}>
            <a
              href={`#${f.sectionId}`}
              className={`ds-navigator__floor${floor === f.id ? " is-active" : ""}`}
              aria-current={floor === f.id ? "location" : undefined}
              aria-label={`${f.level}: ${f.name}`}
              title={`${f.level}: ${f.name}`}
            >
              {SHORT[f.id]}
            </a>
          </li>
        ))}
      </ol>
      <div className={`ds-navigator__column${floor === "column" ? " is-active" : ""}`} aria-hidden="true" title="The structural column" />
      <p className="ds-navigator__now" aria-live="polite">{label}</p>
    </nav>
  );
}
