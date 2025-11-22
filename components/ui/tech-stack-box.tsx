"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CATEGORY_SEQUENCE = [
  { key: "Languages", label: "Languages" },
  { key: "Frontend", label: "Frontend" },
  { key: "Backend", label: "Backend" },
  { key: "Blockchain/Web3", label: "Web3/Blockchain" },
] as const;

type CategoryKey = (typeof CATEGORY_SEQUENCE)[number]["key"];

type TechStackRecord = {
  _id?: string;
  name: string;
  image: string;
  proficiency: number;
  category: CategoryKey | string;
};

type TechStackMap = Record<CategoryKey, TechStackRecord[]>;

const MAX_ITEMS_PER_CATEGORY = 6;
const ROTATION_INTERVAL_MS = 4500;
const FADE_DURATION_MS = 400;

const createEmptyMap = (): TechStackMap => ({
  Languages: [],
  Frontend: [],
  Backend: [],
  "Blockchain/Web3": [],
});

const clampRating = (value: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(5, Math.round(value)));
};

export default function TechStackBox() {
  const [techsByCategory, setTechsByCategory] =
    useState<TechStackMap>(createEmptyMap);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTech = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/tech-stack", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch tech stack");
        }
        const payload = (await res.json()) as Record<string, TechStackRecord[]>;

        const normalized = createEmptyMap();
        CATEGORY_SEQUENCE.forEach(({ key }) => {
          const bucket = Array.isArray(payload?.[key]) ? payload[key] : [];
          normalized[key] = bucket
            .map((item) => ({
              ...item,
              proficiency: clampRating(Number(item?.proficiency ?? 0)),
            }))
            .sort((a, b) => b.proficiency - a.proficiency)
            .slice(0, MAX_ITEMS_PER_CATEGORY);
        });

        setTechsByCategory(normalized);
      } catch (err) {
        console.error(err);
        setError("Unable to load tech stack.");
        setTechsByCategory(createEmptyMap());
      } finally {
        setLoading(false);
      }
    };

    fetchTech();
  }, []);

  useEffect(() => {
    // Auto-cycle categories in the requested order so each gets spotlight time.
    let timeoutId: number | null = null;

    const handleRotation = () => {
      setIsTransitioning(true);
      timeoutId = window.setTimeout(() => {
        setCurrentCategoryIndex(
          (prev) => (prev + 1) % CATEGORY_SEQUENCE.length
        );
        setIsTransitioning(false);
      }, FADE_DURATION_MS);
    };

    const intervalId = window.setInterval(handleRotation, ROTATION_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const currentCategory = CATEGORY_SEQUENCE[currentCategoryIndex];
  const currentItems = techsByCategory[currentCategory.key];
  const hasAnyTech = useMemo(
    () => Object.values(techsByCategory).some((bucket) => bucket.length > 0),
    [techsByCategory]
  );

  const renderStars = (value: number) => {
    const rating = clampRating(value);
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className="h-3.5 w-3.5"
        strokeWidth={1.5}
        color={index < rating ? "#f59e0b" : "rgba(255,255,255,0.5)"}
        fill={index < rating ? "#f59e0b" : "transparent"}
      />
    ));
  };

  const renderSkeleton = () =>
    Array.from({ length: MAX_ITEMS_PER_CATEGORY }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="h-16 rounded-3xl bg-white/60 animate-pulse"
      />
    ));

  return (
    <div className="w-full h-full flex flex-col bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-4xl p-8 relative overflow-hidden group hover:border-white/80 transition-colors text-slate-900">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#3ba58b]/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-[#3ba58b]/20" />

      <p className="text-xs uppercase tracking-[0.4em] text-slate-500 mb-2 z-10">
        Category
      </p>
      <div
        className={`z-10 flex flex-col gap-6 transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-3xl font-serif font-medium text-slate-800">
            {currentCategory.label}
          </h3>
          <span className="text-[0.65rem] text-slate-500">
            Hover to view proficiency
          </span>
        </div>

        <div className="min-h-64">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">{renderSkeleton()}</div>
          ) : !hasAnyTech ? (
            <p className="text-sm text-slate-500">
              {error ?? "No tech stack records yet."}
            </p>
          ) : currentItems.length > 0 ? (
            <div key={currentCategory.key} className="grid grid-cols-2 gap-3">
              {currentItems.map((tech) => (
                <Tooltip key={tech._id ?? tech.name}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3 rounded-3xl border border-white/60 bg-white/70 px-3 py-3 shadow-[0_12px_30px_rgba(59,165,139,0.08)] hover:border-[#3ba58b]/40 transition-all cursor-default">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 border border-white/70 overflow-hidden">
                        {tech.image ? (
                          <Image
                            src={tech.image}
                            alt={tech.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-contain"
                            unoptimized
                          />
                        ) : (
                          <span className="text-sm font-semibold text-slate-500">
                            {tech.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">
                          {tech.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {currentCategory.label}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="flex items-center gap-1 text-background">
                      {renderStars(tech.proficiency)}
                      <span className="text-[10px] text-background/70 ml-1">
                        {tech.proficiency}/5
                      </span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No technologies added under {currentCategory.label} yet.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {CATEGORY_SEQUENCE.map((category, index) => (
            <span
              key={category.key}
              className={`h-1 rounded-full flex-1 transition-all ${
                index <= currentCategoryIndex ? "bg-[#3ba58b]" : "bg-white/60"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
