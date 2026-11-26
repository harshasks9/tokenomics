#!/usr/bin/env node
/**
 * Build the stand-alone Subsidy Math page for claude.ai: one HTML file with the
 * React bundle and CSS inline, plus the Excel workbook beside it.
 *
 *   node scripts/subsidy-math/artifact/build.mjs <outDir>
 *
 * Writes <outDir>/subsidy-math.html (the Excel workbook is embedded as base64).
 * Same components as /subsidy-math; src/components/subsidy-math/platform.tsx is
 * swapped for ./platform.tsx (in-page #views, downloads capability).
 */
import { build } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../..");
const outDir = path.resolve(process.argv[2] ?? path.join(here, "dist"));
const viteOut = path.join(outDir, "_vite");
const componentsDir = path.join(repo, "src", "components", "subsidy-math");

await build({
  root: here,
  configFile: false,
  logLevel: "warn",
  resolve: { alias: [{ find: /^@\//, replacement: `${path.join(repo, "src")}/` }] },
  plugins: [
    {
      name: "subsidy-math-platform-swap",
      enforce: "pre",
      resolveId(source, importer) {
        if (source === "./platform" && importer && path.dirname(importer) === componentsDir) return path.join(here, "platform.tsx");
        return null;
      },
    },
  ],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  oxc: { jsx: { runtime: "automatic", importSource: "react" } },
  build: { outDir: viteOut, emptyOutDir: true, assetsInlineLimit: 100_000_000, cssCodeSplit: false, modulePreload: false, minify: true },
});

const assets = path.join(viteOut, "assets");
const files = fs.readdirSync(assets);
const js = files.filter((f) => f.endsWith(".js")).map((f) => fs.readFileSync(path.join(assets, f), "utf8")).join("\n");
const css = files.filter((f) => f.endsWith(".css")).map((f) => fs.readFileSync(path.join(assets, f), "utf8")).join("\n");
if (!js || !css) throw new Error("bundle is missing JS or CSS");
const xlsx = fs.readFileSync(path.join(repo, "public", "subsidy-math", "subsidy-math-model.xlsx")).toString("base64");

const page = [
  "<title>Subsidy Math</title>",
  '<meta name="claude:viewport-fit-sides" content="cover">',
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">',
  `<style>${css.replace(/<\/style/gi, "<\\/style")}</style>`,
  '<div id="root"></div>',
  // The workbook rides inside the page: claude.ai pages can't attach .xlsx files, and the
  // downloads capability (which allows .xlsx) hands it to the viewer from these bytes.
  `<script type="application/octet-stream" id="sm-xlsx">${xlsx}</script>`,
  `<script type="module">${js.replace(/<\/script/gi, "<\\/script")}</script>`,
  "",
].join("\n");

fs.writeFileSync(path.join(outDir, "subsidy-math.html"), page);
fs.rmSync(viteOut, { recursive: true, force: true });
console.log(`wrote ${path.join(outDir, "subsidy-math.html")} (${(page.length / 1024).toFixed(0)} KB, workbook embedded)`);
