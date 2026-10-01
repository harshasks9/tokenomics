"use client";

import { ExternalLink } from "lucide-react";
import { SOURCES } from "@/lib/earbuds/sources";
import { FIT_AID_LABEL, FEATURE_LABEL, type FeatureKey } from "@/lib/earbuds/presets";
import type { Confidence, Datum, Evidence, Product } from "@/lib/earbuds/types";

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  manufacturer: "Manufacturer",
  measured: "Lab measured",
  reviewer: "Reviewer opinion",
  derived: "Derived",
};

const EVIDENCE_HINT: Record<Evidence, string> = {
  manufacturer: "A brand claim or spec sheet (including retailer reproductions of it).",
  measured: "An independent lab measurement.",
  reviewer: "A reviewer's subjective rating or opinion.",
  derived: "Computed by this site from cited inputs — see the note.",
};

export function EvidenceBadge({ evidence, confidence }: { evidence: Evidence; confidence?: Confidence }) {
  const low = confidence && confidence !== "high";
  return (
    <span className="eb-badge" title={`${EVIDENCE_HINT[evidence]}${low ? ` Confidence: ${confidence}.` : ""}`}>
      {EVIDENCE_LABEL[evidence]}
      {low ? <span aria-label={`${confidence} confidence`}>· {confidence === "medium" ? "med" : "low"} conf.</span> : null}
    </span>
  );
}

export function SourceLinks({ ids, className = "" }: { ids: string[]; className?: string }) {
  if (!ids.length) return null;
  return (
    <span className={`inline-flex flex-wrap gap-x-2 gap-y-0.5 text-[12px] ${className}`}>
      {ids.map((id) => {
        const s = SOURCES[id];
        if (!s) return null;
        return (
          <a key={id} href={s.url} target="_blank" rel="noopener noreferrer" className="eb-link inline-flex items-center gap-0.5" title={`${s.publisher} — ${s.title}`}>
            {s.publisher}
            <ExternalLink size={10} aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      })}
    </span>
  );
}

export function featureText(key: FeatureKey, product: Product): string {
  const d = product.features[key] as Datum<string | number>;
  if (d.value === null) return "Unknown";
  if (key === "fitAid") return FIT_AID_LABEL[d.value as keyof typeof FIT_AID_LABEL];
  if (key === "caseTotalHours") return `${d.value} h`;
  if (key === "ios" || key === "android") return d.value === "full" ? "Full app support" : "Limited";
  if (d.value === "yes") return "Yes";
  if (d.value === "no") return "No";
  return String(d.value);
}

export function FeatureRow({ k, product, compact = false }: { k: FeatureKey; product: Product; compact?: boolean }) {
  const d = product.features[k] as Datum<string | number>;
  const unknown = d.value === null;
  return (
    <div className="grid grid-cols-[minmax(0,9.5rem)_1fr] gap-x-3 gap-y-0.5 py-1.5 text-[13.5px]">
      <dt className="text-[var(--eb-muted)]">{FEATURE_LABEL[k]}</dt>
      <dd className="min-w-0">
        <span className={unknown ? "italic text-[var(--eb-muted)]" : "text-[var(--eb-ink)]"}>{featureText(k, product)}</span>
        {!compact && d.note ? <span className="block text-[12px] leading-snug text-[var(--eb-muted)]">{d.note}</span> : null}
        {!compact && d.sources.length ? (
          <span className="mt-0.5 flex flex-wrap items-center gap-2">
            {!unknown ? <EvidenceBadge evidence={d.evidence} confidence={d.confidence} /> : null}
            <SourceLinks ids={d.sources} />
          </span>
        ) : null}
      </dd>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, children, id }: { eyebrow: string; title: string; children?: React.ReactNode; id?: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="eb-eyebrow">{eyebrow}</p>
      <h2 id={id} className="eb-display mt-2 text-[30px] leading-[1.1] sm:text-[40px]">
        {title}
      </h2>
      {children ? <div className="mt-3 text-[16px] leading-relaxed text-[var(--eb-ink-2)]">{children}</div> : null}
    </div>
  );
}
