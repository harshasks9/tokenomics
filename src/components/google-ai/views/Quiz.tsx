"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fmtDate } from "@/lib/google-ai/dates";
import {
  RECENT_DAYS,
  ROUND_LENGTHS,
  TOPIC_LABEL,
  draw,
  inScope,
  isBetter,
  isCorrect,
  missed,
  parseBest,
  score,
  topicsIn,
  usable,
  verdict,
  type BestScores,
  type DrawnQuestion,
  type QuizScope,
} from "@/lib/google-ai/engine/quiz";
import { ANNOUNCEMENT_BY_ID, ENTITY_BY_ID, QUIZ } from "@/lib/google-ai/kb";
import type { QuizQuestion } from "@/lib/google-ai/types";
import { Cites, Empty, PageHead, useHub } from "../ui";
import "./specialist.css";

const BEST_KEY = "gai-quiz-best";

function readBest(): BestScores {
  try {
    return parseBest(localStorage.getItem(BEST_KEY));
  } catch {
    return {};
  }
}
function writeBest(best: BestScores) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    /* storage unavailable: the best score is simply not remembered */
  }
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const scopeLabel = (s: QuizScope) => (s === "recent" ? "Recent news" : s === "all" ? "Everything" : TOPIC_LABEL[s]);

interface RecordRef {
  href: string;
  title: string;
  /** Product and company names are left untranslated; development titles are sentences and are translated. */
  isName: boolean;
}

/** Records in the knowledge base that a question is drawn from. Ids that do not resolve are left out, so nothing links to a dead page. */
function recordsOf(q: QuizQuestion): RecordRef[] {
  const out: RecordRef[] = [];
  const a = q.announcementId ? ANNOUNCEMENT_BY_ID[q.announcementId] : undefined;
  if (a) out.push({ href: `/google-ai/latest/${a.id}`, title: a.title, isName: false });
  const e = q.entityId ? ENTITY_BY_ID[q.entityId] : undefined;
  if (e) out.push({ href: `/google-ai/entity/${e.id}`, title: e.name, isName: true });
  return out;
}

/** Opens in a new tab so a round in progress is not lost. */
function RecordLinks({ q }: { q: QuizQuestion }) {
  const records = recordsOf(q);
  if (!records.length) return null;
  return (
    <>
      {records.map((r) => (
        <Link key={r.href} className="gai-link" href={r.href} target="_blank" translate={r.isName ? "no" : undefined}>
          {r.title}
          <span className="gai-sr"> (opens in a new tab)</span>
        </Link>
      ))}
    </>
  );
}

function Provenance({ q }: { q: QuizQuestion }) {
  return (
    <p className="gai-sp-meta">
      <span>{`True as of ${fmtDate(q.asOf)}`}</span>
      <Cites ids={q.sourceIds} />
      <RecordLinks q={q} />
    </p>
  );
}

