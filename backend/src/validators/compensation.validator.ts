import { z } from "zod";

export const createCompensationAssessmentSchema = z.object({
  acquisitionCaseId: z.string().uuid(),
  landValue: z.number().min(0),
  solatium: z.number().min(0).optional(),
  interest: z.number().min(0).optional(),
  otherComponents: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
});

export const updateCompensationAssessmentSchema = z.object({
  landValue: z.number().min(0).optional(),
  solatium: z.number().min(0).optional(),
  interest: z.number().min(0).optional(),
  otherComponents: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
});

export const approveAssessmentSchema = z.object({
  notes: z.string().optional(),
});

export const requestCorrectionSchema = z.object({
  correctionNotes: z.string().min(1),
});

export const rejectAssessmentSchema = z.object({
  rejectionReason: z.string().min(1),
});

export const compensationQuerySchema = z.object({
  acquisitionCaseId: z.string().uuid().optional(),
  status: z.string().optional(),
  assessedById: z.string().uuid().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});
