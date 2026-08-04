"use client";

import { useMemo, useState } from "react";
import HUB, { DEFAULT_WEIGHTS, composite } from "@/lib/fsi/hub";
import { ClaimBadge, GradeBadge, SourceList } from "./primitives";

type P = { route: string[]; nav: (h: string) => void };

export default function Modules2({ route, nav }: P) {
  const page = route[0];
  if (page === "studio" || page === "workflow") return <Studio openId={page === "workflow" ? route[1] : undefined} nav={nav} />;
  if (page === "map" || page === "vendor") return <CompMap selId={page === "vendor" ? route[1] : undefined} nav={nav} />;
  if (page === "arch") return <Arch nav={nav} />;
  if (page === "buildbuy") return <BuildBuy />;
  if (page === "cockpit") return <Cockpit nav={nav} />;
  if (page === "reg") return <Reg />;
  return <Ledger nav={nav} />;
}

/* ── 3 · Workflow studio ────────────────────────────────────────────────── */

function Studio({ openId, nav }: { openId?: string; nav: (h: string) => void }) {
  const [w, setW] = useState({ ...DEFAULT_WEIGHTS });
  const [open, setOpen] = useState<string | null>(openId ?? null);

  const scored = useMemo(() => {
    const s = HUB.workflows.filter((x) => x.scores).map((x) => ({ x, c: composite(x.scores!, w) }));
    s.sort((a, b) => b.c - a.c);
    return s;
  }, [w]);
  const unscored = HUB.workflows.filter((x) => !x.scores);

  const slider = (key: keyof typeof DEFAULT_WEIGHTS, label: string) => (
    <label className="fsi-slider">
      <span className="fsi-mono">{label} · {w[key]}%</span>
      <input type="range" min={0} max={50} value={w[key]} onChange={(e) => setW({ ...w, [key]: Number(e.target.value) })} />
    </label>
  );

  return (
    <section aria-labelledby="fsi-h-studio">
      <p className="fsi-kicker fsi-mono">03 · WORKFLOW STUDIO</p>
      <h1 id="fsi-h-studio" className="fsi-h1">Ranked workflows, adjustable model.</h1>
      <p className="fsi-lede">
        The composite scoring model from the deep-research report: value 30% · readiness 20% · executive priority
        15% · ROI evidence 15% · ease 20% (ease = 6 − complexity, five-point scales). Adjust the weights — the
        ranking recomputes live. Planning ranges are <strong>hypotheses for business cases, not promised
        outcomes</strong>; each programme should establish a baseline before the pilot.
      </p>

      <div className="fsi-sliders">
        {slider("value", "VALUE")}
        {slider("readiness", "READINESS")}
        {slider("exec", "EXEC PRIORITY")}
        {slider("roi", "ROI EVIDENCE")}
        {slider("ease", "EASE")}
        <button type="button" className="fsi-btn" onClick={() => setW({ ...DEFAULT_WEIGHTS })}>Reset to default</button>
      </div>

      <div className="fsi-scroll">
        <table className="fsi-table fsi-rank">
          <thead>
            <tr><th>#</th><th>Workflow</th><th>Value</th><th>Readiness</th><th>Complexity</th><th>Exec</th><th>ROI ev.</th><th>Composite</th></tr>
          </thead>
          <tbody>
            {scored.map(({ x, c }, i) => (
              <tr key={x.id} id={`wf-${x.id}`} data-open={open === x.id} onClick={() => setOpen(open === x.id ? null : x.id)} tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") setOpen(open === x.id ? null : x.id); }}>
                <td className="fsi-mono">{i + 1}</td>
                <td>{x.name}</td>
                {(["value", "readiness", "complexity", "exec", "roi"] as const).map((k) => (
                  <td key={k} className="fsi-mono">{x.scores![k]}</td>
                ))}
                <td className="fsi-mono fsi-strong">{c.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="fsi-note">
        The source report&rsquo;s printed composites differ from this formula by ≤0.1 on three rows (compliance-change,
        investment-research, insurance-ops) — a rounding inconsistency in the source, disclosed here rather than
        hidden. Unranked: {unscored.map((u) => u.name).join("; ")} — present in the canonical ranking
        (“Transformational / Emerging”) but not scored by the model.
      </p>

      {[...scored.map((s) => s.x), ...unscored].map((x) =>
        open === x.id || openId === x.id ? (
          <article key={x.id} className="fsi-wfcard fsi-print-target" aria-label={`${x.name} transformation card`}>
            <h2 className="fsi-h2">{x.name}</h2>
            <p className="fsi-mono fsi-kicker">{x.rationale}</p>
            <dl className="fsi-schema">
              <div className="fsi-field"><dt>Current state</dt><dd>{x.current}</dd></div>
              <div className="fsi-field"><dt>AI-native process</dt><dd>{x.future}</dd></div>
              <div className="fsi-field"><dt>Human / agent decision rights</dt><dd>{x.decisionRights}</dd></div>
              {x.planningGain ? (
                <div className="fsi-field"><dt>Indicative planning range <span className="fsi-hypo">HYPOTHESIS — for business cases, not a promised outcome</span></dt><dd>{x.planningGain}</dd></div>
              ) : null}
              <div className="fsi-field"><dt>Required data & controls</dt><dd>{x.dataControls}</dd></div>
              <div className="fsi-field"><dt>Google Cloud architecture</dt><dd>{x.gcpArch}</dd></div>
              <div className="fsi-field"><dt>Competitive positioning</dt><dd>{x.competitive}</dd></div>
              {x.canonicalProof ? <div className="fsi-field"><dt>Proof / metric (canonical table)</dt><dd>{x.canonicalProof}</dd></div> : null}
            </dl>
            <p>
              Evidence:{" "}
              {x.caseIds.map((cid) => {
                const cc = HUB.cases.find((k) => k.id === cid);
                return cc ? (
                  <a key={cid} className="fsi-chip" href={`#/case/${cid}`} onClick={(e) => { e.preventDefault(); nav(`case/${cid}`); }}>
                    {cc.name.split(" — ")[0]}{cc.guardrail ? " ⛔" : ""}
                  </a>
                ) : null;
              })}
            </p>
            <SourceList ids={x.sourceIds} />
            <button type="button" className="fsi-btn fsi-print-hide" onClick={() => window.print()}>Print this workflow card</button>
          </article>
        ) : null,
      )}
    </section>
  );
}

/* ── 4 · Competitive map ────────────────────────────────────────────────── */

const CATS: [string, string][] = [
  ["hyperscaler", "Hyperscalers"],
  ["model-lab", "Model labs"],
  ["data-platform", "Data platforms"],
  ["enterprise-platform", "Enterprise AI platforms"],
  ["silicon", "Silicon"],
  ["fsi-isv", "FSI ISVs"],
  ["integrator", "Integrators & specialists"],
];

function CompMap({ selId, nav }: { selId?: string; nav: (h: string) => void }) {
  const [sel, setSel] = useState<string | null>(selId ?? "googlecloud");
  const v = HUB.vendors.find((x) => x.id === sel);
  const pos = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    CATS.forEach(([cat], col) => {
      const vs = HUB.vendors.filter((x) => x.cat === cat);
      vs.forEach((x, row) => m.set(x.id, { x: 90 + col * 150, y: 90 + row * 92 }));
    });
    return m;
  }, []);
  const H = 90 + Math.max(...CATS.map(([c]) => HUB.vendors.filter((x) => x.cat === c).length)) * 92;

  return (
    <section aria-labelledby="fsi-h-map">
      <p className="fsi-kicker fsi-mono">04 · COMPETITIVE MAP</p>
      <h1 id="fsi-h-map" className="fsi-h1">Coopetition, drawn.</h1>
      <p className="fsi-lede">
        Every model is available on multiple clouds; every hyperscaler simultaneously partners with and competes
        against model labs and data platforms. Banks deliberately multi-source. The connective tissue is open
        agent protocols (A2A, MCP, AP2) — and Google authored/co-authored the most important ones.{" "}
        <ClaimBadge label="analysis" />
      </p>
      <p className="fsi-note">
        The typical Tier-1 stack: multiple frontier models (GPT + Claude + Gemini) behind an in-house
        orchestration layer, on one-to-two clouds, with a data platform as the gravity center, NVIDIA + TPU
        underneath, and FSI ISVs for systems of record. Edges: solid = partners/hosts-model, dashed = competes.
      </p>

      <div className="fsi-maplayout">
        <div className="fsi-scroll">
          <svg viewBox={`0 0 ${90 + CATS.length * 150} ${H}`} role="img" aria-label="Vendor ecosystem graph" className="fsi-graph">
            {HUB.vendorEdges.map((e, i) => {
              const a = pos.get(e.from); const b = pos.get(e.to);
              if (!a || !b) return null;
              const on = sel === e.from || sel === e.to;
              const mx = (a.x + b.x) / 2; const my = (a.y + b.y) / 2 - Math.abs(a.x - b.x) * 0.18 - 14;
              return (
                <path key={i} d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`} fill="none"
                  className={`fsi-edge fsi-edge-${e.type}`} data-on={on} />
              );
            })}
            {CATS.map(([cat, label], col) => (
              <text key={cat} x={90 + col * 150} y={34} textAnchor="middle" className="fsi-graph-cat">{label}</text>
            ))}
            {HUB.vendors.map((x) => {
              const p = pos.get(x.id)!;
              return (
                <g key={x.id} tabIndex={0} role="button" aria-label={x.name} className="fsi-node" data-on={sel === x.id}
                  onClick={() => { setSel(x.id); nav(`vendor/${x.id}`); }}
                  onKeyDown={(e) => { if (e.key === "Enter") { setSel(x.id); nav(`vendor/${x.id}`); } }}>
                  <rect x={p.x - 64} y={p.y - 26} width={128} height={52} rx={3} />
                  <text x={p.x} y={p.y + 4} textAnchor="middle">{x.name.split(" (")[0].slice(0, 18)}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {v ? (
          <aside className="fsi-panel" aria-live="polite">
            <h2 className="fsi-h2">{v.name}</h2>
            <dl className="fsi-schema">
              <div className="fsi-field"><dt>Where they win</dt><dd>{v.wins}</dd></div>
              <div className="fsi-field"><dt>Where they lose</dt><dd>{v.loses}</dd></div>
              <div className="fsi-field"><dt>Field guidance <ClaimBadge label="analysis" /></dt><dd>{v.guidance}</dd></div>
            </dl>
            {v.caseIds.length ? (
              <p>
                FSI references:{" "}
                {v.caseIds.map((cid) => {
                  const cc = HUB.cases.find((k) => k.id === cid);
                  return cc ? (
                    <a key={cid} className="fsi-chip" href={`#/case/${cid}`} onClick={(e) => { e.preventDefault(); nav(`case/${cid}`); }}>
                      {cc.name.split(" — ")[0]}{cc.guardrail ? " ⛔" : ""}
                    </a>
                  ) : null;
                })}
              </p>
            ) : null}
            <SourceList ids={v.sourceIds} />
          </aside>
        ) : null}
      </div>
    </section>
  );
}

