import { z } from "zod";
import { ProjectStatus, ProjectType } from "../../generated/prisma/enums.js";

export const createProjectSchema = z.object({
  projectCode: z.string().min(1).max(64),
  name: z.string().min(1).max(240),
  projectType: z.nativeEnum(ProjectType),
  description: z.string().optional(),
  implementingAgencyId: z.string().uuid().optional(),
  ministryId: z.string().uuid().optional(),
  stateId: z.string().uuid(),
  districtId: z.string().uuid().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(240).optional(),
  description: z.string().optional(),
  implementingAgencyId: z.string().uuid().optional(),
  ministryId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
});

export const projectQuerySchema = z.object({
  status: z.nativeEnum(ProjectStatus).optional(),
  projectType: z.nativeEnum(ProjectType).optional(),
  stateId: z.string().uuid().optional(),
  districtId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const createMilestoneSchema = z.object({
  name: z.string().min(1).max(160),
  description: z.string().optional(),
  dueDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  sequence: z.number().int().min(1),
});

export const updateMilestoneSchema = z.object({
  name: z.string().min(1).max(160).optional(),
  description: z.string().optional(),
  dueDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  completedAt: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),
  status: z.string().max(64).optional(),
  sequence: z.number().int().min(1).optional(),
});

export const addProjectMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.string().min(1).max(80),
});
