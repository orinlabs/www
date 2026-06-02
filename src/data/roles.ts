export interface Role {
  slug: string;
  title: string;
  location: string;
  /**
   * Path (relative to /public) of the hero image shown at the top of the role
   * page. TODO(content): swap any of these for role-specific imagery.
   */
  headerImage: string;
  /** Short one-liner shown under the title on the role page. */
  tagline: string;
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

export const ROLES: Role[] = [
  {
    slug: "research-engineer",
    title: "Research Engineer",
    location: "San Francisco, CA",
    headerImage: "/tree_color.jpeg",
    tagline:
      "Push the frontier of long-horizon agent training, architectures, and evaluation.",
    sections: [
      {
        heading: "What you'll do",
        body:
          "TODO(content): a paragraph on the kind of research this person owns — the open questions you want them attacking, the systems they'll touch, and what shipping looks like.\n\nTODO(content): a second paragraph on how they'll work with the rest of the team, the cadence of experiments to deployments, and what 'good' looks like in their first year.",
      },
      {
        heading: "What we're looking for",
        body: [
          "TODO: requirement 1",
          "TODO: requirement 2",
          "TODO: requirement 3",
        ],
      },
    ],
  },
  {
    slug: "infrastructure-engineer",
    title: "Infrastructure Engineer",
    location: "San Francisco, CA",
    headerImage: "/tree_color.jpeg",
    tagline:
      "Build the systems that let our agents run continuously, reliably, and at scale.",
    sections: [
      {
        heading: "What you'll do",
        body:
          "TODO(content): describe the surface area — training infra, evaluation harness, agent runtime, deployment, observability — and which pieces this person will own end-to-end.\n\nTODO(content): a second paragraph on the bar for reliability and performance, how the role interacts with research, and what shipping looks like.",
      },
      {
        heading: "What we're looking for",
        body: [
          "TODO: requirement 1",
          "TODO: requirement 2",
          "TODO: requirement 3",
        ],
      },
    ],
  },
  {
    slug: "operations-lead",
    title: "Operations Lead",
    location: "San Francisco, CA",
    headerImage: "/tree_color.jpeg",
    tagline:
      "Own the day-to-day operations of a small, ambitious team shipping autonomous systems.",
    sections: [
      {
        heading: "What you'll do",
        body:
          "TODO(content): scope of ownership — finance, hiring, legal, vendors, office, recruiting, anything else that isn't research or engineering.\n\nTODO(content): how the role evolves as the team grows, who they work with, and what success looks like in the first six months.",
      },
      {
        heading: "What we're looking for",
        body: [
          "TODO: requirement 1",
          "TODO: requirement 2",
          "TODO: requirement 3",
        ],
      },
    ],
  },
  {
    slug: "pitch-yourself",
    title: "Pitch Yourself",
    location: "San Francisco, CA",
    headerImage: "/tree_color.jpeg",
    tagline:
      "Don't see your role? Tell us why we should build one for you.",
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
