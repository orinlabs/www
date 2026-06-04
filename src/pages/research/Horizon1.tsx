import 'prismjs/components/prism-json';

import { useEffect } from 'react';

import Prism from 'prismjs';

import { JoinUs } from '../../components/Hiring';
import {
  ContributorsSection,
  Horizon1Results,
  IntegritySection,
  IntroSection,
  MethodologySection,
  ResultsSection,
} from '../../components/horizon1';
import { ResearchArticle } from '../../components/WhitePaper';

export default function Horizon1() {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <ResearchArticle
      title="Introducing Horizon-1"
      authors={["Orin Labs", "Driftwood AI"]}
      date="June 2026"
      image={{
        src: "/horizon-1-benchmark.png",
        darkSrc: "/horizon-1-benchmark-dark.png",
        alt: "Horizon-1 — building agents that learn",
      }}
      abstract="We're releasing a preview of Horizon-1, our benchmark that measures an agent's ability to acquire learnings from a long history and apply them to a task."
    >
      <IntroSection />

      <Horizon1Results />

      <ResultsSection />

      <MethodologySection />

      <IntegritySection />

      <ContributorsSection />

      <p className="research-prose text-sm italic mb-12">
        *All data was collected with proper user permissions.
      </p>

      <JoinUs padded={false} />
    </ResearchArticle>
  );
}
