import { type ReactNode, useEffect, useReducer, useRef, useState } from 'react';

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

import { Logo } from './Logo';

// ---------------------------------------------------------------------------
// "Always in the loop" — faithful Slack threads that play themselves out.
//
// Each scenario shows the agent doing real work and pausing at an approval
// gate before anything is sent. The header has prev / play-pause / next so you
// can step between scenarios.
// ---------------------------------------------------------------------------

const SLACK_FONT =
  'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

type AuthorId = 'orin' | 'marcus';

interface Person {
  name: string;
  app?: boolean;
  avatarClass: string;
  initials?: string;
  photo?: string;
}

const PEOPLE: Record<AuthorId, Person> = {
  orin: { name: 'Orin', app: true, avatarClass: 'bg-white ring-1 ring-[#e6e6e6]' },
  marcus: { name: 'Marcus Lee', avatarClass: 'bg-[#4f6abf]', photo: '/marcus-lee.png' },
};

interface Beat {
  id: string;
  author: AuthorId;
  time: string;
  text: string;
  approval?: boolean;
}

interface Scenario {
  id: string;
  channel: string;
  members: number;
  beats: Beat[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'po',
    channel: 'norcal-sites',
    members: 12,
    beats: [
      {
        id: 'gen',
        author: 'orin',
        time: '9:14 AM',
        text: 'Received project approval for 1400 Olive St — generating POs.',
      },
      {
        id: 'detail',
        author: 'orin',
        time: '9:14 AM',
        text: 'This project needs 3 POs. Confirmed with Bright Electric (vendor 2) to ship to the Oakland yard, not their main warehouse — it’s down for repairs.',
      },
      {
        id: 'pm',
        author: 'marcus',
        time: '9:15 AM',
        text: 'Confirm the Q3 price increase hasn’t hit yet before you send.',
      },
      {
        id: 'confirm',
        author: 'orin',
        time: '9:15 AM',
        approval: true,
        text: 'Confirmed — still on May pricing. Ready to send all 3.',
      },
      {
        id: 'sent',
        author: 'orin',
        time: '9:16 AM',
        text: 'Sent. Logged to Procore with the approvals attached.',
      },
    ],
  },
  {
    id: 'permit',
    channel: 'permits-bayarea',
    members: 9,
    beats: [
      {
        id: 'approved',
        author: 'orin',
        time: '11:02 AM',
        text: 'Fremont approved the permit for the Mission Blvd site. Scheduling the inspection.',
      },
      {
        id: 'slot',
        author: 'orin',
        time: '11:02 AM',
        text: 'Earliest inspection slot is Thursday 7/11. Holding it for now.',
      },
      {
        id: 'push',
        author: 'marcus',
        time: '11:04 AM',
        text: 'Push a day — the conduit won’t pass till Friday.',
      },
      {
        id: 'rebook',
        author: 'orin',
        time: '11:04 AM',
        approval: true,
        text: 'Rebooked for Friday 7/12 at 9 AM. Confirm with the inspector?',
      },
      {
        id: 'done',
        author: 'orin',
        time: '11:05 AM',
        text: 'Confirmed. Calendar invites sent to the crew and the inspector.',
      },
    ],
  },
  {
    id: 'change-order',
    channel: 'vendor-coordination',
    members: 15,
    beats: [
      {
        id: 'flag',
        author: 'orin',
        time: '2:31 PM',
        text: 'Bright Electric flagged a $3,200 change order on Olive St — extra trenching.',
      },
      {
        id: 'check',
        author: 'orin',
        time: '2:31 PM',
        text: 'Contract allows billing for trenching over 40 ft. They’re claiming 52 ft.',
      },
      {
        id: 'photo',
        author: 'marcus',
        time: '2:33 PM',
        text: 'Get a photo before we approve anything.',
      },
      {
        id: 'verify',
        author: 'orin',
        time: '2:34 PM',
        approval: true,
        text: 'They sent site photos confirming 52 ft. Approve the change order?',
      },
      {
        id: 'updated',
        author: 'orin',
        time: '2:35 PM',
        text: 'Approved. Budget updated in Procore and Bright Electric notified.',
      },
    ],
  },
];

