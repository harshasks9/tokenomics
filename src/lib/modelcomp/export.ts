/**
 * Download helpers — PNG, SVG and CSV.
 *
 * The charts are plain inline SVG styled by CSS custom properties, so a naive
 * serialize-and-rasterize would drop every colour. Before rasterizing we walk
 * the live tree and bake each computed paint/text property onto the clone.
 */

const SVG_NS = "http://www.w3.org/2000/svg";
const PAINT_PROPS = ["fill", "stroke", "stroke-width", "stroke-dasharray", "opacity", "fill-opacity", "stroke-opacity"] as const;
const TEXT_PROPS = [
  "font-family",
  "font-size",
  "font-weight",
  "letter-spacing",
  "text-anchor",
  "font-variant-numeric",
] as const;

export const EXPORT_BACKGROUND = "#F5F6F8";

function triggerDownload(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Pull same-origin @font-face sources into a data-URI stylesheet so exported
 * PNGs keep Space Grotesk / IBM Plex instead of falling back to a system face.
 * Best effort — a failure just means the export uses the fallback stack.
 */
let fontCssPromise: Promise<string> | null = null;
async function inlineFontCss(): Promise<string> {
  if (fontCssPromise) return fontCssPromise;
  fontCssPromise = (async () => {
    const urls = new Set<string>();
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin sheet
      }
      for (const rule of Array.from(rules)) {
        if (!(rule instanceof CSSFontFaceRule)) continue;
        const family = rule.style.getPropertyValue("font-family").replace(/["']/g, "").trim();
        const src = rule.style.getPropertyValue("src");
        for (const match of src.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
          const href = new URL(match[1], document.baseURI);
          if (href.origin === window.location.origin) {
            urls.add(`${family}|${href.href}`);
          }
        }
      }
    }

    const faces = await Promise.all(
      Array.from(urls)
        .slice(0, 8)
        .map(async (entry) => {
          const separator = entry.indexOf("|");
          const family = entry.slice(0, separator);
          const url = entry.slice(separator + 1);
          try {
            const response = await fetch(url);
            if (!response.ok) return "";
            const buffer = await response.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            let binary = "";
            for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
            return `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${btoa(binary)}) format('woff2');font-display:block;}`;
          } catch {
            return "";
          }
        }),
    );
    return faces.join("");
  })();
  return fontCssPromise;
}

/** Clone the chart with every computed paint baked in, ready to serialize. */
async function bakeSvg(svg: SVGSVGElement, pad: number): Promise<{ clone: SVGSVGElement; width: number; height: number }> {
  const rect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const width = Math.max(Math.round(viewBox?.width || rect.width), 1);
  const height = Math.max(Math.round(viewBox?.height || rect.height), 1);

  const clone = svg.cloneNode(true) as SVGSVGElement;

  const originals = [svg, ...Array.from(svg.querySelectorAll<SVGElement>("*"))];
  const clones = [clone, ...Array.from(clone.querySelectorAll<SVGElement>("*"))];
  originals.forEach((node, index) => {
    const target = clones[index];
    if (!target) return;
    const computed = window.getComputedStyle(node);
    for (const prop of PAINT_PROPS) {
      const value = computed.getPropertyValue(prop);
      if (value) target.setAttribute(prop, value.trim());
    }
    if (node.tagName === "text" || node.tagName === "tspan") {
      for (const prop of TEXT_PROPS) {
        const value = computed.getPropertyValue(prop);
        if (value) target.setAttribute(prop, value.trim());
      }
      // `text-transform` is a CSS property with no SVG presentation-attribute
      // equivalent, so casing has to be baked into the content itself or every
      // uppercase caption exports in sentence case.
      const transform = computed.getPropertyValue("text-transform");
      if (transform === "uppercase" && target.textContent) {
        target.textContent = target.textContent.toUpperCase();
      } else if (transform === "lowercase" && target.textContent) {
        target.textContent = target.textContent.toLowerCase();
      }
    }
    target.removeAttribute("class");
    target.removeAttribute("style");
  });

  // Hover-only chrome would export as a frozen tooltip — drop it.
  clone.querySelectorAll("[data-export-hide]").forEach((node) => node.remove());

  const background = document.createElementNS(SVG_NS, "rect");
  background.setAttribute("x", String(-pad));
  background.setAttribute("y", String(-pad));
  background.setAttribute("width", String(width + pad * 2));
  background.setAttribute("height", String(height + pad * 2));
  background.setAttribute("fill", EXPORT_BACKGROUND);
  clone.insertBefore(background, clone.firstChild);

  const fontCss = await inlineFontCss();
  if (fontCss) {
    const style = document.createElementNS(SVG_NS, "style");
    style.textContent = fontCss;
    clone.insertBefore(style, clone.firstChild);
  }

  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("viewBox", `${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`);
  clone.setAttribute("width", String(width + pad * 2));
  clone.setAttribute("height", String(height + pad * 2));
  clone.removeAttribute("preserveAspectRatio");

  return { clone, width: width + pad * 2, height: height + pad * 2 };
}

export async function exportChartPng(
  svg: SVGSVGElement,
  filename: string,
  scale = 2,
): Promise<void> {
  const pad = 28;
  const { clone, width, height } = await bakeSvg(svg, pad);
  const source = new XMLSerializer().serializeToString(clone);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;

  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not rasterize the chart."));
    image.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable.");
  context.fillStyle = EXPORT_BACKGROUND;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  triggerDownload(canvas.toDataURL("image/png"), filename);
}

export async function exportChartSvg(svg: SVGSVGElement, filename: string): Promise<void> {
  const { clone } = await bakeSvg(svg, 28);
  const source = `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  // Give the click a tick to start before the object URL goes away.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(value: string | number | null): string {
  if (value === null) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function exportCsv(rows: Array<Array<string | number | null>>, filename: string): void {
  const body = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  // BOM so Excel reads the em dashes and '·' separators as UTF-8.
  const blob = new Blob([`﻿${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
