"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Route } from "lucide-react";
import { ARCHIVE_LINKS, CATALOG, FEATURED, PORTFOLIO_UPDATED } from "@/lib/home/catalog";
import HomeSearch from "@/components/home/HomeSearch";
import AppsGrid from "@/components/home/AppsGrid";
import Squircle from "@/components/home/Squircle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#202124] dark:bg-[#0f172a] dark:text-[#e8eaed]">
      {/* Top bar */}
      <header className="flex items-center justify-end gap-1 px-4 py-3 sm:px-6">
        <Link
          href="/router"
          prefetch={false}
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-[#5f6368] transition-colors hover:bg-[#f1f3f4] dark:text-[#e8eaed] dark:hover:bg-white/10"
        >
          <Route size={15} />
          <span className="hidden sm:inline">Routing policy</span>
        </Link>
        <AppsGrid />
      </header>

      {/* Centre stage */}
      <main className="flex flex-1 flex-col items-center px-4 pt-[9vh] sm:pt-[13vh]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-7 text-center"
        >
          <h1 className="text-[44px] font-semibold leading-none tracking-[-0.03em] sm:text-[64px]">
            <span className="text-[#1A73E8]">AI</span>{" "}
            <span className="text-[#202124] dark:text-[#e8eaed]">Tokenomics</span>
          </h1>
          <p className="mt-3 text-[13px] text-[#70757a] dark:text-[#9aa0a6]">
            Right model · Right task · Across the lifecycle
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="flex w-full justify-center"
        >
          <HomeSearch />
        </motion.div>

        {/* Most visited */}
        <motion.nav
          aria-label="Most visited"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="mt-10 grid w-full max-w-[720px] grid-cols-4 gap-y-6 sm:mt-12 sm:grid-cols-8 sm:gap-x-1"
        >
          {FEATURED.map((item) => {
            const inner = (
              <>
                <Squircle item={item} size={56} />
                <span className="line-clamp-2 text-center text-[12px] leading-tight text-[#3c4043] dark:text-[#bdc1c6]">
                  {item.short ?? item.name}
                </span>
              </>
            );
            const cls = "group flex flex-col items-center gap-2 rounded-xl px-1 py-2 transition-colors hover:bg-[#f8f9fa] dark:hover:bg-white/[0.05]";
            return item.external ? (
              <a key={item.id} href={item.href} className={cls}>{inner}</a>
            ) : (
              <Link key={item.id} href={item.href} className={cls}>{inner}</Link>
            );
          })}
        </motion.nav>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8eaed] bg-[#f2f2f2] text-[13px] text-[#70757a] dark:border-[#3c4043] dark:bg-[#111827] dark:text-[#9aa0a6]">
        <div className="flex flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {ARCHIVE_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-[#202124] dark:hover:text-[#e8eaed]">
                {l.label}
              </a>
            ))}
          </div>
          <div className="text-[12px]">
            {CATALOG.length} experiences · updated {PORTFOLIO_UPDATED}
          </div>
        </div>
      </footer>
    </div>
  );
}
