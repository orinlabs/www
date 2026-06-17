// Throwaway render target used to generate the Horizon social/unfurl image
// (public/horizon-og.png). Visit /og-horizon-capture and screenshot the
// #og-capture element at 1200x630 with deviceScaleFactor ~3.4 to produce the
// 4080x2142 asset. Not linked anywhere and not prerendered (see seo.ts ROUTES).

import {
  agentColor,
  type AgentType,
  displayAgentType,
  fmtPct,
  RESULTS,
  type ResultRow,
} from '../components/horizon';
import { Logo } from '../components/Logo';

// Matches the blog post page background (bg-neutral-50 in src/index.css).
const BG = '#fafafa';

// Mirror the blog post's first table (HorizonLeaderboard): keep only the
// strongest configuration per harness, then sort strongest-first.
const bestByHarness = new Map<AgentType, ResultRow>();
for (const r of RESULTS) {
  const cur = bestByHarness.get(r.agentType);
  if (cur == null || r.completion > cur.completion) {
    bestByHarness.set(r.agentType, r);
  }
}
const topResults = [...bestByHarness.values()].sort(
  (a, b) => b.completion - a.completion,
);

export default function OgHorizonCapture() {
  return (
    <div style={{ background: BG }}>
      <div
        id="og-capture"
        style={{ width: 1200, height: 630, backgroundColor: BG }}
        className="relative overflow-hidden text-neutral-900 flex flex-col justify-center px-16 py-12"
      >
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center gap-2.5 text-[18px] text-neutral-500">
            <Logo className="w-8 h-8 text-primary" />
            <span className="font-['Season'] text-[22px] font-medium text-neutral-700">
              Orin Labs
            </span>
          </div>

          <h1 className="mt-4 text-[46px] font-bold tracking-tight leading-none">
            Horizon, an agent learning benchmark
          </h1>
          <p className="mt-3 text-[21px] text-neutral-500">
            A benchmark measuring an agent's ability to learn from past
            experience.
          </p>

          <table className="mt-3 w-full border-collapse text-[21px]">
            <thead>
              <tr className="border-b-2 border-neutral-300/80 text-left">
                <th className="py-2.5 pr-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide whitespace-nowrap">
                  Harness
                </th>
                <th className="py-2.5 px-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide whitespace-nowrap">
                  Best Model
                </th>
                <th className="py-2.5 px-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide text-right whitespace-nowrap">
                  Completion
                </th>
                <th className="py-2.5 px-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide text-right whitespace-nowrap">
                  Easy
                </th>
                <th className="py-2.5 px-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide text-right whitespace-nowrap">
                  Medium
                </th>
                <th className="py-2.5 pl-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide text-right whitespace-nowrap">
                  Hard
                </th>
              </tr>
            </thead>
            <tbody>
              {topResults.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-300/50"
                >
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <span className="flex items-center gap-3">
                      <span
                        className="inline-block w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ background: agentColor(row.agentType, false) }}
                      />
                      <span className="font-semibold text-neutral-900">
                        {displayAgentType(row.agentType)}
                      </span>
                    </span>
                  </td>
                  <td className="py-2 px-4 font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                    {row.model}
                  </td>
                  <td className="py-2 px-4 text-right font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                    {fmtPct(row.completion)}
                  </td>
                  <td className="py-2 px-4 text-right text-neutral-700 tabular-nums whitespace-nowrap">
                    {fmtPct(row.difficulty.easy)}
                  </td>
                  <td className="py-2 px-4 text-right text-neutral-700 tabular-nums whitespace-nowrap">
                    {fmtPct(row.difficulty.medium)}
                  </td>
                  <td className="py-2 pl-4 text-right text-neutral-700 tabular-nums whitespace-nowrap">
                    {fmtPct(row.difficulty.hard)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 flex items-center text-[18px] text-neutral-400">
            <span className="font-medium text-neutral-500">
              orinlabs.ai/research/horizon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
