"use client";

import { useEffect, useRef, useState } from "react";
import type { Claim, Model } from "@/lib/llm-landscape/types";
import {
  ACCESS_LABEL,
  GRADE_META,
  STATUS_META,
  parseReleased,
  vendorGroup,
  vendorHue,
} from "@/lib/llm-landscape/model";

/** Evidence-grade definitions come from the data file (meta.evidence_grades). */
let GRADE_DEFS: Record<string, string> = {};
export function setGradeDefs(defs: Record<string, string>) {
  GRADE_DEFS = defs;
}

export function GradeBadge({ grade }: { grade: string }) {
  const g = GRADE_META[grade] ?? { short: grade, label: grade, cls: "g-analyst" };
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <span className="badge-wrap" ref={ref}>
      <button
        className={`badge ${g.cls}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title={g.label}
      >
        {g.short}
      </button>
      {open && (
        <span className="badge-pop" role="note">
          <strong>{grade}</strong>
          {GRADE_DEFS[grade] ? ` — ${GRADE_DEFS[grade]}` : ` — ${g.label}`}
        </span>
      )}
    </span>
  );
}

/** One-line legend pinned atop evidence-heavy views. */
export function EvidenceLegend() {
  return (
    <div className="ev-legend" aria-label="Evidence grade legend">
      <span className="ev-legend-title">evidence grades</span>
      {Object.entries(GRADE_META).map(([k, g]) => (
        <span key={k} className="ev-legend-item" title={GRADE_DEFS[k] ?? g.label}>
          <span className={`badge ${g.cls}`}>{g.short}</span> {g.label}
        </span>
      ))}
    </div>
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
