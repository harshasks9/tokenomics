"use client";

import { useState, type ReactNode } from "react";

const LEVELS = [
  { id: "exec", lvl: "L1", label: "Executive", hint: "30 seconds" },
  { id: "prac", lvl: "L2", label: "Practitioner", hint: "controls & owners" },
  { id: "tech", lvl: "L3", label: "Technical", hint: "enforcement & audit" },
] as const;

type LevelId = (typeof LEVELS)[number]["id"];

/**
 * Progressive depth: one topic, three altitudes. The panel content is
 * server-rendered and passed in, so switching is instant and free.
 */
export function DepthTabs({
  executive,
  practitioner,
  technical,
  initial = "exec",
}: {
  executive: ReactNode;
  practitioner: ReactNode;
  technical: ReactNode;
  initial?: LevelId;
}) {
  const [level, setLevel] = useState<LevelId>(initial);
  const panels: Record<LevelId, ReactNode> = {
    exec: executive,
    prac: practitioner,
    tech: technical,
  };

  return (
    <div>
      <div className="g-depth" role="tablist" aria-label="Depth of detail">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={level === l.id}
            onClick={() => setLevel(l.id)}
            title={l.hint}
          >
            <span className="lvl">{l.lvl}</span>
            {l.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" style={{ marginTop: 22 }}>
        {panels[level]}
      </div>
    </div>
  );
}
