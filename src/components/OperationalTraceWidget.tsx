import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Mail,
  MessageSquare,
  PhoneCall,
  PhoneOff,
  Radio,
  type LucideIcon,
} from 'lucide-react';
import {
  useEffect,
  useState,
} from 'react';

type TraceKind =
  | 'wake'
  | 'plan'
  | 'email'
  | 'think'
  | 'system'
  | 'call'
  | 'message'
  | 'done';

interface TraceStep {
  icon: LucideIcon;
  kind: TraceKind;
  time: string;
  title: string;
  body: string;
  durationMs: number;
  accent: string;
  tint: string;
}

const TRACE_STEPS: TraceStep[] = [
  {
    icon: Radio,
    kind: 'wake',
    time: '06:30',
    title: 'Morning review begins',
    body: 'The agent wakes to one objective: keep the EV charger install ready for Friday.',
    durationMs: 1800,
    accent: 'text-primary-700 dark:text-primary-200',
    tint: 'bg-primary-100 dark:bg-primary-900/50',
  },
  {
    icon: ClipboardCheck,
    kind: 'plan',
    time: '06:31',
    title: 'Install path checked',
    body: 'Open blockers, subcontractor messages, permit status, and site notes are reviewed together.',
    durationMs: 2200,
    accent: 'text-secondary-700 dark:text-secondary-200',
    tint: 'bg-secondary-100 dark:bg-secondary-900/50',
  },
  {
    icon: Mail,
    kind: 'email',
    time: '06:34',
    title: 'Subcontractor flags access issue',
    body: '“Crew is on site but cannot get through the service gate.”',
    durationMs: 2400,
    accent: 'text-warning-700 dark:text-warning-200',
    tint: 'bg-warning-100 dark:bg-warning-900/50',
  },
  {
    icon: AlertTriangle,
    kind: 'think',
    time: '06:35',
    title: 'Delay risk identified',
    body: 'The agent compares the message against the install plan and sees inspection could slip.',
    durationMs: 2200,
    accent: 'text-error-700 dark:text-error-200',
    tint: 'bg-error-100 dark:bg-error-900/50',
  },
  {
    icon: Database,
    kind: 'system',
    time: '06:36',
    title: 'Missing gate code found',
    body: 'Site access instructions exist in kickoff notes but were never copied into the job record.',
    durationMs: 2400,
    accent: 'text-neutral-700 dark:text-neutral-200',
    tint: 'bg-neutral-200 dark:bg-neutral-800',
  },
  {
    icon: PhoneCall,
    kind: 'call',
    time: '06:39',
    title: 'Contractor called back',
    body: 'Gate instructions shared. Crew confirmed they can continue today.',
    durationMs: 3600,
    accent: 'text-primary-700 dark:text-primary-200',
    tint: 'bg-primary-100 dark:bg-primary-900/50',
  },
  {
    icon: MessageSquare,
    kind: 'message',
    time: '06:43',
    title: 'Human approval requested',
    body: 'A revised inspection window is posted to the project channel for PM approval.',
    durationMs: 2500,
    accent: 'text-secondary-700 dark:text-secondary-200',
    tint: 'bg-secondary-100 dark:bg-secondary-900/50',
  },
  {
    icon: CheckCircle2,
    kind: 'done',
    time: '06:45',
    title: 'Project status updated',
    body: 'The blocker is closed, the next check-in is scheduled, and the install remains on track.',
    durationMs: 2600,
    accent: 'text-success-700 dark:text-success-200',
    tint: 'bg-success-100 dark:bg-success-900/50',
  },
];

const CARD_BASE =
  'orin-op-card relative rounded-[1.75rem] border bg-white/90 px-6 py-5 text-neutral-950 shadow-lg shadow-neutral-900/5 backdrop-blur-md dark:bg-neutral-900/90 dark:text-neutral-50';

function cardClass(isActive: boolean) {
  return [
    CARD_BASE,
    isActive
      ? 'is-active border-primary-500'
      : 'is-complete border-neutral-200 dark:border-neutral-700',
  ].join(' ');
}

function CardHeader({
  step,
  iconSlot,
}: {
  step: TraceStep;
  iconSlot: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div className="flex min-w-0 items-center gap-3">
        {iconSlot}
        <h3 className="min-w-0 truncate text-base font-semibold">{step.title}</h3>
      </div>
      <time className="shrink-0 text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
        {step.time}
      </time>
    </div>
  );
}

function StandardCard({
  step,
  isActive,
}: {
  step: TraceStep;
  isActive: boolean;
}) {
  const Icon = step.icon;

  return (
    <article className={cardClass(isActive)}>
      <CardHeader
        step={step}
        iconSlot={
          <div className={'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current/15 ' + step.tint + ' ' + step.accent}>
            <Icon className="h-4 w-4" />
          </div>
        }
      />
      <p className="mt-3.5 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
        {step.body}
      </p>
    </article>
  );
}

function CallCard({
  step,
  isActive,
}: {
  step: TraceStep;
  isActive: boolean;
}) {
  return (
    <article className={cardClass(isActive)}>
      <CardHeader
        step={step}
        iconSlot={
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current/15 bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-200">
            <PhoneCall className="orin-call-phone-on absolute h-4 w-4" />
            <PhoneOff className="orin-call-phone-off absolute h-4 w-4 text-error-600 dark:text-error-300" />
          </div>
        }
      />

      <div className="mt-3.5 space-y-2">
        {[
          'Agent: “Can your crew continue if I send the service gate code?”',
          'Contractor: “Yes. We can stay on site and keep trenching today.”',
          'Outcome: access issue resolved before inspection slipped.',
        ].map((line, index) => (
          <p
            key={line}
            className="orin-call-transcript rounded-xl bg-neutral-100 px-3 py-2 text-sm leading-5 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            style={{ '--transcript-index': index } as React.CSSProperties}
          >
            {line}
          </p>
        ))}
      </div>
    </article>
  );
}

function TraceCard({
  step,
  isActive,
}: {
  step: TraceStep;
  isActive: boolean;
}) {
  if (step.kind === 'call') {
    return <CallCard step={step} isActive={isActive} />;
  }

  return <StandardCard step={step} isActive={isActive} />;
}

export function OperationalTraceWidget() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const activeStep = TRACE_STEPS[activeIndex];
    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => {
        if (current === TRACE_STEPS.length - 1) {
          setCycle((value) => value + 1);
          return 0;
        }

        return current + 1;
      });
    }, activeStep.durationMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeIndex, cycle]);

  const offsetIndex = Math.max(0, activeIndex - 1);

  return (
    <div className="orin-op-viewport relative h-[40rem] overflow-hidden px-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-white to-transparent dark:from-neutral-900" />
      <div
        className="orin-op-track absolute inset-x-7 top-[15rem] flex flex-col"
        style={{ transform: `translateY(-${offsetIndex * 11.5}rem)` }}
      >
        {TRACE_STEPS.map((step, index) => {
          const isVisible = index <= activeIndex;
          const isActive = index === activeIndex;
          const isConnected = index < activeIndex;

          return (
            <div
              key={`${cycle}-${step.kind}-${index}`}
              className={[
                'orin-op-step relative transition-opacity duration-500',
                isVisible ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
            >
              <TraceCard step={step} isActive={isActive} />
              {index < TRACE_STEPS.length - 1 && (
                <div className="ml-10 flex h-8 w-px justify-center">
                  <span
                    className={[
                      'orin-op-connector block w-px origin-top bg-primary-500',
                      isConnected ? 'is-connected' : '',
                    ].join(' ')}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
