"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SEND_QUOTE_BUTTON } from "@/lib/booking-labels";
import { QuoteEditorModal } from "./QuoteEditorModal";

interface BookingRequest {
  id: number;
  status: string;
}

interface ArtistRequestDetailProps {
  bookingRequest: BookingRequest;
  artistId: number;
}

export function ArtistRequestDetail({
  bookingRequest,
  artistId,
}: ArtistRequestDetailProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const router = useRouter();

  if (bookingRequest.status !== "pending") return null;

  return (
    <div className="mt-6">
      <Button
        className="w-full rounded-xl"
        onClick={() => setShowQuoteModal(true)}
      >
        {SEND_QUOTE_BUTTON}
      </Button>

      {showQuoteModal && (
        <QuoteEditorModal
          bookingRequest={bookingRequest}
          artistId={artistId}
          onSuccess={() => {
            setShowQuoteModal(false);
            router.refresh();
          }}
          onClose={() => setShowQuoteModal(false)}
        />
      )}
    </div>
  );
}
