import { notFound } from "next/navigation";
import { ArtistPageContent } from "./ArtistPageContent";
import { getBaseUrl } from "@/lib/api";

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

interface PortfolioItem {
  id: number;
  images: string[] | null;
  createdAt: string | null;
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params;
  const artistId = Number.parseInt(id, 10);
  if (Number.isNaN(artistId)) notFound();

  const baseUrl = getBaseUrl();

  const [artistRes, portfolioRes] = await Promise.all([
    fetch(`${baseUrl}/api/artist/${artistId}`),
    fetch(`${baseUrl}/api/artist/${artistId}/portfolio`),
  ]);

  if (!artistRes.ok) {
    if (artistRes.status === 404) notFound();
    throw new Error("Failed to fetch artist");
  }

  const artist = (await artistRes.json()) as {
    name: string;
    instagramUsername: string | null;
  };

  const portfolioItems = portfolioRes.ok
    ? ((await portfolioRes.json()) as PortfolioItem[])
    : [];

  const itemsWithImages = portfolioItems.filter(
    (item): item is PortfolioItem & { images: string[] } =>
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
      instagramUsername={artist.instagramUsername}
      featuredImageUrl={featuredItem?.images[0]}
      galleryItems={galleryItems}
    />
  );
}
