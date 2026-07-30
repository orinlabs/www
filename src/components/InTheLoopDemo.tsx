import { type ReactNode, useEffect, useReducer, useRef, useState } from 'react';

import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

import { Logo } from './Logo';

// ---------------------------------------------------------------------------
// "Always in the loop" — faithful Slack threads that play themselves out.
//
// Each scenario shows the agent monitoring, checking, and drafting work, then
// staging it for a human to review and execute — the agent never takes the
// consequential action itself. The header has prev / play-pause / next so you
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
        text: 'Just saw 1400 Olive St got approved in Procore. Drafting the POs now.',
      },
      {
        id: 'detail',
        author: 'orin',
        time: '9:14 AM',
        text: 'Do we need to ship the units to the Oakland yard like last time? @Marcus',
      },
      {
        id: 'pm',
        author: 'marcus',
        time: '9:15 AM',
        text: 'Yeah, the main yard is still being repaired.',
      },
      {
        id: 'confirm',
        author: 'orin',
        time: '9:15 AM',
        approval: true,
        text: 'Got it, I\'ll use the Oakland address. [[Draft POs]] are ready for your review.',
      },
      {
        id: 'sent',
        author: 'orin',
        time: '9:16 AM',
        text: 'They\'re staged in your Procore queue with everything filled in — one click to send when you\'re ready.',
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
        text: 'Fremont emailed us the approval for Mission Blvd site, so I pulled the city\'s inspection calendar.',
      },
      {
        id: 'slot',
        author: 'orin',
        time: '11:02 AM',
        text: 'Earliest inspection slot is Thursday 7/11 — flagging it before it fills up.',
      },
      {
        id: 'push',
        author: 'marcus',
        time: '11:04 AM',
        text: 'Push a day — the conduit won\'t pass till Friday.',
      },
      {
        id: 'rebook',
        author: 'orin',
        time: '11:04 AM',
        approval: true,
        text: 'Friday 7/12 at 9 AM is open. I drafted the [[booking request]] and confirmation texts for the inspector and crew.',
      },
      {
        id: 'done',
        author: 'orin',
        time: '11:05 AM',
        text: 'All set — everything\'s queued for you to send, and I\'ll watch for the confirmations to come back.',
      },
    ],
  },
  {
    id: 'change-order',
    channel: 'olive-st-site',
    members: 15,
    beats: [
      {
        id: 'flag',
        author: 'orin',
        time: '2:31 PM',
        text: 'Bright Electric flagged a $3,200 [[change order]] on Olive St. Extra trenching.',
      },
      {
        id: 'check',
        author: 'orin',
        time: '2:31 PM',
        text: 'Our [[contract]] allows billing for trenching over 40 ft. They\'re claiming 52 ft.',
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
        text: 'They sent [[site photos]] confirming 52 ft. I put together the [[CO packet]] with the photos and contract clause.',
      },
      {
        id: 'updated',
        author: 'orin',
        time: '2:35 PM',
        text: 'It\'s attached to the change order in Procore with the budget impact calculated — ready for your signature.',
      },
    ],
  },
  {
    id: 'battery-factory',
    channel: 'cell-plant-buildout',
    members: 18,
    beats: [
      {
        id: 'submittal',
        author: 'orin',
        time: '8:47 AM',
        text: 'Caught an issue in the dry room [[submittal]] — it specs a -40°C dew point, but our cell line equipment requires -50°C.',
      },
      {
        id: 'infer',
        author: 'orin',
        time: '8:47 AM',
        text: 'If that goes back for revision, dry room certification likely pushes ~2 weeks, which slips the cell line install past its Oct 6 start. @Marcus',
      },
      {
        id: 'reply',
        author: 'marcus',
        time: '8:49 AM',
        text: 'Yeah, that tracks. The install crew can\'t start until the room certifies.',
      },
      {
        id: 'draft',
        author: 'orin',
        time: '8:50 AM',
        approval: true,
        text: 'I drafted the revision comments and a [[proposed schedule]] moving the install to Oct 20, with downstream milestones cascaded.',
      },
      {
        id: 'done',
        author: 'orin',
        time: '8:51 AM',
        text: 'Both are staged in Sitetracker as pending — nothing changes until you publish, and the slip is flagged in the weekly report draft.',
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

// Inline markup, Slack-blue:
//   • wrap any span in [[ ]] for a blue link  → "Logged to [[Procore]]."
//   • @mentions render as blue mention pills   → "...like last time? @Marcus"
function renderRichText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\[\[(.+?)\]\]|(@[\w-]+)/g;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(
        <span key={key++} className="cursor-pointer text-[#1264a3] hover:underline">
          {match[1]}
        </span>,
      );
    } else {
      parts.push(
        <span
          key={key++}
          className="cursor-pointer rounded-[3px] bg-[#1264a3]/10 px-0.5 font-medium text-[#1264a3] hover:underline"
        >
          {match[2]}
        </span>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
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
      timer = window.setTimeout(
        () =>
          dispatch({
            type: 'SET_SCENARIO',
            index: (state.scenario + 1) % SCENARIOS.length,
          }),
        FINISHED_PAUSE_MS,
      );
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
    <section className="mt-4 bg-white px-3 pb-20 pt-0 sm:-mt-24 sm:px-10 sm:pb-28 lg:px-12">
      <div ref={containerRef} className="mx-auto w-full max-w-2xl">
        {/* Slack window — sits above the diagram line behind it */}
        <div
          className="relative z-10 overflow-hidden rounded-2xl border border-[#e2e2e2] bg-white text-[#1d1c1d] shadow-[0_16px_34px_-22px_rgba(0,0,0,0.28)] sm:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.28)]"
          style={{ fontFamily: SLACK_FONT }}
        >
          {/* channel header */}
          <div className="flex items-center gap-2 border-b border-[#e8e8e8] bg-white px-4 py-3">
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
                        {renderRichText(beat.text)}
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
                                Looks good
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
