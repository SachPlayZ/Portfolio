import { useEffect, useState } from "react";
import AdminShell from "../admin-shell";
import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-client";

type ContactRecord = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
};

export default function ContactPanel() {
  const [messages, setMessages] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await adminRequest<ContactRecord[]>("/api/contact");
      setMessages(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contact entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AdminShell
      title="Contact forms"
      description="Review inbound contact submissions from the portfolio site."
      actions={
        <Button size="sm" variant="secondary" onClick={refresh}>
          Refresh
        </Button>
      }
    >
      {loading && <p className="text-sm text-zinc-400">Loading...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && messages.length === 0 && (
        <p className="text-sm text-zinc-500">No submissions yet.</p>
      )}
      <div className="space-y-4">
        {messages.map((entry) => (
          <div
            key={entry._id}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-white">{entry.name}</h3>
                <a
                  href={`mailto:${entry.email}`}
                  className="text-sm text-purple-300 hover:underline"
                >
                  {entry.email}
                </a>
              </div>
              {entry.createdAt && (
                <p className="text-xs text-zinc-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              )}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-200">
              {entry.message}
            </p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

