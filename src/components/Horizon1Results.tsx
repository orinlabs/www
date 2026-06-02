import { type MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";

import { cn } from "slate-ui";
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

interface ResultRow {
  agent: string;
  completion: number;
  costUsd: number;
  timeSec: number;
  tokens: number;
}

// Sample data — replace with the final run once confirmed.
const RESULTS: ResultRow[] = [
  { agent: "Claude Opus 4.8", completion: 38, costUsd: 3.92, timeSec: 372, tokens: 980_000 },
  { agent: "GPT-5.5", completion: 34, costUsd: 2.18, timeSec: 287, tokens: 540_000 },
  { agent: "Gemini 3 Pro", completion: 29, costUsd: 1.74, timeSec: 303, tokens: 610_000 },
  { agent: "Claude Sonnet 4.7", completion: 22, costUsd: 0.96, timeSec: 201, tokens: 240_000 },
  { agent: "GPT-5.5 mini", completion: 14, costUsd: 0.42, timeSec: 132, tokens: 120_000 },
  { agent: "Llama 4 Maverick", completion: 9, costUsd: 0.21, timeSec: 156, tokens: 95_000 },
];

function fmtCost(v: number) {
  return `$${v.toFixed(2)}`;
}

function fmtTime(v: number) {
  const m = Math.floor(v / 60);
  const s = Math.round(v % 60);
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

function fmtTokens(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return `${v}`;
}

type MetricKey = "costUsd" | "timeSec" | "tokens";

interface MetricConfig {
  id: MetricKey;
  label: string;
  format: (v: number) => string;
  domain: [number, number];
  ticks: number[];
  scale: "linear" | "log";
}

const METRICS: MetricConfig[] = [
  {
    id: "costUsd",
    label: "Cost",
    format: fmtCost,
    domain: [0, 4.5],
    ticks: [0, 1, 2, 3, 4],
    scale: "linear",
  },
  {
    id: "timeSec",
    label: "Time",
    format: fmtTime,
    domain: [0, 420],
    ticks: [0, 90, 180, 270, 360],
    scale: "linear",
  },
  {
    id: "tokens",
    label: "Tokens",
    format: fmtTokens,
    domain: [1_000, 2_000_000],
    ticks: [1_000, 10_000, 100_000, 1_000_000],
    scale: "log",
  },
];

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function Horizon1Chart({
  hoveredAgent,
  onHover,
}: {
  hoveredAgent?: string | null;
  onHover?: (agent: string | null) => void;
}) {
  const isDark = useIsDark();
  const [metricId, setMetricId] = useState<MetricKey>("costUsd");
  const metric = METRICS.find((m) => m.id === metricId)!;

  const gridStroke = isDark ? "#404040" : "#e5e5e5";
  const axisStroke = isDark ? "#a0aec0" : "#171717";
  const modelColor = isDark ? "#8be0c3" : "#00845e";
  const labelFill = isDark ? "#e5e5e5" : "#171717";

  // Pixel positions of the rendered points, collected during render so a hover
  // anywhere on the chart can snap to the closest point within SNAP_RADIUS.
  const pointsRef = useRef<{ x: number; y: number; agent: string }[]>([]);
  pointsRef.current = [];
  const SNAP_RADIUS = 100;

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let best: { agent: string } | null = null;
    let bestDist = Infinity;
    for (const p of pointsRef.current) {
      const dist = Math.hypot(p.x - mx, p.y - my);
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    }
    onHover?.(best && bestDist <= SNAP_RADIUS ? best.agent : null);
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
    if (payload) pointsRef.current.push({ x: cx, y: cy, agent: payload.agent });
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

  return (
    <div className="my-8">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            Task Completion vs. {metric.label}
          </h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Horizon-1 (195 tasks), preview run
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {METRICS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMetricId(m.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer",
                m.id === metricId
                  ? "bg-primary text-anti-primary"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="h-[380px]"
        onMouseMove={handleMove}
        onMouseLeave={() => onHover?.(null)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 24, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis
              type="number"
              dataKey={metric.id}
              name={metric.label}
              scale={metric.scale}
              domain={metric.domain}
              ticks={metric.ticks}
              tickFormatter={(v) => metric.format(Number(v))}
              allowDataOverflow
              axisLine={{ stroke: axisStroke, strokeWidth: 2 }}
              tickLine={{ stroke: axisStroke, strokeWidth: 2 }}
              tick={{ fontSize: 12, fill: axisStroke }}
            />
            <YAxis
              type="number"
              dataKey="completion"
              name="Task completion"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              unit="%"
              width={38}
              axisLine={{ stroke: axisStroke, strokeWidth: 2 }}
              tickLine={{ stroke: axisStroke, strokeWidth: 2 }}
              tick={{ fontSize: 12, fill: axisStroke }}
            />
            <Scatter
              data={RESULTS}
              fill={modelColor}
              isAnimationActive={false}
              shape={renderDot}
            >
              {RESULTS.map((row) => (
                <Cell
                  key={row.agent}
                  fillOpacity={
                    hoveredAgent && hoveredAgent !== row.agent ? 0.15 : 1
                  }
                />
              ))}
              <LabelList
                dataKey="agent"
                position="top"
                content={(props) => {
                  const { x, y, value } = props as {
                    x?: number;
                    y?: number;
                    value?: string | number;
                  };
                  if (typeof x !== "number" || typeof y !== "number")
                    return null;
                  const agent = String(value ?? "");
                  const dimmed = hoveredAgent != null && hoveredAgent !== agent;
                  return (
                    <text
                      x={x}
                      y={y}
                      dy={-4}
                      textAnchor="middle"
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        fill: dimmed
                          ? isDark
                            ? "#525252"
                            : "#cbd5e1"
                          : labelFill,
                        transition: "fill 0.2s ease",
                      }}
                    >
                      {agent}
                    </text>
                  );
                }}
              />
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 text-center italic">
        Toggle the x-axis between cost, time, and tokens read per task.
        {metric.scale === "log" && " Tokens shown on a log scale."}
      </p>
    </div>
  );
}

export function Horizon1Results() {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  return (
    <>
      <Horizon1Chart hoveredAgent={hoveredAgent} onHover={setHoveredAgent} />
      <Horizon1Table hoveredAgent={hoveredAgent} onHover={setHoveredAgent} />
    </>
  );
}

export function Horizon1Table({
  hoveredAgent,
  onHover,
}: {
  hoveredAgent?: string | null;
  onHover?: (agent: string | null) => void;
}) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-neutral-300 dark:border-neutral-700 text-left">
            <th className="py-2 pr-4 font-semibold text-neutral-800 dark:text-neutral-200">
              Agent
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
            <th className="py-2 pl-4 font-semibold text-neutral-800 dark:text-neutral-200 text-right">
              Tokens / task
            </th>
          </tr>
        </thead>
        <tbody>
          {RESULTS.map((row) => (
            <tr
              key={row.agent}
              onMouseEnter={() => onHover?.(row.agent)}
              onMouseLeave={() => onHover?.(null)}
              className={cn(
                "border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition",
                hoveredAgent != null &&
                  hoveredAgent !== row.agent &&
                  "opacity-40",
              )}
            >
              <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-300">
                <span className="font-medium">{row.agent}</span>
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {row.completion}%
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {fmtCost(row.costUsd)}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {fmtTime(row.timeSec)}
              </td>
              <td className="py-2 pl-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {fmtTokens(row.tokens)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 italic">
        Sample data, subject to change.
      </p>
    </div>
  );
}
