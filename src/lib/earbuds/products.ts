import { CATALOG_RECORDS, catalogMetrics, catalogToProduct, type CatalogRecord } from "./catalog";
import { DEEP, type DeepSeed } from "./deep";
import type { Datum, Product } from "./types";

/**
 * The full set the explorer works on: the 14 hand-researched models (with
 * activity notes) plus the sourced catalog. A deep model's own curated values
 * always win; catalog values only fill fields the deep research didn't cover
 * (India price, claimed ANC depth, claimed max battery, codecs...).
 */

/** Deep-dive id → catalog record id, for the same physical model. */
export const DEEP_TO_CATALOG: Record<string, string> = {
  "airpods-pro-3": "apple-airpods-pro-3",
  "airpods-5": "apple-airpods-5",
  "powerbeats-pro-2": "beats-powerbeats-pro-2",
  "bose-qc-ultra-earbuds-2": "bose-quietcomfort-ultra-earbuds-2nd-gen",
  "galaxy-buds4-pro": "samsung-galaxy-buds4-pro",
  "nothing-ear-3": "nothing-ear-3",
  "nothing-ear-3a": "nothing-ear-3a",
  "cmf-buds-pro-2": "cmf-buds-pro-2",
  "sennheiser-mtw5": "sennheiser-momentum-true-wireless-5",
  "sony-wf-1000xm6": "sony-wf-1000xm6",
  "sony-wf-1000xm5": "sony-wf-1000xm5",
  "sony-linkbuds-fit": "sony-linkbuds-fit",
  "pixel-buds-pro-2": "google-pixel-buds-pro-2",
  "technics-eah-az100": "technics-eah-az100",
};

const catalogById = new Map(CATALOG_RECORDS.map((r) => [r.id, r]));

function keep<T>(primary: Datum<T>, fallback: Datum<T>): Datum<T> {
  return primary.value !== null ? primary : fallback.value !== null ? fallback : primary;
}

function augment(seed: DeepSeed, rec: CatalogRecord | undefined): Product {
  const cm = rec ? catalogMetrics(rec.values) : null;
  const empty = <T,>(): Datum<T> => ({ value: null, evidence: "manufacturer", sources: [], confidence: "low" });
  const v = rec?.values;
  return {
    ...seed,
    tier: "deep",
    indiaAvailable: rec?.indiaAvailable ?? null,
    metrics: {
      price: cm ? keep(seed.metrics.price, cm.price) : seed.metrics.price,
      priceInr: cm?.priceInr ?? empty(),
      anc: cm ? keep(seed.metrics.anc, cm.anc) : seed.metrics.anc,
      ancClaim: cm?.ancClaim ?? empty(),
      batteryClaim: cm ? keep(seed.metrics.batteryClaim, cm.batteryClaim) : seed.metrics.batteryClaim,
      batteryMax: cm?.batteryMax ?? empty(),
      batteryTotal: cm?.batteryTotal ?? empty(),
      batteryMeasured: cm ? keep(seed.metrics.batteryMeasured, cm.batteryMeasured) : seed.metrics.batteryMeasured,
      comfort: cm ? keep(seed.metrics.comfort, cm.comfort) : seed.metrics.comfort,
      weight: cm ? keep(seed.metrics.weight, cm.weight) : seed.metrics.weight,
    },
    features: {
      ...seed.features,
      ancType: v?.anc ? { value: v.anc.v, evidence: "manufacturer", sources: v.anc.s, confidence: v.anc.c ?? "medium" } : empty(),
      codecs: v?.codecs ? { value: v.codecs.v.join(", "), evidence: "manufacturer", sources: v.codecs.s, confidence: v.codecs.c ?? "medium" } : empty(),
      bluetooth: v?.bluetooth ? { value: `Bluetooth ${v.bluetooth.v}`, evidence: "manufacturer", sources: v.bluetooth.s, confidence: v.bluetooth.c ?? "medium" } : empty(),
    },
  };
}

const deepProducts = DEEP.map((seed) => augment(seed, catalogById.get(DEEP_TO_CATALOG[seed.id] ?? "")));
const usedCatalogIds = new Set(Object.values(DEEP_TO_CATALOG));
const catalogProducts = CATALOG_RECORDS.filter((r) => !usedCatalogIds.has(r.id)).map(catalogToProduct);

export const PRODUCTS: Product[] = [...deepProducts, ...catalogProducts];

export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
