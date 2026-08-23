"use client";

import { useState, type ReactNode } from "react";

/** Generic disclosure row used for challenge accordions and deep dives. */
export function Expander({
  head,
  children,
  defaultOpen = false,
  hue,
}: {
  head: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  hue?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="g-expand" data-hue={hue}>
      <button className="g-expand-head" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span style={{ flex: 1, minWidth: 0 }}>{head}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{
            color: "var(--faint)",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .18s",
            flexShrink: 0,
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? <div className="g-expand-body">{children}</div> : null}
    </div>
  );
}
