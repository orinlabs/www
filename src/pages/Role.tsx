import { ArrowLeftIcon, ArrowRight, X } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Link,
  Navigate,
  useParams,
} from 'react-router-dom';

import { ApplicationForm } from '../components/ApplicationForm';
import {
  EEO_STATEMENT,
  getRoleBySlug,
  type Role as RoleType,
  VISA_NOTE,
} from '../data/roles';

export default function Role() {
  const { slug } = useParams<{ slug: string }>();
  const role = getRoleBySlug(slug);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  useEffect(() => {
    if (!isApplyOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsApplyOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isApplyOpen]);

  if (!role) {
    return <Navigate to="/careers" replace />;
  }

  const applyDrawer = (
    <>
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setIsApplyOpen(false)}
        className={
          "fixed inset-0 z-[70] bg-neutral-950/40 transition-opacity duration-300 " +
          (isApplyOpen ? "opacity-100" : "pointer-events-none opacity-0")
        }
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={"Apply for " + role.title}
        className={
          "fixed inset-y-0 right-0 z-[80] flex w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl shadow-neutral-950/20 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] " +
          (isApplyOpen ? "translate-x-0" : "pointer-events-none translate-x-full")
        }
      >
        <div className="flex items-start justify-between gap-6 px-7 pt-7 sm:px-10 sm:pt-10">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-4xl">
              {role.title} Application
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-neutral-600">
              We read every application and will reply to you within 3 days.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close application"
            onClick={() => setIsApplyOpen(false)}
            tabIndex={isApplyOpen ? undefined : -1}
            className="shrink-0 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-7 pb-10 pt-8 sm:px-10">
          <ApplicationForm roleSlug={role.slug} roleTitle={role.title} />
        </div>
      </div>
    </>
  );

  return (
    <article className="flex w-full flex-col px-8 pb-24 pt-10 sm:px-10 sm:pb-32 sm:pt-14 lg:px-12">
      <header className="grid min-h-[48svh] gap-10 pb-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <div>
          <Link
            to="/careers"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All roles
          </Link>
          <h1 className="secondary-page-title mt-6 max-w-5xl text-neutral-950">
            {role.title}
          </h1>
        </div>

        <div className="max-w-2xl lg:pb-4">
          {role.tagline ? (
            <p className="text-2xl leading-[1.25] text-neutral-700">
              {role.tagline}
            </p>
          ) : (
            <p className="text-2xl leading-[1.25] text-neutral-700">
              Help build autonomous agents that can coordinate real operational
              work over long horizons.
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-base text-neutral-500">
            <span>{role.location}</span>
            {role.compensation && (
              <>
                <span aria-hidden className="text-neutral-300">
                  ·
                </span>
                <span>{role.compensation}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsApplyOpen(true)}
            className="group mt-8 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Apply for this role
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </header>

      <div className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.34fr_1fr]">
        <aside className="h-fit lg:sticky lg:top-8">
          <dl className="grid gap-5 text-sm">
            <div>
              <dt className="text-neutral-400">Location</dt>
              <dd className="mt-1 text-neutral-950">{role.location}</dd>
            </div>
            {role.compensation && (
              <div>
                <dt className="text-neutral-400">Compensation</dt>
                <dd className="mt-1 text-neutral-950">{role.compensation}</dd>
              </div>
            )}
            <div>
              <dt className="text-neutral-400">Team</dt>
              <dd className="mt-1 text-neutral-950">Orin Labs</dd>
            </div>
          </dl>
        </aside>

        <div className="flex flex-col gap-6">
          {role.sections.map((section) => (
            <RoleSection key={section.heading} section={section} />
          ))}

          <button
            type="button"
            onClick={() => setIsApplyOpen(true)}
            className="group mt-2 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Apply for this role
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm leading-relaxed text-neutral-500">
            <p>{VISA_NOTE}</p>
            <p>{EEO_STATEMENT}</p>
          </div>
        </div>
      </div>

      {typeof document !== "undefined" && createPortal(applyDrawer, document.body)}
    </article>
  );
}

function RoleSection({ section }: { section: RoleType["sections"][number] }) {
  return (
    <section className="bg-white py-2 sm:py-3 lg:py-4">
      <h2 className="text-2xl font-semibold tracking-[-0.025em] text-neutral-950 sm:text-4xl">
        {section.heading}
      </h2>
      {Array.isArray(section.body) ? (
        <ul className="mt-6 list-disc space-y-2 pl-5 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
          {section.body.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col gap-5 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
          {section.body
            .split(/\n\s*\n/)
            .map((para, i) => (
              <p key={i}>{renderWithLinks(para.trim())}</p>
            ))}
        </div>
      )}
    </section>
  );
}

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderWithLinks(text: string) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    const [full, label, href] = match;
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const linkClass =
      "text-neutral-950 underline underline-offset-4 decoration-neutral-300 transition-colors hover:decoration-neutral-950";

    if (href.startsWith("/")) {
      nodes.push(
        <Link key={match.index} to={href} className={linkClass}>
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          {label}
        </a>,
      );
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
