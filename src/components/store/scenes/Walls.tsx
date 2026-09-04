"use client";

import { useState } from "react";
import { walls } from "@/lib/store/copy";
import CrossSection, { XS_TARGETS } from "../CrossSection";
import { Exhibit, Card, Narrator, useExhibit } from "../Objects";
import { SecurityDesk, ReturnsCounter } from "../props";
import { Grain } from "../Defs";
import { useScrollTo } from "../engine";
import { onAt } from "./Floors";
import { FloorStack } from "../Chrome";

function Desk({ id, n, label, children }: { id: string; n: number; label: string; children: React.ReactNode }) {
  const { active, setActive, pinned, setPinned } = useExhibit();
  const isActive = active === id || pinned === id;
  return (
    <div
      className={`ds-hotspot ds-hotspot--flow${isActive ? " is-active" : ""}`}
      style={{ "--on": n === 1 ? onAt(0) : onAt(1) } as React.CSSProperties}
      onMouseEnter={() => setActive(id)}
      onMouseLeave={() => setActive(null)}
    >
      <button
        type="button"
        className="ds-hotspot__hit"
        aria-label={label}
        aria-describedby={`card-${id}`}
        aria-pressed={pinned === id}
        onFocus={() => setActive(id)}
        onBlur={() => setActive(null)}
        onClick={() => setPinned(pinned === id ? null : id)}
      />
      <span className="ds-hotspot__shadow" aria-hidden="true" />
      <div className="ds-hotspot__prop" aria-hidden="true">
        {children}
      </div>
      <span className="ds-callout ds-callout--tl" aria-hidden="true">
        {n}
      </span>
    </div>
  );
}

export function WallsScene() {
  const [hover, setHover] = useState<string | null>(null);
  const scrollTo = useScrollTo();
  const target = XS_TARGETS.find((t) => t.id === hover);

  return (
    <section id="walls" data-scene="walls" className="ds-scene ds-walls" aria-label="The walls: governance">
      <Exhibit>
        <div className="ds-stage">
          <div className="ds-walls__grid">
            <div className="ds-walls__section">
              <CrossSection onSelect={scrollTo} onHover={setHover} />
              <p className="ds-walls__caption" aria-live="polite">
                {target ? (
                  <>
                    <strong>{target.label}</strong> — {target.caption}
                  </>
                ) : (
                  walls.caption
                )}
              </p>
            </div>

            <div className="ds-walls__side">
              <header className="ds-floorhead ds-floorhead--dark ds-floorhead--flow">
                <span className="ds-floorhead__num">—</span>
                <div>
                  <h2 className="ds-floorhead__name">{walls.name}</h2>
                  <p className="ds-floorhead__sub">{walls.lettering}</p>
                </div>
                <FloorStack level={-1} />
              </header>
              <Narrator className="ds-narrator--dark">{walls.narrator}</Narrator>

              <div className="ds-walls__desks">
                <Desk id="security" n={1} label={`${walls.items[0].object}: ${walls.items[0].capability}`}>
                  <SecurityDesk />
                </Desk>
                <Desk id="returns" n={2} label={`${walls.items[1].object}: ${walls.items[1].capability}`}>
                  <ReturnsCounter />
                </Desk>
              </div>

              <ol className="ds-cards ds-cards--dark" aria-label="What the walls are made of">
                {walls.items.map((it, i) => (
                  <Card key={it.id} item={it} n={i + 1} on={onAt(i)} />
                ))}
              </ol>

              <a href={`#${walls.next.id}`} className="ds-next ds-next--dark">
                <span className="ds-next__arrow" aria-hidden="true">
                  ↓
                </span>
                <span className="ds-next__to">
                  Next · {walls.next.number} · {walls.next.name}
                </span>
              </a>
            </div>
          </div>
          <Grain dark />
        </div>
      </Exhibit>
    </section>
  );
}
