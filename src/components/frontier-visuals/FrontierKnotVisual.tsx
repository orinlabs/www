const knotThreads = [
  {
    id: 'vendors',
    label: 'Vendors',
    stroke: 'var(--color-effect-codex)',
    path: 'M38 310 C128 174 214 454 315 258 C404 86 496 194 592 96',
  },
  {
    id: 'permits',
    label: 'Permits',
    stroke: 'var(--color-effect-claude)',
    path: 'M35 176 C156 66 229 360 344 254 C468 139 485 361 610 272',
  },
  {
    id: 'purchase-orders',
    label: 'POs',
    stroke: 'var(--color-effect-rag)',
    path: 'M58 404 C156 266 230 154 346 300 C442 422 497 238 604 196',
  },
  {
    id: 'site-access',
    label: 'Site access',
    stroke: 'var(--color-effect-openclaw)',
    path: 'M75 96 C165 264 245 86 355 215 C462 341 496 383 595 394',
  },
  {
    id: 'finance',
    label: 'Finance',
    stroke: 'var(--color-effect-rlm)',
    path: 'M45 256 C153 427 256 60 352 170 C440 272 481 108 606 326',
  },
];

const knotNodes = [
  {
    label: 'vendor',
    className: 'left-[12%] top-[24%] border-effect-codex/35 bg-effect-codex/10',
    dotClassName: 'bg-effect-codex',
  },
  {
    label: 'permit',
    className: 'right-[13%] top-[18%] border-effect-claude/35 bg-effect-claude/10',
    dotClassName: 'bg-effect-claude',
  },
  {
    label: 'access',
    className: 'left-[18%] bottom-[18%] border-effect-openclaw/35 bg-effect-openclaw/10',
    dotClassName: 'bg-effect-openclaw',
  },
  {
    label: 'finance',
    className: 'right-[12%] bottom-[19%] border-effect-rlm/35 bg-effect-rlm/10',
    dotClassName: 'bg-effect-rlm',
  },
];

const researchSteps = ['research', 'verify', 'route'];

export function FrontierKnotVisual() {
  return (
    <div className="relative min-h-[32rem] overflow-hidden bg-neutral-950 p-6 text-white sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-effect-claude),var(--color-effect-codex),var(--color-effect-rag),var(--color-effect-openclaw))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_78%_82%,rgba(0,132,94,0.20),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-45" />

      <div className="relative flex min-h-[28rem] flex-col justify-between">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="max-w-sm text-4xl font-semibold leading-[0.95] tracking-[-0.045em] md:text-6xl">
              The knot beneath the work
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/50">
              Physical operations rarely fail in one system. They stall between people, records,
              approvals, and site constraints.
            </p>
          </div>
          <p className="shrink-0 font-mono text-sm text-white/35">002</p>
        </div>

        <div className="relative mt-8 flex-1 rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30">
          <div className="absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-neutral-950/70 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/40 backdrop-blur">
            unresolved dependencies
          </div>

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 640 480"
            role="img"
            aria-label="A tangled set of operational dependencies being researched and untangled by Orin."
          >
            <defs>
              <filter id="frontier-knot-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="frontier-knot-resolution" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.26)" />
                <stop offset="52%" stopColor="var(--color-effect-rag)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.78)" />
              </linearGradient>
            </defs>

            <path
              d="M54 430 L590 430"
              stroke="rgba(255,255,255,0.10)"
              strokeDasharray="4 12"
              strokeLinecap="round"
            />
            <path
              d="M76 52 L76 428"
              stroke="rgba(255,255,255,0.10)"
              strokeDasharray="4 12"
              strokeLinecap="round"
            />

            {knotThreads.map((thread) => (
              <g key={thread.id}>
                <path
                  d={thread.path}
                  fill="none"
                  stroke="rgba(255,255,255,0.11)"
                  strokeLinecap="round"
                  strokeWidth="18"
                />
                <path
                  d={thread.path}
                  fill="none"
                  stroke={thread.stroke}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  opacity="0.82"
                  filter="url(#frontier-knot-glow)"
                />
              </g>
            ))}

            <circle cx="333" cy="244" r="94" fill="rgba(255,255,255,0.035)" />
            <circle
              cx="333"
              cy="244"
              r="64"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeDasharray="2 9"
            />
            <path
              d="M305 250 C338 220 366 222 392 248 C424 280 468 281 525 244 C554 225 579 210 608 204"
              fill="none"
              stroke="url(#frontier-knot-resolution)"
              strokeLinecap="round"
              strokeWidth="5"
            />
            <path
              d="M508 218 L610 202 L535 273"
              fill="none"
              stroke="rgba(255,255,255,0.72)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>

          {knotNodes.map((node) => (
            <div
              key={node.label}
              className={
                'absolute z-10 flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium text-white/75 backdrop-blur-md ' +
                node.className
              }
            >
              <span className={'h-2 w-2 rounded-full ' + node.dotClassName} />
              {node.label}
            </div>
          ))}

          <div className="absolute left-1/2 top-1/2 z-20 w-[13rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.25rem] border border-white/15 bg-neutral-950/85 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold tracking-[-0.02em]">Orin research loop</p>
              <span className="h-2.5 w-2.5 rounded-full bg-effect-rag shadow-[0_0_18px_var(--color-effect-rag)]" />
            </div>
            <div className="space-y-2">
              {researchSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"
                >
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/45">
                    {step}
                  </span>
                  <span className="font-mono text-[0.65rem] text-white/35">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-5 right-5 z-10 max-w-[12rem] rounded-[1rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-md">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/35">
              stale records
            </p>
            <div className="mt-3 space-y-2">
              <div className="h-1.5 w-full rounded-full bg-white/10" />
              <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
              <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
