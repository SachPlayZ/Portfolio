"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Instrument_Serif, Roboto_Condensed } from "next/font/google";
import { getYoutubeEmbedUrl } from "@/lib/media";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

interface Project {
  _id: string;
  name?: string;
  logo?: string;
  overview?: string;
  description?: string;
  images?: string[];
  demoVideoEmbed?: string;
  techStack?: string[];
  links?: { name: string; url: string }[];
}

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenDetails,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const demoVideoUrl = useMemo(() => {
    if (!project.demoVideoEmbed) return undefined;
    return getYoutubeEmbedUrl(project.demoVideoEmbed) ?? project.demoVideoEmbed;
  }, [project.demoVideoEmbed]);

  const demoVideoId = useMemo(() => {
    if (!demoVideoUrl) return "";
    const parts = demoVideoUrl.split("/");
    const lastPart = parts[parts.length - 1] ?? "";
    return lastPart.split("?")[0];
  }, [demoVideoUrl]);

  const projectName = project.name?.trim() || "Untitled Project";
  const projectInitials = projectName.slice(0, 2).toUpperCase();
  const truncatedDescription = project.description
    ? project.description.slice(0, 100)
    : "";
  const overviewText =
    project.overview?.trim() ||
    truncatedDescription ||
    "More details coming soon.";

  return (
    <motion.div
      className="h-[60vh] w-[23vw] min-w-[280px] bg-white/40 backdrop-blur-lg rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.1)] flex flex-col p-6 gap-4 overflow-hidden border border-white/60 relative group shrink-0 mx-4 transition-colors duration-300"
      whileHover={{
        scale: 1.02,
        borderColor: "#3ba58b",
        boxShadow: "0 30px 100px -20px rgba(0,0,0,0.15)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Header: Logo and Open Button */}
      <div className="flex justify-between items-center z-20">
        {/* Logo */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border border-slate-200 shadow-sm">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={`${projectName} logo`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-bold">
              {projectInitials}
            </div>
          )}
        </div>

        {/* Open Details Button */}
        <motion.button
          className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-white text-slate-600 border border-slate-200 shadow-sm"
          whileHover={{ scale: 1.1, color: "#3ba58b", borderColor: "#3ba58b" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenDetails(project)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </motion.button>
      </div>

      {/* Title */}
      <motion.div
        className={`${instrumentSerif.className} text-4xl text-slate-800 text-center z-20 mt-2`}
        layoutId={`title-${project._id}`}
      >
        {projectName}
      </motion.div>

      {/* Media Area */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
        <AnimatePresence mode="wait">
          {isHovered && demoVideoUrl ? (
            <motion.div
              key="video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <iframe
                src={`${demoVideoUrl}${
                  demoVideoUrl.includes("?") ? "&" : "?"
                }autoplay=1&mute=1&controls=0&loop=1&start=60&playlist=${demoVideoId}&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1`}
                className="w-full h-full pointer-events-none scale-[1.7]"
                allow="autoplay; encrypted-media"
              />
            </motion.div>
          ) : (
            <motion.div
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0"
            >
              {project.images?.[0] ? (
                <Image
                  src={project.images[0]}
                  alt={projectName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  No Image
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overview */}
      <div
        className={`${robotoCondensed.className} text-lg text-slate-600 line-clamp-3 text-center px-2 z-20 mt-auto mb-2 leading-relaxed`}
      >
        {overviewText}
      </div>
    </motion.div>
  );
};
