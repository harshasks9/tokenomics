"use client";

import { AlertTriangle } from "lucide-react";
import { GAPS, METRIC_IDS, METRICS } from "@/lib/earbuds/metrics";
import { AWARENESS_CAUTION } from "@/lib/earbuds/presets";
import { PRODUCTS } from "@/lib/earbuds/products";
import { SNAPSHOT_DATE, SOURCE_LIST } from "@/lib/earbuds/sources";
import type { SourceKind } from "@/lib/earbuds/types";
import { SectionHeading, SourceLinks } from "./ui";

const KIND_LABEL: Record<SourceKind, string> = {
  lab: "Independent labs",
  review: "Reviews",
  manufacturer: "Manufacturers",
  retailer: "Retailer spec sheets",
  news: "Launch & price coverage",
  research: "Research & definitions",
  standard: "Standards",
};

const LIMITS = [
  "Values were captured from search-engine renderings of each cited page because this build environment blocks direct page loads. Each value is tied to the URL it came from; single-rendering or retailer-sourced values are marked medium or low confidence.",
  "RTINGS numeric scores (noise attenuation in dB, mic, comfort, neutral sound) are mostly behind its paywall, so RTINGS is used only for measured battery hours and written findings.",
  "Each lab tests one unit on one test head. Fit varies by ear and can swing noise cancelling substantially — SoundGuys says of AirPods 5 that fit 'makes or breaks the entire experience'.",
  "Firmware changes performance after testing (e.g. Google's Sep 2026 Pixel Buds Pro 2 ANC update).",
  "Bose QuietComfort Earbuds (2024) and Galaxy Buds3 FE were considered but excluded: they couldn't be researched to the minimum standard (price, battery, ANC and IP rating from cited sources).",
  "Reviewers sometimes disagree outright (CMF Buds Pro 2 grip; Nothing Ear (3) mic). Both sides are shown rather than averaged.",
];

