"use client";

import {
  ArrowLeft, BarChart3, BookOpen, CalendarCheck, CircleCheck, ClipboardList, Compass, Gauge, House, KanbanSquare, Layers, LayoutGrid, LoaderCircle, Lock,
  Play, RotateCcw, ShieldAlert, Sparkles, Target, Users, Workflow, X,
} from "lucide-react";
import type { PersonaId } from "@/lib/agentify/types";
import { AgentifyProvider, useAgentify, type Page, type Route } from "./state";
import { Avatar } from "./ui";
import { CustomerHome, CustomerUsage, Workshop } from "./CustomerPages";
import { Board, Kit } from "./PartnerPages";
import { Execution, Plan, Qualify, Scorecard, Squad } from "./GooglePages";
import { UseCaseLibrary, UseCasePage } from "./UseCases";
import AccountPage from "./AccountPage";
import AgentDay from "./AgentDay";
import { CollectionPage, CollectionsIndex } from "./Collections";

type NavPage = Page | "day";
type Item = { page: NavPage; label: string; icon: typeof House; internal?: boolean };

const NAV: Record<PersonaId, { group: string; items: Item[] }[]> = {
  customer: [
    { group: "", items: [{ page: "day", label: "Agent in a Day", icon: Play }, { page: "collections", label: "Collections", icon: LayoutGrid }, { page: "usecases", label: "All use cases", icon: Workflow }] },
    { group: "Your Workspace", items: [{ page: "home", label: "What you own", icon: House }, { page: "usage", label: "Your usage", icon: BarChart3 }, { page: "workshop", label: "Book Agentify your Day", icon: CalendarCheck }] },
  ],
  partner: [
    { group: "", items: [{ page: "board", label: "This week", icon: KanbanSquare }, { page: "accounts", label: "My accounts", icon: Users }] },
    { group: "Deliver", items: [{ page: "kit", label: "Workshop kit", icon: BookOpen }, { page: "day", label: "Agent in a Day", icon: Play }, { page: "collections", label: "Collections", icon: LayoutGrid }, { page: "usecases", label: "Use-case packs", icon: Workflow }] },
  ],
  google: [
    { group: "Q1 FY27", items: [{ page: "plan", label: "Workstream plan", icon: Target, internal: true }, { page: "execution", label: "Execution model", icon: Layers, internal: true }, { page: "squad", label: "Squad & accountability", icon: ClipboardList, internal: true }] },
    { group: "Run it", items: [{ page: "qualify", label: "Account qualification", icon: Compass }, { page: "scorecard", label: "Weekly scorecard", icon: Gauge }] },
    { group: "Kit", items: [{ page: "day", label: "Agent in a Day", icon: Play }, { page: "collections", label: "Collections", icon: LayoutGrid }, { page: "usecases", label: "Use-case packs", icon: Workflow }, { page: "kit", label: "Workshop kit", icon: BookOpen }] },
  ],
};

const HOME: Record<PersonaId, Route> = { customer: { page: "day" }, partner: { page: "board" }, google: { page: "plan" } };
const ACCENT: Record<PersonaId, string> = { customer: "var(--p-customer)", partner: "var(--p-partner)", google: "var(--p-google)" };

function Top() {
  const { view, persona, signIn, busy, navigate } = useAgentify();
  return (
    <header className="ag-top">
      <button type="button" className="ag-brand" onClick={() => navigate(HOME[persona])}>
        <span className="ag-brand-mark"><Sparkles size={16} /></span>
        <span className="ag-brand-name">Agentify your Day</span>
        <span className="ag-brand-tag">Google Workspace</span>
      </button>
      <span className="ag-spacer" />
      {persona === "customer" ? (
        <nav className="ag-viewlinks" aria-label="Other views">
          <button type="button" disabled={busy} onClick={() => signIn("google")}>Google view</button>
          <span aria-hidden>·</span>
          <button type="button" disabled={busy} onClick={() => signIn("partner")}>Partner view</button>
        </nav>
      ) : (
        <nav className="ag-viewlinks" aria-label="Other views">
          <span className={`ag-tag ${persona === "google" ? "p-google" : "p-partner"}`}>{persona === "google" ? "Google view" : "Partner view"}</span>
          <button type="button" disabled={busy} onClick={() => signIn("customer")}><ArrowLeft size={13} /> Customer view</button>
          <span aria-hidden>·</span>
          <button type="button" disabled={busy} onClick={() => signIn(persona === "google" ? "partner" : "google")}>{persona === "google" ? "Partner view" : "Google view"}</button>
        </nav>
      )}
      {view && (
        <div className="ag-who">
          <Avatar initials={view.person.initials} kind={persona} />
          <div className="ag-who-text"><div className="ag-who-name">{view.person.name}</div><div className="ag-who-org">{view.person.title} · {view.person.org}</div></div>
        </div>
      )}
      {busy && <LoaderCircle size={16} className="ag-spin" aria-label="Working" />}
    </header>
  );
}

