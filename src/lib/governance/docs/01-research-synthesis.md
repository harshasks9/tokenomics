# Deliverable 1 — Research synthesis

*Snapshot August 2026. Full sourced briefs in `research/`; this is the synthesis that
shaped the framework.*

## What the field now agrees AI governance is

Across regulators, standards bodies, security researchers, and consultancies, a
consistent definition emerged by 2026: **a risk-based management system spanning the full
AI lifecycle, with named human accountability, enforced by technical controls at runtime —
not policies on paper.** The layer structure repeats everywhere it is drawn:
principles → operating model → risk triage → lifecycle controls → runtime enforcement →
assurance. NIST expresses it as Govern/Map/Measure/Manage; ISO/IEC 42001 as a certifiable
management system; Gartner AI TRiSM as four technology layers with runtime inspection at
the center; the EU AI Act as risk tiers with per-tier obligations.

## The five findings that anchor the site

1. **Adoption outran governance everywhere.** 28% of organizations report CEO-level AI
   governance oversight (McKinsey 2025); average AI trust maturity is 2.3/4 with agentic
   controls weakest (McKinsey 2026); <1% have fully operationalized responsible AI
   (Accenture/WEF); 63% of breached organizations had no AI governance policy at all
   (IBM 2025).
2. **The deployer is now a regulated party.** EU Art. 26 duties (from Dec 2027 for
   Annex III), Korea's AI Basic Act (Jan 2026), and US state transparency laws attach
   obligations to enterprises that merely *use* AI. The 2026 EU Digital Omnibus
   (Reg. 2026/1744) deferred the high-risk regime (Dec 2027 / Aug 2028) but Art. 50
   transparency and GPAI enforcement proceeded in Aug 2026 — deferred, not cancelled.
   The US swung deregulatory (Dec 2025 EO, AI Litigation Task Force vs. state laws;
   Colorado repealed-and-replaced its AI Act, May 2026), making the transatlantic
   fairness split the sharpest divergence.
3. **Security frameworks merged into governance.** OWASP LLM Top 10 (2025) and Agentic
   Top 10 (Dec 2025), MITRE ATLAS v5.1 (16 tactics / 84 techniques), CSA's AI Controls
   Matrix v1.1 (247 controls), Google SAIF 2.0 (agent risk map; donated to CoSAI) and
   NIST's COSAiS overlays (drafts) turned governance intent into named threats and
   controls — with 2025–26 attention pivoting hard to agents.
4. **Three eras, three governance objects.** Predictive-ML governance validated an
   *artifact* (SR 11-7 shape). GenAI forced governance of a *system's behavior*
   (third-party models, unbounded input, non-determinism, prompts as production code,
   every employee a user). Agents force governance of an *actor* — identity, delegated
   authority, tool access, memory, budgets, kill switches. Seven specific SR 11-7-era
   assumptions break; each break implies a specific control (rendered on the site's
   "Why now" page).
5. **Shadow AI is the default state, and bans fail.** 30x YoY growth in data sent to
   GenAI apps, 72% via personal accounts (Netskope); shadow AI in 20% of breaches at a
   +$670K premium (IBM). What works: a sanctioned alternative good enough to win, plus
   discovery, inline DLP, and real-time coaching. The 2026 twist is shadow *agents*
   (MCP adoption +400% in 2025, mostly outside security review).

## Schools of thought (and how the framework resolves them)

- **Management-system school** (ISO 42001, consultancies): governance = certifiable
  organizational system. Right about accountability and lifecycle; quiet about
  enforcement mechanics.
- **Risk-process school** (NIST, ISO 23894/42005): governance = risk identification and
  treatment per use case. Supplies the process verbs and impact-assessment method.
- **Runtime-enforcement school** (Gartner TRiSM, Forrester AEGIS, SAIF, OWASP/ATLAS):
  policies fail without technical controls in the request path. Supplies the site's
  central thesis: *policy must compile*.
- **Regulatory-tier school** (EU, Korea): obligations scale with risk class; inventory
  and tiering are preconditions for everything.

The site's framework (Deliverable 2) takes accountability and lifecycle from the first
two, the enforcement center of gravity from the third, and tiering from the fourth —
arranged over the seven asset layers enterprises actually manage.

## The 2025–26 incident record (why this is no longer theoretical)

EchoLeak (CVE-2025-32711, zero-click Copilot exfiltration, Jun 2025); the Replit agent
production-database deletion (Jul 2025); GTG-1002, the first reported AI-orchestrated
espionage campaign (disclosed Nov 2025); Moffatt v. Air Canada (liability for a
chatbot's invented policy, Feb 2024); Bartz v. Anthropic ($1.5B training-data
settlement, Sep 2025); Mobley v. Workday (nationwide AI-hiring collective action, May
2025); 1,500+ court decisions on fabricated citations by mid-2026. Every incident maps
to a control that existed as guidance and was absent as enforcement — the pattern the
whole site teaches.
