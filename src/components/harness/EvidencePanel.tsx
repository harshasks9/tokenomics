"use client";

import { EXHIBITS } from "@/lib/harness/frameworks";

/** §04 — same model, different harness: the empirical case, sourced and caveated. */
export default function EvidencePanel() {
  return (
    <div className="hx-exhibits">
      {EXHIBITS.map((ex) => {
        const max = Math.max(...ex.bars.map((b) => b.value));
        return (
          <div key={ex.id} className="hx-card hx-exhibit">
            <div className="t">{ex.title}</div>
            <div className="c">{ex.claim}</div>
            {ex.bars.map((b) => (
              <div key={b.label} className="hx-ebar">
                <div className="lb">
                  <span>{b.label}</span>
                  <span className="v">
                    {b.value} {b.unit}
                  </span>
                </div>
                <div className="tr">
                  <div className="fl" style={{ width: `${Math.max(3, (b.value / max) * 100)}%` }} />
                </div>
              </div>
            ))}
            <div className="src">
              Source:{" "}
              <a href={ex.source.url} target="_blank" rel="noreferrer">
                {ex.source.label}
              </a>{" "}
              · {ex.source.date}
            </div>
            <div className="cav">⚠ {ex.caveat}</div>
          </div>
        );
      })}
    </div>
  );
}
