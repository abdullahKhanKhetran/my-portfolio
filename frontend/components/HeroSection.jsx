"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function HeroSection() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const profileRef = useRef(null);
  const descRef = useRef(null);

  // Intersection observer for scroll-based animation
  const { ref: heroRef, inView } = useInView({ threshold: 0.3, triggerOnce: false });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          } else {
            entry.target.classList.remove("animate-fadeIn");
          }
        });
      },
      { threshold: 0.1 }
    );

    [titleRef, subtitleRef, profileRef, descRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className={`relative flex flex-col md:flex-row items-center justify-between min-h-screen py-20 px-4 bg-gradient-to-b from-white via-zinc-50 to-white dark:from-black dark:via-zinc-950 dark:to-black transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
      id="home"
    >
      {/* Left: Text */}
      <div className={`flex-1 flex flex-col items-start justify-center text-left z-10 transition-all duration-700 ${inView ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-10"}`}>
        <h2
          ref={subtitleRef}
          className="text-lg font-medium mb-2 text-zinc-600 dark:text-zinc-400 opacity-0 uppercase tracking-wider"
          style={{ animationDelay: "0.4s" }}
        >
          Hello, there!
        </h2>
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold mb-4 text-black dark:text-white opacity-0"
          style={{ animationDelay: "0.6s" }}
        >
          I'm Abdullah
        </h1>
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-zinc-800 dark:text-zinc-200 opacity-0" style={{ animationDelay: "0.8s" }}>
          Full Stack Developer
        </h3>
        <p
          ref={descRef}
          className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 mb-8 opacity-0 leading-relaxed"
          style={{ animationDelay: "1s" }}
        >
          I build web, mobile, and desktop applications with modern tech stacks. Specializing in Flutter, .NET, Next.js, React, FastAPI, and Django with DevOps expertise. Passionate about creating sharp, vibrant, and responsive user experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 opacity-0" style={{ animationDelay: "1.2s" }}>
          <a
            href="#portfolio"
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-300"
          >
            See My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white font-semibold rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
          >
            Get In Touch
          </a>
        </div>
      </div>
      {/* Right: Profile Image */}
      <div className={`flex-1 flex items-center justify-center w-full md:w-auto mt-12 md:mt-0 transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
        <div
          ref={profileRef}
          className="relative w-80 h-96 rounded-3xl overflow-hidden border-4 border-black dark:border-white shadow-2xl bg-black/30 opacity-0"
          style={{ animationDelay: "0.2s" }}
        >
          <Image
            src="/my_pictures/side_pose.jpg"
            alt="Abdullah - Profile"
            fill
            style={{ objectFit: "cover" }}
            priority
            className="hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
}
