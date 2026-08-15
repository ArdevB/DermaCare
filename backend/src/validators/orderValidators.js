import { z } from "zod";

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().trim().min(2),
    phone: z.string().trim().min(6),
    addressLine1: z.string().trim().min(3),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    postalCode: z.string().trim().min(1),
    country: z.string().trim().min(1),
  }),
  paymentMethod: z.enum(["cod", "card", "online"]).default("cod"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
});
