import { ArrowUpRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom'; 

import { BottomHeavyText } from '../components/BottomHeavyText';
import { InViewFade } from '../components/InViewFade';

interface ResearchPost {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  path: string;
}

const RESEARCH_POSTS: ResearchPost[] = [
  {
    id: "horizon",
    title: "Introducing Horizon",
    description:
      "Today, we're releasing a preview of Horizon, our benchmark that measures an agent's ability to acquire learnings from a long history and apply them to a task.",
    date: "June 2026",
    author: "Bryan Houlton · Aayush Gupta",
    path: "/research/horizon",
  },
  {
    id: "long-horizon-agents",
    title: "Building Long-Horizon Agents",
    description:
      "We present a method for building long-horizon agents that work continuously over time, schedule their own activities, and create workflows dynamically. Unlike traditional agents that only respond to user input, long-horizon agents actively pursue goals without constant prompting.",
    date: "October 2025",
    author: "Orin Labs",
    path: "/research/long-horizon-agents",
  },
  {
    id: "conversationality",
    title: "Conversationality",
    description:
      "We explore how to build proactive voice agents that work independently of user input. By flipping the traditional voice pipeline, we create agents that can speak first, handle interruptions, and maintain natural conversation flow.",
    date: "November 2025",
    author: "Orin Labs",
    path: "/research/conversationality",
  },
];

const RESEARCH_POST_TONES = [
  "bg-neutral-950 text-white",
  "bg-primary-300 text-neutral-950",
  "bg-neutral-100 text-neutral-950",
];

const RESEARCH_HERO_COPY =
  "We are training AI to run megaprojects. We research continual learning, long-horizon tasks, and agent coordination.";

export default function Research() {
  return (
    <main className="flex w-full flex-col px-6 pt-10 sm:px-10 sm:pt-24 lg:px-12">
      <section className="grid gap-8 pb-10 lg:min-h-[58svh] sm:gap-10 sm:pb-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <div>
          <h1 className="mt-5 max-w-5xl text-[clamp(3.85rem,17vw,6rem)] font-semibold leading-[0.86] tracking-[-0.055em] text-neutral-950 sm:text-[clamp(4.25rem,10vw,7.5rem)] lg:text-[clamp(3.25rem,7.4vw,7.5rem)]">
            Safe<br /> Reliable<br />Autonomous
          </h1>
        </div>
        <div>
          <p className="w-full text-xl leading-[1.28] text-neutral-700 sm:text-2xl sm:leading-[1.25] lg:text-right">
            <span className="lg:hidden">{RESEARCH_HERO_COPY}</span>
            <BottomHeavyText className="hidden lg:block">
              {RESEARCH_HERO_COPY}
            </BottomHeavyText>
          </p>
        </div>
      </section>

      <section className="relative left-1/2 mt-6 grid w-screen -translate-x-1/2 gap-0 sm:mt-8">
        {RESEARCH_POSTS.map((post, index) => (
          <Link
            key={post.id}
            to={post.path}
            className={
              "group transition-colors " +
              RESEARCH_POST_TONES[index % RESEARCH_POST_TONES.length]
            }
          >
            <div className="grid min-h-72 w-full gap-8 px-10 py-14 sm:px-14 sm:py-16 lg:grid-cols-[0.28fr_1fr_auto] lg:items-start lg:px-16">
              <div className="flex items-center gap-3 text-sm opacity-60">
                <span>{post.date}</span>
              </div>

              <InViewFade>
                <h2 className="max-w-4xl text-3xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
                  {post.title}
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-7 opacity-75 sm:text-lg sm:leading-8">
                  {post.description}
                </p>
              </InViewFade>

              <ArrowUpRightIcon className="h-7 w-7 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
