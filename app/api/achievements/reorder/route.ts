import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/auth.config";
import connectDB from "@/lib/mongodb";
import Achievement from "@/models/Achievement";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const ids = body?.ids as string[] | undefined;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Provide a non-empty ids array" },
        { status: 400 }
      );
    }

    await connectDB();
    const operations = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    await Achievement.bulkWrite(operations);

    return NextResponse.json({ message: "Order updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reorder achievements" },
      { status: 500 }
    );
  }
}

