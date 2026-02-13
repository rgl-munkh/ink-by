import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PaymentSheet } from "@/components/payment/PaymentSheet";
import { db } from "@/db";
import { bookings } from "@/db/schema";

interface PayPageProps {
  params: Promise<{ id: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { id } = await params;
  const bookingId = Number.parseInt(id, 10);
  if (Number.isNaN(bookingId)) notFound();

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId));

  if (!booking) notFound();

  if (booking.paymentStatus === "succeeded") {
    return (
      <div className="container mx-auto max-w-md py-12 space-y-4">
        <h1 className="text-xl font-bold">Already Paid</h1>
        <p className="text-muted-foreground">
          This booking has already been paid. Your appointment is scheduled.
        </p>
        <Link href="/" className="text-primary underline">
          Back to home
        </Link>
      </div>
    );
  }

  const amount = Number.parseFloat(String(booking.bookingFee ?? 0));

  return (
    <div className="container mx-auto max-w-md py-12 space-y-6">
      <Link href="/" className="text-primary text-sm underline">
        Back
      </Link>
      <h1 className="text-2xl font-bold">Complete Payment</h1>
      <PaymentSheet bookingId={bookingId} amount={amount} />
    </div>
  );
}
