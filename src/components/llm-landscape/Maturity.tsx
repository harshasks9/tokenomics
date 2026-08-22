"use client";

import type { Dataset } from "@/lib/llm-landscape/types";
import { vendorHue } from "@/lib/llm-landscape/model";
import { GradeBadge } from "./ui";

const STAGES: { id: string; label: string; blurb: string }[] = [
  {
    id: "emerging",
    label: "Emerging",
    blurb: "Capability is racing ahead of vendor stability — expect churn, verify everything.",
  },
  {
    id: "competitive",
    label: "Competitive",
    blurb: "Several credible leaders leapfrogging each other; second-source strategies work.",
  },
  {
    id: "consolidating",
    label: "Consolidating",
    blurb: "Roles are settling; the shortlist is stable even where the leader isn't.",
  },
  {
    id: "commodity",
    label: "Commodity",
    blurb: "Interchangeable options — lifecycle, license, and price decide, not capability.",
  },
];

/**
 * Maturity: where each capability category sits on the adoption curve.
 * Positions are qualitative analyst judgment with the reasoning printed —
 * deliberately no dots on a two-axis chart, no scores.
 */
export default function Maturity({
  data,
  onVendor,
}: {
  data: Dataset;
  onVendor: (vendor: string) => void;
}) {
  const entries = data.meta.maturity ?? [];
  const profiles = data.meta.vendor_profiles ?? [];

  return (
    <div className="maturity">
      <div className="advisor-intro">
        <h2>Category maturity</h2>
        <p>
          Where each capability market sits, and why — every position is a labeled{" "}
          <GradeBadge grade="analyst-inference" /> judgment with its reasoning printed, not a
          coordinate on a chart.
        </p>
      </div>

      <div className="mat-board">
        {STAGES.map((stage) => {
          const rows = entries.filter((e) => e.stage === stage.id);
          if (rows.length === 0) return null;
          return (
            <section key={stage.id} className={`mat-col mat-${stage.id}`}>
              <header className="mat-col-head">
                <h3>{stage.label}</h3>
                <p>{stage.blurb}</p>
              </header>
              {rows.map((e) => (
                <article key={e.category} className="mat-card">
                  <h4>{e.category}</h4>
                  <p>{e.justification}</p>
                </article>
              ))}
            </section>
          );
        })}
      </div>

      {profiles.length > 0 && (
        <section className="vendor-strip">
          <h3>Vendor profiles</h3>
          <p className="guide-note">
            Strengths-and-cautions syntheses, including each vendor&apos;s deprecation track record.
          </p>
          <div className="vendor-strip-row">
            {profiles.map((p) => (
              <button key={p.vendor} className="chip" onClick={() => onVendor(p.vendor)}>
                <i className="dot" style={{ background: vendorHue(p.vendor) }} aria-hidden />
                {p.vendor}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
