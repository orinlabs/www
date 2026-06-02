import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { JoinUs } from '../components/Hiring';

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
    id: "horizon-1",
    title: "Introducing Horizon-1",
    description:
      "Today, we're releasing a preview of Horizon-1, our benchmark that measures an agent's ability to acquire learnings from a long history and apply them to a task.",
    date: "June 2026",
    author: "Orin Labs",
    path: "/research/horizon-1",
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

export default function Research() {
  return (
    <>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Research</h1>
        <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Exploring the frontiers of AI agents, autonomous systems, and the
          future of human-computer interaction.
        </p>
      </div>

      {/* Research Posts */}
      <div className="space-y-6 sm:space-y-8">
        {RESEARCH_POSTS.map((post) => (
          <article
            key={post.id}
            className="border-b border-neutral-200 dark:border-neutral-800 pb-8 last:border-b-0"
          >
            <Link
              to={post.path}
              className="block group hover:bg-neutral-200 dark:hover:bg-neutral-800 -m-3 sm:-m-4 p-3 sm:p-4 rounded-lg transition-colors"
            >
              <div className="flex flex-col space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Link
                      to="/"
                      className="text-primary underline hover:no-underline"
                    >
                      {post.author}
                    </Link>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
                  {post.description}
                </p>
                <div className="flex items-center gap-1 text-primary font-medium">
                  <span>Read more</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Empty State for Future Posts */}
      {RESEARCH_POSTS.length === 0 && (
        <div className="text-center py-16">
          <div className="text-neutral-400 dark:text-neutral-600 text-lg mb-4">
            No research posts yet
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Check back soon for our latest research and insights.
          </p>
        </div>
      )}

      <hr className="my-12" />

      <JoinUs />
    </>
  );
}
