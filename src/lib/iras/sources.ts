/**
 * Numbered source register for the IRAS microsite.
 * Order defines citation numbers; keys are stable and used by <Cite k="…"/>.
 * All entries verified via web research, September 2026.
 */

export type SourceEntry = {
  key: string;
  title: string;
  url: string;
  group: "IRAS" | "Singapore Government" | "Google Cloud" | "Open Standards";
};

export const SOURCES: SourceEntry[] = [
  // ── IRAS ────────────────────────────────────────────────────
  {
    key: "iras-ar",
    title: "IRAS Annual Report FY2024/25 — S$88.9B collected; 0.58¢ cost per dollar; S$507M recovered from >8,600 audit and investigation cases",
    url: "https://www.iras.gov.sg/news-events/newsroom/iras-annual-report-fy2024-25",
    group: "IRAS",
  },
  {
    key: "iras-vision",
    title: "IRAS — Mission, vision and core values (“The leading revenue authority in the world”)",
    url: "https://www.iras.gov.sg/who-we-are/our-organisation/mission-vision-core-values-and-logo",
    group: "IRAS",
  },
  {
    key: "iras-ai",
    title: "IRAS — “Expanding the use of data and AI across all functions” (compliance and service delivery)",
    url: "https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/consequences-of-non-compliance/getting-individuals-to-comply",
    group: "IRAS",
  },
  {
    key: "iras-nfs",
    title: "IRAS — Tax Season 2026: >2M taxpayers on No-Filing Service; ~1M receive their bill directly (D-NOA)",
    url: "https://www.iras.gov.sg/news-events/newsroom/individual-income-tax-season-2026--about-1-million-taxpayers-to-receive-their-tax-bill-directly-from-mid-march",
    group: "IRAS",
  },
  {
    key: "iras-cit",
    title: "IRAS — Corporate income tax on-time filing above 90% for the first time (YA2024)",
    url: "https://www.iras.gov.sg/news-events/newsroom/corporate-income-tax-season--more-than-90--on-time-filing-rate-achieved-for-first-time-in-ya-2024",
    group: "IRAS",
  },
  {
    key: "iras-invoicenow",
    title: "IRAS — COS 2026: GST InvoiceNow requirement extends to all GST-registered businesses by April 2031",
    url: "https://www.iras.gov.sg/news-events/newsroom/committee-of-supply-2026--extension-of-gst-invoicenow-requirement-to-all-gst-registered-businesses-by-april-2031",
    group: "IRAS",
  },
  {
    key: "iras-seamless",
    title: "IRAS — Seamless filing from accounting software (up to 95% time savings)",
    url: "https://www.iras.gov.sg/taxes/corporate-income-tax/form-c-s-form-c-s-(lite)-form-c-filing/using-accounting-software-to-prepare-file-form-c-s-seamlessly",
    group: "IRAS",
  },
  {
    key: "vica",
    title: "GovTech — VICA, the LLM-powered successor to the Ask Jamie government chatbot (powers the IRAS Bot)",
    url: "https://www.tech.gov.sg/technews/govtech-team-behind-ask-jamie-government-chatbot/",
    group: "IRAS",
  },

  // ── Singapore Government ────────────────────────────────────
  {
    key: "smart-nation",
    title: "MDDI — Smart Nation 2.0: Trust, Growth, Community (Oct 2024)",
    url: "https://www.mddi.gov.sg/newsroom/smart-nation-2-press-release/",
    group: "Singapore Government",
  },
  {
    key: "nais",
    title: "Smart Nation — National AI Strategy 2.0: “AI for the Public Good, for Singapore and the World”",
    url: "https://www.smartnation.gov.sg/initiatives/national-ai-strategy/",
    group: "Singapore Government",
  },
  {
    key: "nais-refresh",
    title: "EDB — Singapore refreshes National AI Strategy; partnership agreements with Google and OpenAI (May 2026)",
    url: "https://www.edb.gov.sg/en/business-insights/insights/singapore-updates-national-ai-strategy-partners-google-and-openai.html",
    group: "Singapore Government",
  },
  {
    key: "govtech-aibots",
    title: "GovTech — AIBots: no-code GenAI/RAG builder; 40,000 officers, 115 agencies, 12,000 bots",
    url: "https://www.tech.gov.sg/products-and-services/for-government-agencies/productivity-and-marketing/aibots/",
    group: "Singapore Government",
  },
  {
    key: "trailblazers",
    title: "MDDI / Google Cloud — AI Trailblazers: 100 GenAI use cases in 100 days (2023–2024)",
    url: "https://www.mddi.gov.sg/media-centre/press-releases/mci-disg-sndgo-and-google-cloud-launch-ai-trailblazers-initiative/",
    group: "Singapore Government",
  },
  {
    key: "gcc",
    title: "GovTech — Government on Commercial Cloud: >80% of eligible systems on commercial cloud; IM8-mapped blueprints",
    url: "https://www.tech.gov.sg/products-and-services/for-government-agencies/software-development/government-on-commercial-cloud/",
    group: "Singapore Government",
  },
  {
    key: "mgf",
    title: "IMDA / AI Verify Foundation — Model AI Governance Framework for Generative AI (May 2024, nine dimensions)",
    url: "https://aiverifyfoundation.sg/resources/mgf-gen-ai/",
    group: "Singapore Government",
  },
  {
    key: "csa-ai",
    title: "CSA — Guidelines and Companion Guide on Securing AI Systems (Oct 2024)",
    url: "https://www.csa.gov.sg/news-events/press-releases/launch-of-guidelines-and-companion-guide-on-securing-artificial-intelligence-systems/",
    group: "Singapore Government",
  },
  {
    key: "csa-agentic",
    title: "CSA — Addendum on Securing Agentic AI Systems (Jun 2026)",
    url: "https://www.csa.gov.sg/resources/publications/addendum-on-securing-ai-systems/",
    group: "Singapore Government",
  },
  {
    key: "natl-partnership",
    title: "MDDI — Google and Singapore expand partnership to accelerate AI impact for the public good (May 2026); joint AI Agents Sandbox",
    url: "https://www.mddi.gov.sg/newsroom/google-and-singapore-expand-partnership-to-accelerate-ai-impact-for-the-public-good/",
    group: "Singapore Government",
  },

  // ── Google Cloud ────────────────────────────────────────────
  {
    key: "google-sg",
    title: "Google — Singapore 2026: in-country AI data residency (training and inference), Gemini on GDC, US$5B infrastructure investment",
    url: "https://blog.google/company-news/inside-google/around-the-globe/google-asia/google-singapore-2026/",
    group: "Google Cloud",
  },
  {
    key: "gemini-models",
    title: "Google Cloud — Gemini model documentation (Gemini 3.1 Pro, 3.8 Flash, 3.5 Flash-Lite; September 2026)",
    url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models",
    group: "Google Cloud",
  },
  {
    key: "geap",
    title: "Google Cloud — Gemini Enterprise Agent Platform (formerly Vertex AI; renamed at Next ’26)",
    url: "https://cloud.google.com/products/gemini-enterprise-agent-platform",
    group: "Google Cloud",
  },
  {
    key: "model-garden",
    title: "Google Cloud — Model Garden: 200+ Google, open-weight and partner models",
    url: "https://cloud.google.com/model-garden",
    group: "Google Cloud",
  },
  {
    key: "claude-vertex",
    title: "Google Cloud — Anthropic Claude models available as first-party managed models",
    url: "https://cloud.google.com/blog/products/ai-machine-learning/expanding-vertex-ai-with-claude-opus-4-6/",
    group: "Google Cloud",
  },
  {
    key: "gemma",
    title: "Google Cloud — Gemma 4 open models under Apache 2.0 (April 2026)",
    url: "https://cloud.google.com/blog/products/ai-machine-learning/gemma-4-available-on-google-cloud",
    group: "Google Cloud",
  },
  {
    key: "grounding",
    title: "Google Cloud — Grounding overview: Google Search, Agent Search, your own data",
    url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/overview",
    group: "Google Cloud",
  },
  {
    key: "genai-eval",
    title: "Google Cloud — Gen AI evaluation service (groundedness, safety, quality metrics)",
    url: "https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-overview",
    group: "Google Cloud",
  },
  {
    key: "adk",
    title: "Google — Agent Development Kit (open source; Python, TypeScript, Go, Java; MCP support)",
    url: "https://google.github.io/adk-docs/",
    group: "Google Cloud",
  },
  {
    key: "gemini-enterprise",
    title: "Google Cloud — Gemini Enterprise: the governed agent workplace for employees",
    url: "https://cloud.google.com/gemini/enterprise",
    group: "Google Cloud",
  },
  {
    key: "bigquery-ai",
    title: "Google Cloud — AI in BigQuery: AI.GENERATE, embeddings and vector search in SQL",
    url: "https://docs.cloud.google.com/bigquery/docs/ai-introduction",
    group: "Google Cloud",
  },
  {
    key: "docai",
    title: "Google Cloud — Document AI layout parsing with Gemini (hierarchy-preserving chunking)",
    url: "https://docs.cloud.google.com/document-ai/docs/layout-parse-chunk",
    group: "Google Cloud",
  },
  {
    key: "tpu",
    title: "Google Cloud — AI infrastructure at Next ’26: Ironwood TPUs, NVIDIA Blackwell-class GPUs, AI Hypercomputer",
    url: "https://cloud.google.com/blog/products/compute/ai-infrastructure-at-next26",
    group: "Google Cloud",
  },
  {
    key: "model-armor",
    title: "Google Cloud — Model Armor: model-agnostic prompt and response screening",
    url: "https://cloud.google.com/security/products/model-armor",
    group: "Google Cloud",
  },
  {
    key: "scc-aip",
    title: "Google Cloud — Security Command Center AI Protection (covers agents and MCP servers)",
    url: "https://docs.cloud.google.com/security-command-center/docs/ai-protection-overview",
    group: "Google Cloud",
  },
  {
    key: "saif",
    title: "Google — Secure AI Framework (SAIF 2.0, extended to agent security; data donated to CoSAI)",
    url: "https://safety.google/cybersecurity-advancements/saif/",
    group: "Google Cloud",
  },
  {
    key: "data-governance",
    title: "Google Cloud — Generative AI data governance: customer data is not used to train models without permission",
    url: "https://cloud.google.com/vertex-ai/generative-ai/docs/data-governance",
    group: "Google Cloud",
  },
  {
    key: "residency",
    title: "Google Cloud — Data residency for generative AI (in-region processing incl. Singapore, asia-southeast1)",
    url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/data-residency",
    group: "Google Cloud",
  },
  {
    key: "gdc",
    title: "Google Distributed Cloud air-gapped — Gemini fully disconnected from Google (GA)",
    url: "https://cloud.google.com/distributed-cloud-air-gapped",
    group: "Google Cloud",
  },
  {
    key: "mtcs",
    title: "Google Cloud — MTCS SS 584 Tier 3 certification (Singapore)",
    url: "https://cloud.google.com/security/compliance/mtcs",
    group: "Google Cloud",
  },
  {
    key: "iso42001",
    title: "Google Cloud — ISO/IEC 42001 AI management system certification",
    url: "https://cloud.google.com/security/compliance/iso-42001",
    group: "Google Cloud",
  },
  {
    key: "sovereign",
    title: "Google Cloud — Sovereign Cloud portfolio (Data Boundary, partner controls, Distributed Cloud)",
    url: "https://cloud.google.com/sovereign-cloud",
    group: "Google Cloud",
  },
  {
    key: "confidential",
    title: "Google Cloud — Confidential Computing (Confidential VMs, GPU TEEs)",
    url: "https://cloud.google.com/security/products/confidential-computing",
    group: "Google Cloud",
  },

  // ── Open standards ──────────────────────────────────────────
  {
    key: "a2a",
    title: "Linux Foundation — Agent2Agent (A2A) protocol v1.0: 150+ member organisations incl. AWS, Microsoft, SAP, ServiceNow",
    url: "https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year",
    group: "Open Standards",
  },
  {
    key: "mcp-servers",
    title: "Google Cloud — 50+ Google-managed MCP servers for agent-tool connectivity",
    url: "https://cloud.google.com/blog/products/ai-machine-learning/google-managed-mcp-servers-are-available-for-everyone",
    group: "Open Standards",
  },
  {
    key: "mcp",
    title: "Model Context Protocol — open standard for connecting AI to tools and data",
    url: "https://modelcontextprotocol.io/",
    group: "Open Standards",
  },
];

/** key → 1-based citation number */
export const SRC: Record<string, number> = Object.fromEntries(
  SOURCES.map((s, i) => [s.key, i + 1])
);
