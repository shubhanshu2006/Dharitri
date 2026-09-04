import {
  GeoJSONGeometry,
  GeoJSONPolygon,
  GeoJSONMultiPolygon,
} from "../types/gis.js";

export const SRID = 4326;

export function validateGeoJSON(
  geometry: unknown,
): geometry is GeoJSONGeometry {
  if (!geometry || typeof geometry !== "object") {
    return false;
  }

  const geom = geometry as Record<string, unknown>;

  if (!geom.type || !geom.coordinates) {
    return false;
  }

  const validTypes = ["Point", "Polygon", "MultiPolygon"];
  return validTypes.includes(geom.type as string);
}

export function isPolygon(
  geometry: GeoJSONGeometry,
): geometry is GeoJSONPolygon {
  return geometry.type === "Polygon";
}

export function isMultiPolygon(
  geometry: GeoJSONGeometry,
): geometry is GeoJSONMultiPolygon {
  return geometry.type === "MultiPolygon";
}

export function geometryToWKT(geometry: GeoJSONGeometry): string {
  if (geometry.type === "Point") {
    const [lon, lat] = geometry.coordinates;
    return `POINT(${lon} ${lat})`;
  }

  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates
      .map((ring) => {
        const coords = ring.map(([lon, lat]) => `${lon} ${lat}`).join(",");
        return `(${coords})`;
      })
      .join(",");
    return `POLYGON(${rings})`;
  }

  if (geometry.type === "MultiPolygon") {
    const polygons = geometry.coordinates
      .map((polygon) => {
        const rings = polygon
          .map((ring) => {
            const coords = ring.map(([lon, lat]) => `${lon} ${lat}`).join(",");
            return `(${coords})`;
          })
          .join(",");
        return `(${rings})`;
      })
      .join(",");
    return `MULTIPOLYGON(${polygons})`;
  }

  throw new Error(`Unsupported geometry type: ${(geometry as any).type}`);
}

export function wktToGeoJSON(wkt: string): GeoJSONGeometry {
  const typeMatch = wkt.match(/^(\w+)\s*\(/);
  if (!typeMatch) {
    throw new Error("Invalid WKT format");
  }

  const type = typeMatch[1].toUpperCase();

  if (type === "POINT") {
    const coords = wkt.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/);
    if (!coords) throw new Error("Invalid POINT WKT");
    return {
      type: "Point",
      coordinates: [parseFloat(coords[1]), parseFloat(coords[2])],
    };
  }

  throw new Error(
    `WKT to GeoJSON conversion not implemented for type: ${type}`,
  );
}

export function calculateBBox(
  geometry: GeoJSONPolygon | GeoJSONMultiPolygon,
): [number, number, number, number] {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;

  const processRing = (ring: number[][]) => {
    ring.forEach(([lon, lat]) => {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
  };

  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach(processRing);
  } else if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((polygon) => {
      polygon.forEach(processRing);
    });
  }

  return [minLon, minLat, maxLon, maxLat];
}

export function validatePolygon(geometry: GeoJSONPolygon): {
  valid: boolean;
  error?: string;
} {
  if (!geometry.coordinates || geometry.coordinates.length === 0) {
    return { valid: false, error: "Polygon has no coordinates" };
  }

  const exteriorRing = geometry.coordinates[0];
  if (exteriorRing.length < 4) {
    return { valid: false, error: "Polygon must have at least 4 coordinates" };
  }

  const first = exteriorRing[0];
  const last = exteriorRing[exteriorRing.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    return {
      valid: false,
      error: "Polygon must be closed (first and last coordinates must match)",
    };
  }

  return { valid: true };
}
