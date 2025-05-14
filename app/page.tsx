import HeroSection from "@/components/hero-section";
import ProjectsSection from "@/components/project-section";
import JourneySection from "@/components/journey-section";
import ExperienceSection from "@/components/experience-section";
import ContactSection from "@/components/contact-section";
import AnimatedSection from "@/components/animated-section";
import AboutMeBento from "@/components/ui/about-me-bento";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AnimatedSection>
        <AboutMeBento />
      </AnimatedSection>
      <AnimatedSection>
        <ProjectsSection />
      </AnimatedSection>
      <AnimatedSection>
        <JourneySection />
      </AnimatedSection>
      <AnimatedSection>
        <ExperienceSection />
      </AnimatedSection>
      <AnimatedSection>
        <ContactSection />
      </AnimatedSection>
    </div>
  );
}
