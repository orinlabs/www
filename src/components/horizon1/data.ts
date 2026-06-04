// ===========================================================================
// Horizon-1: single source of truth.
//
// Every Horizon-1 component (the scatter chart, the results table, and the
// Tufte figures) reads its numbers from this file. Keep all benchmark data and
// the shared formatting helpers here so a new run only ever edits one place.
// ===========================================================================

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type AgentType =
  | "Claude Code"
  | "Codex"
  | "RAG"
  | "Hermes"
  | "RLM";

export type ScaleType = "linear" | "log";

export type MetricKey = "costUsd" | "timeSec" | "tokens" | "releaseDate";

export interface ResultRow {
  id: string;
  agentType: AgentType;
  model: string;
  completion: number;
  costUsd: number;
  tokens: number;
  timeSec?: number;
  // Model release date as a millisecond timestamp (derived from MODEL_RELEASE_DATES).
  releaseDate: number;
  // Optional override for the tokens cell (e.g. approximate/footnoted values).
  tokensLabel?: string;
  // When set, excluded from the Time chart and shown in the table instead of fmtTime.
  timeLabel?: string;
}

export interface MetricDef {
  id: MetricKey;
  label: string;
  format: (v: number) => string;
  // Snap an arbitrary tick value to the nearest clean value for this metric
  // (e.g. whole seconds for time, cents for cost) so labels stay tidy.
  snap: (v: number) => number;
  // Number of axis ticks to render (defaults to 6).
  tickCount?: number;
  // Metrics that can't sensibly use a log scale (e.g. dates) force linear.
  forceLinear?: boolean;
}

export interface ArchitectureSpreadRow {
  model: string;
  worstH: string;
  low: number;
  bestH: string;
  high: number;
}

export interface DifficultyFamily {
  // Key into each DifficultyLevel row (no spaces, used as a recharts dataKey).
  id: "RLM" | "ClaudeCode" | "RAG" | "Hermes";
  label: string;
  // Key into the shared agent palette.
  colorKey: AgentType;
}

export interface DifficultyLevel {
  level: string;
  RLM: number;
  ClaudeCode: number;
  RAG: number;
  Hermes: number;
  // Across-the-board mean, drawn as the dashed reference line.
  ALL: number;
}

export interface DifficultyAxis {
  key: string;
  title: string;
  drop: string;
  data: DifficultyLevel[];
}

export interface ContentFlag {
  label: string;
  value: number;
  desc: string;
}

export interface AdversarialRow {
  family: string;
  clean: number;
  adv: number;
}

export interface ConvergencePoint {
  x: string;
  nonadv: number;
  adv: number;
}

// ---------------------------------------------------------------------------
// Formatting helpers (shared by the chart axes and the results table)
// ---------------------------------------------------------------------------

export function fmtCost(v: number) {
  return `$${v.toFixed(3)}`;
}

export function fmtCostAxis(v: number) {
  return `$${v.toFixed(2)}`;
}

export function fmtPct(v: number) {
  return `${v.toFixed(1)}%`;
}

