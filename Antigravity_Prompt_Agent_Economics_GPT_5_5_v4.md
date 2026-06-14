# Single-Shot Prompt (GPT-5.5) - Agent Estate and Platform Economics v4

Paste everything below the line into Antigravity's coding agent in the existing `tokenomics` repository.

This prompt replaces the current hidden "Total Cost to Outcome" lens. The five industry demos and their existing model-comparison behavior must remain intact.

---

You are the senior product engineer, enterprise architect, economist, and information designer responsible for turning the current agent-economics feature into a CXO-quality decision experience.

## Outcome

Rebuild agent economics as a first-class part of the application, not an optional panel hidden at the bottom of the WealthAI summary.

The experience must answer these questions in this order:

1. What kinds of agents is the customer planning to deploy?
2. Given their number, autonomy, audience, and risk, what production capabilities are actually required?
3. Which capabilities are supplied as an integrated platform, and which must the customer procure, integrate, host, secure, and operate?
4. What is the resulting Year-1 and three-year total cost to production outcome?
5. Which approach is rational for this customer, and what assumptions could change that answer?

The central comparison is not "included versus metered." Every serious deployment has consumption costs. The comparison is:

- **Gemini Enterprise Agent Platform (GEAP):** a unified platform where model access, agent development, runtime, orchestration, context, governance, observability, evaluation, and related services are available through an integrated platform and operating model. Some services may be separately metered. Integrated does not mean free.
- **Claude-centered assembled stack:** Anthropic models and available first-party agent capabilities, plus a customer-selected hyperscaler/runtime and the additional identity, data, memory, governance, evaluation, observability, deployment, and operations capabilities required for the selected estate.
- **OpenAI API-centered assembled stack:** OpenAI models and API/Agents capabilities, plus a customer-selected hyperscaler/runtime and the additional enterprise capabilities required for the selected estate.

Do not create a strawman. Research and acknowledge current first-party managed offerings, including OpenAI Frontier and Anthropic Managed Agents where relevant. Clearly distinguish an API-centered assembled deployment from a separately contracted managed enterprise platform. If public pricing or entitlement detail is unavailable, mark it `QUOTE REQUIRED` or `UNCONFIRMED`; do not invent it.

## Success criteria

A skeptical CXO should understand the page in this sequence without reading footnotes:

- "Our agent estate has this risk and complexity profile."
- "That profile requires these capabilities."
- "GEAP supplies most of this as one integrated platform; the API-centered alternatives require this additional stack and operating ownership."
- "Here is the cost composition and time-to-production difference."
- "Here is the recommendation, with assumptions and caveats."

The page should be useful in a live seller demo and defensible in a technical follow-up.

## Work from the latest repository

Before editing:

- Inspect the current branch, git status, recent commits, all existing enterprise-lens components, `RESEARCH.md`, pricing logic, the home springboard, and every route that imports the lens.
- Read the applicable Next.js guides in `node_modules/next/dist/docs/` before changing Next.js routing or conventions. This repository uses Next.js 16.2.9 and its local documentation is authoritative.
- Preserve unrelated user changes and all existing industry scenario calculations.
- Treat the current v3 implementation as source material, not a structure that must be preserved.

Then implement the complete outcome. Do not stop at a plan and do not ask for approval unless access is genuinely blocked.

## Information architecture

### First-class entry point

Create a dedicated `/agent-economics` route.

On the home springboard, place a prominent wide **Enterprise Agent Economics** card above the industry icon grid. It must be visible without enabling Seller Mode and must not look like a sixth industry. Its subcopy should communicate: "Define your agent estate, reveal the production stack, compare total economics."

Remove the old collapsed lens from the bottom of `SummaryDashboard`. Replace it with a concise, visible CTA near the top of the lifecycle summary that links to `/agent-economics`. Industry pages must otherwise retain their current look, numbers, and interactions.

### Page flow

Use a clear progressive story with a compact sticky step navigation:

1. Define the estate
2. Required capabilities
3. Compare delivery stacks
4. Economics and recommendation

Do not display the vendor cost comparison before the estate and capability requirements are established.

## Step 1 - Define the agent estate

Build an intuitive estate profiler around three explicitly different agent classes:

### Personal agents

Individual productivity agents owned or configured by a user. They primarily assist, summarize, create, search, and perform bounded actions for one person. Their main scale drivers are seats, usage, connectors, and user-level controls.

### Internal enterprise agents

Employee-facing agents connected to enterprise systems and data. They execute repeatable business workflows and require shared identity, delegated permissions, grounding, auditability, evaluation, and operational ownership.

### Customer-facing enterprise agents

Externally exposed production agents serving customers or partners. They add availability, concurrency, tenant isolation, abuse prevention, policy enforcement, human escalation, incident response, release controls, and higher evaluation requirements.

For each class let the user set:

