"use client";

import { useMemo } from "react";
import type { Model } from "@/lib/llm-landscape/types";
import { byReleaseAsc, parseReleased, vendorHue } from "@/lib/llm-landscape/model";
import { Released, StatusPill, TierTag, VendorDot } from "./ui";

type QuarterBucket = {
  key: string;
  label: string;
  year: number;
  t1: Model[];
  t2: Model[];
  t3: Model[];
};

function quarterKey(m: Model): string | null {
  const r = parseReleased(m.released);
  return r.quarter ? r.quarter.replace(" ", "-") : null;
}

export default function Timeline({
  models,
  onSelect,
}: {
  models: Model[];
  onSelect: (id: string) => void;
}) {
  const { buckets, undated } = useMemo(() => {
    const sorted = [...models].sort(byReleaseAsc);
    const map = new Map<string, QuarterBucket>();
    const undated: Model[] = [];
    for (const m of sorted) {
      const key = quarterKey(m);
      if (!key) {
        undated.push(m);
        continue;
      }
      const r = parseReleased(m.released);
      if (!map.has(key)) {
        map.set(key, { key, label: r.quarter!, year: r.year!, t1: [], t2: [], t3: [] });
      }
      const b = map.get(key)!;
      if (m.tier === 1) b.t1.push(m);
      else if (m.tier === 2) b.t2.push(m);
      else b.t3.push(m);
    }
    return { buckets: [...map.values()], undated };
  }, [models]);

  const maxCount = Math.max(1, ...buckets.map((b) => b.t1.length + b.t2.length + b.t3.length));

  const jump = (key: string) => {
    document.getElementById(`q-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="timeline">
      {/* Density ribbon — five years in one gesture */}
      <div className="ribbon" role="navigation" aria-label="Jump to quarter">
        {buckets.map((b) => {
          const total = b.t1.length + b.t2.length + b.t3.length;
          const showYear = b.label.endsWith("Q1") || b === buckets[0];
          return (
            <button
              key={b.key}
              className="ribbon-col"
              onClick={() => jump(b.key)}
              title={`${b.label} — ${total} release${total === 1 ? "" : "s"}`}
            >
              <span className="ribbon-bars" aria-hidden>
                <span className="rb rb3" style={{ height: `${(b.t3.length / maxCount) * 100}%` }} />
                <span className="rb rb2" style={{ height: `${(b.t2.length / maxCount) * 100}%` }} />
                <span className="rb rb1" style={{ height: `${(b.t1.length / maxCount) * 100}%` }} />
              </span>
              <span className={`ribbon-label ${showYear ? "" : "dim"}`}>
                {showYear ? b.year : "·"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vertical spine */}
      <div className="spine">
        {buckets.map((b, i) => {
          const yearBreak = i === 0 || buckets[i - 1].year !== b.year;
          return (
            <section key={b.key} id={`q-${b.key}`} className="quarter">
              {yearBreak && <h2 className="year-mark">{b.year}</h2>}
              <h3 className="quarter-mark">{b.label}</h3>

              {[...b.t1, ...b.t2].sort(byReleaseAsc).map((m) => (
                <article
                  key={m.id}
                  className={`card card-t${m.tier}`}
                  style={{ borderLeftColor: vendorHue(m.vendor) }}
                  onClick={() => onSelect(m.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && onSelect(m.id)}
                >
                  <div className="card-top">
                    <VendorDot vendor={m.vendor} />
                    <TierTag tier={m.tier} />
                    <StatusPill status={m.status} />
                    <Released model={m} />
                  </div>
                  <h4 className="card-name">{m.name}</h4>
                  {m.why_it_mattered && <p className="card-why">{m.why_it_mattered}</p>}
                  <div className="card-foot">
                    {m.last_verified && <span className="verified">verified {m.last_verified}</span>}
                    <span className="open-hint">open record →</span>
                  </div>
                </article>
              ))}

              {b.t3.length > 0 && (
                <div className="stub-row">
                  {b.t3.map((m) => (
                    <span
                      key={m.id}
                      className="stub"
                      style={{ borderColor: vendorHue(m.vendor) }}
                      title={`${m.name} — ${m.vendor}${m.note ? ` · ${m.note}` : ""}`}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {undated.length > 0 && (
          <section className="quarter">
            <h3 className="quarter-mark">date not published</h3>
            <div className="stub-row">
              {undated.map((m) =>
                m.tier === 3 ? (
                  <span key={m.id} className="stub" title={m.vendor}>
                    {m.name}
                  </span>
                ) : (
                  <button key={m.id} className="stub stub-link" onClick={() => onSelect(m.id)}>
                    {m.name} →
                  </button>
                ),
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
