import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingRequests } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { AuthError } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const list = await db.select().from(bookingRequests);
    return NextResponse.json(list);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Admin get booking requests error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
