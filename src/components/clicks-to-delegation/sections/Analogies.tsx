"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ANALOGIES, analogyScore, PARADOXES, VERDICT_LABEL } from "@/lib/clicks-to-delegation/analogies";
import type { Analogy, AnalogyVerdict } from "@/lib/clicks-to-delegation/types";
import { Ev, Fig, Section } from "../ui";

const SCORE_COLS: { k: keyof Analogy["scores"]; label: string; help: string }[] = [
  { k: "evidence", label: "Evidence", help: "Quality of historical evidence for the original mechanism" },
  { k: "mechanism", label: "Mechanism", help: "How similar the causal mechanism is today" },
  { k: "relevance", label: "Relevance", help: "Commercial importance if it holds" },
  { k: "differences", label: "Few differences", help: "5 = the differences are minor; 1 = fundamental" },
  { k: "predictive", label: "Predictive", help: "Usefulness for decisions being made in 2026" },
];
const THEMES = ["all", "discovery", "trust", "economics", "distribution", "loyalty", "infrastructure", "operations"] as const;

export default function Analogies() {
  const [q, setQ] = useState("");
  const [verdict, setVerdict] = useState<AnalogyVerdict | "all">("all");
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("all");
  const [sort, setSort] = useState<"score" | "order">("score");
  const [sel, setSel] = useState<string>("outsourcing");
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const r = ANALOGIES.filter((a) => (verdict === "all" || a.verdict === verdict) && (theme === "all" || a.theme === theme) && (!t || `${a.historical} ${a.agentic} ${a.question} ${a.mechanism}`.toLowerCase().includes(t)));
    return sort === "score" ? [...r].sort((a, b) => analogyScore(b) - analogyScore(a)) : r;
  }, [q, verdict, theme, sort]);
  const a = ANALOGIES.find((x) => x.id === sel) ?? ANALOGIES[0];
  const counts = (["strong", "partial", "weak", "inversion"] as AnalogyVerdict[]).map((v) => ({ v, n: ANALOGIES.filter((x) => x.verdict === v).length }));

  return (
    <Section id="analogies" num="05" title="The analogy engine"
      dek="Twenty historical mechanisms tested against what agents actually change. Not every rhyme is equally useful, and two may run backwards."
      takeaway={<>The analogies that hold best are about <strong>who controls consideration</strong> (shelf → search → agent shortlist), <strong>who carries payment risk</strong>, and <strong>who you let hold your customer</strong> (Borders). The ones to distrust are about <strong>network effects and price comparison</strong>: open protocols and effortless comparison could invert the e-commerce pattern rather than repeat it.</>}>

      <div className="ctd-verdicts">
        {counts.map(({ v, n }) => <div key={v} className={`ctd-verdict ${v}`}><b className="ctd-mono">{n}</b><span>{VERDICT_LABEL[v]}</span></div>)}
      </div>

      <div className="ctd-block ctd-key">
        <Fig title="Visualization D · The analogy matrix"
          sub="Each analogy is scored 1–5 on five dimensions. Select a row for the full mechanism, who wins and loses, and what would prove it wrong."
          foot={<><Ev kind="expert-judgment" /> Scores are this report&apos;s assessment, made explicit so they can be argued with.</>}>
          <div className="ctd-filters">
            <label className="ctd-search"><Search size={15} /><input className="ctd-input" placeholder="Search analogies" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search analogies" /></label>
            <select className="ctd-input ctd-select" value={verdict} onChange={(e) => setVerdict(e.target.value as AnalogyVerdict | "all")} aria-label="Filter by verdict">
              <option value="all">All verdicts</option>
              {(["strong", "partial", "weak", "inversion"] as AnalogyVerdict[]).map((v) => <option key={v} value={v}>{VERDICT_LABEL[v]}</option>)}
            </select>
            <select className="ctd-input ctd-select" value={theme} onChange={(e) => setTheme(e.target.value as (typeof THEMES)[number])} aria-label="Filter by theme">
              {THEMES.map((t) => <option key={t} value={t}>{t === "all" ? "All themes" : t[0].toUpperCase() + t.slice(1)}</option>)}
            </select>
            <select className="ctd-input ctd-select" value={sort} onChange={(e) => setSort(e.target.value as "score" | "order")} aria-label="Sort">
              <option value="score">Sort: predictive value</option>
              <option value="order">Sort: original order</option>
            </select>
          </div>
          <div className="ctd-matrix-wrap">
            <div className="ctd-table-wrap">
              <table className="ctd-table ctd-matrix">
                <thead>
                  <tr><th>Historical → agentic</th><th>Verdict</th><th title="Average of five 1–5 scores, as % of maximum">Score</th></tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className={r.id === sel ? "on" : ""} onClick={() => setSel(r.id)} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(r.id); } }} aria-selected={r.id === sel}>
                      <td><b>{r.historical}</b><span className="ctd-matrix-ag">{r.agentic}</span></td>
                      <td><span className={`ctd-vtag ${r.verdict}`}>{VERDICT_LABEL[r.verdict]}</span></td>
                      <td className="n">{analogyScore(r)}</td>
                    </tr>
                  ))}
                  {!rows.length && <tr><td colSpan={3} className="ctd-muted">No analogies match these filters.</td></tr>}
                </tbody>
              </table>
            </div>
            <aside className="ctd-analogy-detail" aria-live="polite">
              <span className={`ctd-vtag ${a.verdict}`}>{VERDICT_LABEL[a.verdict]}</span>
              <h3 className="ctd-h3" style={{ marginTop: 8 }}>{a.question}</h3>
              <p className="ctd-small ctd-muted">{a.historical} → {a.agentic}</p>
              <div className="ctd-scores">
                {SCORE_COLS.map((c) => <div key={c.k} title={c.help}><span>{c.label}</span><Dots n={a.scores[c.k]} /></div>)}
                <div className="ctd-scores-total"><span>Predictive value</span><b className="ctd-mono">{analogyScore(a)}/100</b></div>
              </div>
              <Item k="What changed historically" v={a.changed} />
              <Item k="Why it mattered economically" v={a.whyMattered} />
              <Item k="The agentic mechanism" v={a.mechanism} />
              <Item k="Where the analogy breaks" v={a.incomplete} />
              <div className="ctd-grid2"><Item k="Who could benefit" v={a.winners} /><Item k="Who could lose" v={a.losers} /></div>
              <div className="ctd-grid2"><Item k="Would validate it" v={a.validate} /><Item k="Would falsify it" v={a.falsify} /></div>
            </aside>
          </div>
        </Fig>
      </div>

      <div className="ctd-block">
        <h3 className="ctd-h3">Ten paradoxes worth testing</h3>
        <p className="ctd-small ctd-muted" style={{ margin: "4px 0 14px" }}>Less obvious mechanisms, each written as a hypothesis with the signal that would confirm it.</p>
        <div className="ctd-paradoxes">
          {PARADOXES.map((p) => (
            <article key={p.id} className="ctd-paradox">
              <b>{p.name}</b>
              <p className="ctd-paradox-claim">{p.claim}</p>
              <p className="ctd-deep">{p.mechanism}</p>
              <p className="ctd-paradox-h"><span className="ctd-h4">Hypothesis</span> {p.hypothesis}</p>
              <p className="ctd-small ctd-muted"><span className="ctd-h4">Watch</span> {p.signal}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Dots({ n }: { n: number }) {
  return <span className="ctd-dots" aria-label={`${n} of 5`}>{[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= n ? "on" : ""} />)}</span>;
}
function Item({ k, v }: { k: string; v: string }) {
  return <div className="ctd-item"><span className="ctd-h4">{k}</span><p>{v}</p></div>;
}
