"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface Project {
  name: string;
  description: string;
}

export default function FeaturedProjectBox() {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/featured");
        const data = await res.json();
        if (data && data.name) setProject(data);
      } catch (e) {}
    }
    fetchFeatured();
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-8 relative overflow-hidden group hover:border-white/80 transition-colors text-slate-900">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#3ba58b] to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-serif font-medium text-slate-800 group-hover:text-[#3ba58b] transition-colors">
          Featured
        </h3>
        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#3ba58b] transition-colors" />
      </div>

      {project ? (
        <div className="mt-auto">
          <p className="text-lg font-semibold text-slate-800 mb-2">
            {project.name}
          </p>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
      ) : (
        <div className="mt-auto">
          <p className="text-sm text-slate-500">No featured project set.</p>
        </div>
      )}
    </div>
  );
}
