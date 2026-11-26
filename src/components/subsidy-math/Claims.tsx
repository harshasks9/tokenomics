"use client";

import { useState } from "react";
import { CLAIMS, CATEGORY_LABEL, type Category } from "@/lib/subsidy-math/claims";

const SAY_LABEL = { say: "Say it", qualify: "Say it with the caveat", avoid: "Don't say it" } as const;

/** Section: the four-category claims audit. */
export default function Claims() {
  const [cat, setCat] = useState<Category | 0>(0);
  const shown = CLAIMS.filter((c) => cat === 0 || c.category === cat);
  return (
    <>
      <div className="sm-filter" role="group" aria-label="Filter by category">
        <button type="button" className="sm-tag" aria-pressed={cat === 0} onClick={() => setCat(0)} style={{ cursor: "pointer", fontSize: 13, padding: "5px 12px", ...(cat === 0 ? { background: "var(--ink)", color: "#fff" } : {}) }}>All ({CLAIMS.length})</button>
        {([1, 2, 3, 4] as Category[]).map((k) => (
          <button key={k} type="button" className={`sm-cat k${k}`} aria-pressed={cat === k} onClick={() => setCat(k)} style={{ cursor: "pointer", border: cat === k ? "2px solid currentColor" : "2px solid transparent" }}>
            {k} · {CATEGORY_LABEL[k]} ({CLAIMS.filter((c) => c.category === k).length})
          </button>
        ))}
      </div>
      <div className="sm-grid c2">
        {shown.map((c) => (
          <article key={c.id} className="sm-claim">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span className={`sm-cat k${c.category}`}>{c.category} · {CATEGORY_LABEL[c.category]}</span>
              <span className="sm-tag">{SAY_LABEL[c.say]}</span>
              <span className="sm-tag">Confidence: {c.confidence}</span>
            </div>
            <q>{c.claim}</q>
            <small><b>Evidence:</b> {c.evidence}</small>
            {c.calc && <small><b>Calculation:</b> {c.calc}</small>}
            {c.assumptions && <small><b>Rests on:</b> {c.assumptions}</small>}
            <small><b>Strongest counterargument:</b> {c.counter}</small>
            <small><b>Source:</b> {c.source}</small>
          </article>
        ))}
      </div>
    </>
  );
}
