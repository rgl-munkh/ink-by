import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlacementPreview } from "@/components/profile/PlacementPreview";
import { STATUS_LABELS, SIZE_LABELS } from "@/lib/booking-labels";

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

export interface RequestCardProps {
  id: number;
  artistName: string;
  artistInstagram: string | null;
  artistImageUrl?: string | null;
  status: string;
  placement: string | null;
  description: string | null;
  size: string | null;
  referenceImageUrls: string[] | null;
  referenceImageUrl: string | null;
  quote: { dates: { start: string; end: string }[]; durationMin: number } | null;
}

export function RequestCard({
  id,
  artistName,
  artistInstagram,
  artistImageUrl,
  status,
  placement,
  description,
  size,
  referenceImageUrls,
  referenceImageUrl,
  quote,
}: RequestCardProps) {
  const images = referenceImageUrls?.length
    ? referenceImageUrls
    : referenceImageUrl
      ? [referenceImageUrl]
      : [];
  const displayImages = images.slice(0, 2);
  const appointmentStr = quote
    ? formatAppointment(quote.dates, quote.durationMin)
    : null;

  const statusLabel = STATUS_LABELS[status] ?? status;

  return (
    <div className="mx-4 mb-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground overflow-hidden shrink-0">
            {artistImageUrl ? (
              // biome-ignore lint/performance/noImgElement: external artist profile URL
              <img
                src={artistImageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              getInitials(artistName)
            )}
          </div>
          <div>
            <p className="font-medium">
              {artistInstagram ? `@${artistInstagram}` : artistName}
            </p>
            <p className="text-xs text-muted-foreground">Instagram</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          {status === "pending" && (
            <span className="size-1.5 rounded-full bg-current" aria-hidden />
          )}
          {statusLabel}
        </span>
      </div>

      <p className="font-bold text-sm mb-2">{placement ?? "—"}</p>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        {appointmentStr ? (
          <>
            <span>{appointmentStr}</span>
            <span className="text-xs">id: {getShortId(id)}</span>
          </>
        ) : (
          <span className="text-xs">id: {getShortId(id)}</span>
        )}
      </div>

      <div className="flex gap-3 mb-3">
        {displayImages.map((url, i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden bg-muted w-20 h-20 shrink-0"
          >
            {/* biome-ignore lint/performance/noImgElement: external portfolio URL */}
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="flex-1 rounded-lg bg-muted flex items-center justify-center w-20 h-20 min-w-[80px] min-h-[80px] shrink-0 text-muted-foreground">
          <PlacementPreview placement={placement} className="w-12 h-[72px]" />
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
        <Link href={`/booking-request/${id}`}>
          Дэлгэрэнгүй харах
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
