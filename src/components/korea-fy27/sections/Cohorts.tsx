"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useSite } from "../context";
import { Block, MotionTag, Section, Src } from "../ui";
import { Meter } from "../charts";
import { losBand, money, PLAY_STATE_LABEL, SEGMENT_LABEL } from "@/lib/korea-fy27/format";
import type { CohortId, MotionId, PlayId, SegmentId } from "@/lib/korea-fy27/types";

type Filters = { segment: SegmentId | "all"; motion: MotionId | "all"; play: PlayId | "all"; coverage: string; los: string; sort: "fy27" | "added" | "los" | "num" };

export default function CohortsSection() {
  const { model, openCohort } = useSite();
  const { cohorts, execution } = model;
  const [f, setF] = useState<Filters>({ segment: "all", motion: "all", play: "all", coverage: "all", los: "all", sort: "fy27" });
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((x) => ({ ...x, [k]: v }));

  const shown = useMemo(() => {
    const list = cohorts.filter(
      (c) =>
        (f.segment === "all" || c.segment === f.segment) &&
        (f.motion === "all" || c.motion === f.motion) &&
        (f.play === "all" || c.plays[f.play] === "lead") &&
        (f.coverage === "all" || c.coverage === f.coverage) &&
        (f.los === "all" || losBand(c.losPct) === f.los),
    );
    const key = f.sort;
    return [...list].sort((a, b) => (key === "num" ? a.num - b.num : key === "los" ? b.losPct - a.losPct : key === "added" ? b.added - a.added : b.fy27 - a.fy27));
  }, [cohorts, f]);

  const chip = (id: CohortId) => {
    const c = cohorts.find((x) => x.id === id)!;
    return (
      <button type="button" className="k-cchip" key={id} onClick={() => openCohort(id)} aria-label={`Open ${c.name}`}>
        <span>
          {c.name}
          <small>
            {c.accounts} · FY26 {money(c.fy26)}
          </small>
        </span>
        <b>+{money(c.added)}</b>
      </button>
    );
  };

  return (
    <Section
      id="cohorts"
      num="05"
      label="Cohorts"
      question="How does the strategy become owned books of business?"
      headline="Eight cohorts own the number. Each needs one owner, one $ target and one quarterly run-rate KPI."
      lead="Every Korea account sits in one cell, with one motion, its lead plays and one owner. Select a cohort to see how its number is built, what we sell, how we deliver, who staffs it and what is still unresolved."
    >
      <Block title="The motion map" sub="Vertical: AI spend with Google. Horizontal: established on GCP vs new to GCP. Amounts are FY27 added AI.">
        <div className="k-map">
          <div className="yax" aria-hidden="true">
            <span>Low / no AI with us</span>
            <span>High AI with us</span>
          </div>
          <div className="k-quad q-deepen" style={{ borderTop: "4px solid var(--deepen)" }}>
            <h4>
              <MotionTag motion="deepen" /> <em>+$277M · grow where we are strong</em>
            </h4>
            <div className="chips">{(["big-ai", "samsung"] as CohortId[]).map(chip)}</div>
          </div>
          <div className="k-quad span q-acquire" style={{ borderTop: "4px solid var(--acquire)" }}>
            <h4>
              <MotionTag motion="acquire" /> <em>+$257M · win where we are absent</em>
            </h4>
            <p className="k-small k-muted" style={{ marginTop: 10, fontWeight: 650 }}>Already buying AI elsewhere · +$193M</p>
            <div className="chips">{(["startups"] as CohortId[]).map(chip)}</div>
            <p className="k-small k-muted" style={{ marginTop: 14, fontWeight: 650 }}>New to AI · +$64M</p>
            <div className="chips">{(["trad-ent", "mid-market", "public"] as CohortId[]).map(chip)}</div>
          </div>
          <div className="k-quad q-penetrate" style={{ borderTop: "4px solid var(--penetrate)" }}>
            <h4>
              <MotionTag motion="penetrate" /> <em>+$142M · turn GCP spend into AI</em>
            </h4>
            <div className="chips">{(["big-gcp", "flagship"] as CohortId[]).map(chip)}</div>
          </div>
          <div className="xax" aria-hidden="true">
            <span>Established on GCP</span>
            <span>New to GCP</span>
          </div>
        </div>
        <Src src={[{ part: "main", slides: "11" }, { part: "B", slides: "93" }]} basis={["stated"]} />
      </Block>

      <Block title="Cohort explorer" sub="Filter by segment, motion, lead play, coverage model or line of sight. Lead plays follow slide 17 (updated 1 Oct).">
        <div className="k-filters k-noprint" role="group" aria-label="Cohort filters">
          <label>
            Segment
            <select className="k-select" value={f.segment} onChange={(e) => set("segment", e.target.value as Filters["segment"])}>
              <option value="all">All</option>
              {model.market.segments.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Motion
            <select className="k-select" value={f.motion} onChange={(e) => set("motion", e.target.value as Filters["motion"])}>
              <option value="all">All</option>
              <option value="deepen">Deepen</option>
              <option value="penetrate">Penetrate</option>
              <option value="acquire">Acquire</option>
            </select>
          </label>
          <label>
            Lead play
            <select className="k-select" value={f.play} onChange={(e) => set("play", e.target.value as Filters["play"])}>
              <option value="all">Any</option>
              {execution.plays.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Coverage
            <select className="k-select" value={f.coverage} onChange={(e) => set("coverage", e.target.value)}>
              <option value="all">All</option>
              <option value="Direct">Direct</option>
              <option value="Direct + partner">Direct + partner</option>
              <option value="Partner-led">Partner-led</option>
            </select>
          </label>
          <label>
            Line of sight
            <select className="k-select" value={f.los} onChange={(e) => set("los", e.target.value)}>
              <option value="all">All</option>
              <option value="High">High (≥35%)</option>
              <option value="Medium">Medium (10–35%)</option>
              <option value="Low">Low (&lt;10%)</option>
            </select>
          </label>
          <label>
            Sort
            <select className="k-select" value={f.sort} onChange={(e) => set("sort", e.target.value as Filters["sort"])}>
              <option value="fy27">FY27 target</option>
              <option value="added">FY27 added</option>
              <option value="los">Line of sight</option>
              <option value="num">Cohort number</option>
            </select>
          </label>
          <span className="count" aria-live="polite">
            {shown.length} of {cohorts.length} cohorts
          </span>
        </div>

        <div className="k-cohorts">
          {shown.map((c) => (
            <button type="button" className="k-ccard" key={c.id} onClick={() => openCohort(c.id)} aria-label={`Open the ${c.name} cohort plan`}>
              <div className="top">
                <span className="num">
                  Cohort {c.num} · {SEGMENT_LABEL[c.segment]}
                </span>
                <MotionTag motion={c.motion} />
              </div>
              <h3>{c.name}</h3>
              <div className="eco">
                <b>~{money(c.fy27)}</b>
                <span>
                  from {money(c.fy26)} · +{money(c.added)}{c.multiple ? ` · ${c.multiple}` : ""}
                </span>
              </div>
              <p className="meta">
                {c.accounts} · {c.coverage}
              </p>
              <p className="assume">{c.assumption}</p>
              <Meter pct={c.losPct} low={c.losPct < 10} label={`Line of sight ~${c.losPct}%`} right={`${money(c.runRate)} run-rate`} />
              <div className="k-dots" aria-label="Lead plays">
                {execution.plays
                  .filter((p) => c.plays[p.id] !== "none")
                  .map((p) => (
                    <span key={p.id} className={`k-dot ${c.plays[p.id]}`} title={PLAY_STATE_LABEL[c.plays[p.id]]}>
                      <i aria-hidden="true" />
                      {p.name}
                    </span>
                  ))}
              </div>
              <span className="more">
                Open the cohort plan <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
              </span>
            </button>
          ))}
        </div>
        {shown.length === 0 ? <p className="k-sub" style={{ marginTop: 12 }}>No cohort matches these filters.</p> : null}
        <p className="k-legend" style={{ marginTop: 12 }}>
          <span>
            <span className="k-dot lead"><i aria-hidden="true" /></span> Lead play
          </span>
          <span>
            <span className="k-dot second"><i aria-hidden="true" /></span> Second line
          </span>
        </p>
      </Block>

      <Block>
        <div className="k-callout light">
          Hyundai AutoEver is held flat at {money(model.autoEver.fy26)} and is not a cohort.
          <small>
            {model.autoEver.note} Eight cohorts ({money(cohorts.reduce((s, c) => s + c.fy27, 0))}) + AutoEver ({money(model.autoEver.fy27)}) ≈ ~$900M.
          </small>
        </div>
        <Src src={[{ part: "main", slides: "12, 13" }, { part: "C", slides: "97" }]} basis={["stated"]} />
      </Block>
    </Section>
  );
}
