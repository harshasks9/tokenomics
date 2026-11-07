"use client";

import { ArrowLeft, Check, CircleAlert, CircleCheck, Copy, FileCode2, FileText, FlaskConical, LoaderCircle, Play, RotateCcw, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { RunResult } from "@/lib/agentify/run";
import type { UseCaseDetail, UseCaseView } from "@/lib/agentify/views";
import { useAgentify } from "./state";
import { CodeView, Markdown, langOf } from "./md";
import { Head, usd } from "./ui";

export function UseCaseLibrary() {
  const { view, navigate, persona } = useAgentify();
  if (!view) return null;
  const card = (u: UseCaseView) => (
    <button key={u.id} type="button" className="ag-asset" onClick={() => navigate({ page: "usecase", slug: u.slug, tab: "overview" })}>
      <div className="ag-row between nowrap"><div className="ag-asset-name">{u.title}</div><span className={`ag-tag ${u.ownerKind === "google" ? "t-verified" : "t-community"}`}>{u.owner}</span></div>
      <div className="ag-asset-slug">{u.ref}</div>
      <p className="ag-asset-sum">{u.summary}</p>
      <div className="ag-asset-foot"><span>{u.surfaces.join(" · ")}</span><span>≈ {usd(u.monthlyPerUser)}/user/mo of entitlement</span></div>
    </button>
  );
  return (
    <div>
      <Head eyebrow={persona === "customer" ? "Long-running agents" : "Use-case packs"} title="Agents that keep working after you close the tab"
        lede="Each one is a real package — a SKILL.md the agent follows, an output schema, a sample run and the workshop lab that teaches it. All of them run on the Gemini agent capacity already in Workspace plans." />
      <div className="ag-grid c3">{view.useCases.map(card)}</div>
    </div>
  );
}

function pretty(t: string) { try { return JSON.stringify(JSON.parse(t), null, 2); } catch { return t; } }

function TryIt({ d }: { d: UseCaseDetail }) {
  const { runUseCase } = useAgentify();
  const sample = d.files.find((f) => f.path === "examples/sample-input.json")?.content ?? "{}";
  const [input, setInput] = useState(pretty(sample));
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<RunResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  let valid = true;
  try { JSON.parse(input); } catch { valid = false; }
  return (
    <div className="ag-play">
      <div className="ag-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="ag-file-head"><b>Input</b><span className="ag-muted ag-mono">examples/sample-input.json</span><span className="ag-spacer" /><button type="button" className="ag-btn sm ghost" onClick={() => { setInput(pretty(sample)); setRes(null); }}><RotateCcw size={13} />Sample</button></div>
        <textarea className="ag-editor" style={{ minHeight: 380, borderTop: 0 }} value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} aria-label="Input JSON" />
        <div className="ag-commit">
          {!valid && <span style={{ color: "var(--bad)", fontSize: 12.5 }}><CircleAlert size={13} /> Not valid JSON</span>}
          <span className="ag-muted" style={{ fontSize: 12 }}>Sandbox run — nothing is sent or booked</span><span className="ag-spacer" />
          <button type="button" className="ag-btn primary" disabled={busy || !valid} onClick={async () => { setBusy(true); setErr(null); const r = await runUseCase(d.useCase.id, input); setBusy(false); if (r.ok) setRes(r.result); else setErr(r.reason); }}>
            {busy ? <LoaderCircle size={14} className="ag-spin" /> : <Play size={14} />}{busy ? "Running…" : "Run"}
          </button>
        </div>
      </div>
      <div className="ag-stack">
        {err && <div className="ag-banner warn"><CircleAlert size={15} /><div>{err}</div></div>}
        {!res && !err && <div className="ag-card ag-empty" style={{ textAlign: "left" }}><b style={{ color: "var(--ink)" }}>Run the agent on a real input</b><p style={{ marginTop: 6 }}>The server loads the package&apos;s SKILL.md as the instructions, calls Gemini with its output schema and checks the result. Approvals stay with the user: the output is the plan and the drafts.</p></div>}
        {res && (
          <>
            <div className="ag-card">
              <div className="ag-row between" style={{ marginBottom: 8 }}>
                <div className="ag-row">{res.mode === "live" ? <span className="ag-tag ok"><Zap size={11} />Live · {res.model}</span> : <span className="ag-tag warn">Recorded run</span>}{res.validation && (res.validation.valid ? <span className="ag-tag ok"><CircleCheck size={11} />Schema valid</span> : <span className="ag-tag bad">{res.validation.issues.length} schema issue(s)</span>)}</div>
                <span className="ag-muted ag-num" style={{ fontSize: 12 }}>{res.latencyMs} ms</span>
              </div>
              <ol className="ag-trace">{res.trace.map((t, i) => <li key={i} data-s={t.status}><span className="ag-trace-dot" /><div><b>{t.label}</b><div className="ag-muted" style={{ fontSize: 12.5 }}>{t.detail}</div></div><span className="ag-muted ag-num" style={{ fontSize: 11.5 }}>+{t.ms}ms</span></li>)}</ol>
              {res.note && <p className="ag-muted" style={{ fontSize: 12, marginTop: 6 }}>{res.note}</p>}
            </div>
            <div className="ag-card" style={{ padding: 0, overflow: "hidden" }}><div className="ag-file-head"><b>Output</b></div><CodeView code={res.output ? JSON.stringify(res.output, null, 2) : res.outputText || "(no output)"} lang="json" maxHeight={480} /></div>
          </>
        )}
      </div>
    </div>
  );
}