export default function Quiz() {
  const { today } = useHub();
  const all = useMemo(() => usable(QUIZ), []);
  const topics = useMemo(() => topicsIn(all), [all]);

  const [scope, setScope] = useState<QuizScope>(() => (inScope(usable(QUIZ), "recent", today).length ? "recent" : "all"));
  const [length, setLength] = useState<number>(ROUND_LENGTHS[1]);
  const [best, setBest] = useState<BestScores>({});
  const [round, setRound] = useState<DrawnQuestion[] | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [at, setAt] = useState(0);
  const [finished, setFinished] = useState(false);
  const [newBest, setNewBest] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setBest(readBest()));
  }, []);

  const pool = useMemo(() => inScope(all, scope, today), [all, scope, today]);
  const phase = !round ? "start" : finished ? "result" : "question";

  // The draw happens here, in a click handler, never during render: the server and the browser would disagree.
  const start = useCallback(() => {
    const drawn = draw(inScope(all, scope, today), length);
    if (!drawn.length) return;
    setRound(drawn);
    setAnswers([]);
    setAt(0);
    setFinished(false);
    setNewBest(false);
  }, [all, scope, today, length]);

  const choose = useCallback(
    (option: string) => {
      setAnswers((prev) => {
        if (prev[at] != null) return prev;
        const next = prev.slice();
        next[at] = option;
        return next;
      });
    },
    [at],
  );

  const next = useCallback(() => {
    if (!round || answers[at] == null) return;
    if (at + 1 < round.length) {
      setAt(at + 1);
      return;
    }
    const s = score(round, answers);
    const stored = readBest();
    const better = isBetter(s, stored[scope]);
    if (better) {
      const updated = { ...stored, [scope]: { correct: s.correct, total: s.total } };
      writeBest(updated);
      setBest(updated);
    } else {
      setBest(stored);
    }
    setNewBest(better);
    setFinished(true);
  }, [round, answers, at, scope]);

  const reset = useCallback(() => {
    setRound(null);
    setFinished(false);
  }, []);

  if (!all.length) {
    return (
      <>
        <PageHead icon="🎯" title="Test what you know" />
        <div className="gai-sp-step">
          <Empty title="No quiz questions recorded yet">Questions are written from the dated records on this site and appear here once they are checked. Nothing is shown rather than invented.</Empty>
          <div className="gai-sp-actions">
            <Link className="gai-btn" href="/google-ai">Read today&apos;s must-know</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead icon="🎯" title="Test what you know" lede={phase === "start" ? "A short round of questions drawn from the dated records on this site. There is no timer, and every answer shows where it comes from." : undefined} />

      {phase === "start" && (
        <div className="gai-sp-step">
          <fieldset className="gai-sp-field">
            <legend>What to test</legend>
            <div className="gai-chipset">
              {(["recent", "all", ...topics] as QuizScope[]).map((s) => (
                <button key={s} type="button" className="gai-chip" aria-pressed={scope === s} onClick={() => setScope(s)}>
                  {scopeLabel(s)}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="gai-sp-field">
            <legend>How many questions</legend>
            <div className="gai-chipset">
              {ROUND_LENGTHS.map((n) => (
                <button key={n} type="button" className="gai-chip" aria-pressed={length === n} onClick={() => setLength(n)}>
                  {n}
                </button>
              ))}
            </div>
          </fieldset>
          <p className="gai-sp-quiet" role="status">
            {pool.length === 0
              ? scope === "recent"
                ? `No question is dated within the last ${RECENT_DAYS} days. Choose “Everything” or a topic.`
                : "No question is recorded for this choice yet."
              : pool.length < length
                ? `This set holds ${plural(pool.length, "question", "questions")}, so the round will be that long.`
                : scope === "recent"
                  ? `${plural(pool.length, "question", "questions")} dated within the last ${RECENT_DAYS} days. Each round is a new random draw.`
                  : `${plural(pool.length, "question", "questions")} in this set. Each round is a new random draw.`}
          </p>
          <div className="gai-sp-actions">
            <button type="button" className="gai-btn primary" disabled={!pool.length} onClick={start}>
              Start
            </button>
            {best[scope] && <span className="gai-sp-quiet">{`Best so far for ${scopeLabel(scope)}: ${best[scope]?.correct} of ${best[scope]?.total}`}</span>}
          </div>
        </div>
      )}

      {phase === "question" && round && (
        <QuestionStep key={round[at].q.id + ":" + at} d={round[at]} n={at + 1} total={round.length} chosen={answers[at] ?? null} onChoose={choose} onNext={next} />
      )}

      {phase === "result" && round && <ResultStep round={round} answers={answers} newBest={newBest} scope={scope} onAgain={start} onReset={reset} />}
    </>
  );
}

function QuestionStep({ d, n, total, chosen, onChoose, onNext }: { d: DrawnQuestion; n: number; total: number; chosen: string | null; onChoose: (option: string) => void; onNext: () => void }) {
  const head = useRef<HTMLHeadingElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const answered = chosen != null;
  const ok = isCorrect(d, chosen);

  // A new question takes focus so keyboard and screen-reader users land on it; once answered, focus moves to "Next".
  useEffect(() => {
    head.current?.focus();
  }, []);
  useEffect(() => {
    if (answered) nextBtn.current?.focus();
  }, [answered]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target instanceof HTMLElement ? e.target : null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (!answered && /^[1-9]$/.test(e.key)) {
        const option = d.options[Number(e.key) - 1];
        if (option == null) return;
        e.preventDefault();
        onChoose(option);
      } else if (answered && e.key === "Enter" && !el?.closest("button, a, summary")) {
        // On a button or link, Enter already does that control's own job.
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, d, onChoose, onNext]);

  return (
    <section className="gai-sp-step" aria-labelledby="gai-sp-question">
      <div className="gai-sp-progress">
        <p className="gai-sp-count">{`Question ${n} of ${total}`}</p>
        <div className="gai-sp-bar" aria-hidden>
          <i style={{ width: `${((n - 1 + (answered ? 1 : 0)) / total) * 100}%` }} />
        </div>
      </div>
      <h2 className="gai-h2 gai-sp-q" id="gai-sp-question" tabIndex={-1} ref={head}>
        {d.q.question}
      </h2>
      <ol className="gai-sp-opts">
        {d.options.map((option, i) => {
          const state = !answered ? "open" : option === d.correct ? "correct" : option === chosen ? "wrong" : "rest";
          return (
            <li key={option}>
              <button type="button" className="gai-sp-opt" data-state={state} aria-disabled={answered} aria-pressed={option === chosen} onClick={() => onChoose(option)}>
                <span className="gai-sp-key" aria-hidden>{i + 1}</span>
                <span className="gai-sp-opt-text">{option}</span>
                {state === "correct" && <span className="gai-sp-mark">{option === chosen ? "✓ Correct. This was your answer." : "✓ This is the correct answer."}</span>}
                {state === "wrong" && <span className="gai-sp-mark">✗ Your answer. Not correct.</span>}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="gai-sp-feedback" role="status">
        {answered && (
          <>
            <p className="gai-sp-verdict">{ok ? "✓ Correct" : "✗ Not correct"}</p>
            <p>{d.q.explanation}</p>
            <Provenance q={d.q} />
          </>
        )}
      </div>
      <div className="gai-sp-actions">
        {answered ? (
          <>
            <button type="button" className="gai-btn primary" ref={nextBtn} onClick={onNext}>
              {n < total ? "Next" : "See your result"}
            </button>
            <span className="gai-sp-quiet gai-sp-hint">Enter continues.</span>
          </>
        ) : (
          <span className="gai-sp-quiet gai-sp-hint">{`Keys 1 to ${d.options.length} choose an answer. Take your time.`}</span>
        )}
      </div>
    </section>
  );
}

function ResultStep({ round, answers, newBest, scope, onAgain, onReset }: { round: DrawnQuestion[]; answers: (string | null)[]; newBest: boolean; scope: QuizScope; onAgain: () => void; onReset: () => void }) {
  const head = useRef<HTMLHeadingElement>(null);
  const [showMissed, setShowMissed] = useState(false);
  const s = score(round, answers);
  const wrong = useMemo(() => missed(round, answers), [round, answers]);
  // One line per record, however many missed questions point at it.
  const toRead = useMemo(() => {
    const seen = new Set<string>();
    return wrong.flatMap((d) => recordsOf(d.q)).filter((r) => !seen.has(r.href) && (seen.add(r.href), true));
  }, [wrong]);
  const unlinked = wrong.filter((d) => !recordsOf(d.q).length).length;

  useEffect(() => {
    head.current?.focus();
  }, []);

  return (
    <section className="gai-sp-step" aria-labelledby="gai-sp-result">
      <div>
        <p className="gai-sp-count">{`Result · ${scopeLabel(scope)}`}</p>
        <h2 className="gai-sp-score" id="gai-sp-result" tabIndex={-1} ref={head}>
          {`${s.correct} of ${s.total} correct`}
        </h2>
      </div>
      <p className="gai-lede">{verdict(s)}</p>
      {newBest && <p className="gai-sp-quiet">This is your best result for this set so far.</p>}

      <div className="gai-sp-actions">
        <button type="button" className="gai-btn primary" onClick={onAgain}>
          Try again
        </button>
        {wrong.length > 0 && (
          <button type="button" className="gai-btn" aria-expanded={showMissed} aria-controls="gai-sp-missed" onClick={() => setShowMissed((v) => !v)}>
            Review what I missed
          </button>
        )}
        <Link className="gai-btn" href="/google-ai">Read today&apos;s must-know</Link>
      </div>
      <button type="button" className="gai-sp-textbtn" onClick={onReset}>
        Change the topic or the number of questions
      </button>

      {showMissed && (
        <div className="gai-callout" id="gai-sp-missed">
          <span className="ico" aria-hidden>📖</span>
          <div className="gai-stack">
            {toRead.length > 0 ? (
              <>
                <p>{`The ${plural(wrong.length, "question", "questions")} you missed come from ${toRead.length === 1 ? "this record" : "these records"}.`}</p>
                <ul className="gai-sp-missed">
                  {toRead.map((r) => (
                    <li key={r.href}>
                      <Link className="gai-link" href={r.href} target="_blank" translate={r.isName ? "no" : undefined}>
                        {r.title}
                        <span className="gai-sr"> (opens in a new tab)</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>None of the questions you missed is linked to a record on this site.</p>
            )}
            {unlinked > 0 && <p className="gai-small gai-muted">{`${plural(unlinked, "missed question has", "missed questions have")} no linked record. The sources are listed with each answer below.`}</p>}
          </div>
        </div>
      )}

      <div>
        <h3 className="gai-h3">Every question in this round</h3>
        <ol className="gai-sp-review">
          {round.map((d, i) => {
            const mine = answers[i] ?? null;
            const ok = isCorrect(d, mine);
            return (
              <li key={d.q.id}>
                <p className="gai-sp-rq">{`${i + 1}. ${d.q.question}`}</p>
                <dl className="gai-sp-ans">
                  <dt>Your answer</dt>
                  <dd data-ok={ok ? 1 : 0}>{`${ok ? "✓ Correct" : "✗ Not correct"}: ${mine ?? "no answer given"}`}</dd>
                  {!ok && (
                    <>
                      <dt>Correct answer</dt>
                      <dd>{d.correct}</dd>
                    </>
                  )}
                </dl>
                <p className="gai-sp-explain">{d.q.explanation}</p>
                <Provenance q={d.q} />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
