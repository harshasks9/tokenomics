// Curated ingestion feeds. Tier drives default credibility (see design §2).
// Failures are non-fatal: a dead/blocked feed is skipped, not the whole run.

export interface FeedSource {
  name: string;
  url: string;
  tier: 1 | 2 | 3 | 4;
}

export const FEEDS: FeedSource[] = [
  // Tier 1 — primary / official
  { name: "Google Cloud Blog — AI/ML", url: "https://cloud.google.com/blog/products/ai-machine-learning/rss/", tier: 1 },
  { name: "Google DeepMind", url: "https://deepmind.google/blog/rss.xml", tier: 1 },
  { name: "OpenAI News", url: "https://openai.com/news/rss.xml", tier: 1 },
  { name: "Anthropic News", url: "https://www.anthropic.com/rss.xml", tier: 1 },
  { name: "AWS Machine Learning Blog", url: "https://aws.amazon.com/blogs/machine-learning/feed/", tier: 1 },
  { name: "Microsoft AI Blog", url: "https://blogs.microsoft.com/ai/feed/", tier: 1 },
  { name: "NVIDIA Blog", url: "https://blogs.nvidia.com/feed/", tier: 1 },
  { name: "Meta AI", url: "https://ai.meta.com/blog/rss/", tier: 1 },
  // Tier 2 — top-tier / trade press
  { name: "The Verge — AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", tier: 2 },
  { name: "VentureBeat — AI", url: "https://venturebeat.com/category/ai/feed/", tier: 2 },
  { name: "TechCrunch — AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", tier: 2 },
  { name: "Ars Technica — AI", url: "https://arstechnica.com/ai/feed/", tier: 2 },
  { name: "MIT Technology Review — AI", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", tier: 2 },
  // Tier 4 — developer / community signal
  { name: "Hacker News (front page)", url: "https://hnrss.org/frontpage?points=150", tier: 4 },
];
