const fragments = [
  {
    source: 'Slack',
    label: '#site-west',
    detail: 'Foreman flags blocked access at bay 4.',
    age: '14m ago',
    accent: 'bg-effect-rlm',
    className: 'left-[5%] top-[10%] w-[11.5rem]',
  },
  {
    source: 'Email',
    label: 'Owner update',
    detail: 'Approval moved to Monday review.',
    age: '2h old',
    accent: 'bg-effect-codex',
    className: 'left-[28%] top-[2%] w-[12rem]',
  },
  {
    source: 'PO',
    label: 'Steel package',
    detail: 'Release held pending revised quantity.',
    age: '1d old',
    accent: 'bg-effect-claude',
    className: 'left-[3%] top-[43%] w-[12.25rem]',
  },
  {
    source: 'Procore',
    label: 'RFI 184',
    detail: 'Answer accepted, drawing not distributed.',
    age: '38m ago',
    accent: 'bg-effect-rag',
    className: 'left-[24%] top-[34%] w-[12.75rem]',
  },
  {
    source: 'Schedule',
    label: 'Lookahead',
    detail: 'Crew sequence still assumes clear access.',
    age: '6h old',
    accent: 'bg-effect-openclaw',
    className: 'left-[10%] bottom-[3%] w-[12.5rem]',
  },
] as const;

const stateRows = [
  ['site_area', 'west elevation / bay 4'],
  ['constraint', 'access blocked by rework'],
  ['source_of_truth', 'RFI 184 + field note'],
  ['schedule_risk', '+2 days if unresolved'],
  ['owner', 'PM + superintendent'],
] as const;

export function FrontierStateProblemVisual() {
  return (
    <div
      role="img"
      aria-label="Scattered construction systems converging into one current state object and one outgoing action."
      className="relative min-h-[32rem] overflow-hidden bg-neutral-950 p-6 text-white shadow-[0_28px_90px_-48px_rgba(0,0,0,0.85)] sm:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-effect-claude),var(--color-effect-hermes),var(--color-effect-rag),var(--color-effect-openclaw))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_30%,rgba(0,160,113,0.18),transparent_30%),radial-gradient(circle_at_14%_78%,rgba(124,58,237,0.14),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-45" />

      <div className="relative z-10 flex min-h-[28rem] flex-col">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="max-w-sm text-4xl font-semibold leading-[0.96] tracking-[-0.045em] md:text-5xl">
              The state problem
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/48">
              Every system is partially true. Operations need one answer that is current enough to act on.
            </p>
          </div>
          <div className="shrink-0 border border-white/10 bg-white/[0.035] px-3 py-2 text-right font-mono text-[0.65rem] uppercase tracking-[0.18em] text-white/38">
            <p>Live state</p>
            <p className="mt-1 text-white/20">Confidence 94%</p>
          </div>
        </div>

        <div className="relative mt-7 min-h-[21.5rem] flex-1">
          <svg
            aria-hidden="true"
            viewBox="0 0 720 390"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="frontier-state-trace" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                <stop offset="62%" stopColor="rgba(0,160,113,0.58)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
              </linearGradient>
              <linearGradient id="frontier-action-trace" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="rgba(0,160,113,0.72)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
              </linearGradient>
            </defs>
            <path
              d="M112 62 C260 78 330 142 438 178"
              stroke="url(#frontier-state-trace)"
              strokeWidth="1.1"
              fill="none"
            />
            <path
              d="M272 38 C356 72 384 118 438 178"
              stroke="url(#frontier-state-trace)"
              strokeWidth="1.1"
              fill="none"
            />
            <path
              d="M112 194 C238 186 334 186 438 178"
              stroke="url(#frontier-state-trace)"
              strokeWidth="1.1"
              fill="none"
            />
            <path
              d="M286 176 C352 174 394 176 438 178"
              stroke="url(#frontier-state-trace)"
              strokeWidth="1.1"
              fill="none"
            />
            <path
              d="M154 336 C286 314 362 244 438 178"
              stroke="url(#frontier-state-trace)"
              strokeWidth="1.1"
              fill="none"
            />
            <path
              d="M560 211 C604 226 632 247 665 277"
              stroke="url(#frontier-action-trace)"
              strokeWidth="1.25"
              fill="none"
            />
          </svg>

          <div className="absolute left-[58%] top-[43%] h-3 w-3 rounded-full bg-primary-500 shadow-[0_0_0_8px_rgba(0,160,113,0.14),0_0_30px_rgba(0,160,113,0.45)]" />

          {fragments.map((fragment) => (
            <div
              key={fragment.source}
              className={
                'absolute rounded-[1rem] border border-white/10 bg-white/[0.055] p-3 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.85)] backdrop-blur-md ' +
                fragment.className
              }
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={'h-2 w-2 rounded-full ' + fragment.accent} />
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/42">
                    {fragment.source}
                  </p>
                </div>
                <p className="font-mono text-[0.62rem] text-white/26">{fragment.age}</p>
              </div>
              <p className="text-sm font-semibold leading-none text-white/82">{fragment.label}</p>
              <p className="mt-2 text-xs leading-5 text-white/42">{fragment.detail}</p>
            </div>
          ))}

          <div className="absolute right-[4%] top-[11%] w-[18.5rem] overflow-hidden rounded-[1.25rem] border border-white/15 bg-white/[0.09] shadow-[0_24px_64px_-36px_rgba(0,0,0,0.95)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/46">
                current_state
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary-200">
                  reconciled
                </span>
              </div>
            </div>

            <div className="space-y-2.5 p-4">
              {stateRows.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[6.75rem_1fr] gap-3">
                  <p className="font-mono text-[0.66rem] text-white/30">{key}</p>
                  <p className="text-xs font-semibold leading-5 text-white/82">{value}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 bg-neutral-950/35 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/34">
                  provenance
                </p>
                <div className="flex -space-x-1.5">
                  <span className="h-5 w-5 rounded-full border border-neutral-950 bg-effect-rag" />
                  <span className="h-5 w-5 rounded-full border border-neutral-950 bg-effect-rlm" />
                  <span className="h-5 w-5 rounded-full border border-neutral-950 bg-effect-codex" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[4%] right-[2%] w-[16rem] rounded-full border border-primary-300/30 bg-primary-500 px-4 py-3 text-neutral-950 shadow-[0_18px_58px_-26px_rgba(0,160,113,0.88)]">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
                &rarr;
              </span>
              <div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-neutral-950/54">
                  outgoing action
                </p>
                <p className="mt-0.5 text-sm font-semibold leading-5">
                  Update sequence, notify field lead, expedite release.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[18%] left-[45%] hidden -translate-x-1/2 rounded-full border border-white/10 bg-neutral-950/80 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/34 sm:block">
            scattered fragments converge
          </div>
        </div>
      </div>
    </div>
  );
}
