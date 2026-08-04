"use client";

import { useEffect, useState } from "react";
import type { ClaimLabel, EvidenceGrade, Stage } from "@/lib/fsi/types";
import HUB from "@/lib/fsi/hub";

/* Colour is never the sole carrier of a grade: every badge pairs a glyph +
   text label with its hue, in the mono utility face. */

export const CLAIM_META: Record<ClaimLabel, { glyph: string; text: string; title: string }> = {
  verified: { glyph: "✓", text: "VERIFIED", title: "Fact traceable to a named primary/reputable source" },
  analysis: { glyph: "◆", text: "ANALYSIS", title: "Informed inference/positioning by the author — not a sourced fact" },
  company: { glyph: "◇", text: "COMPANY-STATED", title: "Self-reported by the company/vendor; rarely independently audited" },
};

export function ClaimBadge({ label }: { label: ClaimLabel }) {
  const m = CLAIM_META[label];
  return (
    <span className={`fsi-claim fsi-claim-${label}`} title={m.title}>
      <i aria-hidden="true">{m.glyph}</i> {m.text}
    </span>
  );
}

export const GRADE_TEXT: Record<EvidenceGrade, string> = {
  "verified-production": "VERIFIED PRODUCTION",
  "production-undisclosed": "PRODUCTION · OUTCOME UNDISCLOSED",
  "limited-production": "LIMITED PRODUCTION",
  pilot: "PILOT",
  announced: "ANNOUNCED",
  unverified: "UNVERIFIED",
};

export function GradeBadge({ grade }: { grade: EvidenceGrade }) {
  return <span className={`fsi-grade fsi-grade-${grade}`}>{GRADE_TEXT[grade]}</span>;
}

export const STAGE_TEXT: Record<Stage, string> = {
  assistive: "Production — assistive",
  "bounded-agent": "Production — bounded agent",
  "multi-agent": "Limited production — multi-agent",
  autonomous: "Experimental — autonomous",
};

export function StageBadge({ stage }: { stage: Stage }) {
  return <span className="fsi-stage">{STAGE_TEXT[stage]}</span>;
}

export function Guardrail() {
  return (
    <span className="fsi-guard" title="Attribution guardrail: never present as a Google Cloud win">
      ⛔ NOT A GOOGLE WIN
    </span>
  );
}

export function SourceList({ ids }: { ids: string[] }) {
  const list = ids.map((id) => HUB.sources.find((s) => s.id === id)).filter(Boolean);
  return (
    <ul className="fsi-sources">
      {list.map((s) => (
        <li key={s!.id} data-kind={s!.kind}>
          <span className="fsi-mono">{s!.kind === "not-captured" ? "⚠" : "§"}</span> {s!.name}
          {s!.note ? <em> — {s!.note}</em> : null}
        </li>
      ))}
    </ul>
  );
}

export function Field({ k, v }: { k: string; v?: string }) {
  return (
    <div className="fsi-field">
      <dt>{k}</dt>
      <dd className={v ? "" : "fsi-nd"}>{v ?? "Not disclosed"}</dd>
    </div>
  );
}

/** Tiny hash router: '#/atlas', '#/case/wells-fargo', … */
export function useHashRoute(): [string[], (h: string) => void] {
  const parse = () =>
    (typeof window === "undefined" ? "" : window.location.hash).replace(/^#\/?/, "").split("/").filter(Boolean);
  const [route, setRoute] = useState<string[]>([]);
  useEffect(() => {
    const on = () => setRoute(parse());
    on();
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  const nav = (h: string) => {
    window.location.hash = h.startsWith("#") ? h : `#/${h}`;
  };
  return [route, nav];
}

export const SEGMENT_TEXT: Record<string, string> = {
  retail: "Retail banking",
  commercial: "Commercial & corporate",
  "ib-research": "IB & research",
  "wealth-asset": "Wealth & asset mgmt",
  "payments-fintech": "Payments & fintech",
  insurance: "Insurance",
  "market-infra": "Market infrastructure",
};

export function vendorName(id: string): string {
  if (id === "inhouse") return "In-house";
  return HUB.vendors.find((v) => v.id === id)?.name.split(" (")[0] ?? id;
}
