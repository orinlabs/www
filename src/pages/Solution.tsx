import { ArrowLeftIcon, ArrowRight, Check } from 'lucide-react';
import {
  Link,
  Navigate,
  useParams,
} from 'react-router-dom';

import { BookDemoButton } from '../components/BookDemoButton';
import {
  getSolutionBySlug,
  SOLUTIONS,
  type Solution as SolutionType,
} from '../data/solutions';

export default function Solution() {
  const { slug } = useParams<{ slug: string }>();
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    return <Navigate to="/" replace />;
  }

  const others = SOLUTIONS.filter((s) => s.slug !== solution.slug);

  return (
    <article className="flex w-full flex-col px-8 pb-24 pt-10 sm:px-10 sm:pb-32 sm:pt-14 lg:px-12">
      <header className="grid min-h-[44svh] gap-10 pb-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <div>
          <Link
            to="/#deployments"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Solutions
          </Link>
          <h1 className="secondary-page-title mt-6 max-w-5xl text-neutral-950">
            {solution.title}
          </h1>
        </div>

        <div className="max-w-2xl lg:pb-4">
          <p className="text-2xl leading-[1.25] text-neutral-700">
            {solution.tagline}
          </p>

          {solution.metrics && solution.metrics.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
              {solution.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="text-3xl font-semibold tracking-[-0.03em] text-neutral-950 sm:text-4xl">
                    {metric.value}
                  </dt>
                  <dd className="mt-1 max-w-[12rem] text-sm leading-snug text-neutral-500">
                    {metric.label}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8">
            <BookDemoButton />
          </div>
        </div>
      </header>

      <div className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.34fr_1fr]">
        <aside className="h-fit lg:sticky lg:top-8">
          <p className="text-sm font-medium uppercase tracking-wide text-neutral-400">
            Overview
          </p>
          <div className="mt-4 flex flex-col gap-4 text-base leading-7 text-neutral-700">
            {solution.overview.split(/\n\s*\n/).map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>
        </aside>

        <div className="flex flex-col gap-12">
          <section>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-neutral-950 sm:text-3xl">
              What the agent does
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
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
          </section>

          {solution.sections.map((section) => (
            <SolutionSection key={section.heading} section={section} />
          ))}

          <div className="flex flex-col items-start gap-4 rounded-[1.75rem] bg-neutral-950 p-8 text-white sm:p-10">
            <h2 className="max-w-xl text-3xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-4xl">
              See {solution.title} on your own workflow.
            </h2>
            <p className="max-w-lg text-base leading-7 text-white/70">
              Book a call with our team to scope a deployment against your
              process and systems.
            </p>
            <BookDemoButton variant="light" className="mt-2" />
          </div>
        </div>
      </div>

      <section className="border-t border-neutral-200 pt-12">
        <h2 className="text-2xl font-semibold tracking-[-0.025em] text-neutral-950 sm:text-3xl">
          More solutions
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other) => (
            <Link
              key={other.slug}
              to={"/solutions/" + other.slug}
              className="group flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-950"
            >
              <span className="flex items-center justify-between text-lg font-semibold tracking-[-0.02em] text-neutral-950">
                {other.title}
                <ArrowRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-950" />
              </span>
              <span className="text-sm leading-6 text-neutral-500">
                {other.tagline}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

function SolutionSection({
  section,
}: {
  section: SolutionType["sections"][number];
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-[-0.025em] text-neutral-950 sm:text-3xl">
        {section.heading}
      </h2>
      {Array.isArray(section.body) ? (
        <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
          {section.body.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col gap-5 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
          {section.body.split(/\n\s*\n/).map((para, i) => (
            <p key={i}>{para.trim()}</p>
          ))}
        </div>
      )}
    </section>
  );
}
