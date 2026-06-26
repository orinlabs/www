import {
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "slate-ui";

import { BrandBanner } from "./BrandBanner";
import { BookDemoButton } from "./BookDemoButton";

const NAV_ITEMS = [
  { label: "Research", path: "/research" },
  { label: "Careers", path: "/careers" },
];

// Shared site nav. `overlay` switches to light-on-image styling so it can sit
// inside a hero image; `className` lets the caller constrain width/alignment.
export function Navbar({
  overlay = false,
  floating = false,
  className,
}: {
  overlay?: boolean;
  floating?: boolean;
  className?: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!floating) {
      return;
    }

    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 32);

      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        // Hide when scrolling down past the hero top; always show near the top.
        setIsHidden(delta > 0 && y > 300);
        lastY = y;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [floating]);

  useEffect(() => {
    if (isMenuOpen) {
      setIsHidden(false);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
    if (path.includes("#")) {
      const hash = path.split("#")[1];
      const element = document.getElementById(hash);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsMenuOpen(false);
      }
    } else {
      setIsMenuOpen(false);
    }
  };

  const titleColor = overlay
    ? "text-white"
    : "text-neutral-950";
  const linkColor = overlay
    ? "text-white/85 hover:text-white"
    : "text-neutral-600 hover:text-neutral-900";
  const menuBtn = overlay
    ? "text-white hover:bg-white/10 hover:text-white"
    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900";

  const mobileMenu = (
    <>
      <button
        type="button"
        className={cn(
          "fixed inset-0 z-40 bg-neutral-950/10 transition-opacity duration-300 md:hidden",
          isMenuOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        id="mobile-navigation-menu"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-screen flex-col gap-5 bg-white px-6 py-7 shadow-2xl shadow-neutral-950/20 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
          isMenuOpen ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
          aria-label="Close navigation"
          onClick={() => setIsMenuOpen(false)}
          tabIndex={isMenuOpen ? undefined : -1}
        >
          <X className="h-5 w-5" />
        </button>

        {NAV_ITEMS.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
            tabIndex={isMenuOpen ? undefined : -1}
            className={cn(
              "w-fit shrink-0 text-lg font-semibold text-neutral-700 transition-colors hover:text-neutral-950",
            )}
          >
            {item.label}
          </Link>
        ))}
        <BookDemoButton
          variant="dark"
          onClick={() => setIsMenuOpen(false)}
          tabIndex={isMenuOpen ? undefined : -1}
        />
      </div>
    </>
  );

  return (
    <>
      <nav
        className={cn(
          "w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          floating &&
            (isScrolled || isMenuOpen
              ? "rounded-[2rem] border border-neutral-200/80 bg-neutral-50/88 px-4 py-3 shadow-2xl shadow-neutral-900/10 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/82"
              : "rounded-[2rem] border border-transparent bg-transparent px-4 py-3 shadow-none"),
          floating && isHidden && "-translate-y-[150%] opacity-0",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <BrandBanner
            className={overlay ? "text-white hover:text-white" : undefined}
            logoClassName={overlay ? "text-white" : undefined}
            textClassName={cn("text-xl sm:text-2xl", titleColor)}
          />

          <button
            type="button"
            id="mobile-navigation-trigger"
            className={cn(
              "md:hidden rounded-lg p-2 transition-colors",
              menuBtn,
            )}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                to={item.path}
                key={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className={cn(
                  "cursor-pointer text-sm transition-colors hover:underline md:text-base font-semibold",
                  linkColor,
                )}
              >
                {item.label}
              </Link>
            ))}
            <BookDemoButton variant="dark" />
          </div>
        </div>
      </nav>

      {typeof document !== "undefined" && createPortal(mobileMenu, document.body)}
    </>
  );
}
