"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type Ref } from "react";
import { fmtDate } from "@/lib/google-ai/dates";
import { neighbors, path as shortestPath, RELATION_LABEL, type Neighbor } from "@/lib/google-ai/engine/graph";
import { bounds, createSimulation, fitView, zoomAt, type Positions, type View } from "@/lib/google-ai/engine/graph-layout";
import { search } from "@/lib/google-ai/engine/search";
import { ENTITIES, ENTITY_BY_ID, LAYERS, LAYER_BY_ID, RELATIONSHIPS, announcementsFor, providerName } from "@/lib/google-ai/kb";
import type { Entity, LayerId, Relationship } from "@/lib/google-ai/types";
import { Callout, Cites, Empty, Ev, PageHead, Sec, Status } from "../ui";
import "./specialist.css";

/** One colour per layer, fixed, so a layer keeps its colour whatever is filtered. The two greens go to the largest and the smallest layer. */
const LAYER_COLOR: Record<LayerId, string> = {
  infrastructure: "var(--s1)",
  research: "var(--s7)",
  models: "var(--s3)",
  platform: "var(--s4)",
  agents: "var(--s5)",
  enterprise: "var(--s2)",
  consumer: "var(--s6)",
  ecosystem: "var(--s0)",
};
const MAX_K = 4;
const MAX_PATH = 12;

interface GNode {
  id: string;
  e: Entity;
  /** Number of recorded relationships. */
  degree: number;
  /** Radius in layout units. */
  r: number;
  /** g = Google, in a layer; c = Google, no layer (the company itself); o = another provider. */
  kind: "g" | "c" | "o";
  group: string;
  color?: string;
  /** Short label drawn on the canvas. */
  label: string;
  /** Provider and layer, for tooltips and accessible names. */
  where: string;
}

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Every entity with at least one relationship becomes a node; every relationship between known entities an edge. */
function buildGraph() {
  const edges = RELATIONSHIPS.filter((r) => r.from !== r.to && ENTITY_BY_ID[r.from] && ENTITY_BY_ID[r.to]);
  const degree: Record<string, number> = {};
  for (const r of edges) {
    degree[r.from] = (degree[r.from] ?? 0) + 1;
    degree[r.to] = (degree[r.to] ?? 0) + 1;
  }
  const isGoogle = (e: Entity) => e.providerId === "google";
  // Layout order: Google layers from the bottom of the stack up, then other providers. Neighbouring layers start side by side.
  const rank = (e: Entity) => (isGoogle(e) ? (e.layer ? LAYER_BY_ID[e.layer].n : 0) : 100);
  const nodes: GNode[] = ENTITIES.filter((e) => degree[e.id])
    .sort((a, b) => rank(a) - rank(b) || a.providerId.localeCompare(b.providerId) || a.id.localeCompare(b.id))
    .map((e) => {
      const kind = isGoogle(e) ? (e.layer ? "g" : "c") : "o";
      const provider = providerName(e.providerId);
      return {
        id: e.id,
        e,
        degree: degree[e.id],
        r: Math.round((4 + 2.2 * Math.sqrt(degree[e.id])) * 10) / 10,
        kind,
        group: isGoogle(e) ? e.layer ?? "google" : `provider:${e.providerId}`,
        color: e.layer && isGoogle(e) ? LAYER_COLOR[e.layer] : undefined,
        label: clip(e.name, 26),
        where: kind === "g" && e.layer ? `${provider} · ${LAYER_BY_ID[e.layer].name}` : e.kind === "provider" ? "Company" : provider,
      };
    });
  const byId: Record<string, GNode> = {};
  for (const n of nodes) byId[n.id] = n;
  const byDegree = [...nodes].sort((a, b) => b.degree - a.degree || a.e.name.localeCompare(b.e.name));
  const byName = [...nodes].sort((a, b) => a.e.name.localeCompare(b.e.name));
  // Google entities with a direct link to another provider's entity: shown alongside competitors.
  const besideOthers = new Set<string>();
  for (const r of edges) {
    if (byId[r.from].kind === "o" && byId[r.to].kind !== "o") besideOthers.add(r.to);
    if (byId[r.to].kind === "o" && byId[r.from].kind !== "o") besideOthers.add(r.from);
  }
  const layers = LAYERS.filter((l) => nodes.some((n) => n.kind === "g" && n.e.layer === l.id));
  return { nodes, edges, byId, byDegree, byName, besideOthers, layers, hasOthers: nodes.some((n) => n.kind === "o"), hasCompany: nodes.some((n) => n.kind === "c") };
}
const GRAPH = buildGraph();

type ShowId = "all" | "google" | "others" | LayerId;

