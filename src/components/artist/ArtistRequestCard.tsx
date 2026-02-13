import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ARTIST_STATUS_LABELS,
  SIZE_LABELS,
} from "@/lib/booking-labels";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatAppointment(
  dates: { start: string; end: string }[] | null,
  durationMin: number | null,
): string | null {
  if (!dates?.[0] || !durationMin) return null;
  const start = new Date(dates[0].start);
  const month = start.getMonth() + 1;
  const day = start.getDate();
  const hours = start.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${month}.${day} - ${hour12}${ampm} : ${durationMin}min`;
}

function getShortId(id: number): string {
  return id.toString(36).padStart(8, "0").slice(-8);
}

export interface ArtistRequestCardProps {
  id: number;
  artistId: number;
  userName: string;
  status: string;
  placement: string | null;
  description: string | null;
  size: string | null;
  referenceImageUrls: string[] | null;
  referenceImageUrl: string | null;
  quote: { dates: { start: string; end: string }[]; durationMin: number } | null;
}

export function ArtistRequestCard({
  id,
  artistId,
  userName,
  status,
  placement,
  description,
  size,
  referenceImageUrls,
  referenceImageUrl,
  quote,
}: ArtistRequestCardProps) {
  const images = referenceImageUrls?.length
    ? referenceImageUrls
    : referenceImageUrl
      ? [referenceImageUrl]
      : [];
  const displayImages = images.slice(0, 2);
  const appointmentStr = quote
    ? formatAppointment(quote.dates, quote.durationMin)
    : null;

  const statusLabel = ARTIST_STATUS_LABELS[status] ?? status;
  const shortId = getShortId(id);

  return (
    <div className="mx-4 mb-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
            {getInitials(userName)}
          </div>
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">User id: {shortId}</p>
          </div>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-amber-500" />
          {statusLabel}
        </span>
      </div>

      <p className="font-medium text-sm mb-2">{placement ?? "—"}</p>

      {appointmentStr && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>{appointmentStr}</span>
          <span className="text-xs">id: {shortId}</span>
        </div>
      )}

      <div className="flex gap-3 mb-3">
        {displayImages.map((url, i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden bg-muted w-20 h-20 shrink-0"
          >
            {/* biome-ignore lint/performance/noImgElement: external user-uploaded URL */}
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="flex-1 rounded-lg bg-muted flex items-center justify-center min-w-[80px] min-h-[80px]">
          <span className="text-2xl">🦵</span>
        </div>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {description}
        </p>
      )}

      {size && (
        <p className="text-sm mb-4">
          <span className="mr-1">💳</span>
          {SIZE_LABELS[size] ?? size}
        </p>
      )}

      <Button className="w-full rounded-xl" asChild>
        <Link href={`/artist/${artistId}/profile/${id}`}>
          Дэлгэрэнгүй харах
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
