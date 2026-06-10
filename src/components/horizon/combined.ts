// Runtime derivation of the Horizon leaderboard from the raw results
// (jobs/combined_results.json in horizon-1-private, trimmed into
// combinedResults.ts). data.ts builds RESULTS from this so the numbers — incl.
// the Easy/Medium/Hard splits — come from one source instead of being hardcoded.
//
// Difficulty (and the other task axes) live once in a per-task `tasks` map and
// are joined to each run's cases by task id at runtime, mirroring the source.

import type {
  AgentType,
  BucketMetrics,
  DifficultyBreakdown,
  DifficultyBucket,
  DifficultyMetrics,
  PassCount,
  PassCounts,
} from "./data";

// ---------------------------------------------------------------------------
// Trimmed shape emitted into combinedResults.ts.
// ---------------------------------------------------------------------------

// One-time per-task metadata (keyed by task id). Difficulty drives the splits;
// the remaining axes are carried through for future figures.
export interface TaskMeta {
  difficulty: DifficultyBucket | null;
  anticipability?: number;
  burial_depth?: number;
  trace_lines?: number;
  misdirection?: string;
  n_hops?: number;
  family?: string | null;
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

// Published per-task aggregates (authoritative for cost/tokens/time).
export interface ReportedAggregates {
  cost: number | null;
  tokens: number | null;
  time: number | null;
  tokensEstimated: boolean;
}

export interface RawRun {
  runKey: string;
  harness: string;
  model: string;
  modelName: string | null;
  reported?: ReportedAggregates;
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
  openclaw: "OpenClaw",
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

function passRate(cases: RawCase[]): number {
  const scored = cases.filter((c) => c.passed != null);
  if (!scored.length) return 0;
  return (100 * scored.filter((c) => c.passed).length) / scored.length;
}

function passCount(cases: RawCase[]): PassCount {
  const scored = cases.filter((c) => c.passed != null);
  return {
    passed: scored.filter((c) => c.passed).length,
    total: scored.length,
  };
}

function avgCaseMetric(
  cases: RawCase[],
  field: "cost" | "tokens" | "time",
): number | undefined {
  const vals = cases
    .map((c) => c[field])
    .filter((v): v is number => v != null);
  if (!vals.length) return undefined;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function metricsFor(
  cases: RawCase[],
  tasks: Record<string, TaskMeta>,
  bucket: DifficultyBucket,
): BucketMetrics {
  const filtered = cases.filter(
    (c) => (tasks[c.task]?.difficulty ?? null) === bucket,
  );
  return {
    costUsd: avgCaseMetric(filtered, "cost"),
    tokens: avgCaseMetric(filtered, "tokens"),
    timeSec: avgCaseMetric(filtered, "time"),
  };
}

export interface AggregatedRun {
  runKey: string;
  agentType: AgentType;
  model: string;
  completion: number;
  costUsd?: number;
  tokens?: number;
  timeSec?: number;
  tokensEstimated?: boolean;
  difficulty: DifficultyBreakdown;
  difficultyMetrics: DifficultyMetrics;
  counts: PassCounts;
}

export function aggregateRun(
  run: RawRun,
  tasks: Record<string, TaskMeta>,
): AggregatedRun {
  const cases = run.cases;
  const diffOf = (c: RawCase) => tasks[c.task]?.difficulty ?? null;
  const splitFor = (bucket: DifficultyBucket) =>
    Number(passRate(cases.filter((c) => diffOf(c) === bucket)).toFixed(1));
  const countFor = (bucket: DifficultyBucket) =>
    passCount(cases.filter((c) => diffOf(c) === bucket));
  const rep = run.reported;
  return {
    runKey: run.runKey,
    agentType: displayHarness(run.harness),
    model: normalizeModel(run.model),
    completion: Number(passRate(cases).toFixed(1)),
    costUsd: rep?.cost ?? avgCaseMetric(cases, "cost"),
    tokens: rep?.tokens ?? avgCaseMetric(cases, "tokens"),
    timeSec: rep?.time ?? avgCaseMetric(cases, "time"),
    tokensEstimated: rep?.tokensEstimated,
    difficulty: {
      easy: splitFor("easy"),
      medium: splitFor("medium"),
      hard: splitFor("hard"),
    },
    difficultyMetrics: {
      easy: metricsFor(cases, tasks, "easy"),
      medium: metricsFor(cases, tasks, "medium"),
      hard: metricsFor(cases, tasks, "hard"),
    },
    counts: {
      overall: passCount(cases),
      easy: countFor("easy"),
      medium: countFor("medium"),
      hard: countFor("hard"),
    },
  };
}

export function aggregateRuns(data: CombinedData): AggregatedRun[] {
  return data.runs
    .map((r) => aggregateRun(r, data.tasks))
    .sort((a, b) => b.completion - a.completion);
}

// ---------------------------------------------------------------------------
// Per-task-axis pooling: for one piece of task metadata (difficulty, n_hops,
// anticipability, ...), bucket tasks by level and pool the pass rate across
// every included run. Used by the "what makes a task hard" figures so the
// distributions and pass rates come straight from the source, not hardcoded.
// ---------------------------------------------------------------------------

export interface FieldLevelStat {
  // Scored cases pooled across all runs for tasks at this level.
  passed: number;
  total: number;
  // Number of distinct tasks at this level (the distribution).
  taskCount: number;
}

export function poolByTaskField(
  data: CombinedData,
  field: keyof TaskMeta,
  mapValue: (v: TaskMeta[keyof TaskMeta]) => string | null = (v) =>
    v == null ? null : String(v),
): Record<string, FieldLevelStat> {
  const out: Record<string, FieldLevelStat> = {};
  const get = (level: string) =>
    (out[level] ??= { passed: 0, total: 0, taskCount: 0 });

  for (const meta of Object.values(data.tasks)) {
    const level = mapValue(meta[field]);
    if (level != null) get(level).taskCount += 1;
  }

  for (const run of data.runs) {
    for (const c of run.cases) {
      if (c.passed == null) continue;
      const meta = data.tasks[c.task];
      if (!meta) continue;
      const level = mapValue(meta[field]);
      if (level == null) continue;
      const stat = get(level);
      stat.total += 1;
      if (c.passed) stat.passed += 1;
    }
  }

  return out;
}

// Same as poolByTaskField, but keeps pass rates separate per harness (pooled
// across all models on that harness).
export function poolByTaskFieldByHarness(
  data: CombinedData,
  field: keyof TaskMeta,
  mapValue: (v: TaskMeta[keyof TaskMeta]) => string | null = (v) =>
    v == null ? null : String(v),
): Record<string, Record<string, FieldLevelStat>> {
  const out: Record<string, Record<string, FieldLevelStat>> = {};
  const get = (harness: string, level: string) => {
    const byLevel = (out[harness] ??= {});
    return (byLevel[level] ??= { passed: 0, total: 0, taskCount: 0 });
  };

  const levelTaskCounts: Record<string, number> = {};
  for (const meta of Object.values(data.tasks)) {
    const level = mapValue(meta[field]);
    if (level != null) levelTaskCounts[level] = (levelTaskCounts[level] ?? 0) + 1;
  }

  for (const run of data.runs) {
    const harness = displayHarness(run.harness);
    for (const c of run.cases) {
      if (c.passed == null) continue;
      const meta = data.tasks[c.task];
      if (!meta) continue;
      const level = mapValue(meta[field]);
      if (level == null) continue;
      const stat = get(harness, level);
      stat.taskCount = levelTaskCounts[level] ?? 0;
      stat.total += 1;
      if (c.passed) stat.passed += 1;
    }
  }

  return out;
}

// Like poolByTaskField, but classifies from the full task metadata (e.g.
// burial_depth / trace_lines ratio).
export function poolByTaskClassifier(
  data: CombinedData,
  classify: (meta: TaskMeta) => string | null,
): Record<string, FieldLevelStat> {
  const out: Record<string, FieldLevelStat> = {};
  const get = (level: string) =>
    (out[level] ??= { passed: 0, total: 0, taskCount: 0 });

  for (const meta of Object.values(data.tasks)) {
    const level = classify(meta);
    if (level != null) get(level).taskCount += 1;
  }

  for (const run of data.runs) {
    for (const c of run.cases) {
      if (c.passed == null) continue;
      const meta = data.tasks[c.task];
      if (!meta) continue;
      const level = classify(meta);
      if (level == null) continue;
      const stat = get(level);
      stat.total += 1;
      if (c.passed) stat.passed += 1;
    }
  }

  return out;
}

export function poolByTaskClassifierByHarness(
  data: CombinedData,
  classify: (meta: TaskMeta) => string | null,
): Record<string, Record<string, FieldLevelStat>> {
  const out: Record<string, Record<string, FieldLevelStat>> = {};
  const get = (harness: string, level: string) => {
    const byLevel = (out[harness] ??= {});
    return (byLevel[level] ??= { passed: 0, total: 0, taskCount: 0 });
  };

  const levelTaskCounts: Record<string, number> = {};
  for (const meta of Object.values(data.tasks)) {
    const level = classify(meta);
    if (level != null) levelTaskCounts[level] = (levelTaskCounts[level] ?? 0) + 1;
  }

  for (const run of data.runs) {
    const harness = displayHarness(run.harness);
    for (const c of run.cases) {
      if (c.passed == null) continue;
      const meta = data.tasks[c.task];
      if (!meta) continue;
      const level = classify(meta);
      if (level == null) continue;
      const stat = get(harness, level);
      stat.taskCount = levelTaskCounts[level] ?? 0;
      stat.total += 1;
      if (c.passed) stat.passed += 1;
    }
  }

  return out;
}
