"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Printer } from "lucide-react";
import type { SiteModel } from "@/lib/korea-fy27/model";
import type { FlowModel } from "@/lib/korea-fy27/flow";
import type { CohortId } from "@/lib/korea-fy27/types";
import { SiteCtx, type DrawerTab } from "../context";
import { PlanRail, printPlan } from "../Site";
import CohortDrawer from "../CohortDrawer";
import VcSection from "../sections/Vc";
import FlowSummary from "./FlowSummary";
import FlowInsights from "./FlowInsights";
import FlowTakeaways from "./FlowTakeaways";
import FlowMotions from "./FlowMotions";
import FlowVerticals from "./FlowVerticals";
import FlowQ4 from "./FlowQ4";
import FlowAccountability from "./FlowAccountability";
import FlowAsks from "./FlowAsks";

type NavItem = { id: string; num: string; label: string; children?: { id: string; num: string; label: string }[] };

const Q4_CHILDREN = [
  { id: "q4-resources", num: "7.1", label: "Resources" },
  { id: "q4-skilling", num: "7.2", label: "Skilling" },
  { id: "q4-commercials", num: "7.3", label: "Commercials" },
];

/**
 * The last section (in page order) whose top has passed 30% of the viewport.
 * Works for nested anchors, where a vertical sits inside its section.
 */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}

function flowNav(flow: FlowModel): NavItem[] {
  return [
    { id: "f-summary", num: "1", label: "Executive summary" },
    { id: "f-insights", num: "2", label: "Market intel" },
    { id: "f-takeaways", num: "3", label: "GTM takeaways" },
    { id: "f-motions", num: "4", label: "Three motions" },
    { id: "f-verticals", num: "5", label: "Five verticals", children: flow.verticals.map((v) => ({ id: v.id, num: v.num, label: v.label })) },
    { id: "f-startups", num: "6", label: "Startup deep dive" },
    { id: "f-q4", num: "7", label: "Q4 execution plan", children: Q4_CHILDREN },
    { id: "f-accountability", num: "8", label: "Accountability" },
    { id: "f-asks", num: "9", label: "Asks & follow-ups" },
  ];
}

export default function KoreaFlowSite({ model, flow, fullHref }: { model: SiteModel; flow: FlowModel; fullHref: string }) {
  const nav = useMemo(() => flowNav(flow), [flow]);
  const ids = useMemo(() => nav.flatMap((n) => [n.id, ...(n.children ?? []).map((c) => c.id)]), [nav]);
  const active = useScrollSpy(ids);
  const activeTop = nav.find((n) => n.id === active || n.children?.some((c) => c.id === active))?.id;
  const [drawer, setDrawer] = useState<{ id: CohortId; tab: DrawerTab } | null>(null);
  const openCohort = useCallback((id: CohortId, tab: DrawerTab = "economics") => setDrawer({ id, tab }), []);
  const ctx = useMemo(() => ({ model, openCohort }), [model, openCohort]);

  return (
    <SiteCtx.Provider value={ctx}>
      <header className="k-top">
        <a className="k-brand" href="#f-summary">
          <b>Korea AI · Path to 4x</b>
          <span>FY27 plan · flow</span>
        </a>
        <span className="k-conf" title={`Source: ${model.meta.title} (${model.meta.pages} slides, ${model.meta.date})`}>
          {model.meta.status}
        </span>
        <div className="k-top-actions k-noprint">
          <a className="k-btn" href={fullHref} title="The full plan: every section, the cohort explorer and the data room">
            <BookOpen aria-hidden="true" />
            <span className="k-hide-sm">Full plan</span>
          </a>
          <button type="button" className="k-btn" onClick={() => printPlan("full")} title="Print the flow with every detail open">
            <Printer aria-hidden="true" />
            <span className="k-hide-sm">Print</span>
          </button>
        </div>
      </header>

      <div className="k-layout">
        <aside className="k-side k-noprint">
          <nav className="k-nav" aria-label="Flow">
            {nav.map((n) => (
              <div key={n.id} className="k-nav-group">
                <a href={`#${n.id}`} aria-current={active === n.id ? "true" : undefined}>
                  <span>{n.num}</span>
                  {n.label}
                </a>
                {n.children ? (
                  <div className="k-nav-sub">
                    {n.children.map((c) => (
                      <a key={c.id} href={`#${c.id}`} aria-current={active === c.id ? "true" : undefined}>
                        <span>{c.num}</span>
                        {c.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
          <PlanRail model={model} />
        </aside>

        <main className="k-main" id="top">
          <nav className="k-chipnav k-noprint" aria-label="Flow">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} aria-current={activeTop === n.id ? "true" : undefined}>
                {n.num} · {n.label}
              </a>
            ))}
          </nav>
          <FlowSummary flow={flow} />
          <FlowInsights />
          <FlowTakeaways flow={flow} />
          <FlowMotions flow={flow} />
          <FlowVerticals flow={flow} />
          <VcSection id="f-startups" num="6" label="Startup discovery & acquisition deep dive" question="How do we find, win and scale the new AI logos that FY26 did not bring?" />
          <FlowQ4 flow={flow} />
          <FlowAccountability flow={flow} />
          <FlowAsks flow={flow} />
          <footer className="k-footer">
            <p>
              <b>{model.meta.title}</b> · {model.meta.pages} slides · {model.meta.date} · {model.meta.status}. Not for external distribution.
            </p>
            <p>
              Flow version: the same numbers as the <a href={fullHref}>full plan</a>, in the review order. {model.meta.fy26}
            </p>
            <p>{model.meta.names} Competitor figures are directional field intel. WIP, placeholder and to-confirm items are labelled where they appear.</p>
          </footer>
        </main>
      </div>

      <CohortDrawer state={drawer} onClose={() => setDrawer(null)} onTab={(tab) => setDrawer((d) => (d ? { ...d, tab } : d))} />
    </SiteCtx.Provider>
  );
}
