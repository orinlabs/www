export function StrictBrokenWorkflowDiagram() {
  return (
    <div
      aria-label="Broken workflow diagram showing fractured exceptions routed back into execution."
      className="relative min-h-[32rem] overflow-hidden bg-white"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 760 520"
      >
        <defs>
          <linearGradient id="strict-broken-route" x1="122" x2="642" y1="144" y2="144">
            <stop stopColor="#171717" stopOpacity="0.72" />
            <stop offset="0.42" stopColor="#737373" stopOpacity="0.2" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.52" />
          </linearGradient>
          <linearGradient id="strict-broken-recovery" x1="206" x2="654" y1="396" y2="194">
            <stop stopColor="var(--color-effect-codex)" stopOpacity="0.1" />
            <stop offset="0.45" stopColor="var(--color-effect-rag)" stopOpacity="0.86" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.72" />
          </linearGradient>
          <linearGradient id="strict-broken-exception-a" x1="168" x2="376" y1="214" y2="342">
            <stop stopColor="#171717" stopOpacity="0.36" />
            <stop offset="1" stopColor="var(--color-effect-claude)" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="strict-broken-exception-b" x1="392" x2="608" y1="196" y2="336">
            <stop stopColor="#171717" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--color-effect-openclaw)" stopOpacity="0.52" />
          </linearGradient>
          <filter id="strict-broken-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" floodColor="#171717" floodOpacity="0.08" stdDeviation="20" />
          </filter>
          <filter id="strict-broken-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="5" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="1" y="1" width="758" height="518" rx="34" fill="white" stroke="#ededed" />

        <g opacity="0.5">
          <path d="M96 84 H664" stroke="#f0f0f0" />
          <path d="M96 436 H664" stroke="#f0f0f0" />
          <path d="M134 68 V452" stroke="#f5f5f5" />
          <path d="M626 68 V452" stroke="#f5f5f5" />
        </g>

        <g filter="url(#strict-broken-shadow)">
          <path
            d="M122 144 H265"
            stroke="url(#strict-broken-route)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M494 144 H638"
            stroke="url(#strict-broken-route)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d="M638 144 L620 132 M638 144 L620 156"
            stroke="#171717"
            strokeLinecap="round"
            strokeWidth="1.6"
          />

          <rect x="98" y="110" width="88" height="68" rx="18" fill="white" stroke="#171717" strokeOpacity="0.72" />
          <rect x="214" y="110" width="88" height="68" rx="18" fill="white" stroke="#171717" strokeOpacity="0.58" />
          <rect x="458" y="110" width="88" height="68" rx="18" fill="white" stroke="#171717" strokeOpacity="0.42" />
          <rect x="574" y="110" width="88" height="68" rx="18" fill="white" stroke="#171717" strokeOpacity="0.56" />
        </g>

        <g opacity="0.92">
          <path d="M327 111 L357 111 L346 134 L366 134 L326 179 L337 148 L315 148 Z" fill="white" />
          <path
            d="M327 111 L357 111 L346 134 L366 134 L326 179 L337 148 L315 148 Z"
            stroke="#171717"
            strokeLinejoin="round"
            strokeOpacity="0.46"
            strokeWidth="1.25"
          />
          <path d="M393 109 L441 124 L417 144 L445 166 L386 178 L404 145 Z" fill="white" />
          <path
            d="M393 109 L441 124 L417 144 L445 166 L386 178 L404 145 Z"
            stroke="#171717"
            strokeLinejoin="round"
            strokeOpacity="0.34"
            strokeWidth="1.25"
          />
          <path d="M356 158 L381 114 L392 154 L376 182 Z" fill="#fafafa" stroke="#d4d4d4" />
        </g>

        <g strokeLinecap="round">
          <path
            d="M330 158 C280 190 218 180 184 234"
            stroke="url(#strict-broken-exception-a)"
            strokeDasharray="3 8"
            strokeWidth="1.4"
          />
          <path
            d="M356 166 C344 218 286 250 292 312"
            stroke="#a3a3a3"
            strokeDasharray="3 8"
            strokeWidth="1.3"
          />
          <path
            d="M386 164 C414 210 476 192 510 244"
            stroke="url(#strict-broken-exception-b)"
            strokeDasharray="3 8"
            strokeWidth="1.4"
          />
          <path
            d="M412 154 C466 166 548 182 586 230"
            stroke="#a3a3a3"
            strokeDasharray="3 8"
            strokeWidth="1.3"
          />
        </g>

        <g filter="url(#strict-broken-shadow)">
          <rect x="138" y="224" width="92" height="66" rx="17" fill="white" stroke="#171717" strokeOpacity="0.32" />
          <rect x="250" y="300" width="88" height="62" rx="16" fill="white" stroke="#171717" strokeOpacity="0.26" />
          <rect x="476" y="232" width="92" height="66" rx="17" fill="white" stroke="#171717" strokeOpacity="0.3" />
          <rect x="548" y="304" width="84" height="60" rx="16" fill="white" stroke="#171717" strokeOpacity="0.24" />

          <path d="M160 242 H208 M160 257 H196 M160 272 H184" stroke="#d4d4d4" strokeLinecap="round" />
          <path d="M272 318 H318 M272 333 H306 M272 348 H292" stroke="#d4d4d4" strokeLinecap="round" />
          <path d="M498 250 H546 M498 265 H532 M498 280 H520" stroke="#d4d4d4" strokeLinecap="round" />
          <path d="M570 322 H612 M570 337 H604 M570 352 H590" stroke="#d4d4d4" strokeLinecap="round" />
        </g>

        <g opacity="0.9">
          <circle cx="184" cy="257" r="4.5" fill="var(--color-effect-claude)" />
          <circle cx="294" cy="331" r="4.5" fill="var(--color-effect-codex)" />
          <circle cx="522" cy="265" r="4.5" fill="var(--color-effect-openclaw)" />
          <circle cx="590" cy="334" r="4.5" fill="var(--color-effect-rag)" />
        </g>

        <g strokeLinecap="round">
          <path
            d="M184 290 C204 354 290 402 380 402"
            stroke="#d4d4d4"
            strokeOpacity="0.72"
            strokeWidth="1.2"
          />
          <path
            d="M294 362 C316 392 344 402 380 402"
            stroke="#d4d4d4"
            strokeOpacity="0.72"
            strokeWidth="1.2"
          />
          <path
            d="M522 298 C500 362 452 402 380 402"
            stroke="#d4d4d4"
            strokeOpacity="0.72"
            strokeWidth="1.2"
          />
          <path
            d="M590 364 C542 400 464 416 380 402"
            stroke="#d4d4d4"
            strokeOpacity="0.72"
            strokeWidth="1.2"
          />
        </g>

        <g filter="url(#strict-broken-soft-glow)">
          <circle cx="380" cy="402" r="54" fill="white" stroke="var(--color-effect-rag)" strokeOpacity="0.45" />
          <circle cx="380" cy="402" r="30" fill="white" stroke="#171717" strokeOpacity="0.7" />
          <circle cx="380" cy="402" r="8" fill="#171717" />
        </g>

        <path
          d="M410 390 C470 362 492 300 526 254 C558 212 598 198 642 198"
          filter="url(#strict-broken-soft-glow)"
          stroke="url(#strict-broken-recovery)"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          d="M642 198 L620 186 M642 198 L620 211"
          stroke="#171717"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.66"
          strokeWidth="1.8"
        />

        <g filter="url(#strict-broken-shadow)">
          <rect x="566" y="164" width="82" height="68" rx="18" fill="white" stroke="#171717" strokeOpacity="0.58" />
          <rect x="634" y="164" width="36" height="68" rx="18" fill="white" stroke="#171717" strokeOpacity="0.24" />
          <path d="M590 186 H624 M590 202 H612" stroke="#d4d4d4" strokeLinecap="round" />
        </g>

        <g opacity="0.36">
          <rect x="118" y="362" width="52" height="52" rx="14" stroke="#171717" />
          <circle cx="650" cy="372" r="30" stroke="#171717" />
          <path d="M94 310 H146 M614 78 H666" stroke="#171717" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
