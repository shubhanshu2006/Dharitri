"use client";

import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import type { GeoJSONFeatureCollection } from "@/types/api";

interface ProjectLayerProps {
  map: maplibregl.Map | null;
  boundary: GeoJSONFeatureCollection | undefined;
  parcels: GeoJSONFeatureCollection | undefined;
  onParcelClick?: (parcelId: string, properties: any) => void;
}

export function ProjectLayer({
  map,
  boundary,
  parcels,
  onParcelClick,
}: ProjectLayerProps) {
  // Add project boundary layer
  useEffect(() => {
    if (!map || !boundary || !boundary.features || boundary.features.length === 0) return;

    const sourceId = "project-boundary";
    const layerId = "project-boundary-layer";
    const outlineId = "project-boundary-outline";

    // Wait for map to be fully loaded
    if (!map.isStyleLoaded()) {
      map.once("styledata", () => {
        addBoundaryLayers();
      });
    } else {
      addBoundaryLayers();
    }

    function addBoundaryLayers() {
      if (!map || !boundary) return;

      // Add source
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: boundary as any,
        });
      }

      // Add fill layer
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": "#10b981",
            "fill-opacity": 0.1,
          },
        });
      }

      // Add outline layer
      if (!map.getLayer(outlineId)) {
        map.addLayer({
          id: outlineId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "#10b981",
            "line-width": 3,
            "line-dasharray": [2, 2],
          },
        });
      }

      // Fit bounds to boundary
      if (boundary.features && boundary.features.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        boundary.features.forEach((feature) => {
          if (feature.geometry.type === "Polygon") {
            feature.geometry.coordinates[0].forEach((coord: number[]) => {
              bounds.extend(coord as [number, number]);
            });
          } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon: number[][][]) => {
              polygon[0].forEach((coord: number[]) => {
                bounds.extend(coord as [number, number]);
              });
            });
          }
        });
        map.fitBounds(bounds, { padding: 50, duration: 1000 });
      }
    }

    return () => {
      if (map && map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map && map.getLayer(outlineId)) {
        map.removeLayer(outlineId);
      }
      if (map && map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, boundary]);

  // Add parcels layer
  useEffect(() => {
    if (!map || !parcels || !parcels.features || parcels.features.length === 0) return;

    const sourceId = "parcels";
    const fillLayerId = "parcels-fill";
    const outlineLayerId = "parcels-outline";

    // Wait for map to be fully loaded
    if (!map.isStyleLoaded()) {
      map.once("styledata", () => {
        addParcelLayers();
      });
    } else {
      addParcelLayers();
    }

    function addParcelLayers() {
      if (!map || !parcels) return;

      // Add source
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "geojson",
          data: parcels as any,
        });
      } else {
        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
        source.setData(parcels as any);
      }

      // Add fill layer with status-based colors
      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": [
              "match",
              ["get", "acquisitionStatus"],
              "ACQUIRED",
              "#10b981", // emerald
              "IN_ACQUISITION",
              "#f59e0b", // amber
              "IDENTIFIED",
              "#06b6d4", // cyan
              "DISPUTED",
              "#ef4444", // red
              "#94a3b8", // gray (default)
            ],
            "fill-opacity": 0.6,
          },
        });
      }

      // Add outline layer
      if (!map.getLayer(outlineLayerId)) {
        map.addLayer({
          id: outlineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "#ffffff",
            "line-width": 1,
          },
        });
      }

      // Add hover effect
      let hoveredParcelId: string | null = null;

      map.on("mousemove", fillLayerId, (e) => {
        if (e.features && e.features.length > 0) {
          map.getCanvas().style.cursor = "pointer";

          if (hoveredParcelId) {
            map.setFeatureState(
              { source: sourceId, id: hoveredParcelId },
              { hover: false }
            );
          }

          hoveredParcelId = e.features[0].id as string;
          map.setFeatureState(
            { source: sourceId, id: hoveredParcelId },
            { hover: true }
          );
        }
      });

      map.on("mouseleave", fillLayerId, () => {
        map.getCanvas().style.cursor = "";
        if (hoveredParcelId) {
          map.setFeatureState(
            { source: sourceId, id: hoveredParcelId },
            { hover: false }
          );
        }
        hoveredParcelId = null;
      });

      // Add click handler
      if (onParcelClick) {
        map.on("click", fillLayerId, (e) => {
          if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const parcelId = feature.properties?.id || feature.id;
            onParcelClick(parcelId as string, feature.properties);
          }
        });
      }
    }

    return () => {
      if (map && map.getLayer(fillLayerId)) {
        map.removeLayer(fillLayerId);
      }
      if (map && map.getLayer(outlineLayerId)) {
        map.removeLayer(outlineLayerId);
      }
      if (map && map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [map, parcels, onParcelClick]);

  return null;
}
