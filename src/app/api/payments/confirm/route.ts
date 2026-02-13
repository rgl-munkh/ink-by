import { and, eq, gt, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { availability, bookings, payments, quotes } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const providerPaymentId = body.providerPaymentId ?? body.payment_id;

    if (!providerPaymentId) {
      return NextResponse.json(
        { error: "providerPaymentId required" },
        { status: 400 },
      );
    }

    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.providerPaymentId, providerPaymentId));

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "succeeded") {
      return NextResponse.json({ ok: true, already: true });
    }

    await db.transaction(async (tx) => {
      await tx
        .update(payments)
        .set({ status: "succeeded" })
        .where(eq(payments.id, payment.id));

      const [booking] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, payment.bookingId));

      if (booking) {
        await tx
          .update(bookings)
          .set({
            paymentStatus: "succeeded",
            status: "scheduled",
          })
          .where(eq(bookings.id, booking.id));

        if (booking.scheduledStart && booking.scheduledEnd) {
          const [quote] = await tx
            .select({ artistId: quotes.artistId })
            .from(quotes)
            .where(eq(quotes.id, booking.quoteId));

          if (quote) {
            await tx
              .update(availability)
              .set({ isBooked: true })
              .where(
                and(
                  eq(availability.artistId, quote.artistId),
                  lt(availability.start, booking.scheduledEnd),
                  gt(availability.end, booking.scheduledStart),
                ),
              );
          }
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Confirm payment error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
