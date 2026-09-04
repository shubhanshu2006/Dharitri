import { prisma } from "../database/client.js";
import {
  ProjectBoundaryDto,
  GeoJSONPolygon,
  GeoJSONMultiPolygon,
  IntersectionResult,
} from "../types/gis.js";
import {
  geometryToWKT,
  SRID,
  validatePolygon,
  calculateBBox,
} from "../utils/geojson.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import crypto from "crypto";

export class GISService {
  async setProjectBoundary(projectId: string, data: ProjectBoundaryDto) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    if (data.geometry.type === "Polygon") {
      const validation = validatePolygon(data.geometry);
      if (!validation.valid) {
        throw new BadRequestError(
          validation.error || "Invalid polygon geometry",
        );
      }
    }

    const wkt = geometryToWKT(data.geometry);
    const geometryHash = crypto.createHash("sha256").update(wkt).digest("hex");

    const areaResult = await prisma.$queryRawUnsafe<Array<{ area: number }>>(
      `SELECT ST_Area(ST_GeomFromText($1, $2)::geography) as area`,
      wkt,
      SRID,
    );

    const areaSqMeters = areaResult[0]?.area || 0;

    logger.info(`Setting project boundary for project ${projectId}`, {
      sourceType: data.sourceType,
      areaSqMeters,
    });

