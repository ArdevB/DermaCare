import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const stringArray = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((val) => {
    if (val === undefined) return undefined;
    if (Array.isArray(val)) return val.map((v) => v.trim()).filter(Boolean);
    // allow comma-separated strings from multipart/form-data
    return val
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  });

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().optional(), // optional: Gemini fills it in when missing/blank
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: objectId,
  stock: z.coerce.number().int().min(0).default(0),
  brand: z.string().trim().optional(),
  ingredients: stringArray,
  features: stringArray,
  benefits: stringArray,
});

export const updateProductSchema = createProductSchema.partial();
