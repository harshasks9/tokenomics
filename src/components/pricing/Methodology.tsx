"use client";

import type { Model } from "@/lib/pricing/types";
import { BENCHMARKS } from "@/lib/pricing/benchmarks";
import { PROVIDERS, providerById } from "@/lib/pricing/presets";

export default function Methodology({ models, catalogDate }: { models: Model[]; catalogDate: string }) {
  return (
    <>
      <div className="px-method">
        <div className="px-card">
          <h4>Data &amp; verification</h4>
          <ul>
            <li>Prices are USD per 1M tokens at the standard (lowest) context tier, first-party API unless a model is marked 3rd-party hosted.</li>
            <li>
              Each model lists its sources and a verification level: <strong>official</strong> (page fetched directly), <strong>indexed</strong> (official page via
              search-index extracts + ≥2 independent trackers; official domain unreachable at verification), <strong>secondary</strong> (third-party only).
            </li>
            <li>Unverifiable facts are listed per model as “unverified” and rendered as n/a — never estimated. New models without comparable scores are excluded from the scatter rather than guessed.</li>
            <li>Catalog snapshot {catalogDate}; the daily job overlays confirmed changes and logs them in News.</li>
          </ul>
        </div>
        <div className="px-card">
          <h4>How the calculator works</h4>
          <ul>
            <li>Monthly cost = requests × [(1 − hit) × input tokens × input price + hit × input tokens × cached price + output tokens × output price], minus batch discount on the batch-eligible share.</li>
            <li>If average input exceeds a model’s long-context threshold, the whole request prices at the long-context tier (vendor rule).</li>
            <li>Cached price falls back to full input price where none is published; models without caching ignore the hit rate; models without a batch tier ignore the batch share.</li>
            <li>Excluded: cache-write fees, cache storage, tool/search/grounding surcharges, off-peak schedules, provisioned throughput and committed-use discounts.</li>
          </ul>
        </div>
        <div className="px-card">
          <h4>Limitations</h4>
          <ul>
            <li>Benchmarks mix independent and vendor-reported scores (flagged); SWE-bench Verified scores depend on each vendor’s scaffold.</li>
            <li>AA Index values are v4.3 only; earlier index versions are excluded as non-comparable, so some models lack an index value.</li>
            <li>Third-party host prices (e.g., Together AI) change frequently and differ by host; regional and cloud-marketplace pricing differ from first-party.</li>
            <li>Moonshot (Kimi), Microsoft Azure OpenAI pricing and image/audio generation models are out of scope in this snapshot.</li>
          </ul>
        </div>
      </div>

      <div className="px-card px-sources">
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink)", marginBottom: 6 }}>Source register</div>
        <div className="row" style={{ borderTop: 0, fontWeight: 700, color: "var(--ink-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          <span>Model</span>
          <span>Sources</span>
          <span>Last verified</span>
        </div>
        {models.map((m) => (
          <div key={m.id} className="row">
            <span>
              {m.name} <span style={{ color: "var(--ink-3)" }}>· {providerById(m.provider).name}</span>
            </span>
            <span>
              {m.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && " · "}
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </span>
              ))}
              {m.unverified?.length ? <div style={{ color: "var(--warn)", fontSize: 11.5 }}>Unverified: {m.unverified.join(" ")}</div> : null}
            </span>
            <span>
              {m.lastVerified} <span style={{ color: "var(--ink-3)" }}>({m.verification})</span>
            </span>
          </div>
        ))}
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink)", margin: "16px 0 6px" }}>Benchmark sources</div>
        {BENCHMARKS.map((b) => (
          <div key={b.id} className="row">
            <span>{b.name}</span>
            <span>
              <a href={b.source.url} target="_blank" rel="noreferrer">
                {b.source.label}
              </a>
              {b.caveat && <div style={{ color: "var(--ink-3)", fontSize: 11.5 }}>{b.caveat}</div>}
            </span>
            <span>{b.snapshot}</span>
          </div>
        ))}
        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--ink)", margin: "16px 0 6px" }}>Official pricing pages</div>
        {PROVIDERS.map((p) => (
          <div key={p.id} className="row">
            <span>{p.name}</span>
            <span>
              <a href={p.pricingUrl} target="_blank" rel="noreferrer">
                {p.pricingUrl}
              </a>
            </span>
            <span />
          </div>
        ))}
      </div>
    </>
  );
}