export default function Method() {
  const coverage = METRIC_IDS.map((m) => ({ m, n: PRODUCTS.filter((p) => p.metrics[m].value !== null).length }));
  const kinds = Array.from(new Set(SOURCE_LIST.map((s) => s.kind)));

  return (
    <>
      <section id="method" aria-labelledby="method-title" className="scroll-mt-20 border-t border-[var(--eb-rule)] py-16 sm:py-20">
        <SectionHeading eyebrow="Method" title="How the comparison stays fair" id="method-title">
          <p>
            Among the products shown, a model is on the <strong>frontier</strong> when no other model is at least as good on both chart metrics and strictly better on one (lower price and lower weight are better; everything else is higher-is-better). Identical
            points share the frontier. The frontier is recomputed every time you change an axis, a filter or a requirement.
          </p>
        </SectionHeading>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="eb-card p-6">
            <h3 className="text-[16px] font-semibold">Order of operations</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-[var(--eb-ink-2)]">
              <li>Apply your hard requirements (budget, phone, multipoint, water rating, fit design, wireless charging). Unknown features never pass.</li>
              <li>Apply the brand filter.</li>
              <li>Set aside eligible models missing either chart metric — they&apos;re listed, not guessed.</li>
              <li>Compute the Pareto frontier on what remains.</li>
            </ol>
            <h3 className="mt-6 text-[16px] font-semibold">What the frontier does not tell you</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[var(--eb-ink-2)]">
              <li>Nothing about metrics that aren&apos;t on the chart — a frontier model on price × ANC may have the shortest battery.</li>
              <li>Nothing about whether it fits <em>your</em> ears or suits your activity.</li>
              <li>No single winner: every frontier model is a different, defensible tradeoff.</li>
            </ul>
            <p className="mt-4 text-[12px] text-[var(--eb-muted)]">
              Definitions: <SourceLinks ids={["pareto-front", "pareto-britannica"]} />
            </p>
          </div>

          <div className="eb-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="eb-table min-w-[520px]">
                <caption className="px-5 pb-1 pt-5 text-left text-[16px] font-semibold text-[var(--eb-ink)]">Chart metrics</caption>
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Better</th>
                    <th scope="col">Evidence</th>
                    <th scope="col" className="!text-right">
                      Coverage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coverage.map(({ m, n }) => (
                    <tr key={m}>
                      <th scope="row" className="!whitespace-normal !text-left !font-normal !normal-case !tracking-normal">
                        <span className="font-semibold text-[var(--eb-ink)]">{METRICS[m].label}</span>
                        <span className="block text-[12px] leading-snug text-[var(--eb-muted)]">{METRICS[m].definition}</span>
                      </th>
                      <td className="text-[13px]">{METRICS[m].direction === "lower" ? "Lower" : "Higher"}</td>
                      <td className="text-[13px]">{METRICS[m].evidenceLabel}</td>
                      <td className="eb-tabular text-right text-[13px]">
                        {n}/{PRODUCTS.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {Object.values(GAPS).map((g) => (
            <div key={g.id} className="eb-card p-6">
              <p className="eb-eyebrow">Evidence gap</p>
              <h3 className="mt-1 text-[16px] font-semibold">{g.label} isn&apos;t charted</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--eb-ink-2)]">{g.why}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--eb-ink-2)]">{g.instead}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="eb-card p-6">
            <h3 className="text-[16px] font-semibold">Water ratings, honestly</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--eb-ink-2)]">
              IP codes come from IEC 60529: the second digit is water (4 = splashes, 5 = jets, 7 = 1 m immersion). Tests use fresh water. Apple says its earbuds aren&apos;t sweatproof and resistance can diminish over time; Samsung&apos;s IP57 excludes salt and pool water. Some cases aren&apos;t rated at all.
            </p>
            <p className="mt-3 text-[12px]">
              <SourceLinks ids={["ip-code", "apple-water", "samsung-ip57"]} />
            </p>
          </div>
          <div className="eb-caution p-6">
            <h3 className="flex items-center gap-2 text-[16px] font-semibold">
              <AlertTriangle size={16} aria-hidden /> Transparency mode isn&apos;t a safety feature
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed">{AWARENESS_CAUTION}</p>
            <p className="mt-2 text-[14px] leading-relaxed">WHO–ITU H.870 sets a safe-listening reference of 80 dB(A) for 40 hours a week for adults.</p>
            <p className="mt-3 text-[12px]">
              <SourceLinks ids={["transparency-study", "apple-safety", "sony-ambient-warning", "bose-guide-warning", "who-h870"]} />
            </p>
          </div>
        </div>

        <div className="eb-card mt-6 p-6">
          <h3 className="text-[16px] font-semibold">Known limits of this evidence</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-relaxed text-[var(--eb-ink-2)]">
            {LIMITS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-[var(--eb-muted)]">
            Lab protocols: <SourceLinks ids={["sg-how-test", "sg-how-score", "rt-isolation", "rt-battery", "rt-stability", "rt-mic", "rt-versioning", "sg-battery-claims", "sg-bone-mics"]} />
          </p>
          <p className="mt-2 text-[12px] text-[var(--eb-muted)]">
            Comfort research: <SourceLinks ids={["ear-mri", "comfort-song2020", "comfort-ergonomics"]} />
          </p>
        </div>
      </section>

      <section id="sources" aria-labelledby="sources-title" className="scroll-mt-20 border-t border-[var(--eb-rule)] py-16 sm:py-20">
        <SectionHeading eyebrow="Sources" title={`${SOURCE_LIST.length} sources, all consulted ${SNAPSHOT_DATE}`} id="sources-title">
          <p>Every number and note on this page links to one of these. Evidence type is shown wherever a value appears: manufacturer claim, lab measurement, reviewer opinion, or derived.</p>
        </SectionHeading>
        <div className="columns-1 gap-8 md:columns-2 xl:columns-3">
          {kinds.map((k) => (
            <div key={k} className="mb-8 break-inside-avoid">
              <h3 className="eb-eyebrow mb-2">{KIND_LABEL[k]}</h3>
              <ul className="space-y-1.5 text-[13px] leading-snug">
                {SOURCE_LIST.filter((s) => s.kind === k).map((s) => (
                  <li key={s.id}>
                    <a className="eb-link" href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.publisher} — {s.title}
                    </a>
                    {s.published ? <span className="text-[var(--eb-muted)]"> · {s.published}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
