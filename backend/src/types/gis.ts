export interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface GeoJSONMultiPolygon {
  type: "MultiPolygon";
  coordinates: number[][][][];
}

export type GeoJSONGeometry =
  | GeoJSONPoint
  | GeoJSONPolygon
  | GeoJSONMultiPolygon;

export interface GeoJSONFeature<T = Record<string, unknown>> {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties: T;
}

export interface GeoJSONFeatureCollection<T = Record<string, unknown>> {
  type: "FeatureCollection";
  features: GeoJSONFeature<T>[];
}

export interface ProjectBoundaryDto {
  geometry: GeoJSONPolygon | GeoJSONMultiPolygon;
  sourceType: string;
  sourceSystem?: string;
  sourceRecordId?: string;
}

export interface CadastralParcelDto {
  parcelReference: string;
  ulpin?: string;
  surveyNumber?: string;
  subDivisionNumber?: string;
  stateId: string;
  districtId: string;
  tehsilId?: string;
  villageId?: string;
  areaSqMeters: number;
  landCategory?: string;
  geometry?: GeoJSONPolygon | GeoJSONMultiPolygon;
  sourceSystem?: string;
  sourceRecordId?: string;
}

export interface SpatialQueryParams {
  bbox?: [number, number, number, number];
  limit?: number;
}

export interface IntersectionResult {
  cadastralParcelId: string;
  parcelReference: string;
  intersectionAreaSqMeters: number;
  percentageAffected: number;
}
