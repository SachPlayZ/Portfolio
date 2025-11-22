"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "../admin-shell";
import ImageUpload from "../image-upload";
import { Button } from "@/components/ui/button";
import ConfirmButton from "../confirm-button";
import { adminRequest } from "@/lib/admin-client";

type TechStackRecord = {
  _id?: string;
  name: string;
  image: string;
  category: string;
  proficiency: number;
};

const categories = ["Frontend", "Backend", "Blockchain/Web3", "Other"];

const createEmptyForm = (): TechStackRecord => ({
  _id: undefined,
  name: "",
  image: "",
  category: "Frontend",
  proficiency: 3,
});

export default function TechStackPanel() {
  const [records, setRecords] = useState<TechStackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<TechStackRecord>(createEmptyForm);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await adminRequest<Record<string, TechStackRecord[]>>(
        "/api/tech-stack"
      );
      const flattened = Object.values(payload).flat();
      setRecords(flattened);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const grouped = useMemo(() => {
    return records.reduce<Record<string, TechStackRecord[]>>((acc, item) => {
      const key = item.category || "Other";
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    }, {});
  }, [records]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    try {
      const method = form._id ? "PATCH" : "POST";
      await adminRequest<TechStackRecord>("/api/tech-stack", {
        method,
        body: { ...form, proficiency: Number(form.proficiency) },
      });
      setStatus("Saved");
      setForm(createEmptyForm());
      refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const handleEdit = (record: TechStackRecord) => {
    setForm({ ...record });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await adminRequest(`/api/tech-stack?id=${id}`, { method: "DELETE" });
    refresh();
  };

  const imageArray = form.image ? [form.image] : [];

  return (
    <AdminShell
      title="Tech stack"
      description="Add, edit, or remove technologies displayed on the homepage."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Name</label>
            <input
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Category</label>
            <select
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">
              Proficiency (out of 5)
            </label>
            <input
              type="number"
              min={0}
              max={5}
              step={1}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.proficiency}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  proficiency: Number(e.target.value),
                }))
              }
              required
            />
          </div>
        </div>

        <ImageUpload
          label="Logo"
          multiple={false}
          value={imageArray}
          onChange={(images) =>
            setForm((prev) => ({ ...prev, image: images[0] || "" }))
          }
        />

        <div className="flex items-center gap-3">
          <Button type="submit">{form._id ? "Update" : "Add"} tech</Button>
          {form._id && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setForm(createEmptyForm())}
            >
              Cancel edit
            </Button>
          )}
          {status && <p className="text-sm text-zinc-400">{status}</p>}
        </div>
      </form>

      <div className="space-y-6">
        {loading && <p className="text-sm text-zinc-400">Loading...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading &&
          Object.entries(grouped).map(([categoryName, items]) => (
            <div key={categoryName} className="space-y-3">
              <h3 className="text-sm uppercase tracking-wide text-zinc-400">
                {categoryName} ({items.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 rounded-full border border-zinc-800 object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-xs text-zinc-400">
                          Proficiency: {item.proficiency}/5
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                      <ConfirmButton
                        size="sm"
                        onConfirm={() => handleDelete(item._id)}
                      >
                        Delete
                      </ConfirmButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </AdminShell>
  );
}
