import { useEffect, useState } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { interactions: 0, onlyShortTerm: 0, withLongTerm: 0, withVariable: 0 },
  { interactions: 1, onlyShortTerm: 750, withLongTerm: 150, withVariable: 60 },
  {
    interactions: 2,
    onlyShortTerm: 1500,
    withLongTerm: 300,
    withVariable: 105,
  },
  {
    interactions: 3,
    onlyShortTerm: 2250,
    withLongTerm: 450,
    withVariable: 141,
  },
  {
    interactions: 4,
    onlyShortTerm: 3000,
    withLongTerm: 600,
    withVariable: 165,
  },
  {
    interactions: 5,
    onlyShortTerm: 3750,
    withLongTerm: 750,
    withVariable: 186,
  },
  {
    interactions: 6,
    onlyShortTerm: 4500,
    withLongTerm: 900,
    withVariable: 201,
  },
  {
    interactions: 7,
    onlyShortTerm: 5250,
    withLongTerm: 1050,
    withVariable: 216,
  },
  {
    interactions: 8,
    onlyShortTerm: 6000,
    withLongTerm: 1200,
    withVariable: 225,
  },
  {
    interactions: 9,
    onlyShortTerm: 6750,
    withLongTerm: 1350,
    withVariable: 234,
  },
];

export default function ScalingChart() {
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    // Force initial render to catch dark mode
    setForceUpdate(1);

    const observer = new MutationObserver(() => {
      setForceUpdate((prev) => prev + 1);
    });

    // Observe both html and body for dark class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const isDarkMode =
    typeof document !== "undefined" &&
    (document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark"));

  const gridStroke = isDarkMode ? "#525252" : "#e5e5e5";
  const axisStroke = isDarkMode ? "#a0aec0" : "#171717";
  const blackLineStroke = isDarkMode ? "#ffffff" : "#000000";

  return (
    <div className="my-8 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
      <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-6 text-center">
        Tokens in Context
      </h4>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis
              dataKey="interactions"
              axisLine={{ stroke: axisStroke, strokeWidth: 2 }}
              tickLine={{ stroke: axisStroke, strokeWidth: 1 }}
              tick={{ fontSize: 12, fill: axisStroke }}
              label={{
                value: "Interactions",
                position: "insideBottom",
                offset: -10,
                style: { textAnchor: "middle" },
              }}
            />
            <YAxis
              axisLine={{ stroke: axisStroke, strokeWidth: 2 }}
              tickLine={{ stroke: axisStroke, strokeWidth: 1 }}
              tick={{ fontSize: 12, fill: axisStroke }}
              label={{
                value: "Tokens",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
              domain={[0, 2250]}
              type="number"
              allowDataOverflow={true}
              ticks={[0, 500, 1000, 1500, 2000, 2250]}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
              wrapperStyle={{
                paddingBottom: "20px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="onlyShortTerm"
              stroke={blackLineStroke}
              strokeWidth={3}
              name="only short term: O(N) fast"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="withLongTerm"
              stroke="var(--color-effect-rag)"
              strokeWidth={3}
              name="with long term: O(N) slow"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="withVariable"
              stroke="var(--color-effect-rlm)"
              strokeWidth={3}
              name="with variable: O(log N)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
