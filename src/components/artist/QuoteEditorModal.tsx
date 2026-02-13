"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  durationMin: z.coerce.number().int().positive(),
  price: z.coerce.number().positive(),
  notes: z.string().optional(),
  expiresAt: z.string().optional(),
  slotIndex: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AvailabilitySlot {
  id: number;
  start: string;
  end: string;
  isBooked: boolean;
}

interface BookingRequest {
  id: number;
  status: string;
}

interface QuoteEditorModalProps {
  bookingRequest: BookingRequest;
  artistId: number;
  onSuccess: () => void;
  onClose: () => void;
}

export function QuoteEditorModal({
  bookingRequest,
  artistId,
  onSuccess,
  onClose,
}: QuoteEditorModalProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: {
      durationMin: 90,
      price: 100,
      notes: "",
      expiresAt: "",
      slotIndex: "",
    },
  });

  useEffect(() => {
    fetch(`/api/artist/${artistId}/availability`)
      .then((res) => res.json())
      .then((data) => {
        const available = Array.isArray(data)
          ? data.filter((s: AvailabilitySlot) => !s.isBooked)
          : [];
        setSlots(available);
      })
      .catch(() => setSlots([]));
  }, [artistId]);

  const onSubmit = async (values: FormValues) => {
    const slotIndex = values.slotIndex
      ? Number.parseInt(values.slotIndex, 10)
      : 0;
    const slot = slots[slotIndex];
    if (!slot) {
      form.setError("root", { message: "Select an available slot" });
      return;
    }

    setLoading(true);
    try {
      const dates = [{ start: slot.start, end: slot.end }];
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingRequestId: bookingRequest.id,
          artistId,
          dates,
          durationMin: values.durationMin,
          notes: values.notes || undefined,
          price: values.price,
          expiresAt: values.expiresAt || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create quote");
      }
      onSuccess();
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Quote</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="slotIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Slot</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {slots.map((slot, i) => (
                        <SelectItem key={slot.id} value={String(i)}>
                          {new Date(slot.start).toLocaleString()} -{" "}
                          {new Date(slot.end).toLocaleTimeString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expires at (ISO datetime, optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? new Date(e.target.value).toISOString()
                            : "",
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-destructive text-sm">
                {form.formState.errors.root.message}
              </p>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Quote"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
