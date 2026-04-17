import HeroSection from "../components/HeroSection";
import PortfolioSection from "../components/PortfolioSection";
import SkillsSection from "../components/SkillsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ContactSection from "../components/ContactSection";
import AnimatedSection from "../components/AnimatedSection";

export default function Home() {
  return (
    <>
      <AnimatedSection id="home" parallaxOffset={0}>
        <HeroSection />
      </AnimatedSection>
      <AnimatedSection id="portfolio" parallaxOffset={20}>
        <PortfolioSection />
      </AnimatedSection>
      <AnimatedSection id="skills" parallaxOffset={15}>
        <SkillsSection />
      </AnimatedSection>
      <AnimatedSection id="testimonials" parallaxOffset={20}>
        <TestimonialsSection />
      </AnimatedSection>
      <AnimatedSection id="contact" parallaxOffset={10}>
        <ContactSection />
      </AnimatedSection>
    </>
  );
}
