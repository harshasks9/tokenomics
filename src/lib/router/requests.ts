export type Complexity = "low" | "med" | "high";
export type Modality = "text" | "image" | "audio";
export type Sensitivity = "normal" | "regulated";
export type LatencySLA = "realtime" | "interactive" | "batch";
export type Scenario = "sdlc" | "inapp" | "multimodal" | "agentic";

export interface AgentRequest {
  id: string;
  scenario: Scenario;
  label: string;
  taskType: string;
  complexity: Complexity;
  modality: Modality;
  sensitivity: Sensitivity;
  latencySLA: LatencySLA;
  inTok: number;
  outTok: number;
}

type SeedRequest = Omit<AgentRequest, "id" | "scenario">;

function seed(scenario: Scenario, requests: SeedRequest[]): AgentRequest[] {
  return requests.map((request, index) => ({
    ...request,
    id: `${scenario}-${String(index + 1).padStart(2, "0")}`,
    scenario,
  }));
}

const sdlc = seed("sdlc", [
  { label: "Scaffold React component", taskType: "codegen", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "batch", inTok: 120000, outTok: 25000 },
  { label: "Explain failing unit test", taskType: "debug", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "interactive", inTok: 18000, outTok: 3500 },
  { label: "Generate API client types", taskType: "codegen", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "batch", inTok: 85000, outTok: 14000 },
  { label: "Summarize pull request", taskType: "review", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "realtime", inTok: 42000, outTok: 2200 },
  { label: "Refactor checkout state", taskType: "refactor", complexity: "med", modality: "text", sensitivity: "normal", latencySLA: "interactive", inTok: 160000, outTok: 28000 },
  { label: "Trace production memory leak", taskType: "debug", complexity: "high", modality: "text", sensitivity: "normal", latencySLA: "interactive", inTok: 260000, outTok: 32000 },
  { label: "Review authentication patch", taskType: "security-review", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 190000, outTok: 24000 },
  { label: "Design compliance rules engine", taskType: "architecture", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 400000, outTok: 60000 },
  { label: "Write database migration", taskType: "codegen", complexity: "med", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 70000, outTok: 9000 },
  { label: "Optimize search query plan", taskType: "performance", complexity: "high", modality: "text", sensitivity: "normal", latencySLA: "batch", inTok: 130000, outTok: 18000 },
  { label: "Draft release notes", taskType: "documentation", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "batch", inTok: 28000, outTok: 4000 },
  { label: "Map service dependencies", taskType: "architecture", complexity: "med", modality: "text", sensitivity: "normal", latencySLA: "interactive", inTok: 210000, outTok: 26000 },
  { label: "Review payment retry logic", taskType: "review", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 145000, outTok: 16000 },
  { label: "Generate test fixtures", taskType: "testgen", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "batch", inTok: 95000, outTok: 21000 },
  { label: "Plan monolith decomposition", taskType: "architecture", complexity: "high", modality: "text", sensitivity: "normal", latencySLA: "batch", inTok: 520000, outTok: 70000 },
  { label: "Triage CI log", taskType: "debug", complexity: "med", modality: "text", sensitivity: "normal", latencySLA: "realtime", inTok: 36000, outTok: 5000 },
]);

const inapp = seed("inapp", [
  { label: "What's an expense ratio?", taskType: "faq", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "realtime", inTok: 1500, outTok: 300 },
  { label: "Model retiring 5 years early", taskType: "reasoning", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 3000, outTok: 600 },
  { label: "Summarize monthly spending", taskType: "summary", complexity: "low", modality: "text", sensitivity: "regulated", latencySLA: "realtime", inTok: 2400, outTok: 350 },
  { label: "Why did my bill increase?", taskType: "explanation", complexity: "med", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 4200, outTok: 650 },
  { label: "Find a nearby branch", taskType: "lookup", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "realtime", inTok: 900, outTok: 120 },
  { label: "Compare mortgage options", taskType: "reasoning", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 6500, outTok: 1100 },
  { label: "Explain reward points", taskType: "faq", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "realtime", inTok: 1200, outTok: 240 },
  { label: "Draft a savings plan", taskType: "planning", complexity: "med", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 4800, outTok: 900 },
  { label: "Categorize recent purchases", taskType: "classification", complexity: "low", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 7200, outTok: 500 },
  { label: "Resolve duplicate charge", taskType: "support", complexity: "med", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 3600, outTok: 700 },
  { label: "Explain tax document", taskType: "explanation", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 9200, outTok: 1500 },
  { label: "Build a subscription budget", taskType: "planning", complexity: "med", modality: "text", sensitivity: "normal", latencySLA: "interactive", inTok: 2800, outTok: 520 },
  { label: "Forecast cash-flow gap", taskType: "forecast", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 11500, outTok: 1800 },
  { label: "Translate account alert", taskType: "translation", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "realtime", inTok: 700, outTok: 180 },
  { label: "Compare insurance coverage", taskType: "reasoning", complexity: "med", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 5800, outTok: 900 },
  { label: "Explain transfer status", taskType: "support", complexity: "low", modality: "text", sensitivity: "regulated", latencySLA: "realtime", inTok: 1400, outTok: 260 },
]);

