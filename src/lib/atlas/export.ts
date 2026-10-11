/** Client-side export helpers: CSV / JSON tables and SVG/PNG chart snapshots. */

function download(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

const cell = (v: unknown) => {
  const s = v == null ? "" : Array.isArray(v) ? v.join("; ") : typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCSV(rows: Record<string, unknown>[], columns?: string[]): string {
  const cols = columns ?? Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
}

export function exportCSV(name: string, rows: Record<string, unknown>[], columns?: string[]) {
  download(name.endsWith(".csv") ? name : `${name}.csv`, new Blob([toCSV(rows, columns)], { type: "text/csv;charset=utf-8" }));
}

export function exportJSON(name: string, data: unknown) {
  download(name.endsWith(".json") ? name : `${name}.json`, new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
}

/** Serialize an inline SVG (with computed fonts) for download. */
export function exportSVG(name: string, svg: SVGSVGElement | null) {
  if (!svg) return;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = "text{font-family:Inter,system-ui,sans-serif}";
  clone.insertBefore(style, clone.firstChild);
  const vb = svg.viewBox.baseVal;
  if (vb && vb.width) {
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", String(vb.x)); bg.setAttribute("y", String(vb.y));
    bg.setAttribute("width", String(vb.width)); bg.setAttribute("height", String(vb.height));
    bg.setAttribute("fill", "#ffffff");
    clone.insertBefore(bg, style.nextSibling);
  }
  download(name.endsWith(".svg") ? name : `${name}.svg`, new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
}
