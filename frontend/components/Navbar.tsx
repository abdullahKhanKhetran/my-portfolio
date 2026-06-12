"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#portfolio" },
  { label: "Skills", href: "#skills" },
  { label: "Blog", href: "/blogs" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const HASH_ITEMS = NAV_ITEMS.filter((item) => item.href.startsWith("#"));

export default function Navbar() {
  const [active, setActive] = useState("#home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setActive(pathname.startsWith("/blogs") ? "/blogs" : "");
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const offsets = HASH_ITEMS.map((item) => {
        const el = document.querySelector(item.href);
        if (!el) return Number.POSITIVE_INFINITY;
        return el.getBoundingClientRect().top - 90;
      });

      let idx = 0;
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] <= 0) idx = i;
      }

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        idx = HASH_ITEMS.length - 1;
      }

      setActive(HASH_ITEMS[idx].href);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, pathname]);

  const handleClick = (href: string) => {
    if (href.startsWith("/")) {
      setActive(href);
      router.push(href);
      return;
    }
    if (!isHome) {
      router.push(`/${href}`);
      return;
    }
    setActive(href);
    const el = document.querySelector(href) as HTMLElement | null;
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  const isContactActive = active === "#contact";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 py-3 px-4 md:py-4 md:px-8 flex justify-center transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 dark:bg-black/60 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="absolute inset-0 -z-10 backdrop-blur-md" />
      <div className="absolute left-1/2 top-full -translate-x-1/2 h-12 w-[min(88vw,68rem)] bg-black/10 dark:bg-white/20 blur-2xl pointer-events-none" />
      <div className="absolute left-0 top-full h-14 w-full bg-gradient-to-b from-black/10 via-black/[0.03] to-transparent dark:from-black/70 dark:via-black/20 dark:to-transparent pointer-events-none" />

      {/* Theme toggle */}
      <ThemeToggle className="absolute right-16 md:right-6 top-1/2 -translate-y-1/2 z-50" />

      {/* Mobile menu button */}
      <button
        className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-900 dark:text-white z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex list-none gap-6 lg:gap-16 items-center">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <button
              className={`text-sm lg:text-lg font-normal transition-colors duration-200 px-3 py-1 rounded-full focus:outline-none ${
                active === item.href
                  ? isContactActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm"
                    : "bg-black/10 dark:bg-white/10 text-black dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
              }`}
              onClick={() => handleClick(item.href)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/90 backdrop-blur-lg transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center py-6 gap-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <button
                className={`text-base font-medium transition-colors duration-200 px-4 py-2 rounded-full focus:outline-none ${
                  active === item.href
                    ? isContactActive
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm"
                      : "bg-zinc-900/10 text-zinc-900 dark:bg-white/10 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                }`}
                onClick={() => {
                  handleClick(item.href);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}