import type { PeriodId } from "@/lib/atlas/types";

export const PERIOD_LABEL: Record<PeriodId, string> = {
  p2012: "2012–16 · Deep learning works",
  p2017: "2017–19 · Transformers & pretraining",
  p2020: "2020–21 · Scaling laws",
  p2022: "2022–23 · Generative AI goes mass",
  p2024: "2024 · Multimodal, open weights, infra",
  p2025: "2025 · Reasoning & agents",
  p2026: "2026 · The emerging frontier",
};

export const PERIOD_SHORT: Record<PeriodId, string> = {
  p2012: "2012–16", p2017: "2017–19", p2020: "2020–21", p2022: "2022–23", p2024: "2024", p2025: "2025", p2026: "2026",
};
