const realityEvents = [
  {
    label: 'Clean demo',
    detail: 'Known input',
    className: 'left-[6%] top-[63%]',
    tone: 'border-white/10 bg-white/[0.045] text-white/60',
  },
  {
    label: 'Stale state',
    detail: 'Record drift',
    className: 'left-[31%] top-[25%]',
    tone: 'border-effect-claude/30 bg-effect-claude/10 text-effect-claude',
  },
  {
    label: 'Human wait',
    detail: 'Approval hold',
    className: 'left-[46%] top-[66%]',
    tone: 'border-effect-codex/30 bg-effect-codex/10 text-effect-codex',
  },
  {
    label: 'Site variance',
    detail: 'Field mismatch',
    className: 'right-[17%] top-[31%]',
    tone: 'border-effect-openclaw/30 bg-effect-openclaw/10 text-effect-openclaw',
  },
] as const;

const routeMarkers = [
  { label: 'demo', className: 'left-[14%] top-[57%]', dotClassName: 'bg-white' },
  { label: 'observe', className: 'left-[33%] top-[45%]', dotClassName: 'bg-effect-claude' },
  { label: 'repair', className: 'left-[52%] top-[56%]', dotClassName: 'bg-effect-codex' },
  { label: 'stabilize', className: 'left-[72%] top-[41%]', dotClassName: 'bg-effect-rag' },
  { label: 'execute', className: 'left-[88%] top-[39%]', dotClassName: 'bg-effect-rag' },
] as const;

const bridgeMetrics = [
  { label: 'state memory', value: 'persistent' },
  { label: 'exception loop', value: 'closed' },
  { label: 'execution path', value: 'stable' },
] as const;

export function FrontierRealityGapVisual() {
  return (
    <div className="relative min-h-[32rem] overflow-hidden bg-neutral-950 p-6 text-white sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-effect-claude),var(--color-effect-codex),var(--color-effect-rag),var(--color-effect-openclaw))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_78%_34%,rgba(0,132,94,0.20),transparent_30%),radial-gradient(circle_at_52%_82%,rgba(29,78,216,0.14),transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-55" />

      <div className="relative flex min-h-[28rem] flex-col justify-between">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="max-w-sm text-4xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-6xl">
              Reality gap
            </h3>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/52">
              Generic demos assume a clean path. Physical operations require agents that preserve state,
              recover from interruption, and still complete the work.
            </p>
          </div>
          <p className="shrink-0 font-mono text-sm text-white/35">003</p>
        </div>

        <div className="relative mt-10 min-h-[20rem] rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30">
          <div className="absolute inset-4 rounded-[1.125rem] border border-white/[0.06]" />
          <div className="absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-neutral-950/75 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/42 backdrop-blur">
            demo to execution
          </div>

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 720 360"
            preserveAspectRatio="none"
            role="img"
            aria-label="A clean AI demo path becomes interrupted by real-world operational friction, then resolves into a stable execution path."
          >
            <defs>
              <linearGradient id="reality-gap-route" x1="74" x2="646" y1="212" y2="130">
                <stop stopColor="rgba(255,255,255,0.76)" />
                <stop offset="0.34" stopColor="var(--color-effect-claude)" />
                <stop offset="0.62" stopColor="var(--color-effect-codex)" />
                <stop offset="1" stopColor="var(--color-effect-rag)" />
              </linearGradient>
              <filter id="reality-gap-glow" x="-15%" y="-35%" width="130%" height="170%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d="M72 214 C128 214 166 214 220 214"
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeLinecap="round"
              strokeWidth="14"
            />
            <path
              d="M240 210 C270 146 315 150 332 202 C348 254 394 258 418 208 C450 142 496 144 522 184"
              fill="none"
              stroke="rgba(255,255,255,0.10)"
              strokeDasharray="2 18"
              strokeLinecap="round"
              strokeWidth="15"
            />
            <path
              d="M506 178 C548 132 594 130 650 130"
              fill="none"
              stroke="rgba(255,255,255,0.13)"
              strokeLinecap="round"
              strokeWidth="16"
            />
            <path
              d="M72 214 C128 214 166 214 220 214 C250 212 270 146 315 150 C350 154 339 254 394 258 C444 260 438 154 496 144 C542 136 582 130 650 130"
              fill="none"
              filter="url(#reality-gap-glow)"
              stroke="url(#reality-gap-route)"
              strokeLinecap="round"
              strokeWidth="4"
            />
            <path
              d="M612 106 L652 130 L608 153"
              fill="none"
              stroke="rgba(255,255,255,0.74)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M72 278 L650 278"
              stroke="rgba(255,255,255,0.10)"
              strokeDasharray="4 14"
              strokeLinecap="round"
            />
            <path
              d="M212 82 L212 278 M416 82 L416 278 M552 82 L552 278"
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 12"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute bottom-5 left-5 z-10 hidden w-[12.5rem] rounded-[1.125rem] border border-white/10 bg-neutral-950/75 p-4 backdrop-blur-md sm:block">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/36">
              Orin bridge
            </p>
            <div className="mt-3 space-y-2.5">
              {bridgeMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-white/48">{metric.label}</span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-effect-rag">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-5 right-5 z-10 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-xl shadow-black/30">
            Real execution
          </div>

          {realityEvents.map((event) => (
            <div
              key={event.label}
              className={
                'absolute z-10 w-36 rounded-2xl border px-3 py-2.5 shadow-lg shadow-black/20 backdrop-blur-md ' +
                event.className +
                ' ' +
                event.tone
              }
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-current">
                  signal
                </span>
              </div>
              <p className="text-sm font-semibold leading-4 text-white">{event.label}</p>
              <p className="mt-1 text-xs leading-4 text-white/45">{event.detail}</p>
            </div>
          ))}

          {routeMarkers.map((marker, index) => (
            <div
              key={marker.label}
              className={
                'absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/15 bg-neutral-950/85 py-1.5 pl-1.5 pr-3 shadow-lg shadow-black/25 backdrop-blur ' +
                marker.className
              }
            >
              <span
                className={
                  'flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] font-semibold text-neutral-950 ' +
                  marker.dotClassName
                }
              >
                {index + 1}
              </span>
              <span className="text-xs font-medium text-white/72">{marker.label}</span>
            </div>
          ))}

          <div className="absolute right-[11%] top-[17%] z-10 h-16 w-16 rounded-full border border-effect-rag/25 bg-effect-rag/10 shadow-[0_0_34px_var(--color-effect-rag)]" />
          <div className="absolute right-[13.1%] top-[21%] z-10 h-8 w-8 rounded-full bg-effect-rag/25" />
        </div>
      </div>
    </div>
  );
}
