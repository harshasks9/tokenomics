"use client";

import { useState } from "react";
import { WORKLOADS } from "@/lib/harness/workloads";
import { CAPABILITIES } from "@/lib/harness/capabilities";
import { Icon } from "./ui";

/** §05 — pick a workload, watch the capability weights rearrange. */
export default function WorkloadSelector() {
  const [sel, setSel] = useState(WORKLOADS[0].id);
  const wl = WORKLOADS.find((w) => w.id === sel)!;

  const ranked = [...CAPABILITIES].sort((a, b) => (wl.weights[b.id] ?? 0) - (wl.weights[a.id] ?? 0));

  return (
    <>
      <div className="hx-wl-tabs">
        {WORKLOADS.map((w) => (
          <button key={w.id} className={`hx-wl-tab ${sel === w.id ? "on" : ""}`} onClick={() => setSel(w.id)}>
            <Icon name={w.icon} size={14} />
            {w.name}
          </button>
        ))}
      </div>

      <div className="hx-wl-body">
        <div className="hx-card hx-wl-info">
          <h4>{wl.name}</h4>
          <div className="tag">{wl.tagline}</div>
          <div className="hx-wl-traits">
            {wl.traits.map((t) => (
              <span key={t} className="hx-pill">
                {t}
              </span>
            ))}
          </div>
          <div className="rat">{wl.rationale}</div>
          <div className="rat" style={{ borderTop: "none", paddingTop: 0 }}>
            <strong style={{ color: "var(--hx-ink)" }}>Common harnesses today: </strong>
            {wl.exemplars.join(" · ")}
          </div>
        </div>

        <div className="hx-card hx-wl-weights">
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--hx-ink-faint)",
              marginBottom: 12,
            }}
          >
            What the harness must be good at here
          </div>
          {ranked.map((c) => {
            const v = wl.weights[c.id] ?? 0;
            return (
              <div key={c.id} className={`hx-wbar ${v >= 5 ? "hot" : ""}`}>
                <span className="nm">{c.name}</span>
                <div className="tr">
                  <div
                    className="fl"
                    style={{
                      width: `${(v / 5) * 100}%`,
                      background: `hsl(${c.hue} 68% ${v >= 5 ? 42 : 55}%)`,
                    }}
                  />
                </div>
                <span className="sc">{v}/5</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
