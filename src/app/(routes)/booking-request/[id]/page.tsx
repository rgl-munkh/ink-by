import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { UserBookingRequestContent } from "@/components/profile/UserBookingRequestContent";
import { db } from "@/db";
import { artists, bookingRequests, quotes } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

interface BookingRequestPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingRequestPage({
  params,
}: BookingRequestPageProps) {
  const { id } = await params;
  const requestId = Number.parseInt(id, 10);
  if (Number.isNaN(requestId)) notFound();

  const user = await getCurrentUser();
  if (!user) notFound();

  const [row] = await db
    .select({
      id: bookingRequests.id,
      userId: bookingRequests.userId,
      artistId: bookingRequests.artistId,
      description: bookingRequests.description,
      size: bookingRequests.size,
      placement: bookingRequests.placement,
      referenceImageUrl: bookingRequests.referenceImageUrl,
      referenceImageUrls: bookingRequests.referenceImageUrls,
      preferredDates: bookingRequests.preferredDates,
      status: bookingRequests.status,
      artistName: artists.name,
      artistInstagram: artists.instagramUsername,
    })
    .from(bookingRequests)
    .innerJoin(artists, eq(bookingRequests.artistId, artists.id))
    .where(eq(bookingRequests.id, requestId));

  if (!row) notFound();
  if (row.userId !== user.id) notFound();

  const [latestQuote] = await db
    .select()
    .from(quotes)
    .where(eq(quotes.bookingRequestId, requestId))
    .orderBy(desc(quotes.createdAt))
    .limit(1);

  const quote = latestQuote
    ? {
        dates: latestQuote.dates,
        durationMin: latestQuote.durationMin,
      }
    : null;

  return (
    <UserBookingRequestContent
      requestId={row.id}
      artistId={row.artistId}
      artistName={row.artistName}
      artistInstagram={row.artistInstagram}
      status={row.status}
      placement={row.placement}
      description={row.description}
      size={row.size}
      referenceImageUrls={row.referenceImageUrls}
      referenceImageUrl={row.referenceImageUrl}
      preferredDates={row.preferredDates}
      quote={quote}
    />
  );
}
