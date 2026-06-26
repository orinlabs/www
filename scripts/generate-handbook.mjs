import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const contentDir = join(root, 'src/content/handbook');
const outPath = join(root, 'src/data/handbook.generated.ts');

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseFrontmatter(source, filePath) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`${filePath} is missing frontmatter`);
  }

  const frontmatter = {};
  let currentKey = null;
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue;

    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && currentKey) {
      frontmatter[currentKey] ??= [];
      frontmatter[currentKey].push(listItem[1].trim());
      continue;
    }

    const pair = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;

    currentKey = pair[1];
    const value = pair[2].trim();
    frontmatter[currentKey] =
      value === '' ? [] : Number.isFinite(Number(value)) ? Number(value) : value;
  }

  if (!frontmatter.title || typeof frontmatter.title !== 'string') {
    throw new Error(`${filePath} is missing a title`);
  }

  return {
    frontmatter,
    body: match[2].trim(),
  };
}

function git(args, fallback = '') {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return fallback;
  }
}

function githubUsernameFromEmail(email) {
  return email.match(/^\d+\+([^@]+)@users\.noreply\.github\.com$/)?.[1];
}

const githubLookupCache = new Map();
function githubUsernameFromGh(email) {
  if (!email || githubLookupCache.has(email)) {
    return githubLookupCache.get(email);
  }

  try {
    const login = execFileSync(
      'gh',
      ['api', 'search/users', '-f', `q=${email} in:email`, '--jq', '.items[0].login // ""'],
      {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    ).trim();
    githubLookupCache.set(email, login || undefined);
    return login || undefined;
  } catch {
    githubLookupCache.set(email, undefined);
    return undefined;
  }
}

function currentGithubUsername() {
  try {
    return execFileSync('gh', ['api', 'user', '--jq', '.login'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return undefined;
  }
}

const githubUserCache = new Map();
function githubUser(login) {
  if (!login || githubUserCache.has(login)) {
    return githubUserCache.get(login);
  }

  try {
    const user = JSON.parse(
      execFileSync('gh', ['api', `users/${login}`], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }),
    );
    const resolved = {
      name: user.name || user.login,
      githubUsername: user.login,
      githubUrl: user.html_url,
      avatarUrl: user.avatar_url,
    };
    githubUserCache.set(login, resolved);
    return resolved;
  } catch {
    const resolved = {
      name: login,
      githubUsername: login,
      githubUrl: `https://github.com/${login}`,
      avatarUrl: `https://github.com/${login}.png?size=96`,
    };
    githubUserCache.set(login, resolved);
    return resolved;
  }
}

function normalizeGithubLogin(value) {
  return value
    .trim()
    .replace(/^@/, '')
    .replace(/^https:\/\/github\.com\//, '')
    .replace(/\/$/, '');
}

function authors(frontmatter) {
  const rawAuthors = Array.isArray(frontmatter.authors)
    ? frontmatter.authors
    : [currentGithubUsername() ?? git(['config', 'user.name'], 'Orin Labs')];

  return rawAuthors.map((author) => {
    const login = normalizeGithubLogin(author);
    return githubUser(login);
  });
}

function headings(markdown) {
  const seen = new Map();
  const result = [];
  let inCodeBlock = false;

  for (const line of markdown.split('\n')) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (!heading) continue;

    const title = heading[2].trim();
    const baseSlug = slugify(title);
    const count = seen.get(baseSlug) ?? 0;
    seen.set(baseSlug, count + 1);

    result.push({
      title,
      slug: count === 0 ? baseSlug : `${baseSlug}-${count + 1}`,
      level: heading[1].length,
    });
  }

  return result;
}

function lastEditor(relativePath) {
  const last = git(['log', '-1', '--format=%an%x00%ae%x00%aI', '--', relativePath]);
  if (!last) {
    const name = git(['config', 'user.name'], 'Uncommitted');
    const email = git(['config', 'user.email'], '');
    const githubUsername =
      githubUsernameFromEmail(email) ?? githubUsernameFromGh(email) ?? currentGithubUsername();
    return {
      name,
      email,
      date: '',
      githubUsername,
      githubUrl: githubUsername ? `https://github.com/${githubUsername}` : undefined,
      avatarUrl: githubUsername ? `https://github.com/${githubUsername}.png?size=96` : undefined,
    };
  }

  const [name, email, date] = last.split('\0');
  const githubUsername = githubUsernameFromEmail(email) ?? githubUsernameFromGh(email);

  return {
    name,
    email,
    date,
    githubUsername,
    githubUrl: githubUsername ? `https://github.com/${githubUsername}` : undefined,
    avatarUrl: githubUsername ? `https://github.com/${githubUsername}.png?size=96` : undefined,
  };
}

const pages = readdirSync(contentDir)
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const relativePath = `src/content/handbook/${file}`;
    const slug = basename(file, '.md');
    const parsed = parseFrontmatter(
      readFileSync(join(contentDir, file), 'utf8'),
      relativePath,
    );
    return {
      slug,
      title: parsed.frontmatter.title,
      description:
        typeof parsed.frontmatter.description === 'string'
          ? parsed.frontmatter.description
          : '',
      order:
        typeof parsed.frontmatter.order === 'number' ? parsed.frontmatter.order : 999,
      items: headings(parsed.body),
      authors: authors(parsed.frontmatter),
      body: parsed.body,
      sourcePath: relativePath,
      lastEditor: lastEditor(relativePath),
    };
  })
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

const output = `// This file is generated by scripts/generate-handbook.mjs.
// Do not edit directly; edit src/content/handbook/*.md instead.

export interface HandbookEditor {
  name: string;
  email: string;
  date: string;
  githubUsername?: string;
  githubUrl?: string;
  avatarUrl?: string;
}

export interface HandbookAuthor {
  name: string;
  githubUsername: string;
  githubUrl: string;
  avatarUrl: string;
}

export interface HandbookPage {
  slug: string;
  title: string;
  description: string;
  order: number;
  items: { title: string; slug: string; level: number }[];
  authors: HandbookAuthor[];
  body: string;
  sourcePath: string;
  lastEditor: HandbookEditor;
}

export const HANDBOOK_PAGES = ${JSON.stringify(pages, null, 2)} satisfies HandbookPage[];
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, output);
console.log(`Generated ${pages.length} handbook page(s).`);
