"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, CircleHelp, Compass, Construction, FileText, Lightbulb, Sigma, SquareDashed, Table2, BarChart3 } from "lucide-react";
import type { Basis, MotionId, Src as SrcType } from "@/lib/korea-fy27/types";
import { BASIS_LABEL, BASIS_SHORT, MOTION_LABEL, num, srcText } from "@/lib/korea-fy27/format";

export const MOTION_COLOR: Record<MotionId, string> = {
  deepen: "var(--deepen)",
  penetrate: "var(--penetrate)",
  acquire: "var(--acquire)",
};

const BASIS_ICON: Record<Basis, typeof FileText> = {
  stated: FileText,
  derived: Sigma,
  estimate: Compass,
  directional: Compass,
  wip: Construction,
  "to-confirm": CircleHelp,
  placeholder: SquareDashed,
  proposed: Lightbulb,
};

export function Tag({ basis, children }: { basis: Basis; children?: ReactNode }) {
  const Icon = BASIS_ICON[basis];
  return (
    <span className={`k-tag ${basis === "derived" ? "derived" : ""}`} title={BASIS_LABEL[basis]}>
      <Icon aria-hidden="true" />
      {children ?? BASIS_SHORT[basis]}
    </span>
  );
}

export function MotionTag({ motion }: { motion: MotionId }) {
  return <span className={`k-tag motion-${motion}`}>{MOTION_LABEL[motion]}</span>;
}

export function Src({ src, basis, extra }: { src: SrcType | SrcType[]; basis?: Basis[]; extra?: ReactNode }) {
  const list = Array.isArray(src) ? src : [src];
  return (
    <p className="k-src">
      <span>
        <b>Source:</b> {list.map((s) => srcText(s)).join(" · ")}
      </span>
      {basis?.map((b) => <Tag key={b} basis={b} />)}
      {extra}
    </p>
  );
}

export function Section({
  id,
  num: n,
  label,
  question,
  headline,
  lead,
  exec,
  top,
  children,
}: {
  id: string;
  num: string;
  label: string;
  question: string;
  headline: ReactNode;
  lead?: ReactNode;
  exec?: boolean;
  /** Rendered between the kicker and the headline (the summary's hero number). */
  top?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="k-section" data-exec={exec ? "" : undefined} aria-labelledby={`${id}-h`}>
      <p className="k-kicker">
        <span>
          {n} · {label}
        </span>
        <span className="q">{question}</span>
      </p>
      {top}
      <h2 id={`${id}-h`} className="k-h2">
        {headline}
      </h2>
      {lead ? <p className="k-lead">{lead}</p> : null}
      {children}
    </section>
  );
}

export function Block({ title, sub, children, className }: { title?: ReactNode; sub?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`k-block ${className ?? ""}`}>
      {title ? (
        <div className="k-block-title">
          <h3>{title}</h3>
          {sub ? <p>{sub}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** A chart card with a chart ⇄ table toggle: every chart has a table twin. */
export function Fig({
  title,
  sub,
  children,
  table,
  src,
  basis,
  actions,
  note,
}: {
  title: ReactNode;
  sub?: ReactNode;
  children: ReactNode;
  table?: ReactNode;
  src?: SrcType | SrcType[];
  basis?: Basis[];
  actions?: ReactNode;
  note?: ReactNode;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  return (
    <figure className="k-fig" style={{ margin: 0 }}>
      <div className="k-fig-head">
        <div>
          <h3>{title}</h3>
          {sub ? <p>{sub}</p> : null}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {actions}
          {table ? (
            <div className="k-toggle" role="group" aria-label="View">
              <button type="button" aria-pressed={view === "chart"} onClick={() => setView("chart")}>
                <BarChart3 aria-hidden="true" style={{ width: 13, height: 13, verticalAlign: "-2px", marginRight: 4 }} />
                Chart
              </button>
              <button type="button" aria-pressed={view === "table"} onClick={() => setView("table")}>
                <Table2 aria-hidden="true" style={{ width: 13, height: 13, verticalAlign: "-2px", marginRight: 4 }} />
                Table
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {view === "chart" || !table ? children : table}
      {note ? <div className="k-tfoot-note">{note}</div> : null}
      {src ? <Src src={src} basis={basis} /> : null}
    </figure>
  );
}

export function Details({
  title,
  sub,
  children,
  defaultOpen,
  className,
}: {
  title: ReactNode;
  sub?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details className={`k-details ${className ?? ""}`} open={defaultOpen}>
      <summary>
        <span>
          {title}
          {sub ? (
            <>
              {" "}
              <small>{sub}</small>
            </>
          ) : null}
        </span>
        <ChevronDown className="chev" aria-hidden="true" size={18} />
      </summary>
      <div className="k-details-body">{children}</div>
    </details>
  );
}

export type Cell = string | number | null | undefined;

export function DataTable({
  columns,
  rows,
  numeric = [],
  total,
  caption,
  wrapCols = [],
}: {
  columns: string[];
  rows: Cell[][];
  numeric?: number[];
  total?: Cell[];
  caption?: string;
  wrapCols?: number[];
}) {
  const cls = (i: number) => [numeric.includes(i) ? "num" : "", wrapCols.includes(i) ? "wrap" : ""].join(" ").trim() || undefined;
  return (
    <div className="k-table-wrap">
      <table className="k-table">
        {caption ? <caption className="k-sr">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={c + i} className={numeric.includes(i) ? "num" : undefined} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) => (
                <td key={i} className={cls(i)}>
                  {typeof cell === "number" ? num(cell) : cell === null || cell === undefined || cell === "" ? "–" : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {total ? (
          <tfoot>
            <tr>
              {total.map((cell, i) => (
                <td key={i} className={cls(i)}>
                  {typeof cell === "number" ? num(cell) : cell ?? ""}
                </td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

/** One fixed-position tooltip per chart. Values lead, labels follow; works on hover and focus. */
export function useTip() {
  const [tip, setTip] = useState<{ x: number; y: number; below: boolean; content: ReactNode } | null>(null);
  const place = (x: number, y: number, content: ReactNode) => setTip({ x, y, below: y < 140, content });
  const bind = (content: ReactNode) => ({
    onPointerMove: (e: React.PointerEvent) => place(e.clientX, e.clientY, content),
    onPointerLeave: () => setTip(null),
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      place(r.left + r.width / 2, r.top, content);
    },
    onBlur: () => setTip(null),
  });
  const node = tip ? (
    <div
      className="k-tip"
      role="tooltip"
      style={{ left: Math.min(Math.max(tip.x, 160), (typeof window !== "undefined" ? window.innerWidth : 1200) - 160), top: tip.y, transform: tip.below ? "translate(-50%, 18px)" : undefined }}
    >
      {tip.content}
    </div>
  ) : null;
  return { bind, node };
}

export function TipRow({ color, label, value }: { color?: string; label: ReactNode; value: ReactNode }) {
  return (
    <div className="row">
      {color ? <span className="key" style={{ background: color }} /> : null}
      <span className="mut">{label}</span>
      <span style={{ marginLeft: "auto", fontWeight: 700 }}>{value}</span>
    </div>
  );
}
