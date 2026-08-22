"use client";

import { useEffect, useState } from "react";
import type { Dataset, Model } from "@/lib/llm-landscape/types";
import { fmtMods, fmtTokens } from "@/lib/llm-landscape/model";
import {
  AccessPill,
  ClaimList,
  ConfidencePill,
  EvidenceLegend,
  GradeBadge,
  Released,
  StatusPill,
  TierTag,
  VendorDot,
} from "./ui";

export default function Detail({
  model,
  data,
  onClose,
  onCompare,
  onJump,
  onPrev,
  onNext,
}: {
  model: Model;
  data: Dataset;
  onClose: () => void;
  onCompare: (workload: string) => void;
  onJump: (id: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const [openDispute, setOpenDispute] = useState<number | null>(null);
  const geq = model.google_equivalents ?? [];
  const wl = (id: string) => data.meta.workloads.find((w) => w.id === id)?.label ?? id;
  const predecessor = model.predecessor_id
    ? data.models.find((m) => m.id === model.predecessor_id)
    : null;
  const successor = data.models.find((m) => m.predecessor_id === model.id && m.tier < 3);

  // Arrow keys page through records while the sheet is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^(INPUT|SELECT|TEXTAREA)$/.test((e.target as HTMLElement)?.tagName ?? "")) return;
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onPrev, onNext]);

  return (
    <aside className="pane" aria-label={`${model.name} record`}>
      <div className="pane-head">
        <div className="pane-nav">
          <button className="pane-close" onClick={onClose} aria-label="Close record (Esc)">
            ✕ close
          </button>
          <span className="pane-pager">
            <button className="pane-close" onClick={onPrev} disabled={!onPrev} aria-label="Previous model (←)">
              ‹ prev
            </button>
            <button className="pane-close" onClick={onNext} disabled={!onNext} aria-label="Next model (→)">
              next ›
            </button>
          </span>
        </div>
        <div className="card-top">
          <VendorDot vendor={model.vendor} />
          <TierTag tier={model.tier} />
          <StatusPill status={model.status} />
          <AccessPill access={model.access} />
        </div>
        <h2 className="pane-name">{model.name}</h2>
        <div className="pane-sub">
          <Released model={model} />
          <span className="dot-sep">·</span>
          <span>family: {model.family}</span>
          {predecessor && (
            <>
              <span className="dot-sep">·</span>
              <button className="link" onClick={() => onJump(predecessor.id)}>
                ← {predecessor.name}
              </button>
            </>
          )}
          {successor && (
            <>
              <span className="dot-sep">·</span>
              <button className="link" onClick={() => onJump(successor.id)}>
                {successor.name} →
              </button>
            </>
          )}
        </div>
        {model.last_verified && <div className="verified">last verified {model.last_verified}</div>}
      </div>

      <div className="pane-body">
        {/* Spec strip */}
        <dl className="specs">
          <div>
            <dt>context in</dt>
            <dd>{fmtTokens(model.context?.input_tokens)}</dd>
          </div>
          <div>
            <dt>context out</dt>
            <dd>{fmtTokens(model.context?.output_tokens)}</dd>
          </div>
          <div>
            <dt>size</dt>
            <dd>
              {model.size?.params_b != null ? `${model.size.params_b}B` : (model.size?.class ?? "—")}
            </dd>
          </div>
          <div>
            <dt>license</dt>
            <dd>{model.license ?? "—"}</dd>
          </div>
          <div>
            <dt>in / out</dt>
            <dd>{fmtMods(model)}</dd>
          </div>
        </dl>
        {model.size?.note && <p className="size-note">{model.size.note}</p>}

        {model.why_it_mattered && (
          <section className="prose-block">
            <h4>Why it mattered</h4>
            <p>{model.why_it_mattered}</p>
          </section>
        )}

        {/* Google equivalents — the payload */}
        {geq.length > 0 && (
          <section className="geq">
            <h4>Google equivalent, by workload</h4>
            {geq.map((row, i) => (
              <div key={i} className={`geq-row ${row.google_model === null ? "geq-null" : ""}`}>
                <div className="geq-head">
                  <span className="geq-workload">{wl(row.workload)}</span>
                  <ConfidencePill level={row.confidence} />
                </div>
                <div className="geq-target">
                  {row.google_model ?? "No credible Google equivalent"}
                </div>
                <p className="geq-rationale">{row.rationale}</p>
                <div className="concession">
                  <span className="concession-tag">what you give up</span>
                  <p>{row.where_google_loses}</p>
                </div>
                <button className="btn-compare" onClick={() => onCompare(row.workload)}>
                  open comparison →
                </button>
              </div>
            ))}
          </section>
        )}

        {(model.known_for?.length ?? 0) > 0 && <EvidenceLegend />}
        <ClaimList title="Known for" claims={model.known_for} />
        <ClaimList title="Best use cases" claims={model.best_use_cases} />
        <ClaimList title="Weaknesses" claims={model.weaknesses} tone="weak" />

        {model.market_reputation && (
          <section className="prose-block">
            <h4>Market reputation</h4>
            <p>{model.market_reputation}</p>
          </section>
        )}
        {model.reputation_shift && (
          <section className="prose-block shift-block">
            <h4>How perception moved</h4>
            <p>{model.reputation_shift}</p>
          </section>
        )}

        {(model.disputed?.length ?? 0) > 0 && (
          <section className="disputes">
            <h4>Disputed</h4>
            {model.disputed!.map((d, i) => (
              <div key={i} className="dispute">
                <button
                  className="dispute-q"
                  onClick={() => setOpenDispute(openDispute === i ? null : i)}
                  aria-expanded={openDispute === i}
                >
                  {openDispute === i ? "▾" : "▸"} {d.question}
                </button>
                {openDispute === i && (
                  <div className="dispute-body">
                    <p>
                      <strong>Position A.</strong> {d.position_a}
                    </p>
                    <p>
                      <strong>Position B.</strong> {d.position_b}
                    </p>
                    <p className="assessment">
                      <GradeBadge grade="analyst-inference" /> {d.assessment}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {(model.sources?.length ?? 0) > 0 && (
          <section className="sources">
            <h4>Sources ({model.sources!.length})</h4>
            <ul>
              {model.sources!.map((s, i) => (
                <li key={i}>
                  <span className="src-type">{s.type}</span>{" "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {new URL(s.url).hostname.replace(/^www\./, "")}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {model.note && <p className="size-note">{model.note}</p>}
      </div>
    </aside>
  );
}
