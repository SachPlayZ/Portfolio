"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { ProjectCard } from "./ui/project-card";
import Image from "next/image";
import { Instrument_Serif, Roboto_Condensed } from "next/font/google";
import { getYoutubeEmbedUrl } from "@/lib/media";
import { Globe, Github } from "lucide-react";
import { Project } from "@/types/project";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

type TechStackRecord = {
  name?: string;
  image?: string;
};

type TechStackResponse = Record<string, TechStackRecord[]>;

export const ProjectDirectory = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [techLogos, setTechLogos] = useState<Record<string, string>>({});

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
    let isMounted = true;
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load projects");
        }
        const data = await res.json();
        if (isMounted) {
          const normalized = (Array.isArray(data) ? data : []).map(
            (project: Project) => ({
              ...project,
              demoVideoEmbed:
                getYoutubeEmbedUrl(project.demoVideoEmbed) ??
                project.demoVideoEmbed,
            })
          );
          setProjects(normalized);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setProjects([]);
          setError("Unable to fetch projects right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchTechLogos = async () => {
      try {
        const res = await fetch("/api/tech-stack", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load tech stack");
        const payload = (await res.json()) as TechStackResponse;
        if (!isMounted) return;
        const mapping: Record<string, string> = {};
        Object.values(payload ?? {}).forEach((group) => {
          (group ?? []).forEach((item) => {
            if (!item?.name || !item?.image) return;
            const normalized = item.name.trim().toLowerCase();
            mapping[normalized] = item.image;
          });
        });
        setTechLogos(mapping);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setTechLogos({});
        }
      }
    };

    fetchTechLogos();
    return () => {
      isMounted = false;
    };
  }, []);

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

  useEffect(() => {
    setActiveSlide(0);
  }, [selectedProject]);

  useEffect(() => {
    const handleExternalOpen = (event: Event) => {
      const customEvent = event as CustomEvent<Project>;
      if (customEvent.detail) {
        setSelectedProject(customEvent.detail);
        setActiveSlide(0);
        document.querySelector("#projects")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };

    window.addEventListener(
      "open-project-modal",
      handleExternalOpen as EventListener
    );
    return () =>
      window.removeEventListener(
        "open-project-modal",
        handleExternalOpen as EventListener
      );
  }, []);

  const parseOverviewPoints = (value?: string) =>
    value
      ?.split("\n")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const buildHighlights = (project: Project) => {
    const basePoints = [...parseOverviewPoints(project.overview)];
    const descriptionSentences =
      project.description
        ?.split(/[\.\n]/)
        .map((sentence) => sentence.trim())
        .filter(Boolean) ?? [];

    for (const sentence of descriptionSentences) {
      if (basePoints.length >= 3) break;
      basePoints.push(sentence);
    }

    while (basePoints.length < 3) {
      basePoints.push("More highlights coming soon.");
    }

    return basePoints.slice(0, 6);
  };

  const getTimedVideoUrl = (project: Project) => {
    if (!project.demoVideoEmbed) return null;
    const embedUrl =
      getYoutubeEmbedUrl(project.demoVideoEmbed) ?? project.demoVideoEmbed;
    if (!embedUrl) return null;
    return embedUrl;
  };

  const isValidUrl = (value?: string) => {
    if (!value) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const mediaSlides = useMemo(() => {
    if (!selectedProject) return [];
    const slides: { type: "video" | "image"; src: string; id: string }[] = [];
    const videoUrl = getTimedVideoUrl(selectedProject);
    if (videoUrl) {
      slides.push({
        type: "video",
        src: videoUrl,
        id: `${selectedProject._id}-video`,
      });
    }
    selectedProject.images?.forEach((image, index) => {
      if (!image) return;
      slides.push({
        type: "image",
        src: image,
        id: `${selectedProject._id}-image-${index}`,
      });
    });
    return slides;
  }, [selectedProject]);

  useEffect(() => {
    if (mediaSlides.length > 0 && activeSlide >= mediaSlides.length) {
      setActiveSlide(0);
    }
  }, [mediaSlides.length, activeSlide]);

  const handlePrevSlide = () => {
    if (mediaSlides.length === 0) return;
    setActiveSlide((prev) => (prev === 0 ? mediaSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    if (mediaSlides.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % mediaSlides.length);
  };

  const projectLinks = useMemo(
    () =>
      (selectedProject?.links ?? []).filter(
        (link): link is { name?: string; url: string } => {
          if (!link?.url) return false;
          return isValidUrl(link.url);
        }
      ),
    [selectedProject]
  );

  const getLinkTooltip = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes("github.com")) return "Repository";
    if (lower.includes("x.com") || lower.includes("twitter.com")) return "X";
    return "Website";
  };

  const renderLinkIcon = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes("github.com")) {
      return <Github className="w-4 h-4" />;
    }
    if (lower.includes("x.com") || lower.includes("twitter.com")) {
      return (
        <Image
          src="/x.svg"
          alt="X"
          width={16}
          height={16}
          className="w-4 h-4"
        />
      );
    }
    return <Globe className="w-4 h-4" />;
  };

  const selectedProjectName =
    selectedProject?.name?.trim() || "Untitled Project";

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
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-r from-[#fdf5e7] via-[#fdf5e7]/50 md:via-[#fdf5e7]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-l from-[#fdf5e7] via-[#fdf5e7]/50 md:via-[#fdf5e7]/80 to-transparent z-20 pointer-events-none" />

          {/* Horizontal Scroll List */}
          <motion.div
            ref={scrollContainerRef}
            style={{ x }}
            className="flex gap-8 px-[5vw] items-center h-full w-max min-h-[60vh]"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-[60vh] w-[23vw] min-w-[280px] rounded-3xl bg-white/30 border border-white/40 animate-pulse"
                />
              ))
            ) : projects.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="flex h-full items-center justify-center rounded-3xl border border-white/60 bg-white/40 px-6 py-10 text-slate-600">
                {error ?? "No projects have been published yet."}
              </div>
            )}
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
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10 bg-slate-900/50 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative z-[85] bg-[#fdf5e7] border border-white/60 rounded-4xl w-full max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_80px_rgba(0,0,0,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white/40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  {selectedProject.logo && (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm">
                      <Image
                        src={selectedProject.logo}
                        alt={selectedProjectName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3
                      className={`${instrumentSerif.className} text-3xl font-bold text-slate-800`}
                    >
                      {selectedProjectName}
                    </h3>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {selectedProject.techStack?.map((tech, index) => {
                        const normalized = tech?.trim().toLowerCase();
                        const logoSrc =
                          normalized && techLogos[normalized]
                            ? techLogos[normalized]
                            : null;
                        return (
                          <span
                            key={`${tech}-${index}`}
                            className={`${robotoCondensed.className} text-sm px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm flex items-center gap-2`}
                          >
                            {logoSrc && (
                              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                                <Image
                                  src={logoSrc}
                                  alt={`${tech} logo`}
                                  width={20}
                                  height={20}
                                  className="h-4 w-4 object-contain"
                                />
                              </span>
                            )}
                            <span>{tech}</span>
                          </span>
                        );
                      })}
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
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                  <div className="space-y-6">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-200 shadow-inner">
                      {mediaSlides.length > 0 ? (
                        <>
                          {mediaSlides.map((slide, index) => (
                            <div
                              key={slide.id}
                              className={`absolute inset-0 transition-opacity duration-500 ${
                                index === activeSlide
                                  ? "opacity-100"
                                  : "opacity-0 pointer-events-none"
                              }`}
                            >
                              {slide.type === "video" ? (
                                <iframe
                                  src={slide.src}
                                  className="w-full h-full"
                                  allow="autoplay; encrypted-media; fullscreen"
                                />
                              ) : (
                                <Image
                                  src={slide.src}
                                  alt={selectedProjectName}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                          ))}

                          {mediaSlides.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={handlePrevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
                                aria-label="Previous media"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4"
                                >
                                  <polyline points="15 18 9 12 15 6" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={handleNextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
                                aria-label="Next media"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4"
                                >
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </button>
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                {mediaSlides.map((slide, index) => (
                                  <button
                                    key={`${slide.id}-dot`}
                                    type="button"
                                    onClick={() => setActiveSlide(index)}
                                    className={`h-2 w-2 rounded-full transition-all ${
                                      index === activeSlide
                                        ? "w-6 bg-[#3ba58b]"
                                        : "bg-white/70"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                          Media coming soon.
                        </div>
                      )}
                    </div>

                    <div className="bg-white/80 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-inner">
                      <h5
                        className={`${robotoCondensed.className} text-xs uppercase tracking-[0.35em] text-slate-500`}
                      >
                        Links
                      </h5>
                      {projectLinks.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {projectLinks.map((link) => (
                            <a
                              key={`${selectedProject._id}-${link.url}`}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              title={getLinkTooltip(link.url)}
                              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#3ba58b] hover:text-[#3ba58b] transition-colors"
                            >
                              {renderLinkIcon(link.url)}
                              <span>
                                {link.name?.trim() || getLinkTooltip(link.url)}
                              </span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">
                          No links provided yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/80 border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                    <h5
                      className={`${robotoCondensed.className} text-lg font-semibold uppercase tracking-[0.3em] text-slate-500`}
                    >
                      Highlights
                    </h5>
                    <ul className="space-y-2 text-slate-700 text-base">
                      {buildHighlights(selectedProject).map((point, index) => (
                        <li
                          key={`${selectedProject._id}-point-${index}`}
                          className="flex items-start gap-2"
                        >
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#3ba58b]" />
                          <span
                            className={`${robotoCondensed.className} leading-relaxed`}
                          >
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
