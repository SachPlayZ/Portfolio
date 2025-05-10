"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

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

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
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
              <span className="block">Hi, I'm</span>
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
              <a
                href="#skills"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-8 py-3 rounded-full font-medium hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                Explore My Work
                <ArrowDown size={18} />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Section - Profile Picture */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-pulse" />

              {/* Profile picture container */}
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-purple-500/30 shadow-2xl shadow-purple-500/20">
                <img
                  src="/Portfolio.JPG"
                  alt="Sachindra Kumar Singh"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
        }}
        style={{ opacity }}
      >
        <ArrowDown className="text-purple-400" size={30} />
      </motion.div>
    </section>
  );
}
