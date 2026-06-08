// What-is-a-task section for the Horizon page. Everything here grounds the
// abstract idea of a "task" in one concrete, real-shaped example (an agent that
// learned curl is broken on its machine, then gets a fresh download task) and
// walks it end to end:
//   Beat 1  TaskTimelineFigure  — a trace + a task, with each blown up.
//   Beat 2  TaskOutcomes         — what passing vs failing looks like here.
// The integrity checks (oracle / anti-oracle / perfect-context / env-only) are
// intentionally left to their own later section.

import { Section } from "../WhitePaper";

// ---------------------------------------------------------------------------
// Shared figure frame (matches ./figures' Figure, which isn't exported).
// ---------------------------------------------------------------------------

function Figure({
  title,
  caption,
  children,
}: {
  title?: string;
  caption?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-8">
      {title && (
        <figcaption className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {title}
        </figcaption>
      )}
      {children}
      {caption && (
        <figcaption className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Beat 1: the trace + task timeline, rendered from a static figure. A wide
// "historical trace" box and a small "task" box, each magnified to show what's
// inside (the agent learning curl is broken; a fresh inbound download task).
// ---------------------------------------------------------------------------

export function TaskTimelineFigure() {
  return (
    <Figure>
      <img
        src="/example_task.png"
        alt="A historical trace of millions of tokens over months, paired with a single new task. One slice of the trace is magnified to show the agent hitting a broken curl and falling back to wget; the task is an inbound SMS asking it to download a release file."
        className="w-full block dark:hidden max-w-2xl"
      />
      <img
        src="/example_task_dark.png"
        alt="A historical trace of millions of tokens over months, paired with a single new task. One slice of the trace is magnified to show the agent hitting a broken curl and falling back to wget; the task is an inbound SMS asking it to download a release file."
        className="w-full hidden dark:block max-w-2xl"
      />
    </Figure>
  );
}


// ---------------------------------------------------------------------------
// Beat 2: what passing vs failing looks like on this specific task.
// ---------------------------------------------------------------------------

function Outcome({
  pass,
  className,
  children,
}: {
  pass: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <span
        className={
          "inline-block text-xs font-semibold px-2 py-0.5 rounded-full " +
          (pass
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
            : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400")
        }
      >
        {pass ? "✓ pass" : "✗ fail"}
      </span>
      <p className="mt-2 text-[13px] leading-snug text-neutral-600 dark:text-neutral-300">
        {children}
      </p>
    </div>
  );
}

export function TaskOutcomes() {
  return (
    <Figure
      caption={
        <>
          The task passes only if the agent takes the ideal action — reaching for{" "}
          <code>wget</code> directly. Re-hitting the known-broken <code>curl</code>{" "}
          counts as a miss, even though the file does eventually download.
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-800">
        <Outcome pass={false} className="pb-4 sm:pb-0 sm:pr-8">
          Reaches for <code>curl</code> by default, hits the same broken-libssl
          error it saw months ago, then falls back to <code>wget</code>. It
          repeated a mistake its own history had already solved.
        </Outcome>
        <Outcome pass className="pt-4 sm:pt-0 sm:pl-8">
          Recalls the lesson and runs <code>wget</code> on the first try — the
          ideal action, no wasted failure.
        </Outcome>
      </div>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// Composed section.
// ---------------------------------------------------------------------------

export function TaskAnatomySection() {
  return (
    <Section title="Example Task">
      <p>
        Every Horizon task has a long <strong>historical trace</strong> that the agent must learn from to complete the task correctly. Each trace is <strong>real</strong> and months-long, pulled from one of our products,{" "}
        <a
          href="https://acadialearning.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Acadia Learning
        </a>
        .
      </p>

      <TaskTimelineFigure />

      <p>
        For example: the agent in this task learned months ago that <code>curl</code> is broken on its machine and that <code>wget</code> works instead. This is buried deep in the trace, hidden by a bunch of other agent activity. When a new download request arrives, the task tests whether the agent has learned to use <code>wget</code> on the first try. Lessons can be anywhere in the trace, occur multiple times, or even require multiple data points to extract the required pattern.
      </p>
      <p>
        Horizon contains 195 tasks, but is private to prevent overfitting and
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
        Each task runs in an environment with real tools — email and SMS
        inboxes, and more — and is graded on completion, cost, and speed, judged
        from the final environment state by an LLM plus deterministic checks.
      </p>

    </Section>
  );
}
