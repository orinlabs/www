const exceptions = [
  {
    label: 'Vendor silence',
    detail: 'No ETA received',
    className: 'left-[7%] top-[25%]',
    tone: 'border-effect-claude/30 bg-effect-claude/10 text-effect-claude',
  },
  {
    label: 'Stale approval',
    detail: 'Owner hold',
    className: 'right-[8%] top-[18%]',
    tone: 'border-effect-codex/30 bg-effect-codex/10 text-effect-codex',
  },
  {
    label: 'PO mismatch',
    detail: 'Line item drift',
    className: 'left-[13%] top-[58%]',
    tone: 'border-effect-rlm/30 bg-effect-rlm/10 text-effect-rlm',
  },
  {
    label: 'Site access',
    detail: 'Gate code expired',
    className: 'right-[13%] top-[52%]',
    tone: 'border-effect-openclaw/30 bg-effect-openclaw/10 text-effect-openclaw',
  },
  {
    label: 'Record conflict',
    detail: 'Two sources differ',
    className: 'left-[40%] top-[76%]',
    tone: 'border-effect-rag/30 bg-effect-rag/10 text-effect-rag',
  },
] as const;

const routeSteps = [
  { label: 'Read', className: 'left-[11%] top-[72%]' },
  { label: 'Infer', className: 'left-[32%] top-[55%]' },
  { label: 'Resolve', className: 'left-[54%] top-[39%]' },
  { label: 'Commit', className: 'left-[76%] top-[24%]' },
] as const;

export function FrontierExceptionFieldVisual() {
  return (
    <div className="relative min-h-[32rem] overflow-hidden bg-neutral-950 p-6 text-white sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-effect-claude),var(--color-effect-codex),var(--color-effect-rag),var(--color-effect-openclaw))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_32%,rgba(255,255,255,0.12),transparent_31%),radial-gradient(circle_at_22%_72%,rgba(0,132,94,0.18),transparent_25%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60" />

      <div className="relative flex min-h-[28rem] flex-col justify-between">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="max-w-sm text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">
              Exception field
            </h3>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">
              The agent path holds through silence, mismatches, approvals, and access friction.
            </p>
          </div>
          <p className="shrink-0 font-mono text-sm text-white/35">002</p>
        </div>

        <div className="relative mt-10 min-h-[20rem] rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl shadow-black/25">
          <div className="absolute inset-4 rounded-[1rem] border border-white/[0.06]" />

          <svg
            className="absolute inset-0 h-full w-full"
            fill="none"
            viewBox="0 0 680 360"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="exception-route" x1="66" x2="600" y1="282" y2="80">
                <stop stopColor="var(--color-effect-claude)" />
                <stop offset="0.48" stopColor="var(--color-effect-codex)" />
                <stop offset="1" stopColor="var(--color-effect-rag)" />
              </linearGradient>
              <filter id="route-glow" x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M64 286 C148 252 168 194 244 194 C327 194 324 138 400 138 C484 138 500 88 612 82"
              stroke="rgba(255,255,255,0.14)"
              strokeDasharray="3 10"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M64 286 C148 252 168 194 244 194 C327 194 324 138 400 138 C484 138 500 88 612 82"
              filter="url(#route-glow)"
              stroke="url(#exception-route)"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>

          <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-neutral-950/70 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/45">
            one clean path
          </div>
          <div className="absolute bottom-5 right-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-xl shadow-black/30">
            Resolved
          </div>

          {exceptions.map((exception) => (
            <div
              key={exception.label}
              className={
                'absolute w-36 rounded-2xl border px-3 py-2.5 backdrop-blur-md ' +
                exception.className +
                ' ' +
                exception.tone
              }
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em]">
                  exception
                </p>
              </div>
              <p className="text-sm font-semibold leading-4 text-white">{exception.label}</p>
              <p className="mt-1 text-xs leading-4 text-white/45">{exception.detail}</p>
            </div>
          ))}

          {routeSteps.map((step, index) => (
            <div
              key={step.label}
              className={
                'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/15 bg-neutral-950/85 py-1.5 pl-1.5 pr-3 shadow-lg shadow-black/25 backdrop-blur ' +
                step.className
              }
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[0.65rem] font-semibold text-neutral-950">
                {index + 1}
              </span>
              <span className="text-xs font-medium text-white/75">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
