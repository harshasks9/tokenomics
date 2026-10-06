"use client";

import { useMemo, useState } from "react";
import { Check, Minus, X } from "lucide-react";
import type { Model } from "@/lib/pricing/types";
import { providerById, providerColor } from "@/lib/pricing/presets";
import { fmtPerM } from "@/lib/pricing/calc";

type Col = "name" | "input" | "output" | "cachedInput" | "contextK" | "maxOutputK" | "aa";

function ctx(k: number) {
  return k >= 1000 ? `${(k / 1000).toFixed(k % 1000 ? 2 : 0)}M` : `${k}k`;
}

const Yes = ({ t }: { t?: string }) => (
  <span className="px-yes">
    <Check size={12} /> {t ?? "yes"}
  </span>
);
const No = ({ t }: { t?: string }) => (
  <span className="px-no">
    <X size={12} /> {t ?? "no"}
  </span>
);
const Part = ({ t }: { t: string }) => (
  <span className="px-part">
    <Minus size={12} /> {t}
  </span>
);

export default function CapabilityMatrix({
  models,
  compare,
  onToggleCompare,
}: {
  models: Model[];
  compare: string[];
  onToggleCompare: (id: string) => void;
}) {
  const [sort, setSort] = useState<{ col: Col; asc: boolean }>({ col: "input", asc: true });

  const sorted = useMemo(() => {
    const val = (m: Model): number | string | null => {
      switch (sort.col) {
        case "name":
          return m.name;
        case "input":
          return m.pricing.input;
        case "output":
          return m.pricing.output;
        case "cachedInput":
          return m.pricing.cachedInput ?? null;
        case "contextK":
          return m.contextK;
        case "maxOutputK":
          return m.maxOutputK;
        case "aa":
          return m.benchmarks["aa-index"]?.score ?? null;
      }
    };
    return [...models].sort((a, b) => {
      const av = val(a);
      const bv = val(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const c = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sort.asc ? c : -c;
    });
  }, [models, sort]);

  const th = (col: Col, label: string) => (
    <th className="sortable" onClick={() => setSort((s) => ({ col, asc: s.col === col ? !s.asc : true }))} aria-sort={sort.col === col ? (sort.asc ? "ascending" : "descending") : "none"}>
      {label} {sort.col === col ? (sort.asc ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div className="px-card px-matrix-wrap">
      <table className="px-matrix">
        <thead>
          <tr>
            {th("name", "Model")}
            {th("input", "Input $/1M")}
            {th("output", "Output $/1M")}
            {th("cachedInput", "Cached in")}
            <th>Batch</th>
            {th("contextK", "Context")}
            {th("maxOutputK", "Max out")}
            <th>Inputs</th>
            <th>Tools</th>
            <th>Structured</th>
            <th>Reasoning</th>
            <th>Caching</th>
            <th>Fine-tune</th>
            <th>Weights</th>
            {th("aa", "AA Index")}
            <th>Verified</th>
            <th>Compare</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((m) => {
            const on = compare.includes(m.id);
            const full = compare.length >= 4 && !on;
            return (
              <tr key={m.id}>
                <td className="model">
                  <span style={{ color: providerColor(m.provider), marginRight: 6 }} aria-hidden>
                    {providerById(m.provider).glyph}
                  </span>
                  {m.name}
                  <div className="sub">
                    {providerById(m.provider).name} · {m.status}
                    {m.thirdPartyPricing ? " · 3rd-party price" : ""}
                  </div>
                </td>
                <td className="px-num">{fmtPerM(m.pricing.input)}</td>
                <td className="px-num">{fmtPerM(m.pricing.output)}</td>
                <td className="px-num">{fmtPerM(m.pricing.cachedInput)}</td>
                <td>{m.pricing.batchDiscount ? <Yes t={`−${Math.round(m.pricing.batchDiscount * 100)}%`} /> : <No t="—" />}</td>
                <td className="px-num">{ctx(m.contextK)}</td>
                <td className="px-num">{m.maxOutputK == null ? <span className="sub">n/a</span> : `${m.maxOutputK}k`}</td>
                <td>{m.modalitiesIn.join(" · ")}</td>
                <td>{m.features.toolCalling ? <Yes /> : <No />}</td>
                <td>{m.features.structuredOutput ? <Yes /> : <No />}</td>
                <td>{m.features.reasoning === "always" ? <Yes t="always on" /> : m.features.reasoning === "optional" ? <Yes t="optional" /> : <No />}</td>
                <td>{m.features.caching === "none" ? <No /> : <Part t={m.features.caching} />}</td>
                <td>{m.features.fineTuning ? <Yes /> : <No />}</td>
                <td>{m.license ? <Yes t="open" /> : <No t="closed" />}</td>
                <td className="px-num">{m.benchmarks["aa-index"]?.score ?? <span className="sub">n/a</span>}</td>
                <td>
                  <span className={`px-badge ${m.verification === "official" ? "" : m.verification === "indexed" ? "prev" : "unv"}`} title={m.unverified?.join(" ")}>
                    {m.verification === "official" ? "official" : m.verification === "indexed" ? "indexed" : "secondary"} · {m.lastVerified.slice(5)}
                  </span>
                </td>
                <td>
                  <button className={`px-cmp-btn ${on ? "on" : ""}`} disabled={full} onClick={() => onToggleCompare(m.id)} aria-pressed={on} title={full ? "Up to four models" : ""}>
                    {on ? "added" : "+ add"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", padding: "10px 10px 6px" }}>
        <strong style={{ color: "var(--ink-2)" }}>Supported ≠ measured.</strong> Feature columns are vendor-documented support; the AA Index column is an independent
        measurement (v4.3 only). &quot;indexed&quot; verification means the official page was read through search-index extracts and cross-checked with ≥2 trackers
        because the official domain was unreachable at verification time.
      </div>
    </div>
  );
}
