
import HeroSection from '../components/HeroSection';
import PortfolioSection from '../components/PortfolioSection';
import SkillsSection from '../components/SkillsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import AnimatedSection from '../components/AnimatedSection';

export default function Home() {
  return (
    <>
      <AnimatedSection id="home">
        <HeroSection />
      </AnimatedSection>
      <AnimatedSection id="projects">
        <PortfolioSection />
      </AnimatedSection>
      <AnimatedSection id="skills">
        <SkillsSection />
      </AnimatedSection>
      <AnimatedSection id="testimonials">
        <TestimonialsSection />
      </AnimatedSection>
      <AnimatedSection id="contact">
        <ContactSection />
      </AnimatedSection>
    </>
  );
}