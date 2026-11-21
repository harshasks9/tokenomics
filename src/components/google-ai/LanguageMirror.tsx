"use client";

import { useEffect, useRef } from "react";
import { UI_STRINGS } from "@/lib/google-ai/i18n";
import type { LangId } from "@/lib/google-ai/taxonomy";

/**
 * Shows the page in another language without forking the content.
 *
 * Components always render English. This watches the text inside `root`, sends new strings to the translation
 * service in batches, and swaps them in. Each node's English source is remembered, so changing language
 * re-translates from the source and choosing English restores it exactly. Hand-translated interface strings
 * are applied instantly from the built-in dictionary. Anything marked translate="no" (product names, model ids,
 * code) is left alone.
 */
const SKIP = 'script, style, noscript, code, pre, textarea, svg, [translate="no"], .gai-mono';
const BATCH_TEXTS = 60;
const BATCH_CHARS = 6000;

function worthTranslating(s: string): boolean {
  if (s.length < 2 || s.length > 1500 || !/[A-Za-z]{2}/.test(s)) return false;
  if (/^[\d\s$€£¥.,:%+×/()\-–—·]+$/.test(s)) return false;
  // Identifiers: a single token with digits, dots, slashes or hyphens (model ids, URLs, versions).
  if (!/\s/.test(s) && /[\d./_-]/.test(s)) return false;
  return true;
}

function loadCache(lang: LangId): Record<string, string> {
  const seed = lang === "en" ? {} : { ...UI_STRINGS[lang] };
  try {
    return { ...(JSON.parse(localStorage.getItem(`gai-tr-${lang}`) ?? "{}") as Record<string, string>), ...seed };
  } catch {
    return seed;
  }
}

export default function LanguageMirror({ lang, root, onStatus }: { lang: LangId; root: React.RefObject<HTMLElement | null>; onStatus?: (s: "idle" | "working" | "unavailable") => void }) {
  // English source of every text node we have seen, and the value we last wrote into it.
  const sources = useRef(new WeakMap<Text, string>());
  const written = useRef(new WeakMap<Text, string>());

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const cache = loadCache(lang);
    const waiting = new Map<string, Set<Text>>();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    let failed = false;
    document.documentElement.lang = lang;

    const write = (node: Text, value: string) => {
      const lead = node.data.match(/^\s*/)?.[0] ?? "";
      const trail = node.data.match(/\s*$/)?.[0] ?? "";
      const next = `${lead}${value}${trail}`;
      written.current.set(node, next);
      if (node.data !== next) node.data = next;
    };

    const visit = (node: Text) => {
      if (node.parentElement?.closest(SKIP)) return;
      // A value we did not write is fresh English from React: it becomes the node's source.
      if (written.current.get(node) !== node.data) sources.current.set(node, node.data.trim());
      const source = sources.current.get(node);
      if (!source) return;
      if (lang === "en") return write(node, source);
      if (!worthTranslating(source)) return;
      const hit = cache[source];
      if (hit) return write(node, hit);
      const set = waiting.get(source) ?? new Set<Text>();
      set.add(node);
      waiting.set(source, set);
      timer ??= setTimeout(flush, 60);
    };

    const scan = (start: Node) => {
      if (start.nodeType === Node.TEXT_NODE) return visit(start as Text);
      if (!(start instanceof Element) || start.closest(SKIP)) return;
      const walker = document.createTreeWalker(start, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) visit(n as Text);
      if (lang !== "en") {
        start.querySelectorAll<HTMLInputElement>("input[placeholder]").forEach((input) => {
          const src = input.dataset.gaiPh ?? input.placeholder;
          input.dataset.gaiPh = src;
          if (cache[src]) input.placeholder = cache[src];
        });
      } else {
        start.querySelectorAll<HTMLInputElement>("input[data-gai-ph]").forEach((input) => (input.placeholder = input.dataset.gaiPh ?? input.placeholder));
      }
    };

    const flush = async () => {
      timer = undefined;
      if (stopped || !waiting.size) return;
      const batch: string[] = [];
      let chars = 0;
      for (const s of waiting.keys()) {
        if (batch.length >= BATCH_TEXTS || chars + s.length > BATCH_CHARS) break;
        batch.push(s);
        chars += s.length;
      }
      const nodes = batch.map((s) => waiting.get(s) ?? new Set<Text>());
      batch.forEach((s) => waiting.delete(s));
      onStatus?.("working");
      try {
        const res = await fetch("/api/google-ai/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang, texts: batch }) });
        const data = (await res.json()) as { translations?: string[]; translated?: boolean };
        if (!res.ok || !data.translations || data.translated === false) throw new Error("unavailable");
        if (stopped) return;
        batch.forEach((s, i) => {
          const t = data.translations?.[i] || s;
          cache[s] = t;
          nodes[i].forEach((n) => sources.current.get(n) === s && write(n, t));
        });
        try {
          localStorage.setItem(`gai-tr-${lang}`, JSON.stringify(Object.fromEntries(Object.entries(cache).slice(-1500))));
        } catch {
          /* storage full or unavailable: translation still works for this visit */
        }
      } catch {
        failed = true;
      }
      if (waiting.size && !failed) timer = setTimeout(flush, 40);
      else onStatus?.(failed ? "unavailable" : "idle");
    };

    scan(el);
    if (lang === "en") onStatus?.("idle");
    const observer = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "characterData") scan(r.target);
        else r.addedNodes.forEach(scan);
      }
    });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
    return () => {
      stopped = true;
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [lang, root, onStatus]);

  return null;
}
