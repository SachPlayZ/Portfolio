"use client";

import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  tone?: "default" | "success" | "warning" | "danger";
};

const toneMap: Record<
  NonNullable<StatusBadgeProps["tone"]>,
  { bg: string; text: string }
> = {
  default: { bg: "bg-zinc-800", text: "text-zinc-200" },
  success: { bg: "bg-emerald-500/20", text: "text-emerald-300" },
  warning: { bg: "bg-amber-500/20", text: "text-amber-200" },
  danger: { bg: "bg-red-500/20", text: "text-red-200" },
};

export default function StatusBadge({
  label,
  tone = "default",
}: StatusBadgeProps) {
  const tokens = toneMap[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tokens.bg,
        tokens.text
      )}
    >
      {label}
    </span>
  );
}

