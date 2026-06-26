import { JoinUs } from '../components/Hiring';

export default function Careers() {
  return (
    <main className="mx-auto flex w-full max-w-[92rem] flex-col px-5 pb-20 pt-10 sm:px-10 sm:pb-32 sm:pt-24 lg:px-12">
      <section className="py-8 sm:py-16">
        <div>
          <h1 className="secondary-page-title mt-5 max-w-4xl text-neutral-950">
            Join Us
          </h1>
        </div>
      </section>

      <JoinUs padded={false} />
    </main>
  );
}
