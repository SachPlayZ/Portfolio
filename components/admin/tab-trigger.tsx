"use client";

import { cn } from "@/lib/utils";

type TabTriggerProps = {
  value: string;
  label: string;
  isActive: boolean;
  onSelect: (value: string) => void;
  badge?: string | number;
};

export default function TabTrigger({
  value,
  label,
  isActive,
  onSelect,
  badge,
}: TabTriggerProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
        isActive
          ? "bg-white text-zinc-900 shadow shadow-purple-500/30"
          : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-900 hover:text-white"
      )}
    >
      <span>{label}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs",
            isActive ? "bg-zinc-100 text-zinc-900" : "bg-zinc-800 text-zinc-300"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

