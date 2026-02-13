"use client";

import { addDays, format, parseISO } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  DAY_ABBREV,
  DURATION_LABEL,
  NEXT_LABEL,
  NOTES_LABEL,
  PRICE_LABEL,
  QUOTE_STEP_TITLE,
  SAVE_LABEL,
  SIZE_LABELS,
  SUGGESTED_TIME_LABEL,
} from "@/lib/booking-labels";
import { cn } from "@/lib/utils";

interface AvailabilitySlot {
  id: number;
  start: string;
  end: string;
  isBooked: boolean;
}

interface QuoteSendFlowProps {
  bookingRequestId: number;
  artistId: number;
  userName: string;
  shortId: string;
  preferredDates: { start: string; end: string }[] | null;
  placement: string | null;
  description: string | null;
  size: string | null;
  referenceImageUrls: string[] | null;
  referenceImageUrl: string | null;
  onSuccess: () => void;
  onClose: () => void;
}

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hr" },
  { value: 90, label: "1.5 hr" },
  { value: 120, label: "2 hr" },
];

function formatSuggestedRange(preferredDates: { start: string; end: string }[]): string {
  if (!preferredDates.length) return "";
  const starts = preferredDates.map((d) => parseISO(d.start));
  const ends = preferredDates.map((d) => parseISO(d.end));
  const minStart = new Date(Math.min(...starts.map((d) => d.getTime())));
  const maxEnd = new Date(Math.max(...ends.map((d) => d.getTime())));
  return `${format(minStart, "yyyy.M.d")} → ${format(maxEnd, "M.d")} хооронд`;
}

function getWeekdayNames(dates: Date[]): string[] {
  const seen = new Set<number>();
  for (const d of dates) {
    seen.add(d.getDay());
  }
  return Array.from(seen)
    .sort((a, b) => (a + 6) % 7 - (b + 6) % 7)
    .map((day) => DAY_ABBREV[(day + 6) % 7]);
}

