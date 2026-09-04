import { z } from "zod";

export const notificationQuerySchema = z.object({
  unreadOnly: z.boolean().optional(),
  type: z.string().optional(),
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.string().min(1).max(100),
  title: z.string().min(1).max(240),
  message: z.string().min(1),
  entityType: z.string().max(80).optional(),
  entityId: z.string().uuid().optional(),
  channels: z.array(z.enum(["IN_APP", "EMAIL", "SMS", "PUSH"])).optional(),
});
