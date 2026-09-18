import Link from "next/link";
import HeroSection from "../components/HeroSection";
import PortfolioSection from "../components/PortfolioSection";
import SkillsSection from "../components/SkillsSection";
import ContactSection from "../components/ContactSection";
import AnimatedSection from "../components/AnimatedSection";
import { getProjects, getSkills, getProfileBundle, parsePersonProfile } from "../lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [projectsResult, skillsResult, profileResult] = await Promise.allSettled([
    getProjects(),
    getSkills(),
    getProfileBundle(),
  ]);

  const projects = projectsResult.status === "fulfilled" ? projectsResult.value : [];
  const skills = skillsResult.status === "fulfilled" ? skillsResult.value : [];
  const profileBundle =
    profileResult.status === "fulfilled"
      ? profileResult.value
      : { person: "", resume: "", hero_image_url: null };

  const profile = parsePersonProfile(profileBundle.person);

  return (
    <>
      <AnimatedSection id="home" parallaxOffset={0}>
        <HeroSection profile={profile} heroImageUrl={profileBundle.hero_image_url?.trim() || undefined} />
      </AnimatedSection>
      <AnimatedSection id="portfolio" parallaxOffset={20}>
        <PortfolioSection projects={projects} />
      </AnimatedSection>
      <AnimatedSection id="skills" parallaxOffset={15}>
        <SkillsSection skills={skills} />
      </AnimatedSection>
      <section className="px-4 pb-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/blogs"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium text-zinc-700 transition-all duration-300 hover:scale-[1.03] hover:text-zinc-900 sm:w-auto"
            style={{ borderColor: "var(--card-border)" }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12v18H6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6M9 11h6M9 15h4" />
            </svg>
            Read the blog
          </Link>
          <Link
            href="/resume"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium text-zinc-700 transition-all duration-300 hover:scale-[1.03] hover:text-zinc-900 sm:w-auto"
            style={{ borderColor: "var(--card-border)" }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6M7 16h4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
            </svg>
            View resume
          </Link>
        </div>
      </section>
      <AnimatedSection id="contact" parallaxOffset={10}>
        <ContactSection />
      </AnimatedSection>
    </>
  );
}

