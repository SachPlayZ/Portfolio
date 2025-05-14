"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AnimatedSection from "@/components/animated-section";
import Dialog from "@/components/ui/dialog";
import ImageUpload from "@/components/ui/image-upload";

type Section = "projects" | "journey" | "experience" | "contact";

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: string;
  images?: string[];
}

interface Journey {
  _id: string;
  title: string;
  description: string;
  date: string;
  type: "education" | "work" | "achievement";
  location?: string;
  createdAt: string;
}

interface Experience {
  _id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  technologies: string[];
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

type DataType = {
  projects: Project[];
  journey: Journey[];
  experience: Experience[];
  contact: Contact[];
};

type FormData = {
  projects: Omit<Project, "_id" | "createdAt" | "images"> & {
    images?: string[];
  };
  journey: Omit<Journey, "_id" | "createdAt">;
  experience: Omit<Experience, "_id" | "createdAt">;
  contact: never;
};

const defaultFormData: FormData = {
  projects: {
    title: "",
    description: "",
    technologies: [],
    githubUrl: "",
    liveUrl: "",
    featured: false,
    images: [],
  },
  journey: {
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    type: "education",
    location: "",
  },
  experience: {
    company: "",
    position: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    current: false,
    location: "",
    technologies: [],
  },
  contact: null as never,
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState<Section>("projects");
  const [data, setData] = useState<DataType>({
    projects: [],
    journey: [],
    experience: [],
    contact: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData[keyof FormData]>(
    defaultFormData[activeSection]
  );

  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/journey"),
        fetch("/api/experience"),
        fetch("/api/contact"),
      ]);

      const [projects, journey, experience, contact] = await Promise.all(
        responses.map((res) => res.json())
      );

      setData({ projects, journey, experience, contact });
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFormData(defaultFormData[activeSection]);
  }, [activeSection]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/${activeSection}?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      await fetchData();
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/${activeSection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create item");

      await fetchData();
      setIsDialogOpen(false);
      setFormData(defaultFormData[activeSection]);
    } catch (err) {
      console.error("Error creating item:", err);
      setError("Failed to create item");
    }
  };

  const renderForm = () => {
    switch (activeSection) {
      case "projects":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Title
              </label>
              <input
                type="text"
                value={(formData as FormData["projects"]).title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={(formData as FormData["projects"]).description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Project Images
              </label>
              <ImageUpload
                multiple
                value={(formData as FormData["projects"]).images}
                onUpload={(urls) => setFormData({ ...formData, images: urls })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={(formData as FormData["projects"]).technologies.join(
                  ", "
                )}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    technologies: e.target.value
                      .split(", ")
                      .map((t) => t.trim()),
                  })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={(formData as FormData["projects"]).githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Live URL
              </label>
              <input
                type="url"
                value={(formData as FormData["projects"]).liveUrl}
                onChange={(e) =>
                  setFormData({ ...formData, liveUrl: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={(formData as FormData["projects"]).featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="bg-zinc-800 border border-zinc-700 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-400">
                Featured Project
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Project
            </button>
          </form>
        );

      case "journey":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Title
              </label>
              <input
                type="text"
                value={(formData as FormData["journey"]).title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={(formData as FormData["journey"]).description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={(formData as FormData["journey"]).date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Type
              </label>
              <select
                value={(formData as FormData["journey"]).type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as
                      | "education"
                      | "work"
                      | "achievement",
                  })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                required
              >
                <option value="education">Education</option>
                <option value="work">Work</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Location
              </label>
              <input
                type="text"
                value={(formData as FormData["journey"]).location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Journey Entry
            </button>
          </form>
        );

      case "experience":
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Company
              </label>
              <input
                type="text"
                value={(formData as FormData["experience"]).company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Position
              </label>
              <input
                type="text"
                value={(formData as FormData["experience"]).position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={(formData as FormData["experience"]).description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={(formData as FormData["experience"]).startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                required
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={(formData as FormData["experience"]).current}
                onChange={(e) =>
                  setFormData({ ...formData, current: e.target.checked })
                }
                className="bg-zinc-800 border border-zinc-700 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-400">
                Current Position
              </label>
            </div>
            {!(formData as FormData["experience"]).current && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={(formData as FormData["experience"]).endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Location
              </label>
              <input
                type="text"
                value={(formData as FormData["experience"]).location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={(formData as FormData["experience"]).technologies.join(
                  ", "
                )}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    technologies: e.target.value
                      .split(", ")
                      .map((t) => t.trim()),
                  })
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-gray-200"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Experience
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  const sections = [
    { id: "projects", name: "Projects" },
    { id: "journey", name: "Journey" },
    { id: "experience", name: "Experience" },
    { id: "contact", name: "Contact" },
  ] as const;

  const renderContent = () => {
    const items = data[activeSection];

    if (error) {
      return (
        <div className="text-red-400 p-4 rounded-xl bg-red-500/10">{error}</div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item: any) => (
          <div
            key={item._id}
            className="bg-zinc-800/50 rounded-xl p-4 hover:bg-zinc-800/70 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-200">
                  {activeSection === "projects" && item.title}
                  {activeSection === "journey" && item.title}
                  {activeSection === "experience" &&
                    `${item.position} at ${item.company}`}
                  {activeSection === "contact" &&
                    `${item.name} (${item.email})`}
                </h3>
                <p className="text-gray-400 text-sm">
                  {new Date(item.createdAt).toLocaleDateString()} -{" "}
                  {activeSection === "contact" && `Status: ${item.status}`}
                  {activeSection === "projects" &&
                    item.technologies?.join(", ")}
                  {activeSection === "journey" && item.type}
                  {activeSection === "experience" &&
                    (item.current
                      ? "Current"
                      : new Date(item.endDate).toLocaleDateString())}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <AnimatedSection>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">
              Admin Dashboard
            </h1>
            <div className="text-gray-400">
              Logged in as: {session.user?.email}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800 p-4">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-xl transition-colors ${
                        activeSection === section.id
                          ? "bg-purple-500/20 text-purple-400"
                          : "hover:bg-white/5 text-gray-400"
                      }`}
                    >
                      {section.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-5">
              <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800 p-6">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-200">
                    {sections.find((s) => s.id === activeSection)?.name}{" "}
                    Management
                  </h2>
                  {activeSection !== "contact" && (
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 transition-colors rounded-xl text-white font-medium"
                    >
                      Add New{" "}
                      {sections.find((s) => s.id === activeSection)?.name}
                    </button>
                  )}
                </div>

                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setFormData(defaultFormData[activeSection]);
        }}
        title={`Add New ${sections.find((s) => s.id === activeSection)?.name}`}
      >
        {renderForm()}
      </Dialog>
    </div>
  );
}
