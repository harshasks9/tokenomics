"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { neighbors } from "@/lib/google-ai/engine/graph";
import { ENTITIES, ENTITY_BY_ID, LAYERS, announcementsFor } from "@/lib/google-ai/kb";
import { AGENT_FLOW } from "@/lib/google-ai/editorial";
import { fmtDate } from "@/lib/google-ai/dates";
import type { Entity, LayerId } from "@/lib/google-ai/types";
import { EgoGraph } from "../viz";
import { Cites, Empty, Sec, Seg, Status } from "../ui";

const TABS = [
  { id: "stack", label: "Full stack" },
  { id: "agents", label: "Agent architecture" },
  { id: "graph", label: "Knowledge graph" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const STAGES = [
  { id: "all", label: "All stages" },
  { id: "ga", label: "Generally available" },
  { id: "pre", label: "Preview or announced" },
] as const;

export default function Stack() {
  const [tab, setTab] = useState<Tab>("stack");
  const [sel, setSel] = useState<string | null>(null);
  const [stage, setStage] = useState<(typeof STAGES)[number]["id"]>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h === "agents" || h === "graph") queueMicrotask(() => setTab(h));
  }, []);

  const google = useMemo(() => ENTITIES.filter((e) => e.providerId === "google" && e.layer && e.kind !== "provider"), []);
  const related = useMemo(() => new Set(sel ? neighbors(sel).map((n) => n.other.id) : []), [sel]);
  const needle = q.trim().toLowerCase();
  const visible = (e: Entity) => {
    if (stage === "ga" && e.status !== "ga") return false;
    if (stage === "pre" && !["preview", "experimental", "announced"].includes(e.status)) return false;
    if (needle && !(e.name + " " + e.aliases.join(" ") + " " + (e.formerNames ?? []).map((f) => f.name).join(" ")).toLowerCase().includes(needle)) return false;
    return true;
  };
  const selected = sel ? ENTITY_BY_ID[sel] : null;

  return (
    <>
      <div className="gai-hero">
        <span className="gai-kicker">AI Stack</span>
        <h1 className="gai-h1">The full Google AI stack, connected</h1>
        <p className="gai-lede">Eight layers from silicon to distribution. Pick any component to see what it depends on and what it powers, then open its dossier. The layers are a way of reading the ecosystem, not an org chart: a product is listed once, in its home layer, and its links to other layers are shown as relationships.</p>
      </div>
      <Seg value={tab} onChange={setTab} options={TABS} label="View" />

      {tab === "stack" && (
        <div className="gai-split" style={{ marginTop: 14, gridTemplateColumns: "minmax(0, 2.2fr) minmax(0, 1fr)" }}>
          <div>
            <div className="gai-row" style={{ marginBottom: 10 }}>
              <Seg value={stage} onChange={setStage} options={STAGES} label="Stage" />
              <input className="gai-input" placeholder="Filter components" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter components by name" />
              {sel && <button type="button" className="gai-btn" onClick={() => setSel(null)}>Clear selection</button>}
            </div>
            {[...LAYERS].reverse().map((l) => (
              <LayerRow key={l.id} layer={l.id} entities={google.filter((e) => e.layer === l.id && visible(e))} total={google.filter((e) => e.layer === l.id).length} sel={sel} related={related} onPick={setSel} />
            ))}
            <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
              Dot colour is the stage: green generally available, amber preview or announced, violet research, red deprecated or retired. With a component selected, outlined components are directly related to it.
            </p>
          </div>
          <aside className="gai-drawer gai-card">
            {selected ? <Drawer e={selected} onPick={setSel} /> : (
              <div className="gai-stack">
                <h2 className="gai-h3">Select a component</h2>
                <p className="gai-small gai-muted">You will see what it is, its stage, what it connects to across layers and its most recent change — with a link to the full 18-part dossier.</p>
                <p className="gai-small"><b>{google.length}</b> Google components tracked across {LAYERS.length} layers.</p>
              </div>
            )}
          </aside>
        </div>
      )}

      {tab === "agents" && <AgentArchitecture />}

      {tab === "graph" && <GraphTab />}
    </>
  );
}

