import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { RRStatus } from "@/lib/constants/rr";

export interface RREntitlement {
  id: string;
  rrCaseId: string;
  entitlementType: string;
  assessedValue: any;
  approvedValue?: any;
  providedValue?: any;
  status: string;
  verifiedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RRCase {
  id: string;
  projectId: string;
  acquisitionCaseId?: string;
  familyId: string;
  status: RRStatus;
  applicable: boolean;
  assessmentCompletedAt?: string;
  approvedAt?: string;
  completedAt?: string;
  approvedById?: string;
  completedById?: string;
  createdAt: string;
  updatedAt: string;
  entitlements?: RREntitlement[];
  project?: any;
  acquisitionCase?: any;
  family?: any;
}

interface RRCaseListParams {
  projectId?: string;
  status?: RRStatus | string;
  applicable?: boolean;
  familyId?: string;
  skip?: number;
  take?: number;
  [key: string]: string | number | boolean | undefined;
}

interface RRCaseListResponse {
  data: RRCase[];
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}

interface CreateRRCaseData {
  projectId: string;
  acquisitionCaseId?: string;
  familyId: string;
  applicable: boolean;
}

interface UpdateRRCaseData {
  applicable?: boolean;
}

interface TransitionStatusData {
  targetStatus: RRStatus;
}

interface CreateEntitlementData {
  entitlementType: string;
  assessedValue: any;
}

interface UpdateEntitlementData {
  approvedValue?: any;
  providedValue?: any;
  status?: string;
}

/**
 * Fetch list of R&R cases with filters
 */
export function useRRCases(params: RRCaseListParams = {}) {
  return useQuery({
    queryKey: ["rr", "cases", params],
    queryFn: () => api.get<RRCaseListResponse>("/rr/cases", params),
  });
}

/**
 * Fetch single R&R case by ID
 */
export function useRRCase(caseId: string | undefined) {
  return useQuery({
    queryKey: ["rr", "cases", caseId],
    queryFn: () => api.get<RRCase>(`/rr/cases/${caseId}`),
    enabled: !!caseId,
  });
}

/**
 * Create a new R&R case
 */
export function useCreateRRCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRRCaseData) =>
      api.post<RRCase>("/rr/cases", data),
    onSuccess: (rrCase) => {
      queryClient.invalidateQueries({ queryKey: ["rr", "cases"] });
      queryClient.setQueryData(["rr", "cases", rrCase.id], rrCase);
    },
  });
}

/**
 * Update an existing R&R case
 */
export function useUpdateRRCase(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRRCaseData) =>
      api.patch<RRCase>(`/rr/cases/${caseId}`, data),
    onSuccess: (rrCase) => {
      queryClient.invalidateQueries({ queryKey: ["rr", "cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["rr", "cases"] });
      queryClient.setQueryData(["rr", "cases", rrCase.id], rrCase);
    },
  });
}

/**
 * Transition R&R case status
 */
export function useTransitionRRCase(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransitionStatusData) =>
      api.post<RRCase>(`/rr/cases/${caseId}/transition`, data),
    onSuccess: (rrCase) => {
      queryClient.invalidateQueries({ queryKey: ["rr", "cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["rr", "cases"] });
      queryClient.setQueryData(["rr", "cases", rrCase.id], rrCase);
    },
  });
}

/**
 * Create an entitlement for an R&R case
 */
export function useCreateRREntitlement(caseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEntitlementData) =>
      api.post<RREntitlement>(`/rr/cases/${caseId}/entitlements`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rr", "cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["rr", "cases"] });
    },
  });
}

/**
 * Update an entitlement
 */
export function useUpdateRREntitlement(caseId: string, entitlementId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEntitlementData) =>
      api.patch<RREntitlement>(
        `/rr/cases/${caseId}/entitlements/${entitlementId}`,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rr", "cases", caseId] });
      queryClient.invalidateQueries({ queryKey: ["rr", "entitlements", entitlementId] });
      queryClient.invalidateQueries({ queryKey: ["rr", "cases"] });
    },
  });
}

/**
 * Get single entitlement
 */
export function useRREntitlement(caseId: string | undefined, entitlementId: string | undefined) {
  return useQuery({
    queryKey: ["rr", "entitlements", entitlementId],
    queryFn: () =>
      api.get<RREntitlement>(`/rr/cases/${caseId}/entitlements/${entitlementId}`),
    enabled: !!caseId && !!entitlementId,
  });
}

/**
 * Get R&R cases by project
 */
export function useRRCasesByProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["rr", "cases", "project", projectId],
    queryFn: () =>
      api.get<RRCaseListResponse>("/rr/cases", { projectId }),
    enabled: !!projectId,
  });
}

/**
 * Get R&R cases by status
 */
export function useRRCasesByStatus(status: RRStatus | string | undefined) {
  return useQuery({
    queryKey: ["rr", "cases", "status", status],
    queryFn: () =>
      api.get<RRCaseListResponse>("/rr/cases", { status }),
    enabled: !!status,
  });
}

/**
 * Get R&R cases by family
 */
export function useRRCasesByFamily(familyId: string | undefined) {
  return useQuery({
    queryKey: ["rr", "cases", "family", familyId],
    queryFn: () =>
      api.get<RRCaseListResponse>("/rr/cases", { familyId }),
    enabled: !!familyId,
  });
}
