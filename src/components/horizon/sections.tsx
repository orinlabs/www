// Article sections for the Horizon page. Each section is a self-contained
// block of prose (and figures) so the page itself is just a composition.

import { Section, Subsection } from "../WhitePaper";
import {
  ContentFlagsFigure,
  DifficultyAxesFigure,
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
        Every harness remembers a long trace in one of two ways: take notes as
        you go, or look things up later. Note-takers (OpenClaw's LCM, Hermes)
        write down whatever seems important while ingesting the trace.
        Look-uppers (RLM, RAG, Claude Code, Codex) keep the raw trace and
        search it at task time with <code>grep</code>, semantic retrieval, or
        RLM.
      </p>

      <p>
        On the same model (Claude Opus 4.8), RLM passes 56% of tasks and
        OpenClaw (LCM) passes 58%. Of the tasks RLM fails, 73% are also failed
        by OpenClaw (LCM). The overlap points to a cause shared by both
        strategies rather than a weakness in either implementation.
      </p>

      <p>
        The shared cause is prediction. A note-taker decides what to write
        down before any task exists: in nearly every OpenClaw (LCM) and Hermes
        failure, the required information was never stored. A look-upper
        decides what to search for, and it only searches for what it already
        expects: in the example task above, nothing suggests an attachment
        might fail to open, so the agent never searches the trace for one that
        did. Nearly every RLM, RAG, Claude Code, and Codex failure follows this
        pattern.
      </p>

      <DifficultyTrendFigures />

      <p>
        The benchmark-wide data matches this mechanism. Pass rates fall along
        exactly the axes that make the prediction harder: lower predictability
        of the required memory, deeper burial in the trace, and more memories
        that must be combined.
      </p>
    </Section>
  );
}


export function ModelLeverSection() {
  return (
    <Section title="Scaling Laws">
      <p>
        <strong>Models are improving at easy and medium tasks, much less at
        hard ones.</strong> A year of model releases is worth +22pp of pass
        rate on easy tasks and +29pp on medium, but only +8pp on hard (the
        red series in the release-date chart). The hard-task progress that does
        exist is concentrated in harnesses that search: RLM rises +20pp per
        year, from 1.5% (GPT-5 Mini) to 21.5% (Claude Opus 4.8); OpenClaw
        (LCM) rises half as fast; RAG and Hermes do not rise, and no model
        exceeds 8% on hard tasks under RAG.
      </p>

      <p>
        <strong>Test-time scaling only works on some harnesses.</strong>{" "}
        Across all 24 runs, tokens per task and pass rate correlate at
        r&nbsp;=&nbsp;0.17. Within harnesses the picture splits: RLM is the
        only harness where more tokens track more passes (r&nbsp;=&nbsp;+0.31
        across its models). OpenClaw (LCM) runs the other way
        (r&nbsp;=&nbsp;-0.76): its lightest run is its best, 57% at 60k
        tokens per task, while its token-hungriest models are its weakest.
        RAG is flat (r&nbsp;=&nbsp;-0.03): more tokens retrieve no more
        memory.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <RecencyByDifficultyFigure />
        <TokensVsPassFigure />
      </div>

      <p>
        The mechanism behind both: RLM uses the model itself to search the
        trace, so reasoning gains and extra compute convert into retrieval
        gains. RAG's embedding retrieval does not improve when the model
        does, and the note-takers' storage decisions happen at ingestion
        time, where a smarter task-time model cannot reach them.
      </p>

      <p>
        The one lever that scales on the hardest tasks is model-driven search
        over the raw history. Better models make better searchers. They do
        not fix a fixed retriever, and they do not buy memory through more
        tokens.
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
