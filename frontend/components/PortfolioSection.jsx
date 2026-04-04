"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { projects } from "./portfolioData.js";

export default function PortfolioSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-scaleUp");
            }, index * 150);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" className="py-20 px-4 bg-zinc-50 dark:bg-zinc-950">
      <h2
        ref={titleRef}
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-black dark:text-white opacity-0"
        style={{ animationName: "fadeIn", animationDuration: "0.8s", animationFillMode: "both" }}
      >
        Featured Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <div
            key={project.name}
            ref={(el) => (cardsRef.current[index] = el)}
            className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 opacity-0 cursor-pointer group overflow-hidden"
          >
            <div className="absolute inset-0 z-0 opacity-30 blur-lg scale-110">
              <Image
                src={project.icon}
                alt={project.name + " blurred background"}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
            </div>
            <div className="relative z-10 w-20 h-20 mb-4 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image
                src={project.icon}
                alt={project.name + " icon"}
                fill
                style={{ objectFit: "contain", padding: "8px" }}
              />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-black dark:text-white text-center">
              {project.name}
            </h3>

            <p className="text-zinc-600 dark:text-zinc-300 mb-4 text-center leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="bg-black dark:bg-white text-white dark:text-black text-xs px-3 py-1 rounded-full font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.link && project.link !== "#" && (
              <a
                href={project.link}
                className="mt-4 px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Details
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
