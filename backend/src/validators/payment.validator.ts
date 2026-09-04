import { z } from "zod";

export const initiatePaymentSchema = z.object({
  awardId: z.string().uuid(),
  beneficiaryId: z.string().uuid(),
  amount: z.number().positive(),
  idempotencyKey: z.string().min(1).max(255),
});

export const paymentQuerySchema = z.object({
  awardId: z.string().uuid().optional(),
  beneficiaryId: z.string().uuid().optional(),
  status: z.string().optional(),
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});

export const webhookPayloadSchema = z.object({
  externalReference: z.string(),
  status: z.string(),
  completedAt: z.string().optional(),
  failureReason: z.string().optional(),
});
