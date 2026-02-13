import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArtistTimetable } from "@/components/artist/ArtistTimetable";
import { db } from "@/db";
import { artists } from "@/db/schema";

interface ArtistProfileTimetablePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistProfileTimetablePage({
  params,
}: ArtistProfileTimetablePageProps) {
  const { id } = await params;
  const artistId = Number.parseInt(id, 10);
  if (Number.isNaN(artistId)) notFound();

  const [artist] = await db
    .select()
    .from(artists)
    .where(eq(artists.id, artistId));
  if (!artist) notFound();

  return (
    <div className="px-4">
      <ArtistTimetable artistId={artistId} />
    </div>
  );
}