function LayerRow({ layer, entities, total, sel, related, onPick }: { layer: LayerId; entities: Entity[]; total: number; sel: string | null; related: Set<string>; onPick: (id: string) => void }) {
  const def = LAYERS.find((l) => l.id === layer)!;
  const groups = useMemo(() => {
    const g: Record<string, Entity[]> = {};
    for (const e of entities) (g[e.group ?? "Other"] ??= []).push(e);
    return Object.entries(g).sort((a, b) => b[1].length - a[1].length);
  }, [entities]);
  const touched = !sel || entities.some((e) => e.id === sel || related.has(e.id));
  return (
    <section className="gai-layer" id={layer} data-dim={touched ? 0 : 1} style={{ scrollMarginTop: 130 }}>
      <div>
        <span className="gai-layer-n">Layer {def.n}</span>
        <h2 className="gai-h3">{def.name}</h2>
        <p className="gai-small gai-muted">{def.blurb}</p>
      </div>
      <div className="gai-layer-groups">
        {groups.length === 0 && <p className="gai-small gai-muted">{total ? "Nothing in this layer matches the filter." : "Nothing recorded in this layer yet."}</p>}
        {groups.map(([name, list]) => (
          <div key={name}>
            <div className="gai-group-name">{name}</div>
            <div className="gai-chipset">
              {list.map((e) => (
                <button key={e.id} type="button" className="gai-node" data-on={sel === e.id ? 1 : 0} data-rel={sel && related.has(e.id) ? 1 : 0} data-dim={sel && sel !== e.id && !related.has(e.id) ? 1 : 0} aria-pressed={sel === e.id} onClick={() => onPick(sel === e.id ? "" : e.id)} title={e.summary}>
                  <i className={`st ${e.status}`} aria-hidden />
                  {e.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Drawer({ e, onPick }: { e: Entity; onPick: (id: string) => void }) {
  const ns = neighbors(e.id);
  const recent = announcementsFor(e.id)[0];
  return (
    <div className="gai-stack">
      <div className="gai-row"><Status status={e.status} /> <span className="gai-small gai-muted">{LAYERS.find((l) => l.id === e.layer)?.name}</span></div>
      <h2 className="gai-h2">{e.name}</h2>
      {e.formerNames?.length ? <p className="gai-small gai-muted">Formerly {e.formerNames.map((f) => f.name).join(", ")}</p> : null}
      <p>{e.summary} <Cites ids={e.sourceIds} align="right" /></p>
      {ns.length > 0 && (
        <div>
          <div className="gai-group-name">Connections ({ns.length})</div>
          <ul className="gai-small gai-stack">
            {ns.slice(0, 8).map((n) => (
              <li key={n.edge.id}>
                <span className="gai-muted">{n.phrase}</span>{" "}
                <button type="button" className="gai-link" onClick={() => onPick(n.other.id)}>{n.other.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {recent && <p className="gai-small"><span className="gai-muted">Latest change · {fmtDate(recent.date)}:</span> <Link className="gai-link" href={`/google-ai/latest/${recent.id}`}>{recent.title}</Link></p>}
      <Link className="gai-btn primary" href={`/google-ai/entity/${e.id}`}>Open full dossier →</Link>
    </div>
  );
}

/** Agent Architecture Explorer: the path of one agent request, and which canonical component does each job. */
function AgentArchitecture() {
  const [step, setStep] = useState(0);
  const s = AGENT_FLOW[step];
  return (
    <Sec title="How an enterprise agent is put together" sub="Follow one request from the person who asks to the systems that act. Each step lists the Google components that do that job; components not yet in the knowledge base are left out rather than assumed.">
      <div className="gai-chipset" role="tablist" aria-label="Steps of an agent request">
        {AGENT_FLOW.map((f, i) => (
          <button key={f.id} type="button" role="tab" aria-selected={i === step} className="gai-chip" aria-pressed={i === step} onClick={() => setStep(i)}>
            {i + 1}. {f.name}
          </button>
        ))}
      </div>
      <div className="gai-split" style={{ marginTop: 12 }}>
        <div className="gai-card gai-stack">
          <span className="gai-kicker">Step {step + 1} of {AGENT_FLOW.length}</span>
          <h3 className="gai-h2">{s.name}</h3>
          <p>{s.job}</p>
          <div className="gai-note"><b>Design question: </b>{s.question}</div>
          <div className="gai-row">
            <button type="button" className="gai-btn" disabled={step === 0} onClick={() => setStep(step - 1)}>← Previous</button>
            <button type="button" className="gai-btn" disabled={step === AGENT_FLOW.length - 1} onClick={() => setStep(step + 1)}>Next →</button>
          </div>
        </div>
        <div className="gai-card">
          <div className="gai-group-name">Components that do this job</div>
          {s.entityIds.filter((id) => ENTITY_BY_ID[id]).length === 0 ? <p className="gai-small gai-muted">No component for this step is in the knowledge base yet.</p> : (
            <ul className="gai-claims">
              {s.entityIds.filter((id) => ENTITY_BY_ID[id]).map((id) => {
                const e = ENTITY_BY_ID[id];
                return (
                  <li key={id}>
                    <span><Link className="gai-link" href={`/google-ai/entity/${id}`}>{e.name}</Link> <Status status={e.status} short /></span>
                    <span className="gai-small gai-muted">{e.summary}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Sec>
  );
}

function GraphTab() {
  const options = useMemo(() => ENTITIES.filter((e) => neighbors(e.id).length > 0).sort((a, b) => neighbors(b.id).length - neighbors(a.id).length), []);
  const [id, setId] = useState<string>(options[0]?.id ?? "");
  if (!options.length) return <div style={{ marginTop: 14 }}><Empty title="No relationships recorded yet" /></div>;
  return (
    <Sec title="Knowledge graph" sub="Everything on this site is one graph of canonical entities and sourced relationships. Pick an entity to see its neighbourhood; click a neighbour to move there.">
      <div className="gai-row" style={{ marginBottom: 10 }}>
        <label className="gai-small" htmlFor="gai-graph-pick">Entity</label>
        <select id="gai-graph-pick" className="gai-select" value={id} onChange={(e) => setId(e.target.value)}>
          {options.map((e) => <option key={e.id} value={e.id}>{e.name} ({neighbors(e.id).length})</option>)}
        </select>
        <Link className="gai-link gai-small" href={`/google-ai/entity/${id}`}>Open dossier →</Link>
      </div>
      <div className="gai-card"><EgoGraph id={id} onPick={setId} /></div>
    </Sec>
  );
}
