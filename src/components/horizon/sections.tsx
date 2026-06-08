// Article sections for the Horizon page. Each section is a self-contained
// block of prose (and figures) so the page itself is just a composition.

import { Section, Subsection } from "../WhitePaper";
import { ContentFlagsFigure, DifficultyAxesFigure } from "./figures";

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
      The <strong>search</strong> strategy lets the agent search through the trace using <code>grep</code>, semantic search (RAG), or methods like RLM. The <strong>store</strong> strategy is the reverse: the agent stores realtime learnings in a database or Markdown file for use later. OpenClaw and Hermes primarily use this approach.
      </p>

      <p>
        On the same model (claude-opus-4.8), neither approach saturates Horizon: RLM passes 56% while OpenClaw passes 53%. Of the tasks RLM misses, 76% are missed by OpenClaw too.
      </p>

      <p>
      The core problem is that it's impossible to predict what an agent needs to remember. For <strong>store</strong> strategies, the agent needs to decide which trace learnings to store <i>before</i> seeing the task. Nearly every time OpenClaw and Hermes failed a task, it was because the agent didn't identify the required learning(s) as important enough to store.
      </p>

      <p>
      For <strong>search</strong> strategies, a similar problem exists: the agent can only retroactively search for things it <i>expects</i>. In the example task above the agent has no reason to suspect that <code>curl</code> is broken, so it won't search the trace to check. Nearly every time RLM, RAG, Claude Code, or Codex failed a task, it was because of this issue. Additionally, existing search functions like keyword, semantic, FTS5, and BM25 lack the ability to accurately search the trace for counterfactuals, experiential links, and other non-textual connections.
      </p>

      <p>As tasks increase in difficulty, the required learning becomes more unexpected, buried in more data, and may even require multiple data points to extact the required pattern.</p>
    </Section>
  );
}

export function ResultsSection() {
  return (
    <Section title="Results">
      <p>
        The clearest signal in our preview run is that for long horizon
        learning,{" "}
        <strong>the harness around a model matters more than the model itself</strong>
        . Using a different harness with the same model can increase scores by up
        to 20 percentage points.
      </p>

      <p>
        A strong harness on a small model beats a weak harness on a frontier one.
        The highest-leverage move for a long-horizon agent is usually how it
        stores and retrieves its own history — not which model you point at it.
      </p>

      <Subsection title="What makes tasks hard">
        <p>
          Each task is characterized by a few structured axes:{" "}
          <span className="font-medium">reasoning hops</span> (number of facts
          that must be chained),{" "}
          <span className="font-medium">semantic distance</span> (how far the
          required memory is in an estimated embedding space),{" "}
          <span className="font-medium">memory depth</span> (how deep in the
          trace it lives), and whether the task is{" "}
          <span className="font-medium">adversarial</span> — the environment
          actively tries to mislead the agent using patched or stale facts,
          confusable entities, a confidently wrong speaker, or a directive that
          should be overridden.
        </p>

        <DifficultyAxesFigure />

        <p>
          Performance degrades on every axis. RLM holds up best and most
          gracefully; RAG falls hardest. All harnesses get tripped up by
          adversarial tasks — most of all when they need to recall a fact that
          was later updated.
        </p>

        <ContentFlagsFigure />
      </Subsection>

      <p className="text-sm italic text-neutral-500 dark:text-neutral-400">
        Numbers are from a preview run and are subject to change as remaining
        configurations finish.
      </p>
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

export function ContributorsSection() {
  return (
    <Section title="Contributors">
      <p>
        Horizon was developed as a collaboration between Orin Labs and
        Driftwood AI, led by Bryan Houlton and Aayush Gupta.
      </p>
    </Section>
  );
}
