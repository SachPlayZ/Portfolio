"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    company: "Alchemyst AI",
    position: "Senior Web3 Developer",
    period: "Jan 2023 - Present",
    location: "Remote",
    description:
      "Leading the development of decentralized applications and smart contracts. Implementing advanced blockchain solutions and integrating AI capabilities with Web3 technologies.",
    logo: "/placeholder.svg?height=100&width=100",
  },
  {
    company: "QuillAI",
    position: "Full Stack Developer",
    period: "Mar 2021 - Dec 2022",
    location: "Remote",
    description:
      "Developed and maintained full-stack applications using React, Node.js, and MongoDB. Implemented responsive UI designs and RESTful APIs for various client projects.",
    logo: "/placeholder.svg?height=100&width=100",
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

                  <p className="text-gray-300">{exp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
