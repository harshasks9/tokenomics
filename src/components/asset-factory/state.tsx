"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Action, Event, PersonaId } from "@/lib/asset-factory/types";
import type { PlatformView } from "@/lib/asset-factory/views";

export type Tab = "home" | "market" | "studio" | "workspaces" | "journey" | "insights" | "gtm" | "assets" | "collections";

export interface Toast { kind: "ok" | "deny"; text: string }

export interface StudioDraft { blueprintId: string | null; componentIds: string[] }

interface FactoryState {
  view: PlatformView | null;
  events: Event[];
  persona: PersonaId;
  busy: boolean;
  tab: Tab;
  setTab: (t: Tab) => void;
  toast: Toast | null;
  dismissToast: () => void;
  /** Switch the simulated sign-in. The server sets the identity cookie. */
  signIn: (p: PersonaId) => Promise<void>;
  /** Send an action to the server as the signed-in persona (optionally switching first). */
  act: (action: Action, opts?: { as?: PersonaId; success?: string; quiet?: boolean }) => Promise<boolean>;
  reset: () => Promise<void>;
  assetId: string | null;
  openAsset: (id: string | null) => void;
  workspaceId: string | null;
  openWorkspace: (id: string | null) => void;
  draft: StudioDraft;
  setDraft: (d: StudioDraft) => void;
  studioTarget: string; // "draft" | workspace id
  setStudioTarget: (t: string) => void;
  query: string;
  setQuery: (q: string) => void;
}

const Ctx = createContext<FactoryState | null>(null);
const STORE = "af-events-v1";

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
    /* storage unavailable — demo still works for this session */
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
  const [tab, setTabState] = useState<Tab>("home");
  const [toast, setToast] = useState<Toast | null>(null);
  const [assetId, setAssetId] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [draft, setDraft] = useState<StudioDraft>({ blueprintId: null, componentIds: [] });
  const [studioTarget, setStudioTarget] = useState<string>("draft");
  const [query, setQuery] = useState("");
  const eventsRef = useRef<Event[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((t: Toast) => {
    setToast(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), t.kind === "deny" ? 9000 : 4000);
  }, []);

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
      if (data.view) setView(data.view);
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
    setAssetId(null);
    showToast({ kind: "ok", text: "Demo reset to the starting state." });
  }, [call, showToast]);

  const setTab = useCallback((t: Tab) => {
    setTabState(t);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const value = useMemo<FactoryState>(() => ({
    view, events, persona: view?.actor.persona ?? "customer", busy, tab, setTab,
    toast, dismissToast: () => setToast(null), signIn, act, reset,
    assetId, openAsset: setAssetId, workspaceId, openWorkspace: setWorkspaceId,
    draft, setDraft, studioTarget, setStudioTarget, query, setQuery,
  }), [view, events, busy, tab, setTab, toast, signIn, act, reset, assetId, workspaceId, draft, studioTarget, query]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFactory(): FactoryState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFactory outside FactoryProvider");
  return v;
}
