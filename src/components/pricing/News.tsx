"use client";

import { useState } from "react";
import type { NewsItem, ProviderId } from "@/lib/pricing/types";
import { PROVIDERS, providerColor } from "@/lib/pricing/presets";

const KIND_LABEL: Record<NewsItem["kind"], string> = {
  "price-cut": "price cut",
  "price-increase": "price increase",
  "new-model": "new model",
  deprecation: "deprecation",
  "pricing-change": "pricing change",
  note: "note",
};

export default function News({ items, refreshedAt, live, catalogDate }: { items: NewsItem[]; refreshedAt: string | null; live: string; catalogDate: string }) {
  const [filter, setFilter] = useState<"all" | ProviderId>("all");
  const [kind, setKind] = useState<"all" | NewsItem["kind"]>("all");
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const shown = items.filter((n) => (filter === "all" || n.provider === filter) && (kind === "all" || n.kind === kind));

  return (
    <div className="px-news">
      <div>
        <div className="px-card px-filters" style={{ marginBottom: 12 }}>
          <span className="lbl">Provider</span>
          <button className={`px-chip ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>
            All
          </button>
          {PROVIDERS.filter((p) => items.some((n) => n.provider === p.id)).map((p) => (
            <button key={p.id} className={`px-chip ${filter === p.id ? "on" : ""}`} onClick={() => setFilter(p.id)}>
              <span className="sw" style={{ background: providerColor(p.id) }} aria-hidden /> {p.name}
            </button>
          ))}
          <span className="px-sep" />
          <span className="lbl">Type</span>
          {(["all", "price-cut", "price-increase", "new-model", "deprecation", "pricing-change"] as const).map((k) => (
            <button key={k} className={`px-chip ${kind === k ? "on" : ""}`} onClick={() => setKind(k)}>
              {k === "all" ? "All" : KIND_LABEL[k]}
            </button>
          ))}
        </div>
        <div className="px-card">
          {shown.length === 0 && <div className="px-cmp-empty">No items match.</div>}
          {shown.map((n) => (
            <div key={`${n.date}-${n.title}`} className="px-nitem">
              <div className="d">
                {n.date}
                {n.date > today && <div style={{ fontSize: 10, color: "var(--warn)", fontWeight: 700 }}>upcoming</div>}
                {n.generated && <div style={{ fontSize: 10, color: "var(--accent-deep)", fontWeight: 700 }}>auto-detected</div>}
              </div>
              <div>
                <div className="t">
                  <span className={`px-kind ${n.kind}`}>{KIND_LABEL[n.kind]}</span>
                  {n.provider !== "industry" && (
                    <span style={{ color: providerColor(n.provider), fontSize: 11 }} aria-hidden>
                      {PROVIDERS.find((p) => p.id === n.provider)?.glyph}
                    </span>
                  )}
                  {n.title}
                </div>
                <div className="b">{n.body}</div>
                {n.source && (
                  <div className="s">
                    <a href={n.source.url} target="_blank" rel="noreferrer">
                      {n.source.label} ↗
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-card px-news-side">
        <h4>How this feed stays current</h4>
        <ul>
          <li>
            <strong>Catalog snapshot:</strong> {catalogDate} — every price hand-verified against the sources listed per model.
          </li>
          <li>
            <strong>Daily refresh:</strong> a scheduled job re-reads the official pricing pages each morning (UTC), compares them with the catalog, and records any
            confirmed change here as an <em>auto-detected</em> item while updating the affected prices on this page.
          </li>
          <li>
            <strong>Last automated check:</strong>{" "}
            {refreshedAt ? new Date(refreshedAt).toUTCString().replace(":00 GMT", " UTC") : live === "loading" ? "loading…" : "none recorded yet (showing catalog values)"}
          </li>
          <li>
            <strong>Conservative by design:</strong> only exact model matches with high extraction confidence change a price; new models and anything ambiguous appear
            as news for a human to fold into the catalog.
          </li>
        </ul>
      </div>
    </div>
  );
}
