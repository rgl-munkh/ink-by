"use client";

import Link from "next/link";
import { ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export interface FeaturedArtworkProps {
  imageUrl: string;
  artistName: string;
  instagramUsername: string | null;
  onSelect?: () => void;
}

export function FeaturedArtwork({
  imageUrl,
  artistName,
  instagramUsername,
  onSelect,
}: FeaturedArtworkProps) {
  const handle = instagramUsername ? `@${instagramUsername}` : artistName;
  const instagramUrl = instagramUsername
    ? `https://instagram.com/${instagramUsername}`
    : null;

  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    } else {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 pb-8">
      <div className="rounded-xl overflow-hidden bg-muted">
        {/* biome-ignore lint/performance/noImgElement: external portfolio URL */}
        <img
          src={imageUrl}
          alt={artistName}
          className="w-full aspect-[3/4] object-cover"
        />
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
            {getInitials(artistName)}
          </div>
          <span className="font-medium truncate">{handle}</span>
          {instagramUrl && (
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0"
            >
              Instagram
              <ExternalLink className="size-3" />
            </Link>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl shrink-0"
          onClick={handleSelect}
        >
          Үргэлжлүүлэх
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
