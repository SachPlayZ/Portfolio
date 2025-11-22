import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/auth.config";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const updated = await Achievement.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const deleted = await Achievement.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}

