import HeroSection from "../components/HeroSection";
import PortfolioSection from "../components/PortfolioSection";
import SkillsSection from "../components/SkillsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import AnimatedSection from "../components/AnimatedSection";
import { getProjects, getSkills, getTestimonials, getProfileBundle, parsePersonProfile } from "../lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [projects, skills, testimonials, profileBundle] = await Promise.all([
    getProjects(),
    getSkills(),
    getTestimonials(),
    getProfileBundle(),
  ]);

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
      <AnimatedSection id="testimonials" parallaxOffset={20}>
        <TestimonialsSection testimonials={testimonials} />
      </AnimatedSection>
      <AnimatedSection id="contact" parallaxOffset={10}>
        <ContactSection />
      </AnimatedSection>
    </>
  );
}
