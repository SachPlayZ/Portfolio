"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const skillCategories = [
  {
    name: "Smart Contract Development",
    skills: [
      { name: "Solidity", icon: "/solidity.svg" },
      { name: "Rust", icon: "/rust.svg" },
      { name: "Foundry", icon: "/foundry.png" },
      { name: "Ethers", icon: "/ethers.svg" },
    ],
  },
  {
    name: "Frontend Development",
    skills: [
      { name: "React", icon: "/react.svg" },
      { name: "Next.js", icon: "/nextjs.svg" },
      { name: "TypeScript", icon: "/typescript.svg" },
      { name: "JavaScript", icon: "/javascript.svg" },
      { name: "Tailwind CSS", icon: "/tailwind.svg" },
      { name: "Framer Motion", icon: "/framer-motion.png" },
    ],
  },
  {
    name: "Backend Development",
    skills: [
      { name: "Node.js", icon: "/nodejs.svg" },
      { name: "Express", icon: "/express.svg" },
      { name: "MongoDB", icon: "/mongodb.svg" },
      { name: "PostgreSQL", icon: "/postgresql.svg" },
    ],
  },
];

export default function TechStackScroll() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % skillCategories.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-black/20 rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex flex-col items-center justify-center p-6"
        >
          <h3 className="text-xl font-semibold mb-6 text-purple-400">
            {skillCategories[currentIndex].name}
          </h3>
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl">
            {skillCategories[currentIndex].skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  scale: {
                    type: "spring",
                    stiffness: 300,
                  },
                }}
                className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-full hover:bg-black/50 transition-colors w-[calc(25%-18px)]"
              >
                <div className="relative w-8 h-8 flex-shrink-0">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-base text-gray-200 whitespace-nowrap font-medium">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
