import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { requireAdminOrArtist } from "@/lib/auth";
import { AuthError } from "@/lib/auth";
import { createPortfolioItemSchema } from "@/lib/validations/portfolio";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const artistId = Number.parseInt(id, 10);
    if (Number.isNaN(artistId)) {
      return NextResponse.json({ error: "Invalid artist ID" }, { status: 400 });
    }

    const items = await db
      .select()
      .from(portfolio)
      .where(eq(portfolio.artistId, artistId))
      .orderBy(desc(portfolio.createdAt));

    return NextResponse.json(items);
  } catch (err) {
    console.error("Get portfolio error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const artistId = Number.parseInt(id, 10);
    if (Number.isNaN(artistId)) {
      return NextResponse.json({ error: "Invalid artist ID" }, { status: 400 });
    }

    await requireAdminOrArtist(artistId);

    const body = await request.json();
    const parsed = createPortfolioItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { title, description, images } = parsed.data;

    const [created] = await db
      .insert(portfolio)
      .values({
        artistId,
        images,
        title: title ?? null,
        description: description ?? null,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Create portfolio item error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
