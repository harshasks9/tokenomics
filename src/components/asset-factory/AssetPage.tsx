"use client";

import {
  ArrowLeft, Bookmark, BookmarkCheck, Check, ChevronRight, Copy, FileCode2, FileText, Folder, GitBranch, GitCommitHorizontal, GitFork,
  Globe, History, Lock, Pencil, Play, Plus, Share2, Star, X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { diffLines, parseSkill } from "@/lib/asset-factory/skillmd";
import type { AssetDetail } from "@/lib/asset-factory/views";
import type { LineageNode } from "@/lib/asset-factory/packages";
import { useFactory, type AssetTab } from "./state";
import { CodeView, DiffView, Markdown, langOf } from "./md";
import Playground from "./Playground";
import { AssetIcon, OrgName, Stars, TRUST, TYPE_LABEL, TrustTag, VIS, VisibilityTag, num } from "./ui";

export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback((text: string, id = "x") => {
    void navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1400);
  }, []);
  return { copied, copy };
}

function FileTree({ files, active, onPick, extra }: { files: string[]; active: string; onPick: (p: string) => void; extra?: { path: string; label: string }[] }) {
  const roots = files.filter((f) => !f.includes("/"));
  const dirs = new Map<string, string[]>();
  for (const f of files.filter((x) => x.includes("/"))) {
    const d = f.slice(0, f.lastIndexOf("/"));
    dirs.set(d, [...(dirs.get(d) ?? []), f]);
  }
  const item = (p: string, label: string, depth = 0, generated = false) => (
    <button key={p} type="button" className="af-tree-item" aria-current={active === p ? "true" : undefined} style={{ paddingLeft: 10 + depth * 14 }} onClick={() => onPick(p)}>
      {p.endsWith(".md") ? <FileText size={14} /> : <FileCode2 size={14} />}<span>{label}</span>{generated && <span className="af-tag" style={{ padding: "0 5px", fontSize: 10 }}>generated</span>}
    </button>
  );
  return (
    <nav className="af-tree" aria-label="Files">
      {roots.map((p) => item(p, p))}
      {[...dirs.entries()].sort().map(([d, fs]) => (
        <div key={d}>
          <div className="af-tree-dir"><Folder size={14} />{d}/</div>
          {fs.map((p) => item(p, p.slice(d.length + 1), 1))}
        </div>
      ))}
      {extra?.map((e) => item(e.path, e.label, 0, true))}
    </nav>
  );
}

function FilesTab({ detail, path, onSaved }: { detail: AssetDetail; path?: string; onSaved: () => void }) {
  const { navigate } = useFactory();
  const resolvedPath = "SKILL.resolved.md";
  const all = detail.files.map((f) => f.path);
  const active = path && (all.includes(path) || (path === resolvedPath && detail.resolved)) ? path : detail.mainFile ?? all[0] ?? "";
  const content = active === resolvedPath ? detail.resolved?.md ?? "" : detail.files.find((f) => f.path === active)?.content ?? "";
  return (
    <div className="af-files">
      <FileTree files={all} active={active} onPick={(p) => navigate({ page: "asset", slug: detail.asset.slug, tab: "files", path: p })} extra={detail.resolved ? [{ path: resolvedPath, label: "SKILL.resolved.md" }] : undefined} />
      <FileViewer key={`${active}@${detail.asset.version}`} detail={detail} active={active} content={content} generated={active === resolvedPath} onSaved={onSaved} />
    </div>
  );
}

