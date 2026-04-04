"use client";
import { useEffect, useState } from "react";

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
        if (!el) return 0;
        return el.getBoundingClientRect().top - 80;
      });
      const idx = offsets.findIndex((offset, i) =>
        offset > 0 && (i === 0 || offsets[i - 1] <= 0)
      );
      setActive(NAV_ITEMS[Math.max(0, idx - 1)].href);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href) => {
    setActive(href);
    const el = document.querySelector(href);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 60,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm py-4 px-8 flex justify-center">
      <ul className="flex gap-10 md:gap-16">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <button
              className={`text-lg font-semibold transition-colors duration-200 px-2 py-1 rounded-md focus:outline-none ${
                active === item.href
                  ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
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
