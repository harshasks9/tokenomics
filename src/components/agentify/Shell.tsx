"use client";

import {
  BarChart3, BookOpen, CircleCheck, ClipboardList, Compass, Gauge, House, KanbanSquare, Layers, LoaderCircle, Lock, RotateCcw, ShieldAlert,
  Sparkles, Target, Users, Workflow, X,
} from "lucide-react";
import type { PersonaId } from "@/lib/agentify/types";
import { AgentifyProvider, useAgentify, type Page } from "./state";
import { Avatar } from "./ui";
import { CustomerHome, CustomerUsage, Workshop } from "./CustomerPages";
import { Board, Kit } from "./PartnerPages";
import { Execution, Plan, Qualify, Scorecard, Squad } from "./GooglePages";
import { UseCaseLibrary, UseCasePage } from "./UseCases";
import AccountPage from "./AccountPage";

type Item = { page: Page; label: string; icon: typeof House; internal?: boolean };

const NAV: Record<PersonaId, { group: string; items: Item[] }[]> = {
  customer: [
    { group: "", items: [{ page: "home", label: "Your agent day", icon: House }, { page: "usage", label: "Who's using it", icon: BarChart3 }] },
    { group: "Get going", items: [{ page: "usecases", label: "Long-running agents", icon: Workflow }, { page: "workshop", label: "Agentify your Day", icon: Sparkles }] },
  ],
  partner: [
    { group: "", items: [{ page: "board", label: "This week", icon: KanbanSquare }, { page: "accounts", label: "My accounts", icon: Users }] },
    { group: "Deliver", items: [{ page: "kit", label: "Workshop kit", icon: BookOpen }, { page: "usecases", label: "Use-case packs", icon: Workflow }] },
  ],
  google: [
    { group: "Q1 FY27", items: [{ page: "plan", label: "Workstream plan", icon: Target, internal: true }, { page: "execution", label: "Execution model", icon: Layers, internal: true }, { page: "squad", label: "Squad & accountability", icon: ClipboardList, internal: true }] },
    { group: "Run it", items: [{ page: "qualify", label: "Account qualification", icon: Compass }, { page: "scorecard", label: "Weekly scorecard", icon: Gauge }] },
    { group: "Kit", items: [{ page: "usecases", label: "Use-case packs", icon: Workflow }, { page: "kit", label: "Workshop kit", icon: BookOpen }] },
  ],
};

const HOME: Record<PersonaId, Page> = { customer: "home", partner: "board", google: "plan" };
const ACCENT: Record<PersonaId, string> = { customer: "var(--p-customer)", partner: "var(--p-partner)", google: "var(--p-google)" };
const LABEL: Record<PersonaId, string> = { customer: "Customer", partner: "Partner", google: "Google" };

function Top() {
  const { view, persona, signIn, busy, navigate } = useAgentify();
  return (
    <header className="ag-top">
      <button type="button" className="ag-brand" onClick={() => navigate({ page: HOME[persona] })}>
        <span className="ag-brand-mark"><Sparkles size={16} /></span>
        <span className="ag-brand-name">Agentify your Day</span>
        <span className="ag-brand-tag">Workspace · AWT 2.0</span>
      </button>
      <span className="ag-spacer" />
      <div className="ag-switch" role="group" aria-label="View as">
        {(["customer", "partner", "google"] as PersonaId[]).map((p) => (
          <button key={p} type="button" data-p={p} aria-pressed={persona === p} disabled={busy && persona !== p} onClick={() => persona !== p && signIn(p)}>
            <span className="ag-dot" data-p={p} />{LABEL[p]}
          </button>
        ))}
      </div>
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

function Side() {
  const { persona, route, navigate, reset } = useAgentify();
  const active = route.page === "usecase" ? "usecases" : route.page === "account" ? (persona === "partner" ? "accounts" : "qualify") : route.page;
  return (
    <nav className="ag-side" aria-label="Sections" style={{ ["--side-accent" as string]: ACCENT[persona] }}>
      {NAV[persona].map((g, i) => (
        <div key={i} className="ag-side-group">
          {g.group && <div className="ag-side-label">{g.group}</div>}
          {g.items.map((it) => {
            const Icon = it.icon;
            return (
              <button key={it.page} type="button" className="ag-side-item" aria-current={active === it.page ? "page" : undefined} onClick={() => navigate({ page: it.page })}>
                <Icon size={16} /><span>{it.label}</span>{it.internal && <Lock size={12} aria-label="Internal" />}
              </button>
            );
          })}
        </div>
      ))}
      <div className="ag-side-foot">
        <button type="button" className="ag-side-item" onClick={() => { if (window.confirm("Reset the demo?")) void reset(); }}><RotateCcw size={15} /><span>Reset demo</span></button>
        <p>Internal concept · synthetic accounts and telemetry. Each persona receives only what the server allows.</p>
      </div>
    </nav>
  );
}

function Body() {
  const { view, persona, route, locked } = useAgentify();
  if (locked) return <main className="ag-main"><div className="ag-empty"><Lock size={18} /> Locked. <a href={`/deal-check/gate?next=${encodeURIComponent("/agentify")}`}>Enter the passcode</a> to continue.</div></main>;
  if (!view) return <main className="ag-main"><div className="ag-skel" style={{ height: 220 }} /><div className="ag-skel" style={{ height: 160, marginTop: 14 }} /></main>;
  const pages = NAV[persona].flatMap((g) => g.items.map((i) => i.page));
  const page = route.page === "usecase" || route.page === "account" ? route.page : pages.includes(route.page) ? route.page : HOME[persona];
  return (
    <main className="ag-main">
      {page === "home" && <CustomerHome />}
      {page === "usage" && <CustomerUsage />}
      {page === "workshop" && <Workshop />}
      {page === "usecases" && <UseCaseLibrary />}
      {page === "usecase" && route.page === "usecase" && <UseCasePage key={route.slug} slug={route.slug} tab={route.tab} path={route.path} />}
      {page === "board" && <Board />}
      {page === "accounts" && <Qualify mine />}
      {page === "kit" && <Kit />}
      {page === "plan" && <Plan />}
      {page === "execution" && <Execution />}
      {page === "squad" && <Squad />}
      {page === "qualify" && <Qualify />}
      {page === "scorecard" && <Scorecard />}
      {page === "account" && route.page === "account" && <AccountPage key={route.id} id={route.id} />}
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
