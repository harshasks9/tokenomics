"use client";

import { useMemo, useState } from "react";
import type { Result } from "@/lib/deal-check/engine";
import { accountSummary } from "@/lib/deal-check/summary";
import { explanationText } from "@/lib/deal-check/explain";
import { constructText, dealConstruct, type DealMeta } from "@/lib/deal-check/construct";

export default function Summary({ result, meta }: { result: Result; meta: DealMeta }) {
  const text = useMemo(() => `${meta.customer ? `Customer: ${meta.customer}${meta.region ? ` (${meta.region})` : ""}\n\n` : ""}${accountSummary(result)}\n\nWhy the math comes out this way:\n${explanationText(result)}\n\n${constructText(dealConstruct(meta, result.inputs, result))}`, [result, meta]);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable: the textarea is selectable */
    }
  };
  return (
    <div>
      <div className="dc-toolbar">
        <button className="dc-btn primary" onClick={copy}>{copied ? "Copied" : "Copy summary"}</button>
        <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Plain text, ready to paste into notes or email.</span>
      </div>
      <textarea className="dc-summary" readOnly value={text} onFocus={(e) => e.currentTarget.select()} aria-label="Account summary" />
    </div>
  );
}
