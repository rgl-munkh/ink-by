import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArtistRequestsList } from "@/components/artist/ArtistRequestsList";
import { db } from "@/db";
import { artists } from "@/db/schema";

interface ArtistProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistProfilePage({
  params,
}: ArtistProfilePageProps) {
  const { id } = await params;
  const artistId = Number.parseInt(id, 10);
  if (Number.isNaN(artistId)) notFound();

  const [artist] = await db
    .select()
    .from(artists)
    .where(eq(artists.id, artistId));
  if (!artist) notFound();

  return (
    <div className="px-0">
      <ArtistRequestsList artistId={artistId} />
    </div>
  );
}
