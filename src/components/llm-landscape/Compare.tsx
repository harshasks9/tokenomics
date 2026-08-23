"use client";

import { useMemo, useState } from "react";
import type { Claim, Dataset, Model } from "@/lib/llm-landscape/types";
import {
  ACCESS_LABEL,
  assignDimensions,
  claimsFor,
  fmtMods,
  fmtTokens,
  parseReleased,
  vendorGroup,
} from "@/lib/llm-landscape/model";
import {
  ClaimList,
  EvidenceLegend,
  GradeBadge,
  StatusPill,
  TierTag,
  VendorDot,
} from "./ui";

type Tagged = { text: string; claim: Claim; weakness: boolean };

function DimCell({ items }: { items: Tagged[] }) {
  if (items.length === 0) return <div className="dim-cell dim-none">—</div>;
  return (
    <div className="dim-cell">
      {items.slice(0, 2).map(({ claim, weakness }, i) => (
        <div key={i} className={`dim-claim ${weakness ? "dim-weak" : ""}`}>
          <div className="claim-head">
            <GradeBadge grade={claim.evidence_grade} />
            {weakness && <span className="weak-tag">weakness</span>}
            {claim.source_url && (
              <a className="src" href={claim.source_url} target="_blank" rel="noopener noreferrer">
                source ↗
              </a>
            )}
          </div>
          <p>{claim.claim}</p>
        </div>
      ))}
    </div>
  );
}

