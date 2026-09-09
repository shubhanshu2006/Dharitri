import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface AcquisitionCase {
  id: string;
  acquisitionParcelId: string;
  status: string;
  currentAssigneeId?: string;
  currentAssigneeName?: string;
  createdAt: string;
  updatedAt: string;
  // Related entities
  acquisitionParcel?: {
    id: string;
    projectId: string;
    cadastralParcelId: string;
    acquisitionReference: string;
    requiredAreaSqMeters: number;
    landCategory?: string;
  };
  statusHistory?: StatusTransition[];
}

export interface StatusTransition {
  id: string;
  fromState: string;
  toState: string;
  actorId: string;
  actorName?: string;
  reason?: string;
  createdAt: string;
}

interface AcquisitionCasesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  projectId?: string;
  assignedUserId?: string;
  [key: string]: string | number | boolean | undefined;
}

interface AcquisitionCasesResponse {
  data: AcquisitionCase[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch acquisition cases
 */
export function useAcquisitionCases(params: AcquisitionCasesParams = {}) {
  return useQuery({
    queryKey: ["acquisition", "cases", params],
    queryFn: () =>
      api.get<AcquisitionCasesResponse>("/acquisitions/cases", params),
  });
}

/**
 * Fetch single acquisition case
 */
export function useAcquisitionCase(caseId: string | undefined) {
  return useQuery({
    queryKey: ["acquisition", "cases", caseId],
    queryFn: () => api.get<AcquisitionCase>(`/acquisitions/cases/${caseId}`),
    enabled: !!caseId,
  });
}

/**
 * Create acquisition case
 */
export function useCreateAcquisitionCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectId: string; parcelId: string }) =>
      api.post<AcquisitionCase>("/acquisitions/cases", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["acquisition", "cases"] });
    },
  });
}

/**
 * Transition acquisition case status
 */
export function useTransitionAcquisition(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { toStatus: string; reason?: string }) =>
      api.post(`/acquisitions/cases/${caseId}/transition`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["acquisition", "cases", caseId],
      });
      queryClient.invalidateQueries({ queryKey: ["acquisition", "cases"] });
    },
  });
}

/**
 * Assign acquisition case to user
 */
export function useAssignAcquisitionCase(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string }) =>
      api.post(`/acquisitions/cases/${caseId}/assign`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["acquisition", "cases", caseId],
      });
      queryClient.invalidateQueries({ queryKey: ["acquisition", "cases"] });
    },
  });
}

/**
 * Fetch acquisition case status history
 */
export function useAcquisitionHistory(caseId: string | undefined) {
  return useQuery({
    queryKey: ["acquisition", "cases", caseId, "history"],
    queryFn: () =>
      api.get<StatusTransition[]>(`/acquisitions/cases/${caseId}/history`),
    enabled: !!caseId,
  });
}
