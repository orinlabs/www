// Throwaway render target used to generate the Horizon social/unfurl image
// (public/horizon-og.png). Visit /og-horizon-capture and screenshot the
// #og-capture element at 1200x630 with deviceScaleFactor ~3.4 to produce the
// 4080x2142 asset. Not linked anywhere and not prerendered (see seo.ts ROUTES).

import {
  agentColor,
  displayAgentType,
  fmtCost,
  fmtPct,
  fmtTokens,
  RESULTS,
} from '../components/horizon';

const TOP_ROWS = 5;
const BG = '#f3f0e8';

const topResults = [...RESULTS]
  .sort((a, b) => b.completion - a.completion)
  .slice(0, TOP_ROWS);

export default function OgHorizonCapture() {
  return (
    <div style={{ background: BG }}>
      <div
        id="og-capture"
        style={{ width: 1200, height: 630, backgroundColor: BG }}
        className="relative overflow-hidden text-neutral-900 flex flex-col px-16 pt-12 pb-11"
      >
        {/* Subtle watercolor tree watermark, bleeding off the bottom-right and
            faded into the background toward the content. */}
        <img
          src="/tree_color.jpeg"
          alt=""
          aria-hidden
          className="pointer-events-none select-none absolute -bottom-6 -right-8 w-[560px]"
          style={{
            mixBlendMode: 'multiply',
            opacity: 0.5,
            WebkitMaskImage:
              'linear-gradient(to top left, black 22%, transparent 68%)',
            maskImage:
              'linear-gradient(to top left, black 22%, transparent 68%)',
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 text-[18px] text-neutral-500">
            <span className="font-semibold text-neutral-700">Orin Labs</span>
            <span className="text-neutral-300">|</span>
            <span>Horizon · 195 tasks</span>
          </div>

          <h1 className="mt-4 text-[46px] font-bold tracking-tight leading-none">
            Horizon, an agent learning benchmark
          </h1>
          <p className="mt-3 text-[21px] text-neutral-500">
            A benchmark measuring an agent's ability to learn from past
            experience.
          </p>

          <table className="mt-8 w-full border-collapse text-[22px]">
            <thead>
              <tr className="border-b-2 border-neutral-300/80 text-left">
                <th className="py-3 pr-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide whitespace-nowrap">
                  Agent
                </th>
                <th className="py-3 px-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide whitespace-nowrap">
                  Model
                </th>
                <th className="py-3 px-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide text-right whitespace-nowrap">
                  Completion
                </th>
                <th className="py-3 px-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide text-right whitespace-nowrap">
                  Cost / task
                </th>
                <th className="py-3 pl-4 font-semibold text-neutral-500 text-[17px] uppercase tracking-wide text-right whitespace-nowrap">
                  Tokens / task
                </th>
              </tr>
            </thead>
            <tbody>
              {topResults.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-300/50"
                >
                  <td className="py-3.5 pr-4 whitespace-nowrap">
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
                  <td className="py-3.5 px-4 font-semibold text-neutral-900 tabular-nums whitespace-nowrap">
                    {row.model}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-neutral-900 tabular-nums whitespace-nowrap">
                    {fmtPct(row.completion)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-neutral-700 tabular-nums whitespace-nowrap">
                    {row.costUsd != null ? fmtCost(row.costUsd) : '—'}
                  </td>
                  <td className="py-3.5 pl-4 text-right text-neutral-700 tabular-nums whitespace-nowrap">
                    {row.tokensLabel ??
                      (row.tokens != null ? fmtTokens(row.tokens) : '—')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-auto flex items-center justify-between text-[18px] text-neutral-400">
            <span className="font-medium text-neutral-500">
              orinlabs.ai/research/horizon
            </span>
            <span className="italic">Preview run, subject to change.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
