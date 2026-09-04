import { z } from "zod";

export const createRRCaseSchema = z.object({
  projectId: z.string().uuid(),
  familyId: z.string().uuid(),
  acquisitionCaseId: z.string().uuid().optional(),
  applicable: z.boolean(),
});

export const updateRRCaseSchema = z.object({
  applicable: z.boolean().optional(),
});

export const transitionStatusSchema = z.object({
  targetStatus: z.string(),
});

export const createEntitlementSchema = z.object({
  entitlementType: z.string().min(1).max(120),
  assessedValue: z.record(z.any()),
});

export const updateEntitlementSchema = z.object({
  approvedValue: z.record(z.any()).optional(),
  providedValue: z.record(z.any()).optional(),
  status: z.string().max(64).optional(),
});

export const rrCaseQuerySchema = z.object({
  projectId: z.string().uuid().optional(),
  familyId: z.string().uuid().optional(),
  status: z.string().optional(),
  applicable: z.boolean().optional(),
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});
