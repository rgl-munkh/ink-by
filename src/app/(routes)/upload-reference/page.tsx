import Link from "next/link";
import { db } from "@/db";
import { artists } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function UploadReferencePage() {
  let artistList: { id: number; name: string; bio: string | null }[] = [];
  try {
    artistList = await db.select().from(artists);
  } catch {
    // DB not configured or migrations not run
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <h1 className="text-xl font-bold mb-2">Зураг оруулах</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Шивээ хийлгэх артистаа сонгоод лавлагаа зургаа оруулна уу.
      </p>
      <div className="space-y-4">
        {artistList.length > 0 ? (
          artistList.map((artist) => (
            <Card key={artist.id}>
              <CardContent className="pt-6">
                <h2 className="font-semibold">{artist.name}</h2>
                <p className="text-muted-foreground text-sm truncate mt-1">
                  {artist.bio ?? "Tattoo artist"}
                </p>
                <Button asChild className="mt-4 w-full">
                  <Link href={`/artist/${artist.id}`}>Артист сонгох</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Артист байхгүй байна.
          </p>
        )}
      </div>
    </div>
  );
}
