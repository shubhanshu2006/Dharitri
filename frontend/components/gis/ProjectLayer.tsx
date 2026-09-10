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
              "#10b981", // Green - Fully paid
              "ACQUISITION_COMPLETED",
              "#10b981", // Green - Acquisition completed
              "VERIFIED",
              "#fbbf24", // Yellow - Verified, pending acquisition
              "ACQUISITION_INITIATED",
              "#f59e0b", // Amber - Acquisition initiated
              "NOTIFICATION_STAGE",
              "#f59e0b", // Amber - Notification stage
              "AWARD_STAGE",
              "#f97316", // Orange - Award stage
              "PAYMENT_COMPLETED",
              "#10b981", // Green - Payment done
              "PAYMENT_IN_PROGRESS",
              "#22c55e", // Light green - Payment processing
              "COMPENSATION_APPROVED",
              "#f97316", // Orange - Approved, pending payment
              "COMPENSATION_ASSESSED",
              "#fbbf24", // Yellow - Assessed, pending approval
              "IN_ACQUISITION",
              "#f59e0b", // Amber - In acquisition
              "IDENTIFIED",
              "#94a3b8", // Gray - Just identified
              "DISPUTED",
              "#ef4444", // Red - Disputed
              "#94a3b8", // Default gray
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
        const feature = event.features[0];
        const currentId = feature.properties?.id || feature.id;
        
        if (!currentId) return; // Skip if no ID
        
        if (hoveredParcelId && hoveredParcelId !== currentId) {
          map.setFeatureState(
            { source: "parcels", id: hoveredParcelId },
            { hover: false },
          );
        }
        hoveredParcelId = currentId as string;
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
