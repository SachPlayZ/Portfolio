"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Code } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars: {
            autoplay: number;
            controls: number;
            disablekb: number;
            enablejsapi: number;
            fs: number;
            loop: number;
            modestbranding: number;
            mute: number;
            playsinline: number;
            rel: number;
            start: number;
            end: number;
          };
          events: {
            onReady: (event: { target: any }) => void;
            onStateChange: (event: { data: number; target: any }) => void;
          };
        }
      ) => any;
      PlayerState: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Project {
  _id: string;
  title: string;
  description: string;
  videoUrl?: string;
  images: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [players, setPlayers] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize YouTube players when API is ready
    window.onYouTubeIframeAPIReady = () => {
      projects.forEach((project, index) => {
        if (project.videoUrl) {
          const videoId =
            project.videoUrl.split("v=")[1] ||
            project.videoUrl.split("/").pop();
          if (videoId) {
            const player = new window.YT.Player(`youtube-player-${index}`, {
              videoId: videoId,
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                fs: 0,
                loop: 1,
                modestbranding: 1,
                mute: 1,
                playsinline: 1,
                rel: 0,
                start: 0,
                end: 10,
              },
              events: {
                onReady: (event: { target: any }) => {
                  event.target.playVideo();
                },
                onStateChange: (event: { data: number; target: any }) => {
                  if (event.data === window.YT.PlayerState.ENDED) {
                    event.target.seekTo(0);
                    event.target.playVideo();
                  }
                },
              },
            });
            setPlayers((prev) => ({ ...prev, [`youtube-${index}`]: player }));
          }
        }
      });
    };

    return () => {
      // Cleanup players when component unmounts
      Object.values(players).forEach((player: any) => {
        if (player && player.destroy) {
          player.destroy();
        }
      });
    };
  }, [projects]);

  if (loading) {
    return (
      <section id="projects" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Featured Projects
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore some of my notable Web3 and full-stack projects that
            showcase my skills and creativity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="glass-card overflow-hidden group"
              onMouseEnter={() => setActiveProject(index)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className="relative h-48 overflow-hidden">
                {project.videoUrl ? (
                  <div
                    id={`youtube-player-${index}`}
                    className="w-full h-full"
                  />
                ) : (
                  <Image
                    src={project.images[0] || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                  >
                    <Github size={18} />
                    <span>Code</span>
                  </Link>
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink size={18} />
                    <span>Demo</span>
                  </Link>
                </div>
              </div>

              <motion.div
                className="absolute top-2 right-2 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: activeProject === index ? 1 : 0,
                  scale: activeProject === index ? 1 : 0.8,
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-purple-600 text-white p-2 rounded-full">
                  <Code size={16} />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
