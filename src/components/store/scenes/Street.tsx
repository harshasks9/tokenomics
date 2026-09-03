"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { monday, why, fourWays, talkTrack, strains, footer } from "@/lib/store/copy";
import { VitrineTableau, Shopfront } from "../tableaus";
import { StreetFooter } from "../rooms";

/* ------------------------------------------------------------------ */
/* A Customer's Monday — the receipt                                    */
/* ------------------------------------------------------------------ */

export function Monday() {
  return (
    <section id="monday" data-scene="monday" data-flow className="ds-monday" aria-labelledby="monday-title">
      <div className="ds-monday__streetglow" aria-hidden="true" />
      <div className="ds-monday__head">
        <p className="ds-eyebrow">Your receipt</p>
        <h2 id="monday-title" className="ds-headline" style={{ fontSize: "clamp(32px, 3.6vw, 54px)" }}>
          {monday.title}
        </h2>
        <p className="ds-monday__intro">{monday.intro}</p>
      </div>
      <div className="ds-receipt">
        <div className="ds-receipt__progress" aria-hidden="true">
          <i />
        </div>
        <div className="ds-receipt__header">
          <p className="ds-receipt__store">The Department Store for AI</p>
          <p className="ds-receipt__meta">
            <span>Customer: a regional bank</span>
            <span>Monday</span>
          </p>
        </div>
        <ol className="ds-receipt__list">
          {monday.steps.map((s, i) => {
            const last = i === monday.steps.length - 1;
            return (
              <li key={s.title} className={`ds-receipt__item${last ? " ds-receipt__item--final" : ""}`}>
                <span className="ds-receipt__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ds-receipt__title">{s.title}</span>
                <p className="ds-receipt__body">{s.body}</p>
              </li>
            );
          })}
        </ol>
        <div className="ds-receipt__total">
          <span>Store rebuilt</span>
          <span>0 times</span>
        </div>
        <div className="ds-receipt__barcode" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Why the department store matters — six window displays              */
/* ------------------------------------------------------------------ */

export function Why() {
  return (
    <section id="why" data-scene="why" data-flow data-reveal className="ds-why" aria-labelledby="why-title">
      <div className="ds-why__pavement" aria-hidden="true" />
      <div className="ds-why__head">
        <p className="ds-eyebrow">Window displays</p>
        <h2 id="why-title" className="ds-headline" style={{ fontSize: "clamp(32px, 3.6vw, 54px)" }}>
          {why.title}
        </h2>
      </div>
      <div className="ds-why__row">
        {why.cards.map((c, i) => (
          <article key={c.id} className="ds-vitrine" style={{ "--i": i } as CSSProperties}>
            <div className="ds-vitrine__glass">
              <VitrineTableau id={c.id} />
            </div>
            <h3 className="ds-vitrine__title">{c.title}</h3>
            <p className="ds-vitrine__body">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Four ways to build — the shops across the street + directory board  */
/* ------------------------------------------------------------------ */

export function FourWays() {
  return (
    <section id="four-ways" data-scene="four-ways" data-flow data-reveal className="ds-fourways" aria-labelledby="fourways-title">
      <div className="ds-fourways__head">
        <p className="ds-eyebrow">Across the street</p>
        <h2 id="fourways-title" className="ds-headline" style={{ fontSize: "clamp(32px, 3.6vw, 54px)" }}>
          {fourWays.title}
        </h2>
        <p className="ds-fourways__intro">{fourWays.intro}</p>
      </div>
      <div className="ds-shops">
        {fourWays.shops.map((s, i) => (
          <article key={s.id} className="ds-shop" style={{ "--i": i } as CSSProperties}>
            <div className="ds-shop__art">
              <Shopfront kind={s.id as "boutique" | "bazaar" | "warehouse"} />
            </div>
            <p className="ds-shop__awning">{s.title.replace(/\.$/, "")}</p>
            <h3 className="ds-shop__title">{s.title}</h3>
            <p className="ds-shop__body">{s.body}</p>
          </article>
        ))}
      </div>
      <div className="ds-board">
        <div className="ds-board__title">
          <span className="ds-sign">Store directory · four ways to build</span>
        </div>
        <div className="ds-board__scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">
                  <span className="ds-sr">Dimension</span>
                </th>
                {fourWays.columns.map((c, i) => (
                  <th key={c} scope="col" className={i === 3 ? "is-store" : undefined}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fourWays.rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {r.cells.map((cell, i) => (
                    <td key={i} className={i === 3 ? "is-store" : undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ds-board__hint">Scroll sideways to read the whole board →</p>
      </div>
      <p className="ds-fourways__closing">{fourWays.closing}</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The talk track — a script card on a walnut lectern                   */
/* ------------------------------------------------------------------ */

export function TalkTrack() {
  const [copied, setCopied] = useState(false);
  const [practice, setPractice] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!practice) {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
      return;
    }
    const start = Date.now();
    timer.current = window.setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 250);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [practice]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(talkTrack.paragraphs.join("\n\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <section id="talk-track" data-scene="talk-track" data-flow className="ds-talk" aria-labelledby="talk-title">
      <div className="ds-talk__light" aria-hidden="true" />
      <div className="ds-talk__wrap">
        <div className="ds-talk__head">
          <p className="ds-eyebrow">The concierge&rsquo;s script</p>
          <h2 id="talk-title" className="ds-headline" style={{ fontSize: "clamp(32px, 3.6vw, 54px)" }}>
            {talkTrack.title}
          </h2>
        </div>
        <div className="ds-lectern">
          <div className="ds-lectern__card">
            <div className="ds-lectern__meta">
              <span className="ds-lectern__readtime">Read time · {talkTrack.readTime}</span>
              <div className="ds-lectern__actions">
                <button type="button" className="ds-btn ds-btn--ink ds-copybtn" onClick={copy} data-copied={copied} aria-live="polite">
                  {copied ? "Copied" : "Copy talk track"}
                </button>
                <button
                  type="button"
                  className="ds-toggle"
                  aria-pressed={practice}
                  onClick={() => {
                    setElapsed(0);
                    setPractice((v) => !v);
                  }}
                >
                  Practice
                  <span className="ds-toggle__time" aria-label={`Elapsed ${mm} minutes ${ss} seconds`}>
                    {mm}:{ss}
                  </span>
                </button>
              </div>
            </div>
            {talkTrack.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="ds-lectern__p">
                {p}
              </p>
            ))}
          </div>
          <div className="ds-lectern__stand" aria-hidden="true" />
          <div className="ds-lectern__post" aria-hidden="true" />
          <div className="ds-lectern__base" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Where the analogy strains — a brass plaque set into marble           */
/* ------------------------------------------------------------------ */

export function Strains() {
  return (
    <section id="strains" data-scene="strains" data-flow className="ds-strains" aria-labelledby="strains-title">
      <div className="ds-strains__marble">
        <div className="ds-plaque">
          <i aria-hidden="true" />
          <p id="strains-title" className="ds-strains__title">
            {strains.title}
          </p>
          <p className="ds-strains__body">{strains.body}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer — the street at night                                         */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer id="footer" data-scene="footer" data-flow className="ds-footer">
      <div className="ds-footer__scene" aria-hidden="true">
        <StreetFooter />
      </div>
      <div className="ds-footer__lines">
        <div>
          <p className="ds-footer__wordmark">
            The Department Store for AI
            <span className="ds-dots" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          </p>
          <p>{footer.attribution}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p>{footer.builtAs}</p>
          <p>{footer.year}</p>
        </div>
      </div>
    </footer>
  );
}
