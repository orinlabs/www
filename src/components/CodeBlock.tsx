import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Prism from 'prismjs';
import { cn } from 'slate-ui';

interface CodeTab {
  label: string;
  language: string;
  code: string;
  filename?: string;
}

interface CodeBlockProps {
  code?: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  filename?: string;
  tabs?: CodeTab[];
}

export default function CodeBlock({
  code,
  language = "python",
  className,
  showLineNumbers = false,
  filename,
  tabs,
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  const activeCode = tabs ? tabs[activeTab].code : code || "";
  const activeLang = tabs ? tabs[activeTab].language : language;
  const activeFilename = tabs ? tabs[activeTab].filename : filename;

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [activeCode, activeLang]);

  return (
    <div
      className={cn(
        "code-dark relative rounded-xl overflow-hidden bg-[#0a0a0a] my-6 border border-neutral-800",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />

        {tabs ? (
          <div className="flex items-center gap-1 ml-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer",
                  i === activeTab
                    ? "bg-neutral-700 text-neutral-200"
                    : "text-neutral-500 hover:text-neutral-300",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          (activeFilename || activeLang) && (
            <span className="ml-2 text-xs text-neutral-500 font-mono">
              {activeFilename || activeLang}
            </span>
          )
        )}
      </div>

      <pre
        className={cn(
          "!m-0 !bg-transparent overflow-x-auto !rounded-none !p-5",
          showLineNumbers && "line-numbers",
        )}
      >
        <code ref={codeRef} className={cn("!text-sm", "language-" + activeLang)}>
          {activeCode.trim()}
        </code>
      </pre>
    </div>
  );
}
