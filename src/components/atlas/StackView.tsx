"use client";

import type { LayerId, LayerState } from "@/lib/atlas/types";
import { LAYERS } from "@/lib/atlas/taxonomy";

const HEAT = ["#f1efe9", "#dfe6f6", "#b3c6ee", "#6f93dd"];
export const heatColor = (h: number) => HEAT[Math.max(0, Math.min(3, h))];

/**
 * The 14-layer stack for one historical state, energy at the bottom. Heat
 * (attention/investment, 0–3) fills the bar; `compare` marks layers whose heat
 * rose (green edge) or fell (red edge) versus another period.
 */
export default function StackView({
  layers, compare, onLayer, active, dense,
}: {
  layers: Partial<Record<LayerId, LayerState>>;
  compare?: Partial<Record<LayerId, LayerState>>;
  onLayer?: (l: LayerId) => void;
  active?: LayerId | null;
  dense?: boolean;
}) {
  return (
    <div className="at-stackviz" role="list" aria-label="AI stack, layer 1 (energy) at the bottom">
      {LAYERS.map((L) => {
        const s = layers[L.id];
        const h = s?.heat ?? 0;
        const c = compare?.[L.id]?.heat;
        const delta = c == null ? 0 : h - c;
        return (
          <div key={L.id} role="listitem" className={`at-layer ${delta > 0 ? "delta-up" : delta < 0 ? "delta-down" : ""}`}
            style={{ cursor: onLayer ? "pointer" : undefined, outline: active === L.id ? "2px solid var(--ink)" : undefined, minHeight: dense ? 30 : undefined }}
            onClick={() => onLayer?.(L.id)} tabIndex={onLayer ? 0 : undefined}
            onKeyDown={(e) => { if (onLayer && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onLayer(L.id); } }}
            aria-label={`${L.name}: attention ${h} of 3${delta ? `, ${delta > 0 ? "up" : "down"} ${Math.abs(delta)} vs comparison` : ""}. ${s?.state ?? ""}`}>
            <span className="heat" style={{ width: `${(h / 3) * 100}%`, background: heatColor(h) }} />
            <span className="lnum">{String(L.n).padStart(2, "0")}</span>
            <span className="lname">{L.short}{delta !== 0 && <span className="at-xs" style={{ marginLeft: 6, color: delta > 0 ? "var(--agree)" : "var(--disagree)" }}>{delta > 0 ? "▲" : "▼"}{Math.abs(delta)}</span>}</span>
            {!dense && <span className="lstate">{s?.state ? s.state.replace(/\s*\(?ev-[a-z0-9-]+(?:\s*,\s*ev-[a-z0-9-]+)*\)?/g, "") : <span className="at-faint">—</span>}</span>}
          </div>
        );
      })}
    </div>
  );
}

export function HeatLegend() {
  return (
    <div className="at-row at-xs at-muted">
      Attention & investment:
      {["none", "peripheral", "significant", "central"].map((l, i) => (
        <span key={l} className="at-row" style={{ gap: 4 }}><span style={{ width: 14, height: 10, borderRadius: 3, background: HEAT[i], border: "1px solid var(--line)" }} />{l}</span>
      ))}
    </div>
  );
}
