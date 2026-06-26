import { ArrowDown } from "lucide-react";

interface MemoryBlockProps {
  color:
    | "primary-50"
    | "primary-100"
    | "primary-200"
    | "primary-300"
    | "primary-400"
    | "primary-500";
  colSpan: number;
  height?: string;
  children: React.ReactNode;
  variant?: "solid" | "light";
}

function MemoryBlock({
  color,
  colSpan,
  height = "h-12",
  children,
}: MemoryBlockProps) {
  const colorClasses = {
    "primary-50":
      "bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200",
    "primary-100":
      "bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200",
    "primary-200":
      "bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-100",
    "primary-300":
      "bg-primary-300 dark:bg-primary-600 text-primary-900 dark:text-primary-100",
    "primary-400":
      "bg-primary-400 dark:bg-primary-500 text-primary-900 dark:text-white",
    "primary-500":
      "bg-primary-500 dark:bg-primary-400 text-white dark:text-primary-900",
  };

  const colSpans = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
  };
  const colSpanValue = colSpan as keyof typeof colSpans;

  const classes = `${colSpans[colSpanValue]} ${height} ${colorClasses[color]} rounded flex items-center text-xs md:text-sm justify-center min-w-fit`;

  return <div className={classes}>{children}</div>;
}

export default function MemoryDiagram() {
  return (
    <div className="my-8 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
      {/* Memory Grid - Top Section */}
      <div className="grid grid-cols-12 gap-1 mb-4">
        <MemoryBlock color="primary-50" colSpan={2}>
          Monthly
        </MemoryBlock>

        <div className="col-span-10"></div>

        <MemoryBlock color="primary-100" colSpan={4}>
          Weekly
        </MemoryBlock>

        <div className="col-span-8"></div>

        <MemoryBlock color="primary-200" colSpan={6}>
          Daily
        </MemoryBlock>

        <div className="col-span-6"></div>

        <MemoryBlock color="primary-300" colSpan={8}>
          Hourly
        </MemoryBlock>

        <div className="col-span-4"></div>

        <MemoryBlock color="primary-400" colSpan={10}>
          N-minute
        </MemoryBlock>

        <div className="col-span-2"></div>

        <MemoryBlock color="primary-500" colSpan={12}>
          Actual messages
        </MemoryBlock>
      </div>

      {/* Timeline labels */}
      <div className="grid grid-cols-12 gap-1 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="col-span-1"></div>
        <div className="col-span-2 text-center">-N mo</div>
        <div className="col-span-2 text-center">-10wks</div>
        <div className="col-span-2 text-center">-2wks</div>
        <div className="col-span-5 text-right">yesterday → now</div>
      </div>

      {/* Arrow and transformation */}
      <ArrowDown className="w-8 h-8 text-neutral-600 dark:text-neutral-400 mx-auto my-6" />

      {/* Context Grid - Bottom Section */}
      <div className="mb-4">
        <div className="grid grid-cols-12 gap-1 mb-4">
          <MemoryBlock color="primary-50" colSpan={2}>
            Monthly
          </MemoryBlock>
          <MemoryBlock color="primary-100" colSpan={2}>
            Weekly
          </MemoryBlock>
          <MemoryBlock color="primary-200" colSpan={2}>
            Daily
          </MemoryBlock>
          <MemoryBlock color="primary-300" colSpan={2}>
            Hourly
          </MemoryBlock>
          <MemoryBlock color="primary-400" colSpan={2}>
            Minute
          </MemoryBlock>
          <MemoryBlock color="primary-500" colSpan={2}>
            Messages
          </MemoryBlock>
        </div>
      </div>
    </div>
  );
}
