"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { explore } from "@/lib/earbuds/explore";
import { forMarket, GAPS, isMetric, METRIC_IDS, METRICS, priceMetric } from "@/lib/earbuds/metrics";
import { MIN_COVERAGE, type Weights } from "@/lib/earbuds/preference";
import { FEATURE_LABEL, PRESET_BY_ID, PRESETS } from "@/lib/earbuds/presets";
import { PRODUCT_BY_ID, PRODUCTS } from "@/lib/earbuds/products";
import { countActive, NO_REQUIREMENTS, type Requirements } from "@/lib/earbuds/requirements";
import { SNAPSHOT_DATE, SOURCE_LIST } from "@/lib/earbuds/sources";
import type { ActivityId, AxisId, Brand, GapMetricId, Market, MetricId, ProductNote } from "@/lib/earbuds/types";
import { AxisPicker, BrandFilter, MarketSwitch, RequirementsPanel } from "./Controls";
import Method from "./Method";
import ParetoChart from "./ParetoChart";
import PreferencePanel from "./PreferencePanel";
import ProductCard, { type FrontierStatus } from "./ProductCard";
import ProductList from "./ProductList";
import { SectionHeading, SourceLinks } from "./ui";

const DEFAULT_WEIGHTS: Weights = { price: 2, anc: 2, batteryMax: 1, comfort: 1 };
const DEFAULT_MARKET: Market = "in";

/** Presets and defaults speak in "price"; each market has its own price metric. */
function weightsFor(w: Weights, market: Market): Weights {
  const out: Weights = {};
  for (const [k, v] of Object.entries(w)) out[forMarket(k as MetricId, market)] = v;
  return out;
}

const axisFor = (a: AxisId, market: Market): AxisId => (isMetric(a) ? forMarket(a, market) : a);

const IN_MARKET_COUNTS = {
  in: PRODUCTS.filter((p) => p.indiaAvailable === true || p.metrics.priceInr.value !== null).length,
  us: PRODUCTS.filter((p) => p.metrics.price.value !== null).length,
};
const BRAND_COUNT = new Set(PRODUCTS.map((p) => p.brand)).size;
const MAX_COMPARE = 3;

const NAV = [
  { href: "#explore", label: "Explore" },
  { href: "#compare", label: "Compare" },
  { href: "#preferences", label: "Preferences" },
  { href: "#method", label: "Method" },
  { href: "#sources", label: "Sources" },
];

/** Valid metric pair for the table/list when an evidence-gap axis is selected. */
function fallbackAxes(x: AxisId, y: AxisId, market: Market): [MetricId, MetricId] {
  const price = priceMetric(market);
  const fx: MetricId = isMetric(x) ? x : price;
  const fy: MetricId = isMetric(y) ? y : fx === "anc" ? price : "anc";
  return fx === fy ? [fx, fx === price ? "anc" : price] : [fx, fy];
}

