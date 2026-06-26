import { useEffect, useRef, useState } from "react";

import { LinkedinIcon, TwitterIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "slate-ui";

import { EFFECT_COLORS } from "../effectColors";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  // When provided, the hero (image + overlaid title) renders full-width at the
  // top with the nav set inside it, and the page root switches to p-8.
  hero?: React.ReactNode;
  footerDark?: boolean;
}

type FooterLink =
  | { label: string; to: string; href?: never }
  | { label: string; href: string; to?: never };

interface FooterSection {
  title: string;
  links: FooterLink[];
  socials?: boolean;
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Company",
    links: [
      { label: "Research", to: "/research" },
      { label: "Careers", to: "/careers" },
      { label: "Handbook", to: "/handbook" },
    ],
  },
  {
    title: "Research",
    links: [
      { label: "Horizon", to: "/research/horizon" },
      { label: "Long-horizon agents", to: "/research/long-horizon-agents" },
      { label: "Conversationality", to: "/research/conversationality" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
    socials: true,
  },
];

const FOOTER_WORD_VISIBLE_RATIO = 0.6;
const FOOTER_WORD_OFFSET_RATIO = 0.1;

export default function Layout({ children, hero, footerDark = false }: LayoutProps) {
  const { pathname } = useLocation();
  const footerRef = useRef<HTMLElement | null>(null);
  const footerSpacerRef = useRef<HTMLDivElement | null>(null);
  const footerWordRef = useRef<HTMLDivElement | null>(null);
  const footerWordVisibleRef = useRef(false);
  const footerRevealInitializedRef = useRef(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const [footerColorIndex, setFooterColorIndex] = useState(0);
  const [footerWordFontSize, setFooterWordFontSize] = useState<number | null>(null);

  // The handbook owns its own scroll container. Public pages stay on a single
  // full-width white canvas so the fixed footer only appears after the page ends.
  const isWide = pathname.startsWith("/handbook");

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }
    }
  }, []);

  useEffect(() => {
    if (isWide) {
      setFooterHeight(0);
      return;
    }

    const footer = footerRef.current;
    if (!footer) {
      return;
    }

    const updateFooterHeight = () => {
      setFooterHeight(footer.getBoundingClientRect().height);
    };

    updateFooterHeight();
    const observer = new ResizeObserver(updateFooterHeight);
    observer.observe(footer, { box: "border-box" });

    return () => {
      observer.disconnect();
    };
  }, [footerWordFontSize, isWide]);

  useEffect(() => {
    if (isWide) {
      setFooterWordFontSize(null);
      return;
    }

    const footer = footerRef.current;
    const footerWord = footerWordRef.current;
    if (!footer || !footerWord) {
      return;
    }

    let frame: number | null = null;
    let cancelled = false;

    const updateFooterWordSize = () => {
      frame = null;
      const footerWidth = footer.getBoundingClientRect().width;
      const wordWidth = footerWord.getBoundingClientRect().width;
      const currentFontSize = Number.parseFloat(window.getComputedStyle(footerWord).fontSize);

      if (footerWidth <= 0 || wordWidth <= 0 || currentFontSize <= 0) {
        return;
      }

      const nextFontSize = (currentFontSize * footerWidth) / wordWidth;
      setFooterWordFontSize((fontSize) =>
        fontSize !== null && Math.abs(fontSize - nextFontSize) < 0.25 ? fontSize : nextFontSize,
      );
    };

    const scheduleFooterWordSizeUpdate = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(updateFooterWordSize);
    };

    scheduleFooterWordSizeUpdate();

    const observer = new ResizeObserver(scheduleFooterWordSizeUpdate);
    observer.observe(footer);

    window.addEventListener("resize", scheduleFooterWordSizeUpdate);
    document.fonts.ready.then(() => {
      if (!cancelled) {
        scheduleFooterWordSizeUpdate();
      }
    });

    return () => {
      cancelled = true;
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      observer.disconnect();
      window.removeEventListener("resize", scheduleFooterWordSizeUpdate);
    };
  }, [isWide]);

  useEffect(() => {
    if (isWide || footerHeight === 0) {
      return;
    }

    let frame: number | null = null;

    const updateFooterReveal = () => {
      frame = null;
      const spacer = footerSpacerRef.current;
      const footerWord = footerWordRef.current;
      if (!spacer || !footerWord) {
        return;
      }

      const spacerRect = spacer.getBoundingClientRect();
      const wordRect = footerWord.getBoundingClientRect();
      const isRevealed = spacerRect.top <= wordRect.bottom - 8;

      if (!footerRevealInitializedRef.current) {
        footerRevealInitializedRef.current = true;
        footerWordVisibleRef.current = isRevealed;
        return;
      }

      if (isRevealed === footerWordVisibleRef.current) {
        return;
      }

      footerWordVisibleRef.current = isRevealed;
      if (isRevealed) {
        setFooterColorIndex((index) => (index + 1) % EFFECT_COLORS.length);
      }
    };

    const scheduleFooterRevealUpdate = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(updateFooterReveal);
    };

    updateFooterReveal();
    window.addEventListener("scroll", scheduleFooterRevealUpdate, { passive: true });
    window.addEventListener("resize", scheduleFooterRevealUpdate);

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", scheduleFooterRevealUpdate);
      window.removeEventListener("resize", scheduleFooterRevealUpdate);
    };
  }, [footerHeight, isWide]);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center overflow-x-clip bg-white",
        hero
          ? "min-h-screen p-0 md:p-8 md:pt-12 gap-6 sm:gap-8"
          : isWide
            ? "h-screen overflow-hidden"
            : "min-h-screen",
      )}
    >
      {hero ? (
        <div className="relative w-full overflow-hidden border-b border-neutral-200 bg-[#f4f3ef] md:rounded-2xl md:border">
          {hero}
          <div className="absolute inset-x-0 top-0 z-20 px-6 sm:px-8 pt-8 pb-5 md:py-5">
            <Navbar />
          </div>
        </div>
      ) : isWide ? (
        <div className="relative z-10 w-full border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Navbar />
        </div>
      ) : (
        <div className="relative z-10 w-full bg-white px-8 py-4 sm:px-10 sm:py-5 lg:px-12">
          <div className="w-full">
            <Navbar />
          </div>
        </div>
      )}

      {hero ? (
        <div
          key={pathname}
          className="page-transition relative z-10 flex w-full flex-1 flex-col gap-12 bg-white px-8 sm:gap-20 sm:px-10 lg:px-12"
        >
          {children}
        </div>
      ) : (
        <div
          className={cn(
            "relative z-10 flex-1 flex flex-col bg-white",
            isWide
              ? "w-full min-h-0 overflow-hidden"
              : "w-full",
          )}
        >
          <div
            key={isWide ? "handbook" : pathname}
            className={cn(
              "page-transition flex-1 flex flex-col",
              isWide && "min-h-0 overflow-hidden",
            )}
          >
            {children}
          </div>
        </div>
      )}

      {!isWide && (
        <div
          ref={footerSpacerRef}
          aria-hidden="true"
          className="pointer-events-none shrink-0"
          style={{ height: footerHeight }}
        />
      )}

      {!isWide && <footer
        ref={footerRef}
        className={cn(
          "fixed inset-x-0 bottom-0 z-0 overflow-hidden px-8 pb-8 pt-[calc(var(--footer-word-visible-size,3rem)+3rem)] sm:px-10 sm:pt-[calc(var(--footer-word-visible-size,4.8rem)+3.5rem)] md:pb-10 lg:px-12 lg:pt-[calc(var(--footer-word-visible-size,4.8rem)+4.5rem)]",
          footerDark ? "bg-neutral-950 text-white" : "bg-white text-neutral-950",
        )}
        style={
          footerWordFontSize === null
            ? undefined
            : ({
                "--footer-word-size": footerWordFontSize + "px",
                "--footer-word-visible-size": footerWordFontSize * FOOTER_WORD_VISIBLE_RATIO + "px",
                "--footer-word-hidden-size": footerWordFontSize * FOOTER_WORD_OFFSET_RATIO + "px",
              } as React.CSSProperties)
        }
      >
        <div
          ref={footerWordRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-0 whitespace-nowrap bg-clip-text font-['Geist'] text-[clamp(5rem,22vw,24rem)] font-semibold uppercase leading-none tracking-[-0.08em] text-transparent"
          style={{
            fontSize: footerWordFontSize === null ? undefined : footerWordFontSize + "px",
            transform: "translate(-50%, calc(var(--footer-word-hidden-size, 2rem) * -1 - (var(--footer-word-visible-size, 3rem) * 0.4)))",
            backgroundImage:
              "linear-gradient(180deg, " +
              (footerDark
                ? "#000000 0%, " + EFFECT_COLORS[footerColorIndex] + " 56%, " + EFFECT_COLORS[footerColorIndex] + " 100%)"
                : EFFECT_COLORS[footerColorIndex] + " 0%, rgba(255,255,255,0.78) 78%, #ffffff 100%)"),
          }}
        >
          ORIN LABS
        </div>
        <div className="relative z-10 grid w-full gap-10 sm:gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex min-h-36 max-w-md flex-col justify-between gap-8 sm:min-h-64 sm:gap-16">
            <p className={cn("text-base leading-7", footerDark ? "text-white/70" : "text-neutral-600")}>
              Scale operations with safe, autonomous agents that run physical build-outs.
            </p>
            <p className={cn("text-sm", footerDark ? "text-white/45" : "text-neutral-500")}>
              &copy; {new Date().getFullYear()} Orin Labs. All rights reserved.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <h3
                  className={cn(
                    "text-sm font-bold underline underline-offset-4",
                    footerDark ? "text-white" : "text-neutral-950",
                  )}
                >
                  {section.title}
                </h3>
                <div className={cn("mt-4 grid gap-3 text-sm", footerDark ? "text-white/60" : "text-neutral-600")}>
                  {section.links.map((link) =>
                    link.to !== undefined ? (
                      <Link
                        key={link.label}
                        to={link.to}
                        className={cn("transition-colors", footerDark ? "hover:text-white" : "hover:text-neutral-950")}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        className={cn("transition-colors", footerDark ? "hover:text-white" : "hover:text-neutral-950")}
                      >
                        {link.label}
                      </a>
                    ),
                  )}

                  {section.socials && (
                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href="https://x.com/0rinlabs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn("transition-colors", footerDark ? "hover:text-white" : "hover:text-primary")}
                        aria-label="Orin Labs on X"
                      >
                        <TwitterIcon className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/104572054/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn("transition-colors", footerDark ? "hover:text-white" : "hover:text-primary")}
                        aria-label="Orin Labs on LinkedIn"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>}
    </div>
  );
}
