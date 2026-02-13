import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { artists } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }

    let artistId: number | null = null;
    if (user.role === "artist") {
      const [artist] = await db
        .select({ id: artists.id })
        .from(artists)
        .where(eq(artists.userId, user.id));
      artistId = artist?.id ?? null;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        artistId,
      },
    });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
