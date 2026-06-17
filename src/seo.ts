// Single source of truth for per-route head metadata + schema.org JSON-LD.
// Consumed at build time by entry-server.tsx (SSR) so the prerendered HTML
// ships a real <title>, description, author, canonical URL, and structured
// data for every public route. This is what fixes the readability tool's
// "structured data" and "citation readiness" scores.

import { ROLES, type Role } from './data/roles.ts';

const SITE_URL = 'https://orinlabs.ai';
const OG_IMAGE = `${SITE_URL}/og.png`;
const HORIZON_OG_IMAGE = `${SITE_URL}/horizon-og.png`;
const AUTHOR = 'Orin Labs';

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Orin Labs',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: [
    'https://x.com/0rinlabs',
    'https://www.linkedin.com/company/104572054/',
  ],
};

interface RouteMeta {
  title: string;
  description: string;
  // Shorter variant for social cards (og:/twitter:); platforms truncate around
  // ~125 chars. Falls back to `description` when omitted.
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: object;
}

// Used for schema.org (no strict length limit there).
const HORIZON_DESCRIPTION =
  "Horizon is a benchmark that measures an agent's ability to learn from past experience. Each of its 195 tasks requires understanding months of real customer interactions across millions of tokens to succeed.";
// SERP-optimized meta description (~150 chars).
const HORIZON_META_DESCRIPTION =
  "Horizon is a benchmark measuring an AI agent's ability to learn from past experience across 195 tasks drawn from months of real customer interactions.";
// Social-card description (~125 chars).
const HORIZON_OG_DESCRIPTION =
  'Horizon measures how well AI agents learn from past experience — 195 tasks drawn from months of real customer interactions.';

const STATIC_META: Record<string, RouteMeta> = {
  '/': {
    title: 'Orin Labs — Operational Intelligence',
    description:
      'Orin Labs is building AI agents that act autonomously in the world, combining long-horizon training with new architectures, benchmarks, environments, safety research, and real deployments.',
    jsonLd: {
      '@context': 'https://schema.org',
      ...ORGANIZATION,
      description:
        'Orin Labs is building AI agents that participate autonomously in the world.',
    },
  },
  '/research': {
    title: 'Research — Orin Labs',
    description:
      'Exploring the frontiers of AI agents, autonomous systems, and the future of human-computer interaction.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Research',
      url: `${SITE_URL}/research`,
      description:
        'Research from Orin Labs on AI agents, autonomous systems, and continual learning.',
      isPartOf: { '@type': 'WebSite', name: 'Orin Labs', url: SITE_URL },
      publisher: ORGANIZATION,
    },
  },
  '/research/horizon': {
    title: 'Introducing Horizon | Orin Labs',
    description: HORIZON_META_DESCRIPTION,
    ogDescription: HORIZON_OG_DESCRIPTION,
    ogType: 'article',
    ogImage: HORIZON_OG_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Dataset',
          '@id': `${SITE_URL}/research/horizon#dataset`,
          name: 'Horizon',
          description: HORIZON_DESCRIPTION,
          url: `${SITE_URL}/research/horizon`,
          creator: ORGANIZATION,
          publisher: ORGANIZATION,
          sameAs: [
            'https://github.com/orinlabs/horizon-1',
            'https://huggingface.co/datasets/orinlabs/horizon-1-example-traces',
          ],
          keywords: [
            'AI agents',
            'continual learning',
            'long-horizon agents',
            'benchmark',
            'LLM evaluation',
            'agent memory',
          ],
          variableMeasured: 'task pass rate',
        },
        {
          '@type': 'ScholarlyArticle',
          '@id': `${SITE_URL}/research/horizon#article`,
          headline: 'Introducing Horizon',
          name: 'Introducing Horizon',
          description: HORIZON_DESCRIPTION,
          author: ORGANIZATION,
          publisher: ORGANIZATION,
          datePublished: '2026-06-01',
          dateModified: '2026-06-15',
          url: `${SITE_URL}/research/horizon`,
          image: HORIZON_OG_IMAGE,
          isPartOf: { '@type': 'WebSite', name: 'Orin Labs', url: SITE_URL },
          about: { '@id': `${SITE_URL}/research/horizon#dataset` },
        },
      ],
    },
  },
  '/research/long-horizon-agents': {
    title: 'Building Long-Horizon Agents | Orin Labs',
    description:
      'We present a method for building long-horizon agents that work continuously over time, schedule their own activities, and create workflows dynamically.',
    ogType: 'article',
    jsonLd: articleJsonLd({
      slug: 'long-horizon-agents',
      headline: 'Building Long-Horizon Agents',
      description:
        'We present a method for building long-horizon agents that work continuously over time, schedule their own activities, and create workflows dynamically.',
      datePublished: '2025-10-01',
    }),
  },
  '/research/conversationality': {
    title: 'Conversationality | Orin Labs',
    description:
      'We explore how to build proactive voice agents that work independently of user input, that can speak first, handle interruptions, and maintain natural conversation flow.',
    ogType: 'article',
    jsonLd: articleJsonLd({
      slug: 'conversationality',
      headline: 'Conversationality',
      description:
        'We explore how to build proactive voice agents that work independently of user input, that can speak first, handle interruptions, and maintain natural conversation flow.',
      datePublished: '2025-11-01',
    }),
  },
  '/privacy': {
    title: 'Privacy Policy — Orin Labs',
    description: 'How Orin Labs collects, uses, and protects your information.',
    jsonLd: webPageJsonLd('Privacy Policy', `${SITE_URL}/privacy`),
  },
  '/terms': {
    title: 'Terms of Service — Orin Labs',
    description: 'The terms that govern your use of Orin Labs.',
    jsonLd: webPageJsonLd('Terms of Service', `${SITE_URL}/terms`),
  },
};

