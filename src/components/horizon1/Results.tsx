import {
  type MouseEvent as ReactMouseEvent,
  useLayoutEffect,
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
  fmtCost,
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

// Stable, arbitrary ordering used to pick which label wins within an overlap
// cluster (deterministic so the choice doesn't flicker between renders).
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

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

export function Horizon1Chart({
  hoveredId,
  onHover,
  hoveredType,
  onHoverType,
}: {
  hoveredId?: string | null;
  onHover?: (id: string | null) => void;
  hoveredType?: string | null;
  onHoverType?: (type: string | null) => void;
}) {
  const isDark = useIsDark();
  const [metricId, setMetricId] = useState<MetricKey>("costUsd");
  const [scaleType, setScaleType] = useState<ScaleType>("log");
  const metric = METRIC_DEFS.find((m) => m.id === metricId)!;
  // Dates (and any forceLinear metric) can't use a log scale.
  const effectiveScale: ScaleType = metric.forceLinear ? "linear" : scaleType;
  const chartData = useMemo(
    () =>
      RESULTS.filter(
        (r) => r[metricId] != null && Number.isFinite(r[metricId] as number),
      ),
    [metricId],
  );
  const { domain, ticks } = useMemo(() => {
    const values = chartData.map((r) => r[metricId] as number);
    const d = computeDomain(values, effectiveScale);
    // Space ticks across the data extent (not the padded domain edges), so each
    // snapped tick stays within the domain and the end ticks sit on real data.
    const dataExtent: [number, number] = [
      Math.min(...values),
      Math.max(...values),
    ];
    return {
      domain: d,
      ticks: makeTicks(dataExtent, effectiveScale, metric.snap, metric.tickCount),
    };
  }, [metricId, effectiveScale, metric.snap, metric.tickCount, chartData]);

  const gridStroke = isDark ? "#404040" : "#e5e5e5";
  // Border-toned but two steps more visible (neutral-400 / neutral-600).
  const axisStroke = isDark ? "#737373" : "#a3a3a3";
  const labelFill = isDark ? "#e5e5e5" : "#171717";

  // Pixel positions of the rendered points, collected during render so a hover
  // anywhere on the chart can snap to the closest point within SNAP_RADIUS.
  const pointsRef = useRef<{ x: number; y: number; id: string }[]>([]);
  pointsRef.current = [];
  const SNAP_RADIUS = 100;

  // Runtime detection of overlapping data labels: measure each label's bounding
  // box, group intersecting labels into clusters, and show only one label per
  // cluster (see isLabelVisible). Geometry is measured from every label
  // regardless of visibility, so the clustering stays stable.
  const chartRef = useRef<HTMLDivElement>(null);
  const [clusters, setClusters] = useState<string[][]>([]);
  // Labels whose box collides with a dot other than their own.
  const [collidingWithDot, setCollidingWithDot] = useState<Set<string>>(
    new Set(),
  );

  useLayoutEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    const measure = () => {
      const texts = Array.from(
        el.querySelectorAll<SVGTextElement>("text[data-label-id]"),
      );
      const items = texts.map((t) => ({
        id: t.getAttribute("data-label-id") ?? "",
        r: t.getBoundingClientRect(),
      }));

      // Union-find over pairwise intersections to build overlap clusters.
      const parent = new Map<string, string>();
      const find = (x: string): string => {
        let root = x;
        while (parent.get(root) !== root) root = parent.get(root)!;
        return root;
      };
      const union = (a: string, b: string) => {
        parent.set(find(a), find(b));
      };
      for (const it of items) parent.set(it.id, it.id);
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i].r;
          const b = items[j].r;
          const intersects =
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top;
          if (intersects) union(items[i].id, items[j].id);
        }
      }

      const groups = new Map<string, string[]>();
      for (const it of items) {
        const root = find(it.id);
        const g = groups.get(root) ?? [];
        g.push(it.id);
        groups.set(root, g);
      }
      const next = [...groups.values()].filter((g) => g.length > 1);

      setClusters((prev) => {
        const key = (cs: string[][]) =>
          cs
            .map((c) => [...c].sort().join(","))
            .sort()
            .join("|");
        return key(prev) === key(next) ? prev : next;
      });

      // Detect labels overlapping a dot that isn't their own.
      const dots = Array.from(
        el.querySelectorAll<SVGCircleElement>("circle[data-dot-id]"),
      ).map((c) => ({
        id: c.getAttribute("data-dot-id") ?? "",
        r: c.getBoundingClientRect(),
      }));
      const collide = new Set<string>();
      for (const lab of items) {
        for (const d of dots) {
          if (d.id === lab.id) continue;
          const a = lab.r;
          const b = d.r;
          if (
            a.left < b.right &&
            a.right > b.left &&
            a.top < b.bottom &&
            a.bottom > b.top
          ) {
            collide.add(lab.id);
            break;
          }
        }
      }
      setCollidingWithDot((prev) => {
        if (
          prev.size === collide.size &&
          [...collide].every((id) => prev.has(id))
        )
          return prev;
        return collide;
      });
    };

    measure();
    const raf = requestAnimationFrame(measure);
    // recharts renders/labels its surface asynchronously, so the first measures
    // can run before any label nodes exist. Re-measure on a few delays, when the
    // container resizes, and whenever nodes are added/removed in the subtree.
    const timers = [50, 150, 350, 700].map((t) =>
      window.setTimeout(measure, t),
    );
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(el);
    const mo = new MutationObserver(() => requestAnimationFrame(measure));
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      ro.disconnect();
      mo.disconnect();
    };
  }, [metricId, scaleType]);

  // Map each label id to its overlap cluster (clusters have >= 2 members).
  const clusterById = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const c of clusters) for (const id of c) m.set(id, c);
    return m;
  }, [clusters]);

  // Within a cluster show exactly one label: the hovered one if the cluster
  // contains it, otherwise prefer a member that doesn't collide with a dot
  // (so the shown label is conflict-free), falling back to a stable pick.
  const isLabelVisible = (id: string) => {
    const cluster = clusterById.get(id);
    if (!cluster) return true;
    if (hoveredId != null && cluster.includes(hoveredId))
      return id === hoveredId;
    const clean = cluster.filter((m) => !collidingWithDot.has(m));
    const pool = clean.length > 0 ? clean : cluster;
    let winner = pool[0];
    let best = hashStr(winner);
    for (const member of pool) {
      const h = hashStr(member);
      if (h > best) {
        best = h;
        winner = member;
      }
    }
    return id === winner;
  };

  // A row is dimmed when something is hovered and it's neither the hovered
  // point nor a member of the hovered agent type.
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
    onHover?.(best && bestDist <= SNAP_RADIUS ? best.id : null);
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
        data-dot-id={payload?.id}
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
          <div className="flex items-center gap-4 mt-2">
            {AGENT_TYPES.map((type) => (
              <div
                key={type}
                onMouseEnter={() => onHoverType?.(type)}
                onMouseLeave={() => onHoverType?.(null)}
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

        <div className="flex flex-col items-end gap-2 shrink-0">
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
          
          <div className="flex items-center gap-1">
            {METRIC_DEFS.map((m) => (
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
      </div>

      <div
        ref={chartRef}
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
              scale={effectiveScale}
              domain={domain}
              ticks={ticks}
              tickFormatter={(v) => metric.format(Number(v))}
              allowDataOverflow
              axisLine={{ stroke: axisStroke, strokeWidth: 1.5 }}
              tickLine={{ stroke: axisStroke, strokeWidth: 1.5 }}
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
              axisLine={{ stroke: axisStroke, strokeWidth: 1.5 }}
              tickLine={{ stroke: axisStroke, strokeWidth: 1.5 }}
              tick={{ fontSize: 12, fill: axisStroke }}
            />
            <Scatter
              data={chartData}
              isAnimationActive={false}
              shape={renderDot}
            >
              {chartData.map((row) => (
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
                  const { x, y, value, index } = props as {
                    x?: number;
                    y?: number;
                    value?: string | number;
                    index?: number;
                  };
                  if (typeof x !== "number" || typeof y !== "number")
                    return null;
                  const row =
                    typeof index === "number" ? chartData[index] : undefined;
                  const dimmed = row != null && isDimmed(row);
                  const visible = row != null && isLabelVisible(row.id);
                  return (
                    <text
                      x={x}
                      y={y}
                      dy={-4}
                      textAnchor="middle"
                      data-label-id={row?.id}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        fill: dimmed
                          ? isDark
                            ? "#525252"
                            : "#cbd5e1"
                          : labelFill,
                        opacity: visible ? 1 : 0,
                        transition: "fill 0.2s ease, opacity 0.2s ease",
                      }}
                    >
                      {String(value ?? "")}
                    </text>
                  );
                }}
              />
            </Scatter>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Headline chart: one row per model (run on >= 2 harnesses), one dot per
// harness, colored by harness, on a single completion axis. Holding the model
// fixed (a row) and varying only the harness swings the score 10–20+ points,
// and RLM is the rightmost dot in nearly every row — the harness, not the
// model, is the dominant and most consistent lever.
export function Horizon1ModelChart() {
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

export function Horizon1Results() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  return (
    <>
      <Horizon1Chart
        hoveredId={hoveredId}
        onHover={setHoveredId}
        hoveredType={hoveredType}
        onHoverType={setHoveredType}
      />
      <Horizon1Table
        hoveredId={hoveredId}
        onHover={setHoveredId}
        hoveredType={hoveredType}
      />
    </>
  );
}

export function Horizon1Table({
  hoveredId,
  onHover,
  hoveredType,
}: {
  hoveredId?: string | null;
  onHover?: (id: string | null) => void;
  hoveredType?: string | null;
}) {
  const isDark = useIsDark();
  return (
    <div className="my-8 overflow-x-auto">
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
                {fmtCost(row.costUsd)}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {row.timeSec != null ? fmtTime(row.timeSec) : "—"}
              </td>
              <td className="py-2 pl-4 pr-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {row.tokensLabel ?? fmtTokens(row.tokens)}
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
