import {
  useEffect,
  useRef,
} from 'react';

import { ArrowDown } from 'lucide-react';
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Play at half speed
    }
  }, []);

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
            that learn.
          </h1>
        </div>

        <ArrowDown className="absolute bottom-10 sm:bottom-16 left-1/2 -translate-x-1/2 sm:left-16 sm:translate-x-0 group-hover:translate-y-2 transition-transform w-6 h-6 text-primary-100" />
      </div>

      {/* Quote */}
      <blockquote className="max-w-3xl mx-auto text-center">
        <p className="text-2xl sm:text-3xl lg:text-4xl text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
          "A teacher is someone who stands with you in the dark and holds their
          flashlight just long enough for you to find your own."
        </p>
        <cite className="block mt-6 text-base sm:text-lg text-neutral-500 dark:text-neutral-500 not-italic">
          — Steve Jobs
        </cite>
      </blockquote>

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

      {/* Join Us */}
      <JoinUs />
    </>
  );
}
