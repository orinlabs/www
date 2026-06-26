import {
  type MouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { ArrowRight } from 'lucide-react';
import { cn } from 'slate-ui';

const CALENDLY_URL = 'https://calendly.com/bryan-orinlabs-kwpy/30min';
const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
let calendlyScriptPromise: Promise<boolean> | null = null;

type CalendlyWidget = {
  initInlineWidget: (options: {
    url: string;
    parentElement: HTMLElement;
  }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyWidget;
  }
}

function loadCalendlyScript() {
  if (typeof document === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.Calendly) {
    return Promise.resolve(true);
  }

  if (calendlyScriptPromise) {
    return calendlyScriptPromise;
  }

  calendlyScriptPromise = new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="' + CALENDLY_SCRIPT_SRC + '"]',
    );

    const resolveLoaded = () => resolve(Boolean(window.Calendly));
    const resolveFailed = () => {
      calendlyScriptPromise = null;
      resolve(false);
    };

    if (existingScript) {
      existingScript.addEventListener('load', resolveLoaded, { once: true });
      existingScript.addEventListener('error', resolveFailed, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', resolveLoaded, { once: true });
    script.addEventListener('error', resolveFailed, { once: true });
    document.body.appendChild(script);
  });

  return calendlyScriptPromise;
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
  const calendlyWidgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void loadCalendlyScript();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

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

  useEffect(() => {
    const widget = calendlyWidgetRef.current;
    if (!isModalOpen || !widget) {
      return;
    }

    const initializeWidget = () => {
      if (!window.Calendly || !widget.isConnected) {
        return;
      }

      widget.innerHTML = '';
      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: widget,
      });
    };

    let cancelled = false;

    void loadCalendlyScript().then((loaded) => {
      if (!cancelled && loaded) {
        initializeWidget();
      }
    });

    return () => {
      cancelled = true;
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
        ref={calendlyWidgetRef}
        className="calendly-inline-widget relative h-[700px] max-h-[calc(100svh-1.5rem)] w-full max-w-4xl min-w-[320px]"
        data-url={CALENDLY_URL}
        role="dialog"
        aria-modal="true"
        aria-label="Book a demo"
      />
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
