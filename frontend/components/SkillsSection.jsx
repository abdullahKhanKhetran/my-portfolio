"use client";

import { useEffect, useRef, useState } from "react";

export default function SkillsSection() {
  const skillsData = [
    { name: "UI/UX Design", level: 90 },
    { name: "Next.js / React", level: 95 },
    { name: "Flutter", level: 88 },
    { name: ".NET Development", level: 85 },
    { name: "FastAPI / Django", level: 87 },
    { name: "DevOps", level: 82 },
  ];

  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated) {
          setAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-white dark:bg-black">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black dark:text-white">
        Skills & Expertise
      </h2>

      <div className="max-w-2xl mx-auto space-y-8">
        {skillsData.map((skill, index) => (
          <div
            key={skill.name}
            className="opacity-0 animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between mb-2">
              <span className="text-lg font-semibold text-black dark:text-white">
                {skill.name}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {animated ? skill.level : 0}%
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-black dark:bg-white h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${skill.level}%` : "0%",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
