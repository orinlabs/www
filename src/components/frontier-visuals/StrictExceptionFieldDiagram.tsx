export function StrictExceptionFieldDiagram() {
  return (
    <div
      role="img"
      aria-label="An abstract exception field with one resolved path moving through several obstacles."
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
          <linearGradient id="strict-exception-route" x1="104" x2="676" y1="414" y2="104">
            <stop stopColor="#171717" stopOpacity="0.28" />
            <stop offset="0.38" stopColor="var(--color-effect-rag)" stopOpacity="0.76" />
            <stop offset="0.68" stopColor="var(--color-effect-codex)" stopOpacity="0.72" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="strict-exception-halo" x1="116" x2="666" y1="400" y2="118">
            <stop stopColor="var(--color-effect-rag)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--color-effect-rag)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--color-effect-codex)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="strict-exception-node-fill" cx="50%" cy="45%" r="62%">
            <stop stopColor="#ffffff" />
            <stop offset="0.72" stopColor="#fafafa" />
            <stop offset="1" stopColor="#f5f5f5" />
          </radialGradient>
          <filter id="strict-exception-soft-shadow" x="-20%" y="-24%" width="140%" height="152%">
            <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor="#171717" floodOpacity="0.09" />
          </filter>
          <filter id="strict-exception-route-shadow" x="-16%" y="-28%" width="132%" height="156%">
            <feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#171717" floodOpacity="0.12" />
          </filter>
          <clipPath id="strict-exception-frame-clip">
            <rect x="1" y="1" width="758" height="518" rx="34" />
          </clipPath>
        </defs>

        <rect x="0" y="0" width="760" height="520" fill="#ffffff" />
        <rect x="1" y="1" width="758" height="518" rx="34" stroke="#e5e5e5" />

        <g clipPath="url(#strict-exception-frame-clip)">
          <g opacity="0.52">
            <path d="M58 128 H704" stroke="#eeeeee" strokeWidth="1" />
            <path d="M58 216 H704" stroke="#eeeeee" strokeWidth="1" />
            <path d="M58 304 H704" stroke="#eeeeee" strokeWidth="1" />
            <path d="M58 392 H704" stroke="#eeeeee" strokeWidth="1" />
            <path d="M128 58 V466" stroke="#eeeeee" strokeWidth="1" />
            <path d="M248 58 V466" stroke="#eeeeee" strokeWidth="1" />
            <path d="M368 58 V466" stroke="#eeeeee" strokeWidth="1" />
            <path d="M488 58 V466" stroke="#eeeeee" strokeWidth="1" />
            <path d="M608 58 V466" stroke="#eeeeee" strokeWidth="1" />
          </g>

          <g opacity="0.58">
            <path
              d="M92 118 C180 82 230 154 314 132 C414 106 474 80 562 118 C612 140 644 128 698 102"
              stroke="#d4d4d4"
              strokeDasharray="2 12"
              strokeLinecap="round"
            />
            <path
              d="M74 286 C164 238 238 296 318 250 C404 200 460 306 548 248 C608 208 642 240 696 218"
              stroke="#d4d4d4"
              strokeDasharray="2 12"
              strokeLinecap="round"
            />
            <path
              d="M86 434 C166 358 242 428 332 368 C424 306 466 404 556 344 C616 304 654 326 704 288"
              stroke="#d4d4d4"
              strokeDasharray="2 12"
              strokeLinecap="round"
            />
          </g>

          <g opacity="0.36">
            <path
              d="M192 128 C214 176 204 214 160 244"
              stroke="#a3a3a3"
              strokeLinecap="round"
              strokeWidth="1.2"
            />
            <path
              d="M322 94 C354 124 366 166 344 206"
              stroke="#a3a3a3"
              strokeLinecap="round"
              strokeWidth="1.2"
            />
            <path
              d="M506 152 C460 184 452 238 486 278"
              stroke="#a3a3a3"
              strokeLinecap="round"
              strokeWidth="1.2"
            />
            <path
              d="M240 340 C286 312 326 330 350 376"
              stroke="#a3a3a3"
              strokeLinecap="round"
              strokeWidth="1.2"
            />
            <path
              d="M578 334 C548 372 550 412 590 444"
              stroke="#a3a3a3"
              strokeLinecap="round"
              strokeWidth="1.2"
            />
          </g>

          <g filter="url(#strict-exception-soft-shadow)">
            <g transform="translate(148 188) rotate(-12)">
              <rect x="-56" y="-40" width="112" height="80" rx="24" fill="url(#strict-exception-node-fill)" />
              <rect x="-56" y="-40" width="112" height="80" rx="24" stroke="#d4d4d4" />
              <path d="M-24 -12 H22" stroke="#171717" strokeOpacity="0.78" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M-16 12 H30" stroke="#d4d4d4" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="-35" cy="-21" r="5" fill="var(--color-effect-claude)" fillOpacity="0.78" />
            </g>

            <g transform="translate(338 146) rotate(9)">
              <path
                d="M0 -58 C36 -58 62 -34 62 0 C62 34 36 58 0 58 C-36 58 -62 34 -62 0 C-62 -34 -36 -58 0 -58Z"
                fill="url(#strict-exception-node-fill)"
                stroke="#d4d4d4"
              />
              <path d="M-28 -10 C-12 -24 12 -24 28 -10" stroke="#171717" strokeOpacity="0.74" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M-28 10 C-12 24 12 24 28 10" stroke="#d4d4d4" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="36" cy="-34" r="5.5" fill="var(--color-effect-codex)" fillOpacity="0.74" />
            </g>

            <g transform="translate(550 202) rotate(-7)">
              <path
                d="M0 -62 L58 -16 L38 52 L-38 52 L-58 -16Z"
                fill="url(#strict-exception-node-fill)"
                stroke="#d4d4d4"
              />
              <path d="M-27 -8 H27" stroke="#171717" strokeOpacity="0.76" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M-22 12 H22" stroke="#d4d4d4" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M-17 32 H17" stroke="#d4d4d4" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="-40" cy="-28" r="5" fill="var(--color-effect-rlm)" fillOpacity="0.78" />
            </g>

            <g transform="translate(276 350) rotate(13)">
              <rect x="-62" y="-46" width="124" height="92" rx="18" fill="url(#strict-exception-node-fill)" />
              <rect x="-62" y="-46" width="124" height="92" rx="18" stroke="#d4d4d4" />
              <circle cx="-24" cy="0" r="18" stroke="#171717" strokeOpacity="0.72" strokeWidth="1.7" />
              <path d="M6 -16 H34" stroke="#d4d4d4" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M6 0 H42" stroke="#171717" strokeOpacity="0.74" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M6 16 H30" stroke="#d4d4d4" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="44" cy="-28" r="5.5" fill="var(--color-effect-openclaw)" fillOpacity="0.75" />
            </g>

            <g transform="translate(566 382) rotate(-10)">
              <path
                d="M-58 -40 H26 L58 -8 V40 H-58Z"
                fill="url(#strict-exception-node-fill)"
                stroke="#d4d4d4"
              />
              <path d="M26 -40 V-8 H58" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M-30 -12 L28 20" stroke="#171717" strokeOpacity="0.72" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M28 -12 L-30 20" stroke="#d4d4d4" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="-38" cy="-24" r="5" fill="var(--color-effect-rag)" fillOpacity="0.78" />
            </g>
          </g>

          <g opacity="0.32">
            <circle cx="148" cy="188" r="74" stroke="#171717" strokeDasharray="4 10" />
            <circle cx="338" cy="146" r="78" stroke="#171717" strokeDasharray="4 10" />
            <circle cx="550" cy="202" r="82" stroke="#171717" strokeDasharray="4 10" />
            <circle cx="276" cy="350" r="78" stroke="#171717" strokeDasharray="4 10" />
            <circle cx="566" cy="382" r="78" stroke="#171717" strokeDasharray="4 10" />
          </g>

          <path
            d="M96 412 C156 376 170 320 224 306 C286 290 306 250 352 226 C420 190 438 246 492 250 C552 254 574 162 664 108"
            stroke="url(#strict-exception-halo)"
            strokeLinecap="round"
            strokeWidth="34"
          />
          <path
            d="M96 412 C156 376 170 320 224 306 C286 290 306 250 352 226 C420 190 438 246 492 250 C552 254 574 162 664 108"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeWidth="14"
          />
          <path
            d="M96 412 C156 376 170 320 224 306 C286 290 306 250 352 226 C420 190 438 246 492 250 C552 254 574 162 664 108"
            filter="url(#strict-exception-route-shadow)"
            stroke="url(#strict-exception-route)"
            strokeLinecap="round"
            strokeWidth="4.5"
          />

          <g>
            <circle cx="96" cy="412" r="8" fill="#171717" />
            <circle cx="224" cy="306" r="6" fill="#ffffff" stroke="#171717" strokeWidth="2" />
            <circle cx="352" cy="226" r="6" fill="#ffffff" stroke="var(--color-effect-rag)" strokeWidth="2" />
            <circle cx="492" cy="250" r="6" fill="#ffffff" stroke="var(--color-effect-codex)" strokeWidth="2" />
            <circle cx="664" cy="108" r="8" fill="#171717" />
            <path d="M644 108 H684" stroke="#171717" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M664 88 V128" stroke="#171717" strokeWidth="2.2" strokeLinecap="round" />
          </g>

          <g opacity="0.5">
            <circle cx="88" cy="96" r="18" stroke="#d4d4d4" />
            <circle cx="684" cy="426" r="24" stroke="#d4d4d4" />
            <rect x="642" y="64" width="48" height="48" rx="14" stroke="#d4d4d4" />
            <rect x="78" y="392" width="36" height="36" rx="12" stroke="#d4d4d4" />
          </g>
        </g>
      </svg>
    </div>
  );
}
