import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  Lock,
  Network,
  Radio,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

const PLATFORM_STEPS = [
  {
    nav: 'Agents',
    title: 'Visibility into every agent.',
    body:
      'One overview of every agent you have running, the work they are moving, and which monitors have alerted — all in a single operating view.',
  },
  {
    nav: 'Agent detail',
    title: 'See exactly what an agent is doing.',
    body:
      'Click into any agent to follow what it has done, what it is working on right now, and what it plans to do next — with the source context behind every step.',
  },
  {
    nav: 'Access',
    title: 'Secure, controlled access to your systems.',
    body:
      'Provision the tools an agent can touch — email, Slack, SMS, calling, Drive, Procore, Salesforce, Sitetracker — and revoke any of them the moment you need to.',
  },
  {
    nav: 'Monitors',
    title: 'Catch issues before they happen.',
    body:
      'Build monitors that watch any or all of your agents on a schedule or a semantic trigger. When one fires, the right people get an alert sized to its severity.',
  },
];

const AGENTS = [
  { name: 'EV install agent', state: 'Calling contractor', risk: 'Low', tone: 'bg-effect-rag' },
  { name: 'Permit agent', state: 'Waiting on city reply', risk: 'Watch', tone: 'bg-effect-claude' },
  { name: 'Bid-out agent', state: 'Comparing quotes', risk: 'Approval', tone: 'bg-effect-codex' },
  { name: 'Materials agent', state: 'Flagged late delivery', risk: 'High', tone: 'bg-effect-openclaw' },
];

const AGENT_TIMELINE: Array<{ phase: string; label: string; time: string; tone: string }> = [
  { phase: 'Done', label: 'Found the gate code in kickoff notes', time: '06:36', tone: 'text-success-600 dark:text-success-300' },
  { phase: 'Done', label: 'Called the contractor and shared access', time: '06:39', tone: 'text-success-600 dark:text-success-300' },
  { phase: 'Doing now', label: 'Posting revised inspection window for approval', time: 'Now', tone: 'text-effect-rag' },
  { phase: 'Planned', label: 'Confirm crew ETA, then update the schedule', time: 'Next', tone: 'text-neutral-500 dark:text-neutral-400' },
];

const INTEGRATIONS: Array<{ name: string; status: 'Granted' | 'Revoked' }> = [
  { name: 'Email', status: 'Granted' },
  { name: 'Slack', status: 'Granted' },
  { name: 'SMS', status: 'Granted' },
  { name: 'Calling', status: 'Granted' },
  { name: 'Drive', status: 'Granted' },
  { name: 'Procore', status: 'Granted' },
  { name: 'Salesforce', status: 'Revoked' },
  { name: 'Sitetracker', status: 'Granted' },
];

const MONITORS: Array<{ name: string; scope: string; trigger: string; severity: 'High' | 'Medium' | 'Low' }> = [
  { name: 'Permit gone stale', scope: 'All permit agents', trigger: 'Every 4h', severity: 'High' },
  { name: 'Material delivery slip', scope: '6 agents', trigger: 'Semantic trigger', severity: 'High' },
  { name: 'Approval waiting > 24h', scope: 'All agents', trigger: 'Every 1h', severity: 'Medium' },
  { name: 'No vendor reply', scope: 'Bid-out agents', trigger: 'Every 12h', severity: 'Low' },
];

