import { MODELS, callCost } from "@/lib/pricing";

export const TIERS = [
  "flashLite",
  "flash",
  "geminiPro",
  "sonnet",
  "opus",
] as const;

export type Tier = (typeof TIERS)[number];

export const PROFILE: Record<
  Tier,
  {
    latencyMs: number;
    quality: {
      low: number;
      med: number;
      high: number;
    };
    governed: boolean;
  }
> = {
  flashLite: {
    latencyMs: 400,
    quality: { low: 5, med: 3, high: 1 },
    governed: false,
  },
  flash: {
    latencyMs: 700,
    quality: { low: 5, med: 4, high: 2 },
    governed: false,
  },
  geminiPro: {
    latencyMs: 1400,
    quality: { low: 5, med: 5, high: 4 },
    governed: true,
  },
  sonnet: {
    latencyMs: 1600,
    quality: { low: 5, med: 5, high: 5 },
    governed: true,
  },
  opus: {
    latencyMs: 3500,
    quality: { low: 5, med: 5, high: 5 },
    governed: true,
  },
};

export const QUALITY_BAR = 4;

export const TIER_LABELS: Record<Tier, string> = {
  flashLite: "Flash Lite",
  flash: "Flash",
  geminiPro: "Gemini Pro",
  sonnet: "Sonnet",
  opus: "Opus",
};

export const TIER_MODEL_NAMES: Record<Tier, string> = Object.fromEntries(
  TIERS.map((tier) => [tier, MODELS[tier].name]),
) as Record<Tier, string>;

export function tierCallCost(tier: Tier, inTok: number, outTok: number) {
  return callCost(tier, inTok, outTok);
}
