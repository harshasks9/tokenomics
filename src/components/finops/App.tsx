"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, CalendarDays, TrendingUp } from "lucide-react";
import { CLOUDS, Cloud } from "@/lib/finops/catalog";
import { ASSESSMENTS, recommendationsFor } from "@/lib/finops/engine";
import { CLOUD_VAR } from "./primitives";
import Overview from "./Overview";
import Pareto from "./Pareto";
import WorkloadTable from "./WorkloadTable";
import Opportunities from "./Opportunities";
import Simulator from "./Simulator";

type TabId = "overview" | "pareto" | "opportunities" | "simulator";

export default function FinOpsApp() {
  const [tab, setTab] = useState<TabId>("overview");
  const [clouds, setClouds] = useState<Cloud[]>(CLOUDS.map((c) => c.id));
  const [selectedWorkload, setSelectedWorkload] = useState<string | null>(null);

  const items = useMemo(
    () => ASSESSMENTS.filter((a) => clouds.includes(a.w.cloud)),
    [clouds],
  );
  const recs = useMemo(() => items.flatMap(recommendationsFor).sort((a, b) => b.monthlySavings - a.monthlySavings), [items]);

  const toggleCloud = (id: Cloud) => {
    setClouds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((c) => c !== id);
        return next.length ? next : prev; // never filter to an empty estate
      }
      return [...prev, id];
    });
    setSelectedWorkload(null);
  };

  const tabs: { id: TabId; label: string; n?: number }[] = [
    { id: "overview", label: "Executive Overview" },
    { id: "pareto", label: "Pareto Frontier" },
    { id: "opportunities", label: "Opportunities", n: recs.length },
    { id: "simulator", label: "Migration Simulator" },
  ];

  return (
    <div className="fo-shell">
      <Link
        href="/"
        style={{
          position: "fixed", top: 14, left: 14, zIndex: 100, display: "flex", alignItems: "center", gap: 4,
          borderRadius: 999, background: "var(--surface)", border: "1px solid var(--border)",
          padding: "5px 12px", fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)", textDecoration: "none",
        }}
      >
        <ChevronLeft size={13} /> Home
      </Link>

      <header className="fo-topbar" style={{ paddingLeft: 96 }}>
        <div className="fo-brand">
          <span className="fo-brand-mark"><TrendingUp size={16} color="#fff" /></span>
          <span>
            <div className="fo-brand-name">FrontierOps</div>
            <div className="fo-brand-sub">Multi-cloud AI FinOps · every AI dollar on the Pareto frontier</div>
          </span>
        </div>
        <div className="fo-topbar-right">
          <span className="fo-org">Meridian Global · Enterprise</span>
          <span className="fo-period"><CalendarDays size={13} /> Jul 8 – Aug 6, 2026</span>
        </div>
      </header>

      <nav className="fo-tabs" role="tablist" aria-label="Dashboard sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            className="fo-tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.n !== undefined && <span className="fo-tab-n">{t.n}</span>}
          </button>
        ))}
      </nav>

      <div className="fo-filters">
        <span className="fo-filter-label">Clouds</span>
        {CLOUDS.map((c) => (
          <button
            key={c.id}
            className="fo-chip"
            aria-pressed={clouds.includes(c.id)}
            onClick={() => toggleCloud(c.id)}
          >
            <span className="fo-swatch" style={{ background: CLOUD_VAR[c.id] }} />
            {c.short}
          </button>
        ))}
        <span className="fo-note" style={{ marginLeft: "auto" }}>
          {items.length} workloads in view · synthetic demo data
        </span>
      </div>

      {tab === "overview" && (
        <Overview items={items} recs={recs} clouds={clouds} onGoToOpportunities={() => setTab("opportunities")} />
      )}
      {tab === "pareto" && (
        <div className="fo-grid">
          <Pareto items={items} selectedId={selectedWorkload} onSelect={setSelectedWorkload} />
          <WorkloadTable items={items} selectedId={selectedWorkload} onSelect={setSelectedWorkload} />
        </div>
      )}
      {tab === "opportunities" && <Opportunities recs={recs} />}
      {tab === "simulator" && <Simulator items={items} />}

      <footer className="fo-footer">
        <span>FrontierOps prototype — all workloads, prices and benchmarks are realistic synthetic demo data (Aug 2026).</span>
        <span>·</span>
        <span>Quality index = blended eval (reasoning · instruction-following · grounding), 0–100.</span>
      </footer>
    </div>
  );
}
