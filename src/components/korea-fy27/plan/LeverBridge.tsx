"use client";

import { useState } from "react";
import { useSite } from "../context";
import { DataTable, Details, Src, Tag, useTip } from "../ui";
import { money } from "@/lib/korea-fy27/format";

/** Base case ~$725M + eight levers = ~$900M. Switch a lever off to see what the plan loses. */
export default function LeverBridge() {
  const { model, openCohort } = useSite();
  const { levers, leverNotes, baseByCohort, baseTotal } = model.plan;
  const base = model.ladder.commit.value;
  const [on, setOn] = useState<Record<number, boolean>>(() => Object.fromEntries(levers.map((l) => [l.num, true])));
  const { bind, node } = useTip();
  const active = levers.filter((l) => on[l.num]);
  const total = base + active.reduce((s, l) => s + l.value, 0);
  const max = model.headline.fy27Plan;
  const pct = (v: number) => `${(v / max) * 100}%`;
  const cohortName = (id: string) => model.cohorts.find((c) => c.id === id)?.name ?? id;
  const ordered = [...levers].sort((a, b) => a.num - b.num);

  return (
    <div className="k-fig">
      <div className="k-fig-head">
        <div>
          <h3>From the ~$725M base case to ~$900M: eight sized levers</h3>
          <p>{leverNotes.soWhat} Samsung beyond the cap and the big-AI-spender take-outs are +$87M, half of the +$175M.</p>
        </div>
        <div className="k-pill-row k-noprint">
          <button type="button" className="k-pill" onClick={() => setOn(Object.fromEntries(levers.map((l) => [l.num, true])))}>
            All levers on
          </button>
          <button type="button" className="k-pill" onClick={() => setOn(Object.fromEntries(levers.map((l) => [l.num, false])))}>
            Base case only
          </button>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", height: 30, gap: 2, borderRadius: 6, overflow: "hidden" }} aria-label={`Selected plan ${money(total)}`}>
          <span
            tabIndex={0}
            style={{ width: pct(base), background: "var(--navy-ink)", color: "#fff", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap" }}
            {...bind(
              <>
                <b>~$725M</b>
                <div className="mut">Base case: 8 cohorts at bridge midpoints, range $650–805M</div>
              </>,
            )}
          >
            Base ~$725M
          </span>
          {ordered.map((l) =>
            on[l.num] ? (
              <span
                key={l.num}
                tabIndex={0}
                aria-label={`Lever ${l.num}: ${l.name}, plus ${money(l.value)}`}
                style={{ width: pct(l.value), background: l.num % 2 ? "#5b7fae" : "#7b9bc4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 800 }}
                {...bind(
                  <>
                    <b>+{money(l.value)}</b>
                    <div className="mut">
                      Lever {l.num}: {l.name} → {l.landsInLabel}
                    </div>
                  </>,
                )}
              >
                {l.value >= 13 ? l.num : ""}
              </span>
            ) : null,
          )}
        </div>
        {node}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, fontWeight: 650 }} aria-live="polite">
        <span className="k-muted">Selected: {active.length} of 8 levers</span>
        <span>
          {money(total, { approx: true })}{" "}
          {total < max ? (
            <span style={{ color: "var(--risk)" }}>({money(total - max, { sign: true })} vs plan)</span>
          ) : (
            <span className="k-muted">({(total / model.headline.fy26Ai).toFixed(1)}x FY26)</span>
          )}
        </span>
      </div>

      <div className="k-table-wrap" style={{ marginTop: 16 }}>
        <table className="k-table">
          <thead>
            <tr>
              <th scope="col" className="k-noprint">On</th>
              <th scope="col">#</th>
              <th scope="col">Lever</th>
              <th scope="col" className="num">FY27 AI</th>
              <th scope="col">Lands in</th>
              <th scope="col">What has to be true</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((l) => (
              <tr key={l.num}>
                <td className="k-noprint">
                  <input type="checkbox" checked={on[l.num]} onChange={(e) => setOn((o) => ({ ...o, [l.num]: e.target.checked }))} aria-label={`Include lever ${l.num}`} className="k-check" />
                </td>
                <td className="num" style={{ fontWeight: 700 }}>{l.num}</td>
                <td className="strong">{l.name}</td>
                <td className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>+{money(l.value)}</td>
                <td>
                  <span className="k-pill-row">
                    {l.landsIn.map((x) => (
                      <button key={x.cohort} type="button" className="k-pill" onClick={() => openCohort(x.cohort, "economics")} title="Open cohort">
                        {cohortName(x.cohort)}
                        {l.landsIn.length > 1 ? ` +$${x.value}M` : ""}
                      </button>
                    ))}
                  </span>
                </td>
                <td className="wrap">{l.mustBeTrue}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="k-noprint" />
              <td />
              <td>Total levers</td>
              <td className="num">+$175M</td>
              <td colSpan={2}>Samsung + big existing AI spenders = +$87M, half of the add</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Details title="Base case by cohort" sub="derived: each cohort's FY27 minus the levers that land in it" className="k-exec-hide">
        <DataTable
          columns={["Cohort", "Base case ($M)", "Levers ($M)", "FY27 ($M)", "Cross-check in the deck"]}
          numeric={[1, 2, 3]}
          rows={baseByCohort.map((b) => [
            cohortName(b.cohort),
            b.base,
            b.levers ? `+${b.levers}` : "–",
            b.fy27,
            b.cohort === "big-gcp"
              ? "Slide 12: AI to ~50% of GCP = $68M"
              : b.cohort === "samsung"
                ? "Slide 12: +50% base = $149M"
                : b.cohort === "mid-market"
                  ? "Slide 72: base ~$13M"
                  : b.cohort === "public"
                    ? "Slides 80, 130: ~$10M base"
                    : b.cohort === "trad-ent"
                      ? "Slide 92: base had 3–5 group seat deals"
                      : "",
          ])}
          total={["Eight cohorts + AutoEver held flat ($13.4M)", Math.round(baseTotal * 10) / 10, "+175", 901.4, "Deck: base ~$725M (range $650–805M)"]}
        />
        <p className="k-tfoot-note">
          <Tag basis="derived" /> The deck states the base total and each lever&rsquo;s landing cohort (slide 92) but not every cohort&rsquo;s base. Four bases are stated elsewhere and match.
        </p>
      </Details>
      <Src src={[{ part: "main", slides: "3" }, { part: "B", slides: "92" }]} basis={["stated", "derived"]} extra={<span>Whales (2–6 GPU / TPU and training deals, $100–300M) are outside this bar and not needed for ~4x.</span>} />
    </div>
  );
}
