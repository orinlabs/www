// Article sections for the Horizon page. Each section is a self-contained
// block of prose (and figures) so the page itself is just a composition.

import { Section } from "../WhitePaper";
import {
  DifficultyTrendFigures,
  RecencyByDifficultyFigure,
  TokensVsPassFigure,
} from "./figures";

export function IntroSection() {
  return (
    <div className="research-prose">
      <p>
        Agents are shifting from workflows into workers, and they're running for
        longer and longer. Coding harnesses can work autonomously for hours,
        while products like OpenClaw and Hermes have grown exponentially. But
        long-horizon agents frequently fall into the same traps: they lose track
        of what's going on, forget what they learned previously, and can't
        consistently learn on the job. This is what Horizon measures.
      </p>

      <p>
        Horizon makes no distinction between models and harnesses: the target
        is the utility of the learning system, regardless of how it is crafted.
      </p>
    </div>
  );
}

export function DifficultyDriversSection() {
  return (
    <Section title="Agents fail in the same ways">
      <p>
        We categorize tasks based on three dimensions: predictability, burial depth, and number of learnings required. Predictability is how easy it is to predict what the agent will need to learn. Burial depth is how far through the trace the required learning first appears. Number of learnings required is how many separate facts from the trace must be learned and combined to pass the task.
      </p>

      <DifficultyTrendFigures />

      <p> 
        All harnesses show similar patterns where predictability and number of learnings required are the clearest detractors. This makes sense, as Horizon's hardest tasks tend to be the least predictable and require more learnings. The data also suggests that agents are better at learning from their early and late experiences than their middle ones, similar to in-context rot.</p>

        <p>Future work will prioritize tasks that are less predicable and require more learnings, like testing if the agent can recognize implicit but unexpected patterns in realistic traces.</p>
    </Section>
  );
}


export function ModelLeverSection() {
  return (
    <Section title="Learning scales slowly">
      <p>
        Models are slowly getting better at Horizon, suggesting that scaling pretraining and reinforcement learning improves a model's ability to learn from long-horizon traces. However, the <b>improvement rate</b> of models is much slower on hard tasks, suggesting that intelligence alone may not be enough to learn effectively from long-horizon traces.
      </p>

      <p>
        Scaling test-time compute is weakly correlated with pass rate, but correlation varies widely between harnesses. Harnesses like OpenClaw and Hermes primarily rely on accumulating learnings over time for fast access at test time, while harnesses like RLM and RAG spend more tokens on searching the trace during the task. Our sample is small, but harnesses that accumulate do not seem to benefit from additional test-time scaling while harnesses that search do improve.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <RecencyByDifficultyFigure />
        <TokensVsPassFigure />
      </div>

      <p>
        Importantly, none of the tasks in Horizon are challenging to reason through. When we ran an oracle with perfect context, it only used a few thousand tokens to successfully complete the task. This suggests that test-time scaling may not be necessary with the right harnesses.
      </p>
      
    </Section>
  );
}

export function IntegritySection() {
  return (
    <Section title="Integrity">
      <p>To ensure that each task is fair, we built four test agents.</p>
      <ol>
        <li>
          <strong>Oracle</strong>: a script to deterministically solve each task.
          We made sure that this reliably scored 100% with low variance, showing
          that our completion criteria were consistent.
        </li>
        <li>
          <strong>Anti-Oracle</strong>: a script that does nothing. We made sure
          that this reliably scored 0% with low variance, showing that our
          completion criteria were consistent.
        </li>
        <li>
          <strong>PerfectContext</strong>: for each task, we manually fed the
          agent the important lines from the trace. We made sure that this
          reliably scored 100% with low variance, showing that each task is
          solvable with the right context.
        </li>
        <li>
          <strong>EnvironmentOnly</strong>: an agent that has no way to access
          the trace, and can only interact with the task's environment. Since
          each environment is stateful (email inboxes, sms inboxes, etc),
          ensuring a 0% score with low variance shows that the solution cannot be
          derived from the environment.
        </li>
      </ol>

      <p>
        All 195 tasks passed these tests with low variance, showing that they are solvable, the judges are fair, and the tasks do not leak information.
      </p>

      <p>
        Testing a human baseline is impossible (even reading the traces is equivalent to 1,300 Harry Potter books), but each task has been reviewed by a human and deemed reasonable.
      </p>
    </Section>
  );
}