function FileViewer({ detail, active, content, generated, onSaved }: { detail: AssetDetail; active: string; content: string; generated: boolean; onSaved: () => void }) {
  const { act, busy } = useFactory();
  const { copied, copy } = useCopy();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const [note, setNote] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const editable = detail.canEdit && !generated;

  const commit = async () => {
    const ok = await act({ type: "asset.edit", assetId: detail.asset.id, path: active, content: draft, note }, { success: `Committed ${active} — new version published to your package` });
    if (ok) onSaved();
  };

  return (
    <div className="af-file">
      <div className="af-file-head">
        <span className="af-mono" style={{ fontWeight: 600 }}>{active}</span>
        <span className="af-muted">{content.split("\n").length} lines</span>
        {generated && <span className="af-tag v-workspace">Resolved: {detail.resolved!.chain.join(" → ")}</span>}
        <span className="af-spacer" />
        {!editing && <button type="button" className="af-btn sm ghost" onClick={() => copy(content, "file")}>{copied === "file" ? <Check size={13} /> : <Copy size={13} />}Copy</button>}
        {editable && !editing && <button type="button" className="af-btn sm" onClick={() => setEditing(true)}><Pencil size={13} />Edit</button>}
        {!detail.canEdit && !generated && <span className="af-muted" style={{ fontSize: 12 }}><Lock size={11} /> Read-only — inherit or fork to change it</span>}
        {editing && <button type="button" className="af-btn sm ghost" onClick={() => setShowDiff(!showDiff)}>{showDiff ? "Edit" : "Review diff"}</button>}
        {editing && <button type="button" className="af-btn sm ghost" onClick={() => { setEditing(false); setDraft(content); }}><X size={13} />Cancel</button>}
      </div>
      {editing ? (
        <>
          {showDiff ? <DiffView lines={diffLines(content, draft)} maxHeight={560} /> : (
            <textarea className="af-editor" value={draft} onChange={(e) => setDraft(e.target.value)} spellCheck={false} aria-label={`Edit ${active}`} />
          )}
          <div className="af-commit">
            <GitCommitHorizontal size={16} />
            <input className="af-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder={`Update ${active}`} aria-label="Commit message" />
            <button type="button" className="af-btn primary" disabled={busy || draft === content} onClick={commit}>Commit new version</button>
          </div>
          <p className="af-muted" style={{ fontSize: 12, padding: "0 14px 12px" }}>
            Commits are authorized on the server: only {detail.asset.owner?.name ?? "the owner"} can commit here, JSON must parse, <code className="af-ic">extends:</code> can&apos;t be re-pointed{detail.asset.visibility === "public" ? ", and public packages are scanned for customer identifiers and secrets" : ""}.
          </p>
        </>
      ) : (
        <CodeView code={content} lang={langOf(active)} maxHeight={640} />
      )}
    </div>
  );
}

function LineageTree({ node, current, depth = 0 }: { node: LineageNode; current: string; depth?: number }) {
  const { openAsset } = useFactory();
  return (
    <div className="af-lin-node" style={{ marginLeft: depth ? 22 : 0 }}>
      <div className={`af-lin-row ${node.id === current ? "self" : ""}`}>
        {depth > 0 && <span className="af-lin-rel">{node.relation === "extends" ? <GitBranch size={13} /> : <GitFork size={13} />}{node.relation}</span>}
        <button type="button" className="af-btn ghost sm af-mono" style={{ padding: "2px 6px" }} onClick={() => openAsset(node.id)}>{node.slug}@{node.version}</button>
        <span className="af-muted" style={{ fontSize: 12 }}>{node.owner}</span>
        <TrustTag t={node.trust} />
      </div>
      {node.children.map((c) => <LineageTree key={c.id} node={c} current={current} depth={depth + 1} />)}
    </div>
  );
}

