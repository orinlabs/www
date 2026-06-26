import { useEffect, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

const data = [
  { phase: "", tam: 0, visualTam: 0, fillTam: 0 },
  {
    phase:
      "Launch the first fully autonomous, long running agent into families",
    tam: 100_000_000,
    visualTam: 1,
  },
  {
    phase: "Scale D2C tutoring brands to $X00M ARR",
    tam: 100_000_000_000,
    visualTam: 5,
  },
  {
    phase: "Deploy into schools and governments across the globe",
    tam: 5_000_000_000_000,
    visualTam: 20,
  },
];

const mobileData = [
  { phase: "", tam: 0, visualTam: 0, fillTam: 0 },
  {
    phase: "Launch agent",
    tam: 100_000_000,
    visualTam: 1,
  },
  {
    phase: "Scale D2C",
    tam: 100_000_000_000,
    visualTam: 5,
  },
  {
    phase: "Flip K-12",
    tam: 5_000_000_000_000,
    visualTam: 20,
  },
];
export default function RocketshipGrowth() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const gridStroke = isDark ? "#404040" : "#cbd5e1";
  const textFill = isDark ? "#a0aec0" : "#64748b";

  return (
    <>
      {/* Desktop version */}
      <div className="hidden md:block h-[500px] w-full mx-auto relative">
        {/* "I am here" pointer */}
        <div className="absolute left-[19%] top-[63%] z-10 flex flex-col items-start">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 whitespace-nowrap">
            Today
          </div>
          <svg
            width="60"
            height="60"
            className="overflow-visible ml-6"
            style={{ transform: "rotate(-45deg)", transformOrigin: "top left" }}
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="50"
              stroke="var(--primary-500)"
              strokeWidth="2"
            />
            <polygon points="0,50 -5,42 5,42" fill="var(--primary-500)" />
          </svg>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 100,
              left: 5,
              bottom: -20,
            }}
          >
            <defs>
              <linearGradient id="tamGradient" x1="0" y1="0" x2="1" y2="0">
                <stop
                  offset="0%"
                  stopColor="var(--primary-500)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="33.3%"
                  stopColor="var(--primary-500)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="33.3%"
                  stopColor="var(--primary-500)"
                  stopOpacity={0.0}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary-500)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              vertical={true}
              horizontal={false}
              stroke={gridStroke}
              strokeWidth={1}
            />
            <XAxis
              dataKey="phase"
              angle={0}
              height={120}
              textAnchor="end"
              interval={0}
              tick={{
                fontSize: 12,
                textAnchor: "middle",
                fill: textFill,
                width: 200,
              }}
            />

            <Area
              type="monotone"
              dataKey="visualTam"
              stroke="var(--primary-500)"
              strokeDasharray="5 5"
              fillOpacity={1}
              strokeWidth={1.5}
              fill="url(#tamGradient)"
              name="Market Opportunity"
              dot={{
                fill: "var(--primary-500)",
                r: 4,
                fillOpacity: 1,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile version */}
      <div className="block md:hidden h-[500px] w-full mx-auto relative">
        {/* "I am here" pointer */}
        <div className="absolute left-[10%] top-[63%] z-10 flex flex-col items-start">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 whitespace-nowrap">
            Today
          </div>
          <svg
            width="60"
            height="60"
            className="overflow-visible ml-6"
            style={{ transform: "rotate(-45deg)", transformOrigin: "top left" }}
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="50"
              stroke="var(--primary-500)"
              strokeWidth="2"
            />
            <polygon points="0,50 -5,42 5,42" fill="var(--primary-500)" />
          </svg>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={mobileData}
            margin={{
              top: 20,
              right: 100,
              left: 5,
              bottom: -20,
            }}
          >
            <defs>
              <linearGradient
                id="tamGradientMobile"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="var(--primary-500)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="33.3%"
                  stopColor="var(--primary-500)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="33.3%"
                  stopColor="var(--primary-500)"
                  stopOpacity={0.0}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary-500)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              vertical={true}
              horizontal={false}
              stroke={gridStroke}
              strokeWidth={1}
            />
            <XAxis
              dataKey="phase"
              angle={0}
              height={120}
              textAnchor="end"
              interval={0}
              tick={{
                fontSize: 12,
                textAnchor: "middle",
                fill: textFill,
                width: 200,
              }}
            />

            <Area
              type="monotone"
              dataKey="visualTam"
              stroke="var(--primary-500)"
              strokeDasharray="5 5"
              fillOpacity={1}
              strokeWidth={1.5}
              fill="url(#tamGradientMobile)"
              name="Market Opportunity"
              dot={{
                fill: "var(--primary-500)",
                r: 4,
                fillOpacity: 1,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
