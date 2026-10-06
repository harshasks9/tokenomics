"use client";

import type { Model, WorkloadInput } from "@/lib/pricing/types";
import { BENCHMARKS } from "@/lib/pricing/benchmarks";
import { providerById, providerColor } from "@/lib/pricing/presets";
import { estimateCost, fmtPerM, fmtUsd } from "@/lib/pricing/calc";

function ctx(k: number) {
  return k >= 1000 ? `${(k / 1000).toFixed(k % 1000 ? 2 : 0)}M` : `${k}k`;
}

export default function Compare({
  models,
  selected,
  workload,
  onRemove,
}: {
  models: Model[];
  selected: string[];
  workload: WorkloadInput;
  onRemove: (id: string) => void;
}) {
  const picked = selected.map((id) => models.find((m) => m.id === id)).filter(Boolean) as Model[];
  if (picked.length === 0) {
    return (
      <div className="px-card px-cmp-empty">
        Add up to four models from the capability matrix above (the <strong>+ add</strong> buttons) to compare them side by side.
      </div>
    );
  }

  const costs = picked.map((m) => estimateCost(m, workload));
  const bestIdx = (vals: (number | null)[], lowerBetter: boolean) => {
    let best = -1;
    vals.forEach((v, i) => {
      if (v == null) return;
      if (best < 0 || (lowerBetter ? v < vals[best]! : v > vals[best]!)) best = i;
    });
    return vals.filter((v) => v != null).length > 1 ? best : -1;
  };

  type Row = { label: string; cells: React.ReactNode[]; best?: number };
  const rows: Row[] = [];
  const num = (label: string, vals: (number | null)[], fmt: (v: number | null) => string, lowerBetter: boolean) =>
    rows.push({ label, cells: vals.map((v) => fmt(v)), best: bestIdx(vals, lowerBetter) });

  num("Input $/1M", picked.map((m) => m.pricing.input), fmtPerM, true);
  num("Output $/1M", picked.map((m) => m.pricing.output), fmtPerM, true);
  num("Cached input $/1M", picked.map((m) => m.pricing.cachedInput ?? null), fmtPerM, true);
  rows.push({ label: "Batch discount", cells: picked.map((m) => (m.pricing.batchDiscount ? `−${Math.round(m.pricing.batchDiscount * 100)}%` : "none")) });
  num("Your workload / month", costs.map((c) => (c.complete ? c.monthly : null)), (v) => (v == null ? "n/a" : fmtUsd(v)), true);
  num("Context (tokens)", picked.map((m) => m.contextK), (v) => ctx(v!), false);
  num("Max output", picked.map((m) => m.maxOutputK), (v) => (v == null ? "n/a" : `${v}k`), false);
  rows.push({ label: "Inputs", cells: picked.map((m) => m.modalitiesIn.join(", ")) });
  rows.push({ label: "Tool calling", cells: picked.map((m) => (m.features.toolCalling ? "yes" : "no")) });
  rows.push({ label: "Structured output", cells: picked.map((m) => (m.features.structuredOutput ? "yes" : "no")) });
  rows.push({ label: "Reasoning", cells: picked.map((m) => m.features.reasoning) });
  rows.push({ label: "Prompt caching", cells: picked.map((m) => m.features.caching) });
  rows.push({ label: "Open weights", cells: picked.map((m) => m.license ?? "no (proprietary)") });
  rows.push({ label: "Deployment", cells: picked.map((m) => m.deployment.join(", ")) });
  for (const b of BENCHMARKS) {
    const vals = picked.map((m) => m.benchmarks[b.id]?.score ?? null);
    if (vals.every((v) => v == null)) continue;
    rows.push({
      label: b.short,
      cells: picked.map((m) => {
        const s = m.benchmarks[b.id];
        return s ? (
          <span key={m.id}>
            {s.score}
            {s.selfReported && <span className="sub"> (vendor)</span>}
          </span>
        ) : (
          <span key={m.id} className="sub">n/a</span>
        );
      }),
      best: bestIdx(vals, !b.higherBetter),
    });
  }
  rows.push({ label: "Trade-off", cells: picked.map((m) => <span key={m.id} style={{ fontSize: 12.5, whiteSpace: "normal" }}>{m.tradeoff}</span>) });
  rows.push({
    label: "Verification",
    cells: picked.map((m) => (
      <span key={m.id}>
        {m.verification} · {m.lastVerified}
        {m.unverified?.length ? <div className="sub" style={{ whiteSpace: "normal" }}>{m.unverified.join(" ")}</div> : null}
      </span>
    )),
  });

  return (
    <div className="px-card px-compare">
      <table className="px-ctable">
        <thead>
          <tr>
            <th />
            {picked.map((m) => (
              <th key={m.id}>
                <span style={{ color: providerColor(m.provider), marginRight: 6 }} aria-hidden>
                  {providerById(m.provider).glyph}
                </span>
                {m.name}
                <div className="sub">
                  {providerById(m.provider).name} ·{" "}
                  <button className="px-cmp-btn" onClick={() => onRemove(m.id)} style={{ padding: "1px 6px" }}>
                    remove
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th>{r.label}</th>
              {r.cells.map((c, i) => (
                <td key={i} className={r.best === i ? "best" : ""}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", padding: "8px 12px 10px" }}>
        Green = best value in the row among the compared models (lowest price/cost, highest capability). Benchmark rows show n/a where no comparable score exists.
      </div>
    </div>
  );
}
