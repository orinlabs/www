// ===========================================================================
// Horizon: single source of truth.
//
// Every Horizon component (the scatter chart, the results table, and the
// Tufte figures) reads its numbers from this file. Keep all benchmark data and
// the shared formatting helpers here so a new run only ever edits one place.
// ===========================================================================

import {
  aggregateRuns,
  displayHarness,
  poolByTaskClassifier,
  poolByTaskClassifierByHarness,
  poolByTaskField,
  poolByTaskFieldByHarness,
  type TaskMeta,
} from "./combined";
import { COMBINED } from "./combinedResults";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type AgentType =
  | "Claude Code"
  | "Codex"
  | "RAG"
  | "Hermes"
  | "RLM"
  | "OpenClaw";

export const AGENT_DISPLAY_NAMES: Record<AgentType, string> = {
  RLM: "RLM",
  "Claude Code": "Claude Code",
  Codex: "Codex",
  RAG: "RAG",
  Hermes: "Hermes",
  OpenClaw: "OpenClaw (LCM)",
};

export function displayAgentType(type: AgentType): string {
  return AGENT_DISPLAY_NAMES[type];
}

export type ScaleType = "linear" | "log";

export type MetricKey = "costUsd" | "timeSec" | "tokens" | "releaseDate";

// Difficulty buckets for the per-difficulty cost-vs-completion chart.
export type DifficultyBucket = "easy" | "medium" | "hard";

