import Link from "next/link";
import { ArrowRight, Network } from "lucide-react";

export default function AgentEconomicsCta() {
  return (
    <Link href="/agent-economics" className="group mb-8 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-emerald-50 p-5 transition hover:border-blue-300 hover:shadow-sm sm:flex-row sm:items-center">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-600 text-white"><Network size={19} /></span>
      <span className="flex-1"><span className="block text-sm font-extrabold text-slate-900">Move from model savings to enterprise agent economics</span><span className="mt-1 block text-xs leading-relaxed text-slate-600">Define the agent estate, reveal its required production stack, and compare integrated versus assembled delivery.</span></span>
      <span className="flex items-center gap-2 text-xs font-bold text-blue-700">Open analysis<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" /></span>
    </Link>
  );
}
