import type { Requirements } from "./requirements";
import type { ActivityId, MetricId, Product } from "./types";

export type FeatureKey = keyof Product["features"];

export interface ActivityPreset {
  id: ActivityId;
  label: string;
  /** One line: what the activity asks of earbuds. */
  needs: string;
  x: MetricId;
  y: MetricId;
  /** Why these axes — honest about what can't be charted. */
  axisRationale: string;
  /** Default preference weights (0–3) for the derived estimate. */
  weights: Partial<Record<MetricId, number>>;
  features: FeatureKey[];
  /** Offered, never auto-applied. */
  suggested: { label: string; patch: Partial<Requirements> }[];
  caution?: string;
}

export const AWARENESS_CAUTION =
  "Transparency and ambient modes do not guarantee you'll hear traffic, cyclists or alarms. In a 2025 lab study, sound-localisation accuracy fell from 91.5% to 68.9% in transparency mode, and Apple, Sony and Bose all warn against relying on earbuds where hearing your surroundings matters.";

export const PRESETS: ActivityPreset[] = [
  {
    id: "gym",
    label: "Gym",
    needs: "Secure fit, sweat resistance, controls you can use mid-set, and a way to hear the room.",
    x: "weight",
    y: "comfort",
    axisRationale: "Fit stability isn't scored consistently across labs, so the chart pairs objective bud weight with the reviewer comfort & fit rating; fit-aid design and IP rating sit alongside.",
    weights: { comfort: 3, weight: 2, price: 1, batteryClaim: 1 },
    features: ["fitAid", "ipRating", "controls", "transparency", "heartRate"],
    suggested: [
      { label: "Documented water rating ≥ IPX4", patch: { water: 4 } },
      { label: "Hook, wing or stability band", patch: { secureFit: true } },
    ],
  },
  {
    id: "office",
    label: "Office",
    needs: "All-day comfort, multipoint for laptop + phone, a usable mic, and easy switching.",
    x: "price",
    y: "comfort",
    axisRationale: "Long-session comfort vs what you pay. Microphone quality can't be charted fairly — see the mic notes on each card.",
    weights: { comfort: 3, price: 2, batteryClaim: 1, anc: 1 },
    features: ["multipoint", "ecosystemSwitching", "transparency", "ios", "android"],
    suggested: [{ label: "Multipoint", patch: { multipoint: true } }],
  },
  {
    id: "commute",
    label: "Commute",
    needs: "Strong noise cancelling, portability, enough battery for the round trip, and transparency for stations.",
    x: "price",
    y: "anc",
    axisRationale: "The classic tradeoff: measured noise cancelling against launch price.",
    weights: { anc: 3, price: 2, batteryClaim: 1, weight: 1 },
    features: ["transparency", "wirelessCharging", "caseTotalHours", "ipRating"],
    suggested: [],
    caution: AWARENESS_CAUTION,
  },
  {
    id: "calls",
    label: "Calls",
    needs: "Speech clarity, background-noise handling and a reliable connection.",
    x: "price",
    y: "anc",
    axisRationale: "Mic quality isn't comparable across labs (test heads understate bone-conduction and on-board noise suppression), so the chart shows what helps you hear in noise; the mic notes below carry the call evidence.",
    weights: { anc: 2, price: 2, comfort: 1, batteryMeasured: 1 },
    features: ["multipoint", "ecosystemSwitching", "transparency", "controls"],
    suggested: [{ label: "Multipoint", patch: { multipoint: true } }],
  },
  {
    id: "travel",
    label: "Travel",
    needs: "Noise cancelling for engines, comfort for hours, real-world battery and easy charging.",
    x: "batteryMeasured",
    y: "anc",
    axisRationale: "Lab-measured endurance against lab-measured noise cancelling — both from independent tests.",
    weights: { anc: 3, batteryMeasured: 3, comfort: 2, price: 1 },
    features: ["caseTotalHours", "wirelessCharging", "transparency"],
    suggested: [{ label: "Wireless charging", patch: { wirelessCharging: true } }],
  },
  {
    id: "outdoor",
    label: "Outdoor exercise",
    needs: "Fit that survives running, water resistance for rain and sweat, and environmental awareness.",
    x: "price",
    y: "comfort",
    axisRationale: "Comfort & fit against price; check fit-aid, IP rating and wind-noise notes — and keep one ear on the road.",
    weights: { comfort: 3, weight: 2, price: 1 },
    features: ["fitAid", "ipRating", "transparency", "controls"],
    suggested: [
      { label: "Documented water rating ≥ IPX4", patch: { water: 4 } },
      { label: "Hook, wing or stability band", patch: { secureFit: true } },
    ],
    caution: AWARENESS_CAUTION,
  },
];

export const PRESET_BY_ID: Record<ActivityId, ActivityPreset> = Object.fromEntries(PRESETS.map((p) => [p.id, p])) as Record<ActivityId, ActivityPreset>;

export const FEATURE_LABEL: Record<FeatureKey, string> = {
  ipRating: "Water resistance",
  multipoint: "Multipoint",
  ecosystemSwitching: "Ecosystem switching",
  transparency: "Transparency / ambient",
  wirelessCharging: "Wireless charging",
  fitAid: "Fit aid",
  controls: "Controls",
  heartRate: "Heart-rate sensing",
  ios: "iPhone support",
  android: "Android support",
  caseTotalHours: "Total with case (ANC on)",
};

export const FIT_AID_LABEL = {
  "ear-hook": "Ear hook",
  "wing-or-fin": "Wing / fin",
  "stability-band": "Stability band",
  "tips-only": "Ear tips only",
  "open-fit": "Open fit",
} as const;
