"use client";

import type { CSSProperties } from "react";
import { hero, atrium, escalatorUp } from "@/lib/store/copy";
import { FacadeBack } from "../facade";
import { AtriumRings, EscalatorFloors, EscalatorFront } from "../rooms";
import { Grain } from "../Defs";
import { Narrator } from "../Objects";

/* ------------------------------------------------------------------ */
/* 1. The pavement — night exterior, the revolving door                 */
/* ------------------------------------------------------------------ */

export function Pavement() {
  return (
    <section id="pavement" data-scene="pavement" className="ds-scene ds-pavement" aria-label="The pavement">
      <div className="ds-stage">
        <div className="ds-pavement__sky" aria-hidden="true" />
        <div className="ds-frame ds-frame--full ds-frame--fit">
          <div className="ds-pavement__camera">
            <div className="ds-layer ds-layer--move ds-pavement__facade">
              <FacadeBack />
            </div>
            <div className="ds-layer ds-layer--move ds-pavement__signlayer">
              <span className="ds-inframe ds-pavement__roofsign">{hero.roofSign}</span>
              <span className="ds-inframe ds-pavement__vinyl">{hero.vinyl}</span>
            </div>
            <div className="ds-door" aria-hidden="true">
              <span className="ds-door__axis" />
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="ds-door__wing" style={{ "--i": i } as CSSProperties} />
              ))}
            </div>
            <div className="ds-pavement__glowthrough" aria-hidden="true" />
          </div>
        </div>
        <div className="ds-copy ds-pavement__copy">
          <p className="ds-eyebrow">{hero.eyebrow}</p>
          <h1 className="ds-headline">{hero.headline}</h1>
          <p className="ds-lede">{hero.subhead}</p>
          <Narrator className="ds-narrator--dark">{hero.narrator}</Narrator>
          <div className="ds-pavement__buttons">
            <a className="ds-btn ds-btn--brass" href="#atrium">
              {hero.walkIn}
            </a>
            <a className="ds-btn ds-btn--ghost" href="#talk-track">
              {hero.skip}
            </a>
          </div>
        </div>
        <p className="ds-pavement__hint" aria-hidden="true">
          Scroll to walk
        </p>
        <Grain dark />
        <div className="ds-pavement__dawn" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. The atrium — the reveal and the store directory                   */
/* ------------------------------------------------------------------ */

export function Atrium() {
  return (
    <section id="atrium" data-scene="atrium" className="ds-scene ds-atrium" aria-label="The atrium">
      <div className="ds-stage">
        <div className="ds-frame ds-frame--full ds-frame--fit">
          <div className="ds-layer ds-layer--move ds-atrium__rings">
            <AtriumRings />
          </div>
          <div className="ds-atrium__light" aria-hidden="true" />
        </div>

        <div className="ds-copy ds-atrium__grid">
          <Narrator className="ds-atrium__in">{atrium.narratorIn}</Narrator>

          <nav className="ds-board ds-atrium__board" aria-label="Store directory by floor">
            <p className="ds-board__title">Store directory</p>
            <ol className="ds-board__list">
              {atrium.banners.map((b) => (
                <li key={b.id}>
                  <a href={`#${b.id}`} className="ds-board__row">
                    <span className="ds-board__num">{b.n}</span>
                    <span className="ds-board__name">{b.name}</span>
                    <span className="ds-board__line">{b.line}</span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="ds-board__foot">Top to bottom, then out through the doors.</p>
          </nav>

          <div className="ds-welcome ds-atrium__welcome">
            <p className="ds-welcome__title">{atrium.welcomeTitle}</p>
            {atrium.welcome.map((para) => (
              <p key={para.slice(0, 30)} className="ds-welcome__text">
                {para}
              </p>
            ))}
            <p className="ds-welcome__engraved">“{atrium.engraved}”</p>
          </div>

          <Narrator className="ds-atrium__out">{atrium.narratorOut}</Narrator>
        </div>
        <Grain />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Escalator up                                                      */
/* ------------------------------------------------------------------ */

export function EscalatorUp() {
  return (
    <section
      id="escalator-up"
      data-scene="escalator-up"
      className="ds-scene ds-escalator"
      aria-label="Escalator up to the Storefront"
      style={{ "--from": "#f6f2ea", "--to": "#f6f2ea", "--dir": 1 } as CSSProperties}
    >
      <div className="ds-stage">
        <div className="ds-frame ds-frame--full">
          <div className="ds-layer ds-layer--move ds-escalator__floors" style={{ top: "-50%", height: "200%" }}>
            <EscalatorFloors />
          </div>
          <div className="ds-layer">
            <EscalatorFront />
          </div>
        </div>
        <div className="ds-wallmark ds-wallmark--l" aria-hidden="true">
          <span>Security · Governance · Residency · Audit</span>
        </div>
        <div className="ds-wallmark ds-wallmark--r" aria-hidden="true">
          <span>Security · Governance · Residency · Audit</span>
        </div>
        <div className="ds-copy ds-escalator__copy">
          <span className="ds-sign ds-sign--small">Going up · Floor 6 · The Storefront</span>
          <Narrator className="ds-narrator--plate">{escalatorUp.narrator}</Narrator>
        </div>
        <Grain />
      </div>
    </section>
  );
}
