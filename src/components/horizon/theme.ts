import { useEffect, useState } from "react";

// Color per agent type, with light/dark variants. Shared by the scatter,
// the results table, and the Tufte figures so every view stays consistent.
export const AGENT_TYPE_COLORS: Record<string, { light: string; dark: string }> =
  {
    RAG: { light: "#00845e", dark: "#10b981" },
    "Claude Code": { light: "#c2410c", dark: "#fb923c" },
    Codex: { light: "#1d4ed8", dark: "#60a5fa" },
    Hermes: { light: "#171717", dark: "#fafafa" },
    RLM: { light: "#7c3aed", dark: "#a78bfa" },
  };

export const FALLBACK_COLOR = { light: "#525252", dark: "#a3a3a3" };

export function agentColor(agentType: string, isDark: boolean) {
  const c = AGENT_TYPE_COLORS[agentType] ?? FALLBACK_COLOR;
  return isDark ? c.dark : c.light;
}

export function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const compute = () =>
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark") ||
      mq.matches;
    const update = () => setIsDark(compute());

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  return isDark;
}
