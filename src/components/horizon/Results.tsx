import {
  type MouseEvent as ReactMouseEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn, Switch } from "slate-ui";
import {
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  ResponsiveContainer,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";

import {
  AGENT_TYPES,
  type AgentType,
  DIFFICULTY_BUCKETS,
  type DifficultyBucket,
  fmtCost,
  fmtCount,
  fmtDate,
  fmtPct,
  fmtTime,
  fmtTokens,
  METRIC_DEFS,
  type MetricKey,
  RESULTS,
  type ResultRow,
  type ScaleType,
} from "./data";
import { agentColor, useIsDark } from "./theme";

// Pad the axis so the first/last point sits at least this fraction of the
// data's range away from each edge. Recharts handles tick placement itself.
const AXIS_PAD_FRAC = 0.1;

// Compute a padded axis domain from the data so the extreme points always sit
// ~10% in from each edge. For log scales the padding is applied in log space
// (and the domain stays strictly positive, which Recharts requires).
function computeDomain(values: number[], scale: ScaleType): [number, number] {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (scale === "log") {
    const logMin = Math.log10(min);
    const logMax = Math.log10(max);
    const pad = (logMax - logMin) * AXIS_PAD_FRAC || AXIS_PAD_FRAC;
    return [Math.pow(10, logMin - pad), Math.pow(10, logMax + pad)];
  }

  const pad = (max - min) * AXIS_PAD_FRAC || AXIS_PAD_FRAC;
  return [min - pad, max + pad];
}

// Place `count` evenly-spaced ticks across the domain (in log space when the
// axis is log, so they're visually even), then snap each to a clean value for
// the metric. Even spacing keeps the axis smooth; snapping keeps labels tidy.
function makeTicks(
  [lo, hi]: [number, number],
  scale: ScaleType,
  snap: (v: number) => number,
  count = 6,
): number[] {
  const ticks: number[] = [];
  for (let i = 0; i < count; i++) {
    const f = i / (count - 1);
    const v =
      scale === "log"
        ? Math.pow(10, Math.log10(lo) + (Math.log10(hi) - Math.log10(lo)) * f)
        : lo + (hi - lo) * f;
    ticks.push(snap(v));
  }
  // Snapping can collapse neighbors into duplicates; keep them unique.
  return Array.from(new Set(ticks));
}

// y-axis difficulty buckets: overall ("all") plus the per-difficulty splits.
const Y_BUCKETS: { id: DifficultyBucket | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...DIFFICULTY_BUCKETS,
];

// Interactive results scatter: pass rate vs. a selectable x metric (cost / time
// / tokens / release date), split by difficulty bucket (All / Easy / Medium /
// Hard). Dots are colored by harness; a point's model + values are revealed on
// hover. With `showTable`, the full leaderboard renders below and shares the
// hover highlight.
export function HorizonChart({
  showTable = false,
  axisControls = true,
  difficultyControls = true,
  defaultAxis = "costUsd",
  defaultDifficulty = "all",
  defaultScale = "log",
}: {
  showTable?: boolean;
  defaultScale?: ScaleType;
  defaultDifficulty?: DifficultyBucket | "all";
  defaultAxis?: MetricKey;
  axisControls?: boolean;
  difficultyControls?: boolean;
}) {
  const isDark = useIsDark();
  const [metricId, setMetricId] = useState<MetricKey>(defaultAxis);
  const [scaleType, setScaleType] = useState<ScaleType>(defaultScale);
  const [bucket, setBucket] = useState<DifficultyBucket | "all">(defaultDifficulty);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const metric = METRIC_DEFS.find((m) => m.id === metricId)!;
  // Dates (and any forceLinear metric) can't use a log scale.
  const effectiveScale: ScaleType = metric.forceLinear ? "linear" : scaleType;

  const metricForRow = (r: ResultRow): number | undefined => {
    if (metricId === "releaseDate" || bucket === "all") {
      return r[metricId] as number | undefined;
    }
    return r.difficultyMetrics[bucket][metricId];
  };

  const data = useMemo(
    () =>
      RESULTS.filter((r) => {
        const x = metricForRow(r);
        return x != null && Number.isFinite(x);
      }).map((r) => ({
        ...r,
        [metricId]: metricForRow(r),
        y: bucket === "all" ? r.completion : r.difficulty[bucket],
      })),
    [metricId, bucket],
  );

  const { domain, ticks } = useMemo(() => {
    const values = data.map((r) => r[metricId] as number);
    const d = computeDomain(values, effectiveScale);
    const dataExtent: [number, number] = [
      Math.min(...values),
      Math.max(...values),
    ];
    return {
      domain: d,
      ticks: makeTicks(dataExtent, effectiveScale, metric.snap, metric.tickCount),
    };
  }, [metricId, effectiveScale, metric.snap, metric.tickCount, data]);

  const gridStroke = isDark ? "#404040" : "#e5e5e5";
  const axisStroke = isDark ? "#737373" : "#a3a3a3";
  const labelFill = isDark ? "#e5e5e5" : "#171717";

  // Pixel positions of rendered dots, collected during render so a hover
  // anywhere can snap to the closest point within SNAP_RADIUS.
  const pointsRef = useRef<{ x: number; y: number; id: string }[]>([]);
  pointsRef.current = [];
  const SNAP_RADIUS = 100;

  const isDimmed = (row: ResultRow) =>
    (hoveredId != null || hoveredType != null) &&
    hoveredId !== row.id &&
    hoveredType !== row.agentType;

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let best: { id: string } | null = null;
    let bestDist = Infinity;
    for (const p of pointsRef.current) {
      const dist = Math.hypot(p.x - mx, p.y - my);
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    }
    setHoveredId(best && bestDist <= SNAP_RADIUS ? best.id : null);
  };

  const renderDot = (props: {
    cx?: number;
    cy?: number;
    fill?: string;
    fillOpacity?: number;
    payload?: ResultRow;
  }) => {
    const { cx, cy, fill, fillOpacity, payload } = props;
    if (typeof cx !== "number" || typeof cy !== "number") return <g />;
    if (payload) pointsRef.current.push({ x: cx, y: cy, id: payload.id });
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={fill}
        fillOpacity={fillOpacity}
        style={{ transition: "fill-opacity 0.2s ease" }}
      />
    );
  };

  const btn = (active: boolean) =>
    cn(
      "px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer",
      active
        ? "bg-primary text-anti-primary"
        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700",
    );

  return (
    <div className="my-8 -ml-2 sm:-ml-10">
      <div className="flex flex-col items-start gap-4 mb-4 ml-2 sm:ml-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Score vs. {metric.label}
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Horizon (195 tasks), preview run — hover a point to reveal its
            model
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {AGENT_TYPES.map((type) => (
              <div
                key={type}
                onMouseEnter={() => setHoveredType(type)}
                onMouseLeave={() => setHoveredType(null)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 cursor-pointer transition-opacity",
                  hoveredType != null && hoveredType !== type && "opacity-40",
                )}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: agentColor(type, isDark) }}
                />
                {type}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 shrink-0 sm:items-end">
          <Switch
            checked={scaleType === "log"}
            onCheckedChange={(checked) =>
              setScaleType(checked ? "log" : "linear")
            }
            disabled={metric.forceLinear}
            label="Log scale"
            withBody
            className={cn(
              "hover:!bg-neutral-100 dark:hover:!bg-neutral-800 disabled:dark:!bg-neutral-800",
              metric.forceLinear && "opacity-40",
            )}
            styles={{
              label: { color: isDark ? "#d4d4d4" : "#525252" },
              switch: {
                backgroundColor:
                  scaleType === "log" && !metric.forceLinear
                    ? "var(--primary-500)"
                    : isDark
                      ? "#404040"
                      : "#e5e5e5",
              },
            }}
          />

          {axisControls && (
            <div className="flex flex-wrap items-center gap-1">
            {METRIC_DEFS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMetricId(m.id)}
                className={btn(m.id === metricId)}
              >
                {m.label}
              </button>
            ))}
          </div>)}

          {difficultyControls && (
            <div className="flex flex-wrap items-center gap-1">
            {Y_BUCKETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBucket(b.id)}
                className={btn(b.id === bucket)}
              >
                {b.label}
              </button>
            ))}
          </div>)}
        </div>
      </div>

      <div
        className="h-[380px]"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoveredId(null)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 24, right: 8, left: 12, bottom: 28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis
              type="number"
              dataKey={metric.id}
              name={metric.label}
              scale={effectiveScale}
              domain={domain}
              ticks={ticks}
              tickFormatter={(v) => metric.format(Number(v))}
              allowDataOverflow
              axisLine={{ stroke: axisStroke, strokeWidth: 1.5 }}
              tickLine={{ stroke: axisStroke, strokeWidth: 1.5 }}
              tick={{ fontSize: 12, fill: axisStroke }}
              label={{
                value: metric.label,
                position: "insideBottom",
                offset: -12,
                fill: axisStroke,
                fontSize: 12,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Pass rate"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              unit="%"
              width={56}
              axisLine={{ stroke: axisStroke, strokeWidth: 1.5 }}
              tickLine={{ stroke: axisStroke, strokeWidth: 1.5 }}
              tick={{ fontSize: 12, fill: axisStroke }}
              label={{
                value: "Pass rate (%)",
                angle: -90,
                position: "insideLeft",
                offset: 6,
                fill: axisStroke,
                fontSize: 12,
                style: { textAnchor: "middle" },
              }}
            />
            <Scatter data={data} isAnimationActive={false} shape={renderDot}>
              {data.map((row) => (
                <Cell
                  key={row.id}
                  fill={agentColor(row.agentType, isDark)}
                  fillOpacity={isDimmed(row) ? 0.15 : 1}
                />
              ))}
              <LabelList
                dataKey="model"
                position="top"
                content={(props) => {
                  const { x, y, index } = props as {
                    x?: number;
                    y?: number;
                    index?: number;
                  };
                  if (typeof x !== "number" || typeof y !== "number")
                    return null;
                  const row =
                    typeof index === "number" ? data[index] : undefined;
                  if (row == null || row.id !== hoveredId) return null;
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      style={{ fontSize: 11, fontWeight: 600, fill: labelFill }}
                    >
                      <tspan x={x} dy={-18}>
                        {`${row.agentType} - ${row.model}`}
                      </tspan>
                      <tspan
                        x={x}
                        dy={13}
                        style={{ fontWeight: 400, fontSize: 10 }}
                      >
                        {`${fmtPct(row.y)} · ${metric.format(row[metric.id] as number)}`}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {showTable && (
        <HorizonTable
          hoveredId={hoveredId}
          onHover={setHoveredId}
          hoveredType={hoveredType}
          className="ml-10"
        />
      )}
    </div>
  );
}

// Headline chart: one row per model (run on >= 2 harnesses), one dot per
// harness, colored by harness, on a single completion axis. Holding the model
// fixed (a row) and varying only the harness swings the score 10–20+ points,
// and RLM is the rightmost dot in nearly every row — the harness, not the
// model, is the dominant and most consistent lever.
export function HorizonModelChart() {
  const isDark = useIsDark();
  const [hoveredHarness, setHoveredHarness] = useState<string | null>(null);

  const ink = isDark ? "#e5e5e5" : "#171717";
  const grid = isDark ? "#404040" : "#e5e5e5";
  const axis = isDark ? "#737373" : "#a3a3a3";
  const faint = isDark ? "#404040" : "#e5e5e5";

  // Group by model, keep only models tried on multiple harnesses (so each row
  // shows a real within-model spread), sort strongest-first.
  const rows = useMemo(() => {
    const byModel = new Map<string, ResultRow[]>();
    for (const r of RESULTS) {
      const g = byModel.get(r.model) ?? [];
      g.push(r);
      byModel.set(r.model, g);
    }
    return [...byModel.entries()]
      .filter(([, rs]) => rs.length >= 2)
      .map(([model, rs]) => {
        const dots = [...rs].sort((a, b) => a.completion - b.completion);
        return {
          model,
          dots,
          min: dots[0].completion,
          max: dots[dots.length - 1].completion,
        };
      })
      .sort((a, b) => b.max - a.max);
  }, []);

  const harnesses = useMemo(() => {
    const order: AgentType[] = ["RLM", "Codex", "Claude Code", "RAG", "Hermes"];
    const present = new Set(rows.flatMap((r) => r.dots.map((d) => d.agentType)));
    return order.filter((h) => present.has(h));
  }, [rows]);

  const W = 720;
  const Lx = 140;
  const x0 = Lx;
  const x1 = W - 56;
  const rh = 42;
  const top = 12;
  const bottom = 30;
  const H = top + rows.length * rh + bottom;
  const ticks = [0, 20, 40, 60];
  const dmax = 60;
  const sx = (v: number) => x0 + (v / dmax) * (x1 - x0);

  const dimOf = (harness: string) =>
    hoveredHarness != null && hoveredHarness !== harness ? 0.15 : 1;

  return (
    <div className="my-8">
      <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
        The harness matters more than the model
      </h4>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
        Task completion for each model, split by harness. Hold the model fixed
        (one row) and the harness alone swings the score 10–20+ points.
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
        {harnesses.map((h) => (
          <div
            key={h}
            onMouseEnter={() => setHoveredHarness(h)}
            onMouseLeave={() => setHoveredHarness(null)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 cursor-pointer transition-opacity",
              hoveredHarness != null && hoveredHarness !== h && "opacity-40",
            )}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: agentColor(h, isDark) }}
            />
            {h}
          </div>
        ))}
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          style={{ fontFamily: "Body, system-ui, sans-serif" }}
        >
          {ticks.map((t) => (
            <line
              key={`g${t}`}
              x1={sx(t)}
              x2={sx(t)}
              y1={top}
              y2={H - bottom + 6}
              stroke={grid}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          ))}
          <line
            x1={x0}
            x2={x1}
            y1={H - bottom + 6}
            y2={H - bottom + 6}
            stroke={axis}
            strokeWidth={1.5}
          />
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={sx(t)}
                x2={sx(t)}
                y1={H - bottom + 6}
                y2={H - bottom + 11}
                stroke={axis}
                strokeWidth={1.5}
              />
              <text
                x={sx(t)}
                y={H - bottom + 24}
                fontSize={12}
                fill={axis}
                textAnchor="middle"
              >
                {t}%
              </text>
            </g>
          ))}

          {rows.map((row, i) => {
            const cy = top + i * rh + rh / 2;
            return (
              <g key={row.model}>
                <text
                  x={Lx - 12}
                  y={cy + 4}
                  fontSize={12.5}
                  fontWeight={600}
                  fill={ink}
                  textAnchor="end"
                >
                  {row.model}
                </text>
                <line
                  x1={sx(row.min)}
                  x2={sx(row.max)}
                  y1={cy}
                  y2={cy}
                  stroke={faint}
                  strokeWidth={3}
                />
                {row.dots.map((d) => (
                  <g
                    key={d.id}
                    onMouseEnter={() => setHoveredHarness(d.agentType)}
                    onMouseLeave={() => setHoveredHarness(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={sx(d.completion)}
                      cy={cy}
                      r={6}
                      fill={agentColor(d.agentType, isDark)}
                      fillOpacity={dimOf(d.agentType)}
                      style={{ transition: "fill-opacity 0.2s ease" }}
                    />
                    {hoveredHarness === d.agentType && (
                      <text
                        x={sx(d.completion)}
                        y={cy - 11}
                        fontSize={11}
                        fontWeight={600}
                        fill={ink}
                        textAnchor="middle"
                      >
                        {d.completion.toFixed(1)}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        Each row is one model run on multiple harnesses; dot color is the
        harness. Hover a harness to trace it across models — RLM is the rightmost
        dot in nearly every row. Preview run, subject to change.
      </p>
    </div>
  );
}

export function HorizonResults() {
  return <HorizonChart showTable />;
}

// Simple leaderboard derived from the data file: one row per (harness × model)
// configuration, showing the overall pass rate plus the easy/medium/hard
// splits. Sorted strongest-first by overall completion.
export function HorizonLeaderboard() {
  const isDark = useIsDark();
  // Keep only the strongest configuration per harness, then sort strongest-first.
  const rows = useMemo(() => {
    const bestByHarness = new Map<AgentType, ResultRow>();
    for (const r of RESULTS) {
      const cur = bestByHarness.get(r.agentType);
      if (cur == null || r.completion > cur.completion) {
        bestByHarness.set(r.agentType, r);
      }
    }
    return [...bestByHarness.values()].sort(
      (a, b) => b.completion - a.completion,
    );
  }, []);

  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-neutral-300 dark:border-neutral-700 text-left">
            <th className="py-2 pl-4 pr-4 font-semibold text-neutral-800 dark:text-neutral-200">
              Harness
            </th>
            <th className="py-2 px-4 font-semibold text-neutral-800 dark:text-neutral-200">
              Best Model
            </th>
            <th className="py-2 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Overall
            </th>
            <th className="py-2 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Easy
            </th>
            <th className="py-2 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Medium
            </th>
            <th className="py-2 pl-4 pr-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Hard
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition"
            >
              <td className="py-2 pl-4 pr-4 text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: agentColor(row.agentType, isDark) }}
                  />
                  <span className="font-medium">{row.agentType}</span>
                </span>
              </td>
              <td className="py-2 px-4 text-neutral-700 dark:text-neutral-300 tabular-nums">
                {row.model}
              </td>
              <td className="py-2 px-4 text-right tabular-nums font-medium text-neutral-800 dark:text-neutral-200">
                <span className="mr-1.5 font-normal text-neutral-400 dark:text-neutral-600">
                  {fmtCount(row.counts.overall)}
                </span>
                {fmtPct(row.completion)}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                <span className="mr-1.5 text-neutral-400 dark:text-neutral-600">
                  {fmtCount(row.counts.easy)}
                </span>
                {fmtPct(row.difficulty.easy)}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                <span className="mr-1.5 text-neutral-400 dark:text-neutral-600">
                  {fmtCount(row.counts.medium)}
                </span>
                {fmtPct(row.difficulty.medium)}
              </td>
              <td className="py-2 pl-4 pr-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                <span className="mr-1.5 text-neutral-400 dark:text-neutral-600">
                  {fmtCount(row.counts.hard)}
                </span>
                {fmtPct(row.difficulty.hard)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 italic">
        Preview run, subject to change.
      </p>
    </div>
  );
}

export function HorizonTable({
  className,
  hoveredId,
  onHover,
  hoveredType,
}: {
  className?: string;
  hoveredId?: string | null;
  onHover?: (id: string | null) => void;
  hoveredType?: string | null;
}) {
  const isDark = useIsDark();
  return (
    <div className={cn("my-8 overflow-x-auto", className)}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-neutral-300 dark:border-neutral-700 text-left">
            <th className="py-2 pl-4 pr-4 font-semibold text-neutral-800 dark:text-neutral-200">
              Agent
            </th>
            <th className="py-2 px-4 font-semibold text-neutral-800 dark:text-neutral-200">
              Model
            </th>
            <th className="py-2 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Released
            </th>
            <th className="py-2 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Completion
            </th>
            <th className="py-2 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Cost / task
            </th>
            <th className="py-2 px-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Time / task
            </th>
            <th className="py-2 pl-4 pr-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Tokens / task
            </th>
          </tr>
        </thead>
        <tbody>
          {[...RESULTS]
            .sort((a, b) => b.completion - a.completion)
            .map((row) => (
            <tr
              key={row.id}
              onMouseEnter={() => onHover?.(row.id)}
              onMouseLeave={() => onHover?.(null)}
              className={cn(
                "border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition",
                (hoveredId != null || hoveredType != null) &&
                  hoveredId !== row.id &&
                  hoveredType !== row.agentType &&
                  "opacity-40",
              )}
            >
              <td className="py-2 pl-4 pr-4 text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: agentColor(row.agentType, isDark) }}
                  />
                  <span className="font-medium">{row.agentType}</span>
                </span>
              </td>
              <td className="py-2 px-4 text-neutral-700 dark:text-neutral-300 tabular-nums">
                {row.model}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {fmtDate(row.releaseDate)}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {fmtPct(row.completion)}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {row.costUsd != null ? fmtCost(row.costUsd) : "—"}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {row.timeSec != null ? fmtTime(row.timeSec) : "—"}
              </td>
              <td className="py-2 pl-4 pr-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {row.tokensLabel ?? (row.tokens != null ? fmtTokens(row.tokens) : "—")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 italic">
        Preview run, subject to change. Specific agents may incur a cost of data ingestion.
      </p>
    </div>
  );
}
