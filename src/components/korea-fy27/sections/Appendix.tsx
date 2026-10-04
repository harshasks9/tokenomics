"use client";

import { useMemo, useState } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { useSite } from "../context";
import { Block, DataTable, Details, Section, Src, Tag, useTip } from "../ui";
import { BASIS_LABEL, money, SEGMENT_LABEL } from "@/lib/korea-fy27/format";
import type { Basis, SegmentId } from "@/lib/korea-fy27/types";

type Tab = "market" | "penetration" | "ledger" | "conflicts" | "sources";
const TABS: { id: Tab; label: string }[] = [
  { id: "market", label: "Market deep dives" },
  { id: "penetration", label: "FY26 penetration" },
  { id: "ledger", label: "Numbers ledger" },
  { id: "conflicts", label: "Conflicts & WIP" },
  { id: "sources", label: "Sources & definitions" },
];

function FootballField({ methods, consensus }: { methods: { name: string; range: [number, number] }[]; consensus: [number, number] }) {
  const { bind, node } = useTip();
  const max = Math.max(...methods.map((m) => m.range[1]), consensus[1]) * 1.06;
  const pct = (v: number) => `${(v / max) * 100}%`;
  const rows = [...methods.map((m) => ({ ...m, consensus: false })), { name: "Consensus FY26 TAM", range: consensus, consensus: true }];
  return (
    <div className="k-bars" role="list" style={{ position: "relative" }}>
      {rows.map((r) => (
        <div className="k-bar-row" key={r.name} role="listitem">
          <div className="lab" style={{ fontWeight: r.consensus ? 750 : 600 }}>{r.name}</div>
          <div className="k-track" tabIndex={0} aria-label={`${r.name}: $${r.range[0]}–${r.range[1]}M`} {...bind(<><b>${r.range[0].toLocaleString()}–{r.range[1].toLocaleString()}M</b><div className="mut">{r.name}</div></>)}>
            <span style={{ position: "absolute", top: 0, bottom: 0, left: pct(consensus[0]), width: pct(consensus[1] - consensus[0]), background: "var(--deepen-soft)" }} />
            <span className="range" style={{ left: pct(r.range[0]), width: pct(r.range[1] - r.range[0]), background: r.consensus ? "var(--deepen)" : "#86b6ef", top: r.consensus ? 1 : 4, bottom: r.consensus ? 1 : 4 }} />
          </div>
          <div className="val">
            ${r.range[0].toLocaleString()}–{r.range[1].toLocaleString()}M
          </div>
        </div>
      ))}
      {node}
    </div>
  );
}

