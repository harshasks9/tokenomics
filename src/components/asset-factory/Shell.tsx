"use client";

import {
  BarChart3, Boxes, Briefcase, CircleCheck, Compass, FolderKanban, Hammer, House, Library, LoaderCircle, Lock, Play, RotateCcw, Search,
  ShieldAlert, Sparkles, Upload, X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PersonaId } from "@/lib/asset-factory/types";
import { FactoryProvider, useFactory, type Route, type Tab } from "./state";
import { AssetIcon, Avatar, OrgName, PERSONA_NAME } from "./ui";
import Home from "./Home";
import Marketplace from "./Marketplace";
import AssetPage from "./AssetPage";
import Inherit from "./Inherit";
import Studio from "./Studio";
import Workspaces from "./Workspaces";
import Journey from "./Journey";
import Insights from "./Insights";
import Gtm from "./Gtm";
import Contribute from "./Contribute";
import Collections from "./Collections";

type NavItem = { tab: Tab; label: string; icon: typeof House; internal?: boolean };

/** One marketplace, three experiences: each persona gets its own navigation and priorities. */
const NAV: Record<PersonaId, { group: string; items: NavItem[] }[]> = {
  customer: [
    { group: "", items: [{ tab: "home", label: "For you", icon: House }, { tab: "market", label: "Solutions", icon: Compass }] },
    { group: "Your agents", items: [{ tab: "workspaces", label: "My Agents", icon: FolderKanban }, { tab: "journey", label: "My Gemini 10 Journey", icon: Play }, { tab: "insights", label: "Consumption & ROI", icon: BarChart3 }] },
    { group: "Build & share", items: [{ tab: "studio", label: "Build", icon: Hammer }, { tab: "assets", label: "Share & contribute", icon: Upload }] },
  ],
  google: [
    { group: "", items: [{ tab: "home", label: "Cockpit", icon: House }, { tab: "market", label: "Asset discovery", icon: Compass }] },
    { group: "Deliver", items: [{ tab: "studio", label: "Assembly Studio", icon: Hammer }, { tab: "workspaces", label: "Engagements", icon: Briefcase }, { tab: "journey", label: "10-day sprint", icon: Play }] },
    { group: "Scale", items: [{ tab: "insights", label: "Reuse intelligence", icon: BarChart3 }, { tab: "gtm", label: "GTM metrics", icon: Lock, internal: true }, { tab: "assets", label: "Review & contribute", icon: Upload }] },
  ],
  partner: [
    { group: "", items: [{ tab: "home", label: "Home", icon: House }, { tab: "market", label: "Marketplace", icon: Compass }] },
    { group: "Deliver", items: [{ tab: "studio", label: "Assembly Studio", icon: Hammer }, { tab: "workspaces", label: "Customer projects", icon: Briefcase }, { tab: "journey", label: "Journey", icon: Play }] },
    { group: "Your IP", items: [{ tab: "assets", label: "My published assets", icon: Boxes }, { tab: "collections", label: "Collections", icon: Library }, { tab: "insights", label: "Contribution analytics", icon: BarChart3 }] },
  ],
};

const ACCENT: Record<PersonaId, string> = { customer: "var(--p-customer)", google: "var(--p-google)", partner: "var(--p-partner)" };

function Palette() {
  const { paletteOpen, setPaletteOpen } = useFactory();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(!paletteOpen); }
      else if (e.key === "/" && !paletteOpen && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) { e.preventDefault(); setPaletteOpen(true); }
      else if (e.key === "Escape" && paletteOpen) setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);
  return paletteOpen ? <PaletteDialog /> : null;
}

