import Link from "next/link";
import { ExternalLink } from "lucide-react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export interface ArtistProfileProps {
  name: string;
  instagramUsername: string | null;
}

export function ArtistProfile({ name, instagramUsername }: ArtistProfileProps) {
  const handle = instagramUsername ? `@${instagramUsername}` : name;
  const instagramUrl = instagramUsername
    ? `https://instagram.com/${instagramUsername}`
    : null;

  return (
    <section className="flex flex-col items-center px-4 py-8">
      <div className="size-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground mb-3">
        {getInitials(name)}
      </div>
      <p className="text-lg font-bold mb-1">{handle}</p>
      {instagramUrl && (
        <Link
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Instagram
          <ExternalLink className="size-3.5" />
        </Link>
      )}
    </section>
  );
}
