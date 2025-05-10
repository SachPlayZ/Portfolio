import HeroSection from "@/components/hero-section";
import SkillsSection from "@/components/skills-section";
import ProjectsSection from "@/components/project-section";
import JourneySection from "@/components/journey-section";
import ExperienceSection from "@/components/experience-section";
import ContactSection from "@/components/contact-section";
import AnimatedSection from "@/components/animated-section";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AnimatedSection>
        <SkillsSection />
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
