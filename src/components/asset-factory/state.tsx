"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Action, Event, PersonaId } from "@/lib/asset-factory/types";
import type { AssetDetail, PlatformView } from "@/lib/asset-factory/views";
import type { RunResult } from "@/lib/asset-factory/run";

export type Tab = "home" | "market" | "studio" | "workspaces" | "journey" | "insights" | "gtm" | "assets" | "collections";
export type AssetTab = "overview" | "files" | "run" | "lineage" | "versions" | "reviews";

export type Route =
  | { page: Tab }
  | { page: "asset"; slug: string; tab: AssetTab; path?: string }
  | { page: "inherit"; slug: string };

export interface Toast { kind: "ok" | "deny"; text: string; action?: { label: string; route: Route } }
export interface StudioDraft { blueprintId: string | null; componentIds: string[] }

const TABS: Tab[] = ["home", "market", "studio", "workspaces", "journey", "insights", "gtm", "assets", "collections"];
const ASSET_TABS: AssetTab[] = ["overview", "files", "run", "lineage", "versions", "reviews"];

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  if (parts[0] === "a" && parts.length >= 3) {
    const slug = `${parts[1]}/${parts[2]}`;
    const tab = (ASSET_TABS.includes(parts[3] as AssetTab) ? parts[3] : "overview") as AssetTab;
    return { page: "asset", slug, tab, path: tab === "files" && parts.length > 4 ? parts.slice(4).join("/") : undefined };
  }
  if (parts[0] === "inherit" && parts.length >= 3) return { page: "inherit", slug: `${parts[1]}/${parts[2]}` };
  if (TABS.includes(parts[0] as Tab)) return { page: parts[0] as Tab };
  return { page: "home" };
}

export function formatRoute(r: Route): string {
  if (r.page === "asset") return `#/a/${r.slug}${r.tab !== "overview" ? `/${r.tab}` : ""}${r.path ? `/${r.path}` : ""}`;
  if (r.page === "inherit") return `#/inherit/${r.slug}`;
  return r.page === "home" ? "#/" : `#/${r.page}`;
}

interface FactoryState {
  view: PlatformView | null;
  events: Event[];
  persona: PersonaId;
  busy: boolean;
  route: Route;
  navigate: (r: Route, opts?: { replace?: boolean }) => void;
  /** Legacy helper used by section components. */
  tab: Tab;
  setTab: (t: Tab) => void;
  toast: Toast | null;
  showToast: (t: Toast) => void;
  dismissToast: () => void;
  signIn: (p: PersonaId) => Promise<void>;
  act: (action: Action, opts?: { as?: PersonaId; success?: string; quiet?: boolean }) => Promise<boolean>;
  reset: () => Promise<void>;
  openAsset: (idOrSlug: string | null, tab?: AssetTab) => void;
  workspaceId: string | null;
  openWorkspace: (id: string | null) => void;
  draft: StudioDraft;
  setDraft: (d: StudioDraft) => void;
  studioTarget: string;
  setStudioTarget: (t: string) => void;
  query: string;
  setQuery: (q: string) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  fetchAsset: (idOrSlug: string) => Promise<AssetDetail | null>;
  runAsset: (idOrSlug: string, input: string) => Promise<{ ok: true; result: RunResult } | { ok: false; reason: string }>;
}

const Ctx = createContext<FactoryState | null>(null);
const STORE = "af-events-v2";

function loadEvents(): Event[] {
  try {
    const raw = window.localStorage.getItem(STORE);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveEvents(events: Event[]) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(events));
  } catch {
    /* storage unavailable — the demo still works for this session */
  }
}

interface ApiResponse {
  ok: boolean;
  reason?: string;
  persona: PersonaId;
  events: Event[];
  rejected?: { index: number; reason: string };
  view: PlatformView;
}

