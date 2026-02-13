import { z } from "zod";

export const createBecomeArtistRequestSchema = z.object({
  phoneNumber: z.string().optional(),
  instagramUsername: z.string().optional(),
});

export const reviewBecomeArtistRequestSchema = z.object({
  action: z.enum(["approve", "reject"]),
});
