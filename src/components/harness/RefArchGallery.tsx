"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ARCHITECTURES } from "@/lib/harness/architectures";
import { capById } from "@/lib/harness/capabilities";
import { Icon } from "./ui";

/** §11 — four enterprise reference architectures as linear flows with spotlights. */
export default function RefArchGallery() {
  const [sel, setSel] = useState(ARCHITECTURES[0].id);
  const arch = ARCHITECTURES.find((a) => a.id === sel)!;

  // Render the node sequence linearly; edge labels annotate the arrows between
  // consecutive nodes (non-consecutive edges are summarized in the spotlights).
  const edgeLabel = (fromIdx: number) => {
    const from = arch.nodes[fromIdx];
    const to = arch.nodes[fromIdx + 1];
    return arch.edges.find((e) => e.from === from.id && e.to === to.id)?.label;
  };

  return (
    <>
      <div className="hx-arch-tabs">
        {ARCHITECTURES.map((a) => (
          <button key={a.id} className={`hx-wl-tab ${sel === a.id ? "on" : ""}`} onClick={() => setSel(a.id)}>
            {a.name}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 13.5, color: "var(--hx-ink-soft)", maxWidth: 760, margin: "0 0 14px" }}>{arch.scenario}</p>

      <div className="hx-card hx-arch-flow">
        <div className="hx-flow">
          {arch.nodes.map((n, i) => (
            <span key={n.id} style={{ display: "contents" }}>
              <div className={`hx-fnode ${n.kind}`}>
                <span className="kind">{n.kind}</span>
                {n.label}
              </div>
              {i < arch.nodes.length - 1 && (
                <div className="hx-farrow">
                  <ArrowRight size={15} />
                  {edgeLabel(i) && <span className="lbl">{edgeLabel(i)}</span>}
                </div>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="hx-arch-spot">
        {arch.spotlight.map((s) => {
          const cap = capById(s.capabilityId);
          return (
            <div key={s.capabilityId} className="hx-spot">
              <span className="nm" style={{ color: `hsl(${cap.hue} 70% 38%)`, display: "inline-flex", alignItems: "center", gap: 5 }}>
                <Icon name={cap.icon} size={13} />
                {cap.name}
              </span>
              <span>{s.how}</span>
            </div>
          );
        })}
      </div>

      <div className="hx-arch-why">
        <strong>Why the architecture matters: </strong>
        {arch.whyItMatters}
      </div>
    </>
  );
}
