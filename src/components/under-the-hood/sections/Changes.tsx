"use client";

import { useMemo, useState } from "react";
import { CHANGES, CHANGES_META, SOURCES, type Change } from "@/lib/under-the-hood/data";
import { Badge, ConfBadge, DownloadCsv, Ext, Section, Seg } from "../ui";

const TAGS: { value: "all" | Change["tag"]; label: string }[] = [
  { value: "all", label: "All" }, { value: "financial", label: "Financial" }, { value: "customers", label: "Customers" },
  { value: "compute", label: "Compute" }, { value: "risk", label: "Risk" }, { value: "strategy", label: "Strategy" }, { value: "other", label: "Other" },
];
const MAT: Record<string, string> = { High: "high", Medium: "medium", Low: "low" };

export default function Changes() {
  const [tag, setTag] = useState<(typeof TAGS)[number]["value"]>("all");
  const [cat, setCat] = useState<string>("all");
  const [view, setView] = useState<"side" | "oct" | "nov">("side");
  const [sel, setSel] = useState<string>(CHANGES[1].id);
  const list = useMemo(() => CHANGES.filter((c) => (tag === "all" || c.tag === tag) && (cat === "all" || c.category === cat)), [tag, cat]);
  const current = list.find((c) => c.id === sel) ?? list[0];
  const counts = (t: string) => CHANGES.filter((c) => t === "all" || c.tag === t).length;
  return (
    <Section id="changes">
      <div className="uth-grid uth-g4" style={{ marginBottom: 20 }}>
        <div className="uth-card"><div className="uth-kpi-label">Changed passages (sentence-level)</div><div className="uth-kpi-value">{CHANGES_META.stats.changedPassages}</div><div className="uth-xs">After normalizing pagination and line-wraps</div></div>
        <div className="uth-card"><div className="uth-kpi-label">Material changes catalogued</div><div className="uth-kpi-value">{CHANGES.length}</div><div className="uth-xs">Incl. important items left unchanged</div></div>
        <div className="uth-card"><div className="uth-kpi-label">Risk factors added or removed</div><div className="uth-kpi-value">{CHANGES_META.stats.riskFactorsAddedOrDeleted}</div><div className="uth-xs">{CHANGES_META.stats.riskFactorParagraphsChanged} paragraphs edited; ~{CHANGES_META.stats.substantiveRiskFactorChanges} substantive</div></div>
        <div className="uth-card"><div className="uth-kpi-label">October operating data added</div><div className="uth-kpi-value">None</div><div className="uth-xs">Oct 31 run-rate still blank in the S-1/A</div></div>
      </div>

      <div className="uth-toolbar">
        <div className="uth-chips" role="group" aria-label="Filter by topic">
          {TAGS.map((t) => (
            <button key={t.value} type="button" className="uth-chip" aria-pressed={tag === t.value} onClick={() => setTag(t.value)}>{t.label}<span className="ct">{counts(t.value)}</span></button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <label className="uth-small" htmlFor="chg-cat">Category</label>
          <select id="chg-cat" className="uth-select" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">All categories</option>
            {CHANGES_META.categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Seg label="Disclosure view" value={view} onChange={setView} options={[{ value: "oct", label: "Oct 26 S-1" }, { value: "side", label: "Side by side" }, { value: "nov", label: "Nov 2 S-1/A" }]} />
        </div>
      </div>

      {list.length === 0 ? <div className="uth-empty">No changes match these filters. Try “All”.</div> : (
        <div className="uth-split rev">
          <div className="uth-card" style={{ padding: 8, maxHeight: 720, overflowY: "auto" }} role="listbox" aria-label="Changes">
            {list.map((c) => (
              <button key={c.id} type="button" role="option" aria-selected={current?.id === c.id} onClick={() => setSel(c.id)}
                style={{ display: "block", width: "100%", textAlign: "left", border: 0, borderRadius: 10, padding: "10px 12px", margin: "2px 0", cursor: "pointer", font: "inherit",
                  background: current?.id === c.id ? "var(--accent-wash)" : "transparent", boxShadow: current?.id === c.id ? "inset 3px 0 0 var(--accent)" : "none" }}>
                <span style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}><Badge>{c.category}</Badge><span className={`uth-badge ${MAT[c.materiality]}`}>{c.materiality} materiality</span></span>
                <span style={{ fontSize: 14, color: "var(--ink)", fontWeight: 500 }}>{c.title}</span>
              </button>
            ))}
          </div>
          {current && (
            <div className="uth-card" aria-live="polite">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><Badge>{current.category}</Badge><Badge>{current.section}</Badge><ConfBadge level={current.confidence} /></div>
              <h3 className="uth-h3" style={{ marginTop: 10 }}>{current.title}</h3>
              <div className="uth-grid" style={{ gridTemplateColumns: view === "side" ? "repeat(auto-fit,minmax(220px,1fr))" : "1fr", marginTop: 12 }}>
                {view !== "nov" && <div className="uth-diff-old"><div className="uth-h4" style={{ color: "#a33" }}>October 26 S-1 · p.{current.evidence.s1Page}</div>{current.original}</div>}
                {view !== "oct" && <div className="uth-diff-new"><div className="uth-h4" style={{ color: "#1a6b45" }}>November 2 S-1/A · p.{current.evidence.s1aPage}</div>{current.amended}</div>}
              </div>
              <dl className="uth-kv" style={{ marginTop: 16 }}>
                <dt>Actual delta</dt><dd><strong style={{ color: "var(--ink)" }}>{current.delta}</strong></dd>
                <dt>Why it matters</dt><dd>{current.whyItMatters}</dd>
                <dt>Interpretation</dt><dd>{current.interpretation}</dd>
                <dt>Competitive implication</dt><dd>{current.competitiveImplication}</dd>
                <dt>Evidence</dt><dd><Ext href={SOURCES.s1.url}>S-1</Ext> p.{current.evidence.s1Page} · <Ext href={SOURCES.s1a.url}>S-1/A</Ext> p.{current.evidence.s1aPage}</dd>
              </dl>
            </div>
          )}
        </div>
      )}
      <div className="uth-chart-foot"><span>Method: sentence-level diff after removing pagination; every catalogued item checked against both filings. Interpretations are analytical (not disclosed).</span>
        <DownloadCsv filename="uth-s1-amendment-changes.csv" rows={CHANGES.map((c) => ({ id: c.id, category: c.category, topic: c.tag, title: c.title, original: c.original, amended: c.amended, delta: c.delta, s1_page: c.evidence.s1Page, s1a_page: c.evidence.s1aPage, confidence: c.confidence }))} /></div>
    </Section>
  );
}
