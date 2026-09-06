"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { searchCatalog, SECTION_LABEL, type CatalogItem } from "@/lib/home/catalog";
import Squircle from "./Squircle";

function go(router: ReturnType<typeof useRouter>, item: CatalogItem) {
  if (item.external) window.location.assign(item.href);
  else router.push(item.href);
}

export default function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => searchCatalog(query), [query]);


  // "/" focuses the search box from anywhere on the page, like most launchers.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        const tag = (document.activeElement as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showList = open && results.length > 0;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { const r = results[active] ?? results[0]; if (r) go(router, r); }
    else if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
  };

  return (
    <div className="relative w-full max-w-[584px]">
      <div
        className={`flex items-center gap-3 rounded-full border bg-white px-5 py-3 transition-shadow dark:bg-[#1f2937]
          ${showList
            ? "rounded-b-none border-transparent shadow-[0_1px_6px_rgba(32,33,36,0.28)] dark:shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
            : "border-[#dfe1e5] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] dark:border-[#3c4043] dark:hover:shadow-[0_1px_6px_rgba(0,0,0,0.6)]"}`}
      >
        <Search size={18} className="flex-none text-[#9aa0a6]" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Search experiences"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search industries, models, playbooks…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-[16px] text-[#202124] outline-none placeholder:text-[#9aa0a6] dark:text-[#e8eaed]
            [&::-webkit-search-cancel-button]:appearance-none"
        />
        <kbd className="hidden rounded border border-[#dfe1e5] px-1.5 py-0.5 font-mono text-[10px] text-[#9aa0a6] sm:inline dark:border-[#3c4043]">/</kbd>
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 overflow-hidden rounded-b-3xl border border-t-0 border-transparent bg-white pb-2 shadow-[0_4px_6px_rgba(32,33,36,0.28)] dark:bg-[#1f2937] dark:shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
        >
          <li aria-hidden className="mx-5 mb-1 border-t border-[#e8eaed] dark:border-[#3c4043]" />
          {results.map((item, i) => (
            <li
              key={item.id}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(router, item)}
              className={`group flex cursor-pointer items-center gap-3 px-4 py-2 ${
                i === active ? "bg-[#f1f3f4] dark:bg-white/[0.06]" : ""
              }`}
            >
              <Squircle item={item} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-[15px] text-[#202124] dark:text-[#e8eaed]">{item.name}</span>
                  <span className="flex-none text-[11px] text-[#70757a] dark:text-[#9aa0a6]">
                    {item.audience === "account" ? "Account" : SECTION_LABEL[item.section]}
                  </span>
                </div>
                <div className="truncate text-[12px] text-[#70757a] dark:text-[#9aa0a6]">{item.blurb}</div>
              </div>
              {i === active && <CornerDownLeft size={14} className="flex-none text-[#9aa0a6]" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