export const DIFFICULTY_BUCKETS: { id: DifficultyBucket; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

// Pass rate (%) for one config split by task difficulty.
export interface DifficultyBreakdown {
  easy: number;
  medium: number;
  hard: number;
}

// Per-task averages for cost / tokens / time within one difficulty bucket.
export interface BucketMetrics {
  costUsd?: number;
  tokens?: number;
  timeSec?: number;
}

export interface DifficultyMetrics {
  easy: BucketMetrics;
  medium: BucketMetrics;
  hard: BucketMetrics;
}

// Raw passed/total counts behind a pass rate (e.g. 17/40).
export interface PassCount {
  passed: number;
  total: number;
}

// Passed/total counts for the overall run and each difficulty split.
export interface PassCounts {
  overall: PassCount;
  easy: PassCount;
  medium: PassCount;
  hard: PassCount;
}

export interface ResultRow {
  id: string;
  agentType: AgentType;
  model: string;
  completion: number;
  costUsd?: number;
  tokens?: number;
  timeSec?: number;
  // Model release date as a millisecond timestamp (derived from MODEL_RELEASE_DATES).
  releaseDate: number;
  difficulty: DifficultyBreakdown;
  // Per-difficulty cost / tokens / time (averaged over cases in each bucket).
  difficultyMetrics: DifficultyMetrics;
  // Raw passed/total counts behind the overall + per-difficulty pass rates.
  counts: PassCounts;
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

// Raw passed/total behind a pass rate, e.g. "17/40".
export function fmtCount(c: { passed: number; total: number }) {
  return `${c.passed}/${c.total}`;
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
  "deepseek-v4-pro": "2026-04-24",
  "gemini-3.1-pro-preview": "2026-02-19",
};

// Preview run results, derived at runtime from the trimmed per-case data in
// combinedResults.ts (one row per included run). completion, cost, tokens,
// time, and the easy/medium/hard splits are all computed from the source — see
// ./combined — so a new benchmark run only ever regenerates combinedResults.ts.
export const RESULTS: ResultRow[] = aggregateRuns(COMBINED).map((r) => ({
  id: r.runKey,
  agentType: r.agentType,
  model: r.model,
  completion: r.completion,
  costUsd: r.costUsd,
  tokens: r.tokens,
  timeSec: r.timeSec,
  releaseDate: Date.parse(MODEL_RELEASE_DATES[r.model] ?? "2025-08-07"),
  difficulty: r.difficulty,
  difficultyMetrics: r.difficultyMetrics,
  counts: r.counts,
  tokensLabel:
    r.tokensEstimated && r.tokens != null ? `~${fmtTokens(r.tokens)}` : undefined,
}));

export const AGENT_TYPES: AgentType[] = Array.from(
  new Set(RESULTS.map((r) => r.agentType)),
);

// ---------------------------------------------------------------------------
// "What makes a task hard": difficulty tiers + the structured axes behind them.
// Every number here is pooled across all included runs at runtime (see
// poolByTaskField), so the distributions and pass rates always match the data.
// ---------------------------------------------------------------------------

// One level of a difficulty axis: its pooled pass rate and how many tasks sit
// at that level (the distribution).
export interface DimensionLevel {
  level: string;
  rate: number;
  passed: number;
  total: number;
  taskCount: number;
}

// A structured axis we control per task (reasoning hops, semantic distance, …),
// with its ordered levels (easiest → hardest) and a one-line description.
export interface TaskDimension {
  id: string;
  title: string;
  blurb: string;
  levels: DimensionLevel[];
}

// 1–10 rubric split into 3 score bands with ~balanced task counts (46 / 57 / 92).
const ANTICIPABILITY_BUCKETS = [
  { key: "high", label: "High" },
  { key: "mid", label: "Med" },
  { key: "low", label: "Low" },
];

function mapAnticipabilityBucket(
  v: TaskMeta[keyof TaskMeta],
): string | null {
  if (v == null) return null;
  const score = Number(v);
  if (score === 10) return "high";
  if (score === 9) return "mid";
  return "low";
}

const BURIAL_DEPTH_QUANTILE_COUNT = 5;

const LEARNINGS_REQUIRED_TITLE = "Number of learnings required";

const LEARNINGS_REQUIRED_BUCKETS = [
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3+", label: "3+" },
] as const;

function mapLearningsRequiredBucket(
  v: TaskMeta[keyof TaskMeta],
): string | null {
  if (v == null) return null;
  return Number(v) >= 3 ? "3+" : String(v);
}

function burialDepthQuantileBounds(
  tasks: Record<string, TaskMeta>,
  count: number,
): number[] {
  const ratios = Object.values(tasks)
    .filter((t) => t.burial_depth != null && t.trace_lines)
    .map((t) => t.burial_depth! / t.trace_lines!)
    .sort((a, b) => a - b);
  const n = ratios.length;
  if (!n || count < 2) return [];
  const bounds: number[] = [];
  for (let i = 1; i < count; i++) {
    bounds.push(ratios[Math.floor((i * n) / count) - 1]);
  }
  return bounds;
}

function formatBurialDepthPct(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value * 100)));
}

// Compact range labels ("0–3", "3–16", …) so five ticks fit a narrow panel;
// the panel subtitle explains that the unit is % through the trace.
function buildBurialDepthBuckets(bounds: number[]): { key: string; label: string }[] {
  const bucketCount = bounds.length + 1;
  return Array.from({ length: bucketCount }, (_, i) => {
    const lo = i === 0 ? 0 : bounds[i - 1];
    const hi = i < bounds.length ? bounds[i] : 1;
    const loPct = formatBurialDepthPct(lo);
    const hiPct = formatBurialDepthPct(hi);
    return { key: `q${i + 1}`, label: `${loPct}–${hiPct}` };
  });
}

const BURIAL_DEPTH_BOUNDS = burialDepthQuantileBounds(
  COMBINED.tasks,
  BURIAL_DEPTH_QUANTILE_COUNT,
);

// Shallowest (near trace start) → deepest (near trace end); ~equal task counts per bin.
const BURIAL_DEPTH_BUCKETS = buildBurialDepthBuckets(BURIAL_DEPTH_BOUNDS);

function mapBurialDepthBucket(meta: TaskMeta): string | null {
  if (meta.burial_depth == null || !meta.trace_lines) return null;
  const ratio = meta.burial_depth / meta.trace_lines;
  for (let i = 0; i < BURIAL_DEPTH_BOUNDS.length; i++) {
    if (ratio <= BURIAL_DEPTH_BOUNDS[i]) return `q${i + 1}`;
  }
  return `q${BURIAL_DEPTH_QUANTILE_COUNT}`;
}

