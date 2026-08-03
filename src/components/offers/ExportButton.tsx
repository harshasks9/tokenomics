"use client";

import { useCallback, useState } from "react";
import {
  GSU_TERM_LABEL,
  GSU_TERM_PRICE,
  type Levers,
  type ModelResult,
} from "@/lib/offers/model";
import { todayStamp } from "@/lib/offers/format";
import { SCOPE_NOTE } from "@/lib/offers/descriptions";

/** Properties that can carry a var() we must resolve before serializing. */
const PAINT_PROPS = ["fill", "stroke", "color"] as const;
const TEXT_PROPS = ["font-family", "font-size", "font-weight", "letter-spacing"] as const;

function download(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Pull same-origin @font-face sources into a data-URI stylesheet so exported
 * PNGs keep IBM Plex instead of falling back to a system face. Best effort —
 * a failure just means the export uses the fallback stack.
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
        const src = rule.style.getPropertyValue("src");
        for (const match of src.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
          const href = new URL(match[1], document.baseURI);
          if (href.origin === window.location.origin) urls.add(href.href);
        }
      }
    }

    const faces = await Promise.all(
      Array.from(urls).slice(0, 6).map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) return "";
          const buffer = await response.arrayBuffer();
          let binary = "";
          const bytes = new Uint8Array(buffer);
          for (let i = 0; i < bytes.length; i += 1) {
            binary += String.fromCharCode(bytes[i]);
          }
          const family = url.includes("Mono") ? "PlexExportMono" : "PlexExport";
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

