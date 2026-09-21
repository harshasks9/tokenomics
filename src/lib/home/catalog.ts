import type { LucideIcon } from "lucide-react";
import {
  TrendingUp, ShoppingBag, Heart, Landmark, Factory, Wifi, FlaskConical, Layers, Scale,
  Activity, LineChart, Cpu, ShieldCheck, Banknote, Building2, ShoppingCart, Zap, Globe,
  MapPin, Umbrella, Mic, GraduationCap, School, Rocket, Plane, FileText, Network, Newspaper,
  ArrowRightLeft, Store, Route,
} from "lucide-react";

/** Homepage last reorganized/audited — bump when the portfolio changes. */
export const PORTFOLIO_UPDATED = "Sep 7, 2026";

export type Section = "industries" | "intelligence" | "playbooks";

/**
 * public  — safe for anyone landing on aitokenomics.app/: shown in shortcuts, grid and search.
 * account — named-customer or internal material: reachable by search or its own subdomain only.
 */
export type Audience = "public" | "account";

export interface CatalogItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  /** One neutral line, no seller framing. */
  blurb: string;
  section: Section;
  audience: Audience;
  keywords: string[];
  /** Shorter label for the tight shortcut row; falls back to name. */
  short?: string;
  /** Position in the "most visited" shortcut row (1 = first). Derived from Vercel route counts, Sep 2026. */
  featured?: number;
  /** Static asset outside the App Router — needs a hard <a>. */
  external?: boolean;
}

export const SECTION_LABEL: Record<Section, string> = {
  industries: "Industry showcases",
  intelligence: "Models & markets",
  playbooks: "Playbooks",
};

