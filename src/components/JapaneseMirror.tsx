"use client";

import { useEffect, useSyncExternalStore } from "react";
import { englishUrl, isJapaneseSite } from "@/lib/i18n";

const CACHE_KEY = "ai-tokenomics-ja-v3";
const BATCH_SIZE = 96;

const immediateTranslations: Record<string, string> = {
  "AI Tokenomics": "AIトークノミクス",
  "Right model · Right task · Across the lifecycle": "適切なモデル・適切なタスク・ライフサイクル全体で最適化",
  Home: "ホーム",
  "Seller Mode": "セラーモード",
  Build: "構築",
  Run: "運用",
  Extend: "拡張",
  Summary: "サマリー",
  Reset: "リセット",
  "Best Value": "最適な価値",
  "Annual Savings": "年間削減額",
  "Total Savings": "総削減額",
};

function loadCache() {
  try {
    const value = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as Record<string, string>;
    return { ...immediateTranslations, ...value };
  } catch {
    return { ...immediateTranslations };
  }
}

function shouldTranslate(text: string) {
  if (text.length < 2 || text.length > 4_000 || !/[A-Za-z]/.test(text)) return false;
  if (/^[\d\s$€£¥.,:%+×/()\-–—]+$/.test(text)) return false;
  if (/^(Opus|Sonnet|Gemini|Flash|Flash-Lite|GEAP|ShopOS|PulseAI|CivicOS|FactoryOS|WealthAI|SignalOS)$/i.test(text)) return false;
  return true;
}

function controlAncestor(node: Node) {
  return node.parentElement?.closest("[data-ja-mirror-control], script, style, noscript, code, pre, textarea");
}

const subscribeToHost = () => () => undefined;
const getServerLocale = () => false;
const getBrowserLocale = () =>
  isJapaneseSite(window.location.hostname, window.location.search);

export default function JapaneseMirror({ children }: { children: React.ReactNode }) {
  const enabled = useSyncExternalStore(subscribeToHost, getBrowserLocale, getServerLocale);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.lang = "ja";
    const cache = loadCache();
    const translatedNodes = new WeakMap<Text, string>();
    const waiting = new Map<string, Set<Text>>();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    const handleInternalNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const target = event.target;
      const anchor = target instanceof Element ? target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      const sameDocument =
        destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search;

      if (destination.origin !== window.location.origin || sameDocument) return;

      event.preventDefault();
      event.stopPropagation();
      window.location.assign(destination.href);
    };

    document.addEventListener("click", handleInternalNavigation, true);

    const remember = () => {
      try {
        const entries = Object.entries(cache).slice(-1_200);
        localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
      } catch {
        // Translation still works when storage is unavailable.
      }
    };

    const apply = (node: Text, source: string, translated: string) => {
      if (node.data.trim() !== source || stopped) return;
      const leading = node.data.match(/^\s*/)?.[0] ?? "";
      const trailing = node.data.match(/\s*$/)?.[0] ?? "";
      const nextValue = `${leading}${translated}${trailing}`;
      translatedNodes.set(node, nextValue);
      node.data = nextValue;
    };

    const flush = async () => {
      timer = undefined;
      const sources = [...waiting.keys()].slice(0, BATCH_SIZE);
      if (!sources.length) return;

      const nodeGroups = sources.map((source) => waiting.get(source) ?? new Set<Text>());
      sources.forEach((source) => waiting.delete(source));

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: sources }),
        });
        if (!response.ok) throw new Error("translation unavailable");
        const payload = (await response.json()) as { translations?: string[] };
        sources.forEach((source, index) => {
          const translated = payload.translations?.[index] || source;
          cache[source] = translated;
          nodeGroups[index].forEach((node) => apply(node, source, translated));
        });
        remember();
      } catch {
        sources.forEach((source, index) => {
          nodeGroups[index].forEach((node) => apply(node, source, cache[source] ?? source));
        });
      }

      if (waiting.size) timer = setTimeout(flush, 40);
    };

    const queue = (node: Text) => {
      if (controlAncestor(node) || translatedNodes.get(node) === node.data) return;
      const source = node.data.trim();
      if (!shouldTranslate(source)) return;

      const cached = cache[source];
      if (cached) {
        apply(node, source, cached);
        return;
      }

      const nodes = waiting.get(source) ?? new Set<Text>();
      nodes.add(node);
      waiting.set(source, nodes);
      if (!timer) timer = setTimeout(flush, 40);
    };

    const scan = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) {
        queue(root as Text);
        return;
      }
      if (!(root instanceof Element) || root.closest("[data-ja-mirror-control]")) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let current = walker.nextNode();
      while (current) {
        queue(current as Text);
        current = walker.nextNode();
      }
    };

    scan(document.body);
    if (shouldTranslate(document.title)) {
      const titleNode = document.head.querySelector("title")?.firstChild;
      if (titleNode?.nodeType === Node.TEXT_NODE) queue(titleNode as Text);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") scan(mutation.target);
        mutation.addedNodes.forEach(scan);
      });
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });

    return () => {
      stopped = true;
      document.removeEventListener("click", handleInternalNavigation, true);
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [enabled]);

  return (
    <>
      {children}
      {enabled && (
        <aside
          data-ja-mirror-control
          className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/90 px-3 py-2 text-[11px] font-semibold text-white shadow-xl backdrop-blur-md"
          aria-label="Language selection"
        >
          <span>日本語・自動翻訳</span>
          <span className="text-white/35">|</span>
          <a
            href={englishUrl(
              typeof window === "undefined" ? "/" : window.location.pathname,
              typeof window === "undefined" ? "" : window.location.search,
            )}
            className="text-blue-300 transition-colors hover:text-blue-200"
          >
            English
          </a>
        </aside>
      )}
    </>
  );
}
