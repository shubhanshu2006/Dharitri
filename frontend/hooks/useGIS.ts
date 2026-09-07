import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { GeoJSONFeatureCollection } from "@/types/api";

/**
 * Fetch project boundary as GeoJSON
 */
export function useProjectBoundary(projectId: string | undefined) {
  return useQuery({
    queryKey: ["gis", "projects", projectId, "boundary"],
    queryFn: () =>
      api.get<GeoJSONFeatureCollection>(
        `/gis/projects/${projectId}/boundary`
      ),
    enabled: !!projectId,
  });
}

/**
 * Upload/update project boundary
 */
export function useUploadProjectBoundary(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (geojson: GeoJSONFeatureCollection) =>
      api.post(`/projects/${projectId}/boundary`, geojson),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gis", "projects", projectId, "boundary"],
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
