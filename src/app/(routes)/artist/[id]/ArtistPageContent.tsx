"use client";

import { useState } from "react";
import { ArtistHeader } from "@/components/artist/ArtistHeader";
import { ArtistProfile } from "@/components/artist/ArtistProfile";
import { FeaturedArtwork } from "@/components/artist/FeaturedArtwork";
import { PortfolioGallery } from "@/components/artist/PortfolioGallery";
import { BookingRequestStepper } from "@/components/booking/BookingRequestStepper";

export interface ArtistPageContentProps {
  artistId: number;
  artistName: string;
  instagramUsername: string | null;
  featuredImageUrl?: string;
  galleryItems: { id: number; imageUrl: string; createdAt: Date }[];
}

export function ArtistPageContent({
  artistId,
  artistName,
  instagramUsername,
  featuredImageUrl,
  galleryItems,
}: ArtistPageContentProps) {
  const [showBooking, setShowBooking] = useState(false);

  if (showBooking) {
    return (
      <div className="min-h-screen max-w-lg mx-auto pb-12">
        <BookingRequestStepper
          artistId={artistId}
          artistName={artistName}
          onExit={() => setShowBooking(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-lg mx-auto pb-12">
      <ArtistHeader onSelect={() => setShowBooking(true)} />
      <ArtistProfile name={artistName} instagramUsername={instagramUsername} />
      {featuredImageUrl && (
        <FeaturedArtwork
          imageUrl={featuredImageUrl}
          artistName={artistName}
          instagramUsername={instagramUsername}
          onSelect={() => setShowBooking(true)}
        />
      )}
      <PortfolioGallery items={galleryItems} />
    </div>
  );
}
