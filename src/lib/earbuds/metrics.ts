import type { AxisId, Direction, GapMetricId, MetricId } from "./types";

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
    label: "Price",
    axis: "Launch price (USD)",
    unit: "USD",
    direction: "lower",
    sourceLine: "US launch MSRP from manufacturers and launch coverage",
    definition: "US launch list price. Street prices move and are noted on each card, not plotted.",
    evidenceLabel: "Manufacturer claim",
    format: (v) => `$${Number.isInteger(v) ? v : v.toFixed(2)}`,
    domainPad: 20,
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
  batteryClaim: {
    id: "batteryClaim",
    label: "Battery (claimed)",
    axis: "Battery, ANC on — manufacturer claim (hours)",
    unit: "hours",
    direction: "higher",
    sourceLine: "Manufacturer specifications, earbuds only, ANC on",
    definition: "Listening time from one charge of the earbuds with noise cancelling on. ANC-off claims are excluded so every product is held to the same condition.",
    evidenceLabel: "Manufacturer claim",
    format: hours,
    domainPad: 1,
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
      "No source scores sound the same way across all 14 models. RTINGS' sound scores are paywalled, and SoundGuys' MDAQS scores change version between reviews and say they aren't directly comparable. Plotting them would create a false frontier.",
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
  { id: "price", gap: false },
  { id: "anc", gap: false },
  { id: "sound", gap: true },
  { id: "batteryClaim", gap: false },
  { id: "batteryMeasured", gap: false },
  { id: "comfort", gap: false },
  { id: "weight", gap: false },
  { id: "mic", gap: true },
];

export function isMetric(id: AxisId): id is MetricId {
  return id in METRICS;
}

export function axisLabel(id: AxisId): string {
  return isMetric(id) ? METRICS[id].label : GAPS[id].label;
}
