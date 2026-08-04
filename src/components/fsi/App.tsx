"use client";

import { useMemo, useState } from "react";
import HUB from "@/lib/fsi/hub";
import type { CaseRecord, EvidenceGrade, Segment, Stage } from "@/lib/fsi/types";
import {
  ClaimBadge,
  Field,
  GradeBadge,
  Guardrail,
  SEGMENT_TEXT,
  SourceList,
  StageBadge,
  useHashRoute,
  vendorName,
} from "./primitives";
import Modules2 from "./modules2";

const NAV = [
  ["", "Thesis"],
  ["atlas", "Use-case atlas"],
  ["studio", "Workflow studio"],
  ["map", "Competitive map"],
  ["arch", "Architecture"],
  ["buildbuy", "Build vs buy"],
  ["cockpit", "Sales cockpit"],
  ["reg", "Regulatory brief"],
  ["ledger", "Evidence ledger"],
] as const;

const GUARDRAILS = HUB.cases.filter((c) => c.guardrail);

export default function App() {
  const [route, nav] = useHashRoute();
  const [dark, setDark] = useState<boolean | null>(null); // null = follow system
  const page = route[0] ?? "";

  return (
    <div className="fsi-root" data-theme={dark === null ? "auto" : dark ? "dark" : "light"}>
      <a className="fsi-skip" href="#fsi-main">
        Skip to content
      </a>
      <header className="fsi-top">
        <div className="fsi-shell fsi-top-row">
          <span className="fsi-wordmark">
            FSI<span>/</span>KNOWLEDGE HUB
          </span>
          <span className="fsi-internal" role="note">
            INTERNAL USE ONLY — GOOGLE CLOUD INDIA · CURRENT AS OF AUGUST 2026
          </span>
          <button
            type="button"
            className="fsi-theme"
            onClick={() => setDark(dark === null ? !window.matchMedia("(prefers-color-scheme: dark)").matches ? true : false : !dark)}
            aria-label="Toggle light/dark theme"
          >
            ◐
          </button>
        </div>
        <nav className="fsi-shell fsi-nav" aria-label="Modules">
          {NAV.map(([h, label], i) => (
            <a
              key={h}
              href={`#/${h}`}
              aria-current={page === h || (h === "atlas" && page === "case") || (h === "studio" && page === "workflow") || (h === "map" && page === "vendor")}
              onClick={(e) => {
                e.preventDefault();
                nav(h);
              }}
            >
              <span className="fsi-mono">{String(i + 1).padStart(2, "0")}</span> {label}
            </a>
          ))}
        </nav>
      </header>

      <main id="fsi-main" className="fsi-shell fsi-main">
        {page === "" && <Thesis nav={nav} />}
        {page === "atlas" && <Atlas nav={nav} />}
        {page === "case" && <CaseDetail id={route[1]} nav={nav} />}
        {(page === "studio" || page === "workflow" || page === "map" || page === "vendor" || page === "arch" || page === "buildbuy" || page === "cockpit" || page === "reg" || page === "ledger") && (
          <Modules2 route={route} nav={nav} />
        )}
      </main>

      <aside className="fsi-guardpanel" aria-label="Attribution guardrails">
        <h2 className="fsi-mono">ATTRIBUTION GUARDRAILS</h2>
        <p>These institutions are competitor references. None appears in a Google win column, anywhere on this site:</p>
        <ul>
          {GUARDRAILS.map((c) => (
            <li key={c.id}>
              <a href={`#/case/${c.id}`} onClick={(e) => { e.preventDefault(); nav(`case/${c.id}`); }}>
                {c.name.split(" — ")[0]}
              </a>{" "}
              <span className="fsi-mono">= {c.vendorIds.filter((v) => v !== "snowflake" && v !== "databricks").map(vendorName).join("/")}</span>
            </li>
          ))}
        </ul>
      </aside>

      <footer className="fsi-foot">
        <div className="fsi-shell">
          Internal research asset — not an official Google publication. Text wordmarks only; no logos. Evidence
          labels: <ClaimBadge label="verified" /> <ClaimBadge label="analysis" /> <ClaimBadge label="company" />.
          Compiled from three internal research files; see the Evidence ledger for source-quality caveats.
        </div>
      </footer>
    </div>
  );
}

