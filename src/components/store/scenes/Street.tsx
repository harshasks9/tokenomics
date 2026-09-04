"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { receipt, windows, across, talk, plaque, footer } from "@/lib/store/copy";
import { VitrineTableau, Shopfront } from "../tableaus";
import { StreetFooter } from "../rooms";
import { Narrator } from "../Objects";

/* ------------------------------------------------------------------ */
/* 12. Your receipt                                                     */
/* ------------------------------------------------------------------ */

export function Receipt() {
  return (
    <section id="receipt" data-scene="receipt" data-flow className="ds-monday" aria-labelledby="receipt-title">
      <div className="ds-monday__streetglow" aria-hidden="true" />
      <div className="ds-monday__head">
        <p className="ds-eyebrow">Stop 11 · One customer&rsquo;s first day</p>
        <h2 id="receipt-title" className="ds-h2">
          {receipt.title}
        </h2>
      </div>
      <div className="ds-receipt">
        <div className="ds-receipt__progress" aria-hidden="true">
          <i />
        </div>
        <div className="ds-receipt__header">
          <p className="ds-receipt__store">{receipt.header}</p>
          <p className="ds-receipt__meta">{receipt.subheader}</p>
        </div>
        <ol className="ds-receipt__list">
          {receipt.lines.map((s, i) => {
            const last = i === receipt.lines.length - 1;
            return (
              <li key={s.title} className={`ds-receipt__item${last ? " ds-receipt__item--final" : ""}`}>
                <span className="ds-receipt__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ds-receipt__title">{s.title}</span>
                <p className="ds-receipt__body">{s.body}</p>
              </li>
            );
          })}
        </ol>
        <p className="ds-receipt__footer">{receipt.footer}</p>
        <div className="ds-receipt__barcode" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 13. Window displays                                                  */
/* ------------------------------------------------------------------ */

export function Windows() {
  return (
    <section id="windows" data-scene="windows" data-flow data-reveal className="ds-why" aria-labelledby="windows-title">
      <div className="ds-why__pavement" aria-hidden="true" />
      <div className="ds-why__head">
        <p className="ds-eyebrow">Stop 12 · Six reasons</p>
        <h2 id="windows-title" className="ds-h2">
          {windows.title}
        </h2>
        <Narrator className="ds-narrator--dark ds-narrator--center">{windows.narrator}</Narrator>
      </div>
      <div className="ds-why__row">
        {windows.items.map((c, i) => (
          <article key={c.id} className="ds-vitrine" style={{ "--i": i } as CSSProperties}>
            <span className="ds-vitrine__n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
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
/* 14. Across the street                                                */
/* ------------------------------------------------------------------ */

export function Across() {
  return (
    <section id="across" data-scene="across" data-flow data-reveal className="ds-fourways" aria-labelledby="across-title">
      <div className="ds-fourways__head">
        <p className="ds-eyebrow">Stop 13 · Four ways to build</p>
        <h2 id="across-title" className="ds-h2">
          {across.title}
        </h2>
        <Narrator className="ds-narrator--dark ds-narrator--center">{across.narrator}</Narrator>
      </div>
      <div className="ds-shops">
        {across.shops.map((s, i) => (
          <article key={s.id} className="ds-shop" style={{ "--i": i } as CSSProperties}>
            <div className="ds-shop__art">
              <Shopfront kind={s.id as "boutique" | "bazaar" | "warehouse"} />
            </div>
            <h3 className="ds-shop__awning">{s.awning}</h3>
            <p className="ds-shop__body">{s.body}</p>
          </article>
        ))}
      </div>
      <div className="ds-board ds-board--table">
        <div className="ds-board__head">
          <span className="ds-sign">Directory board · four archetypes compared</span>
        </div>
        <div className="ds-board__scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">
                  <span className="ds-sr">Dimension</span>
                </th>
                {across.columns.map((c, i) => (
                  <th key={c} scope="col" className={i === 3 ? "is-store" : undefined}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {across.rows.map((r) => (
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
      <p className="ds-fourways__closing">{across.closing}</p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 15. The talk track                                                   */
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
      await navigator.clipboard.writeText(talk.paragraphs.join("\n\n"));
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
          <p className="ds-eyebrow">Stop 14 · Say it in ninety seconds</p>
          <h2 id="talk-title" className="ds-h2">
            {talk.title}
          </h2>
        </div>
        <div className="ds-lectern">
          <div className="ds-lectern__card">
            <div className="ds-lectern__meta">
              <span className="ds-lectern__readtime">{talk.lectern}</span>
              <div className="ds-lectern__actions">
                <button type="button" className="ds-btn ds-btn--ink ds-copybtn" onClick={copy} data-copied={copied} aria-live="polite">
                  {copied ? "Copied" : talk.button}
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
            {talk.paragraphs.map((p) => (
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
/* 16. The plaque                                                       */
/* ------------------------------------------------------------------ */

export function Plaque() {
  return (
    <section id="plaque" data-scene="plaque" data-flow className="ds-strains" aria-labelledby="plaque-title">
      <div className="ds-strains__marble">
        <div className="ds-plaque">
          <i aria-hidden="true" />
          <p id="plaque-title" className="ds-strains__title">
            {plaque.title}
          </p>
          <p className="ds-strains__body">{plaque.body}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 17. Footer                                                           */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer id="footer" data-scene="footer" data-flow className="ds-footer">
      <div className="ds-footer__scene" aria-hidden="true">
        <StreetFooter />
      </div>
      <Narrator className="ds-narrator--dark ds-narrator--center ds-footer__narrator">{footer.narrator}</Narrator>
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
        <p className="ds-footer__year">{footer.year}</p>
      </div>
    </footer>
  );
}
