import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Factory,
  Heart,
  Landmark,
  Layers3,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

const JOURNEY = [
  {
    number: "01",
    icon: Target,
    title: "Choose the right use cases",
    body: "Start with journeys where better decisions, faster action, and reusable capabilities create measurable value. Avoid isolated chatbots with no path to execution.",
  },
  {
    number: "02",
    icon: Database,
    title: "Make data agent-ready",
    body: "Connect trusted enterprise data, define ownership and permissions, and improve the quality of the context agents use before scaling autonomous actions.",
  },
  {
    number: "03",
    icon: Layers3,
    title: "Standardize on a platform",
    body: "Adopt Gemini Enterprise Agent Platform as the shared foundation for models, grounding, orchestration, runtime, security, evaluation, and lifecycle operations.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Transform and compound",
    body: "Redesign work across functions, reuse governed components, measure outcomes, and expand from individual agents into a managed enterprise agent estate.",
  },
];

const STORIES = [
  {
    name: "Northstar Private Bank",
    industry: "Wealth management",
    date: "September 2028",
    href: "/wealthai",
    icon: TrendingUp,
    color: "#1A73E8",
    pale: "#EFF6FF",
    headline: "Northstar stopped funding assistants and started rebuilding the advice journey.",
    dek: "Three years after standardizing on Gemini Enterprise Agent Platform, Northstar's advantage was not a single wealth agent. It was a governed system for turning research, client context, policy, and advisor judgment into better decisions.",
    startingPoint: "More than 30 disconnected AI pilots competed for the same data, security reviews, and advisor attention. Most summarized documents; few changed client outcomes.",
    chapters: [
      { label: "Use cases", text: "Northstar prioritized advisor preparation, research synthesis, and suitability review because they shared data and improved one end-to-end client journey." },
      { label: "Data", text: "The bank created a governed client-context layer spanning portfolios, CRM history, approved research, product policy, and entitlements." },
      { label: "Platform", text: "Gemini Enterprise Agent Platform supplied common grounding, identity, orchestration, evaluation, audit, and release controls across every agent." },
      { label: "Transformation", text: "Advisors moved from assembling information to reviewing recommendations, handling exceptions, and spending more time with clients." },
    ],
    wentWell: ["One suitability policy was enforced across all advisor agents", "Research and client context became reusable platform services", "New advisor journeys launched without repeating security architecture"],
    outcomes: ["Faster advisor preparation", "More consistent suitability review", "Higher-value client conversations"],
  },
  {
    name: "Kanso Retail Group",
    industry: "Retail commerce",
    date: "October 2028",
    href: "/shopos",
    icon: ShoppingBag,
    color: "#188038",
    pale: "#F0FDF4",
    headline: "Kanso made every customer interaction part of one intelligent commerce journey.",
    dek: "Kanso's breakthrough came when it stopped treating search, service, merchandising, and fulfillment as separate AI projects. The company standardized the shared context and actions behind all four.",
    startingPoint: "Customer-facing pilots produced impressive demos but inconsistent answers because product, inventory, loyalty, and order data were fragmented across regions and channels.",
    chapters: [
      { label: "Use cases", text: "Kanso selected product discovery, order resolution, and inventory action as a connected journey with clear conversion, service, and working-capital measures." },
      { label: "Data", text: "A governed commerce graph unified catalog, inventory, customer consent, promotions, and order state with real-time access controls." },
      { label: "Platform", text: "Gemini Enterprise Agent Platform provided multimodal models, managed connectors, session state, model routing, autoscaling, and common policy controls." },
      { label: "Transformation", text: "Store, service, and merchandising teams began sharing agent capabilities instead of buying separate copilots for each function." },
    ],
    wentWell: ["One commerce context layer served customer and employee agents", "Model routing protected experience quality while controlling unit cost", "Reusable tools connected recommendations directly to fulfillment actions"],
    outcomes: ["More relevant discovery", "Faster issue resolution", "Lower cost to launch new journeys"],
  },
  {
    name: "Aster Health Network",
    industry: "Healthcare",
    date: "November 2028",
    href: "/pulseai",
    icon: Heart,
    color: "#E11D48",
    pale: "#FFF1F2",
    headline: "Aster scaled agentic healthcare by making trust part of the platform, not the prompt.",
    dek: "Aster's agent strategy accelerated only after clinical safety, human escalation, provenance, and patient consent became reusable platform capabilities available to every care journey.",
    startingPoint: "Clinical documentation, prior authorization, and patient navigation pilots each built their own access patterns and review processes, slowing validation and increasing risk.",
    chapters: [
      { label: "Use cases", text: "Aster began with administrative and clinician-reviewed workflows, then expanded autonomy only where evaluation evidence and escalation paths supported it." },
      { label: "Data", text: "The network governed access to longitudinal records, benefits, pathways, and medical knowledge through purpose-specific identity and consent policies." },
      { label: "Platform", text: "Gemini Enterprise Agent Platform standardized grounding, safety policies, human approval, audit evidence, evaluation, and incident response." },
      { label: "Transformation", text: "Clinical teams redesigned handoffs around exceptions and judgment while agents prepared context, coordinated tasks, and completed bounded administrative work." },
    ],
    wentWell: ["Clinical governance was encoded once and reused", "Every answer and action retained provenance and audit evidence", "Autonomy increased gradually through measured safety gates"],
    outcomes: ["Less administrative burden", "Faster care coordination", "Safer expansion of agent autonomy"],
  },
  {
    name: "Aurora Public Services",
    industry: "Government services",
    date: "December 2028",
    href: "/civicos",
    icon: Landmark,
    color: "#4F46E5",
    pale: "#EEF2FF",
    headline: "Aurora replaced a maze of portals with journeys organized around citizen intent.",
    dek: "The transformation did not begin with a universal government chatbot. It began by selecting life events where agencies could safely coordinate data, decisions, and next actions around the citizen.",
    startingPoint: "Residents navigated separate systems for benefits, permits, tax, and case status. Each agency had different identity, content, and automation standards.",
    chapters: [
      { label: "Use cases", text: "Aurora prioritized veteran benefits, small-business launch, and case-status journeys where cross-agency coordination removed repeated citizen effort." },
      { label: "Data", text: "The program introduced a consent-aware data layer, shared service taxonomy, authoritative content sources, and agency-specific authorization." },
      { label: "Platform", text: "Gemini Enterprise Agent Platform delivered shared identity, connectors, orchestration, policy, audit, evaluation, and release management across agencies." },
      { label: "Transformation", text: "Agencies retained policy ownership while reusing common agent services, enabling citizen journeys to cross organizational boundaries without erasing accountability." },
    ],
    wentWell: ["Citizen intent replaced agency structure as the journey design principle", "Shared controls shortened review for each new service", "Auditability and human appeal paths remained visible by design"],
    outcomes: ["Fewer repeated submissions", "Faster service completion", "Consistent cross-agency governance"],
  },
  {
    name: "ForgeWorks Industries",
    industry: "Manufacturing",
    date: "January 2029",
    href: "/factoryos",
    icon: Factory,
    color: "#E37400",
    pale: "#FFF7ED",
    headline: "ForgeWorks turned plant knowledge into a governed operating system for frontline decisions.",
    dek: "ForgeWorks created value when maintenance, quality, planning, and safety agents began sharing the same operational context and controls across plants rather than remaining local experiments.",
    startingPoint: "Individual plants built promising copilots, but equipment taxonomies, maintenance histories, safety policies, and integration patterns differed by site.",
    chapters: [
      { label: "Use cases", text: "The company chose quality disposition, maintenance triage, and production recovery because they shared machine context and had measurable downtime and yield outcomes." },
      { label: "Data", text: "ForgeWorks standardized asset identity, telemetry meaning, work-order history, operating procedures, and data-quality ownership across plants." },
      { label: "Platform", text: "Gemini Enterprise Agent Platform provided multimodal grounding, agent coordination, managed runtime, safety controls, observability, and deterministic rollback." },
      { label: "Transformation", text: "Frontline teams received contextual recommendations while engineers governed reusable skills that could be certified once and deployed across facilities." },
    ],
    wentWell: ["Plant-specific data mapped to a common operational model", "Safety boundaries remained consistent as agents scaled", "Reusable agent skills spread improvements between facilities"],
    outcomes: ["Faster fault resolution", "More consistent quality decisions", "Quicker replication across plants"],
  },
];

