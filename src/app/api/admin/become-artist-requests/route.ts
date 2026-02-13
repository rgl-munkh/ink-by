import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { becomeArtistRequests, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { AuthError } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const list = await db
      .select({
        id: becomeArtistRequests.id,
        userId: becomeArtistRequests.userId,
        phoneNumber: becomeArtistRequests.phoneNumber,
        instagramUsername: becomeArtistRequests.instagramUsername,
        status: becomeArtistRequests.status,
        createdAt: becomeArtistRequests.createdAt,
        reviewedAt: becomeArtistRequests.reviewedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(becomeArtistRequests)
      .innerJoin(users, eq(becomeArtistRequests.userId, users.id))
      .orderBy(desc(becomeArtistRequests.createdAt));

    return NextResponse.json(list);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Admin get become-artist requests error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
