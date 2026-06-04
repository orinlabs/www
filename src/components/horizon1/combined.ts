// Runtime derivation of the Horizon-1 leaderboard from the raw results
// (jobs/combined_results.json in horizon-1-private, trimmed into
// combinedResults.ts). data.ts builds RESULTS from this so the numbers — incl.
// the Easy/Medium/Hard splits — come from one source instead of being hardcoded.
//
// Difficulty (and the other task axes) live once in a per-task `tasks` map and
// are joined to each run's cases by task id at runtime, mirroring the source.

import type { AgentType, DifficultyBreakdown, DifficultyBucket } from "./data";

// ---------------------------------------------------------------------------
// Trimmed shape emitted into combinedResults.ts.
// ---------------------------------------------------------------------------

// One-time per-task metadata (keyed by task id). Difficulty drives the splits;
// the remaining axes are carried through for future figures.
export interface TaskMeta {
  difficulty: DifficultyBucket | null;
  semantic_distance?: string;
  misdirection?: string;
  n_hops?: number;
  burial_depth_tokens?: number;
  family?: string;
  category?: string;
  adversarial?: boolean;
  flags?: string[];
  tags?: string[];
}

export interface RawCase {
  task: string;
  passed: boolean | null;
  cost: number | null;
  tokens: number | null;
  time: number | null;
}

export interface RawRun {
  runKey: string;
  harness: string;
  model: string;
  modelName: string | null;
  cases: RawCase[];
}

export interface CombinedData {
  tasks: Record<string, TaskMeta>;
  runs: RawRun[];
}

// ---------------------------------------------------------------------------
// Normalization: raw harness ids -> display AgentType; model id dashes -> dots.
// ---------------------------------------------------------------------------

const HARNESS_DISPLAY: Record<string, AgentType> = {
  "claude-code": "Claude Code",
  "trace-rag": "RAG",
  "trace-rlm": "RLM",
  hermes: "Hermes",
  codex: "Codex",
};

export function displayHarness(raw: string): AgentType {
  return HARNESS_DISPLAY[raw] ?? (raw as AgentType);
}

// Strip any provider prefix ("anthropic/claude-opus-4.8" -> "claude-opus-4.8")
// and turn dashed version numbers into dots ("claude-haiku-4-5" ->
// "claude-haiku-4.5") so the id matches MODEL_RELEASE_DATES and reads cleanly.
export function normalizeModel(raw: string): string {
  const bare = raw.includes("/") ? raw.slice(raw.lastIndexOf("/") + 1) : raw;
  return bare.replace(/(\d)-(\d)/g, "$1.$2");
}

// ---------------------------------------------------------------------------
// Per-run aggregation.
// ---------------------------------------------------------------------------

function mean(xs: (number | null)[]): number | undefined {
  const v = xs.filter((x): x is number => typeof x === "number");
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : undefined;
}

function passRate(cases: RawCase[]): number {
  const scored = cases.filter((c) => c.passed != null);
  if (!scored.length) return 0;
  return (100 * scored.filter((c) => c.passed).length) / scored.length;
}

export interface AggregatedRun {
  runKey: string;
  agentType: AgentType;
  model: string;
  completion: number;
  costUsd: number;
  tokens: number;
  timeSec: number | undefined;
  difficulty: DifficultyBreakdown;
}

export function aggregateRun(
  run: RawRun,
  tasks: Record<string, TaskMeta>,
): AggregatedRun {
  const cases = run.cases;
  const diffOf = (c: RawCase) => tasks[c.task]?.difficulty ?? null;
  const splitFor = (bucket: DifficultyBucket) =>
    Number(passRate(cases.filter((c) => diffOf(c) === bucket)).toFixed(1));
  return {
    runKey: run.runKey,
    agentType: displayHarness(run.harness),
    model: normalizeModel(run.model),
    completion: Number(passRate(cases).toFixed(1)),
    costUsd: Number((mean(cases.map((c) => c.cost)) ?? 0).toFixed(3)),
    tokens: Math.round(mean(cases.map((c) => c.tokens)) ?? 0),
    timeSec: mean(cases.map((c) => c.time)),
    difficulty: {
      easy: splitFor("easy"),
      medium: splitFor("medium"),
      hard: splitFor("hard"),
    },
  };
}

export function aggregateRuns(data: CombinedData): AggregatedRun[] {
  return data.runs
    .map((r) => aggregateRun(r, data.tasks))
    .sort((a, b) => b.completion - a.completion);
}
