"use client";

import { Info, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { AssetType, TrustTier, Visibility } from "@/lib/asset-factory/types";
import type { AssetView } from "@/lib/asset-factory/views";
import { useFactory } from "./state";
import { AssetCard, TRUST, TYPE_LABEL, VIS } from "./ui";

const STOP = new Set(["the", "and", "for", "with", "our", "my", "a", "to", "of", "in", "on", "too", "many", "help", "me", "find", "agent", "agents"]);

function score(a: AssetView, tokens: string[]): number {
  if (!tokens.length) return 1;
  const hay = [a.slug, a.name, a.summary, a.description, ...a.tags, ...a.industries, ...a.outcomes, a.type].join(" ").toLowerCase();
  let s = 0;
  for (const t of tokens) {
    const stem = t.length > 5 ? t.slice(0, t.length - 2) : t;
    if (hay.includes(stem)) s += a.name.toLowerCase().includes(stem) ? 3 : 1;
  }
  return s >= Math.ceil(tokens.length / 2) ? s : 0;
}

const COPY = {
  customer: { eyebrow: "Solutions", title: "Find a proven agent for your business problem", lede: "Search by the problem you have. Every package shows its real instructions, prerequisites, security notes and modeled run cost — and you can run it before you commit." },
  google: { eyebrow: "Asset discovery", title: "Reuse what already works across customers", lede: "The shared catalog customers and partners see, plus Google-internal packages that only Google employees receive from the server." },
  partner: { eyebrow: "Marketplace", title: "Approved community assets to build on", lede: "Inherit skills and blueprints, wire connectors, and publish your own packages under your organization." },
} as const;

type Facet<T extends string> = { value: T; label: string; count: number };

function FacetGroup<T extends string>({ title, items, selected, onToggle }: { title: string; items: Facet<T>[]; selected: Set<T>; onToggle: (v: T) => void }) {
  if (!items.length) return null;
  return (
    <div className="af-facet">
      <div className="af-facet-title">{title}</div>
      {items.map((f) => (
        <label key={f.value} className="af-facet-item">
          <input type="checkbox" checked={selected.has(f.value)} onChange={() => onToggle(f.value)} />
          <span>{f.label}</span>
          <span className="af-muted af-num">{f.count}</span>
        </label>
      ))}
    </div>
  );
}

function useSet<T>() {
  const [s, set] = useState<Set<T>>(new Set());
  const toggle = (v: T) => set((prev) => { const n = new Set(prev); if (n.has(v)) n.delete(v); else n.add(v); return n; });
  return [s, toggle, () => set(new Set())] as const;
}

export default function Marketplace() {
  const { view, persona, query, setQuery } = useFactory();
  const [types, toggleType, clearTypes] = useSet<AssetType>();
  const [trusts, toggleTrust, clearTrusts] = useSet<TrustTier>();
  const [vis, toggleVis, clearVis] = useSet<Visibility>();
  const [inds, toggleInd, clearInds] = useSet<string>();
  const [pubs, togglePub, clearPubs] = useSet<string>();
  const [sort, setSort] = useState<"relevance" | "deployed" | "rated" | "inherited" | "new">("deployed");

  const assets = useMemo(() => view?.assets ?? [], [view]);
  const tokens = useMemo(() => query.toLowerCase().split(/[^a-z0-9-]+/).filter((t) => t.length > 2 && !STOP.has(t)), [query]);
  const matched = useMemo(() => assets.map((a) => ({ a, s: score(a, tokens) })).filter((x) => x.s > 0), [assets, tokens]);

  const count = <T extends string>(key: (a: AssetView) => T | T[]) => {
    const m = new Map<T, number>();
    for (const { a } of matched) for (const k of ([] as T[]).concat(key(a))) m.set(k, (m.get(k) ?? 0) + 1);
    return m;
  };
  const typeCounts = count((a) => a.type);
  const trustCounts = count((a) => a.trust);
  const visCounts = count((a) => a.visibility);
  const indCounts = count((a) => a.industries);
  const pubCounts = count((a) => a.ownerLabel);

  const results = useMemo(() => matched
    .filter(({ a }) => (!types.size || types.has(a.type)) && (!trusts.size || trusts.has(a.trust)) && (!vis.size || vis.has(a.visibility)) && (!inds.size || a.industries.some((i) => inds.has(i))) && (!pubs.size || pubs.has(a.ownerLabel)))
    .sort((x, y) => (sort === "relevance" || (tokens.length && sort === "deployed") ? y.s - x.s : 0)
      || (sort === "rated" ? y.a.rating - x.a.rating : sort === "new" ? y.a.updatedAt.localeCompare(x.a.updatedAt) : sort === "inherited" ? y.a.forks - x.a.forks : y.a.deployments - x.a.deployments))
    .map(({ a }) => a), [matched, types, trusts, vis, inds, pubs, sort, tokens]);

  if (!view) return null;
  const copy = COPY[persona];
  const anyFilter = types.size + trusts.size + vis.size + inds.size + pubs.size > 0;
  const clearAll = () => { clearTypes(); clearTrusts(); clearVis(); clearInds(); clearPubs(); };

  return (
    <div>
      <div className="af-page-head">
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="af-eyebrow">{copy.eyebrow}</div>
          <h1 className="af-h1">{copy.title}</h1>
          <p className="af-lede">{copy.lede}</p>
        </div>
      </div>

      <div className="af-row" style={{ gap: 10, marginBottom: 16 }}>
        <label className="af-search">
          <span className="af-sr">Search packages</span>
          <Search size={16} />
          <input className="af-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={persona === "customer" ? "Describe a business problem — e.g. late supplier deliveries" : "Search skills, connectors, blueprints…"} />
        </label>
        <select className="af-select" style={{ width: "auto" }} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort">
          <option value="deployed">{tokens.length ? "Best match" : "Most deployed"}</option>
          <option value="inherited">Most inherited</option>
          <option value="rated">Top rated</option>
          <option value="new">Recently updated</option>
        </select>
      </div>

      <div className="af-catalog">
        <aside className="af-facets" aria-label="Filters">
          <FacetGroup title="Type" items={(["blueprint", "skill", "connector", "workflow", "evaluation"] as AssetType[]).filter((t) => typeCounts.get(t)).map((t) => ({ value: t, label: `${TYPE_LABEL[t]}s`, count: typeCounts.get(t)! }))} selected={types} onToggle={toggleType} />
          <FacetGroup title="Trust" items={(["verified", "field", "community"] as TrustTier[]).filter((t) => trustCounts.get(t)).map((t) => ({ value: t, label: TRUST[t].label, count: trustCounts.get(t)! }))} selected={trusts} onToggle={toggleTrust} />
          <FacetGroup title="Publisher" items={[...pubCounts.entries()].sort((a, b) => b[1] - a[1]).map(([value, c]) => ({ value, label: value, count: c }))} selected={pubs} onToggle={togglePub} />
          <FacetGroup title="Industry" items={[...indCounts.entries()].sort((a, b) => b[1] - a[1]).map(([value, c]) => ({ value, label: value, count: c }))} selected={inds} onToggle={toggleInd} />
          <FacetGroup title="Visibility" items={(["public", "org", "workspace", "internal"] as Visibility[]).filter((v) => visCounts.get(v)).map((v) => ({ value: v, label: VIS[v].label, count: visCounts.get(v)! }))} selected={vis} onToggle={toggleVis} />
          <div className="af-banner info" style={{ fontSize: 12 }}>
            <Info size={14} />
            <div><b>Community</b> packages come from verified contributors but aren&apos;t certified by Google. <b>Field validated</b> means 2+ FDE-led production deployments. <b>Google verified</b> is the official tier.</div>
          </div>
        </aside>

        <div style={{ minWidth: 0 }}>
          <div className="af-row between" style={{ marginBottom: 12 }}>
            <div className="af-muted" style={{ fontSize: 13 }}>
              <b style={{ color: "var(--ink)" }}>{results.length}</b> of {assets.length} packages you can see{query ? <> matching “{query}”</> : ""} · the server decided which
            </div>
            {(anyFilter || query) && <button type="button" className="af-btn sm ghost" onClick={() => { clearAll(); setQuery(""); }}><X size={13} />Clear</button>}
          </div>
          {results.length ? (
            <div className="af-grid c3">{results.map((a) => <AssetCard key={a.id} a={a} extra={persona === "customer" && a.outcomes[0] ? <span>· {a.outcomes[0]}</span> : undefined} />)}</div>
          ) : (
            <div className="af-empty">Nothing matches. Try fewer words, or describe the outcome you want.</div>
          )}
        </div>
      </div>
    </div>
  );
}
