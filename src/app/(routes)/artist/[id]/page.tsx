import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { artists, portfolio } from "@/db/schema";
import { ArtistPageContent } from "./ArtistPageContent";

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params;
  const artistId = Number.parseInt(id, 10);
  if (Number.isNaN(artistId)) notFound();

  const [artist, portfolioItems] = await Promise.all([
    db
      .select({ name: artists.name, instagramUsername: artists.instagramUsername })
      .from(artists)
      .where(eq(artists.id, artistId))
      .then((rows) => rows[0]),
    db
      .select()
      .from(portfolio)
      .where(eq(portfolio.artistId, artistId))
      .orderBy(desc(portfolio.createdAt)),
  ]);

  if (!artist) notFound();

  const itemsWithImages = portfolioItems.filter(
    (item): item is (typeof portfolioItems)[number] & { images: string[] } =>
      Boolean(item.images?.length)
  );

  const featuredItem = itemsWithImages[0];
  const galleryItems = itemsWithImages.slice(1).map((item) => ({
    id: item.id,
    imageUrl: item.images[0],
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  }));

  return (
    <ArtistPageContent
      artistId={artistId}
      artistName={artist.name}
      instagramUsername={artist.instagramUsername ?? null}
      featuredImageUrl={featuredItem?.images[0]}
      galleryItems={galleryItems}
    />
  );
}
