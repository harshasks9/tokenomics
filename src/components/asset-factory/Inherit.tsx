"use client";

import { ArrowLeft, GitBranch, LoaderCircle, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { childTemplate, diffLines, kebab, parseSkill, resolveChain } from "@/lib/asset-factory/skillmd";
import type { Visibility } from "@/lib/asset-factory/types";
import type { AssetDetail } from "@/lib/asset-factory/views";
import { useFactory } from "./state";
import { CodeView, DiffView, Markdown } from "./md";
import { VIS } from "./ui";

export default function Inherit({ slug }: { slug: string }) {
  const { view, fetchAsset, act, navigate, busy } = useFactory();
  const [parent, setParent] = useState<AssetDetail | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [md, setMd] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("org");
  const [workspaceId, setWorkspaceId] = useState("");
  const [pane, setPane] = useState<"resolved" | "diff" | "rendered">("rendered");
  const [created, setCreated] = useState<string | null>(null);

  const org = view?.actor.person.org;
  const ns = org?.id ?? "me";

  useEffect(() => {
    let live = true;
    void fetchAsset(slug).then((d) => {
      if (!live) return;
      setParent(d);
      if (d) {
        const parentMd = d.files.find((f) => f.path === "SKILL.md")?.content ?? d.files.find((f) => f.path === "prompts/planner.md")?.content ?? "";
        const base = d.asset.name.replace(/\s*\(fork\)$/, "");
        const childName = `${base} — ${org?.name.split(" ")[0] ?? "Custom"}`;
        setName(childName);
        setMd(childTemplate({ parentRef: d.asset.ref, parentMd, name: kebab(`${org?.name.split(" ")[0] ?? "my"} ${base}`), namespace: ns, description: `${d.asset.summary.replace(/\.$/, "")}, tuned for ${org?.name ?? "our organization"}.` }));
      }
    });
    return () => { live = false; };
  }, [fetchAsset, slug, org?.name, ns]);

  // After a successful inherit, open the new package once it appears in the view.
  useEffect(() => {
    if (!created || !view) return;
    const a = view.assets.find((x) => x.mine && x.name === created && x.extends?.id === parent?.asset.id);
    if (a) navigate({ page: "asset", slug: a.slug, tab: "overview" }, { replace: true });
  }, [created, view, parent, navigate]);

  const parentMd = parent ? parent.files.find((f) => f.path === "SKILL.md")?.content ?? parent.files.find((f) => f.path === "prompts/planner.md")?.content ?? "" : "";
  const parentLayers = useMemo(() => {
    if (!parent) return [];
    // If the parent itself inherits, its resolved text stands for its whole chain.
    return [{ ref: parent.asset.ref, md: parent.resolved?.md ?? parentMd }];
  }, [parent, parentMd]);
  const resolved = useMemo(() => (parent ? resolveChain([...parentLayers, { ref: `${ns}/${kebab(name)}@0.1.0`, md }]) : null), [parent, parentLayers, ns, name, md]);
  const fm = parseSkill(md).frontmatter;
  const pinOk = parent ? fm.extends === parent.asset.ref : false;

  if (parent === undefined) return <div className="af-skel" style={{ height: 480 }} />;
  if (parent === null) {
    return <div className="af-empty"><Lock size={18} /> <b>{slug}</b> isn&apos;t available to you, so it can&apos;t be inherited.</div>;
  }
  const p = parent.asset;
  const canPublic = p.visibility === "public";
  const options: Visibility[] = ["org", "workspace", ...(canPublic ? ["public" as const] : []), ...(view?.actor.persona === "google" ? ["internal" as const] : [])];

  const submit = async () => {
    const ok = await act({ type: "asset.inherit", baseId: p.id, name: name.trim(), visibility, skillMd: md, workspaceId: visibility === "workspace" ? workspaceId : undefined }, { success: `Created ${ns}/${kebab(String(fm.name ?? name))} — it extends ${p.ref}` });
    if (ok) setCreated(name.trim());
  };

  return (
    <div>
      <div className="af-crumbs">
        <button type="button" className="af-link" onClick={() => navigate({ page: "asset", slug: p.slug, tab: "overview" })}><ArrowLeft size={13} /> {p.ref}</button>
      </div>
      <div className="af-page-head">
        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="af-eyebrow">Inherit a {p.type}</div>
          <h1 className="af-h1"><GitBranch size={22} style={{ verticalAlign: -3 }} /> Extend <span className="af-mono">{p.ref}</span></h1>
          <p className="af-lede">Your package keeps everything in the parent — instructions, guardrails, examples, output schema — and pins its version. Write only what&apos;s different for {org?.name}. The preview on the right is exactly what the runtime will execute.</p>
        </div>
      </div>

      <div className="af-inherit">
        <div className="af-stack" style={{ gap: 12 }}>
          <div className="af-card">
            <div className="af-grid c2">
              <div><label className="af-label" htmlFor="ih-name">Display name</label><input id="ih-name" className="af-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div>
                <label className="af-label" htmlFor="ih-vis">Visibility</label>
                <select id="ih-vis" className="af-select" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
                  {options.map((v) => <option key={v} value={v}>{VIS[v].label}</option>)}
                </select>
              </div>
            </div>
            {visibility === "workspace" && (
              <div style={{ marginTop: 10 }}>
                <label className="af-label" htmlFor="ih-ws">Workspace</label>
                <select id="ih-ws" className="af-select" value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)}>
                  <option value="">Choose…</option>
                  {view?.workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            )}
            <p className="af-muted" style={{ fontSize: 12, marginTop: 8 }}>
              {VIS[visibility].help}{!canPublic && " The parent isn't public, so the child can't be either."}{visibility === "public" && " Public packages are scanned for other organizations' names and credentials before they're accepted."}
            </p>
          </div>
          <div className="af-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="af-file-head">
              <b className="af-mono">SKILL.md</b>
              <span className="af-muted">your package</span>
              <span className="af-spacer" />
              {pinOk ? <span className="af-tag ok af-mono">extends {String(fm.extends)}</span> : <span className="af-tag bad">extends must be {p.ref}</span>}
            </div>
            <textarea className="af-editor" style={{ minHeight: 460, borderTop: 0 }} value={md} onChange={(e) => setMd(e.target.value)} spellCheck={false} aria-label="Child SKILL.md" />
          </div>
          <div className="af-row">
            <button type="button" className="af-btn primary lg" disabled={busy || !pinOk || name.trim().length < 3 || (visibility === "workspace" && !workspaceId)} onClick={submit}>
              {busy ? <LoaderCircle size={15} className="af-spin" /> : <GitBranch size={15} />}Create {ns}/{kebab(String(fm.name ?? name))}@0.1.0
            </button>
            <button type="button" className="af-btn lg" onClick={() => navigate({ page: "asset", slug: p.slug, tab: "overview" })}>Cancel</button>
          </div>
        </div>

        <div className="af-card" style={{ padding: 0, overflow: "hidden", position: "sticky", top: 76 }}>
          <div className="af-file-head">
            <div className="af-chips" role="group" aria-label="Preview">
              <button type="button" className="af-chip" aria-pressed={pane === "rendered"} onClick={() => setPane("rendered")}>Resolved skill</button>
              <button type="button" className="af-chip" aria-pressed={pane === "diff"} onClick={() => setPane("diff")}>Diff vs parent</button>
              <button type="button" className="af-chip" aria-pressed={pane === "resolved"} onClick={() => setPane("resolved")}>Raw</button>
            </div>
          </div>
          {resolved && resolved.overriddenParams.length > 0 && (
            <div className="af-banner info" style={{ margin: 12 }}>
              <GitBranch size={14} />
              <div>Overriding: {resolved.overriddenParams.map((o) => <span key={o.key} style={{ marginRight: 10 }}><code className="af-ic">{o.key}</code> {o.from} → <b>{o.to}</b></span>)}</div>
            </div>
          )}
          <div style={{ maxHeight: 720, overflow: "auto" }}>
            {pane === "rendered" && resolved && <div style={{ padding: "4px 18px 18px" }}><Markdown source={resolved.md} /></div>}
            {pane === "resolved" && resolved && <CodeView code={resolved.md} lang="md" />}
            {pane === "diff" && resolved && <DiffView lines={diffLines(parentLayers[0]?.md ?? "", resolved.md)} />}
          </div>
        </div>
      </div>
    </div>
  );
}