export default function Site() {
  const reduce = useReducedMotion();
  const [activity, setActivity] = useState<ActivityId | null>(null);
  const [market, setMarket] = useState<Market>(DEFAULT_MARKET);
  const [x, setX] = useState<AxisId>(priceMetric(DEFAULT_MARKET));
  const [y, setY] = useState<AxisId>("anc");
  const [req, setReq] = useState<Requirements>(NO_REQUIREMENTS);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pinned, setPinned] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [weights, setWeights] = useState<Weights>(weightsFor(DEFAULT_WEIGHTS, DEFAULT_MARKET));
  const [notice, setNotice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const gapAxis: GapMetricId | null = !isMetric(x) ? (x as GapMetricId) : !isMetric(y) ? (y as GapMetricId) : null;
  const [mx, my] = fallbackAxes(x, y, market);
  const result = useMemo(() => explore(PRODUCTS, { x: mx, y: my, requirements: req, brands, market }), [mx, my, req, brands, market]);
  const brandCounts = useMemo(() => {
    const c = new Map<Brand, number>();
    for (const e of result.eligibility) if (!result.outOfMarket.includes(e)) c.set(e.product.brand, (c.get(e.product.brand) ?? 0) + 1);
    return [...c.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [result]);

  const switchMarket = (m: Market) => {
    if (m === market) return;
    setMarket(m);
    setX((a) => axisFor(a, m));
    setY((a) => axisFor(a, m));
    setWeights((w) => weightsFor(w, m));
    // A budget in one currency means nothing in the other.
    setReq((r) => ({ ...r, maxPrice: null }));
    setBrands([]);
    setNotice(m === "in" ? "Showing earbuds sold in India, priced in rupees." : "Showing earbuds sold in the US, priced in dollars.");
  };
  const preset = activity ? PRESET_BY_ID[activity] : null;
  const activeReqs = countActive(req) + (brands.length ? 1 : 0);

  const choosePreset = (id: ActivityId | null) => {
    setActivity(id);
    if (id) {
      const p = PRESET_BY_ID[id];
      setX(forMarket(p.x, market));
      setY(forMarket(p.y, market));
      setWeights(weightsFor(p.weights, market));
      setNotice(`${p.label} preset: chart now shows ${METRICS[forMarket(p.x, market)].label} against ${METRICS[forMarket(p.y, market)].label}.`);
    } else {
      setX(priceMetric(market));
      setY("anc");
      setWeights(weightsFor(DEFAULT_WEIGHTS, market));
      setNotice("Showing all activities: price against noise cancellation.");
    }
  };

  const togglePin = (id: string) => {
    setPinned((cur) => {
      if (cur.includes(id)) {
        setNotice(`${PRODUCT_BY_ID[id].short} removed from comparison.`);
        return cur.filter((p) => p !== id);
      }
      if (cur.length >= MAX_COMPARE) {
        setNotice("Compare holds up to three models — unpin one first.");
        return cur;
      }
      setNotice(`${PRODUCT_BY_ID[id].short} pinned to compare (${cur.length + 1} of ${MAX_COMPARE}).`);
      return [...cur, id];
    });
  };

  const select = (id: string) => {
    setActiveId(id);
    requestAnimationFrame(() => document.getElementById("eb-detail")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }));
  };

  const resetAll = () => {
    setActivity(null);
    setX(priceMetric(market));
    setY("anc");
    setReq(NO_REQUIREMENTS);
    setBrands([]);
    setPinned([]);
    setActiveId(null);
    setWeights(weightsFor(DEFAULT_WEIGHTS, market));
    setNotice("Everything reset to the default view.");
  };

  const statusFor = (id: string): FrontierStatus => {
    if (gapAxis) return { label: `${GAPS[gapAxis].label} can't be charted — no frontier for this axis.`, tone: "missing" };
    const pt = result.points.find((p) => p.id === id);
    if (pt?.onFrontier) return { label: `On the frontier for ${METRICS[mx].label.toLowerCase()} × ${METRICS[my].label.toLowerCase()} among the products shown.`, tone: "frontier" };
    if (pt) return { label: `Dominated on these two metrics by ${pt.dominatedBy.map((d) => PRODUCT_BY_ID[d].short).join(", ")}.`, tone: "dominated" };
    const miss = result.missing.find((m) => m.product.id === id);
    if (miss) return { label: `Not plotted: no comparable ${miss.metrics.map((m) => METRICS[m].label.toLowerCase()).join(" or ")} data.`, tone: "missing" };
    const ex = result.eligibility.find((e) => e.product.id === id);
    if (ex && result.outOfMarket.includes(ex)) return { label: `Not in the ${market === "in" ? "India" : "US"} view: ${ex.exclusions.find((e) => e.requirement === "market")?.reason}.`, tone: "excluded" };
    return { label: `Excluded by your filters: ${ex?.exclusions.map((e) => e.reason).join("; ")}.`, tone: "excluded" };
  };

  const active = activeId ? PRODUCT_BY_ID[activeId] : null;
  const notPlotted = result.failed.length + result.unknown.length + result.missing.length + result.brandFiltered.length + result.outOfMarket.length;

  return (
    <div className={`min-h-screen ${pinned.length ? "pb-24" : ""}`}>
      <p className="sr-only" role="status" aria-live="polite">
        {notice}
      </p>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-[var(--eb-rule)] bg-[color-mix(in_srgb,var(--eb-paper)_88%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="eb-display text-[19px]">Tradeoff</span>
            <span className="text-[12px] text-[var(--eb-muted)]">earbuds · {SNAPSHOT_DATE}</span>
          </a>
          <nav aria-label="Sections" className="hidden gap-1 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-[13.5px] text-[var(--eb-ink-2)] transition-colors hover:bg-[var(--eb-paper-2)] hover:text-[var(--eb-ink)]">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#explore" className="eb-btn eb-btn-accent !min-h-[34px] md:hidden">
            Explore
          </a>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="pb-12 pt-16 sm:pb-16 sm:pt-24" aria-labelledby="hero-title">
          <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <p className="eb-eyebrow">Wireless earbuds · Pareto frontier · India &amp; US pricing</p>
            <h1 id="hero-title" className="eb-display mt-4 max-w-4xl text-[46px] leading-[1.02] sm:text-[76px]">
              Find your best <em className="text-[var(--eb-accent)]">tradeoff</em>.
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-[var(--eb-ink-2)] sm:text-[20px]">
              No earbud wins at everything. Explore the strongest balance of performance, price, and the features that matter to your day.
            </p>
          </motion.div>
          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-5 border-t border-[var(--eb-rule)] pt-6 sm:grid-cols-4"
          >
            {[
              { k: `${PRODUCTS.length}`, v: `models across ${BRAND_COUNT} brands` },
              { k: `${IN_MARKET_COUNTS.in}`, v: "documented as sold in India, with ₹ launch prices where announced" },
              { k: `${METRIC_IDS.length}`, v: "comparable metrics; 2 evidence gaps disclosed, not filled" },
              { k: `${SOURCE_LIST.length}`, v: "cited sources" },
            ].map((s) => (
              <div key={s.v}>
                <dt className="sr-only">{s.v}</dt>
                <dd className="eb-display text-[34px] leading-none">{s.k}</dd>
                <dd className="mt-1.5 text-[13px] leading-snug text-[var(--eb-muted)]">{s.v}</dd>
              </div>
            ))}
          </motion.dl>
        </section>

        {/* ── Explore ────────────────────────────────────────────── */}
        <section id="explore" aria-labelledby="explore-title" className="scroll-mt-20 border-t border-[var(--eb-rule)] py-14 sm:py-16">
          <SectionHeading eyebrow="Explore" title="What are they for?" id="explore-title">
            <p>Pick a market and an activity to get suggested axes and the features that matter. Hard requirements decide which models qualify; the frontier is drawn only among them.</p>
          </SectionHeading>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <MarketSwitch market={market} onChange={switchMarket} />
            <p className="text-[13px] text-[var(--eb-muted)]">
              {market === "in"
                ? `${IN_MARKET_COUNTS.in} models documented as sold in India · prices are India launch prices in ₹`
                : `${IN_MARKET_COUNTS.us} models with a US launch price · prices in $`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Activity presets">
            <button type="button" className="eb-chip" aria-pressed={activity === null} onClick={() => choosePreset(null)}>
              All activities
            </button>
            {PRESETS.map((p) => (
              <button key={p.id} type="button" className="eb-chip" aria-pressed={activity === p.id} onClick={() => choosePreset(p.id)}>
                {p.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {preset ? (
              <motion.div
                key={preset.id}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
                className="eb-card mt-5 grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.2fr_1fr]"
              >
                <div>
                  <p className="eb-eyebrow">{preset.label}</p>
                  <p className="mt-1.5 text-[16px] leading-snug">{preset.needs}</p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--eb-ink-2)]">
                    <span className="font-semibold">Chart: </span>
                    {METRICS[forMarket(preset.x, market)].label} × {METRICS[forMarket(preset.y, market)].label}. {preset.axisRationale}
                  </p>
                  <p className="mt-3 flex flex-wrap gap-1.5">
                    {preset.features.map((f) => (
                      <span key={f} className="eb-badge">
                        {FEATURE_LABEL[f]}
                      </span>
                    ))}
                  </p>
                </div>
                <div>
                  {preset.suggested.length ? (
                    <>
                      <p className="text-[12px] font-semibold text-[var(--eb-ink-2)]">Suggested requirements (you decide)</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {preset.suggested.map((s) => {
                          const applied = Object.entries(s.patch).every(([k, v]) => req[k as keyof Requirements] === v);
                          return (
                            <button
                              key={s.label}
                              type="button"
                              className="eb-chip !text-[13px]"
                              aria-pressed={applied}
                              onClick={() => setReq(applied ? { ...req, ...Object.fromEntries(Object.keys(s.patch).map((k) => [k, NO_REQUIREMENTS[k as keyof Requirements]])) } : { ...req, ...s.patch })}
                            >
                              {applied ? "✓ " : "+ "}
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <p className="text-[13px] text-[var(--eb-muted)]">No requirement is suggested for this activity; add your own in the requirements panel.</p>
                  )}
                  {preset.caution ? (
                    <p className="eb-caution mt-4 flex gap-2 p-3 text-[13px] leading-snug">
                      <AlertTriangle size={16} className="mt-0.5 flex-none" aria-hidden />
                      <span>
                        {preset.caution} <SourceLinks ids={["transparency-study", "apple-safety", "sony-ambient-warning"]} />
                      </span>
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* Controls */}
            <aside aria-label="Chart controls and requirements" className="space-y-4">
              <button type="button" className="eb-btn w-full lg:hidden" aria-expanded={filtersOpen} aria-controls="eb-controls" onClick={() => setFiltersOpen((v) => !v)}>
                <SlidersHorizontal size={15} aria-hidden /> Axes, requirements & filters{activeReqs ? ` (${activeReqs} active)` : ""}
              </button>
              <div id="eb-controls" className={`space-y-4 ${filtersOpen ? "" : "hidden"} lg:block`}>
                <div className="eb-card p-4">
                  <p className="eb-eyebrow mb-3">Chart axes</p>
                  <AxisPicker
                    x={x}
                    y={y}
                    market={market}
                    onChange={(nx, ny) => {
                      setX(nx);
                      setY(ny);
                    }}
                  />
                </div>
                <div className="eb-card p-4">
                  <div className="mb-3 flex items-baseline justify-between">
                    <p className="eb-eyebrow">Hard requirements</p>
                    {countActive(req) ? <span className="eb-badge eb-badge-accent">{countActive(req)} active</span> : null}
                  </div>
                  <RequirementsPanel req={req} market={market} onChange={setReq} />
                </div>
                <div className="eb-card p-4">
                  <BrandFilter brands={brands} counts={brandCounts} onChange={setBrands} />
                </div>
                <button type="button" className="eb-btn w-full" onClick={resetAll}>
                  <RotateCcw size={14} aria-hidden /> Reset everything
                </button>
              </div>
            </aside>

            {/* Chart */}
            <div className="min-w-0 space-y-4">
              <div className="eb-card p-4 sm:p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[17px] font-semibold leading-snug">
                      {gapAxis ? `${GAPS[gapAxis].label}: not comparable` : `${METRICS[mx].label} vs ${METRICS[my].label}`}
                    </h3>
                    {!gapAxis ? (
                      <p className="mt-0.5 text-[13px] text-[var(--eb-muted)]">
                        {result.points.length} plotted · <span className="font-semibold text-[var(--eb-accent-ink)]">{result.frontier.length} on the frontier</span>
                        {notPlotted ? ` · ${notPlotted} not shown` : ""}
                      </p>
                    ) : null}
                  </div>
                  {!gapAxis && result.points.length ? (
                    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--eb-ink-2)]" aria-label="Legend">
                      <li className="flex items-center gap-1.5">
                        <svg width="14" height="14" aria-hidden>
                          <circle cx="7" cy="7" r="5" fill="var(--eb-accent)" />
                        </svg>
                        Frontier
                      </li>
                      <li className="flex items-center gap-1.5">
                        <svg width="14" height="14" aria-hidden>
                          <circle cx="7" cy="7" r="4.5" fill="var(--eb-card)" stroke="var(--eb-dominated)" strokeWidth="2" />
                        </svg>
                        Dominated
                      </li>
                      <li className="flex items-center gap-1.5">
                        <svg width="20" height="14" aria-hidden>
                          <path d="M1 11 H9 V4 H19" fill="none" stroke="var(--eb-accent)" strokeOpacity="0.55" strokeWidth="2" />
                        </svg>
                        Best attainable
                      </li>
                      <li className="flex items-center gap-1.5">
                        <svg width="16" height="16" aria-hidden>
                          <circle cx="8" cy="8" r="6.5" fill="none" stroke="var(--eb-accent)" strokeWidth="1.5" />
                        </svg>
                        Pinned
                      </li>
                    </ul>
                  ) : null}
                </div>

                {gapAxis ? (
                  <GapState gap={gapAxis} eligibleIds={result.eligible.map((p) => p.id)} onSelect={select} />
                ) : result.points.length === 0 ? (
                  <EmptyState result={result} onReset={resetAll} onClearReqs={() => setReq(NO_REQUIREMENTS)} onClearBrands={() => setBrands([])} />
                ) : (
                  <>
                    <p className="mb-2 text-[12px] text-[var(--eb-muted)] sm:hidden">Tap a point for details. Labels are hidden on small screens — the list below names every point.</p>
                    {(() => {
                      const inScope = result.eligibility.length - result.outOfMarket.length;
                      if (inScope === 0 || result.points.length / inScope >= 0.4) return null;
                      const pm = priceMetric(market);
                      const alts: [MetricId, MetricId][] = ([[pm, "ancClaim"], [pm, "batteryMax"], [pm, "batteryTotal"]] as [MetricId, MetricId][]).filter(([a, b]) => !(a === mx && b === my));
                      return (
                        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl bg-[var(--eb-paper)] px-3 py-2.5 text-[13px] text-[var(--eb-ink-2)]">
                          <span>
                            Only <strong>{result.points.length}</strong> of {inScope} models in this view have sourced values for both axes{my === "anc" || mx === "anc" ? " (lab ANC scores exist for few models)" : ""}. Broader, claim-based views:
                          </span>
                          {alts.map(([a, b]) => (
                            <button
                              key={b}
                              type="button"
                              className="eb-chip !min-h-[28px] !px-2.5 !text-[12.5px]"
                              onClick={() => {
                                setX(a);
                                setY(b);
                                setNotice(`Chart now shows ${METRICS[a].label} against ${METRICS[b].label} — manufacturer claims.`);
                              }}
                            >
                              {METRICS[b].label}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                    <ParetoChart x={mx} y={my} points={result.points} frontier={result.frontier} pinned={pinned} activeId={activeId} onSelect={select} />
                    <p className="mt-4 text-[14px] leading-relaxed text-[var(--eb-ink-2)]">
                      <span className="font-semibold text-[var(--eb-ink)]">Reading the frontier: </span>
                      Among the products shown, improving one selected metric requires sacrificing the other. Being on the frontier doesn&apos;t make a model better on metrics that aren&apos;t on this chart, or right for every activity.
                      {result.points.length === 1 ? " With only one product plotted, it is trivially its own frontier." : ""}
                    </p>
                    <p className="mt-2 text-[12px] text-[var(--eb-muted)]">
                      Data: {METRICS[mx].sourceLine} · {METRICS[my].sourceLine}.{" "}
                      <a href="#method" className="eb-link">
                        Method
                      </a>
                    </p>
                  </>
                )}

                {notPlotted && !gapAxis ? <Exclusions result={result} market={market} /> : null}
              </div>

              <AnimatePresence initial={false}>
                {active ? (
                  <motion.div
                    id="eb-detail"
                    key={active.id}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="scroll-mt-24"
                  >
                    <ProductCard
                      product={active}
                      activity={activity}
                      highlight={gapAxis ? [] : [mx, my]}
                      status={statusFor(active.id)}
                      pinned={pinned.includes(active.id)}
                      canPin={pinned.length < MAX_COMPARE}
                      onTogglePin={() => togglePin(active.id)}
                      onClose={() => setActiveId(null)}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {activity === "calls" ? <MicEvidence eligibleIds={result.eligible.map((p) => p.id)} onSelect={select} /> : null}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-[17px] font-semibold">Every model, as a list</h3>
            <p className="mb-4 mt-1 text-[13.5px] text-[var(--eb-muted)]">
              The same data and frontier as the chart, keyboard-friendly. {gapAxis ? `Showing ${METRICS[mx].label.toLowerCase()} and ${METRICS[my].label.toLowerCase()} while an evidence-gap axis is selected.` : ""} Tick up to three to compare.
            </p>
            <ProductList x={mx} y={my} market={market} result={result} pinned={pinned} activeId={activeId} onTogglePin={togglePin} onSelect={select} />
          </div>
        </section>

        {/* ── Compare ────────────────────────────────────────────── */}
        <section id="compare" aria-labelledby="compare-title" className="scroll-mt-20 border-t border-[var(--eb-rule)] py-16 sm:py-20">
          <SectionHeading eyebrow="Compare" title="Side by side, with the receipts" id="compare-title">
            <p>
              Verified specs, functionality, activity strengths and limitations, and every source. No overall winner is declared
              {activity ? ` — notes are filtered to ${PRESET_BY_ID[activity].label.toLowerCase()}` : ""}.
            </p>
          </SectionHeading>
          {pinned.length === 0 ? (
            <div className="eb-card flex flex-col items-center gap-3 px-6 py-14 text-center">
              <p className="eb-display text-[22px]">Nothing pinned yet</p>
              <p className="max-w-md text-[14px] text-[var(--eb-muted)]">Click a point on the chart and choose “Pin to compare”, or tick models in the list. You can compare up to three.</p>
              <a href="#explore" className="eb-btn mt-2">
                Back to the chart
              </a>
            </div>
          ) : (
            <div className={`grid gap-5 ${pinned.length === 1 ? "md:grid-cols-1 lg:max-w-xl" : pinned.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
              {pinned.map((id) => (
                <ProductCard
                  key={id}
                  product={PRODUCT_BY_ID[id]}
                  activity={activity}
                  highlight={gapAxis ? [] : [mx, my]}
                  status={statusFor(id)}
                  pinned
                  canPin
                  onTogglePin={() => togglePin(id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Preferences (derived) ──────────────────────────────── */}
        <section id="preferences" aria-labelledby="pref-title" className="scroll-mt-20 border-t border-[var(--eb-rule)] py-16 sm:py-20">
          <SectionHeading eyebrow="Preferences · derived estimate" title="Weigh what matters to you" id="pref-title">
            <p>
              An optional, transparent blend of the chart metrics for the models that pass your requirements. It is a derived estimate built from cited inputs, it moves when you move the weights, and models with under {Math.round(MIN_COVERAGE * 100)}% data
              coverage aren&apos;t ranked. Sound and mic quality are excluded because they can&apos;t be compared fairly.
            </p>
          </SectionHeading>
          <PreferencePanel eligible={result.eligible} weights={weights} market={market} onChange={setWeights} onSelect={select} />
        </section>

        <Method />
      </main>

      <footer className="border-t border-[var(--eb-rule)] bg-[var(--eb-paper-2)]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-8 text-[13px] text-[var(--eb-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Snapshot {SNAPSHOT_DATE}. US launch prices. Independent research — no brand reviewed or sponsored this page.
          </p>
          <Link href="/" className="eb-link">
            aitokenomics.app
          </Link>
        </div>
      </footer>

      {/* Compare tray */}
      <AnimatePresence>
        {pinned.length ? (
          <motion.div
            initial={reduce ? false : { y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-5"
          >
            <div className="mx-auto flex max-w-[860px] flex-wrap items-center gap-2 rounded-2xl border border-[var(--eb-rule-2)] bg-[var(--eb-ink)] p-2.5 pl-4 text-[var(--eb-paper)] shadow-2xl">
              <span className="text-[13px] font-semibold">
                Compare {pinned.length}/{MAX_COMPARE}
              </span>
              <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5" aria-label="Pinned models">
                {pinned.map((id) => (
                  <li key={id} className="flex items-center gap-1 rounded-full bg-white/10 py-1 pl-3 pr-1 text-[12.5px]">
                    {PRODUCT_BY_ID[id].short}
                    <button type="button" className="rounded-full p-1 hover:bg-white/15" onClick={() => togglePin(id)} aria-label={`Unpin ${PRODUCT_BY_ID[id].short}`}>
                      <X size={12} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
              <a href="#compare" className="eb-btn eb-btn-accent !min-h-[34px] !border-transparent">
                View comparison
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ── Sub-views ──────────────────────────────────────────────────────────── */

function ExclusionGroup({ title, hint, items }: { title: string; hint: string; items: { id: string; name: string; reason: string }[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? items : items.slice(0, 8);
  return (
    <div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--eb-muted)]">
        {title} · {items.length}
      </p>
      {hint ? <p className="text-[12px] text-[var(--eb-muted)]">{hint}</p> : null}
      <ul className="mt-1.5 space-y-1.5 text-[13px] leading-snug">
        {shown.map((i) => (
          <li key={i.id}>
            <span className="font-medium text-[var(--eb-ink)]">{i.name}</span>
            {i.reason ? <span className="text-[var(--eb-ink-2)]"> — {i.reason}</span> : null}
          </li>
        ))}
      </ul>
      {items.length > shown.length ? (
        <button type="button" className="mt-1.5 text-[12.5px] font-medium text-[var(--eb-accent-ink)] underline underline-offset-2" onClick={() => setAll(true)}>
          Show all {items.length}
        </button>
      ) : null}
    </div>
  );
}

function Exclusions({ result, market }: { result: ReturnType<typeof explore>; market: Market }) {
  const name = (p: { brand: string; name: string }) => `${p.brand} ${p.name}`;
  const groups = [
    {
      title: "Fails a requirement",
      hint: "Documented as not meeting what you asked for.",
      items: result.failed.map((r) => ({ id: r.product.id, name: name(r.product), reason: r.exclusions.filter((e) => e.kind === "fails").map((e) => e.reason).join("; ") })),
    },
    {
      title: "Unknown — not assumed to pass",
      hint: "Our sources don't establish the required feature.",
      items: result.unknown.map((r) => ({ id: r.product.id, name: name(r.product), reason: r.exclusions.map((e) => e.reason).join("; ") })),
    },
    {
      title: "Missing a chart metric",
      hint: "Eligible, but no sourced value for one of the axes.",
      items: result.missing.map((m) => ({
        id: m.product.id,
        name: name(m.product),
        reason: m.metrics.map((k) => (m.product.tier === "deep" ? m.product.metrics[k].note : null) ?? `No ${METRICS[k].label.toLowerCase()} data`).join(" "),
      })),
    },
    { title: "Hidden by brand filter", hint: "", items: result.brandFiltered.map((r) => ({ id: r.product.id, name: name(r.product), reason: "" })) },
    {
      title: market === "in" ? "Not documented as sold in India" : "No US launch price",
      hint: "Outside this market per our sources — switch market to see them.",
      items: result.outOfMarket.map((r) => ({ id: r.product.id, name: name(r.product), reason: "" })),
    },
  ].filter((g) => g.items.length);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <details className="mt-5 rounded-xl border border-[var(--eb-rule)] bg-[var(--eb-paper)] px-4 py-3">
      <summary className="cursor-pointer text-[13.5px] font-semibold text-[var(--eb-ink-2)]">{`Why ${total} of ${PRODUCTS.length} models aren't on this chart`}</summary>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        {groups.map((g) => (
          <ExclusionGroup key={g.title} {...g} />
        ))}
      </div>
    </details>
  );
}

function EmptyState({ result, onReset, onClearReqs, onClearBrands }: { result: ReturnType<typeof explore>; onReset: () => void; onClearReqs: () => void; onClearBrands: () => void }) {
  // Which requirement knocks out the most products — the most useful thing to relax.
  const counts = new Map<string, number>();
  for (const r of [...result.failed, ...result.unknown]) for (const e of r.exclusions) counts.set(e.requirement, (counts.get(e.requirement) ?? 0) + 1);
  const worst = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const LABEL: Record<string, string> = { maxPrice: "budget", os: "phone support", multipoint: "multipoint", water: "water rating", wirelessCharging: "wireless charging", secureFit: "secure-fit design" };
  const allMissing = result.eligible.length > 0;
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--eb-rule-2)] px-6 py-14 text-center">
      <p className="eb-display text-[22px]">{allMissing ? "No comparable data for this pair" : "No model meets every requirement"}</p>
      <p className="max-w-md text-[14px] leading-relaxed text-[var(--eb-muted)]">
        {allMissing
          ? "The models that qualify don't have values for both selected metrics. Try another axis pair."
          : worst
            ? `The ${LABEL[worst[0]] ?? worst[0]} requirement rules out ${worst[1]} model(s) on its own. Relaxing it is the quickest way to see options.`
            : "Your brand filter hides every model."}
      </p>
      <div className="mt-1 flex flex-wrap justify-center gap-2">
        {!allMissing && result.failed.length + result.unknown.length ? (
          <button type="button" className="eb-btn" onClick={onClearReqs}>
            Clear requirements
          </button>
        ) : null}
        {result.brandFiltered.length ? (
          <button type="button" className="eb-btn" onClick={onClearBrands}>
            Show all brands
          </button>
        ) : null}
        <button type="button" className="eb-btn" onClick={onReset}>
          <RotateCcw size={14} aria-hidden /> Reset everything
        </button>
      </div>
    </div>
  );
}

function notesByTopic(ids: string[], topic: ProductNote["topic"]) {
  return ids.map((id) => ({ product: PRODUCT_BY_ID[id], notes: PRODUCT_BY_ID[id].notes.filter((n) => n.topic === topic) })).filter((r) => r.notes.length);
}

function GapState({ gap, eligibleIds, onSelect }: { gap: GapMetricId; eligibleIds: string[]; onSelect: (id: string) => void }) {
  const g = GAPS[gap];
  const rows = notesByTopic(eligibleIds, gap === "sound" ? "sound" : "calls");
  return (
    <div>
      <div className="rounded-xl border border-dashed border-[var(--eb-rule-2)] bg-[var(--eb-paper)] p-5">
        <p className="eb-eyebrow">Evidence gap — no chart, on purpose</p>
        <p className="mt-2 text-[14.5px] leading-relaxed">{g.why}</p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--eb-ink-2)]">{g.instead} Pick a different axis to see a frontier.</p>
      </div>
      <h4 className="mt-6 text-[14px] font-semibold">{gap === "sound" ? "Sound character, as reviewers and labs describe it" : "Call and mic evidence, side by side"}</h4>
      {rows.length ? (
        <ul className="mt-3 divide-y divide-[var(--eb-rule)]">
          {rows.map(({ product, notes }) => (
            <li key={product.id} className="py-3">
              <button type="button" className="text-[14px] font-semibold underline decoration-[var(--eb-rule-2)] underline-offset-4" onClick={() => onSelect(product.id)}>
                {product.brand} {product.name}
              </button>
              {notes.map((n, i) => (
                <p key={i} className="mt-1 text-[13.5px] leading-snug text-[var(--eb-ink-2)]">
                  {n.text} <SourceLinks ids={n.sources} />
                </p>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[13.5px] text-[var(--eb-muted)]">No eligible model has sourced notes on this topic under your current requirements.</p>
      )}
    </div>
  );
}

function MicEvidence({ eligibleIds, onSelect }: { eligibleIds: string[]; onSelect: (id: string) => void }) {
  const rows = notesByTopic(eligibleIds, "calls");
  return (
    <div className="eb-card p-5 sm:p-6">
      <p className="eb-eyebrow">Calls · mic evidence</p>
      <h3 className="mt-1 text-[17px] font-semibold">What labs and reviewers found on calls</h3>
      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--eb-muted)]">
        Not scored or ranked: lab test heads can&apos;t excite bone-conduction sensors and sometimes bypass on-board noise suppression, so lab mic results understate some models. <SourceLinks ids={["sg-bone-mics", "rt-b4p"]} />
      </p>
      {rows.length ? (
        <ul className="mt-3 divide-y divide-[var(--eb-rule)]">
          {rows.map(({ product, notes }) => (
            <li key={product.id} className="py-3">
              <button type="button" className="text-[14px] font-semibold underline decoration-[var(--eb-rule-2)] underline-offset-4" onClick={() => onSelect(product.id)}>
                {product.brand} {product.name}
              </button>
              {notes.map((n, i) => (
                <p key={i} className="mt-1 text-[13.5px] leading-snug text-[var(--eb-ink-2)]">
                  <span className="sr-only">{n.kind}: </span>
                  {n.kind === "strength" ? "+ " : n.kind === "limitation" ? "− " : "· "}
                  {n.text} <SourceLinks ids={n.sources} />
                </p>
              ))}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[13.5px] text-[var(--eb-muted)]">No eligible model has sourced call notes under your current requirements.</p>
      )}
    </div>
  );
}
