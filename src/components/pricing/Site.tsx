"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, RefreshCw } from "lucide-react";
import type { WorkloadInput } from "@/lib/pricing/types";
import { usePricingData } from "@/lib/pricing/data";
import { fmtPerM } from "@/lib/pricing/calc";
import { PROVIDERS, WORKLOAD_PRESETS, presetById } from "@/lib/pricing/presets";
import { TooltipProvider } from "./Tooltip";
import FilterBar, { DEFAULT_FILTERS, applyFilters, type Filters } from "./FilterBar";
import Ladder from "./Ladder";
import PricingBars from "./PricingBars";
import Calculator from "./Calculator";
import CapabilityMatrix from "./CapabilityMatrix";
import Compare from "./Compare";
import Scatter from "./Scatter";
import Recommend from "./Recommend";
import News from "./News";
import Methodology from "./Methodology";

const NAV = [
  { id: "map", label: "Market map" },
  { id: "pricing", label: "Pricing" },
  { id: "calculator", label: "Calculator" },
  { id: "capabilities", label: "Capabilities" },
  { id: "compare", label: "Compare" },
  { id: "value", label: "Cost vs capability" },
  { id: "recommend", label: "Which model?" },
  { id: "news", label: "News" },
  { id: "method", label: "Methodology" },
];

function Section({ id, kicker, title, lede, children }: { id: string; kicker: string; title: string; lede: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="px-section" id={id}>
      <div className="px-wrap">
        <div className="px-kicker">{kicker}</div>
        <h2 className="px-h2">{title}</h2>
        <p className="px-lede">{lede}</p>
        {children}
      </div>
    </section>
  );
}

