import { METRICS } from "./metrics";
import type { Brand, FitAid, MetricId, Product } from "./types";

/**
 * Hard requirements decide eligibility BEFORE any frontier is computed.
 * A requirement that depends on an unknown feature excludes the product as
 * "unknown" — it is never assumed to pass.
 */

export type OsRequirement = "any" | "ios" | "android";
/** Minimum IP water digit, or "documented" for any published rating. */
export type WaterRequirement = "none" | "documented" | 4 | 5 | 7;

export interface Requirements {
  /** Max launch price in USD; null = no budget cap. */
  maxPrice: number | null;
  os: OsRequirement;
  multipoint: boolean;
  water: WaterRequirement;
  wirelessCharging: boolean;
  secureFit: boolean;
}

export const NO_REQUIREMENTS: Requirements = {
  maxPrice: null,
  os: "any",
  multipoint: false,
  water: "none",
  wirelessCharging: false,
  secureFit: false,
};

export type RequirementKey = keyof Requirements;

export interface Exclusion {
  requirement: RequirementKey | "brand";
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

export function checkProduct(product: Product, req: Requirements, brands: Brand[] = []): EligibilityResult {
  const ex: Exclusion[] = [];
  const f = product.features;

  if (brands.length && !brands.includes(product.brand)) {
    ex.push({ requirement: "brand", kind: "fails", reason: `${product.brand} is filtered out` });
  }

  if (req.maxPrice !== null) {
    const price = product.metrics.price.value;
    if (price === null) ex.push({ requirement: "maxPrice", kind: "unknown", reason: "Launch price unknown" });
    else if (price > req.maxPrice) {
      ex.push({ requirement: "maxPrice", kind: "fails", reason: `Launch price ${METRICS.price.format(price)} is over your ${METRICS.price.format(req.maxPrice)} budget` });
    }
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

export function applyRequirements(products: Product[], req: Requirements, brands: Brand[] = []): EligibilityResult[] {
  return products.map((p) => checkProduct(p, req, brands));
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
    (req.secureFit ? 1 : 0)
  );
}
