"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    company: "Alchemyst AI",
    position: "Software Engineer",
    period: "March 2025 - May 2025",
    location: "Remote",
    description: [
      "Architected DeepResearch UI from the ground up, enabling users to dissect LLM thought processes with interactive visualizations and real-time code execution for stock analysis, enhancing user engagement by 40%.",
      "Worked on building the transcripts feature that allows customers to view the conversations happening in their campaigns through the AI SDR.",
      "Working on integrating GenAI pipelines into the frontend interface for seamless interactions with our AI employees.",
    ],
    logo: "/alchemyst-ai.jpeg",
  },
  {
    company: "QuillAI",
    position: "Dev Rel Engineer",
    period: "Dec 2024 - Feb 2025",
    location: "Remote",
    description: [
      "Fostered healthy partnerships with 40+ universities across India and onboarded more than 2000 unique users to our product QuillShield.",
      "Working on the website and API behind the points program for the Ambassador program of QuillAI.",
      "Building the AVS for consensus verified AI Agents on EigenLayer for DeFAI Agents.",
    ],
    logo: "/quillai.webp",
  },
];

export default function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  return (
    <section id="experience" className="py-20 relative" ref={ref}>
      <motion.div className="container mx-auto px-4" style={{ opacity, scale }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Work Experience
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            My professional journey and contributions to innovative companies.
          </p>
        </motion.div>

        <div className="space-y-12 max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="glass-card p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-20 h-20 relative flex-shrink-0 mx-auto md:mx-0">
                  <Image
                    src={exp.logo || "/placeholder.svg"}
                    alt={exp.company}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {exp.position}
                  </h3>
                  <h4 className="text-lg text-purple-400 mb-3">
                    {exp.company}
                  </h4>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-400 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {exp.description.map((point, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <svg
                          className="w-2 h-2 mt-2 flex-shrink-0"
                          viewBox="0 0 8 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="4" cy="4" r="3" fill="#A855F7" />
                        </svg>
                        <p className="text-gray-300">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