export function fmtTime(v: number) {
  const m = Math.floor(v / 60);
  const s = Math.round(v % 60);
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

export function fmtTokens(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return `${v}`;
}

export function fmtDateAxis(v: number) {
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

export function fmtDate(v: number) {
  return new Date(v).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Snap a timestamp down to the first of its month so date ticks stay tidy.
export function snapToMonth(v: number) {
  const d = new Date(v);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
}

// ---------------------------------------------------------------------------
// Leaderboard: one (agent type × model) configuration per row
// ---------------------------------------------------------------------------

// Public release date per model, ISO yyyy-mm-dd. Used to plot completion
// against model recency and to show a release column in the table.
export const MODEL_RELEASE_DATES: Record<string, string> = {
  "gpt-5": "2025-08-07",
  "gpt-5-mini": "2025-08-07",
  "gpt-5-codex": "2025-09-15",
  "claude-sonnet-4.5": "2025-09-29",
  "claude-haiku-4.5": "2025-10-15",
  "gemini-3.5-flash": "2026-05-19",
  "gpt-5.3-codex": "2026-02-05",
  "claude-opus-4.8": "2026-05-28",
  "gpt-5.5": "2026-04-24",
  "claude-sonnet-4.6": "2026-02-17",
};

// Preview run results. Each row is one (agent type × model) configuration.
const RAW_RESULTS: Omit<ResultRow, "releaseDate">[] = [
  { id: "cc-sonnet", agentType: "Claude Code", model: "claude-sonnet-4.5", completion: 31.6, costUsd: 0.454, tokens: 907_196, timeSec: 130.4 },
  { id: "cc-opus", agentType: "Claude Code", model: "claude-opus-4.8", completion: 44.8, costUsd: 2.519, tokens: 1_011_333, timeSec: 123.4 },
  { id: "rag-gpt5-mini", agentType: "RAG", model: "gpt-5-mini", completion: 19.5, costUsd: 0.023, tokens: 83_114, timeSec: 151.5 },
  { id: "rag-haiku", agentType: "RAG", model: "claude-haiku-4.5", completion: 31.8, costUsd: 0.189, tokens: 181_134, timeSec: 135.2 },
  { id: "rag-gemini", agentType: "RAG", model: "gemini-3.5-flash", completion: 12.8, costUsd: 0.273, tokens: 268_724, timeSec: 146.6 },
  { id: "rlm-gemini", agentType: "RLM", model: "gemini-3.5-flash", completion: 9.8, costUsd: 0.25, tokens: 247_101, timeSec: 278 },
  { id: "rag-sonnet", agentType: "RAG", model: "claude-sonnet-4.5", completion: 33.3, costUsd: 0.529, tokens: 169_467, timeSec: 155.3 },
  { id: "rlm-sonnet45", agentType: "RLM", model: "claude-sonnet-4.5", completion: 39.2, costUsd: 1.19, tokens: 490_595, timeSec: 228 },
  { id: "rag-gpt55", agentType: "RAG", model: "gpt-5.5", completion: 39.5, costUsd: 0.672, tokens: 214_835, timeSec: 202.2 },
  { id: "rag-opus", agentType: "RAG", model: "claude-opus-4.8", completion: 36.9, costUsd: 1.016, tokens: 191_429, timeSec: 184.2 },
  { id: "codex-gpt5", agentType: "Codex", model: "gpt-5-codex", completion: 46.2, costUsd: 0.342, tokens: 1_000_000, timeSec: 350 },
  { id: "codex-gpt53", agentType: "Codex", model: "gpt-5.3-codex", completion: 48.5, costUsd: 0.424, tokens: 824_000, timeSec: 357 },
  { id: "hermes-gpt55", agentType: "Hermes", model: "gpt-5.5", completion: 36.4, costUsd: 3.96, tokens: 100_000, timeSec: 145, tokensLabel: "~100k*" },
  { id: "hermes-opus", agentType: "Hermes", model: "claude-opus-4.8", completion: 35.9, costUsd: 4.25, tokens: 207_000, timeSec: 147, tokensLabel: "~207k" },
  { id: "hermes-sonnet", agentType: "Hermes", model: "claude-sonnet-4.5", completion: 29.2, costUsd: 3.780, tokens: 198_000, timeSec: 130, tokensLabel: "~198k*" },
  { id: "hermes-haiku", agentType: "Hermes", model: "claude-haiku-4.5", completion: 21.5, costUsd: 3.33, tokens: 171_000, timeSec: 100, tokensLabel: "~171k*" },
  { id: "hermes-gemini", agentType: "Hermes", model: "gemini-3.5-flash", completion: 40.5, costUsd: 5.071, tokens: 1_191_000, timeSec: 228, tokensLabel: "~1,191k*" },
  { id: "hermes-gpt5-mini", agentType: "Hermes", model: "gpt-5-mini", completion: 6.2, costUsd: 3.202, tokens: 208_000, timeSec: 178, tokensLabel: "~208k*" },
  { id: "rlm-gpt5-mini", agentType: "RLM", model: "gpt-5-mini", completion: 24.6, costUsd: 0.076, tokens: 340_000, timeSec: 203, tokensLabel: "340k" },
  { id: "rlm-opus", agentType: "RLM", model: "claude-opus-4.8", completion: 55.9, costUsd: 0.785, tokens: 376_000, timeSec: 212, tokensLabel: "376k" },
  { id: "rlm-sonnet", agentType: "RLM", model: "claude-sonnet-4.6", completion: 49.7, costUsd: 0.954, tokens: 1_101_000, timeSec: 353 },
  { id: "rlm-haiku", agentType: "RLM", model: "claude-haiku-4.5", completion: 38.1, costUsd: 0.157, tokens: 516_000, timeSec: 191, tokensLabel: "516k" },
  { id: "rlm-gpt5", agentType: "RLM", model: "gpt-5", completion: 50.8, costUsd: 0.400, tokens: 473_000, timeSec: 374, tokensLabel: "473k" },
  { id: "rlm-gpt55", agentType: "RLM", model: "gpt-5.5", completion: 51.8, costUsd: 0.673, tokens: 298_086, timeSec: 169.4 },
];

export const RESULTS: ResultRow[] = RAW_RESULTS.map((r) => ({
  ...r,
  releaseDate: Date.parse(MODEL_RELEASE_DATES[r.model] ?? "2025-08-07"),
}));

export const AGENT_TYPES: AgentType[] = Array.from(
  new Set(RESULTS.map((r) => r.agentType)),
);

// ---------------------------------------------------------------------------
// Interactive scatter: selectable x-axis metrics
// ---------------------------------------------------------------------------

export const METRIC_DEFS: MetricDef[] = [
  {
    id: "costUsd",
    label: "Cost",
    format: fmtCostAxis,
    snap: (v) => Math.round(v * 100) / 100,
  },
  {
    id: "timeSec",
    label: "Time",
    format: fmtTime,
    snap: (v) => Math.round(v),
  },
  {
    id: "tokens",
    label: "Tokens",
    format: fmtTokens,
    snap: (v) => Math.round(v / 1000) * 1000,
  },
  {
    id: "releaseDate",
    label: "Release date",
    format: fmtDateAxis,
    snap: snapToMonth,
    tickCount: 5,
    forceLinear: true,
  },
];

// ---------------------------------------------------------------------------
// Figure: same model, best vs. worst harness
// ---------------------------------------------------------------------------

export const ARCHITECTURE_SPREAD: ArchitectureSpreadRow[] = [
  { model: "claude-opus-4.8", worstH: "Hermes", low: 35.9, bestH: "RLM", high: 55.9 },
  { model: "claude-haiku-4.5", worstH: "Hermes", low: 21.5, bestH: "RLM", high: 38.1 },
  { model: "gpt-5-mini", worstH: "RAG", low: 19.5, bestH: "RLM", high: 24.6 },
  { model: "claude-sonnet-4.5", worstH: "Hermes", low: 29.2, bestH: "RLM", high: 39.2 },
  { model: "gpt-5.5", worstH: "Hermes", low: 36.4, bestH: "RLM", high: 51.8 },
];

// ---------------------------------------------------------------------------
// Figure: difficulty breakdown (pass rate per harness, by axis level)
// ---------------------------------------------------------------------------

export const DIFFICULTY_FAMILIES: DifficultyFamily[] = [
  { id: "RLM", label: "RLM", colorKey: "RLM" },
  { id: "ClaudeCode", label: "Claude Code", colorKey: "Claude Code" },
  { id: "RAG", label: "RAG", colorKey: "RAG" },
  { id: "Hermes", label: "Hermes", colorKey: "Hermes" },
];

// Per-harness pass rate at each level of each difficulty axis. "ALL" is the
// across-the-board mean (drawn as the dashed reference line per panel).
export const DIFFICULTY_AXES: DifficultyAxis[] = [
  {
    key: "n_hops",
    title: "Reasoning hops",
    drop: "−18.4pp",
    data: [
      { level: "1-hop", RLM: 65.8, ClaudeCode: 53.8, RAG: 50.6, Hermes: 46.8, ALL: 54.3 },
      { level: "2-hop", RLM: 47.8, ClaudeCode: 38.5, RAG: 29.3, Hermes: 29.3, ALL: 36.2 },
      { level: "3-hop", RLM: 56.5, ClaudeCode: 39.1, RAG: 21.7, Hermes: 26.1, ALL: 35.9 },
    ],
  },
  {
    key: "sd",
    title: "Semantic distance",
    drop: "−9.5pp",
    data: [
      { level: "near", RLM: 59.7, ClaudeCode: 51.4, RAG: 47.2, Hermes: 50.0, ALL: 52.1 },
      { level: "mid", RLM: 50.6, ClaudeCode: 36.8, RAG: 31.2, Hermes: 23.4, ALL: 35.5 },
      { level: "far", RLM: 58.7, ClaudeCode: 46.7, RAG: 30.4, Hermes: 34.8, ALL: 42.6 },
    ],
  },
  {
    key: "md",
    title: "Memory depth",
    drop: "−6.6pp",
    data: [
      { level: "low", RLM: 59.7, ClaudeCode: 47.5, RAG: 38.7, Hermes: 41.9, ALL: 47.0 },
      { level: "mid", RLM: 58.1, ClaudeCode: 41.9, RAG: 39.5, Hermes: 37.2, ALL: 44.2 },
      { level: "high", RLM: 52.2, ClaudeCode: 43.8, RAG: 34.4, Hermes: 31.1, ALL: 40.4 },
    ],
  },
  {
    key: "adv",
    title: "Adversarial",
    drop: "−5.6pp",
    data: [
      { level: "non-adv", RLM: 57.9, ClaudeCode: 45.3, RAG: 37.9, Hermes: 38.6, ALL: 44.9 },
      { level: "adversarial", RLM: 50.9, ClaudeCode: 42.6, RAG: 34.5, Hermes: 29.1, ALL: 39.3 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Figure: pass-rate delta per content flag
// ---------------------------------------------------------------------------

export const CONTENT_FLAGS: ContentFlag[] = [
  {
    label: "Synthetic Patch",
    value: -21.6,
    desc: "A fact stated earlier in the trace is later changed or contradicted.",
  },
  {
    label: "Family Confusion",
    value: -20.3,
    desc: "Several confusable entities (e.g. family members or similarly-named people/things).",
  },
  {
    label: "Compositional",
    value: -9.4,
    desc: "The answer requires combining/chaining multiple facts from different points in the trace, not just recalling a single one.",
  },
  {
    label: "Wrong Confident",
    value: -4.3,
    desc: "Someone in the trace states something confidently but incorrectly. The agent has to not trust the confident-sounding claim.",
  },
  {
    label: "New Stakeholder",
    value: 9.5,
    desc: "A new person/actor is introduced.",
  },
  {
    label: "Constrained Selection",
    value: 15.1,
    desc: "The task limits the answer to a small, well-defined set of options instead of being open ended.",
  },
  {
    label: "Session Length",
    value: 17.9,
    desc: "Tasks tied to a dedicated/long session where the relevant info is concentrated in one place.",
  },
];

// ---------------------------------------------------------------------------
// Figure: robustness to traps (clean vs. adversarial per harness)
// ---------------------------------------------------------------------------

export const ADVERSARIAL_ROBUSTNESS: AdversarialRow[] = [
  { family: "RAG", clean: 44.3, adv: 27.3 },
  { family: "Codex", clean: 50.7, adv: 34.5 },
  { family: "Hermes", clean: 40.7, adv: 25.5 },
  { family: "RLM", clean: 57.9, adv: 50.9 },
  { family: "Claude Code", clean: 45.3, adv: 42.6 },
];

// ---------------------------------------------------------------------------
// Figure: adversarial gap by semantic distance
// ---------------------------------------------------------------------------

export const CONVERGENCE: ConvergencePoint[] = [
  { x: "near", nonadv: 46.7, adv: 32.8 },
  { x: "mid", nonadv: 35.4, adv: 28.4 },
  { x: "far", nonadv: 29.9, adv: 31.1 },
];

// ---------------------------------------------------------------------------
// Methodology: example trace shown in the article body
// ---------------------------------------------------------------------------

export const EXAMPLE_TRACE = `{"timestamp": "2026-03-19T09:42:11+00:00", "message_data": {"id": null, "type": "reasoning", "summary": "Need to grab the release tarball. Reaching for curl by default."}}
{"timestamp": "2026-03-19T09:42:12+00:00", "message_data": {"id": "tc_a1", "name": "shell_exec", "type": "function_call", "call_id": "tc_a1", "arguments": "{\\"command\\": \\"curl -fLO https://files.example.com/release-1.4.2.tar.gz\\"}"}}
{"timestamp": "2026-03-19T09:42:12+00:00", "message_data": {"type": "function_call_output", "call_id": "tc_a1", "output": "curl: symbol lookup error: undefined symbol: SSL_get1_peer_certificate\\nexit code: 127"}}
{"timestamp": "2026-03-19T09:42:14+00:00", "message_data": {"id": null, "type": "reasoning", "summary": "curl is broken on this box — bad libssl link. Falling back to wget."}}
{"timestamp": "2026-03-19T09:42:15+00:00", "message_data": {"id": "tc_a2", "name": "shell_exec", "type": "function_call", "call_id": "tc_a2", "arguments": "{\\"command\\": \\"wget https://files.example.com/release-1.4.2.tar.gz\\"}"}}
{"timestamp": "2026-03-19T09:42:18+00:00", "message_data": {"type": "function_call_output", "call_id": "tc_a2", "output": "release-1.4.2.tar.gz  100%[==================>]  18.4M ... saved"}}`;