export function QuoteSendFlow({
  bookingRequestId,
  artistId,
  userName,
  shortId,
  preferredDates,
  placement,
  description,
  size,
  referenceImageUrls,
  referenceImageUrl,
  onSuccess,
  onClose,
}: QuoteSendFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [price, setPrice] = useState("100");
  const [durationMin, setDurationMin] = useState("60");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    const res = await fetch(`/api/artist/${artistId}/availability`);
    if (res.ok) {
      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
    } else {
      setSlots([]);
    }
  }, [artistId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = preferredDates?.length
    ? (() => {
        const d = parseISO(preferredDates[0].start);
        return d < today ? today : d;
      })()
    : today;

  const days: Date[] = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const defaultDayKey = days[0] ? format(days[0], "yyyy-MM-dd") : "";
  const activeDay = selectedDay || defaultDayKey;

  const slotsForDay = slots.filter((s) => {
    const slotDate = format(parseISO(s.start), "yyyy-MM-dd");
    return slotDate === activeDay;
  });

  const timeSlotMap = new Map<string, AvailabilitySlot>();
  for (let h = 9; h < 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      const timeStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      const slotDate = activeDay;
      const slotStart = new Date(`${slotDate}T${timeStr}:00`);
      const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

      const matchingSlot = slotsForDay.find((s) => {
        const start = new Date(s.start);
        const end = new Date(s.end);
        return slotStart >= start && slotEnd <= end;
      });

      if (matchingSlot && !timeSlotMap.has(timeStr)) {
        timeSlotMap.set(timeStr, matchingSlot);
      }
    }
  }
  const timeSlots = Array.from(timeSlotMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, slot]) => ({ time, slot }));

  const handleSlotSelect = (slot: AvailabilitySlot, time: string) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (selectedSlot) setStep(2);
  };

  const handleSubmit = async () => {
    if (!selectedSlot) return;
    const priceNum = Number.parseFloat(price);
    const durationNum = Number.parseInt(durationMin, 10);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      setError("Enter a valid price");
      return;
    }
    if (Number.isNaN(durationNum) || durationNum <= 0) {
      setError("Enter a valid duration");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingRequestId,
          artistId,
          dates: [{ start: selectedSlot.start, end: selectedSlot.end }],
          durationMin: durationNum,
          price: priceNum,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create quote");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const images = referenceImageUrls?.length
    ? referenceImageUrls
    : referenceImageUrl
      ? [referenceImageUrl]
      : [];
  const displayImages = images.slice(0, 2);

  const suggestedStr = preferredDates?.length
    ? formatSuggestedRange(preferredDates)
    : "";
  const weekdayNames = preferredDates?.length
    ? getWeekdayNames(preferredDates.flatMap((d) => [parseISO(d.start), parseISO(d.end)]))
    : [];

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto max-w-lg p-0 gap-0"
        showCloseButton={true}
      >
        <div className="p-4 pb-6">
          <p className="text-center text-sm text-muted-foreground mb-2">
            {step}/2
          </p>
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              {QUOTE_STEP_TITLE}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-2 mt-4 mb-4">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center text-xl">
              😢
            </div>
            <div>
              <p className="font-medium">{userName}</p>
              <p className="text-sm text-muted-foreground">User id: {shortId}</p>
            </div>
          </div>

          {step === 1 && (
            <>
              {suggestedStr && (
                <div className="rounded-xl border bg-muted/50 p-3 mb-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    {SUGGESTED_TIME_LABEL}
                  </p>
                  <p className="text-sm font-medium">{suggestedStr}</p>
                  {weekdayNames.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {weekdayNames.join(", ")}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {days.map((d) => {
                  const key = format(d, "yyyy-MM-dd");
                  const dayIndex = d.getDay();
                  const abbrev = DAY_ABBREV[(dayIndex + 6) % 7];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedDay(key);
                        setSelectedSlot(null);
                        setSelectedTime(null);
                      }}
                      className={cn(
                        "shrink-0 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors",
                        activeDay === key
                          ? "border-foreground bg-muted"
                          : "border-muted hover:border-muted-foreground/50",
                      )}
                    >
                      {abbrev}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {timeSlots.map(({ time, slot }) => {
                  const isAvailable = !slot.isBooked;
                  const isSelected =
                    selectedSlot?.id === slot.id && selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleSlotSelect(slot, time)}
                      className={cn(
                        "rounded-full border-2 py-2 text-sm font-medium transition-colors",
                        isSelected && isAvailable
                          ? "border-primary bg-primary text-primary-foreground"
                          : isAvailable
                            ? "border-muted hover:border-muted-foreground/50"
                            : "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed",
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <Button
                className="w-full"
                disabled={!selectedSlot}
                onClick={handleNext}
              >
                {NEXT_LABEL}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="rounded-xl border p-4 mb-4 space-y-2">
                <p className="font-bold text-sm">{placement ?? "—"}</p>
                {selectedSlot && (
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(selectedSlot.start), "M.d - h a")} :{" "}
                    {Math.round(
                      (new Date(selectedSlot.end).getTime() -
                        new Date(selectedSlot.start).getTime()) /
                        60000,
                    )}
                    min
                  </p>
                )}
                <p className="text-xs text-muted-foreground">id: {shortId}</p>
                <div className="flex gap-2 mt-2">
                  {displayImages.map((url, i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden bg-muted w-16 h-16 shrink-0"
                    >
                      {/* biome-ignore lint/performance/noImgElement: external URL */}
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="rounded-lg bg-muted w-16 h-16 shrink-0 flex items-center justify-center">
                    <span className="text-xl">🦵</span>
                  </div>
                </div>
                {description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {description}
                  </p>
                )}
                {size && (
                  <p className="text-sm">
                    <span className="mr-1">💳</span>
                    {SIZE_LABELS[size] ?? size}
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="quote-price">{PRICE_LABEL}</Label>
                  <Input
                    id="quote-price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="quote-duration">{DURATION_LABEL}</Label>
                  <Select value={durationMin} onValueChange={setDurationMin}>
                    <SelectTrigger id="quote-duration" className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quote-notes">{NOTES_LABEL}</Label>
                  <Textarea
                    id="quote-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1"
                    placeholder=""
                    rows={3}
                  />
                </div>
              </div>

              {error && (
                <p className="text-destructive text-sm mb-4">{error}</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : SAVE_LABEL}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