/* ── 1 · Thesis ─────────────────────────────────────────────────────────── */

function Thesis({ nav }: { nav: (h: string) => void }) {
  const stages: { s: Stage; impl: string; reality: string }[] = [
    { s: "assistive", impl: "Search, summarisation, drafting, coding and agent assist", reality: "Broadest production adoption and clearest productivity evidence" },
    { s: "bounded-agent", impl: "Agents complete multi-step tasks through approved tools, with human checkpoints", reality: "Entering production in onboarding, servicing, research and internal operations" },
    { s: "multi-agent", impl: "Specialised agents plan, retrieve, analyse, validate and prepare actions", reality: "Production evidence exists, but disclosure is limited and controls are evolving" },
    { s: "autonomous", impl: "AI executes material decisions or transactions without routine human approval", reality: "Rare in regulated, customer-impacting workflows; generally inappropriate where explanations, suitability or legal accountability are required" },
  ];
  return (
    <section aria-labelledby="fsi-h-thesis">
      <p className="fsi-kicker fsi-mono">01 · THESIS</p>
      <h1 id="fsi-h-thesis" className="fsi-h1">
        Evidence first, workflow second, architecture third, product fourth.
      </h1>
      <p className="fsi-lede">
        The frontier has moved from gen-AI pilots to <strong>production agentic systems</strong>. The reference
        deployments field teams must know cold: JPMorgan Chase (LLM Suite, ~200,000 users onboarded in 8 months,
        450+ use cases, roadmap to 1,000 by end-2026), Morgan Stanley (“To date, 98% of Financial Advisor teams
        have adopted the Assistant”), BBVA (ChatGPT Enterprise to all 120,000 employees), Wells Fargo (Fargo on
        Google Cloud, 245.4M interactions in 2024 with zero PII sent to the LLM) and HSBC (“two to four times
        more financial crime… 60% fewer false positives”). <ClaimBadge label="verified" />
      </p>
      <p className="fsi-lede">
        Google Cloud&rsquo;s winning wedge in FSI is <strong>the full stack under strict data control</strong> — and the
        commercial reality is multi-vendor: the same bank runs Google, OpenAI/Microsoft and Anthropic
        simultaneously. The seller&rsquo;s job is to anchor the <em>data + agent + security layers</em> to Google even
        when models are mixed. Positioning discipline beats product claims. <ClaimBadge label="analysis" />
      </p>

      <h2 className="fsi-h2">The four-stage maturity model</h2>
      <div className="fsi-scroll">
        <table className="fsi-table">
          <thead>
            <tr><th>Stage</th><th>Typical implementation</th><th>Financial-services reality</th><th>Production label</th></tr>
          </thead>
          <tbody>
            {stages.map((r) => (
              <tr key={r.s}>
                <td className="fsi-mono">{r.s}</td>
                <td>{r.impl}</td>
                <td>{r.reality}</td>
                <td><StageBadge stage={r.s} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="fsi-h2">Reading this site</h2>
      <p>
        Every claim carries one of three labels — <ClaimBadge label="verified" /> fact traceable to a named
        source, <ClaimBadge label="analysis" /> the author&rsquo;s positioning, <ClaimBadge label="company" />{" "}
        self-reported and rarely independently audited. Every case carries an evidence grade from{" "}
        <GradeBadge grade="verified-production" /> down to <GradeBadge grade="unverified" />. Missing fields say{" "}
        <span className="fsi-nd">Not disclosed</span> — nothing is inferred. Where the three source files
        genuinely disagree, the case shows a <strong>Conflicting account</strong> note instead of a silently
        chosen number.
      </p>
      <p>
        <button type="button" className="fsi-btn" onClick={() => nav("atlas")}>Open the use-case atlas →</button>
      </p>
    </section>
  );
}

/* ── 2 · Atlas ──────────────────────────────────────────────────────────── */

const GEO_BUCKETS: [string, (g: string) => boolean][] = [
  ["Americas", (g) => /United States|Canada|Brazil|LatAm|North America/i.test(g)],
  ["Europe & UK", (g) => /Germany|United Kingdom|Switzerland|Sweden|Norway|Spain|Europe/i.test(g)],
  ["APAC & India", (g) => /India|Malaysia|Singapore|Australia/i.test(g)],
  ["Africa & ME", (g) => /South Africa/i.test(g)],
  ["Global", (g) => /Global/i.test(g)],
];

function Atlas({ nav }: { nav: (h: string) => void }) {
  const [seg, setSeg] = useState<Segment | "">("");
  const [geo, setGeo] = useState("");
  const [ven, setVen] = useState("");
  const [wf, setWf] = useState("");
  const [stage, setStage] = useState<Stage | "">("");
  const [grade, setGrade] = useState<EvidenceGrade | "">("");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return HUB.cases.filter((c) => {
      if (seg && c.segment !== seg) return false;
      if (geo && !GEO_BUCKETS.find(([n]) => n === geo)?.[1](c.geo)) return false;
      if (ven && !c.vendorIds.includes(ven)) return false;
      if (wf && !c.workflowIds.includes(wf)) return false;
      if (stage && c.stage !== stage) return false;
      if (grade && c.grade !== grade) return false;
      if (needle) {
        const hay = JSON.stringify(c).toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [seg, geo, ven, wf, stage, grade, q]);

  const sel = (label: string, value: string, set: (v: string) => void, opts: [string, string][]) => (
    <label className="fsi-filter">
      <span className="fsi-mono">{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        <option value="">All</option>
        {opts.map(([v, t]) => (
          <option key={v} value={v}>{t}</option>
        ))}
      </select>
    </label>
  );

  return (
    <section aria-labelledby="fsi-h-atlas">
      <p className="fsi-kicker fsi-mono">02 · USE-CASE ATLAS</p>
      <h1 id="fsi-h-atlas" className="fsi-h1">Every institution, once, merged.</h1>
      <p className="fsi-lede">{HUB.cases.length} canonical case records assembled from all three source files. Filters combine; search covers every field.</p>

      <div className="fsi-filters" role="search">
        {sel("SEGMENT", seg, (v) => setSeg(v as Segment | ""), Object.entries(SEGMENT_TEXT) as [string, string][])}
        {sel("GEOGRAPHY", geo, setGeo, GEO_BUCKETS.map(([n]) => [n, n]))}
        {sel("VENDOR", ven, setVen, [...HUB.vendors.filter((v) => ["hyperscaler", "model-lab", "data-platform"].includes(v.cat)).map((v) => [v.id, v.name.split(" (")[0]] as [string, string]), ["inhouse", "In-house"]])}
        {sel("WORKFLOW", wf, setWf, HUB.workflows.map((w) => [w.id, w.name]))}
        {sel("STAGE", stage, (v) => setStage(v as Stage | ""), (["assistive", "bounded-agent", "multi-agent", "autonomous"] as Stage[]).map((s) => [s, s]))}
        {sel("EVIDENCE", grade, (v) => setGrade(v as EvidenceGrade | ""), (["verified-production", "production-undisclosed", "limited-production", "pilot", "announced", "unverified"] as EvidenceGrade[]).map((g) => [g, g]))}
        <label className="fsi-filter fsi-filter-q">
          <span className="fsi-mono">SEARCH</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Free text across all fields…" />
        </label>
      </div>

      <p className="fsi-mono fsi-count" aria-live="polite">{rows.length} / {HUB.cases.length} cases</p>

      <div className="fsi-cards">
        {rows.map((c) => (
          <a
            key={c.id}
            className="fsi-card"
            href={`#/case/${c.id}`}
            onClick={(e) => { e.preventDefault(); nav(`case/${c.id}`); }}
          >
            <div className="fsi-card-top">
              <GradeBadge grade={c.grade} />
              {c.guardrail ? <Guardrail /> : null}
            </div>
            <h3>{c.name}</h3>
            <p className="fsi-card-meta fsi-mono">
              {SEGMENT_TEXT[c.segment]} · {c.geo} · {c.vendorIds.map(vendorName).join(" + ")}
            </p>
            <p className="fsi-card-problem">{c.problem}</p>
            <p className="fsi-card-outcome">
              <ClaimBadge label={c.outcomes[0].label} /> {c.outcomes[0].text.slice(0, 150)}
              {c.outcomes[0].text.length > 150 ? "…" : ""}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ── Case detail ────────────────────────────────────────────────────────── */

function CaseDetail({ id, nav }: { id?: string; nav: (h: string) => void }) {
  const c: CaseRecord | undefined = HUB.cases.find((x) => x.id === id);
  if (!c) return <p>Case not found. <a href="#/atlas">Back to the atlas</a>.</p>;
  const wfs = HUB.workflows.filter((w) => c.workflowIds.includes(w.id));
  return (
    <article className="fsi-print-target" aria-labelledby="fsi-h-case">
      <p className="fsi-kicker fsi-mono">
        <a href="#/atlas" onClick={(e) => { e.preventDefault(); nav("atlas"); }}>02 · ATLAS</a> / CASE · {c.id} · reviewed {c.lastReviewed}
      </p>
      <div className="fsi-case-head">
        <h1 id="fsi-h-case" className="fsi-h1">{c.name}</h1>
        <div className="fsi-badges">
          <GradeBadge grade={c.grade} />
          <StageBadge stage={c.stage} />
          {c.guardrail ? <Guardrail /> : null}
        </div>
      </div>
      <p className="fsi-card-meta fsi-mono">
        {SEGMENT_TEXT[c.segment]} · {c.geo} · {c.vendorIds.map(vendorName).join(" + ")} ·{" "}
        {wfs.map((w) => (
          <a key={w.id} href={`#/workflow/${w.id}`} onClick={(e) => { e.preventDefault(); nav(`workflow/${w.id}`); }}>
            {w.name}
          </a>
        )).reduce<import("react").ReactNode[]>((acc, el, i) => (i ? [...acc, " · ", el] : [el]), [])}
      </p>

      <dl className="fsi-schema">
        <Field k="Problem" v={c.problem} />
        <Field k="AI capability" v={c.capability} />
        <Field k="Models" v={c.models} />
        <Field k="Architecture" v={c.architecture} />
        <Field k="Data platform" v={c.dataPlatform} />
        <Field k="Governance & security" v={c.governance} />
      </dl>

      <h2 className="fsi-h2">Outcomes</h2>
      {c.outcomes.map((o, i) => (
        <p key={i} className="fsi-outcome">
          <ClaimBadge label={o.label} /> {o.text}
        </p>
      ))}

      {c.conflict ? (
        <div className="fsi-conflict" role="note">
          <strong className="fsi-mono">⚠ CONFLICTING ACCOUNT</strong>
          <p>{c.conflict}</p>
        </div>
      ) : null}

      <dl className="fsi-schema">
        <Field k="Lessons" v={c.lessons} />
        <Field k="Why it succeeded" v={c.whySucceeded} />
        <Field k="Why competitors would struggle" v={c.whyCompetitorsStruggle} />
      </dl>

      <h2 className="fsi-h2">Google Cloud positioning</h2>
      <p className="fsi-outcome">
        <ClaimBadge label={c.googlePosition.label} /> {c.googlePosition.text}
      </p>

      <h2 className="fsi-h2">Evidence ledger</h2>
      <SourceList ids={c.sourceIds} />
      <p className="fsi-print-hide">
        <button type="button" className="fsi-btn" onClick={() => window.print()}>Print this case (one-page leave-behind)</button>
      </p>
    </article>
  );
}
