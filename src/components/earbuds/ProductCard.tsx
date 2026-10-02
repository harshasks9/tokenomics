"use client";

import { Check, Minus, Pin, PinOff, Plus, X } from "lucide-react";
import { METRIC_IDS, METRICS } from "@/lib/earbuds/metrics";
import { PRESET_BY_ID, type FeatureKey } from "@/lib/earbuds/presets";
import { SOURCES } from "@/lib/earbuds/sources";
import type { ActivityId, MetricId, Product, ProductNote } from "@/lib/earbuds/types";
import { EvidenceBadge, FeatureRow, SourceLinks } from "./ui";

const DEFAULT_FEATURES: FeatureKey[] = ["ancType", "ipRating", "fitAid", "multipoint", "transparency", "wirelessCharging", "codecs", "bluetooth", "controls", "ios", "android"];

const TOPIC_LABEL: Record<ProductNote["topic"], string> = {
  gym: "Gym",
  office: "Office",
  commute: "Commute",
  calls: "Calls",
  travel: "Travel",
  outdoor: "Outdoor",
  general: "General",
  sound: "Sound",
  mic: "Mic",
};

export interface FrontierStatus {
  label: string;
  tone: "frontier" | "dominated" | "excluded" | "missing";
}

interface Props {
  product: Product;
  activity: ActivityId | null;
  highlight: MetricId[];
  status?: FrontierStatus;
  pinned: boolean;
  canPin: boolean;
  onTogglePin: () => void;
  onClose?: () => void;
  headingLevel?: "h3" | "h4";
}

function notesFor(product: Product, activity: ActivityId | null): ProductNote[] {
  const topics: ProductNote["topic"][] = activity ? [activity, "general"] : ["gym", "office", "commute", "calls", "travel", "outdoor", "general"];
  // Outdoor exercise borrows gym fit evidence; calls is where mic evidence lives.
  if (activity === "outdoor") topics.push("gym");
  return product.notes.filter((n) => topics.includes(n.topic));
}

