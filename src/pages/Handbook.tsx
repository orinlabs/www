import { useEffect, useMemo, useRef, useState } from 'react';

import { ChevronRight, Github } from 'lucide-react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { cn } from 'slate-ui';

import {
  HANDBOOK_PAGES,
  type HandbookAuthor,
  type HandbookPage,
} from '../data/handbook.generated';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

interface ListLine {
  indent: number;
  ordered: boolean;
  text: string;
}

function parseListLine(line: string): ListLine | null {
  const match = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
  if (!match) return null;

  return {
    indent: match[1].length,
    ordered: /\d+\./.test(match[2]),
    text: match[3],
  };
}

function renderList(lines: string[]): string {
  const listLines = lines.map(parseListLine).filter((line): line is ListLine => line !== null);

  function renderLevel(start: number, indent: number): { html: string; next: number } {
    const ordered = listLines[start].ordered;
    const tag = ordered ? 'ol' : 'ul';
    let html = `<${tag}>`;
    let index = start;

    while (index < listLines.length) {
      const line = listLines[index];
      if (line.indent < indent || line.ordered !== ordered) break;

      if (line.indent > indent) {
        const nested = renderLevel(index, line.indent);
        html += nested.html;
        index = nested.next;
        continue;
      }

      html += `<li>${inlineMarkdown(line.text)}`;
      index += 1;

      while (index < listLines.length && listLines[index].indent > indent) {
        const nested = renderLevel(index, listLines[index].indent);
        html += nested.html;
        index = nested.next;
      }

      html += '</li>';
    }

    html += `</${tag}>`;
    return { html, next: index };
  }

  let html = '';
  let index = 0;
  while (index < listLines.length) {
    const rendered = renderLevel(index, listLines[index].indent);
    html += rendered.html;
    index = rendered.next;
  }

  return html;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function markdownToHtml(markdown: string): string {
  const blocks = markdown.trim().split(/\n{2,}/).filter(Boolean);
  const seenHeadings = new Map<string, number>();

  return blocks
    .map((block) => {
      if (block.startsWith('```')) {
        const lines = block.split('\n');
        return `<pre><code>${escapeHtml(lines.slice(1, -1).join('\n'))}</code></pre>`;
      }

      const heading = block.match(/^(#{2,4})\s+(.+)$/);
      if (heading) {
        const level = heading[1].length;
        const baseId = slugify(heading[2]);
        const count = seenHeadings.get(baseId) ?? 0;
        seenHeadings.set(baseId, count + 1);
        const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
        return `<h${level} id="${id}">${inlineMarkdown(heading[2])}</h${level}>`;
      }

      const lines = block.split('\n');
      if (lines.every((line) => parseListLine(line))) {
        return renderList(lines);
      }

      return `<p>${inlineMarkdown(block.replace(/\n/g, ' '))}</p>`;
    })
    .join('\n');
}

function formatDate(date: string): string {
  if (!date) return 'Current draft';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export default function Handbook() {
  const { slug } = useParams();
  const { hash } = useLocation();
  const contentRef = useRef<HTMLElement | null>(null);
  const firstPage = HANDBOOK_PAGES[0];
  const page =
    HANDBOOK_PAGES.find((candidate) => candidate.slug === slug) ??
    (!slug ? firstPage : undefined);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(slug ? [slug] : firstPage ? [firstPage.slug] : []),
  );
  const [activeHeadingSlug, setActiveHeadingSlug] = useState<string | undefined>();

  const renderedBody = useMemo(
    () => (page?.body ? markdownToHtml(page.body) : ''),
    [page?.body],
  );

  useEffect(() => {
    if (!page) return;
    setExpanded((prev) => {
      if (prev.has(page.slug)) return prev;
      const next = new Set(prev);
      next.add(page.slug);
      return next;
    });
  }, [page]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || !page) return;

    if (!hash) {
      content.scrollTo({ top: 0 });
      setActiveHeadingSlug(page.items[0]?.slug);
      return;
    }

    const targetSlug = hash.slice(1);
    if (targetSlug === page.items[0]?.slug) {
      content.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveHeadingSlug(targetSlug);
      return;
    }

    const target = content.querySelector(`#${CSS.escape(targetSlug)}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHeadingSlug(targetSlug);
    }
  }, [hash, page?.slug]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || !page) return;

    const updateActiveHeading = () => {
      const headings = page.items
        .map((item) => content.querySelector<HTMLElement>(`#${CSS.escape(item.slug)}`))
        .filter((el): el is HTMLElement => el !== null);

      if (headings.length === 0) {
        setActiveHeadingSlug(undefined);
        return;
      }

      const readLine = content.scrollTop + 72;
      let active = headings[0].id;
      for (const heading of headings) {
        if (heading.offsetTop <= readLine) {
          active = heading.id;
        } else {
          break;
        }
      }
      setActiveHeadingSlug(active);
    };

    updateActiveHeading();
    content.addEventListener('scroll', updateActiveHeading, { passive: true });
    window.addEventListener('resize', updateActiveHeading);

    return () => {
      content.removeEventListener('scroll', updateActiveHeading);
      window.removeEventListener('resize', updateActiveHeading);
    };
  }, [page]);

  if (!firstPage) {
    return null;
  }

  if (!page) {
    return <Navigate to={`/handbook/${firstPage.slug}`} replace />;
  }

  const togglePage = (pageSlug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(pageSlug)) {
        next.delete(pageSlug);
      } else {
        next.add(pageSlug);
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-neutral-200 px-6 py-8 dark:border-neutral-800 lg:block">
        <p className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Handbook
        </p>
        <nav className="flex flex-col gap-1 text-base">
          {HANDBOOK_PAGES.map((navPage) => {
            const active = navPage.slug === page.slug;
            const showTopLevelActive = active && !activeHeadingSlug;
            const open = expanded.has(navPage.slug);
            return (
              <div key={navPage.slug}>
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-md transition-colors',
                    showTopLevelActive
                      ? 'bg-primary/5 text-primary'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800/60',
                  )}
                >
                  <Link
                    to={`/handbook/${navPage.slug}`}
                    className={cn(
                      'min-w-0 flex-1 rounded-md px-2 py-1.5 text-left font-medium transition-colors',
                      showTopLevelActive ? 'text-primary' : 'text-inherit',
                    )}
                  >
                    {navPage.title}
                  </Link>
                  <button
                    type="button"
                    onClick={() => togglePage(navPage.slug)}
                    aria-expanded={open}
                    aria-label={`${open ? 'Collapse' : 'Expand'} ${navPage.title}`}
                    className={cn(
                      'rounded-md p-1.5 transition-colors',
                      showTopLevelActive
                        ? 'text-primary/70 hover:text-primary'
                        : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200',
                    )}
                  >
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 shrink-0 transition-transform duration-200',
                        open && 'rotate-90',
                      )}
                    />
                  </button>
                </div>

                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="mt-0.5 ml-3.5 flex flex-col gap-0.5 border-l border-neutral-200 dark:border-neutral-800 pl-2">
                      {navPage.items.map((item, index) => {
                        const activeHeading =
                          active && item.slug === activeHeadingSlug;

                        return (
                          <Link
                            key={item.slug}
                            to={`/handbook/${navPage.slug}#${item.slug}`}
                            onClick={() => {
                              if (index === 0) {
                                contentRef.current?.scrollTo({
                                  top: 0,
                                  behavior: 'smooth',
                                });
                                setActiveHeadingSlug(item.slug);
                              }
                            }}
                            className={cn(
                              'rounded-md py-1.5 text-left transition-colors',
                              item.level > 2 ? 'px-5 text-sm' : 'px-2.5 text-[0.95rem]',
                              activeHeading
                                ? 'bg-primary/5 font-medium text-primary'
                                : 'text-neutral-500 hover:bg-neutral-100/70 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/40 dark:hover:text-neutral-100',
                            )}
                          >
                            {item.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <article
        ref={contentRef}
        className="min-w-0 flex-1 overflow-y-auto"
      >
        <div key={page.slug} className="handbook-page-transition">
          <div className="px-6 pt-6 pb-10 sm:px-8 sm:pt-8 lg:px-12 lg:pt-12 xl:px-16 xl:pt-16">
            <header className="mb-10 max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                {page.title}
              </h1>
              <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-400">
                {page.description}
              </p>
              <Authors authors={page.authors} />
            </header>

            {renderedBody ? (
              <div
                className="handbook-prose max-w-3xl"
                dangerouslySetInnerHTML={{ __html: renderedBody }}
              />
            ) : (
              <div className="max-w-3xl rounded-xl border border-dashed border-neutral-300 bg-white/40 p-8 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-400">
                Content coming soon.
              </div>
            )}
          </div>

          <LastEditor page={page} />
        </div>
      </article>
    </div>
  );
}

function Authors({ authors }: { authors: HandbookAuthor[] }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        Written by
      </span>
      {authors.map((author) => (
        <a
          key={author.githubUsername}
          href={author.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-white/50 py-1 pl-1 pr-3 text-sm text-neutral-700 transition-colors hover:border-primary/30 hover:text-primary dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300"
        >
          <img
            src={author.avatarUrl}
            alt=""
            className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-800"
          />
          <span className="font-medium">@{author.githubUsername}</span>
        </a>
      ))}
    </div>
  );
}

function LastEditor({ page }: { page: HandbookPage }) {
  const editor = page.lastEditor;

  return (
    <div className="mt-2 border-t border-neutral-200 px-6 py-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400 sm:px-8 lg:px-12 xl:px-16">
      <div className="flex max-w-3xl items-center gap-3">
        {editor.avatarUrl ? (
          <img
            src={editor.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 dark:bg-neutral-800">
            <Github className="h-4 w-4" />
          </div>
        )}

        <div className="min-w-0">
          <p className="text-neutral-700 dark:text-neutral-300">
            Last edited by{' '}
            {editor.githubUrl ? (
              <a
                href={editor.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                @{editor.githubUsername}
              </a>
            ) : (
              <span className="font-medium">{editor.name}</span>
            )}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            {formatDate(editor.date)}
          </p>
        </div>
      </div>
    </div>
  );
}
