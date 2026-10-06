"use client";

import { useEffect, useMemo, useState } from "react";
import type { LiveSnapshot, Model, NewsItem } from "./types";
import { CATALOG, CATALOG_DATE, SEED_NEWS } from "./catalog";

/**
 * Client-side data access: the bundled catalog, overlaid with the daily
 * cron snapshot from /api/pricing when present. Renders immediately from the
 * catalog, then refines (no layout change — only numbers and the freshness
 * stamp update).
 */

export type PricingData = {
  models: Model[];
  news: NewsItem[];
  /** ISO datetime of the last successful refresh, or null if none yet. */
  refreshedAt: string | null;
  /** Catalog snapshot date (facts verified by hand). */
  catalogDate: string;
  live: "loading" | "live" | "catalog-only" | "error";
  overriddenIds: Set<string>;
  /** True when the last automated check is more than 3 days old (computed at fetch time). */
  stale: boolean;
};

export function mergeSnapshot(base: Model[], snap: LiveSnapshot | null): { models: Model[]; overridden: Set<string> } {
  if (!snap || !snap.overrides) return { models: base, overridden: new Set() };
  const overridden = new Set<string>();
  const models = base.map((m) => {
    const o = snap.overrides[m.id];
    if (!o) return m;
    overridden.add(m.id);
    const { lastVerified, ...pricingPatch } = o;
    return {
      ...m,
      pricing: { ...m.pricing, ...pricingPatch },
      lastVerified: lastVerified ?? m.lastVerified,
    };
  });
  return { models, overridden };
}

export function mergeNews(seed: NewsItem[], snap: LiveSnapshot | null): NewsItem[] {
  const all = [...(snap?.news ?? []), ...seed];
  const seen = new Set<string>();
  return all
    .filter((n) => {
      const k = `${n.date}|${n.title.toLowerCase()}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function usePricingData(): PricingData {
  const [snap, setSnap] = useState<LiveSnapshot | null>(null);
  const [live, setLive] = useState<PricingData["live"]>("loading");
  const [stale, setStale] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/pricing", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { snapshot: LiveSnapshot | null }) => {
        if (cancelled) return;
        setSnap(j.snapshot ?? null);
        setLive(j.snapshot ? "live" : "catalog-only");
        setStale(j.snapshot ? Date.now() - new Date(j.snapshot.updatedAt).getTime() > 3 * 86400e3 : false);
      })
      .catch(() => {
        if (!cancelled) setLive("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    const { models, overridden } = mergeSnapshot(CATALOG, snap);
    return {
      models,
      news: mergeNews(SEED_NEWS, snap),
      refreshedAt: snap?.updatedAt ?? null,
      catalogDate: CATALOG_DATE,
      live,
      overriddenIds: overridden,
      stale,
    };
  }, [snap, live, stale]);
}
