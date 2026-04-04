import HeroSection from "../components/HeroSection.jsx";
import PortfolioSection from "../components/PortfolioSection.jsx";
import SkillsSection from "../components/SkillsSection.jsx";
import TestimonialsSection from "../components/TestimonialsSection.jsx";
import ContactSection from "../components/ContactSection.jsx";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-black font-sans overflow-x-hidden">
      <HeroSection />
      <PortfolioSection />
      <SkillsSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
