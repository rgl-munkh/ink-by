"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
    <section className="px-4 w-full pb-8">
      <div className="rounded-xl overflow-hidden bg-muted">
        {/* biome-ignore lint/performance/noImgElement: external portfolio URL */}
        <img
          src={imageUrl}
          alt={artistName}
          className="w-full aspect-3/4 object-cover"
        />
      </div>
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
            {getInitials(artistName)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">{handle}</span>
            {instagramUrl ? (
              <Link
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Instagram
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground">Instagram</span>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="rounded-full shrink-0 px-6"
          onClick={handleSelect}
        >
          Үргэлжлүүлэх
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
