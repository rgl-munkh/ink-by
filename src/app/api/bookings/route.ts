import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingRequests, bookings, quotes } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { AuthError } from "@/lib/auth";
import { createBookingSchema } from "@/lib/validations/booking";

const BOOKING_FEE_PERCENT = 0.25;

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { quoteId, chosenDateIndex = 0 } = parsed.data;

    const [quote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId));

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const [br] = await db
      .select({ userId: bookingRequests.userId })
      .from(bookingRequests)
      .where(eq(bookingRequests.id, quote.bookingRequestId));
    if (!br || br.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (quote.status !== "sent") {
      return NextResponse.json(
        { error: "Quote is not available for acceptance" },
        { status: 400 },
      );
    }

    if (quote.expiresAt && new Date(quote.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Quote has expired" }, { status: 400 });
    }

    const priceNum = Number.parseFloat(String(quote.price));
    const bookingFeeAmount = priceNum * BOOKING_FEE_PERCENT;
    const chosenDate = quote.dates?.[chosenDateIndex];
    if (!chosenDate) {
      return NextResponse.json(
        { error: "Invalid date selection" },
        { status: 400 },
      );
    }

    const scheduledStart = new Date(chosenDate.start);
    const scheduledEnd = new Date(chosenDate.end);

    const [created] = await db.transaction(async (tx) => {
      const [booking] = await tx
        .insert(bookings)
        .values({
          bookingRequestId: quote.bookingRequestId,
          quoteId,
          scheduledStart,
          scheduledEnd,
          durationMin: quote.durationMin,
          price: quote.price,
          bookingFee: String(bookingFeeAmount),
          paymentStatus: "initiated",
          status: "created",
        })
        .returning();

      await tx
        .update(quotes)
        .set({ status: "accepted" })
        .where(eq(quotes.id, quoteId));

      await tx
        .update(bookingRequests)
        .set({ status: "accepted" })
        .where(eq(bookingRequests.id, quote.bookingRequestId));

      return [booking];
    });

    return NextResponse.json(
      {
        id: created?.id,
        bookingFeeAmount,
        scheduledStart: created?.scheduledStart,
        scheduledEnd: created?.scheduledEnd,
      },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Create booking error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
