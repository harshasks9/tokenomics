import type { AxisId, Direction, GapMetricId, Market, MetricId } from "./types";

export interface MetricDef {
  id: MetricId;
  label: string;
  /** Short axis label. */
  axis: string;
  unit: string;
  direction: Direction;
  /** Who produced the numbers, in one phrase. */
  sourceLine: string;
  /** What exactly is measured / claimed. */
  definition: string;
  evidenceLabel: "Manufacturer claim" | "Independent measurement" | "Reviewer rating (subjective)";
  format: (v: number) => string;
  /** Compact axis-tick format; falls back to format. */
  tick?: (v: number) => string;
  /** Plot on a log scale (prices spanning 50×, where linear crushes the budget end). */
  log?: boolean;
  domainPad: number;
}

export interface GapDef {
  id: GapMetricId;
  label: string;
  why: string;
  instead: string;
}

const hours = (v: number) => `${Number(v.toFixed(2))} h`;

export const METRICS: Record<MetricId, MetricDef> = {
  price: {
    id: "price",
    label: "Price (US)",
    axis: "US launch price (USD)",
    unit: "USD",
    direction: "lower",
    sourceLine: "US launch MSRP from manufacturers and launch coverage",
    definition: "US launch list price. Street prices move and are noted on each card, not plotted.",
    evidenceLabel: "Manufacturer claim",
    format: (v) => `$${Number.isInteger(v) ? v : v.toFixed(2)}`,
    domainPad: 20,
  },
  priceInr: {
    id: "priceInr",
    label: "Price (India)",
    axis: "India launch price (₹)",
    unit: "INR",
    direction: "lower",
    sourceLine: "India launch prices from brands, launch coverage and spec aggregators",
    definition:
      "The price announced at India launch, not MRP and not a sale price. Indian street prices often drop well below launch within weeks; MRP is shown on cards where known.",
    evidenceLabel: "Manufacturer claim",
    format: (v) => `₹${Math.round(v).toLocaleString("en-IN")}`,
    tick: (v) => (v >= 1000 ? `₹${Number((v / 1000).toFixed(1))}k` : `₹${v}`),
    log: true,
    domainPad: 500,
  },
  anc: {
    id: "anc",
    label: "Noise cancellation",
    axis: "Noise cancellation (SoundGuys ANC score, 0–10)",
    unit: "score /10",
    direction: "higher",
    sourceLine: "SoundGuys lab — B&K 5128 head, pink noise, ANC on",
    definition:
      "Average reduction in perceived loudness of outside noise with ANC on, expressed 0–10 (8.5 ≈ 85% quieter). One lab, one protocol for every product.",
    evidenceLabel: "Independent measurement",
    format: (v) => v.toFixed(1),
    domainPad: 0.4,
  },
  ancClaim: {
    id: "ancClaim",
    label: "ANC depth (claimed)",
    axis: "Claimed max ANC depth (dB) — manufacturer figure",
    unit: "dB",
    direction: "higher",
    sourceLine: "Manufacturer 'up to X dB' claims",
    definition:
      "The brand's own 'up to X dB' noise-cancelling figure. Brands measure it differently (frequency, rig, peak vs average), so a higher claim does not reliably mean better cancellation — use the lab score where it exists.",
    evidenceLabel: "Manufacturer claim",
    format: (v) => `${v} dB`,
    domainPad: 2,
  },
  batteryClaim: {
    id: "batteryClaim",
    label: "Battery, ANC on (claimed)",
    axis: "Battery, ANC on — manufacturer claim (hours)",
    unit: "hours",
    direction: "higher",
    sourceLine: "Manufacturer specifications, earbuds only, ANC on",
    definition: "Listening time from one charge of the earbuds with noise cancelling on. ANC-off claims are excluded so every product is held to the same condition.",
    evidenceLabel: "Manufacturer claim",
    format: hours,
    domainPad: 1,
  },
  batteryMax: {
    id: "batteryMax",
    label: "Battery, buds (claimed max)",
    axis: "Battery, earbuds alone — claimed maximum (hours)",
    unit: "hours",
    direction: "higher",
    sourceLine: "Manufacturer specifications, best-case condition (usually ANC off)",
    definition: "The longest single-charge playtime the brand claims for the earbuds. Usually measured with ANC off at moderate volume, so it flatters every model; widely available, so useful for broad comparisons.",
    evidenceLabel: "Manufacturer claim",
    format: hours,
    domainPad: 1,
  },
  batteryTotal: {
    id: "batteryTotal",
    label: "Battery with case (claimed)",
    axis: "Total playtime with case — claimed maximum (hours)",
    unit: "hours",
    direction: "higher",
    sourceLine: "Manufacturer specifications, best-case condition",
    definition: "Earbuds plus all case recharges, as claimed. Budget brands often lead here on paper; real use with ANC is lower.",
    evidenceLabel: "Manufacturer claim",
    format: hours,
    domainPad: 4,
  },
  batteryMeasured: {
    id: "batteryMeasured",
    label: "Battery (measured)",
    axis: "Battery — RTINGS continuous playback (hours)",
    unit: "hours",
    direction: "higher",
    sourceLine: "RTINGS lab — continuous playback until shutdown",
    definition: "Hours of continuous playback measured by RTINGS. Other labs' hours are shown on cards but never mixed into this axis.",
    evidenceLabel: "Independent measurement",
    format: hours,
    domainPad: 1,
  },
  comfort: {
    id: "comfort",
    label: "Comfort",
    axis: "Comfort & fit — SoundGuys reviewer rating (0–10)",
    unit: "rating /10",
    direction: "higher",
    sourceLine: "SoundGuys reviewer rating — subjective",
    definition:
      "One outlet's consistent subjective comfort & fit rating. Comfort depends on your ears; treat this as one informed opinion, not a measurement.",
    evidenceLabel: "Reviewer rating (subjective)",
    format: (v) => v.toFixed(1),
    domainPad: 0.4,
  },
  weight: {
    id: "weight",
    label: "Earbud weight",
    axis: "Weight per earbud (g)",
    unit: "grams",
    direction: "lower",
    sourceLine: "Manufacturer / retailer spec sheets",
    definition: "Mass of one earbud. Lighter buds tend to load the ear less, but weight alone does not predict comfort for a given ear.",
    evidenceLabel: "Manufacturer claim",
    format: (v) => `${v} g`,
    domainPad: 0.5,
  },
};

