import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectDB();
    // Assuming "featured" boolean flag exists on Blog model as defined earlier
    // If multiple are marked true, this gets one.
    const featured = await Blog.findOne({ featured: true });
    return NextResponse.json(featured || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch featured blog" }, { status: 500 });
  }
}

