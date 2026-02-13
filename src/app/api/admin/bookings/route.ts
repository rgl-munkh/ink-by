import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { AuthError } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const list = await db.select().from(bookings);
    return NextResponse.json(list);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Admin get bookings error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
