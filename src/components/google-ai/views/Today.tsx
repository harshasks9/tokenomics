"use client";

import Link from "next/link";
import { useMemo } from "react";
import { fmtDate } from "@/lib/google-ai/dates";
import { deadlines } from "@/lib/google-ai/engine/brief";
import { casesFor, mustKnow, rivalMoves } from "@/lib/google-ai/engine/specialist";
import { META, QUIZ, REGION_BRIEFS, providerName } from "@/lib/google-ai/kb";
import { REGION_BY_ID } from "@/lib/google-ai/taxonomy";
import type { StatusPayload } from "../Hub";
import { CaseRow, ClaimLine, NoteRow } from "../specialist";
import { Callout, Cites, Empty, Ev, PageHead, Sec, useHub } from "../ui";

/**
 * Today — the page an AI specialist opens before a customer meeting.
 * Four questions, in order: what must I know, what do I say, what is coming, what did rivals do.
 */
export default function Today({ status }: { status: StatusPayload | null }) {
  const { today, region } = useHub();
  const { items, days } = useMemo(() => mustKnow(today, { region }, { limit: 10 }), [today, region]);
  const upcoming = useMemo(() => deadlines(today).filter((d) => d.days <= 60).slice(0, 6), [today]);
  const rivals = useMemo(() => rivalMoves(today, 21).slice(0, 6), [today]);
  const brief = region === "all" ? undefined : REGION_BRIEFS.find((b) => b.id === region);
  const regionName = region === "all" ? "Asia-Pacific" : REGION_BY_ID[region].name;
  const example = useMemo(() => casesFor({ region })[0] ?? casesFor({})[0], [region]);
  const detected = useMemo(() => (status?.items ?? []).filter((i) => !i.knownAs && i.providerId === "google" && (i.published ?? "") > META.curatedAt).slice(0, 8), [status]);
  const digestById = useMemo(() => new Map((status?.digest?.notes ?? []).map((d) => [d.itemId, d])), [status]);

  return (
    <>
      <PageHead icon="☀️" title="Today for AI specialists" lede={`What changed in Google AI, what to say about it, and what is coming — for ${regionName}.`} />

      {brief && (
        <Callout icon="📍">
          <p><b>Selling AI in {regionName}</b></p>
          <p>{brief.angle}</p>
          <details style={{ marginTop: 8 }}>
            <summary className="gai-small">Facts to know about this market</summary>
            <div className="gai-stack" style={{ marginTop: 8 }}>{brief.facts.map((c, i) => <ClaimLine key={i} c={c} />)}</div>
          </details>
        </Callout>
      )}

      <Sec title="Must know" sub={`The developments that matter most from the last ${days} days. Open one for what happened, what to say and what to watch.`}>
        {items.length === 0 ? (
          <Empty title="Nothing recorded for this window">No development in the knowledge base falls in the last {days} days{region !== "all" ? ` for ${regionName}` : ""}. The knowledge base was last updated on {fmtDate(META.curatedAt)}.</Empty>
        ) : (
          <div>{items.map((item, i) => <NoteRow key={item.a.id} item={item} open={i === 0} />)}</div>
        )}
        <p className="gai-small" style={{ marginTop: 10 }}><Link className="gai-link" href="/google-ai/latest">All developments</Link></p>
      </Sec>

      <Sec title="Coming up" sub="Changes that are already announced and take effect soon. Until the date, the current price or status applies.">
        {upcoming.length === 0 ? <Empty title="No dated change in the next 60 days" /> : (
          <ul className="gai-claims">
            {upcoming.map((d) => (
              <li key={d.event.id}>
                <span>
                  <b>{fmtDate(d.on)}</b> · in {d.days} {d.days === 1 ? "day" : "days"} · <Link className="gai-link" translate="no" href={`/google-ai/entity/${d.event.entityId}`}>{d.name}</Link>
                </span>
                <span>{d.event.detail} <Ev label={d.event.label} short /> <Cites ids={d.event.sourceIds} /></span>
              </li>
            ))}
          </ul>
        )}
      </Sec>

      <Sec title="What rivals did" sub="Competitor moves from the last three weeks. Useful context, not a response guide.">
        {rivals.length === 0 ? <Empty title="No competitor move recorded in the last three weeks" /> : (
          <ul className="gai-claims">
            {rivals.map((t) => (
              <li key={t.id}>
                <span><b>{fmtDate(t.date)}</b> · <span className="gai-tag" translate="no">{providerName(t.providerId)}</span> {t.title}</span>
                <span className="gai-muted">{t.detail} <Cites ids={t.sourceIds} /></span>
              </li>
            ))}
          </ul>
        )}
        <p className="gai-small" style={{ marginTop: 10 }}><Link className="gai-link" href="/google-ai/compare#battlegrounds">Where Google stands against each rival</Link></p>
      </Sec>

      <Sec title="New since the last update" sub="Found automatically in official feeds by the daily check. Not yet reviewed by an editor, so treat these as leads and open the source.">
        {detected.length === 0 ? (
          <Empty title={status?.pipeline?.lastRun ? "Nothing new is waiting" : "The daily check has not reported yet"}>
            {status?.pipeline?.lastSuccessAt ? `Official sources were last checked on ${fmtDate(status.pipeline.lastSuccessAt.slice(0, 10))}.` : "When the daily check runs, new official posts appear here before an editor has reviewed them."}
          </Empty>
        ) : (
          <ul className="gai-claims">
            {detected.map((d) => {
              const auto = digestById.get(d.id);
              return (
                <li key={d.id}>
                  <span><b>{d.published ? fmtDate(d.published) : "Undated"}</b> · <a className="gai-link" href={d.url} target="_blank" rel="noreferrer noopener">{auto?.headline ?? d.title}</a> <span className="gai-tag yellow">unreviewed</span></span>
                  <span className="gai-muted">{auto ? auto.talkTrack : d.excerpt} <span className="gai-small">— {d.publisher}{auto ? ", summarised automatically" : ""}</span></span>
                </li>
              );
            })}
          </ul>
        )}
      </Sec>

      <Sec title="Keep going">
        <div className="gai-grid gai-g3">
          <Link className="gai-card link" href="/google-ai/quiz"><b>🎯 Test yourself</b><p className="gai-small gai-muted">{QUIZ.length ? `${QUIZ.length} questions on recent developments.` : "Questions on recent developments."}</p></Link>
          <Link className="gai-card link" href="/google-ai/industries"><b>🏭 Pick your industries</b><p className="gai-small gai-muted">News, examples and talking points by sub-vertical.</p></Link>
          <Link className="gai-card link" href="/google-ai/graph"><b>🕸️ Explore connections</b><p className="gai-small gai-muted">See how products, models and companies relate.</p></Link>
        </div>
        {example && (
          <div style={{ marginTop: 16 }}>
            <p className="gai-kicker" style={{ marginBottom: 4 }}>A customer example to have ready</p>
            <CaseRow c={example} />
            <p className="gai-small" style={{ marginTop: 10 }}><Link className="gai-link" href="/google-ai/cases">All case studies</Link></p>
          </div>
        )}
      </Sec>
    </>
  );
}
