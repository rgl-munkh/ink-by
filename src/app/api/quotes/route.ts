import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { availability, bookingRequests, bookings, quotes } from "@/db/schema";
import { requireAdminOrArtist } from "@/lib/auth";
import { AuthError } from "@/lib/auth";
import { createQuoteSchema } from "@/lib/validations/booking";

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: Date,
  bEnd: Date,
): boolean {
  return new Date(aStart) < bEnd && new Date(aEnd) > bStart;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createQuoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      bookingRequestId,
      artistId,
      dates,
      durationMin,
      notes,
      price,
      expiresAt,
    } = parsed.data;

    await requireAdminOrArtist(artistId);

    const [br] = await db
      .select()
      .from(bookingRequests)
      .where(eq(bookingRequests.id, bookingRequestId));

    if (!br || br.status !== "pending") {
      return NextResponse.json(
        { error: "Invalid request - must be pending" },
        { status: 400 },
      );
    }

    const bookedSlots = await db
      .select()
      .from(availability)
      .where(
        and(
          eq(availability.artistId, artistId),
          eq(availability.isBooked, true),
        ),
      );

    for (const d of dates) {
      for (const slot of bookedSlots) {
        if (
          slot.start &&
          slot.end &&
          rangesOverlap(d.start, d.end, slot.start, slot.end)
        ) {
          return NextResponse.json(
            { error: "Slot unavailable - overlaps with booked availability" },
            { status: 409 },
          );
        }
      }

      const overlappingBookings = await db
        .select({ id: bookings.id })
        .from(bookings)
        .innerJoin(quotes, eq(bookings.quoteId, quotes.id))
        .where(
          and(
            eq(quotes.artistId, artistId),
            sql`${bookings.scheduledStart} < ${d.end}`,
            sql`${bookings.scheduledEnd} > ${d.start}`,
          ),
        );

      if (overlappingBookings.length > 0) {
        return NextResponse.json(
          { error: "Slot unavailable - overlaps with scheduled booking" },
          { status: 409 },
        );
      }
    }

    await db.transaction(async (tx) => {
      await tx.insert(quotes).values({
        bookingRequestId,
        artistId,
        dates,
        durationMin,
        notes: notes ?? null,
        price: String(price),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: "sent",
      });
      await tx
        .update(bookingRequests)
        .set({ status: "quoted" })
        .where(eq(bookingRequests.id, bookingRequestId));
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Create quote error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
