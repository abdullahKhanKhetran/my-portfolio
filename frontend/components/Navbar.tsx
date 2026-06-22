"use client";

import Link from "next/link";
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
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "/blogs" },
];

const HASH_ITEMS = NAV_ITEMS.filter((item) => item.href.startsWith("#"));

export default function Navbar() {
  const [active, setActive] = useState("#home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isBlogRoute = pathname.startsWith("/blogs");
  const currentActive = isHome ? active : isBlogRoute ? "/blogs" : "";

  useEffect(() => {
    if (!isHome) {
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

  const isContactActive = currentActive === "#contact";

  const renderNavItem = (item: NavItem, mobile = false) => {
    const sharedClassName = `transition-colors duration-200 rounded-full focus:outline-none ${
      mobile ? "px-4 py-2 text-base font-medium" : "px-3 py-1 text-sm lg:text-lg font-normal"
    } ${
      currentActive === item.href
        ? isContactActive && item.href === "#contact"
          ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm"
          : mobile
            ? "bg-zinc-900/10 text-zinc-900 dark:bg-white/10 dark:text-white"
            : "bg-black/10 dark:bg-white/10 text-black dark:text-white shadow-sm"
        : mobile
          ? "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          : "text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
    }`;

    if (item.href.startsWith("/")) {
      return (
        <Link
          href={item.href}
          prefetch
          onClick={() => {
            if (mobile) setIsMobileMenuOpen(false);
          }}
          className={sharedClassName}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <button
        className={sharedClassName}
        onClick={() => {
          handleClick(item.href);
          if (mobile) setIsMobileMenuOpen(false);
        }}
      >
        {item.label}
      </button>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 z-50 flex w-full justify-center border-b border-transparent px-4 py-4 transition-all duration-300 md:px-8 md:py-4 ${
        isScrolled
          ? "bg-white/75 dark:bg-black/65 backdrop-blur-md border-black/5 dark:border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="absolute inset-0 -z-10 backdrop-blur-md" />
      <div className="absolute left-1/2 top-full h-12 w-[min(88vw,68rem)] -translate-x-1/2 bg-black/10 dark:bg-white/20 blur-2xl pointer-events-none" />
      <div className="absolute left-0 top-full h-14 w-full bg-gradient-to-b from-black/10 via-black/[0.03] to-transparent dark:from-black/70 dark:via-black/20 dark:to-transparent pointer-events-none" />

      <ThemeToggle className="absolute right-16 top-1/2 z-50 -translate-y-1/2 md:right-6" />

      <button
        className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full border border-zinc-900/10 bg-white/80 p-3 text-zinc-900 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/30 dark:text-white md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <ul className="hidden items-center list-none gap-6 lg:gap-16 md:flex">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>{renderNavItem(item)}</li>
        ))}
      </ul>

      <div
        className={`absolute left-0 top-full w-full border-b border-black/5 bg-white/95 backdrop-blur-lg transition-all duration-300 dark:border-white/10 dark:bg-black/90 md:hidden ${
          isMobileMenuOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-4 px-4 py-6 pb-7">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>{renderNavItem(item, true)}</li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
