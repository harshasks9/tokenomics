"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Action, Event, PersonaId } from "@/lib/agentify/types";
import type { FunctionId } from "@/lib/agentify/functions-types";
import type { UseCaseDetail, View } from "@/lib/agentify/views";
import type { RunResult } from "@/lib/agentify/run";

export type Page =
  | "start" | "home" | "usecases" | "usage" | "workshop" | "collections"
  | "board" | "accounts" | "kit"
  | "plan" | "execution" | "squad" | "qualify" | "scorecard";

export type Route =
  | { page: Page }
  | { page: "day"; fn?: FunctionId }
  | { page: "collection"; id: FunctionId }
  | { page: "usecase"; slug: string; tab: "overview" | "files" | "run" | "lab"; path?: string }
  | { page: "account"; id: string };

const FNS: FunctionId[] = ["fpa", "devops", "secops", "revops"];

const PAGES: Page[] = ["home", "usecases", "usage", "workshop", "collections", "board", "accounts", "kit", "plan", "execution", "squad", "qualify", "scorecard"];

export function parseHash(h: string): Route {
  const p = h.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (p[0] === "u" && p.length >= 3) {
    const tab = (["overview", "files", "run", "lab"].includes(p[3]) ? p[3] : "overview") as "overview" | "files" | "run" | "lab";
    return { page: "usecase", slug: `${p[1]}/${p[2]}`, tab, path: tab === "files" && p.length > 4 ? p.slice(4).join("/") : undefined };
  }
  if (p[0] === "account" && p[1]) return { page: "account", id: p[1] };
  if (p[0] === "day") return { page: "day", fn: FNS.includes(p[1] as FunctionId) ? (p[1] as FunctionId) : undefined };
  if (p[0] === "c" && FNS.includes(p[1] as FunctionId)) return { page: "collection", id: p[1] as FunctionId };
  if (PAGES.includes(p[0] as Page)) return { page: p[0] as Page };
  return { page: "start" };
}

export function formatRoute(r: Route): string {
  if (r.page === "usecase") return `#/u/${r.slug}${r.tab !== "overview" ? `/${r.tab}` : ""}${r.path ? `/${r.path}` : ""}`;
  if (r.page === "account") return `#/account/${r.id}`;
  if (r.page === "day") return `#/day${r.fn ? `/${r.fn}` : ""}`;
  if (r.page === "collection") return `#/c/${r.id}`;
  return r.page === "start" ? "#/" : `#/${r.page}`;
}

interface Toast { kind: "ok" | "deny"; text: string }

interface State {
  view: View | null;
  persona: PersonaId;
  busy: boolean;
  route: Route;
  navigate: (r: Route) => void;
  signIn: (p: PersonaId) => Promise<void>;
  act: (a: Action, opts?: { success?: string; as?: PersonaId }) => Promise<boolean>;
  reset: () => Promise<void>;
  toast: Toast | null;
  dismiss: () => void;
  fetchUseCase: (id: string) => Promise<UseCaseDetail | null>;
  runUseCase: (id: string, input: string) => Promise<{ ok: true; result: RunResult } | { ok: false; reason: string }>;
}

const Ctx = createContext<State | null>(null);
const STORE = "ag-events-v1";

function loadEvents(): Event[] {
  try {
    const raw = window.localStorage.getItem(STORE);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function AgentifyProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View | null>(null);
  const [busy, setBusy] = useState(false);
  const [route, setRoute] = useState<Route>({ page: "start" });
  const [toast, setToast] = useState<Toast | null>(null);
  const events = useRef<Event[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((t: Toast) => {
    setToast(t);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), t.kind === "deny" ? 9000 : 4500);
  }, []);

  useEffect(() => {
    const sync = () => setRoute(parseHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const navigate = useCallback((r: Route) => {
    const h = formatRoute(r);
    if (window.location.hash !== h) window.history.pushState(null, "", h);
    setRoute(r);
    window.scrollTo({ top: 0 });
  }, []);

  const call = useCallback(async (body: { signInAs?: PersonaId; action?: Action; events?: Event[] }) => {
    setBusy(true);
    try {
      const res = await fetch("/api/agentify", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ events: body.events ?? events.current, signInAs: body.signInAs, action: body.action }) });
      const data = (await res.json()) as { ok: boolean; reason?: string; events?: Event[]; view?: View; rejected?: { reason: string } };
      if (data.view) setView(data.view);
      if (Array.isArray(data.events)) {
        events.current = data.events;
        try { localStorage.setItem(STORE, JSON.stringify(data.events)); } catch { /* storage unavailable */ }
      }
      if (data.rejected) show({ kind: "deny", text: `Saved demo history was trimmed: ${data.rejected.reason}` });
      return data;
    } catch {
      show({ kind: "deny", text: "Couldn't reach the service." });
      return null;
    } finally {
      setBusy(false);
    }
  }, [show]);

  useEffect(() => {
    events.current = loadEvents();
    // First sync after mount (deferred so the fetch's state updates aren't synchronous in the effect).
    const t = setTimeout(() => void call({}), 0);
    return () => clearTimeout(t);
  }, [call]);

  const signIn = useCallback(async (p: PersonaId) => {
    await call({ signInAs: p });
    navigate({ page: "start" });
  }, [call, navigate]);

  const act = useCallback<State["act"]>(async (a, opts) => {
    const d = await call({ action: a, signInAs: opts?.as });
    if (!d) return false;
    if (!d.ok) { show({ kind: "deny", text: d.reason ?? "Not allowed." }); return false; }
    if (opts?.success) show({ kind: "ok", text: opts.success });
    return true;
  }, [call, show]);

  const reset = useCallback(async () => {
    events.current = [];
    await call({ events: [] });
    show({ kind: "ok", text: "Demo reset." });
  }, [call, show]);

  const fetchUseCase = useCallback(async (id: string) => {
    try {
      const r = await fetch("/api/agentify/usecase", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ useCaseId: id }) });
      if (!r.ok) return null;
      return ((await r.json()) as { detail: UseCaseDetail }).detail;
    } catch { return null; }
  }, []);

  const runUseCase = useCallback<State["runUseCase"]>(async (id, input) => {
    try {
      const r = await fetch("/api/agentify/run", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ useCaseId: id, input }) });
      const d = (await r.json()) as { ok: boolean; result?: RunResult; reason?: string };
      return d.ok && d.result ? { ok: true, result: d.result } : { ok: false, reason: d.reason ?? "Run failed." };
    } catch { return { ok: false, reason: "Couldn't reach the runner." }; }
  }, []);

  const value = useMemo<State>(() => ({
    view, persona: view?.persona ?? "customer", busy, route, navigate, signIn, act, reset, toast, dismiss: () => setToast(null), fetchUseCase, runUseCase,
  }), [view, busy, route, navigate, signIn, act, reset, toast, fetchUseCase, runUseCase]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAgentify(): State {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAgentify outside provider");
  return v;
}