- Number of production agents
- Complexity: `Assist`, `Act`, or `Orchestrate`

Use these meanings consistently:

- **Assist:** retrieve, summarize, draft, and recommend; limited tool use; a human owns the final action.
- **Act:** multi-step workflows that read and write systems under bounded permissions; approvals may be required.
- **Orchestrate:** long-running, multi-agent or cross-system workflows with delegated actions, recovery, and production SLAs.

Also include two global controls because they materially change requirements:

- Data/regulatory sensitivity: `Standard`, `Sensitive`, `Regulated`
- Expected activity: `Low`, `Moderate`, `High`

Start with a believable mid-enterprise preset, but include one-click presets for:

- Personal productivity rollout
- Internal workflow automation
- Customer-facing digital operations
- Mixed enterprise estate

The profile summary must state the total estate and its dominant risk driver in plain language.

## Step 2 - Derive the required capabilities

Replace the current static essential/not-essential taxonomy with a deterministic requirement engine. Create or revise a pure data module with typed inputs and testable functions.

For every capability return:

- `required`, `recommended`, or `optional`
- which profile inputs triggered that status
- whether it is shared across the estate or repeated/configured per agent
- the cost driver: seats, requests/tokens, runtime, storage, licenses, engineering, or operations

Cover at least these production functions, grouped into understandable layers:

- **Intelligence:** model access, model routing, orchestration, agent-to-agent coordination
- **Context and action:** enterprise connectors, grounding/search, tools/MCP/API integration, sessions, memory
- **Runtime:** managed execution, scaling, sandbox/code execution, deployment and release management
- **Trust:** user and agent identity, delegated authorization, policy/guardrails, human approval/escalation, audit and compliance
- **Operations:** evaluation/regression testing, tracing/observability, incident response, registry/catalog, cost and quota controls

Render this as a visual **capability staircase or layered production blueprint**, not a long wall of taxonomy cards. The viewer should immediately see how requirements expand from Personal + Assist to Internal + Act to Customer-facing + Orchestrate.

Show a compact derived statement such as: "Your selected estate requires 12 capabilities, recommends 3, and leaves 2 optional." Compute these counts; do not hard-code them.

## Step 3 - Compare equivalent delivery stacks

For the exact required capability set derived above, compare:

1. GEAP integrated platform
2. Claude-centered assembled stack
3. OpenAI API-centered assembled stack

The visual must answer "who supplies and operates each layer?" within ten seconds.

Use three side-by-side vertical stack diagrams or a compact capability coverage matrix with grouped rows. Avoid entitlement-chip clutter. Each capability cell must use one of these plain-language ownership states:

- `Platform-provided`
- `First-party component`
- `Hyperscaler service`
- `Third-party product`
- `Customer build/integration`
- `Quote required`

Use visual connectors to show when multiple products and providers must be assembled into one production stack. Show summary metrics above each approach:

- Platform-provided capabilities
- External services or vendors
- Customer integration points
- Ongoing operating owners/teams

Do not imply that GEAP capabilities have zero usage cost. The GEAP advantage being tested is integrated capability coverage, shared controls, and reduced assembly/operations work. The Claude/OpenAI disadvantage being tested is not model quality; it is the additional production stack and ownership required in an API-centered deployment.

Include a clearly visible fairness note:

- GEAP supports model choice and integrated agent services, but creates platform concentration and switching costs.
- OpenAI Frontier may offer a more integrated alternative than an API-centered OpenAI build; use current official evidence and mark non-public economics as quote-required.
- Anthropic Managed Agents may reduce runtime assembly for supported workloads; do not credit it with capabilities not established by official evidence.
- Existing customer cloud commitments and already-owned tools can materially reduce assembled-stack cost.

## Step 4 - Economics and recommendation

Replace the current four-line abstract TCO chart with a cost model derived from the selected estate and required capabilities.

Compare the same production outcome across the three approaches. Show a large, intuitive stacked-bar comparison at the selected profile, with toggles for Year 1 and three-year cumulative TCO.

Use these visible cost buckets:

- Model inference
- Agent platform and runtime
- Hyperscaler infrastructure
- External products/licenses
- Initial build and integration labor
- Ongoing platform, governance, and operations labor

Every displayed total must reconcile exactly to its visible components.

The model must include:

- Low/base/high estimate ranges
- Adjustable loaded engineering cost
- Adjustable activity/usage assumption
- Adjustable existing-tool credit for Claude/OpenAI assembled stacks
- Adjustable enterprise discount or contract factor for each approach
- Separate one-time and recurring costs
- Time to first governed production agent
- Number of external vendors/integration boundaries

Do not use the old fixed `INPUTS` totals as authoritative. Rebuild the formulas from capability requirements, workload, licenses/quotes, integration effort, and operating effort. Keep the formula implementation pure and testable.

