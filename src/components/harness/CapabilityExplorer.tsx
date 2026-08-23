"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { CAPABILITIES } from "@/lib/harness/capabilities";
import type { Lens } from "@/lib/harness/types";
import { Icon, LENS_LABEL } from "./ui";

export default function CapabilityExplorer({ lens }: { lens: Lens }) {
  const [sel, setSel] = useState(CAPABILITIES[0].id);
  const cap = CAPABILITIES.find((c) => c.id === sel)!;

  return (
    <>
      <div className="hx-cap-grid">
        {CAPABILITIES.map((c) => (
          <button
            key={c.id}
            className={`hx-cap-tile ${sel === c.id ? "on" : ""}`}
            style={{ ["--cap-c" as string]: `hsl(${c.hue} 70% 42%)` }}
            onClick={() => setSel(c.id)}
          >
            <span className="ic">
              <Icon name={c.icon} size={16} />
            </span>
            <span className="nm">{c.name}</span>
            <span className="q">{c.question}</span>
          </button>
        ))}
      </div>

      <div className="hx-card hx-cap-detail" style={{ ["--cap-c" as string]: `hsl(${cap.hue} 70% 42%)` }}>
        <h4>{cap.name}</h4>
        <div className="q">{cap.question}</div>
        <div className="body">
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: `hsl(${cap.hue} 70% 38%)`,
              display: "block",
              marginBottom: 4,
            }}
          >
            {LENS_LABEL[lens]} view
          </span>
          {cap.depth[lens]}
        </div>
        <div className="hx-cap-mechs">
          {cap.mechanisms.map((m) => (
            <span key={m} className="hx-pill">
              {m}
            </span>
          ))}
        </div>
        <div className="hx-cap-without">
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            <strong>Without it:</strong> {cap.withoutIt}
          </span>
        </div>
      </div>
    </>
  );
}
