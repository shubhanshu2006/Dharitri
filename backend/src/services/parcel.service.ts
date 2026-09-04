import cadastralRepository from "../repositories/cadastral.repository.js";
import landRecordService from "./land-record.service.js";
import gisService from "./gis.service.js";
import integrationSyncService from "./integration-sync.service.js";
import {
  CreateCadastralParcelDto,
  UpdateCadastralParcelDto,
  ParcelQueryParams,
  ParcelTimelineEvent,
} from "../types/parcel.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { prisma } from "../database/client.js";

export class ParcelService {
  async createParcel(data: CreateCadastralParcelDto, createdById: string) {
    const existing = await cadastralRepository.findByReference(
      data.parcelReference,
    );
    if (existing) {
      throw new BadRequestError("Parcel reference already exists");
    }

    if (data.ulpin) {
      const existingUlpin = await cadastralRepository.findByULPIN(data.ulpin);
      if (existingUlpin) {
        throw new BadRequestError("ULPIN already exists");
      }
    }

    logger.info("Creating cadastral parcel", {
      parcelReference: data.parcelReference,
      createdById,
    });

    const parcel = await cadastralRepository.createParcel({
      parcelReference: data.parcelReference,
      ulpin: data.ulpin,
      surveyNumber: data.surveyNumber,
      subDivisionNumber: data.subDivisionNumber,
      state: { connect: { id: data.stateId } },
      district: { connect: { id: data.districtId } },
      tehsil: data.tehsilId ? { connect: { id: data.tehsilId } } : undefined,
      village: data.villageId ? { connect: { id: data.villageId } } : undefined,
      areaSqMeters: data.areaSqMeters,
      landCategory: data.landCategory,
      sourceSystem: data.sourceSystem,
      sourceRecordId: data.sourceRecordId,
      sourceRetrievedAt: data.sourceSystem ? new Date() : undefined,
    });

    logger.info("Cadastral parcel created", { parcelId: parcel.id });
    return parcel;
  }

  async getParcels(params: ParcelQueryParams) {
    return cadastralRepository.findMany(params);
  }

  async getParcelById(id: string) {
    const parcel = await cadastralRepository.findById(id);
    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }
    return parcel;
  }

  async updateParcel(
    id: string,
    data: UpdateCadastralParcelDto,
    userId: string,
  ) {
    const parcel = await cadastralRepository.findById(id);
    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    if (data.ulpin && data.ulpin !== parcel.ulpin) {
      const existing = await cadastralRepository.findByULPIN(data.ulpin);
      if (existing && existing.id !== id) {
        throw new BadRequestError("ULPIN already exists");
      }
    }

    logger.info("Updating cadastral parcel", { parcelId: id, userId });

    const updated = await prisma.cadastralParcel.update({
      where: { id },
      data: {
        ulpin: data.ulpin,
        surveyNumber: data.surveyNumber,
        subDivisionNumber: data.subDivisionNumber,
        areaSqMeters: data.areaSqMeters,
        landCategory: data.landCategory,
      },
      include: {
        state: true,
        district: true,
        tehsil: true,
        village: true,
      },
    });

    logger.info("Cadastral parcel updated", { parcelId: id });
    return updated;
  }

  async getParcelTimeline(id: string): Promise<ParcelTimelineEvent[]> {
    const parcel = await cadastralRepository.findById(id);
    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    const timeline: ParcelTimelineEvent[] = [];

    timeline.push({
      id: `created-${parcel.id}`,
      eventType: "PARCEL_CREATED",
      eventDate: parcel.createdAt,
      description: "Cadastral parcel created",
    });

    const landRecords = await prisma.landRecordReference.findMany({
      where: { cadastralParcelId: id },
      orderBy: { retrievedAt: "asc" },
    });

    landRecords.forEach((record) => {
      timeline.push({
        id: record.id,
        eventType: "LAND_RECORD_SYNCED",
        eventDate: record.retrievedAt,
        description: `Land record synced from ${record.sourceSystem}`,
        metadata: {
          sourceSystem: record.sourceSystem,
          sourceRecordId: record.sourceRecordId,
          recordStatus: record.recordStatus,
        },
      });
    });

    const geometrySources = await prisma.parcelGeometrySource.findMany({
      where: { cadastralParcelId: id },
      orderBy: { retrievedAt: "asc" },
    });

    geometrySources.forEach((source) => {
      timeline.push({
        id: source.id,
        eventType: "GEOMETRY_UPDATED",
        eventDate: source.retrievedAt,
        description: `Geometry updated from ${source.sourceSystem}`,
        metadata: {
          sourceSystem: source.sourceSystem,
          sourceRecordId: source.sourceRecordId,
          isCurrent: source.isCurrent,
        },
      });
    });

    const acquisitionParcels = await prisma.acquisitionParcel.findMany({
      where: { cadastralParcelId: id },
      orderBy: { createdAt: "asc" },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            projectCode: true,
          },
        },
      },
    });

    acquisitionParcels.forEach((acq) => {
      timeline.push({
        id: acq.id,
        eventType: "ACQUISITION_INITIATED",
        eventDate: acq.createdAt,
        description: `Linked to acquisition project: ${acq.project.name}`,
        metadata: {
          projectId: acq.project.id,
          projectCode: acq.project.projectCode,
          projectName: acq.project.name,
          acquisitionReference: acq.acquisitionReference,
          status: acq.status,
        },
      });
    });

    timeline.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());

    return timeline;
  }

  async getLatestLandRecord(id: string) {
    const parcel = await cadastralRepository.findById(id);
    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    return landRecordService.getLatestLandRecord(id);
  }

  async syncParcelData(id: string) {
    const parcel = await cadastralRepository.findById(id);
    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    logger.info("Syncing parcel data", { parcelId: id });

    const result = await integrationSyncService.syncParcelData(id);

    logger.info("Parcel data sync completed", {
      parcelId: id,
      landRecordSynced: result.landRecordSynced,
      geometrySynced: result.geometrySynced,
    });

    return result;
  }

  async getParcelDocuments(id: string) {
    const parcel = await cadastralRepository.findById(id);
    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    return prisma.document.findMany({
      where: {
        entityType: "CADASTRAL_PARCEL",
        entityId: id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async getParcelAcquisitions(id: string) {
    const parcel = await cadastralRepository.findById(id);
    if (!parcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    return prisma.acquisitionParcel.findMany({
      where: { cadastralParcelId: id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            projectCode: true,
            projectType: true,
            status: true,
          },
        },
        acquisitionCase: {
          select: {
            id: true,
            caseNumber: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export default new ParcelService();
