import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { RequestDetailContent } from "@/components/artist/RequestDetailContent";
import { db } from "@/db";
import { bookingRequests, quotes, users } from "@/db/schema";
import { requireAdminOrArtist } from "@/lib/auth";

interface ArtistRequestDetailPageProps {
  params: Promise<{ id: string; requestId: string }>;
}

export default async function ArtistRequestDetailPage({
  params,
}: ArtistRequestDetailPageProps) {
  const { id, requestId } = await params;
  const artistId = Number.parseInt(id, 10);
  const requestIdNum = Number.parseInt(requestId, 10);
  if (Number.isNaN(artistId) || Number.isNaN(requestIdNum)) notFound();

  await requireAdminOrArtist(artistId);

  const [request] = await db
    .select()
    .from(bookingRequests)
    .where(eq(bookingRequests.id, requestIdNum));

  if (!request) notFound();
  if (request.artistId !== artistId) notFound();

  const [requester] = request.userId
    ? await db
        .select({
          name: users.name,
          phone: users.phone,
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, request.userId))
    : [null];

  const [latestQuote] = await db
    .select()
    .from(quotes)
    .where(eq(quotes.bookingRequestId, requestIdNum))
    .orderBy(desc(quotes.createdAt))
    .limit(1);

  const userName = requester?.name ?? "New user";
  const userPhone = requester?.phone ?? null;
  const userEmail = requester?.email ?? null;

  const quote = latestQuote
    ? {
        dates: latestQuote.dates,
        durationMin: latestQuote.durationMin,
      }
    : null;

  return (
    <RequestDetailContent
      artistId={artistId}
      requestId={request.id}
      status={request.status}
      userName={userName}
      userPhone={userPhone}
      userEmail={userEmail}
      placement={request.placement}
      description={request.description}
      size={request.size}
      referenceImageUrls={request.referenceImageUrls}
      referenceImageUrl={request.referenceImageUrl}
      preferredDates={request.preferredDates}
      quote={quote}
    />
  );
}
