"use client";

import { useState } from "react";
import { VENDORS } from "@/lib/harness/vendors";
import { capById } from "@/lib/harness/capabilities";

/** §06 — architectural philosophies, fact → interpretation → implication. */
export default function Landscape() {
  const [sel, setSel] = useState(VENDORS[0].id);
  const v = VENDORS.find((x) => x.id === sel)!;

  return (
    <>
      <div className="hx-land-tabs">
        {VENDORS.map((x) => (
          <button key={x.id} className={`hx-wl-tab ${sel === x.id ? "on" : ""}`} onClick={() => setSel(x.id)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className="hx-land-body" style={{ ["--vend-c" as string]: `hsl(${v.hue} 65% 45%)` }}>
        <div>
          <div
            style={{
              fontSize: 12.5,
              fontStyle: "italic",
              color: "var(--hx-ink-soft)",
              marginBottom: 12,
              lineHeight: 1.45,
            }}
          >
            “{v.philosophy}”
          </div>
          <div className="hx-land-stack">
            <div className="hx-land-cell">
              <div className="k">Application / surface protocols</div>
              <div className="v">{v.layers.protocols}</div>
            </div>
            <div className="hx-land-cell">
              <div className="k">Managed runtime</div>
              <div className="v">{v.layers.runtime}</div>
            </div>
            <div className="hx-land-cell hl">
              <div className="k">Harness</div>
              <div className="v">{v.layers.harness}</div>
            </div>
            <div className="hx-land-cell">
              <div className="k">Models</div>
              <div className="v">{v.layers.models}</div>
            </div>
          </div>

          <div className="hx-own-row">
            {Object.entries(v.ownership).map(([capId, who]) => (
              <span key={capId} className={`hx-own ${who}`} title={`${capById(capId).name}: ${who}`}>
                {capById(capId).name} · {who === "platform" ? "vendor" : who === "developer" ? "you" : "shared"}
              </span>
            ))}
          </div>
        </div>

        <div className="hx-fii">
          <div className="hx-card hx-fii-block fact">
            <span className="k">Fact</span>
            <ul>
              {v.facts.map((f) => (
                <li key={f.text}>
                  {f.text}{" "}
                  {f.source && (
                    <span className="src-inline">
                      —{" "}
                      <a href={f.source.url} target="_blank" rel="noreferrer">
                        {f.source.label}
                      </a>
                      , {f.source.date}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="hx-card hx-fii-block interp">
            <span className="k">Interpretation (analyst)</span>
            <p>{v.interpretation}</p>
          </div>
          <div className="hx-card hx-fii-block impl">
            <span className="k">Implication for buyers</span>
            <p>{v.implication}</p>
            <p style={{ marginTop: 8, fontSize: 12.5 }}>
              <strong>Portability — </strong>
              models: {v.portability.models}. Harness: {v.portability.harness}. Tools: {v.portability.tools}.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