function activeKey(route: Route, persona: PersonaId): NavPage {
  if (route.page === "start") return HOME[persona].page as NavPage;
  if (route.page === "usecase") return "usecases";
  if (route.page === "collection") return "collections";
  if (route.page === "account") return persona === "partner" ? "accounts" : "qualify";
  return route.page as NavPage;
}

function Side() {
  const { persona, route, navigate, reset } = useAgentify();
  const active = activeKey(route, persona);
  return (
    <nav className="ag-side" aria-label="Sections" style={{ ["--side-accent" as string]: ACCENT[persona] }}>
      {NAV[persona].map((g, i) => (
        <div key={i} className="ag-side-group">
          {g.group && <div className="ag-side-label">{g.group}</div>}
          {g.items.map((it) => {
            const Icon = it.icon;
            return (
              <button key={it.page} type="button" className="ag-side-item" aria-current={active === it.page ? "page" : undefined} onClick={() => navigate(it.page === "day" ? { page: "day" } : { page: it.page })}>
                <Icon size={16} /><span>{it.label}</span>{it.internal && <Lock size={12} aria-label="Internal" />}
              </button>
            );
          })}
        </div>
      ))}
      <div className="ag-side-foot">
        <button type="button" className="ag-side-item" onClick={() => { if (window.confirm("Reset the demo?")) void reset(); }}><RotateCcw size={15} /><span>Reset demo</span></button>
        <p>Synthetic people, companies and telemetry. Each view receives only what the server allows.</p>
      </div>
    </nav>
  );
}

function Body() {
  const { view, persona, route } = useAgentify();
  if (!view) return <main className="ag-main"><div className="ag-skel" style={{ height: 260 }} /><div className="ag-skel" style={{ height: 160, marginTop: 14 }} /></main>;
  const allowed = new Set<string>(NAV[persona].flatMap((g) => g.items.map((i) => i.page)));
  const r: Route = route.page === "start" ? HOME[persona] : route;
  const page = ["usecase", "account", "collection"].includes(r.page) || allowed.has(r.page) ? r.page : HOME[persona].page;
  return (
    <main className="ag-main">
      {page === "day" && <AgentDay key={r.page === "day" ? r.fn ?? "fpa" : "fpa"} />}
      {page === "collections" && <CollectionsIndex />}
      {page === "collection" && r.page === "collection" && <CollectionPage id={r.id} />}
      {page === "home" && <CustomerHome />}
      {page === "usage" && <CustomerUsage />}
      {page === "workshop" && <Workshop />}
      {page === "usecases" && <UseCaseLibrary />}
      {page === "usecase" && r.page === "usecase" && <UseCasePage key={r.slug} slug={r.slug} tab={r.tab} path={r.path} />}
      {page === "board" && <Board />}
      {page === "accounts" && <Qualify mine />}
      {page === "kit" && <Kit />}
      {page === "plan" && <Plan />}
      {page === "execution" && <Execution />}
      {page === "squad" && <Squad />}
      {page === "qualify" && <Qualify />}
      {page === "scorecard" && <Scorecard />}
      {page === "account" && r.page === "account" && <AccountPage key={r.id} id={r.id} />}
    </main>
  );
}

function Toast() {
  const { toast, dismiss } = useAgentify();
  if (!toast) return null;
  return (
    <div className={`ag-toast ${toast.kind === "deny" ? "deny" : ""}`} role={toast.kind === "deny" ? "alert" : "status"}>
      {toast.kind === "deny" ? <ShieldAlert size={18} color="#ff8a80" /> : <CircleCheck size={18} color="#81c995" />}
      <div>{toast.kind === "deny" && <b>Not allowed: </b>}{toast.text}</div>
      <button type="button" className="ag-toast-x" onClick={dismiss} aria-label="Dismiss"><X size={16} /></button>
    </div>
  );
}

export default function Agentify() {
  return (
    <AgentifyProvider>
      <Top />
      <div className="ag-layout"><Side /><Body /></div>
      <Toast />
    </AgentifyProvider>
  );
}
