import { AgentWorkLoop } from '../components/AgentWorkLoop';
import { BookDemoButton } from '../components/BookDemoButton';
import { DeploymentsGallery } from '../components/DeploymentsGallery';
import { FrontierResearch } from '../components/FrontierResearch';
import { InTheLoopDemo } from '../components/InTheLoopDemo';

export default function Home() {
  return (
    <main className="flex w-full flex-col px-8 sm:px-10 lg:px-12">
      <section className="relative h-[calc(100svh-4.5rem)] overflow-hidden bg-white pb-8 pt-8 sm:h-[calc(100svh-5.25rem)] sm:pb-10 sm:pt-10 lg:pb-12 lg:pt-12">
        <div className="flex h-full min-h-0 w-full flex-col justify-between gap-10">
          <div className="relative z-10">
            <h1 className="max-w-[82rem] text-[clamp(3.825rem,11.88vw,11.475rem)] font-semibold leading-[0.82] tracking-[-0.045em] text-neutral-950">
              <span className="block">Scale operations</span>
              <span className="block">with agents</span>
            </h1>
            <BookDemoButton className="mt-6 md:hidden" />
          </div>

          <div className="flex w-full flex-col gap-6">
            <p className="max-w-2xl text-2xl leading-[1.25] text-neutral-700">
              Safe, autonomous agents that help run physical build-outs
            </p>
            <div className="orin-hero-bar h-1.5 w-full rounded-full bg-neutral-950 sm:w-[60%]" />
          </div>
        </div>
      </section>

      <section className="w-full overflow-x-clip bg-white py-20 pt-10 sm:pb-48 sm:pt-0">
        <div className="flex w-full flex-col gap-20 sm:gap-28">
          <DeploymentsGallery />

          <div className="flex flex-col">
            <AgentWorkLoop />

            <InTheLoopDemo />
          </div>

          <FrontierResearch />
        </div>
      </section>

      <section className="relative -mx-8 overflow-hidden bg-black px-8 text-white sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12">
        <div className="relative z-10 grid min-h-[72svh] w-full gap-8 py-40 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.98] md:text-7xl">
              Put AI to work inside your operations
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
              Book a call with our team to scope your first deployment.
            </p>
            <BookDemoButton variant="light" className="mt-6" />

          </div>
        </div>
      </section>
    </main>
  );
}
