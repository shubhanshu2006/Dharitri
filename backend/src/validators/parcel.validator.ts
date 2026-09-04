import { z } from 'zod';

export const createParcelSchema = z.object({
  parcelReference: z.string().min(1).max(160),
  ulpin: z.string().max(128).optional(),
  surveyNumber: z.string().max(128).optional(),
  subDivisionNumber: z.string().max(128).optional(),
  stateId: z.string().uuid(),
  districtId: z.string().uuid(),
  tehsilId: z.string().uuid().optional(),
  villageId: z.string().uuid().optional(),
  areaSqMeters: z.number().positive(),
  landCategory: z.string().max(120).optional(),
  sourceSystem: z.string().max(120).optional(),
  sourceRecordId: z.string().max(255).optional(),
});

export const updateParcelSchema = z.object({
  ulpin: z.string().max(128).optional(),
  surveyNumber: z.string().max(128).optional(),
  subDivisionNumber: z.string().max(128).optional(),
  areaSqMeters: z.number().positive().optional(),
  landCategory: z.string().max(120).optional(),
});

export const parcelQuerySchema = z.object({
  stateId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
  tehsilId: z.string().uuid().optional(),
  villageId: z.string().uuid().optional(),
  landCategory: z.string().optional(),
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});
