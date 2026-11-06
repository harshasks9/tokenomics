"use client";

import { AlertTriangle, ArrowRight, Factory, FileCode2, GitBranch, Inbox, Play, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { journeyContext, journeyProgress, JOURNEY } from "@/lib/asset-factory/journey";
import type { WorkspaceView } from "@/lib/asset-factory/views";
import { useFactory } from "./state";
import Lifecycle from "./Lifecycle";
import { AssetCard, Metric, SectionHead, Stars, TrustTag, usd } from "./ui";

const HERO = {
  customer: {
    tag: "For Kestrel Industrial",
    title: "Find and deploy an agent that solves your business problem.",
    body: "Start from blueprints already proven in production, see what they need and what they cost to run, and bring in Google or partner engineers when you want help — on your terms.",
  },
  google: {
    tag: "Google Cloud · Forward Deployed Engineering",
    title: "Accelerate customer deployment without rebuilding existing IP.",
    body: "Find what's already working across customers and industries, assemble it in a shared workspace, and land a production agent in a 10-day Gemini 10 engagement.",
  },
  partner: {
    tag: "Lattice Systems Integrators · Premier partner",
    title: "Deliver repeatable customer solutions and scale your agent practice.",
    body: "Build on approved community assets, publish your own skills and connectors, and see where your IP is being adopted.",
  },
} as const;

const PROBLEMS = ["Late supplier deliveries", "Quality deviations", "Invoice mismatches", "Freight claims", "Field service backlog", "KYC backlog"];

function WorkspaceRow({ w }: { w: WorkspaceView }) {
  const { openWorkspace, setTab } = useFactory();
  const blocker = w.sprint.blockers.find((b) => !b.resolved);
  return (
    <li>
      <div style={{ flex: 1, minWidth: 0 }}>
        <button type="button" className="af-btn ghost" style={{ padding: 0, fontWeight: 620 }} onClick={() => { openWorkspace(w.id); setTab("workspaces"); }}>{w.name}</button>
        <div className="af-muted" style={{ fontSize: 12.5 }}>{w.customer?.name ?? w.owner.name} · {w.members.length} collaborators</div>
        {blocker && <div style={{ fontSize: 12.5, color: "var(--bad)", marginTop: 2 }}><AlertTriangle size={12} /> Day {blocker.day} blocker: {blocker.text}</div>}
      </div>
      <span className={`af-tag ${w.activated ? "ok" : w.sprint.day > 0 ? "warn" : ""}`}>
        {w.activated ? "In production" : w.sprint.day > 0 ? `Sprint day ${w.sprint.day}/10` : "Assembling"}
      </span>
    </li>
  );
}

export default function Home() {
  const { view, persona, setTab, setQuery, events, openAsset, navigate } = useFactory();
  const [q, setQ] = useState("");
  const progress = useMemo(() => journeyProgress(journeyContext(events)), [events]);
  if (!view) return null;
  const hero = HERO[persona];
  const byId = new Map(view.assets.map((a) => [a.id, a]));
  const journeyWs = view.workspaces.find((w) => !w.seeded);
  const stage = journeyWs?.stage ?? 0;

  const search = (text: string) => { setQuery(text); setTab("market"); };

  const manufacturing = view.assets
    .filter((a) => a.type === "blueprint" && a.industries.includes("Manufacturing") && a.visibility === "public")
    .sort((a, b) => (b.trust === "verified" ? 1 : 0) - (a.trust === "verified" ? 1 : 0) || b.deployments - a.deployments)
    .slice(0, 3);
  const proven = [...view.assets].filter((a) => a.visibility === "public").sort((a, b) => b.deployments - a.deployments).slice(0, 6);
  const ours = view.assets.filter((a) => a.mine && a.visibility !== "internal").sort((a, b) => b.deployments - a.deployments);
  const recentReviews = ours.flatMap((a) => a.reviews.map((r) => ({ ...r, asset: a }))).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 4);
  const reviewQueue = view.contributions.filter((c) => c.canReview || c.canApproveCustomer || c.canPublish);

  return (
    <div>
      <section className="af-hero" data-p={persona}>
        <div className="af-hero-tag"><Sparkles size={13} />{hero.tag}</div>
        <h1>{hero.title}</h1>
        <p>{hero.body}</p>
        {persona === "customer" && (
          <form className="af-row" style={{ marginTop: 16, maxWidth: 640 }} onSubmit={(e) => { e.preventDefault(); search(q); }}>
            <label className="af-search" style={{ minWidth: 0 }}>
              <span className="af-sr">Describe your business problem</span>
              <Search size={16} />
              <input className="af-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Describe a business problem — e.g. late supplier deliveries" style={{ color: "var(--ink)" }} />
            </label>
            <button className="af-btn primary" type="submit">Find solutions</button>
          </form>
        )}
        <div className="af-row" style={{ marginTop: 16 }}>
          <button type="button" className="af-btn primary lg" onClick={() => setTab("journey")}>
            <Play size={15} />{progress.complete ? "Replay the executive demo" : progress.current === 0 ? "Start the executive demo" : `Continue demo — step ${progress.current + 1} of ${JOURNEY.length}`}
          </button>
          <button type="button" className="af-btn lg" onClick={() => setTab(persona === "partner" ? "assets" : "market")}>
            {persona === "partner" ? "My published assets" : persona === "google" ? "Discover reusable assets" : "Browse industry solutions"} <ArrowRight size={15} />
          </button>
        </div>
        {persona === "customer" && (
          <div className="af-row" style={{ marginTop: 14, gap: 6 }}>
            {PROBLEMS.map((p) => <button key={p} type="button" className="af-btn sm" onClick={() => search(p)}>{p}</button>)}
          </div>
        )}
      </section>

      <div className="af-section">
        <SectionHead title="Start from real packages" sub="Every asset is a versioned package you can read, run and inherit" />
        <div className="af-grid c3">
          <button type="button" className="af-action" onClick={() => navigate({ page: "asset", slug: "google/exception-classification", tab: "files", path: "SKILL.md" })}>
            <span className="af-action-icon" data-k="read"><FileCode2 size={18} /></span>
            <span><b>Read a SKILL.md</b><span className="af-muted">The instructions, guardrails, parameters and output schema the agent actually executes.</span><code className="af-ic">google/exception-classification</code></span>
          </button>
          <button type="button" className="af-action" onClick={() => navigate({ page: "asset", slug: "google/exception-classification", tab: "run" })}>
            <span className="af-action-icon" data-k="run"><Play size={18} /></span>
            <span><b>Run it on an exception</b><span className="af-muted">Send real input, watch the trace, check the output against its schema.</span><code className="af-ic">Try it</code></span>
          </button>
          <button type="button" className="af-action" onClick={() => navigate({ page: "inherit", slug: persona === "partner" ? "google/supply-chain-exception-resolution-agent" : "google/exception-classification" })}>
            <span className="af-action-icon" data-k="inherit"><GitBranch size={18} /></span>
            <span><b>Inherit and customize</b><span className="af-muted">Extend a verified skill with your own instructions and parameters — keep upgrades from the parent.</span><code className="af-ic">extends: …@version</code></span>
          </button>
        </div>
      </div>

      <div className="af-section">
        <SectionHead title={persona === "customer" ? "Your outcomes" : persona === "google" ? "Your deployment scorecard" : "Your practice scorecard"} sub="Modeled from synthetic engagement data" />
        <div className="af-grid c5">{view.metrics.map((m) => <Metric key={m.id} m={m} />)}</div>
      </div>

      <div className="af-section af-split">
        <div>
          {persona === "customer" && (
            <>
              <SectionHead title="Industry solutions for manufacturing" right={<button type="button" className="af-btn sm" onClick={() => search("Manufacturing")}>See all <ArrowRight size={13} /></button>} />
              <div className="af-grid c3">{manufacturing.map((a) => <AssetCard key={a.id} a={a} />)}</div>
              {view.recommendedNext.length > 0 && (
                <div className="af-section">
                  <SectionHead title="Recommended next agents" sub="Based on what you already run" />
                  <div className="af-grid c2">
                    {view.recommendedNext.map((r) => byId.get(r.assetId) && (
                      <div key={r.assetId} className="af-card flat">
                        <div className="af-row between"><b>{byId.get(r.assetId)!.name}</b><TrustTag t={byId.get(r.assetId)!.trust} /></div>
                        <p className="af-muted" style={{ fontSize: 13, marginTop: 4 }}>{r.reason}</p>
                        <button type="button" className="af-btn sm" style={{ marginTop: 10 }} onClick={() => openAsset(r.assetId)}>View solution</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {persona === "google" && (
            <>
              <SectionHead title="Proven across customers" sub="Most-deployed public assets" right={<button type="button" className="af-btn sm" onClick={() => setTab("insights")}>Reuse intelligence <ArrowRight size={13} /></button>} />
              <div className="af-grid c3">{proven.map((a) => <AssetCard key={a.id} a={a} />)}</div>
            </>
          )}
          {persona === "partner" && (
            <>
              <SectionHead title="Your IP in the ecosystem" right={<button type="button" className="af-btn sm" onClick={() => setTab("assets")}>Manage <ArrowRight size={13} /></button>} />
              <div className="af-grid c3">{ours.slice(0, 6).map((a) => <AssetCard key={a.id} a={a} />)}</div>
            </>
          )}
        </div>

        <div className="af-stack">
          <div className="af-card">
            <div className="af-card-head">
              <Factory size={16} />
              <h3 className="af-h3">{persona === "customer" ? "My agents" : persona === "google" ? "Your engagements" : "Customer projects"}</h3>
              <button type="button" className="af-btn sm" onClick={() => setTab("workspaces")}>Open</button>
            </div>
            {view.workspaces.length ? <ul className="af-list">{view.workspaces.map((w) => <WorkspaceRow key={w.id} w={w} />)}</ul> : <div className="af-empty">No workspaces yet.</div>}
          </div>
          {reviewQueue.length > 0 && (
            <div className="af-card">
              <div className="af-card-head"><Inbox size={16} /><h3 className="af-h3">Waiting on you</h3></div>
              <ul className="af-list">
                {reviewQueue.map((c) => (
                  <li key={c.id}>
                    <div style={{ flex: 1 }}><b>{c.title}</b><div className="af-muted" style={{ fontSize: 12.5 }}>{c.canApproveCustomer ? "Permit reuse beyond your workspace" : c.canReview ? "Marketplace review" : "Ready to publish"}</div></div>
                    <button type="button" className="af-btn sm" onClick={() => setTab("assets")}>Open</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {persona === "partner" && recentReviews.length > 0 && (
            <div className="af-card">
              <div className="af-card-head"><h3 className="af-h3">Latest community reviews</h3></div>
              <ul className="af-list">
                {recentReviews.map((r) => (
                  <li key={r.id} style={{ flexDirection: "column", gap: 2 }}>
                    <div className="af-row between" style={{ width: "100%" }}><b style={{ fontSize: 13 }}>{r.asset.name}</b><Stars rating={r.rating} count={1} /></div>
                    <div style={{ fontSize: 13, color: "var(--ink-2)" }}>“{r.text}”</div>
                    <div className="af-muted" style={{ fontSize: 12 }}>{r.reviewer}, {r.reviewerOrg}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {persona === "customer" && (
            <div className="af-card">
              <div className="af-card-head"><h3 className="af-h3">Run cost vs value</h3></div>
              <p className="af-muted" style={{ fontSize: 13 }}>
                Your live agents return {view.metrics.find((m) => m.id === "outcomes")?.value} in modeled savings at {view.metrics.find((m) => m.id === "roi")?.sub.replace("on ", "")}.
              </p>
              <button type="button" className="af-btn sm" style={{ marginTop: 10 }} onClick={() => setTab("insights")}>Consumption & ROI</button>
            </div>
          )}
          {persona === "google" && view.gtm && (
            <div className="af-card">
              <div className="af-card-head"><h3 className="af-h3">Expansion pipeline</h3><span className="af-tag v-internal">Internal</span></div>
              <p className="af-muted" style={{ fontSize: 13 }}>{view.gtm.pipeline.length} opportunities · {usd(view.gtm.pipeline.reduce((s, p) => s + p.incrementalPerMonth, 0))}/mo modeled consumption</p>
              <button type="button" className="af-btn sm" style={{ marginTop: 10 }} onClick={() => setTab("gtm")}>GTM metrics</button>
            </div>
          )}
        </div>
      </div>

      <div className="af-section">
        <SectionHead title="One shared Gemini 10 journey" sub={journeyWs ? `${journeyWs.name} · ${journeyWs.customer?.name ?? ""}` : "Customer, Google FDE and partner FDE each lead a stage; all three take part in every one"} />
        <Lifecycle stage={journeyWs ? stage : -1} />
      </div>
    </div>
  );
}
