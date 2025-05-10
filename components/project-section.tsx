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
  title: string;
  description: string;
  videoId?: string;
  loomId?: string;
  image?: string;
  tags: string[];
  github: string;
  demo: string;
}

const projects: Project[] = [
  {
    title: "VeilX",
    description:
      "A decentralized privacy-focused platform built on Ethereum that enables secure and anonymous transactions.",
    videoId: "hQACK3z_BC4", // Replace with actual YouTube video ID
    tags: ["Solidity", "React", "Ethers.js", "Hardhat", "IPFS"],
    github: "https://github.com/sachplayz",
    demo: "#",
  },
  {
    title: "Orphic",
    description:
      "A Web3 marketplace for digital collectibles with advanced features for creators and collectors.",
    videoId: "uQeGOQMYuCI", // Replace with actual YouTube video ID
    tags: ["Next.js", "TypeScript", "Solidity", "The Graph", "Tailwind CSS"],
    github: "https://github.com/sachplayz",
    demo: "#",
  },
  {
    title: "Ruins of Rome",
    description:
      "An immersive blockchain-based strategy game with NFT integration and on-chain governance.",
    loomId: "f06b93ac777f4dd083a130115987988f", // Replace with actual YouTube video ID
    tags: ["Rust", "WebGL", "React", "Solana", "Three.js"],
    github: "https://github.com/sachplayz",
    demo: "#",
  },
];

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [players, setPlayers] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize YouTube and Loom players when APIs are ready
    window.onYouTubeIframeAPIReady = () => {
      projects.forEach((project, index) => {
        if (project.videoId) {
          const player = new window.YT.Player(`youtube-player-${index}`, {
            videoId: project.videoId,
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
        } else if (project.loomId) {
          const iframe = document.getElementById(
            `loom-player-${index}`
          ) as HTMLIFrameElement;
          if (iframe) {
            iframe.src = `https://www.loom.com/embed/${project.loomId}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`;
            iframe.onload = () => {
              const player = {
                playVideo: () => {
                  iframe.contentWindow?.postMessage({ type: "play" }, "*");
                },
                pauseVideo: () => {
                  iframe.contentWindow?.postMessage({ type: "pause" }, "*");
                },
              };
              setPlayers((prev) => ({ ...prev, [`loom-${index}`]: player }));
            };
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
  }, []);

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
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="glass-card overflow-hidden group"
              onMouseEnter={() => setActiveProject(index)}
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className="relative h-48 overflow-hidden">
                {project.videoId ? (
                  <div
                    id={`youtube-player-${index}`}
                    className="w-full h-full"
                  />
                ) : project.loomId ? (
                  <iframe
                    src={`https://www.loom.com/embed/${project.loomId}?autoplay=1&loop=1&hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true&background_color=transparent&hide_controls=true`}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <Image
                    src={project.image || "/placeholder.svg"}
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
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                  >
                    <Github size={18} />
                    <span>Code</span>
                  </Link>
                  <Link
                    href={project.demo}
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