Use official public list prices where available. For enterprise pricing that is not public, expose an assumption range or quote-required field. Never convert an unknown price into a precise verified number.

Below the bars, provide an expandable **Show the math** table with quantity, unit, rate, source status, and formula for every line item.

### Recommendation

Generate a concise decision brief from the selected profile and economics:

- Recommended approach
- Why it fits this estate
- Primary economic driver
- Primary architecture/governance driver
- Main tradeoff or lock-in risk
- Runner-up and when it becomes preferable
- The three assumptions most likely to flip the answer

The recommendation must be genuinely conditional. It may recommend an assembled Claude or OpenAI stack when the estate is small, capabilities are already owned, or the customer has strong platform engineering. It may recommend GEAP when integrated capability coverage, governance consistency, and time-to-production outweigh platform concentration.

## Research and evidence rules

Rewrite `RESEARCH.md` around the new comparison. Research current official sources before preserving any old claim.

Use official documentation and pricing pages first for Google Cloud, OpenAI, Anthropic, and any hyperscaler services. For each material fact store:

- Source URL
- Access date
- `VERIFIED`, `ASSUMPTION`, `UNCONFIRMED`, or `QUOTE REQUIRED`
- What the source actually establishes
- What it does not establish

Keep these distinctions precise:

- Platform-provided does not mean included at zero incremental cost.
- API/SDK availability does not establish a managed enterprise runtime.
- A product feature does not establish that governance and operations are fully handled.
- Model quality is separate from platform completeness.
- Compare equivalent production capabilities, not a full platform against a bare API call.

Remove or correct stale claims, future-effective pricing presented as current, unsupported competitor pricing, and any statement that no longer matches official product scope.

## Visual and interaction standard

The current lens is too dense and chart-led. Redesign it as an executive narrative.

- Use progressive disclosure: headline conclusion first, details on demand.
- Prefer layered diagrams, stacked bars, ownership maps, and direct labels over legends and tooltip-only meaning.
- Keep the selected estate visible in a compact sticky summary while scrolling.
- Use one consistent color per approach and one consistent color per ownership state.
- Ensure the visuals remain understandable without relying only on color.
- Provide strong empty, default, hover, focus, and selected states.
- Make desktop presentation excellent at 1440px and keep the flow usable at 390px mobile width.
- Avoid horizontal table overflow on mobile; convert dense comparisons into grouped cards.
- Preserve the visual language of the existing application, but this route may have a more executive, neutral tone than the industry demos.
- Do not add decorative charts that do not answer one of the four decision steps.

## Suggested code shape

Use the repository's existing React, TypeScript, Tailwind, Framer Motion, Recharts, and Lucide stack. Do not add a dependency unless it materially reduces implementation risk.

Prefer a structure similar to:

```text
src/app/agent-economics/page.tsx
src/components/enterprise-lens/
  AgentEstateProfiler.tsx
  CapabilityBlueprint.tsx
  DeliveryStackComparison.tsx
  EconomicsComparison.tsx
  DecisionBrief.tsx
src/lib/agent-economics/
  types.ts
  capabilities.ts
  approaches.ts
  economics.ts
  evidence.ts
```

You may rename or remove the current v3 enterprise-lens files when the new structure replaces them. Avoid parallel obsolete implementations.

## Acceptance checks

Before finishing, verify all of the following:

- `/agent-economics` is a prominent first-class home entry and not hidden behind Seller Mode or a summary toggle.
- The five existing industry routes still build and retain their prior default behavior and calculations.
- Agent class and complexity are established before any vendor comparison appears.
- Changing Personal/Internal/Customer-facing counts or complexity changes capability requirements and economics deterministically.
- A Customer-facing + Orchestrate profile visibly requires more trust, runtime, and operations capability than a Personal + Assist profile.
- GEAP, Claude-centered, and OpenAI API-centered approaches compare the same required production outcome.
- OpenAI Frontier and Anthropic Managed Agents are acknowledged accurately without inventing public pricing or coverage.
- Stacked totals reconcile with the Show the math table.
- Low/base/high ranges behave monotonically and contract discounts/existing-tool credits move only the intended cost lines.
- Recommendation outcomes can change under materially different profiles.
- Source-status labels and caveats are accessible without hovering.
- No hydration warnings, console errors, chart clipping, or mobile horizontal overflow.
- `npm run lint` and `npm run build` pass. Fix any issues caused by the work.

Use browser verification on the home page, `/agent-economics`, `/wealthai`, and `/shopos` at desktop and mobile sizes. Commit the completed implementation with a focused message and push the current feature branch.

## Final response

Report only:

- What changed in the user journey
- The default estate profile and resulting recommendation
- One example showing how a different estate flips or narrows the recommendation
- Build/lint/browser verification results
- Commit hash and preview URL if available

Do not dump implementation narration. The shipped experience is the deliverable.
