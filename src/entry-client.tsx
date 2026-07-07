import './index.css';
import './styles/prism-custom.css';
import 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';

import { StrictMode } from 'react';

import posthog from 'posthog-js';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { PostHogProvider } from '@posthog/react';

import App from './App.tsx';

posthog.init('phc_pS2GkQZjsv8sjGbZgdVSwF8FYJhwVYvabomUasz3bW9A', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-05-30',
});

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <PostHogProvider client={posthog}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PostHogProvider>
  </StrictMode>,
);
