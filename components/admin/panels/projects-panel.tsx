"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import AdminShell from "../admin-shell";
import { Button } from "@/components/ui/button";
import ConfirmButton from "../confirm-button";
import ImageUpload from "../image-upload";
import StatusBadge from "../status-badge";
import { adminRequest } from "@/lib/admin-client";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  order?: number;
};

type ProjectForm = ProjectRecord & {
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
  linksInput: "",
});

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(createEmptyForm);
  const [techOptions, setTechOptions] = useState<string[]>([]);
  const [techOptionsLoading, setTechOptionsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

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

  useEffect(() => {
    const fetchTechOptions = async () => {
      setTechOptionsLoading(true);
      try {
        const res = await fetch("/api/tech-stack", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load tech stack options");
        const data = await res.json();
        const names = new Set<string>();
        Object.values(data ?? {}).forEach((group) => {
          (group as { name: string }[]).forEach((item) => {
            if (item?.name) names.add(item.name);
          });
        });
        setTechOptions(Array.from(names).sort());
      } catch (err) {
        console.error(err);
      } finally {
        setTechOptionsLoading(false);
      }
    };
    fetchTechOptions();
  }, []);

  const currentFeatured = useMemo(
    () => projects.find((project) => project.featured),
    [projects]
  );

  const sortableProjects = projects.filter(
    (project): project is ProjectRecord & { _id: string } => Boolean(project._id)
  );
  const sortableIds = sortableProjects.map((project) => project._id);

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
    const invalidLinks: string[] = [];
    const links = parseLinks(form.linksInput).filter((link) => {
      try {
        new URL(link.url);
        return true;
      } catch {
        invalidLinks.push(link.url);
        return false;
      }
    });
    if (invalidLinks.length > 0) {
      setStatus(`Invalid link(s): ${invalidLinks.join(", ")}`);
      return;
    }
    const techSelection =
      form.techStack?.filter((tech) => techOptions.includes(tech)) ?? [];
    if (!techSelection.length) {
      setStatus("Select at least one tech from the available stack.");
      return;
    }
    const payload: ProjectRecord & { _id?: string } = {
      _id: form._id,
      name: form.name,
      logo: form.logo,
      overview: form.overview,
      demoVideoEmbed: form.demoVideoEmbed,
      images: form.images,
      description: form.description,
      techStack: techSelection,
      links,
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

  const handleProjectReorder = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const oldIndex = projects.findIndex((project) => project._id === activeId);
    const newIndex = projects.findIndex((project) => project._id === overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);
    setReordering(true);
    setOrderStatus("Saving order…");
    try {
      await adminRequest("/api/projects/reorder", {
        method: "PATCH",
        body: {
          ids: reordered
            .map((project) => project._id)
            .filter((value): value is string => Boolean(value)),
        },
      });
      setOrderStatus("Order updated");
    } catch (err) {
      setOrderStatus(
        err instanceof Error ? err.message : "Failed to update order"
      );
      refresh();
    } finally {
      setReordering(false);
    }
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
            <label className="text-sm text-zinc-300">Tech stack</label>
            <div className="flex flex-wrap gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
              {techOptionsLoading ? (
                <p className="text-xs text-zinc-400">Loading options…</p>
              ) : techOptions.length > 0 ? (
                techOptions.map((tech) => {
                  const isSelected = form.techStack?.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() =>
                        setForm((prev) => {
                          const current = prev.techStack ?? [];
                          const next = isSelected
                            ? current.filter((item) => item !== tech)
                            : [...current, tech];
                          return { ...prev, techStack: next };
                        })
                      }
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                        isSelected
                          ? "bg-[#3ba58b] text-white border-[#3ba58b]"
                          : "border-zinc-700 text-zinc-200 hover:border-[#3ba58b]"
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-zinc-400">
                  No tech stack options available yet.
                </p>
              )}
            </div>
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
        {sortableProjects.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span>Drag the handle to reorder projects.</span>
            {(reordering || orderStatus) && (
              <span className="text-zinc-300">
                {reordering ? "Saving…" : orderStatus}
              </span>
            )}
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleProjectReorder}
        >
          <SortableContext
            items={sortableIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sortableProjects.map((project) => (
                <SortableProjectCard
                  key={project._id}
                  project={project}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onFeature={handleFeature}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {currentFeatured && (
          <p className="text-sm text-zinc-400">
            Currently featured: {currentFeatured.name}
          </p>
        )}
      </div>
    </AdminShell>
  );
}

type SortableProject = ProjectRecord & { _id: string };

type SortableProjectCardProps = {
  project: SortableProject;
  onEdit: (project: ProjectRecord) => void;
  onDelete: (id?: string) => void;
  onFeature: (id?: string) => void;
};

function SortableProjectCard({
  project,
  onEdit,
  onDelete,
  onFeature,
}: SortableProjectCardProps) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-3xl border border-zinc-800 bg-zinc-900/30 p-5 ${
        isDragging ? "ring-2 ring-purple-500/70" : ""
      }`}
    >
      <div className="flex gap-3">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="mt-1 rounded-full border border-zinc-800 bg-zinc-900/70 p-2 text-zinc-500 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">{project.name}</h3>
              <p className="text-sm text-zinc-400">
                {project.techStack?.join(", ") || "No stack"}
              </p>
            </div>
            {project.featured && <StatusBadge label="Featured" tone="success" />}
          </div>
          <p className="mt-3 text-sm text-zinc-300 line-clamp-3">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => onEdit(project)}>
              Edit
            </Button>
            <ConfirmButton size="sm" onConfirm={() => onDelete(project._id)}>
              Delete
            </ConfirmButton>
            {!project.featured && (
              <Button size="sm" onClick={() => onFeature(project._id)}>
                Mark featured
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

