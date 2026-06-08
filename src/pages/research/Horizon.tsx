import 'prismjs/components/prism-json';

import { useEffect } from 'react';

import Prism from 'prismjs';
import { Link } from 'react-router-dom';

import { JoinUs } from '../../components/Hiring';
import {
  ContributorsSection,
  DifficultyDriversSection,
  HorizonLeaderboard,
  HorizonResults,
  IntegritySection,
  RecencyVsHarness,
  TaskAnatomySection,
} from '../../components/horizon';
import { ResearchArticle, Section } from '../../components/WhitePaper';

const HERO_TITLE = "Introducing Horizon";
const HERO_ABSTRACT = "We're releasing Horizon, a benchmark that measures an agent's ability to take ideal actions from past experience. Each task requires understanding months of real interactions with customers across millions of tokens to succeed."

// Full-width hero: the benchmark image with the title/subtitle/authors/date
// overlaid in the lower-left. The nav is layered on top by the Layout.
export function HorizonHero() {
  return (
    <>
      <img
        src="/horizon-benchmark.png"
        alt="Horizon — building agents that learn"
        className="absolute inset-x-0 bottom-0 h-[42%] md:inset-0 md:h-full object-cover object-right-bottom md:object-contain md:object-bottom block dark:hidden"
      />
      <img
        src="/horizon-benchmark-dark.png"
        alt="Horizon — building agents that learn"
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

export default function Horizon() {
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
          Horizon is derived from failures we saw running Claw-like agents with real customers over the last year. We believe the future will be full of persisent background agents that act by themselves, but the clear adoption bottleneck is that agents still cannot reliably learn over time.
        </p>
        <p>
          Horizon makes no distinction between models and harnesses, aiming instead to measure the learning ability of the agent.
        </p>

        <HorizonLeaderboard />
      </Section>

      <TaskAnatomySection />

      <DifficultyDriversSection />

      <IntegritySection />

      <Section title="All Results">
        <HorizonResults />
      </Section>

      <ContributorsSection />

      <p className="research-prose text-sm italic mb-12">
        *All data was collected with proper user permissions.
      </p>
    </ResearchArticle>
  );
}
