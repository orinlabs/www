export function StrictStateProblemDiagram() {
  return (
    <div
      role="img"
      aria-label="Scattered project state fragments converge into one current state object and one outgoing action."
      className="relative min-h-[32rem] overflow-hidden bg-white"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 760 520"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="strict-state-flow-a" x1="90" y1="120" x2="500" y2="245">
            <stop stopColor="#d4d4d4" stopOpacity="0.12" />
            <stop offset="0.58" stopColor="var(--color-effect-rag)" stopOpacity="0.46" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.78" />
          </linearGradient>
          <linearGradient id="strict-state-flow-b" x1="110" y1="406" x2="502" y2="264">
            <stop stopColor="#d4d4d4" stopOpacity="0.1" />
            <stop offset="0.52" stopColor="var(--color-effect-codex)" stopOpacity="0.4" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="strict-state-flow-c" x1="84" y1="260" x2="502" y2="260">
            <stop stopColor="#d4d4d4" stopOpacity="0.1" />
            <stop offset="0.54" stopColor="var(--color-effect-openclaw)" stopOpacity="0.38" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.74" />
          </linearGradient>
          <linearGradient id="strict-state-action" x1="618" y1="260" x2="708" y2="260">
            <stop stopColor="#171717" stopOpacity="0.88" />
            <stop offset="1" stopColor="var(--color-effect-rag)" stopOpacity="0.72" />
          </linearGradient>
          <filter id="strict-state-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="24" stdDeviation="24" floodColor="#171717" floodOpacity="0.08" />
          </filter>
          <filter id="strict-state-fragment-shadow" x="-35%" y="-35%" width="170%" height="180%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#171717" floodOpacity="0.07" />
          </filter>
          <marker
            id="strict-state-arrow"
            markerHeight="10"
            markerWidth="10"
            orient="auto"
            refX="8"
            refY="5"
          >
            <path d="M0 0L10 5L0 10Z" fill="var(--color-effect-rag)" fillOpacity="0.78" />
          </marker>
        </defs>

        <rect x="1" y="1" width="758" height="518" rx="34" stroke="#eeeeee" />

        <g opacity="0.34">
          <path d="M64 130H696" stroke="#e5e5e5" strokeDasharray="2 14" strokeLinecap="round" />
          <path d="M64 260H696" stroke="#e5e5e5" strokeDasharray="2 14" strokeLinecap="round" />
          <path d="M64 390H696" stroke="#e5e5e5" strokeDasharray="2 14" strokeLinecap="round" />
          <path d="M176 62V458" stroke="#eeeeee" strokeDasharray="2 18" strokeLinecap="round" />
          <path d="M380 62V458" stroke="#eeeeee" strokeDasharray="2 18" strokeLinecap="round" />
          <path d="M584 62V458" stroke="#eeeeee" strokeDasharray="2 18" strokeLinecap="round" />
        </g>

        <g filter="url(#strict-state-fragment-shadow)">
          <rect x="78" y="92" width="104" height="76" rx="18" fill="white" stroke="#d4d4d4" />
          <path d="M104 120H148" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M104 140H132" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="156" cy="140" r="5" fill="var(--color-effect-rag)" fillOpacity="0.72" />

          <rect x="218" y="58" width="88" height="88" rx="24" fill="white" stroke="#d4d4d4" />
          <path d="M242 94H282" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M242 112H268" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="282" cy="112" r="4" fill="var(--color-effect-codex)" fillOpacity="0.72" />

          <rect x="70" y="232" width="118" height="88" rx="22" fill="white" stroke="#d4d4d4" />
          <circle cx="104" cy="260" r="10" fill="white" stroke="#a3a3a3" />
          <path d="M128 258H160" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M104 290H152" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="160" cy="290" r="4" fill="var(--color-effect-openclaw)" fillOpacity="0.72" />

          <rect x="218" y="218" width="98" height="104" rx="22" fill="white" stroke="#d4d4d4" />
          <path d="M246 248L282 248" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M246 270L294 270" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M246 292L272 292" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="292" cy="292" r="5" fill="var(--color-effect-claude)" fillOpacity="0.64" />

          <rect x="102" y="370" width="116" height="70" rx="20" fill="white" stroke="#d4d4d4" />
          <path d="M130 396H176" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M130 416H158" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="182" cy="416" r="4" fill="var(--color-effect-rlm)" fillOpacity="0.68" />

          <circle cx="304" cy="402" r="36" fill="white" stroke="#d4d4d4" />
          <path d="M288 392C298 382 312 382 322 392" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M286 410C300 422 316 422 330 410" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="304" cy="402" r="5" fill="var(--color-effect-rag)" fillOpacity="0.62" />
        </g>

        <g opacity="0.95">
          <path d="M182 130C272 130 338 174 398 232" stroke="url(#strict-state-flow-a)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M306 102C356 128 374 174 408 226" stroke="url(#strict-state-flow-a)" strokeWidth="2" strokeLinecap="round" />
          <path d="M188 276C276 274 344 264 398 258" stroke="url(#strict-state-flow-c)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M316 270C350 270 378 266 404 262" stroke="url(#strict-state-flow-c)" strokeWidth="2" strokeLinecap="round" />
          <path d="M218 406C304 386 358 326 404 286" stroke="url(#strict-state-flow-b)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M340 402C378 372 394 324 424 294" stroke="url(#strict-state-flow-b)" strokeWidth="2" strokeLinecap="round" />
        </g>

        <g filter="url(#strict-state-shadow)">
          <rect x="408" y="166" width="208" height="188" rx="30" fill="white" stroke="#171717" strokeWidth="1.4" />
          <rect x="428" y="188" width="168" height="144" rx="20" fill="white" stroke="#e5e5e5" />

          <g opacity="0.94">
            <circle cx="452" cy="214" r="5" fill="#171717" />
            <path d="M472 214H560" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
            <path d="M472 236H544" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" />
            <path d="M472 258H574" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" />
            <path d="M472 280H532" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" />
            <path d="M472 302H562" stroke="#d4d4d4" strokeWidth="2" strokeLinecap="round" />
          </g>

          <g>
            <circle cx="452" cy="236" r="4" fill="var(--color-effect-rag)" fillOpacity="0.75" />
            <circle cx="452" cy="258" r="4" fill="var(--color-effect-codex)" fillOpacity="0.7" />
            <circle cx="452" cy="280" r="4" fill="var(--color-effect-openclaw)" fillOpacity="0.68" />
            <circle cx="452" cy="302" r="4" fill="var(--color-effect-claude)" fillOpacity="0.62" />
          </g>

          <path d="M578 204L590 216L578 228" stroke="#171717" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.76" />
          <circle cx="574" cy="292" r="12" fill="white" stroke="#171717" strokeWidth="1.2" />
          <path d="M568 292L572 296L581 286" stroke="#171717" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g>
          <circle cx="408" cy="232" r="4.5" fill="#171717" />
          <circle cx="408" cy="258" r="4.5" fill="#171717" />
          <circle cx="424" cy="294" r="4.5" fill="#171717" />
        </g>

        <path
          d="M616 260C650 260 674 260 708 260"
          stroke="url(#strict-state-action)"
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#strict-state-arrow)"
        />
        <circle cx="636" cy="260" r="5" fill="#171717" />
        <circle cx="666" cy="260" r="4" fill="var(--color-effect-rag)" fillOpacity="0.7" />
      </svg>
    </div>
  );
}
