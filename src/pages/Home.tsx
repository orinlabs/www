import { JoinUs } from '../components/Hiring';

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-3">

        {/*<Link
          to="/research/horizon"
          className="group flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 px-4 sm:px-6 py-3 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="beacon-badge shrink-0 rounded-full bg-primary text-anti-primary text-xs font-semibold px-2.5 py-1">
              New
            </span>
            <span className="text-sm sm:text-base text-neutral-800 dark:text-neutral-200 truncate">
              <span className="font-semibold">Horizon</span> — Benchmarking continual learning over long horizons
            </span>
          </div>
          <span className="shrink-0 flex items-center gap-1 text-sm font-medium text-primary">
            <span className="hidden sm:inline">Read more</span>
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>*/}

        {/* Hero */}
        <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-transparent bg-[#f4f5f0] dark:bg-neutral-900 min-h-[400px] sm:min-h-[480px] lg:min-h-[560px]">
          <div
            className="absolute inset-0 bg-cover bg-center block dark:hidden"
            style={{ backgroundImage: "url(/tree_color.jpeg)" }}
          />
          <div
            className="absolute inset-0 bg-cover bg-center hidden dark:block"
            style={{ backgroundImage: "url(/tree_dark.png)" }}
          />

          <div className="relative z-10 flex flex-col justify-start h-full min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] p-6 sm:p-18 lg:p-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.05] max-w-3xl">
              Operational
              <br />
              Intelligence
            </h1>
          
          </div>
        </div>
      </div>

      {/* Manifesto */}
      <div className="text-xl sm:text-2xl text-neutral-800 dark:text-neutral-300 leading-[1.5] space-y-6 font-light w-full px-8 sm:px-12 lg:px-16 text-justify hyphens-auto">

      <p>
      AI's purpose isn't to write more code; it's to harness energy, terraform worlds, provide surplus, and grow civilization. We believe that the path to this isn't via models that know more, but agents that can participate autonomously in the world. 
      </p>

      <p>
      To achieve this, we combine long-horizon training with new architectures, benchmarks, environments, safety research, and real deployments. Already our agents have been running for years, acting independently in the real world.
      </p>

      <p>
      We are a small group of engineers and researchers working to solve a short list of fundamental societal bottlenecks. If this sounds interesting, please reach out.
      </p>
      </div>

      {/* Join Us */}
      <JoinUs />
    </>
  );
}
