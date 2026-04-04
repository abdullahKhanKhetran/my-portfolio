"use client";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#portfolio" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("#home");
  useEffect(() => {
    const handleScroll = () => {
      const offsets = NAV_ITEMS.map((item) => {
        const el = document.querySelector(item.href);
        if (!el) return Number.POSITIVE_INFINITY;
        return el.getBoundingClientRect().top - 90; // 80 + 10px buffer
      });
      // Find the last section whose top is above the navbar
      let idx = 0;
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] <= 0) idx = i;
      }
      // If at the bottom, select last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        idx = NAV_ITEMS.length - 1;
      }
      setActive(NAV_ITEMS[idx].href);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href) => {
    setActive(href);
    const el = document.querySelector(href);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  // Determine if background is light for contact section
  const isContactActive = active === "#contact";
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent py-4 px-8 flex justify-center">
      <div className="absolute inset-0 -z-10 backdrop-blur-md" />
      <div className="absolute left-1/2 top-full -translate-x-1/2 h-12 w-[min(88vw,68rem)] bg-black/45 dark:bg-white/20 blur-2xl pointer-events-none" />
      <div className="absolute left-0 top-full h-14 w-full bg-gradient-to-b from-black/55 via-black/18 to-transparent dark:from-black/70 dark:via-black/20 dark:to-transparent pointer-events-none" />
      <ul className="list-none flex gap-10 md:gap-16 items-center">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <button
              className={`text-lg font-normal transition-colors duration-200 px-3 py-1 rounded-full focus:outline-none ${
                active === item.href
                  ? isContactActive
                    ? "bg-white text-black shadow-sm"
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
    </nav>
  );
}
