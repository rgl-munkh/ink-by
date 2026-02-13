"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QUOTE_LABELS } from "@/lib/booking-labels";

interface Quote {
  id: number;
  dates: { start: string; end: string }[];
  durationMin: number;
  notes: string | null;
  price: string;
  expiresAt: string | null;
  status: string;
}

interface QuoteListForUserProps {
  bookingRequestId: number;
  onAcceptQuote?: (quoteId: number, bookingId: number) => void;
}

export function QuoteListForUser({
  bookingRequestId,
  onAcceptQuote,
}: QuoteListForUserProps) {
  const [data, setData] = useState<{ quotes: Quote[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/booking-requests/${bookingRequestId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [bookingRequestId]);

  if (loading) return <p className="text-muted-foreground text-sm">Ачааллаж байна...</p>;
  if (!data?.quotes?.length)
    return <p className="text-muted-foreground text-sm">{QUOTE_LABELS.noQuotes}</p>;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Үнийн санал</h3>
      {data.quotes.map((quote) => {
        const isExpired =
          quote.expiresAt && new Date(quote.expiresAt) < new Date();
        const canAccept = quote.status === "sent" && !isExpired;

        return (
          <div
            key={quote.id}
            className="rounded-xl border bg-card p-4 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">#{quote.id}</span>
              <Badge
                variant={quote.status === "sent" ? "default" : "secondary"}
              >
                {quote.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">{QUOTE_LABELS.price}: </span>
                ₮ {quote.price}
              </p>
              <p>
                <span className="text-muted-foreground">{QUOTE_LABELS.duration}: </span>
                {quote.durationMin} min
              </p>
              {quote.dates?.[0] && (
                <p>
                  <span className="text-muted-foreground">{QUOTE_LABELS.date}: </span>
                  {new Date(quote.dates[0].start).toLocaleString()}
                </p>
              )}
              {quote.notes && (
                <p className="text-muted-foreground">{quote.notes}</p>
              )}
              {quote.expiresAt && (
                <p className="text-xs text-muted-foreground">
                  {isExpired ? (
                    <span className="text-destructive">{QUOTE_LABELS.expired}</span>
                  ) : (
                    <>
                      {QUOTE_LABELS.expires}: {new Date(quote.expiresAt).toLocaleString()}
                    </>
                  )}
                </p>
              )}
            </div>
            {canAccept && (
              <Button
                className="w-full rounded-xl"
                size="sm"
                disabled={acceptingId !== null}
                onClick={async () => {
                  setAcceptingId(quote.id);
                  try {
                    const res = await fetch("/api/bookings", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ quoteId: quote.id }),
                    });
                    if (res.ok) {
                      const { id } = await res.json();
                      onAcceptQuote?.(quote.id, id);
                      window.location.href = `/booking/${id}/pay`;
                    } else {
                      const err = await res.json().catch(() => ({}));
                      alert(err.error ?? "Failed to accept quote");
                    }
                  } finally {
                    setAcceptingId(null);
                  }
                }}
              >
                {acceptingId === quote.id ? "Зөвшөөрч байна..." : QUOTE_LABELS.accept}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
