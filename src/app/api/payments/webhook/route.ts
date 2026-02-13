import { and, eq, gt, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { availability, bookings, payments, quotes } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const providerPaymentId =
      body.data?.object?.id ?? body.payment_intent?.id ?? body.id;
    if (!providerPaymentId) {
      return NextResponse.json({ received: false }, { status: 400 });
    }

    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.providerPaymentId, providerPaymentId));

    if (!payment) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const success =
      body.type === "payment_intent.succeeded" ||
      body.data?.object?.status === "succeeded";

    if (!success) {
      return NextResponse.json({ received: true }, { status: 200 });
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

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
