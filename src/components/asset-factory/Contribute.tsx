"use client";

import { CircleCheck, CircleX, Upload } from "lucide-react";
import { useState } from "react";
import type { AssetType, Visibility } from "@/lib/asset-factory/types";
import type { ContributionView } from "@/lib/asset-factory/views";
import { useFactory } from "./state";
import { AssetCard, SectionHead, TYPE_LABEL, VIS } from "./ui";

const COPY = {
  customer: { eyebrow: "Share & contribute", title: "Share with your teams, contribute to the community", lede: "Organization-private assets are shared with everyone at your company. Publishing to the community is your choice, and a scan blocks customer identifiers and secrets first." },
  google: { eyebrow: "Review & contribute", title: "Marketplace review queue and Google contributions", lede: "Contributions reach the review board only after the customer whose engagement produced them grants permission." },
  partner: { eyebrow: "My published assets", title: "Your reusable IP", lede: "Publish skills, connectors and blueprints, keep private IP private, and take improvements from customer projects to the marketplace — with the customer's permission and Google review." },
} as const;

const STATUS: Record<ContributionView["status"], string> = {
  proposed: "Waiting for customer permission",
  "customer-approved": "Waiting for marketplace review",
  reviewed: "Approved — ready to publish",
  published: "Published",
  rejected: "Rejected in review",
};

function ContributionCard({ c }: { c: ContributionView }) {
  const { act, openAsset } = useFactory();
  return (
    <div className="af-card">
      <div className="af-card-head">
        <h3 className="af-h3">{c.title}</h3>
        <span className={`af-tag ${c.status === "published" ? "ok" : c.status === "rejected" ? "bad" : "warn"}`}>{STATUS[c.status]}</span>
      </div>
      <p className="af-muted" style={{ fontSize: 13 }}>{c.summary}</p>
      <p className="af-muted" style={{ fontSize: 12, marginTop: 6 }}>Proposed by {c.proposer.name} ({c.proposer.org.name}) from “{c.workspaceName}” · builds on {c.baseAsset.name}</p>
      <ul className="af-list" style={{ marginTop: 8 }}>
        {c.scan.map((s) => <li key={s.id}>{s.passed ? <CircleCheck size={15} color="var(--ok)" /> : <CircleX size={15} color="var(--bad)" />}<span style={{ fontSize: 13 }}>{s.label}</span></li>)}
      </ul>
      <div className="af-row" style={{ marginTop: 10 }}>
        {c.canApproveCustomer && <button type="button" className="af-btn primary" data-p="customer" onClick={() => window.confirm("Allow this improvement to leave your workspace? The scan shows no customer data or identifiers.") && act({ type: "contribution.approveCustomer", contributionId: c.id }, { success: "Permission granted" })}>Permit reuse</button>}
        {c.canReview && <>
          <button type="button" className="af-btn primary" data-p="google" onClick={() => act({ type: "contribution.review", contributionId: c.id, approve: true }, { success: "Approved in review" })}>Approve</button>
          <button type="button" className="af-btn danger" onClick={() => act({ type: "contribution.review", contributionId: c.id, approve: false }, { success: "Rejected" })}>Reject</button>
        </>}
        {c.canPublish && <button type="button" className="af-btn primary" data-p="partner" onClick={() => act({ type: "contribution.publish", contributionId: c.id }, { success: "Published to the marketplace" })}><Upload size={14} />Publish</button>}
        {c.publishedAssetId && <button type="button" className="af-btn" onClick={() => openAsset(c.publishedAssetId!)}>View listing</button>}
        {c.customerApprovedBy && <span className="af-muted" style={{ fontSize: 12 }}>Permitted by {c.customerApprovedBy}</span>}
        {c.reviewedBy && <span className="af-muted" style={{ fontSize: 12 }}>· reviewed by {c.reviewedBy}</span>}
      </div>
    </div>
  );
}

