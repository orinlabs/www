import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from 'slate-ui';

import { ROLES } from '../data/roles';

export function JoinUs({ padded = true }: { padded?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:gap-8 items-start w-full",
        padded && "px-8 sm:px-12 lg:px-16",
      )}
      id="join-us"
    >
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full">
          <h3 className="text-xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Open Roles
          </h3>
          <hr className="flex-1 hidden sm:block dark:border-neutral-700" />
        </div>
      </div>

      <div className="flex flex-col items-stretch w-full divide-y dark:divide-neutral-700">
        {ROLES.map((role) => (
          <Link
            key={role.slug}
            to={`/roles/${role.slug}`}
            className={cn(
              "flex items-center justify-between gap-1 flex-1",
              "px-2 -pl-2 py-1 group cursor-pointer",
            )}
          >
            <p className="text-lg text-neutral-900 dark:text-neutral-400 shrink-0 group-hover:text-primary group-hover:dark:text-primary-200 transition-colors">
              {role.title}
            </p>

            <p className="text-base flex items-center gap-2 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors shrink-0 w-fit leading-relaxed">
              {role.location}
              <ArrowRight className="w-3 h-3" />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
