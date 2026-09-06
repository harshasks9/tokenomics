"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PUBLIC_ITEMS, SECTIONS, SECTION_LABEL } from "@/lib/home/catalog";
import Squircle from "./Squircle";

function GridGlyph() {
  return (
    <span className="grid grid-cols-3 gap-[3px]" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className="h-[4px] w-[4px] rounded-full bg-current" />
      ))}
    </span>
  );
}

export default function AppsGrid() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label="All experiences"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-10 w-10 items-center justify-center rounded-full text-[#5f6368] transition-colors hover:bg-[#f1f3f4] dark:text-[#e8eaed] dark:hover:bg-white/10 ${
          open ? "bg-[#f1f3f4] dark:bg-white/10" : ""
        }`}
      >
        <GridGlyph />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="All experiences"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-12 z-40 w-[min(92vw,420px)] max-h-[min(78vh,640px)] overflow-y-auto rounded-2xl border border-[#dadce0] bg-white p-4 shadow-[0_8px_28px_rgba(32,33,36,0.22)] dark:border-[#3c4043] dark:bg-[#1f2937] dark:shadow-[0_8px_28px_rgba(0,0,0,0.6)]"
          >
            {SECTIONS.map((section) => {
              const items = PUBLIC_ITEMS.filter((i) => i.section === section);
              if (!items.length) return null;
              return (
                <section key={section} className="mb-4 last:mb-0">
                  <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-[#70757a] dark:text-[#9aa0a6]">
                    {SECTION_LABEL[section]}
                  </h3>
                  <div className="grid grid-cols-3 gap-1">
                    {items.map((item) => {
                      const inner = (
                        <>
                          <Squircle item={item} size={48} />
                          <span className="line-clamp-2 text-center text-[12px] leading-tight text-[#202124] dark:text-[#e8eaed]">
                            {item.name}
                          </span>
                        </>
                      );
                      const cls =
                        "group flex flex-col items-center gap-2 rounded-xl px-2 py-3 transition-colors hover:bg-[#f1f3f4] dark:hover:bg-white/[0.06]";
                      return item.external ? (
                        <a key={item.id} href={item.href} className={cls}>{inner}</a>
                      ) : (
                        <Link key={item.id} href={item.href} prefetch={false} className={cls}>{inner}</Link>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
