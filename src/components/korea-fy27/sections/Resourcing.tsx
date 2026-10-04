"use client";

import { useState } from "react";
import { useSite } from "../context";
import { Block, MotionTag, Section, Src, Tag } from "../ui";
import { money } from "@/lib/korea-fy27/format";

type Snap = "current" | "plan" | "target";

export default function ResourcingSection() {
  const { model, openCohort } = useSite();
  const r = model.resourcing;
  const [snap, setSnap] = useState<Snap>("plan");
  const rows = [...model.cohorts].sort((a, b) => b.fy27 - a.fy27);
  const maxFy27 = Math.max(...rows.map((c) => c.fy27));
  const staff = (id: string) => r.staffing.find((s) => s.cohort === id)!;
  const ss = (id: string) => (snap === "current" ? staff(id).current.aiSs : snap === "plan" ? staff(id).plan.aiSs : staff(id).target.aiSs);
  const ce = (id: string): string => {
    const s = staff(id);
    const v = snap === "current" ? s.current.aiCe : snap === "plan" ? s.plan.aiCe : s.target.aiCe;
    return v === null || v === undefined ? "–" : String(v);
  };
  const snapshot = r.snapshots.find((s) => s.id === snap)!;

  return (
    <Section
      id="resourcing"
      num="07"
      label="Resourcing"
      question="Who does the work, and does every hire map to a number?"
      headline="Coverage follows the money: 7 of the 12 planned AI SS and all named FDEs sit on the three biggest cohorts."
      lead="The deck carries three resourcing snapshots and two FDE models that do not agree. They are shown side by side; the executive summary's 16 AI SS · 15 AI CE · 14 FDE · 1 VCBD is the latest headline."
    >
      <Block>
        <div className="k-grid k-g3">
          {r.snapshots.map((s) => (
            <div className="k-card" key={s.id} style={s.id === "target" ? { borderColor: "var(--navy-ink)" } : undefined}>
              <h4>
                {s.name} {s.id === "target" ? <span className="k-tag derived">Latest headline</span> : null}
              </h4>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 10 }}>
                {[
                  ["AI SS", s.aiSs],
                  ["AI CE", s.aiCe],
                  ["FDE", s.fde.split(" ")[0]],
                  ["VCBD", s.vcbd],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>{v ?? "–"}</div>
                    <div className="k-small k-muted" style={{ fontWeight: 650 }}>{k}</div>
                  </div>
                ))}
              </div>
              <p className="k-small" style={{ marginTop: 10, color: "var(--ink-2)" }}>
                FDE: {s.fde}. {s.note}
              </p>
              <p className="k-small k-muted" style={{ marginTop: 6 }}>Slides {s.src.slides}</p>
            </div>
          ))}
        </div>
        <div className="k-callout light">
          Draft architecture conflict: {r.fdeModels.map((m) => `${m.name} (${m.where})`).join(" vs ")}.
          <small>
            {r.fdeConflict} {r.fdeModels.map((m) => `${m.name}: ${m.detail}`).join(" ")}
          </small>
        </div>
      </Block>

      <Block title="People → cohort → play → revenue target" sub="Every hire should map to a number, not just to coverage. Switch snapshots to see how the allocation moves.">
        <div className="k-fig">
          <div className="k-fig-head">
            <div>
              <h3>Allocation board: {snapshot.name.toLowerCase()}</h3>
              <p>
                Totals: {snapshot.aiSs} AI SS · {snapshot.aiCe} AI CE · FDE {snapshot.fde}
                {snapshot.vcbd ? ` · ${snapshot.vcbd} VCBD` : ""}. $ per AI SS is derived from the plan allocation.
              </p>
            </div>
            <div className="k-toggle k-noprint" role="group" aria-label="Snapshot">
              {(["current", "plan", "target"] as Snap[]).map((s) => (
                <button key={s} type="button" aria-pressed={snap === s} onClick={() => setSnap(s)}>
                  {s === "current" ? "Current" : s === "plan" ? "Plan" : "Target with asks"}
                </button>
              ))}
            </div>
          </div>
          <div className="k-table-wrap">
            <table className="k-table">
              <thead>
                <tr>
                  <th scope="col">Cohort</th>
                  <th scope="col">FY27 target</th>
                  <th scope="col" className="num">AI SS</th>
                  <th scope="col" className="num">AI CE</th>
                  <th scope="col">FDE (plan)</th>
                  <th scope="col">Lead plays (slide 17)</th>
                  <th scope="col" className="num">FY27 $ per plan AI SS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="strong">
                      <button type="button" onClick={() => openCohort(c.id, "team")} style={{ background: "none", border: 0, padding: 0, fontWeight: 650, textAlign: "left" }}>
                        {c.name}
                      </button>
                      <div style={{ marginTop: 3 }}>
                        <MotionTag motion={c.motion} />
                      </div>
                    </td>
                    <td style={{ minWidth: 150 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 10, borderRadius: 4, background: "var(--context-soft)", position: "relative", minWidth: 70 }}>
                          <span style={{ position: "absolute", inset: "0 auto 0 0", width: `${(c.fy27 / maxFy27) * 100}%`, background: "var(--deepen)", borderRadius: 4 }} />
                        </div>
                        <b style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink)" }}>~{money(c.fy27)}</b>
                      </div>
                    </td>
                    <td className="num" style={{ fontWeight: 700, color: "var(--ink)" }}>{ss(c.id)}</td>
                    <td className="num">{ce(c.id)}</td>
                    <td>{staff(c.id).plan.fde}</td>
                    <td className="wrap">
                      {model.execution.plays
                        .filter((p) => c.plays[p.id] === "lead")
                        .map((p) => p.name)
                        .join(", ")}
                    </td>
                    <td className="num">{money(Math.round(c.fy27 / staff(c.id).plan.aiSs))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="k-list tight" style={{ marginTop: 12 }}>
            {r.staffingNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <Src src={[{ part: "main", slides: "12, 23, 24" }, { part: "C", slides: "97" }]} basis={["stated", "derived"]} />
        </div>
      </Block>

      <Block title="The pod model">
        <div className="k-grid k-g2">
          {r.pods.map((p) => (
            <div className="k-card" key={p.name}>
              <h3>{p.name}</h3>
              <p className="k-small" style={{ marginTop: 4, fontWeight: 650 }}>{p.makeup}</p>
              <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-2)" }}>{p.focus}</p>
              <p className="k-small k-muted" style={{ marginTop: 8 }}>Cohorts: {p.cohorts}</p>
            </div>
          ))}
        </div>
        <Src src={{ part: "main", slides: "19–23" }} basis={["wip"]} />
      </Block>

      <Block title="Partner ecosystem and model motions">
        <div className="k-grid k-g2">
          <div className="k-card flat">
            <h4>Ecosystem</h4>
            <div className="k-build" style={{ marginTop: 10 }}>
              {r.ecosystem.map((e) => (
                <div className="k-build-row" key={e.group}>
                  <b>{e.group}</b>
                  <span className="k-small" style={{ textAlign: "right", color: "var(--ink-2)" }}>{e.names}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="k-card flat">
            <h4>Model motions</h4>
            <p style={{ marginTop: 10, fontSize: 14 }}>
              <b>Keep:</b> <span style={{ color: "var(--ink-2)" }}>{r.modelMotions.keep}</span>
            </p>
            <p style={{ marginTop: 6, fontSize: 14 }}>
              <b>Build in FY27:</b> <span style={{ color: "var(--ink-2)" }}>{r.modelMotions.build}</span>
            </p>
            <p className="k-small k-muted" style={{ marginTop: 10 }}>
              Korea GTM reality: startups and groups are covered direct; everything else is partner-led. Public sector and mid-market run with 0 dedicated FDEs. <Tag basis="stated" />
            </p>
          </div>
        </div>
        <Src src={[{ part: "main", slides: "3, 23" }, { part: "C", slides: "97" }]} />
      </Block>
    </Section>
  );
}
