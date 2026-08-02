"use client";

import { useEffect, useId, useRef, useState } from "react";
import { exportChartPng, exportChartSvg } from "@/lib/modelcomp/export";

type ExtraItem = { label: string; hint: string; run: () => void };

/**
 * Download menu for a chart. PNG and SVG come from the chart's own <svg>;
 * `extra` carries whatever else belongs to the section (CSV, print).
 */
export default function ExportMenu({
  target,
  basename,
  extra = [],
  label = "Download",
}: {
  target?: React.RefObject<SVGSVGElement | null>;
  basename?: string;
  extra?: ExtraItem[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function run(name: string, task: () => void | Promise<void>) {
    setBusy(name);
    setError(null);
    try {
      await task();
      setOpen(false);
    } catch {
      setError("That export failed. Try again.");
    } finally {
      setBusy(null);
    }
  }

  const chartItems: ExtraItem[] =
    target && basename
      ? [
          {
            label: "PNG · 2×",
            hint: "Raster, paper background, fonts embedded",
            run: () => {
              const svg = target.current;
              if (!svg) throw new Error("Chart not ready.");
              return void exportChartPng(svg, `${basename}.png`, 2);
            },
          },
          {
            label: "SVG · vector",
            hint: "Editable in Figma or Illustrator",
            run: () => {
              const svg = target.current;
              if (!svg) throw new Error("Chart not ready.");
              return void exportChartSvg(svg, `${basename}.svg`);
            },
          },
        ]
      : [];

  const items = [...chartItems, ...extra];

  return (
    <div className="mc-export" ref={root}>
      <button
        type="button"
        className="mc-pill"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <span aria-hidden="true" style={{ fontSize: 9, lineHeight: 1 }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open ? (
        <div className="mc-export-menu" id={menuId} role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className="mc-export-item"
              disabled={busy !== null}
              onClick={() => run(item.label, item.run)}
            >
              {busy === item.label ? "Working…" : item.label}
              <small>{item.hint}</small>
            </button>
          ))}
          {error ? (
            <p className="mc-error" style={{ padding: "6px 10px 4px" }} role="alert">
              {error}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
