import { METRICS, priceMetric } from "./metrics";
import type { Brand, FitAid, Form, Market, MetricId, Product } from "./types";

/**
 * Hard requirements decide eligibility BEFORE any frontier is computed.
 * A requirement that depends on an unknown feature excludes the product as
 * "unknown" — it is never assumed to pass.
 */

export type OsRequirement = "any" | "ios" | "android";
/** Minimum IP water digit, or "documented" for any published rating. */
export type WaterRequirement = "none" | "documented" | 4 | 5 | 7;

/** sealed = in-ear with tips (incl. ear-hook); open = open-ear, clip and unsealed semi-in-ear. */
export type FormRequirement = "any" | "sealed" | "open";

export interface Requirements {
  /** Max launch price in the active market's currency; null = no budget cap. */
  maxPrice: number | null;
  os: OsRequirement;
  multipoint: boolean;
  water: WaterRequirement;
  wirelessCharging: boolean;
  secureFit: boolean;
  /** Require documented active noise cancelling. */
  anc: boolean;
  form: FormRequirement;
  /** Earliest release year; null = any. */
  releasedSince: number | null;
}

export const NO_REQUIREMENTS: Requirements = {
  maxPrice: null,
  os: "any",
  multipoint: false,
  water: "none",
  wirelessCharging: false,
  secureFit: false,
  anc: false,
  form: "any",
  releasedSince: null,
};

export type RequirementKey = keyof Requirements;

export interface Exclusion {
  requirement: RequirementKey | "brand" | "market";
  kind: "fails" | "unknown";
  reason: string;
}

export interface EligibilityResult {
  product: Product;
  eligible: boolean;
  exclusions: Exclusion[];
}

/** Parses the water digit of an IP code ("IP57" → 7, "IPX4" → 4). */
export function waterDigit(ip: string | null): number | null {
  if (!ip) return null;
  const m = /^IP[0-6X]([0-9])/i.exec(ip.trim());
  return m ? Number(m[1]) : null;
}

const SECURE_FIT: FitAid[] = ["ear-hook", "wing-or-fin", "stability-band"];

const SEALED: Form[] = ["in-ear", "ear-hook"];
const OPEN: Form[] = ["open-ear", "clip", "semi-in-ear"];

/**
 * Is the product in scope for a market? India: documented as sold in India or
 * has an India launch price. US: has a US launch price. Products outside the
 * market are hidden, not "failed" — they simply aren't sold there per our sources.
 */
export function inMarket(product: Product, market: Market): boolean {
  if (market === "in") return product.indiaAvailable === true || product.metrics.priceInr.value !== null;
  return product.metrics.price.value !== null;
}

