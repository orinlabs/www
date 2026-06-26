import { ArrowRight } from 'lucide-react';
import { cn } from 'slate-ui';

const CONTACT_EMAIL = 'founders@orinlabs.ai';

interface BookDemoButtonProps {
  variant?: 'dark' | 'light';
  className?: string;
  onClick?: () => void;
  tabIndex?: number;
}

export function BookDemoButton({
  variant = 'dark',
  className,
  onClick,
  tabIndex,
}: BookDemoButtonProps) {
  return (
    <a
      href={'mailto:' + CONTACT_EMAIL}
      onClick={onClick}
      tabIndex={tabIndex}
      className={cn(
        'group inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors',
        variant === 'dark'
          ? 'bg-neutral-950 text-white'
          : 'bg-white text-neutral-950 hover:bg-neutral-100',
        className,
      )}
    >
      Book a Demo
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  );
}