function articleJsonLd(opts: {
  slug: string;
  headline: string;
  description: string;
  datePublished: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: opts.headline,
    name: opts.headline,
    description: opts.description,
    author: ORGANIZATION,
    publisher: ORGANIZATION,
    datePublished: opts.datePublished,
    url: `${SITE_URL}/research/${opts.slug}`,
    image: OG_IMAGE,
    isPartOf: { '@type': 'WebSite', name: 'Orin Labs', url: SITE_URL },
  };
}

function webPageJsonLd(name: string, url: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    publisher: ORGANIZATION,
  };
}

function plainText(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function roleDescription(role: Role): string {
  const firstProse = role.sections.find((s) => typeof s.body === 'string');
  const base =
    role.tagline ??
    (firstProse
      ? plainText(firstProse.body as string)
      : `${role.title} at Orin Labs in ${role.location}.`);
  return base.length > 280 ? `${base.slice(0, 277)}…` : base;
}

function roleMeta(role: Role): RouteMeta {
  const description = roleDescription(role);
  return {
    title: `${role.title} — Orin Labs`,
    description,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: role.title,
      description,
      employmentType: 'FULL_TIME',
      hiringOrganization: ORGANIZATION,
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: role.location,
        },
      },
      url: `${SITE_URL}/roles/${role.slug}`,
      directApply: true,
    },
  };
}

const ROLE_META: Record<string, RouteMeta> = Object.fromEntries(
  ROLES.map((role) => [`/roles/${role.slug}`, roleMeta(role)]),
);

const DEFAULT_META: RouteMeta = {
  title: 'Orin Labs',
  description: 'Autonomous Intelligence. We are building AI that acts in the world.',
};

// Every public route that should be prerendered to static HTML.
export const ROUTES: string[] = [
  ...Object.keys(STATIC_META),
  ...ROLES.map((role) => `/roles/${role.slug}`),
];

function metaFor(pathname: string): RouteMeta {
  return STATIC_META[pathname] ?? ROLE_META[pathname] ?? DEFAULT_META;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonLdScript(data: object): string {
  // Escape "<" so the payload can never break out of the <script> element.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

// Returns the full set of <head> tags for a route as an HTML string, injected
// into index.html's <!--app-head--> placeholder at build time.
export function headFor(pathname: string): string {
  const meta = metaFor(pathname);
  const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
  const ogType = meta.ogType ?? 'website';
  const ogImage = meta.ogImage ?? OG_IMAGE;
  const ogDescription = meta.ogDescription ?? meta.description;

  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="author" content="${escapeAttr(AUTHOR)}" />`,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(ogDescription)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
    `<meta property="og:site_name" content="Orin Labs" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@0rinlabs" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(ogDescription)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`,
  ];

  if (meta.jsonLd) {
    tags.push(jsonLdScript(meta.jsonLd));
  }

  return tags.join('\n    ');
}
