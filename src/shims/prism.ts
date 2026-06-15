// SSR-only stub for prismjs.
//
// Syntax highlighting is a client-only enhancement: Prism.highlightAll() /
// highlightElement() are always called inside useEffect, which never runs
// during server rendering. The real prismjs language files (prism-json,
// prism-python, ...) reference a browser `Prism` global at module load, which
// throws under Node. During the build-time prerender we alias prismjs (core +
// components) to these no-ops so highlighting code is harmless and the
// browser-global-dependent files stay out of the SSR module graph.

const Prism = {
  highlightAll() {},
  highlightAllUnder() {},
  highlightElement() {},
  highlight: (text: string) => text,
  languages: {} as Record<string, unknown>,
};

export default Prism;
export const languages = Prism.languages;
export const highlightAll = Prism.highlightAll;
export const highlightElement = Prism.highlightElement;
