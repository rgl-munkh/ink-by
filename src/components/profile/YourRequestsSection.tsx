"use client";

import { useEffect, useState } from "react";
import { RequestCard } from "./RequestCard";

interface RequestWithQuote {
  id: number;
  artistName: string;
  artistInstagram: string | null;
  artistImageUrl?: string | null;
  status: string;
  placement: string | null;
  description: string | null;
  size: string | null;
  referenceImageUrl: string | null;
  referenceImageUrls: string[] | null;
  quote: {
    dates: { start: string; end: string }[];
    durationMin: number;
  } | null;
}

export function YourRequestsSection() {
  const [requests, setRequests] = useState<RequestWithQuote[] | null>(null);

  useEffect(() => {
    fetch("/api/me/booking-requests")
      .then((res) => (res.ok ? res.json() : []))
      .then(setRequests)
      .catch(() => setRequests([]));
  }, []);

  return (
    <section className="mb-8">
      <h2 className="px-4 mb-4 font-semibold">Таны хүсэлт</h2>
      {requests === null ? (
        <p className="px-4 text-muted-foreground text-sm">Ачааллаж байна...</p>
      ) : requests.length === 0 ? (
        <p className="px-4 text-muted-foreground text-sm">
          Хүсэлт байхгүй байна.
        </p>
      ) : (
        requests.map((req) => (
          <RequestCard
            key={req.id}
            id={req.id}
            artistName={req.artistName}
            artistInstagram={req.artistInstagram}
            artistImageUrl={req.artistImageUrl}
            status={req.status}
            placement={req.placement}
            description={req.description}
            size={req.size}
            referenceImageUrls={req.referenceImageUrls}
            referenceImageUrl={req.referenceImageUrl}
            quote={req.quote}
          />
        ))
      )}
    </section>
  );
}
