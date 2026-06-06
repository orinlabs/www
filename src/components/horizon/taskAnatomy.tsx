// What-is-a-task section for the Horizon page. Everything here grounds the
// abstract idea of a "task" in one concrete, real-shaped example (an agent that
// learned curl is broken on its machine, then gets a fresh download task) and
// walks it end to end:
//   Beat 1  TaskTimelineFigure  — a trace + a task, with each blown up.
//   Beat 2  TaskWalkthrough     — the same task fails on RAG, passes on RLM,
//                                 shown as the actual tool calls on the way.
//   Beat 3  TaskScoringFigure    — how the final environment state is graded.
// The integrity checks (oracle / anti-oracle / perfect-context / env-only) are
// intentionally left to their own later section.

import { Section } from "../WhitePaper";
import { agentColor, useIsDark } from "./theme";

// ---------------------------------------------------------------------------
// Shared figure frame (matches ./figures' Figure, which isn't exported).
// ---------------------------------------------------------------------------

function Figure({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-8">
      <figcaption className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </figcaption>
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
    <Figure
      title="One task = a long real trace + a single new request"
      caption={
        <>
          Each task pairs a <strong>historical trace</strong> — millions of
          tokens of one agent&apos;s real past activity — with a single{" "}
          <strong>new task</strong> it must act on now. Both are shown blown up.
          Here the trace shows the agent learning the hard way that{" "}
          <code>curl</code> is broken on this machine and that <code>wget</code>{" "}
          works; the new task is a fresh download request. Acting ideally means
          applying that past experience instead of rediscovering it.
        </>
      }
    >
      <img
        src="/example_task.png"
        alt="A historical trace of millions of tokens over months, paired with a single new task. One slice of the trace is magnified to show the agent hitting a broken curl and falling back to wget; the task is an inbound SMS asking it to download a release file."
        className="w-full"
      />
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// Beat 2: the same task, fail vs pass, shown as the tool calls on the way.
// ---------------------------------------------------------------------------

interface Step {
  call: string;
  result: string;
}

interface Run {
  harness: "RAG" | "RLM";
  label: string;
  verdict: "pass" | "fail";
  steps: Step[];
  outcome: string;
}

const RUNS: Run[] = [
  {
    harness: "RAG",
    label: "Naive retrieval agent",
    verdict: "fail",
    steps: [
      {
        call: 'search_memory("download release-3.zip")',
        result: "→ 3 chunks: a changelog, a README, an old download link",
      },
      {
        call: "shell_exec(\"curl -fLO https://cdn.examplefile.com/release-3.zip\")",
        result: "→ curl: symbol lookup error: SSL_get1_peer_certificate (exit 127)",
      },
      {
        call: 'shell_exec("wget https://cdn.examplefile.com/release-3.zip")',
        result: "→ release-3.zip … saved",
      },
    ],
    outcome: "Re-hit the known-broken curl before stumbling onto the fix.",
  },
  {
    harness: "RLM",
    label: "Memory-managing agent",
    verdict: "pass",
    steps: [
      {
        call: 'recall_experience("download on this box")',
        result: '→ { note: "curl broken here (bad libssl) — use wget" }',
      },
      {
        call: 'shell_exec("wget https://cdn.examplefile.com/release-3.zip")',
        result: "→ release-3.zip … saved",
      },
    ],
    outcome: "Applied the prior lesson and reached for wget on the first try.",
  },
];

function RunColumn({ run }: { run: Run }) {
  const isDark = useIsDark();
  const color = agentColor(run.harness, isDark);
  const pass = run.verdict === "pass";
  return (
    <div className="flex-1 min-w-[280px] rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800">
        <span
          className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: color }}
        />
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {run.label}
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          ({run.harness})
        </span>
        <span
          className={
            "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full " +
            (pass
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400")
          }
        >
          {pass ? "✓ pass" : "✗ fail"}
        </span>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        {run.steps.map((s, i) => (
          <div key={i} className="text-[12px] leading-snug">
            <div className="font-mono text-neutral-700 dark:text-neutral-300 break-words">
              <span className="text-neutral-400 dark:text-neutral-600 mr-1.5 select-none">
                {i + 1}
              </span>
              {s.call}
            </div>
            <div className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 pl-5 break-words">
              {s.result}
            </div>
          </div>
        ))}
      </div>
      <div
        className="px-4 py-2.5 text-xs border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
        style={{ borderTopColor: color + "33" }}
      >
        {run.outcome}
      </div>
    </div>
  );
}

export function TaskWalkthrough() {
  return (
    <Figure
      title="Same task, two memory strategies — fail vs pass"
      caption={
        <>
          The two agents are a naive <strong>RAG</strong> harness and our{" "}
          <strong>RLM</strong> harness (we explain what these are in a later
          section). For now, notice only that the identical task flips from fail
          to pass purely on how each agent stores and recalls the trace.
        </>
      }
    >
      <div className="flex flex-wrap gap-4">
        {RUNS.map((r) => (
          <RunColumn key={r.harness} run={r} />
        ))}
      </div>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// Beat 3: how a run is scored. The agent's final environment state is checked
// deterministically and by an LLM judge; pass requires both.
// ---------------------------------------------------------------------------

function ScoreCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-[220px] rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3">
      <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

export function TaskScoringFigure() {
  return (
    <Figure
      title="How a task is scored"
      caption={
        <>
          Grading runs on the <strong>final environment state</strong> the agent
          leaves behind — downloaded files, the shell history, sent messages —
          never on its chain of thought. A task passes only when the
          deterministic checks <em>and</em> the judge agree, so the &quot;ideal
          action&quot; is pinned to a concrete, checkable outcome rather than a
          matter of taste.
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-3">
          <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
            Final environment state
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            downloaded=[&quot;release-3.zip&quot;] · shell=[&quot;wget …&quot;] · failed_cmds=0
          </div>
        </div>

        <div className="flex justify-center text-neutral-400 dark:text-neutral-600 text-lg leading-none select-none">
          ↓
        </div>

        <div className="flex flex-wrap gap-3">
          <ScoreCard title="Deterministic checks">
            <ul className="space-y-1 text-[12px] font-mono text-neutral-600 dark:text-neutral-300">
              <li>assert release-3.zip downloaded</li>
              <li>assert no failed curl attempt (wget used directly)</li>
            </ul>
          </ScoreCard>
          <ScoreCard title="LLM judge">
            <p className="text-[12px] text-neutral-600 dark:text-neutral-300 leading-snug">
              Did the agent apply the prior lesson (curl is broken here) instead
              of rediscovering it?
            </p>
          </ScoreCard>
        </div>

        <div className="flex justify-center text-neutral-400 dark:text-neutral-600 text-lg leading-none select-none">
          ↓
        </div>

        <div className="flex items-center justify-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 font-semibold">
            ✓ pass
          </span>
          <span className="text-neutral-400 dark:text-neutral-500 text-xs">
            only if both agree (plus cost, time &amp; tokens recorded)
          </span>
        </div>
      </div>
    </Figure>
  );
}

// ---------------------------------------------------------------------------
// Composed section.
// ---------------------------------------------------------------------------

export function TaskAnatomySection() {
  return (
    <Section title="What is a task?">
      <p>
        Every Horizon task is built from two things: a long, real{" "}
        <strong>historical trace</strong> of one agent&apos;s past activity, and
        a single new <strong>task</strong> the agent is handed now. To succeed,
        the agent has to take the ideal action for that task — and the ideal
        action almost always depends on something it can only know by remembering
        the trace.
      </p>

      <TaskTimelineFigure />

      <p>
        We&apos;ll ground the rest of this section in one task, shaped like a real
        one. An agent has spent months operating on a single machine. Early on it
        learned the hard way that <code>curl</code> is broken on this box — a bad
        libssl link — and that <code>wget</code> works instead. Months later, a
        new request arrives: <em>can you download this release file?</em> The
        ideal action isn&apos;t to reach for <code>curl</code> (the default) and
        rediscover the breakage. It&apos;s to use <code>wget</code> directly,
        because the agent has already seen this exact failure.
      </p>

      <TaskWalkthrough />

      <p>
        The RAG agent didn&apos;t fail because it&apos;s a weak model — it failed
        because the lesson it needed was <strong>unsearchable</strong> by its
        tools. The past failure was logged as an SSL symbol-lookup error on{" "}
        <em>release-1.4.2.tar.gz</em>; the new task is{" "}
        <em>download release-3.zip</em>. They share almost no surface terms and
        sit far apart in embedding space, so naive top-k retrieval never surfaces
        the curl-is-broken lesson — and the agent dutifully repeats the mistake.
        The agent that distills its history into durable lessons applies it no
        matter how the task is phrased. This is the whole game, and it is why the
        harness — not the model — tends to decide the outcome.
      </p>

      <TaskScoringFigure />
    </Section>
  );
}
