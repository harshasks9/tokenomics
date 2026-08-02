"use client";

import { INFLECTIONS } from "@/lib/modelcomp/data";

export default function InflectionRail({
  active,
  onHover,
}: {
  active: number | null;
  onHover: (n: number | null) => void;
}) {
  return (
    <>
      <div className="mc-chart-head" style={{ marginBottom: 20 }}>
        <div>
          <p className="mc-eyebrow">S2 · Inflection points</p>
          <h2 className="mc-h2" style={{ marginTop: 6 }}>
            Five moments that set the gap
          </h2>
        </div>
      </div>

      <div className="mc-rail">
        {INFLECTIONS.map((inf) => (
          <button
            key={inf.n}
            type="button"
            className="mc-rail-card"
            data-active={active === inf.n}
            onPointerEnter={() => onHover(inf.n)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(inf.n)}
            onBlur={() => onHover(null)}
            aria-pressed={active === inf.n}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="mc-rail-n" aria-hidden="true">
                {inf.n}
              </span>
              <span className="mc-rail-when">{inf.when}</span>
            </div>
            <h3 className="mc-h3">{inf.title}</h3>
            <p className="mc-rail-body">{inf.body}</p>
          </button>
        ))}
      </div>
    </>
  );
}
