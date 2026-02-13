import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { artists, becomeArtistRequests, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { AuthError } from "@/lib/auth";
import { reviewBecomeArtistRequestSchema } from "@/lib/validations/become-artist";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();

    const { id } = await params;
    const requestId = Number.parseInt(id, 10);
    if (Number.isNaN(requestId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = reviewBecomeArtistRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { action } = parsed.data;

    const [req] = await db
      .select()
      .from(becomeArtistRequests)
      .where(eq(becomeArtistRequests.id, requestId));

    if (!req) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (req.status !== "pending") {
      return NextResponse.json(
        { error: "Request has already been reviewed" },
        { status: 400 },
      );
    }

    const now = new Date();

    if (action === "reject") {
      await db
        .update(becomeArtistRequests)
        .set({
          status: "rejected",
          reviewedAt: now,
          reviewedBy: admin.id,
        })
        .where(eq(becomeArtistRequests.id, requestId));

      return NextResponse.json({ ok: true, status: "rejected" });
    }

    if (action === "approve") {
      const [requester] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.userId));

      if (!requester) {
        return NextResponse.json(
          { error: "Requester user not found" },
          { status: 404 },
        );
      }

      const [artist] = await db
        .insert(artists)
        .values({
          userId: requester.id,
          name: requester.name,
          instagramUsername: req.instagramUsername ?? null,
          timezone: "UTC",
        })
        .returning();

      await db
        .update(users)
        .set({
          role: "artist",
          phone: req.phoneNumber ?? requester.phone,
        })
        .where(eq(users.id, requester.id));

      await db
        .update(becomeArtistRequests)
        .set({
          status: "approved",
          reviewedAt: now,
          reviewedBy: admin.id,
        })
        .where(eq(becomeArtistRequests.id, requestId));

      return NextResponse.json({
        ok: true,
        status: "approved",
        artistId: artist?.id,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Admin review become-artist request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
