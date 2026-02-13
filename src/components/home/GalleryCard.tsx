import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface GalleryCardProps {
  artistId: number;
  imageUrl: string;
  artistName: string;
  instagramUsername: string | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function GalleryCard({
  artistId,
  imageUrl,
  artistName,
  instagramUsername,
}: GalleryCardProps) {
  return (
    <Link
      href={`/artist/${artistId}`}
      className="group block break-inside-avoid mb-4"
    >
      <div className="rounded-xl overflow-hidden bg-muted">
        {/* biome-ignore lint/performance/noImgElement: external portfolio URL */}
        <img
          src={imageUrl}
          alt={artistName}
          className="w-full aspect-[3/4] object-cover"
        />
      </div>
      <div className="flex items-center gap-2 mt-2 px-1">
        <div className="flex items-center justify-center size-8 rounded-full bg-muted text-muted-foreground text-xs font-medium shrink-0">
          {getInitials(artistName)}
        </div>
        <span className="text-sm text-muted-foreground truncate flex-1">
          {instagramUsername ? `@${instagramUsername}` : artistName}
        </span>
        <ChevronRight className="size-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}