export const METRIC_IDS = Object.keys(METRICS) as MetricId[];

export const GAPS: Record<GapMetricId, GapDef> = {
  sound: {
    id: "sound",
    label: "Sound quality",
    why:
      "No source scores sound the same way across this set of models. RTINGS' sound scores are paywalled, and SoundGuys' MDAQS scores change version between reviews and say they aren't directly comparable. Plotting them would create a false frontier.",
    instead: "Each product card carries sourced notes on sound character, including where reviewers disagree.",
  },
  mic: {
    id: "mic",
    label: "Microphone quality",
    why:
      "Lab mic results exist for only a few models, and both labs document that their test heads understate earbuds that rely on bone-conduction sensors or on-board noise suppression.",
    instead: "The Calls preset shows sourced mic notes side by side, including disagreements between labs.",
  },
};

export const AXIS_OPTIONS: { id: AxisId; gap: boolean }[] = [
  { id: "priceInr", gap: false },
  { id: "price", gap: false },
  { id: "anc", gap: false },
  { id: "ancClaim", gap: false },
  { id: "sound", gap: true },
  { id: "batteryClaim", gap: false },
  { id: "batteryMax", gap: false },
  { id: "batteryTotal", gap: false },
  { id: "batteryMeasured", gap: false },
  { id: "comfort", gap: false },
  { id: "weight", gap: false },
  { id: "mic", gap: true },
];

/** The price metric for a market, and the one that should be hidden there. */
export function priceMetric(market: Market): MetricId {
  return market === "in" ? "priceInr" : "price";
}

/** Swap a USD/INR price id for the market's own; leaves other metrics alone. */
export function forMarket(id: MetricId, market: Market): MetricId {
  return id === "price" || id === "priceInr" ? priceMetric(market) : id;
}

export function axisOptionsFor(market: Market) {
  const hide = market === "in" ? "price" : "priceInr";
  return AXIS_OPTIONS.filter((o) => o.id !== hide);
}

export function isMetric(id: AxisId): id is MetricId {
  return id in METRICS;
}

export function axisLabel(id: AxisId): string {
  return isMetric(id) ? METRICS[id].label : GAPS[id].label;
}