function buildLevels(
  field: keyof TaskMeta,
  order: { key: string; label: string }[],
  mapValue?: (v: TaskMeta[keyof TaskMeta]) => string | null,
): DimensionLevel[] {
  const stats = poolByTaskField(COMBINED, field, mapValue);
  return order.map(({ key, label }) => {
    const s = stats[key] ?? { passed: 0, total: 0, taskCount: 0 };
    return {
      level: label,
      rate: s.total ? Number(((100 * s.passed) / s.total).toFixed(1)) : 0,
      passed: s.passed,
      total: s.total,
      taskCount: s.taskCount,
    };
  });
}

function buildLevelsByClassifier(
  classify: (meta: TaskMeta) => string | null,
  order: { key: string; label: string }[],
): DimensionLevel[] {
  const stats = poolByTaskClassifier(COMBINED, classify);
  return order.map(({ key, label }) => {
    const s = stats[key] ?? { passed: 0, total: 0, taskCount: 0 };
    return {
      level: label,
      rate: s.total ? Number(((100 * s.passed) / s.total).toFixed(1)) : 0,
      passed: s.passed,
      total: s.total,
      taskCount: s.taskCount,
    };
  });
}

export const TASK_DIMENSIONS: TaskDimension[] = [
  {
    id: "n_hops",
    title: LEARNINGS_REQUIRED_TITLE,
    blurb:
      "How many separate facts from the trace the agent must learn and combine to pass the task.",
    levels: buildLevels(
      "n_hops",
      [...LEARNINGS_REQUIRED_BUCKETS],
      mapLearningsRequiredBucket,
    ),
  },
  {
    id: "anticipability",
    title: "Predictability",
    blurb:
      "GPT-5 Mini rubric score 1–10: how predictable it is that the agent would need the required learning (store-at-ingestion or search-at-task). 10 = dead-on cued; 1 = no cue. Grouped high (10) / med (9) / low (≤8).",
    levels: buildLevels(
      "anticipability",
      ANTICIPABILITY_BUCKETS,
      mapAnticipabilityBucket,
    ),
  },
  {
    id: "burial_depth",
    title: "Burial depth",
    blurb:
      "How far through the trace the required learning first appears (burial_depth ÷ trace_lines). Bins are equal-sized groups of tasks from near the start (left) to near the end (right).",
    levels: buildLevelsByClassifier(mapBurialDepthBucket, BURIAL_DEPTH_BUCKETS),
  },
  {
    id: "misdirection",
    title: "Misdirection",
    blurb:
      "How strongly nearby content in the trace points toward a plausible wrong answer.",
    levels: buildLevels("misdirection", [
      { key: "low", label: "Low" },
      { key: "mid", label: "Mid" },
      { key: "high", label: "High" },
    ]),
  },
  {
    id: "adversarial",
    title: "Adversarial traps",
    blurb:
      "Whether the trace actively works against the agent: patched or stale facts, confusable entities, a confidently wrong speaker.",
    levels: buildLevels(
      "adversarial",
      [
        { key: "clean", label: "Clean" },
        { key: "trap", label: "Adversarial" },
      ],
      (v) => (v ? "trap" : "clean"),
    ),
  },
];

// ---------------------------------------------------------------------------
// Difficulty trend figures: pass rate by axis level, split by harness.
// ---------------------------------------------------------------------------

export interface TrendFamily {
  id: string;
  label: string;
  colorKey: AgentType;
}

const HARNESS_DATA_KEY: Record<AgentType, string> = {
  RLM: "RLM",
  "Claude Code": "ClaudeCode",
  Codex: "Codex",
  RAG: "RAG",
  Hermes: "Hermes",
  OpenClaw: "OpenClaw",
};

