import {
  type MouseEvent,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import Cal, { getCalApi } from '@calcom/embed-react';
import { ArrowRight } from 'lucide-react';
import { cn } from 'slate-ui';

// ---------------------------------------------------------------------------
// Cal.com configuration
//
// `CAL_LINK` is your public booking link in the form "<username-or-team>/<event>".
// `CAL_NAMESPACE` isolates this embed instance (any stable string works).
//
// Custom booking fields (company, team size, use case, etc.) are defined per
// event type in the Cal.com dashboard under "Advanced -> Booking questions".
// Once defined there, you can prefill or hard-set them here via `CAL_PREFILL`
// keyed by the field's slug. The scheduling availability comes from Cal.com,
// so nothing about availability changes.
// ---------------------------------------------------------------------------
const CAL_LINK = 'team/orin-labs/orin-labs-demo';
const CAL_NAMESPACE = 'book-demo';

// Prefill values for built-in and custom booking fields, keyed by field slug.
// Example custom field: `{ company: 'Acme', 'team-size': '10-50' }`.
const CAL_PREFILL: Record<string, string | string[]> = {};

// Brand styling for the embedded booker. Cal.com themes the scheduler from a
// single brand color plus a set of CSS variables, so we match the site here.
const BRAND_COLOR = '#0a0a0a';

let calUiConfigured = false;

async function configureCalUi() {
  if (calUiConfigured) {
    return;
  }

  const cal = await getCalApi({ namespace: CAL_NAMESPACE });

  cal('ui', {
    theme: 'light',
    layout: 'month_view',
    hideEventTypeDetails: false,
    cssVarsPerTheme: {
      light: {
        'cal-brand': BRAND_COLOR,
      },
      dark: {
        'cal-brand': '#ffffff',
      },
    },
    styles: {
      branding: { brandColor: BRAND_COLOR },
    },
  });

  calUiConfigured = true;
}

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    void configureCalUi();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    void configureCalUi();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isModalOpen]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClick?.();
    setIsModalOpen(true);
  };

  const modal = isModalOpen ? (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-neutral-950/70 p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close booking modal"
        onClick={() => setIsModalOpen(false)}
      />
      <div
        className="relative h-[700px] max-h-[calc(100svh-1.5rem)] w-full max-w-4xl min-w-[320px]"
        role="dialog"
        aria-modal="true"
        aria-label="Book a demo"
      >
        <Cal
          namespace={CAL_NAMESPACE}
          calLink={CAL_LINK}
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
          config={{
            layout: 'month_view',
            theme: 'light',
            ...CAL_PREFILL,
          }}
        />
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        tabIndex={tabIndex}
        aria-haspopup="dialog"
        className={cn(
          'group inline-flex w-fit cursor-pointer items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors',
          variant === 'dark'
            ? 'bg-neutral-950 text-white'
            : 'bg-white text-neutral-950 hover:bg-neutral-100',
          className,
        )}
      >
        Book a Demo
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      {typeof document !== 'undefined' && modal
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}
