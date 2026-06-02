import { useEffect, useState } from "react";

import { LinkedinIcon, Menu, TwitterIcon, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "slate-ui";

import { Logo } from "./Logo";

const NAV_ITEMS = [
  { label: "Join Us", path: "/#join-us" },
];


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

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

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
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

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center min-h-screen pt-6 sm:pt-8 gap-12 sm:gap-16 px-4 sm:px-6 lg:px-8">
      <nav className="w-full max-w-3xl xl:max-w-4xl z-10">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="text-primary w-8 h-8" />
            <h1 className="text-xl sm:text-2xl font-medium text-neutral-900 dark:text-neutral-100">
              Orin Labs
            </h1>
          </Link>

          <button
            type="button"
            className="md:hidden rounded-lg border border-neutral-200 dark:border-neutral-700 p-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                to={item.path}
                key={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline cursor-pointer transition-colors"
              >
                {item.label}
              </Link>
            ))}

          </div>
        </div>

        <div
          className={cn(
            "md:hidden flex-col gap-4 border-t border-neutral-200 dark:border-neutral-800 mt-4 pt-4",
            isMenuOpen ? "flex" : "hidden"
          )}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              to={item.path}
              key={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className="text-base text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors w-fit shrink-0"
            >
              {item.label}
            </Link>
          ))}

        </div>
      </nav>

      <div
        key={pathname}
        className="page-transition w-full max-w-3xl xl:max-w-4xl flex-1 flex flex-col gap-16 sm:gap-24"
      >
        {children}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-3xl xl:max-w-4xl z-10 flex flex-col md:flex-row border-t border-neutral-200 dark:border-neutral-800 mt-12 gap-4 md:gap-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} Orin Labs. All rights reserved.
            <span className="mx-2 text-xs">-</span>
            <Link
              to="/privacy"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Privacy
            </Link>
            <span className="mx-2 text-xs">-</span>
            <Link
              to="/terms"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              Terms
            </Link>
          </p>

          <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
            <a
              href="https://x.com/0rinlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors cursor-pointer"
            >
              <TwitterIcon className="w-3 h-3 font-light" />
            </a>
            <a
              href="https://www.linkedin.com/company/104572054/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-500 transition-colors cursor-pointer"
            >
              <LinkedinIcon className="w-3 h-3 font-light" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
