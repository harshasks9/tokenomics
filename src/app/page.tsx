"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Heart,
  Landmark,
  Factory,
  Wifi,
  FlaskConical,
  Home,
  Eye,
  Layers,
  Scale,
  Activity,
  LineChart,
  Cpu,
  ShieldCheck,
  Banknote,
  Building2,
  ShoppingCart,
  Zap,
  Globe,
  MapPin,
  Umbrella,
  Mic,
  GraduationCap,
  School,
  Rocket,
  Plane,
  FileText,
  Network,
  Newspaper,
  ArrowRightLeft,
  Store,
} from "lucide-react";
import PolicyRouter from "@/components/router/PolicyRouter";

/** Homepage last reorganized/audited — bump when the portfolio changes. */
const PORTFOLIO_UPDATED = "Aug 23, 2026";

const industries = [
  {
    id: "wealthai",
    name: "WealthAI",
    href: "/wealthai",
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)",
    roiTeaser: "42% build · 47% query savings",
    enabled: true,
  },
  {
    id: "shopos",
    name: "ShopOS",
    href: "/shopos",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #188038 0%, #34A853 100%)",
    roiTeaser: "58% build savings · 3-tier routing",
    enabled: true,
  },
  {
    id: "pulseai",
    name: "PulseAI",
    href: "/pulseai",
    icon: Heart,
    gradient: "linear-gradient(135deg, #E11D48 0%, #FB7185 100%)",
    roiTeaser: "38% build savings · clinical-safe",
    enabled: true,
  },
  {
    id: "civicos",
    name: "CivicOS",
    href: "/civicos",
    icon: Landmark,
    gradient: "linear-gradient(135deg, #312E81 0%, #4F46E5 100%)",
    roiTeaser: "56% build · 77% query savings",
    enabled: true,
  },
  {
    id: "factoryos",
    name: "FactoryOS",
    href: "/factoryos",
    icon: Factory,
    gradient: "linear-gradient(135deg, #92400e 0%, #E37400 100%)",
    roiTeaser: "63% build savings · floor-safe",
    enabled: true,
  },
  {
    id: "signalos",
    name: "SignalOS",
    href: "/signalos",
    icon: Wifi,
    gradient: "linear-gradient(135deg, #075985 0%, #0284C7 100%)",
    roiTeaser: "52% build savings · network automation",
    enabled: true,
  },
  {
    id: "research-economics",
    name: "Research Economics",
    href: "/research-economics",
    icon: FlaskConical,
    gradient: "linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)",
    roiTeaser: "Lean Frontier routing · Opus where it reasons",
    enabled: true,
  },
];

const accountSites = [
  {
    id: "mizubank",
    name: "MizuBank",
    href: "/mizubank",
    icon: Banknote,
    gradient: "linear-gradient(135deg, #0f3057 0%, #00587a 100%)",
    roiTeaser: "Bilingual banking AI · build/run/agent economics",
    enabled: true,
  },
  {
    id: "samgico",
    name: "SamgiCo",
    href: "/samgico",
    icon: Building2,
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    roiTeaser: "Conglomerate-wide routing economics",
    enabled: true,
  },
  {
    id: "ausretail",
    name: "AusRetail",
    href: "/ausretail",
    icon: ShoppingCart,
    gradient: "linear-gradient(135deg, #9a3412 0%, #f59e0b 100%)",
    roiTeaser: "AU retail · build/run/agent scenarios",
    enabled: true,
  },
  {
    id: "blinkmart",
    name: "BlinkMart",
    href: "/blinkmart",
    icon: Zap,
    gradient: "linear-gradient(135deg, #7c2d12 0%, #facc15 100%)",
    roiTeaser: "Quick-commerce economics at delivery speed",
    enabled: true,
  },
  {
    id: "citizensai",
    name: "CitizensAI",
    href: "/citizensai",
    icon: Globe,
    gradient: "linear-gradient(135deg, #14532d 0%, #22c55e 100%)",
    roiTeaser: "Public-sector service AI economics",
    enabled: true,
  },
  {
    id: "korea",
    name: "Global Sae-A",
    href: "/korea",
    icon: MapPin,
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #38bdf8 100%)",
    roiTeaser: "The allocation advantage · Korea",
    enabled: true,
  },
  {
    id: "prudential",
    name: "Prudential",
    href: "/prudential",
    icon: Umbrella,
    gradient: "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)",
    roiTeaser: "The agentic insurer",
    enabled: true,
  },
  {
    id: "voice",
    name: "Frontline",
    href: "/voice",
    icon: Mic,
    gradient: "linear-gradient(135deg, #312e81 0%, #818cf8 100%)",
    roiTeaser: "Gemini Enterprise Frontline · 200+ account views",
    enabled: true,
  },
  {
    id: "onedesk",
    name: "One Desk",
    href: "/onedesk",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, #713f12 0%, #eab308 100%)",
    roiTeaser: "Agentic front office · higher education",
    enabled: true,
  },
  {
    id: "campus",
    name: "Campus",
    href: "/campus",
    icon: School,
    gradient: "linear-gradient(135deg, #134e4a 0%, #2dd4bf 100%)",
    roiTeaser: "One queue for every campus request",
    enabled: true,
  },
  {
    id: "natives",
    name: "Digital Natives",
    href: "/natives",
    icon: Rocket,
    gradient: "linear-gradient(135deg, #581c87 0%, #c084fc 100%)",
    roiTeaser: "Agentic communications · India digital natives",
    enabled: true,
  },
  {
    id: "data",
    name: "Airport Data",
    href: "/data",
    icon: Plane,
    gradient: "linear-gradient(135deg, #1e293b 0%, #64748b 100%)",
    roiTeaser: "Data strategy for agentic airport ops",
    enabled: true,
  },
  {
    id: "smc",
    name: "SMC Brief",
    href: "/smc",
    icon: FileText,
    gradient: "linear-gradient(135deg, #334155 0%, #94a3b8 100%)",
    roiTeaser: "Executive AI brief",
    enabled: true,
  },
  {
    id: "agent-economics",
    name: "Agent Economics",
    href: "/agent-economics",
    icon: Network,
    gradient: "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
    roiTeaser: "Enterprise agent decision framework",
    enabled: true,
  },
  {
    id: "iras",
    name: "IRAS",
    href: "/iras",
    icon: Landmark,
    gradient: "linear-gradient(135deg, #0B1F3A 0%, #1A73E8 100%)",
    roiTeaser: "AI for the modern tax authority · optionality at every layer",
    enabled: true,
  },
];

