"use client";

import { ExternalLink, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AGENT_CONFLICTS, CONSUMER_CONFLICTS, ECON_CONFLICTS, HIST_CONFLICTS } from "@/lib/clicks-to-delegation/research";
import { WEAK_CLAIMS } from "@/lib/clicks-to-delegation/review";
import { SOURCE_NUMBER, SOURCES, VERIFICATION_LABEL } from "@/lib/clicks-to-delegation/sources";
import type { EvidenceKind, SourceType, Verification } from "@/lib/clicks-to-delegation/types";
import { Details, EV_LABEL, Ev, Section, TYPE_LABEL } from "../ui";

const EV_KINDS = Object.keys(EV_LABEL) as EvidenceKind[];
const HIERARCHY: SourceType[] = ["government", "filing", "academic", "survey", "analyst", "press", "company-claim"];

export default function Method() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<SourceType | "all">("all");
  const [ver, setVer] = useState<Verification | "all">("all");
  const [all, setAll] = useState(false);
  useEffect(() => {
    const onHash = () => {
      if (!location.hash.startsWith("#src-")) return;
      setAll(true); setQ(""); setType("all"); setVer("all");
      setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "center" }), 50);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return SOURCES.filter((s) => (type === "all" || s.type === type) && (ver === "all" || s.verification === ver) && (!t || `${s.title} ${s.publisher}`.toLowerCase().includes(t)));
  }, [q, type, ver]);
  const tally = (Object.keys(VERIFICATION_LABEL) as Verification[]).map((v) => ({ v, n: SOURCES.filter((s) => s.verification === v).length }));
  const conflicts = [...HIST_CONFLICTS, ...AGENT_CONFLICTS, ...CONSUMER_CONFLICTS, ...ECON_CONFLICTS];

  return (
    <Section id="method" num="14" title="Research and methodology"
      dek="How this report was built, what it could and could not verify, and every source it cites."
      takeaway={<>Five parallel research streams (history, case studies, agentic commerce in 2026, consumers and geography, economics) produced {SOURCES.length} sources. The research environment&apos;s network policy <strong>blocked direct access to several primary hosts</strong> (US Census, FRED, SEC, Pew), so most sources were confirmed through search excerpts. Every source shows how it was reached.</>}>

      <div className="ctd-grid2 ctd-key">
        <div className="ctd-card">
          <div className="ctd-h4">Evidence labels used throughout</div>
          <ul className="ctd-legend-list">
            {EV_KINDS.map((k) => <li key={k}><Ev kind={k} /></li>)}
          </ul>
          <p className="ctd-small" style={{ marginTop: 10 }}>Source hierarchy, most to least weight: {HIERARCHY.map((h) => TYPE_LABEL[h]).join(" → ")}. Company claims are labeled wherever they appear and never rate above &ldquo;contested&rdquo; on their own.</p>
        </div>
        <div className="ctd-card">
          <div className="ctd-h4">How each source was reached</div>
          <div className="ctd-vtally">
            {tally.map(({ v, n }) => <div key={v} className={`ctd-vt ${v}`}><b className="ctd-mono">{n}</b><span>{VERIFICATION_LABEL[v].label}</span><small>{VERIFICATION_LABEL[v].help}</small></div>)}
          </div>
        </div>
      </div>

      <div className="ctd-grid2 ctd-block">
        <div className="ctd-card">
          <div className="ctd-h4">Rules this report follows</div>
          <ul className="ctd-list">
            <li>AI referral traffic is never treated as agent transactions; AI shopping users are never equated with agentic GMV; access is never equated with purchasing.</li>
            <li>Adoption metrics with different denominators are shown separately and never combined into one index.</li>
            <li>Scenarios and simulations are labeled illustrative, with formulas shown; they are not forecasts.</li>
            <li>Where sources conflict, both are kept and the conflict is listed below.</li>
            <li>Historical lessons carry an alternative interpretation; bankruptcies are not attributed to e-commerce alone.</li>
          </ul>
        </div>
        <div className="ctd-card">
          <div className="ctd-h4">Known limitations of this research pass</div>
          <ul className="ctd-list">
            <li>Direct fetches of census.gov, fred.stlouisfed.org, sec.gov, pewresearch.org, ons.gov.uk, stats.gov.cn and several company sites were blocked by the research environment. The US e-commerce series was read from exact public mirrors of FRED and cross-checked.</li>
            <li>A shared web-search budget ran out during research. Some historical milestones and regional figures could not be re-verified; they are marked &ldquo;not re-verified&rdquo; wherever shown.</li>
            <li>Category online-penetration figures were found for only five of fifteen categories.</li>
            <li>Survey questions vary widely in wording; stated willingness ranges from 6% to 70% for similar-sounding questions.</li>
          </ul>
        </div>
      </div>

      <div className="ctd-block">
        <h3 className="ctd-h3">Adversarial review: the five weakest claims</h3>
        <p className="ctd-small ctd-muted" style={{ margin: "4px 0 12px" }}>Before publication, the claims most likely to be wrong were challenged and then strengthened, qualified or removed.</p>
        <div className="ctd-weak">
          {WEAK_CLAIMS.map((w, i) => (
            <div key={i} className="ctd-weak-row">
              <span className={`ctd-action ${w.action}`}>{w.action}</span>
              <div><b>{w.claim}</b><p><span className="ctd-h4">Problem</span> {w.problem}</p><p><span className="ctd-h4">Resolution</span> {w.resolution}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="ctd-block ctd-deep">
        <Details title={`Conflicting sources (${conflicts.length})`}>
          <ul className="ctd-list">{conflicts.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </Details>
      </div>

      <div className="ctd-block">
        <div className="ctd-fig-head"><div><div className="ctd-fig-title">Source library</div><div className="ctd-fig-sub">{list.length} of {SOURCES.length} sources. Numbers match the citation markers throughout the report.</div></div></div>
        <div className="ctd-filters">
          <label className="ctd-search"><Search size={15} /><input className="ctd-input" placeholder="Search title or publisher" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search sources" /></label>
          <select className="ctd-input ctd-select" value={type} onChange={(e) => setType(e.target.value as SourceType | "all")} aria-label="Source type"><option value="all">All source types</option>{HIERARCHY.map((h) => <option key={h} value={h}>{TYPE_LABEL[h]}</option>)}</select>
          <select className="ctd-input ctd-select" value={ver} onChange={(e) => setVer(e.target.value as Verification | "all")} aria-label="How reached"><option value="all">Any access level</option>{(Object.keys(VERIFICATION_LABEL) as Verification[]).map((v) => <option key={v} value={v}>{VERIFICATION_LABEL[v].label}</option>)}</select>
        </div>
        <ol className="ctd-sources">
          {(all || q || type !== "all" || ver !== "all" ? list : list.slice(0, 60)).map((s) => (
            <li key={s.id} id={`src-${s.id}`}>
              <span className="ctd-mono ctd-src-n">{SOURCE_NUMBER[s.id]}</span>
              <div>
                {s.url.startsWith("http") ? <a href={s.url} target="_blank" rel="noreferrer noopener"><b>{s.title}</b> <ExternalLink size={11} /></a> : <b>{s.title}</b>}
                <div className="ctd-small ctd-muted">{s.publisher} · {s.published} · {TYPE_LABEL[s.type] ?? s.type} · <span className={`ctd-vtag-s ${s.verification}`}>{VERIFICATION_LABEL[s.verification]?.label ?? s.verification}</span></div>
              </div>
            </li>
          ))}
        </ol>
        {!all && !q && type === "all" && ver === "all" && list.length > 60 && <button type="button" className="ctd-btn" style={{ marginTop: 12 }} onClick={() => setAll(true)}>Show all {list.length} sources</button>}
      </div>
    </Section>
  );
}
