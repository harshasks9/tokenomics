"use client";

import { GOOGLE_ROWS, GOOGLE_POV } from "@/lib/harness/google";
import { capById } from "@/lib/harness/capabilities";
import { Icon } from "./ui";

/** §09 — requirement-first map: harness need → Google approach → services. */
export default function GoogleMap() {
  return (
    <>
      <div className="hx-gmap">
        {GOOGLE_ROWS.map((row) => {
          const cap = capById(row.capabilityId);
          return (
            <div key={row.capabilityId} className="hx-grow" style={{ ["--cap-c" as string]: `hsl(${cap.hue} 70% 42%)` }}>
              <div className="req">
                <div className="nm">
                  <span style={{ color: `hsl(${cap.hue} 70% 40%)`, display: "inline-flex" }}>
                    <Icon name={cap.icon} size={15} />
                  </span>
                  {cap.name}
                </div>
                <div className="rq">{row.requirement}</div>
              </div>
              <div className="ans">
                <p className="ap">{row.approach}</p>
                <div className="svcs">
                  {row.services.map((s) => (
                    <span key={s.name} className="hx-svc" title={s.note}>
                      {s.name}
                    </span>
                  ))}
                </div>
                <div className="open">◇ Open seam: {row.openness}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hx-card" style={{ marginTop: 22, padding: "22px 24px", borderLeft: "4px solid var(--hx-blue)" }}>
        <div className="hx-display" style={{ fontWeight: 700, fontSize: 16.5, marginBottom: 10 }}>
          {GOOGLE_POV.headline}
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "var(--hx-ink-soft)" }}>
          {GOOGLE_POV.points.map((p) => (
            <li key={p} style={{ marginBottom: 7 }}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
