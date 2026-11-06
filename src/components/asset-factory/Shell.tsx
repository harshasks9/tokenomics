"use client";

import { LoaderCircle, Lock, Play, RotateCcw, Sparkles, X, CircleCheck, ShieldAlert } from "lucide-react";
import type { PersonaId } from "@/lib/asset-factory/types";
import { FactoryProvider, useFactory, type Tab } from "./state";
import { Avatar, OrgName, PERSONA_NAME } from "./ui";
import Home from "./Home";
import Marketplace from "./Marketplace";
import AssetDrawer from "./AssetDrawer";
import Studio from "./Studio";
import Workspaces from "./Workspaces";
import Journey from "./Journey";
import Insights from "./Insights";
import Gtm from "./Gtm";
import Contribute from "./Contribute";
import Collections from "./Collections";

/** One marketplace, three experiences: each persona gets its own navigation and priorities. */
const NAV: Record<PersonaId, { tab: Tab; label: string; internal?: boolean }[]> = {
  customer: [
    { tab: "home", label: "For you" },
    { tab: "market", label: "Solutions" },
    { tab: "workspaces", label: "My Agents" },
    { tab: "journey", label: "My Gemini 10 Journey" },
    { tab: "insights", label: "Consumption & ROI" },
    { tab: "studio", label: "Build" },
    { tab: "assets", label: "Share & contribute" },
  ],
  google: [
    { tab: "home", label: "Cockpit" },
    { tab: "market", label: "Asset discovery" },
    { tab: "studio", label: "Assembly Studio" },
    { tab: "workspaces", label: "Engagements" },
    { tab: "journey", label: "10-day sprint" },
    { tab: "insights", label: "Reuse intelligence" },
    { tab: "gtm", label: "GTM metrics", internal: true },
    { tab: "assets", label: "Review & contribute" },
  ],
  partner: [
    { tab: "home", label: "Home" },
    { tab: "market", label: "Marketplace" },
    { tab: "studio", label: "Assembly Studio" },
    { tab: "workspaces", label: "Customer projects" },
    { tab: "assets", label: "My published assets" },
    { tab: "collections", label: "Collections" },
    { tab: "insights", label: "Contribution analytics" },
    { tab: "journey", label: "Journey" },
  ],
};

const ACCENT: Record<PersonaId, string> = { customer: "var(--p-customer)", google: "var(--p-google)", partner: "var(--p-partner)" };

function Header() {
  const { view, persona, signIn, busy, tab, setTab, reset } = useFactory();
  const person = view?.actor.person;
  const nav = NAV[persona];
  const active = nav.some((n) => n.tab === tab) ? tab : "home";
  return (
    <header className="af-header">
      <div className="af-header-row">
        <button type="button" className="af-brand" onClick={() => setTab("home")} style={{ border: 0, background: "none", padding: 0 }}>
          <span className="af-brand-mark"><Sparkles size={17} /></span>
          <span style={{ textAlign: "left" }}>
            <span className="af-brand-name" style={{ display: "block" }}>Gemini 10 Asset Factory</span>
            <span className="af-brand-sub" style={{ display: "block" }}>Discover · Build · Deploy · Share · Consume</span>
          </span>
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
        {busy ? <LoaderCircle size={16} className="af-spin" aria-label="Working" /> : null}
      </div>
      <nav className="af-nav" aria-label="Sections">
        <div className="af-nav-row" style={{ ["--tab-accent" as string]: ACCENT[persona] }}>
          {nav.map((n) => (
            <button key={n.tab} type="button" className="af-tab" aria-current={active === n.tab ? "page" : undefined} onClick={() => setTab(n.tab)}>
              {n.tab === "journey" && <Play size={13} />}
              {n.label}
              {n.internal && <span className="af-tag v-internal" style={{ padding: "0 6px" }}><Lock size={10} />Internal</span>}
            </button>
          ))}
          <span className="af-spacer" />
          <button type="button" className="af-tab" onClick={() => { if (window.confirm("Reset the demo to its starting state?")) void reset(); }} title="Reset demo">
            <RotateCcw size={13} /> Reset demo
          </button>
        </div>
      </nav>
    </header>
  );
}

function Toast() {
  const { toast, dismissToast } = useFactory();
  if (!toast) return null;
  return (
    <div className={`af-toast ${toast.kind === "deny" ? "deny" : ""}`} role={toast.kind === "deny" ? "alert" : "status"}>
      {toast.kind === "deny" ? <ShieldAlert size={18} color="#ff8a80" style={{ flex: "none" }} /> : <CircleCheck size={18} color="#81c995" style={{ flex: "none" }} />}
      <div>{toast.kind === "deny" && <b>Denied by the platform: </b>}{toast.text}</div>
      <button type="button" className="af-toast-x" onClick={dismissToast} aria-label="Dismiss"><X size={16} /></button>
    </div>
  );
}

function Body() {
  const { view, persona, tab } = useFactory();
  if (!view) {
    return <div className="af-main"><div className="af-empty"><LoaderCircle size={18} className="af-spin" /> Loading the Asset Factory…</div></div>;
  }
  const allowed = NAV[persona].some((n) => n.tab === tab) ? tab : "home";
  return (
    <main className="af-main">
      {allowed === "home" && <Home />}
      {allowed === "market" && <Marketplace />}
      {allowed === "studio" && <Studio />}
      {allowed === "workspaces" && <Workspaces />}
      {allowed === "journey" && <Journey />}
      {allowed === "insights" && <Insights />}
      {allowed === "gtm" && <Gtm />}
      {allowed === "assets" && <Contribute />}
      {allowed === "collections" && <Collections />}
    </main>
  );
}

export default function AssetFactory() {
  return (
    <FactoryProvider>
      <Header />
      <Body />
      <AssetDrawer />
      <Toast />
      <footer className="af-footer">
        Concept demo. Organizations, people, assets and every figure are synthetic and modeled. Access decisions are made by the server for the signed-in persona; switching persona simulates signing in as someone else.
      </footer>
    </FactoryProvider>
  );
}
