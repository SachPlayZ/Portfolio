import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Journey from "@/app/models/Journey";

export async function GET() {
  try {
    await connectDB();
    const journey = await Journey.find().sort({ date: -1, order: 1 });
    return NextResponse.json(journey);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch journey entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const journey = await Journey.create(body);
    return NextResponse.json(journey, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create journey entry" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;
    const journey = await Journey.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return NextResponse.json(journey);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update journey entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Journey.findByIdAndDelete(id);
    return NextResponse.json({ message: "Journey entry deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete journey entry" },
      { status: 500 }
    );
  }
}
