import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';

import {
  GmailLogo,
  MicrosoftTeamsLogo,
  PhoneLogo,
  ProcoreLogo,
  SitetrackerLogo,
  SlackLogo,
  SmsLogo,
} from './AgentToolLogos';

const TOOLS: Array<{
  name: string;
  Logo: ComponentType<{ className?: string }>;
  color: string;
}> = [
  { name: 'Slack', Logo: SlackLogo, color: '#4A154B' },
  { name: 'Email', Logo: GmailLogo, color: '#EA4335' },
  { name: 'SMS', Logo: SmsLogo, color: '#0EA5A4' },
  { name: 'Teams', Logo: MicrosoftTeamsLogo, color: '#6264A7' },
  { name: 'Procore', Logo: ProcoreLogo, color: '#F4641E' },
  { name: 'Sitetracker', Logo: SitetrackerLogo, color: '#34495E' },
  { name: 'Phone', Logo: PhoneLogo, color: '#16A34A' },
];

// Arc geometry, in a 0–100 coordinate space. The arc center sits low and the
// logos sweep across the upper half, fanning up and over the copy below.
const ARC = {
  cx: 50,
  cy: 66,
  rx: 44,
  ry: 52,
  startDeg: 200,
  endDeg: 340,
};

// Everything funnels into a single central spine. Each tool drops straight
// down, rounds a corner, runs horizontally, then curves from horizontal into
// vertical as it merges into the spine — the more central a tool is, the higher
// it joins, so inner tools merge first and outer tools merge further down.
// Positions are kept in a 0–100 space and converted to measured pixels so the
// corner radius is a true, undistorted 20px.
const BADGE_DROP = 5.6;
const CENTER_INDEX = (TOOLS.length - 1) / 2;
const JOIN_GAP = 6; // minimum vertical gap between an icon and its horizontal line
const CORNER_RADIUS = 20; // px
const FLOW_SPEED = 150; // px per second the dots travel
const FLOW_DOT_SPACING = 26; // px between dots on the shared trunk

type Arc = typeof ARC;

// On narrow screens the convex desktop fan crowds its outer icons into each
// other (hiding some entirely) and drops them low enough to collide with the
// heading. The compact arc takes a near-linear slice around the top of a much
// wider circle, which spreads all seven icons evenly across the width and keeps
// the whole row high and clear of the copy below.
const COMPACT_ARC: Arc = {
  cx: 50,
  cy: 70.5,
  rx: 103,
  ry: 46.5,
  startDeg: 246,
  endDeg: 294,
};
const COMPACT_MAX_WIDTH = 520; // px: below this we switch to the compact arc

function arcPoint(arc: Arc, frac: number) {
  const angleDeg = arc.startDeg + frac * (arc.endDeg - arc.startDeg);
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: arc.cx + arc.rx * Math.cos(angleRad),
    y: arc.cy + arc.ry * Math.sin(angleRad),
  };
}

// Equally spaced horizontal lines: the innermost and outermost rings each sit a
// fixed gap below their own icons, and the rings in between are interpolated
// linearly by ring distance. This guarantees the lines are evenly spaced while
// every icon keeps at least JOIN_GAP of clearance and outer icons (lower on the
// arc) still join lower than inner ones.
const MAX_DISTANCE = CENTER_INDEX;
const MIN_DISTANCE = TOOLS.length % 2 === 0 ? 0.5 : 1;

// Geometry that depends on the active arc, computed per-render so the compact
// and desktop arcs can share all the connector/spine logic below.
function geometryFor(arc: Arc) {
  const spineTopY = arcPoint(arc, 0.5).y + BADGE_DROP;
  const lineOuterY = arcPoint(arc, 0).y + BADGE_DROP + JOIN_GAP;
  const lineInnerY =
    arcPoint(arc, (CENTER_INDEX - MIN_DISTANCE) / (TOOLS.length - 1)).y +
    BADGE_DROP +
    JOIN_GAP;
  const joinYForIndex = (index: number) => {
    const distance = Math.abs(index - CENTER_INDEX);
    if (MAX_DISTANCE <= MIN_DISTANCE) return lineOuterY;
    const t = (distance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE);
    return lineInnerY + t * (lineOuterY - lineInnerY);
  };
  return { spineTopY, joinYForIndex };
}

