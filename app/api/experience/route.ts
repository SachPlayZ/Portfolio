import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config";

export async function GET() {
  try {
    await connectDB();
    const experience = await Experience.find({}).sort({ startDate: -1 });
    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    const newExperience = await Experience.create(body);
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}

