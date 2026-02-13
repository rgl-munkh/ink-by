import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingRequests, quotes, users } from "@/db/schema";
import { requireAdminOrArtist } from "@/lib/auth";
import { AuthError } from "@/lib/auth";

const PENDING_LONG_THRESHOLD_HOURS = 4;

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

    await requireAdminOrArtist(artistId);

    const requests = await db
      .select({
        id: bookingRequests.id,
        userId: bookingRequests.userId,
        artistId: bookingRequests.artistId,
        referenceImageUrl: bookingRequests.referenceImageUrl,
        referenceImageUrls: bookingRequests.referenceImageUrls,
        description: bookingRequests.description,
        size: bookingRequests.size,
        placement: bookingRequests.placement,
        preferredDates: bookingRequests.preferredDates,
        status: bookingRequests.status,
        createdAt: bookingRequests.createdAt,
        userName: users.name,
      })
      .from(bookingRequests)
      .leftJoin(users, eq(bookingRequests.userId, users.id))
      .where(eq(bookingRequests.artistId, artistId))
      .orderBy(desc(bookingRequests.createdAt));

    const requestsWithQuotes = await Promise.all(
      requests.map(async (req) => {
        const [latestQuote] = await db
          .select()
          .from(quotes)
          .where(eq(quotes.bookingRequestId, req.id))
          .orderBy(desc(quotes.createdAt))
          .limit(1);

        return {
          ...req,
          userName: req.userName ?? "New user",
          quote: latestQuote
            ? {
                dates: latestQuote.dates,
                durationMin: latestQuote.durationMin,
              }
            : null,
        };
      }),
    );

    const now = new Date();
    const fourHoursAgo = new Date(
      now.getTime() - PENDING_LONG_THRESHOLD_HOURS * 60 * 60 * 1000,
    );

    const newCount = requestsWithQuotes.filter(
      (r) => r.status === "pending",
    ).length;

    const pendingLongCount = requestsWithQuotes.filter(
      (r) =>
        r.status === "pending" &&
        r.createdAt &&
        new Date(r.createdAt) < fourHoursAgo,
    ).length;

    return NextResponse.json({
      newCount,
      pendingLongCount,
      requests: requestsWithQuotes,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Get artist requests error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
