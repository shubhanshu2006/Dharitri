import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface FieldChecklistItem {
  id: string;
  fieldVisitId: string;
  checkName: string;
  status: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldEvidence {
  id: string;
  fieldVisitId: string;
  documentId: string;
  evidenceType: string;
  capturedAt?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface FieldVisit {
  id: string;
  projectId: string;
  acquisitionCaseId?: string;
  officerId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracyMeters?: number;
  remarks?: string;
  clientOperationId?: string;
  createdAt: string;
  updatedAt: string;
  evidence?: FieldEvidence[];
  checklistItems?: FieldChecklistItem[];
}

interface FieldVisitListParams {
  projectId?: string;
  acquisitionCaseId?: string;
  officerId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  skip?: number;
  take?: number;
  [key: string]: string | number | boolean | undefined;
}

interface FieldVisitListResponse {
  data: FieldVisit[];
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}

interface CreateFieldVisitData {
  projectId: string;
  acquisitionCaseId?: string;
  startedAt: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracyMeters?: number;
  remarks?: string;
  clientOperationId?: string;
}

interface UploadEvidenceData {
  evidenceType: string;
  documentId: string;
  capturedAt?: string;
  latitude?: number;
  longitude?: number;
}

interface UpdateChecklistItemData {
  checklistItemId: string;
  status: "PENDING" | "PASS" | "FAIL" | "NOT_APPLICABLE";
  remarks?: string;
}

interface RequestCorrectionData {
  remarks: string;
}

/**
 * Fetch list of field visits with filters
 */
export function useFieldVisits(params: FieldVisitListParams = {}) {
  return useQuery({
    queryKey: ["field", "visits", params],
    queryFn: () => api.get<FieldVisitListResponse>("/field/visits", params),
  });
}

/**
 * Fetch single field visit by ID
 */
export function useFieldVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: ["field", "visits", visitId],
    queryFn: () => api.get<FieldVisit>(`/field/visits/${visitId}`),
    enabled: !!visitId,
  });
}

/**
 * Create a new field visit
 */
export function useCreateFieldVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFieldVisitData) =>
      api.post<FieldVisit>("/field/visits", data),
    onSuccess: (visit) => {
      queryClient.invalidateQueries({ queryKey: ["field", "visits"] });
      queryClient.setQueryData(["field", "visits", visit.id], visit);
    },
  });
}

/**
 * Upload evidence to a field visit
 */
export function useUploadFieldEvidence(visitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadEvidenceData) =>
      api.post<FieldEvidence>(`/field/visits/${visitId}/evidence`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["field", "visits", visitId] });
      queryClient.invalidateQueries({ queryKey: ["field", "visits"] });
    },
  });
}

/**
 * Update field visit checklist item
 */
export function useUpdateFieldChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateChecklistItemData) =>
      api.patch<FieldChecklistItem>("/field/visits/checklist", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["field", "visits"] });
    },
  });
}

/**
 * Submit field visit for review
 */
export function useSubmitFieldVisit(visitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<FieldVisit>(`/field/visits/${visitId}/submit`),
    onSuccess: (visit) => {
      queryClient.invalidateQueries({ queryKey: ["field", "visits", visitId] });
      queryClient.invalidateQueries({ queryKey: ["field", "visits"] });
      queryClient.setQueryData(["field", "visits", visit.id], visit);
    },
  });
}

/**
 * Verify field visit
 */
export function useVerifyFieldVisit(visitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post<FieldVisit>(`/field/visits/${visitId}/verify`),
    onSuccess: (visit) => {
      queryClient.invalidateQueries({ queryKey: ["field", "visits", visitId] });
      queryClient.invalidateQueries({ queryKey: ["field", "visits"] });
      queryClient.setQueryData(["field", "visits", visit.id], visit);
    },
  });
}

/**
 * Request correction for field visit
 */
export function useRequestFieldCorrection(visitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestCorrectionData) =>
      api.post<FieldVisit>(`/field/visits/${visitId}/request-correction`, data),
    onSuccess: (visit) => {
      queryClient.invalidateQueries({ queryKey: ["field", "visits", visitId] });
      queryClient.invalidateQueries({ queryKey: ["field", "visits"] });
      queryClient.setQueryData(["field", "visits", visit.id], visit);
    },
  });
}

/**
 * Get field visits by project
 */
export function useFieldVisitsByProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["field", "visits", "project", projectId],
    queryFn: () =>
      api.get<FieldVisitListResponse>("/field/visits", { projectId }),
    enabled: !!projectId,
  });
}

/**
 * Get field visits by acquisition case
 */
export function useFieldVisitsByCase(acquisitionCaseId: string | undefined) {
  return useQuery({
    queryKey: ["field", "visits", "case", acquisitionCaseId],
    queryFn: () =>
      api.get<FieldVisitListResponse>("/field/visits", { acquisitionCaseId }),
    enabled: !!acquisitionCaseId,
  });
}

/**
 * Get field visits by officer
 */
export function useFieldVisitsByOfficer(officerId: string | undefined) {
  return useQuery({
    queryKey: ["field", "visits", "officer", officerId],
    queryFn: () =>
      api.get<FieldVisitListResponse>("/field/visits", { officerId }),
    enabled: !!officerId,
  });
}

/**
 * Get field visits by status
 */
export function useFieldVisitsByStatus(status: string | undefined) {
  return useQuery({
    queryKey: ["field", "visits", "status", status],
    queryFn: () =>
      api.get<FieldVisitListResponse>("/field/visits", { status }),
    enabled: !!status,
  });
}
