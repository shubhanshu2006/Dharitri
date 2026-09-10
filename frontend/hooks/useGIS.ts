import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { GeoJSONFeatureCollection } from "@/types/api";

/**
 * Fetch project boundary as GeoJSON
 */
export function useProjectBoundary(projectId: string | undefined) {
  return useQuery({
    queryKey: ["gis", "projects", projectId, "boundary"],
    queryFn: async () => {
      const boundary = await api.get<{
        geometry: GeoJSONFeatureCollection["features"][number]["geometry"];
        sourceType?: string;
      }>(`/gis/projects/${projectId}/boundary`);

      return {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            properties: { sourceType: boundary.sourceType },
            geometry: boundary.geometry,
          },
        ],
      } as GeoJSONFeatureCollection;
    },
    enabled: !!projectId,
  });
}

/**
 * Upload/update project boundary
 */
export function useUploadProjectBoundary(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      geometry: GeoJSONFeatureCollection["features"][number]["geometry"];
      sourceType: string;
    }) => api.post(`/gis/projects/${projectId}/boundary`, payload),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["gis", "projects", projectId, "boundary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gis", "projects", projectId, "boundary"],
      });
    },
  });
}

export function useDeleteProjectBoundary(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`/gis/projects/${projectId}/boundary`),
    onSuccess: () => {
      queryClient.setQueryData(
        ["gis", "projects", projectId, "boundary"],
        null,
      );
      queryClient.setQueryData<GeoJSONFeatureCollection>(
        ["gis", "projects", projectId, "parcels"],
        { type: "FeatureCollection", features: [] },
      );
      queryClient.removeQueries({
        queryKey: ["gis", "projects", projectId, "boundary"],
      });
      queryClient.removeQueries({
        queryKey: ["gis", "projects", projectId, "parcels"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gis", "projects", projectId, "boundary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gis", "projects", projectId, "parcels"],
      });
    },
  });
}

/**
 * Fetch parcels intersecting project boundary
 */
export function useProjectParcels(projectId: string | undefined) {
  return useQuery({
    queryKey: ["gis", "projects", projectId, "parcels"],
    queryFn: () =>
      api.get<GeoJSONFeatureCollection>(
        `/gis/projects/${projectId}/parcels`
      ),
    enabled: !!projectId,
  });
}

/**
 * Fetch single parcel geometry
 */
export function useParcelGeometry(parcelId: string | undefined) {
  return useQuery({
    queryKey: ["gis", "parcels", parcelId, "geometry"],
    queryFn: () =>
      api.get<GeoJSONFeatureCollection>(`/gis/parcels/${parcelId}/geometry`),
    enabled: !!parcelId,
  });
}

/**
 * Fetch parcels within bounding box (for viewport queries)
 */
export function useParcelsInBounds(
  bounds?: {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  },
  filters?: {
    status?: string;
    projectId?: string;
  }
) {
  return useQuery({
    queryKey: ["gis", "parcels", "bounds", bounds, filters],
    queryFn: () =>
      api.get<GeoJSONFeatureCollection>("/gis/parcels", {
        ...bounds,
        ...filters,
      }),
    enabled: !!bounds,
  });
}
