"use client";

import { useMemo } from "react";
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
  ConfidencePill,
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
  candidates,
  extra,
  onChange,
}: {
  id: string;
  value: string;
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
      <option value="">— pick a model —</option>
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

/** Symmetric head-to-head: any model vs any model. Neither side is "the answer". */
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

  return (
    <div className="compare">
      <div className="compare-controls">
        <label htmlFor="model-a">model A</label>
        <ModelSelect id="model-a" value={a.id} candidates={candidates} extra={a} onChange={onChangeA} />
        <span className="verdict-vs">vs</span>
        <label htmlFor="model-b">model B</label>
        <ModelSelect id="model-b" value={b?.id ?? ""} candidates={candidates} extra={b} onChange={onChangeB} />
      </div>

      {suggestions.length > 0 && (
        <div className="pairing-suggest">
          <span className="flabel">analyst pairings for {a.name}:</span>
          {suggestions.map((s, i) => (
            <button key={i} className="chip" onClick={() => onChangeB(s.model_id!)}>
              vs {s.model_label} · {wl(s.workload)}
            </button>
          ))}
        </div>
      )}

      {/* Analyst alternatives for model A — the advisory payload, vendor-neutral */}
      {(a.alternatives?.length ?? 0) > 0 && (
        <section className="alts">
          <h4>Nearest alternatives — analyst assessment</h4>
          {a.alternatives!.map((alt, i) => (
            <div key={i} className="alt-row">
              <div className="geq-head">
                <span className="geq-workload">{wl(alt.workload)}</span>
                <ConfidencePill level={alt.confidence} />
              </div>
              <div className="geq-target">
                {alt.model_id ? (
                  <button className="link" onClick={() => onOpenRecord(alt.model_id!)}>
                    {alt.model_label}
                  </button>
                ) : (
                  alt.model_label
                )}
              </div>
              <p className="geq-rationale">{alt.rationale}</p>
              <div className="tradeoffs">
                <span className="tradeoffs-tag">trade-offs, both ways</span>
                <p>{alt.trade_offs}</p>
              </div>
              {alt.model_id && (
                <button className="btn-compare" onClick={() => onChangeB(alt.model_id!)}>
                  put head-to-head →
                </button>
              )}
            </div>
          ))}
        </section>
      )}

      {b ? (
        <>
          <div className="verdict">
            <div className="verdict-cols">
              <div className="verdict-side">
                <span className="verdict-role">model A</span>
                <button className="verdict-model link" onClick={() => onOpenRecord(a.id)}>
                  {a.name}
                </button>
                <VendorDot vendor={a.vendor} />
              </div>
              <div className="verdict-vs" aria-hidden>
                vs
              </div>
              <div className="verdict-side">
                <span className="verdict-role">model B</span>
                <button className="verdict-model link" onClick={() => onOpenRecord(b.id)}>
                  {b.name}
                </button>
                <VendorDot vendor={b.vendor} />
              </div>
            </div>
            <p className="geq-rationale">
              Evidence-graded claims from both records, side by side. Neither column is &ldquo;the
              answer&rdquo; — read the badges.
            </p>
          </div>

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
            {(
              [
                ["released", ls.released, rs?.released],
                ["status", ls.status, rs?.status],
                ["access", ls.access, rs?.access],
                ["license", ls.license, rs?.license],
                ["context in", ls.ctxIn, rs?.ctxIn],
                ["context out", ls.ctxOut, rs?.ctxOut],
                ["modalities", ls.mods, rs?.mods],
              ] as const
            ).map(([label, x, y]) => (
              <div className="spec-row" role="row" key={label}>
                <span className="spec-label">{label}</span>
                <span>{x}</span>
                <span>{y ?? "—"}</span>
              </div>
            ))}
          </div>

          <section className="dims">
            <h4>Evidence by dimension</h4>
            <EvidenceLegend />
            {data.meta.dimensions_note && <p className="dims-note">{data.meta.dimensions_note}</p>}
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
            {dimRows.length === 0 && (
              <p className="dims-note">No dimension-tagged evidence for this pairing — the graded claims below carry it.</p>
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
        </>
      ) : (
        <p className="empty">Pick model B above — or use an analyst pairing — to see the head-to-head.</p>
      )}
    </div>
  );
}
