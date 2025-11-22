"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface Project {
  _id?: string;
  name: string;
  description: string;
  images?: string[];
  logo?: string;
  overview?: string;
  links?: { name: string; url: string }[];
  demoVideoEmbed?: string;
  techStack?: string[];
}

export default function FeaturedProjectBox() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchFeatured() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/featured", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load featured project");
        const data = await res.json();
        if (isMounted && data && data.name) {
          setProject(data);
        } else if (isMounted) {
          setProject(null);
        }
      } catch (e) {
        if (isMounted) {
          setError("Unable to load featured project.");
          setProject(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const heroImage =
    project?.images?.[0] ?? project?.logo ?? "/images/project-placeholder.jpg";

  const handleOpenProject = () => {
    if (!project) return;
    window.dispatchEvent(
      new CustomEvent("open-project-modal", { detail: project })
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-4xl p-8 relative overflow-hidden group hover:border-white/80 transition-colors text-slate-900">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-[#3ba58b] to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Spotlight
          </p>
          <h3 className="text-2xl font-serif font-medium text-slate-800 group-hover:text-[#3ba58b] transition-colors">
            Featured Project
          </h3>
        </div>
        <button
          type="button"
          onClick={handleOpenProject}
          className="rounded-full border border-transparent p-2 text-slate-400 hover:text-[#3ba58b] hover:border-[#3ba58b]/30 transition-colors"
          aria-label="Open featured project details"
        >
          <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-5">
        <div className="relative flex-1 rounded-3xl overflow-hidden border border-white/50 shadow-inner bg-slate-100">
          {loading ? (
            <div className="absolute inset-0 bg-white/60 animate-pulse" />
          ) : project && heroImage ? (
            <Image
              src={heroImage}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
              {error ?? "No featured project set."}
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
          {project && (
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">
                Case Study
              </p>
              <p className="text-2xl font-serif font-semibold">
                {project.name}
              </p>
            </div>
          )}
        </div>

        <div>
          {project ? (
            <>
              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {project.description}
              </p>
              {project.links?.[0] && (
                <a
                  href={project.links[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#3ba58b] mt-4"
                >
                  {project.links[0].name}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </>
          ) : loading ? (
            <p className="text-sm text-slate-500">Loading project…</p>
          ) : (
            <p className="text-sm text-slate-500">
              {error ?? "No featured project selected."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
