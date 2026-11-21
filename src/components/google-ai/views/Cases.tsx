"use client";

import { useEffect, useMemo, useState } from "react";
import { casesFor } from "@/lib/google-ai/engine/specialist";
import { CASES } from "@/lib/google-ai/kb";
import { REGION_BY_ID, SEGMENTS } from "@/lib/google-ai/taxonomy";
import type { SegmentId } from "@/lib/google-ai/types";
import { CaseRow } from "../specialist";
import { Callout, Empty, PageHead, Seg, useHub } from "../ui";

const PLATFORMS = [
  { id: "all", label: "All" },
  { id: "google-cloud", label: "Google Cloud" },
  { id: "other", label: "Other platforms" },
] as const;

/** Case studies — real customers, what they built, what they report, and how to use the example. */
export default function Cases() {
  const { region } = useHub();
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]["id"]>("all");
  const [segment, setSegment] = useState<SegmentId | "all">("all");
  const [q, setQ] = useState("");
  const [everywhere, setEverywhere] = useState(false);
  const [n, setN] = useState(20);
  const [target, setTarget] = useState<string | null>(null);

  // A link to one case (#cs-…) opens it whatever the filters say.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && CASES.some((c) => c.id === id)) queueMicrotask(() => setTarget(id));
  }, []);
  useEffect(() => {
    if (target) document.getElementById(target)?.scrollIntoView({ block: "start" });
  }, [target]);

  const scopeRegion = everywhere ? "all" : region;
  const rows = useMemo(() => casesFor({ platform, segment, region: scopeRegion, q }), [platform, segment, scopeRegion, q]);
  const pinned = target ? CASES.find((c) => c.id === target) : undefined;
  const list = pinned && !rows.includes(pinned) ? [pinned, ...rows] : rows;
  const regionName = region === "all" ? null : REGION_BY_ID[region].name;

  return (
    <>
      <PageHead icon="📚" title="Case studies" lede="How real organisations use AI — on Google Cloud and on other platforms. Each one says what was built, what the customer reports, and when the example is useful to you." />

      <Callout icon="ℹ️">
        <p>Results are the customer&apos;s or the vendor&apos;s own figures and are labelled as claims. Examples on other platforms are here so you know what customers have seen elsewhere, described fairly.</p>
      </Callout>

      <div className="gai-row" style={{ margin: "18px 0 6px" }}>
        <Seg value={platform} onChange={(v) => { setPlatform(v); setN(20); }} options={PLATFORMS} label="Platform" />
        <select className="gai-select" value={segment} onChange={(e) => { setSegment(e.target.value as SegmentId | "all"); setN(20); }} aria-label="Industry segment">
          <option value="all">Every industry</option>
          {SEGMENTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input className="gai-input" value={q} onChange={(e) => { setQ(e.target.value); setN(20); }} placeholder="Search customer or product" aria-label="Search case studies" />
      </div>
      <p className="gai-small gai-muted">
        {rows.length} of {CASES.length} case studies{regionName && !everywhere ? ` · ${regionName} only` : ""}.{" "}
        {regionName && (
          <button type="button" className="gai-link" onClick={() => setEverywhere((v) => !v)}>{everywhere ? `Show ${regionName} only` : "Show every region"}</button>
        )}
      </p>

      <div style={{ marginTop: 10 }}>
        {CASES.length === 0 ? (
          <Empty title="No case study recorded yet" />
        ) : list.length === 0 ? (
          <Empty title="No case study matches">Clear a filter{regionName && !everywhere ? `, or show every region` : ""}.</Empty>
        ) : (
          list.slice(0, n).map((c) => <CaseRow key={c.id} c={c} open={c.id === target} />)
        )}
      </div>
      {list.length > n && <button type="button" className="gai-btn" style={{ marginTop: 14 }} onClick={() => setN(n + 20)}>Show more</button>}
    </>
  );
}
