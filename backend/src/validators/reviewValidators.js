import { z } from "zod";

export const upsertReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .trim()
    .max(1000, "Comment must be under 1000 characters")
    .optional()
    .default(""),
});
