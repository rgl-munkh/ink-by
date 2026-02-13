import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { artists } from "@/db/schema";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Өдрийн мэнд!";
  if (hour < 18) return "Өдрийн мэнд!";
  return "Оройн мэнд!";
}

interface ArtistProfileLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ArtistProfileLayout({
  children,
  params,
}: ArtistProfileLayoutProps) {
  const { id } = await params;
  const artistId = Number.parseInt(id, 10);
  if (Number.isNaN(artistId)) notFound();

  const [artist] = await db
    .select()
    .from(artists)
    .where(eq(artists.id, artistId));
  if (!artist) notFound();

  return (
    <div className="min-h-screen max-w-lg mx-auto pb-12">
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="text-2xl font-bold">
          {getGreeting()} <span className="inline-block">👋</span>
        </h1>
        <Link
          href={`/artist/${artistId}`}
          className="text-primary text-sm underline"
        >
          Back to profile
        </Link>
      </div>

      <nav className="flex gap-2 px-4 mb-4">
        <Link
          href={`/artist/${artistId}/profile`}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Requests
        </Link>
        <Link
          href={`/artist/${artistId}/profile/portfolio`}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Portfolio
        </Link>
        <Link
          href={`/artist/${artistId}/profile/timetable`}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Timetable
        </Link>
      </nav>

      {children}
    </div>
  );
}