export const CATALOG: CatalogItem[] = [
  // Industry showcases
  { id: "wealthai", name: "WealthAI", href: "/wealthai", icon: TrendingUp, section: "industries", audience: "public",
    gradient: "linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)",
    blurb: "Wealth management — build, run and agent economics", keywords: ["finance", "wealth", "advisor", "bank"] },
  { id: "shopos", name: "ShopOS", href: "/shopos", icon: ShoppingBag, section: "industries", audience: "public",
    gradient: "linear-gradient(135deg, #188038 0%, #34A853 100%)",
    blurb: "Retail commerce — three-tier model routing", keywords: ["retail", "ecommerce", "shop", "commerce"] },
  { id: "pulseai", name: "PulseAI", href: "/pulseai", icon: Heart, section: "industries", audience: "public",
    gradient: "linear-gradient(135deg, #E11D48 0%, #FB7185 100%)",
    blurb: "Healthcare — clinical-safe routing economics", keywords: ["healthcare", "clinical", "hospital", "medical"] },
  { id: "civicos", name: "CivicOS", href: "/civicos", icon: Landmark, section: "industries", audience: "public",
    gradient: "linear-gradient(135deg, #312E81 0%, #4F46E5 100%)",
    blurb: "Public sector — citizen services at scale", keywords: ["government", "public sector", "civic", "citizen"] },
  { id: "factoryos", name: "FactoryOS", href: "/factoryos", icon: Factory, section: "industries", audience: "public",
    gradient: "linear-gradient(135deg, #92400e 0%, #E37400 100%)",
    blurb: "Manufacturing — floor-safe routing", keywords: ["manufacturing", "factory", "industrial", "plant"] },
  { id: "signalos", name: "SignalOS", href: "/signalos", icon: Wifi, section: "industries", audience: "public",
    gradient: "linear-gradient(135deg, #075985 0%, #0284C7 100%)",
    blurb: "Telecom — network automation economics", keywords: ["telecom", "telco", "network", "5g"] },
  { id: "research-economics", name: "Research Economics", href: "/research-economics", icon: FlaskConical, section: "industries", audience: "public",
    gradient: "linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)",
    blurb: "Research workloads — frontier routing where it reasons", keywords: ["research", "science", "lab", "r&d"] },

  // Models & markets
  { id: "store", name: "AI Department Store", short: "Department Store", href: "/store", icon: Store, section: "intelligence", audience: "public", featured: 1,
    gradient: "linear-gradient(135deg, #153a2f 0%, #b8894a 100%)",
    blurb: "Pick the right store, not the winning model", keywords: ["platform", "choice", "vendor", "department store"] },
  { id: "governance", name: "Governance", href: "/governance", icon: ShieldCheck, section: "intelligence", audience: "public", featured: 2,
    gradient: "linear-gradient(135deg, #16324F 0%, #188038 100%)",
    blurb: "AI governance field guide — 7 layers, 3 depths", keywords: ["governance", "risk", "compliance", "policy", "security"] },
  { id: "harness", name: "Harness Choice", href: "/harness", icon: Cpu, section: "intelligence", audience: "public", featured: 3,
    gradient: "linear-gradient(135deg, #0c1220 0%, #1a73e8 100%)",
    blurb: "Model × harness × context — cost per successful task", keywords: ["harness", "agent framework", "coding agent", "claude code"] },
  { id: "llm-landscape", name: "LLM Landscape", href: "/llm-landscape", icon: Layers, section: "intelligence", audience: "public", featured: 4,
    gradient: "linear-gradient(135deg, #0B0E14 0%, #4285F4 100%)",
    blurb: "2022–2026 model evolution and equivalence", keywords: ["models", "landscape", "history", "benchmark", "timeline"] },
  { id: "finops", name: "FrontierOps", href: "/finops", icon: TrendingUp, section: "intelligence", audience: "public", featured: 5,
    gradient: "linear-gradient(135deg, #1c5cab 0%, #5598e7 100%)",
    blurb: "Multi-cloud AI FinOps — the Pareto frontier gap", keywords: ["finops", "cost", "cloud", "spend", "dashboard"] },
  { id: "earnings", name: "Earnings", href: "/earnings", icon: LineChart, section: "intelligence", audience: "public", featured: 6,
    gradient: "linear-gradient(135deg, #003153 0%, #0F766E 100%)",
    blurb: "Model-as-a-Service market intelligence", keywords: ["earnings", "market", "revenue", "maas", "quarterly"] },
  { id: "geminiplus", name: "Gemini Plus", href: "/gemini-plus", icon: Layers, section: "intelligence", audience: "public", featured: 7,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
    blurb: "Credit offset and value map", keywords: ["gemini", "credits", "offset", "value"] },
  { id: "brief", name: "AI Daily Brief", href: "/brief", icon: Newspaper, section: "intelligence", audience: "public", featured: 8,
    gradient: "linear-gradient(135deg, #172554 0%, #2563eb 100%)",
    blurb: "Top 10 AI news, refreshed daily", keywords: ["news", "daily", "brief", "headlines"] },
  { id: "modelcomp", name: "ModelComp", href: "/modelcomp", icon: Activity, section: "intelligence", audience: "public",
    gradient: "linear-gradient(135deg, #16324F 0%, #4285F4 100%)",
    blurb: "Twelve months of frontier model comparison", keywords: ["compare", "benchmark", "frontier", "gap"] },
  { id: "gemini25", name: "Gemini Migration", href: "/gemini25", icon: ArrowRightLeft, section: "intelligence", audience: "public",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #34A853 100%)",
    blurb: "2.5 sunset playbook and 3.x pricing shift", keywords: ["migration", "gemini 2.5", "sunset", "upgrade"] },
  { id: "glm-vs-gemini", name: "GLM vs Gemini", href: "/glm-vs-gemini", icon: Scale, section: "intelligence", audience: "public", external: true,
    gradient: "linear-gradient(135deg, #4285F4 0%, #B45309 100%)",
    blurb: "Price per token vs cost per task", keywords: ["glm", "zhipu", "comparison", "open weights"] },

  // Playbooks (segment-level, not a named customer)
  { id: "router", name: "Routing Policy", href: "/router", icon: Route, section: "playbooks", audience: "public",
    gradient: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
    blurb: "Interactive model-routing policy simulator", keywords: ["router", "policy", "routing", "simulator", "tiers"] },
  { id: "agent-economics", name: "Agent Economics", href: "/agent-economics", icon: Network, section: "playbooks", audience: "public",
    gradient: "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
    blurb: "Enterprise agent decision framework", keywords: ["agents", "tco", "platform", "decision"] },
  { id: "citizensai", name: "CitizensAI", href: "/citizensai", icon: Globe, section: "playbooks", audience: "public",
    gradient: "linear-gradient(135deg, #14532d 0%, #22c55e 100%)",
    blurb: "Public-service AI economics", keywords: ["citizens", "public service", "government"] },
  { id: "campus", name: "Campus", href: "/campus", icon: School, section: "playbooks", audience: "public",
    gradient: "linear-gradient(135deg, #134e4a 0%, #2dd4bf 100%)",
    blurb: "One queue for every campus request", keywords: ["university", "campus", "education", "front office"] },
  { id: "onedesk", name: "One Desk", href: "/onedesk", icon: GraduationCap, section: "playbooks", audience: "public",
    gradient: "linear-gradient(135deg, #713f12 0%, #eab308 100%)",
    blurb: "Agentic front office for higher education", keywords: ["higher education", "university", "desk"] },

  // Named accounts & internal — search only
  { id: "voice", name: "Frontline", href: "/voice", icon: Mic, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #312e81 0%, #818cf8 100%)",
    blurb: "Gemini Enterprise Frontline — account views", keywords: ["voice", "frontline", "communications", "accounts"] },
  { id: "fsi", name: "FSI Hub", href: "/fsi", icon: Landmark, section: "intelligence", audience: "account",
    gradient: "linear-gradient(135deg, #175E40 0%, #46608C 100%)",
    blurb: "Financial-services evidence register", keywords: ["fsi", "financial services", "evidence", "internal"] },
  { id: "iras", name: "IRAS", href: "/iras", icon: Landmark, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #0B1F3A 0%, #1A73E8 100%)",
    blurb: "AI for the modern tax authority", keywords: ["tax", "singapore", "revenue authority"] },
  { id: "mizubank", name: "MizuBank", href: "/mizubank", icon: Banknote, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #0f3057 0%, #00587a 100%)",
    blurb: "Bilingual banking AI economics", keywords: ["bank", "japan", "bilingual"] },
  { id: "samgico", name: "SamgiCo", href: "/samgico", icon: Building2, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    blurb: "Conglomerate-wide routing economics", keywords: ["conglomerate", "korea", "group"] },
  { id: "ausretail", name: "AusRetail", href: "/ausretail", icon: ShoppingCart, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #9a3412 0%, #f59e0b 100%)",
    blurb: "Australian retail scenarios", keywords: ["australia", "retail", "grocery"] },
  { id: "blinkmart", name: "BlinkMart", href: "/blinkmart", icon: Zap, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #7c2d12 0%, #facc15 100%)",
    blurb: "Quick-commerce economics at delivery speed", keywords: ["quick commerce", "delivery", "india"] },
  { id: "korea", name: "Global Sae-A", href: "/korea", icon: MapPin, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #38bdf8 100%)",
    blurb: "The allocation advantage — Korea", keywords: ["korea", "sae-a", "apparel"] },
  { id: "prudential", name: "Prudential", href: "/prudential", icon: Umbrella, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)",
    blurb: "The agentic insurer", keywords: ["insurance", "insurer", "prudential"] },
  { id: "natives", name: "Digital Natives", href: "/natives", icon: Rocket, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #581c87 0%, #c084fc 100%)",
    blurb: "Agentic communications for India digital natives", keywords: ["startups", "india", "digital natives"] },
  { id: "data", name: "Airport Data", href: "/data", icon: Plane, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #1e293b 0%, #64748b 100%)",
    blurb: "Data strategy for agentic airport operations", keywords: ["airport", "aviation", "data strategy"] },
  { id: "smc", name: "SMC Brief", href: "/smc", icon: FileText, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #334155 0%, #94a3b8 100%)",
    blurb: "Executive AI brief", keywords: ["smc", "executive brief"] },
  { id: "deal-check", name: "Deal Check", href: "/deal-check", icon: Scale, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #1c5cab 0%, #eb6834 100%)",
    blurb: "AWS MAP 2.0 vs Google Private Offer for an Anthropic workload", keywords: ["deal", "map", "private offer", "anthropic", "incentive", "credits", "calculator"] },
  { id: "mdes", name: "MDES Commitment Planner", href: "/mdes", icon: GraduationCap, section: "playbooks", audience: "account",
    gradient: "linear-gradient(135deg, #0b3d91 0%, #1a73e8 100%)",
    blurb: "Gemini Enterprise for EDU — $10.8M commitment ramp, GCP allocation and timeline planner", keywords: ["mdes", "thailand", "human intelligence", "gemini enterprise", "commitment", "ramp", "calculator", "edu"] },
];

