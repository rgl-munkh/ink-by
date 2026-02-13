import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { requireAdminOrArtist } from "@/lib/auth";
import { AuthError } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  {
    params,
  }: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id, itemId } = await params;
    const artistId = Number.parseInt(id, 10);
    const portfolioItemId = Number.parseInt(itemId, 10);

    if (Number.isNaN(artistId) || Number.isNaN(portfolioItemId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await requireAdminOrArtist(artistId);

    const [existing] = await db
      .select({ id: portfolio.id })
      .from(portfolio)
      .where(
        and(
          eq(portfolio.id, portfolioItemId),
          eq(portfolio.artistId, artistId),
        ),
      );

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db
      .delete(portfolio)
      .where(eq(portfolio.id, portfolioItemId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Delete portfolio item error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
