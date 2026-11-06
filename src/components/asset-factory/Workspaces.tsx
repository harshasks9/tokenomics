"use client";

import { AlertTriangle, CircleCheck, Clock, FolderPlus, Layers, Lock, Rocket, UserPlus } from "lucide-react";
import { useState } from "react";
import { SPRINT_PLAN } from "@/lib/asset-factory/journey";
import type { Responsibility } from "@/lib/asset-factory/types";
import type { WorkspaceView } from "@/lib/asset-factory/views";
import { useFactory } from "./state";
import Lifecycle from "./Lifecycle";
import { AssetIcon, Avatar, EvalList, OrgName, ReadinessList, TrustTag, VisibilityTag, kindToPersona, num, usd } from "./ui";

const RESP_LABEL: Record<Responsibility, string> = {
  owner: "Owner", architecture: "Architecture", integration: "Integration", acceptance: "Acceptance", observer: "Observer",
};

const COPY = {
  customer: { eyebrow: "My Agents", title: "Your agents and Gemini 10 workspaces", lede: "Workspaces are private to your organization until you invite someone. Every collaborator, their organization and what they did is visible here." },
  google: { eyebrow: "Engagements", title: "Customer engagements you're part of", lede: "You only see engagements a customer invited you into. Track readiness, blockers and sprint milestones across them." },
  partner: { eyebrow: "Customer projects", title: "Customer projects you're delivering", lede: "Projects you were invited into, with the responsibilities the customer assigned to Lattice." },
} as const;

export function SprintTimeline({ ws }: { ws: WorkspaceView }) {
  const blockedDays = new Set(ws.sprint.blockers.filter((b) => !b.resolved).map((b) => b.day));
  return (
    <div className="af-days" aria-label={`Sprint day ${ws.sprint.day} of 10`}>
      {SPRINT_PLAN.map((label, i) => {
        const d = i + 1;
        const cls = blockedDays.has(d) ? "blocked" : d <= ws.sprint.day ? "done" : "";
        return <div key={d} className={`af-day ${cls}`} title={label}><b>{d}</b>{blockedDays.has(d) ? "blocked" : d <= ws.sprint.day ? "done" : "day"}</div>;
      })}
    </div>
  );
}

function Invite({ ws }: { ws: WorkspaceView }) {
  const { view, act } = useFactory();
  const [userId, setUserId] = useState("");
  const [resp, setResp] = useState<Responsibility[]>(["integration"]);
  const [consent, setConsent] = useState(false);
  if (!view) return null;
  const candidates = view.directory.filter((p) => !ws.members.some((m) => m.person.id === p.id));
  const person = candidates.find((p) => p.id === userId);
  const external = person && person.org.id !== view.actor.person.org.id;
  return (
    <form className="af-card flat" onSubmit={(e) => {
      e.preventDefault();
      void act({ type: "workspace.invite", workspaceId: ws.id, userId, responsibilities: resp }, { success: `${person?.name} can now see this workspace — and only this workspace` }).then((ok) => { if (ok) { setUserId(""); setConsent(false); } });
    }}>
      <div className="af-h3" style={{ marginBottom: 8 }}><UserPlus size={14} /> Invite a collaborator</div>
      <select className="af-select" value={userId} onChange={(e) => { setUserId(e.target.value); setConsent(false); }} aria-label="Person">
        <option value="">Choose a verified person…</option>
        {candidates.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.title}, {p.org.name}</option>)}
      </select>
      <div className="af-chips" style={{ marginTop: 8 }}>
        {(["architecture", "integration", "acceptance", "observer"] as Responsibility[]).map((r) => (
          <button key={r} type="button" className="af-chip" aria-pressed={resp.includes(r)} onClick={() => setResp(resp.includes(r) ? resp.filter((x) => x !== r) : [...resp, r])}>{RESP_LABEL[r]}</button>
        ))}
      </div>
      {external && (
        <label className="af-check af-consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>I grant <b>{person!.org.name}</b> access to this workspace only — its architecture, configuration, evaluations and activity. {view.actor.person.org.name}&apos;s other workspaces and private assets stay private.</span>
        </label>
      )}
      <button type="submit" className="af-btn primary sm" style={{ marginTop: 10 }} disabled={!userId || !resp.length || (external && !consent)}>Grant access</button>
    </form>
  );
}

