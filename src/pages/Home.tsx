import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ArrowDown,
  ArrowRight,
  Check,
  Loader2,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from 'slate-ui';

import { JoinUs } from '../components/Hiring';

type Initiative = {
  title: string;
  description: string;
};

const initiatives: Initiative[] = [
  {
    title: "Continual Learning",
    description: "Sample-efficient learning via first-person experience.",
  },
  {
    title: "Long Horizons",
    description: "Letting agents run and learn for decades.",
  },
];

type WorkItem = {
  title: string;
  description: string;
  image: string;
  link?: string;
  type: "product" | "research" | "infrastructure";
};

const workItems: WorkItem[] = [
  {
    title: "Acadia Learning",
    description: "AI tutoring platform that grows with students over time.",
    image: "/book.png",
    link: "https://acadialearning.org",
    type: "product",
  },
  {
    title: "Bedrock",
    description: "Infrastructure for hyper long-horizon agents.",
    image: "/bedrock.png",
    link: "https://docs.bedrock.orinlabs.org",
    type: "infrastructure",
  },
  {
    title: "Generative UIs",
    description: "Generate expressive, stateful, and design-safe UIs.",
    image: "/hand.png",
    link: "https://ui.orinlabs.org",
    type: "research",
  },
  {
    title: "Streaming Memory",
    description: "Memory at the speed of thought.",
    image: "/memory.png",
    link: "https://memory.orinlabs.org",
    type: "research",
  },
  {
    title: "Long-Horizon Agents",
    description:
      "Agents that schedule themselves, wake on events, and remember what matters over time.",
    image: "/plane.png",
    link: "/research/long-horizon-agents",
    type: "research",
  },
  {
    title: "Conversationality",
    description:
      "Voice agents that run independently, speak first, and handle interruptions naturally.",
    image: "/person.png",
    link: "/research/conversationality",
    type: "research",
  },
];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [waitlistForm, setWaitlistForm] = useState({
    name: "",
    company: "",
    useCase: "",
  });
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistStatus("submitting");
    try {
      // TODO: Replace with your actual endpoint
      await fetch("https://api.orinlabs.org/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(waitlistForm),
      });
      setWaitlistStatus("success");
    } catch {
      setWaitlistStatus("error");
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="bg-primary group shadow-sm rounded-xl relative overflow-hidden min-h-[420px] sm:min-h-[520px] lg:min-h-[70vh]">
        <video
          ref={videoRef}
          src="/tree.mp4"
          autoPlay
          muted
          playsInline
          style={{
            filter: "invert(1) brightness(0.40)",
            translate: "0 48px",
            mixBlendMode: "screen",
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col gap-6">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-100">
            Building agents
            <br />
            that <span className="text-white">learn.</span>
          </h1>
          <button
            onClick={() => setWaitlistOpen(true)}
            className="flex items-center gap-2 text-primary-100 font-semibold text-sm sm:text-base hover:bg-primary-100/20 rounded-lg px-2 py-1 -mt-1 transition-colors w-fit cursor-pointer"
          >
            Join the waitlist
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <ArrowDown className="absolute bottom-10 sm:bottom-16 left-1/2 -translate-x-1/2 sm:left-16 sm:translate-x-0 group-hover:translate-y-2 transition-transform w-6 h-6 text-primary-100" />
      </div>

      {/* Initiatives */}
      <div className="flex flex-col items-start" id="initiatives">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full">
          <h2 className="text-4xl sm:text-5xl font-semibold text-neutral-700 dark:text-neutral-300">
            Initiatives
          </h2>

          <hr className="flex-1 hidden sm:block" />
        </div>

        <div className="flex flex-col gap-6 sm:gap-8 w-full mt-6">
          {initiatives.map((initiative, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full py-6 sm:py-8",
                index !== initiatives.length - 1 &&
                  "border-b border-neutral-200 dark:border-neutral-800",
              )}
            >
              <span className="text-neutral-400 dark:text-neutral-600 text-3xl sm:text-4xl font-semibold font-mono shrink-0">
                [{index + 1}]
              </span>
              <div className="flex flex-col gap-4">
                <h3 className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {initiative.title}
                </h3>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                  {initiative.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Work */}
      <div className="flex flex-col items-start w-full" id="our-work">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full mb-6 sm:mb-8">
          <h2 className="text-4xl sm:text-5xl font-semibold text-neutral-700 dark:text-neutral-300">
            Our Work
          </h2>
          <hr className="flex-1 hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {workItems.map((item) => {
            const content = (
              <div
                className={cn(
                  "group relative flex flex-col aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden shadow-sm",
                  "bg-primary hover:shadow-md transition-shadow cursor-pointer border dark:border-neutral-700",
                )}
              >
                {/* Background image layer with screen blend */}
                <div
                  className="dark:hidden absolute -inset-1 bg-cover bg-center mix-blend-screen scale-105 group-hover:scale-115 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${item.image})`,
                    filter: "grayscale(1)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                />

                <div className="absolute inset-0 dark:block hidden">
                  <div className="absolute inset-0 w-full h-full bg-black mix-blend-multiply brightness-150">
                    <div
                      className="w-full h-full bg-cover bg-center mix-blend-screen scale-105 group-hover:scale-115 transition-transform duration-500"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        filter: "grayscale(1) invert(1)",
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-neutral-900 mix-blend-lighten brightness-125" />
                </div>

                {/* Content overlay */}
                <div className="relative z-20 flex flex-col gap-1 justify-between h-full p-4 text-black dark:text-white">
                  <p className="text-xs ml-auto bg-white dark:bg-neutral-700 shadow border dark:border-neutral-600 rounded px-1.5 py-0.5 w-fit capitalize text-neutral-600 dark:text-neutral-300">
                    {item.type}
                  </p>
                  <h3 className="text-xl font-semibold group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            );

            if (!item.link) {
              return <div key={item.title}>{content}</div>;
            }

            const isExternalLink = item.link.startsWith("http");

            return isExternalLink ? (
              <a
                href={item.link}
                key={item.title}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            ) : (
              <Link to={item.link} key={item.title}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Waitlist Modal */}
      {waitlistOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setWaitlistOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className={cn(
              "relative w-full max-w-md bg-white dark:bg-neutral-900",
              "rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Join the waitlist
              </h3>
              <button
                onClick={() => setWaitlistOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {waitlistStatus === "success" ? (
              <div className="flex flex-col items-center justify-center gap-3 p-8">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  You're on the list
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  We'll be in touch soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleWaitlistSubmit}
                className="p-5 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="waitlist-name"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Name
                  </label>
                  <input
                    id="waitlist-name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={waitlistForm.name}
                    onChange={(e) =>
                      setWaitlistForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className={cn(
                      "px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700",
                      "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
                      "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                      "text-sm transition-colors",
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="waitlist-company"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Company
                  </label>
                  <input
                    id="waitlist-company"
                    type="text"
                    required
                    placeholder="Your company"
                    value={waitlistForm.company}
                    onChange={(e) =>
                      setWaitlistForm((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className={cn(
                      "px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700",
                      "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
                      "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                      "text-sm transition-colors",
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="waitlist-usecase"
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    How would you use continual learning agents?
                  </label>
                  <textarea
                    id="waitlist-usecase"
                    required
                    rows={3}
                    placeholder="Tell us about your use case..."
                    value={waitlistForm.useCase}
                    onChange={(e) =>
                      setWaitlistForm((prev) => ({
                        ...prev,
                        useCase: e.target.value,
                      }))
                    }
                    className={cn(
                      "px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700",
                      "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
                      "placeholder:text-neutral-400 dark:placeholder:text-neutral-600",
                      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                      "text-sm transition-colors resize-none",
                    )}
                  />
                </div>

                {waitlistStatus === "error" && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={waitlistStatus === "submitting"}
                  className={cn(
                    "flex items-center justify-center gap-2 bg-primary text-white font-semibold",
                    "py-2.5 px-5 rounded-lg hover:bg-primary-400 transition-colors",
                    "text-sm shadow-sm w-full cursor-pointer mt-1",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
                  )}
                >
                  {waitlistStatus === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Join Us */}
      <JoinUs />
    </>
  );
}
