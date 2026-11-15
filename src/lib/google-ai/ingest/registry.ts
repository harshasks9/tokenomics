/**
 * Source inventory — what the pipeline monitors.
 *
 * Official feeds and pages only; no scraping of search results or paywalled
 * sites. General-purpose feeds are filtered to AI items. Before each fetch
 * the pipeline checks the host's robots.txt (see fetch.ts).
 */
import type { Feed } from "./types";

export const FEEDS: Feed[] = [
  // ── Google: company and research blogs
  { key: "google-blog-ai", name: "The Keyword — AI", publisher: "Google", providerId: "google", url: "https://blog.google/technology/ai/rss/", format: "rss", category: "official-blog", layers: ["models", "consumer"] },
  { key: "google-blog-gemini", name: "The Keyword — Gemini app", publisher: "Google", providerId: "google", url: "https://blog.google/products/gemini/rss/", format: "rss", category: "official-blog", layers: ["consumer"] },
  { key: "google-blog-search", name: "The Keyword — Search", publisher: "Google", providerId: "google", url: "https://blog.google/products/search/rss/", format: "rss", category: "official-blog", layers: ["consumer"], aiFilter: true },
  { key: "deepmind-blog", name: "Google DeepMind blog", publisher: "Google DeepMind", providerId: "google", url: "https://deepmind.google/blog/rss.xml", format: "rss", category: "research", layers: ["research", "models"] },
  { key: "google-research-blog", name: "Google Research blog", publisher: "Google Research", providerId: "google", url: "https://research.google/blog/rss/", format: "rss", category: "research", layers: ["research"] },
  // ── Google: developer and cloud
  { key: "google-developers-blog", name: "Google for Developers blog", publisher: "Google", providerId: "google", url: "https://developers.googleblog.com/feeds/posts/default", format: "atom", category: "official-blog", layers: ["platform", "agents"], aiFilter: true },
  { key: "google-cloud-blog", name: "Google Cloud blog", publisher: "Google Cloud", providerId: "google", url: "https://cloudblog.withgoogle.com/rss/", format: "rss", category: "official-blog", layers: ["platform", "enterprise"], aiFilter: true },
  { key: "agent-platform-release-notes", name: "Generative AI on Agent Platform — release notes", publisher: "Google Cloud", providerId: "google", url: "https://docs.cloud.google.com/feeds/generative-ai-on-vertex-ai-release-notes.xml", format: "atom", category: "release-notes", layers: ["platform", "agents"] },
  { key: "gemini-api-changelog", name: "Gemini API changelog", publisher: "Google", providerId: "google", url: "https://ai.google.dev/gemini-api/docs/changelog", format: "html-page", category: "changelog", layers: ["platform", "models"], watch: "hash" },
  { key: "gemini-api-deprecations", name: "Gemini API deprecations", publisher: "Google", providerId: "google", url: "https://ai.google.dev/gemini-api/docs/deprecations", format: "html-page", category: "docs", layers: ["models"], watch: "hash" },
  // ── Google: Workspace
  { key: "workspace-updates", name: "Google Workspace Updates", publisher: "Google Workspace", providerId: "google", url: "https://workspaceupdates.googleblog.com/feeds/posts/default", format: "atom", category: "release-notes", layers: ["enterprise"], aiFilter: true },
  // ── Google: pricing pages (watched for changes, prices compared with the knowledge base)
  { key: "agent-platform-pricing", name: "Agent Platform generative AI pricing", publisher: "Google Cloud", providerId: "google", url: "https://cloud.google.com/vertex-ai/generative-ai/pricing", format: "html-page", category: "pricing-page", layers: ["models", "platform"], watch: "prices" },
  { key: "gemini-api-pricing", name: "Gemini Developer API pricing", publisher: "Google", providerId: "google", url: "https://ai.google.dev/gemini-api/docs/pricing", format: "html-page", category: "pricing-page", layers: ["models", "platform"], watch: "hash" },
  { key: "gemini-enterprise-pricing", name: "Gemini Enterprise pricing", publisher: "Google Cloud", providerId: "google", url: "https://cloud.google.com/gemini-enterprise/pricing", format: "html-page", category: "pricing-page", layers: ["enterprise"], watch: "hash" },
  // ── Competitors (for the comparison and correlation views)
  { key: "openai-news", name: "OpenAI news", publisher: "OpenAI", providerId: "openai", url: "https://openai.com/news/rss.xml", format: "rss", category: "competitor", layers: ["models"] },
  { key: "anthropic-news", name: "Anthropic news", publisher: "Anthropic", providerId: "anthropic", url: "https://www.anthropic.com/news", format: "html-page", category: "competitor", layers: ["models"], watch: "hash" },
  { key: "aws-ml-blog", name: "AWS Machine Learning blog", publisher: "AWS", providerId: "aws", url: "https://aws.amazon.com/blogs/machine-learning/feed/", format: "rss", category: "competitor", layers: ["platform"], aiFilter: true },
  { key: "microsoft-ai-blog", name: "Microsoft Foundry blog", publisher: "Microsoft", providerId: "microsoft", url: "https://devblogs.microsoft.com/foundry/feed/", format: "rss", category: "competitor", layers: ["platform"] },
];

export const FEED_BY_KEY = Object.fromEntries(FEEDS.map((f) => [f.key, f]));