function PaletteDialog() {
  const { setPaletteOpen, view, persona, navigate } = useFactory();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  const results = useMemo(() => {
    const t = q.toLowerCase().trim();
    const pages = NAV[persona].flatMap((g) => g.items).filter((i) => !t || i.label.toLowerCase().includes(t)).map((i) => ({ kind: "page" as const, id: i.tab, label: i.label, sub: "Go to", type: "skill" as const, route: { page: i.tab } as Route }));
    const assets = (view?.assets ?? [])
      .filter((a) => !t || `${a.slug} ${a.name} ${a.summary} ${a.tags.join(" ")}`.toLowerCase().includes(t))
      .sort((a, b) => b.deployments - a.deployments)
      .slice(0, t ? 9 : 6)
      .map((a) => ({ kind: "asset" as const, id: a.id, label: a.slug, sub: a.name, type: a.type, route: { page: "asset", slug: a.slug, tab: "overview" } as Route }));
    return [...assets, ...pages.slice(0, t ? 6 : 4)];
  }, [q, view, persona]);

  const go = (r: Route) => { navigate(r); setPaletteOpen(false); };
  return (
    <div className="af-scrim" onClick={() => setPaletteOpen(false)}>
      <div className="af-palette" role="dialog" aria-label="Search" onClick={(e) => e.stopPropagation()}>
        <div className="af-palette-input">
          <Search size={17} />
          <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder="Search skills, connectors, blueprints… or jump to a page"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
              if (e.key === "Enter" && results[sel]) go(results[sel].route);
            }} aria-label="Search" />
          <kbd>esc</kbd>
        </div>
        <ul className="af-palette-list" role="listbox">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`} role="option" aria-selected={i === sel}>
              <button type="button" onMouseEnter={() => setSel(i)} onClick={() => go(r.route)}>
                {r.kind === "asset" ? <AssetIcon type={r.type} size={26} /> : <span className="af-palette-page"><Compass size={14} /></span>}
                <span style={{ minWidth: 0 }}>
                  <span className={r.kind === "asset" ? "af-mono" : ""} style={{ fontWeight: 600, fontSize: 13 }}>{r.label}</span>
                  <span className="af-muted" style={{ fontSize: 12, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</span>
                </span>
              </button>
            </li>
          ))}
          {!results.length && <li className="af-muted" style={{ padding: 16 }}>No matches you can see.</li>}
        </ul>
      </div>
    </div>
  );
}

function Topbar() {
  const { view, persona, signIn, busy, setPaletteOpen, navigate } = useFactory();
  const person = view?.actor.person;
  return (
    <header className="af-top">
      <button type="button" className="af-brand" onClick={() => navigate({ page: "home" })}>
        <span className="af-brand-mark"><Sparkles size={16} /></span>
        <span className="af-brand-name">Asset Factory</span>
        <span className="af-brand-tag">Gemini 10</span>
      </button>
      <button type="button" className="af-searchbtn" onClick={() => setPaletteOpen(true)}>
        <Search size={15} /><span>Search skills, connectors, blueprints…</span><kbd>⌘K</kbd>
      </button>
      <span className="af-spacer" />
      <div className="af-switch" role="group" aria-label="View the platform as">
        {(["customer", "google", "partner"] as PersonaId[]).map((p) => (
          <button key={p} type="button" data-p={p} aria-pressed={persona === p} disabled={busy && persona !== p} onClick={() => persona !== p && signIn(p)}>
            <span className="af-dot" data-p={p} />{PERSONA_NAME[p]}
          </button>
        ))}
      </div>
      {person && (
        <div className="af-who" title={`Signed in (simulated) as ${person.name}`}>
          <Avatar initials={person.initials} kind={person.org.kind} />
          <div className="af-who-text">
            <div className="af-who-name">{person.name}</div>
            <div className="af-who-org"><OrgName org={person.org} /></div>
          </div>
        </div>
      )}
      {busy && <LoaderCircle size={16} className="af-spin" aria-label="Working" />}
    </header>
  );
}

function Sidebar() {
  const { persona, route, navigate, reset, view } = useFactory();
  const active = route.page === "asset" || route.page === "inherit" ? "market" : route.page;
  const pending = (view?.contributions ?? []).filter((c) => c.canApproveCustomer || c.canReview || c.canPublish).length;
  return (
    <nav className="af-side" aria-label="Sections" style={{ ["--side-accent" as string]: ACCENT[persona] }}>
      {NAV[persona].map((g, gi) => (
        <div key={gi} className="af-side-group">
          {g.group && <div className="af-side-label">{g.group}</div>}
          {g.items.map((n) => {
            const Icon = n.icon;
            return (
              <button key={n.tab} type="button" className="af-side-item" aria-current={active === n.tab ? "page" : undefined} onClick={() => navigate({ page: n.tab })}>
                <Icon size={16} /><span>{n.label}</span>
                {n.internal && <span className="af-tag v-internal" style={{ padding: "0 5px", fontSize: 10 }}>Internal</span>}
                {n.tab === "assets" && pending > 0 && <span className="af-count hot">{pending}</span>}
              </button>
            );
          })}
        </div>
      ))}
      <div className="af-side-foot">
        <button type="button" className="af-side-item" onClick={() => { if (window.confirm("Reset the demo to its starting state?")) void reset(); }}><RotateCcw size={15} /><span>Reset demo</span></button>
        <p>Concept demo · synthetic data. The server decides what each persona receives.</p>
      </div>
    </nav>
  );
}

function Toast() {
  const { toast, dismissToast, navigate } = useFactory();
  if (!toast) return null;
  return (
    <div className={`af-toast ${toast.kind === "deny" ? "deny" : ""}`} role={toast.kind === "deny" ? "alert" : "status"}>
      {toast.kind === "deny" ? <ShieldAlert size={18} color="#ff8a80" style={{ flex: "none" }} /> : <CircleCheck size={18} color="#81c995" style={{ flex: "none" }} />}
      <div>{toast.kind === "deny" && <b>Denied by the platform: </b>}{toast.text}</div>
      {toast.action && <button type="button" className="af-toast-act" onClick={() => { navigate(toast.action!.route); dismissToast(); }}>{toast.action.label}</button>}
      <button type="button" className="af-toast-x" onClick={dismissToast} aria-label="Dismiss"><X size={16} /></button>
    </div>
  );
}

function Body() {
  const { view, persona, route } = useFactory();
  if (!view) return <div className="af-main"><div className="af-skel" style={{ height: 240 }} /><div className="af-skel" style={{ height: 160, marginTop: 16 }} /></div>;
  const tabs = NAV[persona].flatMap((g) => g.items.map((i) => i.tab));
  const page = route.page === "asset" || route.page === "inherit" ? route.page : tabs.includes(route.page) ? route.page : "home";
  return (
    <main className="af-main">
      {page === "home" && <Home />}
      {page === "market" && <Marketplace />}
      {page === "asset" && route.page === "asset" && <AssetPage key={route.slug} slug={route.slug} tab={route.tab} path={route.path} />}
      {page === "inherit" && route.page === "inherit" && <Inherit key={route.slug} slug={route.slug} />}
      {page === "studio" && <Studio />}
      {page === "workspaces" && <Workspaces />}
      {page === "journey" && <Journey />}
      {page === "insights" && <Insights />}
      {page === "gtm" && <Gtm />}
      {page === "assets" && <Contribute />}
      {page === "collections" && <Collections />}
    </main>
  );
}

export default function AssetFactory() {
  return (
    <FactoryProvider>
      <Topbar />
      <div className="af-layout">
        <Sidebar />
        <Body />
      </div>
      <Palette />
      <Toast />
    </FactoryProvider>
  );
}
