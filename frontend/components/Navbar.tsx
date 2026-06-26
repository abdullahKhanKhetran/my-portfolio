"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { FEATURE_FLAGS } from "../lib/featureFlags";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "#home",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10.5L12 3l9 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    label: "Projects",
    href: "#portfolio",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
      </svg>
    ),
  },
  {
    label: "Skills",
    href: "#skills",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l1.8 5.4L19 9.2l-4.5 3.2L16 18l-4-2.7L8 18l1.5-5.6L5 9.2l5.2-1.8L12 2z" />
      </svg>
    ),
  },
  {
    label: "Testimonials",
    href: "#testimonials",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6M7 16h10" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 3v-3H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "#contact",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16v12H4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7l8 6 8-6" />
      </svg>
    ),
  },
  {
    label: "Blog",
    href: "/blogs",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12v18H6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    ),
  },
  {
    label: "Chat",
    href: "/chat",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14a2 2 0 012 2v8a2 2 0 01-2 2H9l-4 4v-4H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
      </svg>
    ),
  },
];

const VISIBLE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.href !== "/chat" || FEATURE_FLAGS.chat);
const HASH_ITEMS = VISIBLE_NAV_ITEMS.filter((item) => item.href.startsWith("#"));

const SHAPE_VARIANTS = [
  "rounded-tl-[999px] rounded-tr-[14px] rounded-br-[999px] rounded-bl-[14px]",
  "rounded-tl-[14px] rounded-tr-[999px] rounded-br-[14px] rounded-bl-[999px]",
];

export default function Navbar() {
  const [active, setActive] = useState("#home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isBlogRoute = pathname.startsWith("/blogs");
  const currentActive = isHome ? active : isBlogRoute ? "/blogs" : "";

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
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
  }, [isHome]);

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

  const sharedNavClass = (item: NavItem, index: number, mobile = false) => {
    const shape = SHAPE_VARIANTS[index % 2];
    const base = mobile
      ? "w-full text-left px-4 py-3 text-base font-medium"
      : `group relative inline-flex h-12 items-center overflow-hidden px-3 transition-all duration-300 hover:scale-105 ${shape}`;
    const activeClass =
      currentActive === item.href
        ? isContactActive && item.href === "#contact"
          ? "bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm"
          : mobile
            ? "bg-zinc-900/10 text-zinc-900 dark:bg-white/10 dark:text-white"
            : "bg-black/10 dark:bg-white/10 text-black dark:text-white shadow-sm"
        : mobile
          ? "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          : "bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white";
    return `${base} ${activeClass}`;
  };

  const renderDesktopItem = (item: NavItem, index: number) => {
    const className = sharedNavClass(item, index, false);
    const labelClass = `ml-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-out ${
      currentActive === item.href
        ? "opacity-100 max-w-28 translate-x-0"
        : "max-w-0 opacity-0 -translate-x-3 group-hover:max-w-28 group-hover:opacity-100 group-hover:translate-x-0"
    }`;

    if (item.href.startsWith("/")) {
      return (
        <Link href={item.href} prefetch className={className}>
          <span className="flex items-center justify-center">{item.icon}</span>
          <span className={labelClass}>{item.label}</span>
        </Link>
      );
    }

    return (
      <button className={className} onClick={() => handleClick(item.href)} aria-label={item.label}>
        <span className="flex items-center justify-center">{item.icon}</span>
        <span className={labelClass}>{item.label}</span>
      </button>
    );
  };

  const renderMobileItem = (item: NavItem, index: number) => {
    const className = sharedNavClass(item, index, true);

    if (item.href.startsWith("/")) {
      return (
        <Link href={item.href} prefetch onClick={() => setIsMobileMenuOpen(false)} className={className}>
          {item.label}
        </Link>
      );
    }

    return (
      <button
        className={className}
        onClick={() => {
          handleClick(item.href);
          setIsMobileMenuOpen(false);
        }}
      >
        {item.label}
      </button>
    );
  };

  return (
    <>
      <nav className="pointer-events-none fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 md:block">
        <div className="pointer-events-auto">
          <ul className="flex items-center gap-4 lg:gap-5">
            {VISIBLE_NAV_ITEMS.map((item, index) => (
              <li key={item.href}>{renderDesktopItem(item, index)}</li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="pointer-events-none fixed right-6 top-4 z-50 hidden md:block">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>

      <nav className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col items-end gap-3 md:right-6 md:top-6 md:hidden">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>

        <div className="pointer-events-auto relative">
          <button
            className="flex h-12 w-12 items-center justify-center rounded-tl-[14px] rounded-tr-[999px] rounded-br-[14px] rounded-bl-[999px] bg-white/75 text-zinc-900 shadow-xl shadow-black/10 backdrop-blur-md transition-transform duration-200 hover:scale-105 dark:bg-black/45 dark:text-white"
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

          <div
            className={`absolute right-0 top-full mt-3 w-[min(88vw,18rem)] rounded-3xl border border-black/5 bg-white/95 p-3 shadow-2xl shadow-black/15 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-black/90 ${
              isMobileMenuOpen
                ? "visible opacity-100 translate-y-0"
                : "pointer-events-none invisible opacity-0 -translate-y-2"
            }`}
          >
            <ul className="flex flex-col gap-2">
              {VISIBLE_NAV_ITEMS.map((item, index) => (
                <li key={item.href}>{renderMobileItem(item, index)}</li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
