const dependencyPaths = [
  'M91 168 C172 56 258 252 330 151 C396 59 482 119 546 196 C605 268 530 360 420 328 C329 302 330 194 430 214 C514 232 484 319 390 379 C288 444 176 382 159 290 C139 184 250 113 337 198',
  'M122 350 C190 434 320 398 340 293 C359 191 243 177 227 263 C212 349 337 394 440 337 C538 282 551 171 470 121 C376 63 271 124 274 225 C277 322 423 330 468 250 C518 160 425 102 350 160',
  'M77 260 C157 329 240 185 321 239 C402 294 332 421 219 364 C104 306 146 120 278 95 C400 71 518 163 510 290 C502 407 349 463 256 386 C173 317 227 216 329 223 C443 232 491 345 596 339',
  'M174 121 C252 55 369 83 402 180 C438 286 331 325 267 274 C199 220 237 117 337 121 C452 125 555 236 521 342 C486 451 315 452 256 352 C204 263 267 181 365 217 C454 250 438 354 349 386',
] as const;

const resolvedPaths = [
  'M420 260 C478 253 516 226 552 190 C586 156 626 139 686 139',
  'M417 285 C480 286 526 306 566 343 C601 377 638 394 704 391',
] as const;

const dependencyNodes = [
  [94, 166, 4.5],
  [122, 350, 5],
  [174, 121, 4.25],
  [77, 260, 3.75],
  [546, 196, 4.5],
  [596, 339, 5],
  [686, 139, 4.25],
  [704, 391, 4.25],
] as const;

const crossingGaps = [
  {
    id: 'northwest',
    edgeId: 'northwest-edge',
    maskPath: 'M 271 174 L 307 174',
    edgePath: 'M 278.56 174 L 299.44 174',
    transform: 'rotate(-23 289 174)',
  },
  {
    id: 'north',
    edgeId: 'north-edge',
    maskPath: 'M 320 215 L 352 215',
    edgePath: 'M 326.72 215 L 345.28 215',
    transform: 'rotate(18 336 215)',
  },
  {
    id: 'east',
    edgeId: 'east-edge',
    maskPath: 'M 366 250 L 406 250',
    edgePath: 'M 374.4 250 L 397.6 250',
    transform: 'rotate(-12 386 250)',
  },
  {
    id: 'south',
    edgeId: 'south-edge',
    maskPath: 'M 296 303 L 334 303',
    edgePath: 'M 303.98 303 L 326.02 303',
    transform: 'rotate(-15 315 303)',
  },
  {
    id: 'southeast',
    edgeId: 'southeast-edge',
    maskPath: 'M 433 313 L 465 313',
    edgePath: 'M 439.72 313 L 458.28 313',
    transform: 'rotate(22 449 313)',
  },
  {
    id: 'west',
    edgeId: 'west-edge',
    maskPath: 'M 235 262 L 269 262',
    edgePath: 'M 242.14 262 L 261.86 262',
    transform: 'rotate(28 252 262)',
  },
] as const;