/* ── 5 · Architecture explorer ──────────────────────────────────────────── */

function Arch({ nav }: { nav: (h: string) => void }) {
  const [path, setPath] = useState<string>("");
  const [openLayer, setOpenLayer] = useState<string | null>(null);
  const active = HUB.archPaths.find((p) => p.workflowId === path);
  return (
    <section aria-labelledby="fsi-h-arch">
      <p className="fsi-kicker fsi-mono">05 · ARCHITECTURE EXPLORER</p>
      <h1 id="fsi-h-arch" className="fsi-h1">Silicon to agent, under your control.</h1>
      <p className="fsi-lede">
        Google is the only vendor that designs the entire stack — custom silicon, network, data platform, models,
        agent runtime and security — with sovereign and model-agnostic options. <ClaimBadge label="analysis" /> Click a
        layer for components and proof; toggle a workflow to reshape the diagram.
      </p>
      <div className="fsi-archtoggle" role="tablist" aria-label="Workflow lens">
        <button type="button" className="fsi-btn" aria-pressed={!path} onClick={() => setPath("")}>Full stack</button>
        {HUB.archPaths.map((p) => (
          <button key={p.workflowId} type="button" className="fsi-btn" aria-pressed={path === p.workflowId} onClick={() => setPath(p.workflowId)}>
            {p.label}
          </button>
        ))}
      </div>
      {active ? <p className="fsi-note fsi-flow"><span className="fsi-mono">FLOW</span> {active.flow}</p> : null}
      <div className="fsi-stack">
        {[...HUB.architectureLayers].reverse().map((l) => (
          <div key={l.id} className="fsi-layer" data-open={openLayer === l.id}>
            <button type="button" className="fsi-layer-head" aria-expanded={openLayer === l.id} onClick={() => setOpenLayer(openLayer === l.id ? null : l.id)}>
              <span>{l.name}</span>
              <span className="fsi-mono">{openLayer === l.id ? "−" : "+"}</span>
            </button>
            <div className="fsi-layer-chips">
              {HUB.products.filter((pr) => pr.layerId === l.id).map((pr) => {
                const dim = active ? !active.productIds.includes(pr.id) : false;
                return (
                  <span key={pr.id} className="fsi-chip" data-dim={dim} title={pr.blurb}>{pr.name}</span>
                );
              })}
            </div>
            {openLayer === l.id ? (
              <div className="fsi-layer-body">
                <dl className="fsi-schema">
                  <div className="fsi-field"><dt>The story</dt><dd>{l.story}</dd></div>
                  <div className="fsi-field"><dt>Why FSI cares</dt><dd>{l.fsiRelevance}</dd></div>
                  <div className="fsi-field"><dt>Proof points</dt><dd>{l.proof}</dd></div>
                </dl>
                {HUB.products.filter((pr) => pr.layerId === l.id).map((pr) => (
                  <p key={pr.id} className="fsi-note"><strong className="fsi-mono">{pr.name}</strong> — {pr.blurb}</p>
                ))}
                <SourceList ids={l.sourceIds} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <p className="fsi-note">
        Naming caution (Aug 2026): Google describes Gemini Enterprise Agent Platform as the forward path for
        services previously associated with Vertex AI; AWS has redirected new agent customers from Bedrock Agents
        Classic to AgentCore (maintenance mode for new customers from 30 July 2026). Re-verify product names
        before customer decks. <ClaimBadge label="verified" />
      </p>
      <p><a className="fsi-btn" href="#/reg" onClick={(e) => { e.preventDefault(); nav("reg"); }}>Regulatory implications →</a></p>
    </section>
  );
}

/* ── 6 · Build vs buy ───────────────────────────────────────────────────── */

const QQ = [
  { id: "budget", q: "Technology budget scale", opts: ["<$1B", "$1–10B", "$10B+ (JPMorgan/Goldman-class)"] },
  { id: "sensitivity", q: "Data sensitivity of the workflow", opts: ["Commodity (HR/IT/procurement)", "Customer PII / regulated", "Highly sensitive (trade data, medical, PII at scale)"] },
  { id: "diff", q: "Strategic differentiation", opts: ["Standard industry process", "Somewhat differentiating", "Board-level differentiator"] },
  { id: "risk", q: "EU AI Act classification", opts: ["Not in scope / minimal", "Limited risk", "High-risk (credit scoring, insurance pricing — Annex III)"] },
  { id: "eng", q: "In-house engineering depth", opts: ["Thin", "Solid platform team", "Deep (thousands of engineers)"] },
] as const;

function BuildBuy() {
  const [a, setA] = useState<Record<string, number>>({});
  const done = QQ.every((q) => a[q.id] !== undefined);
  let rec = "";
  let branch = "";
  if (done) {
    const build = a.budget === 2 && a.diff === 2 && a.eng === 2;
    const commodity = a.diff === 0 || a.sensitivity === 0;
    if (build) {
      rec = "BUILD — you are in the JPMorgan/Goldman tier";
      branch = "Build internally only if you are JPMorgan/Goldman-scale ($10B+ tech budget) AND AI is a board-level differentiator (LLM Suite, GS AI). Preserve IP, avoid lock-in, keep data sovereignty in Confidential Space.";
    } else if (commodity) {
      rec = "BUY — packaged software for commodity workflows";
      branch = "Commodity workflows (HR, procurement, IT helpdesk): buying packaged capability (ServiceNow, Workday, Workspace copilots) is optimal; building distracts talent from core financial tasks. Enterprise platforms are overkill here.";
    } else {
      rec = "HYBRID — buy the platform, build the agents";
      branch = "Everyone else: buy infrastructure, models and commodity capabilities; build the proprietary data products, policies, orchestration and user experience that create differentiated economics. Build on a managed AI platform; consume managed model serving, runtime, security and observability.";
    }
  }
  return (
    <section aria-labelledby="fsi-h-bb">
      <p className="fsi-kicker fsi-mono">06 · BUILD-VS-BUY NAVIGATOR</p>
      <h1 id="fsi-h-bb" className="fsi-h1">Buy the platform. Build the agents.</h1>
      <div className="fsi-quiz">
        {QQ.map((q) => (
          <fieldset key={q.id} className="fsi-q">
            <legend>{q.q}</legend>
            {q.opts.map((o, i) => (
              <label key={o}>
                <input type="radio" name={q.id} checked={a[q.id] === i} onChange={() => setA({ ...a, [q.id]: i })} /> {o}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      {done ? (
        <div className="fsi-rec" aria-live="polite">
          <h2 className="fsi-h2">{rec}</h2>
          <p>{branch}</p>
          {a.risk === 2 ? (
            <p className="fsi-conflict"><strong className="fsi-mono">⚠ HIGH-RISK CLASSIFICATION</strong> — regardless of build/buy: mandatory human-in-the-loop, evaluation gates and a full audit trail. Full high-risk obligations apply from August 2, 2026; penalties up to €15M or 3% of global turnover. If you build your own credit models you are a “provider” — the heaviest tier.</p>
          ) : null}
          <dl className="fsi-schema">
            <div className="fsi-field"><dt>Assumptions</dt><dd>Derived from the decision-tree and matrix in the source files: differentiation drives build; commodity drives buy; the default for large FIs is hybrid. Inference cost should not dominate prematurely — integration, data remediation, controls, model risk, testing and adoption can cost more than tokens.</dd></div>
            <div className="fsi-field"><dt>RAG vs fine-tune default</dt><dd>Default to RAG (DB Lumina, Morgan Stanley) for freshness and governance; fine-tune only for narrow, stable, high-volume tasks after a representative evaluation set shows a persistent gap. Where a deterministic calculation exists, invoke it as a tool — never ask the LLM to approximate it.</dd></div>
            <div className="fsi-field"><dt>ISV negotiation point</dt><dd>For systems of record (Temenos/nCino/Finastra): most embed Azure OpenAI today — negotiate model choice into the contract.</dd></div>
            <div className="fsi-field"><dt>The “buy” risk in regulated markets</dt><dd>If a vendor&rsquo;s model drifts, exhibits bias or behaves inexplicably, the bank remains liable to regulators. Owning the evaluation, tracing and governance layers natively satisfies compliance mandates.</dd></div>
          </dl>
        </div>
      ) : (
        <p className="fsi-note">Answer all five to get a recommendation with its assumptions.</p>
      )}
    </section>
  );
}

/* ── 7 · Sales cockpit ──────────────────────────────────────────────────── */

const PERSONA_Q: [string, string[]][] = [
  ["CIO", ["Are your AI investments creating another set of isolated applications, or a reusable institution-wide execution and control plane?", "Which models are you locked into, and how would you swap one?"]],
  ["CTO", ["Which parts of your AI stack create differentiation, and which parts are undifferentiated platform engineering?", "As you move from a single chatbot to dozens of departmental agents, how are you standardizing communication between them?"]],
  ["Head of Data", ["Can an agent discover the right data, understand its business meaning and prove which version supported an action?", "Where does customer data physically reside the moment it hits a model?"]],
  ["Head of AI", ["How do you route work across models based on quality, latency, jurisdiction and cost rather than model preference?", "What is your agent's human-in-the-loop and eval gate?", "How do you generate model-risk evidence for SR 11-7 / SR 26-2 and the EU AI Act?"]],
  ["CISO / CRO", ["Can you identify every agent, tool and model that can access customer data — and revoke that access immediately?", "Which decisions may AI prepare, which may it recommend, and which must remain with an accountable human or validated model?", "How are you maintaining cryptographic separation of regulated customer data when using API-based model providers?"]],
];

const OBJECTIONS: [string, string][] = [
  ["“We're standardized on OpenAI/Azure.”", "Standardizing on a single model provider is concentration risk. Vertex is an agnostic, secure gateway: Gemini, Claude and open models under one governance framework — and data stays in your tenancy. Every leading bank is poly-model."],
  ["“We use Palantir — it maps our ontology faster than we can.”", "Palantir is a strong ontology layer but a heavy, expensive abstraction. ADK + Agent Engine deliver multi-agent orchestration and deterministic execution natively in your data environment — no licensing premium, no long-term lock-in, full IP ownership."],
  ["“AWS has all our data in S3/Redshift — easier to build AI there.”", "Data storage is not AI-ready data. BigQuery with continuous queries triggers autonomous agents the millisecond a transaction occurs; a federated S3/Redshift design cannot match that operational velocity without significant custom integration."],
  ["“Google will deprecate products.”", "Vertex/Gemini are core; cite Wells Fargo, Deutsche Bank and HSBC longevity."],
  ["“Model quality — Gemini isn't our choice.”", "The architecture can include Gemini, Claude, open models and your models under common identity, networking and observability. Evaluation routes each task; a 1M-token context plus eval-driven selection beats a single benchmark."],
  ["“Microsoft is already everywhere.”", "Microsoft can remain the employee surface. Google provides the AI, data, agent and security foundation for workflows needing deeper scale, model choice or analytics."],
  ["“The vendor says it can automate 80%.”", "Which 80%, at what quality, with what exception rate, and measured against which customer and risk outcomes?"],
  ["“We cannot quantify ROI yet.”", "Select one workflow, establish a four-week baseline and agree the unit economics before building."],
  ["“Agents are too risky.”", "Material autonomy should be earned. Begin with read-only evidence assembly, add recommendations, then permit bounded actions only after evaluation and control evidence."],
  ["“We can build this ourselves.”", "Build the domain logic and experience that differentiate you. Avoid spending scarce engineering capacity rebuilding model serving, identity, runtime, evaluation and security."],
];

const DEMOS: [string, string][] = [
  ["Contact-centre agent assist", "Complex product question → AI retrieves approved evidence, summarises account context, proposes an authorised action. Pair with: Federal Bank, Hong Leong, Commerzbank (competitor), Manulife."],
  ["Cymbal Bank agentic data cloud", "BigQuery continuous queries catch an “impossible travel” fraud event → Pub/Sub → ADK agent autonomously investigates the merchant, queries history, resolves the ticket."],
  ["Commercial-credit preparation", "Agent extracts statements, computes ratios via deterministic tools, checks policy, produces an evidence-linked memo. Pair with: John Hancock analogue + adverse-action explanation requirements."],
  ["Advisor preparation & follow-up", "Meeting brief, portfolio events, drafted follow-up; advisor approves. Pair with: Morgan Stanley (competitor), BlackRock Aladdin."],
  ["Memory Bank persistence", "Wealth agent recalls a client's constraints across sessions via isolated retrieval — deep context without identity-boundary violations."],
  ["A2A interoperability", "Two agents on different frameworks (LangChain, CrewAI) exchange tasks via standardized A2A JSON payloads — no framework lock-in."],
  ["AML investigation", "Multi-agent evidence assembly with traceable narrative; investigator reviews. Pair with: HSBC DRA; Nasdaq (competitor)."],
  ["Agent security operations", "Red-team prompt attempts exfiltration; Model Armor + SCC block it and open a SecOps investigation."],
];

const WORKSHOP: [string, string][] = [
  ["Executive ambition", "One measurable customer or financial outcome"],
  ["Workflow mapping", "Current process, queues, decisions, hand-offs, failure points"],
  ["Evidence & data", "Source systems, owners, permissions, quality, gaps"],
  ["Autonomy design", "What the agent may read, recommend, prepare or execute"],
  ["Architecture", "Models, agents, data, tools, APIs, security, observability"],
  ["Economics", "Baseline, target, adoption assumptions, five-year TCO"],
  ["Production gates", "Evaluation threshold, control approval, rollout cohort, rollback"],
  ["Roadmap", "Ninety-day proof, six-month production scope, reusable components"],
];

function Cockpit({ nav }: { nav: (h: string) => void }) {
  const [flip, setFlip] = useState<number | null>(null);
  const [seg, setSeg] = useState("");
  const [wf, setWf] = useState("");
  const picks = useMemo(() => {
    const match = (ids: string[]) =>
      ids.map((id) => HUB.cases.find((c) => c.id === id)!).filter((c) => (!seg || c.segment === seg) && (!wf || c.workflowIds.includes(wf)));
    const lead = HUB.cases.filter((c) => c.vendorIds.includes("googlecloud") && !c.guardrail && (!seg || c.segment === seg) && (!wf || c.workflowIds.includes(wf)));
    const rival = HUB.cases.filter((c) => !c.vendorIds.includes("googlecloud") && (!seg || c.segment === seg) && (!wf || c.workflowIds.includes(wf)));
    return { lead, rival, match };
  }, [seg, wf]);

  return (
    <section aria-labelledby="fsi-h-cockpit">
      <p className="fsi-kicker fsi-mono">07 · SALES COCKPIT</p>
      <h1 id="fsi-h-cockpit" className="fsi-h1">The four conversations: value, workflow, controls, platform.</h1>
      <p className="fsi-lede">Do not start at the platform box. Executive openers: the Klarna walk-back (quality vs. cost); the JPMorgan 1,000-use-case roadmap and ~$2B value claim <ClaimBadge label="company" />; AP2 changing top-of-wallet economics.</p>

      <h2 className="fsi-h2">Proof-point selector</h2>
      <div className="fsi-filters">
        <label className="fsi-filter"><span className="fsi-mono">SEGMENT</span>
          <select value={seg} onChange={(e) => setSeg(e.target.value)}>
            <option value="">Any</option>
            {Object.entries(SEG).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        </label>
        <label className="fsi-filter"><span className="fsi-mono">WORKFLOW</span>
          <select value={wf} onChange={(e) => setWf(e.target.value)}>
            <option value="">Any</option>
            {HUB.workflows.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </label>
      </div>
      <div className="fsi-proof">
        <div>
          <h3 className="fsi-mono">LEAD WITH</h3>
          {picks.lead.length ? picks.lead.slice(0, 4).map((c) => (
            <a key={c.id} className="fsi-chip" href={`#/case/${c.id}`} onClick={(e) => { e.preventDefault(); nav(`case/${c.id}`); }}>{c.name.split(" — ")[0]}</a>
          )) : <p className="fsi-nd">No Google-stack reference matches — lead with the architecture story, not a case.</p>}
        </div>
        <div>
          <h3 className="fsi-mono">YOU&rsquo;RE LIKELY UP AGAINST</h3>
          {picks.rival.length ? picks.rival.slice(0, 4).map((c) => (
            <a key={c.id} className="fsi-chip" href={`#/case/${c.id}`} onClick={(e) => { e.preventDefault(); nav(`case/${c.id}`); }}>{c.name.split(" — ")[0]} ⛔</a>
          )) : <p className="fsi-nd">No competitor reference captured for this combination.</p>}
        </div>
      </div>

      <h2 className="fsi-h2">Discovery questions by persona</h2>
      <div className="fsi-personas">
        {PERSONA_Q.map(([p, qs]) => (
          <div key={p} className="fsi-persona">
            <h3 className="fsi-mono">{p}</h3>
            <ul>{qs.map((q) => <li key={q}>{q}</li>)}</ul>
          </div>
        ))}
      </div>

      <h2 className="fsi-h2">Objections — flip for the rebuttal</h2>
      <div className="fsi-flips">
        {OBJECTIONS.map(([o, r], i) => (
          <button key={o} type="button" className="fsi-flip" aria-expanded={flip === i} onClick={() => setFlip(flip === i ? null : i)}>
            {flip === i ? <span className="fsi-flip-r"><span className="fsi-mono">REBUTTAL</span> {r}</span> : <span className="fsi-flip-o">{o}</span>}
          </button>
        ))}
      </div>

      <h2 className="fsi-h2">Demo portfolio</h2>
      <div className="fsi-scroll">
        <table className="fsi-table">
          <thead><tr><th>Demo</th><th>Storyline & pairing</th></tr></thead>
          <tbody>{DEMOS.map(([d, s]) => <tr key={d}><td>{d}</td><td>{s}</td></tr>)}</tbody>
        </table>
      </div>

      <h2 className="fsi-h2">Customer workshop structure</h2>
      <div className="fsi-scroll">
        <table className="fsi-table">
          <thead><tr><th>Segment</th><th>Output</th></tr></thead>
          <tbody>{WORKSHOP.map(([sgm, o]) => <tr key={sgm}><td>{sgm}</td><td>{o}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

const SEG: Record<string, string> = {
  retail: "Retail banking", commercial: "Commercial & corporate", "ib-research": "IB & research",
  "wealth-asset": "Wealth & asset mgmt", "payments-fintech": "Payments & fintech", insurance: "Insurance", "market-infra": "Market infrastructure",
};

/* ── 8 · Regulatory brief ───────────────────────────────────────────────── */

function Reg() {
  const dated = HUB.regulations.flatMap((r) => r.dates.map((d) => ({ ...d, reg: r.name })));
  dated.sort((a, b) => a.date.localeCompare(b.date));
  return (
    <section aria-labelledby="fsi-h-reg">
      <p className="fsi-kicker fsi-mono">08 · REGULATORY BRIEF</p>
      <h1 id="fsi-h-reg" className="fsi-h1">The obligations are dated. Architecture answers them.</h1>
      <ol className="fsi-timeline">
        {dated.map((d) => (
          <li key={`${d.date}-${d.label}`}>
            <span className="fsi-mono">{d.date}</span>
            <strong>{d.reg}</strong> — {d.label}
            {d.date === "2026-08-02" ? <em className="fsi-now"> ← now in force</em> : null}
          </li>
        ))}
      </ol>
      {HUB.regulations.map((r) => (
        <article key={r.id} className="fsi-reg">
          <h2 className="fsi-h2">{r.name} <span className="fsi-mono">{r.region}</span></h2>
          <p>{r.detail}</p>
          <p className="fsi-note"><strong className="fsi-mono">ARCHITECTURE →</strong> {r.archImplication}</p>
          <SourceList ids={r.sourceIds} />
        </article>
      ))}
      <p className="fsi-lede">
        These drive sovereign cloud + eval + audit-trail requirements — precisely where the stack&rsquo;s sovereignty
        (layer 5) and evaluation (layer 6) sit. <a href="#/arch">Open the architecture explorer →</a>
      </p>
    </section>
  );
}

/* ── 9 · Evidence ledger + change log ───────────────────────────────────── */

function Ledger({ nav }: { nav: (h: string) => void }) {
  const [sort, setSort] = useState<"owner" | "label" | "grade">("owner");
  const [flt, setFlt] = useState("");
  const rows = useMemo(() => {
    const out = HUB.cases.flatMap((c) =>
      c.outcomes.map((o) => ({
        claim: o.text, owner: c.name.split(" — ")[0], label: o.label, grade: c.grade,
        sources: o.sourceIds.map((s) => HUB.sources.find((x) => x.id === s)?.name ?? s).join("; "),
        caseId: c.id, reviewed: c.lastReviewed,
      })),
    );
    out.push({
      claim: "DBS ~S$1B (company-stated ROI listed in the canonical source-quality caveats; no case detail exists in the source files, so no case card is rendered)",
      owner: "DBS", label: "company", grade: "unverified", sources: "Canonical hub file (caveats section)", caseId: "", reviewed: "2026-08-05",
    });
    out.push({
      claim: "Generative AI could create approximately $200–340 billion in annual value for banking (2.8–4.7% of industry revenues) — assumes broad implementation, not current realised value",
      owner: "Industry estimate", label: "analysis", grade: "unverified", sources: "Source not captured in research file", caseId: "", reviewed: "2026-08-05",
    });
    const f = flt.trim().toLowerCase();
    const g = f ? out.filter((r) => JSON.stringify(r).toLowerCase().includes(f)) : out;
    return [...g].sort((a, b) => String(a[sort]).localeCompare(String(b[sort])));
  }, [sort, flt]);

  return (
    <section aria-labelledby="fsi-h-ledger">
      <p className="fsi-kicker fsi-mono">09 · EVIDENCE LEDGER</p>
      <h1 id="fsi-h-ledger" className="fsi-h1">Every material claim, one table.</h1>
      <div className="fsi-filters">
        <label className="fsi-filter"><span className="fsi-mono">SORT</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="owner">Institution</option><option value="label">Claim label</option><option value="grade">Evidence grade</option>
          </select>
        </label>
        <label className="fsi-filter fsi-filter-q"><span className="fsi-mono">FILTER</span>
          <input type="search" value={flt} onChange={(e) => setFlt(e.target.value)} placeholder="Filter claims…" />
        </label>
      </div>
      <div className="fsi-scroll">
        <table className="fsi-table fsi-ledger">
          <thead><tr><th>Institution</th><th>Claim</th><th>Label</th><th>Case grade</th><th>Source</th><th>Reviewed</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.caseId ? <a href={`#/case/${r.caseId}`} onClick={(e) => { e.preventDefault(); nav(`case/${r.caseId}`); }}>{r.owner}</a> : r.owner}</td>
                <td>{r.claim}</td>
                <td><ClaimBadge label={r.label} /></td>
                <td><GradeBadge grade={r.grade} /></td>
                <td className="fsi-small">{r.sources}</td>
                <td className="fsi-mono">{r.reviewed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="fsi-h2">Source-quality caveats (from the canonical file)</h2>
      <ul className="fsi-caveats">
        <li>Company-stated ROI (Klarna $40M, JPMorgan ~$2B, DBS ~S$1B, Nubank NPS gains, AIG &gt;5x) is self-reported and rarely independently audited — presented as vendor/bank claims throughout.</li>
        <li>Ironwood GA timing is ambiguous (Nov 2025 announcement → early-2026 rollout); the “44% lower TCO than GB200” figure is a Google projection.</li>
        <li>Vendor attribution corrections held firm site-wide: CBA = AWS/Anthropic/OpenAI (not Google); Nasdaq = AWS; LSEG = Microsoft; Morgan Stanley = OpenAI/Azure; UBS, Commerzbank, Discovery Bank = Microsoft/Azure. None appears in a Google win column.</li>
        <li>Several secondary aggregators restate primary figures; where possible the primary source (bank press release, OpenAI/Anthropic/Google blog, Bloomberg, VentureBeat, American Banker) is the citation of record.</li>
        <li>The deep-research file carried machine citation tokens; they are stripped from all rendered text. Where no named source survived, the claim is flagged “Source not captured in research file” rather than dropped.</li>
      </ul>

      <h2 className="fsi-h2">Change log</h2>
      <div className="fsi-scroll">
        <table className="fsi-table">
          <thead><tr><th>Date</th><th>Change</th></tr></thead>
          <tbody>
            <tr><td className="fsi-mono">2026-08-05</td><td>Initial compilation from the three research files (canonical hub, deep-research report, FSI_.txt). All cases merged; guardrails enforced.</td></tr>
            <tr><td className="fsi-mono">Cadence</td><td>Monthly editorial review: cases and product changes (product renaming deserves particular attention). Quarterly: competitor positioning and workflow scores. Material claims revalidated before any major customer presentation.</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
