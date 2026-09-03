"use client";

import { useEffect, useState } from "react";
import { directory, liftPanel } from "@/lib/store/copy";

/** Store directory: the brass rail at the top with the illuminated floor list. */
export function Directory({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const lit = liftPanel[active]?.nav ?? "pavement";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const list = (
    <ul className="ds-directory__list">
      {directory.map((d) => (
        <li key={d.id}>
          <a
            href={`#${d.id}`}
            className={`ds-directory__item${lit === d.id ? " is-lit" : ""}`}
            aria-current={lit === d.id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {d.label}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="ds-directory" aria-label="Store directory">
      <a href="#pavement" className="ds-directory__wordmark">
        The Department Store <em>for AI</em>
      </a>
      {list}
      <button
        type="button"
        className="ds-directory__toggle"
        aria-expanded={open}
        aria-controls="ds-directory-panel"
        onClick={() => setOpen((v) => !v)}
      >
        Directory
      </button>
      <div id="ds-directory-panel" className="ds-directory__panel" data-open={open}>
        {list}
      </div>
    </nav>
  );
}

/** Lift panel: current floor number and name, bottom-left. */
export function Lift({ active }: { active: string }) {
  const panel = liftPanel[active] ?? liftPanel.pavement;
  return (
    <div className="ds-lift" role="status" aria-live="polite" aria-atomic="true">
      <span className="ds-lift__number" aria-hidden="true">
        <span key={panel.number + panel.name}>{panel.number}</span>
      </span>
      <span>
        <span className="ds-lift__label">You are on</span>
        <span className="ds-lift__name">
          {panel.number} · {panel.name}
        </span>
      </span>
    </div>
  );
}
