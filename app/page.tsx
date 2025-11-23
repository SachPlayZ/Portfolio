"use client";

import { useState, useEffect } from "react";
import SpotifyNowNotch from "@/components/SpotifyNowNotch";
import Hero from "@/components/hero";
import MeAtAGlance from "@/components/me-at-a-glance";
import { ProjectDirectory } from "@/components/project-directory";
import { ExperienceTimeline } from "@/components/experience-timeline";
import AchievementsSection from "@/components/achievements-section";
import ContactSection from "@/components/contact-section";
import { AppleSpotlight } from "@/components/ui/apple-spotlight";
import KeyboardShortcutHint from "@/components/keyboard-shortcut-hint";

const Page = () => {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  useEffect(() => {
    const handleOpenSpotlight = () => {
      setIsSpotlightOpen(true);
    };

    window.addEventListener("open-spotlight", handleOpenSpotlight);
    return () =>
      window.removeEventListener("open-spotlight", handleOpenSpotlight);
  }, []);

  return (
    <div className="relative w-full">
      <SpotifyNowNotch />
      <KeyboardShortcutHint />
      <AppleSpotlight
        isOpen={isSpotlightOpen}
        handleClose={() => setIsSpotlightOpen(false)}
      />

      {/* Hero - Stack Order 1 */}
      <div className="relative z-10 bg-[#fdf5e7] md:sticky md:top-0">
        <Hero />
      </div>

      {/* MeAtAGlance - Stack Order 2 */}
      <div className="relative z-20 bg-[#fdf5e7] md:sticky md:top-0">
        <MeAtAGlance />
      </div>

      {/* ProjectDirectory - Stack Order 3 */}
      <div className="relative z-30 bg-[#fdf5e7]">
        <ProjectDirectory />
      </div>

      {/* ExperienceTimeline - Stack Order 4 */}
      <div className="relative z-40 bg-[#fdf5e7] md:sticky md:top-0">
        <ExperienceTimeline />
      </div>

      {/* AchievementsSection - Stack Order 5 */}
      <div className="relative z-50 bg-[#fdf5e7]">
        <AchievementsSection />
      </div>

      {/* ContactSection - Stack Order 6 */}
      <div className="relative z-60 bg-[#fdf5e7] md:sticky md:top-0">
        <ContactSection />
      </div>
    </div>
  );
};

export default Page;
