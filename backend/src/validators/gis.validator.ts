import { z } from 'zod';

const coordinateSchema = z.tuple([z.number(), z.number()]);

const linearRingSchema = z.array(coordinateSchema).min(4);

const polygonCoordinatesSchema = z.array(linearRingSchema).min(1);

const multiPolygonCoordinatesSchema = z.array(polygonCoordinatesSchema).min(1);

export const geoJSONPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: coordinateSchema,
});

export const geoJSONPolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: polygonCoordinatesSchema,
});

export const geoJSONMultiPolygonSchema = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: multiPolygonCoordinatesSchema,
});

export const projectBoundarySchema = z.object({
  geometry: z.union([geoJSONPolygonSchema, geoJSONMultiPolygonSchema]),
  sourceType: z.string().min(1).max(64),
  sourceSystem: z.string().max(120).optional(),
  sourceRecordId: z.string().max(255).optional(),
});

export const cadastralParcelGeometrySchema = z.object({
  geometry: z.union([geoJSONPolygonSchema, geoJSONMultiPolygonSchema]),
  sourceSystem: z.string().min(1).max(120),
  sourceRecordId: z.string().min(1).max(255),
});
