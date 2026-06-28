import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from 'slate-ui';

import { EFFECT_COLORS } from '../effectColors';

interface GlitchTextProps {
  children: string;
  className?: string;
  underline?: boolean;
}

interface CharacterState {
  value: string;
  color: string;
  isSpace: boolean;
}

const GLITCH_GLYPHS = ['•', '·', '×', '+', '–'];
const TICK_MS = 70;
const DURATION_MS = 360;
const STAGGER_MS = 6;

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function GlitchText({ children, className, underline = true }: GlitchTextProps) {
  const originalCharacters = Array.from(children);
  const [characters, setCharacters] = useState<CharacterState[]>(() =>
    originalCharacters.map((value) => ({
      value,
      color: 'currentColor',
      isSpace: value.trim() === '',
    })),
  );
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const resetCharacters = () => {
    setCharacters(
      originalCharacters.map((value) => ({
        value,
        color: 'currentColor',
        isSpace: value.trim() === '',
      })),
    );
  };

  const startGlitch = () => {
    clearTimers();
    resetCharacters();

    originalCharacters.forEach((original, index) => {
      if (original.trim() === '') {
        return;
      }

      for (let elapsed = 0; elapsed < DURATION_MS; elapsed += TICK_MS) {
        const timer = window.setTimeout(() => {
          setCharacters((current) =>
            current.map((character, characterIndex) => {
              if (characterIndex !== index) {
                return character;
              }

              const useGlyph = Math.random() < 0.08;

              return {
                value: useGlyph ? pick(GLITCH_GLYPHS) : original,
                color: pick(EFFECT_COLORS),
                isSpace: false,
              };
            }),
          );
        }, index * STAGGER_MS + elapsed);

        timersRef.current.push(timer);
      }

      const resetTimer = window.setTimeout(() => {
        setCharacters((current) =>
          current.map((character, characterIndex) =>
            characterIndex === index
              ? {
                  value: original,
                  color: 'currentColor',
                  isSpace: original.trim() === '',
                }
              : character,
          ),
        );
      }, index * STAGGER_MS + DURATION_MS);

      timersRef.current.push(resetTimer);
    });
  };

  useEffect(() => {
    resetCharacters();
    return clearTimers;
    // Rebuild character state when the text changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <span
      className={cn('group/glitch inline whitespace-normal', className)}
      onMouseEnter={startGlitch}
      onFocus={startGlitch}
      tabIndex={-1}
    >
      <span className="sr-only">{children}</span>
      <span className="relative inline" aria-hidden="true">
        {characters.map((character, index) => (
          <span
            key={index}
            className={cn(
              character.isSpace
                ? 'inline'
                : 'inline-block transition-[color,transform] duration-75',
            )}
            style={{
              color: character.color,
            }}
          >
            {character.isSpace ? ' ' : character.value}
          </span>
        ))}
        {underline && (
          <span className="absolute -bottom-0.5 left-0 hidden h-0.5 w-full origin-left scale-x-0 bg-current transition-transform duration-[360ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/glitch:scale-x-100 group-focus/glitch:scale-x-100 sm:block" />
        )}
      </span>
    </span>
  );
}