// Timings (ms)
const TYPING_MS = 1100;
const READ_MS = 1500;
const AUTO_APPROVE_MS = 5000;
const FINISHED_PAUSE_MS = 3200;

type Status = 'typing' | 'posted' | 'awaiting' | 'finished';

interface DemoState {
  scenario: number;
  step: number;
  status: Status;
  approved: boolean;
  playing: boolean;
}

type DemoAction =
  | { type: 'TYPING_DONE' }
  | { type: 'ADVANCE' }
  | { type: 'APPROVE' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_SCENARIO'; index: number };

const INITIAL: DemoState = {
  scenario: 0,
  step: 0,
  status: 'typing',
  approved: false,
  playing: true,
};

function reducer(state: DemoState, action: DemoAction): DemoState {
  const beats = SCENARIOS[state.scenario].beats;
  switch (action.type) {
    case 'TYPING_DONE': {
      const beat = beats[state.step];
      return { ...state, status: beat?.approval ? 'awaiting' : 'posted' };
    }
    case 'APPROVE':
      if (state.status !== 'awaiting') return state;
      return { ...state, status: 'posted', approved: true };
    case 'ADVANCE': {
      const next = state.step + 1;
      if (next >= beats.length) return { ...state, status: 'finished' };
      return { ...state, step: next, status: 'typing' };
    }
    case 'RESET':
      return { ...state, step: 0, status: 'typing', approved: false };
    case 'TOGGLE_PLAY':
      return { ...state, playing: !state.playing };
    case 'SET_SCENARIO':
      return {
        ...state,
        scenario: action.index,
        step: 0,
        status: 'typing',
        approved: false,
        playing: true,
      };
    default:
      return state;
  }
}

function Avatar({ author }: { author: AuthorId }) {
  const person = PEOPLE[author];

  if (person.photo) {
    return (
      <img
        src={person.photo}
        alt={person.name}
        className="h-9 w-9 shrink-0 rounded-lg object-cover"
      />
    );
  }

  return (
    <div
      className={
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white ' +
        person.avatarClass
      }
    >
      {author === 'orin' ? (
        <Logo className="h-4 w-auto text-primary" />
      ) : (
        person.initials
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[#9a9a9a]"
          style={{ animation: 'orin-typing 1.2s ease-in-out infinite', animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md text-[#616061] transition-colors hover:bg-[#f1f1f1] hover:text-[#1d1c1d]"
    >
      {children}
    </button>
  );
}

export function InTheLoopDemo() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scenario = SCENARIOS[state.scenario];
  const beats = scenario.beats;

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '-15% 0px -15% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || !state.playing) return;
    let timer: number | undefined;
    if (state.status === 'typing') {
      timer = window.setTimeout(() => dispatch({ type: 'TYPING_DONE' }), TYPING_MS);
    } else if (state.status === 'posted') {
      timer = window.setTimeout(() => dispatch({ type: 'ADVANCE' }), READ_MS);
    } else if (state.status === 'awaiting') {
      timer = window.setTimeout(() => dispatch({ type: 'APPROVE' }), AUTO_APPROVE_MS);
    } else if (state.status === 'finished') {
      timer = window.setTimeout(() => dispatch({ type: 'RESET' }), FINISHED_PAUSE_MS);
    }
    return () => window.clearTimeout(timer);
  }, [active, state.playing, state.scenario, state.step, state.status]);

  const isPosted = (index: number) =>
    index < state.step || (index === state.step && state.status !== 'typing');
  const isAwaiting = (index: number) =>
    index === state.step && state.status === 'awaiting';
  const typingAuthor =
    state.status === 'typing' ? beats[state.step]?.author : undefined;

  const goPrev = () =>
    dispatch({
      type: 'SET_SCENARIO',
      index: (state.scenario - 1 + SCENARIOS.length) % SCENARIOS.length,
    });
  const goNext = () =>
    dispatch({
      type: 'SET_SCENARIO',
      index: (state.scenario + 1) % SCENARIOS.length,
    });

  return (
    <section className="-mt-16 bg-white px-6 pb-20 pt-0 sm:-mt-24 sm:px-10 sm:pb-28 lg:px-12">
      <div ref={containerRef} className="mx-auto w-full max-w-2xl">
        {/* Slack window — sits above the diagram line behind it */}
        <div
          className="relative z-10 overflow-hidden rounded-2xl border border-[#e2e2e2] bg-white text-[#1d1c1d] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.28)]"
          style={{ fontFamily: SLACK_FONT }}
        >
          {/* channel header */}
          <div className="flex items-center gap-2 border-b border-[#e8e8e8] px-4 py-3">
            <span className="text-[15px] font-extrabold text-[#1d1c1d]">
              <span className="text-[#616061]">#</span> {scenario.channel}
            </span>
            <div className="ml-auto flex items-center gap-0.5">
              <ControlButton label="Previous scenario" onClick={goPrev}>
                <ChevronLeft className="h-4 w-4" />
              </ControlButton>
              <ControlButton
                label={state.playing ? 'Pause' : 'Play'}
                onClick={() => dispatch({ type: 'TOGGLE_PLAY' })}
              >
                {state.playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </ControlButton>
              <ControlButton label="Next scenario" onClick={goNext}>
                <ChevronRight className="h-4 w-4" />
              </ControlButton>
            </div>
          </div>

          {/* message area — fixed height, bottom-anchored to avoid layout shift */}
          <div className="flex h-[26rem] flex-col justify-end px-2 pb-2 pt-2 sm:h-[27rem]">
            <div key={state.scenario} className="flex flex-col">
              {beats.map((beat, index) => {
                if (!isPosted(index)) return null;
                const person = PEOPLE[beat.author];
                const grouped =
                  index > 0 && beats[index - 1].author === beat.author;

                return (
                  <div
                    key={beat.id}
                    className="group flex gap-3 rounded-md p-2 hover:bg-[#f8f8f8]"
                  >
                    <div className="w-9 shrink-0">
                      {grouped ? (
                        <span className="block w-9 pt-0.5 text-right text-[10px] leading-5 text-transparent group-hover:text-[#9a9a9a]">
                          {beat.time.replace(/ [AP]M$/, '')}
                        </span>
                      ) : (
                        <Avatar author={beat.author} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {!grouped && (
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-extrabold leading-5 text-[#1d1c1d]">
                            {person.name}
                          </span>
                          {person.app && (
                            <span className="rounded-[3px] bg-[#e8e8e8] px-1 py-px text-[10px] font-bold uppercase leading-[14px] tracking-wide text-[#616061]">
                              App
                            </span>
                          )}
                          <span className="text-[12px] text-[#616061]">
                            {beat.time}
                          </span>
                        </div>
                      )}
                      <p className="text-[15px] font-normal leading-[22px] text-[#1d1c1d]">
                        {beat.text}
                      </p>

                      {beat.approval && (
                        <div className="mt-2">
                          {isAwaiting(index) ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => dispatch({ type: 'APPROVE' })}
                                className="rounded-[4px] bg-[#007a5a] px-3 py-[7px] text-[13px] font-bold text-white transition-colors hover:bg-[#148567]"
                              >
                                Approve &amp; send
                              </button>
                              <button
                                type="button"
                                className="rounded-[4px] border border-[#e0e0e0] bg-white px-3 py-[7px] text-[13px] font-bold text-[#1d1c1d] transition-colors hover:bg-[#f8f8f8]"
                              >
                                Hold
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#007a5a]">
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#007a5a] text-[10px] text-white">
                                ✓
                              </span>
                              Approved by you
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* reserved typing row keeps the bottom edge stable */}
            <div className="flex h-6 items-center gap-2 px-2 text-[13px] text-[#616061]">
              {typingAuthor && (
                <>
                  <TypingDots />
                  <span>{PEOPLE[typingAuthor].name} is typing…</span>
                </>
              )}
            </div>
          </div>

          {/* composer (decorative) */}
          <div className="px-3 pb-3">
            <div className="flex items-center rounded-lg border border-[#bdbdbd] px-3 py-2.5 text-[15px] text-[#8d8d8d]">
              Message #{scenario.channel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
