// What-is-a-task section for the Horizon page. Everything here grounds the
// abstract idea of a "task" in one concrete, real-shaped example (an agent that
// once saw a .docx worksheet fail to open on a student's Chromebook, then gets
// a fresh send-practice-materials task) and walks it end to end:
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
// inside (a .docx worksheet failing to open on the student's Chromebook months
// ago; a fresh request to send practice materials).
// ---------------------------------------------------------------------------

export function TaskTimelineFigure() {
  return (
    <Figure>
      <img
        src="/example_task.png"
        alt="A historical trace of millions of tokens over months, paired with a single new task. One slice of the trace is magnified to show a worksheet sent as a .docx failing to open on the student's Chromebook before a PDF link works; the task is a new request to send practice materials."
        className="w-full block dark:hidden max-w-2xl"
      />
      <img
        src="/example_task_dark.png"
        alt="A historical trace of millions of tokens over months, paired with a single new task. One slice of the trace is magnified to show a worksheet sent as a .docx failing to open on the student's Chromebook before a PDF link works; the task is a new request to send practice materials."
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
          The task passes only if the agent takes the ideal action: sending the
          materials as a PDF link directly. Re-sending a <code>.docx</code>{" "}
          attachment counts as a miss, even though the student does eventually
          get working materials.
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-800">
        <Outcome pass={false} className="pb-4 sm:pb-0 sm:pr-8">
          Sends a <code>.docx</code> attachment by default, the student reports
          it won't open (the same failure it saw months ago), and session time
          is lost converting it. It repeated a mistake its own history had
          already solved.
        </Outcome>
        <Outcome pass className="pt-4 sm:pt-0 sm:pl-8">
          Recalls the failed handoff and sends a PDF link on the first try: the
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
        For example: months ago in this trace, the agent sent a worksheet as a{" "}
        <code>.docx</code> attachment, the student could not open it on a
        school-issued Chromebook, and part of the session was lost before a PDF
        link worked. Nothing in that exchange is marked as a preference or a
        rule; it is one failed handoff inside months of routine activity. When
        a new request to send practice materials arrives, the task tests
        whether the agent sends a PDF link on the first try. Lessons can be
        anywhere in the trace, occur multiple times, or require multiple data
        points to extract the required pattern.
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
        Each task runs in an environment with real tools (email and SMS
        inboxes, and more) and is graded on completion, cost, and speed, judged
        from the final environment state by an LLM plus deterministic checks.
      </p>

    </Section>
  );
}
