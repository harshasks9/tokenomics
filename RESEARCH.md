# Agent Estate and Platform Economics - Research Basis

Accessed: June 14, 2026.

Status legend:

- `VERIFIED`: established by an official product or documentation page.
- `ASSUMPTION`: adjustable decision-model input, not presented as vendor fact.
- `UNCONFIRMED`: plausible but not established by the cited public evidence.
- `QUOTE REQUIRED`: enterprise scope or pricing is not publicly precise enough for a verified total.

## Comparison boundary

The application compares equivalent production outcomes after the user defines the agent estate. It does not compare a complete platform with a bare model call.

`VERIFIED` Gemini Enterprise Agent Platform is described by Google Cloud as a unified platform to build, scale, govern, and optimize enterprise agents. The documented surface includes model access, agent development, runtime, sessions, memory, evaluation, observability, identity, gateway, and governance functions.

Source: https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview

Source: https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale

Source: https://docs.cloud.google.com/gemini-enterprise-agent-platform/govern

What this establishes: integrated product availability and a shared platform operating model.

What it does not establish: that every service is included at zero incremental cost or that every customer receives identical contract pricing.

`VERIFIED` Google documents Agent Runtime as managed production infrastructure for deploying, managing, and scaling agents. Sessions, Memory Bank, code execution, identity, logging, tracing, and monitoring are documented platform services.

Source: https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime

What this establishes: GEAP provides managed runtime and related production capabilities.

What it does not establish: a single universal per-agent TCO. Runtime and related services can be usage-metered.

## OpenAI boundary

`VERIFIED` OpenAI's Agents SDK is a code-first toolkit in which the customer's application owns orchestration, tool execution, approvals, and state when using the SDK deployment path.

Source: https://developers.openai.com/api/docs/guides/agents

What this establishes: an API-centered OpenAI build includes strong first-party agent building blocks while leaving meaningful application and runtime ownership with the customer.

`VERIFIED` OpenAI Frontier is described as an enterprise platform for deploying and managing production agents with business context, agent execution, evaluation/optimization, security, permissions, controls, and auditing.

Source: https://openai.com/business/frontier/

What this establishes: OpenAI has a more integrated enterprise alternative than an API-centered assembled stack.

What it does not establish: public list pricing or a capability-by-capability contractual entitlement. The application therefore labels Frontier economics `QUOTE REQUIRED` and does not silently substitute API pricing.

## Anthropic boundary

`VERIFIED` Anthropic's Agent SDK provides an agent loop, tools, context management, permissions, hooks, and programmable TypeScript/Python interfaces.

Source: https://docs.anthropic.com/en/docs/claude-code/sdk

Source: https://console.anthropic.com/docs/en/agent-sdk/permissions

What this establishes: Anthropic supplies first-party agent development and execution components.

What it does not establish: that the SDK alone supplies the complete enterprise runtime, identity, governance, audit, evaluation, release, and FinOps operating stack.

`VERIFIED` Anthropic describes Managed Agents as a hosted service for long-horizon agents.

Source: https://www.anthropic.com/engineering/managed-agents

What this establishes: supported workloads may require less customer-owned runtime assembly than a pure SDK deployment.

What it does not establish: complete public capability coverage or enterprise pricing across the full stack. These remain `QUOTE REQUIRED` or `UNCONFIRMED` where applicable.

## Model assumptions

All values in `src/lib/agent-economics/economics.ts` are transparent starting assumptions expressed in thousands of US dollars.

`ASSUMPTION` Weighted agent units combine class, autonomy, and count so a Personal + Assist agent is not treated as economically equivalent to a Customer-facing + Orchestrate agent.

`ASSUMPTION` Loaded engineering rate defaults to $18K per engineer-month and is adjustable from $8K to $35K.

`ASSUMPTION` Model usage rates are deliberately close across approaches. The experience is intended to expose platform and operating-stack economics, not manufacture a result from model price differences.

`ASSUMPTION` GEAP has lower initial integration and ongoing operating effort because more required capabilities are supplied through one platform.

`ASSUMPTION` API-centered Claude and OpenAI deployments incur hyperscaler, external-tool, integration, and operating costs only for capabilities required by the selected estate.

`ASSUMPTION` Existing-tool credit reduces assembled-stack external product and some infrastructure cost. It does not reduce model inference or all customer engineering work.

`QUOTE REQUIRED` Enterprise discounts, OpenAI Frontier contracts, Anthropic Managed Agents contracts, external guardrail/evaluation products, and negotiated hyperscaler commitments vary by customer.

## Interpretation guardrails

- Platform-provided does not mean free.
- API or SDK availability does not by itself establish a managed enterprise operating platform.
- Model quality is separate from platform completeness.
- Existing cloud commitments and already-owned tools can change the result materially.
- Customer architecture, security scope, volumes, regions, and contracted rates must replace the defaults before a purchasing decision.
