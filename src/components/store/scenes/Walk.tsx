"use client";

import type { CSSProperties } from "react";
import { hero, coreAnalogy, pullQuote } from "@/lib/store/copy";
import { FacadeBack } from "../facade";
import { AtriumRings, EscalatorFloors, EscalatorFront } from "../rooms";
import { Grain } from "../Defs";

/* ------------------------------------------------------------------ */
/* 1. The pavement — night exterior, the revolving door                 */
/* ------------------------------------------------------------------ */

export function Pavement() {
  return (
    <section id="pavement" data-scene="pavement" className="ds-scene ds-pavement" aria-label="The pavement">
      <div className="ds-stage">
        <div className="ds-pavement__sky" aria-hidden="true" />
        <div className="ds-frame ds-frame--fit">
          <div className="ds-pavement__camera">
            <div className="ds-layer ds-layer--move ds-pavement__facade">
              <FacadeBack />
            </div>
            <div className="ds-layer ds-layer--move ds-pavement__signlayer">
              <span className="ds-inframe ds-pavement__roofsign">The Department Store for AI</span>
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
/* 2. The atrium — the reveal                                           */
/* ------------------------------------------------------------------ */

const BANNERS = [
  { id: "storefront", n: 6, name: "The Storefront", x: 547, y: 250 },
  { id: "tailoring", n: 5, name: "The Tailoring Floor", x: 1134, y: 300 },
  { id: "model-floor", n: 4, name: "The Model Floor", x: 300, y: 350 },
  { id: "wardrobe", n: 3, name: "Your Wardrobe", x: 1378, y: 400 },
  { id: "back-of-house", n: 2, name: "Back of House", x: 250, y: 470 },
  { id: "foundations", n: 1, name: "The Foundations", x: 1300, y: 832 },
];

export function Atrium() {
  return (
    <section id="atrium" data-scene="atrium" className="ds-scene ds-atrium" aria-label="The atrium">
      <div className="ds-stage">
        <div className="ds-frame ds-frame--fit">
          <div className="ds-layer ds-layer--move ds-atrium__rings">
            <AtriumRings />
          </div>
          <div className="ds-atrium__light" aria-hidden="true" />
          <nav className="ds-layer ds-layer--interactive" aria-label="Floor banners">
            {BANNERS.map((b) => (
              <a
                key={b.id}
                href={`#${b.id}`}
                className="ds-banner"
                style={{ left: `${(b.x / 1600) * 100}%`, top: `${(b.y / 900) * 100}%` }}
              >
                <small>Floor {b.n}</small>
                {b.name}
              </a>
            ))}
          </nav>
        </div>
        <div className="ds-copy ds-atrium__welcome">
          <div className="ds-welcome">
            <p className="ds-welcome__eyebrow">Welcome · The Core Analogy</p>
            <p className="ds-welcome__text">{coreAnalogy}</p>
          </div>
          <div className="ds-welcome__feet" aria-hidden="true">
            <span />
            <span />
          </div>
          <p className="ds-atrium__quote">“{pullQuote}”</p>
        </div>
        <Grain />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Escalators between floors                                            */
/* ------------------------------------------------------------------ */

export function Escalator({
  id,
  dir,
  from,
  to,
  dark = false,
  label,
}: {
  id: string;
  dir: 1 | -1;
  from: string;
  to: string;
  dark?: boolean;
  label: string;
}) {
  return (
    <section
      id={id}
      data-scene={id}
      className="ds-scene ds-escalator"
      aria-label={label}
      style={{ "--from": from, "--to": to, "--dir": dir } as CSSProperties}
    >
      <div className="ds-stage">
        <div className="ds-frame">
          <div className="ds-layer ds-layer--move ds-escalator__floors" style={{ top: "-50%", height: "200%" }}>
            <EscalatorFloors dark={dark} />
          </div>
          <div className="ds-layer">
            <EscalatorFront dark={dark} />
          </div>
        </div>
        <div className="ds-escalator__label">
          <span className="ds-sign">{label}</span>
        </div>
        <div className="ds-escalator__to" aria-hidden="true" />
        <Grain dark={dark} />
      </div>
    </section>
  );
}
