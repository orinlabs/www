import { renderToString } from 'react-dom/server';

import { StaticRouter } from 'react-router-dom';

import App from './App.tsx';
import { headFor, ROUTES } from './seo.ts';

export function render(url: string): { html: string; head: string } {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
  return { html, head: headFor(url) };
}

export { ROUTES };
