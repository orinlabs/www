// Article sections for the Horizon page. Each section is a self-contained
// block of prose (and figures) so the page itself is just a composition.

import { Section, Subsection } from "../WhitePaper";
import {
  ContentFlagsFigure,
  DifficultyAxesFigure,
  DifficultyTrendFigures,
} from "./figures";

export function IntroSection() {
  return (
    <div className="research-prose">
      <p>
        Agents are shifting from workflows into workers, and they're running for
        longer and longer. Coding harnesses can work autonomously for hours,
        while products like OpenClaw and Hermes have grown exponentially. But
        long-horizon agents frequently fall into the same traps: they lose track
        of what's going on, misremember what happened previously, and can't
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
    <Section title="Memory Isn't Predictable">
      <p>
        Harnesses have two ways of doing long-horizon memory: <strong>search</strong> and <strong>store</strong>.
      </p>

      <p>
      The <strong>search</strong> strategy lets the agent search through the trace using <code>grep</code>, semantic search (RAG), or methods like RLM. The <strong>store</strong> strategy is the reverse: the agent stores realtime learnings in a database or Markdown file for use later. OpenClaw (LCM) and Hermes primarily use this approach.
      </p>

      <p>
        On the same model (claude-opus-4.8), neither approach saturates Horizon: RLM passes 56% while OpenClaw (LCM) passes 53%. Of the tasks RLM misses, 76% are missed by OpenClaw (LCM) too.
      </p>

      <p>
      The core problem is that it's impossible to predict what an agent needs to remember. For <strong>store</strong> strategies, the agent needs to decide which trace learnings to store <i>before</i> seeing the task. Nearly every time OpenClaw (LCM) and Hermes failed a task, it was because the agent didn't identify the required learning(s) as important enough to store. Sometimes they stored too much information, forcing them to into a <b>search</b> strategy over their own memory.
      </p>

      <p>
      For <strong>search</strong> strategies, a similar problem exists: the agent can only retroactively search for things it <i>expects</i>. In the example task above the agent has no reason to suspect that <code>curl</code> is broken, so it won't search the trace to check. Nearly every time RLM, RAG, Claude Code, or Codex failed a task, it was because of this issue. Additionally, existing search functions like keyword, semantic, FTS5, and BM25 lack the ability to accurately search the trace for counterfactuals, experiential links, and other non-textual connections.
      </p>

      <DifficultyTrendFigures />

      <p>As tasks increase in difficulty, the required learning becomes more unexpected, buried in more data, and may even require multiple data points to extract the required pattern.</p>
    </Section>
  );
}


export function IntegritySection() {
  return (
    <Section title="Integrity">
      <p>To ensure that each task is fair, we did four tests.</p>
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
