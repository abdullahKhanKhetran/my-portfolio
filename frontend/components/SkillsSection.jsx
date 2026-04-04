"use client";

import { useEffect, useMemo, useState } from "react";


export default function SkillsSection({ motionSigned = 0, motionDirection = -1, motionProgress = 0 }) {
  const skillsData = useMemo(() => [
    { name: "UI/UX Design", level: 90 },
    { name: "Next.js / React", level: 95 },
    { name: "Flutter", level: 88 },
    { name: ".NET Development", level: 85 },
    { name: "FastAPI / Django", level: 87 },
    { name: "DevOps", level: 82 },
  ], []);

  const [revealed, setRevealed] = useState(false);
  const contentShift = motionSigned * motionDirection * 9;

  useEffect(() => {
    if (motionProgress >= 0.3 && !revealed) {
      setRevealed(true);
    } else if (motionProgress < 0.3 && revealed) {
      setRevealed(false);
    }
  }, [motionProgress, revealed]);

  return (
    <section className="py-20 px-4">
      <div
        style={{ transform: `translate3d(${contentShift}vw, 0, 0)` }}
        className="will-change-transform"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black dark:text-white">
          Skills & Expertise
        </h2>

        <div className="max-w-2xl mx-auto space-y-8">
          {skillsData.map((skill, index) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2">
                <span className="text-lg font-semibold text-black dark:text-white">
                  {skill.name}
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {revealed ? skill.level : 0}%
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-black dark:bg-white h-full rounded-full transition-all ease-out"
                  style={{
                    width: revealed ? `${skill.level}%` : "0%",
                    transitionDuration: "800ms",
                    transitionDelay: revealed ? `${index * 100}ms` : "0ms",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
