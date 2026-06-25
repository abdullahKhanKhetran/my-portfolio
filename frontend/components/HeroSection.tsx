"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { type PersonProfile } from "../lib/content";

interface HeroSectionProps {
  isVisible?: boolean;
  profile?: PersonProfile;
  heroImageUrl?: string;
}

const FALLBACK_HERO_IMAGE_URL = "/my_pictures/side_pose.jpg";

function ProfileWindow({ isVisible, heroImageUrl }: { isVisible: boolean; heroImageUrl?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[470px]"
    >
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d]/90 shadow-2xl shadow-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-white/5 bg-[#1a1a1a] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>

        <div className="relative aspect-[4/5] bg-black/20">
          <Image
            src={heroImageUrl?.trim() || FALLBACK_HERO_IMAGE_URL}
            alt="Abdullah Khan side profile"
            fill
            priority
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 420px, 470px"
            style={{ objectFit: "cover", objectPosition: "center 15%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

function HeroButtons() {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <a href="#portfolio" className="rounded-lg bg-zinc-900 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:px-8 sm:text-base">
        See My Work
      </a>
      <a href="#contact" className="rounded-lg border border-zinc-900/30 px-6 py-3 text-center text-sm font-semibold text-zinc-900 transition-all duration-300 hover:bg-zinc-900/5 dark:border-white/30 dark:text-white dark:hover:bg-white/10 sm:px-8 sm:text-base">
        Get In Touch
      </a>
    </div>
  );
}

function HeroIntro({ profile, className = "" }: { profile?: PersonProfile; className?: string }) {
  const name = profile?.name || "Abdullah";
  const role = profile?.role || "Full Stack Developer";
  const about = profile?.about || "I build web, mobile, and desktop applications with modern tech stacks. Specializing in Flutter, .NET, Next.js, React, FastAPI, and Django with DevOps expertise.";

  return (
    <div className={className}>
      <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-green-600 dark:text-green-400 sm:text-sm">
        &gt; Hello, world!
      </p>
      <h1 className="mb-3 text-3xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-4xl md:mb-4 md:text-5xl lg:text-7xl">
        I&apos;m {name.split(" ")[0]}
      </h1>
      <h3 className="mb-4 text-lg font-semibold text-zinc-700 dark:text-zinc-300 sm:text-xl md:mb-6 md:text-2xl">
        {role}
      </h3>
      <p className="mb-6 max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base md:mb-8">
        {about}
      </p>
    </div>
  );
}

export default function HeroSection({ isVisible = false, profile, heroImageUrl }: HeroSectionProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center gap-8 overflow-x-clip px-4 py-16 sm:px-6 md:flex-row md:items-center md:gap-16 md:py-20 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="z-10 order-1 flex w-full flex-1 flex-col items-start justify-center text-left md:hidden">
        <HeroIntro profile={profile} />
      </motion.div>

      <div className="order-2 flex w-full flex-1 items-center justify-center md:order-2 md:flex md:max-h-none">
        <ProfileWindow isVisible={isVisible} heroImageUrl={heroImageUrl} />
      </div>

      <motion.div initial={{ opacity: 0, y: 32 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="order-3 flex w-full flex-col gap-3 md:hidden">
        <HeroButtons />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 32 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="z-10 hidden flex-1 flex-col items-start justify-center text-left md:order-1 md:flex">
        <HeroIntro profile={profile} />
        <HeroButtons />
      </motion.div>
    </div>
  );
}

