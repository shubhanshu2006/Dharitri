import { z } from "zod";

export const createBeneficiarySchema = z.object({
  displayName: z.string().min(1).max(200),
  externalReference: z.string().max(255).optional(),
});

export const updateBeneficiarySchema = z.object({
  displayName: z.string().min(1).max(200).optional(),
  externalReference: z.string().max(255).optional(),
});

export const beneficiaryQuerySchema = z.object({
  verificationStatus: z.string().optional(),
  search: z.string().optional(),
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});