const modelComparisons = [
  {
    id: "glm-vs-gemini",
    name: "GLM vs Gemini",
    href: "/glm-vs-gemini",
    icon: Scale,
    gradient: "linear-gradient(135deg, #4285F4 0%, #B45309 100%)",
    roiTeaser: "Price per token vs cost per task",
    enabled: true,
    external: true,
  },
  {
    id: "earnings",
    name: "EARNINGS",
    href: "/earnings",
    icon: LineChart,
    gradient: "linear-gradient(135deg, #003153 0%, #0F766E 100%)",
    roiTeaser: "Model-as-a-Service intelligence · Feb–Aug 2026",
    enabled: true,
  },
  {
    id: "fsi",
    name: "FSI Hub",
    href: "/fsi",
    icon: Landmark,
    gradient: "linear-gradient(135deg, #175E40 0%, #46608C 100%)",
    roiTeaser: "FSI evidence register · internal",
    enabled: true,
  },
  {
    id: "modelcomp",
    name: "MODELCOMP",
    href: "/modelcomp",
    icon: Activity,
    gradient: "linear-gradient(135deg, #16324F 0%, #4285F4 100%)",
    roiTeaser: "12 months of frontier · gap 7 pts since 3.7 Flash",
    enabled: true,
  },
  {
    id: "finops",
    name: "FrontierOps",
    href: "/finops",
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #1c5cab 0%, #5598e7 100%)",
    roiTeaser: "Multi-cloud AI FinOps · Pareto frontier gap",
    enabled: true,
  },
  {
    id: "llm-landscape",
    name: "LLM LANDSCAPE",
    href: "/llm-landscape",
    icon: Layers,
    gradient: "linear-gradient(135deg, #0B0E14 0%, #4285F4 100%)",
    roiTeaser: "2022–2026 model evolution · honest Google equivalence",
    enabled: true,
  },
  {
    id: "governance",
    name: "GOVERNANCE",
    href: "/governance",
    icon: ShieldCheck,
    gradient: "linear-gradient(135deg, #16324F 0%, #188038 100%)",
    roiTeaser: "AI governance field guide · 7 layers, 3 depths",
    enabled: true,
  },
  {
    id: "store",
    name: "AI DEPARTMENT STORE",
    href: "/store",
    icon: Store,
    gradient: "linear-gradient(135deg, #153a2f 0%, #b8894a 100%)",
    roiTeaser: "Don't bet on the winning model · pick the right store",
    enabled: true,
  },
  {
    id: "harness",
    name: "HARNESS CHOICE",
    href: "/harness",
    icon: Cpu,
    gradient: "linear-gradient(135deg, #0c1220 0%, #1a73e8 100%)",
    roiTeaser: "Model × Harness × Context · cost per successful task",
    enabled: true,
  },
  {
    id: "brief",
    name: "AI Daily Brief",
    href: "/brief",
    icon: Newspaper,
    gradient: "linear-gradient(135deg, #172554 0%, #2563eb 100%)",
    roiTeaser: "Top 10 AI news · refreshed daily by cron",
    enabled: true,
  },
  {
    id: "gemini25",
    name: "Gemini Migration",
    href: "/gemini25",
    icon: ArrowRightLeft,
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #34A853 100%)",
    roiTeaser: "2.5 sunset playbook · 3.x pricing shift",
    enabled: true,
  },
  {
    id: "geminiplus",
    name: "Gemini Plus",
    href: "/gemini-plus",
    icon: Layers,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
    roiTeaser: "100% credit offset · Value Map",
    enabled: true,
  },
];

