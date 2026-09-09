"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { GeoJSONFeatureCollection } from "@/types/api";

interface ProjectLayerProps {
  map: maplibregl.Map | null;
  boundary: GeoJSONFeatureCollection | undefined;
  parcels: GeoJSONFeatureCollection | undefined;
  onParcelClick?: (parcelId: string, properties: any) => void;
}

const EMPTY_COLLECTION: GeoJSONFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

export function ProjectLayer({
  map,
  boundary,
  parcels,
  onParcelClick,
}: ProjectLayerProps) {
  const onParcelClickRef = useRef(onParcelClick);
  const fittedBoundaryRef = useRef<GeoJSONFeatureCollection | undefined>(
    undefined,
  );

  onParcelClickRef.current = onParcelClick;

  useEffect(() => {
    if (!map) return;

    const addLayers = () => {
      if (!map.getSource("project-boundary")) {
        map.addSource("project-boundary", {
          type: "geojson",
          data: EMPTY_COLLECTION as any,
        });
      }
      if (!map.getLayer("project-boundary-layer")) {
        map.addLayer({
          id: "project-boundary-layer",
          type: "fill",
          source: "project-boundary",
          paint: { "fill-color": "#10b981", "fill-opacity": 0.1 },
        });
      }
      if (!map.getLayer("project-boundary-outline")) {
        map.addLayer({
          id: "project-boundary-outline",
          type: "line",
          source: "project-boundary",
          paint: {
            "line-color": "#10b981",
            "line-width": 3,
            "line-dasharray": [2, 2],
          },
        });
      }
      if (!map.getSource("parcels")) {
        map.addSource("parcels", {
          type: "geojson",
          data: EMPTY_COLLECTION as any,
        });
      }
      if (!map.getLayer("parcels-fill")) {
        map.addLayer({
          id: "parcels-fill",
          type: "fill",
          source: "parcels",
          paint: {
            "fill-color": [
              "match",
              ["get", "acquisitionStatus"],
              "ACQUIRED",
              "#10b981",
              "IN_ACQUISITION",
              "#f59e0b",
              "IDENTIFIED",
              "#06b6d4",
              "DISPUTED",
              "#ef4444",
              "#94a3b8",
            ],
            "fill-opacity": 0.6,
          },
        });
      }
      if (!map.getLayer("parcels-outline")) {
        map.addLayer({
          id: "parcels-outline",
          type: "line",
          source: "parcels",
          paint: { "line-color": "#ffffff", "line-width": 1 },
        });
      }

      let hoveredParcelId: string | null = null;
      map.on("mousemove", "parcels-fill", (event) => {
        if (!event.features?.length) return;
        map.getCanvas().style.cursor = "pointer";
        if (hoveredParcelId) {
          map.setFeatureState(
            { source: "parcels", id: hoveredParcelId },
            { hover: false },
          );
        }
        hoveredParcelId = event.features[0].id as string;
        map.setFeatureState(
          { source: "parcels", id: hoveredParcelId },
          { hover: true },
        );
      });
      map.on("mouseleave", "parcels-fill", () => {
        map.getCanvas().style.cursor = "";
        if (hoveredParcelId) {
          map.setFeatureState(
            { source: "parcels", id: hoveredParcelId },
            { hover: false },
          );
        }
        hoveredParcelId = null;
      });
      map.on("click", "parcels-fill", (event) => {
        const feature = event.features?.[0];
        if (!feature) return;
        const parcelId = feature.properties?.id || feature.id;
        onParcelClickRef.current?.(parcelId as string, feature.properties);
      });
    };

    if (map.isStyleLoaded()) {
      addLayers();
    } else {
      map.once("styledata", addLayers);
    }
  }, [map]);

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource("project-boundary") as
      | maplibregl.GeoJSONSource
      | undefined;
    if (!source) return;
    source.setData((boundary || EMPTY_COLLECTION) as any);

    if (!boundary?.features.length || fittedBoundaryRef.current === boundary) return;
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
    fittedBoundaryRef.current = boundary;
    map.fitBounds(bounds, { padding: 50, duration: 0 });
  }, [map, boundary]);

  useEffect(() => {
    if (!map || !map.isStyleLoaded()) return;
    const source = map.getSource("parcels") as
      | maplibregl.GeoJSONSource
      | undefined;
    source?.setData((parcels || EMPTY_COLLECTION) as any);
  }, [map, parcels]);

  return null;
}
