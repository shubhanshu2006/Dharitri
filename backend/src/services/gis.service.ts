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
import { AcquisitionStatus } from "../../generated/prisma/enums.js";
import crypto from "crypto";

export class GISService {
  async setProjectBoundary(projectId: string, data: ProjectBoundaryDto) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        landRequirements: true
      }
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
    const areaHectares = areaSqMeters / 10000;

    // Area comparison with project land requirements
    let areaComparisonWarning = null;
    if (project.landRequirements && project.landRequirements.length > 0) {
      const totalRequiredSqMeters = project.landRequirements.reduce(
        (sum, req) => sum + Number(req.requiredAreaSqMeters),
        0
      );
      const requiredHectares = totalRequiredSqMeters / 10000;
      const difference = Math.abs(areaHectares - requiredHectares);
      const percentDiff = (difference / requiredHectares) * 100;

      if (percentDiff > 5) {
        areaComparisonWarning = {
          requiredHectares: requiredHectares.toFixed(2),
          boundaryHectares: areaHectares.toFixed(2),
          differenceHectares: difference.toFixed(2),
          percentageDiff: percentDiff.toFixed(1),
          severity: percentDiff > 15 ? 'high' : percentDiff > 10 ? 'medium' : 'low'
        };
        
        logger.warn(`Area mismatch for project ${projectId}:`, areaComparisonWarning);
      }
    }

    logger.info(`Setting project boundary for project ${projectId}`, {
      sourceType: data.sourceType,
      areaSqMeters,
      areaHectares: areaHectares.toFixed(2),
      areaComparison: areaComparisonWarning
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

    const boundaryData = await this.getProjectBoundary(projectId);
    
    // Add area comparison warning to response
    return {
      ...boundaryData,
      areaComparisonWarning
    };
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

  async findIntersectingParcelsGeoJSON(projectId: string) {
    const boundary = await this.getProjectBoundary(projectId);

    logger.info(`Finding intersecting parcels (GeoJSON) for project ${projectId}`);

    const results = await prisma.$queryRawUnsafe<
      Array<{
        id: string;
        parcelReference: string;
        surveyNumber: string;
        areaSqMeters: string;
        landCategory: string;
        acquisitionStatus: string | null;
        geometry: string;
      }>
    >(
      `SELECT 
         cp.id,
         cp."parcelReference",
         cp."surveyNumber",
         cp."areaSqMeters",
         cp."landCategory",
         ap.status as "acquisitionStatus",
         ST_AsGeoJSON(cp.geometry) as geometry
       FROM "CadastralParcel" cp
       CROSS JOIN "ProjectBoundary" pb
       LEFT JOIN LATERAL (
         SELECT status
         FROM "AcquisitionParcel"
         WHERE "projectId" = pb."projectId"
           AND "cadastralParcelId" = cp.id
         ORDER BY "updatedAt" DESC
         LIMIT 1
       ) ap ON true
       WHERE pb."projectId" = $1
         AND cp.geometry IS NOT NULL
         AND ST_Intersects(pb.geometry, cp.geometry)`,
      projectId,
    );

    // Convert to GeoJSON FeatureCollection
    const features = results.map((r) => ({
      type: "Feature" as const,
      id: r.id,
      properties: {
        id: r.id,
        parcelReference: r.parcelReference,
        surveyNumber: r.surveyNumber,
        areaSqMeters: parseFloat(r.areaSqMeters),
        landCategory: r.landCategory,
        acquisitionStatus: r.acquisitionStatus || "IDENTIFIED",
      },
      geometry: JSON.parse(r.geometry),
    }));

    return {
      type: "FeatureCollection" as const,
      features,
    };
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
      ...parcel,
      geometry: parcel.geometry ? JSON.parse(parcel.geometry) : null,
      areaSqMeters: parseFloat(parcel.areaSqMeters),
    };
  }

  async createBoundaryFromCoordinates(
    projectId: string,
    coordinates: Array<{ lat: number; lng: number }>
  ) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    // Convert coordinates to GeoJSON Polygon
    // Close the polygon by adding first point at end if not already closed
    const coords = coordinates.map(c => [c.lng, c.lat]);
    if (coords[0][0] !== coords[coords.length - 1][0] || 
        coords[0][1] !== coords[coords.length - 1][1]) {
      coords.push(coords[0]); // Close polygon
    }

    const geometry: GeoJSONPolygon = {
      type: "Polygon",
      coordinates: [coords]
    };

    // Validate polygon
    const validation = validatePolygon(geometry);
    if (!validation.valid) {
      throw new BadRequestError(
        validation.error || "Invalid polygon geometry",
      );
    }

    // Use existing setProjectBoundary method
    return this.setProjectBoundary(projectId, {
      geometry,
      sourceType: "MANUAL_COORDINATE_ENTRY",
      sourceSystem: undefined,
      sourceRecordId: undefined,
    });
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

  async getParcelWithOwnerInfo(parcelId: string) {
    const parcel = await prisma.cadastralParcel.findUnique({
      where: { id: parcelId },
      include: {
        state: true,
        district: true,
        acquisitionParcels: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
              }
            },
            acquisitionCase: true,
          }
        }
      }
    });

    if (!parcel) {
      throw new NotFoundError("Parcel not found");
    }

    // Get geometry as GeoJSON
    const geometryResult = await prisma.$queryRawUnsafe<Array<{ geojson: string }>>(
      `SELECT ST_AsGeoJSON(geometry) as geojson FROM "CadastralParcel" WHERE id = $1`,
      parcelId
    );

    const geometry = geometryResult[0]?.geojson 
      ? JSON.parse(geometryResult[0].geojson)
      : null;

    // Get project info from acquisition parcel if exists
    const acquisitionParcel = parcel.acquisitionParcels[0];
    const projectInfo = acquisitionParcel?.project || null;

    // If no acquisition parcel exists, try to find the project via boundary intersection
    let fallbackProjectInfo = null;
    if (!projectInfo) {
      const projectResult = await prisma.$queryRawUnsafe<Array<{ projectId: string; projectName: string }>>(
        `SELECT p.id as "projectId", p.name as "projectName"
         FROM "Project" p
         JOIN "ProjectBoundary" pb ON p.id = pb."projectId"
         WHERE ST_Intersects(pb.geometry, (SELECT geometry FROM "CadastralParcel" WHERE id = $1))
         LIMIT 1`,
        parcelId
      );

      if (projectResult && projectResult.length > 0) {
        fallbackProjectInfo = {
          id: projectResult[0].projectId,
          name: projectResult[0].projectName,
        };
      }
    }

    return {
      id: parcel.id,
      parcelReference: parcel.parcelReference,
      surveyNumber: parcel.surveyNumber,
      areaSqMeters: parcel.areaSqMeters,
      landCategory: parcel.landCategory,
      state: parcel.state,
      district: parcel.district,
      geometry,
      // Mock owner info (would come from land records API in production)
      ownerInfo: {
        name: this.getOwnerName(parcel.parcelReference),
        aadhaar: this.getOwnerAadhaar(parcel.parcelReference),
        mobile: this.getOwnerMobile(parcel.parcelReference),
      },
      acquisitionStatus: acquisitionParcel?.status || 'IDENTIFIED',
      projectInfo: projectInfo || fallbackProjectInfo,
    };
  }

  // Mock owner data based on parcel reference
  private getOwnerName(parcelRef: string): string {
    const owners: Record<string, string> = {
      'DL-VAR-123-4': 'Ramesh Kumar',
      'DL-VAR-124-1': 'Suresh Patil',
      'DL-VAR-125-2': 'Geeta Devi',
      'DL-VAR-126-3': 'Vijay Singh',
      'DL-VAR-127-1': 'Anita Sharma',
      'DL-VAR-128-4': 'Rajesh Verma',
      'DL-VAR-129-2': 'Prakash Yadav',
      'DL-VAR-130-5': 'Meena Kumari',
      'DL-VAR-131-3': 'Dinesh Mishra',
      'DL-VAR-132-1': 'Sunita Reddy',
    };
    return owners[parcelRef] || 'Unknown Owner';
  }

  private getOwnerAadhaar(parcelRef: string): string {
    const base = parcelRef.split('-').pop() || '0';
    const num = parseInt(base) || 1;
    return `${num}234-5678-90${10 + num}`;
  }

  private getOwnerMobile(parcelRef: string): string {
    const base = parcelRef.split('-').pop() || '0';
    const num = parseInt(base) || 1;
    return `98765432${10 + num}`;
  }

  async updateParcelStatus(parcelId: string, status: AcquisitionStatus) {
    logger.info(`Updating parcel status for ${parcelId} to ${status}`);

    // Find the acquisition parcel for this cadastral parcel
    const acquisitionParcel = await prisma.acquisitionParcel.findFirst({
      where: {
        cadastralParcelId: parcelId,
      },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found. Cannot update status.");
    }

    const updated = await prisma.acquisitionParcel.update({
      where: { id: acquisitionParcel.id },
      data: { status },
    });

    logger.info(`Parcel status updated successfully: ${parcelId} -> ${status}`);

    return {
      parcelId,
      acquisitionParcelId: updated.id,
      status: updated.status,
    };
  }
}

export default new GISService();
