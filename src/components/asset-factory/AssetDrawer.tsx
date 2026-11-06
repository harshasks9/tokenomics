"use client";

import { Bookmark, BookmarkCheck, GitFork, Globe, Layers, Lock, Share2, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFactory } from "./state";
import { AssetIcon, OrgName, Stars, TRUST, TYPE_LABEL, TrustTag, VIS, VisibilityTag, num, usd } from "./ui";

export default function AssetDrawer() {
  const { view, assetId, openAsset, act, persona, setTab, draft, setDraft, setStudioTarget } = useFactory();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [targetWs, setTargetWs] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openAsset(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAsset]);

  if (!view || !assetId) return null;
  const a = view.assets.find((x) => x.id === assetId);
  if (!a) {
    return (
      <>
        <div className="af-scrim" onClick={() => openAsset(null)} />
        <aside className="af-drawer" role="dialog" aria-label="Asset">
          <button type="button" className="af-btn ghost af-drawer-close" onClick={() => openAsset(null)} aria-label="Close"><X size={18} /></button>
          <div className="af-empty" style={{ marginTop: 40 }}>This asset isn&apos;t available to you as {view.actor.person.name}.</div>
        </aside>
      </>
    );
  }
  const byId = new Map(view.assets.map((x) => [x.id, x]));
  const shortlisted = view.shortlist.includes(a.id);
  const buildable = view.workspaces.filter((w) => !w.activated && w.myResponsibilities.some((r) => r === "owner" || r === "architecture" || r === "integration"));
  const shareable = view.workspaces.filter((w) => !a.sharedInto.some((s) => s.id === w.id));
  const monthly = a.costPerExecution * 1000;

  const addToStudio = () => {
    if (a.type === "blueprint") setDraft({ blueprintId: a.id, componentIds: draft.componentIds.length ? draft.componentIds : a.includes });
    else if (!draft.componentIds.includes(a.id)) setDraft({ ...draft, componentIds: [...draft.componentIds, a.id] });
    setStudioTarget("draft");
    openAsset(null);
    setTab("studio");
  };

  return (
    <>
      <div className="af-scrim" onClick={() => openAsset(null)} />
      <aside className="af-drawer" role="dialog" aria-modal="true" aria-label={a.name}>
        <button type="button" className="af-btn ghost af-drawer-close" onClick={() => openAsset(null)} aria-label="Close"><X size={18} /></button>
        <div className="af-row nowrap" style={{ alignItems: "flex-start", gap: 12, paddingRight: 40 }}>
          <AssetIcon type={a.type} size={44} />
          <div>
            <div className="af-eyebrow">{TYPE_LABEL[a.type]} · v{a.version}</div>
            <h2 className="af-h1" style={{ fontSize: 21 }}>{a.name}</h2>
            <div className="af-muted" style={{ fontSize: 13, marginTop: 2 }}>
              <OrgName org={a.owner} label={a.ownerLabel} />
              {a.contributor && <> · {a.contributor.name}, {a.contributor.title}</>}
            </div>
          </div>
        </div>

        <div className="af-row" style={{ marginTop: 12 }}>
          <TrustTag t={a.trust} />
          <VisibilityTag v={a.visibility} />
          {a.sensitive && <span className="af-tag bad"><Lock size={11} />Confidential — never publishable</span>}
          <Stars rating={a.rating} count={a.ratingCount} />
        </div>
        <p className="af-muted" style={{ fontSize: 12.5, marginTop: 8 }}>{TRUST[a.trust].help} {VIS[a.visibility].help}</p>

        <div className="af-row" style={{ marginTop: 14 }}>
          <button type="button" className="af-btn primary" onClick={addToStudio}><Layers size={14} />{a.type === "blueprint" ? "Assemble from this" : "Add to Assembly Studio"}</button>
          <button type="button" className="af-btn" onClick={() => act({ type: "asset.shortlist", assetId: a.id }, { success: shortlisted ? "Removed from shortlist" : "Shortlisted" })}>
            {shortlisted ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}{shortlisted ? "Shortlisted" : "Shortlist"}
          </button>
          {!a.sensitive || a.mine ? (
            <button type="button" className="af-btn" onClick={() => act({ type: "asset.fork", assetId: a.id }, { success: `Forked into ${view.actor.person.org.name} as a private copy` })}><GitFork size={14} />Fork</button>
          ) : null}
        </div>

        {buildable.length > 0 && (
          <div className="af-card flat" style={{ marginTop: 14 }}>
            <label className="af-label" htmlFor="af-add-ws">Add to a workspace you collaborate on</label>
            <div className="af-row nowrap">
              <select id="af-add-ws" className="af-select" value={targetWs} onChange={(e) => setTargetWs(e.target.value)}>
                <option value="">Choose workspace…</option>
                {buildable.map((w) => <option key={w.id} value={w.id}>{w.name} — {w.customer?.name ?? w.owner.name}</option>)}
              </select>
              <button type="button" className="af-btn" disabled={!targetWs} onClick={() => act(
                a.type === "blueprint" ? { type: "workspace.selectBlueprint", workspaceId: targetWs, assetId: a.id } : { type: "workspace.addComponent", workspaceId: targetWs, assetId: a.id },
                { success: `Added to ${buildable.find((w) => w.id === targetWs)?.name}` },
              )}>Add</button>
            </div>
          </div>
        )}

        {a.mine && (
          <div className="af-card flat" style={{ marginTop: 14, borderColor: "#c5cae9" }}>
            <div className="af-h3" style={{ marginBottom: 6 }}>Owner controls · {view.actor.person.org.name}</div>
            {a.visibility === "org" && shareable.length > 0 && (
              <div className="af-row nowrap" style={{ marginBottom: 8 }}>
                <select className="af-select" value={targetWs} onChange={(e) => setTargetWs(e.target.value)} aria-label="Workspace to share into">
                  <option value="">Share into workspace…</option>
                  {shareable.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
                <button type="button" className="af-btn" disabled={!targetWs} onClick={() => act({ type: "asset.shareToWorkspace", assetId: a.id, workspaceId: targetWs }, { success: "Shared — only that workspace's collaborators gain access" })}><Share2 size={14} />Share</button>
              </div>
            )}
            <div className="af-row">
              {a.visibility === "org" && <button type="button" className="af-btn" onClick={() => window.confirm(`Publish “${a.name}” to the public community marketplace? Every authorized user will see it.`) && act({ type: "asset.publish", assetId: a.id, visibility: "public" }, { success: "Published to the community marketplace" })}><Globe size={14} />Publish publicly</button>}
              {a.visibility === "public" && <button type="button" className="af-btn" onClick={() => act({ type: "asset.publish", assetId: a.id, visibility: "org" }, { success: "Unpublished — now organization private" })}><Lock size={14} />Make private</button>}
            </div>
            {a.sharedInto.length > 0 && <p className="af-muted" style={{ fontSize: 12.5, marginTop: 8 }}>Shared into: {a.sharedInto.map((s) => s.name).join(", ")}</p>}
          </div>
        )}

        <hr className="af-divider" />
        <p style={{ color: "var(--ink-2)" }}>{a.description}</p>
        {a.outcomes.length > 0 && <div className="af-row" style={{ marginTop: 10 }}>{a.outcomes.map((o) => <span key={o} className="af-tag ok">{o}</span>)}</div>}

        <div className="af-grid c2" style={{ marginTop: 16 }}>
          <div>
            <div className="af-h3">Deployment prerequisites</div>
            {a.prerequisites.length ? <ul className="af-bullets">{a.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul> : <p className="af-muted" style={{ fontSize: 13 }}>None beyond a Gemini 10 project.</p>}
          </div>
          <div>
            <div className="af-h3">Security considerations</div>
            {a.security.length ? <ul className="af-bullets">{a.security.map((p) => <li key={p}>{p}</li>)}</ul> : <p className="af-muted" style={{ fontSize: 13 }}>Not documented — ask the contributor.</p>}
          </div>
        </div>

        <div className="af-card flat" style={{ marginTop: 16 }}>
          <div className="af-h3">Consumption economics <span className="af-muted" style={{ fontWeight: 400, fontSize: 12 }}>· modeled</span></div>
          <dl className="af-kv" style={{ marginTop: 8 }}>
            <dt>Per execution</dt><dd className="af-num">{a.costPerExecution ? `$${a.costPerExecution.toFixed(3)}` : "No model calls"}</dd>
            <dt>At 1,000 runs/month</dt><dd className="af-num">{usd(monthly)}</dd>
            <dt>Time saved per run</dt><dd>{a.minutesSaved ? `${a.minutesSaved} min of analyst time` : "Enabler — value shows up in the agent using it"}</dd>
            <dt>In production</dt><dd>{num(a.deployments)} deployments · {a.forks} forks</dd>
          </dl>
        </div>

        {a.includes.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div className="af-h3">Bundled components</div>
            <div className="af-row" style={{ marginTop: 6 }}>
              {a.includes.map((id) => byId.get(id) && <button key={id} type="button" className="af-btn sm" onClick={() => openAsset(id)}>{byId.get(id)!.name}</button>)}
            </div>
          </div>
        )}

        {(a.requires.length > 0 || a.provides.length > 0) && (
          <p className="af-muted" style={{ fontSize: 12.5, marginTop: 12 }}>
            {a.requires.length > 0 && <>Needs: {a.requires.join(", ")}. </>}
            {a.provides.length > 0 && <>Provides: {a.provides.join(", ")}.</>}
          </p>
        )}
        {a.forkedFrom && <p className="af-muted" style={{ fontSize: 12.5, marginTop: 6 }}>Forked from <button type="button" className="af-btn ghost sm" onClick={() => openAsset(a.forkedFrom!.id)}>{a.forkedFrom.name}</button></p>}

        <div style={{ marginTop: 16 }}>
          <div className="af-h3">Versions</div>
          <ul className="af-list" style={{ marginTop: 4 }}>
            {[...a.versions].reverse().map((v) => (
              <li key={v.version}><span className="af-tag type" style={{ textTransform: "none" }}>v{v.version}</span><span style={{ flex: 1, fontSize: 13 }}>{v.note}</span><span className="af-muted" style={{ fontSize: 12 }}>{v.at}</span></li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 16 }}>
          <div className="af-h3">Reviews</div>
          {a.reviews.length ? (
            <ul className="af-list" style={{ marginTop: 4 }}>
              {a.reviews.map((r) => (
                <li key={r.id} style={{ flexDirection: "column", gap: 2 }}>
                  <div className="af-row"><Stars rating={r.rating} count={1} /><b style={{ fontSize: 13 }}>{r.reviewer}</b><span className="af-muted" style={{ fontSize: 12 }}>{r.reviewerOrg} · {r.at}</span></div>
                  {r.text && <div style={{ fontSize: 13, color: "var(--ink-2)" }}>{r.text}</div>}
                </li>
              ))}
            </ul>
          ) : <p className="af-muted" style={{ fontSize: 13 }}>No written reviews yet.</p>}
          {!a.mine && (
            <form className="af-card flat" style={{ marginTop: 10 }} onSubmit={(e) => { e.preventDefault(); void act({ type: "asset.review", assetId: a.id, rating, text }, { success: "Review posted" }).then((ok) => ok && setText("")); }}>
              <div className="af-row" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" className="af-btn ghost sm" role="radio" aria-checked={rating === n} onClick={() => setRating(n)} aria-label={`${n} stars`} style={{ padding: 2 }}>
                    <Star size={18} className="af-star" fill={n <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
                <span className="af-muted" style={{ fontSize: 12 }}>as {view.actor.person.name} ({persona === "google" ? "Google" : view.actor.person.org.name})</span>
              </div>
              <textarea className="af-textarea" style={{ marginTop: 8, minHeight: 60 }} value={text} onChange={(e) => setText(e.target.value)} placeholder="What worked, what to watch for…" maxLength={400} />
              <button type="submit" className="af-btn sm" style={{ marginTop: 8 }}>Post review</button>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}
