"use client";

import { useState } from "react";
import { CheckCircle2, GitBranch, Wrench, Circle, Cloud } from "lucide-react";

type PlatformId = "geap" | "claude" | "chatgpt";
type Status = "Included" | "First-party" | "Wire up" | "You build";
type Hyperscaler = "aws" | "azure" | "gcp";

interface Platform {
  id: PlatformId;
  name: string;
  vendor: string;
  fullName: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

const PLATFORMS: Platform[] = [
  { id: "geap",    name: "Gemini Enterprise Agent Platform", vendor: "Google", fullName: "Gemini Enterprise Agent Platform", accentBg: "bg-blue-50", accentText: "text-blue-700", accentBorder: "border-blue-300" },
  { id: "claude",  name: "Claude Enterprise", vendor: "Anthropic", fullName: "Claude Enterprise + API",         accentBg: "bg-amber-50",  accentText: "text-amber-700", accentBorder: "border-amber-300"  },
  { id: "chatgpt", name: "ChatGPT Enterprise",vendor: "OpenAI",    fullName: "ChatGPT Enterprise",              accentBg: "bg-teal-50",   accentText: "text-teal-700",  accentBorder: "border-teal-300"   },
];

const HYPERSCALERS: { id: Hyperscaler; label: string }[] = [
  { id: "aws",   label: "AWS"   },
  { id: "azure", label: "Azure" },
  { id: "gcp",   label: "GCP"   },
];

const STATUS_META: Record<Status, { icon: typeof CheckCircle2; bg: string; text: string; border: string; shortLabel: string }> = {
  "Included":    { icon: CheckCircle2, bg: "bg-blue-50",   text: "text-blue-700",  border: "border-blue-200",  shortLabel: "Included"  },
  "First-party": { icon: Circle,       bg: "bg-slate-50",  text: "text-slate-600", border: "border-slate-200", shortLabel: "1P / SDK"  },
  "Wire up":     { icon: GitBranch,    bg: "bg-amber-50",  text: "text-amber-700", border: "border-amber-200", shortLabel: "Wire up"   },
  "You build":   { icon: Wrench,       bg: "bg-rose-50",   text: "text-rose-700",  border: "border-rose-200",  shortLabel: "You build" },
};

type StitchMap = Record<Hyperscaler, string[]>;

interface Capability {
  name: string;
  geap: Status;
  claude: Status;
  chatgpt: Status;
  why: Partial<Record<PlatformId, string>>;
  stitch: Partial<Record<PlatformId, StitchMap>>;
}

interface Phase {
  number: string;
  label: string;
  tagline: string;
  capabilities: Capability[];
}

const PHASES: Phase[] = [
  {
    number: "01", label: "Build", tagline: "Create your agents",
    capabilities: [
      {
        name: "Foundation models",
        geap: "Included", claude: "Included", chatgpt: "Included",
        why: {
          geap:    "Gemini 1.5 / 2.0 Pro bundled; updates managed by Google.",
          claude:  "Claude 3.5 Sonnet, Opus, Haiku included in Enterprise contract.",
          chatgpt: "GPT-4o and o1 series; version management handled by OpenAI.",
        },
        stitch: {},
      },
      {
        name: "Agent orchestration",
        geap: "Included", claude: "First-party", chatgpt: "First-party",
        why: {
          geap:    "Agent Builder + Vertex AI Agents provide a managed orchestration layer.",
          claude:  "Claude SDK covers workflows; your team owns deploying the runtime.",
          chatgpt: "Assistants API provides building blocks; production runtime is customer-owned.",
        },
        stitch: {
          claude: {
            aws:   ["ECS Fargate for runtime", "ECR for container images", "ALB for routing"],
            azure: ["Container Apps for runtime", "ACR for container images", "API Management for routing"],
            gcp:   ["Cloud Run for runtime", "Artifact Registry for images", "Cloud Endpoints for routing"],
          },
          chatgpt: {
            aws:   ["ECS Fargate for runtime", "ECR for container images", "ALB for routing"],
            azure: ["Container Apps for runtime", "ACR for container images", "API Management for routing"],
            gcp:   ["Cloud Run for runtime", "Artifact Registry for images", "Cloud Endpoints for routing"],
          },
        },
      },
      {
        name: "Tools & function calling",
        geap: "Included", claude: "First-party", chatgpt: "First-party",
        why: {
          geap:    "MCP + function calling governed in platform; enterprise tool registry included.",
          claude:  "Tool use and MCP ship with the API; enterprise governance is customer-built.",
          chatgpt: "Code interpreter, file search, and function calling built into Assistants.",
        },
        stitch: {
          claude: {
            aws:   ["API Gateway for tool endpoints", "Lambda for tool execution", "IAM roles for tool permissions"],
            azure: ["API Management for tool endpoints", "Azure Functions for execution", "Managed Identities for permissions"],
            gcp:   ["Cloud Endpoints for tool endpoints", "Cloud Functions for execution", "Workload Identity for permissions"],
          },
          chatgpt: {
            aws:   ["API Gateway for tool endpoints", "Lambda for tool execution", "IAM roles for tool permissions"],
            azure: ["API Management for tool endpoints", "Azure Functions for execution", "Managed Identities for permissions"],
            gcp:   ["Cloud Endpoints for tool endpoints", "Cloud Functions for execution", "Workload Identity for permissions"],
          },
        },
      },
      {
        name: "Enterprise connectors",
        geap: "Included", claude: "Wire up", chatgpt: "Wire up",
        why: {
          geap:    "Google Workspace, SAP, Salesforce and 100+ governed connectors ship in platform.",
          claude:  "No managed connector layer; you integrate enterprise systems or use 3P.",
          chatgpt: "Connector ecosystem via plugins; not a governed enterprise integration layer.",
        },
        stitch: {
          claude: {
            aws:   ["AppFlow for SaaS connectors", "API Gateway + Lambda for custom", "EventBridge for events"],
            azure: ["Logic Apps for SaaS connectors", "API Management for custom", "Service Bus for events"],
            gcp:   ["Application Integration for SaaS", "Apigee for custom APIs", "Pub/Sub for events"],
          },
          chatgpt: {
            aws:   ["AppFlow for SaaS connectors", "API Gateway + Lambda for custom", "EventBridge for events"],
            azure: ["Logic Apps for SaaS connectors", "API Management for custom", "Service Bus for events"],
            gcp:   ["Application Integration for SaaS", "Apigee for custom APIs", "Pub/Sub for events"],
          },
        },
      },
      {
        name: "Session & state",
        geap: "Included", claude: "Wire up", chatgpt: "First-party",
        why: {
          geap:    "Vertex AI managed session store; state persists across turns automatically.",
          claude:  "Projects provide shared context; durable session state needs external storage.",
          chatgpt: "Thread management built into Assistants API.",
        },
        stitch: {
          claude: {
            aws:   ["ElastiCache (Redis) for hot state", "DynamoDB for session persistence", "S3 for large context"],
            azure: ["Azure Cache for Redis for hot state", "Cosmos DB for persistence", "Blob Storage for large context"],
            gcp:   ["Memorystore (Redis) for hot state", "Firestore for persistence", "Cloud Storage for large context"],
          },
        },
      },
    ],
  },
  {
    number: "02", label: "Operate", tagline: "Run safely",
    capabilities: [
      {
        name: "Managed runtime",
        geap: "Included", claude: "Wire up", chatgpt: "Wire up",
        why: {
          geap:    "Cloud Run + Vertex AI execution environment managed end-to-end by Google.",
          claude:  "API for inference only; execution environment and infrastructure are yours.",
          chatgpt: "Chat is hosted; agent execution runtime is customer-owned.",
        },
        stitch: {
          claude: {
            aws:   ["ECS Fargate (serverless containers)", "ECR (image registry)", "ALB + Route 53 (ingress)"],
            azure: ["Container Apps (serverless runtime)", "ACR (image registry)", "API Management (ingress)"],
            gcp:   ["Cloud Run (serverless containers)", "Artifact Registry (images)", "Cloud Load Balancing (ingress)"],
          },
          chatgpt: {
            aws:   ["ECS Fargate (agent runtime)", "ECR (image registry)", "ALB + Route 53 (ingress)"],
            azure: ["Container Apps (agent runtime)", "ACR (image registry)", "API Management (ingress)"],
            gcp:   ["Cloud Run (agent runtime)", "Artifact Registry (images)", "Cloud Load Balancing (ingress)"],
          },
        },
      },
      {
        name: "Identity / SSO / IAM",
        geap: "Included", claude: "Included", chatgpt: "Included",
        why: {
          geap:    "Cloud IAM + Google Workspace federation; agent identity tied to org directory.",
          claude:  "SAML/SSO, SCIM provisioning, and domain verification included in Enterprise.",
          chatgpt: "SSO/SAML and domain-level user management included in ChatGPT Enterprise.",
        },
        stitch: {},
      },
      {
        name: "Delegated authorization",
        geap: "Included", claude: "Wire up", chatgpt: "Wire up",
        why: {
          geap:    "VPC-SC + IAM conditions scope agent actions to defined resource boundaries.",
          claude:  "No delegated permission model for agents; you wire scoping into your app layer.",
          chatgpt: "Action permissions are defined per-GPT; enterprise-grade scoping is customer-built.",
        },
        stitch: {
          claude: {
            aws:   ["IAM STS AssumeRole (scoped tokens)", "API Gateway Lambda Authorizer", "Secrets Manager (credential vending)"],
            azure: ["Entra ID App Roles + scopes", "Managed Identities (per-agent identity)", "API Management policies (enforcement)"],
            gcp:   ["Workload Identity Federation", "IAM conditions (scoped resource access)", "Cloud Endpoints (policy enforcement)"],
          },
          chatgpt: {
            aws:   ["IAM STS AssumeRole (scoped tokens)", "API Gateway Lambda Authorizer", "Secrets Manager (credential vending)"],
            azure: ["Entra ID App Roles + scopes", "Managed Identities (per-agent identity)", "API Management policies (enforcement)"],
            gcp:   ["Workload Identity Federation", "IAM conditions (scoped resource access)", "Cloud Endpoints (policy enforcement)"],
          },
        },
      },
      {
        name: "Policy & safety rails",
        geap: "Included", claude: "Included", chatgpt: "Included",
        why: {
          geap:    "DLP, Apigee API management, and Vertex AI safety filters enforced in platform.",
          claude:  "Constitutional AI and safety classifiers run on every response.",
          chatgpt: "OpenAI safety systems plus admin-configurable enterprise content controls.",
        },
        stitch: {},
      },
      {
        name: "Human escalation",
        geap: "Included", claude: "You build", chatgpt: "You build",
        why: {
          geap:    "Approval workflows and human-in-the-loop steps built into Agent Builder.",
          claude:  "No managed escalation layer; interrupt and approval workflows are customer-built.",
          chatgpt: "No managed escalation; your application handles when to pause and seek approval.",
        },
        stitch: {
          claude: {
            aws:   ["Step Functions (approval workflow)", "SNS / SES (notifications)", "API Gateway (approval webhook)"],
            azure: ["Logic Apps (approval workflow)", "Azure Communication Services (notify)", "Power Automate (human tasks)"],
            gcp:   ["Workflows (approval flow)", "Pub/Sub (notifications)", "Cloud Tasks (async approval)"],
          },
          chatgpt: {
            aws:   ["Step Functions (approval workflow)", "SNS / SES (notifications)", "API Gateway (approval webhook)"],
            azure: ["Logic Apps (approval workflow)", "Azure Communication Services (notify)", "Power Automate (human tasks)"],
            gcp:   ["Workflows (approval flow)", "Pub/Sub (notifications)", "Cloud Tasks (async approval)"],
          },
        },
      },
      {
        name: "Audit & compliance logs",
        geap: "Included", claude: "Included", chatgpt: "Included",
        why: {
          geap:    "Cloud Audit Logs + Data Loss Prevention; compliance evidence packaging included.",
          claude:  "Audit log export, SOC 2 Type II, HIPAA BAA available in Enterprise tier.",
          chatgpt: "Admin audit logs, SOC 2 Type II, HIPAA available in ChatGPT Enterprise.",
        },
        stitch: {},
      },
    ],
  },
  {
    number: "03", label: "Scale", tagline: "Handle growth",
    capabilities: [
      {
        name: "Autoscale & workload isolation",
        geap: "Included", claude: "Wire up", chatgpt: "Wire up",
        why: {
          geap:    "Cloud Run autoscaling + VPC workload isolation managed end-to-end.",
          claude:  "Anthropic manages API capacity; execution infra isolation is yours.",
          chatgpt: "OpenAI manages model capacity; your execution environment is yours.",
        },
        stitch: {
          claude: {
            aws:   ["ECS Service Auto Scaling (task scaling)", "VPC + Security Groups (isolation)", "NAT Gateway (egress control)"],
            azure: ["Container Apps autoscale (KEDA rules)", "VNet + NSGs (isolation)", "Private Endpoints (egress control)"],
            gcp:   ["Cloud Run min/max instances", "VPC + VPC Connector (isolation)", "Serverless VPC Access (egress)"],
          },
          chatgpt: {
            aws:   ["ECS Service Auto Scaling (task scaling)", "VPC + Security Groups (isolation)", "NAT Gateway (egress control)"],
            azure: ["Container Apps autoscale (KEDA rules)", "VNet + NSGs (isolation)", "Private Endpoints (egress control)"],
            gcp:   ["Cloud Run min/max instances", "VPC + VPC Connector (isolation)", "Serverless VPC Access (egress)"],
          },
        },
      },
      {
        name: "Agent-to-agent (A2A)",
        geap: "Included", claude: "First-party", chatgpt: "First-party",
        why: {
          geap:    "A2A coordination protocol built into Agent Builder; specialist routing managed.",
          claude:  "SDK supports multi-agent; cross-agent coordination is customer-architected.",
          chatgpt: "Assistants can hand off tasks; multi-agent topology is customer-designed.",
        },
        stitch: {
          claude: {
            aws:   ["SQS (async task queuing)", "API Gateway (synchronous handoff)", "EventBridge (event-driven routing)"],
            azure: ["Service Bus (async queuing)", "API Management (sync handoff)", "Event Grid (event routing)"],
            gcp:   ["Pub/Sub (async task queuing)", "Cloud Endpoints (sync handoff)", "Eventarc (event routing)"],
          },
          chatgpt: {
            aws:   ["SQS (async task queuing)", "API Gateway (synchronous handoff)", "EventBridge (event-driven routing)"],
            azure: ["Service Bus (async queuing)", "API Management (sync handoff)", "Event Grid (event routing)"],
            gcp:   ["Pub/Sub (async task queuing)", "Cloud Endpoints (sync handoff)", "Eventarc (event routing)"],
          },
        },
      },
      {
        name: "Release & rollback controls",
        geap: "Included", claude: "You build", chatgpt: "You build",
        why: {
          geap:    "Vertex AI deployment versions, traffic splitting, and rollback in platform.",
          claude:  "No managed agent release system; versioning and rollback are customer-built.",
          chatgpt: "No agent deployment management; your team builds the CD pipeline.",
        },
        stitch: {
          claude: {
            aws:   ["CodePipeline (CI/CD pipeline)", "CodeDeploy (blue/green rollout)", "Parameter Store (config versioning)"],
            azure: ["Azure Pipelines (CI/CD)", "Deployment Slots (blue/green)", "App Configuration (versioned config)"],
            gcp:   ["Cloud Build (CI/CD)", "Cloud Deploy (progressive delivery)", "Secret Manager + config versioning"],
          },
          chatgpt: {
            aws:   ["CodePipeline (CI/CD pipeline)", "CodeDeploy (blue/green rollout)", "Parameter Store (config versioning)"],
            azure: ["Azure Pipelines (CI/CD)", "Deployment Slots (blue/green)", "App Configuration (versioned config)"],
            gcp:   ["Cloud Build (CI/CD)", "Cloud Deploy (progressive delivery)", "Secret Manager + config versioning"],
          },
        },
      },
      {
        name: "Observability & tracing",
        geap: "Included", claude: "Wire up", chatgpt: "Wire up",
        why: {
          geap:    "Cloud Trace + Cloud Monitoring with agent-level metrics out of the box.",
          claude:  "API response metadata available; traces require a 3P observability product.",
          chatgpt: "Usage dashboards in admin console; deep tracing requires a 3P product.",
        },
        stitch: {
          claude: {
            aws:   ["CloudWatch (metrics + logs)", "X-Ray (distributed tracing)", "+ Langfuse or Datadog (LLM-specific traces)"],
            azure: ["Application Insights (traces + metrics)", "Log Analytics Workspace (logs)", "+ Langfuse or Datadog (LLM-specific)"],
            gcp:   ["Cloud Trace (distributed tracing)", "Cloud Monitoring (metrics)", "+ Langfuse or Datadog (LLM-specific)"],
          },
          chatgpt: {
            aws:   ["CloudWatch (metrics + logs)", "X-Ray (distributed tracing)", "+ Langfuse or Datadog (LLM-specific traces)"],
            azure: ["Application Insights (traces + metrics)", "Log Analytics Workspace (logs)", "+ Langfuse or Datadog (LLM-specific)"],
            gcp:   ["Cloud Trace (distributed tracing)", "Cloud Monitoring (metrics)", "+ Langfuse or Datadog (LLM-specific)"],
          },
        },
      },
      {
        name: "Incident response",
        geap: "Included", claude: "You build", chatgpt: "You build",
        why: {
          geap:    "Integrated rollback triggers, circuit breakers, and alerting in Cloud Ops.",
          claude:  "No managed incident tooling; your team defines and executes the recovery playbook.",
          chatgpt: "No managed rollback; incident response and recovery are customer-owned.",
        },
        stitch: {
          claude: {
            aws:   ["CloudWatch Alarms (detection)", "Systems Manager OpsCenter (triage)", "CodeDeploy rollback trigger"],
            azure: ["Azure Monitor Alerts (detection)", "Azure Service Health (status)", "Pipelines rollback stage"],
            gcp:   ["Cloud Monitoring Alerts (detection)", "Error Reporting (triage)", "Cloud Deploy rollback target"],
          },
          chatgpt: {
            aws:   ["CloudWatch Alarms (detection)", "Systems Manager OpsCenter (triage)", "CodeDeploy rollback trigger"],
            azure: ["Azure Monitor Alerts (detection)", "Azure Service Health (status)", "Pipelines rollback stage"],
            gcp:   ["Cloud Monitoring Alerts (detection)", "Error Reporting (triage)", "Cloud Deploy rollback target"],
          },
        },
      },
    ],
  },
  {
    number: "04", label: "Optimize", tagline: "Improve continuously",
    capabilities: [
      {
        name: "Grounding & RAG",
        geap: "Included", claude: "Wire up", chatgpt: "First-party",
        why: {
          geap:    "Vertex AI Search + enterprise RAG pipeline managed in platform.",
          claude:  "Context window available; grounding pipeline and index management are customer-built.",
          chatgpt: "File search and retrieval built into Assistants API; index maintenance is yours.",
        },
        stitch: {
          claude: {
            aws:   ["Bedrock Knowledge Bases (managed RAG)", "OpenSearch Serverless (vector store)", "S3 (document store)"],
            azure: ["Azure AI Search (vector + keyword)", "Azure Blob Storage (document store)", "Azure OpenAI (embeddings)"],
            gcp:   ["Vertex AI Search (managed retrieval)", "Cloud Storage (document store)", "Vertex AI Embeddings"],
          },
        },
      },
      {
        name: "Long-term memory",
        geap: "Included", claude: "Wire up", chatgpt: "First-party",
        why: {
          geap:    "Vertex AI managed per-agent memory; cross-session continuity automatic.",
          claude:  "Projects provide shared context; persistent cross-session memory is customer-built.",
          chatgpt: "Memory feature available across conversations in ChatGPT Enterprise.",
        },
        stitch: {
          claude: {
            aws:   ["DynamoDB (structured memory store)", "ElastiCache (session cache)", "Bedrock Memory (if using Bedrock)"],
            azure: ["Cosmos DB (structured memory)", "Azure Cache for Redis (session cache)", "Blob Storage (long-form context)"],
            gcp:   ["Firestore (structured memory)", "Memorystore Redis (session cache)", "Cloud Storage (long-form context)"],
          },
        },
      },
      {
        name: "Model routing",
        geap: "Included", claude: "First-party", chatgpt: "First-party",
        why: {
          geap:    "Intelligent routing across the Gemini model family with cost and latency targets.",
          claude:  "Model selection via API parameter; routing logic between models is customer code.",
          chatgpt: "GPT model selection per request; cross-model routing rules are customer-built.",
        },
        stitch: {
          claude: {
            aws:   ["API Gateway (routing layer)", "Lambda (routing logic)", "CloudWatch (latency/cost signals)"],
            azure: ["API Management (routing policies)", "Functions (routing logic)", "Azure Monitor (signals)"],
            gcp:   ["Cloud Endpoints / Apigee (routing)", "Cloud Functions (routing logic)", "Cloud Monitoring (signals)"],
          },
          chatgpt: {
            aws:   ["API Gateway (routing layer)", "Lambda (routing logic)", "CloudWatch (latency/cost signals)"],
            azure: ["API Management (routing policies)", "Functions (routing logic)", "Azure Monitor (signals)"],
            gcp:   ["Cloud Endpoints / Apigee (routing)", "Cloud Functions (routing logic)", "Cloud Monitoring (signals)"],
          },
        },
      },
      {
        name: "Evals & regression",
        geap: "Included", claude: "First-party", chatgpt: "First-party",
        why: {
          geap:    "Vertex AI Evals and Model Garden benchmarking integrated in platform.",
          claude:  "API-based prompt testing available; production eval suites are customer-built.",
          chatgpt: "OpenAI Evals framework available; regression pipelines are customer-built.",
        },
        stitch: {
          claude: {
            aws:   ["CodePipeline (eval gate in CI/CD)", "S3 (eval dataset store)", "CloudWatch (eval metric tracking)"],
            azure: ["Azure Pipelines (eval gate)", "Blob Storage (eval datasets)", "Azure ML (eval runs)"],
            gcp:   ["Cloud Build (eval gate)", "Cloud Storage (eval datasets)", "Vertex AI Pipelines (eval runs)"],
          },
          chatgpt: {
            aws:   ["CodePipeline (eval gate in CI/CD)", "S3 (eval dataset store)", "CloudWatch (eval metric tracking)"],
            azure: ["Azure Pipelines (eval gate)", "Blob Storage (eval datasets)", "Azure ML (eval runs)"],
            gcp:   ["Cloud Build (eval gate)", "Cloud Storage (eval datasets)", "Vertex AI Pipelines (eval runs)"],
          },
        },
      },
      {
        name: "Agent registry & catalog",
        geap: "Included", claude: "You build", chatgpt: "You build",
        why: {
          geap:    "Agent catalog, versioning, and ownership tracking in Vertex AI.",
          claude:  "No managed registry; you build catalog, discovery, and lifecycle tooling.",
          chatgpt: "GPT builder gallery is not an enterprise registry; you build your own.",
        },
        stitch: {
          claude: {
            aws:   ["DynamoDB (registry store)", "API Gateway (discovery API)", "SSM Parameter Store (metadata)"],
            azure: ["Cosmos DB (registry store)", "API Management (discovery API)", "App Configuration (metadata)"],
            gcp:   ["Firestore (registry store)", "Cloud Endpoints (discovery API)", "Secret Manager (metadata)"],
          },
          chatgpt: {
            aws:   ["DynamoDB (registry store)", "API Gateway (discovery API)", "SSM Parameter Store (metadata)"],
            azure: ["Cosmos DB (registry store)", "API Management (discovery API)", "App Configuration (metadata)"],
            gcp:   ["Firestore (registry store)", "Cloud Endpoints (discovery API)", "Secret Manager (metadata)"],
          },
        },
      },
      {
        name: "Cost & quota controls",
        geap: "Included", claude: "Wire up", chatgpt: "Included",
        why: {
          geap:    "Cloud billing, per-agent quotas, and budget alerts managed in platform.",
          claude:  "Usage limits and spend dashboard available; per-workload attribution needs wiring.",
          chatgpt: "Admin-level spend limits and usage controls included in ChatGPT Enterprise.",
        },
        stitch: {
          claude: {
            aws:   ["AWS Budgets (spend alerts)", "Cost Explorer + tags (attribution)", "Service Quotas (rate control)"],
            azure: ["Azure Cost Management (budgets)", "Cost allocation tags (attribution)", "APIM quotas (rate control)"],
            gcp:   ["Cloud Billing budgets (spend alerts)", "Labels for cost attribution", "Quotas API (rate control)"],
          },
        },
      },
    ],
  },
];

function coverageScore(platformId: PlatformId) {
  let included = 0, total = 0;
  PHASES.forEach((phase) => phase.capabilities.forEach((cap) => { total++; if (cap[platformId] === "Included") included++; }));
  return { included, total };
}

export default function BOSOFramework() {
  const [selected, setSelected] = useState<PlatformId>("geap");
  const [hyperscaler, setHyperscaler] = useState<Hyperscaler>("aws");

  const isGeap = selected === "geap";
  return (
    <section id="boso" className="scroll-mt-28">
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">02 / Platform comparison</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Build → Operate → Scale → Optimize</h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-500">
          Select a platform and your cloud to see exactly what each capability requires — which services to wire, and what your team needs to build.
        </p>
      </div>

      {/* Platform + hyperscaler selectors */}
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS.map((p) => {
            const score = coverageScore(p.id);
            const isActive = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`rounded-2xl border-2 p-3 text-left transition-all ${isActive ? `${p.accentBorder} ${p.accentBg}` : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
              >
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? p.accentText : "text-slate-400"}`}>{p.vendor}</p>
                <p className={`mt-0.5 text-sm font-extrabold leading-tight ${isActive ? "text-slate-950" : "text-slate-700"}`}>{p.name}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${Math.round((score.included / score.total) * 100)}%` }} />
                  </div>
                  <span className={`text-[9px] font-bold tabular-nums ${isActive ? p.accentText : "text-slate-400"}`}>{score.included}/{score.total}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className={`flex flex-col justify-center rounded-2xl border-2 px-4 py-3 transition-all ${isGeap ? "border-slate-100 bg-slate-50" : "border-blue-100 bg-blue-50"}`}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Cloud size={12} />
            {isGeap ? "Runs on" : "Deploy on"}
          </div>
          <div className="mt-2 flex flex-col gap-1.5 sm:flex-row">
            {isGeap ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Google Cloud (fixed)
              </span>
            ) : (
              HYPERSCALERS.map((hs) => (
                <label key={hs.id} className={`flex cursor-pointer items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-bold transition-all ${hyperscaler === hs.id ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                  <input type="radio" name="hyperscaler" value={hs.id} checked={hyperscaler === hs.id} onChange={() => setHyperscaler(hs.id)} className="sr-only" />
                  <span className={`h-2 w-2 rounded-full ${hyperscaler === hs.id ? "bg-white" : "bg-slate-300"}`} />
                  {hs.label}
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.entries(STATUS_META) as [Status, typeof STATUS_META[Status]][]).map(([label, meta]) => {
          const Icon = meta.icon;
          return (
            <span key={label} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${meta.bg} ${meta.border} ${meta.text}`}>
              <Icon size={11} /> {label}
            </span>
          );
        })}
      </div>

      {/* BOSO phases */}
      <div className="space-y-3">
        {PHASES.map((phase) => {
          const phaseIncluded = phase.capabilities.filter((c) => c[selected] === "Included").length;
          const phaseSDK     = phase.capabilities.filter((c) => c[selected] === "First-party").length;
          const phaseWire    = phase.capabilities.filter((c) => c[selected] === "Wire up").length;
          const phaseBuild   = phase.capabilities.filter((c) => c[selected] === "You build").length;

          return (
            <div key={phase.label} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-950 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{phase.number}</span>
                  <span className="text-base font-black text-white">{phase.label}</span>
                  <span className="text-sm text-slate-400">— {phase.tagline}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  {phaseIncluded > 0 && <span className="text-emerald-400">{phaseIncluded} included</span>}
                  {phaseSDK > 0     && <span className="text-slate-400">{phaseSDK} SDK</span>}
                  {phaseWire > 0    && <span className="text-amber-400">{phaseWire} wire</span>}
                  {phaseBuild > 0   && <span className="text-rose-400">{phaseBuild} build</span>}
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[560px]">
                  <div className="grid border-b border-slate-100 bg-slate-50" style={{ gridTemplateColumns: "minmax(160px,1.8fr) repeat(3, 1fr)" }}>
                    <div className="px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">Capability</div>
                    {PLATFORMS.map((p) => (
                      <div key={p.id} className={`border-l border-slate-100 px-3 py-2 ${selected === p.id ? p.accentBg : ""}`}>
                        <p className={`text-[9px] font-bold uppercase tracking-wider ${selected === p.id ? p.accentText : "text-slate-400"}`}>{p.vendor}</p>
                        <p className={`text-[10px] font-extrabold leading-tight ${selected === p.id ? "text-slate-900" : "text-slate-500"}`}>{p.name}</p>
                      </div>
                    ))}
                  </div>

                  {phase.capabilities.map((cap, i) => {
                    const isLast = i === phase.capabilities.length - 1;
                    return (
                      <div key={cap.name} className={`grid ${!isLast ? "border-b border-slate-100" : ""}`} style={{ gridTemplateColumns: "minmax(160px,1.8fr) repeat(3, 1fr)" }}>
                        <div className="flex items-start px-4 py-3">
                          <p className="text-xs font-semibold text-slate-800">{cap.name}</p>
                        </div>
                        {PLATFORMS.map((p) => {
                          const status = cap[p.id];
                          const meta = STATUS_META[status];
                          const Icon = meta.icon;
                          const isActive = p.id === selected;
                          const services = cap.stitch[p.id]?.[hyperscaler];
                          const showStitch = isActive && status !== "Included" && services && services.length > 0;

                          return (
                            <div key={p.id} className={`border-l border-slate-100 px-3 py-3 ${isActive ? p.accentBg : ""}`}>
                              <div className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] font-bold ${meta.bg} ${meta.border} ${meta.text} ${isActive ? "opacity-100" : "opacity-30"}`}>
                                <Icon size={10} />
                                <span>{meta.shortLabel}</span>
                              </div>
                              {showStitch && (
                                <div className="mt-2 space-y-1">
                                  {services!.map((svc) => (
                                    <div key={svc} className="flex items-start gap-1.5">
                                      <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                                      <p className="text-[10px] leading-snug text-slate-600">{svc}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
        {PLATFORMS.map((p) => {
          const score = coverageScore(p.id);
          const gaps = score.total - score.included;
          const isActive = p.id === selected;
          return (
            <button key={p.id} onClick={() => setSelected(p.id)}
              className={`rounded-xl p-3 text-left transition-all ${isActive ? `border-2 ${p.accentBorder} ${p.accentBg}` : "border border-slate-200 bg-white hover:bg-slate-50"}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? p.accentText : "text-slate-400"}`}>{p.name}</p>
              <p className={`mt-1 text-sm font-black ${gaps === 0 ? "text-emerald-700" : gaps > 12 ? "text-rose-700" : "text-amber-700"}`}>
                {gaps === 0 ? "Full coverage" : `${gaps} capabilities to wire or build`}
              </p>
            </button>
          );
        })}
      </div>
      {/* De-bias callout */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Coverage score ≠ best choice</p>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          Platform coverage shows what ships versus what your team builds. It is one dimension, not the whole decision.
          Assembly burden is real, but so are platform concentration and switching cost. These platform-specific strengths
          often matter more than the coverage gap.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Gemini Enterprise Agent Platform</p>
            <p className="text-xs leading-relaxed text-slate-600">Strongest when the estate is broad, regulated, or customer-facing and the team wants one vendor to own runtime, governance, and audit — at the cost of platform concentration.</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Claude Enterprise</p>
            <p className="text-xs leading-relaxed text-slate-600">Strongest for reasoning-heavy or sensitive workloads — complex document analysis, legal review, nuanced judgment calls. No training on your data. Assembly burden is manageable at lower scale or with existing-tool coverage.</p>
          </div>
          <div className="rounded-xl bg-teal-50 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">ChatGPT Enterprise</p>
            <p className="text-xs leading-relaxed text-slate-600">Strongest when the organisation already has ChatGPT seats and adoption is the bottleneck. User familiarity reduces training cost. Ecosystem breadth (plugins, integrations) reduces custom build for common use cases.</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        <strong className="text-slate-700">Wire up</strong> = a managed service exists; shown services are what you connect, configure, and maintain. <strong className="text-slate-700">You build</strong> = no off-the-shelf option; shown services are what you build on top of. <strong className="text-slate-700">First-party / SDK</strong> = the provider ships it but your team owns deploying and operating the runtime.
      </p>
    </section>
  );
}
