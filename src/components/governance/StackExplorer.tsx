"use client";

import { useState } from "react";
import Link from "next/link";
import type { Layer, Risk } from "@/lib/governance/types";

/**
 * The framework's money visual: seven layers, selectable. Selecting a layer
 * previews its question, stakes, and concentrated risks; the full treatment
 * lives one click deeper at /governance/stack/[layer].
 */
export function StackExplorer({ layers, risks }: { layers: Layer[]; risks: Risk[] }) {
  const [selectedId, setSelectedId] = useState<Layer["id"]>(layers[0]?.id ?? "enterprise");
  const selected = layers.find((l) => l.id === selectedId) ?? layers[0];
  const layerRisks = risks.filter((r) => selected.riskIds.includes(r.id)).slice(0, 4);

  return (
    <div className="g-stackexp">
      <div className="g-stack" role="tablist" aria-label="Governance layers">
        {layers.map((layer) => (
          <button
            key={layer.id}
            role="tab"
            aria-selected={layer.id === selectedId}
            data-hue={layer.hue}
            className={`g-stack-layer${layer.id === selectedId ? " active" : ""}`}
            onClick={() => setSelectedId(layer.id)}
          >
            <span className="g-stack-num">{layer.num}</span>
            <span>
              <span className="g-stack-name">{layer.name}</span>
              <span className="g-stack-q" style={{ display: "block" }}>
                {layer.question}
              </span>
            </span>
            <svg className="g-stack-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ))}
      </div>

      <div data-hue={selected.hue} className="g-card" style={{ position: "sticky", top: 82, alignSelf: "start", padding: 24 }}>
        <div className="g-kicker" style={{ marginBottom: 10 }}>
          <span className="g-kicker-num">{selected.num}</span>
          {selected.short}
        </div>
        <p className="g-serif-voice" style={{ fontSize: 17, lineHeight: 1.5 }}>
          {selected.insight}
        </p>
        <p className="g-prose" style={{ fontSize: 13.5, marginTop: 12 }}>
          {selected.summary}
        </p>
        {layerRisks.length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <div className="g-block-title" style={{ marginBottom: 8 }}>
              Risks concentrated here
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {layerRisks.map((r) => (
                <span key={r.id} className="g-badge hue">
                  {r.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        <div style={{ marginTop: 20 }}>
          <Link href={`/governance/stack/${selected.id}`} className="g-btn primary">
            Explore this layer
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
