import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from 'slate-ui';

import { GlitchText } from './GlitchText';
import { ROLES } from '../data/roles';

interface JoinUsProps {
  padded?: boolean;
  tone?: "light" | "dark";
}

export function JoinUs({ padded = true, tone = "light" }: JoinUsProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-4",
        padded && "px-5 sm:px-12 lg:px-16",
      )}
      id="join-us"
    >
      <div className="flex flex-col gap-4 w-full">
        <h3
          className={cn(
            "text-3xl font-semibold tracking-[-0.035em] sm:text-5xl",
            isDark ? "text-white" : "text-neutral-950 dark:text-neutral-100",
          )}
        >
          Open Roles
        </h3>
      </div>

      <div
        className={cn(
          "mt-4 grid w-full divide-y divide-neutral-200 sm:mt-6 sm:gap-5 sm:divide-y-0",
        )}
      >
        {ROLES.map((role) => (
          <Link
            key={role.slug}
            to={"/roles/" + role.slug}
            className="group flex w-full cursor-pointer flex-col items-start gap-2 py-4 transition-colors first:pt-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:py-0"
          >
            <p
              className={cn(
                "min-w-0 max-w-full text-2xl font-semibold tracking-[-0.025em] transition-colors sm:shrink-0",
                isDark
                  ? "text-neutral-950"
                  : "text-neutral-950 dark:text-neutral-400",
              )}
            >
              <GlitchText>{role.title}</GlitchText>
            </p>

            <p
              className={cn(
                "flex w-fit shrink-0 items-center gap-2 text-sm leading-relaxed transition-colors sm:text-base",
                isDark
                  ? "text-neutral-500 group-hover:text-neutral-950"
                  : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-400",
              )}
            >
              {role.location}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
