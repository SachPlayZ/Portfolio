"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function AdminShell({
  title,
  description,
  actions,
  children,
  className,
}: AdminShellProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-xl shadow-purple-500/5 backdrop-blur",
        className
      )}
    >
      <header className="mb-6 flex flex-col gap-2 border-b border-zinc-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description && (
            <p className="text-sm text-zinc-400">{description}</p>
          )}
        </div>
        {actions}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

