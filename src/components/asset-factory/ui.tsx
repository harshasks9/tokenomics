"use client";

import {
  BadgeCheck, Boxes, Building2, CircleCheck, CircleDot, FlaskConical, Globe, Lock, Plug, ShieldCheck, Sparkles, Star, Users, Workflow, X,
} from "lucide-react";
import type { ReactNode } from "react";
import type { AssetType, OrgKind, PersonaId, TrustTier, Visibility } from "@/lib/asset-factory/types";
import type { AssetView, MetricCard, OrgRef } from "@/lib/asset-factory/views";
import type { EvalResult, ReadinessCheck } from "@/lib/asset-factory/model";
import { useFactory } from "./state";

export const PERSONA_NAME: Record<PersonaId, string> = { customer: "Customer", google: "Google FDE", partner: "Partner FDE" };

export const usd = (n: number, digits = 0) =>
  n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e4 ? `$${Math.round(n / 1e3)}k` : `$${n.toLocaleString("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits })}`;
export const num = (n: number) => Math.round(n).toLocaleString("en-US");

export function kindToPersona(k: OrgKind): PersonaId {
  return k === "google" ? "google" : k === "partner" ? "partner" : "customer";
}

export function Avatar({ initials, kind, size }: { initials: string; kind: OrgKind | PersonaId; size?: "sm" | "lg" }) {
  const k = kind === "google" || kind === "partner" ? kind : "customer";
  return <span className={`af-avatar ${size ?? ""}`} data-k={k} aria-hidden>{initials}</span>;
}

export const VIS: Record<Visibility, { label: string; icon: typeof Globe; help: string }> = {
  public: { label: "Public community", icon: Globe, help: "Available to every authorized platform user." },
  org: { label: "Organization private", icon: Lock, help: "Visible only inside the contributing organization — plus workspaces it was explicitly shared into." },
  workspace: { label: "Shared workspace", icon: Users, help: "Available only to invited collaborators of a specific workspace." },
  internal: { label: "Google internal", icon: ShieldCheck, help: "Restricted to authorized Google employees. Never shared externally." },
};

export function VisibilityTag({ v, compact }: { v: Visibility; compact?: boolean }) {
  const { label, icon: Icon, help } = VIS[v];
  return <span className={`af-tag v-${v}`} title={help}><Icon size={12} />{compact ? label.split(" ")[0] : label}</span>;
}

export const TRUST: Record<TrustTier, { label: string; help: string }> = {
  community: { label: "Community", help: "Published by a verified contributor. Not certified by Google — check reviews, evals and the security notes." },
  field: { label: "Field validated", help: "Running in production in at least two FDE-led engagements. Not an official Google certification." },
  verified: { label: "Google verified", help: "Officially verified by Google: security review, evaluation baseline and supported upgrade path." },
};

export function TrustTag({ t }: { t: TrustTier }) {
  const Icon = t === "verified" ? BadgeCheck : t === "field" ? CircleCheck : Users;
  return <span className={`af-tag t-${t}`} title={TRUST[t].help}><Icon size={12} />{TRUST[t].label}</span>;
}

const TYPE_ICON: Record<AssetType, typeof Boxes> = { blueprint: Boxes, skill: Sparkles, connector: Plug, workflow: Workflow, evaluation: FlaskConical };
export const TYPE_LABEL: Record<AssetType, string> = { blueprint: "Agent blueprint", skill: "Skill", connector: "Connector", workflow: "Workflow", evaluation: "Evaluation" };

export function AssetIcon({ type, size = 34 }: { type: AssetType; size?: number }) {
  const Icon = TYPE_ICON[type];
  return <span className="af-asset-icon" data-t={type} style={{ width: size, height: size }}><Icon size={Math.round(size * 0.5)} /></span>;
}

export function OrgName({ org, label }: { org: OrgRef | null; label?: string }) {
  return (
    <span className="af-row nowrap" style={{ gap: 4, display: "inline-flex" }}>
      {org?.kind === "google" ? <Building2 size={12} /> : null}
      {label ?? org?.name}
      {(!org || org.verified) && <span className="af-verified-org" title="Verified contributor organization (identity verified — not an asset certification)"><BadgeCheck size={12} /></span>}
    </span>
  );
}

