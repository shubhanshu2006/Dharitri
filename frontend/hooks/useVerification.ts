import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface VerificationResult {
  id: string;
  verificationCaseId: string;
  checkName: string;
  status: string;
  severity?: string;
  source: string;
  message: string;
  evidenceDocumentId?: string;
  checkedAt: string;
  ruleVersion: string;
}

export interface VerificationCase {
  id: string;
  acquisitionCaseId: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  assignedUserId?: string;
  assignedUserName?: string;
  createdAt: string;
  updatedAt: string;
  results?: VerificationResult[];
}

interface VerificationCasesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  severity?: string;
  projectId?: string;
  parcelId?: string;
  assignedUserId?: string;
  [key: string]: string | number | boolean | undefined;
}

interface VerificationCasesResponse {
  data: VerificationCase[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch verification cases
 */
export function useVerificationCases(params: VerificationCasesParams = {}) {
  return useQuery({
    queryKey: ["verification", "cases", params],
    queryFn: () => api.get<VerificationCasesResponse>("/verification/cases", params),
  });
}

/**
 * Fetch single verification case
 */
export function useVerificationCase(caseId: string | undefined) {
  return useQuery({
    queryKey: ["verification", "cases", caseId],
    queryFn: () => api.get<VerificationCase>(`/verification/cases/${caseId}`),
    enabled: !!caseId,
  });
}

/**
 * Create verification case
 */
export function useCreateVerificationCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { parcelId: string; projectId: string }) =>
      api.post<VerificationCase>("/verification/cases", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification", "cases"] });
    },
  });
}

/**
 * Run verification checks
 */
export function useRunVerification(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(`/verification/cases/${caseId}/run`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification", "cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["verification", "cases"] });
    },
  });
}

/**
 * Approve verification case
 */
export function useApproveVerification(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(`/verification/cases/${caseId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification", "cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["verification", "cases"] });
    },
  });
}

/**
 * Request correction for verification case
 */
export function useRequestCorrection(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { reason: string }) =>
      api.post(`/verification/cases/${caseId}/request-correction`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification", "cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["verification", "cases"] });
    },
  });
}

/**
 * Route verification case
 */
export function useRouteVerificationCase(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { officerId: string; reason: string }) =>
      api.post(`/verification/cases/${caseId}/route`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verification", "cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["verification", "cases"] });
    },
  });
}