export function FactoryProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<PlatformView | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [busy, setBusy] = useState(false);
  const [route, setRoute] = useState<Route>({ page: "home" });
  const [toast, setToast] = useState<Toast | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [draft, setDraft] = useState<StudioDraft>({ blueprintId: null, componentIds: [] });
  const [studioTarget, setStudioTarget] = useState<string>("draft");
  const [query, setQuery] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const eventsRef = useRef<Event[]>([]);
  const viewRef = useRef<PlatformView | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((t: Toast) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), t.kind === "deny" ? 9000 : 5000);
  }, []);

  // Hash routing: shareable URLs, working back/forward.
  useEffect(() => {
    const sync = () => setRoute(parseHash(window.location.hash));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const navigate = useCallback((r: Route, opts?: { replace?: boolean }) => {
    const hash = formatRoute(r);
    if (opts?.replace) window.history.replaceState(null, "", hash);
    else if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    setRoute(r);
    if (!(r.page === "asset" && route.page === "asset" && r.slug === route.slug)) window.scrollTo({ top: 0 });
  }, [route]);

  const call = useCallback(async (body: { signInAs?: PersonaId; action?: Action; events?: Event[] }) => {
    setBusy(true);
    try {
      const res = await fetch("/api/asset-factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: body.events ?? eventsRef.current, signInAs: body.signInAs, action: body.action }),
        credentials: "same-origin",
      });
      const data = (await res.json()) as ApiResponse;
      if (data.view) { setView(data.view); viewRef.current = data.view; }
      if (Array.isArray(data.events)) {
        eventsRef.current = data.events;
        setEvents(data.events);
        saveEvents(data.events);
      }
      if (data.rejected) showToast({ kind: "deny", text: `Saved demo history was cut at step ${data.rejected.index + 1}: ${data.rejected.reason}` });
      return data;
    } catch {
      showToast({ kind: "deny", text: "Couldn't reach the Asset Factory service. Check your connection and try again." });
      return null;
    } finally {
      setBusy(false);
    }
  }, [showToast]);

  useEffect(() => {
    eventsRef.current = loadEvents();
    void call({ events: eventsRef.current });
  }, [call]);

  const signIn = useCallback(async (p: PersonaId) => {
    await call({ signInAs: p });
    setWorkspaceId(null);
    setStudioTarget("draft");
  }, [call]);

  const act = useCallback<FactoryState["act"]>(async (action, opts) => {
    const data = await call({ action, signInAs: opts?.as });
    if (!data) return false;
    if (!data.ok) {
      showToast({ kind: "deny", text: data.reason ?? "Not allowed." });
      return false;
    }
    if (opts?.success && !opts.quiet) showToast({ kind: "ok", text: opts.success });
    return true;
  }, [call, showToast]);

  const reset = useCallback(async () => {
    eventsRef.current = [];
    await call({ events: [], signInAs: "customer" });
    setDraft({ blueprintId: null, componentIds: [] });
    setStudioTarget("draft");
    setWorkspaceId(null);
    showToast({ kind: "ok", text: "Demo reset to the starting state." });
  }, [call, showToast]);

  const setTab = useCallback((t: Tab) => navigate({ page: t }), [navigate]);

  const openAsset = useCallback((idOrSlug: string | null, tab: AssetTab = "overview") => {
    if (!idOrSlug) return;
    const a = viewRef.current?.assets.find((x) => x.id === idOrSlug || x.slug === idOrSlug);
    navigate({ page: "asset", slug: a?.slug ?? idOrSlug, tab });
  }, [navigate]);

  const openWorkspace = useCallback((id: string | null) => setWorkspaceId(id), []);

  const fetchAsset = useCallback(async (idOrSlug: string) => {
    try {
      const res = await fetch("/api/asset-factory/asset", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ events: eventsRef.current, assetId: idOrSlug }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { ok: boolean; detail?: AssetDetail };
      return data.detail ?? null;
    } catch {
      return null;
    }
  }, []);

  const runAsset = useCallback<FactoryState["runAsset"]>(async (idOrSlug, input) => {
    try {
      const res = await fetch("/api/asset-factory/run", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ events: eventsRef.current, assetId: idOrSlug, input }),
      });
      const data = (await res.json()) as { ok: boolean; result?: RunResult; reason?: string };
      if (!data.ok || !data.result) return { ok: false, reason: data.reason ?? "Run failed." };
      return { ok: true, result: data.result };
    } catch {
      return { ok: false, reason: "Couldn't reach the runner." };
    }
  }, []);

  const tab: Tab = route.page === "asset" || route.page === "inherit" ? "market" : route.page;

  const value = useMemo<FactoryState>(() => ({
    view, events, persona: view?.actor.persona ?? "customer", busy, route, navigate, tab, setTab,
    toast, showToast, dismissToast: () => setToast(null), signIn, act, reset,
    openAsset, workspaceId, openWorkspace,
    draft, setDraft, studioTarget, setStudioTarget, query, setQuery, paletteOpen, setPaletteOpen,
    fetchAsset, runAsset,
  }), [view, events, busy, route, navigate, tab, setTab, toast, showToast, signIn, act, reset, openAsset, workspaceId, openWorkspace, draft, studioTarget, query, paletteOpen, fetchAsset, runAsset]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFactory(): FactoryState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFactory outside FactoryProvider");
  return v;
}
