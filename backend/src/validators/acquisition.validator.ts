import { z } from 'zod';

export const createAcquisitionParcelSchema = z.object({
  projectId: z.string().uuid(),
  cadastralParcelId: z.string().uuid(),
  acquisitionReference: z.string().min(1).max(160),
  requiredAreaSqMeters: z.number().positive(),
  landCategory: z.string().max(120).optional(),
});

export const updateAcquisitionParcelSchema = z.object({
  requiredAreaSqMeters: z.number().positive().optional(),
  landCategory: z.string().max(120).optional(),
});

export const acquisitionCaseQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().optional(),
  status: z.string().optional(),
  projectId: z.string().uuid().optional(),
});

export const transitionReasonSchema = z.object({
  reason: z.string().min(1).max(500),
});
