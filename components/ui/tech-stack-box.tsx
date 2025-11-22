"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TechItem {
  name: string;
  proficiency: number;
}

export default function TechStackBox() {
  const [techs, setTechs] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTech() {
      try {
        const res = await fetch("/api/tech-stack");
        const data = await res.json();
        const allTechs: any[] = [];
        Object.values(data).forEach((arr: any) => allTechs.push(...arr));
        allTechs.sort((a, b) => b.proficiency - a.proficiency);
        setTechs(allTechs.slice(0, 6).map((t) => t.name));
      } catch (e) {}
    }
    fetchTech();
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-8 relative overflow-hidden group hover:border-white/80 transition-colors text-slate-900">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#3ba58b]/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[#3ba58b]/20" />

      <h3 className="text-xl font-serif font-medium text-slate-800 mb-6 z-10">
        Top Tech
      </h3>
      <div className="flex flex-wrap gap-2 z-10">
        {techs.length > 0 ? (
          techs.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="bg-white/60 hover:bg-white/80 text-slate-700 border border-white/40 backdrop-blur-sm px-3 py-1 text-sm"
            >
              {t}
            </Badge>
          ))
        ) : (
          <>
            {["React", "Next.js", "TypeScript", "Node.js"].map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="bg-white/60 hover:bg-white/80 text-slate-700 border border-white/40 backdrop-blur-sm px-3 py-1 text-sm"
              >
                {t}
              </Badge>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
