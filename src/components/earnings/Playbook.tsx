"use client";

import { useState } from "react";
import {
  APAC,
  CROSS_CHECK,
  CROSS_CHECK_KIND_LABEL,
  INDIA_NOTE,
  PLAYBOOK,
  RISKS,
  SEQUENCING,
  type CrossCheckKind,
} from "@/lib/earnings/data";
import { Pill, Reveal, ZoneHead, layerClass } from "./primitives";

export function Playbook() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <ZoneHead
        n={7}
        kicker="The playbook"
        title="Nine moves, two stages"
        lede={SEQUENCING}
      />

      <Reveal>
        <div className="ea-plays">
          {PLAYBOOK.map((p) => (
            <article className={`ea-play ${layerClass(p.layer)}`} key={p.id} data-c={p.c}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="ea-play-kind">{p.kind}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "var(--muted)",
                    border: "1px solid var(--rule)",
                    borderRadius: 2,
                    padding: "1px 5px",
                  }}
                >
                  STAGE {p.stage}
                </span>
              </div>
              <h3 className="ea-h3">{p.title}</h3>
              <p style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>{p.action}</p>
              <p
                style={{
                  fontSize: 11.5,
                  color: "var(--accent)",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                Metric: {p.metric}
              </p>

              <button
                type="button"
                className="ea-drawer"
                aria-expanded={open === p.id}
                onClick={() => setOpen(open === p.id ? null : p.id)}
              >
                {open === p.id ? "Hide detail" : "Why"}
                <span aria-hidden="true">{open === p.id ? "−" : "+"}</span>
              </button>

              {open === p.id ? (
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55 }}>
                  <p>{p.detail}</p>
                  {p.threshold ? (
                    <p
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: "1px solid var(--rule-soft)",
                        color: "var(--ink-2)",
                      }}
                    >
                      <strong>Escalation threshold.</strong> {p.threshold}
                    </p>
                  ) : null}
                  <p style={{ marginTop: 8 }}>
                    <Pill c={p.c} />
                  </p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </Reveal>

      {/* APAC strip */}
      <Reveal style={{ marginTop: 40 }}>
        <div className="ea-zone-head">
          <span className="ea-kicker">JAPAC — field actionable</span>
        </div>
        <h3 className="ea-h2" style={{ fontSize: "1.4rem", marginBottom: 6 }}>
          Six countries, six motions
        </h3>
        <p className="ea-note" style={{ marginBottom: 14 }} data-c="fact">
          <Pill c="fact" /> {INDIA_NOTE}
        </p>

        <div className="ea-apac">
          {APAC.map((t) => (
            <div className="ea-apac-tile" key={t.country} data-priority={t.priority} data-c={t.c}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="ea-h3" style={{ fontSize: 13 }}>
                  {t.country}
                </span>
                {t.priority === "highest" ? (
                  <span
                    style={{
                      fontSize: 8.5,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      background: "var(--prussian)",
                      color: "#fff",
                      padding: "1px 4px",
                      borderRadius: 2,
                    }}
                  >
                    HIGHEST LEVERAGE
                  </span>
                ) : null}
              </div>
              <p style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.45 }}>{t.lead}</p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--prussian)",
                  fontWeight: 600,
                  marginTop: "auto",
                  paddingTop: 6,
                  borderTop: "1px solid var(--rule-soft)",
                }}
              >
                {t.metric}
              </p>
              <p style={{ fontSize: 10.5, color: "var(--muted)", lineHeight: 1.4 }}>
                Risk: {t.risk}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}

export function Risks() {
  return (
    <>
      <ZoneHead
        n={8}
        kicker="Watch-outs"
        title="Contradictions and open questions"
        lede="Severity is how much this could change the conclusion, not how likely it is."
      />

      <Reveal>
        <div>
          {RISKS.map((r) => (
            <div className="ea-risk" key={r.id} data-c={r.c}>
              <div className="ea-sev" aria-label={`Severity ${r.severity} of 3`}>
                {[1, 2, 3].map((i) => (
                  <i
                    key={i}
                    style={{
                      background:
                        i <= r.severity
                          ? r.severity === 3
                            ? "var(--sev-3)"
                            : r.severity === 2
                              ? "var(--sev-2)"
                              : "var(--sev-1)"
                          : "var(--rule)",
                    }}
                  />
                ))}
              </div>
              <div>
                <h3 className="ea-h3">
                  {r.title} <Pill c={r.c} />
                </h3>
                <p style={{ fontSize: 13.5, marginTop: 5, color: "var(--ink-2)", lineHeight: 1.5 }}>
                  {r.body}
                </p>
                <p style={{ fontSize: 12, marginTop: 6, color: "var(--muted)", lineHeight: 1.55 }}>
                  {r.evidence}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <CrossCheck />
    </>
  );
}

/** Colour by what the reconciliation found, not by layer. */
const KIND_TONE: Record<CrossCheckKind, string> = {
  agreed: "var(--economics)",
  reconciled: "var(--hyperscalers)",
  conflict: "var(--sev-3)",
  added: "var(--platforms)",
  gap: "var(--models)",
};

const KIND_ORDER: CrossCheckKind[] = ["conflict", "reconciled", "agreed", "added", "gap"];

function CrossCheck() {
  const [filter, setFilter] = useState<CrossCheckKind | null>(null);
  const shown = filter ? CROSS_CHECK.filter((c) => c.kind === filter) : CROSS_CHECK;

  const count = (k: CrossCheckKind) => CROSS_CHECK.filter((c) => c.kind === k).length;

  return (
    <Reveal style={{ marginTop: 46 }}>
      <div className="ea-zone-head">
        <span className="ea-kicker">Cross-check</span>
      </div>
      <h3 className="ea-h2" style={{ fontSize: "1.4rem", marginBottom: 6 }}>
        Reconciled against a second research pass
      </h3>
      <p className="ea-note" style={{ marginBottom: 14 }}>
        An independent deep-research pass over the same window was compared line by line. Agreement
        from a separately sourced pass is stronger than either pass alone, so it is recorded here
        rather than assumed.
      </p>

      <div className="ea-controls" style={{ marginBottom: 14 }}>
        <button
          type="button"
          className="ea-btn"
          aria-pressed={filter === null}
          onClick={() => setFilter(null)}
        >
          All {CROSS_CHECK.length}
        </button>
        {KIND_ORDER.map((k) => (
          <button
            key={k}
            type="button"
            className="ea-btn"
            aria-pressed={filter === k}
            onClick={() => setFilter(filter === k ? null : k)}
          >
            <span
              aria-hidden="true"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: KIND_TONE[k],
                display: "inline-block",
              }}
            />
            {CROSS_CHECK_KIND_LABEL[k]} {count(k)}
          </button>
        ))}
      </div>

      <div>
        {shown.map((c) => (
          <div
            key={c.claim}
            style={{
              display: "grid",
              gridTemplateColumns: "10px 1fr",
              gap: 12,
              padding: "14px 0",
              borderTop: "1px solid var(--rule)",
              alignItems: "start",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: KIND_TONE[c.kind],
                marginTop: 6,
              }}
            />
            <div>
              <p
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: KIND_TONE[c.kind],
                }}
              >
                {CROSS_CHECK_KIND_LABEL[c.kind]}
              </p>
              <h4 className="ea-h3" style={{ marginTop: 4 }}>
                {c.claim}
              </h4>
              <p style={{ fontSize: 12.5, marginTop: 5, color: "var(--muted)", lineHeight: 1.55 }}>
                {c.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