export default function CustomerTransformationStories() {
  return (
    <section id="customer-journeys" className="scroll-mt-28">
      <div className="mb-8 max-w-4xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">03 / Customer transformation journeys</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Five companies, one repeatable path to agentic transformation.</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          These illustrative future retrospectives show what success could look like after customers move beyond isolated pilots and standardize on Gemini Enterprise Agent Platform: a comprehensive, secure, open, and governed platform across the agent lifecycle.
        </p>
      </div>

      <div className="relative mb-14 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm md:p-8">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 90% 0%, #2563EB 0, transparent 30%)" }} />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">The shared transformation playbook</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {JOURNEY.map(({ number, icon: Icon, title, body }, index) => (
              <div key={number} className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200"><Icon size={18} /></div>
                  <span className="text-xs font-black text-white/25">{number}</span>
                </div>
                <h3 className="mt-4 text-sm font-extrabold">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">{body}</p>
                {index < JOURNEY.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-blue-300 lg:block" size={18} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {STORIES.map((story, storyIndex) => {
          const Icon = story.icon;
          return (
            <article key={story.name} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
                <div className="relative p-6 md:p-8" style={{ backgroundColor: story.pale }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm" style={{ backgroundColor: story.color }}><Icon size={21} /></div>
                    <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">Illustrative future story</span>
                  </div>
                  <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: story.color }}>{story.date} · {story.industry}</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{story.headline}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{story.dek}</p>
                  <div className="mt-6 rounded-2xl border border-white/80 bg-white/65 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Where the journey began</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{story.startingPoint}</p>
                  </div>
                  <Link href={story.href} className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: story.color }}>
                    Explore the underlying economics scenario <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="p-6 md:p-8">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Customer {String(storyIndex + 1).padStart(2, "0")}</p><h4 className="mt-1 text-lg font-extrabold text-slate-950">{story.name}</h4></div>
                    <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-700 sm:inline">Standardized on Gemini Enterprise Agent Platform</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {story.chapters.map((chapter, index) => (
                      <div key={chapter.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white" style={{ backgroundColor: story.color }}>{index + 1}</span><p className="text-xs font-bold text-slate-800">{chapter.label}</p></div>
                        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{chapter.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-5 border-t border-slate-100 pt-6 md:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">What went well</p>
                      <ul className="mt-3 space-y-2">
                        {story.wentWell.map((item) => <li key={item} className="flex gap-2 text-xs leading-relaxed text-slate-600"><CheckCircle2 size={14} className="mt-0.5 flex-none text-emerald-600" />{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Illustrative outcomes</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {story.outcomes.map((outcome) => <span key={outcome} className="rounded-lg px-2.5 py-1.5 text-[10px] font-bold" style={{ color: story.color, backgroundColor: story.pale }}>{outcome}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
