import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Validate basics?
    if (!body.email || !body.message) {
         return NextResponse.json({ error: "Email and message required" }, { status: 400 });
    }

    await connectDB();
    const newContact = await Contact.create(body);
    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 });
  }
}

