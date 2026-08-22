"use client";

import { useMemo } from "react";
import type { Claim, Dataset, Dimension, Model } from "@/lib/llm-landscape/types";
import {
  ACCESS_LABEL,
  claimsFor,
  fmtMods,
  fmtTokens,
  matchDimension,
  parseReleased,
  resolveGoogleRecord,
} from "@/lib/llm-landscape/model";
import { ClaimList, ConfidencePill, GradeBadge, StatusPill, TierTag, VendorDot } from "./ui";

function DimCell({ claims }: { claims: { claim: Claim; weakness: boolean }[] }) {
  if (claims.length === 0) return <div className="dim-cell dim-none">no sourced claim</div>;
  return (
    <div className="dim-cell">
      {claims.slice(0, 2).map(({ claim, weakness }, i) => (
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
  onChangeWorkload,
  onOpenRecord,
}: {
  model: Model;
  workload: string | null;
  data: Dataset;
  onChangeWorkload: (w: string) => void;
  onOpenRecord: (id: string) => void;
}) {
  const rows = model.google_equivalents ?? [];
  const active = rows.find((r) => r.workload === workload) ?? rows[0] ?? null;
  const google = useMemo(
    () => (active ? resolveGoogleRecord(active.google_model, data.models) : null),
    [active, data.models],
  );
  const wl = (id: string) => data.meta.workloads.find((w) => w.id === id)?.label ?? id;

  const dims: Dimension[] = data.meta.dimensions ?? [];
  const left = claimsFor(model).map((c) => ({ claim: c.claim, weakness: c.field === "weaknesses" }));
  const right = google
    ? claimsFor(google).map((c) => ({ claim: c.claim, weakness: c.field === "weaknesses" }))
    : [];

  const dimRows = dims
    .map((d) => {
      const l = left.filter((c) => matchDimension(d, c.claim.claim));
      const r = right.filter((c) => matchDimension(d, c.claim.claim));
      return { d, l, r };
    })
    .filter(({ d, l, r }) => !d.conditional || l.length > 0 || r.length > 0);

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

      {/* Verdict */}
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

      {/* Spec table */}
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

      {/* Dimension grid */}
      <section className="dims">
        <h4>Evidence by dimension</h4>
        {data.meta.dimensions_note && <p className="dims-note">{data.meta.dimensions_note}</p>}
        <div className="dim-head">
          <span />
          <span>{model.name}</span>
          <span>{google?.name ?? active.google_model ?? "Google"}</span>
        </div>
        {dimRows.map(({ d, l, r }) => (
          <div key={d.id} className="dim-row">
            <div className="dim-label">{d.label}</div>
            <DimCell claims={l} />
            {google ? (
              <DimCell claims={r} />
            ) : (
              <div className="dim-cell dim-none">
                {active.google_model === null ? "structural gap — see verdict" : "record not in dataset"}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Full graded claims, side by side on wide screens */}
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
