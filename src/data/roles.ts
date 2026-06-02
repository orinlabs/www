export interface Role {
  slug: string;
  title: string;
  location: string;
  /**
   * Path (relative to /public) of the hero image shown at the top of the role
   * page. TODO(content): swap any of these for role-specific imagery.
   */
  headerImage: string;
  /** Short one-liner shown under the title on the role page. Optional. */
  tagline?: string;
  /**
   * Long-form sections rendered in order. By convention each role has at most
   * one section with `body: string[]` (rendered as a bullet list); everything
   * else uses `body: string`. Use `\n\n` inside a string body to break into
   * multiple paragraphs.
   *
   * TODO(content): fill these in with the real copy for each role.
   */
  sections: Array<{
    heading: string;
    body: string | string[];
  }>;
  /**
   * Optional salary / equity / visa notes shown at the top of the role page.
   * TODO(content): set these or leave blank to hide.
   */
  compensation?: string;
}

/**
 * Visa sponsorship statement rendered in the footer of every role page.
 * Update if our visa stance changes.
 */
export const VISA_NOTE =
  "Orin Labs sponsors employment-based visas for qualified candidates.";

/**
 * Equal Employment Opportunity statement rendered at the bottom of every role
 * page. Boilerplate; review with counsel if our policy ever changes.
 */
export const EEO_STATEMENT =
  "Orin Labs is an equal opportunity employer. We don't discriminate on the basis of race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, genetic information, marital status, military or veteran status, or any other legally protected characteristic.";

/** Company mission, shown as the first section on engineering role pages. */
const MISSION_SECTION = {
  heading: "Our mission",
  body:
    "We are making AI that can build megaprojects: power plants, factories, data centers, and the physical infrastructure civilization runs on. Today this work requires large teams coordinating over long timescales. We are making agents that do that coordination directly.",
};

export const ROLES: Role[] = [
  {
    slug: "research-engineer",
    title: "Research Engineer",
    location: "San Francisco, CA",
    headerImage: "/tree_color.jpeg",
    sections: [
      MISSION_SECTION,
      {
        heading: "What you'll do",
        body:
          "The research that matters most to us comes straight out of deployment: getting agents to multi-task, learn, remember, and operate reliably over long stretches of time. You'll own that work end to end, building agents, training models, and designing the benchmarks, environments, and evals that tell us whether it's working. You'll set research direction with our founders, grounded in real deployment and test data, and translate what we learn into production.",
      },
      {
        heading: "What you'll work on",
        body:
          "Agents forget what they've committed to and what users teach them, so we're building long-horizon learning benchmarks (starting from our [Horizon-1](/research/horizon-1) work) for memory once history overflows the context window. Real work also comes in bursts. Give an agent three tasks at once and it drops most of them, so we need environments for multi-tasking, stakeholder management, requirements-gathering, and scaled caution around irreversible actions. Underneath it all sit open problems we have to crack: temporal reasoning and planning, and a verifiable, evidence-backed model of the state of the world.",
      },
      {
        heading: "What we're looking for",
        body:
          "You've built agents, trained models, and created benchmarks, environments, or evals (ideally all of the above), and you can connect your own work to the long-term goal of getting AI to build in the real world. We're especially excited about current PhDs and post-docs in continual learning, test-time training, long-context architectures, and long-horizon tasks, but we care more about what you've shipped than your credentials.",
      },
    ],
  },
  {
    slug: "infrastructure-engineer",
    title: "Infrastructure Engineer",
    location: "San Francisco, CA",
    headerImage: "/tree_color.jpeg",
    sections: [
      MISSION_SECTION,
      {
        heading: "What you'll do",
        body:
          "Our agents have been running for years, acting independently in the real world, and that only works if the systems underneath them are rock solid. You'll own large parts of that surface area: the training infrastructure that turns research ideas into models, the evaluation harness that tells us whether they're better, the runtime that keeps long-lived agents executing safely, and the deployment and observability layers that let us see what they're doing and why.\n\nReliability here isn't a nice-to-have. An agent that drops a commitment, loses state, or silently fails mid-task is worse than no agent at all, so the bar is high and the failure modes are subtle. You'll work hand in hand with research, since most of what we learn only shows up at scale and over long horizons, and shipping looks like infrastructure that makes the whole team faster while quietly getting more dependable over time.",
      },
      {
        heading: "What we're looking for",
        body:
          "You've built and operated production systems that other people depend on, and you care about the unglamorous parts: observability, failure handling, and the long tail of things that break at 3am. You're comfortable owning a problem end to end, from the infrastructure design down to the on-call reality of keeping it healthy.\n\nExperience with ML or agent infrastructure (training pipelines, inference, eval harnesses, orchestration of long-running stateful workloads) is a strong plus, but we care more about judgment, ownership, and a track record of making complex systems boringly reliable.",
      },
    ],
  },
  {
    slug: "pitch-yourself",
    title: "Pitch Yourself",
    location: "San Francisco, CA",
    headerImage: "/tree_color.jpeg",
    sections: [
      {
        heading: "The pitch",
        body:
          "We hire generalists who can move between research, engineering, and operations. If you've done something exceptional and think Orin is where you should be next, send us a few paragraphs about why.\n\nBe specific: what you'd want to work on, what you've shipped, and what we'd be silly not to fund. We read every submission and reply within a week.",
      },
    ],
  },
];

export function getRoleBySlug(slug: string | undefined): Role | undefined {
  if (!slug) return undefined;
  return ROLES.find((role) => role.slug === slug);
}
