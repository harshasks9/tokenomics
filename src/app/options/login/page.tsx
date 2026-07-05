import type { Metadata } from "next";
import { isOptionsAuthRequired, isOptionsGateConfigured } from "@/lib/options/auth";

export const metadata: Metadata = {
  title: "Options Screener Login",
};

export default async function OptionsLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-5 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[.06] p-7 shadow-2xl backdrop-blur-md">
        <div className="mb-7 inline-flex rounded-full bg-cyan-400 px-3 py-1 text-xs font-black uppercase tracking-[.16em] text-slate-950">
          Read-only screener
        </div>
        <h1 className="text-3xl font-black tracking-[-.04em]">Options screener access</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          This password gate protects the owner&apos;s FMP and Polygon API quotas. The app ranks candidates only; it never places, sizes, routes, or simulates trades.
        </p>
        {!isOptionsGateConfigured() && (
          <p className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            {isOptionsAuthRequired()
              ? "APP_PASSWORD is required in production but is not configured. Access is locked until the variable is set."
              : "APP_PASSWORD is not configured, so local access is open. Configure APP_PASSWORD in production."}
          </p>
        )}
        {params.error && (
          <p className="mt-4 rounded-2xl border border-red-300/30 bg-red-300/10 p-4 text-sm text-red-100">
            Incorrect password. Try again.
          </p>
        )}
        <form action="/api/options/login" method="post" className="mt-7 space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block text-sm font-bold text-white/80" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none ring-cyan-300 transition placeholder:text-white/30 focus:ring-2"
            placeholder="Enter APP_PASSWORD"
          />
          <button className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300">
            Open screener
          </button>
        </form>
        <p className="mt-6 text-xs leading-5 text-white/35">Not investment advice. Execute elsewhere after independent review.</p>
      </div>
    </main>
  );
}
