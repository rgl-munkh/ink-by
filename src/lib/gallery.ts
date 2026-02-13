import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { artists, portfolio } from "@/db/schema";

export type GalleryItem = {
  portfolioId: number;
  imageUrl: string;
  artistId: number;
  artistName: string;
  instagramUsername: string | null;
};

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const portfolioItems = await db
      .select({
        portfolioId: portfolio.id,
        images: portfolio.images,
        artistId: artists.id,
        artistName: artists.name,
        instagramUsername: artists.instagramUsername,
      })
      .from(portfolio)
      .innerJoin(artists, eq(portfolio.artistId, artists.id))
      .orderBy(desc(portfolio.createdAt));

    return portfolioItems
      .filter(
        (item): item is typeof item & { images: string[] } =>
          Boolean(item.images?.length),
      )
      .map((item) => ({
        portfolioId: item.portfolioId,
        imageUrl: item.images[0],
        artistId: item.artistId,
        artistName: item.artistName,
        instagramUsername: item.instagramUsername,
      }));
  } catch {
    return [];
  }
}
