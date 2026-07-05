import type { DailyBrief } from "./types";

/**
 * ⚠️ MOCK DATA — LOCAL DEVELOPMENT FALLBACK ONLY.
 *
 * This fixture is served only when no Gemini API key (GEMINI_API_KEY or
 * GOOGLE_API_KEY) is configured, so the UI can be developed and demoed
 * without live web search. Every brief built
 * from this file is stamped `mode: "mock"` and the UI shows a visible
 * "Sample data" banner. None of the items below should be treated as real,
 * current news.
 */
export function buildMockBrief(date: string): DailyBrief {
  return {
    date,
    generated_at: new Date().toISOString(),
    mode: "mock",
    coverage_note:
      "Sample content for local development. Set GEMINI_API_KEY and run the daily job to generate a live brief from web search.",
    signal_summary: [
      "[SAMPLE] Frontier labs shipped enterprise-focused model updates aimed at agentic workflows.",
      "[SAMPLE] Cloud providers announced new AI infrastructure capacity and custom silicon milestones.",
      "[SAMPLE] Regulators in the EU and US advanced AI governance rules affecting enterprise deployment.",
      "[SAMPLE] Enterprise adoption stories centered on measurable ROI from copilots and agents.",
    ],
    items: [
      {
        id: `${date}-mock-1`,
        rank: 1,
        headline: "[SAMPLE] Frontier lab releases enterprise agent platform with audit controls",
        summary:
          "A major AI lab announced a platform for deploying autonomous agents inside enterprise environments, with policy controls, audit logs, and workspace isolation. Early customers report double-digit productivity gains in pilot deployments.",
        why_it_matters:
          "Agent platforms are becoming the primary battleground for enterprise AI spend, shifting value from raw model access to orchestration and governance.",
        source_name: "Example Lab Blog",
        source_url: "https://example.com/mock-agent-platform",
        published_at: `${date}T08:00:00Z`,
        category: "Agents & Developer Tools",
        confidence_score: 0.95,
        reliability_score: 0.9,
        google_cloud_interpretation:
          "[SAMPLE] Validates the agent-platform category Google Cloud serves with Vertex AI Agent Builder and Agentspace; expect customers to ask for comparisons.",
        relevant_google_cloud_products: ["Vertex AI Agent Builder", "Google Agentspace", "Gemini"],
        competitive_implications:
          "[SAMPLE] Strengthens the competitor's enterprise story; creates urgency to demonstrate Google Cloud's governance and grounding advantages.",
        field_action:
          "[SAMPLE] Proactively brief agent-curious accounts on Agentspace security architecture before competitors set the evaluation criteria.",
        deeper_analysis:
          "[SAMPLE] This is placeholder analysis text used for layout development. A live brief contains several sentences of sourced analysis covering market context, customer impact, and ecosystem effects.",
        related_links: [
          { title: "[SAMPLE] Launch announcement", url: "https://example.com/mock-agent-platform" },
          { title: "[SAMPLE] Analyst reaction", url: "https://example.com/mock-analysis" },
        ],
      },
      {
        id: `${date}-mock-2`,
        rank: 2,
        headline: "[SAMPLE] Hyperscaler announces next-generation AI accelerator general availability",
        summary:
          "A major cloud provider made its newest custom AI accelerator generally available, claiming significant price-performance gains for both training and inference versus the prior generation.",
        why_it_matters:
          "Custom silicon economics increasingly determine which cloud wins large AI workloads, and price-performance claims reset customer negotiating expectations.",
        source_name: "Example Cloud Blog",
        source_url: "https://example.com/mock-accelerator",
        published_at: `${date}T07:00:00Z`,
        category: "Infrastructure & Chips",
        confidence_score: 0.9,
        reliability_score: 0.9,
        google_cloud_interpretation:
          "[SAMPLE] Directly relevant to TPU positioning; customers evaluating accelerators will benchmark against this announcement.",
        relevant_google_cloud_products: ["TPU", "GKE", "Vertex AI"],
        competitive_implications:
          "[SAMPLE] Raises the bar on inference economics; sellers should expect price-performance objections in upcoming renewals.",
        field_action:
          "[SAMPLE] Refresh TPU v. competitor price-performance one-pagers for infrastructure-heavy accounts.",
        deeper_analysis:
          "[SAMPLE] Placeholder deeper analysis for layout development purposes only.",
        related_links: [{ title: "[SAMPLE] Product page", url: "https://example.com/mock-accelerator" }],
      },
      {
        id: `${date}-mock-3`,
        rank: 3,
        headline: "[SAMPLE] EU publishes implementation guidance for general-purpose AI obligations",
        summary:
          "European regulators released guidance clarifying compliance timelines and documentation requirements for general-purpose AI providers and enterprise deployers.",
        why_it_matters:
          "Compliance clarity unblocks stalled enterprise AI procurement in regulated industries across Europe.",
        source_name: "Example Regulator",
        source_url: "https://example.com/mock-eu-guidance",
        published_at: `${date}T06:00:00Z`,
        category: "Policy & Regulation",
        confidence_score: 0.9,
        reliability_score: 0.95,
        google_cloud_interpretation:
          "[SAMPLE] Positions Google Cloud's compliance tooling and EU data-boundary offerings as differentiators in regulated-industry deals.",
        relevant_google_cloud_products: ["Vertex AI", "Security Command Center", "Google Distributed Cloud"],
        competitive_implications:
          "[SAMPLE] Neutral across hyperscalers but favors providers with mature sovereignty offerings.",
        field_action:
          "[SAMPLE] Share the guidance summary with EMEA regulated-industry customers alongside sovereignty collateral.",
        deeper_analysis: "[SAMPLE] Placeholder deeper analysis for layout development purposes only.",
        related_links: [{ title: "[SAMPLE] Guidance text", url: "https://example.com/mock-eu-guidance" }],
      },
    ],
  };
}