function Detail({ ws }: { ws: WorkspaceView }) {
  const { view, act, setTab, setStudioTarget, openAsset, persona } = useFactory();
  if (!view) return null;
  const byId = new Map(view.assets.map((a) => [a.id, a]));
  const me = view.actor.person;
  const isOwner = ws.myResponsibilities.includes("owner");
  const isArch = ws.myResponsibilities.includes("architecture");
  const approved = ws.members.find((m) => m.person.id === me.id)?.approved;
  const ready = ws.readiness.every((r) => r.pass);
  const allApproved = ws.members.every((m) => m.approved);
  const openBlockers = ws.sprint.blockers.filter((b) => !b.resolved);
  const shared = view.assets.filter((a) => a.sharedInto.some((s) => s.id === ws.id));
  const contributions = view.contributions.filter((c) => c.workspaceId === ws.id);
  const parts = [ws.blueprintId, ...ws.componentIds].filter((x): x is string => Boolean(x)).map((id) => byId.get(id)).filter(Boolean);

  return (
    <div className="af-stack" style={{ gap: 16 }}>
      <div className="af-card pad-lg">
        <div className="af-row between">
          <div>
            <div className="af-eyebrow">{ws.customer?.name ?? ws.owner.name} · shared workspace</div>
            <h2 className="af-h1" style={{ fontSize: 22 }}>{ws.name}</h2>
            <p className="af-muted" style={{ marginTop: 2 }}>{ws.problem}</p>
          </div>
          <div className="af-row">
            <span className={`af-tag ${ws.activated ? "ok" : ws.sprint.day ? "warn" : ""}`}>{ws.activated ? "In production" : ws.sprint.day ? `Sprint day ${ws.sprint.day}/10` : "Assembling"}</span>
            <button type="button" className="af-btn sm" onClick={() => { setStudioTarget(ws.id); setTab("studio"); }}><Layers size={13} />Open in Assembly Studio</button>
          </div>
        </div>
        <div style={{ marginTop: 14 }}><Lifecycle stage={ws.stage} compact /></div>
      </div>

      <div className="af-split even">
        <div className="af-card">
          <div className="af-card-head"><h3 className="af-h3">Collaborators</h3><span className="af-muted" style={{ fontSize: 12 }}>{new Set(ws.members.map((m) => m.person.org.id)).size} organizations</span></div>
          <ul className="af-list">
            {ws.members.map((m) => (
              <li key={m.person.id}>
                <Avatar initials={m.person.initials} kind={m.person.org.kind} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{m.person.name}{m.person.id === me.id && <span className="af-muted"> (you)</span>}</div>
                  <div className="af-muted" style={{ fontSize: 12 }}>{m.person.title} · <OrgName org={m.person.org} /></div>
                  <div className="af-row" style={{ gap: 4, marginTop: 4 }}>{m.responsibilities.map((r) => <span key={r} className={`af-tag p-${kindToPersona(m.person.org.kind)}`}>{RESP_LABEL[r]}</span>)}</div>
                </div>
                {m.approved ? <span className="af-tag ok"><CircleCheck size={11} />Signed off</span> : <span className="af-tag"><Clock size={11} />Pending</span>}
              </li>
            ))}
          </ul>
          {isOwner && !ws.activated && <div style={{ marginTop: 10 }}><Invite ws={ws} /></div>}
          {!isOwner && <p className="af-muted" style={{ fontSize: 12, marginTop: 8 }}><Lock size={11} /> Only the owner ({ws.owner.name}) can grant access.</p>}
        </div>

        <div className="af-card">
          <div className="af-card-head"><h3 className="af-h3">Agent architecture</h3><span className="af-muted" style={{ fontSize: 12 }}>{parts.length} assets</span></div>
          <ul className="af-list">
            {parts.map((a) => a && (
              <li key={a.id}>
                <AssetIcon type={a.type} size={26} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <button type="button" className="af-btn ghost" style={{ padding: 0, fontWeight: 580, textAlign: "left", whiteSpace: "normal" }} onClick={() => openAsset(a.id)}>{a.name}</button>
                  <div className="af-muted" style={{ fontSize: 12 }}><OrgName org={a.owner} label={a.ownerLabel} /></div>
                </div>
                {a.visibility !== "public" && <VisibilityTag v={a.visibility} compact />}
                <TrustTag t={a.trust} />
              </li>
            ))}
            {!parts.length && <li className="af-muted">Nothing assembled yet.</li>}
          </ul>
          {shared.length > 0 && <p className="af-muted" style={{ fontSize: 12.5, marginTop: 8 }}>Private assets explicitly shared into this workspace: {shared.map((s) => `${s.name} (${s.ownerLabel})`).join(", ")}.</p>}
        </div>
      </div>

      <div className="af-split even">
        <div className="af-card">
          <div className="af-card-head">
            <h3 className="af-h3">Production readiness</h3>
            {!ws.activated && !approved && <button type="button" className="af-btn sm primary" data-p={persona} disabled={!ready} onClick={() => act({ type: "workspace.approveReadiness", workspaceId: ws.id }, { success: "Signed off" })}>Sign off as {me.name.split(" ")[0]}</button>}
          </div>
          <ReadinessList checks={ws.readiness} />
          <p className="af-muted" style={{ fontSize: 12, marginTop: 8 }}>Every collaborator signs off for their own organization. Changing configuration clears all sign-offs.</p>
        </div>
        <div className="af-card">
          <div className="af-card-head"><h3 className="af-h3">Evaluations = customer acceptance criteria</h3></div>
          <EvalList evals={ws.evals} />
        </div>
      </div>

      <div className="af-card">
        <div className="af-card-head">
          <h3 className="af-h3">10-day Gemini 10 sprint</h3>
          {isArch && ws.sprint.day < 10 && <button type="button" className="af-btn sm primary" data-p="google" disabled={!allApproved || openBlockers.length > 0} onClick={() => act({ type: "sprint.advance", workspaceId: ws.id, toDay: ws.sprint.day + 1 }, { success: "Sprint advanced" })}>Advance a day</button>}
          {isOwner && !ws.activated && <button type="button" className="af-btn sm primary" data-p="customer" disabled={ws.sprint.day < 10} onClick={() => act({ type: "workspace.activate", workspaceId: ws.id }, { success: "Agent is live in production" })}><Rocket size={13} />Activate</button>}
        </div>
        <SprintTimeline ws={ws} />
        <div className="af-muted" style={{ fontSize: 12.5, marginTop: 8 }}>{ws.sprint.day < 10 ? `Next: day ${ws.sprint.day + 1} — ${SPRINT_PLAN[ws.sprint.day]}` : "Sprint complete."}{!allApproved && ws.sprint.day === 0 ? " Starts once every collaborator signs off readiness." : ""}</div>
        {ws.sprint.blockers.map((b) => (
          <div key={b.id} className={`af-banner ${b.resolved ? "ok" : "warn"}`} style={{ marginTop: 10 }}>
            <AlertTriangle size={15} />
            <div style={{ flex: 1 }}>Day {b.day}: {b.text} <span className="af-muted">· owner: {ws.members.find((m) => m.person.org.id === b.ownerOrgId)?.person.org.name ?? b.ownerOrgId}</span></div>
            {!b.resolved && b.ownerOrgId === me.org.id && <button type="button" className="af-btn sm" onClick={() => act({ type: "sprint.resolveBlocker", workspaceId: ws.id, blockerId: b.id }, { success: "Blocker resolved" })}>Resolve</button>}
            {b.resolved && <span className="af-tag ok">Resolved</span>}
          </div>
        ))}
      </div>

      <div className="af-split even">
        <div className="af-card">
          <div className="af-card-head"><h3 className="af-h3">Consumption projection</h3><span className="af-muted" style={{ fontSize: 12 }}>modeled</span></div>
          <div className="af-grid c2">
            <div><div className="af-metric-label">Executions</div><div className="af-metric-value" style={{ fontSize: 20 }}>{num(ws.economics.executionsPerMonth)}<span className="af-muted" style={{ fontSize: 13 }}>/mo</span></div></div>
            <div><div className="af-metric-label">Run cost</div><div className="af-metric-value" style={{ fontSize: 20 }}>{usd(ws.economics.consumptionPerMonth)}<span className="af-muted" style={{ fontSize: 13 }}>/mo</span></div></div>
            <div><div className="af-metric-label">Planner hours returned</div><div className="af-metric-value" style={{ fontSize: 20 }}>{num(ws.economics.hoursSavedPerMonth)}<span className="af-muted" style={{ fontSize: 13 }}>/mo</span></div></div>
            <div><div className="af-metric-label">Modeled value</div><div className="af-metric-value" style={{ fontSize: 20 }}>{usd(ws.economics.valuePerMonth)}<span className="af-muted" style={{ fontSize: 13 }}> · {ws.economics.roi.toFixed(1)}×</span></div></div>
          </div>
        </div>
        <div className="af-card">
          <div className="af-card-head"><h3 className="af-h3">Activity history</h3></div>
          <ul className="af-activity" style={{ maxHeight: 280, overflowY: "auto" }}>
            {ws.activity.map((a, i) => (
              <li key={`${a.seq}-${i}`}>
                <span className="af-dot" data-p={kindToPersona(a.actorKind)} style={{ marginTop: 6 }} />
                <div><b>{a.actor}</b> <span className="af-muted">({a.actorOrg})</span> — {a.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {contributions.length > 0 && (
        <div className="af-card">
          <div className="af-card-head"><h3 className="af-h3">Contributions from this workspace</h3><button type="button" className="af-btn sm" onClick={() => setTab("assets")}>Open contributions</button></div>
          <ul className="af-list">{contributions.map((c) => <li key={c.id}><b style={{ flex: 1 }}>{c.title}</b><span className="af-tag">{c.status.replace("-", " ")}</span></li>)}</ul>
        </div>
      )}
    </div>
  );
}

export default function Workspaces() {
  const { view, persona, workspaceId, openWorkspace, act } = useFactory();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [problem, setProblem] = useState("");
  if (!view) return null;
  const copy = COPY[persona];
  const ws = view.workspaces.find((w) => w.id === workspaceId) ?? view.workspaces.find((w) => !w.seeded) ?? view.workspaces[0];

  return (
    <div>
      <div className="af-page-head">
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="af-eyebrow">{copy.eyebrow}</div>
          <h1 className="af-h1">{copy.title}</h1>
          <p className="af-lede">{copy.lede}</p>
        </div>
        <button type="button" className="af-btn" onClick={() => setCreating(!creating)}><FolderPlus size={14} />New workspace</button>
      </div>

      {creating && (
        <form className="af-card" style={{ marginBottom: 16 }} onSubmit={(e) => {
          e.preventDefault();
          const id = `ws-j${view.seq + 1}`;
          void act({ type: "workspace.create", name, problem }, { success: "Workspace created — private to your organization" }).then((ok) => { if (ok) { openWorkspace(id); setCreating(false); setName(""); setProblem(""); } });
        }}>
          <div className="af-grid c2">
            <div><label className="af-label" htmlFor="nw-name">Name</label><input id="nw-name" className="af-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Supplier onboarding" /></div>
            <div><label className="af-label" htmlFor="nw-prob">Business problem</label><input id="nw-prob" className="af-input" value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="What should this agent fix?" /></div>
          </div>
          <button type="submit" className="af-btn primary sm" style={{ marginTop: 10 }} disabled={name.trim().length < 3}>Create private workspace</button>
        </form>
      )}

      {view.workspaces.length === 0 ? (
        <div className="af-empty">No workspaces yet. {persona === "customer" ? "Create one to start." : "A customer has to invite you before you see their workspace."}</div>
      ) : (
        <>
          <div className="af-row" style={{ gap: 8, marginBottom: 16 }}>
            {view.workspaces.map((w) => (
              <button key={w.id} type="button" className="af-chip" aria-pressed={ws?.id === w.id} onClick={() => openWorkspace(w.id)}>
                {w.name} <span style={{ opacity: 0.7 }}>· {w.customer?.name ?? w.owner.name}</span>
              </button>
            ))}
          </div>
          {ws && <Detail key={ws.id} ws={ws} />}
        </>
      )}
    </div>
  );
}
