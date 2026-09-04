import { z } from "zod";

export const auditQuerySchema = z.object({
  actorId: z.string().uuid().optional(),
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
  action: z.string().optional(),
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
