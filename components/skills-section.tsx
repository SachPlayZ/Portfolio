"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const skills = [
  {
    category: "Smart Contract Development",
    items: [
      { name: "Solidity", icon: "/solidity.svg" },
      { name: "Rust", icon: "/rust.svg" },
      { name: "Foundry", icon: "/foundry.png" },
      { name: "Ethers", icon: "/ethers.svg" },
    ],
  },
  {
    category: "Frontend Development",
    items: [
      { name: "React", icon: "/react.svg" },
      { name: "Next.js", icon: "/nextjs.svg" },
      { name: "TypeScript", icon: "/typescript.svg" },
      { name: "JavaScript", icon: "/javascript.svg" },
      { name: "Tailwind CSS", icon: "/tailwind.svg" },
      { name: "Framer Motion", icon: "/framer-motion.png" },
    ],
  },
  {
    category: "Backend Development",
    items: [
      { name: "Node.js", icon: "/nodejs.svg" },
      { name: "Express", icon: "/express.svg" },
      { name: "MongoDB", icon: "/mongodb.svg" },
      { name: "PostgreSQL", icon: "/postgresql.svg" },
    ],
  },
];

export default function SkillsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            My Skills
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A comprehensive set of technologies I've mastered throughout my
            journey as a developer.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skills.map((skillGroup, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card p-6 h-full"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-400">
                {skillGroup.category}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {skillGroup.items.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center gap-2">
                    <Image
                      src={skill.icon}
                      alt={skill.name}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
