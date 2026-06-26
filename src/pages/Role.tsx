import { ArrowLeftIcon } from 'lucide-react';
import { type ReactNode } from 'react';
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

  if (!role) {
    return <Navigate to="/careers" replace />;
  }

  return (
    <article className="flex w-full flex-col px-8 pb-24 pt-10 sm:px-10 sm:pb-32 sm:pt-14 lg:px-12">
      <Link
        to="/careers"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-950"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        All open roles
      </Link>

      <header className="mt-10 grid min-h-[48svh] gap-10 border-b border-neutral-200 pb-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary-700">
            Careers
          </p>
          <h1 className="secondary-page-title mt-5 max-w-5xl text-neutral-950">
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
          <a
            href="#apply"
            className="mt-8 inline-flex w-fit items-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Apply for this role
          </a>
        </div>
      </header>

      <div className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[0.34fr_1fr]">
        <aside className="h-fit rounded-[2rem] border border-neutral-200 p-6 lg:sticky lg:top-8">
          <p className="text-sm font-medium text-primary-700">
            Role
          </p>
          <dl className="mt-6 grid gap-5 text-sm">
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

          <section
            className="mt-8 rounded-[2rem] border border-neutral-200 bg-neutral-50 p-6 sm:p-8 lg:p-10"
            id="apply"
          >
            <div className="mb-8">
              <p className="text-sm font-medium text-primary-700">
                Apply
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">
                Tell us what you want to build.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
                We read every application. Expect a reply within a week.
              </p>
            </div>
            <ApplicationForm roleSlug={role.slug} roleTitle={role.title} />
          </section>

          <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm leading-relaxed text-neutral-500">
            <p>{VISA_NOTE}</p>
            <p>{EEO_STATEMENT}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function RoleSection({ section }: { section: RoleType["sections"][number] }) {
  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-8 lg:p-10">
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
