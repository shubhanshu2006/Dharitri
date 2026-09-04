import { z } from "zod";

export const createFieldVisitSchema = z.object({
  projectId: z.string().uuid(),
  acquisitionCaseId: z.string().uuid().optional(),
  startedAt: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  gpsAccuracyMeters: z.number().min(0).optional(),
  remarks: z.string().optional(),
  clientOperationId: z.string().max(255).optional(),
});

export const uploadEvidenceSchema = z.object({
  evidenceType: z.string().min(1).max(120),
  documentId: z.string().uuid(),
  capturedAt: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateChecklistItemSchema = z.object({
  checklistItemId: z.string().uuid(),
  status: z.enum(["PENDING", "PASS", "FAIL", "NOT_APPLICABLE"]),
  remarks: z.string().optional(),
});

export const fieldVisitQuerySchema = z.object({
  projectId: z.string().uuid().optional(),
  acquisitionCaseId: z.string().uuid().optional(),
  officerId: z.string().uuid().optional(),
  status: z.string().optional(),
  dateFrom: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  dateTo: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});

export const requestCorrectionSchema = z.object({
  remarks: z.string().min(1),
});