const multimodal = seed("multimodal", [
  { label: "Photo: what changed on my statement?", taskType: "vision", complexity: "med", modality: "image", sensitivity: "regulated", latencySLA: "interactive", inTok: 10000, outTok: 800 },
  { label: "Voice: hands-free balance check", taskType: "voice", complexity: "low", modality: "audio", sensitivity: "normal", latencySLA: "realtime", inTok: 4000, outTok: 400 },
  { label: "Photo: read receipt total", taskType: "vision", complexity: "low", modality: "image", sensitivity: "normal", latencySLA: "realtime", inTok: 6500, outTok: 220 },
  { label: "Voice: dispute a card charge", taskType: "voice", complexity: "med", modality: "audio", sensitivity: "regulated", latencySLA: "interactive", inTok: 7200, outTok: 850 },
  { label: "Image: assess vehicle damage", taskType: "vision", complexity: "high", modality: "image", sensitivity: "regulated", latencySLA: "batch", inTok: 28000, outTok: 1800 },
  { label: "Voice: explain policy options", taskType: "voice", complexity: "high", modality: "audio", sensitivity: "regulated", latencySLA: "interactive", inTok: 9500, outTok: 1400 },
  { label: "Photo: identify product", taskType: "vision", complexity: "low", modality: "image", sensitivity: "normal", latencySLA: "realtime", inTok: 8200, outTok: 300 },
  { label: "Image: compare two invoices", taskType: "vision", complexity: "med", modality: "image", sensitivity: "regulated", latencySLA: "batch", inTok: 19000, outTok: 1200 },
  { label: "Voice: reorder last purchase", taskType: "voice", complexity: "low", modality: "audio", sensitivity: "normal", latencySLA: "realtime", inTok: 3600, outTok: 380 },
  { label: "Photo: inspect machine fault", taskType: "vision", complexity: "high", modality: "image", sensitivity: "normal", latencySLA: "interactive", inTok: 34000, outTok: 2200 },
  { label: "Voice: capture clinical notes", taskType: "transcription", complexity: "med", modality: "audio", sensitivity: "regulated", latencySLA: "interactive", inTok: 14000, outTok: 1600 },
  { label: "Image: extract form fields", taskType: "document", complexity: "med", modality: "image", sensitivity: "regulated", latencySLA: "batch", inTok: 22000, outTok: 1300 },
  { label: "Voice: navigate app", taskType: "voice", complexity: "low", modality: "audio", sensitivity: "normal", latencySLA: "realtime", inTok: 2200, outTok: 180 },
  { label: "Image: verify identity document", taskType: "vision", complexity: "high", modality: "image", sensitivity: "regulated", latencySLA: "interactive", inTok: 26000, outTok: 900 },
  { label: "Voice: summarize support call", taskType: "summary", complexity: "med", modality: "audio", sensitivity: "normal", latencySLA: "batch", inTok: 18000, outTok: 1500 },
  { label: "Photo: find shelf availability", taskType: "vision", complexity: "med", modality: "image", sensitivity: "normal", latencySLA: "realtime", inTok: 15000, outTok: 600 },
]);

const agentic = seed("agentic", [
  { label: "Pull portfolio data", taskType: "tool-exec", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "batch", inTok: 4000, outTok: 1000 },
  { label: "Compliance + final synthesis", taskType: "review", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 8000, outTok: 1500 },
  { label: "Check inventory availability", taskType: "tool-exec", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "realtime", inTok: 2600, outTok: 450 },
  { label: "Negotiate supplier exception", taskType: "planning", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 14000, outTok: 2400 },
  { label: "Route service ticket", taskType: "classification", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "realtime", inTok: 1800, outTok: 240 },
  { label: "Investigate refund anomaly", taskType: "reasoning", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 12500, outTok: 1800 },
  { label: "Draft customer follow-up", taskType: "generation", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "interactive", inTok: 3200, outTok: 700 },
  { label: "Plan multi-system onboarding", taskType: "planning", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 18000, outTok: 3000 },
  { label: "Update CRM opportunity", taskType: "tool-exec", complexity: "med", modality: "text", sensitivity: "normal", latencySLA: "interactive", inTok: 5200, outTok: 800 },
  { label: "Approve payment exception", taskType: "approval", complexity: "med", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 6800, outTok: 900 },
  { label: "Reconcile order mismatch", taskType: "reasoning", complexity: "med", modality: "text", sensitivity: "normal", latencySLA: "batch", inTok: 9000, outTok: 1300 },
  { label: "Research account history", taskType: "retrieval", complexity: "low", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 7600, outTok: 1000 },
  { label: "Build remediation plan", taskType: "planning", complexity: "high", modality: "text", sensitivity: "regulated", latencySLA: "interactive", inTok: 16000, outTok: 2600 },
  { label: "Schedule field technician", taskType: "tool-exec", complexity: "low", modality: "text", sensitivity: "normal", latencySLA: "realtime", inTok: 2400, outTok: 350 },
  { label: "Synthesize market research", taskType: "synthesis", complexity: "high", modality: "text", sensitivity: "normal", latencySLA: "batch", inTok: 22000, outTok: 3600 },
  { label: "Validate contract obligations", taskType: "review", complexity: "med", modality: "text", sensitivity: "regulated", latencySLA: "batch", inTok: 15000, outTok: 1900 },
]);

export const REQUESTS: Record<Scenario, AgentRequest[]> = {
  sdlc,
  inapp,
  multimodal,
  agentic,
};

export const SCENARIO_LABELS: Record<Scenario, string> = {
  sdlc: "SDLC",
  inapp: "In-App",
  multimodal: "Multimodal",
  agentic: "Agentic",
};
