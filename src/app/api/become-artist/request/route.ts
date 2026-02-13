import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { becomeArtistRequests } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { AuthError } from "@/lib/auth";
import { createBecomeArtistRequestSchema } from "@/lib/validations/become-artist";

export async function GET() {
  try {
    const user = await requireUser();

    const [latest] = await db
      .select()
      .from(becomeArtistRequests)
      .where(eq(becomeArtistRequests.userId, user.id))
      .orderBy(desc(becomeArtistRequests.createdAt))
      .limit(1);

    return NextResponse.json({ request: latest ?? null });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Get become-artist request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    if (user.role !== "client") {
      return NextResponse.json(
        { error: "Only clients can request to become an artist" },
        { status: 403 },
      );
    }

    const [pending] = await db
      .select({ id: becomeArtistRequests.id })
      .from(becomeArtistRequests)
      .where(
        and(
          eq(becomeArtistRequests.userId, user.id),
          eq(becomeArtistRequests.status, "pending"),
        ),
      );

    if (pending) {
      return NextResponse.json(
        { error: "You already have a pending become-artist request" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = createBecomeArtistRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { phoneNumber, instagramUsername } = parsed.data;

    const [created] = await db
      .insert(becomeArtistRequests)
      .values({
        userId: user.id,
        phoneNumber: phoneNumber ?? null,
        instagramUsername: instagramUsername ?? null,
        status: "pending",
      })
      .returning();

    return NextResponse.json(
      { id: created?.id, status: "pending" },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Create become-artist request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
