import { Link } from "react-router-dom";

interface BlogProps {
  title: string;
  subtitle?: string;
  authors?: string[];
  date: string;
  children: React.ReactNode;
}

export function Blog({
  title,
  subtitle,
  authors = ["Orin Labs"],
  date,
  children,
}: BlogProps) {
  return (
    <article className="w-full pt-8 sm:pt-12">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-neutral-100 leading-[1.1] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-xl sm:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-x-2 text-base text-neutral-500 dark:text-neutral-400">
          <time>{date}</time>
          <span className="text-neutral-300 dark:text-neutral-600">—</span>
          {authors.map((author, i) => (
            <span key={author}>
              {author === "Orin Labs" ? (
                <Link
                  to="/"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors"
                >
                  {author}
                </Link>
              ) : (
                <span className="text-neutral-700 dark:text-neutral-300">
                  {author}
                </span>
              )}
              {i < authors.length - 1 && (
                <span className="text-neutral-400 dark:text-neutral-500">
                  ,{" "}
                </span>
              )}
            </span>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="blog-content">{children}</div>
    </article>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function BlogSection({ title, children }: SectionProps) {
  return (
    <section className="mt-16 first:mt-0">
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
        {title}
      </h2>
      <div className="blog-prose">{children}</div>
    </section>
  );
}

export function BlogProse({ children }: { children: React.ReactNode }) {
  return <div className="blog-prose">{children}</div>;
}

export function BlogCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-10 py-8 px-6 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg">
      {children}
    </div>
  );
}

export function BlogImage({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-10">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg"
      />
      {caption && (
        <figcaption className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