// Builds a connector in pixel space: drop, rounded corner, horizontal run, then
// a quarter-curve that arrives at the spine travelling straight down.
function connectorPathPx(
  startX: number,
  startY: number,
  joinY: number,
  centerX: number,
) {
  const dir = startX < centerX ? 1 : -1;
  const horizontalSpan = Math.abs(centerX - startX);
  const verticalSpan = joinY - startY;
  const r = Math.max(0, Math.min(CORNER_RADIUS, verticalSpan, horizontalSpan / 2));
  const cornerX = startX + dir * r;
  const approachX = centerX - dir * r;

  return [
    `M ${startX.toFixed(1)} ${startY.toFixed(1)}`,
    `L ${startX.toFixed(1)} ${(joinY - r).toFixed(1)}`,
    `Q ${startX.toFixed(1)} ${joinY.toFixed(1)} ${cornerX.toFixed(1)} ${joinY.toFixed(1)}`,
    `L ${approachX.toFixed(1)} ${joinY.toFixed(1)}`,
    `Q ${centerX.toFixed(1)} ${joinY.toFixed(1)} ${centerX.toFixed(1)} ${(joinY + r).toFixed(1)}`,
  ].join(' ');
}

function ToolBadge({
  name,
  Logo,
  x,
  y,
  index,
  revealed,
  sizePx,
}: {
  name: string;
  Logo: ComponentType<{ className?: string }>;
  x: number;
  y: number;
  index: number;
  revealed: boolean;
  sizePx?: number;
}) {
  return (
    <div
      className={
        'group absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out ' +
        (revealed ? 'translate-y-[-50%] opacity-100' : 'translate-y-[-30%] opacity-0')
      }
      style={{ left: `${x}%`, top: `${y}%`, transitionDelay: `${index * 90}ms` }}
    >
      <div
        className={
          'flex items-center justify-center border border-neutral-200/80 bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 ' +
          (sizePx
            ? ''
            : 'h-14 w-14 rounded-2xl p-3 sm:h-16 sm:w-16 sm:rounded-[1.125rem] sm:p-3.5')
        }
        style={
          sizePx
            ? {
                width: sizePx,
                height: sizePx,
                padding: Math.round(sizePx * 0.2),
                borderRadius: Math.round(sizePx * 0.28),
              }
            : undefined
        }
      >
        <Logo className="h-full w-full object-contain" />
      </div>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-neutral-950 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-all duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100"
      >
        {name}
      </span>
    </div>
  );
}

