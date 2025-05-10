"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Trophy, Calendar, Award, Users } from "lucide-react";

const journeyItems = [
  {
    title: "CoinDCX Unfold Hackathon",
    date: "August 2023",
    description:
      "Won first place with VeilX, a privacy-focused decentralized exchange.",
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
  },
  {
    title: "Open Campus Hackathon",
    date: "March 2023",
    description:
      "Developed Orphic, a Web3 marketplace for digital collectibles.",
    icon: <Award className="w-6 h-6 text-purple-400" />,
  },
  {
    title: "HackHeritage",
    date: "November 2022",
    description:
      "Created Ruins of Rome, an immersive blockchain-based strategy game.",
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
  },
  {
    title: "GDG Web3 Mentor",
    date: "2022 - Present",
    description: "Mentoring aspiring Web3 developers and conducting workshops.",
    icon: <Users className="w-6 h-6 text-blue-400" />,
  },
];

export default function JourneySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="journey" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            My Web3 Journey
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A timeline of my achievements, hackathons, and contributions to the
            Web3 ecosystem.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-800 z-0">
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-purple-600 to-fuchsia-600 glow-border"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Timeline items */}
          <div className="relative z-10">
            {journeyItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-1/2 ${
                    index % 2 === 0 ? "pl-8" : "pr-8 text-right"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-xl font-bold mb-1 text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 mb-3 text-sm">
                      <Calendar size={14} />
                      <span>{item.date}</span>
                    </div>
                    <p className="text-gray-400">{item.description}</p>
                  </motion.div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: index * 0.1 + 0.2,
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="w-12 h-12 rounded-full bg-gray-900 border-2 border-purple-600 flex items-center justify-center glow-border z-20"
                  >
                    {item.icon}
                  </motion.div>
                </div>

                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
