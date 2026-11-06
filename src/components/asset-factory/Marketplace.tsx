"use client";

import { Info, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { AssetType, TrustTier, Visibility } from "@/lib/asset-factory/types";
import type { AssetView } from "@/lib/asset-factory/views";
import { useFactory } from "./state";
import { AssetCard, SectionHead, TRUST, TYPE_LABEL, VIS } from "./ui";

const STOP = new Set(["the", "and", "for", "with", "our", "my", "a", "to", "of", "in", "on", "too", "many", "help", "me", "find", "agent"]);

function score(a: AssetView, tokens: string[]): number {
  if (!tokens.length) return 1;
  const hay = [a.name, a.summary, a.description, ...a.tags, ...a.industries, ...a.outcomes, a.type].join(" ").toLowerCase();
  let s = 0;
  for (const t of tokens) {
    const stem = t.length > 5 ? t.slice(0, t.length - 2) : t; // deliveries → deliver, deviations → deviatio
    if (hay.includes(stem)) s += a.name.toLowerCase().includes(stem) ? 3 : 1;
  }
  return s >= Math.ceil(tokens.length / 2) ? s : 0;
}

const TYPES: (AssetType | "all")[] = ["all", "blueprint", "skill", "connector", "workflow", "evaluation"];
const TRUSTS: (TrustTier | "all")[] = ["all", "verified", "field", "community"];

const COPY = {
  customer: { eyebrow: "Solutions", title: "Find a proven agent for your business problem", lede: "Search by the problem you have. Every listing shows business outcomes, prerequisites, security considerations and modeled run cost before you commit to anything." },
  google: { eyebrow: "Asset discovery", title: "Reuse what already works across customers", lede: "The same shared catalog customers and partners see — plus Google-internal assets, which only Google employees receive from the server." },
  partner: { eyebrow: "Marketplace", title: "Approved community assets to build on", lede: "Build customer agents from reusable components, fork and improve them, and publish your own." },
} as const;

export default function Marketplace() {
  const { view, persona, query, setQuery } = useFactory();
  const [type, setType] = useState<AssetType | "all">("all");
  const [trust, setTrust] = useState<TrustTier | "all">("all");
  const [vis, setVis] = useState<Visibility | "all">("all");
  const [industry, setIndustry] = useState("all");
  const [sort, setSort] = useState<"deployed" | "rated" | "new">("deployed");

  const assets = useMemo(() => view?.assets ?? [], [view]);
  const industries = useMemo(() => [...new Set(assets.flatMap((a) => a.industries))].sort(), [assets]);
  const visibilities = useMemo(() => [...new Set(assets.map((a) => a.visibility))], [assets]);

  const results = useMemo(() => {
    const tokens = query.toLowerCase().split(/[^a-z0-9-]+/).filter((t) => t.length > 2 && !STOP.has(t));
    return assets
      .map((a) => ({ a, s: score(a, tokens) }))
      .filter(({ a, s }) => s > 0 && (type === "all" || a.type === type) && (trust === "all" || a.trust === trust) && (vis === "all" || a.visibility === vis) && (industry === "all" || a.industries.includes(industry)))
      .sort((x, y) => (tokens.length ? y.s - x.s : 0) || (sort === "rated" ? y.a.rating - x.a.rating : sort === "new" ? y.a.updatedAt.localeCompare(x.a.updatedAt) : y.a.deployments - x.a.deployments))
      .map(({ a }) => a);
  }, [assets, query, type, trust, vis, industry, sort]);

  if (!view) return null;
  const copy = COPY[persona];

  return (
    <div>
      <div className="af-page-head">
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="af-eyebrow">{copy.eyebrow}</div>
          <h1 className="af-h1">{copy.title}</h1>
          <p className="af-lede">{copy.lede}</p>
        </div>
      </div>

      <div className="af-card" style={{ marginBottom: 16 }}>
        <div className="af-row" style={{ gap: 10 }}>
          <label className="af-search">
            <span className="af-sr">Search assets</span>
            <Search size={16} />
            <input className="af-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={persona === "customer" ? "Describe a business problem…" : "Search blueprints, skills, connectors…"} />
          </label>
          <select className="af-select" style={{ width: "auto" }} value={industry} onChange={(e) => setIndustry(e.target.value)} aria-label="Industry">
            <option value="all">All industries</option>
            {industries.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <select className="af-select" style={{ width: "auto" }} value={vis} onChange={(e) => setVis(e.target.value as Visibility | "all")} aria-label="Visibility">
            <option value="all">Any visibility</option>
            {visibilities.map((v) => <option key={v} value={v}>{VIS[v].label}</option>)}
          </select>
          <select className="af-select" style={{ width: "auto" }} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort">
            <option value="deployed">Most deployed</option>
            <option value="rated">Top rated</option>
            <option value="new">Recently updated</option>
          </select>
        </div>
        <div className="af-row" style={{ marginTop: 12, gap: 14 }}>
          <div className="af-chips" role="group" aria-label="Asset type">
            {TYPES.map((t) => <button key={t} type="button" className="af-chip" aria-pressed={type === t} onClick={() => setType(t)}>{t === "all" ? "All types" : `${TYPE_LABEL[t]}s`}</button>)}
          </div>
          <div className="af-chips" role="group" aria-label="Trust tier">
            {TRUSTS.map((t) => <button key={t} type="button" className="af-chip" aria-pressed={trust === t} onClick={() => setTrust(t)}>{t === "all" ? "Any trust tier" : TRUST[t].label}</button>)}
          </div>
        </div>
      </div>

      <div className="af-banner info" style={{ marginBottom: 16 }}>
        <Info size={16} />
        <div>
          <b>Three trust tiers.</b> <i>Google verified</i> assets are officially reviewed and supported by Google. <i>Field validated</i> assets run in production in at least two FDE-led engagements. <i>Community</i> assets come from verified contributors but are not certified by Google — a verified contributor badge confirms who published it, not that Google endorses it.
        </div>
      </div>

      <SectionHead title={`${results.length} assets`} sub={query ? `matching “${query}”` : `you can see ${assets.length} — the server decided which`} right={query ? <button type="button" className="af-btn sm" onClick={() => setQuery("")}>Clear search</button> : undefined} />
      {results.length ? (
        <div className="af-grid c3">{results.map((a) => <AssetCard key={a.id} a={a} extra={persona === "customer" && a.outcomes[0] ? <span>· {a.outcomes[0]}</span> : undefined} />)}</div>
      ) : (
        <div className="af-empty">Nothing matches yet. Try fewer words, or describe the outcome you want.</div>
      )}
    </div>
  );
}
