import { Fragment } from 'react';

import { Link } from 'react-router-dom';
import { cn } from 'slate-ui';

interface ResearchArticleProps {
  title: string;
  authors?: string[];
  date: string;
  abstract: string;
  image?: { src: string; darkSrc?: string; alt: string };
  // When true, the in-article image + title block are omitted (e.g. when a
  // full-width hero renders them instead).
  hideHeader?: boolean;
  children: React.ReactNode;
}

export function ResearchArticle({
  title,
  authors = ["Orin Labs"],
  date,
  abstract,
  image,
  hideHeader = false,
  children,
}: ResearchArticleProps) {
  if (hideHeader) {
    return (
      <article className="research-article mx-auto flex w-full max-w-[92rem] flex-col px-8 pb-24 pt-12 sm:px-10 sm:pb-32 sm:pt-16 lg:px-12">
        <div className="research-content w-full max-w-5xl">{children}</div>
      </article>
    );
  }

  return (
    <article className="research-article mx-auto flex w-full max-w-[92rem] flex-col px-8 pb-24 pt-14 sm:px-10 sm:pb-32 sm:pt-20 lg:px-12">
      <header className="grid min-h-[48svh] gap-10 border-b border-neutral-200 pb-14 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
        <div>
          <Link
            to="/research"
            className="text-sm font-medium text-primary-700 transition-colors hover:text-primary-900"
          >
            Research
          </Link>
          <h1 className="secondary-page-title mt-5 max-w-6xl text-neutral-950">
            {title}
          </h1>
        </div>

        <div className="max-w-2xl lg:pb-3">
          <p className="text-xl font-medium leading-[1.28] text-neutral-950 sm:text-2xl">
            {abstract}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-neutral-500 sm:text-base">
            {authors.map((author, i) => (
              <Fragment key={author}>
                {author === "Orin Labs" ? (
                  <Link
                    to="/"
                    className="text-neutral-700 underline underline-offset-4 decoration-neutral-300 transition-colors hover:text-neutral-950 hover:decoration-neutral-950"
                  >
                    {author}
                  </Link>
                ) : (
                  <span>{author}</span>
                )}
                {i < authors.length - 1 && (
                  <span aria-hidden className="select-none text-neutral-300">
                    ·
                  </span>
                )}
              </Fragment>
            ))}
            <span aria-hidden className="text-neutral-300">
              ·
            </span>
            <span>{date}</span>
          </div>
          <div className="mt-8 h-1.5 w-full rounded-full bg-neutral-950" />
        </div>
      </header>

      {image && (
        <figure className="my-10 overflow-hidden rounded-[2rem] border border-neutral-950 bg-neutral-50 sm:my-14">
          <img
            src={image.src}
            alt={image.alt}
            className={cn("w-full", image.darkSrc && "block dark:hidden")}
          />
          {image.darkSrc && (
            <img
              src={image.darkSrc}
              alt={image.alt}
              className="hidden w-full dark:block"
            />
          )}
        </figure>
      )}

      <div className="research-content mt-14 w-full max-w-5xl sm:mt-20">
        {children}
      </div>
    </article>
  );
}

interface SectionProps {
  number?: string;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export function Section({ number, title, children, className }: SectionProps) {
  return (
    <section className={cn("mb-14 max-w-5xl sm:mb-20", className)}>
      {title && (
        <h2 className="mb-5 flex items-baseline gap-3 text-2xl font-semibold leading-tight tracking-[-0.025em] text-neutral-950 sm:text-4xl">
          {number && (
            <span className="text-base font-medium text-primary-700 sm:text-lg">
              {number}.
            </span>
          )}
          {title}
        </h2>
      )}
      <div className="research-prose">{children}</div>
    </section>
  );
}

interface SubsectionProps {
  number?: string;
  title: string;
  children: React.ReactNode;
}

export function Subsection({ number, title, children }: SubsectionProps) {
  return (
    <div className="mb-8 mt-10">
      <h3 className="mb-4 flex items-baseline gap-2 text-xl font-semibold text-neutral-950 sm:text-2xl">
        {number && (
          <span className="text-sm font-medium text-primary-700">
            {number}
          </span>
        )}
        {title}
      </h3>
      <div className="research-prose">{children}</div>
    </div>
  );
}

export function KeyTakeaways({ children }: { children: React.ReactNode }) {
  return (
    <section className="mb-14 rounded-[2rem] border border-neutral-950 bg-white p-6 sm:mb-20 sm:p-8">
      <h2 className="mb-6 text-2xl font-semibold tracking-[-0.025em] text-neutral-950 sm:text-4xl">
        Key Takeaways
      </h2>
      <div className="research-prose">{children}</div>
    </section>
  );
}
