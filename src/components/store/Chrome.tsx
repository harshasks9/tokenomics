"use client";

import { useEffect, useState } from "react";
import { directory, indicator } from "@/lib/store/copy";

/** Page progress 0→1, written as --page-p on the top bar. */
function usePageProgress() {
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

/** Top rail: wordmark, progress line, current stop, directory. */
export function TopBar({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const p = usePageProgress();
  const here = indicator[active] ?? indicator.pavement;
  const stopIndex = directory.findIndex((d) => d.id === here.nav);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="ds-topbar">
      <a href="#pavement" className="ds-topbar__wordmark">
        The Department Store <em>for AI</em>
      </a>
      <div className="ds-topbar__here" aria-live="polite">
        <span className="ds-topbar__stop">
          Stop {Math.max(1, stopIndex + 1)} of {directory.length}
        </span>
        <span className="ds-topbar__name">
          {here.number} · {here.name}
        </span>
      </div>
      <button
        type="button"
        className="ds-topbar__toggle"
        aria-expanded={open}
        aria-controls="ds-directory"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ds-topbar__toggle-icon" aria-hidden="true" />
        Directory
      </button>
      <div className="ds-topbar__progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${p.toFixed(4)})` }} />
      </div>

      <nav id="ds-directory" className="ds-directory" data-open={open} aria-label="Store directory" hidden={!open}>
        <div className="ds-directory__inner">
          <div className="ds-directory__group">
            <p className="ds-directory__title">The building</p>
            <ol className="ds-directory__list">
              {directory
                .filter((d) => d.group === "building")
                .map((d, i) => (
                  <li key={d.id}>
                    <a
                      href={`#${d.id}`}
                      className={`ds-directory__item${here.nav === d.id ? " is-lit" : ""}`}
                      aria-current={here.nav === d.id ? "location" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span className="ds-directory__num">{String(i + 1).padStart(2, "0")}</span>
                      {d.label}
                    </a>
                  </li>
                ))}
            </ol>
          </div>
          <div className="ds-directory__group">
            <p className="ds-directory__title">The street</p>
            <ol className="ds-directory__list" start={11}>
              {directory
                .filter((d) => d.group === "street")
                .map((d, i) => (
                  <li key={d.id}>
                    <a
                      href={`#${d.id}`}
                      className={`ds-directory__item${here.nav === d.id ? " is-lit" : ""}`}
                      aria-current={here.nav === d.id ? "location" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span className="ds-directory__num">{String(i + 11).padStart(2, "0")}</span>
                      {d.label}
                    </a>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </nav>
    </header>
  );
}

/** Building map: a stack of floor plates with the current one lit. */
const LEVELS = [6, 5, 4, 3, 2, 1, 0];

export function FloorStack({ level }: { level: number }) {
  return (
    <ol className={`ds-stack${level === -1 ? " is-walls" : ""}`} aria-label="Building map">
      {LEVELS.map((l) => (
        <li key={l} className={`ds-stack__plate${l === level ? " is-lit" : ""}`} aria-current={l === level ? "location" : undefined}>
          {l === 0 ? "G" : l}
        </li>
      ))}
    </ol>
  );
}
