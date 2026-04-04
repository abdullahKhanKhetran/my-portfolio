"use client";

import Image from "next/image";
export default function HeroSection({ motionSigned = 0 }) {
  const textShift = motionSigned * 9;
  const imageShift = -motionSigned * 9;

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between min-h-screen py-20 px-4 overflow-x-clip">
      {/* Left: Text */}
      <div
        style={{ transform: `translate3d(${textShift}vw, 0, 0)` }}
        className="flex-1 flex flex-col items-start justify-center text-left z-10 will-change-transform"
      >
        <h2 className="text-lg font-medium mb-2 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          Hello, there!
        </h2>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-black dark:text-white">
          I'm Abdullah
        </h1>
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-zinc-800 dark:text-zinc-200">
          Full Stack Developer
        </h3>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
          I build web, mobile, and desktop applications with modern tech stacks. Specializing in Flutter, .NET, Next.js, React, FastAPI, and Django with DevOps expertise. Passionate about creating sharp, vibrant, and responsive user experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#projects"
            className="px-8 py-3 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-semibold rounded-lg hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all duration-300"
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
      <div
        style={{ transform: `translate3d(${imageShift}vw, 0, 0)` }}
        className="flex-1 flex items-center justify-center w-full md:w-auto mt-12 md:mt-0 will-change-transform"
      >
        <div
          className="relative w-80 h-96 rounded-3xl overflow-hidden border-4 border-black dark:border-white shadow-2xl bg-black/30"
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
    </div>
  );
}
