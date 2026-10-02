"use client";

import { AlertTriangle } from "lucide-react";
import { GAPS, METRIC_IDS, METRICS } from "@/lib/earbuds/metrics";
import { AWARENESS_CAUTION } from "@/lib/earbuds/presets";
import { CATALOG_RECORDS } from "@/lib/earbuds/catalog";
import { PRODUCTS } from "@/lib/earbuds/products";
import { CURATED_SOURCES, SNAPSHOT_DATE, SOURCE_LIST } from "@/lib/earbuds/sources";
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
  "The catalog is incomplete by design rather than padded: research ran in batches capped by a web-search budget, and any model with fewer than two sourced values was left out instead of filled from memory. Brands still thin in this version include Sony, Google, JBL, OnePlus, OPPO, vivo, Boult, Huawei and Jabra.",
  "Catalog values are mostly spec-sheet claims from brands, Indian retailers and aggregators (Smartprix, 91mobiles, Digit). Indian brands often quote battery and ANC figures under best-case conditions; treat them as claims, not measurements.",
  "India launch prices are the announced price at launch. Many Indian TWS models sell well below launch price within weeks, and some list a much higher MRP; neither is plotted.",
  "Reviewers sometimes disagree outright (CMF Buds Pro 2 grip; Nothing Ear (3) mic). Both sides are shown rather than averaged.",
];

export default function Method() {
  const inIndia = PRODUCTS.filter((p) => p.indiaAvailable === true || p.metrics.priceInr.value !== null);
  const coverage = METRIC_IDS.map((m) => ({
    m,
    n: PRODUCTS.filter((p) => p.metrics[m].value !== null).length,
    inN: inIndia.filter((p) => p.metrics[m].value !== null).length,
  }));
  const curatedIds = new Set(CURATED_SOURCES.map((s) => s.id));
  const curated = SOURCE_LIST.filter((s) => curatedIds.has(s.id));
  const catalogSources = SOURCE_LIST.filter((s) => !curatedIds.has(s.id));
  const kinds = Array.from(new Set(curated.map((s) => s.kind)));
  const catalogKinds = Array.from(new Set(catalogSources.map((s) => s.kind)));

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
                <caption className="px-5 pb-1 pt-5 text-left text-[16px] font-semibold text-[var(--eb-ink)]">Chart metrics and how many models have each</caption>
                <thead>
                  <tr>
                    <th scope="col">Metric</th>
                    <th scope="col">Better</th>
                    <th scope="col">Evidence</th>
                    <th scope="col" className="!text-right">
                      All
                    </th>
                    <th scope="col" className="!text-right">
                      India
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coverage.map(({ m, n, inN }) => (
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
                      <td className="eb-tabular text-right text-[13px]">
                        {inN}/{inIndia.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="eb-card mt-6 p-6">
          <h3 className="text-[16px] font-semibold">How the {PRODUCTS.length}-model catalog was built</h3>
          <div className="mt-3 grid gap-6 text-[14px] leading-relaxed text-[var(--eb-ink-2)] md:grid-cols-2">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Two tiers.</strong> {PRODUCTS.filter((p) => p.tier === "deep").length} &ldquo;deep dive&rdquo; models were researched by hand with activity notes and lab findings. The other {CATALOG_RECORDS.length} are catalog entries: sourced spec-sheet data for the
                most popular earbuds sold in India and the US.
              </li>
              <li>
                <strong>Research by brand.</strong> Parallel research passes covered Apple, Beats, Samsung, Sony, Bose, Sennheiser, Nothing, CMF, boAt, Noise, realme, Redmi/Xiaomi, Soundcore, pTron, Mivi, Truke, EarFun, SoundPEATS, Shokz and more, prioritising
                models launched 2023–2026.
              </li>
              <li>
                <strong>Every value is tied to the URL that stated it.</strong> Duplicate models from different passes were merged; conflicting values keep the higher-confidence source and the alternative is written into the model&apos;s research notes.
              </li>
            </ul>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Quality gate.</strong> Out-of-range values (for example a case weight reported as one earbud) were dropped, and any model with fewer than two sourced values was excluded rather than shown half-empty.
              </li>
              <li>
                <strong>India view.</strong> A model is in the India view when a source documents it as sold in India or gives an India launch price. Prices are the announced launch price in rupees, not MRP or sale prices.
              </li>
              <li>
                <strong>Claims are labelled as claims.</strong> Battery and &ldquo;up to X dB&rdquo; ANC figures in the catalog are manufacturer numbers. Lab scores (SoundGuys ANC, comfort; RTINGS battery) exist for a smaller subset and are plotted on their own axes.
              </li>
            </ul>
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
        <SectionHeading eyebrow="Sources" title={`${SOURCE_LIST.length} sources`} id="sources-title">
          <p>
            Every number and note on this page links to one of these. Deep-dive sources were consulted {SNAPSHOT_DATE}; catalog sources were consulted in the catalog research passes. Evidence type is shown wherever a value appears: manufacturer claim, lab
            measurement, reviewer opinion, or derived.
          </p>
        </SectionHeading>
        <h3 className="mb-4 text-[16px] font-semibold">Deep-dive and methodology sources ({curated.length})</h3>
        <div className="columns-1 gap-8 md:columns-2 xl:columns-3">
          {kinds.map((k) => (
            <div key={k} className="mb-8 break-inside-avoid">
              <h3 className="eb-eyebrow mb-2">{KIND_LABEL[k]}</h3>
              <ul className="space-y-1.5 text-[13px] leading-snug">
                {curated.filter((s) => s.kind === k).map((s) => (
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
        <details className="eb-card mt-2 p-5">
          <summary className="cursor-pointer text-[15px] font-semibold">Catalog sources ({catalogSources.length}) — retailer listings, spec aggregators, launch coverage and lab pages</summary>
          <div className="mt-4 columns-1 gap-8 md:columns-2 xl:columns-3">
            {catalogKinds.map((k) => (
              <div key={k} className="mb-6 break-inside-avoid">
                <h4 className="eb-eyebrow mb-2">
                  {KIND_LABEL[k]} · {catalogSources.filter((s) => s.kind === k).length}
                </h4>
                <ul className="space-y-1 text-[12.5px] leading-snug">
                  {catalogSources
                    .filter((s) => s.kind === k)
                    .map((s) => (
                      <li key={s.id} className="break-words">
                        <a className="eb-link" href={s.url} target="_blank" rel="noopener noreferrer">
                          {s.publisher}
                        </a>{" "}
                        <span className="text-[var(--eb-muted)]">{s.title}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </section>
    </>
  );
}
