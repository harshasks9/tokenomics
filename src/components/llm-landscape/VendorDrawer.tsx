"use client";

import { useMemo } from "react";
import type { Dataset, Model } from "@/lib/llm-landscape/types";
import { byReleaseAsc, vendorGroup, vendorHue } from "@/lib/llm-landscape/model";
import { GradeBadge, Released, StatusPill, TierTag } from "./ui";

const LIFECYCLE_ORDER = ["current", "announced", "superseded", "deprecated", "retired"] as const;

/**
 * Vendor profile drawer: the analyst synthesis (strengths and cautions in one
 * paragraph) plus the part vendors don't put on slides — the lifecycle track
 * record of everything of theirs in the dataset.
 */
export default function VendorDrawer({
  vendor,
  data,
  onClose,
  onSelect,
}: {
  vendor: string;
  data: Dataset;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const profile = (data.meta.vendor_profiles ?? []).find((p) => p.vendor === vendor);

  const { records, stubs, statusCounts } = useMemo(() => {
    const mine = data.models.filter((m) => vendorGroup(m.vendor) === vendor);
    const records = mine.filter((m) => m.tier < 3).sort(byReleaseAsc).reverse();
    const stubs = mine.filter((m) => m.tier === 3).sort(byReleaseAsc).reverse();
    const statusCounts = new Map<string, number>();
    for (const m of mine) {
      const s = m.status ?? "unknown";
      statusCounts.set(s, (statusCounts.get(s) ?? 0) + 1);
    }
    return { records, stubs, statusCounts };
  }, [data.models, vendor]);

  const row = (m: Model) => (
    <button key={m.id} className="vd-row" onClick={() => onSelect(m.id)} disabled={m.tier === 3}>
      <span className="vd-name">{m.name}</span>
      <span className="vd-meta">
        <TierTag tier={m.tier} /> <Released model={m} />
      </span>
      <StatusPill status={m.status} />
    </button>
  );

  return (
    <aside className="pane" aria-label={`${vendor} vendor profile`}>
      <div className="pane-head">
        <div className="pane-nav">
          <button className="pane-close" onClick={onClose} aria-label="Close vendor profile (Esc)">
            ✕ close
          </button>
        </div>
        <h2 className="pane-name">
          <i className="dot dot-lg" style={{ background: vendorHue(vendor) }} aria-hidden /> {vendor}
        </h2>
        <div className="pane-sub">
          <span>
            {records.length} full record{records.length === 1 ? "" : "s"} · {stubs.length} lineage
            stub{stubs.length === 1 ? "" : "s"} in the dataset
          </span>
        </div>
      </div>

      <div className="pane-body">
        {profile && (
          <section className="prose-block">
            <h4>
              Strengths &amp; cautions <GradeBadge grade="analyst-inference" />
            </h4>
            <p>{profile.synthesis}</p>
          </section>
        )}

        <section className="vd-lifecycle">
          <h4>Lifecycle track record</h4>
          <p className="size-note">
            Every {vendor} entry in the dataset by status — how a vendor retires models tells you
            what committing to one costs.
          </p>
          <div className="vd-counts">
            {LIFECYCLE_ORDER.filter((s) => statusCounts.has(s)).map((s) => (
              <span key={s} className="vd-count">
                <StatusPill status={s} /> <b>{statusCounts.get(s)}</b>
              </span>
            ))}
          </div>
        </section>

        {records.length > 0 && (
          <section className="vd-list">
            <h4>Records</h4>
            {records.map(row)}
          </section>
        )}
        {stubs.length > 0 && (
          <section className="vd-list vd-stubs">
            <h4>Lineage stubs</h4>
            {stubs.map(row)}
          </section>
        )}
      </div>
    </aside>
  );
}
