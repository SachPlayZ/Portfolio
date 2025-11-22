import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import TechStack from "@/models/TechStack";
import { authOptions } from "../auth/auth.config";

class ValidationError extends Error {}

const categories = ["Frontend", "Backend", "Blockchain/Web3", "Other"] as const;
type Category = (typeof categories)[number];

const normalizeCategory = (value?: string): Category => {
  if (!value) return "Other";
  const normalized = value.trim().toLowerCase();
  const match = categories.find(
    (category) =>
      category.toLowerCase() === normalized ||
      category.replace(/\s+/g, "").toLowerCase() ===
        normalized.replace(/\s+/g, "")
  );
  return match ?? "Other";
};

const sanitizeTechPayload = (payload: any) => {
  const name = (payload?.name ?? "").trim();
  const image = (payload?.image ?? "").trim();
  const proficiency = Number(payload?.proficiency);
  if (!name) throw new ValidationError("Name is required");
  if (!image) throw new ValidationError("Image is required");
  if (Number.isNaN(proficiency)) {
    throw new ValidationError("Proficiency must be a number");
  }
  if (proficiency < 0 || proficiency > 5) {
    throw new ValidationError("Proficiency must be between 0 and 5");
  }

  return {
    name,
    image,
    category: normalizeCategory(payload?.category),
    proficiency,
  };
};

export async function GET() {
  try {
    await connectDB();
    const techStacks = await TechStack.find({}).sort({ proficiency: -1 });

    const grouped = techStacks.reduce<Record<Category, any[]>>(
      (acc, item) => {
        const bucket = normalizeCategory(item.category);
        acc[bucket].push(item);
        return acc;
      },
      {
        Frontend: [],
        Backend: [],
        "Blockchain/Web3": [],
        Other: [],
      }
    );

    return NextResponse.json(grouped);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tech stack" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = sanitizeTechPayload(await req.json());
    await connectDB();
    const newStack = await TechStack.create(payload);
    return NextResponse.json(newStack, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create tech stack";
    const status = error instanceof ValidationError ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { _id, ...rest } = body;

    if (!_id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const payload = sanitizeTechPayload(rest);

    await connectDB();
    const updated = await TechStack.findByIdAndUpdate(
      _id,
      payload,
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update tech stack";
    const status = error instanceof ValidationError ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let targetId = id;
    if (!targetId) {
      try {
        const body = await req.json();
        targetId = body._id;
      } catch {
        // ignore
      }
    }

    if (!targetId) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await connectDB();
    await TechStack.findByIdAndDelete(targetId);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete tech stack" },
      { status: 500 }
    );
  }
}

