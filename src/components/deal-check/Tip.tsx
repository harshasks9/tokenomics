"use client";

import { CREDIT_SOURCES, SOURCE_LABEL } from "@/lib/deal-check/terms";

export type TipKey = keyof typeof CREDIT_SOURCES;

/** An info mark that reveals the source passage behind a figure or label. */
export default function Tip({ id, label }: { id: TipKey; label?: string }) {
  const q = CREDIT_SOURCES[id];
  return (
    <span className="dc-tip">
      <button type="button" className="dc-tip-btn" aria-label={`Source: ${q.where}`}>i</button>
      <span role="tooltip" className="dc-tip-pop">
        <span className="dc-tip-head"><span className={`dc-tag ${q.source}`}>{SOURCE_LABEL[q.source]}</span>{label && <b>{label}</b>}</span>
        <span className="dc-tip-where">{q.where}</span>
        <span className="dc-tip-quote">“{q.quote}”</span>
      </span>
    </span>
  );
}
