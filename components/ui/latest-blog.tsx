"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Blog {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function LatestBlog() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBlog(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch blog", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] animate-pulse" />
    );
  }

  if (!blog) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-6 text-slate-500">
        No blogs found.
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2rem] p-8 hover:bg-white/50 transition-all duration-300 group relative overflow-hidden text-slate-900">
      <div className="z-10">
        <span className="inline-block px-3 py-1 mb-6 text-xs font-medium text-[#3ba58b] bg-[#3ba58b]/10 rounded-full border border-[#3ba58b]/20">
          Latest Article
        </span>
        <h3 className="text-3xl font-serif font-medium text-slate-800 mb-4 group-hover:text-[#3ba58b] transition-colors">
          {blog.title}
        </h3>
        <p className="text-slate-600 line-clamp-4 leading-relaxed">
          {blog.description}
        </p>
      </div>

      <div className="z-10 pt-4">
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
