"use client";

import { useState } from "react";
import GitHubActivity from "@/components/ui/github-activity";

export default function GithubBox() {
  const [totalCommits, setTotalCommits] = useState<number | null>(null);

  return (
    <div className="w-full h-full bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-8 flex flex-col gap-6 relative group hover:border-white/80 transition-colors">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-xl font-serif font-medium text-slate-800 z-10">
              Github Activity
            </h3>
            <p className="text-base text-neutral-600 dark:text-neutral-300">
              What I&apos;ve been up to the past year
            </p>
          </div>
          <div className="rounded-2xl px-2 py-1 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-neutral-500 dark:text-neutral-400">
              Total Commits
            </p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">
              {totalCommits !== null ? totalCommits.toLocaleString() : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="z-10">
          <GitHubActivity onTotalCommitsChange={setTotalCommits} />
        </div>
      </div>
    </div>
  );
}
