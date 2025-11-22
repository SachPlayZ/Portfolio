"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Instrument_Serif, Roboto_Condensed } from "next/font/google";
import { isMobile } from "react-device-detect";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

// Types
interface Experience {
  _id: string;
  orgName: string;
  orgIcon?: string;
  startDate: string; // "YYYY-MM" format preferred for easy parsing
  endDate?: string; // "YYYY-MM" or "Present"
  workDone: string[];
  color?: string; // Optional override for now, will be dominant color later
}

const MOCK_EXPERIENCE: Experience[] = [
  {
    _id: "1",
    orgName: "QuillAI Network",
    orgIcon: "https://i.pravatar.cc/150?u=quill",
    startDate: "2024-12",
    endDate: "2025-02",
    workDone: [
      "Developed core AI infrastructure",
      "Optimized neural network inference",
    ],
    color: "#000000", // Black
  },
  {
    _id: "2",
    orgName: "Alchemyst AI",
    orgIcon: "https://i.pravatar.cc/150?u=alchemyst",
    startDate: "2025-03",
    endDate: "2025-06",
    workDone: ["Lead frontend architect", "Implemented generative UI systems"],
    color: "#8B4513", // Brown
  },
  {
    _id: "3",
    orgName: "EngageOS",
    orgIcon: "https://i.pravatar.cc/150?u=engageos",
    startDate: "2025-07",
    endDate: "Present",
    workDone: [
      "Building next-gen engagement protocols",
      "Scaling to 1M+ users",
    ],
    color: "#800080", // Purple
  },
];

// Helper to get months difference between two dates
const getMonthDiff = (d1: Date, d2: Date) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

// Generate months array between start and end
const generateMonthLabels = (startDate: Date, endDate: Date) => {
  const months = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    months.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return months;
};

