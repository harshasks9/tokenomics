"use client";

import { useState } from "react";
import { BROKEN, COUNTERS, SCORED_CLAIMS } from "@/lib/clicks-to-delegation/contrarian";
import type { ClaimStatus } from "@/lib/clicks-to-delegation/types";
import { Cite, Ev, Fig, Section } from "../ui";

const STATUS: Record<ClaimStatus, { label: string; help: string }> = {
  strong: { label: "Strongly supported", help: "Multiple independent sources agree" },
  contested: { label: "Contested", help: "Credible evidence on both sides, or company claims only" },
  weak: { label: "Weakly supported", help: "Evidence points the other way or is thin" },
  speculative: { label: "Speculative", help: "A forecast or extrapolation without measured support" },
};

export default function Contrarian() {
  const [f, setF] = useState<ClaimStatus | "all">("all");
  const claims = SCORED_CLAIMS.filter((c) => f === "all" || c.status === f);
  return (
    <Section id="contrarian" num="13" title="The contrarian view"
      dek="Why agentic commerce might not become the next e-commerce, and which popular claims the evidence does and doesn't support."
      takeaway={<>The strongest argument against the thesis isn&apos;t that agents won&apos;t work. It is that <strong>delegating a decision is a different act from changing a channel</strong>, and that AI&apos;s most measurable effect so far is <strong>better e-commerce</strong>, not a new economic sector. The thesis survives only if agent-<em>executed</em> spend starts growing faster than agent-<em>influenced</em> spend. It hasn&apos;t yet.</>}>

      <h3 className="ctd-h3 ctd-deep">Eight places where history will not repeat</h3>
      <div className="ctd-broken ctd-deep">
        {BROKEN.map((b, i) => (
          <article key={b.id} className="ctd-broken-card">
            <span className="ctd-mono ctd-muted">{String(i + 1).padStart(2, "0")}</span>
            <b>{b.title}</b>
            <div className="ctd-broken-pair"><div><span className="ctd-h4">E-commerce</span><p>{b.history}</p></div><div><span className="ctd-h4">Agents</span><p>{b.agentic}</p></div></div>
            <p className="ctd-broken-imp">{b.implication}</p>
          </article>
        ))}
      </div>

      <div className="ctd-block">
        <h3 className="ctd-h3">The counterarguments, assessed</h3>
        <div className="ctd-table-wrap" style={{ marginTop: 12 }}>
          <table className="ctd-table">
            <thead><tr><th>Counterargument</th><th>Evidence</th><th className="ctd-deep">Matters most when</th><th className="ctd-deep">Would be invalidated by</th><th>Strength</th></tr></thead>
            <tbody>{COUNTERS.map((c) => <tr key={c.id}><td><b>{c.claim}</b></td><td>{c.evidence}<Cite ids={c.sourceIds} />{!c.sourceIds.length && <> <Ev kind="expert-judgment" /></>}</td><td className="ctd-deep">{c.mattersWhen}</td><td className="ctd-deep">{c.invalidatedBy}</td><td><span className={`ctd-strength ${c.strength}`}>{c.strength}</span></td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="ctd-block ctd-key">
        <Fig title="Visualization I · The contrarian scorecard" sub="Popular claims about agentic commerce, rated against the evidence assembled for this report. Filter by rating."
          controls={<div className="ctd-chips" role="group" aria-label="Filter by rating"><button type="button" className="ctd-chip" aria-pressed={f === "all"} onClick={() => setF("all")}>All {SCORED_CLAIMS.length}</button>{(Object.keys(STATUS) as ClaimStatus[]).map((s) => <button key={s} type="button" className="ctd-chip" aria-pressed={f === s} onClick={() => setF(s)}>{STATUS[s].label} {SCORED_CLAIMS.filter((c) => c.status === s).length}</button>)}</div>}
          foot={<><Ev kind="expert-judgment" /> Ratings weigh source independence and type; company claims alone never rate above &ldquo;contested&rdquo;.</>}>
          <div className="ctd-scorecard">
            {claims.map((c) => (
              <div key={c.id} className={`ctd-claim ${c.status}`}>
                <span className={`ctd-claim-status ${c.status}`} title={STATUS[c.status].help}>{STATUS[c.status].label}</span>
                <b>{c.claim}</b>
                <p>{c.why}<Cite ids={c.sourceIds} /></p>
              </div>
            ))}
          </div>
        </Fig>
      </div>
    </Section>
  );
}
