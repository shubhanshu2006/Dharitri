import { z } from "zod";

export const uploadDocumentSchema = z.object({
  entityType: z.string().min(1).max(80),
  entityId: z.string().uuid(),
  documentType: z.string().min(1).max(120),
  title: z.string().min(1).max(240),
  accessClass: z
    .enum(["PUBLIC", "INTERNAL", "RESTRICTED", "SENSITIVE"])
    .optional(),
});

export const documentQuerySchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
  documentType: z.string().optional(),
  status: z.string().optional(),
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});

export const downloadQuerySchema = z.object({
  expiresIn: z.number().min(60).max(86400).optional(),
});
