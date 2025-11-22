import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    const payload = {
      ...body,
      order: Date.now(),
    };
    const newProject = await Project.create(payload);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { _id, ...updateData } = body;
    
    if (!_id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await connectDB();
    const updated = await Project.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let targetId = id;
    if (!targetId) {
        try {
            const body = await req.json();
            targetId = body._id;
        } catch (e) {}
    }
    
    if (!targetId) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await connectDB();
    await Project.findByIdAndDelete(targetId);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

