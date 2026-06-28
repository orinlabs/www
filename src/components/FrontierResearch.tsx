import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CellularAutomaton } from './frontier-visuals/FrontierInteractiveVisuals';

export function FrontierResearch() {
  return (
    <section className="flex justify-center bg-white text-neutral-950">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
        <CellularAutomaton />

        <div className="flex flex-col justify-center">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">
            Pushing the frontier
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-700">
            We push the boundaries of how agents learn, hold context, and manage complexity.
          </p>

          <Link
            to="/research"
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
