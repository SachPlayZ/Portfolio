"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function GitHubActivity() {
  // Handle hydration mismatch for theme
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 rounded-lg animate-pulse" />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="w-full h-full flex flex-col justify-center overflow-hidden">
      <div className="w-[150%] -mr-[50%]">
        <GitHubCalendar
          username="SachPlayZ"
          colorScheme={currentTheme === "dark" ? "dark" : "light"}
          showMonthLabels={false}
          showColorLegend={false}
          blockSize={14}
          blockMargin={5}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "150px",
          }}
        />
      </div>
    </div>
  );
}
