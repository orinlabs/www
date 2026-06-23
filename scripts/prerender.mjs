// Build-time static prerender. Runs after the client build (dist/) and the SSR
// build (dist-server/). For every route exported by src/seo.ts it server-renders
// the app, injects the resulting HTML + head into the dist/index.html template,
// and writes a static dist/<route>/index.html. AI crawlers then read real
// content instead of an empty <div id="root">.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const distDir = join(root, 'dist');
const serverEntry = join(root, 'dist-server', 'entry-server.js');

const templatePath = join(distDir, 'index.html');
if (!existsSync(templatePath)) {
  throw new Error(`Missing client build template at ${templatePath}. Run "vite build" first.`);
}
if (!existsSync(serverEntry)) {
  throw new Error(`Missing SSR build at ${serverEntry}. Run "vite build --ssr" first.`);
}

const template = readFileSync(templatePath, 'utf-8');
const { render, ROUTES } = await import(pathToFileURL(serverEntry).href);

if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('index.html template is missing the <!--app-html--> / <!--app-head--> placeholders.');
}

let count = 0;
for (const url of ROUTES) {
  const { html, head } = render(url);
  const page = template
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html);

  const outPath =
    url === '/'
      ? join(distDir, 'index.html')
      : join(distDir, url.replace(/^\/+/, ''), 'index.html');

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, page);
  count += 1;
  console.log(`prerendered ${url} -> ${outPath.slice(root.length + 1)}`);
}

const notFound = render('/404');
const notFoundPage = template
  .replace('<!--app-head-->', notFound.head)
  .replace('<!--app-html-->', notFound.html);
const notFoundPath = join(distDir, '404.html');
writeFileSync(notFoundPath, notFoundPage);
console.log(`prerendered /404 -> ${notFoundPath.slice(root.length + 1)}`);

console.log(`\nPrerendered ${count} route(s) plus 404.html.`);
