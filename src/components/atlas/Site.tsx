"use client";

import { useCallback, useEffect, useState } from "react";
import { AtlasCtx, type Drawer, type ViewId } from "./Shared";
import Drawers from "./Drawers";
import BigPicture from "./BigPicture";
import Timeline from "./Timeline";
import Minds from "./Minds";
import Graph from "./Graph";
import Courtroom from "./Courtroom";
import Leaderboard from "./Leaderboard";
import Debates from "./Debates";
import Future from "./Future";
import Synthesis from "./Synthesis";
import Method from "./Method";
import { CUTOFF } from "@/lib/atlas/taxonomy";

const NAV: { id: ViewId; label: string; n?: string }[] = [
  { id: "big-picture", label: "Big Picture", n: "01" },
  { id: "timeline", label: "Timeline", n: "02" },
  { id: "minds", label: "30 Minds", n: "03" },
  { id: "graph", label: "Knowledge Graph", n: "04" },
  { id: "courtroom", label: "Prediction Courtroom", n: "05" },
  { id: "leaderboard", label: "Foresight Leaderboard", n: "06" },
  { id: "debates", label: "Great Debates", n: "07" },
  { id: "future", label: "Future Stack", n: "08" },
  { id: "synthesis", label: "Synthesis" },
  { id: "method", label: "Method & Data" },
];

function parseHash(): { view: ViewId; params: Record<string, string> } {
  if (typeof window === "undefined") return { view: "big-picture", params: {} };
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [path, query = ""] = raw.split("?");
  const view = (NAV.find((n) => n.id === path)?.id ?? "big-picture") as ViewId;
  return { view, params: Object.fromEntries(new URLSearchParams(query)) };
}

export default function Site() {
  const [route, setRoute] = useState<{ view: ViewId; params: Record<string, string> }>({ view: "big-picture", params: {} });
  const [drawer, setDrawer] = useState<Drawer>(null);

  useEffect(() => {
    const sync = () => setRoute(parseHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const go = useCallback((view: ViewId, params?: Record<string, string>) => {
    const q = params && Object.keys(params).length ? `?${new URLSearchParams(params)}` : "";
    window.location.hash = `/${view}${q}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const closeDrawer = useCallback(() => setDrawer(null), []);

  const { view, params } = route;

  return (
    <AtlasCtx.Provider value={{ go, open: setDrawer }}>
      <a href="#main" className="at-sr">Skip to content</a>
      <header className="at-top">
        <div className="at-top-in">
          <a className="at-brand" href="#/big-picture" aria-label="AI Intelligence Atlas home">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#7f9cf5" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="5" fill="none" stroke="#e2e8f0" strokeWidth="1.6" />
              <circle cx="12" cy="2" r="2" fill="#f59e0b" /><circle cx="20.5" cy="16" r="2" fill="#ec4899" /><circle cx="3.5" cy="16" r="2" fill="#22d3ee" />
            </svg>
            <span><b>AI Intelligence Atlas</b></span>
          </a>
          <nav className="at-nav" aria-label="Experiences">
            {NAV.map((n) => (
              <a key={n.id} href={`#/${n.id}`} aria-current={view === n.id ? "page" : undefined}>
                {n.n && <span className="n">{n.n}</span>}{n.label}
              </a>
            ))}
          </nav>
          <span className="at-cut" title="Research cutoff">Cutoff {CUTOFF}</span>
        </div>
      </header>
      <main id="main">
        {view === "big-picture" && <BigPicture />}
        {view === "timeline" && <Timeline initial={params.p} compare={params.vs} />}
        {view === "minds" && <Minds />}
        {view === "graph" && <Graph params={params} />}
        {view === "courtroom" && <Courtroom params={params} />}
        {view === "leaderboard" && <Leaderboard who={params.who} />}
        {view === "debates" && <Debates initial={params.d} />}
        {view === "future" && <Future initial={params.s} />}
        {view === "synthesis" && <Synthesis />}
        {view === "method" && <Method />}
      </main>
      <footer className="at-foot">
        <div className="at-wrap">
          Research cutoff {CUTOFF}. Historical findings, interpretations and forecasts are labeled separately. Every claim links to its sources;
          unverified attributions are marked. Data: <code>src/lib/atlas/data/*.json</code> — export any table from its view.
        </div>
      </footer>
      <Drawers drawer={drawer} onClose={closeDrawer} />
    </AtlasCtx.Provider>
  );
}
