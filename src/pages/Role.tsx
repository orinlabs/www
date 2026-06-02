import { ArrowLeftIcon } from 'lucide-react';
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
    return <Navigate to="/#join-us" replace />;
  }

  return (
    <article className="pt-4 sm:pt-6 flex flex-col gap-12">
      {/* Back link */}
      <Link
        to="/#join-us"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors w-fit"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        All open roles
      </Link>

      {/* Hero */}
      <header className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-transparent bg-[#f4f5f0] dark:bg-neutral-900 min-h-[360px] sm:min-h-[440px] lg:min-h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 dark:opacity-60"
          style={{ backgroundImage: `url(${role.headerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f4f5f0]/95 via-[#f4f5f0]/40 to-transparent dark:from-neutral-800/95 dark:via-neutral-200/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-end h-full min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] p-8 sm:p-12 lg:p-16 gap-3">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-neutral-900 dark:text-neutral-100 leading-[1.05] max-w-3xl">
            {role.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base text-neutral-700 dark:text-neutral-300">
            <span>{role.location}</span>
            {role.compensation && (
              <>
                <span className="text-neutral-400 dark:text-neutral-500">·</span>
                <span>{role.compensation}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-col gap-12 px-8 sm:px-12 lg:px-16">
        {/* Tagline */}
        <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl">
          {role.tagline}
        </p>

        {/* Content sections */}
        <div className="flex flex-col gap-10">
          {role.sections.map((section) => (
            <RoleSection key={section.heading} section={section} />
          ))}
        </div>

        <hr className="border-neutral-200 dark:border-neutral-800" />

        {/* Apply */}
        <section className="flex flex-col gap-6" id="apply">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
              Apply
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              We read every application. Expect a reply within a week.
            </p>
          </div>
          <ApplicationForm roleSlug={role.slug} roleTitle={role.title} />
        </section>

        {/* Footer notes */}
        <div className="flex flex-col gap-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-neutral-800 pt-6">
          <p>{VISA_NOTE}</p>
          <p>{EEO_STATEMENT}</p>
        </div>
      </div>
    </article>
  );
}

function RoleSection({ section }: { section: RoleType["sections"][number] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        {section.heading}
      </h2>
      {Array.isArray(section.body) ? (
        <ul className="list-disc pl-5 space-y-1.5 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {section.body.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col gap-4 text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {section.body
            .split(/\n\s*\n/)
            .map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
        </div>
      )}
    </section>
  );
}
