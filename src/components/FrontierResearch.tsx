import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FrontierResearch() {
  return (
    <section className="bg-white text-neutral-950">
      <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="relative min-h-[32rem] overflow-hidden bg-neutral-950 p-6 text-white sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-effect-claude),var(--color-effect-hermes),var(--color-effect-rag),var(--color-effect-openclaw))]" />

          <div className="flex h-full min-h-[28rem] flex-col justify-between">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/45">
                  Horizon
                </p>
                <h3 className="mt-3 max-w-md text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">
                  Frontier Research
                </h3>
              </div>
              <p className="shrink-0 font-mono text-sm text-white/35">001</p>
            </div>

            <div className="grid gap-3">
              <div className="h-16 bg-white" />
              <div className="grid grid-cols-[1fr_0.64fr] gap-3">
                <div className="h-16 bg-effect-rag" />
                <div className="h-16 bg-effect-hermes" />
              </div>
              <div className="grid grid-cols-[0.42fr_1fr] gap-3">
                <div className="h-16 bg-effect-rlm" />
                <div className="h-16 bg-effect-codex" />
              </div>
              <div className="grid grid-cols-[0.7fr_1fr] gap-3">
                <div className="h-16 bg-effect-claude" />
                <div className="h-16 bg-effect-openclaw" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center lg:pl-8">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
            Frontier research, in-house
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-700">
            We combine frontier agent research with hands-on deployments, then
            stay until the agent is moving real work.
          </p>

          <Link
            to="/research/horizon"
            className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Read more
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
