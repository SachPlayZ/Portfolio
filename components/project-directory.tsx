"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { ProjectCard } from "./ui/project-card";
import Image from "next/image";
import { Instrument_Serif, Roboto_Condensed } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

// Shared Project Interface (should be in a types file ideally)
interface Project {
  _id: string;
  name: string;
  logo?: string;
  overview?: string;
  description: string;
  images: string[];
  demoVideoEmbed?: string;
  techStack?: string[];
  links?: { name: string; url: string }[];
}

const MOCK_PROJECTS: Project[] = [
  {
    _id: "1",
    name: "Alchemyst AI",
    logo: "https://i.pravatar.cc/150?u=alchemyst",
    overview:
      "An AI-powered platform for generating creative assets and managing digital alchemy workflows.",
    description:
      "Alchemyst AI revolutionizes how digital assets are created. By leveraging advanced generative models, it allows users to create unique, high-quality assets in seconds. Features include prompt engineering tools, asset management, and collaborative workspaces.",
    images: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
    ],
    demoVideoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Rick Roll as placeholder, user should replace
    techStack: ["Next.js", "OpenAI API", "MongoDB", "Tailwind CSS"],
    links: [
      { name: "Website", url: "#" },
      { name: "GitHub", url: "#" },
    ],
  },
  {
    _id: "2",
    name: "DevPort",
    logo: "https://i.pravatar.cc/150?u=devport",
    overview:
      "A modern developer portfolio builder with sleek animations and bento-grid layouts.",
    description:
      "DevPort is the ultimate tool for developers to showcase their work. Built with Next.js and Framer Motion, it offers a highly interactive experience. This very site is built using DevPort!",
    images: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1770&auto=format&fit=crop",
    ],
    demoVideoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    techStack: ["React", "Framer Motion", "TypeScript", "Vercel"],
    links: [{ name: "Demo", url: "#" }],
  },
  {
    _id: "3",
    name: "SoundScape",
    logo: "https://i.pravatar.cc/150?u=soundscape",
    overview:
      "Immersive audio streaming service with spatial audio support and social features.",
    description:
      "SoundScape brings music to life. With support for high-fidelity spatial audio, users can experience their favorite tracks like never before. Includes social playlists and real-time listening parties.",
    images: [
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1674&auto=format&fit=crop",
    ],
    demoVideoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    techStack: ["Vue.js", "Web Audio API", "Firebase"],
    links: [{ name: "App", url: "#" }],
  },
  {
    _id: "4",
    name: "TaskMaster",
    logo: "https://i.pravatar.cc/150?u=taskmaster",
    overview:
      "A productivity powerhouse for teams to manage projects and sprints efficiently.",
    description:
      "TaskMaster streamlines project management. From Kanban boards to Gantt charts, it has everything a team needs to stay on track. Integrates with Slack and GitHub.",
    images: [
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=1776&auto=format&fit=crop",
    ],
    demoVideoEmbed: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    techStack: ["Angular", "Node.js", "PostgreSQL"],
    links: [{ name: "Product", url: "#" }],
  },
];

export const ProjectDirectory = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Calculate how much we can scroll horizontally
  const maxScroll = scrollWidth - viewportWidth;
  // Ensure we don't scroll if content fits or if calculation isn't ready (safeguard against negative)
  const finalScroll = maxScroll > 0 ? -maxScroll : 0;

  const x = useTransform(scrollYProgress, [0, 0.9], [0, finalScroll]);

  useEffect(() => {
    const updateDimensions = () => {
      if (scrollContainerRef.current) {
        setScrollWidth(scrollContainerRef.current.scrollWidth);
        setViewportWidth(window.innerWidth); // Or scrollContainerRef.current.clientWidth
      }
    };

    // Initial measure
    updateDimensions();
    // Add resize listener
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [projects]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative h-[300vh] w-full bg-[#fdf5e7]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center py-16">
        <div className="container mx-auto px-6 z-10">
          <h2
            className={`${instrumentSerif.className} text-5xl md:text-7xl font-normal text-slate-800 mb-4 tracking-tight`}
          >
            Project <span className="text-[#3ba58b] italic">Directory</span>
          </h2>
          <p
            className={`${robotoCondensed.className} text-slate-600 text-xl max-w-xl`}
          >
            Explore a curated collection of my latest work and experiments.
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="relative w-full flex-1 flex items-center">
          {/* Fade Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#fdf5e7] via-[#fdf5e7]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#fdf5e7] via-[#fdf5e7]/80 to-transparent z-20 pointer-events-none" />

          {/* Horizontal Scroll List */}
          <motion.div
            ref={scrollContainerRef}
            style={{ x }}
            className="flex gap-8 px-[5vw] items-center h-full w-max"
          >
            {projects.map((project) => (
              <div key={project._id} className="shrink-0">
                <ProjectCard
                  project={project}
                  onOpenDetails={setSelectedProject}
                />
              </div>
            ))}
            {/* Spacer for end of list to ensure last item isn't hidden by fade */}
            <div className="w-16 shrink-0" />
          </motion.div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#fdf5e7] border border-white/60 rounded-4xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_80px_rgba(0,0,0,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white/40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  {selectedProject.logo && (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm">
                      <Image
                        src={selectedProject.logo}
                        alt={selectedProject.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3
                      className={`${instrumentSerif.className} text-3xl font-bold text-slate-800`}
                    >
                      {selectedProject.name}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      {selectedProject.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className={`${robotoCondensed.className} text-sm px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 18 18" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                {/* Media Section */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200 shadow-inner">
                  {selectedProject.demoVideoEmbed ? (
                    <iframe
                      src={selectedProject.demoVideoEmbed}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media; fullscreen"
                    />
                  ) : selectedProject.images?.[0] ? (
                    <Image
                      src={selectedProject.images[0]}
                      alt={selectedProject.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>

                {/* Description */}
                <div className="prose prose-slate max-w-none">
                  <h4
                    className={`${instrumentSerif.className} text-2xl font-semibold text-slate-800 mb-4`}
                  >
                    About this project
                  </h4>
                  <p
                    className={`${robotoCondensed.className} text-lg text-slate-600 leading-relaxed`}
                  >
                    {selectedProject.description}
                  </p>
                </div>

                {/* Links */}
                {selectedProject.links && selectedProject.links.length > 0 && (
                  <div className="flex gap-4 pt-6 border-t border-slate-200">
                    {selectedProject.links.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${robotoCondensed.className} px-6 py-3 bg-slate-800 text-white text-lg font-medium rounded-full hover:bg-[#3ba58b] transition-all hover:-translate-y-1 shadow-md flex items-center gap-2`}
                      >
                        {link.name}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
