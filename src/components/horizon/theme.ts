import { useEffect, useState } from "react";

import { EFFECT_COLORS } from "../../effectColors";

export const HORIZON_CHART_COLORS = EFFECT_COLORS;

export function horizonChartColor(index: number) {
  return HORIZON_CHART_COLORS[index % HORIZON_CHART_COLORS.length] ?? "#525252";
}

function colorPair(index: number) {
  const color = horizonChartColor(index);
  return { light: color, dark: color };
}

// Color per agent type. Shared by the scatter, the results table, and the Tufte
// figures so every Horizon view stays consistent with the site effect palette.
export const AGENT_TYPE_COLORS: Record<string, { light: string; dark: string }> =
  {
    "Claude Code": colorPair(0),
    Hermes: colorPair(1),
    RLM: colorPair(2),
    RAG: colorPair(3),
    Codex: colorPair(4),
    OpenClaw: colorPair(5),
  };

export const FALLBACK_COLOR = colorPair(0);

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
      document.body.classList.contains("dark");
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
