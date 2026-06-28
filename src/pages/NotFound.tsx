import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex w-full flex-1 flex-col px-8 sm:px-10 lg:px-12">
      <section className="flex min-h-[calc(100svh-7rem)] flex-col justify-center gap-8 pb-12 pt-8 sm:min-h-[calc(100svh-8rem)] sm:pb-16 sm:pt-10">
        <div className="flex max-w-2xl flex-col gap-5">
          <h1 className="text-5xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-6xl">
            Page not found
          </h1>
          <p className="text-lg leading-[1.5] text-neutral-600">
            This page doesn&apos;t exist or has moved.
          </p>
        </div>

        <Link
          to="/"
          className="group inline-flex w-fit items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back home
        </Link>
      </section>
    </main>
  );
}
