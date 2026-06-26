import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const prismShim = fileURLToPath(new URL('./src/shims/prism.ts', import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  // Bundle deps into the SSR build so the build-time prerender doesn't trip on
  // CJS/ESM interop (e.g. slate-ui's named exports). This bundle is only used
  // at build time by scripts/prerender.mjs.
  ssr: {
    noExternal: true,
  },
  resolve: isSsrBuild
    ? {
        // Keep prismjs (and its browser-global language files) out of the SSR
        // module graph; highlighting only ever runs client-side in effects.
        alias: [{ find: /^prismjs(\/.*)?$/, replacement: prismShim }],
      }
    : undefined,
}));
