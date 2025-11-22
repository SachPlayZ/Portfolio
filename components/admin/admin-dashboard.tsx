"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import TabTrigger from "./tab-trigger";
import TechStackPanel from "./panels/tech-stack-panel";
import ProjectsPanel from "./panels/projects-panel";
import BlogsPanel from "./panels/blogs-panel";
import ExperiencePanel from "./panels/experience-panel";
import AchievementsPanel from "./panels/achievements-panel";
import ContactPanel from "./panels/contact-panel";
import GithubPanel from "./panels/github-panel";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "tech", label: "Tech Stack", component: TechStackPanel },
  { id: "projects", label: "Projects", component: ProjectsPanel },
  { id: "blogs", label: "Blogs", component: BlogsPanel },
  { id: "experience", label: "Experience", component: ExperiencePanel },
  { id: "achievements", label: "Achievements", component: AchievementsPanel },
  { id: "contact", label: "Contact", component: ContactPanel },
  { id: "github", label: "Github", component: GithubPanel },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const { data } = useSession();

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component ?? TechStackPanel;

  return (
    <div className="space-y-8 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-purple-400">
            DevPort Admin
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Manage your portfolio
          </h1>
          <p className="text-sm text-zinc-400">
            Signed in as {data?.user?.email}
          </p>
        </div>
        <Button variant="ghost" onClick={() => signOut()}>
          Sign out
        </Button>
      </header>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <TabTrigger
            key={tab.id}
            value={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onSelect={setActiveTab}
          />
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
}

