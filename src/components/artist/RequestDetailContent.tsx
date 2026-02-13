"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ARTIST_STATUS_LABELS,
  BACK_LABEL,
  EMAIL_LABEL,
  PHONE_LABEL,
  SEND_QUOTE_BUTTON,
  SIZE_LABELS,
} from "@/lib/booking-labels";
import { QuoteSendFlow } from "./QuoteSendFlow";

function getShortId(id: number): string {
  return id.toString(36).padStart(8, "0").slice(-8);
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

export interface RequestDetailContentProps {
  artistId: number;
  requestId: number;
  status: string;
  userName: string;
  userPhone: string | null;
  userEmail: string | null;
  placement: string | null;
  description: string | null;
  size: string | null;
  referenceImageUrls: string[] | null;
  referenceImageUrl: string | null;
  preferredDates: { start: string; end: string }[] | null;
  quote: { dates: { start: string; end: string }[]; durationMin: number } | null;
}

export function RequestDetailContent({
  artistId,
  requestId,
  status,
  userName,
  userPhone,
  userEmail,
  placement,
  description,
  size,
  referenceImageUrls,
  referenceImageUrl,
  preferredDates,
  quote,
}: RequestDetailContentProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const router = useRouter();

  const shortId = getShortId(requestId);
  const statusLabel = ARTIST_STATUS_LABELS[status] ?? status;

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

  return (
    <div className="min-h-screen max-w-lg mx-auto pb-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/artist/${artistId}/profile`}
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
        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xl">
          😢
        </div>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-muted-foreground">User id: {shortId}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/50 p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{PHONE_LABEL}</p>
            <p className="font-medium">{userPhone ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{EMAIL_LABEL}</p>
            <p className="font-medium truncate">{userEmail ?? "—"}</p>
          </div>
        </div>
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
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}

      {size && (
        <p className="text-sm mb-6">
          <span className="mr-1">💳</span>
          {SIZE_LABELS[size] ?? size}
        </p>
      )}

      {status === "pending" && (
        <>
          <Button
            className="w-full rounded-xl"
            onClick={() => setShowQuoteModal(true)}
          >
            {SEND_QUOTE_BUTTON}
          </Button>

          {showQuoteModal && (
            <QuoteSendFlow
              bookingRequestId={requestId}
              artistId={artistId}
              userName={userName}
              shortId={shortId}
              preferredDates={preferredDates}
              placement={placement}
              description={description}
              size={size}
              referenceImageUrls={referenceImageUrls}
              referenceImageUrl={referenceImageUrl}
              onSuccess={() => {
                setShowQuoteModal(false);
                router.refresh();
              }}
              onClose={() => setShowQuoteModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
