"use client";

import { useEffect, useRef } from "react";
import { methodology, sources } from "@/lib/store/data";

export default function SourcesDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ds-drawer" role="dialog" aria-modal="true" aria-labelledby="sources-title">
      <button type="button" className="ds-drawer__scrim" aria-label="Close sources" onClick={onClose} />
      <div className="ds-drawer__panel">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="ds-eyebrow">Sources &amp; methodology</p>
            <h2 id="sources-title" className="ds-h3 mt-1">
              Where the product facts come from
            </h2>
          </div>
          <button ref={closeRef} type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="ds-tag mt-8 mb-2">Official Google Cloud pages</p>
        <ul className="ds-drawer__list">
          {sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
                <span className="ds-small block">{s.url}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="ds-tag mt-8 mb-2">Methodology</p>
        <ul className="grid gap-2">
          {methodology.map((m) => (
            <li key={m} className="ds-body flex gap-3">
              <span aria-hidden="true">·</span>
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
