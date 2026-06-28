import { GlitchText } from '../components/GlitchText';
import { JoinUs } from '../components/Hiring';

const PRINCIPLES = [
  {
    title: 'Be clear',
    body:
      'Clear thoughts leads to clear decisions. We write a lot.',
    className: 'rounded-br-[1.75rem] rounded-tl-[1.75rem] bg-effect-rag text-white lg:col-span-5',
    bodyClassName: 'text-white/75',
  },
  {
    title: 'Care deeply',
    body:
      'We take the mission seriously while staying fun and nimble.',
    className: 'rounded-bl-[1.75rem] rounded-tr-[1.75rem] bg-white text-neutral-950 lg:col-span-4',
    bodyClassName: 'text-neutral-600',
  },
  {
    title: 'Move fast',
    body:
      'We move fast, step on toes, and work without ego.',
    className: 'rounded-bl-[1.75rem] rounded-tr-[1.75rem] bg-neutral-950 text-white lg:col-span-3',
    bodyClassName: 'text-white/70',
  },
];

export default function Careers() {
  return (
    <main className="flex w-full flex-col px-5 pb-20 sm:px-10 sm:pb-32 lg:px-12">
      <section className="relative flex h-[calc(100svh-4.5rem)] flex-col justify-between gap-10 overflow-hidden py-8 sm:h-[calc(100svh-5.25rem)] sm:py-16">
        <div className="relative">
          <div>
            <h1 className="max-w-none text-[clamp(3.85rem,17vw,6rem)] leading-[0.86] tracking-[-0.055em] text-neutral-950 sm:text-[clamp(4.25rem,10vw,7.5rem)] lg:text-[clamp(3.25rem,7.4vw,7.5rem)]">
              <span className="block">Build the</span>
              <span className="block pl-[12vw]">
                <GlitchText underline={false}>agents</GlitchText>
              </span>
              <span className="block">that build</span>
              <span className="block pl-[6vw]">
                the <GlitchText underline={false}>world</GlitchText>.
              </span>
            </h1>
          </div>
        </div>

        <div className="relative flex justify-end">
          <div className="w-full max-w-3xl text-right">
            <p className="text-2xl leading-[1.2] text-neutral-950 sm:text-3xl">
              We are training AI to run
              megaprojects.
            </p>
            <div className="orin-hero-bar orin-hero-bar-right mt-8 h-1.5 w-full rounded-full bg-neutral-950" />
          </div>
        </div>
      </section>

      <section className="py-20 pt-0 sm:py-28 sm:pt-0">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="flex min-h-[36rem] flex-col justify-between rounded-br-[1.75rem] rounded-tl-[1.75rem] bg-neutral-950 p-7 text-white sm:p-10 lg:col-span-7">
            <h2 className="max-w-3xl text-[clamp(3rem,6vw,5.75rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
              Intentional team.
              <br />
              High bar.
            </h2>
            <p className="max-w-2xl text-2xl leading-[1.16] tracking-[-0.025em] text-white/78 sm:text-3xl">
            A team who can work anywhere, <br />but choses to work here.
            </p>
          </div>

          <div className="grid gap-4 lg:col-span-5">
            <div className="min-h-56 rounded-bl-[1.75rem] rounded-tr-[1.75rem] bg-effect-rag" />
            <div className="flex min-h-56 items-end rounded-br-[1.75rem] rounded-tl-[1.75rem] bg-white p-7 sm:p-10">
              <p className="max-w-md text-3xl font-semibold leading-[1] tracking-[-0.04em] text-neutral-950 sm:text-4xl underline">
              Our Values
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          {PRINCIPLES.map((principle) => (
            <article
              key={principle.title}
              className={'flex min-h-[18rem] flex-col justify-end p-7 sm:p-9 ' + principle.className}
            >
              <h3 className="text-2xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-3xl">
                {principle.title}
              </h3>
              <p className={'mt-2 max-w-sm text-base leading-7 sm:text-lg sm:leading-8 ' + principle.bodyClassName}>
                {principle.body}
              </p>
            </article>
          ))}
        </div>
      </section>

        <JoinUs padded={false} />
    </main>
  );
}
