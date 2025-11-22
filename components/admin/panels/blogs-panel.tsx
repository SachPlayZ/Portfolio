"use client";

import { useEffect, useState } from "react";
import AdminShell from "../admin-shell";
import ImageUpload from "../image-upload";
import { Button } from "@/components/ui/button";
import ConfirmButton from "../confirm-button";
import StatusBadge from "../status-badge";
import { adminRequest } from "@/lib/admin-client";

type BlogRecord = {
  _id?: string;
  title: string;
  image?: string;
  description: string;
  content: string;
  featured?: boolean;
};

const createEmptyForm = (): BlogRecord => ({
  _id: undefined,
  title: "",
  image: "",
  description: "",
  content: "",
});

export default function BlogsPanel() {
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<BlogRecord>(createEmptyForm);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await adminRequest<BlogRecord[]>("/api/blogs");
      setBlogs(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs");
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
    const url = form._id ? `/api/blogs/${form._id}` : "/api/blogs";
    const method = form._id ? "PATCH" : "POST";

    try {
      await adminRequest(url, { method, body: form });
      setStatus("Blog saved");
      setForm(createEmptyForm());
      refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save blog");
    }
  };

  const handleEdit = (blog: BlogRecord) => {
    setForm({ ...blog });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await adminRequest(`/api/blogs/${id}`, { method: "DELETE" });
    refresh();
  };

  const handleFeature = async (id?: string) => {
    if (!id) return;
    await adminRequest(`/api/blogs/${id}`, { method: "PATCH", body: { featured: true } });
    refresh();
  };

  return (
    <AdminShell
      title="Blogs"
      description="Publish, edit, or delete markdown-compatible blog posts."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Title</label>
          <input
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Description</label>
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Content (Markdown)</label>
          <textarea
            className="min-h-[200px] w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm font-mono text-white focus:border-purple-500 focus:outline-none"
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            required
          />
        </div>

        <ImageUpload
          label="Cover image"
          value={form.image ? [form.image] : []}
          onChange={(images) => setForm((prev) => ({ ...prev, image: images[0] || "" }))}
        />

        <div className="flex items-center gap-3">
          <Button type="submit">{form._id ? "Update blog" : "Publish blog"}</Button>
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
        {!loading && blogs.length === 0 && (
          <p className="text-sm text-zinc-500">No blog posts yet.</p>
        )}
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{blog.title}</h3>
                {blog.featured && <StatusBadge label="Featured" tone="success" />}
              </div>
              <p className="mt-2 text-sm text-zinc-300 line-clamp-2">{blog.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleEdit(blog)}>
                  Edit
                </Button>
                <ConfirmButton size="sm" onConfirm={() => handleDelete(blog._id)}>
                  Delete
                </ConfirmButton>
                {!blog.featured && (
                  <Button size="sm" onClick={() => handleFeature(blog._id)}>
                    Mark featured
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

