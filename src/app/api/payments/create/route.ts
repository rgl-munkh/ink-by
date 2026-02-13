import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookingRequests, bookings, payments } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { AuthError } from "@/lib/auth";
import { createPaymentSchema } from "@/lib/validations/booking";

export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const parsed = createPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { bookingId } = parsed.data;

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const [br] = await db
      .select({ userId: bookingRequests.userId })
      .from(bookingRequests)
      .where(eq(bookingRequests.id, booking.bookingRequestId));
    if (!br || br.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (booking.paymentStatus === "succeeded") {
      return NextResponse.json(
        { error: "Booking already paid" },
        { status: 400 },
      );
    }

    const bookingFee = Number.parseFloat(String(booking.bookingFee ?? 0));
    const providerPaymentId = `pay_${crypto.randomUUID()}`;

    const [payment] = await db
      .insert(payments)
      .values({
        bookingId,
        provider: "placeholder",
        providerPaymentId,
        amount: String(bookingFee),
        currency: "USD",
        status: "initiated",
      })
      .returning();

    return NextResponse.json({
      paymentId: payment?.id,
      providerPaymentId,
      amount: bookingFee,
      currency: "USD",
      checkoutUrl: `/booking/${bookingId}/pay/complete?payment_id=${providerPaymentId}`,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Create payment error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
