import Site from "@/components/llm-landscape/Site";

/**
 * LLM Landscape & Model Evolution Explorer — a single client-rendered route.
 * Every fact renders from /llm-landscape/models.json (public asset); the
 * components carry presentation only, so the dataset can be refreshed without
 * touching this code.
 */
export default function LlmLandscapePage() {
  return <Site />;
}