const SEVERITY_TONE: Record<string, string> = {
  High: 'bg-effect-openclaw',
  Medium: 'bg-effect-claude',
  Low: 'bg-effect-rag',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function OverviewView({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="grid flex-1 grid-cols-[1fr_16rem] overflow-hidden">
      <main className="min-w-0 border-r border-neutral-200 p-5 dark:border-neutral-800">
        <div className="grid grid-cols-3 gap-3">
          {[
            ['42', 'Running'],
            ['7', 'Need approval'],
            ['3', 'Monitors firing'],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={
                'border p-3 transition-colors ' +
                (index === 0
                  ? 'border-effect-rag/30 bg-effect-rag/10'
                  : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900')
              }
            >
              <p className="text-2xl font-semibold">{value}</p>
              <p className="text-xs text-neutral-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 overflow-hidden border border-neutral-200 dark:border-neutral-800">
          <div className="grid grid-cols-[1fr_10rem_6rem] bg-neutral-100 px-3 py-2 text-xs text-neutral-500 dark:bg-neutral-900">
            <span>Agent</span>
            <span>Status</span>
            <span>Risk</span>
          </div>
          {AGENTS.map((agent, index) => (
            <div
              key={agent.name}
              className={
                'grid grid-cols-[1fr_10rem_6rem] items-center border-t px-3 py-3 text-sm transition-colors dark:border-neutral-800 ' +
                (index === activeIndex
                  ? 'border-effect-rag/20 bg-effect-rag/10'
                  : 'border-neutral-200')
              }
            >
              <div className="flex items-center gap-3">
                <span className={'h-2.5 w-2.5 rounded-full ' + agent.tone} />
                <span className="font-medium">{agent.name}</span>
              </div>
              <span className="text-neutral-500 dark:text-neutral-400">{agent.state}</span>
              <span>{agent.risk}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-xs text-neutral-500">Connected tools</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Email', 'Slack', 'Procore', 'Salesforce'].map((tool) => (
                <span
                  key={tool}
                  className="border border-neutral-200 bg-white px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-950"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div className="border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-xs text-neutral-500">Human queue</p>
            <p className="mt-3 text-sm">Approve revised inspection window for EV install.</p>
          </div>
        </div>
      </main>

      <aside className="bg-neutral-50 p-4 dark:bg-neutral-900">
        <p className="text-xs text-neutral-500">Monitors firing</p>
        <div className="mt-4 grid gap-3">
          {[
            ['Late material', 'High', AlertTriangle],
            ['City reply pending', 'Watch', Clock],
            ['Gate access fixed', 'Closed', CheckCircle2],
          ].map(([title, status, Icon]) => {
            const AlertIcon = Icon as LucideIcon;

            return (
              <div
                key={title as string}
                className="border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <div className="flex items-center justify-between gap-2">
                  <AlertIcon className="h-4 w-4 text-effect-rag" />
                  <span className="text-xs text-neutral-500">{status as string}</span>
                </div>
                <p className="mt-3 text-sm font-medium">{title as string}</p>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

function AgentDetailView() {
  return (
    <div className="flex-1 overflow-hidden p-5">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-effect-rag" />
          <div>
            <p className="text-base font-semibold">EV install agent</p>
            <p className="text-xs text-neutral-500">Riverside DC fast-charge site</p>
          </div>
        </div>
        <span className="rounded-full bg-effect-rag/10 px-3 py-1 text-xs font-medium text-effect-rag">
          Active
        </span>
      </div>

      <div className="mt-5 grid gap-3">
        {AGENT_TIMELINE.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[6.5rem_1fr_4rem] items-center border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className={'text-xs font-semibold uppercase tracking-wide ' + item.tone}>
              {item.phase}
            </span>
            <span className="text-sm">{item.label}</span>
            <span className="text-right text-xs text-neutral-500">{item.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs text-neutral-500">Source context</p>
        <p className="mt-2 text-sm">
          Gate code pulled from kickoff notes · Contractor thread in Email · Schedule synced to Procore.
        </p>
      </div>
    </div>
  );
}

function AccessView() {
  return (
    <div className="flex-1 overflow-hidden p-5">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <div>
          <p className="text-base font-semibold">System access</p>
          <p className="text-xs text-neutral-500">Grant or revoke any system at any time</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
          <Lock className="h-3.5 w-3.5" />
          Audit logged
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {INTEGRATIONS.map((tool) => {
          const granted = tool.status === 'Granted';

          return (
            <div
              key={tool.name}
              className="flex items-center justify-between border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <span className="text-sm font-medium">{tool.name}</span>
              <span
                className={
                  'inline-flex items-center gap-1.5 text-xs font-medium ' +
                  (granted
                    ? 'text-effect-rag'
                    : 'text-neutral-400 dark:text-neutral-500')
                }
              >
                <span
                  className={
                    'h-2 w-2 rounded-full ' + (granted ? 'bg-effect-rag' : 'bg-neutral-300 dark:bg-neutral-600')
                  }
                />
                {tool.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonitorsView() {
  return (
    <div className="flex-1 overflow-hidden p-5">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
        <div>
          <p className="text-base font-semibold">Monitors</p>
          <p className="text-xs text-neutral-500">Watching across agents · alerts by severity</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-error-50 px-3 py-1 text-xs font-medium text-error-600 dark:bg-error-950/40 dark:text-error-300">
          <Bell className="h-3.5 w-3.5" />
          2 firing
        </span>
      </div>

      <div className="mt-5 overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <div className="grid grid-cols-[1fr_9rem_8rem_5rem] bg-neutral-100 px-3 py-2 text-xs text-neutral-500 dark:bg-neutral-900">
          <span>Monitor</span>
          <span>Applies to</span>
          <span>Runs</span>
          <span>Severity</span>
        </div>
        {MONITORS.map((monitor) => (
          <div
            key={monitor.name}
            className="grid grid-cols-[1fr_9rem_8rem_5rem] items-center border-t border-neutral-200 px-3 py-3 text-sm dark:border-neutral-800"
          >
            <span className="font-medium">{monitor.name}</span>
            <span className="text-neutral-500 dark:text-neutral-400">{monitor.scope}</span>
            <span className="text-neutral-500 dark:text-neutral-400">{monitor.trigger}</span>
            <span className="inline-flex items-center gap-1.5 text-xs">
              <span className={'h-2 w-2 rounded-full ' + SEVERITY_TONE[monitor.severity]} />
              {monitor.severity}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs text-neutral-500">Latest alert · emailed to the team</p>
        <p className="mt-2 text-sm">
          <span className="font-medium text-error-600 dark:text-error-300">High ·</span> Material delivery for
          Riverside slipped two days. Two agents notified, PM emailed.
        </p>
      </div>
    </div>
  );
}

function DashboardView({ activeIndex }: { activeIndex: number }) {
  if (activeIndex === 1) {
    return <AgentDetailView />;
  }
  if (activeIndex === 2) {
    return <AccessView />;
  }
  if (activeIndex === 3) {
    return <MonitorsView />;
  }
  return <OverviewView activeIndex={activeIndex} />;
}

export function PlatformScrollSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(rect.height - window.innerHeight, 1);
      setProgress(clamp(-rect.top / scrollableDistance, 0, 1));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const activeIndex = clamp(
    Math.floor(progress * PLATFORM_STEPS.length),
    0,
    PLATFORM_STEPS.length - 1,
  );
  const activeStep = PLATFORM_STEPS[activeIndex];

  return (
    <section ref={sectionRef} className="relative md:h-[320svh]">
      <div className="grid gap-3 md:hidden">
        <div className="bg-neutral-950 p-6 text-white">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/45">
            Orin Control
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-[0.96] tracking-[-0.04em]">
            The operating view for agents.
          </h2>
        </div>

        {PLATFORM_STEPS.map((step, index) => (
          <article
            key={step.title}
            className={
              'p-6 ' +
              (index === 0
                ? 'bg-effect-rag text-white'
                : index === 1
                  ? 'bg-neutral-100 text-neutral-950'
                  : index === 2
                    ? 'bg-effect-codex text-white'
                    : 'bg-neutral-950 text-white')
            }
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] opacity-55">
                {step.nav}
              </p>
              <p className="font-mono text-sm opacity-45">
                {String(index + 1).padStart(2, '0')}
              </p>
            </div>
            <h3 className="mt-8 text-3xl font-semibold leading-[1.02] tracking-[-0.035em]">
              {step.title}
            </h3>
            <p className="mt-4 text-base leading-7 opacity-75">
              {step.body}
            </p>
          </article>
        ))}
      </div>

      <div className="sticky top-0 hidden h-svh items-center gap-10 overflow-visible md:grid md:grid-cols-[0.78fr_1.22fr] md:gap-16 lg:gap-24 xl:gap-32">
        <div className="relative z-10 min-h-[25rem]">
          {PLATFORM_STEPS.map((step, index) => {
            const offset = index - activeIndex;

            return (
              <div
                key={step.title}
                className="absolute inset-x-0 top-1/2 max-w-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: offset === 0 ? 1 : 0,
                  transform: 'translateY(calc(-50% + ' + offset * 4 + 'rem))',
                }}
              >

                <h2 className="mt-4 text-4xl font-semibold leading-[1.02] text-neutral-950 dark:text-neutral-50 md:text-6xl">
                  {step.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-neutral-700 dark:text-neutral-300">
                  {step.body}
                </p>
              </div>
            );
          })}
        </div>

        <div className="relative min-h-[42rem] md:h-svh md:min-h-0">
          <div className="absolute -right-28 top-1/2 h-[31.25rem] max-h-[calc(100svh-6rem)] w-[50rem] -translate-y-1/2 overflow-hidden rounded-[1.125rem] border border-neutral-300 bg-white shadow-2xl shadow-neutral-900/15 dark:border-neutral-700 dark:bg-neutral-950 xl:-right-48 xl:h-[36rem] xl:w-[57.6rem] 2xl:-right-40 2xl:h-[40rem] 2xl:w-[64rem]">
            <div className="h-[138.889%] w-[138.889%] origin-top-left scale-[0.72]">
              <div className="grid h-full grid-cols-[14rem_1fr] text-neutral-950 dark:text-neutral-50">
                <aside className="relative border-r border-neutral-200 bg-neutral-950 p-4 text-white dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-effect-rag" />
                    <div>
                      <p className="text-sm font-semibold">Orin</p>
                      <p className="text-xs text-white/45">Control</p>
                    </div>
                  </div>

                  <nav className="mt-8 grid gap-1 text-sm text-white/60">
                    {[
                      [PLATFORM_STEPS[0].nav, Radio],
                      [PLATFORM_STEPS[1].nav, ClipboardCheck],
                      [PLATFORM_STEPS[2].nav, Network],
                      [PLATFORM_STEPS[3].nav, AlertTriangle],
                      ['Security', Lock],
                    ].map(([label, Icon], index) => {
                      const NavIcon = Icon as LucideIcon;

                      return (
                        <div
                          key={label as string}
                          className={
                            'flex items-center gap-2 px-3 py-2 transition-colors ' +
                            (index === activeIndex
                              ? 'bg-white text-neutral-950'
                              : 'text-white/60')
                          }
                        >
                          <NavIcon className="h-4 w-4" />
                          <span>{label as string}</span>
                        </div>
                      );
                    })}
                  </nav>

                  <div className="absolute bottom-4 left-4 right-4 border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-white/45">Permission set</p>
                    <p className="mt-2 text-sm text-white">
                      Calls and vendor emails require audit logging.
                    </p>
                  </div>
                </aside>

                <div className="flex min-w-0 flex-col">
                  <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950">
                    <div>
                      <p className="text-xs text-neutral-500">Operations</p>
                      <h3 className="text-2xl font-semibold">{activeStep.nav}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {[Eye, Bell, ShieldCheck].map((Icon, index) => (
                        <div
                          key={index}
                          className="flex h-9 w-9 items-center justify-center border border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      ))}
                    </div>
                  </header>

                  <DashboardView activeIndex={activeIndex} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