export function Stars({ rating, count }: { rating: number; count: number }) {
  if (!count) return <span className="af-muted">No ratings yet</span>;
  return <span><Star size={12} className="af-star" fill="currentColor" /> {rating.toFixed(1)} <span className="af-muted">({count})</span></span>;
}

export function AssetCard({ a, extra }: { a: AssetView; extra?: ReactNode }) {
  const { openAsset } = useFactory();
  return (
    <button type="button" className="af-asset" onClick={() => openAsset(a.id)}>
      <div className="af-asset-top">
        <AssetIcon type={a.type} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="af-asset-name">{a.name}</div>
          <div className="af-asset-owner"><OrgName org={a.owner} label={a.ownerLabel} /></div>
        </div>
        {a.isNew && <span className="af-tag new">New</span>}
      </div>
      <p className="af-asset-sum">{a.summary}</p>
      <div className="af-row" style={{ gap: 6 }}>
        <TrustTag t={a.trust} />
        {a.visibility !== "public" && <VisibilityTag v={a.visibility} />}
        <span className="af-tag type">{a.type}</span>
      </div>
      <div className="af-asset-foot">
        <Stars rating={a.rating} count={a.ratingCount} />
        <span title="Production deployments"><CircleDot size={12} /> {a.deployments} deployed</span>
        <span>v{a.version}</span>
        {extra}
      </div>
    </button>
  );
}

export function Metric({ m }: { m: MetricCard }) {
  return (
    <div className={`af-card af-metric ${m.internal ? "internal" : ""}`}>
      <div className="af-metric-label">{m.label}{m.internal && <span className="af-tag v-internal" style={{ padding: "0 6px" }}><Lock size={10} />Internal</span>}</div>
      <div className="af-metric-value">{m.value}</div>
      <div className="af-metric-sub">{m.sub}</div>
    </div>
  );
}

export function EvalList({ evals }: { evals: EvalResult[] }) {
  if (!evals.length) return <div className="af-empty">Evaluations run once a blueprint is selected.</div>;
  return (
    <div>
      {evals.map((e) => {
        const pct = e.lowerIsBetter ? Math.min(100, (e.score / 4) * 100) : e.score;
        const th = e.lowerIsBetter ? (e.threshold / 4) * 100 : e.threshold;
        return (
          <div className="af-eval" key={e.id}>
            <div>
              <div className="af-eval-label">{e.label}</div>
              <div className={`af-bar ${e.pass ? "ok" : "bad"}`} style={{ marginTop: 5 }} aria-hidden>
                <i style={{ width: `${pct}%` }} />
                <b style={{ left: `${th}%` }} />
              </div>
            </div>
            <div className="af-eval-score" style={{ color: e.pass ? "var(--ok)" : "var(--bad)" }}>
              {e.score}{e.unit}
              <div className="af-muted" style={{ fontSize: 11, fontWeight: 500 }}>{e.lowerIsBetter ? "≤" : "≥"} {e.threshold}{e.unit}</div>
            </div>
            <div className="af-eval-drivers">{e.drivers.join(" · ")}</div>
          </div>
        );
      })}
    </div>
  );
}

export function ReadinessList({ checks }: { checks: ReadinessCheck[] }) {
  return (
    <ul className="af-list">
      {checks.map((c) => (
        <li key={c.id}>
          {c.pass ? <CircleCheck size={17} color="var(--ok)" style={{ flex: "none", marginTop: 1 }} /> : <X size={17} color="var(--bad)" style={{ flex: "none", marginTop: 1 }} />}
          <div>
            <div style={{ fontWeight: 560 }}>{c.label}</div>
            <div className="af-muted" style={{ fontSize: 12.5 }}>{c.detail}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SectionHead({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="af-section-head">
      <h2 className="af-h2">{title}</h2>
      {sub && <span className="af-muted" style={{ fontSize: 13 }}>{sub}</span>}
      {right && <><span className="af-spacer" />{right}</>}
    </div>
  );
}

export function PersonaTag({ p }: { p: PersonaId }) {
  return <span className={`af-tag p-${p}`}><span className="af-dot" data-p={p} />{PERSONA_NAME[p]}</span>;
}
