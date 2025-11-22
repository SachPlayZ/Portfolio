import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TechStack from "@/models/TechStack";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config";

export async function GET() {
  try {
    await connectDB();
    const techStacks = await TechStack.find({});
    
    // Group by category
    const grouped = techStacks.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json(grouped);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tech stack" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    const newStack = await TechStack.create(body);
    return NextResponse.json(newStack, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tech stack" }, { status: 500 });
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
    const updated = await TechStack.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update tech stack" }, { status: 500 });
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
        // Try body
        try {
            const body = await req.json();
            targetId = body._id;
        } catch (e) {
            // Ignore json parse error if body is empty
        }
    }

    if (!targetId) {
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await connectDB();
    await TechStack.findByIdAndDelete(targetId);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete tech stack" }, { status: 500 });
  }
}