function NewAsset() {
  const { view, persona, act } = useFactory();
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [type, setType] = useState<AssetType>("skill");
  const [visibility, setVisibility] = useState<Visibility>("org");
  const [workspaceId, setWorkspaceId] = useState("");
  const [industry, setIndustry] = useState("Manufacturing");
  if (!view) return null;
  const options: Visibility[] = persona === "google" ? ["org", "workspace", "public", "internal"] : ["org", "workspace", "public"];
  return (
    <form className="af-card" onSubmit={(e) => {
      e.preventDefault();
      void act({ type: "asset.create", name, summary, assetType: type, visibility, workspaceId: visibility === "workspace" ? workspaceId : undefined, industries: [industry] }, { success: visibility === "public" ? "Published as a community asset" : "Asset saved" })
        .then((ok) => { if (ok) { setName(""); setSummary(""); } });
    }}>
      <div className="af-card-head"><Upload size={16} /><h3 className="af-h3">Contribute an asset</h3></div>
      <div className="af-grid c2">
        <div className="af-field"><label className="af-label" htmlFor="na-name">Name</label><input id="na-name" className="af-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Goods-receipt discrepancy skill" /></div>
        <div className="af-field"><label className="af-label" htmlFor="na-type">Type</label>
          <select id="na-type" className="af-select" value={type} onChange={(e) => setType(e.target.value as AssetType)}>
            {(["blueprint", "skill", "connector", "workflow", "evaluation"] as AssetType[]).map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
          </select>
        </div>
      </div>
      <div className="af-field"><label className="af-label" htmlFor="na-sum">What it does</label><textarea id="na-sum" className="af-textarea" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="One or two sentences. Don't include customer names, data or credentials." /></div>
      <div className="af-grid c2">
        <div className="af-field"><label className="af-label" htmlFor="na-vis">Visibility</label>
          <select id="na-vis" className="af-select" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
            {options.map((v) => <option key={v} value={v}>{VIS[v].label}</option>)}
          </select>
          <div className="af-muted" style={{ fontSize: 12, marginTop: 4 }}>{VIS[visibility].help}</div>
        </div>
        {visibility === "workspace" ? (
          <div className="af-field"><label className="af-label" htmlFor="na-ws">Workspace</label>
            <select id="na-ws" className="af-select" value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)}>
              <option value="">Choose…</option>
              {view.workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        ) : (
          <div className="af-field"><label className="af-label" htmlFor="na-ind">Industry</label>
            <select id="na-ind" className="af-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {["Manufacturing", "Retail", "CPG", "Logistics", "Financial Services", "Insurance", "Utilities", "Food & Beverage"].map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
        )}
      </div>
      {visibility === "public" && <div className="af-banner warn" style={{ marginBottom: 10 }}><span>Publishing publicly lists it as a <b>Community</b> asset under your name and organization. The server scans for other organizations&apos; names and credential-like strings and refuses the publish if it finds any.</span></div>}
      <button type="submit" className="af-btn primary" disabled={name.trim().length < 3 || (visibility === "workspace" && !workspaceId)}>{visibility === "public" ? "Publish to community" : "Save"}</button>
    </form>
  );
}

export default function Contribute() {
  const { view, persona } = useFactory();
  if (!view) return null;
  const copy = COPY[persona];
  const mine = view.assets.filter((a) => a.mine);
  const queue = view.contributions;
  return (
    <div>
      <div className="af-page-head"><div style={{ flex: 1 }}>
        <div className="af-eyebrow">{copy.eyebrow}</div>
        <h1 className="af-h1">{copy.title}</h1>
        <p className="af-lede">{copy.lede}</p>
      </div></div>

      {queue.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionHead title="Contributions" sub="customer permission → marketplace review → publish" />
          <div className="af-grid c2">{queue.map((c) => <ContributionCard key={c.id} c={c} />)}</div>
        </div>
      )}

      <div className="af-split">
        <div>
          <SectionHead title={`${view.actor.person.org.name} assets`} sub={`${mine.filter((a) => a.visibility === "public").length} public · ${mine.filter((a) => a.visibility !== "public").length} private`} />
          {mine.length ? <div className="af-grid c2">{mine.map((a) => <AssetCard key={a.id} a={a} />)}</div> : <div className="af-empty">Nothing yet — fork an asset or contribute one.</div>}
        </div>
        <NewAsset />
      </div>
    </div>
  );
}
