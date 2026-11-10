"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { HISTORY_TESTS, PLAYS } from "@/lib/clicks-to-delegation/playbook";
import type { PlayInitiative } from "@/lib/clicks-to-delegation/types";
import { Ev, Fig, Section } from "../ui";

const HORIZON = { 1: { name: "Horizon 1 · Defend and prepare", sub: "Justified even if autonomy develops slowly" }, 2: { name: "Horizon 2 · Experiment and learn", sub: "Low-regret moves that generate real data" }, 3: { name: "Horizon 3 · Reposition", sub: "Only if meaningful delegation accelerates" } } as const;
const MATRIX: { k: keyof PlayInitiative["matrix"]; label: string }[] = [
  { k: "reversibility", label: "Reversible" }, { k: "cost", label: "Low cost" }, { k: "optionality", label: "Optionality" }, { k: "adoptionIndependence", label: "Pays off without adoption" },
];
const regret = (p: PlayInitiative) => Math.round(((p.matrix.reversibility + p.matrix.cost + p.matrix.optionality + p.matrix.adoptionIndependence) / 20) * 100);
/** Mechanical flags from the matrix: high Webvan risk = costly, irreversible and dependent on unproven adoption; Borders risk = high external dependency. */
const webvan = (p: PlayInitiative) => p.matrix.cost <= 2 && p.matrix.adoptionIndependence <= 2;
const borders = (p: PlayInitiative) => /high/i.test(p.dependency);

export default function Playbook() {
  const [pid, setPid] = useState("product-data");
  const p = PLAYS.find((x) => x.id === pid) ?? PLAYS[0];
  const sorted = [...PLAYS].sort((a, b) => regret(b) - regret(a));
  return (
    <Section id="playbook" num="12" title="The retailer's playbook"
      dek="Translate history into decisions: what to do now, what to test, and what to keep in reserve until the evidence arrives."
      takeaway={<>Spend first on things that pay off <strong>even if no one ever delegates a purchase</strong>: product data, inventory accuracy, commerce APIs, agent identity and honest measurement. Experiment with supervised agent checkout to buy <em>data</em>, not volume. Defer heavy autonomous-commerce builds until there is independent evidence of <strong>repeat</strong> agent purchasing: the Webvan test.</>}>

      <div className="ctd-tests">
        {HISTORY_TESTS.map((t) => (
          <div key={t.id} className="ctd-test"><b>{t.name}</b><p>{t.q}</p><span className="ctd-small ctd-muted">{t.origin}</span></div>
        ))}
      </div>

      <div className="ctd-horizons ctd-block ctd-key">
        {([1, 2, 3] as const).map((h) => (
          <div key={h} className={`ctd-horizon h${h}`}>
            <div className="ctd-horizon-head"><b>{HORIZON[h].name}</b><span>{HORIZON[h].sub}</span></div>
            {PLAYS.filter((x) => x.horizon === h).map((x) => (
              <button key={x.id} type="button" className={`ctd-play ${x.id === pid ? "on" : ""}`} aria-pressed={x.id === pid} onClick={() => setPid(x.id)}>
                <span>{x.name}</span>
                <span className="ctd-play-flags">{webvan(x) && <span className="ctd-flag webvan">Webvan risk</span>}{borders(x) && <span className="ctd-flag borders">Borders risk</span>}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="ctd-block">
        <Fig title={p.name} sub={`${HORIZON[p.horizon].name}. The executive decision framework, answered.`}
          foot={<><Ev kind="expert-judgment" /> Answers are this report&apos;s recommendations; adapt them to your category and economics.</>}>
          <div className="ctd-decision">
            {([
              ["Why now?", p.whyNow], ["Historical evidence", p.history], ["Consumer problem solved", p.problem], ["Does it improve economics today?", p.economicsToday],
              ["What must become true for long-term value", p.mustBeTrue], ["Capabilities it builds", p.builds], ["Optionality preserved", p.optionality], ["Dependency created", p.dependency],
              ["KPI that shows genuine traction", p.kpi], ["Evidence to increase investment", p.increaseIf], ["Evidence to pause", p.pauseIf],
            ] as [string, string][]).map(([k, v]) => <div key={k}><span className="ctd-h4">{k}</span><p>{v}</p></div>)}
          </div>
          {(webvan(p) || borders(p)) && <p className="ctd-warnline"><AlertTriangle size={15} />{webvan(p) && "Fails the Webvan test: costly, hard to reverse and dependent on unproven consumer adoption. "}{borders(p) && "Check the Borders test: this creates a high external dependency; negotiate data, attribution and exit rights."}</p>}
        </Fig>
      </div>

      <div className="ctd-block">
        <Fig title="Decision matrix: evidence, not enthusiasm" sub="Initiatives ranked by a 'low-regret' score: the average of reversibility, cost, optionality and independence from consumer adoption (1–5 each, higher is safer)."
          foot={<><Ev kind="expert-judgment" /> Scores are judgments made explicit so they can be challenged and re-weighted.</>}>
          <div className="ctd-table-wrap">
            <table className="ctd-table ctd-dm">
              <thead><tr><th>Initiative</th><th>Horizon</th>{MATRIX.map((m) => <th key={m.k}>{m.label}</th>)}<th>Low-regret score</th></tr></thead>
              <tbody>
                {sorted.map((x) => (
                  <tr key={x.id} className={x.id === pid ? "on" : ""} onClick={() => setPid(x.id)}>
                    <td><b>{x.name}</b></td><td className="n">H{x.horizon}</td>
                    {MATRIX.map((m) => <td key={m.k}><span className="ctd-mbar" aria-label={`${x.matrix[m.k]} of 5`}><i style={{ width: `${x.matrix[m.k] * 20}%` }} /></span></td>)}
                    <td className="n">{regret(x)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Fig>
      </div>
    </Section>
  );
}
