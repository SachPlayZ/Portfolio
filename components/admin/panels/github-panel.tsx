"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "../admin-shell";
import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-client";

type GithubCalendar = {
  totalContributions: number;
  weeks: {
    contributionDays: {
      date: string;
      contributionCount: number;
      level: string;
    }[];
  }[];
};

export default function GithubPanel() {
  const [calendar, setCalendar] = useState<GithubCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await adminRequest<GithubCalendar>(
        "/api/github-activity"
      );
      setCalendar(payload);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load GitHub data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const totalsByWeek = useMemo(() => {
    if (!calendar) return [];
    return calendar.weeks.map((week) =>
      week.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0)
    );
  }, [calendar]);

  const recentDays = useMemo(() => {
    if (!calendar) return [];
    const days = calendar.weeks.flatMap((week) => week.contributionDays);
    return days.slice(-21);
  }, [calendar]);

  return (
    <AdminShell
      title="Github activity"
      description="Fetched directly from the Github API. Admin view is read-only."
      actions={
        <Button size="sm" variant="secondary" onClick={refresh}>
          Refresh
        </Button>
      }
    >
      {loading && <p className="text-sm text-zinc-400">Loading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && calendar && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Total contributions (365d)
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {calendar.totalContributions}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Weekly average
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {totalsByWeek.length
                  ? Math.round(
                      totalsByWeek.reduce((sum, value) => sum + value, 0) /
                        totalsByWeek.length
                    )
                  : 0}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Last activity
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {recentDays.length > 0
                  ? recentDays[recentDays.length - 1].contributionCount
                  : 0}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Recent 3 weeks
            </p>
            <div className="mt-3 grid grid-cols-7 gap-2">
              {recentDays.map((day) => (
                <div
                  key={day.date}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 text-center"
                >
                  <p className="text-lg font-semibold text-white">
                    {day.contributionCount}
                  </p>
                  <p className="text-[10px] uppercase text-zinc-500">
                    {new Date(day.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