export default function ProductCard({ product, activity, highlight, status, pinned, canPin, onTogglePin, onClose, headingLevel = "h3" }: Props) {
  const H = headingLevel;
  const catalog = product.tier === "catalog";
  const baseFeatures = activity ? Array.from(new Set([...PRESET_BY_ID[activity].features, "ancType", "ipRating", "multipoint"] as FeatureKey[])) : DEFAULT_FEATURES;
  // Catalog entries only list what the spec-sheet research covered, plus the unknowns that matter for the activity.
  const features = catalog ? baseFeatures.filter((k) => product.features[k].value !== null || (activity ? PRESET_BY_ID[activity].features.includes(k) : ["ancType", "ipRating", "multipoint"].includes(k))) : baseFeatures;
  const metricIds = catalog ? METRIC_IDS.filter((id) => product.metrics[id].value !== null || highlight.includes(id)) : METRIC_IDS;
  const hiddenMetrics = METRIC_IDS.length - metricIds.length;
  const notes = notesFor(product, activity);
  const strengths = notes.filter((n) => n.kind === "strength");
  const limits = notes.filter((n) => n.kind === "limitation");
  const context = notes.filter((n) => n.kind === "context");
  const sound = product.notes.filter((n) => n.topic === "sound");
  const allSourceIds = Array.from(
    new Set([
      ...Object.values(product.metrics).flatMap((d) => d.sources),
      ...Object.values(product.features).flatMap((d) => d.sources),
      ...product.notes.flatMap((n) => n.sources),
    ]),
  ).filter((id) => SOURCES[id]);

  return (
    <article className="eb-card flex h-full flex-col p-5 sm:p-6" aria-label={`${product.brand} ${product.name}`}>
      <header className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row">
        <div className="min-w-0">
          <p className="eb-eyebrow">{product.brand}</p>
          <H className="eb-display mt-1 text-[22px] leading-tight">{product.name}</H>
          <p className="mt-1 text-[13px] text-[var(--eb-muted)]">
            {product.generation} · {product.released}
          </p>
          <p className="mt-1.5 flex flex-wrap gap-1.5">
            {catalog ? <span className="eb-badge">Catalog · spec-sheet research</span> : <span className="eb-badge eb-badge-accent">Deep dive · activity notes</span>}
            {catalog && product.confidence ? <span className="eb-badge">{product.confidence} confidence</span> : null}
            {product.indiaAvailable ? <span className="eb-badge">Sold in India</span> : null}
          </p>
        </div>
        <div className="flex flex-none items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            className={`eb-btn !min-h-[34px] !px-3 ${pinned ? "eb-btn-accent" : ""}`}
            aria-pressed={pinned}
            disabled={!pinned && !canPin}
            onClick={onTogglePin}
            title={!pinned && !canPin ? "Compare holds up to three — unpin one first" : undefined}
          >
            {pinned ? <PinOff size={14} aria-hidden /> : <Pin size={14} aria-hidden />}
            {pinned ? "Pinned" : "Pin to compare"}
          </button>
          {onClose ? (
            <button type="button" className="eb-btn !min-h-[34px] !px-2" onClick={onClose} aria-label="Close details">
              <X size={16} aria-hidden />
            </button>
          ) : null}
        </div>
      </header>

      {status ? (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-[13px] leading-snug ${
            status.tone === "frontier" ? "bg-[var(--eb-accent-wash)] text-[var(--eb-accent-ink)]" : "bg-[var(--eb-paper)] text-[var(--eb-ink-2)]"
          }`}
        >
          <span className="font-semibold">{status.tone === "frontier" ? "● " : "○ "}</span>
          {status.label}
        </p>
      ) : null}

      <section className="mt-5" aria-label="Comparable metrics">
        <p className="eb-eyebrow mb-2">Verified metrics</p>
        <dl className="divide-y divide-[var(--eb-rule)]">
          {metricIds.map((id) => {
            const d = product.metrics[id];
            const m = METRICS[id];
            const hi = highlight.includes(id);
            return (
              <div key={id} className={`py-2 ${hi ? "-mx-2 rounded-md bg-[var(--eb-paper)] px-2" : ""}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-[13.5px] text-[var(--eb-ink-2)]">
                    {m.label}
                    {hi ? <span className="sr-only"> (on the chart)</span> : null}
                  </dt>
                  <dd className="eb-tabular text-[15px] font-semibold">
                    {d.value === null ? <span className="text-[13px] font-normal italic text-[var(--eb-muted)]">Not established</span> : m.format(d.value)}
                  </dd>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {d.value !== null ? <EvidenceBadge evidence={d.evidence} confidence={d.confidence} /> : null}
                  <SourceLinks ids={d.sources} />
                </div>
                {d.note ? <p className="mt-1 text-[12px] leading-snug text-[var(--eb-muted)]">{d.note}</p> : null}
              </div>
            );
          })}
        </dl>
        {hiddenMetrics > 0 ? <p className="mt-2 text-[12px] italic text-[var(--eb-muted)]">{hiddenMetrics} other metrics not established by our sources for this model.</p> : null}
        {product.priceNote ? <p className="mt-2 text-[12px] text-[var(--eb-muted)]">Price note: {product.priceNote}</p> : null}
        {product.researchNote ? (
          <details className="mt-2 text-[12px] text-[var(--eb-muted)]">
            <summary className="cursor-pointer font-semibold text-[var(--eb-ink-2)]">Research notes & conflicts</summary>
            <p className="mt-1 leading-snug">{product.researchNote}</p>
          </details>
        ) : null}
      </section>

      <section className="mt-5" aria-label="Functionality">
        <p className="eb-eyebrow mb-1">{activity ? `What matters for ${PRESET_BY_ID[activity].label.toLowerCase()}` : "Functionality"}</p>
        <dl>
          {features.map((k) => (
            <FeatureRow key={k} k={k} product={product} />
          ))}
        </dl>
      </section>

      <section className="mt-5" aria-label="Strengths and limitations">
        <p className="eb-eyebrow mb-2">{activity ? `${PRESET_BY_ID[activity].label}: strengths & limitations` : "Activity strengths & limitations"}</p>
        {strengths.length + limits.length + context.length === 0 ? (
          <p className="text-[13px] italic text-[var(--eb-muted)]">
            {catalog
              ? "Catalog entries carry spec-sheet data only — activity notes weren't researched for this model. Absence of notes is a gap in the evidence, not a verdict."
              : "No sourced notes for this activity — that is a gap in the evidence, not a verdict."}
          </p>
        ) : (
          <ul className="space-y-2.5">
            {[...strengths, ...limits, ...context].map((n, i) => (
              <li key={i} className="flex gap-2.5 text-[13.5px] leading-snug">
                <span
                  className={`mt-0.5 flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full ${
                    n.kind === "strength" ? "bg-[var(--eb-accent-wash)] text-[var(--eb-accent-ink)]" : n.kind === "limitation" ? "bg-[var(--eb-caution-wash)] text-[var(--eb-caution-ink)]" : "bg-[var(--eb-paper-2)] text-[var(--eb-ink-2)]"
                  }`}
                  aria-hidden
                >
                  {n.kind === "strength" ? <Plus size={12} /> : n.kind === "limitation" ? <Minus size={12} /> : <Check size={11} />}
                </span>
                <span className="min-w-0">
                  <span className="sr-only">{n.kind === "strength" ? "Strength: " : n.kind === "limitation" ? "Limitation: " : "Context: "}</span>
                  {!activity ? <span className="mr-1 font-semibold text-[var(--eb-ink-2)]">{TOPIC_LABEL[n.topic]} —</span> : null}
                  {n.text}{" "}
                  <span className="whitespace-nowrap">
                    <SourceLinks ids={n.sources} />
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {sound.length ? (
        <section className="mt-5" aria-label="Sound character">
          <p className="eb-eyebrow mb-1.5">Sound character (not scored)</p>
          {sound.map((n, i) => (
            <p key={i} className="text-[13.5px] leading-snug text-[var(--eb-ink-2)]">
              {n.text} <SourceLinks ids={n.sources} />
            </p>
          ))}
        </section>
      ) : null}

      <details className="mt-auto pt-5 text-[13px]">
        <summary className="cursor-pointer font-semibold text-[var(--eb-ink-2)]">All {allSourceIds.length} sources for this model</summary>
        <ul className="mt-2 space-y-1">
          {allSourceIds.map((id) => {
            const s = SOURCES[id];
            return (
              <li key={id} className="leading-snug">
                <a className="eb-link" href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.publisher} — {s.title}
                </a>
                <span className="text-[var(--eb-muted)]">
                  {" "}
                  · {s.kind}
                  {s.published ? ` · ${s.published}` : ""} · accessed {s.accessed}
                </span>
              </li>
            );
          })}
        </ul>
      </details>
    </article>
  );
}
