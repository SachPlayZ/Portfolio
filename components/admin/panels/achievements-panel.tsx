"use client";

import { useEffect, useState } from "react";
import AdminShell from "../admin-shell";
import ImageUpload from "../image-upload";
import { Button } from "@/components/ui/button";
import ConfirmButton from "../confirm-button";
import { adminRequest } from "@/lib/admin-client";

type AchievementRecord = {
  _id?: string;
  position: string;
  description: string;
  image?: string;
  link?: string;
};

const createEmptyForm = (): AchievementRecord => ({
  _id: undefined,
  position: "",
  description: "",
  image: "",
  link: "",
});

export default function AchievementsPanel() {
  const [items, setItems] = useState<AchievementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<AchievementRecord>(createEmptyForm);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await adminRequest<AchievementRecord[]>("/api/achievements");
      setItems(payload);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch achievements"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const payload = {
      position: form.position,
      description: form.description,
      image: form.image,
      link: form.link,
    };

    try {
      if (form._id) {
        await adminRequest(`/api/achievements/${form._id}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await adminRequest("/api/achievements", { method: "POST", body: payload });
      }
      setStatus("Achievement saved");
      setForm(createEmptyForm());
      refresh();
    } catch (err) {
      setStatus(
        err instanceof Error ? err.message : "Failed to save achievement"
      );
    }
  };

  const handleEdit = (record: AchievementRecord) => setForm({ ...record });

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await adminRequest(`/api/achievements/${id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <AdminShell
      title="Achievements"
      description="Share competition wins, awards, and noteworthy highlights."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Position</label>
            <input
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.position}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, position: e.target.value }))
              }
              placeholder="1st Place"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Link (optional)</label>
            <input
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.link}
              onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Description</label>
          <textarea
            className="min-h-[100px] w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
        </div>

        <ImageUpload
          label="Badge image (optional)"
          value={form.image ? [form.image] : []}
          onChange={(images) => setForm((prev) => ({ ...prev, image: images[0] || "" }))}
        />

        <div className="flex items-center gap-3">
          <Button type="submit">
            {form._id ? "Update achievement" : "Add achievement"}
          </Button>
          {form._id && (
            <Button type="button" variant="ghost" onClick={() => setForm(createEmptyForm())}>
              Cancel edit
            </Button>
          )}
          {status && <p className="text-sm text-zinc-400">{status}</p>}
        </div>
      </form>

      <div className="space-y-4">
        {loading && <p className="text-sm text-zinc-400">Loading...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-zinc-500">No achievements added yet.</p>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-5"
            >
              <div className="flex items-start gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.position}
                    className="h-16 w-16 rounded-lg border border-zinc-800 object-cover"
                  />
                )}
                <div>
                  <p className="text-sm uppercase tracking-wide text-purple-300">
                    {item.position}
                  </p>
                  <p className="text-base text-white">{item.description}</p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-purple-300 hover:underline"
                    >
                      View link
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <ConfirmButton size="sm" onConfirm={() => handleDelete(item._id)}>
                  Delete
                </ConfirmButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

