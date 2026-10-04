"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Database, ListOrdered, Printer } from "lucide-react";
import type { SiteModel } from "@/lib/korea-fy27/model";
import type { CohortId } from "@/lib/korea-fy27/types";
import { money } from "@/lib/korea-fy27/format";
import { SiteCtx, type DrawerTab } from "./context";
import SummarySection from "./sections/Summary";
import MarketSection from "./sections/Market";
import BusinessSection from "./sections/Business";
import PlanSection from "./sections/Plan";
import CohortsSection from "./sections/Cohorts";
import ExecutionSection from "./sections/Execution";
import ResourcingSection from "./sections/Resourcing";
import VcSection from "./sections/Vc";
import RisksSection from "./sections/Risks";
import AsksSection from "./sections/Asks";
import AppendixSection from "./sections/Appendix";
import CohortDrawer from "./CohortDrawer";

export const SECTIONS = [
  { id: "summary", num: "01", label: "Summary" },
  { id: "market", num: "02", label: "Market" },
  { id: "business", num: "03", label: "Our business" },
  { id: "plan", num: "04", label: "The plan" },
  { id: "cohorts", num: "05", label: "Cohorts" },
  { id: "execution", num: "06", label: "Execution" },
  { id: "resourcing", num: "07", label: "Resourcing" },
  { id: "vc", num: "08", label: "VC engine" },
  { id: "risks", num: "09", label: "Risks" },
  { id: "asks", num: "10", label: "Asks" },
  { id: "appendix", num: "11", label: "Appendix" },
] as const;

/** The section nearest the top of the viewport, by id. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting ? entry.boundingClientRect.top : Infinity);
        let best: string | null = null;
        let bestTop = Infinity;
        for (const [id, top] of visible) {
          if (top !== Infinity && Math.abs(top) < bestTop) {
            best = id;
            bestTop = Math.abs(top);
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.01] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = SECTIONS.map((s) => s.id);

export function printPlan(mode: "exec" | "full") {
  const root = document.querySelector<HTMLElement>(".k-root");
  if (!root) return;
  root.setAttribute("data-print-mode", mode);
  const opened: HTMLDetailsElement[] = [];
  if (mode === "full") {
    document.querySelectorAll<HTMLDetailsElement>(".k-root details:not([open])").forEach((d) => {
      d.open = true;
      opened.push(d);
    });
  }
  const cleanup = () => {
    root.removeAttribute("data-print-mode");
    opened.forEach((d) => (d.open = false));
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
  window.print();
}

/** "The plan in six numbers": the side rail on wide screens. */
export function PlanRail({ model }: { model: SiteModel }) {
  const startups = model.cohorts.find((c) => c.id === "startups");
  const dn = model.market.segments.find((s) => s.id === "dn");
  return (
    <div className="k-rail" aria-label="The plan in six numbers">
      <h4>The plan in six numbers</h4>
      <dl>
        <div>
          <dt>FY26 Google AI</dt>
          <dd>{money(model.headline.fy26Ai)}</dd>
        </div>
        <div>
          <dt>FY27 plan</dt>
          <dd>
            {money(model.headline.fy27Plan, { approx: true })} <small>({model.headline.multipleLabel})</small>
          </dd>
        </div>
        <div>
          <dt>Share of wallet</dt>
          <dd>
            {model.headline.shareFY26}% → {model.headline.shareFY27}%
          </dd>
        </div>
        <div>
          <dt>Growth</dt>
          <dd>{money(model.headline.growth, { sign: true })}</dd>
        </div>
        <div>
          <dt>Largest growth pillar</dt>
          <dd>
            DN {money(dn?.added ?? 0, { sign: true })}
          </dd>
        </div>
        <div className="risk">
          <dt>Largest new risk</dt>
          <dd>
            Startups {money(startups?.fy27 ?? 0, { approx: true })} <small>· ~{startups?.losPct}% line of sight</small>
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default function KoreaPlanSite({ model, flowHref }: { model: SiteModel; flowHref?: string }) {
  const active = useActiveSection(SECTION_IDS);
  const [drawer, setDrawer] = useState<{ id: CohortId; tab: DrawerTab } | null>(null);
  const openCohort = useCallback((id: CohortId, tab: DrawerTab = "economics") => setDrawer({ id, tab }), []);
  const ctx = useMemo(() => ({ model, openCohort }), [model, openCohort]);

  const nav = (cls: string) => (
    <nav className={cls} aria-label="Sections">
      {SECTIONS.map((s) => (
        <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
          {cls === "k-nav" ? <span>{s.num}</span> : null}
          {s.label}
        </a>
      ))}
    </nav>
  );

  return (
    <SiteCtx.Provider value={ctx}>
      <header className="k-top">
        <a className="k-brand" href="#summary">
          <b>Korea AI · Path to 4x</b>
          <span>FY27 plan</span>
        </a>
        <span className="k-conf" title={`Source: ${model.meta.title} (${model.meta.pages} slides, ${model.meta.date})`}>
          {model.meta.status}
        </span>
        <div className="k-top-actions k-noprint">
          {flowHref ? (
            <a className="k-btn" href={flowHref} title="The same plan, in the review flow: market intel, takeaways, motions, five verticals, Q4 plan, accountability and asks">
              <ListOrdered aria-hidden="true" />
              <span className="k-hide-sm">Flow version</span>
            </a>
          ) : null}
          <a className="k-btn" href="#appendix" title="Market assumptions, account tables, numbers ledger and conflict log">
            <Database aria-hidden="true" />
            <span className="k-hide-sm">Data room</span>
          </a>
          <button type="button" className="k-btn" onClick={() => printPlan("exec")} title="Print the summary, plan, risks and asks">
            <Printer aria-hidden="true" />
            <span className="k-hide-sm">Executive print</span>
          </button>
          <button type="button" className="k-btn k-hide-sm" onClick={() => printPlan("full")} title="Print every section with all drawers open">
            Full print
          </button>
        </div>
      </header>

      <div className="k-layout">
        <aside className="k-side k-noprint">
          {nav("k-nav")}
          <PlanRail model={model} />
        </aside>

        <main className="k-main" id="top">
          {nav("k-chipnav k-noprint")}
          <SummarySection />
          <MarketSection />
          <BusinessSection />
          <PlanSection />
          <CohortsSection />
          <ExecutionSection />
          <ResourcingSection />
          <VcSection />
          <RisksSection />
          <AsksSection />
          <AppendixSection />
          <footer className="k-footer">
            <p>
              <b>{model.meta.title}</b> · {model.meta.pages} slides · {model.meta.date} · {model.meta.status}. Not for external distribution.
            </p>
            <p>{model.meta.fy26}</p>
            <p>{model.meta.names} Competitor figures are directional field intel. WIP, placeholder and to-confirm items are labelled where they appear.</p>
          </footer>
        </main>
      </div>

      <CohortDrawer state={drawer} onClose={() => setDrawer(null)} onTab={(tab) => setDrawer((d) => (d ? { ...d, tab } : d))} />
    </SiteCtx.Provider>
  );
}