    const boundary = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `INSERT INTO "ProjectBoundary" (id, "projectId", "sourceType", "sourceSystem", "sourceRecordId", geometry, srid, "areaSqMeters", "geometryHash", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, ST_GeomFromText($5, $6), $7, $8, $9, NOW(), NOW())
       ON CONFLICT ("projectId") 
       DO UPDATE SET 
         "sourceType" = EXCLUDED."sourceType",
         "sourceSystem" = EXCLUDED."sourceSystem",
         "sourceRecordId" = EXCLUDED."sourceRecordId",
         geometry = EXCLUDED.geometry,
         srid = EXCLUDED.srid,
         "areaSqMeters" = EXCLUDED."areaSqMeters",
         "geometryHash" = EXCLUDED."geometryHash",
         "updatedAt" = NOW()
       RETURNING id`,
      projectId,
      data.sourceType,
      data.sourceSystem || null,
      data.sourceRecordId || null,
      wkt,
      SRID,
      SRID,
      areaSqMeters,
      geometryHash,
    );

    logger.info(`Project boundary set successfully for project ${projectId}`);

    return this.getProjectBoundary(projectId);
  }

  async getProjectBoundary(projectId: string) {
    const boundary = await prisma.$queryRawUnsafe<
      Array<{
        id: string;
        projectId: string;
        sourceType: string;
        sourceSystem: string | null;
        sourceRecordId: string | null;
        geometry: string;
        srid: number;
        areaSqMeters: string;
        createdAt: Date;
        updatedAt: Date;
      }>
    >(
      `SELECT 
         id, "projectId", "sourceType", "sourceSystem", "sourceRecordId",
         ST_AsGeoJSON(geometry) as geometry, srid, "areaSqMeters", "createdAt", "updatedAt"
       FROM "ProjectBoundary"
       WHERE "projectId" = $1`,
      projectId,
    );

    if (!boundary || boundary.length === 0) {
      throw new NotFoundError("Project boundary not found");
    }

    const result = boundary[0];
    return {
      ...result,
      geometry: JSON.parse(result.geometry),
      areaSqMeters: parseFloat(result.areaSqMeters),
    };
  }

  async deleteProjectBoundary(projectId: string) {
    await prisma.$executeRawUnsafe(
      `DELETE FROM "ProjectBoundary" WHERE "projectId" = $1`,
      projectId,
    );
    logger.info(`Project boundary deleted for project ${projectId}`);
  }

  async findIntersectingParcels(
    projectId: string,
  ): Promise<IntersectionResult[]> {
    const boundary = await this.getProjectBoundary(projectId);

    logger.info(`Finding intersecting parcels for project ${projectId}`);

    const results = await prisma.$queryRawUnsafe<
      Array<{
        cadastralParcelId: string;
        parcelReference: string;
        intersectionArea: string;
        parcelArea: string;
      }>
    >(
      `SELECT 
         cp.id as "cadastralParcelId",
         cp."parcelReference",
         ST_Area(ST_Intersection(pb.geometry::geography, cp.geometry::geography)) as "intersectionArea",
         cp."areaSqMeters" as "parcelArea"
       FROM "CadastralParcel" cp
       CROSS JOIN "ProjectBoundary" pb
       WHERE pb."projectId" = $1
         AND cp.geometry IS NOT NULL
         AND ST_Intersects(pb.geometry, cp.geometry)`,
      projectId,
    );

    return results.map((r) => ({
      cadastralParcelId: r.cadastralParcelId,
      parcelReference: r.parcelReference,
      intersectionAreaSqMeters: parseFloat(r.intersectionArea),
      percentageAffected:
        (parseFloat(r.intersectionArea) / parseFloat(r.parcelArea)) * 100,
    }));
  }

  async getCadastralParcelGeometry(parcelId: string) {
    const result = await prisma.$queryRawUnsafe<
      Array<{
        id: string;
        parcelReference: string;
        geometry: string | null;
        areaSqMeters: string;
      }>
    >(
      `SELECT id, "parcelReference", ST_AsGeoJSON(geometry) as geometry, "areaSqMeters"
       FROM "CadastralParcel"
       WHERE id = $1`,
      parcelId,
    );

    if (!result || result.length === 0) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    const parcel = result[0];
    return {
      id: parcel.id,
      parcelReference: parcel.parcelReference,
      geometry: parcel.geometry ? JSON.parse(parcel.geometry) : null,
      areaSqMeters: parseFloat(parcel.areaSqMeters),
    };
  }

  async setCadastralParcelGeometry(
    parcelId: string,
    geometry: GeoJSONPolygon | GeoJSONMultiPolygon,
    sourceSystem: string,
    sourceRecordId: string,
  ) {
    const parcel = await prisma.cadastralParcel.findUnique({
      where: { id: parcelId },
    });
    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    if (geometry.type === "Polygon") {
      const validation = validatePolygon(geometry);
      if (!validation.valid) {
        throw new BadRequestError(
          validation.error || "Invalid polygon geometry",
        );
      }
    }

    const wkt = geometryToWKT(geometry);

    const areaResult = await prisma.$queryRawUnsafe<Array<{ area: number }>>(
      `SELECT ST_Area(ST_GeomFromText($1, $2)::geography) as area`,
      wkt,
      SRID,
    );

    const calculatedArea = areaResult[0]?.area || 0;

    logger.info(`Setting geometry for cadastral parcel ${parcelId}`, {
      sourceSystem,
      calculatedArea,
    });

    await prisma.$executeRawUnsafe(
      `UPDATE "ParcelGeometrySource" SET "isCurrent" = false WHERE "cadastralParcelId" = $1 AND "isCurrent" = true`,
      parcelId,
    );

    await prisma.$executeRawUnsafe(
      `INSERT INTO "ParcelGeometrySource" (id, "cadastralParcelId", "sourceSystem", "sourceRecordId", geometry, srid, "retrievedAt", "isCurrent", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, ST_GeomFromText($4, $5), $6, NOW(), true, NOW())`,
      parcelId,
      sourceSystem,
      sourceRecordId,
      wkt,
      SRID,
      SRID,
    );

    await prisma.$executeRawUnsafe(
      `UPDATE "CadastralParcel" 
       SET geometry = ST_GeomFromText($1, $2), "areaSqMeters" = $3, "updatedAt" = NOW()
       WHERE id = $4`,
      wkt,
      SRID,
      calculatedArea,
      parcelId,
    );

    logger.info(`Geometry set successfully for cadastral parcel ${parcelId}`);

    return this.getCadastralParcelGeometry(parcelId);
  }
}

export default new GISService();
