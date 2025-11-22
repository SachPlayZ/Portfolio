import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Achievement from "@/models/Achievement";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config";

export async function GET() {
  try {
    await connectDB();
    const achievements = await Achievement.find({}).sort({ createdAt: -1 });
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    const newAchievement = await Achievement.create(body);
    return NextResponse.json(newAchievement, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}

