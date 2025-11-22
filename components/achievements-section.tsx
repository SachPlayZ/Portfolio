"use client";

import { GlowEffect } from "@/components/ui/glow-effect";
import { Trophy, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Instrument_Serif, Roboto_Condensed } from "next/font/google";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

interface Achievement {
  _id: string;
  position: string;
  description: string;
  image?: string;
  link?: string;
}

const DEMO_ACHIEVEMENTS: Achievement[] = [
  {
    _id: "1",
    position: "1st",
    description: "HackMIT 2024 Winner",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    link: "https://hackmit.org",
  },
  {
    _id: "2",
    position: "2nd",
    description: "Global AI Challenge",
    link: "https://example.com/ai-challenge",
  },
  {
    _id: "3",
    position: "3rd",
    description: "Web3 Innovation Awards",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
    link: "https://example.com/web3-awards",
  },
  {
    _id: "4",
    position: "Finalist",
    description: "Google Solution Challenge",
    link: "https://developers.google.com/community/gdsc-solution-challenge",
  },
  {
    _id: "5",
    position: "Best UI",
    description: "Designathon 2023",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    link: "https://example.com/designathon",
  },
  {
    _id: "6",
    position: "Top 10",
    description: "Open Source Contributor",
    link: "https://github.com",
  },
  {
    _id: "7",
    position: "Winner",
    description: "Blockchain Hackathon",
    image:
      "https://images.unsplash.com/photo-1621504450168-38f684480e3e?q=80&w=2670&auto=format&fit=crop",
    link: "https://example.com/blockchain-hack",
  },
  {
    _id: "8",
    position: "Top 10",
    description: "Open Source Contributor",
    link: "https://github.com",
  },
  {
    _id: "9",
    position: "Winner",
    description: "Blockchain Hackathon",
    image:
      "https://images.unsplash.com/photo-1621504450168-38f684480e3e?q=80&w=2670&auto=format&fit=crop",
    link: "https://example.com/blockchain-hack",
  },
];

export default function AchievementsSection() {
  const getTrophyColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes("1st") || pos.includes("winner") || pos.includes("gold"))
      return "text-yellow-500";
    if (pos.includes("2nd") || pos.includes("silver")) return "text-slate-400";
    if (pos.includes("3rd") || pos.includes("bronze")) return "text-amber-700";
    return "text-emerald-600";
  };

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const maxScroll = scrollWidth - viewportWidth;
  const finalScroll = maxScroll > 0 ? -maxScroll : 0;
  // Adding a small buffer or changing the range to ensure it triggers
  const x = useTransform(scrollYProgress, [0, 0.9], [0, finalScroll]);

  useEffect(() => {
    const updateDimensions = () => {
      if (scrollContainerRef.current) {
        setScrollWidth(scrollContainerRef.current.scrollWidth);
        setViewportWidth(window.innerWidth);
      }
    };

    // Wait for layout to settle
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="achievements"
      ref={sectionRef}
      className="relative h-[300vh] w-full bg-[#fdf5e7]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center py-20">
        {/* Header */}
        <div className="container mx-auto px-6 mb-12 z-10">
          <h2
            className={`${instrumentSerif.className} text-5xl md:text-7xl font-normal text-slate-800 mb-4 tracking-tight`}
          >
            My <span className="text-[#3ba58b] italic">Achievements</span>
          </h2>
          <p
            className={`${robotoCondensed.className} text-slate-600 text-xl max-w-xl`}
          >
            Recognitions and milestones from my journey.
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative w-full flex-1 flex items-center">
          {/* Fade Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-linear-to-r from-[#fdf5e7] via-[#fdf5e7]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-linear-to-l from-[#fdf5e7] via-[#fdf5e7]/80 to-transparent z-20 pointer-events-none" />

          {/* Scrollable Area */}
          <motion.div
            ref={scrollContainerRef}
            style={{ x }}
            className="flex gap-6 px-[5vw] items-center w-max"
          >
            <div className="grid grid-rows-2 grid-flow-col gap-6 w-max">
              {DEMO_ACHIEVEMENTS.map((achievement) => (
                <div
                  key={achievement._id}
                  className="group relative h-64 w-[300px] md:w-[380px] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Glow Effect - Visible on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none">
                    <GlowEffect
                      colors={["#10b981", "#34d399", "#059669", "#047857"]} // Emerald shades
                      mode="rotate"
                      blur="medium"
                      duration={3}
                      scale={1.1}
                    />
                  </div>

                  {/* Card Content Container - Inset to reveal glow on hover */}
                  <div className="absolute inset-[2px] rounded-xl overflow-hidden z-10 bg-white">
                    {/* Background Image or Liquid Glass */}
                    {achievement.image ? (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-80"
                          style={{
                            backgroundImage: `url(${achievement.image})`,
                          }}
                        />
                        {/* Light Overlay to ensure text readability */}
                        <div className="absolute inset-0 bg-linear-to-t from-white via-white/70 to-white/30" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px]" />
                    )}

                    {/* Content */}
                    <div className="relative h-full p-6 flex flex-col justify-between">
                      {/* Top Row */}
                      <div className="flex justify-between items-start">
                        {/* Trophy / Position */}
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                          <Trophy
                            className={cn(
                              "w-4 h-4",
                              getTrophyColor(achievement.position)
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm font-bold",
                              getTrophyColor(achievement.position)
                            )}
                          >
                            {achievement.position}
                          </span>
                        </div>

                        {/* Link Arrow */}
                        {achievement.link && (
                          <Link
                            href={achievement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/80 hover:bg-[#3ba58b] backdrop-blur-md rounded-full border border-slate-200 transition-all text-slate-500 hover:text-white shadow-sm hover:border-[#3ba58b]"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <h3
                          className={`${instrumentSerif.className} text-2xl font-bold text-slate-800 group-hover:text-[#3ba58b] transition-colors duration-300 leading-tight`}
                        >
                          {achievement.description}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
