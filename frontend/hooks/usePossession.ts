import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface PossessionChecklistItem {
  id: string;
  possessionRecordId: string;
  checkName: string;
  status: string;
  remarks?: string;
  completedAt?: string;
  completedById?: string;
}

export interface PossessionRecord {
  id: string;
  acquisitionCaseId: string;
  status: string;
  possessionDate?: string;
  recordedById?: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  checklistItems?: PossessionChecklistItem[];
}

interface PossessionListParams {
  status?: string;
  skip?: number;
  take?: number;
  [key: string]: string | number | boolean | undefined;
}

interface PossessionListResponse {
  data: PossessionRecord[];
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
}

interface RecordPossessionData {
  possessionDate: string;
  latitude?: number;
  longitude?: number;
  remarks?: string;
}

interface UpdateChecklistItemData {
  status: "PENDING" | "PASS" | "FAIL" | "NOT_APPLICABLE";
  remarks?: string;
}

/**
 * Fetch list of possession records with filters
 */
export function usePossessionRecords(params: PossessionListParams = {}) {
  return useQuery({
    queryKey: ["possession", "records", params],
    queryFn: () => api.get<PossessionListResponse>("/possession/records", params),
  });
}

/**
 * Fetch possession record for an acquisition case
 */
export function usePossessionRecord(acquisitionCaseId: string | undefined) {
  return useQuery({
    queryKey: ["possession", "cases", acquisitionCaseId],
    queryFn: () =>
      api.get<PossessionRecord>(`/possession/cases/${acquisitionCaseId}`),
    enabled: !!acquisitionCaseId,
  });
}

/**
 * Record possession for an acquisition case
 */
export function useRecordPossession(acquisitionCaseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecordPossessionData) =>
      api.post<PossessionRecord>(
        `/possession/cases/${acquisitionCaseId}/record`,
        data
      ),
    onSuccess: (possession) => {
      queryClient.invalidateQueries({
        queryKey: ["possession", "cases", acquisitionCaseId],
      });
      queryClient.invalidateQueries({ queryKey: ["possession", "records"] });
      queryClient.setQueryData(
        ["possession", "records", possession.id],
        possession
      );
    },
  });
}

/**
 * Issue possession notice for an acquisition case
 */
export function useIssuePossessionNotice(acquisitionCaseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<PossessionRecord>(`/possession/cases/${acquisitionCaseId}/notice`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["possession", "cases", acquisitionCaseId],
      });
      queryClient.invalidateQueries({ queryKey: ["possession", "records"] });
    },
  });
}

/**
 * Mark possession record as ready
 */
export function useMarkPossessionReady(possessionRecordId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<PossessionRecord>(`/possession/records/${possessionRecordId}/ready`),
    onSuccess: (possession) => {
      queryClient.invalidateQueries({
        queryKey: ["possession", "records", possessionRecordId],
      });
      queryClient.invalidateQueries({
        queryKey: ["possession", "cases", possession.acquisitionCaseId],
      });
      queryClient.invalidateQueries({ queryKey: ["possession", "records"] });
    },
  });
}

/**
 * Update possession checklist item
 */
export function useUpdatePossessionChecklistItem(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateChecklistItemData) =>
      api.patch<PossessionChecklistItem>(`/possession/checklist/${itemId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["possession"] });
    },
  });
}

/**
 * Get possession records by status
 */
export function usePossessionRecordsByStatus(status: string | undefined) {
  return useQuery({
    queryKey: ["possession", "records", "status", status],
    queryFn: () =>
      api.get<PossessionListResponse>("/possession/records", { status }),
    enabled: !!status,
  });
}
