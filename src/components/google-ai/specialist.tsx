"use client";

import Link from "next/link";
import { fmtDate } from "@/lib/google-ai/dates";
import { TYPE_LABEL } from "@/lib/google-ai/engine/brief";
import type { MustKnow } from "@/lib/google-ai/engine/specialist";
import { ENTITY_BY_ID, providerName } from "@/lib/google-ai/kb";
import { REGION_BY_ID, SEGMENTS, SUB_VERTICAL_BY_ID } from "@/lib/google-ai/taxonomy";
import type { CaseStudy, Claim } from "@/lib/google-ai/types";
import { Callout, Cites, EntityLink, Ev } from "./ui";

/** A claim as one readable line with its label and sources. */
export function ClaimLine({ c }: { c: Claim }) {
  return (
    <p>
      {c.text} <Ev label={c.label} short /> <Cites ids={c.sourceIds} />
    </p>
  );
}

export function VerticalTags({ ids, max = 6 }: { ids: string[]; max?: number }) {
  const known = ids.filter((id) => SUB_VERTICAL_BY_ID[id]);
  if (!known.length) return null;
  return (
    <span className="gai-chipset">
      {known.slice(0, max).map((id) => (
        <Link key={id} className="gai-tag" href={`/google-ai/industries?v=${id}`}>{SUB_VERTICAL_BY_ID[id].name}</Link>
      ))}
      {known.length > max && <span className="gai-tag">+{known.length - max}</span>}
    </span>
  );
}

/** One must-know development: closed, it is a date and a headline; open, it is what happened, what to say and what to watch. */
export function NoteRow({ item, open }: { item: MustKnow; open?: boolean }) {
  const { a, note } = item;
  return (
    <details className="gai-toggle" open={open}>
      <summary>
        <span className="caret" aria-hidden>▶</span>
        <time dateTime={a.date}>{fmtDate(a.date)}</time>
        <span>
          <span className="ttl">{note?.headline ?? a.title}</span>
          {note?.headline && <span className="sub">{a.title}</span>}
        </span>
      </summary>
      <div className="body">
        <div className="gai-stack">
          {a.summary.slice(0, 2).map((c, i) => <ClaimLine key={i} c={c} />)}
          {a.pricingAvailability?.[0] && <ClaimLine c={a.pricingAvailability[0]} />}
        </div>
        {note ? (
          <Callout icon="💬" tone="talk">
            <p><b>What to say</b></p>
            <p>{note.talkTrack}</p>
            <p className="gai-small" style={{ marginTop: 4 }}><Ev label="analyst-interpretation" short /></p>
          </Callout>
        ) : a.implications?.[0] ? (
          <Callout icon="💡">
            <p><b>Why it matters</b></p>
            <p>{a.implications[0].text}</p>
            <p className="gai-small" style={{ marginTop: 4 }}><Ev label="analyst-interpretation" short /></p>
          </Callout>
        ) : null}
        {(note?.watchOut || a.uncertainty?.[0]) && (
          <Callout icon="⚠️">
            <p><b>Watch out</b></p>
            <p>{note?.watchOut ?? a.uncertainty?.[0]}</p>
          </Callout>
        )}
        <div className="gai-row">
          {a.types.slice(0, 3).map((t) => <span key={t} className="gai-tag">{TYPE_LABEL[t]}</span>)}
          {a.verification !== "verified" && <span className="gai-tag yellow">{a.verification.replace("-", " ")}</span>}
          {note && note.regions.length > 0 && note.regions.map((r) => <span key={r} className="gai-tag blue">{REGION_BY_ID[r]?.name}</span>)}
        </div>
        {note && <VerticalTags ids={note.subVerticals} />}
        <p className="gai-small">
          <Link className="gai-link" href={`/google-ai/latest/${a.id}`}>Full detail</Link>
          {a.entityIds.filter((id) => ENTITY_BY_ID[id]).slice(0, 3).map((id) => <span key={id}> · <EntityLink id={id} /></span>)}
        </p>
      </div>
    </details>
  );
}

export function PlatformTag({ c }: { c: CaseStudy }) {
  return c.platform === "google-cloud" ? <span className="gai-tag blue">Google Cloud</span> : <span className="gai-tag orange">Other platform</span>;
}

/** One case study: closed, a customer and one line; open, the full example with labelled claims and how to use it. */
export function CaseRow({ c, open }: { c: CaseStudy; open?: boolean }) {
  const segment = SEGMENTS.find((s) => s.id === c.segment);
  return (
    <details className="gai-toggle" id={c.id} open={open} style={{ scrollMarginTop: 60 }}>
      <summary>
        <span className="caret" aria-hidden>▶</span>
        <time dateTime={c.date}>{fmtDate(c.date, "month")}</time>
        <span>
          <span className="ttl"><span translate="no">{c.customer}</span> <PlatformTag c={c} /> <span className="gai-tag">{c.country}</span></span>
          <span className="sub">{c.title}</span>
        </span>
      </summary>
      <div className="body">
        <dl className="gai-props">
          <dt>Industry</dt>
          <dd>{segment?.name}{c.subVerticals.length ? " · " : ""}<VerticalTags ids={c.subVerticals} /></dd>
          <dt>Runs on</dt>
          <dd translate="no">{c.providers.map((p) => (ENTITY_BY_ID[p] ? providerName(p) : p)).join(", ") || "not stated"}</dd>
          <dt>Products</dt>
          <dd>{c.products.length ? <span className="gai-chipset">{c.products.map((p) => (ENTITY_BY_ID[p] ? <EntityLink key={p} id={p} /> : <span key={p} className="gai-tag" translate="no">{p}</span>))}</span> : "not stated"}</dd>
        </dl>
        {c.challenge.length > 0 && (<div className="gai-stack"><p className="gai-kicker">The problem</p>{c.challenge.map((x, i) => <ClaimLine key={i} c={x} />)}</div>)}
        {c.solution.length > 0 && (<div className="gai-stack"><p className="gai-kicker">What they built</p>{c.solution.map((x, i) => <ClaimLine key={i} c={x} />)}</div>)}
        <div className="gai-stack">
          <p className="gai-kicker">Reported results</p>
          {c.outcomes.length ? c.outcomes.map((x, i) => <ClaimLine key={i} c={x} />) : <p className="gai-muted">No result has been published with a source. None is shown rather than estimated.</p>}
        </div>
        <Callout icon="💬" tone="talk">
          <p><b>How to use this example</b></p>
          <p>{c.takeaway}</p>
          <p style={{ marginTop: 6 }}><b>When it helps: </b>{c.useWhen}</p>
          <p className="gai-small" style={{ marginTop: 4 }}><Ev label="analyst-interpretation" short /></p>
        </Callout>
        <p className="gai-small gai-muted">Published {fmtDate(c.date)} · <Cites ids={c.sourceIds} /></p>
      </div>
    </details>
  );
}
