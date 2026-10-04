/**
 * Earbuds Pareto — shared types.
 *
 * Every number and feature carries its evidence type and the source ids it came
 * from. `null` always means "not established by our sources" (unknown) and is
 * never coerced into a pass, a zero, or an average.
 */

/** manufacturer = brand claim / spec sheet (incl. retailer-reproduced specs);
 *  measured    = independent lab measurement;
 *  reviewer    = subjective rating or opinion from a reviewer;
 *  derived     = computed by this site from cited inputs. */
export type Evidence = "manufacturer" | "measured" | "reviewer" | "derived";

export type Confidence = "high" | "medium" | "low";

export type SourceKind =
  | "manufacturer"
  | "lab"
  | "review"
  | "retailer"
  | "news"
  | "research"
  | "standard";

export interface Source {
  id: string;
  publisher: string;
  title: string;
  url: string;
  kind: SourceKind;
  /** Publication date if known (ISO yyyy-mm or yyyy-mm-dd). */
  published?: string;
  /** Date this source was consulted. */
  accessed: string;
}

export interface Datum<T> {
  value: T | null;
  evidence: Evidence;
  sources: string[];
  confidence: Confidence;
  note?: string;
}

/** The comparable numeric metrics that can be put on a chart axis. */
export type MetricId =
  | "price"
  | "priceInr"
  | "anc"
  | "ancClaim"
  | "batteryClaim"
  | "batteryMax"
  | "batteryTotal"
  | "batteryMeasured"
  | "comfort"
  | "weight";

/** Which market's prices and availability scope the explorer. */
export type Market = "in" | "us";

/** Axes the brief asked for that research could not substantiate. */
export type GapMetricId = "sound" | "mic";

export type AxisId = MetricId | GapMetricId;

export type Direction = "lower" | "higher";

/** Brand display name as the manufacturer writes it (e.g. "boAt", "CMF"). */
export type Brand = string;

/** in-ear = sealed tips; semi-in-ear = unsealed AirPods-style; open-ear/clip sit outside the canal. */
export type Form = "in-ear" | "semi-in-ear" | "open-ear" | "ear-hook" | "clip";

export type AncType = "none" | "anc" | "adaptive";

export type FitAid = "ear-hook" | "wing-or-fin" | "stability-band" | "tips-only" | "open-fit";

export type TriState = "yes" | "no";

export type OsSupport = "full" | "limited";

export type ActivityId = "gym" | "office" | "commute" | "calls" | "travel" | "outdoor";

export interface ProductNote {
  /** Activity the note bears on, or "general". */
  topic: ActivityId | "general" | "sound" | "mic";
  kind: "strength" | "limitation" | "context";
  text: string;
  evidence: Evidence;
  sources: string[];
}

export interface Product {
  id: string;
  /** deep = hand-researched with activity notes; catalog = sourced spec-sheet entry. */
  tier: "deep" | "catalog";
  brand: Brand;
  name: string;
  /** Short label used on the chart. */
  short: string;
  generation: string;
  released: string;
  /** yyyy-mm, for recency filtering; null when unknown. */
  releasedMonth: string | null;
  form: Form | null;
  /** Sold in India per our sources (null = not established). */
  indiaAvailable: boolean | null;
  /** Street-price context — not plotted. */
  priceNote?: string;
  /** Research caveats for catalog entries (conflicts, estimates). */
  researchNote?: string;
  /** Overall confidence of a catalog entry. */
  confidence?: Confidence;
  metrics: Record<MetricId, Datum<number>>;
  features: {
    /** Buds' IP code exactly as documented, e.g. "IP57", "IPX4". */
    ipRating: Datum<string>;
    multipoint: Datum<TriState>;
    /** Brand-ecosystem switching that is not standard multipoint. */
    ecosystemSwitching: Datum<string>;
    transparency: Datum<TriState>;
    wirelessCharging: Datum<TriState>;
    fitAid: Datum<FitAid>;
    controls: Datum<string>;
    heartRate: Datum<TriState>;
    ios: Datum<OsSupport>;
    android: Datum<OsSupport>;
    /** Claimed total playback with case, ANC on (hours). */
    caseTotalHours: Datum<number>;
    ancType: Datum<AncType>;
    codecs: Datum<string>;
    bluetooth: Datum<string>;
  };
  notes: ProductNote[];
}
