import { useEffect, useState } from 'react';

import { Check } from 'lucide-react';
import {
  Link,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom';

import { BookDemoButton } from '../components/BookDemoButton';
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

function useActiveSection(slugs: string[]) {
  const [active, setActive] = useState(slugs[0]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
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

export default function Solutions() {
  useScrollToHash();
  const active = useActiveSection(LIFECYCLE_ORDER);

  return (
    <article className="flex w-full flex-col px-8 pb-24 pt-10 sm:px-10 sm:pb-32 sm:pt-14 lg:px-12">
      <header className="grid gap-10 pb-16 sm:pb-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <h1 className="secondary-page-title text-neutral-950">Solutions</h1>
        <p className="max-w-2xl text-2xl leading-[1.25] text-neutral-700 lg:pb-4">
          One agent platform across the lifecycle of a build — from the first
          bid to the final closeout packet.
        </p>
      </header>

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

          <p className="text-sm text-neutral-500">
            Looking for where these run today?{' '}
            <Link
              to="/#deployments"
              className="font-medium text-neutral-950 underline-offset-4 hover:underline"
            >
              See deployments
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
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
    <section id={solution.slug} className="scroll-mt-24">
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
