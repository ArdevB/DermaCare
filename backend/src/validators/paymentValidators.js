import { z } from "zod";

export const submitBankTransferSchema = z.object({
  referenceNumber: z.string().trim().min(1, "Reference number is required"),
});

export const verifyBankTransferSchema = z
  .object({
    decision: z.enum(["approve", "reject"]),
    rejectionReason: z.string().trim().optional(),
  })
  .refine((data) => data.decision !== "reject" || !!data.rejectionReason, {
    message: "rejectionReason is required when rejecting a payment",
    path: ["rejectionReason"],
  });
