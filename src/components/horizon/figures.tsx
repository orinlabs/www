import {
  type Key,
  type MouseEvent as ReactMouseEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "slate-ui";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ADVERSARIAL_ROBUSTNESS,
  AGENT_TYPES,
  displayAgentType,
  type AgentType,
  ARCHITECTURE_SPREAD,
  CONTENT_FLAGS,
  CONVERGENCE,
  DIFFICULTY_AXES,
  DIFFICULTY_BUCKETS,
  type DifficultyBucket,
  DIFFICULTY_FAMILIES,
  TREND_AXES,
  TREND_FAMILIES,
  fmtDateAxis,
  fmtPct,
  fmtTokens,
  RESULTS,
  TASK_DIMENSIONS,
} from "./data";
import { agentColor, useIsDark } from "./theme";

// ---------------------------------------------------------------------------
// Shared primitives: a figure frame with caption, plus recharts axis/grid
// styling so every figure matches the scatter charts (HorizonChart) exactly.
// ---------------------------------------------------------------------------

// Shared chart constants matching the recharts charts.
const GRID_DASH = "3 3";
const AXIS_WIDTH = 1.5;
const TICK_FONT = 12;

// TODO(remove): only referenced by the legacy hand-drawn charts below.
function usePalette() {
  const isDark = useIsDark();
  return {
    isDark,
    ink: isDark ? "#e5e5e5" : "#171717",
    muted: isDark ? "#a3a3a3" : "#737373",
    faint: isDark ? "#404040" : "#e5e5e5",
    ref: isDark ? "#525252" : "#cbd5e1",
    neg: isDark ? "#f87171" : "#dc2626",
    pos: isDark ? "#34d399" : "#059669",
    surface: isDark ? "#0a0a0a" : "#ffffff",
    grid: isDark ? "#404040" : "#e5e5e5",
    axis: isDark ? "#737373" : "#a3a3a3",
  };
}

// Axis/grid styling shared by every recharts figure (identical to HorizonChart).
function useChartStyle() {
  const isDark = useIsDark();
  const gridStroke = isDark ? "#404040" : "#e5e5e5";
  const axisStroke = isDark ? "#737373" : "#a3a3a3";
  return {
    isDark,
    gridStroke,
    axisStroke,
    surface: isDark ? "#0a0a0a" : "#ffffff",
    ink: isDark ? "#e5e5e5" : "#171717",
    muted: isDark ? "#a3a3a3" : "#737373",
    neg: isDark ? "#f87171" : "#dc2626",
    pos: isDark ? "#34d399" : "#059669",
    axisProps: {
      axisLine: { stroke: axisStroke, strokeWidth: AXIS_WIDTH },
      tickLine: { stroke: axisStroke, strokeWidth: AXIS_WIDTH },
      tick: { fontSize: TICK_FONT, fill: axisStroke },
    } as const,
  };
}

// Solid r=6 dot, identical to the scatter charts' dots.
function dotShape(fill: string, opacity = 1, r = 6) {
  return function Dot(props: {
    cx?: number;
    cy?: number;
    key?: Key | null;
  }) {
    const { cx, cy, key } = props;
    if (typeof cx !== "number" || typeof cy !== "number")
      return <g key={key} />;
    return (
      <circle
        key={key}
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        fillOpacity={opacity}
      />
    );
  };
}

interface LabelRenderProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  value?: number | string;
  index?: number;
}

