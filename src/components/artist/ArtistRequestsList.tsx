"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ArtistRequestCard } from "./ArtistRequestCard";
import { ArtistRequestOverview } from "./ArtistRequestOverview";

interface BookingRequestWithDetails {
  id: number;
  userId: number | null;
  artistId: number;
  referenceImageUrl: string | null;
  referenceImageUrls: string[] | null;
  description: string | null;
  size: string | null;
  placement: string | null;
  preferredDates: { start: string; end: string }[] | null;
  status: string;
  createdAt: string;
  userName: string;
  quote: { dates: { start: string; end: string }[]; durationMin: number } | null;
}

interface ApiResponse {
  newCount: number;
  pendingLongCount: number;
  requests: BookingRequestWithDetails[];
}

interface ArtistRequestsListProps {
  artistId: number;
}

type FilterTab = "new" | "all";

export function ArtistRequestsList({ artistId }: ArtistRequestsListProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("new");

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/artist/${artistId}/requests`);
      if (res.ok) {
        const apiData: ApiResponse = await res.json();
        setData(apiData);
      } else {
        setData({ newCount: 0, pendingLongCount: 0, requests: [] });
      }
    } catch {
      setData({ newCount: 0, pendingLongCount: 0, requests: [] });
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (loading) {
    return (
      <p className="px-4 text-muted-foreground text-sm">Ачааллаж байна...</p>
    );
  }

  if (!data) {
    return (
      <p className="px-4 text-muted-foreground text-sm">
        Өгөгдөл ачааллахад алдаа гарлаа.
      </p>
    );
  }

  const filteredRequests =
    filter === "new"
      ? data.requests.filter((r) => r.status === "pending")
      : data.requests;

  return (
    <div className="space-y-4">
      <ArtistRequestOverview
        newCount={data.newCount}
        pendingLongCount={data.pendingLongCount}
      />

      <div className="flex gap-3 px-4">
        <button
          type="button"
          onClick={() => setFilter("new")}
          className={cn(
            "flex-1 rounded-xl border-2 py-3 font-medium transition-colors",
            filter === "new"
              ? "border-foreground bg-muted"
              : "border-muted bg-background hover:border-muted-foreground/50",
          )}
        >
          Шинэ
        </button>
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn(
            "flex-1 rounded-xl border-2 py-3 font-medium transition-colors",
            filter === "all"
              ? "border-foreground bg-muted"
              : "border-muted bg-background hover:border-muted-foreground/50",
          )}
        >
          Бүгд
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="px-4 text-muted-foreground text-sm">
          {filter === "new" ? "Шинэ хүсэлт байхгүй байна." : "Хүсэлт байхгүй байна."}
        </p>
      ) : (
        <div className="pb-4">
          {filteredRequests.map((req) => (
            <ArtistRequestCard
              key={req.id}
              id={req.id}
              artistId={artistId}
              userName={req.userName}
              status={req.status}
              placement={req.placement}
              description={req.description}
              size={req.size}
              referenceImageUrls={req.referenceImageUrls}
              referenceImageUrl={req.referenceImageUrl}
              quote={req.quote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
