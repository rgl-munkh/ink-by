import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { artists, bookingRequests, quotes } from "@/db/schema";
import { AuthError, requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();

    const requests = await db
      .select({
        id: bookingRequests.id,
        artistId: bookingRequests.artistId,
        description: bookingRequests.description,
        size: bookingRequests.size,
        placement: bookingRequests.placement,
        referenceImageUrl: bookingRequests.referenceImageUrl,
        referenceImageUrls: bookingRequests.referenceImageUrls,
        status: bookingRequests.status,
        createdAt: bookingRequests.createdAt,
        artistName: artists.name,
        artistInstagram: artists.instagramUsername,
      })
      .from(bookingRequests)
      .innerJoin(artists, eq(bookingRequests.artistId, artists.id))
      .where(eq(bookingRequests.userId, user.id))
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
          artistImageUrl: null as string | null,
          quote: latestQuote
            ? {
                dates: latestQuote.dates,
                durationMin: latestQuote.durationMin,
              }
            : null,
        };
      }),
    );

    return NextResponse.json(requestsWithQuotes);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status },
      );
    }
    console.error("Get user booking requests error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
