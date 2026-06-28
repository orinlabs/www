const loopStages = [
  {
    step: '01',
    label: 'Notice',
    position: 'left-[50%] top-[11%] -translate-x-1/2',
    color: 'bg-effect-codex',
  },
  {
    step: '02',
    label: 'Act',
    position: 'right-[11%] top-[46%] -translate-y-1/2',
    color: 'bg-effect-claude',
  },
  {
    step: '03',
    label: 'Check',
    position: 'left-[50%] bottom-[11%] -translate-x-1/2',
    color: 'bg-effect-rag',
  },
  {
    step: '04',
    label: 'Retry',
    position: 'left-[11%] top-[46%] -translate-y-1/2',
    color: 'bg-effect-rlm',
  },
];

const blockers = [
  {
    label: 'No response',
    detail: 'Re-open thread',
    position: 'left-6 top-[8.5rem]',
    accent: 'bg-effect-claude',
  },
  {
    label: 'Waiting approval',
    detail: 'Escalate path',
    position: 'right-6 top-[7rem]',
    accent: 'bg-effect-codex',
  },
  {
    label: 'Record mismatch',
    detail: 'Resolve source',
    position: 'right-7 bottom-[8.5rem]',
    accent: 'bg-effect-openclaw',
  },
];

export function FrontierFollowThroughVisual() {
  return (
    <div
      className="relative isolate min-h-[32rem] overflow-hidden bg-neutral-950 p-6 text-white sm:p-8"
      role="img"
      aria-label="Follow-through loop showing notice, act, check, and retry stages around external blockers until work is closed."
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-effect-claude),var(--color-effect-codex),var(--color-effect-rag),var(--color-effect-openclaw))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.11),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.09)_0,transparent_34%,rgba(255,255,255,0.04)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-35" />

      <div className="flex h-full min-h-[28rem] flex-col justify-between">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="max-w-sm text-4xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-5xl">
              Follow-through loop
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/48">
              Persistent closure across every handoff, wait state, and exception.
            </p>
          </div>
          <p className="shrink-0 font-mono text-sm text-white/35">004</p>
        </div>

        <div className="relative mx-auto mt-8 aspect-square w-full max-w-[25rem]">
          <div className="absolute inset-[10%] rounded-full border border-white/10 bg-white/[0.025] shadow-2xl shadow-black/30" />
          <div className="absolute inset-[18%] rounded-full border border-dashed border-white/10" />

          <svg
            className="absolute inset-[13%] h-[74%] w-[74%]"
            viewBox="0 0 300 300"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="follow-through-loop" x1="42" y1="35" x2="260" y2="265">
                <stop stopColor="var(--color-effect-codex)" />
                <stop offset="0.34" stopColor="var(--color-effect-claude)" />
                <stop offset="0.68" stopColor="var(--color-effect-rag)" />
                <stop offset="1" stopColor="var(--color-effect-rlm)" />
              </linearGradient>
              <marker
                id="follow-through-arrow"
                markerHeight="8"
                markerWidth="8"
                orient="auto"
                refX="6"
                refY="4"
              >
                <path d="M0 0L8 4L0 8Z" fill="white" opacity="0.82" />
              </marker>
            </defs>
            <path
              d="M150 32C217.9 32 268 82.1 268 150C268 217.9 217.9 268 150 268C82.1 268 32 217.9 32 150C32 82.1 82.1 32 150 32Z"
              stroke="url(#follow-through-loop)"
              strokeLinecap="round"
              strokeWidth="8"
              strokeDasharray="190 18"
              markerEnd="url(#follow-through-arrow)"
            />
            <path
              d="M88 82C124 52 178 51 214 82"
              stroke="white"
              strokeLinecap="round"
              strokeWidth="1"
              opacity="0.22"
            />
            <path
              d="M86 218C122 249 179 250 216 218"
              stroke="white"
              strokeLinecap="round"
              strokeWidth="1"
              opacity="0.18"
            />
          </svg>

          <div className="absolute left-1/2 top-1/2 grid h-[8.5rem] w-[8.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-neutral-950/95 p-4 text-center shadow-2xl shadow-black/40">
            <div>
              <div className="mx-auto mb-3 h-2 w-10 rounded-full bg-[linear-gradient(90deg,var(--color-effect-codex),var(--color-effect-rag))]" />
              <p className="text-2xl font-semibold leading-none tracking-[-0.04em]">Until closed</p>
              <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/38">
                Not one task
              </p>
            </div>
          </div>

          {loopStages.map((stage) => (
            <div
              key={stage.step}
              className={
                'absolute flex items-center gap-2 rounded-full border border-white/12 bg-neutral-950/90 px-3 py-2 shadow-xl shadow-black/25 backdrop-blur ' +
                stage.position
              }
            >
              <span className={'h-2.5 w-2.5 rounded-full ' + stage.color} />
              <span className="font-mono text-[0.62rem] text-white/36">{stage.step}</span>
              <span className="text-sm font-semibold tracking-[-0.02em]">{stage.label}</span>
            </div>
          ))}

          {blockers.map((blocker) => (
            <div
              key={blocker.label}
              className={
                'absolute hidden w-36 rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-2xl shadow-black/25 backdrop-blur-md sm:block ' +
                blocker.position
              }
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={'h-1.5 w-1.5 rounded-full ' + blocker.accent} />
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/34">
                  Blocker
                </span>
              </div>
              <p className="text-sm font-semibold leading-tight tracking-[-0.02em]">
                {blocker.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/42">{blocker.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/35">
              Closure state
            </p>
            <p className="mt-2 max-w-md text-lg font-semibold leading-6 tracking-[-0.03em] text-white/88">
              The loop ends only when the outcome is verified, recorded, and no longer waiting on anyone.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white px-4 py-2 text-neutral-950 shadow-xl shadow-black/25">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-effect-rag text-white">
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M2.5 6.2L4.8 8.5L9.6 3.6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <span className="text-sm font-semibold">Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