function ModelSelect({
  id,
  value,
  placeholder,
  candidates,
  extra,
  onChange,
}: {
  id: string;
  value: string;
  placeholder: string;
  candidates: Model[];
  extra?: Model | null;
  onChange: (id: string) => void;
}) {
  const groups = new Map<string, Model[]>();
  const all = extra && !candidates.some((c) => c.id === extra.id) ? [extra, ...candidates] : candidates;
  for (const c of all) {
    const g = vendorGroup(c.vendor);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(c);
  }
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {[...groups.entries()].map(([g, ms]) => (
        <optgroup key={g} label={g}>
          {ms.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

/** The strongest "choose it when" evidence a record carries. */
function chooseClaim(m: Model): Claim | null {
  return m.best_use_cases?.[0] ?? m.known_for?.[0] ?? null;
}

/**
 * Symmetric head-to-head, decision-first: the verdict opens, specs show only
 * where the two differ, and the full evidence sits one fold below.
 */
export default function Compare({
  a,
  b,
  data,
  candidates,
  onChangeA,
  onChangeB,
  onOpenRecord,
}: {
  a: Model;
  b: Model | null;
  data: Dataset;
  candidates: Model[];
  onChangeA: (id: string) => void;
  onChangeB: (id: string) => void;
  onOpenRecord: (id: string) => void;
}) {
  const [allSpecs, setAllSpecs] = useState(false);
  const dims = useMemo(() => data.meta.dimensions ?? [], [data.meta.dimensions]);
  const wl = (id: string) => data.meta.workloads.find((w) => w.id === id)?.label ?? id;

  const { leftByDim, rightByDim } = useMemo(() => {
    const tag = (m: Model | null): Tagged[] =>
      m
        ? claimsFor(m).map((c) => ({
            text: c.claim.claim,
            claim: c.claim,
            weakness: c.field === "weaknesses",
          }))
        : [];
    return { leftByDim: assignDimensions(tag(a), dims), rightByDim: assignDimensions(tag(b), dims) };
  }, [a, b, dims]);

  const dimRows = dims
    .map((d) => ({ d, l: leftByDim.get(d.id) ?? [], r: rightByDim.get(d.id) ?? [] }))
    .filter(({ l, r }) => l.length > 0 || r.length > 0);

  const suggestions = (a.alternatives ?? []).filter((x) => x.model_id && x.model_id !== b?.id);

  // The analyst pairing connecting this exact pair, if one exists (either direction).
  const pairing = b
    ? ((a.alternatives ?? []).find((x) => x.model_id === b.id) ??
      (b.alternatives ?? []).find((x) => x.model_id === a.id))
    : null;

  const spec = (m: Model | null) =>
    m
      ? {
          released: parseReleased(m.released).display,
          status: m.status ?? "—",
          access: m.access ? (ACCESS_LABEL[m.access] ?? m.access) : "—",
          license: m.license ?? "—",
          ctxIn: fmtTokens(m.context?.input_tokens),
          ctxOut: fmtTokens(m.context?.output_tokens),
          mods: fmtMods(m),
        }
      : null;
  const ls = spec(a)!;
  const rs = spec(b);

  const specRows = (
    [
      ["released", ls.released, rs?.released],
      ["status", ls.status, rs?.status],
      ["access", ls.access, rs?.access],
      ["license", ls.license, rs?.license],
      ["context in", ls.ctxIn, rs?.ctxIn],
      ["context out", ls.ctxOut, rs?.ctxOut],
      ["modalities", ls.mods, rs?.mods],
    ] as const
  ).map(([label, x, y]) => ({ label, x, y: y ?? "—", same: x === (y ?? "—") }));
  const differing = specRows.filter((r) => !r.same);
  const sameLabels = specRows.filter((r) => r.same).map((r) => r.label);
  const shownRows = allSpecs || differing.length === 0 ? specRows : differing;

  const aChoose = chooseClaim(a);
  const bChoose = b ? chooseClaim(b) : null;

  return (
    <div className="compare">
      <div className="compare-controls">
        <label htmlFor="model-a">model A</label>
        <ModelSelect
          id="model-a"
          value={a.id}
          placeholder="Choose model A…"
          candidates={candidates}
          extra={a}
          onChange={onChangeA}
        />
        <span className="verdict-vs">vs</span>
        <label htmlFor="model-b">model B</label>
        <ModelSelect
          id="model-b"
          value={b?.id ?? ""}
          placeholder="Choose model B…"
          candidates={candidates}
          extra={b}
          onChange={onChangeB}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="pairing-suggest">
          <span className="flabel">Analysts would compare {a.name} with:</span>
          {suggestions.map((s, i) => (
            <button key={i} className="chip" onClick={() => onChangeB(s.model_id!)}>
              {s.model_label} · {wl(s.workload)}
            </button>
          ))}
        </div>
      )}

      {b ? (
        <>
          {/* Verdict first — the answer sits at scroll position zero. */}
          <div className="verdict">
            <div className="verdict-cols">
              <div className="verdict-side">
                <span className="verdict-role">
                  <VendorDot vendor={a.vendor} /> choose
                </span>
                <button className="verdict-model link" onClick={() => onOpenRecord(a.id)}>
                  {a.name}
                </button>
                {aChoose ? (
                  <p className="judgment vchoose">
                    {aChoose.claim} <GradeBadge grade={aChoose.evidence_grade} />
                  </p>
                ) : (
                  <p className="vchoose dims-note">No graded use-case claim on file.</p>
                )}
              </div>
              <div className="verdict-vs" aria-hidden>
                vs
              </div>
              <div className="verdict-side">
                <span className="verdict-role">
                  <VendorDot vendor={b.vendor} /> choose
                </span>
                <button className="verdict-model link" onClick={() => onOpenRecord(b.id)}>
                  {b.name}
                </button>
                {bChoose ? (
                  <p className="judgment vchoose">
                    {bChoose.claim} <GradeBadge grade={bChoose.evidence_grade} />
                  </p>
                ) : (
                  <p className="vchoose dims-note">No graded use-case claim on file.</p>
                )}
              </div>
            </div>
            {pairing && (
              <div className="tradeoffs">
                <span className="tradeoffs-tag">trade-offs, both ways</span>
                <p className="judgment">{pairing.trade_offs}</p>
              </div>
            )}
            <p className="geq-rationale">
              Neither column is &ldquo;the answer&rdquo; — the badges say who is making each claim.
            </p>
          </div>

          {/* Specs: only where they differ, until asked. */}
          <div className="spec-table" role="table" aria-label="Specification comparison">
            <div className="spec-head" role="row">
              <span />
              <span className="spec-col">
                {a.name} <TierTag tier={a.tier} />
              </span>
              <span className="spec-col">
                {b.name} <TierTag tier={b.tier} />
              </span>
            </div>
            {shownRows.map((r) => (
              <div className="spec-row" role="row" key={r.label}>
                <span className="spec-label">{r.label}</span>
                <span>{r.x}</span>
                <span>{r.y}</span>
              </div>
            ))}
            <div className="spec-same">
              {!allSpecs && differing.length > 0 && sameLabels.length > 0 && (
                <span>Same on: {sameLabels.join(", ")}.</span>
              )}
              {sameLabels.length > 0 && differing.length > 0 && (
                <button className="link" onClick={() => setAllSpecs((v) => !v)}>
                  {allSpecs ? "Show differences only" : "Show all specs"}
                </button>
              )}
            </div>
          </div>

          {/* Everything else earns its scroll behind one honest fold. */}
          <details className="evidence-fold">
            <summary>All evidence — graded claims, by dimension and by record</summary>
            <section className="dims">
              <EvidenceLegend />
              {data.meta.dimensions_note && <p className="dims-note">{data.meta.dimensions_note}</p>}
              {dimRows.length > 0 && (
                <>
                  <div className="dim-head">
                    <span />
                    <span>{a.name}</span>
                    <span>{b.name}</span>
                  </div>
                  {dimRows.map(({ d, l, r }) => (
                    <div key={d.id} className="dim-row">
                      <div className="dim-label">{d.label}</div>
                      <DimCell items={l} />
                      <DimCell items={r} />
                    </div>
                  ))}
                </>
              )}
              {dimRows.length === 0 && (
                <p className="dims-note">
                  No dimension-tagged evidence for this pairing — the full claim lists below carry it.
                </p>
              )}
            </section>
            <div className="compare-claims">
              {[a, b].map((m) => (
                <div key={m.id}>
                  <h3 className="side-title">{m.name}</h3>
                  <ClaimList title="Known for" claims={m.known_for} />
                  <ClaimList title="Best use cases" claims={m.best_use_cases} />
                  <ClaimList title="Weaknesses" claims={m.weaknesses} tone="weak" />
                  <div className="card-top" style={{ marginTop: "0.5rem" }}>
                    <StatusPill status={m.status} />
                    {m.last_verified && <span className="verified">verified {m.last_verified}</span>}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </>
      ) : (
        <p className="empty">
          Choose model B above — or take an analyst pairing — to see the head-to-head.
        </p>
      )}
    </div>
  );
}
