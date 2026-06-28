export function StrictFollowThroughDiagram() {
  return (
    <div className="relative min-h-[32rem] overflow-hidden bg-white" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 760 520"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="strict-follow-through-loop" x1="184" x2="582" y1="116" y2="404">
            <stop stopColor="#171717" stopOpacity="0.9" />
            <stop offset="0.34" stopColor="var(--color-effect-codex)" stopOpacity="0.62" />
            <stop offset="0.66" stopColor="var(--color-effect-rag)" stopOpacity="0.68" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id="strict-follow-through-closure" x1="326" x2="434" y1="206" y2="314">
            <stop stopColor="var(--color-effect-rag)" stopOpacity="0.95" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.92" />
          </linearGradient>
          <filter
            id="strict-follow-through-shadow"
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
          >
            <feDropShadow dx="0" dy="20" stdDeviation="20" floodColor="#171717" floodOpacity="0.1" />
          </filter>
          <filter
            id="strict-follow-through-pin-shadow"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
          >
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#171717" floodOpacity="0.12" />
          </filter>
          <marker
            id="strict-follow-through-arrow"
            markerHeight="11"
            markerWidth="11"
            orient="auto"
            refX="9"
            refY="5.5"
          >
            <path d="M1 1L10 5.5L1 10Z" fill="#171717" />
          </marker>
        </defs>

        <rect x="1" y="1" width="758" height="518" rx="34" fill="white" stroke="#e5e5e5" />

        <g opacity="0.48">
          <path d="M104 116H656" stroke="#f5f5f5" />
          <path d="M104 188H656" stroke="#f5f5f5" />
          <path d="M104 260H656" stroke="#f5f5f5" />
          <path d="M104 332H656" stroke="#f5f5f5" />
          <path d="M104 404H656" stroke="#f5f5f5" />
          <path d="M164 72V448" stroke="#f5f5f5" />
          <path d="M272 72V448" stroke="#f5f5f5" />
          <path d="M380 72V448" stroke="#f5f5f5" />
          <path d="M488 72V448" stroke="#f5f5f5" />
          <path d="M596 72V448" stroke="#f5f5f5" />
        </g>

        <g opacity="0.34">
          <circle cx="380" cy="260" r="174" stroke="#171717" strokeDasharray="1 14" />
          <circle cx="380" cy="260" r="118" stroke="#171717" strokeDasharray="1 12" />
        </g>

        <g filter="url(#strict-follow-through-shadow)">
          <path
            d="M380 86C476.1 86 554 163.9 554 260C554 356.1 476.1 434 380 434C283.9 434 206 356.1 206 260C206 163.9 283.9 86 380 86Z"
            stroke="#efefef"
            strokeWidth="24"
          />
          <path
            d="M380 86C476.1 86 554 163.9 554 260C554 356.1 476.1 434 380 434C283.9 434 206 356.1 206 260C206 163.9 283.9 86 380 86Z"
            stroke="url(#strict-follow-through-loop)"
            strokeLinecap="round"
            strokeWidth="7"
            strokeDasharray="292 28"
            markerEnd="url(#strict-follow-through-arrow)"
          />
        </g>

        <g stroke="#171717" strokeLinecap="round" strokeWidth="2.25">
          <path d="M245 125L272 152" opacity="0.22" />
          <path d="M260 110L287 137" opacity="0.42" />
          <path d="M275 95L302 122" opacity="0.22" />

          <path d="M582 192L544 202" opacity="0.22" />
          <path d="M590 216L552 226" opacity="0.42" />
          <path d="M598 240L560 250" opacity="0.22" />

          <path d="M502 414L476 381" opacity="0.22" />
          <path d="M480 429L454 396" opacity="0.42" />
          <path d="M458 444L432 411" opacity="0.22" />

          <path d="M166 294L205 286" opacity="0.22" />
          <path d="M160 268L199 260" opacity="0.42" />
          <path d="M154 242L193 234" opacity="0.22" />
        </g>

        <g filter="url(#strict-follow-through-pin-shadow)">
          <circle cx="380" cy="86" r="17" fill="white" stroke="#171717" strokeWidth="1.5" />
          <circle cx="380" cy="86" r="5.5" fill="#171717" />

          <circle cx="554" cy="260" r="17" fill="white" stroke="#171717" strokeWidth="1.5" />
          <circle cx="554" cy="260" r="5.5" fill="var(--color-effect-codex)" />

          <circle cx="380" cy="434" r="17" fill="white" stroke="#171717" strokeWidth="1.5" />
          <circle cx="380" cy="434" r="5.5" fill="var(--color-effect-rag)" />

          <circle cx="206" cy="260" r="17" fill="white" stroke="#171717" strokeWidth="1.5" />
          <circle cx="206" cy="260" r="5.5" fill="var(--color-effect-openclaw)" />
        </g>

        <g filter="url(#strict-follow-through-shadow)">
          <circle cx="380" cy="260" r="78" fill="white" stroke="#171717" strokeWidth="1.5" />
          <circle cx="380" cy="260" r="49" stroke="#d4d4d4" strokeDasharray="5 8" />
          <circle cx="380" cy="260" r="30" fill="url(#strict-follow-through-closure)" />
          <path
            d="M366.5 260.8L376.4 270.6L395.8 249.4"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4.5"
          />
        </g>

        <g opacity="0.72">
          <path
            d="M282 196C310 168 348 153 388 154"
            stroke="var(--color-effect-codex)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
          <path
            d="M478 323C450 351 412 366 372 366"
            stroke="var(--color-effect-rag)"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
        </g>
      </svg>
    </div>
  );
}