const TREND_HARNESS_ORDER: AgentType[] = [
  "RLM",
  "Claude Code",
  "Codex",
  "RAG",
  "Hermes",
  "OpenClaw",
];

export const TREND_FAMILIES: TrendFamily[] = (() => {
  const present = new Set(
    COMBINED.runs.map((r) => displayHarness(r.harness)),
  );
  return TREND_HARNESS_ORDER.filter((h) => present.has(h)).map((h) => ({
    id: HARNESS_DATA_KEY[h],
    label: displayAgentType(h),
    colorKey: h,
  }));
})();

export interface TrendAxis {
  id: string;
  title: string;
  subtitle?: string;
  data: Record<string, number | string>[];
  // Grouped bar chart when sparse per-point n makes a line chart noisy.
  chart?: "line" | "bar";
}

function toRate(stat: { passed: number; total: number }): number {
  return stat.total
    ? Number(((100 * stat.passed) / stat.total).toFixed(1))
    : 0;
}

function buildHarnessTrendRows(
  field: keyof TaskMeta,
  order: { key: string; label: string }[],
  mapValue?: (v: TaskMeta[keyof TaskMeta]) => string | null,
): Record<string, number | string>[] {
  const byHarness = poolByTaskFieldByHarness(COMBINED, field, mapValue);
  const pooled = poolByTaskField(COMBINED, field, mapValue);

  return order.map(({ key, label }) => {
    const row: Record<string, number | string> = {
      level: label,
      taskCount: pooled[key]?.taskCount ?? 0,
    };
    for (const f of TREND_FAMILIES) {
      const stat = byHarness[f.colorKey]?.[key];
      if (stat?.total) row[f.id] = toRate(stat);
    }
    return row;
  });
}

function buildHarnessTrendRowsByClassifier(
  classify: (meta: TaskMeta) => string | null,
  order: { key: string; label: string }[],
): Record<string, number | string>[] {
  const byHarness = poolByTaskClassifierByHarness(COMBINED, classify);
  const pooled = poolByTaskClassifier(COMBINED, classify);

  return order.map(({ key, label }) => {
    const row: Record<string, number | string> = {
      level: label,
      taskCount: pooled[key]?.taskCount ?? 0,
    };
    for (const f of TREND_FAMILIES) {
      const stat = byHarness[f.colorKey]?.[key];
      if (stat?.total) row[f.id] = toRate(stat);
    }
    return row;
  });
}

export const TREND_AXES: TrendAxis[] = [
  {
    id: "anticipability",
    title: "Predictability",
    subtitle: "How predictable the needed learning is",
    data: buildHarnessTrendRows(
      "anticipability",
      ANTICIPABILITY_BUCKETS,
      mapAnticipabilityBucket,
    ),
  },
  {
    id: "burial_depth",
    title: "Burial depth",
    subtitle: "% through trace where required learning first appears",
    data: buildHarnessTrendRowsByClassifier(
      mapBurialDepthBucket,
      BURIAL_DEPTH_BUCKETS,
    ),
  },
  {
    id: "n_hops",
    title: LEARNINGS_REQUIRED_TITLE,
    subtitle: "How many learnings must be combined to pass",
    data: buildHarnessTrendRows(
      "n_hops",
      [...LEARNINGS_REQUIRED_BUCKETS],
      mapLearningsRequiredBucket,
    ),
  },
];

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
    title: LEARNINGS_REQUIRED_TITLE,
    drop: "−18.4pp",
    data: [
      { level: "1", RLM: 65.8, ClaudeCode: 53.8, RAG: 50.6, Hermes: 46.8, ALL: 54.3 },
      { level: "2", RLM: 47.8, ClaudeCode: 38.5, RAG: 29.3, Hermes: 29.3, ALL: 36.2 },
      { level: "3+", RLM: 56.5, ClaudeCode: 39.1, RAG: 21.7, Hermes: 26.1, ALL: 35.9 },
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
    title: "Misdirection",
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