async function exportPng(svg: SVGSVGElement, scale = 2) {
  const rect = svg.getBoundingClientRect();
  const width = Math.max(Math.round(rect.width), 1);
  const height = Math.max(Math.round(rect.height), 1);

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.setAttribute("viewBox", `0 0 ${width} ${height}`);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.style.overflow = "visible";

  // Resolve every var()-driven paint and font against the live element.
  const originals = [svg, ...Array.from(svg.querySelectorAll<SVGElement>("*"))];
  const clones = [clone, ...Array.from(clone.querySelectorAll<SVGElement>("*"))];
  originals.forEach((node, index) => {
    const target = clones[index];
    if (!target) return;
    const computed = window.getComputedStyle(node);
    for (const prop of PAINT_PROPS) {
      const value = computed.getPropertyValue(prop);
      if (value && value !== "none") target.setAttribute(prop, value.trim());
    }
    if (node.tagName === "text") {
      for (const prop of TEXT_PROPS) {
        const value = computed.getPropertyValue(prop);
        if (value) target.setAttribute(prop, value.trim());
      }
    }
    target.removeAttribute("class");
  });

  // Dark canvas behind the chart, with breathing room.
  const pad = 24;
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("x", String(-pad));
  background.setAttribute("y", String(-pad));
  background.setAttribute("width", String(width + pad * 2));
  background.setAttribute("height", String(height + pad * 2));
  background.setAttribute("fill", "#071E30");
  clone.insertBefore(background, clone.firstChild);
  clone.setAttribute("viewBox", `${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`);
  clone.setAttribute("width", String(width + pad * 2));
  clone.setAttribute("height", String(height + pad * 2));

  const fontCss = await inlineFontCss();
  if (fontCss) {
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = `${fontCss}text{font-family:'PlexExportMono','PlexExport',ui-monospace,monospace;}`;
    clone.insertBefore(style, clone.firstChild);
  }

  const source = new XMLSerializer().serializeToString(clone);
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;

  const image = new Image();
  image.decoding = "sync";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not rasterize the chart."));
    image.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = (width + pad * 2) * scale;
  canvas.height = (height + pad * 2) * scale;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable.");
  context.fillStyle = "#071E30";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  download(canvas.toDataURL("image/png"), `offers-scenario-${todayStamp()}.png`);
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function exportCsv(levers: Levers, result: ModelResult) {
  const rows: Array<Array<string | number>> = [
    ["Offers — GenAI commercial scenario model"],
    ["Generated", todayStamp()],
    ["Scope", SCOPE_NOTE],
    ["Note", "Internal illustrative modeling. Not a rate card."],
    [],
    ["INCREMENTAL WORKLOAD"],
    ["Input", "Value"],
    ["PT ordered (GSUs, derived)", result.traffic.ptGsus],
    ["PT utilization", levers.ptUtilization],
    ["PT consumed (GSU-equiv)", result.traffic.ptConsumed.toFixed(1)],
    ["PT idle (GSUs)", result.traffic.idleGsus.toFixed(1)],
    ["Incremental PayGo (GSU-equiv)", result.traffic.paygoGsus.toFixed(1)],
    ["Total delivered (GSU-equiv)", result.traffic.totalConsumed.toFixed(1)],
    ["Model", result.sizing.modelName],
    ["Demand (TPM)", levers.tpm],
    ["PT share of demand", levers.ptShare],
    ["Output share of tokens", levers.outputShare],
    ["TPM per GSU", result.sizing.tpmPerGsu],
    ["TPM per GSU source", result.sizing.throughputIsPublished ? "published" : "assumption"],
    ["PayGo rate ($/Mtok)", result.sizing.paygoPerMtok.toFixed(4)],
    ["PayGo rate source", result.sizing.paygoRateIsPublished ? "deck" : "derived at GSU parity"],
    ["PT capacity TPM", Math.round(result.traffic.ptCapacityTpm)],
    ["PayGo TPM", Math.round(result.traffic.paygoTpm)],
    ["PT share of volume", result.traffic.ptShareOfVolume.toFixed(4)],
    ["PT share of spend", result.traffic.ptShareOfSpend.toFixed(4)],
    [],
    ["PAYGO PLACEMENT (share of PayGo demand)"],
    ["Spike / peak-sensitive", result.mix.spike.toFixed(4)],
    ["Off-peak eligible", result.mix.offPeak.toFixed(4)],
    ["Deferred agents", result.mix.deferred.toFixed(4)],
    ["Batch", result.mix.batch.toFixed(4)],
    ["Standard PayGo (remainder)", result.mix.standard.toFixed(4)],
    ["Harness fee share", levers.harness],
    ["Deferred effective multiplier", result.defMult],
    [],
    ["OFFERS ELECTED"],
    ["Offer", "Elected"],
    ["Buy One PT Get One PayGo", levers.offers.bogo ? "yes" : "no"],
    ["  eligible (200+ PT GSUs)", result.bogoEligible ? "yes" : "no"],
    ["Off-peak PayGo", levers.offers.offPeak ? "yes" : "no"],
    ["Deferred Agents API", levers.offers.deferred ? "yes" : "no"],
    ["Batch", levers.offers.batch ? "yes" : "no"],
    ["Flexible Savings Plan", levers.offers.fsp ? "yes" : "no"],
    ["  FSP rate", levers.offers.fsp ? levers.fspRate : 0],
    ["GSU Q3 offer", levers.offers.q3 ? "yes" : "no"],
    ["  qualifying tier", result.q3Tier?.label ?? "none"],
    ["  discount applied", result.q3AppliedDiscount],
    ["  credits applied", result.q3AppliedCredits],
    ["GSU term", GSU_TERM_LABEL[levers.term]],
    ["GSU unit price ($/GSU/mo)", GSU_TERM_PRICE[levers.term] * 1000],
    ["GCP commit discount", levers.gcpCommit],
    ["Applied PT discount (non-stacking)", result.gsu.appliedDiscountRate],
    [],
    ["INCREMENTAL COMMIT"],
    ["Committed PT GSUs / month", result.gsu.units],
    ["Monthly commit $K", result.commit.monthly.toFixed(2)],
    ["Term months", result.commit.months],
    ["Total commit $K", result.commit.total.toFixed(2)],
    ["Effective $ per GSU per month", (result.gsu.effectiveUnitPrice * 1000).toFixed(0)],
    [],
    ["STEPS ($K per month)"],
    ["#", "Step", "Elected", "Mechanic", "Monthly $K", "Delta $K", "Cumulative saving %"],
    ...result.steps.map((step, index) => [
      index === 0 ? "" : index,
      step.label,
      index === 0 ? "" : step.elected ? "yes" : "no",
      step.mechanic,
      step.value.toFixed(2),
      index === 0 ? "" : step.delta.toFixed(2),
      index === 0 ? "" : (step.cumulativeSavingPct * 100).toFixed(2),
    ]),
    [],
    ["SUMMARY"],
    ["Incremental spend $K/mo (nothing elected)", result.reference.toFixed(2)],
    ["  of which PT", result.ptReference.toFixed(2)],
    ["  of which PayGo", result.paygoReference.toFixed(2)],
    ["With programs $K/mo", result.final.toFixed(2)],
    ["Monthly saving $K", (result.reference - result.final).toFixed(2)],
    ["Annualized saving $K", result.annualSave.toFixed(2)],
    ["Saving %", (result.savingPct * 100).toFixed(2)],
    ["Blended multiplier", result.blendedMultiplier.toFixed(4)],
    [],
    ["SAVING ATTRIBUTION ($K per month)"],
    ["Buy One PT Get One PayGo", result.attribution.bogo.toFixed(2)],
    ["Placement (0.5x tiers)", result.attribution.placement.toFixed(2)],
    ["FSP commitment", result.attribution.fsp.toFixed(2)],
    ["GSU term + commit", result.attribution.gsuCommit.toFixed(2)],
    ["GSU Q3 offer", result.attribution.q3.toFixed(2)],
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([`﻿${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  download(url, `offers-scenario-${todayStamp()}.csv`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ExportButton({
  levers,
  result,
}: {
  levers: Levers;
  result: ModelResult;
}) {
  const [status, setStatus] = useState<string | null>(null);

  const png = useCallback(async () => {
    const svg = document.querySelector<SVGSVGElement>(
      '[data-offers-waterfall="true"]',
    );
    if (!svg) {
      setStatus("Chart not ready");
      return;
    }
    setStatus("Rendering…");
    try {
      await exportPng(svg);
      setStatus("PNG saved");
    } catch {
      setStatus("PNG failed");
    } finally {
      setTimeout(() => setStatus(null), 2200);
    }
  }, []);

  return (
    <>
      <button type="button" className="o-btn" onClick={png}>
        {status ?? "PNG"}
      </button>
      <button
        type="button"
        className="o-btn"
        onClick={() => exportCsv(levers, result)}
      >
        CSV
      </button>
    </>
  );
}
