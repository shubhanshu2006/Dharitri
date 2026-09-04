import { z } from "zod";

export const analyticsQuerySchema = z.object({
  months: z.number().min(1).max(24).optional(),
  stateId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
});

export const bottleneckQuerySchema = z.object({
  stateId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
});
