"use client";

import { useEffect, useMemo, useState, type HTMLAttributes } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface Blog {
  _id: string;
  title: string;
  description: string;
  content?: string;
  createdAt: string;
}

const getContentPreview = (content?: string) => {
  if (!content) return "";
  return content.trim();
};

const markdownComponents: Components = {
  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-slate-500 text-sm leading-relaxed not-last:mb-2"
      {...props}
    />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc pl-5 text-slate-500 text-sm leading-relaxed space-y-1"
      {...props}
    />
  ),
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal pl-5 text-slate-500 text-sm leading-relaxed space-y-1"
      {...props}
    />
  ),
  strong: (props: HTMLAttributes<HTMLElement>) => (
    <strong className="text-slate-700" {...props} />
  ),
  em: (props: HTMLAttributes<HTMLElement>) => (
    <em className="text-slate-600" {...props} />
  ),
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700"
      {...props}
    />
  ),
};

export default function LatestBlog() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        const featuredRes = await fetch("/api/featured-blog", {
          cache: "no-store",
        });

        if (!featuredRes.ok) {
          throw new Error("Failed to load featured blog");
        }

        const featuredData = await featuredRes.json();

        if (featuredData && featuredData._id) {
          setBlog(featuredData);
          return;
        }

        const latestRes = await fetch("/api/blogs", { cache: "no-store" });

        if (!latestRes.ok) {
          throw new Error("Failed to load latest blogs");
        }

        const latestData = await latestRes.json();
        if (Array.isArray(latestData) && latestData.length > 0) {
          setBlog(latestData[0]);
          return;
        }

        setBlog(null);
      } catch (err) {
        console.error(err);
        setError("Unable to load blog data right now.");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, []);

  const contentPreview = useMemo(
    () => getContentPreview(blog?.content),
    [blog?.content]
  );

  if (loading) {
    return (
      <div className="w-full h-full bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-4xl animate-pulse" />
    );
  }

  if (!blog) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-4xl p-6 text-slate-500 text-center">
        {error ?? "No blog posts available yet."}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-4xl p-8 hover:bg-white/50 transition-all duration-300 group relative overflow-hidden text-slate-900">
      <div className="z-10 flex-1 flex flex-col">
        <span className="self-start inline-block px-3 py-1 mb-6 text-xs font-medium text-[#3ba58b] bg-[#3ba58b]/10 rounded-full border border-[#3ba58b]/20">
          Latest Article
        </span>
        <h3 className="text-3xl font-serif font-medium text-slate-800 mb-4 group-hover:text-[#3ba58b] transition-colors">
          {blog.title}
        </h3>
        <div className="space-y-4 flex-1 flex flex-col">
          <p className="text-slate-600 line-clamp-4 leading-relaxed">
            {blog.description}
          </p>
          {contentPreview && (
            <div className="flex-1 overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-4">
              <ReactMarkdown components={markdownComponents}>
                {contentPreview}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      <div className="z-10 pt-6">
        <Button
          variant="ghost"
          className="p-0 text-slate-800 hover:text-[#3ba58b] hover:bg-transparent group/btn text-base font-medium"
        >
          Read Article{" "}
          <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
