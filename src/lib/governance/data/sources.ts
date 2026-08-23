import type { Source } from "../types";

/**
 * Source register. Dates are publication or last-verified (YYYY-MM).
 * kind encodes how a claim should be read: regulation (binding), standard
 * (certifiable), practice (framework/industry), vendor (first-party docs),
 * google (Google first-party), research (studies/surveys), news (reporting).
 */
export const SOURCES: Source[] = [
  // ---- regulation & standards ---------------------------------------------
  { id: "eu-ai-act", title: "Regulation (EU) 2024/1689 (AI Act) — implementation timeline", org: "European Union", url: "https://artificialintelligenceact.eu/implementation-timeline/", date: "2026-08", kind: "regulation" },
  { id: "eu-omnibus", title: "Digital Omnibus on AI — Regulation (EU) 2026/1744", org: "European Union", url: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng", date: "2026-07", kind: "regulation" },
  { id: "korea-act", title: "AI Basic Act (effective Jan 22, 2026) — overview", org: "Republic of Korea / Cooley", url: "https://www.cooley.com/news/insight/2026/2026-01-27-south-koreas-ai-basic-act-overview-and-key-takeaways", date: "2026-01", kind: "regulation" },
  { id: "us-eo-2025", title: "EO: Ensuring a National Policy Framework for AI", org: "The White House", url: "https://www.whitehouse.gov/presidential-actions/2025/12/eliminating-state-law-obstruction-of-national-artificial-intelligence-policy/", date: "2025-12", kind: "regulation" },
  { id: "ca-sb53", title: "California SB 53 (frontier AI transparency) explained", org: "Future of Privacy Forum", url: "https://fpf.org/blog/californias-sb-53-the-first-frontier-ai-law-explained/", date: "2025-10", kind: "regulation" },
  { id: "iso-42001", title: "ISO/IEC 42001:2023 — AI management systems", org: "ISO/IEC", url: "https://www.iso.org/standard/42001", date: "2023-12", kind: "standard" },
  { id: "iso-42005", title: "ISO/IEC 42005:2025 — AI system impact assessment", org: "ISO/IEC", url: "https://www.iso.org/standard/42005", date: "2025-05", kind: "standard" },
  { id: "nist-rmf", title: "NIST AI Risk Management Framework + Generative AI Profile (AI 600-1)", org: "NIST", url: "https://www.nist.gov/itl/ai-risk-management-framework", date: "2024-07", kind: "practice" },
  { id: "oecd", title: "OECD AI Principles (2024 update)", org: "OECD", url: "https://oecd.ai/en/ai-principles", date: "2024-05", kind: "practice" },
  { id: "owasp-llm", title: "OWASP Top 10 for LLM Applications (2025)", org: "OWASP GenAI Security Project", url: "https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/", date: "2024-11", kind: "practice" },
  { id: "owasp-agentic", title: "OWASP Top 10 for Agentic Applications", org: "OWASP GenAI Security Project", url: "https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/", date: "2025-12", kind: "practice" },
  { id: "mitre-atlas", title: "MITRE ATLAS — adversarial threat landscape for AI", org: "MITRE", url: "https://atlas.mitre.org/", date: "2025-11", kind: "practice" },
  { id: "csa-aicm", title: "CSA AI Controls Matrix v1.1 (247 controls)", org: "Cloud Security Alliance", url: "https://cloudsecurityalliance.org/blog/2026/07/14/ai-controls-matrix-v1-1-strengthening-the-foundation-for-trustworthy-ai", date: "2026-07", kind: "practice" },
  { id: "gartner-trism", title: "AI governance needs more than policies (AI TRiSM)", org: "Gartner", url: "https://www.gartner.com/en/articles/ai-trism", date: "2025-06", kind: "practice" },

  // ---- research & surveys --------------------------------------------------
  { id: "mckinsey-trust", title: "State of AI trust in 2026: shifting to the agentic era", org: "McKinsey", url: "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/state-of-ai-trust-in-2026-shifting-to-the-agentic-era", date: "2026-03", kind: "research" },
  { id: "mckinsey-soai", title: "The State of AI (March 2025)", org: "McKinsey", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai", date: "2025-03", kind: "research" },
  { id: "ibm-breach", title: "Cost of a Data Breach Report 2025 (shadow-AI findings)", org: "IBM", url: "https://www.ibm.com/reports/data-breach", date: "2025-07", kind: "research" },
  { id: "netskope-genai", title: "Cloud & Threat Report: Generative AI 2025", org: "Netskope", url: "https://www.netskope.com/resources/cloud-and-threat-reports/cloud-and-threat-report-generative-ai-2025", date: "2025-02", kind: "research" },
  { id: "gartner-cancel", title: "Over 40% of agentic AI projects will be canceled by end-2027", org: "Gartner", url: "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027", date: "2025-06", kind: "research" },
  { id: "anthropic-misalignment", title: "Agentic misalignment: how LLMs could be insider threats", org: "Anthropic (research)", url: "https://www.anthropic.com/research/agentic-misalignment", date: "2025-06", kind: "research" },
  { id: "mit-divide", title: "The GenAI Divide: 95% of pilots show no P&L impact (coverage)", org: "MIT / Fortune", url: "https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/", date: "2025-08", kind: "research" },
  { id: "finops-ai", title: "FinOps for AI overview", org: "FinOps Foundation", url: "https://www.finops.org/wg/finops-for-ai-overview/", date: "2026-01", kind: "research" },

  // ---- incidents & cases ---------------------------------------------------
  { id: "forbes-samsung", title: "Samsung bans ChatGPT after sensitive code leaks", org: "Forbes", url: "https://www.forbes.com/sites/siladityaray/2023/05/02/samsung-bans-chatgpt-and-other-chatbots-for-employees-after-sensitive-code-leak/", date: "2023-05", kind: "news" },
  { id: "echoleak-src", title: "EchoLeak (CVE-2025-32711): zero-click Copilot exfiltration", org: "Aim Security / coverage", url: "https://www.hackthebox.com/blog/cve-2025-32711-echoleak-copilot-vulnerability", date: "2025-06", kind: "news" },
  { id: "air-canada-src", title: "Moffatt v. Air Canada, 2024 BCCRT 149", org: "CBC / BCCRT", url: "https://www.cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416", date: "2024-02", kind: "news" },
  { id: "replit-src", title: "Replit AI agent deletes production database", org: "Fortune", url: "https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/", date: "2025-07", kind: "news" },
  { id: "gtg-src", title: "Disrupting the first reported AI-orchestrated espionage campaign", org: "Anthropic", url: "https://www.anthropic.com/news/disrupting-AI-espionage", date: "2025-11", kind: "news" },
  { id: "chevy-src", title: "Chevrolet dealership chatbot $1 Tahoe incident", org: "AI Incident Database", url: "https://incidentdatabase.ai/cite/622/", date: "2023-12", kind: "news" },
  { id: "mycity-src", title: "NYC MyCity chatbot tells businesses to break the law", org: "The Markup", url: "https://themarkup.org/artificial-intelligence/2024/03/29/nycs-ai-chatbot-tells-businesses-to-break-the-law", date: "2024-03", kind: "news" },
  { id: "grok-src", title: "Grok antisemitic output after system-prompt change", org: "NPR", url: "https://www.npr.org/2025/07/09/nx-s1-5462609/grok-elon-musk-antisemitic-racist-content", date: "2025-07", kind: "news" },
  { id: "bartz-src", title: "Bartz v. Anthropic: $1.5B authors' settlement", org: "NPR", url: "https://www.npr.org/2025/09/05/nx-s1-5529404/anthropic-settlement-authors-copyright-ai", date: "2025-09", kind: "news" },
  { id: "mobley-src", title: "Mobley v. Workday: nationwide ADEA collective action", org: "Holland & Knight", url: "https://www.hklaw.com/en/insights/publications/2025/05/federal-court-allows-collective-action-lawsuit-over-alleged", date: "2025-05", kind: "news" },
  { id: "mchire-src", title: "McHire/Paradox.ai exposure of ~64M applicants", org: "Krebs on Security", url: "https://krebsonsecurity.com/2025/07/poor-passwords-tattle-on-ai-hiring-bot-maker-paradox-ai/", date: "2025-07", kind: "news" },
  { id: "slack-src", title: "Slack AI indirect prompt-injection data exfiltration research", org: "PromptArmor / The Register", url: "https://www.theregister.com/2024/08/21/slack_ai_prompt_injection/", date: "2024-08", kind: "news" },
  { id: "citations-src", title: "AI-fabricated citations tracker passes 1,500 court decisions", org: "Charlotin tracker / Scientific American", url: "https://www.scientificamerican.com/article/why-lawyers-keep-citing-fake-cases-invented-by-ai/", date: "2026-06", kind: "news" },
  { id: "klarna-src", title: "Klarna reverses AI-only support strategy", org: "Forbes", url: "https://www.forbes.com/sites/quickerbettertech/2025/05/18/business-tech-news-klarna-reverses-on-ai/", date: "2025-05", kind: "news" },

  // ---- customer examples ---------------------------------------------------
  { id: "src-wellsfargo", title: "Wells Fargo's Fargo: 245M interactions, zero PII to the LLM", org: "VentureBeat", url: "https://venturebeat.com/business/wells-fargos-ai-assistant-just-crossed-245-million-interactions-with-zero-humans-in-the-loop-and-zero-pii-to-the-llm/", date: "2025-03", kind: "news" },
  { id: "src-dblumina", title: "Deutsche Bank delivers AI-powered research with DB Lumina", org: "Google Cloud blog", url: "https://cloud.google.com/blog/topics/financial-services/deutsche-bank-delivers-ai-powered-financial-research-with-db-lumina", date: "2025-09", kind: "google" },
  { id: "src-commerzbank", title: "How Commerzbank transforms advisory workflows with gen AI", org: "Google Cloud blog", url: "https://cloud.google.com/blog/products/ai-machine-learning/how-commerzbank-is-transforming-financial-advisory-workflows-with-gen-ai/", date: "2024-11", kind: "google" },
  { id: "src-hca", title: "HCA Healthcare Nurse Handoff app", org: "Google blog", url: "https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/hca-healthcare-nurse-handoff-app/", date: "2024-06", kind: "google" },
  { id: "src-highmark", title: "Highmark Health + Google Cloud: 6 lessons for governed gen AI", org: "VentureBeat", url: "https://venturebeat.com/ai/how-highmark-health-and-google-cloud-are-using-gen-ai-to-streamline-medical-claims-and-improve-care-6-key-lessons/", date: "2025-04", kind: "news" },
  { id: "src-nevada", title: "Nevada DETR unemployment-appeals AI (scrutiny coverage)", org: "Gizmodo / Fordham IPLJ", url: "https://gizmodo.com/googles-ai-will-help-decide-whether-unemployed-workers-get-benefits-2000496215", date: "2024-09", kind: "news" },
  { id: "src-telus", title: "TELUS Fuel iX — ISO 31700-1 certified gen-AI platform", org: "TELUS Digital", url: "https://www.telusdigital.com/solutions/fuel-ix", date: "2024-05", kind: "vendor" },
  { id: "src-wendys", title: "Wendy's FreshAI drive-thru with Google Cloud", org: "Wendy's / Google Cloud", url: "https://www.prnewswire.com/news-releases/wendys-taps-google-cloud-to-power-new-era-of-drive-thru-experiences-301819196.html", date: "2023-05", kind: "news" },
  { id: "src-macquarie", title: "Macquarie Bank democratizes agentic AI (Gemini Enterprise)", org: "Google Cloud press", url: "https://www.googlecloudpresscorner.com/2025-10-09-Macquarie-Bank-Democratizes-Agentic-AI", date: "2025-10", kind: "google" },
  { id: "src-morganstanley", title: "Morgan Stanley uses evals to gate its GPT-4 assistant", org: "OpenAI case study", url: "https://openai.com/index/morgan-stanley/", date: "2024-01", kind: "vendor" },
  { id: "src-jpm", title: "How JPMorganChase democratized employee gen AI (LLM Suite)", org: "American Banker", url: "https://www.americanbanker.com/news/how-jpmorganchase-democratized-employee-access-to-gen-ai", date: "2024-08", kind: "news" },
  { id: "src-goldman", title: "Goldman Sachs launches firmwide AI assistant", org: "CNBC", url: "https://www.cnbc.com/2025/01/21/goldman-sachs-launches-ai-assistant.html", date: "2025-01", kind: "news" },
  { id: "src-walmart", title: "Walmart Element: an LLM-agnostic governed AI platform", org: "Walmart Global Tech", url: "https://tech.walmart.com/content/walmart-global-tech/en_us/blog/post/walmarts-element-a-machine-learning-platform.html", date: "2024-03", kind: "vendor" },
  { id: "src-moderna", title: "Moderna: from mChat to 750 governed GPTs", org: "OpenAI case study", url: "https://openai.com/index/moderna/", date: "2024-04", kind: "vendor" },
  { id: "src-niprgpt", title: "USAF NIPRGPT sunset and move to GenAI.mil", org: "DefenseScoop", url: "https://defensescoop.com/2025/12/18/air-force-sunsetting-niprgpt-generative-ai-platform/", date: "2025-12", kind: "news" },
  { id: "src-nhs", title: "Guidance on AI-enabled ambient scribing in health and care", org: "NHS England", url: "https://www.england.nhs.uk/long-read/guidance-on-the-use-of-ai-enabled-ambient-scribing-products-in-health-and-care-settings/", date: "2025-04", kind: "regulation" },

  // ---- Google first-party --------------------------------------------------
  { id: "g-agent-platform", title: "Gemini Enterprise Agent Platform (formerly Vertex AI)", org: "Google Cloud", url: "https://cloud.google.com/vertex-ai", date: "2026-08", kind: "google" },
  { id: "g-model-armor", title: "Model Armor overview", org: "Google Cloud docs", url: "https://docs.cloud.google.com/model-armor/overview", date: "2026-08", kind: "google" },
  { id: "g-scc-aip", title: "Security Command Center AI Protection", org: "Google Cloud", url: "https://cloud.google.com/security/products/security-command-center", date: "2026-08", kind: "google" },
  { id: "g-data-gov", title: "Generative AI data governance (no-training commitment)", org: "Google Cloud docs", url: "https://cloud.google.com/vertex-ai/generative-ai/docs/data-governance", date: "2026-08", kind: "google" },
  { id: "g-zdr", title: "Zero data retention configuration", org: "Google Cloud docs", url: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/resources/zero-data-retention", date: "2026-08", kind: "google" },
  { id: "g-gemini-enterprise", title: "Gemini Enterprise (formerly Agentspace)", org: "Google Cloud", url: "https://cloud.google.com/gemini/enterprise", date: "2026-08", kind: "google" },
  { id: "g-saif", title: "Secure AI Framework (SAIF 2.0, agent principles)", org: "Google", url: "https://saif.google/", date: "2025-10", kind: "google" },
  { id: "g-iso42001", title: "Google Cloud ISO/IEC 42001 certification", org: "Google Cloud", url: "https://cloud.google.com/security/compliance/iso-42001", date: "2026-08", kind: "google" },
  { id: "g-fedramp", title: "Generative AI and Vertex AI Search at FedRAMP High", org: "Google Cloud blog", url: "https://cloud.google.com/blog/topics/public-sector/vertex-ai-search-and-generative-ai-with-gemini-achieve-fedramp-high", date: "2024-12", kind: "google" },
  { id: "g-a2a", title: "A2A protocol v1.0 under the Linux Foundation", org: "A2A Project", url: "https://a2a-protocol.org/", date: "2026-04", kind: "google" },
  { id: "g-gdc", title: "Google Distributed Cloud air-gapped (Gemini on-prem)", org: "Google Cloud", url: "https://cloud.google.com/distributed-cloud-air-gapped", date: "2026-08", kind: "google" },
  { id: "g-eu-ai-act", title: "Google Cloud EU AI Act support", org: "Google Cloud", url: "https://cloud.google.com/security/compliance/eu-ai-act", date: "2026-08", kind: "google" },

  // ---- other vendors (first-party) ----------------------------------------
  { id: "ms-rai", title: "Microsoft Responsible AI Standard v2", org: "Microsoft", url: "https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/Microsoft-Responsible-AI-Standard-General-Requirements.pdf", date: "2022-06", kind: "vendor" },
  { id: "ms-purview", title: "Purview DSPM for AI / Copilot governance", org: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/purview/ai-m365-copilot", date: "2026-08", kind: "vendor" },
  { id: "ms-agentid", title: "Entra Agent ID", org: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/entra/agent-id/what-is-microsoft-entra-agent-id", date: "2025-05", kind: "vendor" },
  { id: "aws-guardrails", title: "Amazon Bedrock Guardrails (incl. Automated Reasoning checks)", org: "AWS", url: "https://aws.amazon.com/bedrock/guardrails/", date: "2025-08", kind: "vendor" },
  { id: "aws-agentcore", title: "Amazon Bedrock AgentCore", org: "AWS docs", url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/", date: "2025-10", kind: "vendor" },
  { id: "openai-modelspec", title: "OpenAI Model Spec", org: "OpenAI", url: "https://model-spec.openai.com/", date: "2025-02", kind: "vendor" },
  { id: "openai-privacy", title: "OpenAI enterprise privacy & security", org: "OpenAI", url: "https://openai.com/enterprise-privacy/", date: "2026-08", kind: "vendor" },
  { id: "anthropic-constitution", title: "Claude's Constitution (published in full, CC0)", org: "Anthropic", url: "https://www.anthropic.com/news/claudes-constitution", date: "2026-01", kind: "vendor" },
  { id: "anthropic-rsp", title: "Responsible Scaling Policy / ASL-3 activation", org: "Anthropic", url: "https://www.anthropic.com/news/activating-asl3-protections", date: "2025-05", kind: "vendor" },
];

export const SOURCE_MAP: Record<string, Source> = Object.fromEntries(
  SOURCES.map((s) => [s.id, s]),
);