export function UseCasePage({ slug, tab, path }: { slug: string; tab: "overview" | "files" | "run" | "lab"; path?: string }) {
  const { fetchUseCase, navigate, view } = useAgentify();
  const [d, setD] = useState<UseCaseDetail | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  useEffect(() => { let live = true; void fetchUseCase(slug).then((x) => live && setD(x)); return () => { live = false; }; }, [fetchUseCase, slug]);
  if (d === undefined) return <div className="ag-skel" style={{ height: 400 }} />;
  if (d === null) return <div className="ag-empty">Not found.</div>;
  const u = d.useCase;
  const [ns, name] = u.slug.split("/");
  const skill = d.files.find((f) => f.path === "SKILL.md")?.content ?? "";
  const lab = d.files.find((f) => f.path === "workshop/lab.md")?.content ?? "";
  const go = (t: typeof tab, p?: string) => navigate({ page: "usecase", slug: u.slug, tab: t, path: p });
  const active = path && d.files.some((f) => f.path === path) ? path : "SKILL.md";
  const ent = view?.accounts[0]?.edition.entitlement ?? 6;
  return (
    <div>
      <button type="button" className="ag-link" style={{ marginBottom: 12 }} onClick={() => navigate({ page: "usecases" })}><ArrowLeft size={13} /> Use cases</button>
      <div className="ag-row between" style={{ alignItems: "flex-start" }}>
        <div>
          <h1 className="ag-pkg"><span className="ns">{ns} /</span> {name}</h1>
          <div className="ag-row" style={{ marginTop: 6 }}>
            <span className="ag-tag type ag-mono" style={{ textTransform: "none" }}>v{u.version}</span>
            <span className={`ag-tag ${u.ownerKind === "google" ? "t-verified" : "t-community"}`}>{u.owner}</span>
            {u.surfaces.map((s) => <span key={s} className="ag-tag">{s}</span>)}
            <span className="ag-tag v-workspace">long-running</span>
          </div>
          <p style={{ marginTop: 8, color: "var(--ink-2)", maxWidth: 820 }}><b style={{ color: "var(--ink)" }}>{u.title}.</b> {u.summary}</p>
        </div>
        <button type="button" className="ag-btn primary" onClick={() => go("run")}><Play size={14} />Try it</button>
      </div>
      <nav className="ag-subtabs" aria-label="Package">
        {([["overview", "Skill card"], ["files", `Files ${d.files.length}`], ["run", "Try it"], ["lab", "Workshop lab"]] as const).map(([t, l]) => (
          <button key={t} type="button" aria-current={tab === t ? "page" : undefined} onClick={() => go(t)}>{t === "lab" && <FlaskConical size={12} />}{l}</button>
        ))}
      </nav>
      {tab === "overview" && (
        <div className="ag-split" style={{ gridTemplateColumns: "minmax(0,1fr) 320px" }}>
          <div className="ag-card pad-lg"><Markdown source={skill} /></div>
          <aside className="ag-stack">
            <div className="ag-card">
              <div className="ag-h3" style={{ marginBottom: 8 }}>Use it</div>
              <div className="ag-cmd"><code>{d.install}</code><button type="button" aria-label="Copy" onClick={() => { void navigator.clipboard?.writeText(d.install).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
              <button type="button" className="ag-btn" style={{ width: "100%", marginTop: 10 }} onClick={() => go("lab")}><FlaskConical size={14} />Open the workshop lab</button>
            </div>
            <div className="ag-card">
              <div className="ag-h3" style={{ marginBottom: 8 }}>Entitlement math</div>
              <dl className="ag-kv">
                <dt>Per run</dt><dd className="ag-num">${u.costPerRun.toFixed(2)}</dd>
                <dt>Typical runs</dt><dd>{u.runsPerWeek} / user / week</dd>
                <dt>Per user / month</dt><dd className="ag-num"><b>{usd(u.monthlyPerUser)}</b> of ${ent}</dd>
              </dl>
              <div className="ag-bar ok" style={{ marginTop: 10 }}><i style={{ width: `${Math.min(100, (u.monthlyPerUser / ent) * 100)}%` }} /></div>
              <p className="ag-muted" style={{ fontSize: 12, marginTop: 6 }}>Included in the Workspace plan&apos;s per-user agent entitlement. Chat questions don&apos;t count.</p>
            </div>
            {u.approval && <div className="ag-card"><div className="ag-h3" style={{ marginBottom: 6 }}>Needs approval</div><p style={{ fontSize: 13 }}>{u.approval}</p></div>}
          </aside>
        </div>
      )}
      {tab === "files" && (
        <div className="ag-files">
          <nav className="ag-tree">{d.files.map((f) => <button key={f.path} type="button" className="ag-tree-item" aria-current={active === f.path ? "true" : undefined} onClick={() => go("files", f.path)}>{f.path.endsWith(".md") ? <FileText size={14} /> : <FileCode2 size={14} />}<span>{f.path}</span></button>)}</nav>
          <div className="ag-file"><div className="ag-file-head"><span className="ag-mono" style={{ fontWeight: 600 }}>{active}</span></div><CodeView code={d.files.find((f) => f.path === active)?.content ?? ""} lang={langOf(active)} maxHeight={640} /></div>
        </div>
      )}
      {tab === "run" && <TryIt d={d} />}
      {tab === "lab" && <div className="ag-card pad-lg">{lab ? <Markdown source={lab} /> : <p className="ag-muted">No lab yet.</p>}</div>}
    </div>
  );
}
