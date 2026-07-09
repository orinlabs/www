import { useEffect, useRef, useState } from 'react';

import { Check } from 'lucide-react';
import {
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom';

import { BookDemoButton } from '../components/BookDemoButton';
import { InViewFade } from '../components/InViewFade';
import { SOLUTIONS, type Solution } from '../data/solutions';

// The six solutions in build-lifecycle order: winning the work, clearing the
// way, buying material, running the field, verifying quality, getting paid.
const LIFECYCLE_ORDER = [
  'bidding',
  'permitting',
  'purchase-order',
  'field-data-capture',
  'commissioning',
  'close-out',
];

const ORDERED_SOLUTIONS = LIFECYCLE_ORDER.map(
  (slug) => SOLUTIONS.find((solution) => solution.slug === slug),
).filter((solution): solution is Solution => solution !== undefined);

const WHY_ORIN_POINTS = [
  {
    lead: 'Runs the whole build, not a single prompt.',
    body:
      'It watches every stage for blockers, gaps, and slipping dates, chases the vendor, sub, or approver before the critical path moves, and reroutes the plan when the answer comes back. One agent tracks the people, roles, and dependencies a real project runs on, in the background, and escalates to your PM only when it should.',
  },
  {
    lead: 'Trained on your work, not the internet.',
    body:
      'Every correction your team makes teaches the agent your standards, so it gets more right on the next project instead of repeating generic output.',
  },
  {
    lead: 'Reads the physical world.',
    body:
      'Leveraging plans, drawings, and site photos, it connects a spec to the evidence that proves it, not just text in, text out.',
  },
  {
    lead: 'Lives inside your existing systems.',
    body:
      'Whether you use Site Tracker, Procore, Salesforce, Slack, or Teams, it works where your team already does and keeps a human on every critical step that leaves the building.',
  },
  {
    lead: 'Measured on your process, not a demo.',
    body:
      'We build a test bench on your real workflows and tune the models against it, so "it works" means it works on your jobs.',
  },
];

// Old per-solution URLs (/solutions/:slug) land on the matching section of the
// combined page.
export function SolutionRedirect() {
  const { slug } = useParams<{ slug: string }>();
  const exists = SOLUTIONS.some((solution) => solution.slug === slug);
  return <Navigate to={exists ? `/solutions#${slug}` : '/solutions'} replace />;
}

function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      return;
    }

    const element = document.getElementById(hash.slice(1));
    if (!element) {
      return;
    }

    // Runs after the app-level scroll-to-top effect, so defer one frame.
    const frame = window.requestAnimationFrame(() => {
      element.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hash]);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function useActiveSection(slugs: string[]) {
  const [active, setActive] = useState(slugs[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Track everything currently in the band and pick the earliest stage in
    // lifecycle order. On first load (before lazy images expand the layout)
    // several compressed sections can intersect at once; without this the
    // last entry would win and the strip would highlight the wrong stage.
    const intersecting = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        }
        const current = slugs.find((slug) => intersecting.has(slug));
        if (current) {
          setActive(current);
        }
      },
      // A narrow band around the upper third of the viewport decides which
      // stage is "current" while scrolling.
      { rootMargin: '-25% 0px -65% 0px' },
    );

    for (const slug of slugs) {
      const element = document.getElementById(slug);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [slugs]);

  return active;
}

// Geometry and flow tuning for the hero lifecycle strip. The line and node
// markers share a fixed-height row so the SVG line runs through the center of
// every dot; the flow constants echo AgentWorkLoop at a calmer pace.
const STRIP_ROW_HEIGHT = 24; // px: the row the line and node dots share
const STRIP_FLOW_SPEED = 80; // px per second the flowing dots travel
const STRIP_DOT_SPACING = 90; // px between flowing dots on the line

