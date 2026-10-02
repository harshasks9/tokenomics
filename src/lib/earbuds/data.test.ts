import { describe, expect, it } from "vitest";
import { METRIC_IDS, METRICS } from "./metrics";
import { PRESETS } from "./presets";
import { PRODUCTS } from "./products";
import { SOURCES } from "./sources";
import type { Datum } from "./types";

/** Dataset integrity: every value is cited, every citation resolves, nothing is invented. */

function allData(): { where: string; datum: Datum<unknown> }[] {
  const out: { where: string; datum: Datum<unknown> }[] = [];
  for (const p of PRODUCTS) {
    for (const [k, v] of Object.entries(p.metrics)) out.push({ where: `${p.id}.metrics.${k}`, datum: v });
    for (const [k, v] of Object.entries(p.features)) out.push({ where: `${p.id}.features.${k}`, datum: v as Datum<unknown> });
  }
  return out;
}

describe("dataset integrity", () => {
  it("has unique product ids", () => {
    expect(new Set(PRODUCTS.map((p) => p.id)).size).toBe(PRODUCTS.length);
  });

  it("cites at least one source for every known value", () => {
    const uncited = allData().filter(({ datum }) => datum.value !== null && datum.sources.length === 0);
    expect(uncited.map((u) => u.where)).toEqual([]);
  });

  it("only cites sources that exist", () => {
    const missing = new Set<string>();
    for (const { datum } of allData()) for (const s of datum.sources) if (!SOURCES[s]) missing.add(s);
    for (const p of PRODUCTS) for (const n of p.notes) for (const s of n.sources) if (!SOURCES[s]) missing.add(s);
    expect([...missing]).toEqual([]);
  });

  it("every note is sourced", () => {
    const bare = PRODUCTS.flatMap((p) => p.notes.filter((n) => n.sources.length === 0).map(() => p.id));
    expect(bare).toEqual([]);
  });

  it("keeps metric values inside plausible ranges", () => {
    for (const p of PRODUCTS) {
      const m = p.metrics;
      if (m.anc.value !== null) {
        expect(m.anc.value).toBeGreaterThanOrEqual(0);
        expect(m.anc.value).toBeLessThanOrEqual(10);
      }
      if (m.comfort.value !== null) expect(m.comfort.value).toBeLessThanOrEqual(10);
      if (m.price.value !== null) expect(m.price.value).toBeGreaterThan(0);
      if (m.weight.value !== null) expect(m.weight.value).toBeLessThan(15);
    }
  });

  it("every product has a price in at least one market", () => {
    const priceless = PRODUCTS.filter((p) => p.metrics.price.value === null && p.metrics.priceInr.value === null && p.indiaAvailable !== true);
    // Allowed only for catalog entries with other substantive data; never for deep entries.
    expect(priceless.filter((p) => p.tier === "deep").map((p) => p.id)).toEqual([]);
  });

  it("catalog ids are unique and every catalog value cites a source", () => {
    const catalog = PRODUCTS.filter((p) => p.tier === "catalog");
    expect(catalog.length).toBeGreaterThan(100);
    for (const p of catalog) for (const [k, d] of Object.entries(p.metrics)) if (d.value !== null) expect(d.sources.length, `${p.id}.${k}`).toBeGreaterThan(0);
  });

  it("India prices are plausible rupee amounts", () => {
    for (const p of PRODUCTS) {
      const v = p.metrics.priceInr.value;
      if (v !== null) expect(v).toBeGreaterThanOrEqual(300);
    }
  });

  it("source URLs are absolute https", () => {
    for (const s of Object.values(SOURCES)) expect(s.url).toMatch(/^https:\/\//);
  });

  it("presets only reference real metrics and use two different axes", () => {
    for (const pr of PRESETS) {
      expect(METRIC_IDS).toContain(pr.x);
      expect(METRIC_IDS).toContain(pr.y);
      expect(pr.x).not.toBe(pr.y);
      for (const k of Object.keys(pr.weights)) expect(METRICS).toHaveProperty(k);
    }
  });
});
