import { z } from "zod";

export const recordPossessionSchema = z.object({
  possessionDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  remarks: z.string().optional(),
});

export const updateChecklistItemSchema = z.object({
  status: z.enum(["PENDING", "PASS", "FAIL", "NOT_APPLICABLE"]),
  remarks: z.string().optional(),
});

export const possessionQuerySchema = z.object({
  status: z.string().optional(),
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});