export const ExperienceTimeline = () => {
  const [experiences, setExperiences] = useState<Experience[]>(MOCK_EXPERIENCE);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate Timeline Range
  // Hardcoded range based on user request: Dec 2024 to Present (Nov 2025 for example context)
  const timelineStart = new Date("2024-12-01");
  const timelineEnd = new Date("2025-11-01"); // Approx "Present" relative to user prompt context

  const totalMonths = getMonthDiff(timelineStart, timelineEnd);
  const monthLabels = generateMonthLabels(timelineStart, timelineEnd);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!mounted) return null;

  return (
    <section
      id="experience"
      className="min-h-screen w-full bg-[#fdf5e7] flex flex-col justify-start pt-20 pb-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 mb-32 z-10">
        <h2
          className={`${instrumentSerif.className} text-5xl md:text-7xl font-normal text-slate-800 mb-4 tracking-tight`}
        >
          My <span className="text-[#3ba58b] italic">Experience</span>
        </h2>
        <p
          className={`${robotoCondensed.className} text-slate-600 text-xl max-w-xl`}
        >
          A journey through my professional career and contributions.
        </p>
      </div>

      {/* Timeline Container */}
      <div
        className={`relative w-full px-6 md:px-12 flex-1 flex items-center justify-center ${
          isMobile ? "min-h-[1000px] items-start pt-10" : ""
        }`}
      >
        <div
          className={`relative flex ${
            isMobile
              ? "h-[1000px] w-full max-w-xs justify-center"
              : "w-full max-w-7xl h-[500px] items-center"
          }`}
        >
          {/* Base Gray Line */}
          <div
            className={`absolute bg-slate-300 rounded-full z-0 ${
              isMobile
                ? "top-0 bottom-0 left-1/2 -translate-x-1/2 w-1"
                : "left-0 right-0 h-1"
            }`}
          />

          {/* Month Ticks */}
          <div
            className={`absolute pointer-events-none z-10 flex ${
              isMobile
                ? "top-0 bottom-0 left-0 right-0 flex-col justify-between items-center"
                : "left-0 right-0 h-full justify-between"
            }`}
          >
            {monthLabels.map((date, index) => (
              <div
                key={index}
                className={`flex items-center justify-center relative group ${
                  isMobile ? "w-full flex-row" : "flex-col h-full"
                }`}
              >
                {/* Tick Mark */}
                <div
                  className={`bg-slate-400 rounded-full transition-all duration-300 ${
                    isMobile ? "w-4 h-1 mb-0" : "w-1 h-4 mb-2"
                  }`}
                />
                {/* Label */}
                <span
                  className={`${
                    robotoCondensed.className
                  } text-xs text-slate-400 absolute whitespace-nowrap ${
                    isMobile
                      ? index % 2 === 0
                        ? "translate-x-8"
                        : "-translate-x-8"
                      : index % 2 === 0
                      ? "translate-y-8"
                      : "-translate-y-8"
                  }`}
                >
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>

          {/* Experience Segments */}
          {experiences.map((exp, index) => {
            const start = new Date(`${exp.startDate}-01`);
            const end =
              exp.endDate === "Present"
                ? new Date()
                : new Date(`${exp.endDate}-01`);

            // Clamp dates to timeline range
            const effectiveStart =
              start < timelineStart ? timelineStart : start;
            const effectiveEnd = end > timelineEnd ? timelineEnd : end;

            // Calculate position and width percentage
            const startMonthIndex = getMonthDiff(timelineStart, effectiveStart);
            const durationMonths = getMonthDiff(effectiveStart, effectiveEnd);

            // Extend the width to cover the FULL end month (so it touches the start of the next month)
            const percentStart = (startMonthIndex / totalMonths) * 100;
            const percentSize = ((durationMonths + 1) / totalMonths) * 100;

            // Alternating positions: 0 = Top/Left, 1 = Bottom/Right
            const isPrimarySide = index % 2 === 0;

            return (
              <motion.div
                key={exp._id}
                className={`absolute z-20 flex items-center justify-center group ${
                  isMobile
                    ? "left-1/2 -translate-x-1/2 w-2"
                    : "h-2 top-1/2 -translate-y-1/2"
                }`}
                style={{
                  [isMobile ? "top" : "left"]: `${percentStart}%`,
                  [isMobile ? "height" : "width"]: `${percentSize}%`,
                  backgroundColor: exp.color || "#3ba58b",
                }}
                initial={
                  isMobile
                    ? { scaleY: 0, opacity: 0 }
                    : { scaleX: 0, opacity: 0 }
                }
                whileInView={
                  isMobile
                    ? { scaleY: 1, opacity: 1 }
                    : { scaleX: 1, opacity: 1 }
                }
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Floating Card - ALWAYS VISIBLE (opacity-100) */}
                <motion.div
                  className={`absolute flex items-center gap-3 w-max pointer-events-auto cursor-pointer z-30 ${
                    isMobile
                      ? isPrimarySide
                        ? "right-8 flex-row"
                        : "left-8 flex-row-reverse"
                      : `flex-col ${isPrimarySide ? "bottom-20" : "top-20"}`
                  }`}
                  initial={{
                    opacity: 0,
                    [isMobile ? "x" : "y"]: isMobile
                      ? isPrimarySide
                        ? -20
                        : 20
                      : isPrimarySide
                      ? 20
                      : -20,
                  }}
                  whileInView={{ opacity: 1, [isMobile ? "x" : "y"]: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  onClick={() => handleToggle(exp._id)}
                >
                  {/* Logo Group */}
                  <div
                    className={`flex items-center gap-2 ${
                      isMobile
                        ? isPrimarySide
                          ? "flex-row"
                          : "flex-row-reverse"
                        : `flex-col ${
                            isPrimarySide ? "flex-col-reverse" : "flex-col"
                          }`
                    }`}
                  >
                    {/* Name */}
                    <div
                      className={`${instrumentSerif.className} text-2xl font-bold text-slate-800 whitespace-nowrap bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-slate-100/50`}
                    >
                      {exp.orgName}
                    </div>

                    {/* Logo */}
                    <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-hidden relative z-30 hover:scale-110 transition-transform duration-300 shrink-0">
                      {exp.orgIcon ? (
                        <Image
                          src={exp.orgIcon}
                          alt={exp.orgName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-400">
                          {exp.orgName.substring(0, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Hover Glow Effect on Line */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300"
                  style={{ backgroundColor: exp.color || "#3ba58b" }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#3ba58b]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Experience Detail Dialog */}
      <AnimatePresence>
        {expandedId &&
          (() => {
            const exp = experiences.find((e) => e._id === expandedId);
            if (!exp) return null;
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setExpandedId(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#fdf5e7] border border-white/60 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setExpandedId(null)}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-800 z-10"
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

                  <div className="p-8 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden mb-4 relative">
                      {exp.orgIcon ? (
                        <Image
                          src={exp.orgIcon}
                          alt={exp.orgName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400">
                          {exp.orgName.substring(0, 2)}
                        </div>
                      )}
                    </div>

                    <h3
                      className={`${instrumentSerif.className} text-3xl font-bold text-slate-800 text-center mb-1`}
                    >
                      {exp.orgName}
                    </h3>

                    <div
                      className={`${robotoCondensed.className} text-slate-500 text-sm mb-6 flex items-center gap-2`}
                    >
                      <span>
                        {new Date(`${exp.startDate}-01`).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" }
                        )}
                      </span>
                      <span className="w-1 h-1 bg-slate-400 rounded-full" />
                      <span>
                        {exp.endDate === "Present"
                          ? "Present"
                          : new Date(`${exp.endDate}-01`).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}
                      </span>
                    </div>

                    <div className="w-full bg-white/50 rounded-xl p-6 border border-white/60">
                      <h4
                        className={`${robotoCondensed.className} text-slate-700 font-semibold mb-3 uppercase tracking-wider text-xs`}
                      >
                        Key Contributions
                      </h4>
                      <ul className="space-y-3">
                        {exp.workDone.map((work, i) => (
                          <li
                            key={i}
                            className={`${robotoCondensed.className} text-slate-600 flex gap-3 text-base leading-relaxed`}
                          >
                            <span className="text-[#3ba58b] mt-1.5">•</span>
                            <span>{work}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </section>
  );
};