function Figure({
  title,
  caption,
  children,
}: {
  title?: string;
  caption?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-8">
      {title && (
        <figcaption className="mb-1 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {title}
        </figcaption>
      )}
      {children}
      {caption && (
        <figcaption className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Inherit the page font so SVG text matches the recharts charts exactly.
const FONT = "Body, system-ui, sans-serif";

// ---------------------------------------------------------------------------
// Dumbbell / range chart. Each row is a category with two points on a shared
// axis; the connecting segment's LENGTH is the effect (lie factor ~1). Used for
// the harness spread and for clean-vs-adversarial robustness.
// ---------------------------------------------------------------------------

export interface DumbbellPoint {
  value: number;
  color: string;
  filled: boolean;
  // 0–1; applied to both fill and stroke so a point can be a faded version of
  // its color (e.g. adversarial dots at 50%).
  opacity?: number;
  tag?: string;
}

export interface DumbbellRow {
  label: string;
  a: DumbbellPoint;
  b: DumbbellPoint;
  delta: string;
}

export function DumbbellChart({
  rows,
  domain,
  ticks,
  legend,
}: {
  rows: DumbbellRow[];
  domain: [number, number];
  ticks: number[];
  legend?: {
    label: string;
    color: string;
    filled: boolean;
    opacity?: number;
  }[];
}) {
  const p = usePalette();
  const W = 720;
  const Lx = 116; // left gutter for row labels
  const x0 = Lx;
  const x1 = W - 64;
  const rh = 46;
  const top = legend ? 30 : 12;
  const bottom = 30;
  const H = top + rows.length * rh + bottom;
  const [dmin, dmax] = domain;
  const sx = (v: number) => x0 + ((v - dmin) / (dmax - dmin)) * (x1 - x0);

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        style={{ fontFamily: FONT }}
      >
        {/* direct-labeled legend */}
        {legend && (
          <g transform={`translate(${x0}, 16)`}>
            {legend.map((l, i) => (
              <g key={l.label} transform={`translate(${i * 180}, 0)`}>
                <circle
                  cx={6}
                  cy={-4}
                  r={5}
                  fill={l.filled ? l.color : p.surface}
                  fillOpacity={l.opacity ?? 1}
                  stroke={l.color}
                  strokeOpacity={l.opacity ?? 1}
                  strokeWidth={1.5}
                />
                <text x={18} y={0} fontSize={12} fill={p.muted}>
                  {l.label}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* gridlines + axis baseline with sparse ticks */}
        {ticks.map((t) => (
          <line
            key={`g${t}`}
            x1={sx(t)}
            x2={sx(t)}
            y1={top}
            y2={H - bottom + 6}
            stroke={p.grid}
            strokeWidth={1}
            strokeDasharray={GRID_DASH}
          />
        ))}
        <line
          x1={x0}
          x2={x1}
          y1={H - bottom + 6}
          y2={H - bottom + 6}
          stroke={p.axis}
          strokeWidth={AXIS_WIDTH}
        />
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={sx(t)}
              x2={sx(t)}
              y1={H - bottom + 6}
              y2={H - bottom + 11}
              stroke={p.axis}
              strokeWidth={AXIS_WIDTH}
            />
            <text
              x={sx(t)}
              y={H - bottom + 24}
              fontSize={TICK_FONT}
              fill={p.axis}
              textAnchor="middle"
            >
              {t}%
            </text>
          </g>
        ))}

        {rows.map((row, i) => {
          const cy = top + i * rh + rh / 2;
          const lo = row.a.value <= row.b.value ? row.a : row.b;
          const hi = row.a.value <= row.b.value ? row.b : row.a;
          const xLo = sx(lo.value);
          const xHi = sx(hi.value);
          return (
            <g key={row.label}>
              {/* row label */}
              <text
                x={8}
                y={cy + 4}
                fontSize={12.5}
                fontWeight={600}
                fill={p.ink}
              >
                {row.label}
              </text>
              {/* connecting range */}
              <line
                x1={xLo}
                x2={xHi}
                y1={cy}
                y2={cy}
                stroke={p.faint}
                strokeWidth={3}
              />
              {/* delta annotation above the segment midpoint */}
              <text
                x={(xLo + xHi) / 2}
                y={cy - 12}
                fontSize={11}
                fontWeight={600}
                fill={p.muted}
                textAnchor="middle"
              >
                {row.delta}
              </text>
              {/* low point + outer label */}
              <circle
                cx={xLo}
                cy={cy}
                r={6}
                fill={lo.filled ? lo.color : p.surface}
                fillOpacity={lo.opacity ?? 1}
                stroke={lo.color}
                strokeOpacity={lo.opacity ?? 1}
                strokeWidth={1.5}
              />
              <text
                x={xLo - 11}
                y={cy + 4}
                fontSize={11.5}
                fill={p.ink}
                textAnchor="end"
              >
                {lo.tag ? `${lo.tag} ` : ""}
                {lo.value.toFixed(lo.value % 1 === 0 ? 0 : 1)}%
              </text>
              {/* high point + outer label */}
              <circle
                cx={xHi}
                cy={cy}
                r={6}
                fill={hi.filled ? hi.color : p.surface}
                fillOpacity={hi.opacity ?? 1}
                stroke={hi.color}
                strokeOpacity={hi.opacity ?? 1}
                strokeWidth={1.5}
              />
              <text
                x={xHi + 11}
                y={cy + 4}
                fontSize={11.5}
                fill={p.ink}
                textAnchor="start"
              >
                {hi.tag ? `${hi.tag} ` : ""}
                {hi.value.toFixed(hi.value % 1 === 0 ? 0 : 1)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small multiples: one slope panel per difficulty axis, on a shared y-scale,
// with the overall mean drawn as a faint reference line. Lets the eye compare
// slopes (how steeply each axis degrades accuracy) within one glance.
// ---------------------------------------------------------------------------

export interface SlopePanel {
  title: string;
  left: { label: string; value: number };
  right: { label: string; value: number };
  delta: string;
}

export function SlopeSmallMultiples({
  panels,
  yDomain,
  mean,
}: {
  panels: SlopePanel[];
  yDomain: [number, number];
  mean: number;
}) {
  const p = usePalette();
  const [ymin, ymax] = yDomain;
  const W = 230;
  const H = 168;
  const padTop = 26;
  const padBottom = 30;
  const xL = 18;
  const xR = W - 18;
  const sy = (v: number) =>
    padTop + (1 - (v - ymin) / (ymax - ymin)) * (H - padTop - padBottom);

  return (
    <div className="my-8">
      <div className="flex flex-wrap justify-between gap-y-4">
        {panels.map((panel) => {
          const xa = xL;
          const xb = xR;
          const ya = sy(panel.left.value);
          const yb = sy(panel.right.value);
          return (
            <div key={panel.title} className="flex-1 min-w-[200px]">
              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 text-center mb-1">
                {panel.title}
                <span className="ml-1 font-normal text-neutral-500 dark:text-neutral-400">
                  {panel.delta}
                </span>
              </div>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                width="100%"
                style={{ fontFamily: FONT }}
              >
                {/* mean reference gridline */}
                <line
                  x1={xL - 6}
                  x2={xR + 6}
                  y1={sy(mean)}
                  y2={sy(mean)}
                  stroke={p.grid}
                  strokeWidth={1}
                  strokeDasharray={GRID_DASH}
                />
                {/* x-axis baseline */}
                <line
                  x1={xL - 6}
                  x2={xR + 6}
                  y1={H - padBottom}
                  y2={H - padBottom}
                  stroke={p.axis}
                  strokeWidth={AXIS_WIDTH}
                />
                {/* slope */}
                <line
                  x1={xa}
                  x2={xb}
                  y1={ya}
                  y2={yb}
                  stroke={p.ink}
                  strokeWidth={2}
                />
                {/* endpoints + value labels */}
                <circle cx={xa} cy={ya} r={5} fill={p.ink} />
                <circle cx={xb} cy={yb} r={5} fill={p.ink} />
                <text
                  x={xa}
                  y={ya - 10}
                  fontSize={12}
                  fontWeight={600}
                  fill={p.ink}
                  textAnchor="middle"
                >
                  {panel.left.value.toFixed(1)}
                </text>
                <text
                  x={xb}
                  y={yb - 10}
                  fontSize={12}
                  fontWeight={600}
                  fill={p.ink}
                  textAnchor="middle"
                >
                  {panel.right.value.toFixed(1)}
                </text>
                {/* x category labels */}
                <text
                  x={xa}
                  y={H - 8}
                  fontSize={TICK_FONT}
                  fill={p.axis}
                  textAnchor="middle"
                >
                  {panel.left.label}
                </text>
                <text
                  x={xb}
                  y={H - 8}
                  fontSize={TICK_FONT}
                  fill={p.axis}
                  textAnchor="middle"
                >
                  {panel.right.label}
                </text>
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Diverging bars around a zero baseline. Bar length = effect on pass rate of a
// content flag (signed). Sorted, direct-labeled, red/green by sign.
// ---------------------------------------------------------------------------

export interface DivergingItem {
  label: string;
  value: number;
}

export function DivergingBars({
  items,
  domain,
}: {
  items: DivergingItem[];
  domain: [number, number];
}) {
  const p = usePalette();
  const W = 720;
  const Lx = 168;
  const x0 = Lx;
  const x1 = W - 24;
  const rh = 30;
  const top = 8;
  const H = top + items.length * rh + 24;
  const [dmin, dmax] = domain;
  const sx = (v: number) => x0 + ((v - dmin) / (dmax - dmin)) * (x1 - x0);
  const zero = sx(0);
  const axisBottom = H - 18;

  // Dashed gridlines at round steps (zero is drawn separately as the axis).
  const step = 10;
  const gridTicks: number[] = [];
  for (
    let v = Math.ceil(dmin / step) * step;
    v <= Math.floor(dmax / step) * step;
    v += step
  ) {
    if (v !== 0) gridTicks.push(v);
  }

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        style={{ fontFamily: FONT }}
      >
        {/* gridlines */}
        {gridTicks.map((t) => (
          <line
            key={`g${t}`}
            x1={sx(t)}
            x2={sx(t)}
            y1={top - 2}
            y2={axisBottom}
            stroke={p.grid}
            strokeWidth={1}
            strokeDasharray={GRID_DASH}
          />
        ))}
        {/* zero baseline (axis) */}
        <line
          x1={zero}
          x2={zero}
          y1={top - 2}
          y2={axisBottom}
          stroke={p.axis}
          strokeWidth={AXIS_WIDTH}
        />
        {items.map((it, i) => {
          const cy = top + i * rh + rh / 2;
          const pos = it.value >= 0;
          const xEnd = sx(it.value);
          const barX = Math.min(zero, xEnd);
          const barW = Math.abs(xEnd - zero);
          const color = pos ? p.pos : p.neg;
          return (
            <g key={it.label}>
              <text
                x={Lx - 12}
                y={cy + 4}
                fontSize={12}
                fill={p.ink}
                textAnchor="end"
              >
                {it.label}
              </text>
              <rect
                x={barX}
                y={cy - 9}
                width={barW}
                height={18}
                rx={2}
                fill={color}
                fillOpacity={0.85}
              />
              <text
                x={pos ? xEnd + 6 : xEnd - 6}
                y={cy + 4}
                fontSize={11.5}
                fontWeight={600}
                fill={color}
                textAnchor={pos ? "start" : "end"}
              >
                {pos ? "+" : "−"}
                {Math.abs(it.value).toFixed(1)}
              </text>
            </g>
          );
        })}
        <text
          x={x0}
          y={H - 4}
          fontSize={TICK_FONT}
          fill={p.axis}
          textAnchor="start"
        >
          ←  harder
        </text>
        <text
          x={x1}
          y={H - 4}
          fontSize={TICK_FONT}
          fill={p.axis}
          textAnchor="end"
        >
          easier  →
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Two-line slope chart showing how the adversarial gap collapses as semantic
// distance grows. Lines are direct-labeled at their right end; the vertical gap
// at each x is annotated, so the "convergence" reads at a glance.
// ---------------------------------------------------------------------------

export interface ConvergenceSeries {
  name: string;
  color: string;
  dashed?: boolean;
  points: number[];
}

export function ConvergenceLines({
  xLabels,
  series,
  yDomain,
}: {
  xLabels: string[];
  series: [ConvergenceSeries, ConvergenceSeries];
  yDomain: [number, number];
}) {
  const p = usePalette();
  const W = 620;
  const H = 280;
  const padTop = 24;
  const padBottom = 34;
  const xL = 56;
  const xR = W - 150;
  const [ymin, ymax] = yDomain;
  const n = xLabels.length;
  const sx = (i: number) => xL + (i / (n - 1)) * (xR - xL);
  const sy = (v: number) =>
    padTop + (1 - (v - ymin) / (ymax - ymin)) * (H - padTop - padBottom);

  // Right-edge series labels: anchor to each line's endpoint, but force a
  // minimum vertical separation so near-equal endpoints don't overlap.
  const last = n - 1;
  let yEndA = sy(series[0].points[last]);
  let yEndB = sy(series[1].points[last]);
  if (Math.abs(yEndA - yEndB) < 16) {
    const mid = (yEndA + yEndB) / 2;
    const aAbove = yEndA <= yEndB;
    yEndA = mid + (aAbove ? -9 : 9);
    yEndB = mid + (aAbove ? 9 : -9);
  }
  const endY = [yEndA, yEndB];

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        style={{ fontFamily: FONT }}
      >
        {/* y gridlines + ticks (sparse) */}
        {[ymin, (ymin + ymax) / 2, ymax].map((t) => (
          <g key={t}>
            <line
              x1={xL}
              x2={xR}
              y1={sy(t)}
              y2={sy(t)}
              stroke={p.grid}
              strokeWidth={1}
              strokeDasharray={GRID_DASH}
            />
            <text
              x={xL - 10}
              y={sy(t) + 4}
              fontSize={TICK_FONT}
              fill={p.axis}
              textAnchor="end"
            >
              {Math.round(t)}%
            </text>
          </g>
        ))}
        {/* axis spines */}
        <line
          x1={xL}
          x2={xL}
          y1={sy(ymax)}
          y2={sy(ymin)}
          stroke={p.axis}
          strokeWidth={AXIS_WIDTH}
        />
        <line
          x1={xL}
          x2={xR}
          y1={sy(ymin)}
          y2={sy(ymin)}
          stroke={p.axis}
          strokeWidth={AXIS_WIDTH}
        />

        {/* vertical connector at each x: its shrinking length IS the gap */}
        {xLabels.map((_, i) => {
          const y0 = sy(series[0].points[i]);
          const y1 = sy(series[1].points[i]);
          return (
            <line
              key={i}
              x1={sx(i)}
              x2={sx(i)}
              y1={Math.min(y0, y1)}
              y2={Math.max(y0, y1)}
              stroke={p.ref}
              strokeWidth={1.5}
            />
          );
        })}

        {/* per-x value labels: higher value sits above, lower below, so the two
            never collide even where the lines nearly meet */}
        {xLabels.map((_, i) => {
          const vA = series[0].points[i];
          const vB = series[1].points[i];
          const aHigher = vA >= vB;
          return (
            <g key={i}>
              <text
                x={sx(i)}
                y={sy(vA) + (aHigher ? -10 : 18)}
                fontSize={11.5}
                fontWeight={600}
                fill={series[0].color}
                textAnchor="middle"
              >
                {vA.toFixed(1)}
              </text>
              <text
                x={sx(i)}
                y={sy(vB) + (aHigher ? 18 : -10)}
                fontSize={11.5}
                fontWeight={600}
                fill={series[1].color}
                textAnchor="middle"
              >
                {vB.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* series lines + points */}
        {series.map((s, si) => (
          <g key={s.name}>
            <polyline
              points={s.points.map((v, i) => `${sx(i)},${sy(v)}`).join(" ")}
              fill="none"
              stroke={s.color}
              strokeWidth={2.5}
              strokeDasharray={s.dashed ? "5 4" : undefined}
            />
            {s.points.map((v, i) => (
              <circle key={i} cx={sx(i)} cy={sy(v)} r={4} fill={s.color} />
            ))}
            <text
              x={xR + 12}
              y={endY[si] + 4}
              fontSize={12}
              fontWeight={600}
              fill={s.color}
              textAnchor="start"
            >
              {s.name}
            </text>
          </g>
        ))}

        {/* x labels */}
        {xLabels.map((lab, i) => (
          <text
            key={lab}
            x={sx(i)}
            y={H - 12}
            fontSize={TICK_FONT}
            fill={p.axis}
            textAnchor="middle"
          >
            {lab}
          </text>
        ))}
      </svg>
    </div>
  );
}

// Convenience: resolve an agent color for the current theme.
function useAgentColor() {
  const isDark = useIsDark();
  return (agent: string) => agentColor(agent, isDark);
}

// ===========================================================================
// Data-baked Horizon figures. Each owns its data + caption so the article
// body just drops them in.
// ===========================================================================

export function ArchitectureSpreadFigure() {
  const { gridStroke, axisProps, ink, muted, pos } = useChartStyle();
  const data = ARCHITECTURE_SPREAD.map((r) => ({
    ...r,
    span: Number((r.high - r.low).toFixed(1)),
  }));

  // Same hover behavior as the main chart: dim everything except the hovered
  // row, and reveal that row's labels only on hover.
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredModel = hovered != null ? data[hovered]?.model : null;
  const dimOf = (model?: string) =>
    hoveredModel != null && model !== hoveredModel ? 0.15 : 1;

  // Bare dot, dimmed unless its row is hovered.
  const dot = (fill: string) =>
    function Dot(props: unknown) {
      const { cx, cy, key, payload } = props as {
        cx?: number;
        cy?: number;
        key?: Key | null;
        payload?: { model?: string };
      };
      if (typeof cx !== "number" || typeof cy !== "number")
        return <g key={key} />;
      return (
        <circle
          key={key}
          cx={cx}
          cy={cy}
          r={6}
          fill={fill}
          fillOpacity={dimOf(payload?.model)}
        />
      );
    };

  // Harness label + value, shown only for the hovered row.
  const endLabel = (side: "low" | "high") => (props: LabelRenderProps) => {
    const { x, y, index } = props;
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      index == null ||
      index !== hovered
    )
      return null;
    const d = data[index];
    const isLow = side === "low";
    return (
      <text
        x={(isLow ? x - 7 : x + 11) + 4}
        y={y + 8}
        textAnchor={isLow ? "end" : "start"}
        fontSize={12}
        fill={ink}
      >
        {isLow ? `${d.worstH} ${d.low}%` : `${d.bestH} ${d.high}%`}
      </text>
    );
  };

  // Connector drawn as an arrow pointing worst → best (span Bar spans low→high).
  const arrowBar = (props: unknown) => {
    const { x, y, width, height, payload } = props as LabelRenderProps & {
      payload?: { model?: string };
    };
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof width !== "number" ||
      typeof height !== "number"
    )
      return <g />;
    const cy = y + height / 2;
    const tip = x + width - 6; // stop at the edge of the best-harness dot
    const head = 8;
    return (
      <g opacity={dimOf(payload?.model)}>
        <line
          x1={x}
          y1={cy}
          x2={tip - head}
          y2={cy}
          stroke={muted}
          strokeWidth={2}
        />
        <path
          d={`M ${tip} ${cy} L ${tip - head} ${cy - head * 0.6} L ${tip - head} ${cy + head * 0.6} Z`}
          fill={muted}
        />
      </g>
    );
  };
  return (
    <Figure
      title="Same model, best vs. worst harness"
      caption={
        <>
          Each row takes the identical model and connects its worst harness
          (gray) to its best (green), so the arrow length is purely the harness
          effect. The best harness is RLM on the Claude models, gpt-5-mini, and
          gpt-5.5;
          on sonnet-4.5. The gain is largest
          on the strongest model (claude-opus-4.8, +20pp).
        </>
      }
    >
      <div className="flex items-center gap-4 mb-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: muted }}
          />
          Worst
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: pos }}
          />
          Best
        </span>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            data={data}
            margin={{ top: 8, right: 64, left: 8, bottom: 8 }}
            onMouseMove={(s: {
              activeTooltipIndex?: number | string | null;
            }) => {
              const n = s?.activeTooltipIndex;
              const idx = n == null ? null : Number(n);
              setHovered(idx != null && Number.isFinite(idx) ? idx : null);
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <CartesianGrid
              strokeDasharray={GRID_DASH}
              stroke={gridStroke}
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 60]}
              ticks={[0, 20, 40, 60]}
              tickFormatter={(v: unknown) => `${v}%`}
              {...axisProps}
            />
            <YAxis type="category" dataKey="model" width={108} {...axisProps} />
            <Tooltip cursor={false} content={() => null} />
            <Bar
              dataKey="low"
              stackId="a"
              fill="transparent"
              isAnimationActive={false}
            />
            <Bar
              dataKey="span"
              stackId="a"
              fill="none"
              barSize={16}
              shape={arrowBar}
              isAnimationActive={false}
            />
            <Scatter dataKey="low" shape={dot(muted)} isAnimationActive={false}>
              <LabelList dataKey="low" content={endLabel("low")} />
            </Scatter>
            <Scatter dataKey="high" shape={dot(pos)} isAnimationActive={false}>
              <LabelList dataKey="high" content={endLabel("high")} />
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Figure>
  );
}

export function DifficultyAxesFigure() {
  const { gridStroke, axisStroke, axisProps } = useChartStyle();
  const color = useAgentColor();
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <Figure
      title="Difficulty Breakdown"
      caption={
        <>
          Pass rate by harness across each axis's levels, holding the model fixed
          at claude-opus-4.8 so the differences are the harness alone; the dashed
          gray line is the all-agents mean. The fourth panel treats adversarial
          vs. non-adversarial as its own axis.
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
        {DIFFICULTY_FAMILIES.map((f) => (
          <div
            key={f.id}
            onMouseEnter={() => setHovered(f.id)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "flex items-center gap-1.5 cursor-pointer transition-opacity",
              hovered != null && hovered !== f.id && "opacity-40",
            )}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: color(f.colorKey) }}
            />
            {f.label}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
          <span
            className="inline-block w-4 border-t-2 border-dashed"
            style={{ borderColor: axisStroke }}
          />
          mean
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {DIFFICULTY_AXES.map((ax) => (
          <div key={ax.key}>
            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 text-center mb-1">
              {ax.title}{" "}
              <span className="font-normal text-neutral-500 dark:text-neutral-400">
                {ax.drop}
              </span>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ax.data}
                  margin={{ top: 16, right: 12, left: 0, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray={GRID_DASH}
                    stroke={gridStroke}
                    vertical={false}
                  />
                  <XAxis dataKey="level" {...axisProps} />
                  <YAxis
                    type="number"
                    domain={[0, 70]}
                    ticks={[0, 20, 40, 60]}
                    tickFormatter={(v: unknown) => `${v}%`}
                    width={34}
                    {...axisProps}
                  />
                  <Line
                    dataKey="ALL"
                    stroke={axisStroke}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                    isAnimationActive={false}
                    activeDot={false}
                  />
                  {DIFFICULTY_FAMILIES.map((f) => {
                    const c = color(f.colorKey);
                    const dim = hovered != null && hovered !== f.id;
                    return (
                      <Line
                        key={f.id}
                        dataKey={f.id}
                        stroke={c}
                        strokeWidth={2}
                        strokeOpacity={dim ? 0.12 : 1}
                        isAnimationActive={false}
                        activeDot={false}
                        dot={dotShape(c, dim ? 0.12 : 1, 4)}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}

export function ContentFlagsFigure() {
  const { gridStroke, axisStroke, axisProps, pos, neg } = useChartStyle();
  const flags = CONTENT_FLAGS;
  const renderValue = (props: LabelRenderProps) => {
    const { x, y, width, height, value } = props;
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof width !== "number" ||
      typeof height !== "number" ||
      typeof value !== "number"
    )
      return null;
    const isPos = value >= 0;
    const left = Math.min(x, x + width);
    const right = Math.max(x, x + width);
    const lx = isPos ? right + 6 : left - 6;
    return (
      <text
        x={lx}
        y={y + height / 2 + 4}
        textAnchor={isPos ? "start" : "end"}
        fontSize={12}
        fontWeight={600}
        fill={isPos ? pos : neg}
      >
        {isPos ? "+" : "−"}
        {Math.abs(value).toFixed(1)}
      </text>
    );
  };
  return (
    <Figure
      title="What makes a task hard: pass-rate delta per content flag"
      caption={
        <>
          Each bar is the pass-rate difference between tasks carrying a flag and
          the rest of the benchmark. Negative (red) makes tasks harder, positive
          (green) easier.
        </>
      }
    >
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={flags}
            margin={{ top: 8, right: 56, left: 8, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray={GRID_DASH}
              stroke={gridStroke}
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[-26, 26]}
              ticks={[-20, -10, 0, 10, 20]}
              {...axisProps}
            />
            <YAxis type="category" dataKey="label" width={166} {...axisProps} />
            <ReferenceLine x={0} stroke={axisStroke} strokeWidth={AXIS_WIDTH} />
            <Bar dataKey="value" isAnimationActive={false} radius={2} barSize={18}>
              {flags.map((f) => (
                <Cell
                  key={f.label}
                  fill={f.value >= 0 ? pos : neg}
                  fillOpacity={0.85}
                />
              ))}
              <LabelList content={renderValue} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 space-y-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
        {flags.map((f) => (
          <p key={f.label}>
            <span
              className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
              style={{ background: f.value >= 0 ? pos : neg }}
            />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {f.label}
            </span>{" "}
            {f.desc}
          </p>
        ))}
      </div>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// Pass rate across the levels of one task axis (easiest → hardest), as a single
// line chart. Reused for the semantic-distance and reasoning-hops figures in the
// difficulty section. Numbers are pooled + runtime-derived from ./data.
// ---------------------------------------------------------------------------

const TREND_LINE_SNAP_RADIUS = 28;
const TREND_PANEL_HEIGHT = 286;
const TREND_CHART_MARGIN = { top: 24, right: 16, left: 4, bottom: 28 };

interface TrendChartPoint {
  x: number;
  y: number;
  harnessId: string;
  value: number;
}

function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(
    0,
    Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)),
  );
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function nearestHarnessLine(
  points: TrendChartPoint[],
  mx: number,
  my: number,
): string | null {
  const byHarness = new Map<string, TrendChartPoint[]>();
  for (const p of points) {
    const list = byHarness.get(p.harnessId) ?? [];
    list.push(p);
    byHarness.set(p.harnessId, list);
  }

  let bestHarness: string | null = null;
  let bestDist = Infinity;
  for (const [harnessId, pts] of byHarness) {
    const sorted = [...pts].sort((a, b) => a.x - b.x);
    let lineDist = Infinity;
    if (sorted.length === 1) {
      lineDist = Math.hypot(mx - sorted[0].x, my - sorted[0].y);
    } else {
      for (let i = 0; i < sorted.length - 1; i++) {
        lineDist = Math.min(
          lineDist,
          distToSegment(
            mx,
            my,
            sorted[i].x,
            sorted[i].y,
            sorted[i + 1].x,
            sorted[i + 1].y,
          ),
        );
      }
    }
    if (lineDist < bestDist) {
      bestDist = lineDist;
      bestHarness = harnessId;
    }
  }

  return bestDist <= TREND_LINE_SNAP_RADIUS ? bestHarness : null;
}

function HarnessTrendPanel({
  data,
  height,
  style,
  color,
  hoveredHarness,
  onHoverLine,
  onClearLine,
  yAxisLabel,
  xAxisLabel,
}: {
  data: Record<string, number | string>[];
  height: number;
  style: ReturnType<typeof useChartStyle>;
  color: (agent: string) => string;
  hoveredHarness: string | null;
  onHoverLine: (harnessId: string | null) => void;
  onClearLine: () => void;
  yAxisLabel?: string;
  xAxisLabel?: string;
}) {
  const { gridStroke, axisProps, surface, axisStroke } = style;
  const pointsRef = useRef<TrendChartPoint[]>([]);
  pointsRef.current = [];

  const harnessOpacity = (harnessId: string) => {
    if (hoveredHarness == null) return 1;
    if (hoveredHarness === harnessId) return 1;
    return 0.15;
  };

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    onHoverLine(nearestHarnessLine(pointsRef.current, mx, my));
  };

  const makeDot =
    (harnessId: string, dotColor: string) =>
    (props: {
      cx?: number;
      cy?: number;
      key?: Key | null;
      payload?: Record<string, number | string>;
    }) => {
      const { cx, cy, key, payload } = props;
      if (typeof cx !== "number" || typeof cy !== "number" || !payload)
        return <g key={key} />;
      const value = payload[harnessId];
      if (typeof value !== "number") return <g key={key} />;
      pointsRef.current.push({ x: cx, y: cy, harnessId, value });
      const opacity = harnessOpacity(harnessId);
      return (
        <g key={key}>
          <circle cx={cx} cy={cy} r={5} fill={surface} />
          <circle
            cx={cx}
            cy={cy}
            r={4}
            fill={dotColor}
            fillOpacity={opacity}
            style={{ transition: "fill-opacity 0.2s ease" }}
          />
        </g>
      );
    };

  const valueLabel = (dotColor: string) => (props: LabelRenderProps) => {
      const { x, y, index } = props;
      if (typeof x !== "number" || typeof y !== "number" || index == null)
        return null;
      const row = data[index];
      if (!row || hoveredHarness == null) return null;
      const value = row[hoveredHarness];
      if (typeof value !== "number") return null;
      return (
        <text
          x={x}
          y={y}
          dy={-12}
          textAnchor="middle"
          fontSize={11}
          fontWeight={600}
          fill={dotColor}
          style={{ pointerEvents: "none" }}
        >
          {fmtPct(value)}
        </text>
      );
    };

  return (
    <div style={{ height }} onMouseMove={handleMove} onMouseLeave={onClearLine}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={TREND_CHART_MARGIN}>
          <CartesianGrid
            strokeDasharray={GRID_DASH}
            stroke={gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="level"
            type="category"
            scale="point"
            padding={{ left: 24, right: 24 }}
            {...axisProps}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: "insideBottom",
                    offset: -12,
                    fill: axisStroke,
                    fontSize: TICK_FONT,
                  }
                : undefined
            }
          />
          <YAxis
            type="number"
            domain={[0, 70]}
            ticks={[0, 20, 40, 60]}
            tickFormatter={(v: unknown) => `${v}%`}
            width={yAxisLabel ? 50 : 34}
            {...axisProps}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    offset: 8,
                    fill: axisStroke,
                    fontSize: TICK_FONT,
                    style: { textAnchor: "middle" },
                  }
                : undefined
            }
          />
          {TREND_FAMILIES.map((f) => {
            const c = color(f.colorKey);
            const active = hoveredHarness === f.id;
            const opacity = harnessOpacity(f.id);
            return (
              <Line
                key={f.id}
                dataKey={f.id}
                stroke={c}
                strokeWidth={active ? 3 : 2}
                strokeOpacity={opacity}
                style={{ transition: "stroke-opacity 0.2s ease" }}
                isAnimationActive={false}
                activeDot={false}
                dot={makeDot(f.id, c)}
                connectNulls
              />
            );
          })}
          {hoveredHarness && (() => {
            const f = TREND_FAMILIES.find((x) => x.id === hoveredHarness);
            if (!f) return null;
            const c = color(f.colorKey);
            return (
              <Line
                key={`labels-${f.id}`}
                dataKey={f.id}
                stroke="none"
                strokeWidth={0}
                dot={false}
                isAnimationActive={false}
                activeDot={false}
              >
                <LabelList content={valueLabel(c)} />
              </Line>
            );
          })()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function HarnessTrendHistogram({
  data,
  height,
  style,
  color,
  hoveredHarness,
  onHoverHarness,
  onClearHarness,
  xAxisLabel,
}: {
  data: Record<string, number | string>[];
  height: number;
  style: ReturnType<typeof useChartStyle>;
  color: (agent: string) => string;
  hoveredHarness: string | null;
  onHoverHarness: (harnessId: string | null) => void;
  onClearHarness: () => void;
  xAxisLabel?: string;
}) {
  const { gridStroke, axisProps, axisStroke } = style;

  const harnessOpacity = (harnessId: string) => {
    if (hoveredHarness == null) return 0.85;
    if (hoveredHarness === harnessId) return 0.95;
    return 0.2;
  };

  const barLabel =
    (harnessId: string, dotColor: string) => (props: LabelRenderProps) => {
      const { x, y, width, value, index } = props;
      if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        typeof width !== "number" ||
        index == null ||
        hoveredHarness !== harnessId ||
        typeof value !== "number"
      )
        return null;
      return (
        <text
          x={x + width / 2}
          y={y}
          dy={-4}
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
          fill={dotColor}
          style={{ pointerEvents: "none" }}
        >
          {fmtPct(value)}
        </text>
      );
    };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={TREND_CHART_MARGIN}
          barGap={1}
          barCategoryGap="8%"
          maxBarSize={10}
        >
          <CartesianGrid
            strokeDasharray={GRID_DASH}
            stroke={gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="level"
            type="category"
            {...axisProps}
            label={
              xAxisLabel
                ? {
                    value: xAxisLabel,
                    position: "insideBottom",
                    offset: -12,
                    fill: axisStroke,
                    fontSize: TICK_FONT,
                  }
                : undefined
            }
          />
          <YAxis
            type="number"
            domain={[0, 70]}
            ticks={[0, 20, 40, 60]}
            tickFormatter={(v: unknown) => `${v}%`}
            width={34}
            {...axisProps}
          />
          {TREND_FAMILIES.map((f) => {
            const c = color(f.colorKey);
            return (
              <Bar
                key={f.id}
                dataKey={f.id}
                fill={c}
                fillOpacity={harnessOpacity(f.id)}
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
                onMouseEnter={() => onHoverHarness(f.id)}
                onMouseLeave={onClearHarness}
              >
                <LabelList content={barLabel(f.id, c)} />
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function passRateLineChart(
  data: { level: string; rate: number }[],
  height: number,
  style: ReturnType<typeof useChartStyle>,
) {
  const { gridStroke, axisProps, ink } = style;
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 28, right: 16, left: 4, bottom: 4 }}>
          <CartesianGrid
            strokeDasharray={GRID_DASH}
            stroke={gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="level"
            type="category"
            scale="point"
            padding={{ left: 24, right: 24 }}
            {...axisProps}
          />
          <YAxis
            type="number"
            domain={[0, 50]}
            ticks={[0, 25, 50]}
            tickFormatter={(v: unknown) => `${v}%`}
            width={34}
            {...axisProps}
          />
          <Line
            dataKey="rate"
            stroke={ink}
            strokeWidth={2.5}
            isAnimationActive={false}
            activeDot={false}
            dot={dotShape(ink, 1, 4)}
          >
            <LabelList
              dataKey="rate"
              position="top"
              formatter={(v: unknown) => `${Number(v).toFixed(1)}%`}
              fill={ink}
              fontSize={11}
              fontWeight={600}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PassRateByAxisFigure({
  dimId,
  title,
  caption,
  height = 280,
}: {
  dimId: string;
  title: string;
  caption?: React.ReactNode;
  height?: number;
}) {
  const style = useChartStyle();
  const dim = TASK_DIMENSIONS.find((d) => d.id === dimId);
  if (!dim) return null;
  const data = dim.levels.map((l) => ({ level: l.level, rate: l.rate }));

  return (
    <Figure title={title} caption={caption}>
      {passRateLineChart(data, height, style)}
    </Figure>
  );
}

// Three small multiples: predictability, burial depth, and learnings required —
// one series per harness. Pooled across models.
export function DifficultyTrendFigures() {
  const style = useChartStyle();
  const color = useAgentColor();
  const [hoveredLegend, setHoveredLegend] = useState<string | null>(null);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const activeHarness = hoveredLine ?? hoveredLegend;

  return (
    <Figure
      caption="Pass rate by harness across each axis level (easiest → hardest left to right), pooled across all models on that harness. Burial depth bins are equal-sized groups of tasks by how many tokens into the trace the required fact first appears."
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-xs font-medium text-neutral-600 dark:text-neutral-300">
        {TREND_FAMILIES.map((f) => (
          <div
            key={f.id}
            onMouseEnter={() => setHoveredLegend(f.id)}
            onMouseLeave={() => setHoveredLegend(null)}
            className={cn(
              "flex items-center gap-1.5 cursor-pointer transition-opacity",
              activeHarness != null && activeHarness !== f.id && "opacity-40",
            )}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: color(f.colorKey) }}
            />
            {f.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4 items-end md:-ml-4">
        {TREND_AXES.map((ax, i) => {
          // Axis name plus a direction cue. Predictability and learnings run
          // easy -> hard left to right; burial depth is U-shaped (agents do
          // better at the start/end of the trace), so it reads "early -> late"
          // rather than implying a difficulty direction.
          const xAxisLabel =
            {
              anticipability: "Predictability (harder \u2192)",
              burial_depth: "# of tokens (shallow \u2192 deep)",
              n_hops: "Learnings required (harder \u2192)",
            }[ax.id] ?? ax.title;
          return (
          <div key={ax.id} className="flex flex-col">
            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 text-center leading-tight min-h-[2rem]">
              <div>{ax.title}</div>
              {ax.subtitle && (
                <div className="mt-0.5 text-[10px] font-normal text-neutral-500 dark:text-neutral-400 leading-snug">
                  {ax.subtitle}
                </div>
              )}
            </div>
            {ax.chart === "bar" ? (
              <HarnessTrendHistogram
                data={ax.data}
                height={TREND_PANEL_HEIGHT}
                style={style}
                color={color}
                hoveredHarness={activeHarness}
                onHoverHarness={setHoveredLine}
                onClearHarness={() => setHoveredLine(null)}
                xAxisLabel={xAxisLabel}
              />
            ) : (
              <HarnessTrendPanel
                data={ax.data}
                height={TREND_PANEL_HEIGHT}
                style={style}
                color={color}
                hoveredHarness={activeHarness}
                onHoverLine={setHoveredLine}
                onClearLine={() => setHoveredLine(null)}
                yAxisLabel={i === 0 ? "Pass rate" : undefined}
                xAxisLabel={xAxisLabel}
              />
            )}
          </div>
          );
        })}
      </div>
    </Figure>
  );
}

// Horizontal dumbbell (same style as the harness-spread chart): per harness, an
// arrow from its non-adversarial pass rate to its adversarial pass rate. Arrow
// length = the trap penalty. Sorted most-fragile first; labels reveal on hover.
export function AdversarialRobustnessFigure() {
  const { gridStroke, axisProps, ink, muted, neg } = useChartStyle();
  const [hovered, setHovered] = useState<number | null>(null);
  const data = ADVERSARIAL_ROBUSTNESS.map((r) => ({
    ...r,
    low: r.adv,
    high: r.clean,
    span: Number((r.clean - r.adv).toFixed(1)),
    drop: Number((r.clean - r.adv).toFixed(1)),
  }));
  const hoveredFamily = hovered != null ? data[hovered]?.family : null;
  const dimOf = (family?: string) =>
    hoveredFamily != null && family !== hoveredFamily ? 0.15 : 1;

  const dot = (fill: string) =>
    function Dot(props: unknown) {
      const { cx, cy, key, payload } = props as {
        cx?: number;
        cy?: number;
        key?: Key | null;
        payload?: { family?: string };
      };
      if (typeof cx !== "number" || typeof cy !== "number")
        return <g key={key} />;
      return (
        <circle
          key={key}
          cx={cx}
          cy={cy}
          r={6}
          fill={fill}
          fillOpacity={dimOf(payload?.family)}
        />
      );
    };

  // Clean (green) and adversarial (gray) values, shown only for the hovered row.
  const endLabel = (side: "low" | "high") => (props: LabelRenderProps) => {
    const { x, y, index } = props;
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      index == null ||
      index !== hovered
    )
      return null;
    const d = data[index];
    const isLow = side === "low";
    return (
      <text
        x={isLow ? x - 7 : x + 11}
        y={y + 8}
        textAnchor={isLow ? "end" : "start"}
        fontSize={12}
        fill={ink}
      >
        {isLow ? `${d.adv}%` : `${d.clean}%  (−${d.drop}pp)`}
      </text>
    );
  };

  // Arrow points clean → adversarial (right → left): the trap's drop.
  const arrowBar = (props: unknown) => {
    const { x, y, width, height, payload } = props as LabelRenderProps & {
      payload?: { family?: string };
    };
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof width !== "number" ||
      typeof height !== "number"
    )
      return <g />;
    const cy = y + height / 2;
    const tip = x + 6; // edge of the adversarial (low) dot
    const head = 8;
    return (
      <g opacity={dimOf(payload?.family)}>
        <line
          x1={tip + head}
          y1={cy}
          x2={x + width}
          y2={cy}
          stroke={muted}
          strokeWidth={2}
        />
        <path
          d={`M ${tip} ${cy} L ${tip + head} ${cy - head * 0.6} L ${tip + head} ${cy + head * 0.6} Z`}
          fill={muted}
        />
      </g>
    );
  };

  return (
    <Figure
      title="Robustness to traps"
      caption={
        <>
          Each arrow runs from a harness's non-adversarial (clean) pass rate to
          its adversarial pass rate, so the arrow length is the trap penalty.
          RAG, Codex, and Hermes lose 15–17pp; RLM and Claude Code hold within
          ~3–7pp. RLM's adversarial score (50.9%) still clears every other
          harness's clean score. Traps barely move time or tokens; the cost is
          accuracy.
        </>
      }
    >
      <div className="flex items-center gap-4 mb-3 text-xs font-medium text-neutral-600 dark:text-neutral-300">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: muted }}
          />
          Non-adversarial
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: neg }}
          />
          Adversarial
        </span>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            layout="vertical"
            data={data}
            margin={{ top: 8, right: 80, left: 8, bottom: 8 }}
            onMouseMove={(s: {
              activeTooltipIndex?: number | string | null;
            }) => {
              const n = s?.activeTooltipIndex;
              const idx = n == null ? null : Number(n);
              setHovered(idx != null && Number.isFinite(idx) ? idx : null);
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <CartesianGrid
              strokeDasharray={GRID_DASH}
              stroke={gridStroke}
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 60]}
              ticks={[0, 20, 40, 60]}
              tickFormatter={(v: unknown) => `${v}%`}
              {...axisProps}
            />
            <YAxis type="category" dataKey="family" width={96} {...axisProps} />
            <Tooltip cursor={false} content={() => null} />
            <Bar
              dataKey="low"
              stackId="a"
              fill="transparent"
              isAnimationActive={false}
            />
            <Bar
              dataKey="span"
              stackId="a"
              fill="none"
              barSize={16}
              shape={arrowBar}
              isAnimationActive={false}
            />
            <Scatter dataKey="low" shape={dot(neg)} isAnimationActive={false}>
              <LabelList dataKey="low" content={endLabel("low")} />
            </Scatter>
            <Scatter dataKey="high" shape={dot(muted)} isAnimationActive={false}>
              <LabelList dataKey="high" content={endLabel("high")} />
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Figure>
  );
}

export function ConvergenceFigure() {
  const { gridStroke, axisProps, ink, neg } = useChartStyle();
  const data = CONVERGENCE;
  return (
    <Figure
      title="The adversarial gap collapses as learnings get harder to find"
      caption={
        <>
          Pass rate by semantic distance, split by whether the task is
          adversarial. The gap between the lines shrinks from −13.9pp (near) to
          −7.0pp (mid) to +1.2pp (far). When distractors are far, the gap
          vanishes: retrieval difficulty already dominates, so the trap adds
          nothing. Trap-resistance and retrieval-robustness are the same skill.
        </>
      }
    >
      <div className="flex items-center gap-4 mb-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 h-[2px]"
            style={{ background: ink }}
          />
          Non-adversarial
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 border-t-2 border-dashed"
            style={{ borderColor: neg }}
          />
          Adversarial
        </span>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 24, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray={GRID_DASH} stroke={gridStroke} />
            <XAxis dataKey="x" {...axisProps} />
            <YAxis
              type="number"
              domain={[25, 50]}
              ticks={[25, 30, 35, 40, 45, 50]}
              tickFormatter={(v: unknown) => `${v}%`}
              width={40}
              {...axisProps}
            />
            <Line
              dataKey="nonadv"
              stroke={ink}
              strokeWidth={2.5}
              isAnimationActive={false}
              activeDot={false}
              dot={dotShape(ink)}
            >
              <LabelList
                dataKey="nonadv"
                position="top"
                formatter={(v: unknown) => Number(v).toFixed(1)}
                fill={ink}
                fontSize={12}
                fontWeight={600}
              />
            </Line>
            <Line
              dataKey="adv"
              stroke={neg}
              strokeWidth={2.5}
              strokeDasharray="5 4"
              isAnimationActive={false}
              activeDot={false}
              dot={dotShape(neg)}
            >
              <LabelList
                dataKey="adv"
                position="bottom"
                formatter={(v: unknown) => Number(v).toFixed(1)}
                fill={neg}
                fontSize={12}
                fontWeight={600}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Figure>
  );
}

// Pass rate vs. model release date, split by task difficulty. Each run
// contributes three dots (easy / medium / hard) with one least-squares fit per
// difficulty, so the slopes are directly comparable: easy and medium climb
// with newer models, hard barely moves. Models run on only one harness are
// dropped so the trend is not confounded by harness choice. Computed from
// RESULTS on load. Hover snaps to the closest dot.
export function RecencyByDifficultyFigure() {
  const s = useChartStyle();
  const { isDark, surface } = s;
  const [hoveredBucket, setHoveredBucket] = useState<DifficultyBucket | null>(
    null,
  );
  const [hovered, setHovered] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const bucketColor: Record<DifficultyBucket, string> = {
    easy: isDark ? "#34d399" : "#059669",
    medium: isDark ? "#fbbf24" : "#d97706",
    hard: isDark ? "#f87171" : "#dc2626",
  };

  const { series, ticks, domain } = useMemo(() => {
    // Drop single-run models (run on only one harness) so the time trend is
    // not confounded by which harness happened to run a lone model.
    const runsPerModel = new Map<string, number>();
    for (const d of RESULTS)
      runsPerModel.set(d.model, (runsPerModel.get(d.model) ?? 0) + 1);
    const included = RESULTS.filter(
      (d) =>
        Number.isFinite(d.releaseDate) && (runsPerModel.get(d.model) ?? 0) >= 2,
    );

    const xs = included.map((d) => d.releaseDate);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const xpad = (xMax - xMin) * 0.06;
    const domain: [number, number] = [xMin - xpad, xMax + xpad];

    const series = DIFFICULTY_BUCKETS.map(({ id: bucket }) => {
      const data = included.map((d) => ({
        id: `${d.id}-${bucket}`,
        x: d.releaseDate,
        y: d.difficulty[bucket],
        model: d.model,
        agentType: d.agentType,
        bucket,
      }));
      const n = data.length;
      const mx = data.reduce((acc, d) => acc + d.x, 0) / n;
      const my = data.reduce((acc, d) => acc + d.y, 0) / n;
      let sxy = 0;
      let sxx = 0;
      for (const d of data) {
        sxy += (d.x - mx) * (d.y - my);
        sxx += (d.x - mx) ** 2;
      }
      const slope = sxy / sxx;
      const intercept = my - slope * mx;
      return {
        bucket,
        data,
        slopePerYear: slope * 365 * 864e5,
        // Extend the fit across the full x-domain so the lines reach the
        // chart edges.
        fitSeg: [
          { x: domain[0], y: intercept + slope * domain[0] },
          { x: domain[1], y: intercept + slope * domain[1] },
        ] as [{ x: number; y: number }, { x: number; y: number }],
      };
    });

    const ticks: number[] = [];
    const d0 = new Date(domain[0]);
    let ty = d0.getUTCFullYear();
    let tm = d0.getUTCMonth();
    for (let k = 0; k < 24; k++) {
      const t = Date.UTC(ty, tm, 1);
      if (t > domain[1]) break;
      if (t >= domain[0]) ticks.push(t);
      tm += 2;
      if (tm > 11) {
        tm -= 12;
        ty += 1;
      }
    }

    return { series, ticks, domain };
  }, [isDark]);

  const allPts = useMemo(() => series.flatMap((sr) => sr.data), [series]);
  const dimBucket = (b: DifficultyBucket) =>
    hoveredBucket != null && hoveredBucket !== b;

  // Pixel positions of rendered dots, collected during render so a hover
  // anywhere can snap to the closest point within SNAP_RADIUS.
  const pointsRef = useRef<{ x: number; y: number; id: string }[]>([]);
  pointsRef.current = [];
  const SNAP_RADIUS = 80;

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let best: { id: string; x: number; y: number } | null = null;
    let bestDist = Infinity;
    for (const p of pointsRef.current) {
      const dist = Math.hypot(p.x - mx, p.y - my);
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    }
    setHovered(best && bestDist <= SNAP_RADIUS ? best : null);
  };

  const renderDot = (props: {
    cx?: number;
    cy?: number;
    fill?: string;
    fillOpacity?: number;
    payload?: { id: string };
  }) => {
    const { cx, cy, fill, fillOpacity, payload } = props;
    if (typeof cx !== "number" || typeof cy !== "number") return <g />;
    if (payload) pointsRef.current.push({ x: cx, y: cy, id: payload.id });
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill={surface} />
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={fill}
          fillOpacity={fillOpacity}
          style={{ transition: "fill-opacity 0.2s ease" }}
        />
      </g>
    );
  };

  const slopeLabel = (sr: (typeof series)[number]) =>
    function SlopeLabel(props: { viewBox?: unknown }) {
      const vb = props.viewBox as { x: number; y: number; width: number };
      return (
        <text
          x={vb.x + vb.width + 8}
          y={vb.y + 4}
          textAnchor="start"
          fontSize={11}
          fontWeight={600}
          fill={bucketColor[sr.bucket]}
          opacity={dimBucket(sr.bucket) || hovered != null ? 0.15 : 1}
        >
          {`${sr.slopePerYear >= 0 ? "+" : ""}${sr.slopePerYear.toFixed(0)}pp/yr`}
        </text>
      );
    };

  return (
    <Figure title="Models are only slowly improving on hard tasks">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
        {DIFFICULTY_BUCKETS.map(({ id, label }) => (
          <div
            key={id}
            onMouseEnter={() => setHoveredBucket(id)}
            onMouseLeave={() => setHoveredBucket(null)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 cursor-pointer transition-opacity",
              dimBucket(id) && "opacity-40",
            )}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: bucketColor[id] }}
            />
            {label}
          </div>
        ))}
      </div>
      <div
        ref={wrapRef}
        className="relative h-[360px]"
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 24, right: 64, left: 12, bottom: 28 }}>
            <CartesianGrid strokeDasharray={GRID_DASH} stroke={s.gridStroke} />
            <XAxis
              type="number"
              dataKey="x"
              name="Release date"
              scale="linear"
              domain={domain}
              ticks={ticks}
              tickFormatter={(v) => fmtDateAxis(Number(v))}
              allowDataOverflow
              {...s.axisProps}
              label={{
                value: "Model release date",
                position: "insideBottom",
                offset: -12,
                fill: s.axisStroke,
                fontSize: TICK_FONT,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Pass rate"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              unit="%"
              width={48}
              {...s.axisProps}
              label={{
                value: "Pass rate (%)",
                angle: -90,
                position: "insideLeft",
                offset: 6,
                fill: s.axisStroke,
                fontSize: TICK_FONT,
                style: { textAnchor: "middle" },
              }}
            />
            {series.map((sr) => (
              <ReferenceLine
                key={`fit-${sr.bucket}`}
                ifOverflow="extendDomain"
                stroke={bucketColor[sr.bucket]}
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeOpacity={
                  dimBucket(sr.bucket) || hovered != null ? 0.15 : 0.9
                }
                segment={[...sr.fitSeg]}
                label={slopeLabel(sr)}
              />
            ))}
            <Scatter data={allPts} isAnimationActive={false} shape={renderDot}>
              {allPts.map((p) => (
                <Cell
                  key={p.id}
                  fill={bucketColor[p.bucket]}
                  fillOpacity={
                    (hovered != null || hoveredBucket != null) &&
                    hovered?.id !== p.id &&
                    hoveredBucket !== p.bucket
                      ? 0.12
                      : 0.85
                  }
                />
              ))}
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
        {hovered &&
          (() => {
            const p = allPts.find((d) => d.id === hovered.id);
            if (!p) return null;
            const w = wrapRef.current?.clientWidth ?? 0;
            const flip = hovered.y < 48;
            return (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 text-center leading-tight"
                style={{
                  left: Math.min(Math.max(hovered.x, 90), Math.max(w - 90, 90)),
                  top: flip ? hovered.y + 14 : hovered.y - 44,
                }}
              >
                <div className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                  {displayAgentType(p.agentType)} - {p.model}
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                  {fmtPct(p.y)} on {p.bucket} tasks
                </div>
              </div>
            );
          })()}
      </div>
    </Figure>
  );
}

// Tokens per task vs. pass rate, one dot per run, colored by harness. The
// dashed line is the least-squares fit; its weak slope and low r are the claim
// (test-time scaling does not buy learning). Computed from RESULTS on load.
// Hover snaps to the closest dot (same pattern as HorizonChart).
export function TokensVsPassFigure() {
  const s = useChartStyle();
  const { isDark, surface } = s;
  const [hoveredHarness, setHoveredHarness] = useState<AgentType | null>(null);
  const [hovered, setHovered] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { pts, harnesses, fits, domain } = useMemo(() => {
    const allPts = RESULTS.filter((d) => d.tokens != null).map((d) => ({
      id: d.id,
      x: d.tokens as number,
      y: d.completion,
      model: d.model,
      agentType: d.agentType,
    }));
    // Drop harnesses with fewer than 3 runs: too few dots to read a
    // token-scaling trend, and no fit line to explain them.
    const runsPerHarness = new Map<AgentType, number>();
    for (const p of allPts)
      runsPerHarness.set(p.agentType, (runsPerHarness.get(p.agentType) ?? 0) + 1);
    const pts = allPts.filter((p) => (runsPerHarness.get(p.agentType) ?? 0) >= 3);
    const harnesses = AGENT_TYPES.filter((h) =>
      pts.some((p) => p.agentType === h),
    );

    const xMax = Math.max(...pts.map((d) => d.x));
    const domain: [number, number] = [0, Math.ceil(xMax / 250_000) * 250_000];

    // One least-squares fit per harness with >= 3 runs, extended across the
    // full x-domain (drawn at half opacity; clipped at the plot edges).
    const fits = harnesses.flatMap((h) => {
      const data = pts.filter((p) => p.agentType === h);
      if (data.length < 3) return [];
      const n = data.length;
      const mx = data.reduce((acc, d) => acc + d.x, 0) / n;
      const my = data.reduce((acc, d) => acc + d.y, 0) / n;
      let sxy = 0;
      let sxx = 0;
      let syy = 0;
      for (const d of data) {
        sxy += (d.x - mx) * (d.y - my);
        sxx += (d.x - mx) ** 2;
        syy += (d.y - my) ** 2;
      }
      const slope = sxy / sxx;
      const intercept = my - slope * mx;
      return [
        {
          harness: h,
          r: sxy / Math.sqrt(sxx * syy),
          seg: [
            { x: domain[0], y: intercept + slope * domain[0] },
            { x: domain[1], y: intercept + slope * domain[1] },
          ] as [{ x: number; y: number }, { x: number; y: number }],
        },
      ];
    });

    return { pts, harnesses, fits, domain };
  }, []);

  // Pixel positions of rendered dots, collected during render so a hover
  // anywhere can snap to the closest point within SNAP_RADIUS.
  const pointsRef = useRef<{ x: number; y: number; id: string }[]>([]);
  pointsRef.current = [];
  const SNAP_RADIUS = 80;

  const isDimmed = (p: { id: string; agentType: AgentType }) =>
    (hovered != null || hoveredHarness != null) &&
    hovered?.id !== p.id &&
    hoveredHarness !== p.agentType;

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let best: { id: string; x: number; y: number } | null = null;
    let bestDist = Infinity;
    for (const p of pointsRef.current) {
      const dist = Math.hypot(p.x - mx, p.y - my);
      if (dist < bestDist) {
        bestDist = dist;
        best = p;
      }
    }
    setHovered(best && bestDist <= SNAP_RADIUS ? best : null);
  };

  const renderDot = (props: {
    cx?: number;
    cy?: number;
    fill?: string;
    fillOpacity?: number;
    payload?: { id: string };
  }) => {
    const { cx, cy, fill, fillOpacity, payload } = props;
    if (typeof cx !== "number" || typeof cy !== "number") return <g />;
    if (payload) pointsRef.current.push({ x: cx, y: cy, id: payload.id });
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill={surface} />
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={fill}
          fillOpacity={fillOpacity}
          style={{ transition: "fill-opacity 0.2s ease" }}
        />
      </g>
    );
  };

  return (
    <Figure title="Harnesses scale reasoning differently">
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
            {(() => {
              const f = fits.find((x) => x.harness === h);
              return f ? (
                <span className="font-normal text-neutral-400 dark:text-neutral-500">
                  r={f.r >= 0 ? "+" : ""}
                  {f.r.toFixed(2)}
                </span>
              ) : null;
            })()}
          </div>
        ))}
      </div>
      <div
        ref={wrapRef}
        className="relative h-[360px]"
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 24, right: 16, left: 12, bottom: 28 }}>
            <CartesianGrid strokeDasharray={GRID_DASH} stroke={s.gridStroke} />
            <XAxis
              type="number"
              dataKey="x"
              name="Tokens per task"
              domain={domain}
              tickFormatter={(v) => fmtTokens(Number(v))}
              {...s.axisProps}
              label={{
                value: "Tokens per task",
                position: "insideBottom",
                offset: -12,
                fill: s.axisStroke,
                fontSize: TICK_FONT,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Pass rate"
              domain={[0, 60]}
              ticks={[0, 20, 40, 60]}
              unit="%"
              width={48}
              {...s.axisProps}
              label={{
                value: "Pass rate (%)",
                angle: -90,
                position: "insideLeft",
                offset: 6,
                fill: s.axisStroke,
                fontSize: TICK_FONT,
                style: { textAnchor: "middle" },
              }}
            />
            {fits.map((f) => (
              <ReferenceLine
                key={`fit-${f.harness}`}
                ifOverflow="hidden"
                stroke={agentColor(f.harness, isDark)}
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeOpacity={
                  (hoveredHarness != null && hoveredHarness !== f.harness) ||
                  hovered != null
                    ? 0.15
                    : hoveredHarness === f.harness
                      ? 0.9
                      : 0.5
                }
                segment={[...f.seg]}
              />
            ))}
            <Scatter data={pts} isAnimationActive={false} shape={renderDot}>
              {pts.map((p) => (
                <Cell
                  key={p.id}
                  fill={agentColor(p.agentType, isDark)}
                  fillOpacity={isDimmed(p) ? 0.12 : 0.85}
                />
              ))}
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
        {hovered &&
          (() => {
            const p = pts.find((d) => d.id === hovered.id);
            if (!p) return null;
            const w = wrapRef.current?.clientWidth ?? 0;
            const flip = hovered.y < 48;
            return (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 text-center leading-tight"
                style={{
                  left: Math.min(Math.max(hovered.x, 90), Math.max(w - 90, 90)),
                  top: flip ? hovered.y + 14 : hovered.y - 44,
                }}
              >
                <div className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                  {displayAgentType(p.agentType)} - {p.model}
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                  {fmtPct(p.y)} · {fmtTokens(p.x)} tokens/task
                </div>
              </div>
            );
          })()}
      </div>
    </Figure>
  );
}
