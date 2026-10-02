import raw from "./catalog.json";
import type { AncType, Confidence, Datum, Evidence, Form, Product, Source, SourceKind } from "./types";

/**
 * The broad catalog: ~300 popular earbuds with India focus, generated from the
 * research agents' per-brand files by scripts/earbuds-build-catalog.mjs (see
 * docs/earbuds-pareto/CATALOG_METHOD.md). Each value carries the ids of the
 * sources that stated it; null means no source stated it.
 */

export interface CatalogValue<T> {
  v: T;
  /** Source ids that stated this value. */
  s: string[];
  c?: Confidence;
}

export interface CatalogRecord {
  id: string;
  brand: string;
  model: string;
  released: string | null;
  status: "current" | "older-still-sold" | "discontinued" | "unknown";
  form: Form | null;
  indiaAvailable: boolean | null;
  confidence: Confidence;
  notes: string;
  values: Partial<{
    priceInr: CatalogValue<number>;
    mrpInr: CatalogValue<number>;
    priceUsd: CatalogValue<number>;
    anc: CatalogValue<AncType>;
    ancClaimDb: CatalogValue<number>;
    batteryAncOn: CatalogValue<number>;
    batteryMax: CatalogValue<number>;
    batteryTotal: CatalogValue<number>;
    ip: CatalogValue<string>;
    weight: CatalogValue<number>;
    multipoint: CatalogValue<boolean>;
    bluetooth: CatalogValue<string>;
    codecs: CatalogValue<string[]>;
    wirelessCharging: CatalogValue<boolean>;
    latencyMs: CatalogValue<number>;
    drivers: CatalogValue<string>;
    sgAnc: CatalogValue<number>;
    sgAncPct: CatalogValue<number>;
    sgComfort: CatalogValue<number>;
    sgBattery: CatalogValue<number>;
    rtingsBattery: CatalogValue<number>;
  }>;
}

export interface CatalogFile {
  generated: string;
  sources: { id: string; publisher: string; title: string; url: string; kind: SourceKind }[];
  models: CatalogRecord[];
}

const data = raw as unknown as CatalogFile;

export const CATALOG_GENERATED = data.generated;
export const CATALOG_RECORDS: CatalogRecord[] = data.models;

export const CATALOG_SOURCES: Source[] = data.sources.map((s) => ({ ...s, accessed: data.generated }));

type Values = CatalogRecord["values"];

function datum<T, U = T>(cv: CatalogValue<T> | undefined, evidence: Evidence, map?: (v: T) => U, note?: string): Datum<U> {
  if (!cv || cv.v === null || cv.v === undefined) return { value: null, evidence, sources: [], confidence: "low" };
  return { value: map ? map(cv.v) : (cv.v as unknown as U), evidence, sources: cv.s, confidence: cv.c ?? "medium", note };
}

const yesNo = (b: boolean) => (b ? "yes" : "no") as "yes" | "no";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function monthLabel(m: string | null): string {
  if (!m) return "Release date not established";
  const [y, mm] = m.split("-");
  return mm ? `${MONTHS[Number(mm) - 1] ?? ""} ${y}`.trim() : y;
}

/** Manufacturer-claimed metrics and lab scores for a record, shared by catalog and deep entries. */
export function catalogMetrics(v: Values) {
  return {
    price: datum(v.priceUsd, "manufacturer"),
    priceInr: datum(v.priceInr, "manufacturer", undefined, v.mrpInr ? `Listed MRP ₹${v.mrpInr.v.toLocaleString("en-IN")}.` : undefined),
    anc: datum(v.sgAnc, "measured", undefined, v.sgAncPct ? `${v.sgAncPct.v}% average perceived-loudness reduction.` : undefined),
    ancClaim: datum(v.ancClaimDb, "manufacturer", undefined, "Brand's 'up to' figure — brands measure differently."),
    batteryClaim: datum(v.batteryAncOn, "manufacturer"),
    batteryMax: datum(v.batteryMax, "manufacturer"),
    batteryTotal: datum(v.batteryTotal, "manufacturer"),
    batteryMeasured: datum(v.rtingsBattery, "measured"),
    comfort: datum(v.sgComfort, "reviewer"),
    weight: datum(v.weight, "manufacturer"),
  } satisfies Product["metrics"];
}

function fitAidFromForm(form: Form | null): Datum<Product["features"]["fitAid"]["value"] & string> {
  if (form === "ear-hook") return { value: "ear-hook", evidence: "manufacturer", sources: [], confidence: "medium", note: "From the product's form factor." };
  if (form === "open-ear" || form === "clip" || form === "semi-in-ear") return { value: "open-fit", evidence: "manufacturer", sources: [], confidence: "medium", note: "From the product's form factor." };
  return { value: null, evidence: "manufacturer", sources: [], confidence: "low" };
}

const none = <T,>(): Datum<T> => ({ value: null, evidence: "manufacturer", sources: [], confidence: "low" });

export function catalogToProduct(r: CatalogRecord): Product {
  const v = r.values;
  const metrics = catalogMetrics(v);
  const fit = fitAidFromForm(r.form);
  const allSources = Array.from(new Set(Object.values(v).flatMap((x) => (x ? x.s : []))));
  if (fit.value) fit.sources = allSources.slice(0, 1);
  return {
    id: r.id,
    tier: "catalog",
    brand: r.brand,
    name: r.model,
    short: `${r.brand} ${r.model}`.length > 22 ? r.model : `${r.brand} ${r.model}`,
    generation: r.status === "current" ? "Current model" : r.status === "older-still-sold" ? "Older model, still sold" : r.status === "discontinued" ? "Discontinued" : "Catalog entry",
    released: monthLabel(r.released),
    releasedMonth: r.released,
    form: r.form,
    indiaAvailable: r.indiaAvailable,
    researchNote: r.notes || undefined,
    confidence: r.confidence,
    metrics,
    features: {
      ipRating: datum(v.ip, "manufacturer"),
      multipoint: datum(v.multipoint, "manufacturer", yesNo),
      ecosystemSwitching: none(),
      transparency: none(),
      wirelessCharging: datum(v.wirelessCharging, "manufacturer", yesNo),
      fitAid: fit,
      controls: none(),
      heartRate: none(),
      ios: none(),
      android: none(),
      caseTotalHours: none(),
      ancType: datum(v.anc, "manufacturer"),
      codecs: datum(v.codecs, "manufacturer", (c) => c.join(", ")),
      bluetooth: datum(v.bluetooth, "manufacturer", (b) => `Bluetooth ${b}`),
    },
    notes: [],
  };
}

/** Normalised key for matching the same model across research files. */
export function matchKey(brand: string, model: string): string {
  return `${brand} ${model}`
    .toLowerCase()
    .replace(/\(([^)]*)\)/g, " $1 ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(true wireless|earbuds|tws|wireless|the)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
