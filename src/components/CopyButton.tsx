import { useEffect, useRef, useState } from 'react';

import { Check, Copy } from 'lucide-react';
import { cn } from 'slate-ui';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn(
        "relative w-7 h-7 shrink-0 rounded-md flex items-center justify-center",
        "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800",
        "transition-colors cursor-pointer",
        className,
      )}
    >
      <Copy
        className={cn(
          "w-4 h-4 absolute transition-all duration-200 ease-out",
          copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
        )}
      />
      <Check
        className={cn(
          "w-4 h-4 absolute text-primary transition-all duration-200 ease-out",
          copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
        )}
      />
    </button>
  );
}
