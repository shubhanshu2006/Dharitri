import { GeoJSONPolygon, GeoJSONMultiPolygon } from "../../types/gis.js";

export interface CadastralQuery {
  parcelReference?: string;
  surveyNumber?: string;
  ulpin?: string;
  stateId: string;
  districtId: string;
  tehsilId?: string;
  villageId?: string;
}

export interface CadastralGeometryResponse {
  parcelReference: string;
  surveyNumber?: string;
  ulpin?: string;
  geometry: GeoJSONPolygon | GeoJSONMultiPolygon;
  areaSqMeters: number;
  srid: number;
  sourceSystem: string;
  sourceRecordId: string;
  retrievedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface CadastralProvider {
  name: string;
  supportsState(stateId: string): boolean;
  fetchGeometry(
    query: CadastralQuery,
  ): Promise<CadastralGeometryResponse | null>;
  bulkFetchGeometry(
    queries: CadastralQuery[],
  ): Promise<(CadastralGeometryResponse | null)[]>;
}
