"use client";

import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { BACK_LABEL, SIZE_LABELS, STATUS_LABELS } from "@/lib/booking-labels";
import { QuoteListForUser } from "@/components/quote/QuoteListForUser";

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
  if (!dates?.[0]) return null;
  const start = new Date(dates[0].start);
  const month = start.getMonth() + 1;
  const day = start.getDate();
  const hours = start.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  if (durationMin) {
    return `${month}.${day} - ${hour12}${ampm} : ${durationMin}min`;
  }
  return `${month}.${day} - ${hour12}${ampm} : —`;
}

function getShortId(id: number): string {
  return id.toString(36).padStart(8, "0").slice(-8);
}

export interface UserBookingRequestContentProps {
  requestId: number;
  artistId: number;
  artistName: string;
  artistInstagram: string | null;
  status: string;
  placement: string | null;
  description: string | null;
  size: string | null;
  referenceImageUrls: string[] | null;
  referenceImageUrl: string | null;
  preferredDates: { start: string; end: string }[] | null;
  quote: { dates: { start: string; end: string }[]; durationMin: number } | null;
}

export function UserBookingRequestContent({
  requestId,
  artistId,
  artistName,
  artistInstagram,
  status,
  placement,
  description,
  size,
  referenceImageUrls,
  referenceImageUrl,
  preferredDates,
  quote,
}: UserBookingRequestContentProps) {
  const shortId = getShortId(requestId);
  const statusLabel = STATUS_LABELS[status] ?? status;

  const images = referenceImageUrls?.length
    ? referenceImageUrls
    : referenceImageUrl
      ? [referenceImageUrl]
      : [];
  const displayImages = images.slice(0, 2);

  const appointmentStr = quote
    ? formatAppointment(quote.dates, quote.durationMin)
    : preferredDates
      ? formatAppointment(preferredDates, null)
      : null;

  const instagramUrl = artistInstagram
    ? `https://instagram.com/${artistInstagram}`
    : null;

  return (
    <div className="min-h-screen max-w-lg mx-auto pb-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
          {BACK_LABEL}
        </Link>
        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-amber-500" />
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
          {getInitials(artistName)}
        </div>
        <div className="flex-1">
          <p className="font-medium">
            {artistInstagram ? `@${artistInstagram}` : artistName}
          </p>
          <p className="text-xs text-muted-foreground">Instagram</p>
        </div>
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>

      <p className="font-bold text-lg mb-2">{placement ?? "—"}</p>

      {appointmentStr && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{appointmentStr}</span>
          <span className="text-xs">id: {shortId}</span>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        {displayImages.map((url, i) => (
          <div
            key={i}
            className="rounded-lg overflow-hidden bg-muted w-20 h-20 shrink-0"
          >
            {/* biome-ignore lint/performance/noImgElement: external user-uploaded URL */}
            <img src={url} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="flex-1 rounded-lg bg-muted flex items-center justify-center min-w-[80px] min-h-[80px]">
          <span className="text-2xl">🦵</span>
        </div>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}

      {size && (
        <p className="text-sm mb-6">
          <span className="mr-1">💳</span>
          {SIZE_LABELS[size] ?? size}
        </p>
      )}

      <QuoteListForUser bookingRequestId={requestId} />
    </div>
  );
}
