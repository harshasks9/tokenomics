"use client";

import type { Claim, Model } from "@/lib/llm-landscape/types";
import {
  ACCESS_LABEL,
  GRADE_META,
  STATUS_META,
  parseReleased,
  vendorGroup,
  vendorHue,
} from "@/lib/llm-landscape/model";

export function GradeBadge({ grade }: { grade: string }) {
  const g = GRADE_META[grade] ?? { short: grade, label: grade, cls: "g-analyst" };
  return (
    <span className={`badge ${g.cls}`} title={g.label}>
      {g.short}
    </span>
  );
}

export function StatusPill({ status }: { status: string | null | undefined }) {
  if (!status) return null;
  const s = STATUS_META[status] ?? { label: status, cls: "s-superseded" };
  return <span className={`pill ${s.cls}`}>{s.label}</span>;
}

export function AccessPill({ access }: { access: string | null | undefined }) {
  if (!access) return null;
  return <span className="pill p-access">{ACCESS_LABEL[access] ?? access}</span>;
}

export function ConfidencePill({ level }: { level: string }) {
  return <span className={`pill p-conf-${level}`}>confidence: {level}</span>;
}

export function VendorDot({ vendor }: { vendor: string }) {
  return (
    <span className="vendor">
      <span className="vendor-dot" style={{ background: vendorHue(vendor) }} aria-hidden />
      {vendorGroup(vendor)}
    </span>
  );
}

export function TierTag({ tier }: { tier: number }) {
  return <span className={`tier tier-${tier}`}>T{tier}</span>;
}

export function Released({ model }: { model: Model }) {
  const r = parseReleased(model.released);
  return <span className="released">{r.display}</span>;
}

export function ClaimRow({ claim }: { claim: Claim }) {
  return (
    <li className="claim">
      <div className="claim-head">
        <GradeBadge grade={claim.evidence_grade} />
        {claim.source_url ? (
          <a className="src" href={claim.source_url} target="_blank" rel="noopener noreferrer">
            source ↗
          </a>
        ) : (
          <span className="src src-none">no URL</span>
        )}
      </div>
      <p>{claim.claim}</p>
    </li>
  );
}

export function ClaimList({
  title,
  claims,
  tone,
}: {
  title: string;
  claims: Claim[] | null | undefined;
  tone?: "weak";
}) {
  if (!claims || claims.length === 0) return null;
  return (
    <section className={`claims ${tone === "weak" ? "claims-weak" : ""}`}>
      <h4>{title}</h4>
      <ul>
        {claims.map((c, i) => (
          <ClaimRow key={i} claim={c} />
        ))}
      </ul>
    </section>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="empty">{text}</div>;
}
