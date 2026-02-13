import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingRequests } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { AuthError } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const requestId = Number.parseInt(id, 10);
    if (Number.isNaN(requestId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(bookingRequests)
      .where(eq(bookingRequests.id, requestId));

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.status !== "pending" && existing.status !== "quoted") {
      return NextResponse.json(
        { error: "Can only cancel pending or quoted requests" },
        { status: 400 },
      );
    }

    await db
      .update(bookingRequests)
      .set({ status: "cancelled" })
      .where(eq(bookingRequests.id, requestId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Admin cancel request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