function Reviews({ detail }: { detail: AssetDetail }) {
  const { act, view } = useFactory();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const a = detail.asset;
  return (
    <div className="af-split">
      <div className="af-card">
        {a.reviews.length ? (
          <ul className="af-list">
            {a.reviews.map((r) => (
              <li key={r.id} style={{ flexDirection: "column", gap: 4 }}>
                <div className="af-row"><Stars rating={r.rating} count={1} /><b>{r.reviewer}</b><span className="af-muted" style={{ fontSize: 12 }}>{r.reviewerOrg} · {r.at}</span></div>
                {r.text && <div style={{ color: "var(--ink-2)" }}>{r.text}</div>}
              </li>
            ))}
          </ul>
        ) : <div className="af-empty">No written reviews yet.</div>}
      </div>
      {!a.mine ? (
        <form className="af-card" onSubmit={(e) => { e.preventDefault(); void act({ type: "asset.review", assetId: a.id, rating, text }, { success: "Review posted" }).then((ok) => ok && setText("")); }}>
          <div className="af-h3" style={{ marginBottom: 8 }}>Review this {a.type}</div>
          <div className="af-row" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" className="af-btn ghost sm" role="radio" aria-checked={rating === n} onClick={() => setRating(n)} aria-label={`${n} stars`} style={{ padding: 2 }}>
                <Star size={20} className="af-star" fill={n <= rating ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <textarea className="af-textarea" style={{ marginTop: 8 }} value={text} onChange={(e) => setText(e.target.value)} placeholder="What worked in production, what to watch for…" maxLength={400} />
          <div className="af-row between" style={{ marginTop: 8 }}>
            <span className="af-muted" style={{ fontSize: 12 }}>as {view?.actor.person.name}, {view?.actor.person.org.name}</span>
            <button type="submit" className="af-btn primary sm">Post review</button>
          </div>
        </form>
      ) : <div className="af-banner">You can&apos;t review your own organization&apos;s package.</div>}
    </div>
  );
}

function Sidebar({ detail }: { detail: AssetDetail }) {
  const { view, act, navigate } = useFactory();
  const { copied, copy } = useCopy();
  const [ws, setWs] = useState("");
  const a = detail.asset;
  const main = detail.files.find((f) => f.path === "SKILL.md");
  const fm = main ? parseSkill(main.content).frontmatter : {};
  const buildable = (view?.workspaces ?? []).filter((w) => !w.activated && w.myResponsibilities.some((r) => ["owner", "architecture", "integration"].includes(r)));
  const shareable = (view?.workspaces ?? []).filter((w) => !a.sharedInto.some((s) => s.id === w.id));
  const pin = `- ${a.ref}`;
  const inputs = Array.isArray(fm.inputs) ? fm.inputs : [];
  const tools = Array.isArray(fm.tools) ? fm.tools : [];
  return (
    <aside className="af-stack" style={{ gap: 14 }}>
      <div className="af-card">
        <div className="af-h3" style={{ marginBottom: 8 }}>Use this {a.type}</div>
        <div className="af-cmd"><code>{detail.install}</code><button type="button" aria-label="Copy install command" onClick={() => copy(detail.install, "install")}>{copied === "install" ? <Check size={14} /> : <Copy size={14} />}</button></div>
        <div className="af-muted" style={{ fontSize: 12, margin: "10px 0 4px" }}>or pin it in <span className="af-mono">agent.yaml</span></div>
        <div className="af-cmd"><code>{pin}</code><button type="button" aria-label="Copy reference" onClick={() => copy(a.ref, "ref")}>{copied === "ref" ? <Check size={14} /> : <Copy size={14} />}</button></div>
        {(a.type === "skill" || a.type === "blueprint") && (
          <button type="button" className="af-btn primary" style={{ width: "100%", marginTop: 12 }} onClick={() => navigate({ page: "inherit", slug: a.slug })}><GitBranch size={14} />Inherit &amp; customize</button>
        )}
        {buildable.length > 0 && (
          <div className="af-row nowrap" style={{ marginTop: 10 }}>
            <select className="af-select" value={ws} onChange={(e) => setWs(e.target.value)} aria-label="Add to workspace">
              <option value="">Add to a workspace…</option>
              {buildable.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <button type="button" className="af-btn" disabled={!ws} onClick={() => act(a.type === "blueprint" ? { type: "workspace.selectBlueprint", workspaceId: ws, assetId: a.id } : { type: "workspace.addComponent", workspaceId: ws, assetId: a.id }, { success: `Added ${a.ref} to ${buildable.find((w) => w.id === ws)?.name}` })}><Plus size={14} /></button>
          </div>
        )}
      </div>

      <div className="af-card">
        <dl className="af-kv">
          <dt>Publisher</dt><dd><OrgName org={a.owner} label={a.ownerLabel} /></dd>
          {a.contributor && <><dt>Maintainer</dt><dd>{a.contributor.name}</dd></>}
          {fm.license && <><dt>License</dt><dd>{String(fm.license)}</dd></>}
          {fm.model && <><dt>Model</dt><dd className="af-mono">{String(fm.model)}</dd></>}
          {a.extends && <><dt>Extends</dt><dd><button type="button" className="af-link af-mono" onClick={() => navigate({ page: "asset", slug: a.extends!.ref.split("@")[0], tab: "overview" })}>{a.extends.ref}</button></dd></>}
          {tools.length > 0 && <><dt>Tools</dt><dd>{tools.map((t) => <code key={t} className="af-ic" style={{ display: "inline-block", margin: "0 4px 4px 0" }}>{t}</code>)}</dd></>}
          {inputs.length > 0 && <><dt>Inputs</dt><dd>{inputs.join(", ")}</dd></>}
          {a.requires.length > 0 && <><dt>Requires</dt><dd>{a.requires.join(", ")}</dd></>}
          {a.provides.length > 0 && <><dt>Provides</dt><dd>{a.provides.join(", ")}</dd></>}
          <dt>Updated</dt><dd>{a.updatedAt}</dd>
        </dl>
      </div>

      <div className="af-card">
        <div className="af-h3" style={{ marginBottom: 8 }}>In production <span className="af-muted" style={{ fontWeight: 400, fontSize: 12 }}>· modeled</span></div>
        <div className="af-grid c2" style={{ gap: 10 }}>
          <div><div className="af-metric-label">Deployments</div><div className="af-num" style={{ fontSize: 20, fontWeight: 680 }}>{num(a.deployments)}</div></div>
          <div><div className="af-metric-label">Inherited / forked</div><div className="af-num" style={{ fontSize: 20, fontWeight: 680 }}>{a.forks}</div></div>
          <div><div className="af-metric-label">Cost per run</div><div className="af-num" style={{ fontSize: 20, fontWeight: 680 }}>{a.costPerExecution ? `$${a.costPerExecution.toFixed(3)}` : "—"}</div></div>
          <div><div className="af-metric-label">Analyst time saved</div><div className="af-num" style={{ fontSize: 20, fontWeight: 680 }}>{a.minutesSaved ? `${a.minutesSaved}m` : "—"}</div></div>
        </div>
        <p className="af-muted" style={{ fontSize: 12, marginTop: 10 }}>{TRUST[a.trust].help}</p>
      </div>

      {(a.prerequisites.length > 0 || a.security.length > 0) && (
        <div className="af-card">
          {a.prerequisites.length > 0 && <><div className="af-h3">Prerequisites</div><ul className="af-bullets">{a.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul></>}
          {a.security.length > 0 && <><div className="af-h3" style={{ marginTop: 10 }}>Security</div><ul className="af-bullets">{a.security.map((p) => <li key={p}>{p}</li>)}</ul></>}
        </div>
      )}

      {a.mine && (
        <div className="af-card" style={{ borderColor: "#c5cae9" }}>
          <div className="af-h3" style={{ marginBottom: 8 }}>Owner controls</div>
          <p className="af-muted" style={{ fontSize: 12.5, marginBottom: 8 }}>{VIS[a.visibility].help}</p>
          {a.visibility === "org" && shareable.length > 0 && (
            <div className="af-row nowrap" style={{ marginBottom: 8 }}>
              <select className="af-select" value={ws} onChange={(e) => setWs(e.target.value)} aria-label="Workspace to share into">
                <option value="">Share into workspace…</option>
                {shareable.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <button type="button" className="af-btn" disabled={!ws} onClick={() => act({ type: "asset.shareToWorkspace", assetId: a.id, workspaceId: ws }, { success: "Shared — only that workspace's collaborators gain access" })}><Share2 size={14} /></button>
            </div>
          )}
          <div className="af-row">
            {a.visibility === "org" && <button type="button" className="af-btn sm" onClick={() => window.confirm(`Publish ${a.ref} to the public community marketplace?`) && act({ type: "asset.publish", assetId: a.id, visibility: "public" }, { success: "Published to the community marketplace" })}><Globe size={13} />Publish publicly</button>}
            {a.visibility === "public" && <button type="button" className="af-btn sm" onClick={() => act({ type: "asset.publish", assetId: a.id, visibility: "org" }, { success: "Now organization private" })}><Lock size={13} />Make private</button>}
          </div>
        </div>
      )}
    </aside>
  );
}

export default function AssetPage({ slug, tab, path }: { slug: string; tab: AssetTab; path?: string }) {
  const { view, fetchAsset, navigate, act } = useFactory();
  const [detail, setDetail] = useState<AssetDetail | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const [doc, setDoc] = useState<"own" | "resolved">("own");
  const [reload, setReload] = useState(0);
  const seq = view?.seq ?? 0;
  const persona = view?.actor.persona;

  useEffect(() => {
    let live = true;
    void fetchAsset(slug).then((d) => {
      if (!live) return;
      setDetail(d);
      setState(d ? "ok" : "missing");
    });
    return () => { live = false; };
  }, [fetchAsset, slug, seq, persona, reload]);
  const load = useCallback(() => setReload((n) => n + 1), []);

  const byId = useMemo(() => new Map((view?.assets ?? []).map((x) => [x.id, x])), [view]);

  if (state === "missing") {
    return (
      <div className="af-empty" style={{ marginTop: 40 }}>
        <Lock size={20} />
        <div className="af-h2" style={{ marginTop: 8 }}>Not found, or not shared with you</div>
        <p style={{ marginTop: 6 }}>As {view?.actor.person.name} ({view?.actor.person.org.name}) the server returned nothing for <span className="af-mono">{slug}</span>. Missing and forbidden look the same on purpose.</p>
        <button type="button" className="af-btn" style={{ marginTop: 12 }} onClick={() => navigate({ page: "market" })}>Back to the marketplace</button>
      </div>
    );
  }
  if (!detail) return <div className="af-skel" style={{ height: 420 }} />;

  const a = detail.asset;
  const [ns, name] = a.slug.split("/");
  const shortlisted = view?.shortlist.includes(a.id);
  const readme = detail.files.find((f) => f.path === (a.type === "skill" ? "SKILL.md" : "README.md")) ?? detail.files[0];
  const tabs: { id: AssetTab; label: string; count?: number; icon?: React.ReactNode }[] = [
    { id: "overview", label: a.type === "skill" ? "Skill card" : "Overview" },
    { id: "files", label: "Files", count: detail.files.length },
    ...(a.runnable ? [{ id: "run" as const, label: "Try it", icon: <Play size={12} /> }] : []),
    { id: "lineage", label: "Lineage", count: a.children },
    { id: "versions", label: "Versions", count: a.versions.length },
    { id: "reviews", label: "Reviews", count: a.reviews.length },
  ];
  const go = (t: AssetTab) => navigate({ page: "asset", slug: a.slug, tab: t });

  return (
    <div>
      <div className="af-crumbs">
        <button type="button" className="af-link" onClick={() => navigate({ page: "market" })}><ArrowLeft size={13} /> Marketplace</button>
        <ChevronRight size={13} /><span>{TYPE_LABEL[a.type]}s</span><ChevronRight size={13} /><span>{ns}</span>
      </div>

      <header className="af-asset-header">
        <AssetIcon type={a.type} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="af-pkg"><span className="ns">{ns} /</span> {name}</h1>
          <div className="af-row" style={{ gap: 6, marginTop: 6 }}>
            <span className="af-tag type af-mono" style={{ textTransform: "none" }}>v{a.version}</span>
            <TrustTag t={a.trust} />
            <VisibilityTag v={a.visibility} />
            {a.extends && <button type="button" className="af-tag v-workspace" style={{ border: 0, cursor: "pointer" }} onClick={() => navigate({ page: "asset", slug: a.extends!.ref.split("@")[0], tab: "overview" })}><GitBranch size={11} />extends {a.extends.ref}</button>}
            {a.sensitive && <span className="af-tag bad"><Lock size={11} />Confidential</span>}
            <Stars rating={a.rating} count={a.ratingCount} />
            <span className="af-muted" style={{ fontSize: 12.5 }}>· {num(a.deployments)} deployments · {a.forks} inherited/forked</span>
          </div>
          <p style={{ marginTop: 8, color: "var(--ink-2)", maxWidth: 820 }}><b style={{ color: "var(--ink)" }}>{a.name}.</b> {a.summary}</p>
        </div>
        <div className="af-row" style={{ alignSelf: "flex-start" }}>
          <button type="button" className="af-btn" onClick={() => act({ type: "asset.shortlist", assetId: a.id }, { success: shortlisted ? "Removed from shortlist" : "Shortlisted" })}>{shortlisted ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}{shortlisted ? "Shortlisted" : "Shortlist"}</button>
          {(!a.sensitive || a.mine) && <button type="button" className="af-btn" onClick={() => act({ type: "asset.fork", assetId: a.id }, { success: `Forked into ${view?.actor.person.org.name} as a private copy with all files` })}><GitFork size={14} />Fork</button>}
          {a.runnable && <button type="button" className="af-btn primary" onClick={() => go("run")}><Play size={14} />Try it</button>}
        </div>
      </header>

      <nav className="af-subtabs" aria-label="Package sections">
        {tabs.map((t) => (
          <button key={t.id} type="button" aria-current={tab === t.id ? "page" : undefined} onClick={() => go(t.id)}>
            {t.icon}{t.label}{t.count !== undefined && t.count > 0 && <span className="af-count">{t.count}</span>}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="af-split" style={{ gridTemplateColumns: "minmax(0, 1fr) 340px" }}>
          <div className="af-card pad-lg">
            {detail.resolved && (
              <div className="af-row between" style={{ marginBottom: 12 }}>
                <div className="af-chips" role="group" aria-label="Document">
                  <button type="button" className="af-chip" aria-pressed={doc === "own"} onClick={() => setDoc("own")}>This package&apos;s SKILL.md</button>
                  <button type="button" className="af-chip" aria-pressed={doc === "resolved"} onClick={() => setDoc("resolved")}>Resolved with parent</button>
                </div>
                <span className="af-muted af-mono" style={{ fontSize: 12 }}>{detail.resolved.chain.join(" → ")}</span>
              </div>
            )}
            {doc === "resolved" && detail.resolved ? (
              <>
                {detail.resolved.overriddenParams.length > 0 && (
                  <div className="af-banner info" style={{ marginBottom: 12 }}>
                    <GitBranch size={15} />
                    <div>Overrides: {detail.resolved.overriddenParams.map((p) => <span key={p.key} style={{ marginRight: 10 }}><code className="af-ic">{p.key}</code> {p.from} → <b>{p.to}</b></span>)}</div>
                  </div>
                )}
                <Markdown source={detail.resolved.md} />
              </>
            ) : readme ? <Markdown source={readme.content} /> : <p className="af-muted">{a.description}</p>}
            {a.includes.length > 0 && (
              <>
                <h2 className="af-h2" style={{ marginTop: 24 }}>Bundled components</h2>
                <div className="af-grid c2" style={{ marginTop: 10 }}>
                  {a.includes.map((id) => byId.get(id) && (
                    <button key={id} type="button" className="af-mini" onClick={() => navigate({ page: "asset", slug: byId.get(id)!.slug, tab: "overview" })}>
                      <AssetIcon type={byId.get(id)!.type} size={28} />
                      <span><span className="af-mono" style={{ fontSize: 12.5 }}>{byId.get(id)!.ref}</span><br /><span className="af-muted" style={{ fontSize: 12 }}>{byId.get(id)!.summary}</span></span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <Sidebar detail={detail} />
        </div>
      )}

      {tab === "files" && <FilesTab detail={detail} path={path} onSaved={load} />}
      {tab === "run" && <Playground detail={detail} />}

      {tab === "lineage" && (
        <div className="af-split" style={{ gridTemplateColumns: "minmax(0, 1fr) 340px" }}>
          <div className="af-card pad-lg">
            <div className="af-h2" style={{ marginBottom: 4 }}>Lineage</div>
            <p className="af-muted" style={{ marginBottom: 14 }}>Packages that <b>extend</b> this one inherit its instructions and schema and pin a version; <b>forks</b> are independent copies. You only see branches you&apos;re allowed to see.</p>
            {detail.lineage.ancestors.length > 0 && (
              <div className="af-row" style={{ marginBottom: 12 }}>
                {detail.lineage.ancestors.map((x) => <span key={x.id} className="af-row nowrap" style={{ gap: 4 }}><button type="button" className="af-btn sm af-mono" onClick={() => navigate({ page: "asset", slug: x.slug, tab: "lineage" })}>{x.slug}@{x.version}</button><ChevronRight size={14} /></span>)}
                <span className="af-mono" style={{ fontWeight: 600 }}>{a.ref}</span>
              </div>
            )}
            <LineageTree node={detail.lineage.tree} current={a.id} />
            {detail.lineage.tree.children.length === 0 && <div className="af-empty" style={{ marginTop: 14 }}>Nothing inherits from this package yet{a.type === "skill" || a.type === "blueprint" ? " — be the first." : "."}</div>}
          </div>
          <div className="af-card">
            <div className="af-h3">How inheritance resolves</div>
            <ul className="af-bullets">
              <li>Frontmatter keys: child wins; <code className="af-ic">extends</code> pins the parent version.</li>
              <li><b>Instructions</b>, <b>Guardrails</b>, <b>Examples</b>: child appends to the parent.</li>
              <li><b>Parameters</b>: merged key by key, child wins.</li>
              <li>Output schema: inherited unless the child ships its own.</li>
              <li>A child can never be more visible than its parent.</li>
            </ul>
            {(a.type === "skill" || a.type === "blueprint") && <button type="button" className="af-btn primary" style={{ marginTop: 12, width: "100%" }} onClick={() => navigate({ page: "inherit", slug: a.slug })}><GitBranch size={14} />Inherit {a.ref}</button>}
          </div>
        </div>
      )}

      {tab === "versions" && (
        <div className="af-stack" style={{ gap: 14 }}>
          <div className="af-card">
            <div className="af-h3" style={{ marginBottom: 6 }}><History size={14} /> Releases</div>
            <ul className="af-list">
              {[...a.versions].reverse().map((v, i) => (
                <li key={`${v.version}-${i}`}><span className="af-tag type af-mono" style={{ textTransform: "none" }}>v{v.version}</span><span style={{ flex: 1 }}>{v.note}</span>{i === 0 && <span className="af-tag ok">latest</span>}<span className="af-muted" style={{ fontSize: 12 }}>{v.at}</span></li>
              ))}
            </ul>
          </div>
          {detail.history.map((h, i) => (
            <div key={i} className="af-card" style={{ padding: 0, overflow: "hidden" }}>
              <div className="af-file-head">
                <GitCommitHorizontal size={15} /><b>{h.note}</b><span className="af-muted">· {h.author} · v{h.version} · <span className="af-mono">{h.path}</span></span>
              </div>
              <DiffView lines={diffLines(h.before, h.after)} maxHeight={420} />
            </div>
          ))}
          {detail.history.length === 0 && <p className="af-muted">Platform commits show up here with full diffs. {detail.canEdit ? "Edit a file in the Files tab to publish a new version." : ""}</p>}
        </div>
      )}

      {tab === "reviews" && <Reviews detail={detail} />}
    </div>
  );
}
