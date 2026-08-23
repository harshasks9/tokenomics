import type { MaturityStage, ReadinessQuestion } from "../types";

export const MATURITY_STAGES: MaturityStage[] = [
  {
    level: 1,
    name: "Ad hoc",
    meaning:
      "AI adoption is running ahead of any structure: no reliable inventory, no named owner, controls are whatever individual teams chose. Most value at risk; most incidents found by surprise.",
  },
  {
    level: 2,
    name: "Documented",
    meaning:
      "Policies, an initial inventory, and a review process exist — on paper. Enforcement is manual and bypassable, which is where most enterprises sit today (average trust maturity was 2.3 in McKinsey's 2026 survey).",
  },
  {
    level: 3,
    name: "Enforced",
    meaning:
      "Policy compiles into the platform: allowlists, screening floors, eval gates, and DLP run in the request path; the governed road is faster than the shadow one.",
  },
  {
    level: 4,
    name: "Continuous",
    meaning:
      "Governance generates its own evidence: runtime enforcement everywhere including agents, continuous evals, automated compliance evidence, rehearsed kill switches — governance as an operating capability.",
  },
];

export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  {
    id: "inv",
    layerId: "enterprise",
    question: "Could you produce a complete inventory of AI in your enterprise — systems, agents, and AI embedded in SaaS?",
    levels: [
      "No — we would be guessing, and shadow use is likely larger than sanctioned use.",
      "A partial list exists in spreadsheets; embedded SaaS AI and agents are mostly missing.",
      "A maintained registry covers sanctioned AI with owners and risk tiers; discovery fills gaps.",
      "Registry plus automated discovery reconcile continuously; unregistered AI is detected and chased down.",
    ],
  },
  {
    id: "own",
    layerId: "enterprise",
    question: "Who is accountable for AI governance, and how fast does a new use case get a decision?",
    levels: [
      "Nobody owns it; use cases launch without review.",
      "A committee exists but reviews are slow and advisory — teams route around them.",
      "An accountable executive and tiered intake exist; low-risk uses clear in days.",
      "Governance operates as a product with SLAs, and the board sees coverage and incident metrics quarterly.",
    ],
  },
  {
    id: "cls",
    layerId: "data",
    question: "Is data classified — and are classifications enforced — before AI systems can index or retrieve it?",
    levels: [
      "No classification; AI tools index whatever permissions allow, and permissions are untested.",
      "Classification exists for some estates; AI connections don't check it.",
      "Sensitive classes are excluded from AI retrieval by policy, and permissions get reviewed before indexing.",
      "Classification-driven exclusions are enforced at index and query time, verified by sampling audits.",
    ],
  },
  {
    id: "pii",
    layerId: "data",
    question: "Can PII or confidential data reach model providers through prompts, logs, or caches?",
    levels: [
      "Unknown — nothing inspects prompts, and vendor retention terms were never reviewed.",
      "Policies forbid it; nothing technical prevents it.",
      "DLP screens prompts and responses on main paths; contracts cover training and retention.",
      "De-identification is inline everywhere it matters, logs are redacted, and residency/retention posture is verified per vendor.",
    ],
  },
  {
    id: "cat",
    layerId: "model",
    question: "How is it decided which models teams may use?",
    levels: [
      "Teams pick models ad hoc with personal or team API keys.",
      "An approved list exists on a wiki; nothing enforces it.",
      "A curated catalog with platform-enforced allowlisting; unlisted models need due diligence.",
      "Allowlist plus lifecycle management: version pinning, retirement runbooks, provider updates trigger regression evals.",
    ],
  },
  {
    id: "eval",
    layerId: "model",
    question: "What evaluation evidence exists before — and after — an AI use case ships?",
    levels: [
      "Demos and vibes; no test sets.",
      "One-time pre-launch testing; nothing reruns on changes.",
      "Golden datasets per major use case with eval gates in CI for prompt/model changes.",
      "Continuous evaluation on production samples with calibrated judges, trending dashboards, and regression alerts.",
    ],
  },
  {
    id: "ground",
    layerId: "application",
    question: "How do your high-stakes AI applications control what they claim?",
    levels: [
      "Raw model output goes to users; no grounding or citations.",
      "Some RAG exists; citations optional; nobody measures groundedness.",
      "High-stakes answers are grounded in approved corpora with citations, and groundedness is measured.",
      "Grounding plus output validation plus human sign-off at consequence points, with production sampling reviews.",
    ],
  },
  {
    id: "prompts",
    layerId: "application",
    question: "What happens between a prompt or AI-config edit and production?",
    levels: [
      "Anyone edits prompts live.",
      "Prompts live in code review, but no AI-specific testing gates changes.",
      "Every prompt/config change passes safety and quality regression evals before rollout.",
      "Eval-gated canary releases with rollback, and release notes tie behavior changes to evidence.",
    ],
  },
  {
    id: "agentid",
    layerId: "agent",
    question: "Do your agents have identities, owners, and limits?",
    levels: [
      "Agents run on shared service accounts or borrowed human credentials — or we don't know.",
      "Some agents are known; permissions are broad; no budgets or approval gates.",
      "Every agent has its own identity, a named owner, scoped tools, and spend limits.",
      "Full delegation-chain audit, human gates on consequential actions, and a rehearsed kill switch per agent.",
    ],
  },
  {
    id: "agentinv",
    layerId: "agent",
    question: "Could you list every agent operating in your enterprise — and stop one — today?",
    levels: [
      "No list exists; employee-built and SaaS-embedded agents are invisible.",
      "A partial list; stopping one means finding the team that built it.",
      "A registry covers sanctioned agents with enable/disable; discovery watches for strays.",
      "Registry + continuous discovery + one-click disable, exercised in drills.",
    ],
  },
  {
    id: "screen",
    layerId: "security",
    question: "What runtime screening applies to AI traffic — including apps that bypassed the platform team?",
    levels: [
      "None; model calls go straight out.",
      "Some apps call a moderation API; coverage depends on each team remembering.",
      "A screening service with an org-wide floor covers main paths for injection, leakage, and unsafe content.",
      "Screening is enforced in the network path and gateway so nothing bypasses it, with SOC-visible block events.",
    ],
  },
  {
    id: "trace",
    layerId: "security",
    question: "Could you reconstruct a specific AI interaction from last week — prompt, sources, tools, output?",
    levels: [
      "No — no AI-specific logging exists.",
      "Fragments exist across app logs; assembly would take days.",
      "Standardized traces and audit logs cover major systems; content logging is a deliberate, redacted choice.",
      "End-to-end traces for effectively all AI interactions, retention-managed, tested in incident drills.",
    ],
  },
  {
    id: "shadow",
    layerId: "people",
    question: "What do you actually know about employee AI use outside sanctioned tools?",
    levels: [
      "Nothing; policy says don't, telemetry says nothing.",
      "Network logs could tell us, but nobody looks; blocking is the only lever.",
      "Discovery dashboards track AI app usage; risky flows trigger coaching; sanctioned share is measured.",
      "Sanctioned tools measurably out-compete shadow use, personal-account traffic trends down, and findings feed the roadmap.",
    ],
  },
  {
    id: "train",
    layerId: "people",
    question: "Is AI literacy real — training tied to access, duties tied to roles?",
    levels: [
      "No training; the AUP is a PDF nobody read.",
      "Generic annual training exists, disconnected from tools and access.",
      "Role-based training gates access tiers; the AUP names concrete behaviors and data classes.",
      "Literacy is measured and refreshed with capability changes; verification duties are enforced in workflows, not just policy.",
    ],
  },
];