export function AgentWorkLoop() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const measure = () => setSize({ w: node.clientWidth, h: node.clientHeight });
    measure();

    if (typeof ResizeObserver === 'undefined') return;
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { w, h } = size;
  const centerX = w / 2;
  const pxY = (pct: number) => (pct / 100) * h;
  const ready = w > 0 && h > 0;

  // Narrow containers use the evenly-spread compact arc; everything else keeps
  // the original convex fan.
  const compact = w > 0 && w < COMPACT_MAX_WIDTH;
  const arc = compact ? COMPACT_ARC : ARC;
  const { spineTopY: SPINE_TOP_Y, joinYForIndex } = geometryFor(arc);

  // On the compact arc the badges are sized to the icon spacing so they never
  // overlap, however narrow the screen gets.
  const compactBadgePx = compact
    ? Math.round(
        Math.max(
          26,
          Math.min(
            54,
            ((arcPoint(arc, 1 / (TOOLS.length - 1)).x - arcPoint(arc, 0).x) / 100) *
              w *
              0.84,
          ),
        ),
      )
    : undefined;

  const branches = ready
    ? TOOLS.map((tool, index) => {
        if (index === CENTER_INDEX) return null;
        const { x, y } = arcPoint(arc, index / (TOOLS.length - 1));
        return {
          key: tool.name,
          maskId: `awl-draw-${index}`,
          delay: index * 90,
          d: connectorPathPx(
            (x / 100) * w,
            pxY(y + BADGE_DROP),
            pxY(joinYForIndex(index)),
            centerX,
          ),
        };
      })
    : [];

  // One continuous trunk: every branch funnels into a single line that runs all
  // the way to the bottom of the diagram and into the Slack thread below.
  const trunkEndPx = h;
  const spineTopPx = pxY(SPINE_TOP_Y);
  const spineD = `M ${centerX.toFixed(1)} ${spineTopPx.toFixed(1)} L ${centerX.toFixed(1)} ${trunkEndPx.toFixed(1)}`;

  // Full travel paths for the flowing dots: each one emerges at its logo and
  // continues all the way down the spine to the tail.
  //
  // Even spacing on the shared trunk: every dot moves at the same speed
  // (animateMotion defaults to calcMode="paced"). If each flow drops a dot past
  // the bottom every `flowInterval = TOOLS.length × dotInterval`, and the flows
  // are phase-offset by `index × dotInterval`, the merged stream passes any
  // point on the trunk exactly every `dotInterval` — i.e. evenly spaced.
  const dotInterval = FLOW_DOT_SPACING / FLOW_SPEED;
  const flowInterval = TOOLS.length * dotInterval;
  const drawSettle = (TOOLS.length * 90 + 750) / 1000; // let lines finish drawing first

  const flows = ready
    ? TOOLS.map((tool, index) => {
        const { x, y } = arcPoint(arc, index / (TOOLS.length - 1));
        const startX = (x / 100) * w;
        const startY = pxY(y + BADGE_DROP);

        let d: string;
        let length: number;
        if (index === CENTER_INDEX) {
          d = spineD;
          length = trunkEndPx - spineTopPx;
        } else {
          const joinY = pxY(joinYForIndex(index));
          const verticalSpan = joinY - startY;
          const horizontalSpan = Math.abs(centerX - startX);
          // Same clamped radius the path uses; each of the two quarter-arcs
          // shortens the straight run by (4 - π) · r in total.
          const r = Math.max(0, Math.min(CORNER_RADIUS, verticalSpan, horizontalSpan / 2));
          d =
            connectorPathPx(startX, startY, joinY, centerX) +
            ` L ${centerX.toFixed(1)} ${trunkEndPx.toFixed(1)}`;
          length =
            verticalSpan + horizontalSpan + (trunkEndPx - joinY) - (4 - Math.PI) * r;
        }

        // Constant speed on every line: duration is exactly length / speed. The
        // dot count is chosen so each line emits roughly one dot per flowInterval,
        // and `within = dur / dotCount` tiles the loop seamlessly.
        const dur = length / FLOW_SPEED;
        const dotCount = Math.max(1, Math.round(length / FLOW_SPEED / flowInterval));

        return {
          motionId: `awl-flow-${index}`,
          color: tool.color,
          d,
          dur,
          dotCount,
          within: dur / dotCount,
          phase: drawSettle + index * dotInterval,
        };
      })
    : [];

  // A solid white stroke inside a mask "draws on" via stroke-dashoffset, which
  // progressively reveals the dotted line underneath without disturbing its dots.
  const drawStyle = (delay: number) => ({
    strokeDashoffset: revealed ? 0 : 1,
    transition: `stroke-dashoffset 750ms ease-in-out ${delay}ms`,
  });

  return (
    <section className="bg-white px-6 pb-0 pt-20 sm:px-10 sm:pt-28 lg:px-12">
      <div ref={containerRef} className="relative mx-auto h-[28rem] w-full max-w-5xl sm:h-[33rem] lg:h-[37rem]">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${w || 100} ${h || 100}`}
          aria-hidden
        >
          {ready && (
            <>
              <defs>
                {branches.map((branch) =>
                  branch ? (
                    <mask
                      key={branch.maskId}
                      id={branch.maskId}
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width={w}
                      height={h}
                    >
                      <path
                        d={branch.d}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={1}
                        strokeDasharray="1 1"
                        style={drawStyle(branch.delay)}
                      />
                    </mask>
                  ) : null,
                )}
                <mask id="awl-draw-spine" maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
                  <path
                    d={spineD}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    style={drawStyle(CENTER_INDEX * 90)}
                  />
                </mask>
                {flows.map((flow) => (
                  <path key={flow.motionId} id={flow.motionId} d={flow.d} fill="none" stroke="none" />
                ))}
              </defs>

              {branches.map((branch) =>
                branch ? (
                  <path
                    key={branch.key}
                    d={branch.d}
                    fill="none"
                    stroke="#e4e4e4"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    mask={`url(#${branch.maskId})`}
                  />
                ) : null,
              )}
              <path
                d={spineD}
                fill="none"
                stroke="#d4d4d4"
                strokeWidth="1.5"
                strokeLinecap="round"
                mask="url(#awl-draw-spine)"
              />

              {revealed &&
                flows.map((flow) =>
                  Array.from({ length: flow.dotCount }).map((_, dotIndex) => (
                    <circle key={`${flow.motionId}-${dotIndex}`} r={2.4} fill={flow.color}>
                      <animateMotion
                        dur={`${flow.dur.toFixed(3)}s`}
                        begin={`${(flow.phase + dotIndex * flow.within).toFixed(3)}s`}
                        repeatCount="indefinite"
                      >
                        <mpath href={`#${flow.motionId}`} />
                      </animateMotion>
                    </circle>
                  )),
                )}
            </>
          )}
        </svg>

        {TOOLS.map((tool, index) => {
          const { x, y } = arcPoint(arc, index / (TOOLS.length - 1));
          return (
            <ToolBadge
              key={tool.name}
              name={tool.name}
              Logo={tool.Logo}
              x={x}
              y={y}
              index={index}
              revealed={revealed}
              sizePx={compactBadgePx}
            />
          );
        })}

        <div
          className="absolute inset-x-0 flex -translate-y-1/2 flex-col items-center px-4 py-20 text-center sm:py-28"
          style={{
            top: '64%',
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 30%, #ffffff 70%, rgba(255,255,255,0) 100%)',
          }}
        >
          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl">
            Perfect attention for every project
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-600">
            AI agents read your team's communications and keep track of every project.
          </p>
        </div>
      </div>
    </section>
  );
}
