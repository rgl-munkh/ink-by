"use client";

import { addMinutes, format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AvailabilitySlot {
  id: number;
  start: string;
  end: string;
  isBooked: boolean;
}

interface ArtistTimetableProps {
  artistId: number;
}

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hr" },
  { value: 90, label: "1.5 hr" },
  { value: 120, label: "2 hr" },
];

function formatTimeRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  return `${format(s, "h:mm a")} - ${format(e, "h:mm a")}`;
}

function groupSlotsByDate(slots: AvailabilitySlot[]): [string, AvailabilitySlot[]][] {
  const groups: Record<string, AvailabilitySlot[]> = {};
  for (const slot of slots) {
    const key = format(new Date(slot.start), "yyyy-MM-dd");
    if (!groups[key]) groups[key] = [];
    groups[key].push(slot);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export function ArtistTimetable({ artistId }: ArtistTimetableProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState("");
  const [durationMin, setDurationMin] = useState("60");

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/artist/${artistId}/availability`);
      if (res.ok) {
        const data = await res.json();
        setSlots(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleAdd = async () => {
    if (!date || !startTime || !durationMin) return;
    const duration = Number.parseInt(durationMin, 10);
    if (Number.isNaN(duration)) return;

    const start = new Date(`${date}T${startTime}:00`);
    const end = addMinutes(start, duration);

    if (start >= end) {
      alert("End time must be after start time");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch(`/api/artist/${artistId}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slots: [
            {
              start: start.toISOString(),
              end: end.toISOString(),
            },
          ],
        }),
      });
      if (res.ok) {
        setStartTime("");
        setDurationMin("60");
        setShowAddForm(false);
        fetchSlots();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to add slot");
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  const grouped = groupSlotsByDate(slots);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-3">Availability</h2>

        <Button
          variant={showAddForm ? "secondary" : "default"}
          className="mb-4"
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? "Cancel" : "+ Add slot"}
        </Button>

        {showAddForm && (
          <div className="rounded-xl border bg-muted/30 p-4 space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slot-date">Date</Label>
                <Input
                  id="slot-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slot-time">Start time</Label>
                <Input
                  id="slot-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1">
                <Label htmlFor="slot-duration">Duration</Label>
                <Select
                  value={durationMin}
                  onValueChange={setDurationMin}
                >
                  <SelectTrigger id="slot-duration" className="mt-1 w-full">
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
              <Button onClick={handleAdd} disabled={adding}>
                {adding ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {slots.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No availability slots. Add one above.
        </p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([dateKey, daySlots]) => {
            const dateObj = new Date(dateKey + "T12:00:00");
            return (
              <div key={dateKey}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {format(dateObj, "EEE, MMM d")}
                </h3>
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border px-4 py-3",
                        slot.isBooked ? "bg-muted/50" : "bg-background",
                      )}
                    >
                      <span className="text-sm font-medium">
                        {formatTimeRange(slot.start, slot.end)}
                      </span>
                      <Badge variant={slot.isBooked ? "secondary" : "outline"}>
                        {slot.isBooked ? "Booked" : "Available"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
