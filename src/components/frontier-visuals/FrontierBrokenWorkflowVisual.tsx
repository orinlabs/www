const expectedSteps = ['Request', 'Approval', 'Vendor', 'Done'];

const exceptions = [
  {
    label: 'No reply',
    detail: 'Vendor silent after 18h',
    className: 'border-effect-claude/35 bg-effect-claude/10 text-effect-claude',
    position: 'left-[7%] top-[45%]',
  },
  {
    label: 'Wrong record',
    detail: 'Install note saved to stale site',
    className: 'border-effect-codex/35 bg-effect-codex/10 text-effect-codex',
    position: 'left-[34%] top-[37%]',
  },
  {
    label: 'Access issue',
    detail: 'Gate code missing for crew',
    className: 'border-effect-rlm/35 bg-effect-rlm/10 text-effect-rlm',
    position: 'left-[62%] top-[42%]',
  },
  {
    label: 'PO mismatch',
    detail: 'Quote and purchase order diverge',
    className: 'border-effect-openclaw/35 bg-effect-openclaw/10 text-effect-openclaw',
    position: 'left-[21%] top-[64%]',
  },
  {
    label: 'City pending',
    detail: 'Permit desk awaiting response',
    className: 'border-effect-rag/35 bg-effect-rag/10 text-effect-rag',
    position: 'left-[54%] top-[67%]',
  },
];

const routedActions = [
  ['triage', 'Owner, system, and timestamp identified'],
  ['repair', 'Record and PO reconciled before action'],
  ['advance', 'Human approval requested only when needed'],
];

export function FrontierBrokenWorkflowVisual() {
  return (
    <div
      aria-label="Broken physical operations workflow routed by Orin"
      className="relative min-h-[32rem] overflow-hidden bg-neutral-950 p-6 text-white sm:p-8"
      role="img"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-effect-claude),var(--color-effect-codex),var(--color-effect-rag),var(--color-effect-openclaw))]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_14%,rgba(0,132,94,0.18),transparent_30%),radial-gradient(circle_at_16%_76%,rgba(29,78,216,0.12),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <linearGradient id="frontier-broken-clean-line" x1="9" x2="92" y1="18" y2="18">
            <stop stopColor="rgba(255,255,255,0.78)" />
            <stop offset="0.52" stopColor="rgba(255,255,255,0.52)" />
            <stop offset="1" stopColor="rgba(255,255,255,0.16)" />
          </linearGradient>
          <linearGradient id="frontier-broken-orin-line" x1="20" x2="78" y1="78" y2="78">
            <stop stopColor="var(--color-effect-codex)" stopOpacity="0.12" />
            <stop offset="0.46" stopColor="var(--color-effect-rag)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--color-effect-openclaw)" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <path
          d="M 10 19 L 79 19"
          fill="none"
          stroke="url(#frontier-broken-clean-line)"
          strokeLinecap="round"
          strokeWidth="0.38"
        />
        <path
          d="M 78 19 L 84 16 M 78 19 L 84 22"
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeLinecap="round"
          strokeWidth="0.38"
        />

        <path
          d="M 36 19 C 35 30 22 28 19 42"
          fill="none"
          stroke="var(--color-effect-claude)"
          strokeDasharray="1 1.5"
          strokeOpacity="0.52"
          strokeWidth="0.28"
        />
        <path
          d="M 47 19 C 46 28 45 30 45 36"
          fill="none"
          stroke="var(--color-effect-codex)"
          strokeDasharray="1 1.5"
          strokeOpacity="0.52"
          strokeWidth="0.28"
        />
        <path
          d="M 58 19 C 66 28 72 28 73 40"
          fill="none"
          stroke="var(--color-effect-rlm)"
          strokeDasharray="1 1.5"
          strokeOpacity="0.52"
          strokeWidth="0.28"
        />
        <path
          d="M 50 19 C 38 39 36 50 34 61"
          fill="none"
          stroke="var(--color-effect-openclaw)"
          strokeDasharray="1 1.5"
          strokeOpacity="0.5"
          strokeWidth="0.28"
        />
        <path
          d="M 63 19 C 62 42 64 52 66 64"
          fill="none"
          stroke="var(--color-effect-rag)"
          strokeDasharray="1 1.5"
          strokeOpacity="0.52"
          strokeWidth="0.28"
        />

        <path
          d="M 18 52 C 24 69 37 75 50 79 M 45 47 C 45 62 47 72 50 79 M 73 52 C 68 67 58 75 50 79 M 34 73 C 39 78 44 80 50 79 M 66 76 C 61 80 55 81 50 79"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeLinecap="round"
          strokeWidth="0.3"
        />
        <path
          d="M 20 84 C 32 78 42 78 50 79 C 59 80 68 78 80 84"
          fill="none"
          stroke="url(#frontier-broken-orin-line)"
          strokeLinecap="round"
          strokeWidth="0.55"
        />
      </svg>

      <div className="relative z-10 flex min-h-[28rem] flex-col">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="max-w-sm text-4xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-5xl">
              Broken workflow
            </h3>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/48">
              Linear software assumes the handoff is clean. Physical operations split into exceptions before the work is done.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-white/38">
            OPS-174
          </div>
        </div>

        <div className="relative mt-8 h-[21rem] flex-1">
          <div className="grid grid-cols-4 gap-2">
            {expectedSteps.map((step, index) => (
              <div
                key={step}
                className={
                  'relative rounded-full border px-3 py-2 text-center text-xs font-medium transition-colors ' +
                  (index < 2
                    ? 'border-white/20 bg-white/[0.07] text-white'
                    : 'border-white/10 bg-white/[0.025] text-white/42')
                }
              >
                <span className="font-mono text-[0.62rem] text-white/32">0{index + 1}</span>
                <span className="ml-2">{step}</span>
              </div>
            ))}
          </div>

          <div className="absolute left-[39%] top-[18%] flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/80 px-3 py-1.5 shadow-2xl shadow-black/30 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-effect-openclaw" />
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/42">
              fracture point
            </span>
          </div>

          {exceptions.map((exception) => (
            <div
              key={exception.label}
              className={
                'absolute w-[9.4rem] rounded-2xl border p-3 shadow-2xl shadow-black/20 backdrop-blur ' +
                exception.className +
                ' ' +
                exception.position
              }
            >
              <div className="flex items-center justify-between gap-3">
                <span className="h-2 w-2 rounded-full bg-current" />
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/36">
                  exception
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold tracking-[-0.02em] text-white">
                {exception.label}
              </p>
              <p className="mt-1 text-xs leading-4 text-white/46">{exception.detail}</p>
            </div>
          ))}

          <div className="absolute bottom-0 left-1/2 w-[82%] -translate-x-1/2 rounded-[1.4rem] border border-effect-rag/25 bg-neutral-950/88 p-4 shadow-2xl shadow-effect-rag/10 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-effect-rag text-sm font-semibold text-white shadow-lg shadow-effect-rag/20">
                  O
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[-0.02em]">Orin routing</p>
                  <p className="text-xs text-white/42">Turns fractured state into accountable next steps.</p>
                </div>
              </div>
              <div className="hidden rounded-full border border-white/10 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/38 sm:block">
                controlled recovery
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {routedActions.map(([action, detail]) => (
                <div key={action} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-effect-rag">
                    {action}
                  </p>
                  <p className="mt-1.5 text-xs leading-4 text-white/55">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
