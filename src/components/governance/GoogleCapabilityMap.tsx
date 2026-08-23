"use client";

import { useMemo, useState } from "react";
import type { GoogleCapability, Layer, LayerId } from "@/lib/governance/types";

/** Interactive mapping of Google capabilities onto the seven governance layers. */
export function GoogleCapabilityMap({
  layers,
  capabilities,
}: {
  layers: Layer[];
  capabilities: GoogleCapability[];
}) {
  const [layerFilter, setLayerFilter] = useState<LayerId | "all">("all");

  const visible = useMemo(
    () =>
      layerFilter === "all"
        ? capabilities
        : capabilities.filter((c) => c.layerIds.includes(layerFilter)),
    [capabilities, layerFilter],
  );

  const activeLayer = layers.find((l) => l.id === layerFilter);

  return (
    <div>
      <div className="g-no-print" style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
        <button className="g-chip" aria-pressed={layerFilter === "all"} onClick={() => setLayerFilter("all")}>
          All layers · {capabilities.length}
        </button>
        {layers.map((l) => {
          const count = capabilities.filter((c) => c.layerIds.includes(l.id)).length;
          return (
            <button
              key={l.id}
              data-hue={l.hue}
              className="g-chip hue"
              aria-pressed={layerFilter === l.id}
              onClick={() => setLayerFilter(layerFilter === l.id ? "all" : l.id)}
            >
              <span className="g-dot" />
              {l.num} {l.short} · {count}
            </button>
          );
        })}
      </div>
      {activeLayer ? (
        <p className="g-small" style={{ marginBottom: 16 }}>
          <strong style={{ fontWeight: 650 }}>{activeLayer.name}:</strong> {activeLayer.question}
        </p>
      ) : (
        <p className="g-small" style={{ marginBottom: 16 }}>
          Filter by layer to see which capabilities answer which governance question. Cards link to
          official docs.
        </p>
      )}

      <div className="g-grid-3">
        {visible.map((cap) => {
          const capLayers = layers.filter((l) => cap.layerIds.includes(l.id));
          return (
            <a
              key={cap.id}
              href={cap.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="g-card g-card-hover"
              style={{ display: "block" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "start" }}>
                <h3 className="g-h3" style={{ fontSize: 14.5 }}>{cap.name}</h3>
                <span className={`g-badge ${cap.status === "GA" ? "ga" : "preview"}`}>{cap.status}</span>
              </div>
              <p className="g-micro" style={{ marginTop: 2 }}>{cap.family}</p>
              <p className="g-small" style={{ marginTop: 8, color: "var(--ink-2)" }}>{cap.oneLiner}</p>
              <p className="g-micro" style={{ marginTop: 6 }}>{cap.solves}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
                {capLayers.map((l) => (
                  <span key={l.id} data-hue={l.hue} className="g-badge hue" style={{ fontSize: 9 }}>
                    {l.num}
                  </span>
                ))}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