export default function AppendixSection() {
  const { model } = useSite();
  const [tab, setTab] = useState<Tab>("market");
  const [seg, setSeg] = useState<SegmentId>("dn");
  const [ledgerFilter, setLedgerFilter] = useState<"all" | "rounding" | "exact">("all");
  const [kind, setKind] = useState<"all" | "conflict" | "rounding" | "basis" | "wip">("all");
  const dd = model.market.deepDives.find((d) => d.segment === seg)!;
  const checks = useMemo(() => model.audit.checks.filter((c) => ledgerFilter === "all" || c.kind === ledgerFilter), [model.audit.checks, ledgerFilter]);
  const conflicts = model.conflicts.filter((c) => kind === "all" || c.kind === kind);
  const counts = (k: string) => model.conflicts.filter((c) => c.kind === k).length;

  return (
    <Section
      id="appendix"
      num="11"
      label="Appendix"
      question="Why do we believe the numbers?"
      headline="The data room: market assumptions, FY26 penetration, every reconciliation and every conflict in the source."
      lead={`${model.audit.passed} of ${model.audit.total} reconciliation checks tie to the deck within its stated rounding. ${model.conflicts.length} conflicts, rounding notes and WIP items are logged with the value this site shows and why.`}
    >
      <div className="k-tabs k-noprint" role="tablist" aria-label="Data room" style={{ marginTop: 26, borderRadius: 12, border: "1px solid var(--line)" }}>
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "market" ? (
        <Block>
          <div className="k-pill-row" role="group" aria-label="Segment">
            {model.market.segments.map((s) => (
              <button key={s.id} type="button" className="k-pill" aria-pressed={seg === s.id} onClick={() => setSeg(s.id)}>
                {s.name}
              </button>
            ))}
          </div>
          <div className="k-fig" style={{ marginTop: 14 }}>
            <h3 className="k-h3">{SEGMENT_LABEL[seg]}</h3>
            <p style={{ marginTop: 6, fontSize: 15, color: "var(--ink-2)" }}>{dd.headline}</p>
            <div className="k-grid k-g3" style={{ marginTop: 14 }}>
              {dd.stats.map((s) => (
                <div className="k-card flat k-stat" key={s.label}>
                  <span className="v" style={{ fontSize: 26 }}>{s.value}</span>
                  <span className="d">{s.label}</span>
                  {s.basis && s.basis !== "stated" ? (
                    <span>
                      <Tag basis={s.basis} />
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="k-block" style={{ marginTop: 22 }}>
              <div className="k-block-title">
                <h3>Three methods, one consensus range (FY26, $M)</h3>
                <p>{dd.mix}</p>
              </div>
              <FootballField methods={dd.methods} consensus={dd.consensus} />
            </div>
            <div className="k-grid k-g2" style={{ marginTop: 20 }}>
              <div>
                <h4 className="k-h3" style={{ fontSize: 15 }}>What we know</h4>
                <ul className="k-list tight" style={{ marginTop: 8 }}>
                  {dd.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="k-h3" style={{ fontSize: 15 }}>Plays in this segment</h4>
                <ul className="k-list tight" style={{ marginTop: 8 }}>
                  {dd.plays.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="k-callout light">{dd.soWhat}</div>
            <Src src={dd.src} basis={["estimate"]} />
          </div>
        </Block>
      ) : null}

      {tab === "penetration" ? (
        <Block>
          <div className="k-callout light">
            {model.penetration.headline}
            <small>Appendix B uses internal account coding (micro-regions), which cuts the 816 accounts differently from the plan&rsquo;s four pillars.</small>
          </div>
          <ul className="k-list" style={{ marginTop: 16 }}>
            {model.penetration.takeaways.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div style={{ marginTop: 18 }}>
            {model.penetration.tables.map((t, i) => (
              <Details key={t.title} title={t.title} sub={`slide ${t.src.slides}`} defaultOpen={i === 0}>
                <DataTable columns={t.columns} numeric={t.numeric} rows={t.rows.map((r) => r.cells)} total={t.total?.cells} wrapCols={t.columns.map((c, j) => (/Key accounts/.test(c) ? j : -1)).filter((j) => j >= 0)} />
                {t.footnote ? <p className="k-tfoot-note">{t.footnote}</p> : null}
                <Src src={t.src} basis={["stated"]} extra={<span>FY26 = year to date (to 25 Sep) + last-7-days run-rate × 97 days. GCP includes AI.</span>} />
              </Details>
            ))}
          </div>
        </Block>
      ) : null}

      {tab === "ledger" ? (
        <Block>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 650 }}>
              <CircleCheck size={18} color="var(--good)" aria-hidden="true" />
              {model.audit.passed} of {model.audit.total} checks tie. Every figure on this site is either stated in the deck or computed from stated figures by the formulas below.
            </p>
            <div className="k-toggle k-noprint" role="group" aria-label="Filter checks">
              {(["all", "exact", "rounding"] as const).map((k) => (
                <button key={k} type="button" aria-pressed={ledgerFilter === k} onClick={() => setLedgerFilter(k)}>
                  {k === "all" ? "All" : k === "exact" ? "Exact" : "Within rounding"}
                </button>
              ))}
            </div>
          </div>
          <div className="k-table-wrap" style={{ marginTop: 12, maxHeight: 640, overflowY: "auto" }}>
            <table className="k-table">
              <thead>
                <tr>
                  <th scope="col">Check</th>
                  <th scope="col">Formula</th>
                  <th scope="col" className="num">Computed</th>
                  <th scope="col" className="num">Deck</th>
                  <th scope="col" className="num">Δ</th>
                  <th scope="col">Slides</th>
                  <th scope="col">Result</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((c) => (
                  <tr key={c.id}>
                    <td className="wrap">{c.label}</td>
                    <td className="wrap" style={{ fontVariantNumeric: "tabular-nums" }}>{c.formula}</td>
                    <td className="num">
                      {c.computed}
                      {c.unit === "%" ? "%" : c.unit === "x" ? "x" : ""}
                    </td>
                    <td className="num">
                      {c.stated}
                      {c.unit === "%" ? "%" : c.unit === "x" ? "x" : ""}
                    </td>
                    <td className="num">{c.delta === 0 ? "0" : c.delta > 0 ? `+${c.delta}` : c.delta}</td>
                    <td>{c.slides}</td>
                    <td>
                      {c.pass ? (
                        <span className="k-ok">{c.kind === "exact" ? "Exact" : "Ties (rounding)"}</span>
                      ) : (
                        <span className="k-flag">
                          <TriangleAlert size={13} aria-hidden="true" /> Off by {c.delta}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="k-tfoot-note">Units: $M unless marked % or x. &ldquo;Ties (rounding)&rdquo; means the gap is within the deck&rsquo;s own rounding (cells rounded to $1M; percentages to whole points).</p>
        </Block>
      ) : null}

      {tab === "conflicts" ? (
        <Block>
          <div className="k-pill-row" role="group" aria-label="Filter by kind">
            {(
              [
                ["all", `All (${model.conflicts.length})`],
                ["conflict", `Conflicts (${counts("conflict")})`],
                ["basis", `Different bases (${counts("basis")})`],
                ["rounding", `Rounding (${counts("rounding")})`],
                ["wip", `WIP / placeholders (${counts("wip")})`],
              ] as const
            ).map(([k, label]) => (
              <button key={k} type="button" className="k-pill" aria-pressed={kind === k} onClick={() => setKind(k)}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <DataTable
              columns={["Topic", "What the deck says", "Slides", "What this site shows"]}
              rows={conflicts.map((c) => [c.topic, c.values, c.slides, c.treatment])}
              wrapCols={[1, 3]}
            />
          </div>
        </Block>
      ) : null}

      {tab === "sources" ? (
        <Block>
          <div className="k-grid k-g2">
            <div className="k-card flat">
              <h4>Source document</h4>
              <p style={{ marginTop: 8, fontWeight: 650 }}>{model.meta.title}</p>
              <p className="k-sub">
                {model.meta.pages} slides · {model.meta.date} · {model.meta.status}
              </p>
              <p className="k-small" style={{ marginTop: 8, color: "var(--ink-2)" }}>
                Audience: {model.meta.audience}.
              </p>
              <p className="k-small" style={{ marginTop: 8, color: "var(--ink-2)" }}>{model.meta.fy26}</p>
              <p className="k-small" style={{ marginTop: 8, color: "var(--ink-2)" }}>
                Market = frontier-model tokens (any vendor) + enterprise AI seats; excludes GPU / infrastructure, SI services and consumer subscriptions. FX: KRW 1,400 = $1.
              </p>
              <p className="k-small" style={{ marginTop: 8, color: "var(--ink-2)" }}>{model.meta.names}</p>
            </div>
            <div className="k-card flat">
              <h4>How to read the labels</h4>
              <div className="k-build" style={{ marginTop: 10 }}>
                {(Object.keys(BASIS_LABEL) as Basis[]).map((b) => (
                  <div className="k-build-row" key={b}>
                    <Tag basis={b} />
                    <span className="k-small" style={{ textAlign: "right", color: "var(--ink-2)" }}>{BASIS_LABEL[b]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <DataTable columns={["Slides", "Content"]} rows={model.sourceMap.map((r) => [r.pages, r.content])} />
          </div>
          <p className="k-tfoot-note">
            Hyundai AutoEver: {money(model.autoEver.fy26)} held flat; {model.autoEver.accountPlan}
          </p>
        </Block>
      ) : null}
    </Section>
  );
}
