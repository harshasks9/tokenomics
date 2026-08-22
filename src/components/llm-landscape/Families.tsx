"use client";

import { useMemo, useState } from "react";
import type { Model } from "@/lib/llm-landscape/types";
import { byReleaseAsc, parseReleased, vendorHue } from "@/lib/llm-landscape/model";
import { TierTag } from "./ui";

export default function Families({
  models,
  allModels,
  onSelect,
}: {
  models: Model[]; // filtered set — decides which families show
  allModels: Model[]; // full set — chains render complete
  onSelect: (id: string) => void;
}) {
  const [openShift, setOpenShift] = useState<string | null>(null);

  const families = useMemo(() => {
    const visible = new Set(models.map((m) => m.family));
    const byFamily = new Map<string, Model[]>();
    for (const m of allModels) {
      if (!visible.has(m.family)) continue;
      if (!byFamily.has(m.family)) byFamily.set(m.family, []);
      byFamily.get(m.family)!.push(m);
    }
    const out = [...byFamily.entries()]
      .filter(([, ms]) => ms.length >= 2)
      .map(([name, ms]) => ({ name, models: ms.sort(byReleaseAsc) }));
    out.sort(
      (a, b) =>
        b.models.filter((m) => m.tier < 3).length - a.models.filter((m) => m.tier < 3).length ||
        b.models.length - a.models.length,
    );
    return out;
  }, [models, allModels]);

  const nameOf = (id: string | null) =>
    id ? (allModels.find((m) => m.id === id)?.name ?? id) : null;

  return (
    <div className="families">
      <p className="families-hint">
        Chains follow <code>predecessor_id</code>, oldest at the top. A{" "}
        <span className="shift-chip demo">perception shifted</span> marker means the record documents a
        material move in market perception after that generation launched — click it to read the shift.
      </p>
      <div className="family-grid">
        {families.map((f) => (
          <section key={f.name} className="family">
            <h3 className="family-name">
              <span
                className="vendor-dot"
                style={{ background: vendorHue(f.models[0].vendor) }}
                aria-hidden
              />
              {f.name}
              <span className="family-count">{f.models.length}</span>
            </h3>
            <ol className="chain">
              {f.models.map((m, i) => {
                const prev = i > 0 ? f.models[i - 1] : null;
                const branch =
                  m.predecessor_id && prev && m.predecessor_id !== prev.id
                    ? nameOf(m.predecessor_id)
                    : null;
                const shifted = Boolean(m.reputation_shift);
                const r = parseReleased(m.released);
                const interactive = m.tier < 3;
                return (
                  <li key={m.id} className={`node node-t${m.tier} ${shifted ? "node-shift" : ""}`}>
                    {branch && <div className="branch">↳ from {branch}</div>}
                    <div
                      className={`node-body ${interactive ? "node-link" : ""}`}
                      onClick={interactive ? () => onSelect(m.id) : undefined}
                      role={interactive ? "button" : undefined}
                      tabIndex={interactive ? 0 : undefined}
                      onKeyDown={
                        interactive ? (e) => e.key === "Enter" && onSelect(m.id) : undefined
                      }
                    >
                      <span className="node-name">{m.name}</span>
                      <span className="node-date">{r.display}</span>
                      <TierTag tier={m.tier} />
                    </div>
                    {shifted && (
                      <button
                        className="shift-chip"
                        onClick={() => setOpenShift(openShift === m.id ? null : m.id)}
                        aria-expanded={openShift === m.id}
                      >
                        perception shifted {openShift === m.id ? "▾" : "▸"}
                      </button>
                    )}
                    {shifted && openShift === m.id && (
                      <blockquote className="shift-text">{m.reputation_shift}</blockquote>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