export default function Site() {
  const data = usePricingData();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [workload, setWorkload] = useState<WorkloadInput>(WORKLOAD_PRESETS[0].input);
  const [presetId, setPresetId] = useState<string>(WORKLOAD_PRESETS[0].id);
  const [compare, setCompare] = useState<string[]>([]);
  const [benchId, setBenchId] = useState<string>(WORKLOAD_PRESETS[0].qualityBench);
  const [active, setActive] = useState("map");
  const rootRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => applyFilters(data.models, filters), [data.models, filters]);
  const preset = presetById(presetId) ?? WORKLOAD_PRESETS[0];

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    rootRef.current?.querySelectorAll("section[id]").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const choosePreset = (id: string) => {
    const p = presetById(id);
    if (!p) return;
    setPresetId(id);
    setWorkload(p.input);
    setBenchId(p.qualityBench);
  };
  const toggleCompare = (id: string) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 4 ? c : [...c, id]));

  // Hero stats from the full catalog.
  const priced = data.models.filter((m) => m.pricing.input != null && m.status !== "legacy");
  const cheapestIn = priced.reduce((a, b) => (b.pricing.input! < a.pricing.input! ? b : a), priced[0]);
  const priciestIn = priced.reduce((a, b) => (b.pricing.input! > a.pricing.input! ? b : a), priced[0]);
  const spread = priciestIn && cheapestIn ? Math.round(priciestIn.pricing.input! / cheapestIn.pricing.input!) : 0;
  const freshLabel = data.refreshedAt
    ? `checked ${new Date(data.refreshedAt).toISOString().slice(0, 10)}`
    : `catalog ${data.catalogDate}`;
  const stale = data.stale;

  return (
    <TooltipProvider>
      <div ref={rootRef}>
        <div className="px-topbar">
          <div className="px-topbar-in">
            <a className="px-brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              AI MODEL <em>PRICING</em>
            </a>
            <nav className="px-nav" aria-label="Sections">
              {NAV.map((n) => (
                <button key={n.id} className={active === n.id ? "on" : ""} onClick={() => jump(n.id)}>
                  {n.label}
                </button>
              ))}
            </nav>
            <span className="px-fresh" title="Daily automated check against official pricing pages; catalog hand-verified on the snapshot date.">
              <span className={`dot ${stale ? "stale" : ""}`} />
              <RefreshCw size={11} /> {freshLabel}
            </span>
          </div>
        </div>

        <header className="px-hero" id="top">
          <div className="px-wrap">
            <h1 className="px-h1">
              Which model fits your workload — <span className="hl">and what will it actually cost?</span>
            </h1>
            <p className="px-hero-lede">
              Verified token pricing, capabilities and comparable benchmarks for <strong>{data.models.length} current models</strong> from{" "}
              {PROVIDERS.length} providers, with a calculator that prices <em>your</em> traffic — cache hits, batch share, long-context tiers and all. Every
              number links to its source and carries a last-verified date. Pricing pages are re-checked daily; changes land in the news feed.
            </p>
            <div className="px-stats">
              <div className="px-stat">
                <div className="l">Models tracked</div>
                <div className="v">{data.models.length}</div>
                <div className="s">{data.models.filter((m) => m.license).length} with open weights</div>
              </div>
              <div className="px-stat">
                <div className="l">Input price range</div>
                <div className="v">
                  {fmtPerM(cheapestIn?.pricing.input)}–{fmtPerM(priciestIn?.pricing.input)}
                </div>
                <div className="s">per 1M tokens · {spread}× spread</div>
              </div>
              <div className="px-stat">
                <div className="l">Context windows</div>
                <div className="v">{data.models.filter((m) => m.contextK >= 1000).length} × 1M+</div>
                <div className="s">of {data.models.length} models</div>
              </div>
              <div className="px-stat">
                <div className="l">Catalog verified</div>
                <div className="v">{data.catalogDate.slice(5)}</div>
                <div className="s">{data.refreshedAt ? `auto-checked ${new Date(data.refreshedAt).toISOString().slice(5, 10)}` : "daily auto-check pending"}</div>
              </div>
            </div>
            <div className="px-hero-cta">
              <button className="px-btn primary" onClick={() => jump("calculator")}>
                Price my workload <ArrowDown size={14} />
              </button>
              <button className="px-btn ghost" onClick={() => jump("recommend")}>
                Which model should I use?
              </button>
              <button className="px-btn ghost" onClick={() => jump("news")}>
                What changed recently?
              </button>
            </div>
          </div>
        </header>

        <Section
          id="map"
          kicker="01 · Market map"
          title="Every provider's lineup, tier by tier"
          lede={
            <>
              Pro / Flash / Flash-Lite lines up against Astra / Sol / Luna and Fable+Opus / Sonnet / Haiku. Click a provider to focus on it, click a second
              for a rung-by-rung head-to-head; the tier chips narrow every chart below to one class of model. Click any model to add it to the comparison.
            </>
          }
        >
          <FilterBar filters={filters} onChange={setFilters} count={visible.length} total={data.models.length} />
          <Ladder models={visible} providers={filters.providers} rungs={filters.rungs} compare={compare} onToggleCompare={toggleCompare} />
        </Section>

        <Section
          id="pricing"
          kicker="02 · Pricing"
          title="Input → output, on one scale"
          lede={
            <>
              Each row is one model: the filled dot is the input price, the hollow dot the output price, the dotted tick the cached-input price — all in USD per
              1M tokens on a log axis. The bar between them is the output premium. Sort by any of them; switch to the table for exact values.
            </>
          }
        >
          <PricingBars models={visible} />
        </Section>

        <Section
          id="calculator"
          kicker="03 · Calculator"
          title="What it costs for your traffic"
          lede={
            <>
              Pick a preset or set your own volumes. The ranking re-prices every visible model, applying each one&apos;s cached-input rate, batch discount and
              long-context tier. Deltas are against the baseline row you choose.
            </>
          }
        >
          <Calculator models={visible} workload={workload} onWorkload={setWorkload} presetId={presetId} onPreset={choosePreset} />
        </Section>

        <Section
          id="capabilities"
          kicker="04 · Capabilities"
          title="What each model supports — and what has been measured"
          lede={
            <>
              Context, output limits, modalities and documented feature support side by side with one independent capability measurement. Sort any column;
              add up to four models to the comparison below.
            </>
          }
        >
          <CapabilityMatrix models={visible} compare={compare} onToggleCompare={toggleCompare} />
        </Section>

        <Section
          id="compare"
          kicker="05 · Compare"
          title="Side by side"
          lede={<>Up to four models, every attribute in one table — including monthly cost at your calculator workload and every comparable benchmark.</>}
        >
          <Compare models={data.models} selected={compare} workload={workload} onRemove={toggleCompare} />
        </Section>

        <Section
          id="value"
          kicker="06 · Cost vs capability"
          title="Where price buys capability"
          lede={
            <>
              Blended price for your workload against a benchmark you choose. The line traces the cost–capability frontier: nothing visible is both cheaper
              and better than a model on it. Models without a comparable score are excluded and listed, never estimated.
            </>
          }
        >
          <Scatter models={visible} workload={workload} benchId={benchId} onBench={setBenchId} />
        </Section>

        <Section
          id="recommend"
          kicker="07 · Decision support"
          title={`Lowest-cost fit for “${preset.name}”`}
          lede={
            <>
              The cheapest visible model that meets the preset&apos;s requirements, the alternatives that also qualify and why they cost more, and the cheaper
              models that were disqualified. Change the preset in the calculator; drop or restore any criterion here.
            </>
          }
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {WORKLOAD_PRESETS.map((p) => (
              <button key={p.id} className={`px-chip ${presetId === p.id ? "on" : ""}`} onClick={() => choosePreset(p.id)}>
                {p.name}
              </button>
            ))}
          </div>
          <Recommend models={visible} workload={workload} preset={preset} />
        </Section>

        <Section
          id="news"
          kicker="08 · Pricing news"
          title="What changed"
          lede={<>Price cuts, increases, launches and retirements — seeded from the research snapshot and extended daily by the automated pricing check.</>}
        >
          <News items={data.news} refreshedAt={data.refreshedAt} live={data.live} catalogDate={data.catalogDate} />
        </Section>

        <Section
          id="method"
          kicker="09 · Methodology"
          title="How to read this page"
          lede={<>Where the numbers come from, how the calculator computes cost, and what this page deliberately does not claim.</>}
        >
          <Methodology models={data.models} catalogDate={data.catalogDate} />
        </Section>

        <footer className="px-footer">
          <div className="px-wrap">
            <strong>AI Model Pricing</strong> · part of <a href="https://aitokenomics.app">aitokenomics.app</a> · catalog snapshot {data.catalogDate} · prices
            change frequently — confirm on the linked official page before committing budget. Not affiliated with any model provider.
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