export function checkProduct(product: Product, req: Requirements, brands: Brand[] = [], market: Market | null = null): EligibilityResult {
  const ex: Exclusion[] = [];
  const f = product.features;

  if (market && !inMarket(product, market)) {
    ex.push({ requirement: "market", kind: "fails", reason: market === "in" ? "No documented India availability or India price" : "No documented US launch price" });
  }

  if (brands.length && !brands.includes(product.brand)) {
    ex.push({ requirement: "brand", kind: "fails", reason: `${product.brand} is filtered out` });
  }

  if (req.maxPrice !== null) {
    const pm = priceMetric(market ?? "us");
    const price = product.metrics[pm].value;
    if (price === null) ex.push({ requirement: "maxPrice", kind: "unknown", reason: "Launch price unknown" });
    else if (price > req.maxPrice) {
      ex.push({ requirement: "maxPrice", kind: "fails", reason: `Launch price ${METRICS[pm].format(price)} is over your ${METRICS[pm].format(req.maxPrice)} budget` });
    }
  }

  if (req.anc) {
    const a = f.ancType.value;
    if (a === null) ex.push({ requirement: "anc", kind: "unknown", reason: "Noise cancelling not documented" });
    else if (a === "none") ex.push({ requirement: "anc", kind: "fails", reason: "No active noise cancelling" });
  }

  if (req.form !== "any") {
    const form = product.form;
    if (form === null) ex.push({ requirement: "form", kind: "unknown", reason: "Fit style not documented" });
    else if (req.form === "sealed" && !SEALED.includes(form)) ex.push({ requirement: "form", kind: "fails", reason: "Open or unsealed fit" });
    else if (req.form === "open" && !OPEN.includes(form)) ex.push({ requirement: "form", kind: "fails", reason: "Sealed in-ear fit" });
  }

  if (req.releasedSince !== null) {
    const y = product.releasedMonth ? Number(product.releasedMonth.slice(0, 4)) : null;
    if (y === null) ex.push({ requirement: "releasedSince", kind: "unknown", reason: "Release date not established" });
    else if (y < req.releasedSince) ex.push({ requirement: "releasedSince", kind: "fails", reason: `Released ${y}, before ${req.releasedSince}` });
  }

  if (req.os !== "any") {
    const support = req.os === "ios" ? f.ios.value : f.android.value;
    const label = req.os === "ios" ? "iPhone" : "Android";
    if (support === null) ex.push({ requirement: "os", kind: "unknown", reason: `${label} feature support not documented` });
    else if (support !== "full") ex.push({ requirement: "os", kind: "fails", reason: `Limited ${label} support${f[req.os].note ? ` — ${f[req.os].note}` : ""}` });
  }

  if (req.multipoint) {
    const mp = f.multipoint.value;
    if (mp === null) ex.push({ requirement: "multipoint", kind: "unknown", reason: "Multipoint not documented" });
    else if (mp === "no") ex.push({ requirement: "multipoint", kind: "fails", reason: f.multipoint.note ?? "No multipoint" });
  }

  if (req.water !== "none") {
    const digit = waterDigit(f.ipRating.value);
    if (digit === null) ex.push({ requirement: "water", kind: "unknown", reason: "No documented water-resistance rating" });
    else if (req.water !== "documented" && digit < req.water) {
      ex.push({ requirement: "water", kind: "fails", reason: `${f.ipRating.value} is below IPX${req.water}` });
    }
  }

  if (req.wirelessCharging) {
    const wc = f.wirelessCharging.value;
    if (wc === null) ex.push({ requirement: "wirelessCharging", kind: "unknown", reason: "Wireless charging not documented" });
    else if (wc === "no") ex.push({ requirement: "wirelessCharging", kind: "fails", reason: "No wireless charging" });
  }

  if (req.secureFit) {
    const fit = f.fitAid.value;
    if (fit === null) ex.push({ requirement: "secureFit", kind: "unknown", reason: "Fit-aid design not documented" });
    else if (!SECURE_FIT.includes(fit)) {
      ex.push({ requirement: "secureFit", kind: "fails", reason: fit === "open-fit" ? "Open fit with no hook, wing or band" : "Ear tips only — no hook, wing or band" });
    }
  }

  return { product, eligible: ex.length === 0, exclusions: ex };
}

export function applyRequirements(products: Product[], req: Requirements, brands: Brand[] = [], market: Market | null = null): EligibilityResult[] {
  return products.map((p) => checkProduct(p, req, brands, market));
}

export interface PlotPartition {
  plotted: Product[];
  missing: { product: Product; metrics: MetricId[] }[];
}

/** Splits eligible products into those with both chart metrics and those missing one. */
export function partitionForAxes(eligible: Product[], x: MetricId, y: MetricId): PlotPartition {
  const plotted: Product[] = [];
  const missing: PlotPartition["missing"] = [];
  for (const p of eligible) {
    const gaps = [x, y].filter((m, i, arr) => arr.indexOf(m) === i && p.metrics[m].value === null);
    if (gaps.length) missing.push({ product: p, metrics: gaps });
    else plotted.push(p);
  }
  return { plotted, missing };
}

export function countActive(req: Requirements): number {
  return (
    (req.maxPrice !== null ? 1 : 0) +
    (req.os !== "any" ? 1 : 0) +
    (req.multipoint ? 1 : 0) +
    (req.water !== "none" ? 1 : 0) +
    (req.wirelessCharging ? 1 : 0) +
    (req.secureFit ? 1 : 0) +
    (req.anc ? 1 : 0) +
    (req.form !== "any" ? 1 : 0) +
    (req.releasedSince !== null ? 1 : 0)
  );
}
