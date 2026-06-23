import { useState } from "react";

import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "slate-ui";

import { Logo } from "./Logo";

const NAV_ITEMS = [
  { label: "Join Us", path: "/#join-us" },
];

// Shared site nav. `overlay` switches to light-on-image styling so it can sit
// inside a hero image; `className` lets the caller constrain width/alignment.
export function Navbar({
  overlay = false,
  className,
}: {
  overlay?: boolean;
  className?: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    : "text-neutral-900 dark:text-neutral-100";
  const linkColor = overlay
    ? "text-white/85 hover:text-white"
    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100";
  const menuBtn = overlay
    ? "border-white/40 text-white hover:text-white"
    : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100";

  return (
    <nav className={cn("w-full", className)}>
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo className={cn("w-8 h-8", overlay ? "text-white" : "text-primary")} />
          <span className={cn("font-['Season'] text-xl sm:text-2xl font-medium", titleColor)}>
            Orin Labs
          </span>
        </Link>

        <button
          type="button"
          className={cn(
            "md:hidden rounded-lg border p-2 transition-colors",
            menuBtn,
          )}
          aria-expanded={isMenuOpen}
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
                "text-sm md:text-base hover:underline cursor-pointer transition-colors",
                linkColor,
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "md:hidden flex-col gap-4 border-t mt-4 pt-4",
          overlay ? "border-white/20" : "border-neutral-200 dark:border-neutral-800",
          isMenuOpen ? "flex" : "hidden",
        )}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
            className={cn(
              "text-base transition-colors w-fit shrink-0",
              linkColor,
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
