"use client";

import { useMemo } from "react";
import type { Claim, Dataset, Model } from "@/lib/llm-landscape/types";
import {
  ACCESS_LABEL,
  assignDimensions,
  claimsFor,
  dimensionScore,
  fmtMods,
  fmtTokens,
  parseReleased,
  resolveGoogleRecord,
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

function DimCell({
  items,
  fallback,
}: {
  items: Tagged[];
  fallback?: string | null;
}) {
  if (items.length === 0) {
    return fallback ? (
      <div className="dim-cell">
        <div className="dim-claim dim-mapnote">
          <div className="claim-head">
            <GradeBadge grade="analyst-inference" />
            <span className="mapnote-tag">from the mapping</span>
          </div>
          <p>{fallback}</p>
        </div>
      </div>
    ) : (
      <div className="dim-cell dim-none">—</div>
    );
  }
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

export default function Compare({
  model,
  workload,
  data,
  candidates,
  onChangeWorkload,
  onChangeModel,
  onOpenRecord,
}: {
  model: Model;
  workload: string | null;
  data: Dataset;
  candidates: Model[];
  onChangeWorkload: (w: string) => void;
  onChangeModel: (id: string) => void;
  onOpenRecord: (id: string) => void;
}) {
  const rows = model.google_equivalents ?? [];
  const active = rows.find((r) => r.workload === workload) ?? rows[0] ?? null;
  const google = useMemo(
    () => (active ? resolveGoogleRecord(active.google_model, data.models) : null),
    [active, data.models],
  );
  const wl = (id: string) => data.meta.workloads.find((w) => w.id === id)?.label ?? id;
  const dims = useMemo(() => data.meta.dimensions ?? [], [data.meta.dimensions]);

  // Each claim lands in exactly one dimension (word-boundary scored).
  const { leftByDim, rightByDim } = useMemo(() => {
    const tag = (m: Model | null): Tagged[] =>
      m
        ? claimsFor(m).map((c) => ({
            text: c.claim.claim,
            claim: c.claim,
            weakness: c.field === "weaknesses",
          }))
        : [];
    return {
      leftByDim: assignDimensions(tag(model), dims),
      rightByDim: assignDimensions(tag(google), dims),
    };
  }, [model, google, dims]);

  // When the Google side has no claim for a dimension, fall back to the
  // mapping's own text if it speaks to that dimension.
  const mappingText = active ? `${active.rationale} ${active.where_google_loses}` : "";
  const dimRows = dims
    .map((d) => ({
      d,
      l: leftByDim.get(d.id) ?? [],
      r: rightByDim.get(d.id) ?? [],
      fallback:
        (rightByDim.get(d.id) ?? []).length === 0 && active && dimensionScore(d, mappingText) > 0
          ? active.rationale
          : null,
    }))
    .filter(({ l, r, fallback }) => l.length > 0 || r.length > 0 || fallback);

  if (!active) {
    return (
      <div className="compare">
        <p className="empty">This record has no Google-equivalent mappings.</p>
      </div>
    );
  }

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
  const ls = spec(model)!;
  const rs = spec(google);

  return (
    <div className="compare">
      <div className="compare-controls">
        <label htmlFor="model-select">you run</label>
        <select id="model-select" value={model.id} onChange={(e) => onChangeModel(e.target.value)}>
          {(() => {
            const groups = new Map<string, Model[]>();
            for (const c of candidates) {
              const g = vendorGroup(c.vendor);
              if (!groups.has(g)) groups.set(g, []);
              groups.get(g)!.push(c);
            }
            if (!candidates.some((c) => c.id === model.id)) {
              groups.set(vendorGroup(model.vendor), [
                model,
                ...(groups.get(vendorGroup(model.vendor)) ?? []),
              ]);
            }
            return [...groups.entries()].map(([g, ms]) => (
              <optgroup key={g} label={g}>
                {ms.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </optgroup>
            ));
          })()}
        </select>
        <label htmlFor="wl-select">workload</label>
        <select
          id="wl-select"
          value={active.workload}
          onChange={(e) => onChangeWorkload(e.target.value)}
        >
          {rows.map((r) => (
            <option key={r.workload} value={r.workload}>
              {wl(r.workload)}
            </option>
          ))}
        </select>
        <ConfidencePill level={active.confidence} />
      </div>

      <div className={`verdict ${active.google_model === null ? "geq-null" : ""}`}>
        <div className="verdict-cols">
          <div className="verdict-side">
            <span className="verdict-role">you run</span>
            <button className="verdict-model link" onClick={() => onOpenRecord(model.id)}>
              {model.name}
            </button>
            <VendorDot vendor={model.vendor} />
          </div>
          <div className="verdict-vs" aria-hidden>
            vs
          </div>
          <div className="verdict-side">
            <span className="verdict-role">google answer</span>
            {active.google_model === null ? (
              <span className="verdict-model verdict-gap">no credible equivalent</span>
            ) : google ? (
              <button className="verdict-model link" onClick={() => onOpenRecord(google.id)}>
                {active.google_model}
              </button>
            ) : (
              <span className="verdict-model">{active.google_model}</span>
            )}
            {google && <VendorDot vendor={google.vendor} />}
          </div>
        </div>
        <p className="geq-rationale">{active.rationale}</p>
        <div className="concession">
          <span className="concession-tag">what you give up</span>
          <p>{active.where_google_loses}</p>
        </div>
      </div>

      <div className="spec-table" role="table" aria-label="Specification comparison">
        <div className="spec-head" role="row">
          <span />
          <span className="spec-col">
            {model.name} <TierTag tier={model.tier} />
          </span>
          <span className="spec-col">
            {google ? (
              <>
                {google.name} <TierTag tier={google.tier} />
              </>
            ) : (
              (active.google_model ?? "—")
            )}
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
        ).map(([label, a, b]) => (
          <div className="spec-row" role="row" key={label}>
            <span className="spec-label">{label}</span>
            <span>{a}</span>
            <span>{b ?? (active.google_model === null ? "—" : "record not in dataset")}</span>
          </div>
        ))}
        {google?.status && ["deprecated", "retired", "superseded"].includes(google.status) && (
          <p className="spec-note">
            Note: the matched Google record is {google.status}; the mapping text above names the
            current product line.
          </p>
        )}
      </div>

      <section className="dims">
        <h4>Evidence by dimension</h4>
        <EvidenceLegend />
        {data.meta.dimensions_note && <p className="dims-note">{data.meta.dimensions_note}</p>}
        <div className="dim-head">
          <span />
          <span>{model.name}</span>
          <span>{google?.name ?? active.google_model ?? "Google"}</span>
        </div>
        {dimRows.map(({ d, l, r, fallback }) => (
          <div key={d.id} className="dim-row">
            <div className="dim-label">{d.label}</div>
            <DimCell items={l} />
            {google || fallback ? (
              <DimCell items={r} fallback={fallback} />
            ) : (
              <div className="dim-cell dim-none">
                {active.google_model === null ? "structural gap — see verdict" : "—"}
              </div>
            )}
          </div>
        ))}
        {dimRows.length === 0 && (
          <p className="dims-note">No dimension-tagged evidence for this pairing — the graded claims below carry it.</p>
        )}
      </section>

      <div className="compare-claims">
        <div>
          <h3 className="side-title">{model.name}</h3>
          <ClaimList title="Known for" claims={model.known_for} />
          <ClaimList title="Best use cases" claims={model.best_use_cases} />
          <ClaimList title="Weaknesses" claims={model.weaknesses} tone="weak" />
        </div>
        <div>
          <h3 className="side-title">{google?.name ?? active.google_model ?? "Google"}</h3>
          {google ? (
            <>
              <ClaimList title="Known for" claims={google.known_for} />
              <ClaimList title="Best use cases" claims={google.best_use_cases} />
              <ClaimList title="Weaknesses" claims={google.weaknesses} tone="weak" />
              <div className="card-top" style={{ marginTop: "0.5rem" }}>
                <StatusPill status={google.status} />
                {google.last_verified && (
                  <span className="verified">verified {google.last_verified}</span>
                )}
              </div>
            </>
          ) : (
            <p className="empty">
              {active.google_model === null
                ? "This mapping concedes there is no credible Google equivalent for the workload — the verdict block carries the honest alternative."
                : "The mapped Google product is an API SKU below record granularity; the verdict block carries its facts."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
