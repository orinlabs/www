import 'prismjs/components/prism-json';

import { useEffect } from 'react';

import Prism from 'prismjs';
import { Link } from 'react-router-dom';

import { JoinUs } from '../../components/Hiring';
import {
  ContributorsSection,
  Horizon1Chart,
  Horizon1Results,
  IntegritySection,
  MethodologySection,
} from '../../components/horizon1';
import { ResearchArticle, Section } from '../../components/WhitePaper';

const HERO_TITLE = "Introducing Horizon-1";
const HERO_ABSTRACT =
  "We're releasing a preview of Horizon-1, our flagship benchmark that measures an agent's ability to learn on the job. Each task is created from real product usage data and requires the agent to learn from months of it's previous actions to succeed.";

// Full-width hero: the benchmark image with the title/subtitle/authors/date
// overlaid in the lower-left. The nav is layered on top by the Layout.
export function Horizon1Hero() {
  return (
    <>
      <img
        src="/horizon-1-benchmark.png"
        alt="Horizon-1 — building agents that learn"
        className="absolute inset-x-0 bottom-0 h-[42%] md:inset-0 md:h-full object-cover object-right-bottom md:object-contain md:object-bottom block dark:hidden"
      />
      <img
        src="/horizon-1-benchmark-dark.png"
        alt="Horizon-1 — building agents that learn"
        className="absolute inset-x-0 bottom-0 h-[42%] md:inset-0 md:h-full object-cover object-right-bottom md:object-contain md:object-bottom hidden dark:block"
      />
      <div className="absolute inset-x-0 z-10 top-0 md:top-auto md:bottom-0 px-8 sm:px-10 lg:px-12 pt-24 sm:pt-28 md:pt-0 pb-8 sm:pb-10 lg:pb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight max-w-4xl">
          {HERO_TITLE}
        </h1>
        <p className="mt-4 text-base text-neutral-600/80 dark:text-neutral-400/80 leading-normal tracking-wide max-w-lg lg:max-w-2xl">
          {HERO_ABSTRACT}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-neutral-600 dark:text-neutral-400 text-base">
          <Link to="/" className="text-primary hover:underline transition-colors">
            Orin Labs
          </Link>
          <span
            aria-hidden
            className="text-neutral-400 dark:text-neutral-500 select-none"
          >
            ·
          </span>
          <a
            href="https://driftwood.sh/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline transition-colors"
          >
            Driftwood AI
          </a>
          <span className="text-neutral-400 dark:text-neutral-500">|</span>
          <span>June 2026</span>
        </div>
      </div>
    </>
  );
}

export default function Horizon1() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <ResearchArticle
      title={HERO_TITLE}
      authors={["Orin Labs", "Driftwood AI"]}
      date="June 2026"
      abstract={HERO_ABSTRACT}
      hideHeader
    >
      <Section className="mt-8">
        <p>
          We expect agents to soon play an active role in businesses, but the bottleneck to that is whether agents can learn on the job. This is exactly what Horizon-1 measures. Horizon-1 makes no distinction between models and harnesses, aiming to measure the learning ability of the system as a whole.
        </p>

        <Horizon1Chart
          defaultAxis='timeSec' defaultDifficulty="all" axisControls={false} difficultyControls={false} />
      </Section>

      <Section title="[breakdown]">
        <p>
          Most failures happen on query expansion, pattern recognition, and
          distractor tasks.
        </p>
        <p>
          Models are also <strong>not improving</strong> on our hard tasks over
          time. Scaling data and RL is not helping.
        </p>
        <p>
          This suggest{" "}
          <strong>
            that you can’t reason your way into remembering something.
          </strong>{" "}
          There’s a deeper structural issue that makes these tasks unsolvable
          with current models/harnesses.
        </p>
        <p>
          What helps the most is harnesses, which can change the paradigm of how
          context is managed. But even harnesses have no solved this yet.
        </p>
      </Section>

      <MethodologySection />

      <IntegritySection />

      <Section title="[all results]">
        <Horizon1Results />
      </Section>

      <ContributorsSection />

      <p className="research-prose text-sm italic mb-12">
        *All data was collected with proper user permissions.
      </p>

      <JoinUs padded={false} />
    </ResearchArticle>
  );
}
