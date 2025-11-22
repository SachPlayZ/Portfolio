import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config";

export async function GET() {
  try {
    await connectDB();
    const featured = await Project.findOne({ featured: true });
    return NextResponse.json(featured || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch featured project" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { projectId } = await req.json();
    if (!projectId) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    await connectDB();
    // Unmark all
    await Project.updateMany({}, { featured: false });
    // Mark one
    const updated = await Project.findByIdAndUpdate(projectId, { featured: true }, { new: true });
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to set featured project" }, { status: 500 });
  }
}

