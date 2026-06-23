import { useEffect } from "react";

import { LinkedinIcon, TwitterIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "slate-ui";

import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  // When provided, the hero (image + overlaid title) renders full-width at the
  // top with the nav set inside it, and the page root switches to p-8.
  hero?: React.ReactNode;
}

export default function Layout({ children, hero }: LayoutProps) {
  const { pathname } = useLocation();

  // The handbook uses a wide, two-column (sidebar + content) layout. We widen
  // the shared `.site-col` so the nav/content/footer expand to (near) full
  // page; the max-width transition animates the change as you switch routes.
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

  return (
    <div
      className={cn(
        "bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center",
        hero
          ? "min-h-screen p-0 md:p-8 md:pt-12 gap-6 sm:gap-8"
          : isWide
            ? "h-screen overflow-hidden"
            : "min-h-screen pt-6 sm:pt-8 gap-12 sm:gap-16 p-4 sm:p-6 lg:p-8",
      )}
    >
      {hero ? (
        <div className="relative w-full overflow-hidden md:rounded-2xl border-b md:border md:rounded-xl border-neutral-200 dark:border-neutral-800 h-[70vh] bg-[#f4f3ef] dark:bg-[#262626]">
          {hero}
          <div className="absolute inset-x-0 top-0 z-20 px-6 sm:px-8 pt-8 pb-5 md:py-5">
            <Navbar />
          </div>
        </div>
      ) : isWide ? (
        <div className="w-full z-10 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Navbar />
        </div>
      ) : (
        <div className="site-col z-10">
          <Navbar />
        </div>
      )}

      {hero ? (
        <div
          key={pathname}
          className="page-transition w-full px-8 sm:px-10 lg:px-12 flex-1 flex flex-col gap-12 sm:gap-18"
        >
          {children}
        </div>
      ) : (
        <div
          className={cn(
            "flex-1 flex flex-col",
            isWide ? "w-full min-h-0 overflow-hidden" : "site-col",
          )}
        >
          <div
            key={isWide ? "handbook" : pathname}
            className={cn(
              "page-transition flex-1 flex flex-col",
              isWide ? "min-h-0 overflow-hidden" : "gap-12 sm:gap-18",
            )}
          >
            {children}
          </div>
        </div>
      )}

      {/* Footer */}
      {!isWide && <footer
        className={cn(
          "z-10 flex flex-col md:flex-row border-t border-neutral-200 dark:border-neutral-800 mt-12 gap-4 md:gap-6 py-8 md:py-12",
          hero
            ? "w-full max-w-3xl xl:max-w-4xl px-8 md:px-0"
            : cn("site-col", isWide && "is-wide"),
        )}
      >
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
      </footer>}
    </div>
  );
}
