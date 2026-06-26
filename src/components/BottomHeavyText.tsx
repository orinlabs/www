import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from 'slate-ui';

interface BottomHeavyTextProps {
  children: string;
  className?: string;
}

function getCanvasFont(element: HTMLElement) {
  const styles = window.getComputedStyle(element);

  return [
    styles.fontStyle,
    styles.fontVariant,
    styles.fontWeight,
    styles.fontSize,
    styles.fontFamily,
  ].join(' ');
}

function lineWidth(
  context: CanvasRenderingContext2D,
  words: string[],
) {
  return context.measureText(words.join(' ')).width;
}

function makeBottomHeavyLines(
  text: string,
  maxWidth: number,
  context: CanvasRenderingContext2D,
) {
  const words = text.trim().split(/\s+/);
  const lines: string[][] = [];

  words.forEach((word) => {
    const current = lines[lines.length - 1];
    if (!current) {
      lines.push([word]);
      return;
    }

    const candidate = [...current, word];
    if (lineWidth(context, candidate) <= maxWidth) {
      current.push(word);
    } else {
      lines.push([word]);
    }
  });

  for (let pass = 0; pass < words.length * 2; pass += 1) {
    let changed = false;

    for (let index = lines.length - 2; index >= 0; index -= 1) {
      const current = lines[index];
      const next = lines[index + 1];

      if (
        current.length > 1 &&
        lineWidth(context, current) > lineWidth(context, next)
      ) {
        const word = current.pop();
        if (word) {
          next.unshift(word);
          changed = true;
        }
      }
    }

    if (!changed) {
      break;
    }
  }

  return lines.map((line) => line.join(' '));
}

export function BottomHeavyText({ children, className }: BottomHeavyTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [lines, setLines] = useState<string[] | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const measure = () => {
      const width = element.getBoundingClientRect().width;
      if (width <= 0) {
        return;
      }

      context.font = getCanvasFont(element);
      setLines(makeBottomHeavyLines(children, width, context));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);

    document.fonts?.ready.then(measure);

    return () => {
      observer.disconnect();
    };
  }, [children]);

  return (
    <span
      ref={ref}
      aria-label={children}
      className={cn(
        "block w-full text-right",
        className,
      )}
    >
      {lines
        ? lines.map((line, index) => (
            <span
              key={String(index) + line}
              aria-hidden="true"
              className="block whitespace-nowrap"
            >
              {line}
            </span>
          ))
        : (
            <span aria-hidden="true">
              {children}
            </span>
          )}
    </span>
  );
}
