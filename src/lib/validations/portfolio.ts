import { z } from "zod";

export const createPortfolioItemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string().url()).min(1),
});
