import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { artists, bookings, quotes } from "@/db/schema";

interface BookingPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = await params;
  const bookingId = Number.parseInt(id, 10);
  if (Number.isNaN(bookingId)) notFound();

  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId));

  if (!booking) notFound();

  const [quote] = await db
    .select()
    .from(quotes)
    .where(eq(quotes.id, booking.quoteId));

  const [artist] = quote
    ? await db.select().from(artists).where(eq(artists.id, quote.artistId))
    : [null];

  return (
    <div className="container mx-auto max-w-lg py-12 space-y-6">
      <Link href="/" className="text-primary text-sm underline">
        Back
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Booking #{booking.id}
            <Badge>{booking.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {artist && (
            <p>
              <strong>Artist:</strong> {artist.name}
            </p>
          )}
          {booking.scheduledStart && (
            <p>
              <strong>When:</strong>{" "}
              {new Date(booking.scheduledStart).toLocaleString()} -{" "}
              {booking.scheduledEnd
                ? new Date(booking.scheduledEnd).toLocaleTimeString()
                : ""}
            </p>
          )}
          <p>
            <strong>Duration:</strong> {booking.durationMin} min
          </p>
          <p>
            <strong>Total:</strong> ${booking.price}
          </p>
          <p>
            <strong>Booking fee:</strong> ${booking.bookingFee}
          </p>
          <p>
            <strong>Payment:</strong> {booking.paymentStatus}
          </p>
          {booking.paymentStatus !== "succeeded" && (
            <Link
              href={`/booking/${bookingId}/pay`}
              className="inline-block mt-4 text-primary underline"
            >
              Pay booking fee
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