/** Highlight state: the nodes and edges that stay lit while everything else dims. */
interface Mark {
  nodes: Set<string>;
  edges: Set<string>;
  path: boolean;
}

interface Step {
  from: string;
  to: string;
  phrase: string;
  edge: Relationship;
}

/** The relationship that joins each pair along a path, phrased in the direction of travel. */
function describe(ids: string[]): Step[] {
  const steps: Step[] = [];
  for (let i = 0; i + 1 < ids.length; i++) {
    const a = ids[i];
    const b = ids[i + 1];
    const edge = GRAPH.edges.find((r) => r.from === a && r.to === b) ?? GRAPH.edges.find((r) => r.from === b && r.to === a);
    if (!edge) continue;
    steps.push({ from: a, to: b, edge, phrase: RELATION_LABEL[edge.type][edge.from === a ? 0 : 1] });
  }
  return steps;
}

// The layout is the same every time, so it is kept for the rest of the visit once computed.
let layoutCache: Positions | null = null;

export default function Graph() {
  const sp = useSearchParams();
  const raw = sp.get("focus");
  const [selected, setSelected] = useState<string | null>(() => (raw && GRAPH.byId[raw] ? raw : null));
  // The address mirrors the selection. `pending` is a value this view has written and not yet seen come back,
  // so a late echo of an older write never overrides a newer choice.
  const [seen, setSeen] = useState(raw);
  const [pending, setPending] = useState<string | null | undefined>(undefined);
  if (raw !== seen) {
    setSeen(raw);
    if (pending === undefined) setSelected(raw && GRAPH.byId[raw] ? raw : null);
    else if ((raw ?? null) === pending) setPending(undefined);
  }
  const [offGraph] = useState(() => (raw && !GRAPH.byId[raw] && ENTITY_BY_ID[raw] ? raw : null));

  const [show, setShow] = useState<ShowId>("all");
  const [pathOpen, setPathOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [positions, setPositions] = useState<Positions | null>(() => layoutCache);
  const canvas = useRef<CanvasHandle>(null);

  // Lay the graph out after mount, a few ticks per frame so the page stays responsive.
  useEffect(() => {
    if (layoutCache || !GRAPH.nodes.length) return;
    const sim = createSimulation(GRAPH.nodes.map((n) => ({ id: n.id, group: n.group, r: n.r })), GRAPH.edges);
    let raf = 0;
    const run = () => {
      if (sim.step(30)) {
        layoutCache = sim.positions();
        setPositions(layoutCache);
      } else raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selected) url.searchParams.set("focus", selected);
      else url.searchParams.delete("focus");
      const next = url.pathname + url.search + url.hash;
      if (next !== window.location.pathname + window.location.search + window.location.hash) window.history.replaceState(null, "", next);
    } catch {
      /* history API unavailable: the view still works, the address just is not updated */
    }
  }, [selected]);

  const choose = useCallback(
    (id: string | null) => {
      if (id === selected) return;
      setSelected(id);
      setPending(id);
    },
    [selected],
  );

  const visible = useMemo(() => {
    const keep = (n: GNode) => (show === "all" ? true : show === "google" ? n.kind !== "o" : show === "others" ? n.kind === "o" || GRAPH.besideOthers.has(n.id) : n.kind === "g" && n.e.layer === show);
    const nodes = GRAPH.nodes.filter(keep);
    const ids = new Set(nodes.map((n) => n.id));
    const edges = GRAPH.edges.filter((r) => ids.has(r.from) && ids.has(r.to) && (show !== "others" || GRAPH.byId[r.from].kind === "o" || GRAPH.byId[r.to].kind === "o"));
    return { nodes, ids, edges };
  }, [show]);

  const node = selected ? GRAPH.byId[selected] : undefined;
  const nb = useMemo(() => (selected ? neighbors(selected, undefined, GRAPH.edges).sort((a, b) => a.phrase.localeCompare(b.phrase) || a.other.name.localeCompare(b.other.name)) : []), [selected]);

  const route = useMemo(() => {
    if (!from || !to || from === to) return null;
    const ids = shortestPath(from, to, GRAPH.edges, MAX_PATH);
    return ids ? { ids, steps: describe(ids) } : { ids: null, steps: [] as Step[] };
  }, [from, to]);

  const mark = useMemo<Mark | null>(() => {
    if (route?.ids) return { nodes: new Set(route.ids), edges: new Set(route.steps.map((s) => s.edge.id)), path: true };
    if (selected) return { nodes: new Set([selected, ...nb.map((n) => n.other.id)]), edges: new Set(nb.map((n) => n.edge.id)), path: false };
    return null;
  }, [route, selected, nb]);

  /** Select an entity and bring it to the middle of the canvas. */
  const hop = (id: string) => {
    if (!GRAPH.byId[id]) return;
    if (!visible.ids.has(id)) setShow("all");
    choose(id);
    canvas.current?.centreOn(id);
  };

  const setEnds = (a: string, b: string) => {
    setFrom(a);
    setTo(b);
    if (!a || !b || a === b) return;
    const ids = shortestPath(a, b, GRAPH.edges, MAX_PATH);
    if (!ids) return;
    if (ids.some((id) => !visible.ids.has(id))) setShow("all");
    canvas.current?.frame(ids);
  };

  // Escape clears the path first if one is shown, otherwise the selection.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const el = e.target instanceof Element ? e.target : null;
      if (el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.closest(".gai-cite, .gai-ask"))) return;
      if (from && to) {
        setFrom("");
        setTo("");
      } else choose(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [from, to, choose]);

  if (!GRAPH.nodes.length) {
    return (
      <>
        <PageHead icon="🕸️" title="Everything, connected" />
        <Empty title="No relationships recorded">The graph is drawn from the relationships between entities in the knowledge base. None is recorded yet, so there is nothing to connect.</Empty>
      </>
    );
  }

  return (
    <>
      <PageHead icon="🕸️" title="Everything, connected" lede={`${count(GRAPH.nodes.length, "product, model or company", "products, models and companies")} and the ${count(GRAPH.edges.length, "recorded relationship", "recorded relationships")} between them. Pick one, then move to the next.`} />

      {offGraph && (
        <div style={{ marginBottom: 14 }}>
          <Callout icon="ℹ️">
            <span translate="no">{ENTITY_BY_ID[offGraph].name}</span>
            {" has no recorded relationship, so it is not on the graph. "}
            <Link className="gai-link" href={`/google-ai/entity/${offGraph}`}>Open its page</Link>
          </Callout>
        </div>
      )}

      <div className="gai-sp-controls">
        <Finder onPick={hop} />
        <label className="gai-sp-ctl">
          <span>Show</span>
          <select
            className="gai-select"
            value={show}
            onChange={(e) => {
              setShow(e.target.value as ShowId);
              canvas.current?.reset();
            }}
          >
            <option value="all">Everything</option>
            <option value="google">Google only</option>
            {GRAPH.layers.map((l) => (
              <option key={l.id} value={l.id}>{`Layer ${l.n}: ${l.name}`}</option>
            ))}
            {GRAPH.hasOthers && <option value="others">Competitors and what they touch</option>}
          </select>
        </label>
        <button
          type="button"
          className="gai-btn"
          aria-expanded={pathOpen}
          aria-controls="gai-sp-path"
          onClick={() => {
            if (pathOpen) {
              setFrom("");
              setTo("");
            } else if (!from && selected) setFrom(selected);
            setPathOpen(!pathOpen);
          }}
        >
          {pathOpen ? "Close path" : "Find a path"}
        </button>
      </div>

      {pathOpen && (
        <div className="gai-sp-pathbox" id="gai-sp-path">
          <div className="gai-sp-pathrow">
            <label className="gai-sp-ctl">
              <span>From</span>
              <select className="gai-select" value={from} onChange={(e) => setEnds(e.target.value, to)}>
                <option value="">Choose…</option>
                {GRAPH.byName.map((n) => (
                  <option key={n.id} value={n.id} translate="no">{n.e.name}</option>
                ))}
              </select>
            </label>
            <label className="gai-sp-ctl">
              <span>To</span>
              <select className="gai-select" value={to} onChange={(e) => setEnds(from, e.target.value)}>
                <option value="">Choose…</option>
                {GRAPH.byName.map((n) => (
                  <option key={n.id} value={n.id} translate="no">{n.e.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div role="status">
            {!from || !to ? (
              <p className="gai-small gai-muted">Choose two entities to see the shortest chain of relationships between them.</p>
            ) : from === to ? (
              <p className="gai-small gai-muted">Choose two different entities.</p>
            ) : !route?.ids ? (
              <p className="gai-small">{`No chain of ${MAX_PATH} relationships or fewer joins these two.`}</p>
            ) : (
              <div className="gai-stack">
                <p className="gai-sp-route">
                  {route.ids.map((id, i) => (
                    <span key={id} className="gai-row">
                      {i > 0 && (
                        <>
                          <span className="arrow" aria-hidden>→</span>
                          <span className="rel">{route.steps[i - 1]?.phrase}</span>
                          <span className="arrow" aria-hidden>→</span>
                        </>
                      )}
                      <button type="button" className="gai-sp-hop" translate="no" onClick={() => hop(id)}>{GRAPH.byId[id].e.name}</button>
                    </span>
                  ))}
                </p>
                <div className="gai-row gai-small gai-muted">
                  <span>{`Shortest path: ${count(route.steps.length, "relationship", "relationships")}.`}</span>
                  <Cites ids={[...new Set(route.steps.flatMap((s) => s.edge.sourceIds))]} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="gai-sp-layout">
        <div className="gai-sp-stage">
          {positions ? (
            <Canvas ref={canvas} nodes={visible.nodes} edges={visible.edges} positions={positions} selected={selected} mark={mark} initialFocus={selected} onSelect={choose} />
          ) : (
            <div className="gai-sp-canvas">
              <div className="gai-sp-wait" role="status">{`Arranging ${GRAPH.nodes.length} entities…`}</div>
            </div>
          )}
          <div className="gai-sp-legend" aria-label="Legend">
            {GRAPH.layers.map((l) => (
              <span key={l.id}><i style={{ background: LAYER_COLOR[l.id] }} />{l.short}</span>
            ))}
            {GRAPH.hasCompany && <span><i style={{ background: "var(--ink)" }} />Google, the company</span>}
            {GRAPH.hasOthers && <span><i className="o" />Other providers</span>}
          </div>
          <p className="gai-small gai-muted">
            {show === "all"
              ? "A bigger circle has more relationships. A dashed line is a competitive relationship. Drag to move, scroll or pinch to zoom."
              : show === "others"
                ? `Showing ${visible.nodes.length} of ${GRAPH.nodes.length} entities: other providers, and the Google entities they are linked to.`
                : `Showing ${visible.nodes.length} of ${GRAPH.nodes.length} entities, and only the relationships among them.`}
          </p>
        </div>

        <aside className="gai-sp-panel" aria-label="Selected entity">
          {node ? (
            <Panel node={node} nb={nb} onHop={hop} onClear={() => choose(null)} />
          ) : (
            <>
              <h2 className="gai-h3">Pick a circle</h2>
              <p className="gai-small gai-muted">You will see what it is, what it connects to in plain words, and its latest development. Each connection is a link to the next thing.</p>
              <p className="gai-small gai-muted">With the keyboard: Tab into the graph, move with the arrow keys, press Enter to select and Escape to clear.</p>
            </>
          )}
        </aside>
      </div>

      {node ? (
        <Sec title="Relationships in words" sub={`The ${count(nb.length, "recorded relationship", "recorded relationships")} of the selected entity, each with its evidence label and sources. This list says the same as the picture.`}>
          {nb.length ? (
            <ul className="gai-claims">
              {nb.map((n) => (
                <li key={n.edge.id}>
                  <span>
                    <b translate="no">{node.e.name}</b>
                    {` ${n.phrase} `}
                    <button type="button" className="gai-sp-hop" translate="no" onClick={() => hop(n.other.id)}>{n.other.name}</button>
                  </span>
                  {(n.edge.note || n.edge.conditions) && <span className="gai-small gai-muted">{[n.edge.note, n.edge.conditions].filter(Boolean).join(" ")}</span>}
                  <span className="gai-claim-meta">
                    <Ev label={n.edge.label} />
                    <Cites ids={n.edge.sourceIds} />
                    {n.edge.confidence !== "high" && <span className="gai-muted gai-small">{`${n.edge.confidence} confidence`}</span>}
                    {n.edge.effectiveFrom && <span className="gai-muted gai-small">{`from ${fmtDate(n.edge.effectiveFrom)}`}</span>}
                    {n.edge.effectiveTo && <span className="gai-muted gai-small">{`until ${fmtDate(n.edge.effectiveTo)}`}</span>}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="No relationship recorded">Nothing is recorded for this entity yet.</Empty>
          )}
        </Sec>
      ) : (
        <Sec title="Most connected" sub={`The ${Math.min(15, GRAPH.byDegree.length)} entities with the most recorded relationships. Pick one to start, with or without the picture.`}>
          <ol className="gai-sp-top">
            {GRAPH.byDegree.slice(0, 15).map((n) => (
              <li key={n.id}>
                <button type="button" className="gai-sp-hop" translate="no" onClick={() => hop(n.id)}>{n.e.name}</button>
                <span className="n">{count(n.degree, "relationship", "relationships")}</span>
              </li>
            ))}
          </ol>
        </Sec>
      )}
    </>
  );
}

function Panel({ node, nb, onHop, onClear }: { node: GNode; nb: Neighbor[]; onHop: (id: string) => void; onClear: () => void }) {
  const e = node.e;
  const recent = announcementsFor(e.id)[0];
  return (
    <>
      <div className="gai-row">
        <Status status={e.status} />
        <span className="gai-small gai-muted" translate={node.kind === "g" ? undefined : "no"}>{node.kind === "g" && e.layer ? LAYER_BY_ID[e.layer].name : providerName(e.providerId)}</span>
      </div>
      <div>
        <h2 className="gai-h2" translate="no">{e.name}</h2>
        <p className="gai-small gai-muted" translate="no">{providerName(e.providerId)}</p>
      </div>
      <p>
        {e.summary} <Cites ids={e.sourceIds} align="right" />
      </p>
      <div>
        <div className="gai-sp-sub">{count(nb.length, "relationship", "relationships")}</div>
        {nb.length ? (
          <ul className="gai-sp-rels">
            {nb.map((n) => (
              <li key={n.edge.id}>
                <span className="rel">{`${n.phrase} `}</span>
                <button type="button" className="gai-sp-hop" translate="no" onClick={() => onHop(n.other.id)}>{n.other.name}</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="gai-small gai-muted">No relationship recorded.</p>
        )}
      </div>
      <div>
        <div className="gai-sp-sub">Latest development</div>
        {recent ? (
          <p className="gai-small">
            <span className="gai-muted">{`${fmtDate(recent.date)} · `}</span>
            <Link className="gai-link" href={`/google-ai/latest/${recent.id}`}>{recent.title}</Link>
          </p>
        ) : (
          <p className="gai-small gai-muted">No development recorded for it.</p>
        )}
      </div>
      <div className="gai-row">
        <Link className="gai-btn primary" href={`/google-ai/entity/${e.id}`}>Open full page</Link>
        <button type="button" className="gai-btn" onClick={onClear}>Clear</button>
      </div>
    </>
  );
}

/** Search box that jumps to a node. Only entities that are on the graph are offered. */
function Finder({ onPick }: { onPick: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const active = open && q.trim().length >= 2;
  const hits = useMemo(() => (q.trim().length >= 2 ? search(q, { kinds: ["entity"], limit: 40 }).filter((h) => GRAPH.byId[h.id]).slice(0, 8) : []), [q]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const go = (i: number) => {
    const hit = hits[i];
    if (!hit) return;
    onPick(hit.id);
    setOpen(false);
    setQ("");
  };

  return (
    <div className="gai-sp-find" ref={box}>
      <label className="gai-sp-ctl">
        <span>Find</span>
        <input
          className="gai-input"
          type="search"
          value={q}
          placeholder="Product, model or company"
          role="combobox"
          aria-expanded={active}
          aria-controls="gai-sp-find-list"
          aria-autocomplete="list"
          aria-activedescendant={active && hits[at] ? `gai-sp-find-${at}` : undefined}
          onChange={(e) => {
            setQ(e.target.value);
            setAt(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setAt((i) => Math.min(i + 1, Math.max(hits.length - 1, 0)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setAt((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              go(at);
            } else if (e.key === "Escape") setOpen(false);
          }}
        />
      </label>
      {active && (
        <div className="gai-sp-pop" id="gai-sp-find-list" role="listbox" aria-label="Matching entities">
          {hits.map((h, i) => (
            <button key={h.id} type="button" id={`gai-sp-find-${i}`} role="option" aria-selected={at === i} data-on={at === i ? 1 : 0} tabIndex={-1} onClick={() => go(i)} onMouseEnter={() => setAt(i)}>
              <span className="t" translate="no">{h.title}</span>
              {h.via && <span className="v">{h.via}</span>}
              <span className="s">{count(GRAPH.byId[h.id].degree, "relationship", "relationships")}</span>
            </button>
          ))}
          {!hits.length && <div className="gai-small gai-muted" style={{ padding: "8px 10px" }}>Nothing on the graph matches. Entities without a recorded relationship are not drawn.</div>}
        </div>
      )}
    </div>
  );
}

// ───────────────────────── canvas ─────────────────────────

interface CanvasHandle {
  /** Bring a node to the middle, zooming in if the view is far out. */
  centreOn: (id: string) => void;
  /** Fit a set of nodes in view. */
  frame: (ids: string[]) => void;
  /** Go back to the view that fits everything shown. */
  reset: () => void;
}

/** Circles shrink more slowly than the layout when zooming out, so they stay visible. */
const nodeScale = (k: number) => Math.max(0.7, Math.min(2.4, 1 / Math.sqrt(k)));
/** How many of the most connected nodes may carry a label at a zoom level. */
const labelBudget = (k: number) => (k < 0.3 ? 8 : k < 0.5 ? 14 : k < 0.8 ? 26 : k < 1.2 ? 50 : k < 1.8 ? 110 : Infinity);

/**
 * Which nodes get a label: highlighted nodes always; otherwise the most connected first, skipping any label
 * that would sit on top of one already placed. More labels fit as the zoom grows.
 */
function pickLabels(nodes: GNode[], positions: Positions, k: number, forced: Set<string> | null): string[] {
  const boxes: [number, number, number, number][] = [];
  const out: string[] = [];
  const ns = nodeScale(k);
  const place = (n: GNode, force: boolean) => {
    const p = positions[n.id];
    if (!p) return;
    const w = (n.label.length * 6.6 + 10) / k;
    const top = p.y + n.r * ns + 1 / k;
    const box: [number, number, number, number] = [p.x - w / 2, top, p.x + w / 2, top + 16 / k];
    if (!force && boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) return;
    boxes.push(box);
    out.push(n.id);
  };
  const ranked = [...nodes].sort((a, b) => b.degree - a.degree || a.id.localeCompare(b.id));
  if (forced) for (const n of ranked) if (forced.has(n.id)) place(n, true);
  const budget = labelBudget(k);
  for (const n of budget === Infinity ? ranked : ranked.slice(0, budget)) if (!forced?.has(n.id)) place(n, false);
  return out;
}

const ARROWS: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

const idOf = (target: EventTarget | null) => (target instanceof Element ? target.closest<SVGGElement>("[data-id]")?.dataset.id ?? null : null);

interface CanvasProps {
  nodes: GNode[];
  edges: Relationship[];
  positions: Positions;
  selected: string | null;
  mark: Mark | null;
  /** Node to open on, from a shared link. */
  initialFocus: string | null;
  onSelect: (id: string | null) => void;
  ref?: Ref<CanvasHandle>;
}

function Canvas({ nodes, edges, positions, selected, mark, initialFocus, onSelect, ref }: CanvasProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  /** The view the reader has moved to; null means "fit everything shown". */
  const [user, setUser] = useState<View | null>(null);
  const [roving, setRoving] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const focus0 = useRef(initialFocus);
  const live = useRef<View | null>(null);
  const anim = useRef(0);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef({ moved: false, x: 0, y: 0 });

  const fit = useMemo(() => (size ? fitView(bounds(positions, nodes.map((n) => n.id)), size.w, size.h) : null), [size, positions, nodes]);
  const view = user ?? fit;
  const minK = fit ? Math.min(0.2, fit.k * 0.7) : 0.1;

  useEffect(() => {
    live.current = view;
  }, [view]);
  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w < 10 || h < 10) return;
      setSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
      const id = focus0.current;
      focus0.current = null;
      const p = id ? positions[id] : undefined;
      if (p) setUser({ k: 1, x: w / 2 - p.x, y: h / 2 - p.y });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [positions]);

  /** Apply a change to the current view. The updater is pure, so rapid wheel or pointer events never lose a step. */
  const update = useCallback((fn: (v: View) => View) => {
    const base = live.current;
    if (!base) return;
    cancelAnimationFrame(anim.current);
    setUser((prev) => fn(prev ?? base));
  }, []);

  const animateTo = useCallback((target: View) => {
    cancelAnimationFrame(anim.current);
    const start = live.current;
    if (!start || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setUser(target);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 280);
      const e = 1 - Math.pow(1 - t, 3);
      setUser({ k: start.k + (target.k - start.k) * e, x: start.x + (target.x - start.x) * e, y: start.y + (target.y - start.y) * e });
      if (t < 1) anim.current = requestAnimationFrame(tick);
    };
    anim.current = requestAnimationFrame(tick);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      centreOn(id) {
        const p = positions[id];
        if (!p || !size) return;
        const k = Math.min(MAX_K, Math.max(live.current?.k ?? 1, 0.9));
        animateTo({ k, x: size.w / 2 - p.x * k, y: size.h / 2 - p.y * k });
      },
      frame(ids) {
        if (size) animateTo(fitView(bounds(positions, ids), size.w, size.h, 70, 1.4));
      },
      reset() {
        cancelAnimationFrame(anim.current);
        setUser(null);
      },
    }),
    [positions, size, animateTo],
  );

  // Wheel zoom needs a non-passive listener so the page does not scroll underneath.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.012 : e.deltaMode === 1 ? 0.05 : 0.0016));
      update((v) => zoomAt(v, factor, e.clientX - rect.left, e.clientY - rect.top, minK, MAX_K));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [update, minK]);

  const zoomBy = (factor: number) => {
    if (size) update((v) => zoomAt(v, factor, size.w / 2, size.h / 2, minK, MAX_K));
  };

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    cancelAnimationFrame(anim.current);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) drag.current = { moved: false, x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    if (pointers.current.size === 1) {
      // A press that barely moves is a click on a node, not a drag.
      if (!drag.current.moved) {
        if (Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) < 4) return;
        drag.current.moved = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* capture is a convenience for drags that leave the canvas */
        }
      }
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      update((v) => ({ k: v.k, x: v.x + dx, y: v.y + dy }));
      return;
    }
    // Two fingers: zoom about their midpoint and follow it.
    const other = [...pointers.current.entries()].find(([pid]) => pid !== e.pointerId)?.[1];
    if (!other) return;
    const d0 = Math.hypot(p.x - other.x, p.y - other.y);
    const m0x = (p.x + other.x) / 2;
    const m0y = (p.y + other.y) / 2;
    p.x = e.clientX;
    p.y = e.clientY;
    const d1 = Math.hypot(p.x - other.x, p.y - other.y);
    const mx = (p.x + other.x) / 2;
    const my = (p.y + other.y) / 2;
    const rect = e.currentTarget.getBoundingClientRect();
    const factor = d0 > 0 ? d1 / d0 : 1;
    drag.current.moved = true;
    update((v) => {
      const z = zoomAt(v, factor, mx - rect.left, my - rect.top, minK, MAX_K);
      return { k: z.k, x: z.x + (mx - m0x), y: z.y + (my - m0y) };
    });
  };
  const onPointerEnd = (e: ReactPointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const onClick = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (drag.current.moved) return;
    onSelect(idOf(e.target));
  };

  const focusNode = (id: string) => {
    svg.current?.querySelector<SVGGElement>(`[data-id="${CSS.escape(id)}"]`)?.focus({ preventScroll: true });
  };
  /** The nearest node in a direction, preferring ones that lie close to that direction. */
  const nearest = (id: string, [dx, dy]: [number, number]) => {
    const p = positions[id];
    if (!p) return null;
    let best: string | null = null;
    let bestCost = Infinity;
    for (const n of nodes) {
      const q = positions[n.id];
      if (!q || n.id === id) continue;
      const along = (q.x - p.x) * dx + (q.y - p.y) * dy;
      const across = Math.abs((q.x - p.x) * dy - (q.y - p.y) * dx);
      if (along <= 0.5 || across > along * 2.5) continue;
      const cost = along + across * 2;
      if (cost < bestCost) {
        bestCost = cost;
        best = n.id;
      }
    }
    return best;
  };
  const onKeyDown = (e: ReactKeyboardEvent<SVGSVGElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "+" || e.key === "=") return zoomBy(1.4);
    if (e.key === "-" || e.key === "_") return zoomBy(1 / 1.4);
    if (e.key === "0") return setUser(null);
    const id = idOf(e.target);
    if (!id) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
      return;
    }
    const dir = ARROWS[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = nearest(id, dir);
    if (next) focusNode(next);
  };
  const onFocus = (e: React.FocusEvent<SVGSVGElement>) => {
    const id = idOf(e.target);
    if (!id) return;
    setRoving(id);
    if (!(e.target instanceof Element) || !e.target.matches(":focus-visible")) return;
    setTip(id);
    // Keyboard focus on a node outside the frame brings it into view.
    const v = live.current;
    const p = positions[id];
    if (!v || !p || !size) return;
    const sx = p.x * v.k + v.x;
    const sy = p.y * v.k + v.y;
    if (sx < 40 || sx > size.w - 40 || sy < 40 || sy > size.h - 40) animateTo({ k: v.k, x: size.w / 2 - p.x * v.k, y: size.h / 2 - p.y * v.k });
  };

  // One tab stop for the whole graph: the last node focused, else the selection, else the most connected node.
  const tabId = useMemo(() => {
    const has = (id: string | null) => id != null && nodes.some((n) => n.id === id);
    if (has(roving)) return roving;
    if (has(selected)) return selected;
    return nodes.reduce<GNode | null>((best, n) => (!best || n.degree > best.degree ? n : best), null)?.id ?? null;
  }, [nodes, roving, selected]);

  // Labels are chosen per zoom step, not per frame, so they do not flicker while panning.
  const zoomStep = view ? Math.round(Math.log(view.k) / Math.log(1.25)) : 0;
  const labelIds = useMemo(() => pickLabels(nodes, positions, Math.pow(1.25, zoomStep), mark?.nodes ?? null), [nodes, positions, zoomStep, mark]);

  const ns = view ? nodeScale(view.k) : 1;
  const tipNode = tip ? GRAPH.byId[tip] : undefined;
  const tipAt = tipNode && view && positions[tipNode.id] ? { x: positions[tipNode.id].x * view.k + view.x, y: positions[tipNode.id].y * view.k + view.y - tipNode.r * view.k * ns - 8 } : null;

  return (
    <div className="gai-sp-canvas" ref={wrap}>
      <svg
        ref={svg}
        className="gai-chart gai-sp-svg"
        viewBox={`0 0 ${size?.w ?? 900} ${size?.h ?? 560}`}
        role="group"
        aria-label={`Knowledge graph: ${count(nodes.length, "entity", "entities")} joined by ${count(edges.length, "relationship", "relationships")}. Arrow keys move between entities, Enter selects one, plus and minus zoom. The same information is listed in words below the graph.`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={() => setTip(null)}
        onPointerOver={(e) => {
          if (e.pointerType === "mouse" && !pointers.current.size) setTip(idOf(e.target));
        }}
        onPointerLeave={() => setTip(null)}
      >
        {view && size && (
          <>
            <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`} style={{ "--gai-sp-k": view.k, "--gai-sp-ns": ns } as CSSProperties}>
              <Scene nodes={nodes} edges={edges} positions={positions} selected={selected} mark={mark} tabId={tabId} />
            </g>
            <g aria-hidden>
              {labelIds.map((id) => {
                const n = GRAPH.byId[id];
                const p = positions[id];
                if (!n || !p) return null;
                const x = p.x * view.k + view.x;
                const y = p.y * view.k + view.y + n.r * view.k * ns + 13;
                if (x < -90 || x > size.w + 90 || y < -10 || y > size.h + 20) return null;
                const lit = mark ? mark.nodes.has(id) : false;
                return (
                  <text key={id} className="gai-sp-lbl" x={Math.round(x * 10) / 10} y={Math.round(y * 10) / 10} data-on={id === selected ? 2 : lit ? 1 : 0} data-dim={mark && !lit ? 1 : 0}>
                    {n.label}
                  </text>
                );
              })}
            </g>
          </>
        )}
      </svg>
      {!nodes.length && <div className="gai-sp-wait">Nothing in this view has a recorded relationship.</div>}
      {tipNode && tipAt && size && (
        <div className="gai-tip gai-sp-tip" role="presentation" style={{ left: Math.max(90, Math.min(size.w - 90, tipAt.x)), top: Math.max(44, tipAt.y) }}>
          <b translate="no">{tipNode.e.name}</b>
          {`${tipNode.where} · ${count(tipNode.degree, "relationship", "relationships")}`}
        </div>
      )}
      <div className="gai-sp-zoom">
        <button type="button" className="gai-btn" aria-label="Zoom in" onClick={() => zoomBy(1.4)}>+</button>
        <button type="button" className="gai-btn" aria-label="Zoom out" onClick={() => zoomBy(1 / 1.4)}>−</button>
        <button type="button" className="gai-btn" onClick={() => animateTo(fit ?? { k: 1, x: 0, y: 0 })}>Fit</button>
      </div>
    </div>
  );
}

/** Nodes and edges in layout coordinates. Memoised: panning and zooming only change the transform around it. */
const Scene = memo(function Scene({ nodes, edges, positions, selected, mark, tabId }: { nodes: GNode[]; edges: Relationship[]; positions: Positions; selected: string | null; mark: Mark | null; tabId: string | null }) {
  return (
    <>
      <g aria-hidden>
        {edges.map((r) => {
          const a = positions[r.from];
          const b = positions[r.to];
          if (!a || !b) return null;
          const on = mark?.edges.has(r.id) ?? false;
          return <line key={r.id} className="gai-sp-edge" x1={a.x} y1={a.y} x2={b.x} y2={b.y} data-rival={r.type === "competes-with" ? 1 : 0} data-on={on ? (mark?.path ? 2 : 1) : 0} data-dim={mark && !on ? 1 : 0} />;
        })}
      </g>
      <g>
        {nodes.map((n) => {
          const p = positions[n.id];
          if (!p) return null;
          const lit = mark?.nodes.has(n.id) ?? false;
          return (
            <g
              key={n.id}
              className="gai-sp-node"
              data-id={n.id}
              data-kind={n.kind}
              data-on={n.id === selected ? 2 : lit ? (mark?.path ? 3 : 1) : 0}
              data-dim={mark && !lit ? 1 : 0}
              transform={`translate(${p.x} ${p.y})`}
              role="button"
              tabIndex={n.id === tabId ? 0 : -1}
              aria-pressed={n.id === selected}
              aria-label={`${n.e.name}, ${n.where}, ${count(n.degree, "relationship", "relationships")}`}
            >
              <circle className="gai-sp-hit" r={11} />
              <circle className="gai-sp-dot" r={n.r} style={n.color ? { fill: n.color } : undefined} />
            </g>
          );
        })}
      </g>
    </>
  );
});
