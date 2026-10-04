"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { useSite, type DrawerTab } from "./context";
import { DataTable, MotionTag, Src, Tag } from "./ui";
import { Meter, StackBar } from "./charts";
import { money, PLAY_STATE_LABEL, SEGMENT_LABEL } from "@/lib/korea-fy27/format";
import type { CohortId } from "@/lib/korea-fy27/types";

const TABS: { id: DrawerTab; label: string }[] = [
  { id: "economics", label: "Economics" },
  { id: "plays", label: "Plays" },
  { id: "deliver", label: "How we deliver" },
  { id: "team", label: "Team & targets" },
  { id: "decisions", label: "Decisions & gaps" },
  { id: "accounts", label: "Accounts" },
];

const BUILD_SHADES = ["var(--navy-ink)", "#4f74a6", "#86b6ef", "#b7d3f6"];

export default function CohortDrawer({
  state,
  onClose,
  onTab,
}: {
  state: { id: CohortId; tab: DrawerTab } | null;
  onClose: () => void;
  onTab: (tab: DrawerTab) => void;
}) {
  const { model } = useSite();
  const ref = useRef<HTMLDialogElement>(null);
  const cohort = state ? model.cohorts.find((c) => c.id === state.id) : null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (state && !dialog.open) dialog.showModal();
    if (!state && dialog.open) dialog.close();
  }, [state]);

  const staffing = cohort ? model.resourcing.staffing.find((s) => s.cohort === cohort.id) : null;
  const los = cohort ? model.los.rows.find((r) => r.cohort === cohort.id) : null;
  const levers = cohort ? model.plan.levers.filter((l) => cohort.leverIds.includes(l.num)) : [];
  const buildTotal = cohort ? cohort.buildUp.reduce((s, b) => s + b.value, 0) : 0;

  return (
    <dialog
      ref={ref}
      className="k-drawer"
      aria-labelledby="k-drawer-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {cohort ? (
        <div className="k-drawer-inner">
          <div className="k-drawer-head">
            <div className="row">
              <span className="k-small k-muted" style={{ fontWeight: 700 }}>
                Cohort {cohort.num} of 8 · {SEGMENT_LABEL[cohort.segment]}
              </span>
              <MotionTag motion={cohort.motion} />
              <button type="button" className="k-close" onClick={onClose} aria-label="Close cohort plan">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <h2 id="k-drawer-title">{cohort.name}</h2>
            <p className="k-sub" style={{ marginTop: 4 }}>
              {cohort.accounts}
              {cohort.accountsNote ? ` · ${cohort.accountsNote}` : ""} · {cohort.coverage}
            </p>
          </div>
          <div className="k-tabs" role="tablist" aria-label="Cohort plan sections">
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={state?.tab === t.id} onClick={() => onTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="k-drawer-body" role="tabpanel">
            {state?.tab === "economics" ? (
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
                <dl className="k-kv">
                  <div>
                    <dt>FY26 AI</dt>
                    <dd>{money(cohort.fy26Precise ?? cohort.fy26)}</dd>
                  </div>
                  <div>
                    <dt>FY27 target</dt>
                    <dd>
                      ~{money(cohort.fy27)} {cohort.multiple ? <small>{cohort.multiple}</small> : null}
                    </dd>
                  </div>
                  <div>
                    <dt>Added in FY27</dt>
                    <dd>+{money(cohort.added)}</dd>
                  </div>
                  <div>
                    <dt>Run-rate today</dt>
                    <dd>
                      {money(cohort.runRate)} <small>~{cohort.losPct}% of target</small>
                    </dd>
                  </div>
                  <div>
                    <dt>Not yet in run-rate</dt>
                    <dd style={{ color: cohort.losPct < 10 ? "var(--risk)" : undefined }}>
                      {money(los?.gap ?? 0)} <small>derived</small>
                    </dd>
                  </div>
                </dl>
                <Meter pct={cohort.losPct} low={cohort.losPct < 10} label={`Line of sight ~${cohort.losPct}%${cohort.losNote ? ` · ${cohort.losNote}` : ""}`} right={cohort.concentration} />

                <div>
                  <h3 className="k-h3">The big move</h3>
                  <p style={{ marginTop: 6, color: "var(--ink-2)" }}>{cohort.bigMove}</p>
                </div>

                <div>
                  <h3 className="k-h3">How the number is built</h3>
                  <p className="k-sub" style={{ marginTop: 4 }}>Deck assumption: {cohort.assumption}</p>
                  <StackBar
                    total={buildTotal}
                    parts={cohort.buildUp.map((b, i) => ({ key: b.label, value: b.value, label: b.label, color: BUILD_SHADES[i % BUILD_SHADES.length] }))}
                  />
                  <div className="k-build">
                    {cohort.buildUp.map((b, i) => (
                      <div className="k-build-row" key={b.label}>
                        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <i className="k-swatch" style={{ background: BUILD_SHADES[i % BUILD_SHADES.length] }} />
                          {b.label} <Tag basis={b.basis} />
                        </span>
                        <b>{money(b.value)}</b>
                      </div>
                    ))}
                    <div className="k-build-row total">
                      <span>FY27 target (deck: ~{money(cohort.fy27)})</span>
                      <b>{money(Math.round(buildTotal * 10) / 10)}</b>
                    </div>
                  </div>
                  {cohort.buildUpNote ? <p className="k-tfoot-note">{cohort.buildUpNote}</p> : null}
                </div>

                {levers.length ? (
                  <div>
                    <h3 className="k-h3">Levers that land here</h3>
                    <ul className="k-list" style={{ marginTop: 8 }}>
                      {levers.map((l) => (
                        <li key={l.num}>
                          <b>
                            Lever {l.num} · +{money(l.landsIn.find((x) => x.cohort === cohort.id)?.value ?? l.value)}
                          </b>{" "}
                          {l.name}. {l.mustBeTrue}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="k-callout">{cohort.callout}</div>
                <Src src={[cohort.srcMain, cohort.srcAppendix]} basis={["stated", "derived"]} />
              </div>
            ) : null}

            {state?.tab === "plays" ? (
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14 }}>
                <p className="k-sub">Slide 17 (updated 1 Oct) is the current view. The cohort page shows the earlier mix; rows that differ are marked.</p>
                <div className="k-table-wrap">
                  <table className="k-table">
                    <thead>
                      <tr>
                        <th scope="col">Play</th>
                        <th scope="col">Slide 17 (current)</th>
                        <th scope="col">Cohort page</th>
                      </tr>
                    </thead>
                    <tbody>
                      {model.execution.plays.map((p) => {
                        const now = cohort.plays[p.id];
                        const page = cohort.playsOnCohortPage[p.id];
                        return (
                          <tr key={p.id}>
                            <td>
                              {p.name}
                              <span className="k-small k-muted" style={{ display: "block", fontWeight: 500 }}>
                                {p.what}
                              </span>
                            </td>
                            <td>
                              <span className={`k-dot ${now}`}>
                                <i aria-hidden="true" />
                                {PLAY_STATE_LABEL[now]}
                              </span>
                            </td>
                            <td>
                              {PLAY_STATE_LABEL[page]}
                              {page !== now ? (
                                <span className="k-tag" style={{ marginLeft: 6 }}>
                                  differs
                                </span>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="k-small k-muted">Tokenomics (Model Choice + cost) is the enabler under every play, not a play on its own.</p>
                <Src src={[{ part: "main", slides: "17" }, cohort.srcMain]} />
              </div>
            ) : null}

            {state?.tab === "deliver" ? (
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14 }}>
                <div className="k-grid k-g3">
                  {[
                    { t: "Tech + FDE", items: cohort.tech },
                    { t: "Commercial", items: cohort.commercial },
                    { t: "Partner", items: cohort.partner },
                  ].map((col) => (
                    <div className="k-card flat" key={col.t}>
                      <h4>{col.t}</h4>
                      <ul className="k-list tight" style={{ marginTop: 10 }}>
                        {col.items.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {cohort.id === "startups" ? (
                  <a className="k-btn" href="#vc" onClick={() => ref.current?.close()}>
                    The VC / CVC engine that feeds this cohort <ArrowRight aria-hidden="true" />
                  </a>
                ) : null}
                <p className="k-small k-muted">Commercial programs fall into four buckets: Switch · Commit · Start · Adopt.</p>
                <Src src={[cohort.srcMain, cohort.srcAppendix]} />
              </div>
            ) : null}

            {state?.tab === "team" ? (
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18 }}>
                <dl className="k-kv">
                  <div>
                    <dt>AI SS</dt>
                    <dd>{cohort.team.aiSs}</dd>
                  </div>
                  <div>
                    <dt>AI CE</dt>
                    <dd style={{ fontSize: cohort.team.aiCe.length > 4 ? 15 : undefined }}>{cohort.team.aiCe}</dd>
                  </div>
                  <div>
                    <dt>FDE</dt>
                    <dd style={{ fontSize: 15 }}>{cohort.team.fde}</dd>
                  </div>
                  <div>
                    <dt>Owner</dt>
                    <dd style={{ fontSize: 15 }}>
                      {cohort.owner} <Tag basis="placeholder" />
                    </dd>
                  </div>
                </dl>
                {cohort.team.other ? <p className="k-sub">{cohort.team.other}</p> : null}
                {staffing ? (
                  <div>
                    <h3 className="k-h3">Across the three resourcing snapshots</h3>
                    <DataTable
                      columns={["Snapshot", "AI SS", "AI CE", "FDE"]}
                      numeric={[1]}
                      rows={[
                        ["Current headcount (slide 23)", staffing.current.aiSs, staffing.current.aiCe, "–"],
                        ["Plan allocation (slides 12, 97)", staffing.plan.aiSs, staffing.plan.aiCe, staffing.plan.fde],
                        ["Target with asks (slide 24)", staffing.target.aiSs, staffing.target.aiCe ?? "–", "14 total (3 + 11 pool)"],
                      ]}
                    />
                  </div>
                ) : null}
                <div>
                  <h3 className="k-h3">Targets and owners</h3>
                  <div className="k-build" style={{ marginTop: 8 }}>
                    {cohort.targets.map((t) => (
                      <div className="k-build-row" key={t.text}>
                        <span>
                          {t.text}
                          {t.owner ? <span className="k-small k-muted"> · owner: {t.owner}</span> : null}
                        </span>
                        <span className="k-small k-muted k-nowrap">slide {t.src.slides}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {state?.tab === "decisions" ? (
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 18 }}>
                <div>
                  <h3 className="k-h3">To decide in the room</h3>
                  <ol style={{ marginTop: 10, paddingLeft: 20, display: "grid", gap: 8 }}>
                    {cohort.decisions.map((d) => (
                      <li key={d} style={{ color: "var(--ink-2)" }}>
                        {d}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h3 className="k-h3">Unresolved in the deck</h3>
                  <ul className="k-list risk" style={{ marginTop: 10 }}>
                    {cohort.unresolved.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </div>
                <Src src={cohort.srcAppendix} basis={["placeholder", "to-confirm"]} />
              </div>
            ) : null}

            {state?.tab === "accounts" ? (
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 22 }}>
                {cohort.accountTables.map((t) => (
                  <div key={t.title}>
                    <h3 className="k-h3">{t.title}</h3>
                    <div style={{ marginTop: 10 }}>
                      <DataTable columns={t.columns} numeric={t.numeric} rows={t.rows.map((r) => r.cells)} total={t.total?.cells} wrapCols={t.columns.map((c, i) => (/Remarks|plans|Next step|Product|Lead plays/.test(c) ? i : -1)).filter((i) => i >= 0)} />
                    </div>
                    {t.footnote ? <p className="k-tfoot-note">{t.footnote}</p> : null}
                    <Src src={t.src} basis={["stated"]} extra={<span>$M. AI run-rate = current run-rate, annualised.</span>} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
