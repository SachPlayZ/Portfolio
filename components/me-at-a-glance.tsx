"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import LatestBlog from "@/components/ui/latest-blog";
import TechStackBox from "@/components/ui/tech-stack-box";
import FeaturedProjectBox from "@/components/ui/featured-project-box";
import GithubBox from "@/components/ui/github-box";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Animation variants for each grid item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function MeAtAGlance() {
  return (
    <section
      id="about"
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#fdf5e7] relative overflow-hidden"
    >
      <div className="w-full max-w-[90rem] mx-auto z-10">
        <div className="mb-8 ml-2">
          <h2
            className={`${instrumentSerif.className} text-4xl md:text-6xl font-normal text-slate-800 mb-3 tracking-tight`}
          >
            Me at a <span className="text-[#3ba58b] italic">Glance</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl font-light">
            A live look into what I'm working on, thinking about, and
            contributing to.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={cn(
            // 3 Columns Layout
            "grid w-full grid-cols-1 gap-4 md:gap-6 md:grid-cols-3",
            // 2 Rows total now
            "md:grid-rows-[320px_240px]", // Explicit heights: Top row 320px, Bottom row 240px (GitHub)
            "auto-rows-[minmax(200px,auto)]"
          )}
        >
          {/* Slot 1: Latest Blog (Left Col - Spans 1 col, 1 row) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-2 h-full"
          >
            <LatestBlog />
          </motion.div>

          {/* Slot 2: Tech Stack (Middle Col - Spans 1 col, 1 row) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 h-full"
          >
            <TechStackBox />
          </motion.div>

          {/* Slot 3: Featured Project (Right Col - Spans 1 col, 1 row) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 h-full"
          >
            <FeaturedProjectBox />
          </motion.div>

          {/* Slot 4: GitHub Activity (Bottom Row - Spans ALL 3 Cols) */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-1 h-full"
          >
            <GithubBox />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
