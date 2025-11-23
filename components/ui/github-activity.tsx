"use client";

import { GitHubCalendar, type Activity } from "react-github-calendar";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

type GitHubActivityProps = {
  onTotalCommitsChange?: (total: number) => void;
};

export default function GitHubActivity({
  onTotalCommitsChange,
}: GitHubActivityProps) {
  // Handle hydration mismatch for theme
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const lastTotalRef = useRef<number | null>(null);
  const pendingFrame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pendingFrame.current) {
        cancelAnimationFrame(pendingFrame.current);
      }
    };
  }, []);

  const handleTransformData = useCallback(
    (contributions: Activity[]) => {
      if (onTotalCommitsChange) {
        const total = contributions.reduce(
          (sum, day) => sum + (day?.count ?? 0),
          0
        );

        if (lastTotalRef.current !== total) {
          lastTotalRef.current = total;

          if (pendingFrame.current) {
            cancelAnimationFrame(pendingFrame.current);
          }

          pendingFrame.current = requestAnimationFrame(() => {
            onTotalCommitsChange(total);
            pendingFrame.current = null;
          });
        }
      }
      return contributions;
    },
    [onTotalCommitsChange]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full rounded-2xl border border-white/60 bg-white/40 dark:border-white/15 dark:bg-white/5 animate-pulse" />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block rounded-2xl  p-4">
        <GitHubCalendar
          username="SachPlayZ"
          colorScheme={currentTheme === "dark" ? "dark" : "light"}
          showMonthLabels={false}
          showColorLegend={false}
          showTotalCount={false}
          blockSize={12}
          blockMargin={4}
          transformData={handleTransformData}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
