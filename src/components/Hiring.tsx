import { ArrowRight } from 'lucide-react';
import { cn } from 'slate-ui';

type Role = {
  title: string;
  description: string;
  location: string;
};

const roles: Role[] = [
  {
    title: "Research Engineer",
    description: "Discovering novel techniques for long-horizon learning.",
    location: "San Francisco, CA",
  },
  {
    title: "Infrastructure Engineer",
    description: "Working on memory systems, long-horizon agent runtimes, etc.",
    location: "San Francisco, CA",
  },
];

function ContactButton({ className }: { className?: string }) {
  return (
    <a
      href="https://cal.com/bryan-houlton-5uvxqc/orin-labs-contact"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-400 transition-colors cursor-pointer",
        "flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto text-sm sm:text-base",
        className,
      )}
    >
      Contact
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}

interface JoinUsProps {
  compact?: boolean;
}

export function JoinUs({ compact = false }: JoinUsProps) {
  if (compact) {
    return (
      <div className="flex flex-col gap-4 items-start w-full">
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Join Us
        </h2>
        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          We are a small, San Francisco-based team focused on building AI for
          consumer services. We are solving hard and important problems for real
          people.
        </p>
        <ContactButton />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-6 sm:gap-8 items-start w-full"
      id="join-us"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl sm:text-5xl font-semibold text-neutral-900 dark:text-neutral-100">
          Join Us
        </h2>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          We are a small, San Francisco-based team focused on building AI for
          consumer services. We are solving hard and important problems for real
          people.
        </p>
      </div>

      <ContactButton />

      <div className="flex flex-col items-stretch w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 px-0 sm:px-4 md:px-0">
          Open Roles
        </h2>

        {roles.map((role) => (
          <button
            key={role.title}
            className={cn(
              "flex text-left flex-col items-start gap-1 w-full hover:bg-neutral-100",
              "dark:hover:bg-neutral-800",
              "p-4 sm:p-5 md:-mx-4 transition-colors rounded-md group",
            )}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2">
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100 shrink-0 group-hover:text-primary transition-colors">
                {role.title}
              </p>

              <p className="text-base text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors shrink-0 w-fit leading-relaxed">
                {role.location}
              </p>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors max-w-2xl leading-relaxed">
              {role.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
