const interruptionFragments = [
  { d: 'M332 226 C362 194 392 204 410 240', opacity: 0.32 },
  { d: 'M348 306 C376 346 426 336 446 292', opacity: 0.26 },
  { d: 'M414 184 C450 148 506 160 518 212', opacity: 0.2 },
  { d: 'M462 358 C498 400 558 374 566 318', opacity: 0.22 },
  { d: 'M508 244 C548 222 584 250 596 292', opacity: 0.28 },
] as const;

const interruptionNodes = [
  { id: 'interruption-a', cx: 342, cy: 252, r: 7, delay: 0 },
  { id: 'interruption-b', cx: 382, cy: 320, r: 5, delay: 1 },
  { id: 'interruption-c', cx: 430, cy: 206, r: 6, delay: 2 },
  { id: 'interruption-d', cx: 486, cy: 286, r: 8, delay: 3 },
  { id: 'interruption-e', cx: 534, cy: 352, r: 5, delay: 4 },
  { id: 'interruption-f', cx: 576, cy: 236, r: 6, delay: 5 },
] as const;

const driftMarks = [
  { id: 'drift-a', d: 'M356 168 L386 198' },
  { id: 'drift-b', d: 'M396 374 L432 338' },
  { id: 'drift-c', d: 'M494 168 L536 210' },
  { id: 'drift-d', d: 'M540 394 L586 348' },
] as const;

export function StrictRealityGapDiagram() {
  return (
    <div className="relative flex min-h-[32rem] w-full items-center justify-center overflow-hidden bg-white p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <svg
        className="relative h-full min-h-[28rem] w-full max-w-[58rem]"
        viewBox="0 0 900 560"
        fill="none"
        role="img"
        aria-label="A clean operational path enters a broken stateful gap and resolves into stable execution."
      >
        <defs>
          <linearGradient id="strict-gap-clean" x1="90" x2="302" y1="280" y2="280">
            <stop stopColor="#111827" stopOpacity="0.28" />
            <stop offset="1" stopColor="#111827" stopOpacity="0.68" />
          </linearGradient>
          <linearGradient id="strict-gap-bridge" x1="302" x2="662" y1="280" y2="280">
            <stop stopColor="#94A3B8" stopOpacity="0.38" />
            <stop offset="0.5" stopColor="#2563EB" stopOpacity="0.74" />
            <stop offset="1" stopColor="#0F766E" stopOpacity="0.84" />
          </linearGradient>
          <linearGradient id="strict-gap-stable" x1="636" x2="808" y1="280" y2="280">
            <stop stopColor="#0F766E" stopOpacity="0.78" />
            <stop offset="1" stopColor="#111827" stopOpacity="0.72" />
          </linearGradient>
          <filter id="strict-gap-soft-shadow" x="-20%" y="-40%" width="140%" height="180%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#0F172A" floodOpacity="0.12" />
          </filter>
          <filter id="strict-gap-line-glow" x="-12%" y="-35%" width="124%" height="170%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="1" y="1" width="898" height="558" rx="36" stroke="#E5E7EB" strokeWidth="1" />
        <path d="M90 392 H808" stroke="#E2E8F0" strokeLinecap="round" strokeWidth="1" strokeDasharray="2 14" />
        <path d="M296 126 V434 M604 126 V434" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="1" strokeDasharray="3 12" />

        <g opacity="0.9">
          <path
            d="M92 280 C148 280 206 280 292 280"
            stroke="#E2E8F0"
            strokeLinecap="round"
            strokeWidth="24"
          />
          <path
            d="M92 280 C148 280 206 280 292 280"
            stroke="url(#strict-gap-clean)"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <circle cx="116" cy="280" r="7" fill="#FFFFFF" stroke="#111827" strokeOpacity="0.44" strokeWidth="2" />
          <circle cx="190" cy="280" r="5" fill="#111827" fillOpacity="0.34" />
          <circle cx="264" cy="280" r="5" fill="#111827" fillOpacity="0.5" />
        </g>

        <g filter="url(#strict-gap-soft-shadow)">
          <path
            d="M302 280 C334 280 340 230 372 230 C414 230 396 336 444 336 C494 336 464 202 522 202 C566 202 568 280 604 280"
            stroke="#CBD5E1"
            strokeLinecap="round"
            strokeWidth="26"
            strokeDasharray="34 18"
            opacity="0.72"
          />
          <path
            d="M302 280 C334 280 340 230 372 230 C414 230 396 336 444 336 C494 336 464 202 522 202 C566 202 568 280 604 280"
            stroke="url(#strict-gap-bridge)"
            strokeLinecap="round"
            strokeWidth="6"
            strokeDasharray="42 16"
            filter="url(#strict-gap-line-glow)"
          />
        </g>

        <g>
          {interruptionFragments.map((fragment) => (
            <path
              key={fragment.d}
              d={fragment.d}
              stroke="#0F172A"
              strokeLinecap="round"
              strokeWidth="2"
              strokeDasharray="1 13"
              opacity={fragment.opacity}
            />
          ))}
          {driftMarks.map((mark) => (
            <path
              key={mark.id}
              d={mark.d}
              stroke="#94A3B8"
              strokeLinecap="round"
              strokeWidth="2"
              opacity="0.34"
            />
          ))}
          {interruptionNodes.map((node) => (
            <g key={node.id} opacity={0.92 - node.delay * 0.08}>
              <circle cx={node.cx} cy={node.cy} r={node.r + 9} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
              <circle cx={node.cx} cy={node.cy} r={node.r} fill="#FFFFFF" stroke="#2563EB" strokeOpacity="0.58" strokeWidth="2" />
              <circle cx={node.cx} cy={node.cy} r="2" fill="#0F172A" fillOpacity="0.42" />
            </g>
          ))}
        </g>

        <g opacity="0.78">
          <path d="M310 148 L310 412" stroke="#E2E8F0" strokeLinecap="round" strokeWidth="2" />
          <path d="M590 148 L590 412" stroke="#E2E8F0" strokeLinecap="round" strokeWidth="2" />
          <path d="M310 148 C392 104 508 104 590 148" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="2" />
          <path d="M310 412 C392 456 508 456 590 412" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="2" />
        </g>

        <g>
          <path
            d="M604 280 C646 280 670 280 808 280"
            stroke="#CCFBF1"
            strokeLinecap="round"
            strokeWidth="24"
            opacity="0.78"
          />
          <path
            d="M604 280 C646 280 670 280 808 280"
            stroke="url(#strict-gap-stable)"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            d="M636 246 C682 232 730 232 776 246 M636 314 C682 328 730 328 776 314"
            stroke="#0F766E"
            strokeLinecap="round"
            strokeWidth="2"
            opacity="0.36"
          />
          <circle cx="638" cy="280" r="6" fill="#0F766E" fillOpacity="0.72" />
          <circle cx="708" cy="280" r="5" fill="#0F766E" fillOpacity="0.78" />
          <circle cx="778" cy="280" r="7" fill="#FFFFFF" stroke="#0F766E" strokeOpacity="0.82" strokeWidth="2" />
          <path d="M796 264 L820 280 L796 296" stroke="#111827" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" opacity="0.68" />
        </g>
      </svg>
    </div>
  );
}
