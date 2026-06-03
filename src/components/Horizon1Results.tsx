import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
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

interface ResultRow {
  id: string;
  agentType: string;
  model: string;
  completion: number;
  costUsd: number;
  tokens: number;
  timeSec: number;
  // Optional override for the tokens cell (e.g. approximate/footnoted values).
  tokensLabel?: string;
}

// Preview run results. Each row is one (agent type × model) configuration.
const RESULTS: ResultRow[] = [
  { id: "cc-sonnet", agentType: "Claude Code", model: "claude-sonnet-4.5", completion: 31.6, costUsd: 0.454, tokens: 907_196, timeSec: 130.4 },
  { id: "cc-opus", agentType: "Claude Code", model: "claude-opus-4.8", completion: 44.8, costUsd: 2.519, tokens: 1_011_333, timeSec: 123.4 },
  { id: "rag-gpt5-mini", agentType: "RAG", model: "gpt-5-mini", completion: 19.5, costUsd: 0.023, tokens: 83_114, timeSec: 151.5 },
  { id: "rag-haiku", agentType: "RAG", model: "claude-haiku-4.5", completion: 31.8, costUsd: 0.189, tokens: 181_134, timeSec: 135.2 },
  { id: "rag-gemini", agentType: "RAG", model: "gemini-3.5-flash", completion: 12.8, costUsd: 0.273, tokens: 268_724, timeSec: 146.6 },
  { id: "rag-sonnet", agentType: "RAG", model: "claude-sonnet-4.5", completion: 33.3, costUsd: 0.529, tokens: 169_467, timeSec: 155.3 },
  { id: "rag-gpt55", agentType: "RAG", model: "gpt-5.5", completion: 39.5, costUsd: 0.672, tokens: 214_835, timeSec: 202.2 },
  { id: "rag-opus", agentType: "RAG", model: "claude-opus-4.8", completion: 36.9, costUsd: 1.016, tokens: 191_429, timeSec: 184.2 },
  { id: "codex-gpt5", agentType: "Codex", model: "gpt-5-codex", completion: 46.2, costUsd: 0.342, tokens: 1_000_000, timeSec: 350 },
  { id: "codex-gpt53", agentType: "Codex", model: "gpt-5.3-codex", completion: 48.5, costUsd: 0.424, tokens: 824_000, timeSec: 357 },
  { id: "hermes-gpt55", agentType: "Hermes", model: "gpt-5.5", completion: 36.4, costUsd: 3.96, tokens: 100_000, timeSec: 145, tokensLabel: "~100k*" },
  { id: "hermes-opus", agentType: "Hermes", model: "claude-opus-4.8", completion: 35.9, costUsd: 4.25, tokens: 207_000, timeSec: 147, tokensLabel: "~207" },
  { id: "hermes-sonnet", agentType: "Hermes", model: "claude-sonnet-4.5", completion: 29.2, costUsd: 3.780, tokens: 198_000, timeSec: 130, tokensLabel: "~198k*" },
  { id: "rlm-gpt5-mini", agentType: "RLM", model: "gpt-5-mini", completion: 24.6, costUsd: 0.076, tokens: 340_000, timeSec: 203, tokensLabel: "340k" },
  { id: "rlm-opus", agentType: "RLM", model: "claude-opus-4.8", completion: 55.9, costUsd: 0.785, tokens: 376_000, timeSec: 212, tokensLabel: "376k" },
  { id: "rlm-sonnet", agentType: "RLM", model: "claude-sonnet-4.6", completion: 49.7, costUsd: 0.954, tokens: 1_101_000, timeSec: 353 },
  { id: "rlm-haiku", agentType: "RLM", model: "claude-haiku-4.5", completion: 38.1, costUsd: 0.157, tokens: 516_000, timeSec: 191, tokensLabel: "516k" },
  { id: "rlm-gpt5", agentType: "RLM", model: "gpt-5", completion: 50.8, costUsd: 0.400, tokens: 473_000, timeSec: 374, tokensLabel: "473k" },
];

// Color per agent type, with light/dark variants.
const AGENT_TYPE_COLORS: Record<string, { light: string; dark: string }> = {
  RAG: { light: "#00845e", dark: "#10b981" },
  "Claude Code": { light: "#c2410c", dark: "#fb923c" },
  Codex: { light: "#1d4ed8", dark: "#60a5fa" },
  Hermes: { light: "#171717", dark: "#fafafa" },
  RLM: { light: "#7c3aed", dark: "#a78bfa" },
};

const FALLBACK_COLOR = { light: "#525252", dark: "#a3a3a3" };

function agentColor(agentType: string, isDark: boolean) {
  const c = AGENT_TYPE_COLORS[agentType] ?? FALLBACK_COLOR;
  return isDark ? c.dark : c.light;
}

const AGENT_TYPES = Array.from(new Set(RESULTS.map((r) => r.agentType)));

// Stable, arbitrary ordering used to pick which label wins within an overlap
// cluster (deterministic so the choice doesn't flicker between renders).
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function fmtCost(v: number) {
  return `$${v.toFixed(3)}`;
}

function fmtCostAxis(v: number) {
  return `$${v.toFixed(2)}`;
}

function fmtPct(v: number) {
  return `${v.toFixed(1)}%`;
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
type ScaleType = "linear" | "log";

interface MetricDef {
  id: MetricKey;
  label: string;
  format: (v: number) => string;
  // Snap an arbitrary tick value to the nearest clean value for this metric
  // (e.g. whole seconds for time, cents for cost) so labels stay tidy.
  snap: (v: number) => number;
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

const METRIC_DEFS: MetricDef[] = [
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
];

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const compute = () =>
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark") ||
      mq.matches;
    const update = () => setIsDark(compute());

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  return isDark;
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
  const { domain, ticks } = useMemo(() => {
    const values = RESULTS.map((r) => r[metricId]);
    const d = computeDomain(values, scaleType);
    // Space ticks across the data extent (not the padded domain edges), so each
    // snapped tick stays within the domain and the end ticks sit on real data.
    const dataExtent: [number, number] = [
      Math.min(...values),
      Math.max(...values),
    ];
    return {
      domain: d,
      ticks: makeTicks(dataExtent, scaleType, metric.snap),
    };
  }, [metricId, scaleType, metric.snap]);

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
            label="Log scale"
            withBody
            className="hover:!bg-neutral-100 dark:hover:!bg-neutral-800 disabled:dark:!bg-neutral-800"
            styles={{
              label: { color: isDark ? "#d4d4d4" : "#525252" },
              switch: {
                backgroundColor:
                  scaleType === "log"
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
              scale={scaleType}
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
              data={RESULTS}
              isAnimationActive={false}
              shape={renderDot}
            >
              {RESULTS.map((row) => (
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
                    typeof index === "number" ? RESULTS[index] : undefined;
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
                {fmtPct(row.completion)}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {fmtCost(row.costUsd)}
              </td>
              <td className="py-2 px-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                {fmtTime(row.timeSec)}
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
