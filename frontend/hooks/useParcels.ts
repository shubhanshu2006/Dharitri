import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Parcel } from "@/types/api";

interface ParcelsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  acquisitionStatus?: string;
  verificationStatus?: string;
  projectId?: string;
  districtId?: string;
  [key: string]: string | number | boolean | undefined;
}

interface ParcelsResponse {
  data: Parcel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TimelineEvent {
  id: string;
  eventType: string;
  description: string;
  timestamp: string;
  actorId?: string;
  actorName?: string;
  metadata?: Record<string, any>;
}

interface LandRecord {
  id: string;
  parcelId: string;
  surveyNumber?: string;
  ulpin?: string;
  area?: number;
  areaUnit?: string;
  village?: string;
  tehsil?: string;
  district?: string;
  state?: string;
  landCategory?: string;
  recordStatus?: string;
  sourceSystem?: string;
  sourceRecordId?: string;
  retrievedAt?: string;
}

/**
 * Fetch paginated parcels list
 */
export function useParcels(params: ParcelsParams = {}) {
  return useQuery({
    queryKey: ["parcels", params],
    queryFn: () => api.get<ParcelsResponse>("/parcels", params),
  });
}

/**
 * Fetch single parcel by ID
 */
export function useParcel(parcelId: string | undefined) {
  return useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: () => api.get<Parcel>(`/parcels/${parcelId}`),
    enabled: !!parcelId,
  });
}

/**
 * Update parcel
 */
export function useUpdateParcel(parcelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Parcel>) =>
      api.patch<Parcel>(`/parcels/${parcelId}`, data),
    onSuccess: (updatedParcel) => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      queryClient.setQueryData(["parcels", parcelId], updatedParcel);
    },
  });
}

/**
 * Fetch parcel timeline/history
 */
export function useParcelTimeline(parcelId: string | undefined) {
  return useQuery({
    queryKey: ["parcels", parcelId, "timeline"],
    queryFn: () => api.get<TimelineEvent[]>(`/parcels/${parcelId}/timeline`),
    enabled: !!parcelId,
  });
}

/**
 * Fetch parcel land record
 */
export function useParcelLandRecord(parcelId: string | undefined) {
  return useQuery({
    queryKey: ["parcels", parcelId, "land-record"],
    queryFn: () => api.get<LandRecord>(`/parcels/${parcelId}/land-record`),
    enabled: !!parcelId,
  });
}

/**
 * Sync parcel from external land record system
 */
export function useSyncParcel(parcelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post(`/parcels/${parcelId}/sync`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels", parcelId] });
      queryClient.invalidateQueries({
        queryKey: ["parcels", parcelId, "land-record"],
      });
    },
  });
}
