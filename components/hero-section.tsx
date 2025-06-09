"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import ShinyText from "@/src/blocks/TextAnimations/ShinyText/ShinyText";
import ProfilePictureWithCircularText from "./ProfilePictureWithCircularText";

const CyberpunkGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-animation">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="h-line"
              style={{ top: `${i * 5}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="v-line"
              style={{ left: `${i * 5}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Neon lights */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 5,
          ease: "easeInOut",
        }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`light-${i}`}
            className="neon-light"
            initial={{
              x: Math.random() * 100 - 50 + "%",
              y: Math.random() * 100 - 50 + "%",
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: Math.random() * 5 + 3,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

      {/* Animated pulse circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            className="absolute rounded-full border border-purple-500/30"
            initial={{ width: 100, height: 100, opacity: 0 }}
            animate={{
              width: [100, 600],
              height: [100, 600],
              opacity: [0.7, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 4,
              delay: i * 1.3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 pt-32"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover"
        >
          <source src="/stock_background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      </div>

      {/* Cyberpunk Grid Background */}
      <CyberpunkGrid />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text Content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ opacity }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="block">Hi, I&apos;m</span>
              <span className="gradient-text glow-text block mt-2">
                Sachindra
              </span>
            </motion.h1>

            <motion.h2
              className="text-xl md:text-2xl text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Full Stack Web Developer & Web3 Smart Contract Developer
            </motion.h2>

            <motion.p
              className="max-w-2xl mx-auto lg:mx-0 text-gray-400 mb-10 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Building innovative solutions with modern technologies and a
              passion for creating exceptional user experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.a
                href="#about"
                className="inline-block cursor-pointer group relative"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ShinyText
                  text="Explore My Work"
                  className="text-sm font-semibold text-purple-300"
                  speed={3}
                />
                <motion.span
                  className="inline-block ml-1 text-purple-400"
                  animate={{
                    y: [0, 2, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                >
                  ↓
                </motion.span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Section - Profile Picture */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <ProfilePictureWithCircularText
              imageSrc="/Portfolio.JPG"
              imageAlt="Sachindra Kumar Singh"
              circularText="FULL STACK DEVELOPER • WEB3 DEVELOPER • "
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
