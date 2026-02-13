import { z } from "zod";

const dateRangeSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export const bookingRequestStatus = z.enum([
  "pending",
  "quoted",
  "accepted",
  "paid",
  "scheduled",
  "completed",
  "rejected",
  "cancelled",
]);
export type BookingRequestStatus = z.infer<typeof bookingRequestStatus>;

export const quoteStatus = z.enum([
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
]);
export type QuoteStatus = z.infer<typeof quoteStatus>;

export const paymentStatus = z.enum([
  "initiated",
  "succeeded",
  "failed",
  "refunded",
]);
export type PaymentStatus = z.infer<typeof paymentStatus>;

export const createBookingRequestSchema = z.object({
  artistId: z.number().int().positive(),
  referenceImageUrl: z.string().url().optional(),
  referenceImageUrls: z.array(z.string().url()).max(3).optional(),
  description: z.string().min(10),
  size: z.string().optional(),
  placement: z.string().optional(),
  preferredDates: z.array(dateRangeSchema).optional(),
});

export const createQuoteSchema = z.object({
  bookingRequestId: z.number().int().positive(),
  artistId: z.number().int().positive(),
  dates: z.array(dateRangeSchema).min(1),
  durationMin: z.number().int().positive(),
  notes: z.string().optional(),
  price: z.number().positive(),
  expiresAt: z.string().datetime().optional(),
});

export const createBookingSchema = z.object({
  quoteId: z.number().int().positive(),
  chosenDateIndex: z.number().int().min(0).optional(),
});

export const createAvailabilitySchema = z.object({
  artistId: z.number().int().positive(),
  slots: z
    .array(
      z.object({
        start: z.string().datetime(),
        end: z.string().datetime(),
      }),
    )
    .min(1),
});

export const createPaymentSchema = z.object({
  bookingId: z.number().int().positive(),
});
