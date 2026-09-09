"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const DEFAULT_CENTER: [number, number] = [78.9629, 20.5937];
const DEFAULT_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface MapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  onLoad?: (map: maplibregl.Map) => void;
  style?: string;
  className?: string;
}

export function Map({
  initialCenter = DEFAULT_CENTER,
  initialZoom = 5,
  onLoad,
  style = DEFAULT_STYLE,
  className = "w-full h-full",
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const onLoadRef = useRef(onLoad);

  onLoadRef.current = onLoad;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: initialCenter,
      zoom: initialZoom,
      fadeDuration: 0,
      refreshExpiredTiles: false,
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
      if (onLoadRef.current && map.current) {
        onLoadRef.current(map.current);
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className={className}
      style={{ position: "relative" }}
    />
  );
}
