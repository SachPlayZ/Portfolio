"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "../admin-shell";
import { Button } from "@/components/ui/button";
import ConfirmButton from "../confirm-button";
import ImageUpload from "../image-upload";
import StatusBadge from "../status-badge";
import { adminRequest } from "@/lib/admin-client";

type Link = { name: string; url: string };

type ProjectRecord = {
  _id?: string;
  name: string;
  logo?: string;
  overview?: string;
  demoVideoEmbed?: string;
  images: string[];
  description: string;
  techStack: string[];
  links: Link[];
  featured?: boolean;
};

type ProjectForm = ProjectRecord & {
  techStackInput: string;
  linksInput: string;
};

const createEmptyForm = (): ProjectForm => ({
  _id: undefined,
  name: "",
  logo: "",
  overview: "",
  demoVideoEmbed: "",
  images: [],
  description: "",
  techStack: [],
  links: [],
  techStackInput: "",
  linksInput: "",
});

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(createEmptyForm);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await adminRequest<ProjectRecord[]>("/api/projects");
      setProjects(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const currentFeatured = useMemo(
    () => projects.find((project) => project.featured),
    [projects]
  );

  const parseTechStack = (input: string) =>
    input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const parseLinks = (input: string): Link[] =>
    input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, url] = line.split("|").map((part) => part.trim());
        return { name: name || "Link", url: url || "" };
      })
      .filter((link) => Boolean(link.url));

  const formatLinks = (links: Link[]) =>
    links.map((link) => `${link.name}|${link.url}`).join("\n");

  const resetForm = () => {
    setForm(createEmptyForm());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    const payload: ProjectRecord & { _id?: string } = {
      _id: form._id,
      name: form.name,
      logo: form.logo,
      overview: form.overview,
      demoVideoEmbed: form.demoVideoEmbed,
      images: form.images,
      description: form.description,
      techStack: parseTechStack(form.techStackInput),
      links: parseLinks(form.linksInput),
    };

    try {
      const method = form._id ? "PATCH" : "POST";
      await adminRequest("/api/projects", { method, body: payload });
      setStatus("Project saved");
      resetForm();
      refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save project");
    }
  };

  const handleEdit = (project: ProjectRecord) => {
    setForm({
      ...project,
      images: [...(project.images || [])],
      techStack: [...(project.techStack || [])],
      links: [...(project.links || [])],
      techStackInput: project.techStack?.join(", ") || "",
      linksInput: formatLinks(project.links || []),
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await adminRequest(`/api/projects?id=${id}`, { method: "DELETE" });
    refresh();
  };

  const handleFeature = async (id?: string) => {
    if (!id) return;
    await adminRequest("/api/featured", {
      method: "POST",
      body: { projectId: id },
    });
    refresh();
  };

  return (
    <AdminShell
      title="Projects"
      description="Manage showcased projects, screenshots, and featured status."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Project name</label>
            <input
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Demo video embed URL</label>
            <input
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.demoVideoEmbed}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, demoVideoEmbed: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Overview</label>
            <textarea
              className="min-h-[80px] w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.overview}
              onChange={(e) => setForm((prev) => ({ ...prev, overview: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Description</label>
            <textarea
              className="min-h-[120px] w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">
              Tech stack (comma separated)
            </label>
            <input
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.techStackInput}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, techStackInput: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">
              Links (one per line: Label|https://url)
            </label>
            <textarea
              className="min-h-[80px] w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
              value={form.linksInput}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, linksInput: e.target.value }))
              }
            />
          </div>
        </div>

        <ImageUpload
          label="Project logo"
          value={form.logo ? [form.logo] : []}
          onChange={(images) => setForm((prev) => ({ ...prev, logo: images[0] || "" }))}
        />

        <ImageUpload
          label="Gallery images"
          multiple
          value={form.images}
          onChange={(images) => setForm((prev) => ({ ...prev, images }))}
        />

        <div className="flex items-center gap-3">
          <Button type="submit">{form._id ? "Update project" : "Add project"}</Button>
          {form._id && (
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
          {status && <p className="text-sm text-zinc-400">{status}</p>}
        </div>
      </form>

      <div className="space-y-4">
        {loading && <p className="text-sm text-zinc-400">Loading...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && projects.length === 0 && (
          <p className="text-sm text-zinc-500">No projects yet.</p>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project._id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  <p className="text-sm text-zinc-400">
                    {project.techStack?.join(", ") || "No stack"}
                  </p>
                </div>
                {project.featured && (
                  <StatusBadge label="Featured" tone="success" />
                )}
              </div>
              <p className="mt-3 text-sm text-zinc-300 line-clamp-3">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleEdit(project)}>
                  Edit
                </Button>
                <ConfirmButton size="sm" onConfirm={() => handleDelete(project._id)}>
                  Delete
                </ConfirmButton>
                {!project.featured && (
                  <Button size="sm" onClick={() => handleFeature(project._id)}>
                    Mark featured
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {currentFeatured && (
          <p className="text-sm text-zinc-400">
            Currently featured: {currentFeatured.name}
          </p>
        )}
      </div>
    </AdminShell>
  );
}

