import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { quotes } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { AuthError } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const quoteId = Number.parseInt(id, 10);
    if (Number.isNaN(quoteId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId));

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.status !== "draft" && existing.status !== "sent") {
      return NextResponse.json(
        { error: "Can only reject draft or sent quotes" },
        { status: 400 },
      );
    }

    await db
      .update(quotes)
      .set({ status: "rejected" })
      .where(eq(quotes.id, quoteId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Admin reject quote error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
