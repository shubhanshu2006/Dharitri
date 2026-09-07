import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CompensationAssessment {
  id: string;
  acquisitionCaseId: string;
  ruleSetId: string;
  landValue: number;
  solatium: number;
  interest: number;
  otherComponents: number;
  deductions: number;
  totalAmount: number;
  status: string;
  assessedById: string;
  assessedByName?: string;
  assessedAt: string;
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Related entities
  acquisitionCase?: {
    id: string;
    status: string;
  };
  award?: {
    id: string;
    awardNumber: string;
    awardedAmount: number;
    status: string;
  };
}

export interface CompensationFormData {
  acquisitionCaseId: string;
  ruleSetId?: string;
  landValue: number;
  solatium: number;
  interest: number;
  otherComponents: number;
  deductions: number;
}

interface CompensationAssessmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  acquisitionCaseId?: string;
  [key: string]: string | number | boolean | undefined;
}

interface CompensationAssessmentsResponse {
  data: CompensationAssessment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch compensation assessments
 */
export function useCompensationAssessments(
  params: CompensationAssessmentsParams = {}
) {
  return useQuery({
    queryKey: ["compensation", "assessments", params],
    queryFn: () =>
      api.get<CompensationAssessmentsResponse>("/compensation/assessments", params),
  });
}

/**
 * Fetch single compensation assessment
 */
export function useCompensationAssessment(assessmentId: string | undefined) {
  return useQuery({
    queryKey: ["compensation", "assessments", assessmentId],
    queryFn: () =>
      api.get<CompensationAssessment>(`/compensation/assessments/${assessmentId}`),
    enabled: !!assessmentId,
  });
}

/**
 * Create compensation assessment
 */
export function useCreateCompensationAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompensationFormData) =>
      api.post<CompensationAssessment>("/compensation/assessments", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments"],
      });
    },
  });
}

/**
 * Update compensation assessment
 */
export function useUpdateCompensationAssessment(assessmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CompensationFormData>) =>
      api.patch<CompensationAssessment>(
        `/compensation/assessments/${assessmentId}`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments", assessmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments"],
      });
    },
  });
}

/**
 * Submit compensation assessment for review
 */
export function useSubmitCompensationAssessment(assessmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post(`/compensation/assessments/${assessmentId}/submit`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments", assessmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments"],
      });
    },
  });
}

/**
 * Approve compensation assessment
 */
export function useApproveCompensationAssessment(assessmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post(`/compensation/assessments/${assessmentId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments", assessmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments"],
      });
    },
  });
}

/**
 * Reject compensation assessment
 */
export function useRejectCompensationAssessment(assessmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { reason: string }) =>
      api.post(`/compensation/assessments/${assessmentId}/reject`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments", assessmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments"],
      });
    },
  });
}

/**
 * Request correction for compensation assessment
 */
export function useRequestCompensationCorrection(assessmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { reason: string }) =>
      api.post(
        `/compensation/assessments/${assessmentId}/request-correction`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments", assessmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["compensation", "assessments"],
      });
    },
  });
}
