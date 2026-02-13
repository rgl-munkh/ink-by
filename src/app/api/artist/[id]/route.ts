import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { artists } from "@/db/schema";

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

    const [artist] = await db
      .select()
      .from(artists)
      .where(eq(artists.id, artistId));

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    return NextResponse.json(artist);
  } catch (err) {
    console.error("Get artist error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
