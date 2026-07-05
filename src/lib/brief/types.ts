export type BriefCategory =
  | "Models & Research"
  | "Infrastructure & Chips"
  | "Enterprise & Cloud"
  | "Agents & Developer Tools"
  | "Policy & Regulation"
  | "Security & Trust"
  | "Funding & Business";

export interface RelatedLink {
  title: string;
  url: string;
}

export interface NewsItem {
  id: string;
  rank: number;
  headline: string;
  summary: string;
  why_it_matters: string;
  source_name: string;
  source_url: string;
  published_at: string;
  category: BriefCategory;
  confidence_score: number;
  reliability_score: number;
  google_cloud_interpretation: string;
  relevant_google_cloud_products: string[];
  competitive_implications: string;
  field_action: string;
  deeper_analysis: string;
  related_links: RelatedLink[];
}

export type BriefMode = "live" | "mock";

export interface DailyBrief {
  date: string; // YYYY-MM-DD (UTC)
  generated_at: string; // ISO timestamp
  signal_summary: string[]; // "Today's AI Signal" executive bullets
  items: NewsItem[];
  coverage_note: string | null; // set when fewer than 10 quality stories were found
  mode: BriefMode;
}

export interface BriefIndexEntry {
  date: string;
  generated_at: string;
  item_count: number;
  mode: BriefMode;
}
