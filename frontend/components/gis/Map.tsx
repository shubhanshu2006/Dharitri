"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  onLoad?: (map: maplibregl.Map) => void;
  style?: string;
  className?: string;
}

export function Map({
  initialCenter = [78.9629, 20.5937], // Center of India
  initialZoom = 5,
  onLoad,
  style = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  className = "w-full h-full",
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
      }),
      "top-right"
    );

    // Add scale control
    map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 200,
        unit: "metric",
      }),
      "bottom-left"
    );

    // Add attribution
    map.current.addControl(
      new maplibregl.AttributionControl({
        compact: true,
      }),
      "bottom-right"
    );

    // Call onLoad when map is ready
    map.current.on("load", () => {
      if (onLoad && map.current) {
        onLoad(map.current);
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCenter, initialZoom, style, onLoad]);

  return (
    <div
      ref={mapContainer}
      className={className}
      style={{ position: "relative" }}
    />
  );
}
