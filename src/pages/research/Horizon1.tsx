import 'prismjs/components/prism-json';

import { useEffect } from 'react';

import Prism from 'prismjs';

import CodeBlock from '../../components/CodeBlock';
import {
  ArchitectureSpreadFigure,
  ContentFlagsFigure,
  DifficultyAxesFigure,
} from '../../components/Horizon1Figures';
import { JoinUs } from '../../components/Hiring';
import { Horizon1Results } from '../../components/Horizon1Results';
import {
  ResearchArticle,
  Section,
  Subsection,
} from '../../components/WhitePaper';

const EXAMPLE_TRACE = `{"timestamp": "2026-03-19T09:42:11+00:00", "message_data": {"id": null, "type": "reasoning", "summary": "Need to grab the release tarball. Reaching for curl by default."}}
{"timestamp": "2026-03-19T09:42:12+00:00", "message_data": {"id": "tc_a1", "name": "shell_exec", "type": "function_call", "call_id": "tc_a1", "arguments": "{\\"command\\": \\"curl -fLO https://files.example.com/release-1.4.2.tar.gz\\"}"}}
{"timestamp": "2026-03-19T09:42:12+00:00", "message_data": {"type": "function_call_output", "call_id": "tc_a1", "output": "curl: symbol lookup error: undefined symbol: SSL_get1_peer_certificate\\nexit code: 127"}}
{"timestamp": "2026-03-19T09:42:14+00:00", "message_data": {"id": null, "type": "reasoning", "summary": "curl is broken on this box — bad libssl link. Falling back to wget."}}
{"timestamp": "2026-03-19T09:42:15+00:00", "message_data": {"id": "tc_a2", "name": "shell_exec", "type": "function_call", "call_id": "tc_a2", "arguments": "{\\"command\\": \\"wget https://files.example.com/release-1.4.2.tar.gz\\"}"}}
{"timestamp": "2026-03-19T09:42:18+00:00", "message_data": {"type": "function_call_output", "call_id": "tc_a2", "output": "release-1.4.2.tar.gz  100%[==================>]  18.4M ... saved"}}`;

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
      <div className="research-prose">
        <p>
          Agents are shifting from workflows into workers, and they're running
          for longer and longer. Coding harnesses can work autonomously for
          hours, while products like OpenClaw and Hermes have grown exponentially. But
          long-horizon agents frequently fall into the same traps: they lose
          track of what's going on, misremember what happened previously, and
          can't consistently learn on the job. This is what Horizon-1 measures.
        </p>

        <p>
          Horizon-1 makes no distinction between models and harnesses: the target is the utility of the learning system, regardless of how it is crafted.
        </p>
      </div>

      <Horizon1Results />

      <Section title="Results">
        <p>
          The clearest signal in our preview run is that for long horizon learning, <strong>the harness around a model matters more than the model itself</strong>
          . Using a different harness with the same model can increase scores by up to 20 percentage points.
        </p>

        <ArchitectureSpreadFigure />

        <p>
          A strong harness on a small model beats a weak harness on a frontier one. The
          highest-leverage move for a long-horizon agent is usually how it stores
          and retrieves its own history — not which model you point at it.
        </p>

        <Subsection title="What makes tasks hard">
          <p>
            Each task is characterized by a few structured axes:{" "}
            <span className="font-medium">reasoning hops</span> (number of facts that must
            be chained), <span className="font-medium">semantic distance</span>{" "}
            (how far the required memory is in an estimated embedding space),{" "}
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

      <Section title="Methodology">
        <p>
          Each task in Horizon-1 depends on a example agent's history, which we
          call a "trace". A trace looks like this:
        </p>
        <CodeBlock language="json" code={EXAMPLE_TRACE} />
        <p>
          Traces are just large arrays of LLM chat inputs, and each tells a
          complicated story. Traces are anywhere from 2-36M tokens long and span
          3-7 months of agent activity. Each trace is <strong>real</strong>,
          created by one of our products,{" "}
          <a
            href="https://acadialearning.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acadia Learning
          </a>
          .
        </p>
        <p>
          Horizon-1 contains 195 tasks, but is private to prevent overfitting and
          keep user data secure<sup>*</sup>. We have included a few example eval
          cases in our{" "}
          <a
            href="https://github.com/orinlabs/horizon-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            public repo
          </a>
          , including a public{" "}
          <a
            href="https://huggingface.co/datasets/orinlabs/horizon-1-example-traces"
            target="_blank"
            rel="noopener noreferrer"
          >
            HuggingFace dataset
          </a>{" "}
          of traces, to show how the benchmark is structured.
        </p>
        <p>
          The correct solution to each task requires information from these
          massive traces. The agent must recall events, recognize patterns, and
          understand each situation in order to pass.
        </p>
        <p>
          Each task takes place in an environment with many tools: email inboxes,
          SMS inboxes, and more, and agents are scored on task completion rate,
          cost, and speed. Task completions are judged using LLM-as-a-judge on the
          environment state, combined with deterministic checks.
        </p>
      </Section>

      <Section title="Integrity">
        <p>To ensure that each task is fair, we did four tests.</p>
        <ol>
          <li>
            <strong>Oracle</strong>: a script to deterministically solve each
            task. We made sure that this reliably scored 100% with low variance,
            showing that our completion criteria were consistent.
          </li>
          <li>
            <strong>Anti-Oracle</strong>: a script that does nothing. We made
            sure that this reliably scored 0% with low variance, showing that our
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
            ensuring a 0% score with low variance shows that the solution cannot
            be derived from the environment.
          </li>
        </ol>

        <p>
          All 195 tasks passed these tests with low variance, showing that they are solvable, the judges are fair, and the tasks do not leak information.
        </p>
      </Section>

      <Section title="Contributors">
        <p>
          Horizon-1 was developed as a collaboration between Orin Labs and
          Driftwood AI, led by Bryan Houlton and Aayush Gupta.
        </p>
      </Section>

      <p className="research-prose text-sm italic mb-12">
        *All data was collected with proper user permissions.
      </p>


      <JoinUs padded={false} />
    </ResearchArticle>
  );
}
