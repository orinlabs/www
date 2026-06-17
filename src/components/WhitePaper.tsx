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
      <article className="research-article">
        <div className="research-content">{children}</div>
      </article>
    );
  }

  return (
    <article className="research-article pt-8 sm:pt-12">
      {image && (
        <figure className="hidden md:block mb-8 sm:mb-10">
          <img
            src={image.src}
            alt={image.alt}
            className={`w-full rounded-xl border border-neutral-200 dark:border-neutral-800 ${
              image.darkSrc ? "block dark:hidden" : ""
            }`}
          />
          {image.darkSrc && (
            <img
              src={image.darkSrc}
              alt={image.alt}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 hidden dark:block"
            />
          )}
        </figure>
      )}

      {/* Title Block */}
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 leading-tight">
          {title}
        </h1>
        <p className="mb-5 text-base text-neutral-600/80 dark:text-neutral-400/80 leading-normal tracking-wide">
          {abstract}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-neutral-600 dark:text-neutral-400 text-base">
          {authors.map((author, i) => (
            <Fragment key={author}>
              {author === "Orin Labs" ? (
                <Link
                  to="/"
                  className="text-primary hover:underline transition-colors"
                >
                  {author}
                </Link>
              ) : (
                <span>{author}</span>
              )}
              {i < authors.length - 1 && (
                <span
                  aria-hidden
                  className="text-neutral-400 dark:text-neutral-500 select-none leading-none"
                >
                  ·
                </span>
              )}
            </Fragment>
          ))}
          <span className="text-neutral-400 dark:text-neutral-500">|</span>
          <span>{date}</span>
        </div>
      </header>

      {/* Content */}
      <div className="research-content">{children}</div>
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
    <section className={cn("mb-12 max-w-5xl", className)}>
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-baseline gap-3">
          {number && (
            <span className="text-primary font-mono text-lg">{number}.</span>
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
    <div className="mt-8 mb-6">
      <h3 className="text-lg sm:text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-baseline gap-2">
        {number && (
          <span className="text-primary/70 font-mono text-sm">{number}</span>
        )}
        {title}
      </h3>
      <div className="research-prose">{children}</div>
    </div>
  );
}

export function KeyTakeaways({ children }: { children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        Key Takeaways
      </h2>
      <div className="research-prose">{children}</div>
    </section>
  );
}
