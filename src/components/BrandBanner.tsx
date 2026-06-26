import { Link } from 'react-router-dom';
import { cn } from 'slate-ui';

import { Logo } from './Logo';

interface BrandBannerProps {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
}

export function BrandBanner({
  className,
  logoClassName,
  textClassName,
}: BrandBannerProps) {
  return (
    <Link
      to="/"
      className={cn(
        'flex w-fit items-center gap-2 text-neutral-950 transition-colors hover:text-primary',
        className,
      )}
    >
      <Logo className={cn('h-8 w-8 text-primary', logoClassName)} />
      <span
        className={cn(
          "font-['Body'] font-bold uppercase tracking-[-0.02em]",
          textClassName,
        )}
      >
        Orin Labs
      </span>
    </Link>
  );
}
