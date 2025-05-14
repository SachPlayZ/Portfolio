import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconBrandGithub,
  IconBrandSpotify,
  IconCode,
  IconStack,
} from "@tabler/icons-react";
import GitHubActivity from "./github-activity";
import TechStackScroll from "./tech-stack-scroll";
import SpotifyNowPlaying from "./spotify-now-playing";

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);

export default function AboutMeBento() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            About Me
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A glimpse into my digital world and technical expertise
          </p>
        </div>

        <BentoGrid className="max-w-[95rem] mx-auto md:auto-rows-[20rem]">
          {/* GitHub Activity */}
          <BentoGridItem
            title="GitHub Activity"
            description="Check out my latest contributions and projects"
            header={<GitHubActivity />}
            className="md:col-span-3"
            icon={<IconBrandGithub className="h-4 w-4 text-neutral-500" />}
          />

          {/* Spotify Activity */}
          <BentoGridItem
            title="Currently Playing"
            description="My latest musical inspiration while coding"
            header={<SpotifyNowPlaying />}
            className="md:col-span-1"
            icon={<IconBrandSpotify className="h-4 w-4 text-neutral-500" />}
          />

          {/* Featured Projects */}
          <BentoGridItem
            title="Featured Projects"
            description="Highlighting some of my best work"
            header={<Skeleton />}
            className="md:col-span-1"
            icon={<IconCode className="h-4 w-4 text-neutral-500" />}
          />

          {/* Tech Stack */}
          <BentoGridItem
            title="Tech Stack"
            description="Technologies I work with"
            header={<TechStackScroll />}
            className="md:col-span-3"
            icon={<IconStack className="h-4 w-4 text-neutral-500" />}
          />
        </BentoGrid>
      </div>
    </section>
  );
}
