import 'prismjs/components/prism-json';

import { useEffect } from 'react';

import Prism from 'prismjs';

import {
  DifficultyDriversSection,
  HorizonLeaderboard,
  HorizonResults,
  IntegritySection,
  ModelLeverSection,
  TakeawaysSection,
  TaskAnatomySection,
  ThanksSection,
} from '../../components/horizon';
import { ResearchArticle, Section } from '../../components/WhitePaper';

const HERO_TITLE = "Introducing Horizon";
const HERO_ABSTRACT = "We're releasing Horizon, a benchmark that measures an agent's ability to learn from past experience. Each task requires understanding months of real interactions with customers across millions of tokens to succeed.";

export default function Horizon() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Introducing Horizon | Orin Labs';
    Prism.highlightAll();
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <ResearchArticle
      title={HERO_TITLE}
      authors={["Bryan Houlton", "Aayush Gupta"]}
      date="June 2026"
      abstract={HERO_ABSTRACT}
      image={{
        src: "/horizon-benchmark.png",
        darkSrc: "/horizon-benchmark-dark.png",
        alt: "Horizon benchmark preview",
      }}
    >
      <Section>
        <p>
          Horizon is derived from failures we saw running Claw-like agents with real customers over the last year. We believe the future will be full of persistent background agents that act by themselves, but the clear adoption bottleneck is that agents still cannot reliably learn over time.
        </p>
        <p>
          Horizon makes no distinction between models and harnesses, aiming instead to measure the learning ability of the agent.
        </p>

        <HorizonLeaderboard />
      </Section>

      <TaskAnatomySection />

      <DifficultyDriversSection />

      <ModelLeverSection />

      <TakeawaysSection />

      <IntegritySection />

      <ThanksSection />



      <Section title="All Results">
        <HorizonResults />
       
      </Section>

      
    </ResearchArticle>
  );
}
