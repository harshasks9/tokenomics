import type { AnnouncementType, EditorialReview, LayerId, RadarArea, SourceSnapshot } from "../types";

export type FeedFormat = "rss" | "atom" | "html-page";
export type FeedCategory = "official-blog" | "release-notes" | "pricing-page" | "docs" | "research" | "changelog" | "competitor";

/** One monitored source. */
export interface Feed {
  key: string;
  name: string;
  publisher: string;
  /** Canonical provider id the feed belongs to. */
  providerId: string;
  url: string;
  format: FeedFormat;
  category: FeedCategory;
  /** Default layers for items from this feed when the text gives no stronger signal. */
  layers: LayerId[];
  /** Only keep items whose text matches (general-purpose feeds carry non-AI posts). */
  aiFilter?: boolean;
  /** For html-page feeds: watch for content changes (pricing, deprecation tables). */
  watch?: "hash" | "prices";
}

/** A raw item parsed out of a feed, before any interpretation. */
export interface RawItem {
  feedKey: string;
  title: string;
  url: string;
  published?: string;
  summary: string;
}

/** A normalized, classified item awaiting editorial review. Never shown as a verified fact. */
export interface DetectedItem {
  id: string;
  title: string;
  url: string;
  published?: string;
  firstSeenAt: string;
  feedKeys: string[];
  publisher: string;
  providerId: string;
  excerpt: string;
  types: AnnouncementType[];
  areas: RadarArea[];
  layers: LayerId[];
  entityIds: string[];
  /** Other URLs clustered into this development. */
  alsoAt: string[];
  /** Canonical announcement this matches, when one already exists. */
  knownAs?: string;
  /** 0–100 triage score: decides review order, nothing else. */
  score: number;
  review: EditorialReview;
}

export interface PriceCheck {
  entityId: string;
  name: string;
  meter: "input" | "output";
  expected: number;
  found: number | null;
  status: "match" | "changed" | "not-found";
}

export interface Alert {
  id: string;
  at: string;
  kind: "price-change" | "page-changed" | "deadline" | "source-failing";
  title: string;
  detail: string;
  url?: string;
}

export interface FeedRun extends SourceSnapshot {
  items: number;
  /** robots.txt verdict for the URL. */
  robots: "allowed" | "disallowed" | "unknown";
  /** Content hash differed from the previous successful snapshot. */
  changed?: boolean;
}

export interface RunStatus {
  startedAt: string;
  finishedAt: string;
  /** True when at least one source was fetched and parsed. */
  ok: boolean;
  feeds: FeedRun[];
  fetched: number;
  failed: number;
  newItems: number;
  priceChecks: PriceCheck[];
  alerts: number;
  error?: string;
}

export interface PipelineState {
  /** Where state is persisted in this deployment. "memory" does not survive a restart. */
  store: "redis" | "file" | "memory";
  lastRun: RunStatus | null;
  /** Most recent run in which at least one source succeeded. */
  lastSuccessAt: string | null;
  items: DetectedItem[];
  alerts: Alert[];
}