type TileItem = {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  gradient: string;
  roiTeaser: string;
  enabled: boolean;
  external?: boolean;
};

function SquircleIcon({
  item,
  index,
  sellerMode,
}: {
  item: TileItem;
  index: number;
  sellerMode: boolean;
}) {
  const Icon = item.icon;

  const tile = (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.15 + index * 0.08,
        type: "spring",
        stiffness: 300,
        damping: 22,
      }}
      whileHover={item.enabled ? { scale: 1.08, y: -4 } : undefined}
      whileTap={item.enabled ? { scale: 0.92 } : undefined}
      className={`flex flex-col items-center gap-3 group ${item.enabled ? "" : "opacity-45 cursor-not-allowed"}`}
    >
      <div
        className="w-[80px] h-[80px] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200"
        style={{ borderRadius: "22.37%", background: item.gradient, border: "1.5px solid rgba(255,255,255,0.15)" }}
      >
        <Icon size={32} className="text-white" strokeWidth={1.5} />
      </div>
      <span className="text-[13px] font-semibold text-white/85">{item.name}</span>
      {!item.enabled && (
        <span className="-mt-2 text-[9px] font-bold uppercase tracking-wider text-white/40">
          Coming soon
        </span>
      )}
      {sellerMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-[10px] font-medium text-emerald-400/80 -mt-1 text-center max-w-[90px] leading-tight"
        >
          {item.roiTeaser}
        </motion.div>
      )}
    </motion.div>
  );

  return item.enabled ? (
    item.external ? (
      <a href={item.href} className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/50">
        {tile}
      </a>
    ) : (
      <Link href={item.href} className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/50">
        {tile}
      </Link>
    )
  ) : (
    <div aria-disabled="true" title={`${item.name} is coming soon`}>
      {tile}
    </div>
  );
}

export default function SpringboardHome() {
  const [sellerMode, setSellerMode] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 70%, #1a2332 100%)" }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-8"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 pt-14 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
          AI Tokenomics
        </h1>
        <p className="text-xs text-white/35 font-medium tracking-wide uppercase">
          Right model · Right task · Across the lifecycle
        </p>
      </motion.div>

      <div className="z-10 mb-12 flex w-full justify-center px-4 sm:px-8">
        <PolicyRouter />
      </div>

      <div className="z-10 px-8 flex flex-col items-center gap-12 mb-10">
        {/* Industry Showcases */}
        <div className="flex flex-col items-center gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1"
          >
            Industry Showcases
          </motion.p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-12 max-w-4xl">
            {industries.map((ind, i) => (
              <SquircleIcon key={ind.id} item={ind} index={i} sellerMode={sellerMode} />
            ))}
          </div>
        </div>

        {/* Model & Market Intelligence */}
        <div className="flex flex-col items-center gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1"
          >
            Model &amp; Market Intelligence
          </motion.p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-12 max-w-5xl">
            {modelComparisons.map((item, i) => (
              <SquircleIcon key={item.id} item={item} index={industries.length + i} sellerMode={sellerMode} />
            ))}
          </div>
        </div>

        {/* Account & Regional Microsites */}
        <div className="flex flex-col items-center gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1"
          >
            Account &amp; Regional Microsites
          </motion.p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-12 max-w-5xl">
            {accountSites.map((item, i) => (
              <SquircleIcon
                key={item.id}
                item={item}
                index={industries.length + modelComparisons.length + i}
                sellerMode={sellerMode}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Archive — static one-off artifacts, kept reachable but not promoted */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="z-10 mb-6"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Archive</span>
          {[
            { href: "/deck/index.html", label: "Exec deck" },
            { href: "/strategy", label: "Strategy one-pager" },
            { href: "/agentic/index.html", label: "Agentic explainer" },
            { href: "/agents/index.html", label: "Agents overview" },
            { href: "/casestudies/index.html", label: "Case studies" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] text-white/25 hover:text-white/60 transition-colors tracking-wide"
            >
              {l.label} &rarr;
            </a>
          ))}
        </div>
      </motion.div>

      {/* Portfolio stamp */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="z-10 mb-24 text-[10px] text-white/20 tracking-wide"
      >
        {industries.length + modelComparisons.length + accountSites.length} experiences · portfolio
        updated {PORTFOLIO_UPDATED}
      </motion.p>

      {/* Dock */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div
          className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/10"
          style={{
            background: "rgba(30, 41, 59, 0.65)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
            <Home size={13} className="text-white/90" />
            <span className="text-xs font-semibold text-white/90">Home</span>
          </div>

          <div className="w-px h-5 bg-white/10" />

          <button
            onClick={() => setSellerMode(!sellerMode)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              sellerMode ? "bg-emerald-500/20 text-emerald-400" : "text-white/45 hover:text-white/70"
            }`}
          >
            <Eye size={13} />
            <span className="text-xs font-semibold">Seller Mode</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
