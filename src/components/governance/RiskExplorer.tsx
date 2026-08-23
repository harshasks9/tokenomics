"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { GoogleCapability, Incident, Layer, LayerId, Risk } from "@/lib/governance/types";

/**
 * Risk-first navigation: filter the risk landscape by layer, open any risk for
 * its controls, documented incidents, and the capabilities that address it.
 */
export function RiskExplorer({
  risks,
  layers,
  incidents,
  capabilities,
}: {
  risks: Risk[];
  layers: Layer[];
  incidents: Incident[];
  capabilities: GoogleCapability[];
}) {
  const [layerFilter, setLayerFilter] = useState<LayerId | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement | null>(null);

  const visible = useMemo(
    () => (layerFilter === "all" ? risks : risks.filter((r) => r.layerIds.includes(layerFilter))),
    [risks, layerFilter],
  );

  const selected = risks.find((r) => r.id === selectedId) ?? null;
  const selectedIncidents = selected
    ? incidents.filter((i) => selected.incidentIds.includes(i.id))
    : [];
  const selectedCaps = selected
    ? capabilities.filter((c) => selected.googleCapabilityIds.includes(c.id))
    : [];
  const selectedLayers = selected ? layers.filter((l) => selected.layerIds.includes(l.id)) : [];
  const primaryHue = selectedLayers[0]?.hue ?? "neutral";

  function choose(id: string) {
    const next = id === selectedId ? null : id;
    setSelectedId(next);
    if (next) {
      requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
  }

  return (
    <div>
      <div className="g-no-print" style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
        <button className="g-chip" aria-pressed={layerFilter === "all"} onClick={() => setLayerFilter("all")}>
          All layers
        </button>
        {layers.map((l) => (
          <button
            key={l.id}
            data-hue={l.hue}
            className="g-chip hue"
            aria-pressed={layerFilter === l.id}
            onClick={() => setLayerFilter(layerFilter === l.id ? "all" : l.id)}
          >
            <span className="g-dot" />
            {l.short}
          </button>
        ))}
      </div>

      <div className="g-grid-3">
        {visible.map((risk) => {
          const riskLayers = layers.filter((l) => risk.layerIds.includes(l.id));
          const on = risk.id === selectedId;
          return (
            <button
              key={risk.id}
              data-hue={riskLayers[0]?.hue ?? "neutral"}
              className="g-card g-card-hover"
              onClick={() => choose(risk.id)}
              aria-expanded={on}
              style={{
                textAlign: "left",
                borderColor: on ? "var(--hue-line)" : undefined,
                background: on ? "var(--hue-soft)" : undefined,
              }}
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <span className="g-dot" />
                <span className="g-h3" style={{ fontSize: 14.5 }}>{risk.name}</span>
              </div>
              <p className="g-small">{risk.blurb}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12 }}>
                {riskLayers.map((l) => (
                  <span key={l.id} data-hue={l.hue} className="g-badge hue" style={{ fontSize: 9.5 }}>
                    {l.short}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div ref={detailRef} data-hue={primaryHue} className="g-card" style={{ marginTop: 22, padding: 26, borderColor: "var(--hue-line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
            <div>
              <div className="g-kicker" style={{ marginBottom: 8 }}>Risk deep dive</div>
              <h3 className="g-h2" style={{ fontSize: 22 }}>{selected.name}</h3>
            </div>
            <button className="g-btn g-no-print" style={{ padding: "6px 12px", fontSize: 12.5 }} onClick={() => setSelectedId(null)}>
              Close
            </button>
          </div>
          <p className="g-prose" style={{ marginTop: 12 }}>{selected.detail}</p>

          <div className="g-grid-2" style={{ marginTop: 22 }}>
            <div>
              <div className="g-block-title">Controls that mitigate it</div>
              <ul className="g-list">
                {selected.controls.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="g-block-title">It has already happened</div>
              {selectedIncidents.length === 0 ? (
                <p className="g-small">No public incident on file — treat as an emerging risk.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {selectedIncidents.map((inc) => (
                    <div key={inc.id} style={{ borderLeft: "2px solid var(--hue-line)", paddingLeft: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 650 }}>
                        {inc.org} <span className="g-micro" style={{ fontWeight: 500 }}>· {inc.date}</span>
                      </div>
                      <p className="g-small" style={{ marginTop: 2 }}>{inc.what}</p>
                      <p className="g-small" style={{ marginTop: 4, color: "var(--ink-2)" }}>
                        <strong style={{ fontWeight: 650 }}>Lesson:</strong> {inc.lesson}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22, alignItems: "center" }}>
            <span className="g-micro" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Where it lives:
            </span>
            {selectedLayers.map((l) => (
              <Link key={l.id} href={`/governance/stack/${l.id}`} data-hue={l.hue} className="g-chip hue" style={{ fontSize: 12 }}>
                <span className="g-dot" />
                {l.num} {l.short}
              </Link>
            ))}
          </div>

          {selectedCaps.length > 0 ? (
            <div className="g-google-band" style={{ marginTop: 18, padding: 18 }}>
              <div className="g-block-title" style={{ marginBottom: 10 }}>Google Cloud capabilities that address this</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedCaps.map((c) => (
                  <span key={c.id} className="g-badge google" title={c.oneLiner}>
                    {c.name}
                  </span>
                ))}
              </div>
              <p className="g-micro" style={{ marginTop: 10 }}>
                Full mapping in <Link href="/governance/google" style={{ textDecoration: "underline" }}>08 · Google Cloud</Link>.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