export const ARCHIVE_LINKS = [
  { href: "/deck/index.html", label: "Exec deck" },
  { href: "/strategy", label: "Strategy one-pager" },
  { href: "/agentic/index.html", label: "Agentic explainer" },
  { href: "/agents/index.html", label: "Agents overview" },
  { href: "/casestudies/index.html", label: "Case studies" },
];

export const PUBLIC_ITEMS = CATALOG.filter((i) => i.audience === "public");

export const FEATURED = PUBLIC_ITEMS
  .filter((i) => i.featured !== undefined)
  .sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));

export const SECTIONS: Section[] = ["industries", "intelligence", "playbooks"];

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "");

/** Rank the whole catalog (accounts included) against a query. Empty query → no results. */
export function searchCatalog(query: string, limit = 8): CatalogItem[] {
  const q = norm(query).trim();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return CATALOG
    .map((item) => {
      const name = norm(item.name);
      const hay = [name, norm(item.blurb), ...item.keywords.map(norm)];
      let score = 0;
      for (const t of terms) {
        if (name === t) score += 120;
        else if (name.startsWith(t)) score += 100;
        else if (name.split(/\s+/).some((w) => w.startsWith(t))) score += 80;
        else if (name.includes(t)) score += 60;
        else if (item.keywords.some((k) => norm(k).startsWith(t))) score += 45;
        else if (hay.some((h) => h.includes(t))) score += 20;
        else return { item, score: -1 };
      }
      if (item.audience === "account") score -= 10;
      if (item.featured) score += 9 - item.featured;
      return { item, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}
