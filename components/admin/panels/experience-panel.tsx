"use client";

import { useEffect, useState } from "react";
import AdminShell from "../admin-shell";
import ImageUpload from "../image-upload";
import { Button } from "@/components/ui/button";
import ConfirmButton from "../confirm-button";
import { adminRequest } from "@/lib/admin-client";

type ExperienceRecord = {
  _id?: string;
  orgName: string;
  orgIcon?: string;
  startDate: string;
  endDate?: string;
  workDone: string[];
};

type ExperienceForm = ExperienceRecord & { workInput: string };

const createEmptyForm = (): ExperienceForm => ({
  _id: undefined,
  orgName: "",
  orgIcon: "",
  startDate: "",
  endDate: "",
  workDone: [],
  workInput: "",
});

export default function ExperiencePanel() {
  const [experience, setExperience] = useState<ExperienceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<ExperienceForm>(createEmptyForm);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await adminRequest<ExperienceRecord[]>("/api/experience");
      setExperience(payload);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch experience entries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const splitWork = (input: string) =>
    input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const payload: ExperienceRecord = {
      orgName: form.orgName,
      orgIcon: form.orgIcon,
      startDate: form.startDate,
      endDate: form.endDate,
      workDone: splitWork(form.workInput),
    };

    try {
      if (form._id) {
        await adminRequest(`/api/experience/${form._id}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await adminRequest("/api/experience", { method: "POST", body: payload });
      }

      setStatus("Experience saved");
      setForm(createEmptyForm());
      refresh();
    } catch (err) {
      setStatus(
        err instanceof Error ? err.message : "Failed to save experience entry"
      );
    }
  };

  const handleEdit = (record: ExperienceRecord) => {
    setForm({
      ...record,
      workInput: record.workDone?.join("\n") || "",
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await adminRequest(`/api/experience/${id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <AdminShell
      title="Experience"
      description="Maintain timeline entries, roles, and accomplishments."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Organization</label>
            <input
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.orgName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, orgName: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Start date</label>
            <input
              type="text"
              placeholder="Jan 2023"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.startDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startDate: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">End date</label>
            <input
              type="text"
              placeholder="Present"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.endDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>
        </div>

        <ImageUpload
          label="Organization icon"
          value={form.orgIcon ? [form.orgIcon] : []}
          onChange={(images) => setForm((prev) => ({ ...prev, orgIcon: images[0] || "" }))}
        />

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">
            Highlights (one per line)
          </label>
          <textarea
            className="min-h-[120px] w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            value={form.workInput}
            onChange={(e) => setForm((prev) => ({ ...prev, workInput: e.target.value }))}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit">{form._id ? "Update entry" : "Add entry"}</Button>
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
        {!loading && experience.length === 0 && (
          <p className="text-sm text-zinc-500">No experience entries yet.</p>
        )}
        <div className="space-y-4">
          {experience.map((record) => (
            <div
              key={record._id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-5"
            >
              <div className="flex items-center gap-3">
                {record.orgIcon && (
                  <img
                    src={record.orgIcon}
                    alt={record.orgName}
                    className="h-12 w-12 rounded-full border border-zinc-800 object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white">{record.orgName}</h3>
                  <p className="text-sm text-zinc-400">
                    {record.startDate} – {record.endDate || "Present"}
                  </p>
                </div>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-zinc-300">
                {record.workDone?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleEdit(record)}>
                  Edit
                </Button>
                <ConfirmButton size="sm" onConfirm={() => handleDelete(record._id)}>
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