// Animated hero strip: a horizontal line "draws on" left-to-right (same
// stroke-dashoffset mask technique as AgentWorkLoop), the six lifecycle nodes
// reveal with a stagger, and small dots flow continuously along the line via
// SMIL animateMotion while the strip is on screen.
function LifecycleStrip({ active }: { active: string }) {
  const containerRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);
  const [width, setWidth] = useState(0);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const measure = () => setWidth(node.clientWidth);
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
      setInView(true);
      return;
    }

    // Stays connected after the one-shot reveal so the flowing dots (SMIL
    // animations, which otherwise run forever) can be unmounted whenever the
    // strip is scrolled off-screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
          if (entry.intersectionRatio >= 0.35) {
            setRevealed(true);
          }
        }
      },
      { threshold: [0, 0.35] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const count = ORDERED_SOLUTIONS.length;
  const lineY = STRIP_ROW_HEIGHT / 2;
  // Nodes sit at the center of six equal cells; the line spans first to last.
  const nodeX = (index: number) => ((index + 0.5) / count) * width;
  const lineStartX = nodeX(0);
  const lineEndX = nodeX(count - 1);
  const lineD = `M ${lineStartX.toFixed(1)} ${lineY} L ${lineEndX.toFixed(1)} ${lineY}`;
  const lineLength = lineEndX - lineStartX;
  const ready = width > 0;

  const flowDur = lineLength / STRIP_FLOW_SPEED;
  const flowDotCount = Math.max(1, Math.round(lineLength / STRIP_DOT_SPACING));
  const drawSettle = (count * 90 + 750) / 1000; // let the line finish drawing first

  // A solid white stroke inside a mask "draws on" via stroke-dashoffset,
  // progressively revealing the grey line underneath.
  const drawStyle = {
    strokeDashoffset: revealed ? 0 : 1,
    transition: reduceMotion
      ? undefined
      : 'stroke-dashoffset 750ms ease-in-out 100ms',
  };

  return (
    <nav
      ref={containerRef}
      aria-label="Build lifecycle"
      className="-mx-8 mb-14 overflow-x-auto px-8 [scrollbar-width:none] sm:-mx-10 sm:mb-16 sm:px-10 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <div ref={trackRef} className="relative min-w-[42rem]">
        <svg
          className="pointer-events-none absolute left-0 top-0 w-full"
          style={{ height: STRIP_ROW_HEIGHT }}
          viewBox={`0 0 ${width || 100} ${STRIP_ROW_HEIGHT}`}
          aria-hidden
        >
          {ready && (
            <>
              <defs>
                <mask
                  id="lifecycle-draw"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width={width}
                  height={STRIP_ROW_HEIGHT}
                >
                  <path
                    d={lineD}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    style={drawStyle}
                  />
                </mask>
                <path id="lifecycle-flow" d={lineD} fill="none" stroke="none" />
              </defs>

              <path
                d={lineD}
                fill="none"
                stroke="#d4d4d4"
                strokeWidth="1.5"
                strokeLinecap="round"
                mask="url(#lifecycle-draw)"
              />

              {revealed && inView && !reduceMotion &&
                Array.from({ length: flowDotCount }).map((_, dotIndex) => {
                  const begin = `${(drawSettle + dotIndex * (flowDur / flowDotCount)).toFixed(3)}s`;
                  return (
                    // Hidden until its motion begins: before `begin` fires the
                    // circle would otherwise sit at the SVG origin as a stray
                    // dot in the top-left corner of the strip.
                    <circle key={dotIndex} r={2.4} fill="#16a34a" visibility="hidden">
                      <set attributeName="visibility" to="visible" begin={begin} />
                      <animateMotion
                        dur={`${flowDur.toFixed(3)}s`}
                        begin={begin}
                        repeatCount="indefinite"
                      >
                        <mpath href="#lifecycle-flow" />
                      </animateMotion>
                    </circle>
                  );
                })}
            </>
          )}
        </svg>

        <ol className="relative flex">
          {ORDERED_SOLUTIONS.map((solution, index) => (
            <li key={solution.slug} className="min-w-0 flex-1">
              <a
                href={`#${solution.slug}`}
                aria-current={active === solution.slug ? 'true' : undefined}
                className={
                  'group flex flex-col items-center gap-1.5 px-1 text-center ' +
                  (reduceMotion
                    ? ''
                    : 'transition-all duration-500 ease-out ') +
                  (revealed
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-2 opacity-0')
                }
                style={
                  reduceMotion
                    ? undefined
                    : { transitionDelay: `${index * 90}ms` }
                }
              >
                <span
                  className="flex items-center"
                  style={{ height: STRIP_ROW_HEIGHT }}
                >
                  <span
                    className={
                      'h-2.5 w-2.5 rounded-full border-2 transition-colors ' +
                      (active === solution.slug
                        ? 'border-neutral-950 bg-neutral-950'
                        : 'border-neutral-300 bg-white group-hover:border-neutral-500')
                    }
                  />
                </span>
                <span
                  className={
                    'font-mono text-[11px] transition-colors ' +
                    (active === solution.slug
                      ? 'text-neutral-950'
                      : 'text-neutral-400')
                  }
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={
                    'text-sm font-semibold tracking-[-0.02em] transition-colors ' +
                    (active === solution.slug
                      ? 'text-neutral-950'
                      : 'text-neutral-400 group-hover:text-neutral-700')
                  }
                >
                  {solution.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

export default function Solutions() {
  useScrollToHash();
  const active = useActiveSection(LIFECYCLE_ORDER);

  return (
    <article className="flex w-full flex-col px-8 pb-24 pt-10 sm:px-10 sm:pb-32 sm:pt-14 lg:px-12">
      <header className="flex flex-col gap-5 pb-10 sm:pb-12">
        <h1 className="secondary-page-title text-neutral-950">Solutions</h1>
        <p className="max-w-2xl text-lg leading-[1.4] text-neutral-600 sm:text-xl">
          One agent platform across the lifecycle of a build, from the first
          bid to the final closeout packet. Every agent works inside your
          systems, drafts the work to the last step, and waits for your
          sign-off before anything leaves the building.
        </p>
      </header>

      <LifecycleStrip active={active} />

      <div className="grid gap-12 lg:grid-cols-[0.3fr_1fr]">
        <nav
          aria-label="Solutions"
          className="hidden h-fit lg:sticky lg:top-8 lg:block"
        >
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-400">
            The build lifecycle
          </p>
          <ol className="mt-4 flex flex-col">
            {ORDERED_SOLUTIONS.map((solution, index) => (
              <li key={solution.slug}>
                <a
                  href={`#${solution.slug}`}
                  className={
                    'group flex items-baseline gap-3 border-l-2 py-2.5 pl-4 transition-colors ' +
                    (active === solution.slug
                      ? 'border-neutral-950 text-neutral-950'
                      : 'border-neutral-200 text-neutral-400 hover:border-neutral-400 hover:text-neutral-700')
                  }
                >
                  <span className="font-mono text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base font-semibold tracking-[-0.02em]">
                    {solution.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-20 sm:gap-24">
          {ORDERED_SOLUTIONS.map((solution, index) => (
            <SolutionBlock
              key={solution.slug}
              solution={solution}
              index={index}
            />
          ))}

          <WhyOrinSection />

          <div className="flex flex-col items-start gap-4 rounded-[1.75rem] bg-neutral-950 p-8 text-white sm:p-10">
            <h2 className="max-w-xl text-3xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-4xl">
              See these agents on your own workflow.
            </h2>
            <p className="max-w-lg text-base leading-7 text-white/70">
              Book a call with our team to scope a deployment against your
              process and systems.
            </p>
            <BookDemoButton variant="light" className="mt-2" />
          </div>

        </div>
      </div>
    </article>
  );
}

function WhyOrinSection() {
  const [featuredPoint, ...supportingPoints] = WHY_ORIN_POINTS;
  const renderPoint = (point: (typeof WHY_ORIN_POINTS)[number], index: number) => (
    <li
      key={point.lead}
      className="rounded-xl border-[0.5px] border-neutral-200 bg-white p-4 text-base leading-7 text-neutral-700"
    >
      <span className="mb-3 block font-mono text-xs text-neutral-400">
        {String(index + 1).padStart(2, '0')}
      </span>
      <strong className="font-semibold text-neutral-950">
        {point.lead}
      </strong>{' '}
      {point.body}
    </li>
  );

  return (
    <section className="scroll-mt-12">
      <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
        Why Orin, not a generic AI tool
      </h2>
      <p className="mt-4 max-w-2xl text-xl leading-[1.35] text-neutral-700">
        You can connect a chatbot to a folder of documents, but it won't be
        able to run a build. Here's what Orin does differently.
      </p>

      <div className="mt-8 grid gap-3">
        <ul>{featuredPoint && renderPoint(featuredPoint, 0)}</ul>
        <ul className="grid gap-3 sm:grid-cols-2">
          {supportingPoints.map((point, index) => renderPoint(point, index + 1))}
        </ul>
      </div>
    </section>
  );
}

function SolutionBlock({
  solution,
  index,
}: {
  solution: Solution;
  index: number;
}) {
  // "What the agent does" carries the concrete detail; the other prose
  // sections restate the tagline, so the combined page drops them.
  const agentSection = solution.sections.find((section) =>
    Array.isArray(section.body),
  );

  return (
    <section id={solution.slug} className="scroll-mt-12">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-sm text-neutral-400">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
          {solution.title}
        </h2>
      </div>
      <p className="mt-4 max-w-2xl text-xl leading-[1.35] text-neutral-700">
        {solution.tagline}
      </p>

      <InViewFade className="mt-8">
        <img
          src={`/solutions/${solution.slug}.png`}
          alt={`${solution.title} stage of a build`}
          loading="lazy"
          className="aspect-[16/10] w-full rounded-[1.75rem] border border-neutral-200 bg-neutral-100 object-cover sm:aspect-[21/9]"
        />
      </InViewFade>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {solution.capabilities.map((capability) => (
          <li
            key={capability}
            className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
              <Check className="h-3.5 w-3.5" />
            </span>
            <span className="text-base leading-7 text-neutral-700">
              {capability}
            </span>
          </li>
        ))}
      </ul>

      {agentSection && Array.isArray(agentSection.body) && (
        <div className="mt-8">
          <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-400">
            How it runs
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700">
            {agentSection.body.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