export function StrictKnotDiagram() {
  return (
    <div className="relative min-h-[32rem] overflow-hidden bg-white" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 760 520"
      >
        <defs>
          <radialGradient id="strict-knot-center-haze" cx="0" cy="0" r="1" gradientTransform="matrix(0 154 -202 0 358 262)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f5f5f4" stopOpacity="0.92" />
            <stop offset="0.72" stopColor="#fafafa" stopOpacity="0.34" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="strict-knot-resolved" x1="410" x2="704" y1="272" y2="266" gradientUnits="userSpaceOnUse">
            <stop stopColor="#171717" stopOpacity="0.84" />
            <stop offset="0.48" stopColor="var(--color-effect-rag)" stopOpacity="0.88" />
            <stop offset="1" stopColor="#171717" stopOpacity="0.3" />
          </linearGradient>
          <filter id="strict-knot-lift" x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#171717" floodOpacity="0.075" />
          </filter>
        </defs>

        <rect x="1" y="1" width="758" height="518" rx="34" fill="#ffffff" stroke="#e7e5e4" />

        <g opacity="0.45">
          <path d="M74 102 H686" stroke="#e7e5e4" strokeWidth="1" />
          <path d="M74 180 H686" stroke="#f0efee" strokeWidth="1" />
          <path d="M74 258 H686" stroke="#e7e5e4" strokeWidth="1" />
          <path d="M74 336 H686" stroke="#f0efee" strokeWidth="1" />
          <path d="M74 414 H686" stroke="#e7e5e4" strokeWidth="1" />
          <path d="M152 64 V456" stroke="#f0efee" strokeWidth="1" />
          <path d="M304 64 V456" stroke="#e7e5e4" strokeWidth="1" />
          <path d="M456 64 V456" stroke="#e7e5e4" strokeWidth="1" />
          <path d="M608 64 V456" stroke="#f0efee" strokeWidth="1" />
        </g>

        <ellipse cx="346" cy="263" rx="240" ry="182" fill="url(#strict-knot-center-haze)" />

        <g filter="url(#strict-knot-lift)">
          {dependencyPaths.map((path) => (
            <path
              key={path}
              d={path}
              stroke="#171717"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.16"
              strokeWidth="15"
            />
          ))}

          {dependencyPaths.map((path) => (
            <path
              key={path}
              d={path}
              stroke="#171717"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.52"
              strokeWidth="2.2"
            />
          ))}
        </g>

        <g>
          {crossingGaps.map((gap) => (
            <path
              key={gap.id}
              d={gap.maskPath}
              stroke="#ffffff"
              strokeLinecap="round"
              strokeWidth="10"
              transform={gap.transform}
            />
          ))}

          {crossingGaps.map((gap) => (
            <path
              key={gap.edgeId}
              d={gap.edgePath}
              stroke="#d6d3d1"
              strokeLinecap="round"
              strokeOpacity="0.86"
              strokeWidth="1"
              transform={gap.transform}
            />
          ))}
        </g>

        <g opacity="0.9">
          <circle cx="356" cy="263" r="100" stroke="#d6d3d1" strokeDasharray="2 10" strokeLinecap="round" />
          <circle cx="356" cy="263" r="58" stroke="#e7e5e4" strokeWidth="1" />
          <circle cx="356" cy="263" r="8" fill="#171717" />
          <circle cx="356" cy="263" r="18" stroke="var(--color-effect-rag)" strokeOpacity="0.36" />
        </g>

        <g filter="url(#strict-knot-lift)">
          {resolvedPaths.map((path) => (
            <path
              key={path}
              d={path}
              stroke="url(#strict-knot-resolved)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3.5"
            />
          ))}
          <path
            d="M666 119 L707 138 L668 159"
            stroke="#171717"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.38"
            strokeWidth="2"
          />
          <path
            d="M682 373 L718 392 L679 410"
            stroke="#171717"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.38"
            strokeWidth="2"
          />
        </g>

        <g>
          {dependencyNodes.map(([cx, cy, r], index) => (
            <circle key={index} cx={cx} cy={cy} r={r} fill="#171717" fillOpacity="0.78" />
          ))}
          <circle cx="430" cy="260" r="5" fill="var(--color-effect-rag)" />
          <circle cx="430" cy="260" r="15" stroke="var(--color-effect-rag)" strokeOpacity="0.22" />
          <circle cx="430" cy="260" r="26" stroke="var(--color-effect-rag)" strokeOpacity="0.11" />
        </g>

        <g opacity="0.55">
          <path d="M112 454 H242" stroke="#171717" strokeDasharray="1 8" strokeLinecap="round" strokeOpacity="0.24" />
          <path d="M524 66 H654" stroke="#171717" strokeDasharray="1 8" strokeLinecap="round" strokeOpacity="0.24" />
          <circle cx="242" cy="454" r="3" fill="#171717" fillOpacity="0.3" />
          <circle cx="524" cy="66" r="3" fill="#171717" fillOpacity="0.3" />
        </g>
      </svg>
    </div>
  );
}
